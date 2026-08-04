// Turnstile サーバー側検証（resolveTurnstileConfig / verifyTurnstile）のテスト。
// fetch を注入し実 Cloudflare へ接続しない。失敗は固定カテゴリ（reason）へ分類され throw しない。
// Secret / token / 応答本文 / hostname 実値 / action 実値 / 未知 error-code を結果・例外へ出さないことを固定。
// 送信は公式が明示対応する JSON 形式（{ secret, response }）。公式ダミー値のみ使用（外部送信はしない）。
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveTurnstileConfig,
  verifyTurnstile,
  SITEVERIFY_URL,
  TURNSTILE_TOKEN_MAX,
  TURNSTILE_USER_AGENT,
  TURNSTILE_ERROR_CODES_ALLOWLIST,
} from "../src/lib/turnstile";

// 公式ダミー値（外部へは送らない）
const SECRET_PASS_DUMMY = "1x0000000000000000000000000000000AA";
const TOKEN_DUMMY = "XXXX.DUMMY.TOKEN.XXXX";

function okResponse(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200 });
}
function errResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status });
}
// JSON body（string）を安全にパースして読む。
function jsonBody(init?: RequestInit): Record<string, unknown> {
  try {
    const parsed = JSON.parse(String(init?.body ?? "{}"));
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
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
// [Phase6-8] trim 後に空になる Secret / Site Key は misconfigured（前後空白のみは未設定扱い）。
test('フラグ"true" + 前後空白のみの Secret（trim 後空）→ misconfigured', () => {
  assert.equal(resolveTurnstileConfig("true", "site", "   "), "misconfigured");
  assert.equal(resolveTurnstileConfig("true", "site", "\n\t "), "misconfigured");
});
test('フラグ"true" + 前後空白のみの Site Key（trim 後空）→ misconfigured', () => {
  assert.equal(resolveTurnstileConfig("true", "   ", "secret"), "misconfigured");
});

// ── リクエスト形式（JSON） ───────────────────────────────────────
// [Phase6-1,2,3] JSON で secret/response を送る・Content-Type: application/json・User-Agent 維持。
test("正常な contact token → success（URL/POST/JSON body・secret/response・CT=application/json・UA）", async () => {
  let seenUrl = "";
  let seenMethod = "";
  let seenCT = "";
  let seenUA = "";
  let seenBody: Record<string, unknown> = {};
  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    seenUrl = String(url);
    seenMethod = String(init?.method ?? "");
    const h = (init?.headers ?? {}) as Record<string, string>;
    seenCT = h["Content-Type"] ?? "";
    seenUA = h["User-Agent"] ?? "";
    seenBody = jsonBody(init);
    return okResponse({ success: true, action: "contact", hostname: "www.dokugakulink.com" });
  }) as unknown as typeof fetch;
  const r = await verifyTurnstile(SECRET_PASS_DUMMY, TOKEN_DUMMY, { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { success: true });
  assert.equal(seenUrl, SITEVERIFY_URL);
  assert.equal(seenMethod, "POST");
  assert.equal(seenCT, "application/json");
  assert.equal(seenUA, "dokugakulink-site/0.1.0");
  assert.equal(seenUA, TURNSTILE_USER_AGENT);
  assert.equal(seenBody.secret, SECRET_PASS_DUMMY);
  assert.equal(seenBody.response, TOKEN_DUMMY);
  // remoteip / idempotency_key は送らない（最小送信）。
  assert.equal("remoteip" in seenBody, false);
  assert.equal("idempotency_key" in seenBody, false);
  // secret / token は URL クエリに含めない。
  assert.equal(seenUrl.includes(SECRET_PASS_DUMMY), false);
  assert.equal(seenUrl.includes(TOKEN_DUMMY), false);
});

// [Phase6-4] AbortSignal が fetch へ渡る。
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

// [Phase6-7] Secret の前後改行/空白は送信値から除かれる（env コピー時の混入を吸収）。
test("Secret の前後改行/空白は送信値から除かれる（trim 後を送る・token は加工しない）", async () => {
  let seenBody: Record<string, unknown> = {};
  const fetchImpl = (async (_u: string | URL | Request, init?: RequestInit) => {
    seenBody = jsonBody(init);
    return okResponse({ success: true, action: "contact", hostname: "www.dokugakulink.com" });
  }) as unknown as typeof fetch;
  await verifyTurnstile(`\n\t  ${SECRET_PASS_DUMMY}  \r\n`, TOKEN_DUMMY, {
    action: "contact",
    timeoutMs: 1000,
    fetchImpl,
  });
  assert.equal(seenBody.secret, SECRET_PASS_DUMMY);
  // token は trim/加工しない（原値のまま）。
  assert.equal(seenBody.response, TOKEN_DUMMY);
});

// ── token 長さガード ─────────────────────────────────────────────
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

// [Phase6-5] token 2048 文字は許容し Cloudflare を呼ぶ。
test("token 2048 文字（上限ちょうど）→ 許容し Siteverify を呼ぶ", async () => {
  let calls = 0;
  const fetchImpl = (async () => {
    calls++;
    return okResponse({ success: true, action: "contact", hostname: "www.dokugakulink.com" });
  }) as unknown as typeof fetch;
  const atMax = "x".repeat(TURNSTILE_TOKEN_MAX);
  assert.deepEqual(await verifyTurnstile("s", atMax, { action: "contact", timeoutMs: 1000, fetchImpl }), {
    success: true,
  });
  assert.equal(calls, 1);
});

// [Phase6-6] token 2049 文字は Cloudflare 未呼び出しで拒否。
test("token 2049 文字（上限超過）→ missing_token（外部未呼び出し）", async () => {
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

// ── ネットワーク/timeout ────────────────────────────────────────
test("fetch throw（timeout 以外）→ siteverify_network_error（message/cause/stack を出さない）", async () => {
  const fetchImpl = (async () => {
    throw new TypeError("getaddrinfo ENOTFOUND challenges.cloudflare.com SECRET_LEAK");
  }) as unknown as typeof fetch;
  const r = await verifyTurnstile("SECRET_LEAK", "T_TOKEN", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { success: false, reason: "siteverify_network_error" });
  assert.equal(JSON.stringify(r).includes("SECRET_LEAK"), false);
  assert.equal(JSON.stringify(r).includes("ENOTFOUND"), false);
});

// [Phase6-4] 10 秒 timeout（AbortError）で期限内に返る。
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

// ── 非2xx（HTTP error）と安全な error-code 抽出 ─────────────────
test("非2xx（本文非JSON）→ siteverify_http_error＋安全な httpStatus（本文/Secret/token を含めない）", async () => {
  const fetchImpl = (async () => new Response("body LEAK", { status: 500 })) as unknown as typeof fetch;
  const r = await verifyTurnstile("S_SECRET", "T_TOKEN", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { success: false, reason: "siteverify_http_error", httpStatus: 500 });
  const flat = JSON.stringify(r);
  assert.equal(flat.includes("S_SECRET"), false);
  assert.equal(flat.includes("T_TOKEN"), false);
  assert.equal(flat.includes("LEAK"), false);
});

test("非2xx: 403 空本文でも httpStatus は 100-599 の整数のみ保持（errorCodes なし）", async () => {
  const fetchImpl = (async () => new Response("", { status: 403 })) as unknown as typeof fetch;
  assert.deepEqual(await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl }), {
    success: false,
    reason: "siteverify_http_error",
    httpStatus: 403,
  });
});

// [Phase6-9] 非2xx + invalid-input-secret を安全に抽出。
test("非2xx + invalid-input-secret → 安全抽出（reason/httpStatus 維持）", async () => {
  const fetchImpl = (async () =>
    errResponse(400, { success: false, "error-codes": ["invalid-input-secret"] })) as unknown as typeof fetch;
  const r = await verifyTurnstile("S_SECRET", "T_TOKEN", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, {
    success: false,
    reason: "siteverify_http_error",
    httpStatus: 400,
    errorCodes: ["invalid-input-secret"],
  });
});

// [Phase6-10] 非2xx + bad-request を安全に抽出。
test("非2xx + bad-request → 安全抽出", async () => {
  const fetchImpl = (async () =>
    errResponse(400, { success: false, "error-codes": ["bad-request"] })) as unknown as typeof fetch;
  assert.deepEqual(await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl }), {
    success: false,
    reason: "siteverify_http_error",
    httpStatus: 400,
    errorCodes: ["bad-request"],
  });
});

// [Phase6-11] 複数の許可コードを件数上限内で抽出（重複除去）。
test("非2xx + 複数の許可コード → 上限内で抽出・重複除去", async () => {
  const fetchImpl = (async () =>
    errResponse(400, {
      success: false,
      "error-codes": ["bad-request", "invalid-input-response", "invalid-input-response", "timeout-or-duplicate"],
    })) as unknown as typeof fetch;
  const r = await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.equal(r.success, false);
  assert.deepEqual((r as { errorCodes?: string[] }).errorCodes, [
    "bad-request",
    "invalid-input-response",
    "timeout-or-duplicate",
  ]);
});

// [Phase6-12] 未知コードは捨てる（許可リスト外）。
test("非2xx + 未知コード → 捨てる（許可コードだけ残す）", async () => {
  const fetchImpl = (async () =>
    errResponse(400, {
      success: false,
      "error-codes": ["some-unknown-code", "invalid-input-secret", "totally-made-up"],
    })) as unknown as typeof fetch;
  const r = await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual((r as { errorCodes?: string[] }).errorCodes, ["invalid-input-secret"]);
  const flat = JSON.stringify(r);
  assert.equal(flat.includes("some-unknown-code"), false);
  assert.equal(flat.includes("totally-made-up"), false);
});

// [Phase6-13] 非文字列コードは捨てる。
test("非2xx + 非文字列コード（数値/オブジェクト/null）→ 捨てる", async () => {
  const fetchImpl = (async () =>
    errResponse(400, {
      success: false,
      "error-codes": [123, { x: 1 }, null, ["nested"], "bad-request"],
    })) as unknown as typeof fetch;
  const r = await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual((r as { errorCodes?: string[] }).errorCodes, ["bad-request"]);
});

// [Phase6-14] 悪意ある長大コードは捨てる。
test("非2xx + 悪意ある長大コード → 捨てる（結果に混入しない）", async () => {
  const huge = "a".repeat(5000);
  const fetchImpl = (async () =>
    errResponse(400, { success: false, "error-codes": [huge, "invalid-input-secret"] })) as unknown as typeof fetch;
  const r = await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual((r as { errorCodes?: string[] }).errorCodes, ["invalid-input-secret"]);
  assert.equal(JSON.stringify(r).includes(huge), false);
});

// [Phase6-15] 非2xx のレスポンス本文（許可外フィールド）は結果へ含めない。
test("非2xx + 本文の messages/hostname 等は結果へ出さない（error-codes のみ抽出）", async () => {
  const fetchImpl = (async () =>
    errResponse(400, {
      success: false,
      "error-codes": ["bad-request"],
      messages: ["SECRET_LEAK internal detail"],
      hostname: "evil.example.com",
    })) as unknown as typeof fetch;
  const r = await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, {
    success: false,
    reason: "siteverify_http_error",
    httpStatus: 400,
    errorCodes: ["bad-request"],
  });
  const flat = JSON.stringify(r);
  assert.equal(flat.includes("SECRET_LEAK"), false);
  assert.equal(flat.includes("evil.example.com"), false);
});

// 許可リストの内容が仕様どおり（過不足なし）。
test("error-code 許可リストは公式の 7 コードのみ", () => {
  assert.deepEqual([...TURNSTILE_ERROR_CODES_ALLOWLIST].sort(), [
    "bad-request",
    "internal-error",
    "invalid-input-response",
    "invalid-input-secret",
    "missing-input-response",
    "missing-input-secret",
    "timeout-or-duplicate",
  ]);
});

// ── 2xx JSON 異常/拒否/action/hostname ─────────────────────────
test("JSON 解析失敗（2xx・非JSON本文）→ siteverify_invalid_response（応答本文を含めない）", async () => {
  const fetchImpl = (async () => new Response("<html>LEAK_BODY</html>", { status: 200 })) as unknown as typeof fetch;
  const r = await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { success: false, reason: "siteverify_invalid_response" });
  assert.equal(JSON.stringify(r).includes("LEAK_BODY"), false);
});

// [Phase6-17] 2xx + success:false の既存分類維持。
test("2xx success:false → siteverify_rejected（error-codes 実値を含めない）", async () => {
  const fetchImpl = (async () =>
    okResponse({ success: false, "error-codes": ["invalid-input-secret"] })) as unknown as typeof fetch;
  const r = await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { success: false, reason: "siteverify_rejected" });
  assert.equal(JSON.stringify(r).includes("invalid-input-secret"), false);
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

// [Phase6-18] action 不一致維持。
test("action 不一致 → action_mismatch（期待値・実値を含めない）", async () => {
  const fetchImpl = (async () =>
    okResponse({ success: true, action: "register", hostname: "www.dokugakulink.com" })) as unknown as typeof fetch;
  const r = await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { success: false, reason: "action_mismatch" });
  assert.equal(JSON.stringify(r).includes("register"), false);
});

// [Phase6-19] hostname 不一致維持。
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

// [Phase6-16] 悪意あるダミー値（Secret/メール/URL/内部文字列）でも結果へ一切出ない。
test("悪意あるダミー値（Secret/メール/URL/内部文字列）でも結果へ一切出ない", async () => {
  const leak = "SECRET_LEAK / a@b.co / https://challenges.cloudflare.com/x / STACK_INTERNAL";
  // 非2xx 本文にリーク文字列（非JSON）。本文は結果へ出さない。
  const fetchImpl = (async () => new Response(leak, { status: 502 })) as unknown as typeof fetch;
  const r = await verifyTurnstile("SECRET_LEAK", "T", { action: "contact", timeoutMs: 1000, fetchImpl });
  const flat = JSON.stringify(r);
  assert.equal(r.success, false);
  assert.equal(flat.includes("SECRET_LEAK"), false);
  assert.equal(flat.includes("a@b.co"), false);
  assert.equal(flat.includes("STACK_INTERNAL"), false);
  assert.equal(flat.includes("challenges.cloudflare.com"), false);
});
