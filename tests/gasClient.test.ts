// GAS 送信クライアントのテスト。fetch を注入し外部 GAS へ接続しない。実中断を検証。
import { test } from "node:test";
import assert from "node:assert/strict";
import { postToGas } from "../src/lib/gasClient";

const URL_DUMMY = "https://script.google.test/exec-DUMMY";

test("成功: success:true → duplicated を返し、signal と本文が渡る", async () => {
  let seenUrl = "";
  let seenSignal: AbortSignal | null | undefined;
  let seenBody = "";
  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    seenUrl = String(url);
    seenSignal = init?.signal;
    seenBody = String(init?.body ?? "");
    return new Response(JSON.stringify({ success: true, duplicated: false }), { status: 200 });
  }) as unknown as typeof fetch;

  const r = await postToGas(URL_DUMMY, { token: "S", email: "a@b.co" }, { timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { duplicated: false });
  assert.equal(seenUrl, URL_DUMMY);
  assert.ok(seenSignal instanceof AbortSignal, "signal は AbortSignal");
  assert.equal(JSON.parse(seenBody).token, "S");
});

test("重複: duplicated:true を返す", async () => {
  const fetchImpl = (async () => new Response(JSON.stringify({ success: true, duplicated: true }), { status: 200 })) as unknown as typeof fetch;
  assert.deepEqual(await postToGas(URL_DUMMY, {}, { timeoutMs: 1000, fetchImpl }), { duplicated: true });
});

test("非2xx は throw（URL/Secret を含めない・ステータスのみ）", async () => {
  const fetchImpl = (async () => new Response("body", { status: 500 })) as unknown as typeof fetch;
  await assert.rejects(
    () => postToGas(URL_DUMMY, { token: "S_SECRET" }, { timeoutMs: 1000, fetchImpl }),
    (e: unknown) => e instanceof Error && /500/.test(e.message) && !e.message.includes(URL_DUMMY) && !e.message.includes("S_SECRET"),
  );
});

test("success:false は throw（GAS 汎用コードのみ・PII/Secret 非含有）", async () => {
  const fetchImpl = (async () => new Response(JSON.stringify({ success: false, error: "unauthorized" }), { status: 200 })) as unknown as typeof fetch;
  await assert.rejects(
    () => postToGas(URL_DUMMY, { token: "S_SECRET", email: "leak@example.com" }, { timeoutMs: 1000, fetchImpl }),
    (e: unknown) => e instanceof Error && /unauthorized/.test(e.message) && !e.message.includes("leak@example.com") && !e.message.includes("S_SECRET"),
  );
});

test("タイムアウト: signal で実際に中断され期限内に reject", async () => {
  const fetchImpl = ((_url: string | URL | Request, init?: RequestInit) =>
    new Promise((_res, rej) => {
      init?.signal?.addEventListener("abort", () => rej(new DOMException("aborted", "AbortError")));
    })) as unknown as typeof fetch;
  const started = Date.now();
  await assert.rejects(
    () => postToGas(URL_DUMMY, {}, { timeoutMs: 30, fetchImpl }),
    (e: unknown) => e instanceof Error && e.name === "AbortError",
  );
  assert.ok(Date.now() - started < 500);
});
