// 実 utm.ts（getAttribution / captureAttribution / attributionEventProps）を用い、
// 「イベントへ実際に渡る UTM プロパティ」の層で以下を検証する。
//   - localStorage 不可時に sessionStorage フォールバックでも計測が成立する
//   - TTL 切れ後は古い UTM をイベントへ付与しない（空になる）
// ブラウザ globals（window/document/Storage/Date.now）は手動スタブ（utm.test.ts と同方式）。
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  captureAttribution,
  getAttribution,
  attributionEventProps,
  ATTRIBUTION_TTL_MS,
} from "@/lib/utm";

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

// setItem が常に例外 → localStorage 利用不可（プライベートモード等）を模す。
function unavailableStorage(): Storage {
  return {
    getItem: () => null,
    setItem: () => {
      throw new Error("QuotaExceeded");
    },
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  } as unknown as Storage;
}

function setEnv(url: string, local: Storage, session: Storage): void {
  const u = new URL(url);
  (globalThis as unknown as { window: unknown }).window = {
    location: { search: u.search, pathname: u.pathname, href: u.href },
    localStorage: local,
    sessionStorage: session,
  };
  (globalThis as unknown as { document: unknown }).document = { referrer: "" };
}

const realDateNow = Date.now;
const LP_WITH_AD =
  "https://dokugakulink.com/landing/takken?utm_source=meta&utm_medium=paid_social&utm_campaign=prelaunch_202608&utm_content=ad_a_15q&fbclid=FB_A";

beforeEach(() => {
  Date.now = () => 1_000_000;
});
afterEach(() => {
  Date.now = realDateNow;
  delete (globalThis as unknown as { window?: unknown }).window;
  delete (globalThis as unknown as { document?: unknown }).document;
});

test("フォールバック: localStorage 不可でも sessionStorage 保存で UTM がイベントへ付与できる", () => {
  const local = unavailableStorage();
  const session = makeStorage();

  setEnv(LP_WITH_AD, local, session);
  captureAttribution(); // localStorage 書込失敗 → sessionStorage に保存されるはず

  const props = attributionEventProps(getAttribution());
  assert.equal(props.utm_source, "meta");
  assert.equal(props.utm_campaign, "prelaunch_202608");
  assert.equal(props.utm_content, "ad_a_15q");
  // fbclid はイベントへは出さない
  assert.equal("fbclid" in props, false);
});

test("TTL 切れ: 期限経過後は古い UTM をイベントへ付与しない（空になる）", () => {
  const local = makeStorage();
  const session = makeStorage();

  // t0 で広告流入を保存
  Date.now = () => 1_000_000;
  setEnv(LP_WITH_AD, local, session);
  captureAttribution();
  assert.equal(attributionEventProps(getAttribution()).utm_source, "meta"); // 直後は有効

  // TTL を超えて経過し、UTM の無いページを訪問
  Date.now = () => 1_000_000 + ATTRIBUTION_TTL_MS + 1;
  setEnv("https://dokugakulink.com/services/takken", local, session);

  const props = attributionEventProps(getAttribution());
  assert.deepEqual(props, {}); // 期限切れの古い UTM は付与されない
});
