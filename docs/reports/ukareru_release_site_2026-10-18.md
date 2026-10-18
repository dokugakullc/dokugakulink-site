# ウカレル配信開始に伴うサイト改修 実装レポート（2026-10-18）

- 計画：`docs/renovation/2026-10-ukareru-release/PLAN.md`
- ブランチ：`feat/ukareru-release-site`（`feat/waitlist-offer-guide` から作成し、origin/main を取り込み済み）
- 決定記録：Obsidian `50_Website/01_Decision_Log.md` DEC-WEB-2026-10-18

## 結論

App Store で配信中のウカレルに合わせて、サイト全体を「配信中」表示に切り替える改修を実装した。
表示の切替は既存の `isUkareruReleased()`（環境変数 `NEXT_PUBLIC_UKARERU_RELEASED`）に従う。
**本番で配信中表示になるのは、Owner が Vercel Production に `NEXT_PUBLIC_UKARERU_RELEASED=1` を設定して再デプロイした後。**
未設定の本番は従来どおり公開前表示のまま（fail-closed・DEC-WEB-2026-09-05）。

## 変更内容

### P0：配信中にする

| 対象 | 内容 |
|---|---|
| LP（`/services/takken`・`/landing/takken`） | ヒーローの CTA を Apple 公式バッジ（toolbox.marketingtools.apple.com から取得・無改変）に変更。PC 幅（1024px 以上）のみ App Store の QR コード。公開後のみ `apple-itunes-app`（Safari のスマートアプリバナー）。 |
| トップ | ウカレル欄・「現在取り組んでいること」・ロードマップ（Phase 1＝完了・2026年9月 App Store 配信開始／Phase 2＝準備中）を公開状態で切替。App Store CTA を追加。 |
| 事業内容・会社概要 | 「開発中」「リリース準備中」「事前登録受付中」を配信中表記へ切替。数字欄・ロードマップの「現在」マーク・プロジェクト欄。 |
| お知らせ | 日付を `YYYY-MM-DD`（または `YYYY-MM`）で持ち、日付の新しい順に並べる。配信開始記事（2026-09-20・**要確認**・公開後のみ）。過去記事のタグは公開後に「受付終了」または非表示。 |

### P1：法務・問い合わせ

| 対象 | 内容 |
|---|---|
| プライバシーポリシー | 第6項「アプリ『ウカレル』で取得する情報」を新設。Firebase・RevenueCat・PostHog・Meta SDK、他社アプリ・サイトをまたいだトラッキングと ATT、保存期間、外国にある事業者への提供。takken-app origin/main（公開中 Build 17）のコードで確認した事実のみ。 |
| 利用規約 | 制定日（2026年7月5日）を追記。第5条に返金条項（特商法と同文）。条番号は不変。 |
| 特商法 | 動作環境「iPhone（iOS 13.0以降）」。App Store Connect の公開中ビルドの minOsVersion と一致。 |
| お問い合わせ | プライバシーポリシー同意を必須化（画面と API の両方で検証）。種別「アプリの課金・解約」「ウェルスコンサルティングのご相談」を追加。返信文言を「ご入力いただいたメールアドレス」に。support@／info@ の使い分けを明記。 |
| 会社概要 | 代表社員 陣内 智徳。 |
| Webサービス（Owner 追加依頼） | 「電子印鑑作るさん」（https://inkan.dokugakulink.com/）をトップ・事業内容（#web）・会社概要で紹介し、公開記事（2026-10-17）を追加。 |

### P2：SEO・計測・内容

| 対象 | 内容 |
|---|---|
| アプリの呼び方 | 「宅建士学習アプリ」に統一（Owner 決定）。過去のお知らせ記事は履歴として当時のまま。Brand Guidelines に「アプリの呼び方」を追加。 |
| `/landing/takken` | `robots: noindex, follow`・sitemap から除外（Owner 決定：検索結果は `/services/takken` に絞る）。URL・route・canonical は不変。 |
| `/services/takken` | 公開後の title「ウカレル｜宅建士学習アプリ（一問一答・iPhone・無料）」、構造化データ `MobileApplication`（公開後のみ・評価なし）。Organization は layout で全ページに出力済み。 |
| App Store の流入計測 | キャンペーンリンク（pt / ct）の仕組みを実装。pt は設定しない（Owner 判断）ため、リンクは従来の URL のまま。成果イベントは既に `app_store_cta_clicked`。 |
| ウェルスコンサル | 対応範囲（不動産と資金計画のみ・有価証券の個別助言なし）と代表の保有資格。料金目安・成果物サンプルは未掲載（Owner 提供待ち）。 |
| sitemap | lastmod（お知らせ＝記事の日付、固定ページ＝ビルド日）。 |
| App Store 説明文 | 公開中の説明文に「無料トライアル」表現は無し。自動課金なしの一文を加える案を `docs/marketing/app-store-metadata-ja.md` に追記。 |

### 依存パッケージ

- devDependency に `qrcode@1.5.4`・`@types/qrcode@1.5.6` を追加（Owner 承認）。QR の生成専用（`scripts/generate-app-store-qr.mjs`）で、本番の実行コードには入らない。
- `npm audit` の指摘（next 等）は既存パッケージ由来で、今回の追加とは無関係。今回は対応していない。

## 検証結果

| 項目 | 結果 |
|---|---|
| ESLint（`src`・`tests`・追加スクリプト） | エラー0・警告0 |
| 型チェック（`tsc --noEmit`・リポジトリ自身のソース） | エラー0 |
| `npm test` | 283件すべて成功（新規：お知らせ6件・同意検証2件・App Store リンク3件） |
| `next build`（`NEXT_PUBLIC_UKARERU_RELEASED=1` と `=0`） | 両方成功 |
| 生成HTMLの確認 | 公開後ビルドで「事前登録」「開発中」「準備中」が出るのは、FP・簿記の「準備中」・過去記事の本文・プライバシーポリシーのフォーム説明だけ。公開前ビルドは従来どおり。 |
| 表示（スマホ375px・PC1280px） | トップ・ウカレル・LP・事業内容・会社概要・お知らせ（一覧・記事）・お問い合わせ・法務3ページで横はみ出し0・画像切れ0。 |
| リンク・画像 | App Store リンク（LP は6か所）・QR の読み取り結果が App Store URL と一致・OGP 画像（両LP）・バッジ・sitemap が 200。 |
| フォーム | 同意なしで送信すると送信されずエラー表示（画面）。API は同意なしを400で拒否（テスト）。 |
| metadata | `/landing/takken`＝noindex, follow・canonical 自身／`/services/takken`＝index・canonical 自身・`apple-itunes-app`（公開後のみ）。 |

### 検証の注意

- リポジトリ直下に別作業用のコピー3フォルダ（`dokugakulink-site-meta-creatives` ほか・未追跡）があり、リポジトリでそのまま `npm run lint`・`tsc`・`npm run build` を実行すると、これらを拾って失敗する（コピーが古い `newsItems` を参照しているため）。コピーには触れていない。上記の検証は、コピーを除いた範囲（lint・tsc）と、コピーを除いた複製（build）で実施した。Vercel は git の内容でビルドするため影響はない。
- `next build` は Google Fonts を取得するため、サンドボックスの外で実行した。

## 未確認事項

- ウカレルの配信開始日（お知らせ記事は 2026-09-20。Owner の記憶。App Store Connect で要確認）。
- お問い合わせの実送信（本番の環境変数が必要なため、ローカルでは送信していない）。
- 本番（Vercel Production）での表示。環境変数の設定と再デプロイは Owner 作業。

## Owner がやること

1. Vercel の Production 環境変数に `NEXT_PUBLIC_UKARERU_RELEASED=1` を設定して再デプロイ
2. App Store Connect で配信開始日（2026-09-20 と記憶）を確認（サポートURL `/contact` は確認済み）
3. App Store 説明文の無料期間の表現を揃える（案は `docs/marketing/app-store-metadata-ja.md`）
4. Google Search Console で主要ページの再クロールを依頼
5. ウェルスコンサルの料金目安・成果物サンプルの提供
