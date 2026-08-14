// F1: 分析イベント（GA4 / PostHog）へ付与する UTM プロパティの抽出テスト。
//
// 保証すること：
//   1. utm_source/medium/campaign/content/term のみを返す。
//   2. fbclid / landing_url / referrer は返さない（＝GA4/PostHog へ送らない）。
//   3. 空値・未設定キーは含めない。
//   4. first-touch：広告流入後に UTM の無いページへ遷移しても UTM は失われない
//      （localStorage 保持）→ そのまま分析イベントへ付与できる。
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  attributionEventProps,
  captureAttribution,
  getAttribution,
  type Attribution,
} from "../src/lib/utm";

// ── 1〜3: 純粋関数の抽出ルール ───────────────────────────────────────
test("attributionEventProps: utm_* のみを返し fbclid/landing_url/referrer は除外する", () => {
  const attr: Attribution = {
    utm_source: "meta",
    utm_medium: "paid_social",
    utm_campaign: "prelaunch_202608",
    utm_content: "ad_a_15q",
    utm_term: "takken",
    fbclid: "FB_XYZ",
    landing_url: "https://dokugakulink.com/landing/takken",
    referrer: "https://www.facebook.com/",
  };
  const props = attributionEventProps(attr);
  assert.deepEqual(props, {
    utm_source: "meta",
    utm_medium: "paid_social",
    utm_campaign: "prelaunch_202608",
    utm_content: "ad_a_15q",
    utm_term: "takken",
  });
  // 明示的に：識別子・URL 系は載らない
  assert.equal("fbclid" in props, false);
  assert.equal("landing_url" in props, false);
  assert.equal("referrer" in props, false);
});

test("attributionEventProps: 空・未設定キーは含めない", () => {
  assert.deepEqual(attributionEventProps({}), {});
  assert.deepEqual(
    attributionEventProps({ utm_source: "meta", utm_campaign: "" }),
    { utm_source: "meta" },
  );
});

test("attributionEventProps: fbclid だけの流入は空を返す（GA4/PostHog へ何も送らない）", () => {
  assert.deepEqual(attributionEventProps({ fbclid: "FB_ONLY" }), {});
});

// ── 4: first-touch がページ遷移をまたいで保持されることの実証 ──────────
const realDateNow = Date.now;

function makeStorage(): Storage {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => void m.set(k, String(v)),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
    key: (i: number) => Array.from(m.keys())[i] ?? null,
    get length() {
      return m.size;
    },
  } as unknown as Storage;
}

function setEnv(url: string, store: { local: Storage; session: Storage }): void {
  const u = new URL(url);
  (globalThis as unknown as { window: unknown }).window = {
    location: { search: u.search, pathname: u.pathname, href: u.href },
    localStorage: store.local,
    sessionStorage: store.session,
  };
  (globalThis as unknown as { document: unknown }).document = { referrer: "" };
}

beforeEach(() => {
  Date.now = () => 1_000_000;
});
afterEach(() => {
  Date.now = realDateNow;
  delete (globalThis as unknown as { window?: unknown }).window;
  delete (globalThis as unknown as { document?: unknown }).document;
});

test("first-touch: 広告流入で UTM を保存 → 非UTMページへ遷移しても UTM を保持し、分析プロパティへ付与できる", () => {
  // localStorage は同一オリジンの全タブ・遷移で共有されるため、遷移後も参照できる。
  const store = { local: makeStorage(), session: makeStorage() };

  // 1) 広告からの着地（UTM + fbclid あり）
  setEnv(
    "https://dokugakulink.com/landing/takken?utm_source=meta&utm_medium=paid_social&utm_campaign=prelaunch_202608&utm_content=ad_a_15q&fbclid=FB_A",
    store,
  );
  captureAttribution();

  // 2) サイト内を回遊し UTM の無いページへ（登録フォームがあるページ等）
  setEnv("https://dokugakulink.com/services/takken", store);

  const attr = getAttribution();
  // first-touch の UTM は失われていない
  assert.equal(attr.utm_source, "meta");
  assert.equal(attr.utm_campaign, "prelaunch_202608");
  assert.equal(attr.utm_content, "ad_a_15q");

  // 分析イベントへ付与されるのは utm_* のみ（fbclid は保持されていても送らない）
  const props = attributionEventProps(attr);
  assert.equal(props.utm_source, "meta");
  assert.equal(props.utm_campaign, "prelaunch_202608");
  assert.equal("fbclid" in props, false);
});
