"use client";
import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("お問い合わせ");
    const body = encodeURIComponent(
      `お名前: ${name}\nメールアドレス: ${email}\n\nお問い合わせ内容:\n${message}`
    );
    window.location.href = `mailto:info@dokugakulink.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <p className="text-sm font-medium text-[#0d2545] mb-2">メーラーが開きました</p>
        <p className="text-sm text-gray-600 leading-loose">
          入力内容がメーラーに反映されています。送信してお問い合わせください。
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-sm text-blue-700 hover:underline"
        >
          フォームに戻る
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
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d2545] focus:border-transparent transition"
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
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d2545] focus:border-transparent transition"
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
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d2545] focus:border-transparent transition resize-none"
          placeholder="お問い合わせ内容をご記入ください"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#0d2545] text-white text-sm font-semibold py-3.5 rounded-lg hover:bg-[#142f5a] transition-colors"
      >
        送信する
      </button>

      <p className="text-xs text-gray-400 text-center leading-loose">
        送信ボタンを押すとメーラーが起動します。
        ご利用のメールアプリから送信してください。
      </p>
    </form>
  );
}
