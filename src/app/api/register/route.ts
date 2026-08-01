import { NextRequest, NextResponse } from "next/server";

const ALLOWED_SOURCES = [
  "takken_lp",
  "takken_lp_hero",
  "landing_takken",
  "services_takken",
  "fp_lp",
  "boki_lp",
  "gyosei_lp",
] as const;

// 英語スラッグで統一 — Google Sheetsで集計しやすい形式
const ALLOWED_PROBLEMS = ["continue", "forget", "roadmap", "growth", "motivation"] as const;

// 広告帰属として保存を許可するキー（PII は含めない）
const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "landing_url",
  "referrer",
] as const;

type GasResponse = { success: boolean; duplicated?: boolean; error?: string };

function deriveInterest(source: string): string {
  if (source.includes("takken")) return "takken";
  if (source.includes("fp")) return "fp";
  if (source.includes("boki")) return "boki";
  if (source.includes("gyosei")) return "gyosei";
  return "";
}

// クライアントから来た帰属情報を許可キーだけに詰め替える（構造的にPII混入を防ぐ）
function sanitizeAttribution(input: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof input !== "object" || input === null) return out;
  const src = input as Record<string, unknown>;
  for (const key of ATTRIBUTION_KEYS) {
    const v = src[key];
    if (typeof v === "string" && v.trim()) {
      out[key] = v.trim().replace(/[\r\n\t]/g, " ").slice(0, 200);
    }
  }
  return out;
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

  const { email, problem, source, attribution } = body as Record<string, unknown>;

  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "メールアドレスを入力してください" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: "正しいメールアドレスを入力してください" }, { status: 400 });
  }

  const normalizedSource = typeof source === "string" ? source : "takken_lp";
  if (!(ALLOWED_SOURCES as readonly string[]).includes(normalizedSource)) {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const normalizedProblem =
    typeof problem === "string" &&
    (ALLOWED_PROBLEMS as readonly string[]).includes(problem)
      ? problem
      : "";

  // interest はソースから自動導出（LP別に固定値）
  const interest = deriveInterest(normalizedSource);
  const attr = sanitizeAttribution(attribution);

  const gasUrl = process.env.GAS_WEBHOOK_URL;
  if (!gasUrl) {
    console.error("GAS_WEBHOOK_URL is not configured");
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }

  const userAgent = req.headers.get("user-agent") ?? "";

  try {
    const res = await fetch(gasUrl, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // 共有シークレット（サーバー専用・NEXT_PUBLIC を付けない＝クライアントへ露出しない）。
        // GAS 側スクリプトプロパティ SHARED_SECRET と同値。値はログへ出さない。
        token: process.env.GAS_SHARED_SECRET ?? "",
        email: email.trim().toLowerCase(),
        interest,
        problem: normalizedProblem,
        source: normalizedSource,
        userAgent: userAgent.slice(0, 300),
        ...attr,
      }),
    });

    if (!res.ok) {
      throw new Error(`GAS returned ${res.status}`);
    }

    const data = (await res.json()) as GasResponse;
    if (!data.success) {
      throw new Error(data.error ?? "GAS error");
    }

    return NextResponse.json({ success: true, duplicated: data.duplicated ?? false });
  } catch (err) {
    console.error("GAS request failed:", err);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
