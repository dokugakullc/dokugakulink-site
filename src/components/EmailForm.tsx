"use client";
import { useState } from "react";

// TODO: Formspreeでフォームを作成し、エンドポイントURLを環境変数 NEXT_PUBLIC_FORMSPREE_URL に設定してください
// 例: NEXT_PUBLIC_FORMSPREE_URL=https://formspree.io/f/xxxxxxxx
const FORMSPREE_URL = process.env.NEXT_PUBLIC_FORMSPREE_URL ?? "";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!FORMSPREE_URL) {
      setStatus("error");
      return;
    }
    setStatus("loading");

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
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

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
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
      </form>
      {status === "error" && (
        <p className="text-red-300 text-xs mt-3 text-center">
          {!FORMSPREE_URL
            ? "フォームの設定が必要です。NEXT_PUBLIC_FORMSPREE_URLを設定してください。"
            : "送信に失敗しました。時間をおいて再度お試しください。"}
        </p>
      )}
      <p className="text-white/30 text-xs mt-4 text-center">
        スパムメールは送りません。リリース時のみご連絡します。
      </p>
    </div>
  );
}
