// TTL付き localStorage による first-touch 帰属保持のテスト。
// ブラウザ globals（window / document / Storage / Date.now）を手動スタブする。
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { captureAttribution, getAttribution, ATTRIBUTION_TTL_MS } from "../src/lib/utm";
import { buildGasBody } from "../src/lib/registerPayload";

// ── ストレージのモック ──────────────────────────────────────────────
function makeStorage(): Storage {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => {
      m.set(k, String(v));
    },
    removeItem: (k: string) => {
      m.delete(k);
    },
    clear: () => m.clear(),
    key: (i: number) => Array.from(m.keys())[i] ?? null,
    get length() {
      return m.size;
    },
  } as unknown as Storage;
}

// setItem が常に例外 → プライベートモード等で「利用不可」を模す。
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

const LP = "https://dokugakulink.com/landing/takken";
const AD_A = "?utm_source=meta&utm_medium=paid_social&utm_campaign=prelaunch_202607&utm_content=ad_a_navigation&fbclid=FB_A";
const AD_B = "?utm_source=meta&utm_medium=paid_social&utm_campaign=prelaunch_202607&utm_content=ad_b_app_screen&fbclid=FB_B";

type EnvOpts = { url?: string; referrer?: string; local?: Storage; session?: Storage };

function setEnv(opts: EnvOpts = {}): { local: Storage; session: Storage } {
  const url = new URL(opts.url ?? LP);
  const local = opts.local ?? makeStorage();
  const session = opts.session ?? makeStorage();
  (globalThis as unknown as { window: unknown }).window = {
    location: { search: url.search, pathname: url.pathname, href: url.href },
    localStorage: local,
    sessionStorage: session,
  };
  (globalThis as unknown as { document: unknown }).document = { referrer: opts.referrer ?? "" };
  return { local, session };
}

const realDateNow = Date.now;
let nowMs = 1_700_000_000_000;
function setNow(ms: number) {
  nowMs = ms;
}

beforeEach(() => {
  nowMs = 1_700_000_000_000;
  Date.now = () => nowMs;
});

afterEach(() => {
  Date.now = realDateNow;
  delete (globalThis as unknown as { window?: unknown }).window;
  delete (globalThis as unknown as { document?: unknown }).document;
});

function stored(storage: Storage): { data: Record<string, string>; savedAt: number } | null {
  const raw = storage.getItem("uk_attribution");
  return raw ? JSON.parse(raw) : null;
}

// ── 1. 初回UTMの保存 ────────────────────────────────────────────────
test("初回UTM: localStorage に TTL付きで保存される", () => {
  const { local, session } = setEnv({ url: LP + AD_A, referrer: "https://l.facebook.com/" });
  captureAttribution();

  const s = stored(local);
  assert.ok(s, "localStorage に保存される");
  assert.equal(s!.savedAt, nowMs, "savedAt が現在時刻");
  assert.equal(s!.data.utm_content, "ad_a_navigation");
  assert.equal(s!.data.utm_source, "meta");
  assert.equal(s!.data.fbclid, "FB_A");
  assert.ok(s!.data.landing_url, "着地URLを保持");
  assert.equal(s!.data.referrer, "https://l.facebook.com/");
  assert.equal(stored(session), null, "sessionStorage は使わない（localStorage 利用可時）");
  assert.equal(getAttribution().utm_content, "ad_a_navigation");
});

// ── 2. 有効期限内の first-touch 非上書き ────────────────────────────
test("first-touch: TTL内は新しい流入で上書きしない", () => {
  const { local } = setEnv({ url: LP + AD_A });
  captureAttribution(); // A で first-touch

  // 同じ localStorage を保ったまま、別UTM(B)で再訪（TTL内・少し経過）
  setNow(nowMs + 60 * 60 * 1000); // +1h
  setEnv({ url: LP + AD_B, local });
  captureAttribution();

  assert.equal(getAttribution().utm_content, "ad_a_navigation", "最初のA帰属を維持");
});

// ── 3. TTL経過後の削除と再取得 ──────────────────────────────────────
test("TTL経過: 期限切れは破棄し、新しいUTMで更新する", () => {
  const { local } = setEnv({ url: LP + AD_A });
  captureAttribution();

  // TTL を 1ms 超過して B で再訪
  setNow(nowMs + ATTRIBUTION_TTL_MS + 1);
  setEnv({ url: LP + AD_B, local });
  captureAttribution();

  assert.equal(getAttribution().utm_content, "ad_b_app_screen", "期限切れ後は新しいBで更新");
  assert.equal(stored(local)!.savedAt, nowMs, "savedAt も更新される");
});

test("TTL経過: 期限切れ後にUTM無しで訪問すると空になる（古い帰属は残さない）", () => {
  const { local } = setEnv({ url: LP + AD_A });
  captureAttribution();
  setNow(nowMs + ATTRIBUTION_TTL_MS + 1);
  setEnv({ url: LP, local }); // UTM 無し
  captureAttribution();
  assert.deepEqual(getAttribution(), {}, "期限切れは削除され、UTM無しでは復活しない");
});

// ── 4. 別タブでの復元（localStorage 共有） ──────────────────────────
test("別タブ: 同一 localStorage を共有すれば UTM 無しの別タブでも復元", () => {
  const { local } = setEnv({ url: LP + AD_B });
  captureAttribution(); // タブ1（広告クリック）

  // タブ2: 同じ localStorage、session は新規、URL に UTM 無し
  setEnv({ url: LP, local, session: makeStorage() });
  assert.equal(getAttribution().utm_content, "ad_b_app_screen", "別タブで first-touch を復元");
});

// ── 5. 再訪時の復元（タブを閉じて再訪＝session は新規） ──────────────
test("再訪: localStorage は残るので session が新規でも復元できる", () => {
  const { local } = setEnv({ url: LP + AD_A });
  captureAttribution();

  // 再訪: localStorage 維持・session 破棄(新規)・UTM 無し・TTL内
  setNow(nowMs + 2 * 24 * 60 * 60 * 1000); // +2日
  setEnv({ url: LP, local, session: makeStorage() });
  assert.equal(getAttribution().utm_content, "ad_a_navigation", "再訪でも復元");
});

// ── 6. sessionStorage からの移行 ────────────────────────────────────
test("移行: 旧 sessionStorage の生データを localStorage へ引き継ぐ", () => {
  const local = makeStorage();
  const session = makeStorage();
  // 旧実装が残した「生の Attribution」（savedAt 無し）
  session.setItem(
    "uk_attribution",
    JSON.stringify({ utm_source: "meta", utm_content: "ad_b_app_screen", landing_url: "/landing/takken" }),
  );
  setEnv({ url: LP, local, session });

  const got = getAttribution();
  assert.equal(got.utm_content, "ad_b_app_screen", "旧 session データを復元");
  assert.ok(stored(local), "localStorage へ移行される");
  assert.equal(stored(local)!.data.utm_content, "ad_b_app_screen");
  assert.equal(session.getItem("uk_attribution"), null, "移行後 session は片付けられる");
});

// ── 7. localStorage 利用不可時のフォールバック ──────────────────────
test("フォールバック: localStorage 不可なら sessionStorage に保存・復元", () => {
  const local = unavailableStorage();
  const session = makeStorage();
  setEnv({ url: LP + AD_A, local, session });
  captureAttribution();

  assert.ok(stored(session), "sessionStorage にフォールバック保存");
  assert.equal(getAttribution().utm_content, "ad_a_navigation", "sessionStorage から復元");
});

// ── 8. 不正・破損 JSON への耐性 ─────────────────────────────────────
test("耐性: 破損した保存値でも例外を投げず空を返す", () => {
  const local = makeStorage();
  local.setItem("uk_attribution", "{not valid json");
  setEnv({ url: LP, local });
  assert.deepEqual(getAttribution(), {}, "破損値は無視して空");

  // 既知キーを含まないオブジェクトも無視
  const local2 = makeStorage();
  local2.setItem("uk_attribution", JSON.stringify({ foo: "bar", savedAt: "nope" }));
  setEnv({ url: LP, local: local2 });
  assert.deepEqual(getAttribution(), {}, "未知形は無視して空");
});

test("耐性: PIIらしきキーは復元しない（allowlist）", () => {
  const local = makeStorage();
  local.setItem(
    "uk_attribution",
    JSON.stringify({ data: { utm_source: "meta", email: "taro@example.com", name: "山田" }, savedAt: nowMs }),
  );
  setEnv({ url: LP, local });
  const got = getAttribution() as Record<string, string>;
  assert.equal(got.utm_source, "meta");
  assert.equal(got.email, undefined, "email は保持しない");
  assert.equal(got.name, undefined, "name は保持しない");
});

// ── 9. UTM無しの自然流入で既存帰属が消えない ────────────────────────
test("自然流入: UTM無し訪問は既存 first-touch を消さない", () => {
  const { local } = setEnv({ url: LP + AD_A });
  captureAttribution();

  // 同じ localStorage で UTM 無し訪問（別ページ等）
  setEnv({ url: "https://dokugakulink.com/contact", local });
  captureAttribution();
  assert.equal(getAttribution().utm_content, "ad_a_navigation", "自然流入で帰属を維持");

  // そもそも何も無い状態で UTM 無し訪問しても保存しない
  setEnv({ url: LP });
  captureAttribution();
  assert.deepEqual(getAttribution(), {}, "シグナル無しでは保存しない");
});

// ── 10. フォーム送信ペイロードが従来どおり ──────────────────────────
test("ペイロード: getAttribution はフラットな utm_* のみ返し、buildGasBody 形が不変", () => {
  setEnv({ url: LP + AD_A, referrer: "https://l.facebook.com/" });
  captureAttribution();

  const attribution = getAttribution() as Record<string, string>;
  // ラッパー(data/savedAt)が漏れていないこと
  assert.equal("data" in attribution, false);
  assert.equal("savedAt" in attribution, false);
  // 許可キーのみ
  const allowed = new Set([
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "landing_url",
    "referrer",
  ]);
  for (const k of Object.keys(attribution)) assert.ok(allowed.has(k), `未許可キー: ${k}`);

  // buildGasBody は attribution をトップレベルへ平坦化し token を最後に置く（従来仕様）
  const body = buildGasBody(
    { email: "taro@example.com", interest: "takken", problem: "forget", source: "landing_takken", userAgent: "UA", attribution },
    "secret-token",
  );
  assert.equal(body.utm_content, "ad_a_navigation", "utm_content がトップレベル");
  assert.equal(body.email, "taro@example.com");
  assert.equal(body.token, "secret-token");
  assert.equal(body.data, undefined);
  assert.equal(body.savedAt, undefined);
});

// ── 11. 着地URLの任意クエリ（email/token等）を保存しない ────────────
test("スクラブ: 着地URLの email/token 等の任意クエリは保存しない", () => {
  const { local } = setEnv({
    url: LP + "?utm_content=ad_a_navigation&fbclid=FB_A&email=taro@example.com&token=secret123&foo=bar",
  });
  captureAttribution();
  const lu = stored(local)!.data.landing_url!;
  assert.ok(lu, "landing_url は保存される");
  assert.ok(!lu.includes("email"), "email キー無し");
  assert.ok(!lu.includes("taro@example.com"), "メール値無し");
  assert.ok(!lu.includes("token"), "token キー無し");
  assert.ok(!lu.includes("secret123"), "token 値無し");
  assert.ok(!lu.includes("foo"), "任意クエリ無し");
  assert.ok(lu.includes("utm_content=ad_a_navigation"), "utm_content は保持");
  assert.ok(lu.includes("fbclid=FB_A"), "fbclid は保持");
  assert.ok(lu.startsWith("https://dokugakulink.com/landing/takken"), "origin+pathname");
});

// ── 12. UTM / fbclid は従来どおり取得 ───────────────────────────────
test("スクラブ: UTM と fbclid は従来どおり取得できる", () => {
  const { local } = setEnv({ url: LP + AD_A });
  captureAttribution();
  const d = stored(local)!.data;
  assert.equal(d.utm_source, "meta");
  assert.equal(d.utm_medium, "paid_social");
  assert.equal(d.utm_campaign, "prelaunch_202607");
  assert.equal(d.utm_content, "ad_a_navigation");
  assert.equal(d.fbclid, "FB_A");
});

// ── 13. referrer の query/hash 除去 ─────────────────────────────────
test("スクラブ: referrer の query/hash を除去し origin+pathname のみ保存", () => {
  const { local } = setEnv({
    url: LP + AD_A,
    referrer: "https://www.google.com/search?q=secret+email#section",
  });
  captureAttribution();
  assert.equal(stored(local)!.data.referrer, "https://www.google.com/search");
});

// ── 14. 不正 / 非http / javascript: / 長すぎ を安全処理 ─────────────
test("スクラブ: 不正・非http・javascript・長すぎ を安全処理（例外なし）", () => {
  setEnv({ url: LP + AD_A, referrer: "javascript:alert(1)" });
  captureAttribution();
  assert.equal(getAttribution().referrer, undefined, "javascript: は保存しない");
  assert.equal(getAttribution().utm_content, "ad_a_navigation", "UTM は維持");

  setEnv({ url: LP + AD_B, referrer: "not a valid url" });
  captureAttribution();
  assert.equal(getAttribution().referrer, undefined, "不正referrerは無視");

  setEnv({ url: LP + AD_B, referrer: "ftp://example.com/x" });
  captureAttribution();
  assert.equal(getAttribution().referrer, undefined, "非http(s)は無視");

  const longVal = "x".repeat(1000);
  setEnv({ url: LP + "?utm_content=" + longVal });
  captureAttribution();
  assert.ok((getAttribution().landing_url ?? "").length <= 512, "landing_url は最大長以内");
  assert.ok((getAttribution().utm_content ?? "").length <= 200, "utm_content も最大長以内");
});

// ── 15. 旧 sessionStorage 移行時にもサニタイズ ──────────────────────
test("移行: 旧 sessionStorage の landing_url/referrer もサニタイズされる", () => {
  const local = makeStorage();
  const session = makeStorage();
  session.setItem(
    "uk_attribution",
    JSON.stringify({
      utm_source: "meta",
      utm_content: "ad_b_app_screen",
      landing_url: "https://dokugakulink.com/landing/takken?utm_source=meta&email=taro@example.com&token=abc",
      referrer: "https://ref.example.com/path?x=secret#h",
    }),
  );
  setEnv({ url: LP, local, session });

  const got = getAttribution();
  assert.equal(got.utm_content, "ad_b_app_screen");
  assert.ok(!(got.landing_url ?? "").includes("email"), "移行時 email 除去");
  assert.ok(!(got.landing_url ?? "").includes("token"), "移行時 token 除去");
  assert.ok((got.landing_url ?? "").includes("utm_source=meta"), "utm は保持");
  assert.equal(got.referrer, "https://ref.example.com/path", "referrer は query/hash 除去");
  assert.ok(!(stored(local)!.data.landing_url ?? "").includes("taro@example.com"), "localStorage側も浄化");
});

// ── 16. 送信ペイロードに URL 由来の PII が混入しない ────────────────
test("ペイロード: URL に混ぜた email/token が送信データに混入しない", () => {
  setEnv({ url: LP + "?utm_content=ad_a_navigation&fbclid=FB_A&email=taro@example.com&token=secret123" });
  captureAttribution();
  const attribution = getAttribution() as Record<string, string>;
  const body = buildGasBody(
    { email: "user@input.com", interest: "takken", problem: "forget", source: "landing_takken", userAgent: "UA", attribution },
    "shared-secret",
  );
  const serialized = JSON.stringify(body);
  assert.ok(!serialized.includes("taro@example.com"), "URL の email は混入しない");
  assert.ok(!serialized.includes("secret123"), "URL の token は混入しない");
  assert.equal(body.email, "user@input.com", "正規のフォーム入力emailは維持");
  assert.equal(body.utm_content, "ad_a_navigation");
});
