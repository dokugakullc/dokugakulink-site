import { NextRequest, NextResponse } from "next/server";
import { handleRegister, type PostRegister } from "@/lib/registerHandler";
import { isPreviewDeployment } from "@/lib/deployEnv";
import { buildGasBody } from "@/lib/registerPayload";
import { postToGas } from "@/lib/gasClient";
import { resolveTurnstileConfig, verifyTurnstile } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  // token は共有シークレット（サーバー専用・NEXT_PUBLIC を付けない＝クライアント非公開・
  // GAS の SHARED_SECRET と同値・値はログへ出さない）。URL または Secret が未設定なら
  // 外部 POST を行わず 500（gasConfigured=false）で安全に失敗する。
  const gasUrl = process.env.GAS_WEBHOOK_URL;
  const gasSecret = process.env.GAS_SHARED_SECRET;
  // Turnstile: SiteKey/Secret 両方揃えば必須・両方未設定なら無効・片方だけなら misconfigured。
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

  // 実際の送信: GAS へ AbortController で実中断（DL-002）。ボディ組み立てと送信は抽出済み。
  const postRegister: PostRegister = (payload, ctx) =>
    postToGas(gasUrl ?? "", buildGasBody(payload, gasSecret ?? ""), { timeoutMs: ctx.timeoutMs });

  const result = await handleRegister(req, {
    gasConfigured: Boolean(gasUrl && gasSecret),
    isPreview: isPreviewDeployment(process.env.VERCEL_ENV),
    postRegister,
    // Turnstile（未設定なら state=disabled で従来挙動）。verify は secret を束ねて注入。
    turnstile: {
      state: resolveTurnstileConfig(turnstileSiteKey, turnstileSecret),
      verify: (token, ctx) =>
        verifyTurnstile(turnstileSecret ?? "", token, { action: ctx.action, timeoutMs: ctx.timeoutMs }),
    },
    logError: (message, meta) => console.error(message, meta),
    logWarn: (message, meta) => console.warn(message, meta),
  });

  return NextResponse.json(result.body, { status: result.status });
}
