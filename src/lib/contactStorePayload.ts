// 問い合わせ保存 payload の組み立て（純粋関数・テスト可能・サーバー専用）。
//
// contacts GAS(contact-store-webhook.gs) は utm_* / fbclid 等を「トップレベル」で読むため、
// attribution を平坦化する。共有シークレット `token` は **最後に確定**させ、rest（name 等）や
// attribution のどのキーが来ても上書きできないようにする（register 側 registerPayload.ts と同基準）。
// 保存対象は allowlist（クライアント由来の任意キーを転送しない）。attribution も許可キーのみ。
import { ATTRIBUTION_KEYS, sanitizeAttribution } from "./formSecurity";

// contacts シートへ保存する 1 件分（GAS へ送る形。attribution は本関数で平坦化）。
export type ContactStoreRecord = {
  name: string;
  email: string;
  company: string;
  contact_type: string;
  message: string;
  source: string;
  submission_id: string;
  reference: string;
  userAgent: string;
  attribution: Record<string, string>;
};

// GAS へ送るトップレベルの保存キー（token・attribution を除く allowlist）。これ以外は送らない。
export const CONTACT_STORE_TOP_LEVEL_KEYS = [
  "name",
  "email",
  "company",
  "contact_type",
  "message",
  "source",
  "submission_id",
  "reference",
  "userAgent",
] as const;

/**
 * 保存 payload を組み立てる。
 *  - トップレベルは allowlist のみ（欠落・非文字列は空文字）。
 *  - attribution は許可キーへ再サニタイズ（未知キー・PII・token を構造的に排除）。
 *  - `source` は record の値（呼び出し側でサーバー固定済み）。submission_id / reference を維持。
 *  - `token` は最後に確定し、rest / attribution / ユーザー入力では上書きできない。Secret は保存対象に含めない。
 */
export function buildContactStoreBody(record: ContactStoreRecord, token: string): Record<string, string> {
  const out: Record<string, string> = {};
  // 1) トップレベルは allowlist のみ。
  for (const key of CONTACT_STORE_TOP_LEVEL_KEYS) {
    const v = record[key];
    out[key] = typeof v === "string" ? v : "";
  }
  // 2) attribution は許可キーのみ（sanitizeAttribution が allowlist・trim・制御文字除去・長さ制限を担保）。
  const attribution = sanitizeAttribution(record.attribution);
  for (const key of ATTRIBUTION_KEYS) {
    if (typeof attribution[key] === "string") out[key] = attribution[key];
  }
  // 3) token は最後に確定（同名キーでは上書きされない）。
  return { ...out, token };
}
