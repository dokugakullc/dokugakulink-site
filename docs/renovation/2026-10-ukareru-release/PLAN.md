# ウカレル配信開始に伴うサイト改修計画（Claude Code作業指示書）

- 作成日: 2026-10-18
- 作成: Owner（陣内）＋ Claude（Cowork）
- 元資料: Claude Docs「dokugakulink.com 改修計画（ウカレル配信開始対応）」
  https://claude.ai/code/artifact/9c683a3e-fa2c-44c3-8eef-2a0189612239
- 対象リポジトリ: `/Users/tomonorijinnai/Development/dokugakulink-site`（GitHub: `dokugakullc/dokugakulink-site`）

> Claude Code へ：この文書を上から順に読み、「0. 着手前の確認」を終えてから作業すること。
> 各タスクのチェックボックスは、完了したらこのファイル上で `[x]` に更新すること。

---

## 背景（なぜ改修するか）

- 宅建士アプリ「ウカレル｜宅建士 一問一答・試験対策」は App Store で配信中
  （ https://apps.apple.com/jp/app/id6787687806 ）。
- しかし本番サイト（2026-10-18 時点）は全ページが「開発中・リリース準備中・事前登録受付中」のまま。
  サイトから App Store へ行く導線がなく、訪問者がダウンロードできない。
- 事前登録の登録者は 0 件だったため、案内メールは送らない。**事前登録フォームはサイト上から見えなくすればよい**（Owner回答）。

## 調査で分かったこと（コードの現状）

1. **公開状態の切替は実装済みだが本番に入っていない。**
   - `src/lib/ukareruRelease.ts` の `isUkareruReleased()`（環境変数 `NEXT_PUBLIC_UKARERU_RELEASED`、未設定時は Preview のみ true）。
   - これを使う `UkareruLP.tsx` / `Header.tsx` / `AppStoreCta.tsx` / 両 `opengraph-image.tsx` / 両 `page.tsx` の切替は
     ブランチ `feat/waitlist-offer-guide`（origin と同期済み）にあり、**origin/main には未マージ**。
   - 2026-10-18 時点で `origin/main...feat/waitlist-offer-guide` = main側4コミット / ブランチ側13コミット。
2. **切替の対象外のページがある。** トップ `src/app/page.tsx`、事業内容 `src/app/business/page.tsx`、
   会社概要 `src/app/company/page.tsx`、お知らせ `src/lib/news.ts` は「開発中」「リリース準備中」「事前登録受付中」を直書きしている。
3. **サポートページは既にある。** `/contact` が「お問い合わせ・サポート」（FAQ 11件、support@ 表示）になっている。新ルートは作らない。
4. `src/app/sitemap.ts` は lastmod を出していない。
5. リポジトリ直下に `dokugakulink-site-meta-creatives/` `dokugakulink-site-meta-lead-review/` `dokugakulink-site-offer-redesign/`
   （別作業用のコピー、未追跡）がある。**触らない・消さない・コミットしない。** lint/build/test がこれらを拾って失敗する場合は報告する。

## Owner の決定事項（2026-10-18 回答済み）

| 論点 | 決定 |
| --- | --- |
| 30日無料の仕組み | Appleの無料トライアルとしては実装していない。RevenueCat側で課金されない設定。→ サイトの「30日間すべて無料・終了だけでは自動課金なし」は正しい。表現は変えない |
| トラッキング | **アプリは他社アプリ・サイトをまたいだ追跡を行っている。** → プライバシーポリシーに明記が必要 |
| ウェルスコンサルの範囲 | **不動産と資金計画のみ。** 有価証券の投資判断への助言は行わない → ページに範囲を明記 |
| 配信開始日 | Owner の記憶では **2026-09-20**。お知らせ公開前に App Store Connect で日付を確認してもらうこと（確認できるまで記事の日付はこのままでよいが、PR本文に「要確認」と書く） |
| 事前登録 | 登録者0件。メール送信なし。フォームは非表示にする |

---

## 0. 着手前の確認（必須）

- [x] `AGENTS.md` を読み、そこに書かれた Obsidian の必須参照ファイルを読む
      （Vault: `/Users/tomonorijinnai/Library/Mobile Documents/com~apple~CloudDocs/obsidian/デフォルト/`）。
      特に `50_Website/01_Decision_Log.md`（DEC-WEB-2026-07-21）と `50_Website/LPs/Takken_LP.md`。
- [x] Next.js は独自版。コードを書く前に `node_modules/next/dist/docs/` の該当ガイドを読む。
- [x] Obsidian とこの計画が食い違う場合は、作業を止めて差分を Owner に報告する。
- [x] `AGENTS.md` の「Web正本 ローカル」は `/Users/tomonorijinnai/dokugakulink-site/` になっているが、
      実際の作業フォルダは `/Users/tomonorijinnai/Development/dokugakulink-site`。どちらが正か Owner に確認し、AGENTS.md を直す。
- [x] `git status` で未コミットの変更を確認し、既存の変更は破棄しない。

### 守るルール（AGENTS.md より）

- `/landing/takken` と `/services/takken` の **URL・route・canonical は変えない。新規route・redirect は作らない。**
  → 元計画の「サポートページ新設」「/landing/takken を301」は **やらない**（下記で代替）。
- 価格・無料範囲・機能表現を独断で変えない。実装されていない機能、架空の実績、未確認の合格率を載せない。
- `.env` と秘密情報をコミットしない。

## 1. ブランチ方針

- [x] `feat/waitlist-offer-guide` から作業ブランチ `feat/ukareru-release-site` を作る。
- [x] `origin/main` を取り込み（main側の4コミット）、衝突があれば解消する。
- [ ] 以下のタスクをこのブランチで実装し、最後に main 向けの PR を作る（push と PR 作成は Owner の許可を得てから）。

---

## 2. P0：配信中にする（最優先）

### 2-1. ウカレルLP（`/services/takken`・`/landing/takken`）

- [x] 公開状態の切替が、本番の環境変数 `NEXT_PUBLIC_UKARERU_RELEASED=1` で正しく配信中表示になることを、
      ローカルで `NEXT_PUBLIC_UKARERU_RELEASED=1 npm run build && npm start` で確認する。
      → 2026-10-18 確認済み。※リポジトリ直下の別作業コピー3つを tsc が拾い build が失敗するため、コピーを除いたミラーでビルド・起動した。
- [x] 配信中表示で、事前登録フォーム（`EmailForm`）・`#register` への導線・「事前登録」の文言が**一切表示されない**ことを確認する。
      残っていれば非表示にする。
- [x] 配信中表示の CTA がすべて `AppStoreCta` 経由（App Store へ、計測イベント付き）になっていることを確認する。
- [x] Apple 公式の「App Storeからダウンロード」バッジ画像を CTA の少なくとも1か所（ヒーロー）に使う。
      バッジは Apple のマーケティングガイドラインに沿った公式素材を使う（自作しない）。素材がなければ Owner に依頼する。
      → 2026-10-18 Owner 許可のうえ Apple 公式ツール（toolbox.marketingtools.apple.com・日本語・黒）から取得し、
        `public/badges/app-store-download-ja-black.svg`（無改変）としてヒーローの CTA に使用。
- [x] PC表示向けに、App Store URL の QR コードを1か所置く（画像は静的ファイルで可）。
      → Owner 許可のうえ devDependency `qrcode@1.5.4` を追加し、`scripts/generate-app-store-qr.mjs` で
        `public/qr/app-store-ukareru.svg` を生成。ヒーローのバッジ横に幅1024px以上だけ表示。読み取り結果が App Store URL と一致することを確認。
- [x] `<meta name="apple-itunes-app" content="app-id=6787687806">` を両LPに出す（Next の metadata API の `itunes` 等、
      このNext版の正しい書き方を docs で確認）。公開状態が false のときは出さない。
- [x] meta description・OGP 画像・FAQ が配信中版になっていることを確認する（`RELEASED_FAQ`）。

### 2-2. トップ（`src/app/page.tsx`）

- [x] 「開発中のサービス」欄：`isUkareruReleased()` で切り替え、配信中なら
      「App Storeで配信中」「無料ダウンロード」＋ `AppStoreCta` にする。「リリース準備中」「事前登録受付中」を消す。
- [x] 「現在取り組んでいること」：宅建士は「配信中」、FP・簿記は「準備中」等、事実に合わせる。
- [x] 開発ロードマップ：Phase 1 を「完了（2026年9月 App Store配信開始）」、Phase 2 を「進行中」か「準備中」か Owner に確認して反映。
      → Phase 1 は反映済み（「完了」＋配信開始月）。Phase 2 は Owner 回答（2026-10-18）により「準備中」のまま。

### 2-3. 事業内容（`src/app/business/page.tsx`）

- [x] 「現在開発中のサービス」「リリース準備中」「事前登録受付中」を配信中表記に切り替え、`AppStoreCta` を置く。

### 2-4. 会社概要（`src/app/company/page.tsx`）

- [x] 数字欄「開発中サービス 1件」→「提供中サービス 1件」等に切り替え。
- [x] ロードマップの「現在」マークを 2026年（宅建学習サービス提供開始）に移す。
- [x] 「開発中プロジェクト」欄を配信中表記に切り替える。

### 2-5. お知らせ（`src/lib/news.ts`）

- [x] 新記事を先頭に追加：slug `ukareru-app-store-release`、日付「2026年9月20日」（要確認）、
      タイトル例「宅建士学習アプリ『ウカレル』をApp Storeで配信開始しました」、本文に App Store リンク・主な機能・料金（月額580円・30日間全機能無料・自動課金なし）。
      **機能・数字は LP と App Store に既にある表現だけを使う**（913問、2026年法改正対応 など）。
      → 2026-10-18 App Store Connect の公開中説明文に「2026年度法改正対応」「913問を収録」があることを確認し、記事に記載。
- [x] 一覧を日付の新しい順に並べる（現状は 2026/6 → 2025/10 → 2026/6 → 2026/5 で崩れている）。
      並べ替えは配列順ではなく日付で行う仕組みにする（日付を `YYYY-MM-DD` で持ち、表示用に整形）。
- [x] 既存記事のタグ「事前登録受付中」「開発中」は過去の記事なので、配信中の今は外すか「終了」扱いにする。本文は履歴として残す。

### 2-6. 共通

- [x] 公開状態に依存する表示は、すべて `isUkareruReleased()` で切り替える（直書きで消さない）。
- [x] 完了確認：`NEXT_PUBLIC_UKARERU_RELEASED=1` のビルドで、`src/` を「開発中」「準備中」「事前登録」で検索し、
      ウカレルに関して表示されるものが 0 件であること（FP・簿記など将来の資格の「準備中」は可）。
      → 生成HTMLで確認。残りは旧お知らせ記事の本文（履歴として保持）と、プライバシーポリシーの「事前登録フォーム」の記述（Owner 了承のうえ残す・2026-10-18）。

## 3. P1：法務・問い合わせの整合

- [x] **プライバシーポリシー（`src/app/privacy/page.tsx`）**：アプリ「ウカレル」の項を追加・確認する。
  - アプリで取得する情報：購入履歴、ユーザーID、利用状況、診断データ（App Store のプライバシー申告と同じ範囲）。
  - **他社のアプリ・サイトをまたいだトラッキングを行うこと**、その目的、利用する事業者、iOSの「トラッキング許可（ATT）」で拒否できること。
  - 課金管理に RevenueCat を使っているなら、その旨と送信する情報。
  - 分析データ（PostHog 等）の保存期間。
  - 具体的なSDK名・保存期間が分からない場合は推測で書かず、アプリのリポジトリ（`/Users/tomonorijinnai/takken-app`）を読んで確認するか、Owner に確認する。
  - 改訂日を更新する。
  → 2026-10-18 第6項「アプリ『ウカレル』で取得する情報」を追加（takken-app origin/main＝公開中 Build 17 のコードで確認）。
    Firebase（Google）・RevenueCat・PostHog・Meta SDK と、ATT 許可時のみ IDFA を使うトラッキング、外国にある事業者への提供を記載。最終改訂日を 2026年10月18日に更新。
    保存期間：Owner 回答（2026-10-18「特に指定していない」）に基づき、「アカウント情報等はアカウントが存在する間・外部サービスへ送信したデータは当社で個別の期間を指定せず各事業者の標準設定に従う」と記載。
    利用規約の制定日・App のプライバシー情報との整合・法務確認は Owner 回答により現状のまま。
- [x] **利用規約（`src/app/terms/page.tsx`）**：制定日を追記。返金条項（原則不可・Appleの規定に従う・法令上認められる場合を除く）を特商法ページと同じ内容で追加。
  → 制定日は 2026年7月5日（サイトに規約ページを作成し全面改訂した日・git 履歴より。要確認）。返金は条番号を変えないよう第5条（サブスクリプション・返金）に追加。
- [x] **特商法表記（`src/app/legal/tokushoho/page.tsx`）**：「動作環境：iPhone（iOS 13.0以降）」を追加（App Store掲載と一致させる。最低OSは Owner に確認）。
  → App Store Connect の公開中 Build 17 の minOsVersion=13.0 と一致を確認。
- [x] **お問い合わせ（`src/app/contact/page.tsx`・`src/components/ContactForm.tsx`）**：
  - フォームにプライバシーポリシー同意チェック（必須）を追加。API側（`contactHandler`）でも検証し、テストを追加。
  - 種別に「アプリの課金・解約」「ウェルスコンサルティングのご相談」を追加（既存の選択肢との重複を確認）。
  - フォーム経由の返信文言「ご登録のメールアドレスへ」→「ご入力いただいたメールアドレスへ」（ログイン・パスワード再設定の FAQ の「ご登録の」はそのままでよい）。
  - アプリの問い合わせは support@、それ以外は info@ という使い分けをページ上に1行で明記。
- [x] **会社概要**：会社情報に「代表社員 陣内 智徳」を追加。
- [x] App Store Connect のサポートURLが `/contact` を指しているか、Owner に確認を依頼する（コード変更ではない）。
  → 2026-10-18 App Store Connect API（読み取りのみ）で `https://www.dokugakulink.com/contact` を確認済み。

### 3-追加. Owner 追加依頼（2026-10-18）

- [x] 公開中の Web サービス「電子印鑑作るさん」（https://inkan.dokugakulink.com/）をコーポレートサイトで紹介する。
  → トップ・事業内容（#web）・会社概要に紹介カード、お知らせに公開記事（2026-10-17）を追加。文言は公開サイトにある表現のみ使用。
    事業内容ページの「2つの事業」と会社情報の「事業内容」欄は変えていない（事業区分の変更になるため）。

## 4. P2：SEO・計測・内容の充実

- [x] `/landing/takken`：AGENTS.md の方針（広告の正本遷移先・URL/canonical不変）により**リダイレクトもcanonical変更もしない**。
      重複対策が必要かどうかは Decision Log を確認し、必要なら Owner に提案だけする。
      → Decision Log に重複対策の決定は無し。SEO戦略に「広告専用LPは noindex も検討」とあったため提案 → Owner 決定（2026-10-18）で検索結果を /services/takken に絞る。
        `/landing/takken` に `robots: noindex, follow` を付け、sitemap から除外。URL・route・canonical は不変。SEO戦略と Decision Log（DEC-WEB-2026-10-18）を更新。
- [x] `/services/takken` の title を App Store 名に寄せる（例：「ウカレル｜宅建士 一問一答アプリ（iPhone・無料）」）。
      → 配信中のときだけ「ウカレル｜宅建士 一問一答アプリ（iPhone・無料）」。公開前と /landing/takken の title は変えていない。
- [x] 構造化データ：`/services/takken` に `MobileApplication`（name, operatingSystem: iOS, applicationCategory: EducationalApplication,
      offers: price 0 JPY, url=App Store）を JSON-LD で追加。トップに `Organization`。**評価（aggregateRating）は件数がないので入れない。**
      → 配信中のときだけ出力。Organization はサイト全体（layout.tsx）に既にあり、トップにも出ている。
- [x] アプリの呼び方を統一：「宅建独学支援アプリ」「合格ナビゲーションアプリ」の混在を、App Store 名に合わせた
      「宅建士学習アプリ『ウカレル』」に統一（ブランド表現の変更になるので、Obsidian の Brand Guidelines を確認し、違えば Owner に確認）。
      → Brand Guidelines と食い違うため確認 → Owner 決定（2026-10-18）で「宅建士学習アプリ」に統一。サイト全体（LP title・description・FAQ・トップ・事業内容・会社概要・お知らせ・フッター）を置換。
        過去のお知らせ記事（2025-10・2026-06）の題名・本文は履歴として当時のまま。Brand Guidelines に「アプリの呼び方」を追加し、Decision Log に DEC-WEB-2026-10-18 を記録。
        プロダクト憲法の Vision・Brand Guidelines の One Sentence（社内定義「合格ナビゲーションアプリ」）は社内の設計思想として残した。
- [x] 計測：`AppStoreCta` の App Store URL にキャンペーントークン `ct=<location>`（hero / mid / register / final / sticky / header / news など）を付け、
      App Store Connect の流入元で比較できるようにする。既存の `trackAppStoreCtaClicked` は維持。
      Meta ピクセル・GA4 の成果イベントを事前登録から App Store CTA クリックに切り替える必要があるか、`docs/marketing/acquisition-measurement-runbook.md` を確認して対応。
      → 仕組みは実装（`appStoreCampaignUrl`・ct=<source>-<location>・テスト3件）。**App Store Connect のプロバイダトークン（pt）が未入手のため、現在は従来の URL のまま**。
        pt を `src/lib/appStore.ts` の `APP_STORE_PROVIDER_TOKEN` に入れると有効になる（QR は再生成が必要）。
        Owner 決定（2026-10-18）：pt は設定せず従来の URL のままでよい。
        成果イベントは既に `app_store_cta_clicked`（DEC-WEB-2026-09-05・Lead には数えない）でランブックとも一致。コード変更不要。
- [x] **事業内容のウェルスコンサル**：
  - 対象範囲を明記：「不動産（購入・売却・保有）と資金計画に関する調査・分析・助言に限ります。株式・投資信託など有価証券の個別の投資判断に関する助言は行いません。」
  - 代表の保有資格（宅建士、FP2級、簿記2級、証券外務員二種）を掲載（資格名は Owner 確認済み）。
  - 料金の目安・成果物サンプルは **Owner から内容をもらうまで載せない**（TODOとしてPR本文に残す）。
  → 対象範囲の文言と代表の保有資格（宅建士・FP2級・簿記2級・証券外務員二種）を #wealth に追加。料金目安・成果物サンプルは未掲載（Owner 提供待ち）。
- [x] `sitemap.ts`：lastmod を出す（ニュースは記事日付、固定ページはビルド日でよいか Decision Log を確認）。
      → Decision Log に定めは無し。お知らせは記事の日付、固定ページはビルド日にした。
- [x] `docs/marketing/app-store-metadata-ja.md`：App Store 説明文の「30日間の無料トライアル」に相当する表現があれば、
      「30日間すべての機能が無料（期間終了だけでは自動課金なし）」に揃える案を追記（App Store Connect への反映は Owner）。
      → 公開中の説明文（ASC API で読み取り）に「無料トライアル」表現は無し。「期間終了だけでは自動課金なし」の一文を加える案を追記。

---

## 5. 完了時（AGENTS.md の手順）

      → 公開中の説明文（ASC API で読み取り）に「無料トライアル」表現は無し。「期間終了だけでは自動課金なし」の一文を加える案を追記。
- [x] `npm run lint` / `npm run build` / `npm test` がすべて通る。`NEXT_PUBLIC_UKARERU_RELEASED=1` と `=0` の両方でビルドする。
- [x] スマホ幅とPC幅で、トップ・ウカレル・LP・事業内容・会社概要・お知らせ・お問い合わせ・法務3ページを目視確認。
      App Store リンク、フォーム送信（同意チェック含む）、OGP、metadata を確認。
- [x] 仕様の変更を Obsidian（`50_Website` 配下の該当ファイル、Decision Log、`03_CURRENT_SPRINT.md`）に反映する。
- [x] このファイルのチェックボックスを更新し、`docs/reports/` に実装レポート（`ukareru_release_site_YYYY-MM-DD.md`）を残す。
- [x] PR 本文に「Owner がやること」を列挙する：
  1. Vercel の Production 環境変数に `NEXT_PUBLIC_UKARERU_RELEASED=1` を設定して再デプロイ
  2. App Store Connect で配信開始日（2026-09-20 と記憶）とサポートURLを確認
  3. App Store 説明文の無料期間の表現を揃える
  4. Google Search Console で主要ページの再クロールを依頼
  5. ウェルスコンサルの料金目安・成果物サンプルの提供

→ 2026-10-18 完了時メモ：
  - lint・tsc はリポジトリ自身のソース範囲、build は別作業コピー3フォルダを除いた複製で実施（コピーがあるとリポジトリ直下での実行は失敗する）。両モードの build・test 283件 PASS。
  - Obsidian 更新：Decision Log（DEC-WEB-2026-10-18）・Brand Guidelines・SEO Strategy・00_README・LPs/Takken_LP・50_Company_Profile・Legal 3ノート・03_CURRENT_SPRINT・01_IMPLEMENTATION_MAP / 02_ENVIRONMENT_REGISTRY（Web のローカルパス）。
  - 実装レポート：`docs/reports/ukareru_release_site_2026-10-18.md`／PR 本文の下書き：`docs/renovation/2026-10-ukareru-release/PR_BODY.md`
  - 残：コミット・push・PR 作成（Owner 承認待ち）

## Owner がやること（コード外）

- Vercel 本番環境変数 `NEXT_PUBLIC_UKARERU_RELEASED=1` の設定
- App Store Connect：配信日・サポートURL・説明文の確認
- アプリ側：トラッキングを行うため、ATT（トラッキング許可ダイアログ）が実装されているか確認（`takken-app` 側の作業）
