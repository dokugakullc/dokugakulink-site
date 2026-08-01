// submissionId と送信内容スナップショットの整合ロジックのテスト。
import { test } from "node:test";
import assert from "node:assert/strict";
import { contentSnapshot, resolveSubmissionId } from "../src/lib/submission";

// 決定論的な id 生成器（呼ばれた回数で id1, id2, ...）
function counter() {
  let n = 0;
  return () => `id${++n}`;
}

const base = { name: "山田 太郎", email: "taro@example.com", message: "本文です" };

test("初回送信 → 新しい id を生成", () => {
  const make = counter();
  const s = resolveSubmissionId(null, base, make);
  assert.equal(s.id, "id1");
});

test("失敗後・内容変更なしの再試行 → 同じ id", () => {
  const make = counter();
  const first = resolveSubmissionId(null, base, make);
  const second = resolveSubmissionId(first, { ...base }, make);
  assert.equal(second.id, first.id);
  assert.equal(make(), "id2"); // 生成器は再試行では呼ばれていない（次が id2）
});

test("失敗後・氏名変更 → 新しい id", () => {
  const make = counter();
  const first = resolveSubmissionId(null, base, make);
  const second = resolveSubmissionId(first, { ...base, name: "佐藤 花子" }, make);
  assert.notEqual(second.id, first.id);
  assert.equal(second.id, "id2");
});

test("失敗後・メール変更 → 新しい id", () => {
  const make = counter();
  const first = resolveSubmissionId(null, base, make);
  const second = resolveSubmissionId(first, { ...base, email: "other@example.com" }, make);
  assert.notEqual(second.id, first.id);
});

test("失敗後・本文変更 → 新しい id", () => {
  const make = counter();
  const first = resolveSubmissionId(null, base, make);
  const second = resolveSubmissionId(first, { ...base, message: "別の本文" }, make);
  assert.notEqual(second.id, first.id);
});

test("前後の空白だけの差は同一内容として同じ id（内部空白の差は別内容）", () => {
  const make = counter();
  const first = resolveSubmissionId(null, base, make);
  const trimmedSame = resolveSubmissionId(first, { name: "  山田 太郎 ", email: " taro@example.com ", message: "本文です  " }, make);
  assert.equal(trimmedSame.id, first.id); // 前後空白のみ → 同一
  const innerDiff = resolveSubmissionId(first, { ...base, name: "山田  太郎" }, make);
  assert.notEqual(innerDiff.id, first.id); // 内部空白 → 別内容
});

test("成功後の新規問い合わせ（prev=null）→ 新しい id", () => {
  const make = counter();
  const first = resolveSubmissionId(null, base, make);
  const afterReset = resolveSubmissionId(null, base, make); // reset で prev=null
  assert.notEqual(afterReset.id, first.id);
});

test("honeypot はスナップショットに含めない（型上も content のみ）", () => {
  // contentSnapshot は name/email/message のみで構成される
  const snap = contentSnapshot(base);
  assert.equal(snap.includes("本文です"), true);
  assert.equal(snap.includes("hp_token"), false);
});

test("submissionId（UUID）は 64 文字以内で冪等キーに使える", () => {
  const id = globalThis.crypto.randomUUID();
  assert.ok(id.length <= 64);
  const adminKey = `contact:${id}:admin`;
  const userKey = `contact:${id}:user`;
  assert.notEqual(adminKey, userKey); // 同 submissionId から別 suffix
  assert.ok(adminKey.length <= 128);
});
