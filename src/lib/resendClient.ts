// Resend の送信を「標準 fetch＋AbortController」で行う薄いクライアント。
//
// なぜ SDK を使わないか（DL-002 の実中断）:
//   Resend SDK 6.17.1 の送信オプション（PostOptions）は query/headers のみで `signal` を受け取れず、
//   内部 fetch にも AbortSignal を転送しない。そのため SDK 経由では「実際の HTTP 中断」ができず、
//   タイムアウト後もバックグラウンドで送信が完了し得る（→ 再送で重複）。
//   REST を自前 fetch で叩けば AbortController で本当に中断でき、Idempotency-Key も付けられる。
//
// このモジュールは外部通信を行うが、テストでは fetchImpl を注入して接続を差し替える。
const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type ResendPayload = {
  from: string;
  to: string[];
  reply_to?: string;
  subject: string;
  html: string;
  text: string;
};

export type SendResendOptions = {
  apiKey: string;
  idempotencyKey: string;
  timeoutMs: number;
  // 既定は global fetch。テストで差し替える。
  fetchImpl?: typeof fetch;
};

/**
 * 1 通送信する。成功時は解決、失敗（非 2xx / ネットワーク / タイムアウト中断）時は throw。
 * タイムアウトは AbortController により「実際に」HTTP を中断する。
 * Idempotency-Key により、同一キーでの再送は Resend 側で重複送信されない。
 */
export async function sendResendEmail(payload: ResendPayload, opts: SendResendOptions): Promise<void> {
  const doFetch = opts.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs);
  try {
    const res = await doFetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${opts.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": opts.idempotencyKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      // ステータスのみ（本文＝PII を含み得るため読まない）
      throw new Error(`resend responded ${res.status}`);
    }
  } finally {
    clearTimeout(timer);
  }
}
