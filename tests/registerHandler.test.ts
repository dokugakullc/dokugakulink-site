// 事前登録 Route Handler の統合テスト。外部 API に接続しない。
import { test } from "node:test";
import assert from "node:assert/strict";
import { handleRegister, type RegisterHandlerDeps, type RegisterPayload } from "../src/lib/registerHandler";
import { makeReq } from "./helpers";

const validBody = { email: "taro@example.com", source: "landing_takken", problem: "forget" };

function deps(over: Partial<RegisterHandlerDeps> & { sent?: RegisterPayload[] } = {}): RegisterHandlerDeps {
  const sent = over.sent ?? [];
  return {
    gasConfigured: true,
    postRegister: async (payload) => {
      sent.push(payload);
      return { duplicated: false };
    },
    logError: () => {},
    logWarn: () => {},
    ...over,
  };
}

test("Content-Type 非JSON → 415", async () => {
  const r = await handleRegister(makeReq({ contentType: "text/plain", body: validBody }), deps());
  assert.equal(r.status, 415);
});

test("Origin 不一致 → 403", async () => {
  const r = await handleRegister(makeReq({ origin: "https://evil.example.com", body: validBody }), deps());
  assert.equal(r.status, 403);
});

test("不正 JSON → 400", async () => {
  const r = await handleRegister(makeReq({ throwOnJson: true }), deps());
  assert.equal(r.status, 400);
});

test("不正 email / source → 400", async () => {
  assert.equal((await handleRegister(makeReq({ body: { email: "bad" } }), deps())).status, 400);
  assert.equal(
    (await handleRegister(makeReq({ body: { email: "a@b.co", source: "__x__" } }), deps())).status,
    400,
  );
});

test("honeypot 作動 → 400・非成功・保存しない", async () => {
  const sent: RegisterPayload[] = [];
  const r = await handleRegister(makeReq({ body: { ...validBody, hp_token: "bot" } }), deps({ sent }));
  assert.equal(r.status, 400);
  assert.notEqual(r.body.success, true);
  assert.equal(sent.length, 0);
  assert.equal(/honeypot|hp_token|bot/i.test(String(r.body.error ?? "")), false);
});

test("GAS 未設定 → 500", async () => {
  const r = await handleRegister(makeReq({ body: validBody }), deps({ gasConfigured: false }));
  assert.equal(r.status, 500);
});

test("正常 → 200・source/interest/attribution を整形して送信", async () => {
  const sent: RegisterPayload[] = [];
  const body = { ...validBody, attribution: { utm_source: "meta", secret: "x" } };
  const r = await handleRegister(makeReq({ body }), deps({ sent }));
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  assert.equal(sent[0].interest, "takken");
  assert.equal(sent[0].attribution.utm_source, "meta");
  assert.equal("secret" in sent[0].attribution, false);
});

test("Preview + GAS設定あり → 503・外部保存0", async () => {
  const sent: RegisterPayload[] = [];
  const r = await handleRegister(makeReq({ body: validBody }), deps({ isPreview: true, gasConfigured: true, sent }));
  assert.equal(r.status, 503);
  assert.notEqual(r.body.success, true);
  assert.equal(sent.length, 0);
  assert.equal(/VERCEL|preview|GAS|secret/i.test(String(r.body.error ?? "")), false);
});

test("Preview + GAS設定なし → 503・外部保存0", async () => {
  const sent: RegisterPayload[] = [];
  const r = await handleRegister(makeReq({ body: validBody }), deps({ isPreview: true, gasConfigured: false, sent }));
  assert.equal(r.status, 503);
  assert.equal(sent.length, 0);
});

test("Production(isPreview=false) → 通常処理（200）", async () => {
  const r = await handleRegister(makeReq({ body: validBody }), deps({ isPreview: false }));
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
});

test("postRegister 失敗（タイムアウト含む）→ 500・success を返さない", async () => {
  const r = await handleRegister(
    makeReq({ body: validBody }),
    deps({
      postRegister: async () => {
        throw new Error("aborted");
      },
    }),
  );
  assert.equal(r.status, 500);
  assert.notEqual(r.body.success, true);
});
