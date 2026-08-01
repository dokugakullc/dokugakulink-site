// 配送統合ロジックのテスト。sendEmail をフェイク注入し、外部 API には接続しない。
import { test } from "node:test";
import assert from "node:assert/strict";
import { deliverContact, type ContactDeliveryDeps, type EmailKind, type Inquiry } from "../src/lib/contactDelivery";

const inquiry: Inquiry = {
  name: "山田 太郎",
  email: "taro@example.com",
  message: "本文",
  receivedAt: "2026年7月27日 10:00",
  reference: "UKR-20260727-100000",
  submissionId: "sid-12345678",
};

type Call = { kind: EmailKind; idempotencyKey: string };

function deps(over: Partial<ContactDeliveryDeps> & { calls?: Call[] } = {}): ContactDeliveryDeps {
  const calls = over.calls ?? [];
  return {
    resendConfigured: true,
    timeoutMs: 1000,
    sendEmail: async (kind, _i, ctx) => {
      calls.push({ kind, idempotencyKey: ctx.idempotencyKey });
    },
    logError: () => {},
    ...over,
  };
}

test("両方成功 → 200 success:true・confirmationEmailSent:true", async () => {
  const r = await deliverContact(inquiry, deps());
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  assert.equal(r.body.confirmationEmailSent, true);
  assert.equal(r.body.reference, inquiry.reference);
});

test("運営宛（主）失敗 → 500・success を返さない・利用者宛は送らない", async () => {
  const calls: Call[] = [];
  const r = await deliverContact(
    inquiry,
    deps({
      calls,
      sendEmail: async (kind) => {
        calls.push({ kind, idempotencyKey: "" });
        if (kind === "admin") throw new Error("admin failed");
      },
    }),
  );
  assert.equal(r.status, 500);
  assert.notEqual(r.body.success, true);
  assert.deepEqual(calls.map((c) => c.kind), ["admin"]); // user は呼ばれない
});

test("運営宛成功・利用者宛（副）失敗 → 200 success:true・confirmationEmailSent:false", async () => {
  const r = await deliverContact(
    inquiry,
    deps({
      sendEmail: async (kind) => {
        if (kind === "user") throw new Error("user confirmation failed");
      },
    }),
  );
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  assert.equal(r.body.confirmationEmailSent, false);
});

test("RESEND 未設定 → 500・送信を試みない", async () => {
  const calls: Call[] = [];
  const r = await deliverContact(inquiry, deps({ resendConfigured: false, calls }));
  assert.equal(r.status, 500);
  assert.notEqual(r.body.success, true);
  assert.equal(calls.length, 0);
});

test("冪等キーは submissionId 由来で admin/user に付与される", async () => {
  const calls: Call[] = [];
  await deliverContact(inquiry, deps({ calls }));
  assert.deepEqual(calls, [
    { kind: "admin", idempotencyKey: "contact:sid-12345678:admin" },
    { kind: "user", idempotencyKey: "contact:sid-12345678:user" },
  ]);
});

test("ログに PII（氏名/メール/本文）を渡さない", async () => {
  const logged: Array<{ message: string; meta: Record<string, unknown> }> = [];
  await deliverContact(
    inquiry,
    deps({
      sendEmail: async (kind) => {
        if (kind === "admin") throw new Error(inquiry.email); // 失敗理由に PII を含めても…
      },
      logError: (message, meta) => logged.push({ message, meta }),
    }),
  );
  const serialized = JSON.stringify(logged);
  for (const banned of [inquiry.email, inquiry.name, inquiry.message]) {
    assert.equal(serialized.includes(banned), false, `ログに ${banned} が含まれてはならない`);
  }
});
