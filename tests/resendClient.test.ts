// Resend 送信クライアントのテスト。fetch を注入し、外部へは一切接続しない。
// 特に「AbortController による実中断」を検証する。
import { test } from "node:test";
import assert from "node:assert/strict";
import { sendResendEmail, type ResendPayload } from "../src/lib/resendClient";

const payload: ResendPayload = {
  from: "ウカレル <support@dokugakulink.com>",
  to: ["taro@example.com"],
  reply_to: "taro@example.com",
  subject: "件名",
  html: "<p>本文</p>",
  text: "本文",
};

test("成功: 2xx で解決し、UA・認証・Content-Type・冪等キー・signal・エンドポイントが正しい", async () => {
  let seenUrl = "";
  let seenHeaders: Record<string, string> = {};
  let seenSignal: AbortSignal | null | undefined;
  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    seenUrl = String(url);
    seenHeaders = (init?.headers ?? {}) as Record<string, string>;
    seenSignal = init?.signal;
    return new Response(JSON.stringify({ id: "email_1" }), { status: 200 });
  }) as unknown as typeof fetch;

  await sendResendEmail(payload, { apiKey: "re_key", idempotencyKey: "contact:sid:admin", timeoutMs: 1000, fetchImpl });
  assert.equal(seenUrl, "https://api.resend.com/emails");
  // User-Agent（固定・非機密）
  assert.equal(seenHeaders["User-Agent"], "dokugakulink-site/0.1.0");
  // 既存ヘッダーの維持
  assert.equal(seenHeaders["Authorization"], "Bearer re_key");
  assert.equal(seenHeaders["Content-Type"], "application/json");
  assert.equal(seenHeaders["Idempotency-Key"], "contact:sid:admin");
  // AbortSignal が fetch に渡っている
  assert.ok(seenSignal instanceof AbortSignal, "signal は AbortSignal であるべき");
});

test("Secret（APIキー）はエラーメッセージへ出さない", async () => {
  const fetchImpl = (async () => new Response("body", { status: 500 })) as unknown as typeof fetch;
  await assert.rejects(
    () => sendResendEmail(payload, { apiKey: "re_supersecret_value", idempotencyKey: "k", timeoutMs: 1000, fetchImpl }),
    (e: unknown) => e instanceof Error && !/re_supersecret_value/.test(e.message),
  );
});

test("失敗: 非2xx は throw（本文＝PII を読まない・ステータスのみ）", async () => {
  const fetchImpl = (async () => new Response("secret body", { status: 422 })) as unknown as typeof fetch;
  await assert.rejects(
    () => sendResendEmail(payload, { apiKey: "re_key", idempotencyKey: "k", timeoutMs: 1000, fetchImpl }),
    (e: unknown) => e instanceof Error && /422/.test(e.message) && !/secret body/.test(e.message),
  );
});

test("タイムアウト: signal で実際に中断され、期限内に reject する", async () => {
  // signal を尊重して abort 時に reject する（＝実中断可能な fetch のふるまいを模す）
  const fetchImpl = ((url: string | URL | Request, init?: RequestInit) =>
    new Promise((_resolve, reject) => {
      const signal = init?.signal;
      if (signal) signal.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
    })) as unknown as typeof fetch;

  const started = Date.now();
  await assert.rejects(
    () => sendResendEmail(payload, { apiKey: "re_key", idempotencyKey: "k", timeoutMs: 30, fetchImpl }),
    (e: unknown) => e instanceof Error && e.name === "AbortError",
  );
  // 30ms 前後で中断されること（バックグラウンド完了を待たない）
  assert.ok(Date.now() - started < 500, "タイムアウトで速やかに中断されるべき");
});
