"use client";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/utm";
import { trackLandingPageView } from "@/lib/track";
import { resolveVariant, isAbSource } from "@/lib/ab";

// LP 到達時に一度だけ実行：広告帰属を保存し、A/B variant を確定し、landing_page_view を計測する。
// A/B は広告LP(source=landing_takken)のみ。他ルートは variant を付けず非バケット。
export default function LPInit({ source }: { source: string }) {
  useEffect(() => {
    captureAttribution();
    if (isAbSource(source)) {
      const variant = resolveVariant(); // 初回はここで割り当て・保存（冪等）
      trackLandingPageView({ source, variant });
    } else {
      trackLandingPageView({ source });
    }
  }, [source]);
  return null;
}
