// お問い合わせ配送の統合ロジック（送信手段を注入＝DI）。
//
// 設計（レビュー #1・#2・#3 反映）:
//  - Resend を本番必須とする。RESEND_API_KEY 未設定なら 500（旧 Webhook フォールバックは撤去）。
//    根拠: contact 用 Webhook(GAS) は「運営宛通知のみ・受付完了メールを送らない」移行前経路であり、
//    本番は Resend 設定済み・ドメイン認証(SPF/DKIM/DMARC)も Resend 側。フォールバックを残すと
//    「受付完了メールを送りました」の誤表示や GAS_WEBHOOK_URL への誤ルーティングを招く。
//  - 送信は「運営宛＝主処理 / 利用者宛受付メール＝副処理」。
//      * 運営宛が失敗 → フォーム全体を失敗（500・success を返さない）。
//      * 運営宛が成功・利用者宛が失敗 → 問い合わせは受領済みとして success:true を返すが、
//        confirmationEmailSent:false を明示する（UI は「受付完了メールを送った」と表示しない）。
//  - 冪等性: 各送信に submissionId 由来の Idempotency-Key を付ける。利用者が再送しても
//    （クライアントは成功まで submissionId を保持するため）Resend 側で重複送信されない。
//  - 実中断: 送信（sendEmail）は AbortController で実際に HTTP を中断する実装を注入する。
//  - PII・Secret はログに出さない（受付番号と真偽のみ）。
export type Inquiry = {
  name: string;
  email: string;
  message: string;
  receivedAt: string;
  reference: string;
  submissionId: string;
};

export type EmailKind = "admin" | "user";

// 1 通送信する関数。成功で解決、失敗（非 2xx / タイムアウト中断 / 例外）で reject。
export type SendEmail = (
  kind: EmailKind,
  inquiry: Inquiry,
  ctx: { idempotencyKey: string; timeoutMs: number },
) => Promise<void>;

export type ContactDeliveryDeps = {
  resendConfigured: boolean;
  timeoutMs: number;
  sendEmail: SendEmail;
  logError?: (message: string, meta: Record<string, unknown>) => void;
};

export type DeliveryBody = {
  success?: boolean;
  reference?: string;
  confirmationEmailSent?: boolean;
  error?: string;
};
export type DeliveryResult = { status: number; body: DeliveryBody };

const failureBody: DeliveryBody = { error: "送信に失敗しました。時間をおいて再度お試しください。" };

function idKey(inquiry: Inquiry, kind: EmailKind): string {
  return `contact:${inquiry.submissionId}:${kind}`;
}

export async function deliverContact(
  inquiry: Inquiry,
  deps: ContactDeliveryDeps,
): Promise<DeliveryResult> {
  const log = deps.logError ?? (() => {});

  if (!deps.resendConfigured) {
    log("contact: RESEND_API_KEY not configured", { reference: inquiry.reference });
    return { status: 500, body: failureBody };
  }

  // ── 主処理: 運営宛通知（これが受領の正）──
  try {
    await deps.sendEmail("admin", inquiry, {
      idempotencyKey: idKey(inquiry, "admin"),
      timeoutMs: deps.timeoutMs,
    });
  } catch {
    // 失敗理由の詳細（PII を含み得る）は残さず、受付番号のみ
    log("contact: admin notification failed", { reference: inquiry.reference });
    return { status: 500, body: failureBody };
  }

  // ── 副処理: 利用者宛の受付完了メール（best-effort）──
  let confirmationEmailSent = false;
  try {
    await deps.sendEmail("user", inquiry, {
      idempotencyKey: idKey(inquiry, "user"),
      timeoutMs: deps.timeoutMs,
    });
    confirmationEmailSent = true;
  } catch {
    // 問い合わせ自体は運営に届いているため success は維持。ただし確認メール未送信を明示。
    log("contact: user confirmation failed", { reference: inquiry.reference });
    confirmationEmailSent = false;
  }

  return { status: 200, body: { success: true, reference: inquiry.reference, confirmationEmailSent } };
}
