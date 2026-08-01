// Route Handler（フレームワーク非依存）の統合テスト。外部 API・実メールに接続しない。
import { test } from "node:test";
import assert from "node:assert/strict";
import { handleContact, type ContactHandlerDeps } from "../src/lib/contactHandler";
import type { EmailKind, Inquiry } from "../src/lib/contactDelivery";
import { makeReq } from "./helpers";

const validBody = { name: "山田 太郎", email: "taro@example.com", message: "本文です", contact_type: "service" };

type Sent = { kind: EmailKind; idempotencyKey: string; inquiry: Inquiry };

function deps(over: Partial<ContactHandlerDeps> & { sent?: Sent[] } = {}): ContactHandlerDeps {
  const sent = over.sent ?? [];
  return {
    resendConfigured: true,
    sendEmail: async (kind, inquiry, ctx) => {
      sent.push({ kind, idempotencyKey: ctx.idempotencyKey, inquiry });
    },
    logError: () => {},
    logWarn: () => {},
    ...over,
  };
}

test("Content-Type が JSON でない → 415", async () => {
  const r = await handleContact(makeReq({ contentType: "text/plain", body: validBody }), deps());
  assert.equal(r.status, 415);
});

test("Origin 不一致 → 403", async () => {
  const r = await handleContact(makeReq({ origin: "https://evil.example.com", body: validBody }), deps());
  assert.equal(r.status, 403);
});

test("不正 JSON → 400", async () => {
  const r = await handleContact(makeReq({ throwOnJson: true }), deps());
  assert.equal(r.status, 400);
});

test("入力不正 → 400", async () => {
  const r = await handleContact(makeReq({ body: { name: "", email: "bad", message: "" } }), deps());
  assert.equal(r.status, 400);
});

test("honeypot 作動 → 400・非成功・受付/受付番号/確認メールを表示しない・送信0", async () => {
  const sent: Sent[] = [];
  const r = await handleContact(makeReq({ body: { ...validBody, hp_token: "i am a bot" } }), deps({ sent }));
  assert.equal(r.status, 400);
  assert.notEqual(r.body.success, true);
  assert.equal("reference" in r.body, false);
  assert.equal("confirmationEmailSent" in r.body, false);
  assert.equal(sent.length, 0); // 外部送信していない
  // エラー文が honeypot の存在を明示しない
  assert.equal(/honeypot|hp_token|bot/i.test(String(r.body.error ?? "")), false);
});

test("正常 → 200 success:true・confirmationEmailSent:true・admin/user 両方送信", async () => {
  const sent: Sent[] = [];
  const r = await handleContact(makeReq({ body: { ...validBody, submissionId: "abcd1234efgh" } }), deps({ sent }));
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  assert.equal(r.body.confirmationEmailSent, true);
  assert.deepEqual(sent.map((s) => s.kind), ["admin", "user"]);
  assert.equal(sent[0].idempotencyKey, "contact:abcd1234efgh:admin");
});

test("submissionId 未指定 → サーバーが生成し冪等キーに使う", async () => {
  const sent: Sent[] = [];
  await handleContact(makeReq({ body: validBody }), deps({ sent }));
  assert.match(sent[0].idempotencyKey, /^contact:[A-Za-z0-9-]{8,64}:admin$/);
});

test("RESEND 未設定 → 500・success を返さない", async () => {
  const r = await handleContact(makeReq({ body: validBody }), deps({ resendConfigured: false }));
  assert.equal(r.status, 500);
  assert.notEqual(r.body.success, true);
});

test("Origin なし（fail-open）でも処理は進む", async () => {
  const r = await handleContact(makeReq({ origin: null, body: validBody }), deps());
  assert.equal(r.status, 200);
});

test("Preview + APIキーあり → 503・送信0・success/reference/confirmationを返さない", async () => {
  const sent: Sent[] = [];
  const r = await handleContact(
    makeReq({ body: { ...validBody, submissionId: "abcd1234efgh" } }),
    deps({ isPreview: true, resendConfigured: true, sent }),
  );
  assert.equal(r.status, 503);
  assert.notEqual(r.body.success, true);
  assert.equal("reference" in r.body, false);
  assert.equal("confirmationEmailSent" in r.body, false);
  assert.equal(sent.length, 0);
  // 環境名・Secret 状態を露出しない
  assert.equal(/VERCEL|preview|RESEND|secret/i.test(String(r.body.error ?? "")), false);
});

test("Preview + APIキーなし → 503・送信0", async () => {
  const sent: Sent[] = [];
  const r = await handleContact(makeReq({ body: validBody }), deps({ isPreview: true, resendConfigured: false, sent }));
  assert.equal(r.status, 503);
  assert.notEqual(r.body.success, true);
  assert.equal(sent.length, 0);
});

test("Preview + honeypot → 400（Production と同じ順序・503にならず情報漏えいしない）", async () => {
  const sent: Sent[] = [];
  const r = await handleContact(
    makeReq({ body: { ...validBody, hp_token: "bot" } }),
    deps({ isPreview: true, sent }),
  );
  assert.equal(r.status, 400);
  assert.equal(sent.length, 0);
});

test("Production(isPreview=false) + APIキーあり → 通常送信（200）", async () => {
  const r = await handleContact(makeReq({ body: validBody }), deps({ isPreview: false, resendConfigured: true }));
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
});

test("Production + APIキーなし → 500", async () => {
  const r = await handleContact(makeReq({ body: validBody }), deps({ isPreview: false, resendConfigured: false }));
  assert.equal(r.status, 500);
  assert.notEqual(r.body.success, true);
});

test("VERCEL_ENV 未定義相当（isPreview 省略）→ 既存DI方針（通常処理）", async () => {
  const r = await handleContact(makeReq({ body: validBody }), deps());
  assert.equal(r.status, 200); // deps() は isPreview 省略＝false・resendConfigured true
});

test("運営宛送信失敗 → 500・success を返さない", async () => {
  const r = await handleContact(
    makeReq({ body: validBody }),
    deps({
      sendEmail: async (kind) => {
        if (kind === "admin") throw new Error("boom");
      },
    }),
  );
  assert.equal(r.status, 500);
  assert.notEqual(r.body.success, true);
});
