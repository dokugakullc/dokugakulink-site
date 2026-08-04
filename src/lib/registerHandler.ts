// 事前登録 POST のフレームワーク非依存ハンドラ。contact と同じ基準（CT/Origin/honeypot/検証）。
import {
  GAS_TIMEOUT_MS,
  HONEYPOT_FIELD,
  deriveInterest,
  isHoneypotTriggered,
  isJsonContentType,
  isRequestOriginAllowed,
  sanitizeAttribution,
  validateRegisterInput,
} from "./formSecurity";
import type { HttpRequestLike, HandlerResult } from "./contactHandler";
import { TURNSTILE_FIELD } from "./turnstileClient";
import {
  TURNSTILE_FAIL_MESSAGE,
  type TurnstileGuard,
  type TurnstileVerifyResult,
  type TurnstileLogMeta,
} from "./turnstile";

export type RegisterPayload = {
  email: string;
  interest: string;
  problem: string;
  source: string;
  userAgent: string;
  attribution: Record<string, string>;
};

// GAS へ 1 件送る。成功で { duplicated } を解決、失敗（非 2xx / タイムアウト / 例外）で reject。
export type PostRegister = (
  payload: RegisterPayload,
  ctx: { timeoutMs: number },
) => Promise<{ duplicated: boolean }>;

export type RegisterHandlerDeps = {
  gasConfigured: boolean;
  postRegister: PostRegister;
  // Preview 環境フラグ（route が VERCEL_ENV から注入）。true の間は外部保存を一切行わない。
  isPreview?: boolean;
  // Turnstile（bot 対策）。未注入または state="disabled" なら従来挙動を完全維持。
  turnstile?: TurnstileGuard;
  timeoutMs?: number;
  logError?: (message: string, meta: Record<string, unknown>) => void;
  logWarn?: (message: string, meta: Record<string, unknown>) => void;
};

const noop = () => {};

export async function handleRegister(req: HttpRequestLike, deps: RegisterHandlerDeps): Promise<HandlerResult> {
  const logWarn = deps.logWarn ?? noop;
  const logError = deps.logError ?? noop;
  const timeoutMs = deps.timeoutMs ?? GAS_TIMEOUT_MS;

  if (!isJsonContentType(req.headers.get("content-type"))) {
    return { status: 415, body: { error: "リクエストが不正です" } };
  }

  const originCheck = isRequestOriginAllowed({
    origin: req.headers.get("origin"),
    host: req.headers.get("host"),
  });
  if (!originCheck.allowed) {
    logWarn("register: origin rejected", { reason: originCheck.reason });
    return { status: 403, body: { error: "リクエストが不正です" } };
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { status: 400, body: { error: "リクエストが不正です" } };
  }

  const record = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};

  // honeypot: 作動時は外部保存もせず、success を返さない（通常の送信失敗として扱う）。
  //   「登録内容を保存した」と表示させない。誤検知でも正規利用者の登録を黙って消失させないため
  //   UI 側で再送できる失敗にする。エラー文は honeypot の存在を明示しない汎用文。値はログに出さない。
  if (isHoneypotTriggered(record[HONEYPOT_FIELD])) {
    logWarn("register: honeypot triggered", {});
    return {
      status: 400,
      body: { error: "送信を完了できませんでした。入力内容をご確認のうえ、再度お試しください。" },
    };
  }

  const validated = validateRegisterInput(body);
  if (!validated.ok) {
    return { status: 400, body: { error: validated.error } };
  }
  const { email, source, problem } = validated.value;

  // Preview 環境ガード: GAS 設定の有無に関わらず外部保存しない（将来 Preview に env が
  // 追加されても保存されないよう恒久的に禁止）。gasConfigured / postRegister より前に返す。
  if (deps.isPreview) {
    return { status: 503, body: { error: "この環境では送信できません。" } };
  }

  // Turnstile（設定整合 → 検証）。honeypot / 入力不正 / Preview では到達しない＝Siteverify を呼ばない。
  // 未設定(disabled)は従来挙動。片側設定(misconfigured)は外部処理せず 500。token は GAS・ログへ出さない。
  const turnstile = deps.turnstile;
  if (turnstile && turnstile.state !== "disabled") {
    if (turnstile.state === "misconfigured") {
      logError("register: turnstile misconfigured", {});
      return { status: 500, body: { error: "サーバーエラーが発生しました" } };
    }
    // token 必須 → Siteverify で検証。失敗理由は固定カテゴリのみログへ出す
    // （Secret / token / email / hostname 実値 / action 実値 / 応答本文は出さない）。
    const token = typeof record[TURNSTILE_FIELD] === "string" ? (record[TURNSTILE_FIELD] as string) : "";
    if (!token) {
      logWarn("register: turnstile verification failed", { reason: "missing_token" } satisfies TurnstileLogMeta);
      return { status: 400, body: { error: TURNSTILE_FAIL_MESSAGE } };
    }
    let result: TurnstileVerifyResult;
    try {
      result = await turnstile.verify(token, { action: "register", timeoutMs });
    } catch {
      result = { success: false, reason: "siteverify_network_error" }; // 想定外 throw も fail-closed。
    }
    if (!result.success) {
      const meta: TurnstileLogMeta = { reason: result.reason };
      if (typeof result.httpStatus === "number") meta.httpStatus = result.httpStatus;
      // 非2xx 時に抽出された既知 error-code（許可リスト一致・件数上限内）だけを記録する。
      if (Array.isArray(result.errorCodes) && result.errorCodes.length > 0) meta.errorCodes = result.errorCodes;
      logWarn("register: turnstile verification failed", meta);
      return { status: 400, body: { error: TURNSTILE_FAIL_MESSAGE } };
    }
  }

  if (!deps.gasConfigured) {
    logError("register: GAS_WEBHOOK_URL not configured", {});
    return { status: 500, body: { error: "サーバーエラーが発生しました" } };
  }

  const payload: RegisterPayload = {
    email: email.toLowerCase(),
    interest: deriveInterest(source),
    problem,
    source,
    userAgent: (req.headers.get("user-agent") ?? "").slice(0, 300),
    attribution: sanitizeAttribution(record.attribution),
  };

  try {
    const { duplicated } = await deps.postRegister(payload, { timeoutMs });
    return { status: 200, body: { success: true, duplicated } };
  } catch {
    // タイムアウト含め成功は返さない。PII は出さない。
    logError("register: GAS request failed", {});
    return { status: 500, body: { error: "サーバーエラーが発生しました" } };
  }
}
