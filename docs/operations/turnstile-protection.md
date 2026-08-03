# Cloudflare Turnstile（bot 対策）運用・プライバシー文書

対象：`src/lib/turnstile.ts`（サーバー検証）・`src/lib/turnstileClient.ts`（クライアント純粋関数）・
`src/components/TurnstileWidget.tsx`（widget）・`src/lib/contactHandler.ts` / `src/lib/registerHandler.ts`
（DI 統合）・`src/app/api/contact/route.ts` / `src/app/api/register/route.ts`（env 注入）・
`src/components/ContactForm.tsx` / `src/components/EmailForm.tsx`（フォーム）。

本書は Phase 2D.1 監査（読み取り専用）結果を反映する。**Turnstile 実装ロジックは変更しない**。
法的評価は Owner／法務が最終確認する（本書は断定的な法解釈を避ける）。

## 0. 現在の状態（2026-08-02）

- **Turnstile は現在無効**（`NEXT_PUBLIC_TURNSTILE_SITE_KEY`／`TURNSTILE_SECRET_KEY` が Production/Preview とも未設定）。
- Contact Store は Production 限定で有効（別機能）。Turnstile とは独立。
- 本 PR は**プライバシーポリシー・運用文書の先行整備**であり、環境変数・Cloudflare 設定は変更しない。

## 1. 目的

問い合わせ・事前登録フォームへの bot／自動化投稿を抑制する多層防御。honeypot・Origin 検証・二重送信防止に加える。

## 2. 有効化・無効化（環境変数）

| 変数 | 対象環境 | 公開範囲 |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Production（有効化時） | クライアント公開（Site Key のみ） |
| `TURNSTILE_SECRET_KEY` | Production（有効化時） | **サーバー専用（`NEXT_PUBLIC` を付けない）** |

- **両方設定が必要**：両方設定で有効（`enabled`）。
- **片方のみ設定 → `misconfigured`（fail-closed）**：外部処理せず 500・ユーザーには汎用エラー。
- **両方未設定 → `disabled`**：widget 非描画・Siteverify 呼ばず・**従来挙動を完全維持**。
- **無効化**：両変数を**解除したうえで再デプロイ**する（Vercel env はデプロイ時反映のため、解除だけでは既存デプロイに効かない）。片方だけ解除は misconfigured になるため**両方解除**する。

## 3. Preview / hostname / action（検証の要）

- **Preview では 503 ガードが Turnstile 検証より前に動く**（handler 順：CT→Origin→JSON→honeypot→入力検証→**Preview 503**→Turnstile→外部処理）。→ **Preview では Siteverify に到達しない**。
- **Preview では実 Siteverify 成功を検証できない**（上記＋Preview は SSO 保護＋hostname 許可が本番限定）。**Preview ガードを緩和しない**。
- **hostname 許可は本番ドメイン限定**（`src/lib/turnstile.ts` `ALLOWED_TURNSTILE_HOSTNAMES = ["dokugakulink.com","www.dokugakulink.com"]`）。リクエスト入力からは決めない。
- **action は contact / register で分離**（widget が `data-action` を送出し、サーバーが期待 action と一致を確認）。

## 4. token・障害時の扱い

- token は **300 秒で失効・単回利用**（Cloudflare 仕様）。再利用・失効は Cloudflare が `timeout-or-duplicate` を返す。
- **token 失効・重複・action/hostname 不一致・Siteverify 失敗・Cloudflare 障害・timeout は成功扱いにしない（fail-closed）**。
- token は保存・転送しない：GAS payload／`contacts` シート／メール本文／Analytics／ログ／attribution へ出さない。API payload では固定フィールド `turnstileToken`（allowlist 外）として送る。クライアントは React state のみで保持（localStorage/sessionStorage/Cookie 不使用）。

## 5. ログ・PII

- **Secret・Cloudflare 応答本文・token をログ／エラーへ出さない**（非2xx はステータス番号のみ、`success:false`/JSON 失敗は固定メッセージ）。
- **`remoteip` は現行実装では Siteverify へ明示送信しない**（任意項目・プライバシー配慮）。※ これは「Siteverify へ IP を明示送信しない」という意味であり、ブラウザから Cloudflare への通信で技術情報が処理され得ることとは別。
- Analytics（GA4/Meta/Clarity/PostHog）へ token・メール・本文・氏名を送らない。

## 6. ローカルテストで確認できる範囲（Phase 2D.1）

- **確認できる**：widget 表示・公式 script の HTTPS 読込・token 取得・token のフォーム送信データ混入・contact/register の action 差・キーボード操作・ラベル/エラー表示・token 失効/再送時の reset・script 読込失敗時の送信不可。server 契約（action/hostname/success/fail-closed/timeout/非2xx/JSON/token 長さ/非漏えい）は**既存自動テスト（fetch フェイク）**で担保。
- **確認できない**：**本番 hostname（`www.dokugakulink.com`）での Siteverify 成功**。公式テストキーの Siteverify は hostname 例が `localhost`・action 例が `test` で、**本番許可 hostname／期待 action と一致しないため、ローカルでは検証が success:false になる（コード不具合ではない）**。
- **最終的な実 Siteverify 成功確認は、Owner 承認後の Production で行う**（本番ドメインでのみ hostname が自然に一致）。

## 7. 有効化前にプライバシーポリシーを先行反映

- **Production 有効化の前に、プライバシーポリシーへ Turnstile の記載を反映する**（本 PR で `privacy/page.tsx` §5 に追記）。文言は「利用する**場合があります**」（現時点無効・今後有効化前提）。

## 8. 本番有効化手順（Owner 承認後・本 PR では未実施）

1. ローカル（Production 相当 build/start）＋既存自動テストで client/server を確認。
2. Cloudflare で Turnstile サイト作成・**contact/register 用 action を運用**・Site Key/Secret 取得・**許可 hostname に `dokugakulink.com`/`www.dokugakulink.com` を設定**（コード定数と一致）。
3. **プライバシーポリシー（Turnstile 記載）を Production へ先行反映**。
4. Vercel に `NEXT_PUBLIC_TURNSTILE_SITE_KEY`（Production）＋`TURNSTILE_SECRET_KEY`（Production・サーバー専用）を設定 → **再デプロイ**。
5. 本番で少数の実送信により widget・action・hostname・token 失効・単回・reset・**Siteverify 成功**を確認・監視。

## 9. 監視項目

- Turnstile 起因の送信失敗率（400 の増加）・widget 表示不可・Cloudflare 障害/timeout・問い合わせ/登録の完了数減少・ランタイムエラー（5xx）。

## 10. ロールバック手順

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` と `TURNSTILE_SECRET_KEY` を**両方解除 → 再デプロイ**で `disabled` に戻り、従来経路・widget 非描画へ。**コード変更を伴わない**。

## 11. CSP 導入時の必要事項

- 現状 CSP 未導入。導入する場合は `script-src` と `frame-src` に `https://challenges.cloudflare.com` を許可（ワイルドカードで過度に広げない）。→ 別フェーズ。

## 12. WAF レート制限

- Vercel WAF Rate Limiting（多層防御）は**別承認・別フェーズ**。本書の対象外（比較は `docs/operations/rate-limiting-options.md`）。

## 13. プライバシー・Cookie・国外取扱い（公式に確認できた範囲のみ）

- Turnstile は既定では**一度きりの検証トークン方式**で動作し、pre-clearance を有効化しない限り `cf_clearance` cookie を使わない（本実装は pre-clearance 不使用）。ただし **「Cookie を一切使わない」等の絶対的断定はしない**。
- Cloudflare へは challenge 実行のため**端末・ブラウザ・ネットワーク等の技術情報が処理され得る**。
- **データ処理地・国外取扱いは公式に確認できていないため断定しない**（「国外で処理される／されない」いずれも記載しない）。→ §14 Owner 確認事項。
- プライバシーポリシー §5 には、目的（bot 対策）・Cloudflare が技術情報を処理し得ること・Cookie 等は当社設定と Cloudflare 仕様による旨・公式リンクを記載（断定を避けた表現）。

## 14. 法務・Owner 確認事項

- プライバシーポリシー §5 の Turnstile 追記の**法務レビュー**と公開可否。
- Cloudflare のデータ処理地・**国外取扱い**の要否（契約・公式資料で確認できた場合のみ記載・推測しない）。
- Turnstile を「第三者提供」と扱うか「委託/クラウド利用」とするかの法的整理。
- WAF レート制限の導入可否（別承認）。
- CSP 導入可否（別フェーズ）。

## 15. 公式資料（一次情報・確認日 2026-08-02）

- Server-side validation（Siteverify・hostname/action 検証・fail-closed・idempotency_key・remoteip 任意）: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- Client-side rendering（api.js・explicit render・render/reset/remove）: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
- Testing（公式テストキー・ダミートークン・localhost・hostname 例）: https://developers.cloudflare.com/turnstile/troubleshooting/testing/
- Content Security Policy（`challenges.cloudflare.com`）: https://developers.cloudflare.com/turnstile/reference/content-security-policy/
- Pre-clearance（既定は cf_clearance 不使用）: https://developers.cloudflare.com/turnstile/get-started/pre-clearance/
- Cloudflare Turnstile Privacy Policy: https://www.cloudflare.com/turnstile-privacy-policy/
- Cloudflare Privacy Policy（一般）: https://www.cloudflare.com/privacypolicy/

## 16. 2026-08-03 初回 Production 有効化インシデントと診断改善

- **事象**：2026-08-03 に Production で Turnstile を初回有効化したところ、**client widget の token 発行は成功**したが、**サーバー側 Siteverify 呼び出しが catch 経路**に入り、問い合わせフォームが 400（固定汎用メッセージ）を返した。Cloudflare 側には「siteverify が呼び出されていない」警告。
- **分類**：カテゴリ B（Siteverify 通信例外・timeout・非2xx・invalid_response のいずれか）。当時のログは固定文（`turnstile verify error`）のみで、B 内の厳密な原因を区別できなかった。
- **対応**：直前の正常 Deployment（Turnstile 環境変数設定前ビルド・`dpl_DX3R6Z9skuEWrAD4DJ2uqSZz63jh`）へ Vercel 公式ロールバック。**現在 Production は Turnstile 無効**（widget 非描画・従来の honeypot/Origin 等は有効）。環境変数・Cloudflare widget は残置。

### 診断改善（本 PR）
`verifyTurnstile` は失敗を throw せず、**固定カテゴリ**へ分類して返す。handler は**カテゴリのみ**をログへ出す（`contact/register: turnstile verification failed { reason, httpStatus? }`）。ユーザー応答は従来の固定文で不変。

- カテゴリ：`missing_token` / `siteverify_timeout` / `siteverify_network_error` / `siteverify_http_error`（+ 安全な HTTP ステータス 100-599 のみ） / `siteverify_invalid_response` / `siteverify_rejected` / `action_mismatch` / `hostname_mismatch`。
- リクエスト形式を Cloudflare 公式例へ整合：`URLSearchParams` を body へ直接渡す・固定 User-Agent `dokugakulink-site/0.1.0` 付与・timeout 10 秒（既定）。User-Agent は公式の必須要件ではないが、固定・非機密の識別子として付与（Resend REST と同方針）。
- **ログへ出さない**：Secret / token / token 長 / email / 氏名 / 会社名 / 本文 / IP / hostname 実値 / action 実値 / Cloudflare 応答本文 / error-codes 実値 / Error.message / cause / stack / Siteverify URL クエリ / request body。

### 次回再有効化前の確認事項
- **同じキーの再入力だけで再挑戦しない**。まず本診断改善を Production へ反映し、失敗時のカテゴリを可視化する。
- 再有効化は**別承認**。有効化前にプライバシーポリシー（反映済み）と本書を確認。
- 想定原因の切り分け：`siteverify_http_error` が出れば Cloudflare へのリクエストが非2xx（例：User-Agent 等の要因）、`siteverify_network_error`/`siteverify_timeout` なら egress/到達性、`siteverify_rejected` ならキー/検証内容、`action_mismatch`/`hostname_mismatch` なら widget と本番ドメイン/action の不整合。
- ロールバック先：`dpl_DX3R6Z9skuEWrAD4DJ2uqSZz63jh`（commit `d476e27`・Turnstile 無効ビルド）。

### 参照（確認日 2026-08-03）
- Server-side validation: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
