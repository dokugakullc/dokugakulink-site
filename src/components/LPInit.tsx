"use client";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/utm";
import { trackLandingPageView } from "@/lib/track";

// LP 到達時に一度だけ実行：広告帰属を保存し、landing_page_view を計測する。
export default function LPInit({ source }: { source: string }) {
  useEffect(() => {
    captureAttribution();
    trackLandingPageView({ source });
  }, [source]);
  return null;
}
