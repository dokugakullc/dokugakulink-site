// Turnstile クライアント純粋関数のテスト（DOM 非依存・新規依存なし）。
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isTurnstileSiteConfigured,
  isTurnstileFlagEnabled,
  isTurnstileWidgetActive,
  canSubmitTurnstile,
  turnstilePayloadField,
  TURNSTILE_FIELD,
} from "../src/lib/turnstileClient";

// ── 明示的な有効化フラグ ──────────────────────────────────────────
test('有効化フラグ: 完全一致の "true" だけ true', () => {
  assert.equal(isTurnstileFlagEnabled("true"), true);
});
test("有効化フラグ: 未設定/空/false/曖昧値は false（曖昧 truthy 判定をしない）", () => {
  for (const v of [undefined, null, "", "false", "FALSE", "TRUE", "True", "1", "0", "yes", "on", " true", "true "]) {
    assert.equal(isTurnstileFlagEnabled(v), false, `flag=${JSON.stringify(v)}`);
  }
});

// ── widget 有効判定（フラグ + SiteKey の両方） ────────────────────
test("widget 有効: フラグ true ＋ SiteKey あり → true", () => {
  assert.equal(isTurnstileWidgetActive("true", "0xSITEKEY"), true);
});
test("widget 有効: フラグ未設定/false は SiteKey があっても false（kill switch）", () => {
  assert.equal(isTurnstileWidgetActive(undefined, "0xSITEKEY"), false);
  assert.equal(isTurnstileWidgetActive("", "0xSITEKEY"), false);
  assert.equal(isTurnstileWidgetActive("false", "0xSITEKEY"), false);
  assert.equal(isTurnstileWidgetActive("1", "0xSITEKEY"), false);
});
test("widget 有効: フラグ true でも SiteKey 未設定なら false", () => {
  assert.equal(isTurnstileWidgetActive("true", undefined), false);
  assert.equal(isTurnstileWidgetActive("true", ""), false);
  assert.equal(isTurnstileWidgetActive("true", "   "), false);
});

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
