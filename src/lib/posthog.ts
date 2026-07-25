// PostHog（プロダクト分析）ラッパー。
// NEXT_PUBLIC_POSTHOG_KEY が未設定なら全て no-op になり、ページ・計測は壊れない。
// PII（メールアドレス等）は送らない（既存のMeta/GA方針＝匿名送信に準拠）。
import posthog from "posthog-js";

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

type Loaded = { __loaded?: boolean };

function ready(): boolean {
  if (typeof window === "undefined" || !POSTHOG_KEY) return false;
  return Boolean((posthog as unknown as Loaded).__loaded);
}

/** PostHog を一度だけ初期化する（loaderコンポーネントから呼ぶ）。 */
export function initPostHog(): void {
  if (typeof window === "undefined" || !POSTHOG_KEY) return;
  if ((posthog as unknown as Loaded).__loaded) return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // ページ表示は lib/track 経由で明示送信する
    capture_pageleave: true,
    person_profiles: "identified_only",
  });
}

/** PostHog カスタムイベントを送る（未初期化なら no-op）。 */
export function phCapture(event: string, props?: Record<string, string>): void {
  if (!ready()) return;
  try {
    posthog.capture(event, props ?? {});
  } catch {
    /* 計測失敗はページ挙動に影響させない */
  }
}
