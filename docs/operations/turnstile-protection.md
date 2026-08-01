# Cloudflare Turnstile（bot 対策）運用・プライバシー文書

対象：`src/lib/turnstile.ts`（サーバー検証）・`src/lib/turnstileClient.ts`（クライアント純粋関数）・
`src/components/TurnstileWidget.tsx`（widget）・`src/lib/contactHandler.ts` / `src/lib/registerHandler.ts`
（DI 統合）・`src/app/api/contact/route.ts` / `src/app/api/register/route.ts`（env 注入）・
`src/components/ContactForm.tsx` / `src/components/EmailForm.tsx`（フォーム）。

本書は挙動を変更しない。法的文面は Owner／法務が確定する（本書は検討事項の提示に留める）。

## 1. 目的

問い合わせ・事前登録フォームへの bot／自動化投稿を抑制する。honeypot・Origin 検証・二重送信防止に
加える多層防御であり、既存対策を置き換えるものではない。

## 2. 有効化・無効化（環境変数）

| 変数 | 対象環境 | 公開範囲 |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Production（有効化時） | クライアント公開（Site Key のみ） |
| `TURNSTILE_SECRET_KEY` | Production（有効化時） | **サーバー専用（`NEXT_PUBLIC` を付けない）** |

- **両方未設定 → Turnstile 完全無効**（widget 非描画・Siteverify 呼ばず・従来挙動を維持）。
- **両方設定 → Turnstile 必須**（widget 描画・token 未取得は送信不可・サーバーで Siteverify 検証）。
- **片方のみ設定 → misconfigured**（fail-closed：外部処理せず 500・ユーザーには汎用エラー）。
- **Preview では無効**：Preview は Turnstile 検証より前に 503 で停止し、Site Key も未設定前提で widget を
  描画しない。ローカル／テストも実 Cloudflare へ接続しない（テストは fetch fake／公式ダミー値のみ）。
- 値は**ログ・エラー・テスト出力・クライアント HTML（Secret）へ出さない**。

## 3. Cloudflare への通信・送信され得る技術情報

- サーバーは Siteverify（`https://challenges.cloudflare.com/turnstile/v0/siteverify`）へ
  `secret`・`response`（token）を送る。`remoteip` は**既定で送らない**（プライバシー配慮・必須でない）。
- クライアントは Cloudflare の `api.js` を読み込み、Cloudflare が challenge 実行のため端末・ブラウザ情報等を
  取得し得る（Cloudflare のプライバシーポリシーに従う）。widget は `action`（contact/register）を付与する。
- サーバー検証で **`action`（contact/register 一致）** と **`hostname`（本番ドメインのみ許可）** を確認する。

## 4. token の取扱い（保存しない）

- token は **1 回・300 秒**のみ有効（Cloudflare 仕様）。サーバーは検証にのみ用い、以下へ**出さない**：
  GAS payload／`contacts` シート／メール本文／Analytics（GA4・Meta・PostHog）／ログ／attribution。
- クライアントは token を React state のみで保持し、**localStorage／sessionStorage／Cookie に保存しない**。
- API payload では固定フィールド `turnstileToken`（allowlist 外＝保存・転送されない）として送る。

## 5. プライバシー（PII を Analytics へ送らない）

- Turnstile 追加後も、Analytics へ送るのは非 PII（source／variant 等）のみ。token・メール・本文・氏名は送らない。

## 6. 障害時のユーザー案内・widget 非表示時の対応

- Cloudflare 障害・timeout・検証失敗時は**成功を返さず**、フォームは汎用文（例：「認証を確認できませんでした。
  ページを再読み込みして、もう一度お試しください。」）を表示し、token を破棄して widget を再取得する。
- widget が表示されない（script 読込失敗・広告ブロッカー等）場合、token を取得できず送信不可になる。
  代替導線として問い合わせ用メールアドレス等の案内を検討（Owner）。**有効化前に無効環境で導線を確認**すること。

## 7. アクセシビリティ・キーボード操作

- widget は Cloudflare 提供のアクセシブルな UI（キーボード操作対応）。フォーム既存の a11y
  （ラベル・`aria-invalid`・`aria-describedby`・フォーカス移動）は不変。token 未取得時の送信ブロックは
  `role="alert"` のエラーで通知する。

## 8. Secret ローテーション

- `TURNSTILE_SECRET_KEY` は Cloudflare ダッシュボードで再生成し、Vercel 環境変数を更新して再デプロイする。
  Site Key と Secret はペアで更新する（片方だけ更新すると misconfigured になり fail-closed で 500）。
- Secret はコード・シート・ログ・クライアントへ保存しない（環境変数のみ）。

## 9. 有効化に必要な Owner 作業（本 PR では未実施）

1. Cloudflare で Turnstile サイトを作成し、**contact / register 用に action を運用**（widget は action を送出）。
2. Site Key／Secret Key を取得。
3. Vercel に `NEXT_PUBLIC_TURNSTILE_SITE_KEY`（Production）と `TURNSTILE_SECRET_KEY`（Production・サーバー専用）を設定。
4. 本番ドメイン（`dokugakulink.com` / `www.dokugakulink.com`）を Turnstile 許可 hostname に含める
   （`src/lib/turnstile.ts` の `ALLOWED_TURNSTILE_HOSTNAMES` と一致させる）。
5. CSP を導入する場合は `script-src` / `frame-src` に `https://challenges.cloudflare.com` を追加（→ 別フェーズ）。
6. 本番で widget 表示・送信・失敗時導線を確認。

## 10. プライバシーポリシー追記の検討事項（自動変更しない）

現行 `privacy/page.tsx` は外部サービス（Analytics・広告）を記載。Turnstile 有効化前に、次を Owner／法務で検討：

- bot 対策のため **Cloudflare Turnstile を利用**し、challenge 実行時に端末・ブラウザ情報等が Cloudflare へ
  送信され得ること。
- Turnstile が Cookie／ローカルストレージを使用し得ること（Cloudflare の仕様・モードに依存）。

本タスクではポリシー本文を**変更しない**（指摘のみ）。
