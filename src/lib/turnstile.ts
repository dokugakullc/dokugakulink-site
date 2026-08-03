// Cloudflare Turnstile サーバー側検証（Siteverify）。サーバー専用・fetch 注入可・AbortController で実中断。
//
// 安全基準（register 側 gasClient と同水準）:
//   - エラー・ログに Secret / token / IP / Siteverify 応答本文 / error-codes 実値 / hostname 実値 /
//     action 実値 / URL / PII を含めない。
//   - 失敗は「固定カテゴリ（TurnstileFailureReason）」で分類して返す（throw しない）。呼び出し側は
//     カテゴリのみをログへ出す。非2xx のときだけ安全な HTTP ステータス番号（100-599）を保持できる。
//   - success / action / hostname のいずれかが期待と異なれば分類して { success:false }（成功を返さない）。
//   - Cloudflare 障害・timeout・非2xx も成功を返さない（fail-closed）。
//   - Preview からは呼ばれない（handler が Turnstile 検証より前に 503 で停止する）。
//
// 一次情報（確認日 2026-08-03）:
//   https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
//   - Siteverify は application/x-www-form-urlencoded（URLSearchParams）で secret / response を送る。
//   - token は 300 秒で失効し単回利用（再利用/失効は timeout-or-duplicate → success:false）。
//   - remoteip・idempotency_key は任意。サーバー側で action / hostname を検証し、API 失敗は fail-closed。

export const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
// Turnstile token の最大長（上限を超える入力は外部へ送らず失敗扱い）。
export const TURNSTILE_TOKEN_MAX = 2048;
// Cloudflare 公式例に合わせた 10 秒 timeout（既定値。handler は明示 timeout を渡すこともある）。
export const TURNSTILE_TIMEOUT_MS = 10_000;
// 固定・非機密の識別子（env から生成しない／Secret・commit・PII を含めない）。Resend REST と同方針。
export const TURNSTILE_USER_AGENT = "dokugakulink-site/0.1.0";

// 期待 action（contact / register でウィジェットを分離し、取り違えを検出する）。
export type TurnstileAction = "contact" | "register";

// 本番ドメインのみ許可（ワイルドカードで広げない）。
export const ALLOWED_TURNSTILE_HOSTNAMES: readonly string[] = ["dokugakulink.com", "www.dokugakulink.com"];

// ユーザー向け汎用文（Secret / 内部エラー / Cloudflare 詳細を出さない）。
export const TURNSTILE_FAIL_MESSAGE =
  "認証を確認できませんでした。ページを再読み込みして、もう一度お試しください。";

import { isTurnstileFlagEnabled } from "./turnstileClient";

export type TurnstileConfigState = "disabled" | "enabled" | "misconfigured";

// Siteverify 失敗の固定カテゴリ（Secret / token / PII / 応答本文を含まない・外部公開可）。
export type TurnstileFailureReason =
  | "missing_token" // token 欠落・空・過長（外部未呼び出し）
  | "siteverify_timeout" // AbortController による timeout
  | "siteverify_network_error" // fetch 例外（timeout 以外）
  | "siteverify_http_error" // Siteverify 非2xx
  | "siteverify_invalid_response" // JSON 解析失敗・応答が不正型
  | "siteverify_rejected" // Cloudflare が success:false
  | "action_mismatch" // action 不一致
  | "hostname_mismatch"; // hostname が許可外

// 失敗時のログ用 metadata（allowlist・固定型）。reason 必須・httpStatus は任意（100-599 のみ）。
export type TurnstileLogMeta = { reason: TurnstileFailureReason; httpStatus?: number };

/**
 * Turnstile の有効化契約（明示フラグ + Site Key + Secret）。判定を一元化する。
 *  - 有効化フラグ（enabledValue）が "true" でない → **disabled**（Site Key / Secret が保存済みでも完全に無効）。
 *  - フラグ "true" ＋ SiteKey・Secret 両方あり → enabled。
 *  - フラグ "true" だが SiteKey か Secret が欠ける → misconfigured（設定不備・fail-closed で 500）。
 * enabledValue はサーバー側 env（NEXT_PUBLIC_TURNSTILE_ENABLED）からのみ渡す。リクエスト値からは決めない。
 * env 値はログへ出さない。
 */
export function resolveTurnstileConfig(
  enabledValue: string | null | undefined,
  siteKey: string | null | undefined,
  secret: string | null | undefined,
): TurnstileConfigState {
  if (!isTurnstileFlagEnabled(enabledValue)) return "disabled";
  const hasSite = Boolean(siteKey && siteKey.trim());
  const hasSecret = Boolean(secret && secret.trim());
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

// 検証結果（判別可能なユニオン）。失敗は必ず固定カテゴリ reason を持つ。
export type TurnstileVerifyResult =
  | { success: true }
  | { success: false; reason: TurnstileFailureReason; httpStatus?: number };

// route が secret を束ねて注入する検証関数（handler は secret を知らない）。
export type TurnstileVerifier = (
  token: string,
  ctx: { action: TurnstileAction; timeoutMs: number },
) => Promise<TurnstileVerifyResult>;

// handler へ DI するガード（設定状態＋検証関数）。
export type TurnstileGuard = { state: TurnstileConfigState; verify: TurnstileVerifier };

// 非2xx のとき安全に保持できる HTTP ステータス番号（100-599 の整数）だけを返す。
function safeHttpStatus(status: unknown): number | undefined {
  return typeof status === "number" && Number.isInteger(status) && status >= 100 && status <= 599
    ? status
    : undefined;
}

export async function verifyTurnstile(
  secret: string,
  token: string,
  opts: VerifyTurnstileOptions,
): Promise<TurnstileVerifyResult> {
  // token 長さガード（空・過長は外部へ送らず失敗）。token 値・長さはログへ出さない。
  if (!token || token.length > TURNSTILE_TOKEN_MAX) return { success: false, reason: "missing_token" };

  const doFetch = opts.fetchImpl ?? fetch;
  const timeoutMs = opts.timeoutMs ?? TURNSTILE_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // Cloudflare 公式例に合わせ URLSearchParams を body へ直接渡す。Secret / token を URL へは含めない。
    const form = new URLSearchParams();
    form.set("secret", secret);
    form.set("response", token);
    if (opts.remoteip) form.set("remoteip", opts.remoteip);
    if (opts.idempotencyKey) form.set("idempotency_key", opts.idempotencyKey);

    let res: Response;
    try {
      res = await doFetch(SITEVERIFY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": TURNSTILE_USER_AGENT,
        },
        signal: controller.signal,
        body: form,
      });
    } catch (err) {
      // timeout（AbortController）は AbortError。それ以外は network error。
      // 元の message / cause / stack / URL / socket 情報は一切ログへ渡さない（固定カテゴリのみ）。
      const isAbort = err instanceof Error && err.name === "AbortError";
      return { success: false, reason: isAbort ? "siteverify_timeout" : "siteverify_network_error" };
    }

    // 非2xx：応答本文は読まない。安全な HTTP ステータス番号だけ保持。
    if (!res.ok) {
      const httpStatus = safeHttpStatus(res.status);
      return httpStatus === undefined
        ? { success: false, reason: "siteverify_http_error" }
        : { success: false, reason: "siteverify_http_error", httpStatus };
    }

    // JSON 解析失敗・不正型：応答本文・例外をログへ出さない。
    let data: unknown;
    try {
      data = await res.json();
    } catch {
      return { success: false, reason: "siteverify_invalid_response" };
    }
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      return { success: false, reason: "siteverify_invalid_response" };
    }
    const d = data as { success?: unknown; action?: unknown; hostname?: unknown };
    if (typeof d.success !== "boolean") return { success: false, reason: "siteverify_invalid_response" };

    // Cloudflare 拒否（error-codes 実値はログへ出さず siteverify_rejected へ集約）。
    if (!d.success) return { success: false, reason: "siteverify_rejected" };
    // action 検証（期待値・実値はログへ出さない）。
    if (d.action !== opts.action) return { success: false, reason: "action_mismatch" };
    // hostname 検証（本番ドメインのみ許可・実値はログへ出さない・許可リストは緩和しない）。
    if (typeof d.hostname !== "string" || !ALLOWED_TURNSTILE_HOSTNAMES.includes(d.hostname)) {
      return { success: false, reason: "hostname_mismatch" };
    }
    return { success: true };
  } finally {
    clearTimeout(timer);
  }
}
