"use client";
import { useState } from "react";
import { sendGAEvent } from "@/lib/gtag";

// Google Sheetsで集計しやすい英語スラッグ
const PROBLEMS = [
  { value: "continue", label: "続かない" },
  { value: "forget", label: "忘れる" },
  { value: "roadmap", label: "何を勉強すればいいか分からない" },
  { value: "growth", label: "点数が伸びない" },
  { value: "motivation", label: "モチベーションが続かない" },
] as const;

type ProblemValue = typeof PROBLEMS[number]["value"];
type Status = "idle" | "loading" | "success" | "duplicated" | "error";

interface EmailFormProps {
  source?: string;
  // 将来 /api/stats から取得に変更予定
  betaSignups?: number;
}

export default function EmailForm({ source = "takken_lp", betaSignups }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState<ProblemValue | "">("");
  const [showProblems, setShowProblems] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    sendGAEvent("cta_click", { source, problem: problem || "" });
    sendGAEvent("registration_submit", { source, problem: problem || "" });
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, problem, source }),
      });
      const data = (await res.json()) as { success?: boolean; duplicated?: boolean };
      if (!res.ok || !data.success) {
        setStatus("error");
        return;
      }
      if (data.duplicated) {
        sendGAEvent("registration_duplicate", { source, problem: problem || "" });
        setStatus("duplicated");
      } else {
        sendGAEvent("registration_success", { source, problem: problem || "" });
        setStatus("success");
      }
    } catch {
      setStatus("error");
    }
  }

  const problemLabel = PROBLEMS.find((p) => p.value === problem)?.label;

  if (status === "success") {
    return (
      <div className="space-y-5 py-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-400"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-lg">登録ありがとうございます。</p>
            <p className="text-blue-200 text-sm mt-1">あなたの登録内容は保存されました。</p>
          </div>
        </div>

        {betaSignups !== undefined && (
          <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-5 text-center">
            <p className="text-xs text-blue-300 mb-1.5">現在のβ版登録者数</p>
            <p className="text-4xl font-black text-white tabular-nums">
              {betaSignups}
              <span className="text-lg font-normal text-blue-300 ml-1">名</span>
            </p>
          </div>
        )}

        {problemLabel && (
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-300 mb-1">あなたの悩み</p>
            <p className="text-sm text-white font-semibold">{problemLabel}</p>
          </div>
        )}

        <div className="text-center">
          <p className="text-blue-200 text-sm leading-loose">
            正式リリース時に<br />優先的にご案内します。
          </p>
        </div>
      </div>
    );
  }

  if (status === "duplicated") {
    return (
      <div className="space-y-5 py-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-400"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-lg">登録済みのメールアドレスです</p>
            <p className="text-blue-200 text-sm mt-1">あなたの登録内容は保存されています。</p>
          </div>
        </div>

        {betaSignups !== undefined && (
          <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-5 text-center">
            <p className="text-xs text-blue-300 mb-1.5">現在のβ版登録者数</p>
            <p className="text-4xl font-black text-white tabular-nums">
              {betaSignups}
              <span className="text-lg font-normal text-blue-300 ml-1">名</span>
            </p>
          </div>
        )}

        <div className="text-center">
          <p className="text-blue-200 text-sm leading-loose">
            正式リリース時に<br />優先的にご案内します。
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ① メールアドレス（必須・最初） */}
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレスを入力"
          required
          disabled={status === "loading"}
          className="w-full px-4 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/60 transition-colors disabled:opacity-50"
        />
      </div>

      {/* ② 悩み選択（任意・折りたたみ） */}
      <div>
        <button
          type="button"
          onClick={() => setShowProblems((v) => !v)}
          disabled={status === "loading"}
          className="flex items-center gap-2 text-white/50 text-xs hover:text-white/70 transition-colors disabled:opacity-50"
        >
          <span
            className={`transition-transform duration-200 ${showProblems ? "rotate-90" : ""}`}
          >
            ▶
          </span>
          今一番困っていること（任意）
          {problem && (
            <span className="ml-1 bg-white/10 text-white/80 text-[10px] px-2 py-0.5 rounded-full">
              選択済み
            </span>
          )}
        </button>

        {showProblems && (
          <div className="mt-2 grid grid-cols-1 gap-1.5">
            {PROBLEMS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                disabled={status === "loading"}
                onClick={() => setProblem(problem === value ? "" : value)}
                className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm text-left font-medium border transition-colors disabled:opacity-50 ${
                  problem === value
                    ? "bg-white text-[#0d2545] border-white"
                    : "bg-white/5 text-white/70 border-white/15 hover:border-white/35"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    problem === value ? "border-[#0d2545] bg-[#0d2545]" : "border-white/40"
                  }`}
                >
                  {problem === value && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                </span>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ③ 送信ボタン */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 bg-white text-[#0d2545] text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "送信中..." : "無料でβ版に参加する →"}
      </button>

      {status === "error" && (
        <p className="text-red-300 text-xs text-center">
          送信に失敗しました。時間をおいて再度お試しください。
        </p>
      )}
      <p className="text-white/30 text-xs text-center">
        スパムメールは送りません。リリース時のみご連絡します。
      </p>
    </form>
  );
}
