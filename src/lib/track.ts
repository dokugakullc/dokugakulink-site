// ウェイティングリスト計測イベントの単一の入口。
// GA4（プロダクト分析）・Meta Pixel（広告最適化）・PostHog（プロダクト分析）へ
// 同じ意味のイベントを送る。二重発火は各呼び出し元（1回だけ発火）で防ぐ。
// A/Bテストの variant は各 params に含めて全宛先へ付与する。

import { sendGAEvent } from "@/lib/gtag";
import { metaTrack, metaTrackCustom } from "@/lib/meta";
import { phCapture } from "@/lib/posthog";
import { getAttribution, attributionEventProps } from "@/lib/utm";

type Params = Record<string, string>;

// GA4 / PostHog へ送るイベントに first-touch の UTM を共通付与する。
// - utm_source/medium/campaign/content/term のみ（fbclid 等は attributionEventProps が除外）。
// - Meta には付与しない（広告側は _fbc/_fbp Cookie で既に流入を把握するため不要、
//   かつ Meta へ送るパラメータは最小に保つ）。
// - 明示 params（source/variant 等）を優先し、UTM で上書きしない。
function withUtm(params: Params): Params {
  return { ...attributionEventProps(getAttribution()), ...params };
}

/** LP 到達（マウント時に1回）。 */
export function trackLandingPageView(params: Params): void {
  const p = withUtm(params);
  sendGAEvent("landing_page_view", p);
  metaTrackCustom("landing_page_view", params);
  phCapture("landing_page_view", p);
}

/** 事前登録 CTA クリック。 */
export function trackCtaClicked(params: Params): void {
  const p = withUtm(params);
  sendGAEvent("waitlist_cta_clicked", p);
  metaTrackCustom("waitlist_cta_clicked", params);
  phCapture("waitlist_cta_clicked", p);
}

/** フォーム入力開始（最初の1回のみ）。 */
export function trackFormStarted(params: Params): void {
  const p = withUtm(params);
  sendGAEvent("waitlist_form_started", p);
  metaTrackCustom("waitlist_form_started", params);
  phCapture("waitlist_form_started", p);
}

/**
 * 新規登録完了。Meta 標準イベント Lead は「新規登録時のみ」発火。
 * 重複登録では呼ばない（trackDuplicate を使う）。
 */
export function trackSubmitted(params: Params): void {
  const p = withUtm(params);
  sendGAEvent("waitlist_submitted", p);
  metaTrack("Lead", params);
  phCapture("waitlist_submitted", p);
}

/**
 * 重複登録（既に登録済みのメールアドレス）。画面上は受付済みとして扱うが、
 * 二重計上を避けるため Meta 標準イベント Lead は発火させない。
 * 分析用に GA4 / PostHog の専用イベントのみ記録する。
 */
export function trackDuplicate(params: Params): void {
  const p = withUtm(params);
  sendGAEvent("waitlist_duplicate", p);
  phCapture("waitlist_duplicate", p);
}

/** 登録失敗。成功イベントは発火させない。 */
export function trackSubmissionFailed(params: Params): void {
  const p = withUtm(params);
  sendGAEvent("waitlist_submission_failed", p);
  metaTrackCustom("waitlist_submission_failed", params);
  phCapture("waitlist_submission_failed", p);
}

/**
 * 任意アンケート「今一番困っていること」への回答。
 * B版では登録完了後に表示し、回答を分析イベントとしてのみ記録する
 * （登録API・保存先は変更しない）。
 */
export function trackSurveyAnswered(params: Params): void {
  const p = withUtm(params);
  sendGAEvent("waitlist_survey_answered", p);
  metaTrackCustom("waitlist_survey_answered", params);
  phCapture("waitlist_survey_answered", p);
}
