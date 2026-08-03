// Turnstile クライアント判定（純粋関数・DOM 非依存・テスト可能）。
// token を Analytics / localStorage / sessionStorage / Cookie へ出さない設計を支える最小ロジック。
// フィールド名は API payload の固定キー（allowlist 外＝保存・転送されない）。
export const TURNSTILE_FIELD = "turnstileToken" as const;

/** NEXT_PUBLIC_TURNSTILE_SITE_KEY が設定されていれば true（未設定＝widget 非描画・Turnstile 無効）。 */
export function isTurnstileSiteConfigured(siteKey: string | null | undefined): boolean {
  return Boolean(siteKey && siteKey.trim());
}

/**
 * 明示的な有効化フラグ（NEXT_PUBLIC_TURNSTILE_ENABLED）の判定。
 * 曖昧な truthy 判定はせず、文字列が完全に "true" のときだけ有効。
 * （未設定 / "" / "false" / "TRUE" / "1" / その他 は無効。）
 */
export function isTurnstileFlagEnabled(flag: string | null | undefined): boolean {
  return flag === "true";
}

/**
 * widget を描画・利用する条件（client / server で共通の有効化契約）。
 *  - 有効化フラグが "true"、かつ SiteKey が設定済みのときだけ true。
 *  - フラグが無効なら SiteKey があっても false（kill switch）。Secret はクライアントへ取り込まない。
 */
export function isTurnstileWidgetActive(
  flag: string | null | undefined,
  siteKey: string | null | undefined,
): boolean {
  return isTurnstileFlagEnabled(flag) && isTurnstileSiteConfigured(siteKey);
}

/**
 * 送信可否判定。
 *  - SiteKey 未設定（widget 不要）→ 常に送信可（従来挙動）。
 *  - SiteKey 設定時 → token 取得済みのときだけ送信可（未取得・期限切れ・エラーで token=null なら不可）。
 */
export function canSubmitTurnstile(opts: { siteConfigured: boolean; token: string | null }): boolean {
  if (!opts.siteConfigured) return true;
  return Boolean(opts.token);
}

/** API payload に載せる Turnstile フィールドだけを返す（token があるときのみ）。無ければ空。 */
export function turnstilePayloadField(token: string | null): Record<string, string> {
  return token ? { [TURNSTILE_FIELD]: token } : {};
}
