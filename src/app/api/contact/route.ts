import { NextRequest, NextResponse } from "next/server";
import { handleContact, type StoreContact } from "@/lib/contactHandler";
import { sendResendEmail, type ResendPayload } from "@/lib/resendClient";
import type { EmailKind, Inquiry, SendEmail } from "@/lib/contactDelivery";
import { isPreviewDeployment } from "@/lib/deployEnv";
import { contactTypeLabel } from "@/lib/formSecurity";
import { postContactStore, isContactStoreConfigured } from "@/lib/contactStoreClient";
import { buildContactStoreBody } from "@/lib/contactStorePayload";

const SUPPORT_FROM = "ウカレル サポート <support@dokugakulink.com>";
const SUPPORT_TO = "support@dokugakulink.com";
const SITE_URL = "https://www.dokugakulink.com";
const CONTACT_URL = `${SITE_URL}/contact`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 共通のカード行
function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:14px 16px;border-bottom:1px solid #eef1f5;font-size:12px;font-weight:700;color:#6b7280;white-space:nowrap;vertical-align:top;width:120px;">${label}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #eef1f5;font-size:14px;color:#0d2545;line-height:1.7;">${value}</td>
    </tr>`;
}

function cardShell(headerLabel: string, headerTitle: string, inner: string): string {
  return `<!doctype html>
<html lang="ja"><body style="margin:0;padding:0;background:#f5f7fa;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#0d2545;padding:20px 24px;">
            <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#93b4e6;font-family:Arial,sans-serif;">${headerLabel}</p>
            <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#ffffff;font-family:sans-serif;">${headerTitle}</p>
          </td>
        </tr>
        <tr><td style="padding:8px 24px 20px;">${inner}</td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;font-family:sans-serif;">&copy; dokugaku link合同会社</p>
    </td></tr>
  </table>
</body></html>`;
}

// 運営宛メール
function buildAdminHtml(i: Inquiry): string {
  const inner = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:sans-serif;">
      ${row("受付番号", escapeHtml(i.reference))}
      ${row("種別", escapeHtml(contactTypeLabel(i.contactType ?? "")))}
      ${row("お名前", escapeHtml(i.name))}
      ${i.company ? row("会社名", escapeHtml(i.company)) : ""}
      ${row("メールアドレス", `<a href="mailto:${escapeHtml(i.email)}" style="color:#1d4ed8;text-decoration:none;">${escapeHtml(i.email)}</a>`)}
      ${row("お問い合わせ内容", escapeHtml(i.message).replace(/\n/g, "<br>"))}
      ${row("送信日時", escapeHtml(i.receivedAt))}
    </table>
    <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;font-family:sans-serif;line-height:1.6;">
      このメールは dokugakulink.com のお問い合わせフォームから自動送信されました。<br>
      そのまま「返信」すると、送信者本人（${escapeHtml(i.email)}）宛に返信できます。
    </p>`;
  return cardShell("Contact", "新しいお問い合わせが届きました", inner);
}

function buildAdminText(i: Inquiry): string {
  return [
    "新しいお問い合わせが届きました。",
    "",
    `■ 受付番号\n${i.reference}`,
    "",
    `■ 種別\n${contactTypeLabel(i.contactType ?? "")}`,
    "",
    `■ お名前\n${i.name}`,
    "",
    ...(i.company ? [`■ 会社名\n${i.company}`, ""] : []),
    `■ メールアドレス\n${i.email}`,
    "",
    `■ お問い合わせ内容\n${i.message}`,
    "",
    `■ 送信日時\n${i.receivedAt}`,
    "",
    "------------------------------------------------------------",
    "このメールは dokugakulink.com のお問い合わせフォームから自動送信されました。",
    `そのまま「返信」すると、送信者本人（${i.email}）宛に返信できます。`,
  ].join("\n");
}

// ユーザー宛 自動返信メール
function buildUserHtml(i: Inquiry): string {
  const inner = `
    <p style="margin:0 0 16px;font-size:14px;color:#0d2545;font-family:sans-serif;line-height:1.8;">
      ${escapeHtml(i.name)} 様<br><br>
      このたびはウカレルへお問い合わせいただきありがとうございます。<br>
      以下の内容で受け付けました。
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:sans-serif;">
      ${row("受付番号", escapeHtml(i.reference))}
      ${row("お名前", escapeHtml(i.name))}
      ${row("メールアドレス", escapeHtml(i.email))}
      ${row("お問い合わせ内容", escapeHtml(i.message).replace(/\n/g, "<br>"))}
    </table>
    <p style="margin:20px 0 0;font-size:14px;color:#0d2545;font-family:sans-serif;line-height:1.8;">
      通常2営業日以内にご返信いたします。今しばらくお待ちください。
    </p>
    <p style="margin:16px 0 0;font-size:13px;color:#6b7280;font-family:sans-serif;line-height:1.8;">
      ウカレル サポート<br>
      <a href="mailto:${SUPPORT_TO}" style="color:#1d4ed8;text-decoration:none;">${SUPPORT_TO}</a><br>
      <a href="${CONTACT_URL}" style="color:#1d4ed8;text-decoration:none;">サポートページ</a>
    </p>`;
  return cardShell("Ukareru", "お問い合わせを受け付けました", inner);
}

function buildUserText(i: Inquiry): string {
  return [
    `${i.name} 様`,
    "",
    "このたびはウカレルへお問い合わせいただきありがとうございます。",
    "",
    "以下の内容で受け付けました。",
    "",
    `【受付番号】\n${i.reference}`,
    "",
    `【お名前】\n${i.name}`,
    "",
    `【メールアドレス】\n${i.email}`,
    "",
    `【お問い合わせ内容】\n${i.message}`,
    "",
    "通常2営業日以内にご返信いたします。",
    "",
    `サポートページ\n${CONTACT_URL}`,
    "",
    "ウカレル サポート",
    SUPPORT_TO,
    SITE_URL,
  ].join("\n");
}

// kind ごとに Resend REST ペイロードを組み立てる
function buildPayload(kind: EmailKind, i: Inquiry): ResendPayload {
  if (kind === "admin") {
    return {
      from: SUPPORT_FROM,
      to: [SUPPORT_TO],
      reply_to: i.email,
      // 件名は contact_type から生成（＋氏名）
      subject: `【ウカレル】お問い合わせ：${contactTypeLabel(i.contactType ?? "")}（${i.name}）`,
      html: buildAdminHtml(i),
      text: buildAdminText(i),
    };
  }
  return {
    from: SUPPORT_FROM,
    to: [i.email],
    reply_to: SUPPORT_TO,
    subject: "【ウカレル】お問い合わせを受け付けました",
    html: buildUserHtml(i),
    text: buildUserText(i),
  };
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const storeUrl = process.env.CONTACT_STORE_URL;
  const storeSecret = process.env.CONTACT_STORE_SHARED_SECRET;

  // 実際の送信: Resend REST を AbortController で実中断＋Idempotency-Key。
  const sendEmail: SendEmail = async (kind, inquiry, ctx) => {
    await sendResendEmail(buildPayload(kind, inquiry), {
      apiKey: apiKey ?? "",
      idempotencyKey: ctx.idempotencyKey,
      timeoutMs: ctx.timeoutMs,
    });
  };

  // 実際の保存: contacts GAS へ AbortController で実中断（contactStoreClient）。
  // 保存 payload は純粋関数で組み立て（allowlist・attribution 平坦化・token を最後に確定）。
  // token は共有シークレット（サーバー専用・NEXT_PUBLIC 無し・GAS の SHARED_SECRET と同値・値はログへ出さない）。
  const storeContact: StoreContact = async (record, ctx) => {
    const body = buildContactStoreBody(record, storeSecret ?? "");
    return postContactStore(storeUrl ?? "", body, { timeoutMs: ctx.timeoutMs });
  };

  const result = await handleContact(req, {
    resendConfigured: Boolean(apiKey),
    // URL・Secret の両方が揃ったときだけ保存を有効化（片方でも欠ければ外部 POST しない）。
    storeConfigured: isContactStoreConfigured(storeUrl, storeSecret),
    storeContact,
    isPreview: isPreviewDeployment(process.env.VERCEL_ENV),
    sendEmail,
    logError: (message, meta) => console.error(message, meta),
    logWarn: (message, meta) => console.warn(message, meta),
  });

  return NextResponse.json(result.body, { status: result.status });
}
