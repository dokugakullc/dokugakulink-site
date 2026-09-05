// track.ts のイベント分配（fan-out）を直接検証する。
//
// 方針: モジュールモック（要 --experimental-test-module-mocks）を使わず、実装をそのまま import し、
//   - GA4 シンク  … window.gtag をスパイ（gtag.ts は window.gtag を呼ぶ）
//   - Meta シンク … window.fbq をスパイ（meta.ts は window.fbq を呼ぶ）
//   - PostHog     … posthog-js シングルトンの capture をスパイ＋__loaded=true
// を差し込む。UTM は実 utm.ts を localStorage 経由で駆動（captureAttribution → getAttribution）。
// 本番コードは一切変更していない。
import { test, before, after, beforeEach, mock } from "node:test";
import assert from "node:assert/strict";

// gtag.ts / meta.ts / posthog.ts はモジュール読込時に env を読む。import 前に設定する。
process.env.NEXT_PUBLIC_GA_ID = "G-TEST";
process.env.NEXT_PUBLIC_META_PIXEL_ID = "META_TEST";
process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test";

// ── スパイ ──────────────────────────────────────────────
const gtag = mock.fn();
const fbq = mock.fn();
const phCapture = mock.fn();

// ── ブラウザ globals（永続 window。storage は Map を clear して再利用）──
const localMap = new Map<string, string>();
const sessionMap = new Map<string, string>();
function mapStorage(m: Map<string, string>): Storage {
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

const nav = { userAgent: "node-test", language: "ja", languages: ["ja"] };
const win: {
  location: { search: string; pathname: string; href: string };
  localStorage: Storage;
  sessionStorage: Storage;
  gtag: typeof gtag;
  fbq: typeof fbq;
  navigator: typeof nav;
} = {
  location: { search: "", pathname: "/", href: "https://dokugakulink.com/" },
  localStorage: mapStorage(localMap),
  sessionStorage: mapStorage(sessionMap),
  gtag,
  fbq,
  navigator: nav,
};

// 後処理で確実に復元できるよう、上書き前の元値を保存する（元々存在したかも記録）。
const g = globalThis as unknown as { window?: unknown; document?: unknown };
const hadWindow = "window" in globalThis;
const hadDocument = "document" in globalThis;
const origWindow = g.window;
const origDocument = g.document;
const realDateNow = Date.now;

g.window = win;
g.document = { referrer: "", title: "", location: win.location };

// モジュール（実装）と posthog シングルトンは before で確定。
let track: typeof import("@/lib/track");
let utm: typeof import("@/lib/utm");
let posthog: { __loaded?: boolean; capture: unknown };
let origPhLoaded: boolean | undefined;
let origPhCapture: unknown;

before(async () => {
  posthog = (await import("posthog-js")).default as unknown as {
    __loaded?: boolean;
    capture: unknown;
  };
  origPhLoaded = posthog.__loaded;
  origPhCapture = posthog.capture;
  posthog.__loaded = true;
  posthog.capture = phCapture; // ready() を満たしたうえで capture をスパイ
  utm = await import("@/lib/utm");
  track = await import("@/lib/track");
});

// テスト失敗時も含め、ファイル内の全テスト後に必ず後処理する。
after(() => {
  Date.now = realDateNow;
  // window / document は元の状態へ復元（元々無ければ削除）。
  if (hadWindow) g.window = origWindow;
  else delete g.window;
  if (hadDocument) g.document = origDocument;
  else delete g.document;
  // posthog ダブルの状態も元へ戻す（他テストへ影響させない）。
  if (posthog) {
    posthog.__loaded = origPhLoaded;
    posthog.capture = origPhCapture;
  }
});

// 現在の URL を差し替え、first-touch を仕込む（TTL 内は上書きされない）。
function primeAttribution(search: string): void {
  Date.now = () => 1_000_000;
  localMap.clear();
  sessionMap.clear();
  win.location = {
    search,
    pathname: "/landing/takken",
    href: `https://dokugakulink.com/landing/takken${search}`,
  };
  utm.captureAttribution();
}

const AD_SEARCH =
  "?utm_source=meta&utm_medium=paid_social&utm_campaign=prelaunch_202608&utm_content=ad_a_15q&fbclid=FB_A";

beforeEach(() => {
  gtag.mock.resetCalls();
  fbq.mock.resetCalls();
  phCapture.mock.resetCalls();
  primeAttribution(AD_SEARCH); // 既定は広告流入あり（UTM+fbclid）
});

// GA4: window.gtag("event", name, params) → params
function gaParams(name: string): Record<string, string> | undefined {
  const c = gtag.mock.calls.find((x) => x.arguments[0] === "event" && x.arguments[1] === name);
  return c?.arguments[2] as Record<string, string> | undefined;
}
function gaCount(name: string): number {
  return gtag.mock.calls.filter((x) => x.arguments[0] === "event" && x.arguments[1] === name).length;
}
// Meta: window.fbq("track"|"trackCustom", event, params) → params
function metaParams(event: string): Record<string, string> | undefined {
  const c = fbq.mock.calls.find((x) => x.arguments[1] === event);
  return c?.arguments[2] as Record<string, string> | undefined;
}
function metaStdCount(event: string): number {
  return fbq.mock.calls.filter((x) => x.arguments[0] === "track" && x.arguments[1] === event).length;
}
// PostHog: capture(event, props) → props
function phParams(event: string): Record<string, string> | undefined {
  const c = phCapture.mock.calls.find((x) => x.arguments[0] === event);
  return c?.arguments[1] as Record<string, string> | undefined;
}

test("GA4/PostHog には first-touch UTM が付与される", () => {
  track.trackLandingPageView({ source: "hero" });
  for (const p of [gaParams("landing_page_view"), phParams("landing_page_view")]) {
    assert.ok(p, "event fired");
    assert.equal(p!.utm_source, "meta");
    assert.equal(p!.utm_medium, "paid_social");
    assert.equal(p!.utm_campaign, "prelaunch_202608");
    assert.equal(p!.utm_content, "ad_a_15q");
    assert.equal(p!.source, "hero");
  }
});

test("Meta イベントには UTM も fbclid も付与されない", () => {
  track.trackLandingPageView({ source: "hero" });
  assert.deepEqual(metaParams("landing_page_view"), { source: "hero" });
});

test("App Store CTA: GA4/PostHog/Metaへ1回ずつ送信し、Leadには数えない", () => {
  track.trackAppStoreCtaClicked({ source: "landing_takken", location: "hero" });

  assert.equal(gaCount("app_store_cta_clicked"), 1);
  assert.equal(gaParams("app_store_cta_clicked")!.utm_campaign, "prelaunch_202608");
  assert.equal(gaParams("app_store_cta_clicked")!.location, "hero");
  assert.equal(phParams("app_store_cta_clicked")!.utm_source, "meta");
  assert.deepEqual(metaParams("app_store_cta_clicked"), {
    source: "landing_takken",
    location: "hero",
  });
  assert.equal(metaStdCount("Lead"), 0);
});

test("GA4/PostHog/Meta のいずれにも fbclid は流れない", () => {
  track.trackSubmitted({ source: "form" });
  for (const p of [gaParams("waitlist_submitted"), phParams("waitlist_submitted"), metaParams("Lead")]) {
    assert.ok(p);
    assert.equal("fbclid" in p!, false);
  }
});

test("新規登録成功: GA4 waitlist_submitted と Meta Lead がそれぞれ1回だけ", () => {
  track.trackSubmitted({ source: "form" });
  assert.equal(gaCount("waitlist_submitted"), 1);
  assert.equal(metaStdCount("Lead"), 1);
  assert.equal(gaParams("waitlist_submitted")!.utm_campaign, "prelaunch_202608");
  assert.equal("utm_source" in metaParams("Lead")!, false);
});

test("重複登録: Meta Lead（標準イベント）は呼ばれない", () => {
  track.trackDuplicate({ source: "form" });
  assert.equal(metaStdCount("Lead"), 0);
  // GA4 の duplicate は記録され UTM も付与
  assert.equal(gaCount("waitlist_duplicate"), 1);
  assert.equal(gaParams("waitlist_duplicate")!.utm_source, "meta");
});

test("登録失敗: Meta Lead は呼ばれない", () => {
  track.trackSubmissionFailed({ source: "form" });
  assert.equal(metaStdCount("Lead"), 0);
});

test("明示パラメータは保存済み UTM より優先される", () => {
  track.trackLandingPageView({ utm_source: "explicit", source: "x" });
  assert.equal(gaParams("landing_page_view")!.utm_source, "explicit");
  assert.equal(phParams("landing_page_view")!.utm_source, "explicit");
});

test("保存 UTM が無い（自然流入）なら GA4 へ UTM は付与されない", () => {
  primeAttribution(""); // UTM 無しで再訪 → first-touch 無し
  track.trackSubmitted({ source: "form" });
  assert.deepEqual(gaParams("waitlist_submitted"), { source: "form" });
  assert.equal(metaStdCount("Lead"), 1); // Lead は 1 回
});
