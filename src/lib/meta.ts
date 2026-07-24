// Meta Pixel（ブラウザ計測）ラッパー。
// NEXT_PUBLIC_META_PIXEL_ID が未設定なら全て no-op になり、ページ・フォームは壊れない。
// PII（メールアドレス等）は Meta へ一切送らない（DEC-2026-007 の匿名送信方針に準拠）。

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Meta 標準イベント（例: "Lead"）を送る。 */
export function metaTrack(event: string, params?: Record<string, string | number>): void {
  if (typeof window === "undefined" || !window.fbq || !META_PIXEL_ID) return;
  window.fbq("track", event, params ?? {});
}

/** Meta カスタムイベント（例: "waitlist_cta_clicked"）を送る。 */
export function metaTrackCustom(event: string, params?: Record<string, string | number>): void {
  if (typeof window === "undefined" || !window.fbq || !META_PIXEL_ID) return;
  window.fbq("trackCustom", event, params ?? {});
}
