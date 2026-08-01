// お問い合わせ POST のフレームワーク非依存ハンドラ。
// NextRequest そのものではなく、最小インターフェース（headers.get / json）だけに依存する。
// これにより next/server や外部送信に接続せず、Route Handler の全分岐をユニットテストできる。
import {
  HONEYPOT_FIELD,
  RESEND_TIMEOUT_MS,
  isHoneypotTriggered,
  isJsonContentType,
  isRequestOriginAllowed,
  isValidSubmissionId,
  validateContactInput,
} from "./formSecurity";
import { deliverContact, type Inquiry, type SendEmail } from "./contactDelivery";
import { formatJst, generateReference, generateSubmissionId } from "./contactFormat";

export type HttpRequestLike = {
  headers: { get(name: string): string | null };
  json(): Promise<unknown>;
};

export type ContactHandlerDeps = {
  resendConfigured: boolean;
  sendEmail: SendEmail;
  // Preview 環境フラグ（route が VERCEL_ENV から注入）。true の間は外部送信を一切行わない。
  isPreview?: boolean;
  timeoutMs?: number;
  now?: () => Date;
  logError?: (message: string, meta: Record<string, unknown>) => void;
  logWarn?: (message: string, meta: Record<string, unknown>) => void;
};

export type HandlerResult = { status: number; body: Record<string, unknown> };

const noop = () => {};

export async function handleContact(req: HttpRequestLike, deps: ContactHandlerDeps): Promise<HandlerResult> {
  const logWarn = deps.logWarn ?? noop;
  const now = (deps.now ?? (() => new Date()))();
  const timeoutMs = deps.timeoutMs ?? RESEND_TIMEOUT_MS;

  // 0) Content-Type を JSON に限定
  if (!isJsonContentType(req.headers.get("content-type"))) {
    return { status: 415, body: { error: "リクエストが不正です" } };
  }

  // 0') Origin 検証（補助策）
  const originCheck = isRequestOriginAllowed({
    origin: req.headers.get("origin"),
    host: req.headers.get("host"),
  });
  if (!originCheck.allowed) {
    logWarn("contact: origin rejected", { reason: originCheck.reason });
    return { status: 403, body: { error: "リクエストが不正です" } };
  }

  // 1) JSON パース
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { status: 400, body: { error: "リクエストが不正です" } };
  }

  const record = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};

  // 2) honeypot: 作動時は外部送信も受付もせず、success を返さない（通常の送信失敗として扱う）。
  //    受付・保存・受付番号・確認メールのいずれも「済み」と表示させない。誤検知（万一の自動入力）でも
  //    正規利用者の問い合わせを黙って消失させないため、UI 側で再送できる失敗にする。
  //    エラー文は honeypot の存在を明示しない汎用文。honeypot の値はログに出さない（件数のみ）。
  if (isHoneypotTriggered(record[HONEYPOT_FIELD])) {
    logWarn("contact: honeypot triggered", {});
    return {
      status: 400,
      body: { error: "送信を完了できませんでした。入力内容をご確認のうえ、再度お試しください。" },
    };
  }

  // 3) 入力検証
  const validated = validateContactInput(body);
  if (!validated.ok) {
    return { status: 400, body: { error: validated.error } };
  }

  // 3') Preview 環境ガード（外部副作用の恒久禁止）。
  //     RESEND_API_KEY が Preview に存在しても送信しない。運営宛・利用者宛の双方を送らず、
  //     success/reference/confirmationEmailSent を返さない。検証の後段に置くことで、
  //     honeypot 等の判定順序が Production と変わらず情報漏えいにならないようにする。
  if (deps.isPreview) {
    return { status: 503, body: { error: "この環境ではお問い合わせを送信できません。" } };
  }

  // submissionId: クライアント提供の冪等キー種。無効ならサーバーで生成（単一リクエスト内で安定）。
  const submissionId = isValidSubmissionId(record.submissionId)
    ? (record.submissionId as string)
    : generateSubmissionId();

  const inquiry: Inquiry = {
    name: validated.value.name,
    email: validated.value.email,
    message: validated.value.message,
    receivedAt: formatJst(now),
    reference: generateReference(now),
    submissionId,
  };

  // 4) 配送（送信手段は注入）
  return deliverContact(inquiry, {
    resendConfigured: deps.resendConfigured,
    timeoutMs,
    sendEmail: deps.sendEmail,
    logError: deps.logError,
  });
}
