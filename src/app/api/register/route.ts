import { NextRequest, NextResponse } from "next/server";
import { handleRegister, type PostRegister } from "@/lib/registerHandler";
import { isPreviewDeployment } from "@/lib/deployEnv";

type GasResponse = { success: boolean; duplicated?: boolean; error?: string };

export async function POST(req: NextRequest) {
  const gasUrl = process.env.GAS_WEBHOOK_URL;

  // 実際の送信: GAS へ AbortController で実中断（DL-002）。
  const postRegister: PostRegister = async (payload, ctx) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ctx.timeoutMs);
    try {
      const res = await fetch(gasUrl ?? "", {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`GAS returned ${res.status}`);
      const data = (await res.json()) as GasResponse;
      if (!data.success) throw new Error(data.error ?? "GAS error");
      return { duplicated: data.duplicated ?? false };
    } finally {
      clearTimeout(timer);
    }
  };

  const result = await handleRegister(req, {
    gasConfigured: Boolean(gasUrl),
    isPreview: isPreviewDeployment(process.env.VERCEL_ENV),
    postRegister,
    logError: (message, meta) => console.error(message, meta),
    logWarn: (message, meta) => console.warn(message, meta),
  });

  return NextResponse.json(result.body, { status: result.status });
}
