// contact / register ハンドラへの Turnstile 統合テスト。外部 API へ接続しない（verify も fake）。
// 検証観点: disabled=従来経路 / enabled+成功=外部処理へ / token欠落・検証失敗・misconfigured=外部0 /
//           Preview・honeypot・入力不正では Siteverify を呼ばない / action を contact・register で分離 /
//           token を GAS・Resend へ転送しない / ログに token・PII を出さない。
import { test } from "node:test";
import assert from "node:assert/strict";
import { handleContact, type ContactHandlerDeps } from "../src/lib/contactHandler";
import { handleRegister, type RegisterHandlerDeps } from "../src/lib/registerHandler";
import type { TurnstileAction, TurnstileConfigState, TurnstileFailureReason } from "../src/lib/turnstile";
import { makeReq } from "./helpers";

const TOKEN = "XXXX.DUMMY.TOKEN.XXXX";

type VerifyCall = { token: string; action: TurnstileAction };

// state と結果（success / 失敗 reason / throw）を制御し、呼び出しを記録する Turnstile ガード。
function fakeTurnstile(
  state: TurnstileConfigState,
  opts: { success?: boolean; reason?: TurnstileFailureReason; httpStatus?: number; throws?: boolean } = {},
) {
  const calls: VerifyCall[] = [];
  return {
    calls,
    guard: {
      state,
      verify: async (token: string, ctx: { action: TurnstileAction; timeoutMs: number }) => {
        calls.push({ token, action: ctx.action });
        if (opts.throws) throw new Error("cloudflare down");
        if (opts.success === false) {
          return opts.httpStatus !== undefined
            ? { success: false as const, reason: opts.reason ?? "siteverify_rejected", httpStatus: opts.httpStatus }
            : { success: false as const, reason: opts.reason ?? "siteverify_rejected" };
        }
        return { success: true as const };
      },
    },
  };
}

const contactBody = (over: Record<string, unknown> = {}) => ({
  name: "山田 太郎",
  email: "taro@example.com",
  message: "本文です",
  contact_type: "service",
  turnstileToken: TOKEN,
  ...over,
});

const registerBody = (over: Record<string, unknown> = {}) => ({
  email: "taro@example.com",
  problem: "forget",
  source: "landing_takken",
  turnstileToken: TOKEN,
  ...over,
});

// ── contact ──────────────────────────────────────────────────────
function contactDeps(turnstile: ContactHandlerDeps["turnstile"], over: Partial<ContactHandlerDeps> = {}) {
  const sent: string[] = [];
  const stored: unknown[] = [];
  const logs: Array<{ m: string; meta: Record<string, unknown> }> = [];
  const deps: ContactHandlerDeps = {
    resendConfigured: true,
    storeConfigured: false,
    sendEmail: async (kind) => {
      sent.push(kind);
    },
    turnstile,
    logError: (m, meta) => logs.push({ m, meta }),
    logWarn: (m, meta) => logs.push({ m, meta }),
    ...over,
  };
  return { deps, sent, stored, logs };
}

test("contact: Turnstile disabled → 従来経路（verify 呼ばず・メール送信）", async () => {
  const t = fakeTurnstile("disabled");
  const { deps, sent } = contactDeps(t.guard);
  const r = await handleContact(makeReq({ body: contactBody() }), deps);
  assert.equal(r.status, 200);
  assert.equal(t.calls.length, 0);
  assert.deepEqual(sent, ["admin", "user"]);
});

test("contact: enabled + 成功 → 外部処理へ（action=contact で verify）", async () => {
  const t = fakeTurnstile("enabled", { success: true });
  const { deps, sent } = contactDeps(t.guard);
  const r = await handleContact(makeReq({ body: contactBody() }), deps);
  assert.equal(r.status, 200);
  assert.equal(t.calls.length, 1);
  assert.equal(t.calls[0].action, "contact");
  assert.equal(t.calls[0].token, TOKEN);
  assert.deepEqual(sent, ["admin", "user"]);
});

test("contact: token 欠落 → 400・verify 呼ばず・メール0", async () => {
  const t = fakeTurnstile("enabled");
  const { deps, sent } = contactDeps(t.guard);
  const r = await handleContact(makeReq({ body: contactBody({ turnstileToken: undefined }) }), deps);
  assert.equal(r.status, 400);
  assert.equal(t.calls.length, 0);
  assert.equal(sent.length, 0);
});

test("contact: 検証失敗 → 400・メール0", async () => {
  const t = fakeTurnstile("enabled", { success: false });
  const { deps, sent } = contactDeps(t.guard);
  const r = await handleContact(makeReq({ body: contactBody() }), deps);
  assert.equal(r.status, 400);
  assert.equal(sent.length, 0);
});

test("contact: Cloudflare 障害(throw) → 400・メール0（成功を返さない）", async () => {
  const t = fakeTurnstile("enabled", { throws: true });
  const { deps, sent } = contactDeps(t.guard);
  const r = await handleContact(makeReq({ body: contactBody() }), deps);
  assert.equal(r.status, 400);
  assert.equal(sent.length, 0);
});

test("contact: misconfigured → 500・verify 呼ばず・メール0", async () => {
  const t = fakeTurnstile("misconfigured");
  const { deps, sent } = contactDeps(t.guard);
  const r = await handleContact(makeReq({ body: contactBody() }), deps);
  assert.equal(r.status, 500);
  assert.equal(t.calls.length, 0);
  assert.equal(sent.length, 0);
});

test("contact: Preview → 503・Siteverify 0・メール0", async () => {
  const t = fakeTurnstile("enabled");
  const { deps, sent } = contactDeps(t.guard, { isPreview: true });
  const r = await handleContact(makeReq({ body: contactBody() }), deps);
  assert.equal(r.status, 503);
  assert.equal(t.calls.length, 0);
  assert.equal(sent.length, 0);
});

test("contact: honeypot → Siteverify 0・メール0", async () => {
  const t = fakeTurnstile("enabled");
  const { deps, sent } = contactDeps(t.guard);
  const r = await handleContact(makeReq({ body: contactBody({ hp_token: "bot" }) }), deps);
  assert.equal(r.status, 400);
  assert.equal(t.calls.length, 0);
  assert.equal(sent.length, 0);
});

test("contact: 入力不正 → Siteverify 0", async () => {
  const t = fakeTurnstile("enabled");
  const { deps } = contactDeps(t.guard);
  const r = await handleContact(makeReq({ body: contactBody({ email: "bad" }) }), deps);
  assert.equal(r.status, 400);
  assert.equal(t.calls.length, 0);
});

test("contact: token を GAS 保存 payload へ転送しない・ログに token/PII を出さない", async () => {
  const t = fakeTurnstile("enabled", { success: true });
  const storeRecords: unknown[] = [];
  const { deps, logs } = contactDeps(t.guard, {
    storeConfigured: true,
    storeContact: async (record) => {
      storeRecords.push(record);
      return { stored: true, duplicate: false };
    },
  });
  const r = await handleContact(makeReq({ body: contactBody() }), deps);
  assert.equal(r.status, 200);
  assert.equal(JSON.stringify(storeRecords).includes(TOKEN), false, "保存 record に token を含めない");
  assert.equal(JSON.stringify(logs).includes(TOKEN), false, "ログに token を含めない");
  assert.equal(JSON.stringify(logs).includes("taro@example.com"), false, "ログに PII を含めない");
});

// ── contact: 失敗理由の固定カテゴリログ ─────────────────────────
function contactFailLog(reason: TurnstileFailureReason, httpStatus?: number) {
  return async () => {
    const t = fakeTurnstile("enabled", { success: false, reason, httpStatus });
    const { deps, sent, logs } = contactDeps(t.guard);
    const r = await handleContact(makeReq({ body: contactBody() }), deps);
    assert.equal(r.status, 400);
    assert.equal(sent.length, 0);
    const failLog = logs.find((l) => l.m === "contact: turnstile verification failed");
    assert.ok(failLog, "verification failed ログがある");
    assert.equal(failLog?.meta.reason, reason);
    if (httpStatus !== undefined) assert.equal(failLog?.meta.httpStatus, httpStatus);
  };
}
test("contact: siteverify_http_error + httpStatus をカテゴリとして記録", contactFailLog("siteverify_http_error", 403));
test("contact: siteverify_timeout をカテゴリとして記録", contactFailLog("siteverify_timeout"));
test("contact: siteverify_rejected をカテゴリとして記録", contactFailLog("siteverify_rejected"));
test("contact: action_mismatch をカテゴリとして記録", contactFailLog("action_mismatch"));
test("contact: hostname_mismatch をカテゴリとして記録", contactFailLog("hostname_mismatch"));

test("contact: token 欠落 → reason=missing_token を記録（verify 呼ばず）", async () => {
  const t = fakeTurnstile("enabled");
  const { deps, logs } = contactDeps(t.guard);
  await handleContact(makeReq({ body: contactBody({ turnstileToken: undefined }) }), deps);
  assert.equal(t.calls.length, 0);
  const failLog = logs.find((l) => l.m === "contact: turnstile verification failed");
  assert.equal(failLog?.meta.reason, "missing_token");
});

test("contact: verify が throw → reason=siteverify_network_error を記録（詳細を出さない）", async () => {
  const t = fakeTurnstile("enabled", { throws: true });
  const { deps, logs } = contactDeps(t.guard);
  await handleContact(makeReq({ body: contactBody() }), deps);
  const failLog = logs.find((l) => l.m === "contact: turnstile verification failed");
  assert.equal(failLog?.meta.reason, "siteverify_network_error");
  // Cloudflare 例外 message / token / PII をログへ出さない
  const flat = JSON.stringify(logs);
  assert.equal(flat.includes("cloudflare down"), false);
  assert.equal(flat.includes(TOKEN), false);
  assert.equal(flat.includes("taro@example.com"), false);
  assert.equal(flat.includes("山田 太郎"), false);
});

test("contact: 失敗ログの meta は reason(+httpStatus) のみ（余計なキーなし）", async () => {
  const t = fakeTurnstile("enabled", { success: false, reason: "siteverify_http_error", httpStatus: 500 });
  const { deps, logs } = contactDeps(t.guard);
  await handleContact(makeReq({ body: contactBody() }), deps);
  const failLog = logs.find((l) => l.m === "contact: turnstile verification failed");
  assert.deepEqual(Object.keys(failLog?.meta ?? {}).sort(), ["httpStatus", "reason"]);
});

// ── register ─────────────────────────────────────────────────────
function registerDeps(turnstile: RegisterHandlerDeps["turnstile"], over: Partial<RegisterHandlerDeps> = {}) {
  const posted: unknown[] = [];
  const logs: Array<{ m: string; meta: Record<string, unknown> }> = [];
  const deps: RegisterHandlerDeps = {
    gasConfigured: true,
    postRegister: async (payload) => {
      posted.push(payload);
      return { duplicated: false };
    },
    turnstile,
    logError: (m, meta) => logs.push({ m, meta }),
    logWarn: (m, meta) => logs.push({ m, meta }),
    ...over,
  };
  return { deps, posted, logs };
}

test("register: disabled → 従来経路（verify 呼ばず・GAS 送信）", async () => {
  const t = fakeTurnstile("disabled");
  const { deps, posted } = registerDeps(t.guard);
  const r = await handleRegister(makeReq({ body: registerBody() }), deps);
  assert.equal(r.status, 200);
  assert.equal(t.calls.length, 0);
  assert.equal(posted.length, 1);
});

test("register: enabled + 成功 → 外部処理へ（action=register で verify）", async () => {
  const t = fakeTurnstile("enabled", { success: true });
  const { deps, posted } = registerDeps(t.guard);
  const r = await handleRegister(makeReq({ body: registerBody() }), deps);
  assert.equal(r.status, 200);
  assert.equal(t.calls.length, 1);
  assert.equal(t.calls[0].action, "register");
  assert.equal(posted.length, 1);
});

test("register: token 欠落 → 400・verify 呼ばず・GAS0", async () => {
  const t = fakeTurnstile("enabled");
  const { deps, posted } = registerDeps(t.guard);
  const r = await handleRegister(makeReq({ body: registerBody({ turnstileToken: undefined }) }), deps);
  assert.equal(r.status, 400);
  assert.equal(t.calls.length, 0);
  assert.equal(posted.length, 0);
});

test("register: 検証失敗 → 400・GAS0", async () => {
  const t = fakeTurnstile("enabled", { success: false });
  const { deps, posted } = registerDeps(t.guard);
  const r = await handleRegister(makeReq({ body: registerBody() }), deps);
  assert.equal(r.status, 400);
  assert.equal(posted.length, 0);
});

test("register: misconfigured → 500・verify 呼ばず・GAS0", async () => {
  const t = fakeTurnstile("misconfigured");
  const { deps, posted } = registerDeps(t.guard);
  const r = await handleRegister(makeReq({ body: registerBody() }), deps);
  assert.equal(r.status, 500);
  assert.equal(t.calls.length, 0);
  assert.equal(posted.length, 0);
});

test("register: Preview → 503・Siteverify 0・GAS0", async () => {
  const t = fakeTurnstile("enabled");
  const { deps, posted } = registerDeps(t.guard, { isPreview: true });
  const r = await handleRegister(makeReq({ body: registerBody() }), deps);
  assert.equal(r.status, 503);
  assert.equal(t.calls.length, 0);
  assert.equal(posted.length, 0);
});

test("register: honeypot → Siteverify 0", async () => {
  const t = fakeTurnstile("enabled");
  const { deps, posted } = registerDeps(t.guard);
  const r = await handleRegister(makeReq({ body: registerBody({ hp_token: "bot" }) }), deps);
  assert.equal(r.status, 400);
  assert.equal(t.calls.length, 0);
  assert.equal(posted.length, 0);
});

test("register: token を GAS payload へ転送しない・ログに token/PII を出さない", async () => {
  const t = fakeTurnstile("enabled", { success: true });
  const { deps, posted, logs } = registerDeps(t.guard);
  await handleRegister(makeReq({ body: registerBody() }), deps);
  assert.equal(JSON.stringify(posted).includes(TOKEN), false, "GAS payload に token を含めない");
  assert.equal(JSON.stringify(logs).includes(TOKEN), false);
  assert.equal(JSON.stringify(logs).includes("taro@example.com"), false);
});

test("register: 失敗理由の固定カテゴリログ（contact と対称）", async () => {
  for (const reason of ["siteverify_http_error", "siteverify_timeout", "siteverify_rejected", "hostname_mismatch"] as const) {
    const t = fakeTurnstile("enabled", { success: false, reason });
    const { deps, posted, logs } = registerDeps(t.guard);
    const r = await handleRegister(makeReq({ body: registerBody() }), deps);
    assert.equal(r.status, 400);
    assert.equal(posted.length, 0);
    const failLog = logs.find((l) => l.m === "register: turnstile verification failed");
    assert.equal(failLog?.meta.reason, reason);
  }
});

test("register: token 欠落 → reason=missing_token（verify 呼ばず）", async () => {
  const t = fakeTurnstile("enabled");
  const { deps, logs } = registerDeps(t.guard);
  await handleRegister(makeReq({ body: registerBody({ turnstileToken: undefined }) }), deps);
  assert.equal(t.calls.length, 0);
  const failLog = logs.find((l) => l.m === "register: turnstile verification failed");
  assert.equal(failLog?.meta.reason, "missing_token");
});

test("register: verify throw → reason=siteverify_network_error（詳細を出さない）", async () => {
  const t = fakeTurnstile("enabled", { throws: true });
  const { deps, logs } = registerDeps(t.guard);
  await handleRegister(makeReq({ body: registerBody() }), deps);
  const failLog = logs.find((l) => l.m === "register: turnstile verification failed");
  assert.equal(failLog?.meta.reason, "siteverify_network_error");
  assert.equal(JSON.stringify(logs).includes("cloudflare down"), false);
});
