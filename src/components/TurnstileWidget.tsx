"use client";
// Cloudflare Turnstile ウィジェット（公式 api.js を明示描画で読み込む・外部ライブラリ依存なし）。
// SiteKey が渡されたときだけ描画される（呼び出し側は未設定なら本コンポーネントを描画しない）。
// token は React state（呼び出し側）で保持し、localStorage / sessionStorage / Cookie / Analytics へ出さない。
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileRenderOptions = {
  sitekey: string;
  action?: string;
  theme?: "auto" | "light" | "dark";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  "timeout-callback"?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: TurnstileRenderOptions) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;
function ensureTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("turnstile script load failed")));
      return;
    }
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("turnstile script load failed"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export type TurnstileWidgetHandle = { reset: () => void };

type Props = {
  siteKey: string;
  action: "contact" | "register";
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  theme?: "auto" | "light" | "dark";
};

// 成功/期限切れ/エラーのコールバックは ref で最新参照（再レンダーで widget を作り直さない）。
const TurnstileWidget = forwardRef<TurnstileWidgetHandle, Props>(function TurnstileWidget(props, ref) {
  const { siteKey, action, theme = "auto" } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const cb = useRef(props);
  cb.current = props;

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        if (widgetIdRef.current && typeof window !== "undefined" && window.turnstile) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch {
            /* widget 未初期化などは無視 */
          }
        }
      },
    }),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    ensureTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme,
          callback: (token: string) => cb.current.onVerify(token),
          "expired-callback": () => cb.current.onExpire?.(),
          "error-callback": () => cb.current.onError?.(),
          "timeout-callback": () => cb.current.onExpire?.(),
        });
      })
      .catch(() => {
        // script 読込失敗時は widget を出せない → 呼び出し側で送信不可のまま案内。
        cb.current.onError?.();
      });
    return () => {
      cancelled = true;
      if (widgetIdRef.current && typeof window !== "undefined" && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* 無視 */
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, action, theme]);

  return <div ref={containerRef} className="cf-turnstile" aria-label="ボット対策の確認" />;
});

export default TurnstileWidget;
