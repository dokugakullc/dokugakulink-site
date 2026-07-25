"use client";
import { useEffect } from "react";
import { initPostHog, POSTHOG_KEY } from "@/lib/posthog";

// NEXT_PUBLIC_POSTHOG_KEY が未設定なら何も初期化しない（PostHog無効環境でもページは正常）。
// 実イベントは lib/track 経由で送る。
export default function PostHog() {
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    initPostHog();
  }, []);
  return null;
}
