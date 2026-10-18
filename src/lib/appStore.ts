export const APP_STORE_ID = "6787687806";
export const APP_STORE_URL = `https://apps.apple.com/jp/app/id${APP_STORE_ID}`;

/**
 * App Store Connect の「プロバイダトークン（pt）」。
 * App Store Connect → アプリ → App Analytics の「キャンペーンリンク」作成画面で表示される数字。
 * 空のあいだは ct も付けない（pt なしの ct は App Store Connect で集計されないため）。
 */
export const APP_STORE_PROVIDER_TOKEN = "";

/** App Store Connect のキャンペーン名（ct）の上限文字数。 */
const CAMPAIGN_MAX = 40;

/** 置き場所ごとのキャンペーン名を付けた App Store URL。pt 未設定なら素の URL を返す。 */
export function appStoreCampaignUrl(campaign: string, providerToken: string = APP_STORE_PROVIDER_TOKEN): string {
  if (!providerToken) return APP_STORE_URL;
  const ct = campaign.toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, CAMPAIGN_MAX);
  const url = new URL(APP_STORE_URL);
  url.searchParams.set("pt", providerToken);
  if (ct) url.searchParams.set("ct", ct);
  url.searchParams.set("mt", "8");
  return url.toString();
}
