# 事前登録の重複判定・監査行ポリシー

対象：`docs/gas/registration-webhook.gs`（GAS）＋ `src/app/api/register/route.ts` / `src/components/EmailForm.tsx`（Next.js）。
本書は**現行の本番挙動を明文化**したもので、挙動を変更するものではない。

## 重複の扱い

- メールアドレスは **trim ＋ lowercase** で正規化して比較する（大文字小文字・前後空白の違いで重複を回避できない）。
- 既に同一メールが存在する場合、その登録は**重複**として `duplicated: true` を返す。
- **同一メールを「新規リード」として再計上しない**：
  - 重複時に **Meta 標準イベント `Lead` は発火しない**（GA4 は `waitlist_duplicate`、PostHog は重複イベントのみ）。
  - 新規成功時のみ `Lead`（GA4 `waitlist_submitted`）を発火する。
- **重複試行も監査目的で1行追記する**（`duplicated = TRUE` 列で識別）。
  - これは**現在の意図した仕様**であり、シートに重複フラグ付き行が増えるのは正常。
  - 新規行は `duplicated = FALSE`、重複監査行は `duplicated = TRUE` で区別できる。

## KPI 集計

- 新規登録数は **`duplicated = FALSE` の行のみ**を数える。
- 重複監査行（`duplicated = TRUE`）は新規登録として数えない（重複試行の記録）。
- 重複行を削除・集約するかは別途の運用判断（本フローは削除・集約を行わない）。

## プライバシー

- **Analytics（GA4 / Meta / PostHog）へメールアドレス等の PII を送らない**。送るのは `source` / `variant` のみ。
- 共有シークレット（`GAS_SHARED_SECRET` / GAS の `SHARED_SECRET`）は**サーバー専用**で、クライアント・HTML・シート・応答・ログのいずれにも出さない。

## 認証・保存の順序（GAS）

1. 共有シークレット認証（未設定／不一致は `unauthorized`・保存しない）
2. 入力検証（不正 JSON・email 欠落／不正は保存しない）
3. `LockService` 取得（同時登録の競合防止）
4. 重複判定 → 行追記（`duplicated` 列に真偽を記録）
5. `try/finally` で全経路ロック解放・例外時は `internal_error`（内部詳細を応答へ出さない）
