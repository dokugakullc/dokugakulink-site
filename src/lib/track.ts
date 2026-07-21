// ウェイティングリスト計測イベントの単一の入口。
// GA4（プロダクト分析）と Meta Pixel（広告最適化）へ同じ意味のイベントを送る。
// イベント名は指示書 18.1 に準拠。二重発火は各呼び出し元（1回だけ発火）で防ぐ。

import { sendGAEvent } from "@/lib/gtag";
import { metaTrack, metaTrackCustom } from "@/lib/meta";

type Params = Record<string, string>;

/** LP 到達（マウント時に1回）。 */
export function trackLandingPageView(params: Params): void {
  sendGAEvent("landing_page_view", params);
  metaTrackCustom("landing_page_view", params);
}

/** 事前登録 CTA クリック。 */
export function trackCtaClicked(params: Params): void {
  sendGAEvent("waitlist_cta_clicked", params);
  metaTrackCustom("waitlist_cta_clicked", params);
}

/** フォーム入力開始（最初の1回のみ）。 */
export function trackFormStarted(params: Params): void {
  sendGAEvent("waitlist_form_started", params);
  metaTrackCustom("waitlist_form_started", params);
}

/** 登録完了。Meta 標準イベント Lead は「完了時のみ」発火。 */
export function trackSubmitted(params: Params): void {
  sendGAEvent("waitlist_submitted", params);
  metaTrack("Lead", params);
}

/** 登録失敗。成功イベントは発火させない。 */
export function trackSubmissionFailed(params: Params): void {
  sendGAEvent("waitlist_submission_failed", params);
  metaTrackCustom("waitlist_submission_failed", params);
}
