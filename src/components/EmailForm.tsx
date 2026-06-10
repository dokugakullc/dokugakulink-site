"use client";
import { useState } from "react";

const INTERESTS = ["宅建", "FP", "簿記", "行政書士"] as const;
type Interest = (typeof INTERESTS)[number];
type Status = "idle" | "loading" | "success" | "duplicated" | "error";

export default function EmailForm({ source = "takken_lp" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  function toggleInterest(item: Interest) {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interests, source }),
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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="例：your@email.com"
          required
          disabled={status === "loading"}
          className="flex-1 px-4 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/60 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-7 py-3.5 bg-white text-[#0d2545] text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-60 shrink-0 whitespace-nowrap"
        >
          {status === "loading" ? "送信中..." : "リリース通知を受け取る"}
        </button>
      </div>

      <div>
        <p className="text-white/60 text-xs mb-2.5">興味がある資格（任意・複数選択可）</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleInterest(item)}
              disabled={status === "loading"}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors disabled:opacity-50 ${
                interests.includes(item)
                  ? "bg-white text-[#0d2545] border-white"
                  : "bg-transparent text-white/70 border-white/30 hover:border-white/60"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

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
