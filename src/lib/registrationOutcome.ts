// 事前登録 API 応答 → 計測分岐の判定（純粋関数・テスト可能）。
//
// 仕様:
//  - 新規成功（ok && success && !duplicated）→ "submitted"（Meta 標準イベント Lead を発火）
//  - 重複成功（ok && success && duplicated）→ "duplicated"（Lead は発火しない・専用イベントのみ）
//  - 失敗（!ok || !success）→ "failed"（Lead は発火しない）
export type RegistrationOutcome = "submitted" | "duplicated" | "failed";

export function resolveRegistrationOutcome(res: {
  ok: boolean;
  success?: boolean;
  duplicated?: boolean;
}): RegistrationOutcome {
  if (!res.ok || !res.success) return "failed";
  return res.duplicated ? "duplicated" : "submitted";
}

/** Meta 標準イベント Lead を発火してよいのは新規成功のみ（二重計上を防ぐ）。 */
export function outcomeFiresMetaLead(outcome: RegistrationOutcome): boolean {
  return outcome === "submitted";
}
