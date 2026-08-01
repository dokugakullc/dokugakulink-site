// Turnstile クライアント純粋関数のテスト（DOM 非依存・新規依存なし）。
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isTurnstileSiteConfigured,
  canSubmitTurnstile,
  turnstilePayloadField,
  TURNSTILE_FIELD,
} from "../src/lib/turnstileClient";

test("SiteKey 判定: 未設定/空/空白 → false、値あり → true", () => {
  assert.equal(isTurnstileSiteConfigured(undefined), false);
  assert.equal(isTurnstileSiteConfigured(null), false);
  assert.equal(isTurnstileSiteConfigured(""), false);
  assert.equal(isTurnstileSiteConfigured("   "), false);
  assert.equal(isTurnstileSiteConfigured("0x4AAA..."), true);
});

test("送信可否: SiteKey なし → widget 不要で常に送信可（token 有無に関係なく true）", () => {
  assert.equal(canSubmitTurnstile({ siteConfigured: false, token: null }), true);
  assert.equal(canSubmitTurnstile({ siteConfigured: false, token: "t" }), true);
});

test("送信可否: SiteKey あり → token 必須（未取得は不可、取得後は可）", () => {
  assert.equal(canSubmitTurnstile({ siteConfigured: true, token: null }), false); // 未取得
  assert.equal(canSubmitTurnstile({ siteConfigured: true, token: "" }), false); // 空
  assert.equal(canSubmitTurnstile({ siteConfigured: true, token: "abc" }), true); // 取得済み
});

test("送信可否: 期限切れ/エラーで token=null → 不可（widget reset 後の再取得を促す）", () => {
  assert.equal(canSubmitTurnstile({ siteConfigured: true, token: null }), false);
});

test("payload フィールド: token あるときだけ turnstileToken を載せる", () => {
  assert.deepEqual(turnstilePayloadField("abc"), { [TURNSTILE_FIELD]: "abc" });
  assert.equal(TURNSTILE_FIELD, "turnstileToken");
  assert.deepEqual(turnstilePayloadField(null), {});
  assert.deepEqual(turnstilePayloadField(""), {});
});
