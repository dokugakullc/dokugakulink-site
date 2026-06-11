"use client";
import { useState } from "react";

const PROBLEMS = [
  "続かない",
  "忘れる",
  "何を勉強すればいいか分からない",
  "点数が伸びない",
  "モチベーションが続かない",
] as const;

type Problem = typeof PROBLEMS[number];
type Status = "idle" | "loading" | "success" | "duplicated" | "error";

export default function EmailForm({ source = "takken_lp" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState<Problem | "">("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
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
      setStatus(data.duplicated ? "duplicated" : "success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
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
        <p className="text-white font-bold text-xl mb-2">登録完了しました！</p>
        <p className="text-blue-200 text-sm">リリース時にご連絡いたします。ありがとうございます。</p>
      </div>
    );
  }

  if (status === "duplicated") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
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
        <p className="text-white font-bold text-xl mb-2">登録済みのメールアドレスです</p>
        <p className="text-blue-200 text-sm">すでに登録が完了しています。リリース時にご連絡いたします。</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="text-white/80 text-sm font-medium mb-3">宅建学習で一番困っていること</p>
        <div className="grid grid-cols-1 gap-2">
          {PROBLEMS.map((p) => (
            <button
              key={p}
              type="button"
              disabled={status === "loading"}
              onClick={() => setProblem(problem === p ? "" : p)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-left font-medium border transition-colors disabled:opacity-50 ${
                problem === p
                  ? "bg-white text-[#0d2545] border-white"
                  : "bg-white/5 text-white/70 border-white/20 hover:border-white/40"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  problem === p ? "border-[#0d2545] bg-[#0d2545]" : "border-white/50"
                }`}
              >
                {problem === p && <span className="w-2 h-2 rounded-full bg-white block" />}
              </span>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-white/80 text-sm font-medium mb-2">メールアドレス</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="例：your@email.com"
          required
          disabled={status === "loading"}
          className="w-full px-4 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/60 transition-colors disabled:opacity-50"
        />
      </div>

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
