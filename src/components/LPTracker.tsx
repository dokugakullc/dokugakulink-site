"use client";
import { useEffect, useRef } from "react";
import { sendGAEvent } from "@/lib/gtag";

// Fires a GA4 event once when the given element first enters the viewport.
function useOnceVisible(id: string, eventName: string, params?: Record<string, string>) {
  const firedRef = useRef(false);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          sendGAEvent(eventName, params);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, eventName, params]);
}

export default function LPTracker({ heroVariant }: { heroVariant: string }) {
  useOnceVisible("hero", "hero_view", { hero_variant: heroVariant });
  useOnceVisible("features", "carousel_view");
  return null;
}
