// 広告流入パラメータ（UTM / fbclid）を「初回接触」で保持するユーティリティ。
// sessionStorage に保存するため、LP 内のクライアント遷移・再描画では失われず、
// 登録完了時に /api/register へ同送できる。個人情報は保持しない。

const STORAGE_KEY = "uk_attribution";

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

// 値が長すぎ／不正な場合の防御（Sheets 側の破損・PII 混入を避ける）
function sanitize(value: string): string {
  return value.replace(/[\r\n\t]/g, " ").slice(0, 200);
}

/**
 * 初回流入時のみ UTM / fbclid / 着地URL / リファラーを保存する（first-touch）。
 * 既に保存済みなら上書きしない＝広告クリックの帰属を最後まで保てる。
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {};

    for (const key of UTM_KEYS) {
      const v = params.get(key);
      if (v) data[key] = sanitize(v);
    }
    const fbclid = params.get("fbclid");
    if (fbclid) data.fbclid = sanitize(fbclid);

    // UTM も fbclid も無い自然流入では保存しない（ノイズを増やさない）
    const hasSignal = Object.keys(data).length > 0;
    if (!hasSignal) return;

    data.landing_url = sanitize(window.location.pathname + window.location.search);
    if (document.referrer) data.referrer = sanitize(document.referrer);

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage 不可（プライベートモード等）でもフォームは動作させる
  }
}

/** 保存済みの帰属情報を取得する。無ければ空オブジェクト。 */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
