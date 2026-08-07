// 広告流入パラメータ（UTM / fbclid）を「初回接触（first-touch）」で保持するユーティリティ。
//
// 保存先は TTL 付き localStorage を第一候補とする。localStorage は同一オリジンの
// 全タブで共有され、タブを閉じても残るため、セッションをまたいだ広告流入
// （別タブ・再訪）でも first-touch を復元できる。localStorage が使えない環境
// （プライベートモード等）では従来どおり sessionStorage へ安全にフォールバックする。
// 旧実装が sessionStorage に残した生データも読み取り、可能なら localStorage へ移行する。
//
// 保存するのは UTM / fbclid / 着地URL / リファラーのみ。氏名・メール等の個人情報は保存しない。
// 着地URL・リファラーは origin + pathname へ縮約し、クエリは許可済み（utm_* / fbclid）のみ、
// ハッシュは常に除去する（URL に混入した email / token 等を保存しない）。サニタイズは
// 書き込み直前と読み出し時の両方で行う。getAttribution() の戻り値は従来と同じ Attribution 形。

const STORAGE_KEY = "uk_attribution";

/** first-touch を保持する期間。変更しやすいよう定数化（現行: 7日間）。 */
export const ATTRIBUTION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// 各文字列の最大長。UTM 値と URL で分ける。
const MAX_VALUE_LEN = 200;
const MAX_URL_LEN = 512;

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  landing_url?: string;
  referrer?: string;
};

// 保存を許可するキー（allowlist）。ここに無いキー（＝PII等）は保存も復元もしない。
const ALLOWED_KEYS: readonly (keyof Attribution)[] = [
  ...UTM_KEYS,
  "fbclid",
  "landing_url",
  "referrer",
];

// 着地URL のクエリで保存を許可するパラメータ（それ以外のクエリは捨てる）。
const URL_KEEP_PARAMS: readonly string[] = [...UTM_KEYS, "fbclid"];

// 保存形式。savedAt=null は旧 sessionStorage の生データ（タイムスタンプ無し）を表す。
type Stored = { data: Attribution; savedAt: number | null };

// 制御文字を除去し最大長で切り詰める（Sheets 側の破損・過長を避ける）。
function sanitize(value: string, maxLen = MAX_VALUE_LEN): string {
  return value.replace(/[\r\n\t]/g, " ").slice(0, maxLen);
}

// http(s) URL を「origin + pathname（＋許可クエリのみ）」へ縮約する。
// ハッシュ・許可外クエリは除去。非 http(s)・解釈不能・空は "" を返す（例外を投げない）。
function scrubUrl(raw: string, keepParams: readonly string[] = []): string {
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    let out = url.origin + url.pathname;
    if (keepParams.length) {
      const kept = new URLSearchParams();
      for (const k of keepParams) {
        const v = url.searchParams.get(k);
        if (v) kept.set(k, v);
      }
      const qs = kept.toString();
      if (qs) out += "?" + qs;
    }
    return sanitize(out, MAX_URL_LEN);
  } catch {
    return "";
  }
}

// allowlist に該当する値のみを取り出し再サニタイズする（破損・注入・PII 混入への耐性）。
// landing_url / referrer は URL 縮約もかける。書き込み直前・読み出し時の双方で使う。
function sanitizeAttribution(rec: Record<string, unknown>): Attribution {
  const out: Attribution = {};
  for (const key of ALLOWED_KEYS) {
    const v = rec[key];
    if (typeof v !== "string" || !v) continue;
    if (key === "landing_url") {
      const s = scrubUrl(v, URL_KEEP_PARAMS);
      if (s) out.landing_url = s;
    } else if (key === "referrer") {
      const s = scrubUrl(v); // origin + pathname のみ（クエリ・ハッシュ除去）
      if (s) out.referrer = s;
    } else {
      out[key] = sanitize(v);
    }
  }
  return out;
}

// localStorage / sessionStorage を安全に取得する。アクセス自体が例外を投げる環境や、
// 書き込み不可（プライベートモードの一部）では null を返す。
function safeStorage(getStore: () => Storage): Storage | null {
  try {
    const store = getStore();
    const probe = "__uk_probe__";
    store.setItem(probe, "1");
    store.removeItem(probe);
    return store;
  } catch {
    return null;
  }
}

function localStore(): Storage | null {
  return safeStorage(() => window.localStorage);
}

function sessionStore(): Storage | null {
  return safeStorage(() => window.sessionStorage);
}

// 保存文字列を Stored へ復元する。新形式 {data, savedAt} と、旧生データ（Attribution 直）
// の両方を受け付ける。復元時にも sanitizeAttribution を通す。壊れた JSON や未知の形は null。
function parseStored(raw: string | null): Stored | null {
  if (!raw) return null;
  try {
    const obj: unknown = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return null;
    const rec = obj as Record<string, unknown>;

    // 新形式: { data: {...}, savedAt: number }
    if (typeof rec.savedAt === "number" && rec.data && typeof rec.data === "object") {
      return { data: sanitizeAttribution(rec.data as Record<string, unknown>), savedAt: rec.savedAt };
    }

    // 旧形式: Attribution を直接保存（savedAt 無し）。既知キーを1つでも含めば採用。
    const hasKnown = ALLOWED_KEYS.some((k) => typeof rec[k] === "string");
    if (hasKnown) return { data: sanitizeAttribution(rec), savedAt: null };

    return null;
  } catch {
    return null;
  }
}

// TTL 判定。savedAt=null（旧データ）は期限切れ扱いにせず移行対象とする
// （sessionStorage はセッション限定なので古くなり得ない）。
function isExpired(stored: Stored): boolean {
  if (stored.savedAt === null) return false;
  return Date.now() - stored.savedAt > ATTRIBUTION_TTL_MS;
}

function serialize(stored: Stored): string {
  return JSON.stringify({ data: stored.data, savedAt: stored.savedAt ?? Date.now() });
}

// 現在有効な first-touch を返す。localStorage を優先し、無ければ sessionStorage を見る。
// sessionStorage 側に有効データがあり localStorage が使える場合は移行する（＝再訪で復元可能に）。
// 期限切れは削除する。副作用（移行・削除）はあるが読み取り兼用。
function loadValid(): Attribution | null {
  const local = localStore();
  if (local) {
    const s = parseStored(local.getItem(STORAGE_KEY));
    if (s) {
      if (isExpired(s)) {
        try {
          local.removeItem(STORAGE_KEY);
        } catch {
          /* noop */
        }
      } else {
        return s.data;
      }
    }
  }

  const session = sessionStore();
  if (session) {
    const s = parseStored(session.getItem(STORAGE_KEY));
    if (s) {
      if (isExpired(s)) {
        try {
          session.removeItem(STORAGE_KEY);
        } catch {
          /* noop */
        }
      } else {
        // 移行: localStorage が使えるなら first-touch を引き継ぎ、sessionStorage は片付ける。
        if (local) {
          try {
            local.setItem(STORAGE_KEY, serialize({ data: s.data, savedAt: s.savedAt ?? Date.now() }));
            session.removeItem(STORAGE_KEY);
          } catch {
            /* 移行失敗時はそのまま session 側の値を使う */
          }
        }
        return s.data;
      }
    }
  }

  return null;
}

// 例外を投げずに現在ページの href / referrer を取り出す。
function currentHref(): string {
  try {
    return typeof window.location?.href === "string" ? window.location.href : "";
  } catch {
    return "";
  }
}

function currentReferrer(): string {
  try {
    return typeof document !== "undefined" && typeof document.referrer === "string" ? document.referrer : "";
  } catch {
    return "";
  }
}

// 現在の URL から流入シグナルを読む。UTM も fbclid も無ければ null。
// landing_url / referrer は scrubUrl で縮約してから格納する。
function readSignalFromUrl(): Attribution | null {
  let search = "";
  try {
    search = window.location?.search ?? "";
  } catch {
    search = "";
  }
  const params = new URLSearchParams(search);
  const data: Attribution = {};

  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) data[key] = sanitize(v);
  }
  const fbclid = params.get("fbclid");
  if (fbclid) data.fbclid = sanitize(fbclid);

  if (Object.keys(data).length === 0) return null;

  const landing = scrubUrl(currentHref(), URL_KEEP_PARAMS);
  if (landing) data.landing_url = landing;
  const ref = scrubUrl(currentReferrer());
  if (ref) data.referrer = ref;

  return data;
}

// first-touch を保存する。書き込み直前に再サニタイズし、localStorage 優先、
// 不可なら sessionStorage へフォールバックする。
function persist(stored: Stored): void {
  const clean: Stored = {
    data: sanitizeAttribution(stored.data as Record<string, unknown>),
    savedAt: stored.savedAt,
  };
  const payload = serialize(clean);
  const local = localStore();
  if (local) {
    try {
      local.setItem(STORAGE_KEY, payload);
      return;
    } catch {
      /* localStorage 書き込み不可 → session へ */
    }
  }
  const session = sessionStore();
  if (session) {
    try {
      session.setItem(STORAGE_KEY, payload);
    } catch {
      /* どちらも不可でもフォームは動作させる */
    }
  }
}

/**
 * 初回流入時のみ UTM / fbclid / 着地URL / リファラーを保存する（first-touch）。
 * TTL（既定7日）内の既存 first-touch は上書きしない＝広告クリックの帰属を最後まで保つ。
 * 期限切れ後に UTM 付きで再訪した場合は新しい流入で更新する。
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    // 有効な first-touch があれば維持（必要なら sessionStorage→localStorage の移行だけ行う）。
    if (loadValid()) return;

    const data = readSignalFromUrl();
    if (!data) return; // 自然流入（シグナル無し）は保存しない

    persist({ data, savedAt: Date.now() });
  } catch {
    // ストレージ不可（プライベートモード等）でもフォームは動作させる
  }
}

/** 保存済みの帰属情報を取得する。無ければ空オブジェクト。戻り値の形は従来どおり。 */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return loadValid() ?? {};
  } catch {
    return {};
  }
}
