# Corporate Website P0修正 — Implementation Report

- 実施日: 2026-07-23
- 担当: Website Implementation Manager (Claude Code)
- 依頼元: Owner
- 正本: Release Build `dokugakullc/takken-app` @ `523cc27` / v1.0.0 (5)
- ブランチ: `feat/ukareru-waitlist-lp`（Owner承認済の実装計画に基づく）
- **状態: 実装＋Preview 完了。Production 未反映（Owner承認待ち）。PASS判定は行わない（Corporate Website Manager の専権）。**

---

# 1. サマリ

Owner承認済の計画（`corporate_site_p0_fix_plan_2026-07-23.md`）に沿って、
コーポレート系ページの旧コピー（β版・忘れた頃・旧タグライン）と個人情報を是正した。
**すべてコピー修正のみ。デザイン・構造・レイアウトの変更なし。**

LP本体（P0-1/P0-2/P0-3/P0-4 の“LPルート分”）は既存ブランチで是正済みのため、
本実装は監査計画 §2-B（コーポレート系）＋ §2-C（Q2個人情報）＋ P2-1（sitemap）を対象とした。

法務3ページ（terms / tokushoho / privacy）は**未編集**（修正案のみ・要法務・§4）。

---

# 2. Changed Files（今回の実装分）

| ファイル | 変更内容 | 監査項目 |
| --- | --- | --- |
| `src/app/page.tsx` | β版表現→リリース準備/事前登録、旧タグライン→新ブランド、Now Building節の旧コピー是正 | P0-3/P0-5・P1-2 |
| `src/app/business/page.tsx` | ウカレル紹介カードのβ版表現を是正 | P0-3・P1-2 |
| `src/app/company/page.tsx` | 開発中プロジェクトの旧コピー是正／代表者略歴を法人視点へ要約（個人名・出身大学を撤去）／創業ストーリー署名を法人名のみに | P0-3・個人情報(Q2-c) |
| `src/lib/news.ts` | β版記事の文言のみ是正（日付は保持）／旧タグライン撤去 | P0-3・P1-3 |
| `src/app/news/page.tsx` | 一覧下部「開発中サービス」カードのβ版・旧コピー是正 | P0-3 |
| `src/app/sitemap.ts` | services/takken・news・ニュース詳細4件を追加 | P2-1 |

## 変更前後（主要コピー）
```yaml
トップ:
  "現在β版を準備中" → "リリース準備中"
  "β版事前登録受付中" → "事前登録受付中"
  "「忘れた頃に、また出題。」" → "「今日の15問が、未来を変える。」"
  "復習を自動化して、合格まで迷わない。" → "独学でも、迷わない。"
会社概要(個人情報 Q2-c):
  略歴見出し "Profile / 代表者略歴" → "Background / 私たちの背景"
  "代表社員　陣内 智徳"（略歴本文の氏名見出し）→ "創業の背景"
  "大阪経済法科大学卒業。" → 撤去（法人視点の設立背景へ要約）
  署名 "dokugaku link合同会社 代表　陣内 智徳" → "dokugaku link合同会社"
  ※会社情報テーブルの "代表社員 陣内 智徳" は登記情報のため不変
お知らせ:
  "β版事前登録を開始 / β版は無料" → 事前登録・リリース案内へ（tag "β版募集"→"事前登録受付中"）
  "「忘れた頃に、また出題する」仕組み" → 間隔反復学習の記述へ
```

## 今回“触っていない”もの（意図的）
```yaml
LP本体（UkareruLP.tsx / services・landing/takken）: 既にブランチで是正済み・変更不要
api/register の ALLOWED_SOURCES: 既にブランチで修正済み（services_takken/landing_takken 追加）
法務3ページ: 未編集（§4の修正案のみ）
AppMockup.tsx（トップの自作モックUI）: デザイン変更禁止のため不変
AppStoreCarousel.tsx（未使用・未import＝本番バンドル外）: P2-6として未対応
```

---

# 3. Commit / Branch / PR / URL

```yaml
Branch: feat/ukareru-waitlist-lp
Commits(今回・新しい順):
  e55497a docs(audit): コーポレートサイト監査＋P0修正計画（2026-07-23）
  70e9b81 chore(seo): sitemap に services/takken・news・ニュース詳細を追加
  bb1f5a0 fix(news): お知らせのβ版・旧コピーを是正（履歴は保持）
  451390f fix(brand): 事業内容・会社概要の旧コピー是正と個人情報整理
  76bb843 fix(brand): トップページのβ版表現・旧コピーを新ブランドへ
Push: origin/feat/ukareru-waitlist-lp（済）
Pull Request: 未作成（本番反映＝main への PR/マージは Owner承認後）
Preview URL（固定ブランチエイリアス）:
  https://dokugakulink-site-git-feat-8edbc1-dokugaku-link-ltd-s-projects.vercel.app
  対象デプロイ: dpl_Cf92Cf7Cq23tprUEVVxHp19EoMov（commit e55497a・target:null=Preview）
Production URL: https://www.dokugakulink.com （未反映・現行=main 00400f4）
```

---

# 4. 法務ページ 修正案（未適用・要法務レビュー）

計画書 `corporate_site_p0_fix_plan_2026-07-23.md` §3 を正とする。要旨：
- `/terms` 第5条: 自動転換トライアル文言を撤去し、Release Build（30日全機能無料→以後
  今日の15問+履歴は無料継続→自動課金なし→Premium¥580は任意加入/Apple課金/いつでも解約）に一致。
- `/legal/tokushoho`: β版無料/価格未定を撤去し、月額580円(税込)/Apple課金/解約条件を表示。
- `/privacy`: GA4・Clarity・(反映時)Meta Pixel の記載追加、制定日(2025-01-01=設立前)の是正。
- Obsidian正本 `50_Website/Legal/*` も同時改訂（Owner承認後）。

---

# 5. Build / 検証結果

```yaml
tsc --noEmit: PASS（0 error）
npm run lint: PASS（eslint 0）
npm run build: PASS（Next.js 16.2.7 / 22ルート生成 / exit 0）
sitemap.xml: services/takken・landing/takken・news・ニュース詳細4件を含むことをビルドで確認
旧コピー全消去(コーポレート系): grep で β版/忘れた頃(タグライン)/復習を自動化 = 0件
  （legal/tokushoho の β版のみ残置＝P0-8・修正案対応。business の「忘れた頃に再確認」は
    一般語の課題説明でブランドタグラインではないため対象外）
個人情報: 会社概要から個人名・出身大学を撤去、署名を法人名のみに。
  「陣内 智徳」は会社情報(代表社員)＝登記情報のみに存置。
```

## 本番env（名前のみ確認・値は非取得）
```yaml
GAS_WEBHOOK_URL: Production 設定済 ✅（フォーム復旧の前提を満たす）
NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_CLARITY_ID: Production 設定済 ✅
RESEND_API_KEY / CONTACT_WEBHOOK_URL: 設定済 ✅
NEXT_PUBLIC_META_PIXEL_ID: 未設定（全環境）⚠️ MetaPixelはno-op（エラーなし・広告計測は不発）
注意: GAS_WEBHOOK_URL は Production のみ（Preview 無し）。
      → 事前登録フォームの実送信テストは【本番反映後の Production】で行う必要がある。
```

---

# 6. フォーム送信結果（P0-2 完了判定に必要）

```yaml
コード面: ALLOWED_SOURCES に services_takken/landing_takken 追加済（ブランチ）。
静的検証（データ書込みなし・本番API）:
  POST /api/register {"email":""}                          → 400（バリデーション稼働）
  POST /api/register {"email":"a@b.co","source":"__invalid__"} → 400（source拒否）
E2E実送信テスト: 未実施。
  理由1: 実データ書込み＋（LPは）計測発火を伴うため、Owner立会いで実施すべき。
  理由2: GAS_WEBHOOK_URL が Preview 未設定のため、Preview では 500。本番反映後にProductionで実施。
完了条件（未達）: Production で source=services_takken/landing_takken の実送信が
  HTTP200 かつ Sheets/GAS に登録される、を確認して初めて P0-2 完了。
```

---

# 7. 未対応事項（承認単位を分けたもの）

```yaml
P0-2完了確認: 本番反映後の実送信テスト（Owner立会い）
P0-5 App Store導線: Owner判断で「App Store公開まで保留」。公開後に全サイトへ導線追加。
P0-7/P0-8 法務(terms/tokushoho): 修正案のみ。要法務レビュー→Owner承認→適用。
U-1/U-2 privacy: 第三者ツール記載・制定日。要法務。
P2-2 canonical(services/landing重複)/P2-4 og:image(contact)/P2-6 未使用AppStoreCarousel削除:
  今回スコープ外（P2）。別途対応可。
NEXT_PUBLIC_META_PIXEL_ID: Owner が Pixel 発行・Vercel設定（広告計測用）。
Obsidian正本の同期: Brand/Legal は本番反映・法務確定時に更新。
```

---

# 8. 次のステップ（Owner承認事項）

```yaml
1. Preview URL で全ページを目視確認（Owner）
2. 【本番反映GO】の承認 → main へ反映（PR作成→マージ、または main へマージ&push）
   ※GitHub連携により Vercel が Production を自動デプロイ
3. 本番(www)で再実測（P0全項目）＋ 事前登録フォーム実送信テスト（Owner立会い）
4. Corporate Website Manager による再監査 → PASS判定

中間状態の回避: LP是正とコーポレート是正を1ブランチに集約済み。
  本番反映は1回で「LP新・コーポレート新」が同時に載る（中間状態を作らない）。
```
