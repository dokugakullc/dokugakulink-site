// 受付番号・日時整形・冪等キー種の生成（純粋／自己完結）。

/** 送信日時を JST の読みやすい文字列に整形する。 */
export function formatJst(date: Date): string {
  return date.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** 受付番号: UKR-YYYYMMDD-HHmmss（JST）。利用者への表示用。 */
export function generateReference(date: Date): string {
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

/**
 * クライアントが submissionId を送らなかった場合のサーバー側フォールバック。
 * 冪等キー種として使う（この場合は単一リクエスト内でのみ安定）。
 */
export function generateSubmissionId(): string {
  return globalThis.crypto.randomUUID();
}
