// Cloudflare Turnstile サーバー側検証（Siteverify）。サーバー専用・fetch 注入可・AbortController で実中断。
//
// 安全基準（register 側 gasClient と同水準）:
//   - エラー・ログに Secret / token / IP / Siteverify 応答本文 / hostname 実値 / action 実値 / URL /
//     PII を含めない。error-codes は「許可リストに一致する既知コードだけ」を安全 metadata へ含める。
//   - 失敗は「固定カテゴリ（TurnstileFailureReason）」で分類して返す（throw しない）。呼び出し側は
//     カテゴリのみをログへ出す。非2xx のときだけ安全な HTTP ステータス番号（100-599）と、許可リストに
//     一致した既知 error-code だけを保持できる。
//   - success / action / hostname のいずれかが期待と異なれば分類して { success:false }（成功を返さない）。
//   - Cloudflare 障害・timeout・非2xx も成功を返さない（fail-closed）。
//   - Preview からは呼ばれない（handler が Turnstile 検証より前に 503 で停止する）。
//
// 一次情報（確認日 2026-08-04）:
//   https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
//   https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/
//   - Siteverify は application/x-www-form-urlencoded と application/json の両方を受け付ける。ここでは
//     シリアライズが明示的な JSON（{ secret, response }）へ統一する（公式が明示対応する形式）。
//   - token は 300 秒で失効し単回利用（再利用/失効は timeout-or-duplicate → success:false）。
//   - remoteip・idempotency_key は任意。ここでは送らない（PII 非送出・最小送信）。
//   - サーバー側で action / hostname を検証し、API 失敗は fail-closed。

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

// Siteverify が返しうる error-codes のうち、ログへ残してよい既知コードだけの許可リスト。
// これ以外（未知コード・非文字列・過長値）はログへ出さない。一次情報の error-codes 一覧に基づく。
export const TURNSTILE_ERROR_CODES_ALLOWLIST: readonly string[] = [
  "missing-input-secret",
  "invalid-input-secret",
  "missing-input-response",
  "invalid-input-response",
  "bad-request",
  "timeout-or-duplicate",
  "internal-error",
];
// 安全 metadata へ含める error-code の最大件数（許可リスト長と同じ上限）。
export const TURNSTILE_ERROR_CODES_MAX = TURNSTILE_ERROR_CODES_ALLOWLIST.length;
// 1 コードの最大長（許可リストの最長でも十分収まる。過長値は捨てる）。
const ERROR_CODE_MAX_LEN = 40;
// 応答配列の走査上限（悪意ある巨大配列でも走査コストを抑える）。
const ERROR_CODES_SCAN_LIMIT = 50;

export const TURNSTILE_FAIL_MESSAGE =
  "認証を確認できませんでした。ページを再読み込みして、もう一度お試しください。";

import { isTurnstileFlagEnabled } from "./turnstileClient";

export type TurnstileConfigState = "disabled" | "enabled" | "misconfigured";

// Siteverify 失敗の固定カテゴリ（Secret / token / PII / 応答本文を含まない・外部公開可）。
export type TurnstileFailureReason =
  | "missing_token" // token が文字列でない・空・過長（外部未呼び出し）
  | "siteverify_timeout" // AbortController による timeout
  | "siteverify_network_error" // fetch 例外（timeout 以外）
  | "siteverify_http_error" // Siteverify 非2xx
  | "siteverify_invalid_response" // JSON 解析失敗・応答が不正型
  | "siteverify_rejected" // Cloudflare が success:false
  | "action_mismatch" // action 不一致
  | "hostname_mismatch"; // hostname が許可外

// 失敗時のログ用 metadata（allowlist・固定型）。reason 必須・httpStatus / errorCodes は任意。
// errorCodes は許可リストに一致した既知コードだけ（未知・非文字列・過長は含まれない）。
export type TurnstileLogMeta = { reason: TurnstileFailureReason; httpStatus?: number; errorCodes?: string[] };

/**
 * Turnstile の有効化契約（明示フラグ + Site Key + Secret）。判定を一元化する。
 *  - 有効化フラグ（enabledValue）が "true" でない → **disabled**（Site Key / Secret が保存済みでも完全に無効）。
 *  - フラグ "true" ＋ SiteKey・Secret 両方あり（前後空白を除いて非空） → enabled。
 *  - フラグ "true" だが SiteKey か Secret が（trim 後）空 → misconfigured（設定不備・fail-closed で 500）。
 * enabledValue はサーバー側 env（NEXT_PUBLIC_TURNSTILE_ENABLED）からのみ渡す。リクエスト値からは決めない。
 * env 値・鍵の実値・長さはログへ出さない。
 */
export function resolveTurnstileConfig(
  enabledValue: string | null | undefined,
  siteKey: string | null | undefined,
  secret: string | null | undefined,
): TurnstileConfigState {
  if (!isTurnstileFlagEnabled(enabledValue)) return "disabled";
  // 環境変数コピー時の前後改行／空白を吸収して判定する（実値・長さはログへ出さない）。
  const hasSite = typeof siteKey === "string" && siteKey.trim().length > 0;
  const hasSecret = typeof secret === "string" && secret.trim().length > 0;
  if (hasSite && hasSecret) return "enabled";
  return "misconfigured";
}

export type VerifyTurnstileOptions = {
  action: TurnstileAction;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
};

// 検証結果（判別可能なユニオン）。失敗は必ず固定カテゴリ reason を持つ。
export type TurnstileVerifyResult =
  | { success: true }
  | { success: false; reason: TurnstileFailureReason; httpStatus?: number; errorCodes?: string[] };

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

// object（配列・null を除く）判定。
function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

// Cloudflare 応答の "error-codes" から、許可リストに一致する既知コードだけを安全に抽出する。
// - 配列でなければ undefined。
// - 各要素は文字列・非空・最大長以内・許可リスト一致・重複なしのものだけ採用。
// - 件数は上限まで。走査自体も上限で打ち切る（巨大配列対策）。
// - 未知コード・非文字列・過長値は捨てる（ログへ出さない）。
function safeErrorCodes(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: string[] = [];
  const scanLimit = Math.min(raw.length, ERROR_CODES_SCAN_LIMIT);
  for (let i = 0; i < scanLimit; i++) {
    if (out.length >= TURNSTILE_ERROR_CODES_MAX) break;
    const item = raw[i];
    if (typeof item !== "string") continue;
    if (item.length === 0 || item.length > ERROR_CODE_MAX_LEN) continue;
    if (!TURNSTILE_ERROR_CODES_ALLOWLIST.includes(item)) continue;
    if (out.includes(item)) continue;
    out.push(item);
  }
  return out.length > 0 ? out : undefined;
}

export async function verifyTurnstile(
  secret: string,
  token: string,
  opts: VerifyTurnstileOptions,
): Promise<TurnstileVerifyResult> {
  // token 検証（文字列・非空・上限内）。空・過長・非文字列は外部へ送らず失敗。値・長さはログへ出さない。
  // token は加工・trim しない（Cloudflare が発行した値をそのまま検証する）。
  if (typeof token !== "string" || token.length === 0 || token.length > TURNSTILE_TOKEN_MAX) {
    return { success: false, reason: "missing_token" };
  }
  // secret は env コピー時の前後改行／空白を除いて送る（実値・長さはログへ出さない）。
  // trim 後に空になる設定は resolveTurnstileConfig が misconfigured として弾く（本関数は enabled 時のみ呼ばれる）。
  const sendSecret = typeof secret === "string" ? secret.trim() : "";

  const doFetch = opts.fetchImpl ?? fetch;
  const timeoutMs = opts.timeoutMs ?? TURNSTILE_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // 公式が明示対応する JSON 形式へ統一（シリアライズが明示的）。Secret / token を URL へは含めない。
    const body = JSON.stringify({ secret: sendSecret, response: token });

    let res: Response;
    try {
      res = await doFetch(SITEVERIFY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": TURNSTILE_USER_AGENT,
        },
        signal: controller.signal,
        body,
      });
    } catch (err) {
      // timeout（AbortController）は AbortError。それ以外は network error。
      // 元の message / cause / stack / URL / socket 情報は一切ログへ渡さない（固定カテゴリのみ）。
      const isAbort = err instanceof Error && err.name === "AbortError";
      return { success: false, reason: isAbort ? "siteverify_timeout" : "siteverify_network_error" };
    }

    // JSON 解析は 2xx / 非2xx を問わず試みる。応答本文・例外はログへ出さない。
    let parsed: unknown;
    let parseOk = true;
    try {
      parsed = await res.json();
    } catch {
      parseOk = false;
    }

    // 非2xx：安全な HTTP ステータス番号と、許可リストに一致した既知 error-code だけを保持。
    if (!res.ok) {
      const httpStatus = safeHttpStatus(res.status);
      const errorCodes = parseOk && isPlainObject(parsed) ? safeErrorCodes(parsed["error-codes"]) : undefined;
      const out: { success: false; reason: TurnstileFailureReason; httpStatus?: number; errorCodes?: string[] } = {
        success: false,
        reason: "siteverify_http_error",
      };
      if (httpStatus !== undefined) out.httpStatus = httpStatus;
      if (errorCodes) out.errorCodes = errorCodes;
      return out;
    }

    // 2xx：正常な JSON オブジェクト＋success(boolean) を要求。応答本文はログへ出さない。
    if (!parseOk || !isPlainObject(parsed)) {
      return { success: false, reason: "siteverify_invalid_response" };
    }
    const d = parsed as { success?: unknown; action?: unknown; hostname?: unknown };
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
