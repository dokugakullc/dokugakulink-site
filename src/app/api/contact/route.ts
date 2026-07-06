import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const SUPPORT_FROM = "ウカレル サポート <support@dokugakulink.com>";
const SUPPORT_TO = "support@dokugakulink.com";
const SITE_URL = "https://www.dokugakulink.com";
const CONTACT_URL = `${SITE_URL}/contact`;

// セキュリティ: 入力長の上限
const NAME_MAX = 100;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 5000;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatJst(date: Date): string {
  return date.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 受付番号: UKR-YYYYMMDD-HHmmss（JST）
function generateReference(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `UKR-${get("year")}${get("month")}${get("day")}-${get("hour")}${get("minute")}${get("second")}`;
}

type Inquiry = {
  name: string;
  email: string;
  message: string;
  receivedAt: string;
  reference: string;
};

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
      ${row("お名前", escapeHtml(i.name))}
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
    `■ お名前\n${i.name}`,
    "",
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

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストが不正です" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "リクエストが不正です" }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  // 空欄チェック・形式・長さ制限
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "お名前を入力してください" }, { status: 400 });
  }
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "メールアドレスを入力してください" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: "正しいメールアドレスを入力してください" }, { status: 400 });
  }
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "お問い合わせ内容を入力してください" }, { status: 400 });
  }
  if (name.trim().length > NAME_MAX) {
    return NextResponse.json({ error: "お名前が長すぎます" }, { status: 400 });
  }
  if (email.trim().length > EMAIL_MAX) {
    return NextResponse.json({ error: "メールアドレスが長すぎます" }, { status: 400 });
  }
  if (message.trim().length > MESSAGE_MAX) {
    return NextResponse.json(
      { error: `お問い合わせ内容が長すぎます（${MESSAGE_MAX}文字以内）` },
      { status: 400 },
    );
  }

  const now = new Date();
  const inquiry: Inquiry = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    receivedAt: formatJst(now),
    reference: generateReference(now),
  };

  // ── 1) Resend（優先の送信基盤）: 運営宛＋ユーザー宛の2通 ──────
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const [adminRes, userRes] = await Promise.all([
        resend.emails.send({
          from: SUPPORT_FROM,
          to: [SUPPORT_TO],
          replyTo: inquiry.email,
          subject: `【ウカレル】新しいお問い合わせ（${inquiry.name}）`,
          html: buildAdminHtml(inquiry),
          text: buildAdminText(inquiry),
        }),
        resend.emails.send({
          from: SUPPORT_FROM,
          to: [inquiry.email],
          replyTo: SUPPORT_TO,
          subject: "【ウカレル】お問い合わせを受け付けました",
          html: buildUserHtml(inquiry),
          text: buildUserText(inquiry),
        }),
      ]);

      // 両方成功した場合のみ成功。PIIはログに出さず、受付番号のみ残す。
      if (adminRes.error || userRes.error) {
        console.error("Resend send failed", {
          reference: inquiry.reference,
          admin: adminRes.error ?? null,
          user: userRes.error ?? null,
        });
        return NextResponse.json(
          { error: "送信に失敗しました。時間をおいて再度お試しください。" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        reference: inquiry.reference,
        adminId: adminRes.data?.id,
        userId: userRes.data?.id,
      });
    } catch (err) {
      console.error("Resend threw an exception", { reference: inquiry.reference, err });
      return NextResponse.json(
        { error: "送信に失敗しました。時間をおいて再度お試しください。" },
        { status: 500 },
      );
    }
  }

  // ── 2) フォールバック（Resend未設定時のみ）: 既存Webhook（運営宛のみ）─
  // RESEND_API_KEY 設定後はこの分岐には入らない。移行期の保険。
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL || process.env.GAS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("RESEND_API_KEY も CONTACT_WEBHOOK_URL/GAS_WEBHOOK_URL も未設定です");
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: inquiry.name,
        email: inquiry.email.toLowerCase(),
        message: inquiry.message,
        reference: inquiry.reference,
        timestamp: now.toISOString(),
      }),
    });

    if (!res.ok) {
      throw new Error(`Webhook returned ${res.status}`);
    }

    let data: { success?: boolean; error?: string } | null = null;
    try {
      data = (await res.json()) as { success?: boolean; error?: string };
    } catch {
      data = null;
    }
    if (data && data.success === false) {
      throw new Error(data.error ?? "Webhook reported failure");
    }

    return NextResponse.json({ success: true, reference: inquiry.reference });
  } catch (err) {
    console.error("Contact webhook failed:", err);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
