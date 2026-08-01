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
