// Turnstile サーバー側検証（resolveTurnstileConfig / verifyTurnstile）のテスト。
// fetch を注入し実 Cloudflare へ接続しない。失敗は固定カテゴリ（reason）へ分類され throw しない。
// Secret / token / 応答本文 / hostname 実値 / action 実値 / error-codes を結果・例外へ出さないことを固定。
// 公式ダミー値のみ使用（外部送信はしない）。
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveTurnstileConfig,
  verifyTurnstile,
  SITEVERIFY_URL,
  TURNSTILE_TOKEN_MAX,
  TURNSTILE_USER_AGENT,
} from "../src/lib/turnstile";

// 公式ダミー値（外部へは送らない）
const SECRET_PASS_DUMMY = "1x0000000000000000000000000000000AA";
const TOKEN_DUMMY = "XXXX.DUMMY.TOKEN.XXXX";

function okResponse(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200 });
}
// body（string | URLSearchParams | 他）を安全に文字列化して URLSearchParams で読む。
function bodyParams(init?: RequestInit): URLSearchParams {
  return new URLSearchParams(String(init?.body ?? ""));
}

// ── 設定状態（明示フラグ + SiteKey + Secret の 3 引数契約） ────────
test("フラグ未設定/空/false/曖昧値 → disabled（鍵が両方あっても無効）", () => {
  for (const flag of [undefined, null, "", "false", "FALSE", "TRUE", "True", "1", "yes", "on", " true"]) {
    assert.equal(resolveTurnstileConfig(flag, "site", "secret"), "disabled", `flag=${JSON.stringify(flag)}`);
  }
});
test('フラグ"true" + SiteKey・Secret 両方あり → enabled', () => {
  assert.equal(resolveTurnstileConfig("true", "site", "secret"), "enabled");
});
test('フラグ"true" + SiteKey 欠け → misconfigured', () => {
  assert.equal(resolveTurnstileConfig("true", undefined, "secret"), "misconfigured");
  assert.equal(resolveTurnstileConfig("true", "", "secret"), "misconfigured");
});
test('フラグ"true" + Secret 欠け → misconfigured', () => {
  assert.equal(resolveTurnstileConfig("true", "site", undefined), "misconfigured");
  assert.equal(resolveTurnstileConfig("true", "site", ""), "misconfigured");
});
test('フラグ"true" + 両方欠け → misconfigured', () => {
  assert.equal(resolveTurnstileConfig("true", undefined, undefined), "misconfigured");
  assert.equal(resolveTurnstileConfig("true", "", ""), "misconfigured");
});

// ── リクエスト形式 ───────────────────────────────────────────────
test("正常な contact token → success（URL/POST/CT/UA・secret/response が body に載る・remoteip 既定なし）", async () => {
  let seenUrl = "";
  let seenMethod = "";
  let seenCT = "";
  let seenUA = "";
  let seenParams = new URLSearchParams();
  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    seenUrl = String(url);
    seenMethod = String(init?.method ?? "");
    const h = (init?.headers ?? {}) as Record<string, string>;
    seenCT = h["Content-Type"] ?? "";
    seenUA = h["User-Agent"] ?? "";
    seenParams = bodyParams(init);
    return okResponse({ success: true, action: "contact", hostname: "www.dokugakulink.com" });
  }) as unknown as typeof fetch;
  const r = await verifyTurnstile(SECRET_PASS_DUMMY, TOKEN_DUMMY, { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { success: true });
  assert.equal(seenUrl, SITEVERIFY_URL);
  assert.equal(seenMethod, "POST");
  assert.equal(seenCT, "application/x-www-form-urlencoded");
  assert.equal(seenUA, "dokugakulink-site/0.1.0");
  assert.equal(seenUA, TURNSTILE_USER_AGENT);
  assert.equal(seenParams.get("secret"), SECRET_PASS_DUMMY);
  assert.equal(seenParams.get("response"), TOKEN_DUMMY);
  assert.equal(seenParams.get("remoteip"), null, "remoteip は既定で送らない");
  // secret / token は URL クエリに含めない。
  assert.equal(seenUrl.includes(SECRET_PASS_DUMMY), false);
  assert.equal(seenUrl.includes(TOKEN_DUMMY), false);
});

test("AbortSignal が fetch へ渡る", async () => {
  let seenSignal: AbortSignal | null | undefined;
  const fetchImpl = (async (_u: string | URL | Request, init?: RequestInit) => {
    seenSignal = init?.signal;
    return okResponse({ success: true, action: "register", hostname: "dokugakulink.com" });
  }) as unknown as typeof fetch;
  await verifyTurnstile("s", "t", { action: "register", timeoutMs: 1000, fetchImpl });
  assert.ok(seenSignal instanceof AbortSignal);
});

test("正常な register token → success（action=register 一致・apex ドメイン許可）", async () => {
  const fetchImpl = (async () =>
    okResponse({ success: true, action: "register", hostname: "dokugakulink.com" })) as unknown as typeof fetch;
  assert.deepEqual(await verifyTurnstile("s", "t", { action: "register", timeoutMs: 1000, fetchImpl }), {
    success: true,
  });
});

test("remoteip / idempotency_key はオプトインで送信できる", async () => {
  let seenParams = new URLSearchParams();
  const fetchImpl = (async (_u: string | URL | Request, init?: RequestInit) => {
    seenParams = bodyParams(init);
    return okResponse({ success: true, action: "contact", hostname: "www.dokugakulink.com" });
  }) as unknown as typeof fetch;
  await verifyTurnstile("s", "t", {
    action: "contact",
    timeoutMs: 1000,
    fetchImpl,
    remoteip: "203.0.113.1",
    idempotencyKey: "uuid-1",
  });
  assert.equal(seenParams.get("remoteip"), "203.0.113.1");
  assert.equal(seenParams.get("idempotency_key"), "uuid-1");
});

// ── 失敗分類（throw せず reason を返す） ──────────────────────────
test("token 空 → missing_token（外部未呼び出し）", async () => {
  let calls = 0;
  const fetchImpl = (async () => {
    calls++;
    return okResponse({ success: true, action: "contact", hostname: "www.dokugakulink.com" });
  }) as unknown as typeof fetch;
  assert.deepEqual(await verifyTurnstile("s", "", { action: "contact", timeoutMs: 1000, fetchImpl }), {
    success: false,
    reason: "missing_token",
  });
  assert.equal(calls, 0);
});

test("token 過長 → missing_token（外部未呼び出し）", async () => {
  let calls = 0;
  const fetchImpl = (async () => {
    calls++;
    return okResponse({ success: true });
  }) as unknown as typeof fetch;
  const tooLong = "x".repeat(TURNSTILE_TOKEN_MAX + 1);
  assert.deepEqual(await verifyTurnstile("s", tooLong, { action: "contact", timeoutMs: 1000, fetchImpl }), {
    success: false,
    reason: "missing_token",
  });
  assert.equal(calls, 0);
});

test("fetch throw（timeout 以外）→ siteverify_network_error（message/cause/stack を出さない）", async () => {
  const fetchImpl = (async () => {
    throw new TypeError("getaddrinfo ENOTFOUND challenges.cloudflare.com SECRET_LEAK");
  }) as unknown as typeof fetch;
  const r = await verifyTurnstile("SECRET_LEAK", "T_TOKEN", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { success: false, reason: "siteverify_network_error" });
  assert.equal(JSON.stringify(r).includes("SECRET_LEAK"), false);
  assert.equal(JSON.stringify(r).includes("ENOTFOUND"), false);
});

test("timeout（AbortError）→ siteverify_timeout・期限内に返る", async () => {
  const fetchImpl = ((_u: string | URL | Request, init?: RequestInit) =>
    new Promise<Response>((_res, rej) => {
      init?.signal?.addEventListener("abort", () => rej(new DOMException("aborted", "AbortError")));
    })) as unknown as typeof fetch;
  const started = Date.now();
  const r = await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 30, fetchImpl });
  assert.deepEqual(r, { success: false, reason: "siteverify_timeout" });
  assert.ok(Date.now() - started < 500);
});

test("非2xx → siteverify_http_error＋安全な httpStatus（本文/Secret/token を含めない）", async () => {
  const fetchImpl = (async () => new Response("body LEAK", { status: 500 })) as unknown as typeof fetch;
  const r = await verifyTurnstile("S_SECRET", "T_TOKEN", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { success: false, reason: "siteverify_http_error", httpStatus: 500 });
  const flat = JSON.stringify(r);
  assert.equal(flat.includes("S_SECRET"), false);
  assert.equal(flat.includes("T_TOKEN"), false);
  assert.equal(flat.includes("LEAK"), false);
});

test("非2xx: 403 でも httpStatus は 100-599 の整数のみ保持", async () => {
  const fetchImpl = (async () => new Response("", { status: 403 })) as unknown as typeof fetch;
  assert.deepEqual(await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl }), {
    success: false,
    reason: "siteverify_http_error",
    httpStatus: 403,
  });
});

test("JSON 解析失敗 → siteverify_invalid_response（応答本文を含めない）", async () => {
  const fetchImpl = (async () => new Response("<html>LEAK_BODY</html>", { status: 200 })) as unknown as typeof fetch;
  const r = await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { success: false, reason: "siteverify_invalid_response" });
  assert.equal(JSON.stringify(r).includes("LEAK_BODY"), false);
});

test("応答が null/配列/success 非boolean → siteverify_invalid_response", async () => {
  for (const bad of [null, [1, 2], { success: "yes" }, { action: "contact" }]) {
    const fetchImpl = (async () => okResponse(bad)) as unknown as typeof fetch;
    assert.deepEqual(await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl }), {
      success: false,
      reason: "siteverify_invalid_response",
    });
  }
});

test("success:false → siteverify_rejected（error-codes 実値を含めない）", async () => {
  const fetchImpl = (async () =>
    okResponse({ success: false, "error-codes": ["invalid-input-secret"] })) as unknown as typeof fetch;
  const r = await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { success: false, reason: "siteverify_rejected" });
  assert.equal(JSON.stringify(r).includes("invalid-input-secret"), false);
});

test("action 不一致 → action_mismatch（期待値・実値を含めない）", async () => {
  const fetchImpl = (async () =>
    okResponse({ success: true, action: "register", hostname: "www.dokugakulink.com" })) as unknown as typeof fetch;
  const r = await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { success: false, reason: "action_mismatch" });
  assert.equal(JSON.stringify(r).includes("register"), false);
});

test("hostname 不一致/欠落 → hostname_mismatch（hostname 実値を含めない）", async () => {
  const evil = (async () =>
    okResponse({ success: true, action: "contact", hostname: "evil.example.com" })) as unknown as typeof fetch;
  const r1 = await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl: evil });
  assert.deepEqual(r1, { success: false, reason: "hostname_mismatch" });
  assert.equal(JSON.stringify(r1).includes("evil.example.com"), false);
  // hostname 欠落
  const missing = (async () => okResponse({ success: true, action: "contact" })) as unknown as typeof fetch;
  assert.deepEqual(await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl: missing }), {
    success: false,
    reason: "hostname_mismatch",
  });
});

test("悪意あるダミー値（Secret/メール/URL/内部文字列）でも結果へ一切出ない", async () => {
  const leak = "SECRET_LEAK / a@b.co / https://challenges.cloudflare.com/x / STACK_INTERNAL";
  // 非2xx 本文にリーク文字列。本文は読まないので結果に出ない。
  const fetchImpl = (async () => new Response(leak, { status: 502 })) as unknown as typeof fetch;
  const r = await verifyTurnstile("SECRET_LEAK", "T", { action: "contact", timeoutMs: 1000, fetchImpl });
  const flat = JSON.stringify(r);
  assert.equal(r.success, false);
  assert.equal(flat.includes("SECRET_LEAK"), false);
  assert.equal(flat.includes("a@b.co"), false);
  assert.equal(flat.includes("STACK_INTERNAL"), false);
  assert.equal(flat.includes("challenges.cloudflare.com"), false);
});
