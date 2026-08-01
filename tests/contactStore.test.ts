// お問い合わせ「保存（contacts）＋通知（Resend）」統合の分岐テスト。外部 API には接続しない。
// 検証観点: 保存先行 / 保存とメールの独立 / 保存成功なら通知失敗でも success / source 固定 /
//           attribution 平坦化前の許可キー抽出 / contact_type 必須 / submission_id 冪等 / Preview 遮断。
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  handleContact,
  type ContactHandlerDeps,
  type ContactStoreRecord,
} from "../src/lib/contactHandler";
import type { EmailKind } from "../src/lib/contactDelivery";
import { makeReq } from "./helpers";

const validBody = {
  name: "山田 太郎",
  email: "taro@example.com",
  message: "本文です",
  contact_type: "service",
  company: "テスト株式会社",
};

type Ctx = {
  sent: EmailKind[];
  stored: ContactStoreRecord[];
  storeResult?: { stored: boolean; duplicate: boolean };
  storeThrows?: boolean;
  adminThrows?: boolean;
};

function deps(ctx: Ctx, over: Partial<ContactHandlerDeps> = {}): ContactHandlerDeps {
  return {
    resendConfigured: true,
    storeConfigured: true,
    storeContact: async (record) => {
      ctx.stored.push(record);
      if (ctx.storeThrows) throw new Error("store boom");
      return ctx.storeResult ?? { stored: true, duplicate: false };
    },
    sendEmail: async (kind: EmailKind) => {
      ctx.sent.push(kind);
      if (ctx.adminThrows && kind === "admin") throw new Error("admin boom");
    },
    logError: () => {},
    logWarn: () => {},
    ...over,
  };
}

test("正常: 保存→通知の順で実行・200・success/stored/adminNotified/confirmationEmailSent", async () => {
  const ctx: Ctx = { sent: [], stored: [] };
  const r = await handleContact(makeReq({ body: { ...validBody, submissionId: "abcd1234efgh" } }), deps(ctx));
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  assert.equal(r.body.stored, true);
  assert.equal(r.body.adminNotified, true);
  assert.equal(r.body.confirmationEmailSent, true);
  assert.equal(ctx.stored.length, 1); // 保存が呼ばれた
  assert.deepEqual(ctx.sent, ["admin", "user"]); // その後にメール
});

test("source はクライアント値を無視して web_contact 固定", async () => {
  const ctx: Ctx = { sent: [], stored: [] };
  await handleContact(makeReq({ body: { ...validBody, source: "landing_takken" } }), deps(ctx));
  assert.equal(ctx.stored[0].source, "web_contact");
  assert.equal(ctx.stored[0].contact_type, "service");
  assert.equal(ctx.stored[0].company, "テスト株式会社");
});

test("attribution は許可キーのみ抽出（未知キーは落とす）", async () => {
  const ctx: Ctx = { sent: [], stored: [] };
  await handleContact(
    makeReq({ body: { ...validBody, attribution: { utm_content: "ad_b_app_screen", fbclid: "abc", evil: "x" } } }),
    deps(ctx),
  );
  assert.equal(ctx.stored[0].attribution.utm_content, "ad_b_app_screen");
  assert.equal(ctx.stored[0].attribution.fbclid, "abc");
  assert.equal("evil" in ctx.stored[0].attribution, false);
});

test("保存成功・運営メール失敗 → 200 success:true・stored:true・adminNotified:false（問い合わせを失わない）", async () => {
  const ctx: Ctx = { sent: [], stored: [], adminThrows: true };
  const r = await handleContact(makeReq({ body: validBody }), deps(ctx));
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  assert.equal(r.body.stored, true);
  assert.equal(r.body.adminNotified, false);
  assert.equal(r.body.confirmationEmailSent, false);
});

test("保存失敗・運営メール成功 → 200 success:true・stored:false（メールが記録の正）", async () => {
  const ctx: Ctx = { sent: [], stored: [], storeThrows: true };
  const r = await handleContact(makeReq({ body: validBody }), deps(ctx));
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  assert.equal(r.body.stored, false);
  assert.equal(r.body.adminNotified, true);
});

test("保存失敗・運営メール失敗 → 500・success を返さない（両系統喪失）", async () => {
  const ctx: Ctx = { sent: [], stored: [], storeThrows: true, adminThrows: true };
  const r = await handleContact(makeReq({ body: validBody }), deps(ctx));
  assert.equal(r.status, 500);
  assert.notEqual(r.body.success, true);
});

test("duplicate（同一 submission_id）は保存済み扱い → stored:true", async () => {
  const ctx: Ctx = { sent: [], stored: [], storeResult: { stored: false, duplicate: true } };
  const r = await handleContact(makeReq({ body: validBody }), deps(ctx));
  assert.equal(r.status, 200);
  assert.equal(r.body.stored, true);
});

test("submission_id は保存レコードにも載る（冪等キー）", async () => {
  const ctx: Ctx = { sent: [], stored: [] };
  await handleContact(makeReq({ body: { ...validBody, submissionId: "abcd1234efgh" } }), deps(ctx));
  assert.equal(ctx.stored[0].submission_id, "abcd1234efgh");
});

test("submissionId 未指定/不正でも Next 側でサーバー生成し、空で GAS へ送らない", async () => {
  // 未指定 → サーバー生成の非空 ID（GAS の missing_submission_id には決して当たらない）
  const ctx1: Ctx = { sent: [], stored: [] };
  await handleContact(makeReq({ body: validBody }), deps(ctx1));
  assert.match(ctx1.stored[0].submission_id, /^[A-Za-z0-9-]{8,64}$/);
  assert.notEqual(ctx1.stored[0].submission_id, "");
  // 不正な submissionId（短すぎ）→ サーバーが作り直す
  const ctx2: Ctx = { sent: [], stored: [] };
  await handleContact(makeReq({ body: { ...validBody, submissionId: "x" } }), deps(ctx2));
  assert.match(ctx2.stored[0].submission_id, /^[A-Za-z0-9-]{8,64}$/);
});

test("contact_type 未指定 → 400・保存も送信もしない", async () => {
  const ctx: Ctx = { sent: [], stored: [] };
  const { contact_type: _omit, ...noType } = validBody;
  void _omit;
  const r = await handleContact(makeReq({ body: noType }), deps(ctx));
  assert.equal(r.status, 400);
  assert.equal(ctx.stored.length, 0);
  assert.equal(ctx.sent.length, 0);
});

test("contact_type 不正値 → 400", async () => {
  const ctx: Ctx = { sent: [], stored: [] };
  const r = await handleContact(makeReq({ body: { ...validBody, contact_type: "hacker" } }), deps(ctx));
  assert.equal(r.status, 400);
});

test("Preview → 保存0・送信0・503", async () => {
  const ctx: Ctx = { sent: [], stored: [] };
  const r = await handleContact(makeReq({ body: validBody }), deps(ctx, { isPreview: true }));
  assert.equal(r.status, 503);
  assert.equal(ctx.stored.length, 0);
  assert.equal(ctx.sent.length, 0);
});

test("store 未設定 → 保存せず従来どおりメールのみで受領（stored:false・success:true）", async () => {
  const ctx: Ctx = { sent: [], stored: [] };
  const r = await handleContact(makeReq({ body: validBody }), deps(ctx, { storeConfigured: false }));
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  assert.equal(r.body.stored, false);
  assert.equal(ctx.stored.length, 0);
  assert.deepEqual(ctx.sent, ["admin", "user"]);
});

// ── 修正5: 障害マトリクス＋整合の追加固定 ─────────────────────────
test("submissionId が保存レコードとメール Idempotency-Key で一致（両系統同一の冪等キー）", async () => {
  let storedId = "";
  const idemKeys: string[] = [];
  const r = await handleContact(makeReq({ body: { ...validBody, submissionId: "abcd1234efgh" } }), {
    resendConfigured: true,
    storeConfigured: true,
    storeContact: async (record) => {
      storedId = record.submission_id;
      return { stored: true, duplicate: false };
    },
    sendEmail: async (_kind, _inquiry, ctx) => {
      idemKeys.push(ctx.idempotencyKey);
    },
    logError: () => {},
    logWarn: () => {},
  });
  assert.equal(r.status, 200);
  assert.equal(storedId, "abcd1234efgh");
  // メールの Idempotency-Key は contact:<submissionId>:<kind>。保存レコードと同一 submissionId。
  assert.equal(idemKeys[0], "contact:abcd1234efgh:admin");
  assert.equal(idemKeys[1], "contact:abcd1234efgh:user");
});

test("エラー時に logError へ PII/Secret を出さない（reference のみ）", async () => {
  const logs: Array<{ message: string; meta: Record<string, unknown> }> = [];
  const secret = "SHOULD_NOT_APPEAR";
  await handleContact(
    makeReq({ body: { ...validBody, submissionId: "abcd1234efgh", token: secret } }),
    {
      resendConfigured: true,
      storeConfigured: true,
      storeContact: async () => {
        throw new Error(`boom ${secret} ${validBody.email}`); // 内部エラーに PII/Secret が乗っても
      },
      sendEmail: async (kind) => {
        if (kind === "admin") throw new Error(`admin boom ${validBody.email}`);
      },
      logError: (message, meta) => logs.push({ message, meta }),
      logWarn: () => {},
    },
  );
  assert.ok(logs.length >= 1, "logError が呼ばれる");
  const flat = JSON.stringify(logs);
  assert.equal(flat.includes(validBody.email), false, "メールアドレスをログへ出さない");
  assert.equal(flat.includes(validBody.name), false, "氏名をログへ出さない");
  assert.equal(flat.includes(validBody.message), false, "本文をログへ出さない");
  assert.equal(flat.includes(secret), false, "Secret をログへ出さない");
  // meta は reference のみ
  for (const l of logs) assert.deepEqual(Object.keys(l.meta), ["reference"]);
});

test("store timeout（reject）でも虚偽の stored:true を返さない", async () => {
  const ctx: Ctx = { sent: [], stored: [] };
  const r = await handleContact(makeReq({ body: validBody }), {
    ...deps(ctx),
    storeContact: async () => {
      throw new DOMException("aborted", "AbortError"); // timeout 相当
    },
  });
  assert.equal(r.body.stored, false); // 保存確定していない
  assert.equal(r.body.success, true); // メールが記録の正
});

test("メール timeout（admin reject）でも虚偽の adminNotified:true を返さない（保存済み）", async () => {
  const ctx: Ctx = { sent: [], stored: [], adminThrows: true };
  const r = await handleContact(makeReq({ body: validBody }), deps(ctx));
  assert.equal(r.body.stored, true);
  assert.equal(r.body.adminNotified, false); // 送信できていないので false
});
