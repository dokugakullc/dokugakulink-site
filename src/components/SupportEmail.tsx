"use client";
import { useState } from "react";

export default function SupportEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={`mailto:${email}`}
          className="text-lg font-semibold text-[#0d2545] hover:text-blue-700 transition-colors break-all"
        >
          {email}
        </a>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "メールアドレスをコピーしました" : "メールアドレスをコピー"}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-[#0d2545] hover:text-[#0d2545] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d2545]"
        >
          {copied ? (
            <svg
              aria-hidden="true"
              className="h-4 w-4 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
          )}
          {copied ? "コピーしました" : "コピー"}
        </button>
      </div>
      <a
        href={`mailto:${email}`}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0d2545] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#142f5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d2545]"
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
        メールを送る
      </a>
    </div>
  );
}
