// Turnstile サーバー側検証（resolveTurnstileConfig / verifyTurnstile）のテスト。
// fetch を注入し実 Cloudflare へ接続しない。Secret / token / 応答本文を throw 文へ出さないことを固定。
// 公式テストキー値はダミーとしてのみ使用（外部送信はしない）。
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveTurnstileConfig,
  verifyTurnstile,
  SITEVERIFY_URL,
  TURNSTILE_TOKEN_MAX,
} from "../src/lib/turnstile";

// 公式ダミー値（外部へは送らない）
const SECRET_PASS_DUMMY = "1x0000000000000000000000000000000AA";
const TOKEN_DUMMY = "XXXX.DUMMY.TOKEN.XXXX";

function okResponse(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200 });
}

// ── 設定状態 ─────────────────────────────────────────────────────
test("両方未設定 → disabled", () => {
  assert.equal(resolveTurnstileConfig(undefined, undefined), "disabled");
  assert.equal(resolveTurnstileConfig("", ""), "disabled");
});
test("両方設定 → enabled", () => {
  assert.equal(resolveTurnstileConfig("site", "secret"), "enabled");
});
test("SiteKey のみ → misconfigured", () => {
  assert.equal(resolveTurnstileConfig("site", undefined), "misconfigured");
  assert.equal(resolveTurnstileConfig("site", ""), "misconfigured");
});
test("Secret のみ → misconfigured", () => {
  assert.equal(resolveTurnstileConfig(undefined, "secret"), "misconfigured");
  assert.equal(resolveTurnstileConfig("", "secret"), "misconfigured");
});

// ── 検証: 正常 ───────────────────────────────────────────────────
test("正常な contact token → success（secret/response が渡り、action/hostname 一致）", async () => {
  let seenUrl = "";
  let seenBody = "";
  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    seenUrl = String(url);
    seenBody = String(init?.body ?? "");
    return okResponse({ success: true, action: "contact", hostname: "www.dokugakulink.com" });
  }) as unknown as typeof fetch;
  const r = await verifyTurnstile(SECRET_PASS_DUMMY, TOKEN_DUMMY, { action: "contact", timeoutMs: 1000, fetchImpl });
  assert.deepEqual(r, { success: true });
  assert.equal(seenUrl, SITEVERIFY_URL);
  const params = new URLSearchParams(seenBody);
  assert.equal(params.get("secret"), SECRET_PASS_DUMMY);
  assert.equal(params.get("response"), TOKEN_DUMMY);
  assert.equal(params.get("remoteip"), null, "remoteip は既定で送らない");
});

test("正常な register token → success（action=register 一致・apex ドメイン許可）", async () => {
  const fetchImpl = (async () =>
    okResponse({ success: true, action: "register", hostname: "dokugakulink.com" })) as unknown as typeof fetch;
  assert.deepEqual(await verifyTurnstile("s", "t", { action: "register", timeoutMs: 1000, fetchImpl }), { success: true });
});

// ── 検証: 失敗（成功を返さない） ──────────────────────────────────
test("success:false → success:false", async () => {
  const fetchImpl = (async () =>
    okResponse({ success: false, "error-codes": ["invalid-input-response"] })) as unknown as typeof fetch;
  assert.deepEqual(await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl }), { success: false });
});

test("action 不一致 → success:false", async () => {
  const fetchImpl = (async () =>
    okResponse({ success: true, action: "register", hostname: "www.dokugakulink.com" })) as unknown as typeof fetch;
  // contact を期待しているのに register が返る
  assert.deepEqual(await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl }), { success: false });
});

test("hostname 不一致 → success:false", async () => {
  const fetchImpl = (async () =>
    okResponse({ success: true, action: "contact", hostname: "evil.example.com" })) as unknown as typeof fetch;
  assert.deepEqual(await verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl }), { success: false });
});

test("token 空/過長 → fetch せず success:false", async () => {
  let calls = 0;
  const fetchImpl = (async () => {
    calls++;
    return okResponse({ success: true, action: "contact", hostname: "www.dokugakulink.com" });
  }) as unknown as typeof fetch;
  assert.deepEqual(await verifyTurnstile("s", "", { action: "contact", timeoutMs: 1000, fetchImpl }), { success: false });
  const tooLong = "x".repeat(TURNSTILE_TOKEN_MAX + 1);
  assert.deepEqual(await verifyTurnstile("s", tooLong, { action: "contact", timeoutMs: 1000, fetchImpl }), {
    success: false,
  });
  assert.equal(calls, 0, "空・過長は外部へ送らない");
});

// ── 検証: 障害・漏えい防止 ────────────────────────────────────────
test("非2xx は throw（Secret/token/URL を含めない・ステータス番号のみ）", async () => {
  const fetchImpl = (async () => new Response("body", { status: 500 })) as unknown as typeof fetch;
  await assert.rejects(
    () => verifyTurnstile("S_SECRET", "T_TOKEN", { action: "contact", timeoutMs: 1000, fetchImpl }),
    (e: unknown) =>
      e instanceof Error &&
      /500/.test(e.message) &&
      !e.message.includes("S_SECRET") &&
      !e.message.includes("T_TOKEN") &&
      !e.message.includes("challenges.cloudflare.com"),
  );
});

test("JSON 解析失敗は固定メッセージで throw（応答本文を含めない）", async () => {
  const fetchImpl = (async () => new Response("<html>LEAK_BODY</html>", { status: 200 })) as unknown as typeof fetch;
  await assert.rejects(
    () => verifyTurnstile("s", "t", { action: "contact", timeoutMs: 1000, fetchImpl }),
    (e: unknown) =>
      e instanceof Error && e.message === "turnstile siteverify invalid response" && !e.message.includes("LEAK_BODY"),
  );
});

test("悪意ある応答（Secret/メール/URL/内部文字列）でも throw 文へ出ない", async () => {
  const leak = "SECRET_LEAK / a@b.co / https://challenges.cloudflare.com/x / STACK_INTERNAL";
  const fetchImpl = (async () => new Response(leak, { status: 502 })) as unknown as typeof fetch; // 非2xx→throw
  await assert.rejects(
    () => verifyTurnstile("SECRET_LEAK", "T", { action: "contact", timeoutMs: 1000, fetchImpl }),
    (e: unknown) =>
      e instanceof Error &&
      !e.message.includes("SECRET_LEAK") &&
      !e.message.includes("a@b.co") &&
      !e.message.includes("STACK_INTERNAL"),
  );
});

test("タイムアウト: signal で実際に中断され期限内に reject", async () => {
  const fetchImpl = ((_url: string | URL | Request, init?: RequestInit) =>
    new Promise((_res, rej) => {
      init?.signal?.addEventListener("abort", () => rej(new DOMException("aborted", "AbortError")));
    })) as unknown as typeof fetch;
  const started = Date.now();
  await assert.rejects(
    () => verifyTurnstile("s", "t", { action: "contact", timeoutMs: 30, fetchImpl }),
    (e: unknown) => e instanceof Error && e.name === "AbortError",
  );
  assert.ok(Date.now() - started < 500);
});

test("remoteip / idempotency_key はオプトインで送信できる", async () => {
  let seenBody = "";
  const fetchImpl = (async (_u: string | URL | Request, init?: RequestInit) => {
    seenBody = String(init?.body ?? "");
    return okResponse({ success: true, action: "contact", hostname: "www.dokugakulink.com" });
  }) as unknown as typeof fetch;
  await verifyTurnstile("s", "t", {
    action: "contact",
    timeoutMs: 1000,
    fetchImpl,
    remoteip: "203.0.113.1",
    idempotencyKey: "uuid-1",
  });
  const params = new URLSearchParams(seenBody);
  assert.equal(params.get("remoteip"), "203.0.113.1");
  assert.equal(params.get("idempotency_key"), "uuid-1");
});
