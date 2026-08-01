// お問い合わせ POST のフレームワーク非依存ハンドラ。
// NextRequest そのものではなく、最小インターフェース（headers.get / json）だけに依存する。
// これにより next/server や外部送信に接続せず、Route Handler の全分岐をユニットテストできる。
import {
  CONTACT_SOURCE,
  HONEYPOT_FIELD,
  RESEND_TIMEOUT_MS,
  isHoneypotTriggered,
  isJsonContentType,
  isRequestOriginAllowed,
  isValidSubmissionId,
  sanitizeAttribution,
  validateContactInput,
} from "./formSecurity";
import { deliverContact, type Inquiry, type SendEmail } from "./contactDelivery";
import { formatJst, generateReference, generateSubmissionId } from "./contactFormat";
import type { ContactStoreRecord } from "./contactStorePayload";
import { TURNSTILE_FIELD } from "./turnstileClient";
import { TURNSTILE_FAIL_MESSAGE, type TurnstileGuard } from "./turnstile";

// 型は contactStorePayload に集約し、ここから再輸出（既存 import 互換）。
export type { ContactStoreRecord };

export type HttpRequestLike = {
  headers: { get(name: string): string | null };
  json(): Promise<unknown>;
};

// contacts GAS へ 1 件保存する（成功で { stored } を解決、失敗で reject）。
// duplicate=true は「同一 submission_id が既に保存済み」＝安全（記録は存在）。
export type StoreContact = (
  record: ContactStoreRecord,
  ctx: { timeoutMs: number },
) => Promise<{ stored: boolean; duplicate: boolean }>;

export type ContactHandlerDeps = {
  resendConfigured: boolean;
  sendEmail: SendEmail;
  // 保存（contacts GAS）。未設定なら保存せず、従来どおりメールのみで受領を判定する。
  storeConfigured?: boolean;
  storeContact?: StoreContact;
  // Preview 環境フラグ（route が VERCEL_ENV から注入）。true の間は保存も送信も一切行わない。
  isPreview?: boolean;
  // Turnstile（bot 対策）。未注入または state="disabled" なら従来挙動を完全維持。
  turnstile?: TurnstileGuard;
  timeoutMs?: number;
  now?: () => Date;
  logError?: (message: string, meta: Record<string, unknown>) => void;
  logWarn?: (message: string, meta: Record<string, unknown>) => void;
};

export type HandlerResult = { status: number; body: Record<string, unknown> };

const noop = () => {};

export async function handleContact(req: HttpRequestLike, deps: ContactHandlerDeps): Promise<HandlerResult> {
  const logWarn = deps.logWarn ?? noop;
  const logError = deps.logError ?? noop;
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

  // 3'') Turnstile（設定整合 → 検証）。honeypot / 入力不正 / Preview では到達しない＝Siteverify を呼ばない。
  //      未設定(disabled)は従来挙動。片側設定(misconfigured)は外部処理せず 500。token は保存・メール・ログへ出さない。
  const turnstile = deps.turnstile;
  if (turnstile && turnstile.state !== "disabled") {
    if (turnstile.state === "misconfigured") {
      logError("contact: turnstile misconfigured", {});
      return { status: 500, body: { error: "サーバーエラーが発生しました" } };
    }
    // enabled: token 必須 → Siteverify で検証。
    const token = typeof record[TURNSTILE_FIELD] === "string" ? (record[TURNSTILE_FIELD] as string) : "";
    if (!token) {
      return { status: 400, body: { error: TURNSTILE_FAIL_MESSAGE } };
    }
    let verified = false;
    try {
      verified = (await turnstile.verify(token, { action: "contact", timeoutMs })).success;
    } catch {
      // Cloudflare 障害・timeout でも成功を返さない（fail-closed）。詳細はログへ出さない。
      verified = false;
      logWarn("contact: turnstile verify error", {});
    }
    if (!verified) {
      return { status: 400, body: { error: TURNSTILE_FAIL_MESSAGE } };
    }
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
    contactType: validated.value.contactType,
    company: validated.value.company,
    source: CONTACT_SOURCE, // クライアント値は使わず固定
  };

  // 4) 保存を先に確定（contacts シート）。メール成否とは独立。PII・本文はログに出さない。
  //    duplicate（同一 submission_id）も「記録は存在」＝保存済みとして扱う。
  let stored = false;
  if (deps.storeConfigured && deps.storeContact) {
    const storeRecord: ContactStoreRecord = {
      name: inquiry.name,
      email: inquiry.email,
      company: inquiry.company ?? "",
      contact_type: inquiry.contactType ?? "",
      message: inquiry.message,
      source: inquiry.source ?? CONTACT_SOURCE,
      submission_id: inquiry.submissionId,
      reference: inquiry.reference,
      userAgent: (req.headers.get("user-agent") ?? "").slice(0, 300),
      attribution: sanitizeAttribution(record.attribution),
    };
    try {
      const r = await deps.storeContact(storeRecord, { timeoutMs });
      stored = r.stored || r.duplicate;
    } catch {
      stored = false;
      logError("contact: store failed", { reference: inquiry.reference });
    }
  }

  // 5) メール通知（運営宛＝主・利用者宛＝副）。保存済みなら通知失敗でも受領は維持。
  const delivery = await deliverContact(inquiry, {
    resendConfigured: deps.resendConfigured,
    timeoutMs,
    sendEmail: deps.sendEmail,
    logError: deps.logError,
  });
  const adminNotified = delivery.status === 200;
  const confirmationEmailSent = Boolean(delivery.body.confirmationEmailSent);

  // 6) 合成: 保存成功なら通知失敗でも success（問い合わせを失わない）。
  if (stored) {
    return {
      status: 200,
      body: { success: true, reference: inquiry.reference, stored: true, adminNotified, confirmationEmailSent },
    };
  }

  // 保存未実施/失敗 → メールを記録の正とみなす（従来動作）。運営宛失敗なら 500。
  if (delivery.status === 200) {
    return {
      status: 200,
      body: { success: true, reference: inquiry.reference, stored: false, adminNotified: true, confirmationEmailSent },
    };
  }
  return delivery;
}
