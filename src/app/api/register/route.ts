import { NextRequest, NextResponse } from "next/server";

const ALLOWED_SOURCES = ["takken_lp", "fp_lp", "boki_lp", "gyosei_lp"] as const;
const ALLOWED_PROBLEMS = [
  "続かない",
  "忘れる",
  "何を勉強すればいいか分からない",
  "点数が伸びない",
  "モチベーションが続かない",
] as const;

type GasResponse = { success: boolean; duplicated?: boolean; error?: string };

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

  const { email, problem, source } = body as Record<string, unknown>;

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
        email: email.trim().toLowerCase(),
        problem: normalizedProblem,
        source: normalizedSource,
        userAgent: userAgent.slice(0, 300),
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
