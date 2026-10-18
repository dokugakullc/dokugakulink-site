// App Store のキャンペーンリンク（pt / ct）の組み立てテスト。
import { test } from "node:test";
import assert from "node:assert/strict";
import { APP_STORE_URL, appStoreCampaignUrl } from "../src/lib/appStore";

test("プロバイダトークン未設定なら素の URL（ct も付けない）", () => {
  assert.equal(appStoreCampaignUrl("landing_takken-hero", ""), APP_STORE_URL);
});

test("設定時は pt・ct・mt=8 を付ける", () => {
  const url = new URL(appStoreCampaignUrl("landing_takken-hero", "123456"));
  assert.equal(url.origin + url.pathname, APP_STORE_URL);
  assert.equal(url.searchParams.get("pt"), "123456");
  assert.equal(url.searchParams.get("ct"), "landing_takken-hero");
  assert.equal(url.searchParams.get("mt"), "8");
});

test("ct は英数字・_・- に整え、40文字で切る", () => {
  const ct = new URL(appStoreCampaignUrl("News/Article ウカレル".padEnd(60, "x"), "1")).searchParams.get("ct")!;
  assert.match(ct, /^[a-z0-9_-]+$/);
  assert.ok(ct.length <= 40);
});
