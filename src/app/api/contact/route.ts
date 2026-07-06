import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const SUPPORT_FROM = "ウカレル サポート <support@dokugakulink.com>";
const SUPPORT_TO = "support@dokugakulink.com";

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

type Inquiry = { name: string; email: string; message: string; receivedAt: string };

function buildHtml({ name, email, message, receivedAt }: Inquiry): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:14px 16px;border-bottom:1px solid #eef1f5;font-size:12px;font-weight:700;color:#6b7280;white-space:nowrap;vertical-align:top;width:120px;">${label}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #eef1f5;font-size:14px;color:#0d2545;line-height:1.7;">${value}</td>
    </tr>`;

  return `<!doctype html>
<html lang="ja"><body style="margin:0;padding:0;background:#f5f7fa;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#0d2545;padding:20px 24px;">
            <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#93b4e6;font-family:Arial,sans-serif;">Contact</p>
            <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#ffffff;font-family:sans-serif;">新しいお問い合わせが届きました</p>
          </td>
        </tr>
        <tr><td style="padding:8px 24px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:sans-serif;">
            ${row("お名前", escapeHtml(name))}
            ${row("メールアドレス", `<a href="mailto:${escapeHtml(email)}" style="color:#1d4ed8;text-decoration:none;">${escapeHtml(email)}</a>`)}
            ${row("お問い合わせ内容", escapeHtml(message).replace(/\n/g, "<br>"))}
            ${row("送信日時", escapeHtml(receivedAt))}
          </table>
          <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;font-family:sans-serif;line-height:1.6;">
            このメールは <a href="https://www.dokugakulink.com/contact" style="color:#9ca3af;">dokugakulink.com のお問い合わせフォーム</a> から自動送信されました。<br>
            そのまま「返信」すると、送信者本人（${escapeHtml(email)}）宛に返信できます。
          </p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;font-family:sans-serif;">&copy; dokugaku link合同会社</p>
    </td></tr>
  </table>
</body></html>`;
}

function buildText({ name, email, message, receivedAt }: Inquiry): string {
  return [
    "新しいお問い合わせが届きました。",
    "",
    `■ お名前\n${name}`,
    "",
    `■ メールアドレス\n${email}`,
    "",
    `■ お問い合わせ内容\n${message}`,
    "",
    `■ 送信日時\n${receivedAt}`,
    "",
    "------------------------------------------------------------",
    "このメールは dokugakulink.com のお問い合わせフォームから自動送信されました。",
    `そのまま「返信」すると、送信者本人（${email}）宛に返信できます。`,
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

  const inquiry: Inquiry = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    receivedAt: formatJst(new Date()),
  };
  const subject = `【ウカレル】新しいお問い合わせ（${inquiry.name}）`;

  // ── 1) Resend（優先の送信基盤）──────────────────────────────
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const { data, error } = await resend.emails.send({
        from: SUPPORT_FROM,
        to: [SUPPORT_TO],
        replyTo: inquiry.email,
        subject,
        html: buildHtml(inquiry),
        text: buildText(inquiry),
      });

      if (error) {
        console.error("Resend send failed:", error);
        return NextResponse.json(
          { error: "メールの送信に失敗しました。時間をおいて再度お試しください。" },
          { status: 500 },
        );
      }

      return NextResponse.json({ success: true, id: data?.id });
    } catch (err) {
      console.error("Resend threw an exception:", err);
      return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
    }
  }

  // ── 2) フォールバック（Resend未設定時のみ）: 既存Webhook ─────
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
        timestamp: new Date().toISOString(),
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact webhook failed:", err);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
