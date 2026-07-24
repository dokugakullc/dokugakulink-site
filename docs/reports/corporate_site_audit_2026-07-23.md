# Corporate Website Audit — コーポレートサイト総点検・公開前最終監査

- 実施日: 2026-07-23
- 担当: Corporate Website Manager (Claude Code)
- 依頼元: Owner
- 正本: Release Build `dokugakullc/takken-app` @ `523cc27eb810e232b32bdf6dfdcbae4bcd82fad7` / v1.0.0 (5)
- 監査対象: `https://www.dokugakulink.com`（公開中）+ リポジトリ `dokugakulink-site`

---

# Overall Status

```yaml
Corporate Website: NOT READY
Evidence:          COMPLETE（一部 NOT_COLLECTED あり・下記 Evidence 章に明記）
Overall:           NOT READY

P0 FAIL:   10 件
P1:         5 件
P2:         7 件
UNDETERMINED: 3 件
Broken Links: 0 件
```

---

# 0. 前提：監査対象は「2つの層」に分かれている

これは本監査の最重要事実である。

```yaml
公開中（LIVE / 一般ユーザーが見ているもの）:
  ブランチ: main
  tip: 00400f4
  内容: 旧LP（β版・1,000問・模試3回分・価格未定・旧ブランドコピー）
  Meta Pixel: 未読込（本番envに NEXT_PUBLIC_META_PIXEL_ID なし）

未デプロイ（BRANCH / 是正済みだが誰も見られない）:
  ブランチ: feat/ukareru-waitlist-lp
  tip: 02d63cd（origin へ push 済み・本番未反映）
  内容: 新ブランド・事前登録LP・580円記載・913/模試の数値を記載しない構成
```

**2026-07-22 の「Release Build 整合性修正 報告書」で PASS と判定された内容は、すべて未デプロイのブランチに対するものである。**
公開中のサイトには一切反映されていない。本監査の判定は、原則として **LIVE（公開情報）** に対して行う。

証跡（LIVE が旧版であることの確認）:

| 確認項目 | 実測値 |
| --- | --- |
| `https://www.dokugakulink.com/services/takken` 本文 | 「β版」×17 / 「忘れた頃」×2 / 「1,000問」×2 / 「価格未定」×1 |
| 同ページ Hero（スクリーンショット取得済） | 「2026年宅建試験対応 · β版先行受付中」「忘れた頃に、また出題。」「β版先行登録」 |
| Meta Pixel | `connect.facebook.net` 0件（未読込） |
| GA4 / Clarity | `G-0N1KX3ZLKK` 読込あり / `clarity.ms` 読込あり |

---

# 1. P0 — リリース前必須（FAIL）

## P0-1【FAIL・LIVE】問題数が Release Build と不一致

```yaml
LIVE表示: 「全問題（1,000問）」（/services/takken・/landing/takken に各2箇所）
Release Build: 913問
  証跡: 523cc27:takken_app/lib/features/quiz/domain/entities/mock_exam_result.dart:4
        「模試は 913 問プールから動的生成する」
判定: FAIL（誇大表示。実数より約9%多い数値を掲示）
```

## P0-2【FAIL・LIVE】模試回数が Release Build と不一致

```yaml
LIVE表示: 「模試（3回分）」「3 回分 オリジナル模試」
Release Build: 模試の版は 2026_v1 の1版のみ（50問・合格ライン38）
  証跡: 523cc27:.../mock_exam_result.dart:28-33 `kMockExam2026V1`
        「現行版（アプリはこの1つを参照）」
判定: FAIL
```

## P0-3【FAIL・LIVE】料金が Release Build と不一致（価格未表示）

```yaml
LIVE表示:
  - 「現在のβ版は無料です。正式版の価格は、決定次第このサイトで表示します。」
  - 「β版無料」「正式価格は未定」「価格未定 決定次第表示します」
  - 「β版無料 · クレジットカード不要」
Release Build:
  - monthlyPremiumPriceJpy = 580（523cc27:.../app_constants.dart:14）
  - paywall_page.dart:173「月額580円・いつでも解約できます」
判定: FAIL（価格が確定・実装済みであるにもかかわらず「未定」と公開している）
```

## P0-4【FAIL・LIVE】Premium で解放される範囲の説明が Release Build と不一致

```yaml
LIVE表示:
  - 「無料でできること／分析は無料です。✓現在地 ✓苦手分野 ✓理解度 ✓合格可能性」
  - 「私たちは分析機能を課金で隠しません。有料プランで解放されるのは学習量の上限です。」
Release Build（登録30日経過後の実挙動）:
  - 「30日後も、今日の15問と学習履歴は無料でそのまま続けられます」
  - 「分野別演習と模試を利用するには、プレミアムへの登録が必要です」
    証跡: 523cc27:.../onboarding/presentation/widgets/learning_preferences_form.dart:416-431
  - home_page.dart:1294「プレミアムで自由演習を解放」
判定: FAIL
理由: 解放されるのは「学習量の上限」だけではない。分野別演習・模試・自由演習という
      機能そのものが Premium。LIVE の説明はユーザーを誤認させる。
```

## P0-5【FAIL・LIVE】旧ブランドコピーが全ページに残存

```yaml
LIVE残存: 「忘れた頃に、また出題。」「復習を自動化して、合格まで迷わない。」
  - /services/takken, /landing/takken（Hero）
  - /（トップ）×2, /company, /business, /news ×2
正本: Obsidian 50_Website/21_Brand_Guidelines.md（2026-07-04 / メッセージは 2026-07-21 更新・Owner承認）
  正式採用「今日の15問が、／未来を変える。」「独学でも、／迷わない。」
  旧コピーは「使用不可（履歴のみ）」「新規のWeb・広告・SNS・App Store・広報で使用しないこと」
判定: FAIL（ブランドガイドライン違反が公開状態で継続）
```

## P0-6【FAIL・LIVE】事前登録フォームが本番で機能していない（実害あり）

これは表示の不整合ではなく、**公開中サイトの機能障害**である。

```yaml
本番のAPI許可リスト:
  main:src/app/api/register/route.ts:3
  ALLOWED_SOURCES = ["takken_lp","takken_lp_hero","fp_lp","boki_lp","gyosei_lp"]
本番LPが送信する source:
  main:src/app/services/takken/page.tsx:562 → <EmailForm source="services_takken" />
  main:src/app/landing/takken/page.tsx:578  → <EmailForm source="landing_takken" />
帰結: 送信は必ず 400「不正なリクエストです」。1件も登録されない。
実測（データを書き込まない範囲で検証）:
  POST /api/register {"email":""}                          → 400 メールアドレスを入力してください
  POST /api/register {"email":"a@b.co","source":"__invalid__"} → 400 不正なリクエストです
  （API は到達可能・バリデーションは稼働。source 拒否が先に効く経路を確認）
判定: FAIL（P0・最優先）
補足: 修正は未デプロイのブランチ側に存在する（DEC-WEB-2026-07-21 のP0バグ修正）。
      この状態で Meta 広告を出稿すると、広告費が全額無駄になる。
```

## P0-7【FAIL・法務】利用規約 第5条が Release Build と矛盾（アプリからのリンク先）

```yaml
公開中の /terms 第5条（サブスクリプション）:
  「プレミアムプランは、30日間の無料トライアル終了後、自動更新の月額課金へ移行します。」
  「無料トライアル期間中に解約した場合、料金は発生しません。」
Release Build:
  - 「登録から30日間、すべての学習機能を利用できます」
  - 「自動で課金されることはありません」（強調表示）
  - freeTrial（アプリ独自の30日フルアクセス）に StoreKit 契約は存在しない
  - Premium は任意加入（paywall_page.dart:173）
判定: FAIL
重大度: 高。523cc27:.../app_constants.dart は
        termsOfServiceUrl = 'https://www.dokugakulink.com/terms' を参照しており、
        アプリ内・App Store から辿り着く規約が実装と異なる課金モデルを宣言している。
        Obsidian 正本 50_Website/Legal/Terms_of_Service.md（2026-07-05）も同じ記述であり、
        コードだけでなく正本側の是正が必要。
エスカレーション: 法令表示に疑義 → Owner確認（当方では改訂しない）
```

## P0-8【FAIL・法務】特定商取引法ページが Release Build と矛盾

```yaml
公開中の /legal/tokushoho:
  販売価格   「現在β版無料。正式版の価格は決定次第表示します。」
  支払方法   「正式版提供時に表示します。」
  提供時期   「β版は準備が整い次第案内します。」
  キャンセル 「無料β版登録のため料金は発生しません。」
Release Build: 月額580円（税込）／Apple アプリ内課金／自動更新／いつでも解約
判定: FAIL
理由: 有料サービスを提供する状態で、価格・支払方法・解約条件のいずれも表示していない。
      Obsidian 正本 50_Website/Legal/Tokushoho.md も β版前提のまま。
エスカレーション: 特商法第11条の表示事項に関わるため Owner確認・要法務レビュー
```

## P0-9【FAIL・LIVE】お問い合わせページ FAQ が存在しない「無料トライアル解約」を案内

```yaml
公開中の /contact FAQ:
  Q「無料トライアル中に解約できますか？」
  A「はい。無料期間中でもいつでも解約できます。解約後も無料期間が終了するまでは、
     引き続きすべての機能をご利用いただけます。」
Release Build: 30日間の無料期間に StoreKit 契約はなく、解約対象が存在しない。
              自動課金もされない。
判定: FAIL（存在しない手続きを案内している）
```

## P0-10【FAIL・LIVE】未実装の可能性がある機能名を掲載

```yaml
LIVE表示: 「学習ロードマップ」（ナビゲーション05／料金プラン特典 ✓ で計3箇所）
Release Build: `ロードマップ` の語は lib 配下に 0 件
判定: FAIL（同等機能が別名で実装されている可能性は否定できないため、
           機能の実在は UNDETERMINED。ただし「実装済みとして掲載」は現状根拠なし）
必要アクション: Owner による機能名の確定（実在するなら Build 側の名称に合わせる／
               実在しないなら掲載を削除）
```

---

# 2. P1

| # | 判定 | 項目 | 内容 |
| --- | --- | --- | --- |
| P1-1 | FAIL | CTA導線に App Store が存在しない | サイト全体に `apps.apple.com` へのリンクが0件。現フェーズ（事前登録）としては DEC-WEB-2026-07-21 と整合するが、指示書の導線図「LP → App Store → アプリ」は未成立。App Store 公開と同時にリンク追加が必要。 |
| P1-2 | FAIL | トップ・事業内容・お知らせのフェーズ表現 | 「現在β版を準備中」「β版事前登録受付中」（`/`・`/business`）、β版記事4本中2本が最新表示（`/news`）。Release Build は v1.0.0・TestFlight 配布済でありβ版ではない。 |
| P1-3 | FAIL | ニュース記事の内容が現況と不一致 | 「β版事前登録を開始しました」（2026年6月）が最新記事として公開中。リリース準備完了の告知がない。 |
| P1-4 | 要修正 | 実績の断定表現 | `/contact`「毎年の試験範囲・法改正に合わせて、問題や解説を継続的にアップデートしています」＝初回リリース前に継続実績を断定。「対応します」等の将来形が妥当。 |
| P1-5 | PASS | アプリ情報の一致 | `/contact` の「対応OS iOS 13.0 以上」＝ `IPHONEOS_DEPLOYMENT_TARGET = 13.0`、「最新バージョン v1.0.0」＝ `pubspec.yaml version: 1.0.0+5` と一致。「設定→購入を復元」＝ settings_page.dart:218「購入を復元する」と一致。 |

---

# 3. P2

| # | 項目 | 内容 |
| --- | --- | --- |
| P2-1 | sitemap 欠落 | `/services/takken`・`/news`・`/news/[slug]`×4 が sitemap.xml に無い（`src/app/sitemap.ts`）。ヘッダー/フッターの主要導線先が索引対象外。 |
| P2-2 | 重複コンテンツ | `/services/takken` と `/landing/takken` が同一内容。LIVE の `/services/takken` には canonical タグが無く、正規化されていない。 |
| P2-3 | canonical 欠落 | `/news` に canonical 無し。 |
| P2-4 | OGP 欠落 | `/contact` に og:image が無い（openGraph 上書き時に images 未指定）。 |
| P2-5 | ブランド不統一（画像） | トップページのアプリ表現は自作モックアップ（`AppMockup.tsx`・旧UI・「学習後に表示」等のダミー）。LP（ブランチ）は App Store 実スクリーンショット。同一ブランドで2種類のUI表現が混在。 |
| P2-6 | 未使用コード | `src/components/AppStoreCarousel.tsx` はどこからも参照されていない（旧コピーを含む）。 |
| P2-7 | パフォーマンス | Lighthouse / LCP / CLS は当環境で計測不可 → **NOT_COLLECTED**。画像は LP 側が `next/image` + webp + lazy で適切。トップの AppMockup は SVG/DOM 描画。 |

---

# 4. Personal Information Issues（個人情報・ブランド主体）

```yaml
「陣内 智徳」の掲載箇所: 計4箇所（すべて src 内・LIVE も同一）
```

| 箇所 | 内容 | 判定 |
| --- | --- | --- |
| `/legal/tokushoho`（`page.tsx:21`） | 「代表者 陣内 智徳」 | **存置**（特商法第11条の表示義務。指示書の例外「法令上表示義務がある箇所」に該当） |
| `/company` 会社情報（`page.tsx:62`） | 「代表社員 陣内 智徳」 | **存置推奨**（登記情報に基づく表示。例外に該当。法人としての信用情報） |
| `/company` 代表者略歴（`page.tsx:154`） | 氏名＋出身大学＋職歴の個人プロフィール | **要Owner判断**（法令上の義務なし。ブランド主体を法人に寄せるなら整理対象。出身大学は特に個人情報性が高い） |
| `/company` 創業ストーリー署名（`page.tsx:201`） | 「dokugaku link合同会社 代表　陣内 智徳」 | **要Owner判断**（署名を法人名のみにできる） |

```yaml
OGP / 画像ALT / meta description / 構造化データ / 著者情報 / SNS:
  個人名の混入: 0件
  構造化データ（layout.tsx Organization JSON-LD）: 法人名・法人番号・住所・電話のみ。founder 等の個人項目なし → PASS
  SNSリンク: サイト全体に0件（アカウント未開設のため導線なし）
```

---

# 5. Broken Links / リンク監査

すべて実測（2026-07-23・`curl` / 本番ドメイン）。**404・リンク切れ 0件**。

```yaml
ページ（12）: / /company /business /services/takken /landing/takken /contact
             /privacy /terms /legal/tokushoho /news /sitemap.xml /robots.txt
  → すべて 200
ニュース詳細（4）: beta-registration-open / company-established /
                 corporate-site-launch / takken-app-development-start
  → すべて 200
静的アセット（8）: favicon.ico, favicon.svg, favicon-ukareru.ico, favicon-ukareru.svg,
                 apple-touch-icon.png, apple-touch-icon-ukareru.png,
                 og/company-og.png, ogp.png → すべて 200
OGP動的生成（2）: /services/takken/opengraph-image, /landing/takken/opengraph-image
  → 200 image/png
ドメイン正規化: https://dokugakulink.com/ → 308 → https://www.dokugakulink.com/ （正常）
メール/電話: mailto:info@dokugakulink.com, mailto:support@dokugakulink.com,
           tel:06-7652-1304（表記ゆれなし・全ページ一致）
App Store リンク: 0件（P1-1）
SNSリンク: 0件
```

`support@dokugakulink.com` は Release Build の `AppConstants.supportEmail` と一致（PASS）。
`privacyPolicyUrl` = `/privacy`、`termsOfServiceUrl` = `/terms` はいずれも 200（到達性 PASS。**内容は P0-7 で FAIL**）。

---

# 6. UNDETERMINED（判定情報不足・要Owner確認）

| # | 項目 | 不足している情報 |
| --- | --- | --- |
| U-1 | プライバシーポリシーの十分性 | 公開中の `/privacy` は GA4（G-0N1KX3ZLKK）・Microsoft Clarity を実際に読み込んでいるが、本文の記載は「Cookie等の技術情報」のみで、第三者ツール名・利用目的・オプトアウト手段の記載がない。ブランチでは Meta Pixel も追加される。**要法務レビュー**（外部送信・広告目的の取扱いの記載要否）。 |
| U-2 | プライバシーポリシーの制定日 | 「制定日：2025年1月1日」だが、会社設立は 2025年10月27日（`/company`）。設立前の日付が制定日として公開されている。誤記か、別主体での制定か不明。 |
| U-3 | 「学習ロードマップ」機能の実在 | P0-10 参照。Release Build に同名の機能・文言が存在しない。 |

---

# 7. Evidence

```yaml
収集日時: 2026-07-23（JST）

コード正本:
  takken-app @ 523cc27（Release Build コミット）から直接取得:
    - takken_app/pubspec.yaml : version 1.0.0+5
    - lib/core/constants/app_constants.dart : trialPeriodDays=30 / monthlyPremiumPriceJpy=580
                                              / privacyPolicyUrl / termsOfServiceUrl / supportEmail
    - lib/features/quiz/domain/entities/mock_exam_result.dart : 913問プール / kMockExam2026V1（1版・50問・38合格）
    - lib/features/onboarding/presentation/widgets/learning_preferences_form.dart : 無料範囲4項目
    - lib/features/subscription/presentation/pages/paywall_page.dart:173,199 : 580円・以前の購入を復元
    - lib/features/settings/presentation/pages/settings_page.dart:218 : 購入を復元する
    - ios/Runner.xcodeproj/project.pbxproj : IPHONEOS_DEPLOYMENT_TARGET = 13.0

公開情報:
  https://www.dokugakulink.com 配下 12ページ + ニュース4件 + アセット8件を HTTP 実測・本文抽出
  スクリーンショット: /services/takken Hero（旧ブランド表示を撮影・取得済）
  HTMLメタ（title / description / canonical / og:*）を全ページ抽出

リポジトリ:
  dokugakulink-site
    main @ 00400f4（= 本番稼働中）
    feat/ukareru-waitlist-lp @ 02d63cd（origin push済・本番未反映）
  ビルド検証: npm run build → PASS（Next.js 16.2.7 / 20ルート / TypeScript エラー0）

Obsidian 正本:
  50_Website/21_Brand_Guidelines.md（旧コピー使用不可の明記）
  50_Website/01_Decision_Log.md（DEC-WEB-2026-07-21 / DEC-WEB-2026-07-22）
  50_Website/Legal/{Terms_of_Service, Tokushoho, Privacy_Policy}.md

NOT_COLLECTED（当環境で取得不可・Owner対応が必要）:
  - 事前登録フォームのエンドツーエンド送信確認
      理由: 実送信は待機リストへの実データ書き込み＋自動返信メール送信を伴うため、
            Owner承認なしには実行しない。
      必要アクション: 本番 env（GAS_WEBHOOK_URL / NEXT_PUBLIC_META_PIXEL_ID）の設定確認と、
                     Owner立会いでのテスト送信1件。
  - Lighthouse（LCP / CLS / パフォーマンススコア）
  - App Store Connect の実表示（本監査の Not Responsible 範囲）
```

---

# 8. Recommendations（推奨順序・すべて Owner 承認後に実施）

```yaml
最優先（公開中の実害を止める）:
  R1: 事前登録フォームの復旧（P0-6）
      → feat/ukareru-waitlist-lp の本番反映、または main への allowlist 修正のみ先行適用。
        本番 env（GAS_WEBHOOK_URL）の設定確認とセット。
      → これが未解決の間は Meta 広告を出稿しない。

  R2: 法務3ページの是正（P0-7 / P0-8）
      → /terms 第5条と /legal/tokushoho を Release Build（30日全機能無料・自動課金なし・
        Premium は任意・月額580円・Apple 課金・いつでも解約）に一致させる。
      → Obsidian Legal 正本も同時改訂。要法務レビュー。
      → アプリからのリンク先であるため、App Store 審査前に完了させることを推奨。

次点（公開情報の事実整合）:
  R3: LP の本番反映（P0-1〜P0-5 を一括で解消）
      → 未デプロイブランチには 1,000問・模試3回分・価格未定・旧コピーのいずれも無い。
        デプロイ自体が最大の是正になる。
  R4: /contact FAQ の「無料トライアル解約」を実装に合わせて書き換え（P0-9）
  R5: 「学習ロードマップ」の実在確認と表記統一（P0-10 / U-3）

その後:
  R6: トップ・事業内容・お知らせのフェーズ表現をβ版から正式リリース準備へ更新（P1-2 / P1-3）
  R7: App Store 公開と同時に全ページへ App Store 導線を追加（P1-1）
  R8: プライバシーポリシーの第三者ツール記載と制定日の是正（U-1 / U-2・要法務）
  R9: 代表者略歴・創業ストーリー署名の個人情報整理（Owner判断）
  R10: sitemap 追加・canonical 付与・og:image 補完・未使用コンポーネント削除（P2）
```

---

# 9. Release Readiness

```yaml
Corporate Website: NOT READY
Evidence:          COMPLETE（NOT_COLLECTED 3件を明示）
Overall:           NOT READY

READY 化の必須条件:
  1. P0-6 事前登録フォームの復旧（実測で1件登録できること）
  2. P0-7 / P0-8 法務2ページの Release Build 一致（要法務レビュー）
  3. P0-1〜P0-5 の解消（= 新LPの本番反映）
  4. P0-9 / P0-10 の是正
  5. 上記反映後の再監査（LIVE に対する再実測）
```

---

# 10. 本監査で行っていないこと

```yaml
実施しなかった操作:
  - 公開内容の変更（Owner承認がないため、差異の報告のみ）
  - Flutterコード / Release Build / RevenueCat / App Store Connect への一切の変更
  - 本番へのデプロイ
  - 事前登録フォームへの実送信（実データ書き込みを伴うため）
  - Obsidian 正本の改訂（Terms / Tokushoho の是正は Owner 判断事項）

推測による PASS 判定: なし。根拠を提示できない項目はすべて UNDETERMINED または NOT_COLLECTED とした。
```
