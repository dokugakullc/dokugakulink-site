// contacts 保存クライアント（postContactStore / isContactStoreConfigured）のテスト。
// fetch を注入し実 GAS へ接続しない。register 側 gasClient.test.ts と同水準の安全検証。
import { test } from "node:test";
import assert from "node:assert/strict";
import { postContactStore, isContactStoreConfigured } from "../src/lib/contactStoreClient";

const URL_DUMMY = "https://script.google.test/exec-CONTACT-DUMMY";

// ── configured 判定（URL・Secret 両方あるときだけ true）──────────────
test("configured: URL+Secret 両方あり → true", () => {
  assert.equal(isContactStoreConfigured(URL_DUMMY, "S"), true);
});
test("configured: URL 未設定 → false（route はここで fetch しない）", () => {
  assert.equal(isContactStoreConfigured(undefined, "S"), false);
  assert.equal(isContactStoreConfigured("", "S"), false);
  assert.equal(isContactStoreConfigured(null, "S"), false);
});
test("configured: Secret 未設定 → false（route はここで fetch しない）", () => {
  assert.equal(isContactStoreConfigured(URL_DUMMY, undefined), false);
  assert.equal(isContactStoreConfigured(URL_DUMMY, ""), false);
  assert.equal(isContactStoreConfigured(URL_DUMMY, null), false);
});
test("configured: 両方なし → false", () => {
  assert.equal(isContactStoreConfigured(undefined, undefined), false);
});

// configured=false のとき route が fetch しないことを、ガードを再現して固定
test("未 configured なら外部 POST しない（fetch 0）", async () => {
  let calls = 0;
  const fetchImpl = (async () => {
    calls++;
    return new Response("{}", { status: 200 });
  }) as unknown as typeof fetch;
  for (const [u, s] of [
    [undefined, "S"],
    [URL_DUMMY, undefined],
    ["", ""],
  ] as [string | undefined, string | undefined][]) {
    if (isContactStoreConfigured(u, s)) {
      await postContactStore(u as string, { token: s }, { timeoutMs: 1000, fetchImpl });
    }
  }
  assert.equal(calls, 0);
});

// ── 正常系 ────────────────────────────────────────────────────────
test("成功: success:true → { stored, duplicate } を返し、signal と本文が渡る", async () => {
  let seenUrl = "";
  let seenSignal: AbortSignal | null | undefined;
  let seenBody = "";
  let seenCT = "";
  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    seenUrl = String(url);
    seenSignal = init?.signal;
    seenBody = String(init?.body ?? "");
    seenCT = String((init?.headers as Record<string, string> | undefined)?.["Content-Type"] ?? "");
    return new Response(JSON.stringify({ success: true, stored: true, duplicate: false }), { status: 200 });
  }) as unknown as typeof fetch;

  const r = await postContactStore(URL_DUMMY, { token: "S", email: "a@b.co" }, { timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { stored: true, duplicate: false });
  assert.equal(seenUrl, URL_DUMMY);
  assert.ok(seenSignal instanceof AbortSignal, "signal は AbortSignal");
  assert.equal(seenCT, "application/json");
  assert.equal(JSON.parse(seenBody).token, "S");
});

test("duplicate/idempotent: stored:false・duplicate:true をそのまま返す", async () => {
  const fetchImpl = (async () =>
    new Response(JSON.stringify({ success: true, stored: false, duplicate: true }), { status: 200 })) as unknown as typeof fetch;
  assert.deepEqual(await postContactStore(URL_DUMMY, {}, { timeoutMs: 1000, fetchImpl }), {
    stored: false,
    duplicate: true,
  });
});

// ── 異常系（漏えい防止） ───────────────────────────────────────────
test("非2xx は throw（URL/Secret を含めない・ステータス番号のみ）", async () => {
  const fetchImpl = (async () => new Response("body", { status: 500 })) as unknown as typeof fetch;
  await assert.rejects(
    () => postContactStore(URL_DUMMY, { token: "S_SECRET" }, { timeoutMs: 1000, fetchImpl }),
    (e: unknown) =>
      e instanceof Error && /500/.test(e.message) && !e.message.includes(URL_DUMMY) && !e.message.includes("S_SECRET"),
  );
});

test("success:false は固定メッセージで throw（GAS 応答内容を一切含めない）", async () => {
  const fetchImpl = (async () =>
    new Response(JSON.stringify({ success: false, error: "unauthorized" }), { status: 200 })) as unknown as typeof fetch;
  await assert.rejects(
    () => postContactStore(URL_DUMMY, {}, { timeoutMs: 1000, fetchImpl }),
    (e: unknown) => e instanceof Error && e.message === "contact store failed" && !e.message.includes("unauthorized"),
  );
});

test("JSON 解析失敗は固定メッセージで throw（応答本文を含めない）", async () => {
  const fetchImpl = (async () => new Response("<html>boom LEAK_BODY</html>", { status: 200 })) as unknown as typeof fetch;
  await assert.rejects(
    () => postContactStore(URL_DUMMY, {}, { timeoutMs: 1000, fetchImpl }),
    (e: unknown) =>
      e instanceof Error && e.message === "contact store invalid response" && !e.message.includes("LEAK_BODY"),
  );
});

test("悪意ある GAS 応答（Secret/メール/URL/内部文字列）でも throw 文へ一切出ない", async () => {
  const malicious = "SECRET_DUMMY_LEAK / leak@example.com / https://script.google.test/exec-LEAK / STACKTRACE_INTERNAL";
  const fetchImpl = (async () =>
    new Response(JSON.stringify({ success: false, stored: true, error: malicious }), { status: 200 })) as unknown as typeof fetch;
  await assert.rejects(
    () => postContactStore(URL_DUMMY, { token: "SECRET_DUMMY_LEAK" }, { timeoutMs: 1000, fetchImpl }),
    (e: unknown) =>
      e instanceof Error &&
      e.message === "contact store failed" &&
      !e.message.includes("SECRET_DUMMY_LEAK") &&
      !e.message.includes("leak@example.com") &&
      !e.message.includes("script.google.test") &&
      !e.message.includes("STACKTRACE_INTERNAL"),
  );
});

test("タイムアウト: signal で実際に中断され期限内に reject", async () => {
  const fetchImpl = ((_url: string | URL | Request, init?: RequestInit) =>
    new Promise((_res, rej) => {
      init?.signal?.addEventListener("abort", () => rej(new DOMException("aborted", "AbortError")));
    })) as unknown as typeof fetch;
  const started = Date.now();
  await assert.rejects(
    () => postContactStore(URL_DUMMY, {}, { timeoutMs: 30, fetchImpl }),
    (e: unknown) => e instanceof Error && e.name === "AbortError",
  );
  assert.ok(Date.now() - started < 500);
});
