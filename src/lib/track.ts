// ウェイティングリスト計測イベントの単一の入口。
// GA4（プロダクト分析）・Meta Pixel（広告最適化）・PostHog（プロダクト分析）へ
// 同じ意味のイベントを送る。二重発火は各呼び出し元（1回だけ発火）で防ぐ。
// A/Bテストの variant は各 params に含めて全宛先へ付与する。

import { sendGAEvent } from "@/lib/gtag";
import { metaTrack, metaTrackCustom } from "@/lib/meta";
import { phCapture } from "@/lib/posthog";

type Params = Record<string, string>;

/** LP 到達（マウント時に1回）。 */
export function trackLandingPageView(params: Params): void {
  sendGAEvent("landing_page_view", params);
  metaTrackCustom("landing_page_view", params);
  phCapture("landing_page_view", params);
}

/** 事前登録 CTA クリック。 */
export function trackCtaClicked(params: Params): void {
  sendGAEvent("waitlist_cta_clicked", params);
  metaTrackCustom("waitlist_cta_clicked", params);
  phCapture("waitlist_cta_clicked", params);
}

/** フォーム入力開始（最初の1回のみ）。 */
export function trackFormStarted(params: Params): void {
  sendGAEvent("waitlist_form_started", params);
  metaTrackCustom("waitlist_form_started", params);
  phCapture("waitlist_form_started", params);
}

/** 登録完了。Meta 標準イベント Lead は「完了時のみ」発火。 */
export function trackSubmitted(params: Params): void {
  sendGAEvent("waitlist_submitted", params);
  metaTrack("Lead", params);
  phCapture("waitlist_submitted", params);
}

/** 登録失敗。成功イベントは発火させない。 */
export function trackSubmissionFailed(params: Params): void {
  sendGAEvent("waitlist_submission_failed", params);
  metaTrackCustom("waitlist_submission_failed", params);
  phCapture("waitlist_submission_failed", params);
}

/**
 * 任意アンケート「今一番困っていること」への回答。
 * B版では登録完了後に表示し、回答を分析イベントとしてのみ記録する
 * （登録API・保存先は変更しない）。
 */
export function trackSurveyAnswered(params: Params): void {
  sendGAEvent("waitlist_survey_answered", params);
  metaTrackCustom("waitlist_survey_answered", params);
  phCapture("waitlist_survey_answered", params);
}
