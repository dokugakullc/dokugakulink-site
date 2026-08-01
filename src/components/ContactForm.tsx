"use client";
import { useEffect, useRef, useState } from "react";
import { CONTACT_LIMITS, EMAIL_RE, HONEYPOT_FIELD } from "@/lib/formSecurity";
import { resolveSubmissionId, type SubmissionState } from "@/lib/submission";
import { createSubmitGuard } from "@/lib/submitGuard";

type Status = "idle" | "sending" | "success" | "error";
type FieldKey = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldKey, string>>;

const { NAME_MAX, EMAIL_MAX, MESSAGE_MAX } = CONTACT_LIMITS;

// クライアント側の検証（サーバー formSecurity と同一基準）。
function validateFields(values: { name: string; email: string; message: string }): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();
  if (!name) errors.name = "お名前を入力してください。";
  else if (name.length > NAME_MAX) errors.name = `お名前は${NAME_MAX}文字以内で入力してください。`;
  if (!email) errors.email = "メールアドレスを入力してください。";
  else if (!EMAIL_RE.test(email)) errors.email = "メールアドレスの形式をご確認ください。";
  else if (email.length > EMAIL_MAX) errors.email = `メールアドレスは${EMAIL_MAX}文字以内で入力してください。`;
  if (!message) errors.message = "お問い合わせ内容を入力してください。";
  else if (message.length > MESSAGE_MAX) errors.message = `お問い合わせ内容は${MESSAGE_MAX}文字以内で入力してください。`;
  return errors;
}

function newSubmissionId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `sid-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // honeypot（通常は空）。値が入るのは自動化ツールのみ。
  const [hp, setHp] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [reference, setReference] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);
  // 冪等キー種と、それに対応する「送信内容スナップショット」。
  // 内容が変わらない再試行では id を保持し、内容が変わったら作り直す（resolveSubmissionId）。
  const [submission, setSubmission] = useState<SubmissionState | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const formErrorRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  // 同期ロック（React state に依存しない多重送信防止）
  const submitGuard = useRef(createSubmitGuard()).current;

  useEffect(() => {
    if (status === "error") formErrorRef.current?.focus();
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const focusFirstInvalid = (errors: FieldErrors) => {
    if (errors.name) nameRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.message) messageRef.current?.focus();
  };

  const clearFieldError = (key: FieldKey) =>
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const resetForm = () => {
    setStatus("idle");
    setReference("");
    setName("");
    setEmail("");
    setMessage("");
    setHp("");
    setFieldErrors({});
    setErrorMessage("");
    setSubmission(null); // 新しい問い合わせ＝次回送信時に新しい冪等キーを生成
    // 自然なフォーカス復帰: 最初の入力へ
    requestAnimationFrame(() => nameRef.current?.focus());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 同期ロック: 同一tickの多重送信を即時遮断（state 更新の遅延に依存しない）
    if (submitGuard.isLocked()) return;

    const errors = validateFields({ name, email, message });
    if (Object.values(errors).some(Boolean)) {
      setFieldErrors(errors);
      focusFirstInvalid(errors);
      return; // 検証エラーはロックを取得しない（残さない）
    }
    setFieldErrors({});

    // 外部送信の直前にロック取得。submissionId もこの後で1回だけ生成する。
    submitGuard.lock();
    setStatus("sending");
    setErrorMessage("");

    // 送信内容のスナップショットに対応した submissionId を決める。
    // 内容変更なしの再試行 → 同じ id / 内容変更あり → 新しい id（異payload×同キーの拒否を回避）。
    const next = resolveSubmissionId(submission, { name, email, message }, newSubmissionId);
    setSubmission(next);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, submissionId: next.id, [HONEYPOT_FIELD]: hp }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        reference?: string;
        confirmationEmailSent?: boolean;
      };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "送信に失敗しました");
      }
      setReference(data.reference ?? "");
      // confirmationEmailSent の実態に応じて success 表示を分岐（虚偽の確認送信主張をしない）
      setConfirmationSent(Boolean(data.confirmationEmailSent));
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "送信に失敗しました");
      // honeypot 誤検知等で失敗した場合でも利用者が再操作できるよう honeypot をリセット。
      setHp("");
    } finally {
      // 失敗・例外・成功いずれでも解放（エラー後の再試行を妨げない）
      submitGuard.unlock();
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-10 text-center" role="status" aria-live="polite">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p ref={successRef} tabIndex={-1} className="text-base font-bold text-[#0d2545] mb-2 outline-none">
          お問い合わせを受け付けました
        </p>
        <p className="text-sm text-gray-600 leading-loose">
          {confirmationSent ? (
            <>
              ご登録のメールアドレスに受付完了メールをお送りしました。<br />
              通常2営業日以内にご返信いたします。
            </>
          ) : (
            <>
              お問い合わせを受け付けました。通常2営業日以内にご返信いたします。<br />
              （受付完了メールは送信できませんでした。受付番号をお控えください。）
            </>
          )}
        </p>
        {reference && (
          <p className="mt-4 inline-block rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-xs text-gray-500">
            受付番号：<span className="font-semibold text-[#0d2545]">{reference}</span>
          </p>
        )}
        <button onClick={resetForm} className="mt-6 text-sm text-blue-700 hover:underline">
          新しいお問い合わせをする
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-busy={sending}>
      {/* 氏名 */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          氏名 <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          ref={nameRef}
          type="text"
          required
          aria-required="true"
          autoComplete="name"
          maxLength={NAME_MAX}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError("name");
          }}
          disabled={sending}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d2545] focus:border-transparent transition disabled:opacity-50"
          placeholder="山田 太郎"
        />
        {fieldErrors.name && (
          <p id="name-error" className="mt-2 text-sm text-red-600">
            {fieldErrors.name}
          </p>
        )}
      </div>

      {/* メールアドレス */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          メールアドレス <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          ref={emailRef}
          type="email"
          required
          aria-required="true"
          autoComplete="email"
          inputMode="email"
          maxLength={EMAIL_MAX}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFieldError("email");
          }}
          disabled={sending}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d2545] focus:border-transparent transition disabled:opacity-50"
          placeholder="example@email.com"
        />
        {fieldErrors.email && (
          <p id="email-error" className="mt-2 text-sm text-red-600">
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* お問い合わせ内容 */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          お問い合わせ内容 <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          ref={messageRef}
          required
          aria-required="true"
          maxLength={MESSAGE_MAX}
          rows={6}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            clearFieldError("message");
          }}
          disabled={sending}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d2545] focus:border-transparent transition resize-none disabled:opacity-50"
          placeholder="お問い合わせ内容をご記入ください"
        />
        {fieldErrors.message && (
          <p id="message-error" className="mt-2 text-sm text-red-600">
            {fieldErrors.message}
          </p>
        )}
      </div>

      {/* honeypot: 視覚・支援技術の双方から隠す。自動入力対策として一般的なフィールド名を避け、
          パスワードマネージャの無視属性も付与する。 */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor={HONEYPOT_FIELD}>この欄は入力しないでください</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
      </div>

      {/* サーバーエラー等（フォーム全体の通知＋フォーカス移動） */}
      <p
        ref={formErrorRef}
        tabIndex={-1}
        role="alert"
        aria-live="assertive"
        className={`text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 outline-none ${
          status === "error" ? "" : "hidden"
        }`}
      >
        {errorMessage}
      </p>

      {/* 送信中の状態を支援技術へ通知 */}
      <p className="sr-only" role="status" aria-live="polite">
        {sending ? "送信しています。しばらくお待ちください。" : ""}
      </p>

      <button
        type="submit"
        disabled={sending}
        className="w-full bg-[#0d2545] text-white text-sm font-semibold py-3.5 rounded-lg hover:bg-[#142f5a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {sending ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
