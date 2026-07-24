"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { getAttribution } from "@/lib/utm";
import { trackFormStarted, trackSubmitted, trackSubmissionFailed } from "@/lib/track";

// Google Sheetsで集計しやすい英語スラッグ
const PROBLEMS = [
  { value: "continue", label: "続かない", icon: "😓" },
  { value: "forget", label: "忘れる", icon: "🧠" },
  { value: "roadmap", label: "何を勉強すればいいか分からない", icon: "📚" },
  { value: "growth", label: "点数が伸びない", icon: "📉" },
  { value: "motivation", label: "モチベーションが続かない", icon: "🔥" },
] as const;

type ProblemValue = typeof PROBLEMS[number]["value"];
type Status = "idle" | "loading" | "success" | "duplicated" | "error";
type FieldError = "" | "email_empty" | "email_invalid" | "consent";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ERROR_TEXT: Record<Exclude<FieldError, "">, string> = {
  email_empty: "メールアドレスを入力してください。",
  email_invalid: "メールアドレスの形式をご確認ください。",
  consent: "プライバシーポリシーへの同意が必要です。",
};

interface EmailFormProps {
  source?: string;
}

export default function EmailForm({ source = "takken_lp" }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState<ProblemValue | "">("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<FieldError>("");
  const startedRef = useRef(false);

  // フォーム入力開始を一度だけ計測
  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackFormStarted({ source });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return; // 多重送信防止

    const trimmed = email.trim();
    if (!trimmed) return setFieldError("email_empty");
    if (!EMAIL_RE.test(trimmed)) return setFieldError("email_invalid");
    if (!consent) return setFieldError("consent");
    setFieldError("");

    setStatus("loading");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          problem,
          source,
          attribution: getAttribution(),
        }),
      });
      const data = (await res.json()) as { success?: boolean; duplicated?: boolean };
      if (!res.ok || !data.success) {
        trackSubmissionFailed({ source });
        setStatus("error");
        return;
      }
      trackSubmitted({ source, duplicated: data.duplicated ? "1" : "0" });
      setStatus(data.duplicated ? "duplicated" : "success");
    } catch {
      trackSubmissionFailed({ source });
      setStatus("error");
    }
  }

  if (status === "success" || status === "duplicated") {
    const duplicated = status === "duplicated";
    return (
      <div className="space-y-5 py-4" role="status" aria-live="polite">
        <div className="flex flex-col items-center text-center gap-3">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              duplicated ? "bg-blue-500/20" : "bg-green-500/20"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={duplicated ? "text-blue-400" : "text-green-400"}
              aria-hidden="true"
            >
              {duplicated ? (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </>
              ) : (
                <polyline points="20 6 9 17 4 12" />
              )}
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-lg">
              {duplicated ? "すでに登録済みです" : "ご登録ありがとうございます。"}
            </p>
            <p className="text-blue-200 text-sm mt-1">あなたの登録内容は保存されました。</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-blue-200 text-sm leading-loose">
            ウカレルの App Store 公開時に、<br />
            ご登録いただいたメールアドレスへお知らせします。
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* ① メールアドレス */}
      <div>
        <label htmlFor="waitlist-email" className="block text-white/80 text-sm font-medium mb-2">
          メールアドレス
        </label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldError === "email_empty" || fieldError === "email_invalid") setFieldError("");
          }}
          onFocus={markStarted}
          placeholder="you@example.com"
          required
          disabled={status === "loading"}
          aria-invalid={fieldError === "email_empty" || fieldError === "email_invalid"}
          aria-describedby={fieldError ? "waitlist-error" : undefined}
          className="w-full px-4 py-[18px] rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-base focus:outline-none focus:border-white/60 transition-colors disabled:opacity-50"
        />
      </div>

      {/* ② 悩みカード選択（任意） */}
      <div>
        <p className="text-white/40 text-xs mb-2.5">今一番困っていること（任意）</p>
        <div className="grid grid-cols-1 gap-2">
          {PROBLEMS.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              disabled={status === "loading"}
              aria-pressed={problem === value}
              onClick={() => {
                markStarted();
                setProblem(problem === value ? "" : value);
              }}
              className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl text-sm text-left font-medium border transition-all disabled:opacity-50 ${
                problem === value
                  ? "bg-[#007AFF] border-[#007AFF] text-white"
                  : "bg-white/5 text-white/60 border-white/10 hover:border-[#007AFF]/40 hover:bg-white/[.12]"
              }`}
            >
              <span className="text-base shrink-0" aria-hidden="true">{icon}</span>
              <span className="flex-1">{label}</span>
              <span
                aria-hidden="true"
                className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                  problem === value ? "border-white bg-white" : "border-white/30"
                }`}
              >
                {problem === value && <span className="w-2 h-2 rounded-full bg-[#007AFF] block" />}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ③ プライバシーポリシー同意（必須） */}
      <label className="flex items-start gap-3 text-left cursor-pointer select-none">
        <input
          type="checkbox"
          checked={consent}
          disabled={status === "loading"}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (fieldError === "consent" && e.target.checked) setFieldError("");
          }}
          aria-invalid={fieldError === "consent"}
          aria-describedby={fieldError === "consent" ? "waitlist-error" : undefined}
          className="mt-1 w-5 h-5 shrink-0 accent-[#007AFF]"
        />
        <span className="text-white/70 text-sm leading-relaxed">
          <Link href="/privacy" target="_blank" className="text-white underline underline-offset-2 hover:text-blue-200">
            プライバシーポリシー
          </Link>
          に同意します。ご登録いただいたメールアドレスは、リリース案内および重要なお知らせの送信に使用します。
        </span>
      </label>

      {/* ④ 送信ボタン */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-[18px] bg-white text-[#0d2545] text-base font-bold rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "送信中…" : "リリース通知を受け取る →"}
      </button>

      {fieldError && (
        <p id="waitlist-error" role="alert" className="text-amber-300 text-sm text-center">
          {ERROR_TEXT[fieldError]}
        </p>
      )}
      {status === "error" && (
        <p id="waitlist-error" role="alert" className="text-red-300 text-sm text-center">
          送信できませんでした。通信環境をご確認のうえ、もう一度お試しください。
        </p>
      )}
      <p className="text-white/30 text-xs text-center">
        メールアドレスだけで登録できます。登録は無料です。
      </p>
    </form>
  );
}
