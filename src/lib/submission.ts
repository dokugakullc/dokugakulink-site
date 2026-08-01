// 冪等キー種（submissionId）を「送信内容のスナップショット」に対応づける純粋ロジック。
//
// 目的（レビュー #2）:
//   Resend の Idempotency-Key は「同じキー・異なる payload」を拒否する
//   （SDK エラーコード invalid_idempotent_request）。そのため、
//   失敗後に氏名/メール/本文を編集して再送する場合は submissionId を作り直す必要がある。
//   逆に、内容を変えずに再試行する場合は同じ submissionId を使い、二重送信を Resend 側で防ぐ。
//
// スナップショットは trim 済みの [name, email, message]。
//   - 前後の空白だけの差は「同一内容」とみなす（サーバーの trim と一致）。
//   - 内部の空白の差（"a b" と "a  b"）は「別内容」とみなす。
//   - honeypot は内容スナップショットに含めない。

export type ContactContent = { name: string; email: string; message: string };
export type SubmissionState = { id: string; snapshot: string };

export function contentSnapshot(c: ContactContent): string {
  return JSON.stringify([c.name.trim(), c.email.trim(), c.message.trim()]);
}

/**
 * 直近の送信状態と現在の内容を比較し、submissionId を決める。
 *  - 前回と同じ内容（trim 後一致）→ 同じ id を維持（再試行で二重送信を防ぐ）。
 *  - 初回、または内容が変わった → 新しい id を生成。
 * makeId は UUID 等を返す関数（テストで差し替え可能）。
 */
export function resolveSubmissionId(
  prev: SubmissionState | null,
  content: ContactContent,
  makeId: () => string,
): SubmissionState {
  const snapshot = contentSnapshot(content);
  if (prev && prev.snapshot === snapshot) return prev;
  return { id: makeId(), snapshot };
}
