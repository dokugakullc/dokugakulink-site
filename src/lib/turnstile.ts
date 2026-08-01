// Cloudflare Turnstile サーバー側検証（Siteverify）。サーバー専用・fetch 注入可・AbortController で実中断。
//
// 安全基準（register 側 gasClient と同水準）:
//   - エラー・ログに Secret / token / IP / Siteverify 応答本文 / PII を含めない。
//   - 非2xx はステータス番号のみ、JSON 解析失敗は固定メッセージで throw。
//   - success / action / hostname のいずれかが期待と異なれば { success:false }（成功を返さない）。
//   - Cloudflare 障害・timeout は throw（呼び出し側で fail-closed に扱う）。
//   - Preview からは呼ばれない（handler が Turnstile 検証より前に 503 で停止する）。
//
// 一次情報: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
//   token は 300 秒で失効し単回利用（再利用/失効は timeout-or-duplicate → success:false）。

export const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
// Turnstile token の最大長（上限を超える入力は外部へ送らず失敗扱い）。
export const TURNSTILE_TOKEN_MAX = 2048;
export const TURNSTILE_TIMEOUT_MS = 8000;

// 期待 action（contact / register でウィジェットを分離し、取り違えを検出する）。
export type TurnstileAction = "contact" | "register";

// 本番ドメインのみ許可（ワイルドカードで広げない）。
export const ALLOWED_TURNSTILE_HOSTNAMES: readonly string[] = ["dokugakulink.com", "www.dokugakulink.com"];

// ユーザー向け汎用文（Secret / 内部エラー / Cloudflare 詳細を出さない）。
export const TURNSTILE_FAIL_MESSAGE =
  "認証を確認できませんでした。ページを再読み込みして、もう一度お試しください。";

export type TurnstileConfigState = "disabled" | "enabled" | "misconfigured";

/**
 * SiteKey / Secret の設定状態。
 *  - 両方未設定 → disabled（Turnstile 機能を完全に無効・従来挙動を維持）
 *  - 両方設定   → enabled（Turnstile 必須）
 *  - 片方のみ   → misconfigured（設定不整合・fail-closed。外部処理せず 500）
 */
export function resolveTurnstileConfig(
  siteKey: string | null | undefined,
  secret: string | null | undefined,
): TurnstileConfigState {
  const hasSite = Boolean(siteKey && siteKey.trim());
  const hasSecret = Boolean(secret && secret.trim());
  if (!hasSite && !hasSecret) return "disabled";
  if (hasSite && hasSecret) return "enabled";
  return "misconfigured";
}

export type VerifyTurnstileOptions = {
  action: TurnstileAction;
  timeoutMs?: number;
  // remoteip は任意。プライバシー配慮のため既定では送らない（必須ではない）。
  remoteip?: string;
  idempotencyKey?: string;
  fetchImpl?: typeof fetch;
};

export type TurnstileVerifyResult = { success: boolean };

// route が secret を束ねて注入する検証関数（handler は secret を知らない）。
export type TurnstileVerifier = (
  token: string,
  ctx: { action: TurnstileAction; timeoutMs: number },
) => Promise<TurnstileVerifyResult>;

// handler へ DI するガード（設定状態＋検証関数）。
export type TurnstileGuard = { state: TurnstileConfigState; verify: TurnstileVerifier };

export async function verifyTurnstile(
  secret: string,
  token: string,
  opts: VerifyTurnstileOptions,
): Promise<TurnstileVerifyResult> {
  // token 長さガード（空・過長は外部へ送らず失敗）。
  if (!token || token.length > TURNSTILE_TOKEN_MAX) return { success: false };

  const doFetch = opts.fetchImpl ?? fetch;
  const timeoutMs = opts.timeoutMs ?? TURNSTILE_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const form = new URLSearchParams();
    form.set("secret", secret);
    form.set("response", token);
    if (opts.remoteip) form.set("remoteip", opts.remoteip);
    if (opts.idempotencyKey) form.set("idempotency_key", opts.idempotencyKey);

    const res = await doFetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: controller.signal,
      body: form.toString(),
    });
    // ステータス番号のみ（Secret / token / 応答本文を含めない）。
    if (!res.ok) throw new Error(`turnstile siteverify returned ${res.status}`);
    let data: { success?: boolean; action?: string; hostname?: string };
    try {
      data = (await res.json()) as { success?: boolean; action?: string; hostname?: string };
    } catch {
      // 応答本文を含めない固定メッセージ。
      throw new Error("turnstile siteverify invalid response");
    }
    if (!data.success) return { success: false };
    // action 検証（期待 action と一致しなければ失敗）。
    if (data.action !== opts.action) return { success: false };
    // hostname 検証（本番ドメインのみ許可）。
    if (!data.hostname || !ALLOWED_TURNSTILE_HOSTNAMES.includes(data.hostname)) return { success: false };
    return { success: true };
  } finally {
    clearTimeout(timer);
  }
}
