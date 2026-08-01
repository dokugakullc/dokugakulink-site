// contacts(Apps Script webhook) 保存クライアント（AbortController で実中断・fetch 注入可能・サーバー専用）。
// register 側 gasClient.ts と同一の安全基準:
//   - エラーに GAS URL / Secret / PII / GAS 応答内容を含めない（非2xx はステータス番号のみ、
//     success:false / JSON 解析失敗は固定メッセージ）。
//   - AbortSignal を fetch へ渡し、timeout で実際に中断する。
//   - URL・Secret の両方が揃ったときだけ configured（未設定なら外部 POST しない）。
//   - 応答契約 { stored, duplicate } を明確化（duplicate=同一 submission_id 既存＝記録は存在）。
export type ContactStoreResult = { stored: boolean; duplicate: boolean };

export type PostContactStoreOptions = {
  timeoutMs: number;
  fetchImpl?: typeof fetch;
};

/** URL・Secret の両方が揃ったときだけ configured。片方でも欠ければ外部 POST しない。 */
export function isContactStoreConfigured(
  url: string | null | undefined,
  secret: string | null | undefined,
): boolean {
  return Boolean(url && secret);
}

export async function postContactStore(
  url: string,
  body: unknown,
  opts: PostContactStoreOptions,
): Promise<ContactStoreResult> {
  const doFetch = opts.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs);
  try {
    const res = await doFetch(url, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(body),
    });
    // ステータス番号のみ（URL / Secret / 本文を含めない）。
    if (!res.ok) throw new Error(`contact store returned ${res.status}`);
    let data: { success?: boolean; stored?: boolean; duplicate?: boolean };
    try {
      data = (await res.json()) as { success?: boolean; stored?: boolean; duplicate?: boolean };
    } catch {
      // JSON 解析失敗も固定メッセージ（GAS 応答本文を throw 文へ含めない）。
      throw new Error("contact store invalid response");
    }
    if (!data.success) {
      // GAS 応答（data.error 等）を一切含めない固定メッセージ。将来 GAS 応答へ PII / Secret /
      // URL / 内部情報が混入しても throw 文へ漏れない。
      throw new Error("contact store failed");
    }
    return { stored: Boolean(data.stored), duplicate: Boolean(data.duplicate) };
  } finally {
    clearTimeout(timer);
  }
}
