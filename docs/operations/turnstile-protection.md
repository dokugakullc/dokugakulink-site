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

## 17. 明示的な有効化フラグ（3変数構成・kill switch）

初回有効化のロールバック後、**Site Key / Secret が保存済みでも、マージや再デプロイだけで意図せず再有効化されない**よう、明示的な有効化フラグを追加した（Phase 2D.5）。

### 有効化に必要な 3 変数（Production 限定）
```text
NEXT_PUBLIC_TURNSTILE_ENABLED=true
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<Production Site Key>
TURNSTILE_SECRET_KEY=<Production Secret>
```
- `NEXT_PUBLIC_TURNSTILE_ENABLED` は**文字列が完全に `"true"` のときだけ有効**。未設定 / `""` / `"false"` / `"TRUE"` / `"1"` / その他は無効（曖昧 truthy 判定はしない）。
- 判定契約は `resolveTurnstileConfig(enabledValue, siteKey, secret)` に一元化：フラグが `"true"` でなければ**鍵があっても `disabled`**／フラグ `"true"`＋両鍵あり＝`enabled`／フラグ `"true"` だが鍵が欠ける＝`misconfigured`（fail-closed で 500）。
- クライアント（`ContactForm`/`EmailForm`）の widget 描画も **フラグ `"true"`＋SiteKey** のときだけ（共通純粋関数 `isTurnstileWidgetActive`）。Secret はクライアントへ取り込まない。有効化判定はリクエスト値から変更できない。

### 通常状態
- Site Key / Secret が保存されていても、**フラグ未設定/`false` なら Turnstile は無効**（widget 非描画・従来のフォーム経路）。
- **PR をマージするだけでは Turnstile は有効にならない**（フラグが未設定のため）。

### 有効化手順（Owner の別承認）
1. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` が Production 限定で存在することを確認。
2. Owner の別承認を得る。
3. `NEXT_PUBLIC_TURNSTILE_ENABLED=true` を **Production 限定**で設定。
4. Production を再デプロイ（`NEXT_PUBLIC_*` はビルド時反映＝ビルドキャッシュを使わない）。
5. widget 表示・Siteverify・action・hostname・token/reset・**診断ログの reason** を確認。
6. contact / register を各 1 件だけ管理された方法で確認（Owner 手動）。
7. エラー監視（5xx・`turnstile verification failed` の reason 分布）。

### 無効化手順（kill switch）
1. `NEXT_PUBLIC_TURNSTILE_ENABLED` を**削除、または `false` へ変更**。
2. Production を再デプロイ。
3. widget / script が非描画になったことを確認。
4. 従来のフォーム経路が復旧したことを確認。
- **Site Key / Secret は緊急無効化時に残したままでよい**（有効化フラグが kill switch）。

### ロールバック
- 必要なら直前正常デプロイへロールバック。現在の安全なロールバック先＝`dpl_DX3R6Z9skuEWrAD4DJ2uqSZz63jh`（Turnstile 無効ビルド）。
- **Preview / Development には 3 変数とも設定しない**。

## 18. 2026-08-04 管理下再有効化と Siteverify HTTP 400 診断（Phase 2D.6）

### インシデント要約
- 管理下で Production の Turnstile を一時有効化（フラグ入りビルドを promote）→ Owner が **問い合わせフォームを 1 回だけ**手動送信。
- 結果：widget は成功表示だが送信は失敗（ユーザー向け文言「認証を確認できませんでした。…」）。
- ランタイムログ（失敗デプロイ限定・当該 1 件のみ）：`contact: turnstile verification failed { reason: 'siteverify_http_error', httpStatus: 400 }`。
- 二重 POST なし・`/api/register` POST なし・5xx / 例外なし・Resend / Contact Store 未到達・Secret / token / PII 非露出。
- **即時ロールバック**：安全デプロイ `dpl_FpMQT6HbujUGh8MAFoYzvyfbJYp2`（commit `1edfc60`／フラグ未設定ビルド＝Turnstile 無効）を Production へ promote し復旧。
- 前回（2026-08-03）の「Category B（例外 throw）」から前進し、失敗が「**Siteverify が明確に HTTP 400 を返す（リクエストが不正扱い）**」ことまで確定。具体サブ原因は当時の許可情報だけでは一意化不可（応答本文は規則により未取得）。

### 現在の安全デプロイ（ロールバック先）
- **`dpl_FpMQT6HbujUGh8MAFoYzvyfbJYp2`**（§17 の旧記載 `dpl_DX3R6Z9sk…` を上書きせず、こちらが最新の安全デプロイ）。
- `vercel promote dpl_FpMQT6HbujUGh8MAFoYzvyfbJYp2` で即復帰できる。

### Siteverify 診断のログ方針（Phase 2D.6 改善）
- **HTTP 400（非2xx）時は、許可リストに一致した既知 error-code だけを記録**する（`missing-input-secret` / `invalid-input-secret` / `missing-input-response` / `invalid-input-response` / `bad-request` / `timeout-or-duplicate` / `internal-error`）。
- **生の Cloudflare レスポンス本文・JSON 全体・headers・request body は記録しない**。未知コード・非文字列・過長値は捨てる。件数は上限（許可リスト長）まで。
- ログ meta は `{ reason, httpStatus?, errorCodes? }` の固定型のみ。Secret / token / hostname 実値 / action 実値 / PII は出さない。
- 例：`{ reason: "siteverify_http_error", httpStatus: 400, errorCodes: ["invalid-input-secret"] }`。

### error-code 別の次アクション（Owner 判断）
- **`invalid-input-secret`**：Site Key と Secret の**ペア整合**を Owner が再確認（テストキーと本番キーの取り違え、別ウィジェットの Secret 混在など）。値は表示しない。
- **`bad-request`**：**送信形式・必須フィールド**を公式仕様と再照合（本 PR で JSON `{ secret, response }` へ統一済み）。
- **`invalid-input-response`**：**token の生成・有効期限（300秒）・単回利用**を確認（widget callback → POST body の受け渡し、使い回し/失効）。
- **`timeout-or-duplicate`**：token の再利用・失効。widget の reset と再取得フローを確認。
- **`missing-input-secret` / `missing-input-response`**：env（Secret）または token の受け渡し欠落を確認。
- **Secret の再生成は Owner の別承認**が必要（本作業では行わない）。

### 送信形式の堅牢化（Phase 2D.6）
- Siteverify 送信を **JSON（`Content-Type: application/json`, body=`{ secret, response }`）** に統一（公式が明示対応する形式・シリアライズが明示的）。エンドポイント・10秒 timeout・User-Agent は不変。`remoteip` / `idempotency_key` は送らない。
- **入力正規化**：token は文字列・非空・最大 2048 文字（超過は Cloudflare を呼ばず安全拒否・token は加工しない）。Secret は前後の改行/空白を除いて送る（env コピー時の混入を吸収・trim 後空は `resolveTurnstileConfig` が `misconfigured`）。
- 「現行 form-urlencoded が誤りだった」という断定ではなく、**公式対応形式のうちシリアライズが明示的な JSON へ統一する堅牢化**。

### 再有効化の条件
- 本 PR は **Draft のまま**。再有効化は本修正 PR のマージ後に、**管理された短時間テスト**で行う（widget 表示 → Owner 手動 1 件 → 診断 reason 確認 → 問題時は上記安全デプロイへ即ロールバック）。
- 原因特定前に Turnstile を再有効化しない。
