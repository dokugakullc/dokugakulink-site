// 事前登録 → GAS 送信ボディの組み立て（純粋関数・テスト可能）。
//
// GAS(registration-webhook.gs) は utm_* / fbclid 等を「トップレベル」で読むため、
// attribution を平坦化する。共有シークレット `token` は **最後に確定**させ、
// rest（email 等）や attribution のどのキーが来ても上書きできないようにする（防御的）。
// 現状 sanitizeAttribution が allowlist 済みで token を生成し得ないため挙動は不変だが、
// 将来 allowlist が変更されても Secret が上書きされないことを保証する。
import type { RegisterPayload } from "./registerHandler";

export function buildGasBody(payload: RegisterPayload, token: string): Record<string, string> {
  const { attribution, ...rest } = payload;
  // token を最後に置くことで rest/attribution の同名キーでは上書きされない。
  return { ...rest, ...attribution, token };
}
