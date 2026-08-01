# お問い合わせ保存機能 運用・プライバシー文書

対象：`docs/gas/contact-store-webhook.gs`（GAS・**未デプロイ**）＋ `src/app/api/contact/route.ts` /
`src/lib/contactHandler.ts` / `src/lib/contactStoreClient.ts` / `src/lib/contactStorePayload.ts` /
`src/components/ContactForm.tsx`（Next.js）。

本書は問い合わせ保存機能の**運用と個人情報の取扱い**を定める。挙動を変更するものではない。
問い合わせ情報には**氏名・メールアドレス・会社名・本文**（個人情報）が含まれるため、事前登録
（`registration-webhook.gs`）と同水準の管理を行う。

## 1. 保存の目的

- お問い合わせへの**対応・返信**、および対応状況（`status`/`owner`/`responded_at`）の管理。
- 問い合わせ種別（`contact_type`）・流入（UTM/fbclid）による**傾向把握**。
- **目的外利用はしない**。マーケティングリスト化・名寄せ・第三者提供は行わない。

## 2. 保存項目

`contacts` シート（ヘッダー名基準）：
`contact_id / submission_id / reference / timestamp / name / email / company / contact_type /
subject / message / status / owner / responded_at / source / is_test /
utm_source / utm_medium / utm_campaign / utm_content / utm_term / fbclid / landing_url / referrer /
user_agent / created_by / schema_version`

- **保存対象は allowlist**（`buildContactStoreBody` のトップレベル＋許可 attribution キーのみ）。
  クライアント由来の任意キーは転送・保存しない。
- **`token`（共有シークレット）は保存しない**（列に存在せず、応答・ログにも出さない）。
- 入力は長さ制限・制御文字（CR/LF/tab）除去を適用（Next 側検証＋GAS `clip_`）。
- `subject` 列は現状**常に空**（クライアント・ハンドラは subject を送らない。メール件名は
  `contact_type` から生成し、シートへは書かない）。将来の分類用に**予約列**として残置（P3）。

## 3. 保存先・Owner

- 保存先：`info@dokugakulink.com` 所有の Google スプレッドシート（`contacts` タブ）。
  事前登録用スプレッドシートとは**別ファイル・別 GAS プロジェクト・別シークレット**を推奨。
- Owner：`info@dokugakulink.com`（作成・権限管理・保持期間決定の責任者）。
- GAS はサーバー間の**共有シークレット認証**（本文 `token` を Script Property
  `CONTACT_STORE_SHARED_SECRET` と照合）。未設定・不一致は保存しない（fail-closed）。

## 4. アクセス権・共有範囲

- 閲覧・編集権限は**対応に必要な最小人数**に限定する。
- スプレッドシートの**共有リンクを一般公開しない**（「リンクを知っている全員」不可）。
- 外部への**エクスポート・共有は Owner 承認制**。ダウンロードした CSV/コピーも同水準で管理し、
  不要になったら削除する。
- **Secret はシートへ保存しない**（Vercel 環境変数と GAS Script Property のみで保持）。

## 5. Analytics との分離（PII を送らない）

- GA4 / Meta / PostHog へ**問い合わせ本文・氏名・メールアドレス・会社名を送らない**。
- 送るのは非 PII のイベント種別・source/variant のみ（本フォームは source をサーバー固定、
  attribution も許可キーのみ保存）。

## 6. データ主体対応（開示・訂正・削除）

- 開示・訂正・利用停止・削除の請求は、プライバシーポリシー §6/§7 の窓口（`info@dokugakulink.com`）で受ける。
- 削除手順：
  1. 請求者のメールアドレスで `contacts` シートを検索（`email` 列・trim+lowercase 一致）。
  2. 本人確認後、該当行を削除（または匿名化）。関連する対応メール（Resend 側）も併せて確認。
  3. 削除日・対応者を対応記録へ残す（シート外の運用ログ）。
- 対応完了後の運用削除：`status` が完了かつ**保持期間を超過**した行は削除・匿名化する
  （保持期間は §8 参照）。

## 7. テストデータの識別・バックアップ

- テストデータは `is_test = TRUE` で識別（メールの `+test` / `+lp-test` / `+meta-test`
  マーカー。`TEST_MARKERS` で調整可）。KPI・分析は `is_test = FALSE` のみ集計。
- バックアップ／エクスポート時も PII を含むため本書の管理水準を適用（保管場所・共有範囲・
  保持期間・削除手順を同一に扱う）。バックアップの一般公開・無期限保持はしない。

## 8. 保持期間（**Owner 決定待ち・未確定**）

- 問い合わせデータの**保持期間は未確定**。Claude は保持期間を独自決定しない。
- **保持期間が Owner により決定されるまで、本番保存を有効化しない**
  （Vercel Production に `CONTACT_STORE_URL` / `CONTACT_STORE_SHARED_SECRET` を設定しない）。
  未設定の間は従来どおり**メール通知のみ**で動作する（後方互換・保存は行われない）。
- 決定後、本書 §6/§8 に保持期間・自動削除運用を追記する。

## 9. プライバシーポリシー整合（要 Owner 確認・自動変更しない）

現行 `src/app/privacy/page.tsx` の確認結果：

- §1「取得する情報」に氏名・メールアドレス等の**取得**、§2 に「お問い合わせへの対応」、
  §6/§7 に開示・削除の窓口が**記載済み**。
- **不足の可能性**：問い合わせ内容を**外部サービス（Google スプレッドシート／Workspace）へ
  保存・委託して保管する**旨と、その**保持期間**が明示されていない（§3 第三者提供・§4 外部
  サービスは Analytics/広告中心の記載）。保存を本番有効化する前に、次の追記を Owner・法務で検討：
  1. お問い合わせ情報を対応目的で**外部委託先（Google）に保存**することがある旨。
  2. 保持期間および削除の方針（§8 の決定を反映）。
- 本タスクではポリシー本文を**自動変更しない**（指摘のみ）。

## 10. 認証・保存の順序（GAS）

1. 共有シークレット認証（未設定／不一致は `unauthorized`・保存しない）
2. 入力検証（不正 JSON→`bad_json` / email→`invalid_email` / name→`missing_name` /
   submission_id→`missing_submission_id`・いずれも保存しない）
3. `LockService` 取得（同時登録の競合防止）
4. **`submission_id` 冪等**：同一 ID が既存なら追記せず `{success:true, stored:false, duplicate:true}`
   （email では重複除外しない＝別問い合わせを消さない。timeout 後の再送でも二重保存しない）
5. ヘッダー名基準で 1 行追記（`status=未対応` 既定）→ `{success:true, stored:true, duplicate:false}`
6. `try/finally` で全経路ロック解放・例外時は `internal_error`（内部詳細を応答／ログへ出さない）
