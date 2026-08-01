// GAS(Apps Script webhook)への送信クライアント（AbortController で実中断・テスト可能）。
// fetchImpl を注入でき、テストは外部 GAS へ接続しない。エラーに GAS URL / Secret / PII を含めない。
export type GasResult = { duplicated: boolean };

export type PostToGasOptions = {
  timeoutMs: number;
  fetchImpl?: typeof fetch;
};

export async function postToGas(
  url: string,
  body: unknown,
  opts: PostToGasOptions,
): Promise<GasResult> {
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
    // ステータスのみ（URL / Secret / 本文を含めない）
    if (!res.ok) throw new Error(`GAS returned ${res.status}`);
    const data = (await res.json()) as { success?: boolean; duplicated?: boolean; error?: string };
    if (!data.success) {
      // GAS は unauthorized / invalid_email 等の汎用コードのみ返す（PII/Secret を含めない設計）
      throw new Error(`GAS error: ${data.error ?? "unknown"}`);
    }
    return { duplicated: data.duplicated ?? false };
  } finally {
    clearTimeout(timer);
  }
}
