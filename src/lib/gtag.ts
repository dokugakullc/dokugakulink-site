export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

type GtagEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function sendGAEvent(eventName: string, params?: GtagEventParams) {
  if (typeof window === "undefined" || !window.gtag || !GA_ID) return;
  window.gtag("event", eventName, params ?? {});
}
