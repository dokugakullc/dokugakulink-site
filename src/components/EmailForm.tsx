"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { getAttribution } from "@/lib/utm";
import {
  trackFormStarted,
  trackSubmitted,
  trackDuplicate,
  trackSubmissionFailed,
  trackSurveyAnswered,
} from "@/lib/track";
import { useVariant, resolveVariant, isAbSource } from "@/lib/ab";
import { HONEYPOT_FIELD } from "@/lib/formSecurity";
import { createSubmitGuard } from "@/lib/submitGuard";
import { resolveRegistrationOutcome, outcomeFiresMetaLead } from "@/lib/registrationOutcome";
import { isTurnstileWidgetActive, canSubmitTurnstile, turnstilePayloadField } from "@/lib/turnstileClient";
import TurnstileWidget, { type TurnstileWidgetHandle } from "@/components/TurnstileWidget";

// SiteKey 未設定なら widget を描画せず送信可能（従来挙動）。設定時のみ Cloudflare script を読み込む。
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_ENABLED = process.env.NEXT_PUBLIC_TURNSTILE_ENABLED;

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
type FieldError = "" | "email_empty" | "email_invalid" | "consent" | "turnstile";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ERROR_TEXT: Record<Exclude<FieldError, "">, string> = {
  email_empty: "メールアドレスを入力してください。",
  email_invalid: "メールアドレスの形式をご確認ください。",
  consent: "プライバシーポリシーへの同意が必要です。",
  turnstile: "認証の確認が完了していません。少し待つか、チェックをやり直してください。",
};

interface EmailFormProps {
  source?: string;
}

// 悩みカードUI（A: フォーム内 / B: 登録完了後 で共用）
function ProblemCards({
  selected,
  onSelect,
  disabled,
}: {
  selected: ProblemValue | "";
  onSelect: (v: ProblemValue) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {PROBLEMS.map(({ value, label, icon }) => (
        <button
          key={value}
          type="button"
          disabled={disabled}
          aria-pressed={selected === value}
          onClick={() => onSelect(value)}
          className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl text-sm text-left font-medium border transition-all disabled:opacity-50 ${
            selected === value
              ? "bg-[#007AFF] border-[#007AFF] text-white"
              : "bg-white/5 text-white/60 border-white/10 hover:border-[#007AFF]/40 hover:bg-white/[.12]"
          }`}
        >
          <span className="text-base shrink-0" aria-hidden="true">{icon}</span>
          <span className="flex-1">{label}</span>
          <span
            aria-hidden="true"
            className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
              selected === value ? "border-white bg-white" : "border-white/30"
            }`}
          >
            {selected === value && <span className="w-2 h-2 rounded-full bg-[#007AFF] block" />}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function EmailForm({ source = "takken_lp" }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState<ProblemValue | "">("");
  const [consent, setConsent] = useState(false);
  // honeypot: 通常の利用者・支援技術には見えない。値が入るのは bot のみ。
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<FieldError>("");
  const [surveyDone, setSurveyDone] = useState(false);
  const startedRef = useRef(false);
  // 同期ロック（React state に依存しない多重送信防止）
  const submitGuard = useRef(createSubmitGuard()).current;
  // Turnstile: 有効化フラグ("true")＋SiteKey 設定時のみ widget を描画し token を保持（localStorage 等には保存しない）。
  const turnstileActive = isTurnstileWidgetActive(TURNSTILE_ENABLED, TURNSTILE_SITE_KEY);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  // A/B は広告LP(source=landing_takken)のみ有効。他ルート(services_takken)は常にA・非バケット。
  const abOn = isAbSource(source);
  // null(未確定)/A はフォーム内アンケートを表示（＝SSR既定=A）。B は非表示にし完了後へ移設。
  const variant = useVariant();
  const isB = abOn && variant === "B";

  // 計測 params（A/B有効時のみ variant を付与）
  function withVariant(base: Record<string, string>): Record<string, string> {
    return abOn ? { ...base, variant: resolveVariant() } : base;
  }

  // フォーム入力開始を一度だけ計測
  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackFormStarted(withVariant({ source }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // 同期ロック: 同一tickの多重送信を即時遮断（state 更新の遅延に依存しない）
    if (submitGuard.isLocked()) return;

    const trimmed = email.trim();
    if (!trimmed) return setFieldError("email_empty");
    if (!EMAIL_RE.test(trimmed)) return setFieldError("email_invalid");
    if (!consent) return setFieldError("consent");
    // Turnstile: SiteKey 設定時は token 取得まで送信不可（未取得・期限切れ・エラーで null）。
    if (!canSubmitTurnstile({ siteConfigured: turnstileActive, token: turnstileToken })) return setFieldError("turnstile");
    setFieldError("");

    // B版はアンケートを送信ペイロードに含めない（登録API・保存先は不変・回答は完了後に分析イベントのみ）
    const submitProblem = isB ? "" : problem;

    // 外部送信の直前にロック取得（検証エラーは上で return 済み＝ロックを残さない）
    submitGuard.lock();
    setStatus("loading");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          problem: submitProblem,
          source,
          attribution: getAttribution(),
          // Turnstile token は固定フィールドで送る（サーバーで検証・GAS/Analytics には出さない）。
          ...turnstilePayloadField(turnstileToken),
          [HONEYPOT_FIELD]: hp, // honeypot（通常は空）
        }),
      });
      const data = (await res.json()) as { success?: boolean; duplicated?: boolean };
      // 計測へ渡すのは source / variant のみ（メールアドレス等 PII は渡さない）。
      const outcome = resolveRegistrationOutcome({
        ok: res.ok,
        success: data.success,
        duplicated: data.duplicated,
      });
      if (outcome === "failed") {
        trackSubmissionFailed(withVariant({ source }));
        setHp(""); // honeypot 誤検知等で失敗しても再操作できるようリセット
        setTurnstileToken(null); // token は単回利用。失敗時は破棄して widget を再取得
        turnstileRef.current?.reset();
        setStatus("error");
        return;
      }
      // Meta Lead を発火してよいのは新規登録のみ。判定は outcomeFiresMetaLead に一元化
      // （テスト済みの判定関数を本番分岐に結合。重複は Lead を発火しない）。
      if (outcomeFiresMetaLead(outcome)) {
        trackSubmitted(withVariant({ source })); // 新規: GA4 + Meta Lead + PostHog
        setStatus("success");
      } else {
        trackDuplicate(withVariant({ source })); // 重複: Lead を発火しない
        setStatus("duplicated");
      }
    } catch {
      trackSubmissionFailed(withVariant({ source }));
      setHp("");
      setTurnstileToken(null); // token は単回利用。失敗時は破棄して widget を再取得
      turnstileRef.current?.reset();
      setStatus("error");
    } finally {
      // 失敗・例外・成功いずれでも解放（エラー後の再試行を妨げない）
      submitGuard.unlock();
    }
  }

  // B版: 登録完了後アンケートの回答（分析イベントのみ・登録APIは呼ばない）
  function answerSurvey(value: ProblemValue) {
    if (surveyDone) return;
    setProblem(value);
    setSurveyDone(true);
    trackSurveyAnswered({ source, variant: "B", problem: value });
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

        {/* B版のみ: 登録完了後の任意アンケート（回答は分析イベントとしてのみ記録） */}
        {isB && (
          <div className="pt-5 mt-2 border-t border-white/10">
            {surveyDone ? (
              <p className="text-blue-200 text-sm text-center py-2">
                ご回答ありがとうございます。参考にさせていただきます。
              </p>
            ) : (
              <>
                <p className="text-white/80 text-sm font-medium text-center mb-1">
                  今、宅建の学習で一番困っていることは？
                </p>
                <p className="text-white/40 text-xs text-center mb-3">
                  任意です。今後の改善の参考にさせていただきます。
                </p>
                <ProblemCards selected={problem} onSelect={answerSurvey} />
              </>
            )}
          </div>
        )}
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
          maxLength={254}
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

      {/* ② 悩みカード選択（任意）— A版のみフォーム内に表示。B版は登録完了後に移設。 */}
      {!isB && (
        <div>
          <p className="text-white/40 text-xs mb-2.5">今一番困っていること（任意）</p>
          <ProblemCards
            selected={problem}
            disabled={status === "loading"}
            onSelect={(v) => {
              markStarted();
              setProblem(problem === v ? "" : v);
            }}
          />
        </div>
      )}

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

      {/* honeypot: 視覚・支援技術の双方から隠す（aria-hidden + tabIndex -1 + autoComplete off） */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor={HONEYPOT_FIELD}>この欄は入力しないでください</label>
        <input
          id={HONEYPOT_FIELD}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
      </div>

      {/* Turnstile（SiteKey 設定時のみ描画。未設定なら widget なしで従来どおり送信可能）。 */}
      {turnstileActive && TURNSTILE_SITE_KEY && (
        <div>
          <TurnstileWidget
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            action="register"
            theme="dark"
            onVerify={(token) => {
              setTurnstileToken(token);
              if (fieldError === "turnstile") setFieldError("");
            }}
            onExpire={() => setTurnstileToken(null)}
            onError={() => setTurnstileToken(null)}
          />
        </div>
      )}

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
