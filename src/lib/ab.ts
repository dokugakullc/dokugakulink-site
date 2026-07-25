"use client";
// 広告LP /landing/takken の同一URL A/Bテスト割り当て。
// - A: 現行版（フォーム内に任意アンケート）
// - B: 任意アンケートを「登録完了後」に表示
// 割り当ては初回のみ 50/50 で決定し、localStorage に保存。再訪時も同じ版を表示する。
// クローラー（bot）は常に A を表示し、割り当てを保存しない（＝SSRの既定版Aと一致）。
import { useSyncExternalStore } from "react";

export type Variant = "A" | "B";

const STORAGE_KEY = "uk_lp_ab_variant";

// A/Bテストを有効にする source（＝広告LP /landing/takken のみ）。
// 同一の UkareruLP を描画する /services/takken（source=services_takken）は対象外＝常にA・非バケット。
export const AB_SOURCE = "landing_takken";
export function isAbSource(source: string): boolean {
  return source === AB_SOURCE;
}

// 主要な検索エンジン/プレビュー/計測系クローラー。判定は保守的（迷ったらAに寄せる）。
const BOT_RE =
  /bot|crawl|spider|slurp|mediapartners|adsbot|bingpreview|facebookexternalhit|facebot|embedly|quora link preview|pinterest|redditbot|whatsapp|telegrambot|discordbot|twitterbot|linkedinbot|applebot|duckduckbot|baiduspider|yandex|sogou|exabot|ia_archiver|petalbot|semrush|ahrefs|lighthouse|headlesschrome|chrome-lighthouse|pagespeed|gtmetrix|google page speed/i;

export function isBot(): boolean {
  if (typeof navigator === "undefined") return false;
  return BOT_RE.test(navigator.userAgent || "");
}

// ページ読み込み内で確定した割り当てをメモ化（同一ロード内で安定させる）。
// これにより useSyncExternalStore の getSnapshot が何度呼ばれても同じ primitive を返す。
let memoVariant: Variant | null = null;

/**
 * 現在の割り当てを返す（クライアント専用）。
 * - SSR / bot の場合は "A"（既定版・非バケット）。
 * - 未割り当てなら 50/50 で決定して localStorage に保存し、以降は保存値を返す（冪等）。
 * - storage不可（プライベートモード等）でもメモ化により同一ロード内で安定した値を返す。
 */
export function resolveVariant(): Variant {
  if (typeof window === "undefined") return "A";
  if (isBot()) return "A";
  if (memoVariant) return memoVariant;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "A" || saved === "B") {
      memoVariant = saved;
      return saved;
    }
    const assigned: Variant = Math.random() < 0.5 ? "A" : "B";
    window.localStorage.setItem(STORAGE_KEY, assigned);
    memoVariant = assigned;
    return assigned;
  } catch {
    memoVariant = memoVariant ?? "A"; // storage不可 → 既定版Aで安定
    return memoVariant;
  }
}

// useSyncExternalStore 用。割り当ては初回のみで以降不変のため、購読は何もしない。
function subscribe(): () => void {
  return () => {};
}

/**
 * レンダリング用フック。
 * SSR/ハイドレーション時はサーバースナップショット "A"（既定版）を返し、ズレを防ぐ。
 * ハイドレーション後にクライアントの確定 variant（localStorage 由来）へ切り替わる。
 * 返り値は primitive のため getSnapshot はキャッシュ不要（値比較で安定）。
 */
export function useVariant(): Variant {
  return useSyncExternalStore<Variant>(
    subscribe,
    () => resolveVariant(), // client snapshot（初回に割り当て・保存／以降は保存値）
    () => "A" // server snapshot（SSR/初期ハイドレーション＝既定版A）
  );
}
