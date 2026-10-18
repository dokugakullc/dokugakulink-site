## 概要

宅建士学習アプリ「ウカレル」の App Store 配信開始に合わせて、サイト全体を「配信中」表示に切り替える改修です。
表示の切替は既存の `NEXT_PUBLIC_UKARERU_RELEASED` に従います。**マージしただけでは本番は公開前表示のまま**です（fail-closed）。

- 計画：`docs/renovation/2026-10-ukareru-release/PLAN.md`
- 実装レポート：`docs/reports/ukareru_release_site_2026-10-18.md`
- 決定記録：Obsidian `50_Website/01_Decision_Log.md` DEC-WEB-2026-10-18

## 主な変更

- **配信中表示**：LP（Apple 公式バッジ・PC のみ QR・`apple-itunes-app`）、トップ・事業内容・会社概要・お知らせの「開発中」「事前登録受付中」を公開状態で切替
- **お知らせ**：日付順の並べ替え、配信開始記事（公開後のみ）、「電子印鑑作るさん」公開記事
- **法務**：プライバシーポリシーにアプリの項（トラッキング・ATT・外部サービス・保存期間）、利用規約に制定日・返金条項、特商法に動作環境（iOS 13.0以降）
- **お問い合わせ**：プライバシーポリシー同意を必須化（API でも検証）、種別2つ追加、support@／info@ の使い分け
- **会社情報**：代表社員、Webサービス「電子印鑑作るさん」の紹介、ウェルスコンサルの対応範囲と保有資格
- **SEO**：アプリの呼び方を「宅建士学習アプリ」に統一、`/landing/takken` を noindex（URL・canonical は不変）、`/services/takken` の title と構造化データ、sitemap の lastmod
- **依存**：devDependency に `qrcode` / `@types/qrcode`（QR 生成スクリプト専用）

## 検証

- ESLint：エラー0・警告0（`src`・`tests`・追加スクリプト）
- 型チェック：エラー0
- `npm test`：283件すべて成功
- `next build`：`NEXT_PUBLIC_UKARERU_RELEASED=1` と `=0` の両方で成功
- スマホ幅・PC幅で主要12ページを確認（横はみ出し・画像切れなし）、QR の読み取り・OGP・metadata・フォームの同意チェックを確認

※ リポジトリ直下の別作業用コピー（未追跡）があると、ローカルでの `npm run build`・`tsc` がそれを拾って失敗します。Vercel は git の内容でビルドするため影響ありません。

## Owner がやること

1. Vercel の Production 環境変数に `NEXT_PUBLIC_UKARERU_RELEASED=1` を設定して再デプロイ
2. ~~App Store Connect で配信開始日を確認~~ → 2026-09-20 で確定（Owner 確認済み）。サポートURL `/contact` も確認済み
3. App Store 説明文の無料期間の表現を揃える（案は `docs/marketing/app-store-metadata-ja.md`）
4. Google Search Console で主要ページの再クロールを依頼
5. ウェルスコンサルの料金目安・成果物サンプル：たたき台を `docs/business/wealth-consulting/` に作成（**サイトには未掲載・Owner 確定待ち**）

🤖 Generated with [Claude Code](https://claude.com/claude-code)
