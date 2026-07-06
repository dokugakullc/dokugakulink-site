"use client";
import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [reference, setReference] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string; reference?: string };

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "送信に失敗しました");
      }

      setReference(data.reference ?? "");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "送信に失敗しました");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-10 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-base font-bold text-[#0d2545] mb-2">お問い合わせを受け付けました</p>
        <p className="text-sm text-gray-600 leading-loose">
          ご登録のメールアドレスに受付完了メールをお送りしました。<br />
          通常2営業日以内にご返信いたします。
        </p>
        {reference && (
          <p className="mt-4 inline-block rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-xs text-gray-500">
            受付番号：<span className="font-semibold text-[#0d2545]">{reference}</span>
          </p>
        )}
        <button
          onClick={() => {
            setStatus("idle");
            setReference("");
            setName("");
            setEmail("");
            setMessage("");
          }}
          className="mt-6 text-sm text-blue-700 hover:underline"
        >
          新しいお問い合わせをする
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          氏名 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === "sending"}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d2545] focus:border-transparent transition disabled:opacity-50"
          placeholder="山田 太郎"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d2545] focus:border-transparent transition disabled:opacity-50"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          お問い合わせ内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={status === "sending"}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d2545] focus:border-transparent transition resize-none disabled:opacity-50"
          placeholder="お問い合わせ内容をご記入ください"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-[#0d2545] text-white text-sm font-semibold py-3.5 rounded-lg hover:bg-[#142f5a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
