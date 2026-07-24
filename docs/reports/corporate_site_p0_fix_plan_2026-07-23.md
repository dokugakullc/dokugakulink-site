# Corporate Website P0修正 — 事実確認 & 実装計画（実装前・Owner承認待ち）

- 作成日: 2026-07-23
- 担当: Website Implementation Manager (Claude Code)
- 依頼元: Owner
- 正本: Release Build `dokugakullc/takken-app` @ `523cc27` / v1.0.0 (5)
- 状態: **事実確認のみ。コードは未変更。本計画の承認後に実装へ進む。**

---

# 1. デプロイ構成（事実）

Vercel の Git 連携（GitHub 自動デプロイ）。GitHub Actions は無し（`.github/workflows` 無し・`vercel.json` 無し）。

```yaml
Vercelプロジェクト: dokugakulink-site (prj_a0ksRrD1DZHfr9dsWDv9S2jRJuaK)
Team: dokugaku-link-ltd-s-projects (team_WhEHWXLIji68tHNqaFAp5I82)
Framework: Next.js / Node 24.x

Productionブランチ: main
  → target:"production" のデプロイは全て githubCommitRef:"main"
  現在のProduction: commit 00400f4（= main tip）READY
  本番ドメイン: www.dokugakulink.com（apex dokugakulink.com は 308→www）

Previewデプロイ: feat/ukareru-waitlist-lp（target:null）
  最新Preview: commit 02d63cd（新LP・是正済）
  PreviewURL: dokugakulink-site-git-feat-8edbc1-....vercel.app

本番反映の手順（2通り）:
  A) feat/ukareru-waitlist-lp を main へマージ → main push
     → Vercel が自動で Production ビルド＆反映（githubDeployment:1）
  B) 対象PreviewデプロイをVercel上で "Promote to Production"

いずれも「本番反映」＝ Owner承認が必要な操作（CLAUDE.md）。当方は無断実行しない。
ロールバック可能: 直近の production 2件（00400f4 / 4ae99fd）が isRollbackCandidate:true
```

## ブランチ差分（main ← feat/ukareru-waitlist-lp）

```yaml
コミット: 6件 ahead / 0件 behind（コンフリクトなし）
  f6734c1 register allowlist修正 + UTM/Meta Pixel
  8f34474 LP再構築（新ブランド・事前登録LP）
  0c25ecd/73474fa/02d63cd 実装/監査ドキュメント
  ed568d7 無料期間コピーをRelease Build一致（Freeze例外）

変更ファイル: LP関連のみ（services/takken・landing/takken・UkareruLP・EmailForm・
  register route・Header・Meta Pixel・track/utm・LPスクショ6枚・AGENTS.md・reports）
```

### 最重要事実
**このブランチは LP ルートしか触っていない。** 旧コピー（β版・忘れた頃・1,000問・模試3回）が残る
**コーポレート系ページ（トップ・事業内容・会社概要・お知らせ）は main / branch の両方で未修正のまま。**
→ ブランチを本番反映すれば **P0-1/P0-2/P0-3/P0-4 の“LPルート分”は解消**するが、
  **コーポレート系ページの是正は本計画で新規に行う必要がある。**

---

# 2. 修正対象ファイル一覧

## A. 既にブランチで是正済み（＝本番反映だけで解消。追加編集不要）

| ファイル | 内容 | 監査項目 |
| --- | --- | --- |
| `src/app/api/register/route.ts` | `ALLOWED_SOURCES` に `services_takken`/`landing_takken` 追加済 | **P0-2** |
| `src/components/UkareruLP.tsx` | 新ブランド・913/模試/価格を数値保証しない構成・FAQに¥580・自動課金なし | P0-1/P0-3/P0-4 |
| `src/app/services/takken/page.tsx`・`landing/takken/page.tsx` | UkareruLP描画・新OGP・canonical維持 | P0-1/P0-3 |
| `src/components/EmailForm.tsx` | 同意必須チェックボックス・aria・UTM保持 | P0-2付随 |

> 検証済み（当環境・データ書込みなし）: 本番APIは到達可能・バリデーション稼働。
> `services_takken` 送信が現行mainで400になる原因＝allowlist欠落を実測で確認済。

## B. 本計画で新規編集が必要（コーポレート系・旧コピー残存）

| # | ファイル | 修正理由 | 監査項目 |
| --- | --- | --- | --- |
| B-1 | `src/app/page.tsx`（トップ） | 「現在β版を準備中」「β版事前登録受付中」→ フェーズ表現統一。「忘れた頃に、また出題。」「復習を自動化して…」→ 新ブランドへ。「忘れた頃に、また出題する仕組み」（Now Building節）も同様 | **P0-3/P0-5**・P1-2 |
| B-2 | `src/app/business/page.tsx` | 「現在β版を準備中」「β版事前登録受付中」→ フェーズ表現統一（ウカレル紹介カード） | P0-3・P1-2 |
| B-3 | `src/app/company/page.tsx` | 「忘れた頃に、また出題する仕組み」（開発中プロジェクト節）→ 新ブランド表現。※会社情報・代表社員は法令/登記のため不変（§個人情報参照） | P0-3 |
| B-4 | `src/lib/news.ts` | β版中心の記事本文（`beta-registration-open`「β版事前登録を開始」「β版は無料」/`takken-app-development-start`「忘れた頃に、また出題する」）を、ブランド準拠の開発進捗表現へ。**履歴記事のため慎重に：既存日付は保持し文言のみ是正** | P0-3・P1-3 |
| B-5 | `src/app/news/page.tsx` | 一覧下部「開発中サービス」カードの「忘れた頃に、また出題する」「現在β版を準備中」 | P0-3 |
| B-6 | `src/app/sitemap.ts` | `/services/takken`・`/news`・ニュース詳細4件が索引外（主要導線先） | P2-1（P0反映と同時が効率的） |

## C. 判断が必要（Owner確認後に着手・下記 §5 の確認事項）

| # | ファイル/対象 | 論点 |
| --- | --- | --- |
| C-1 | App Store 導線（P0-5） | **App未公開（apps.apple.com無し）。今リンクを足すと必ずリンク切れ。** 事前登録フェーズの正しいCTAは「リリース通知を受け取る」で既に成立。→ App Store公開まで**保留**が妥当。Owner判断。 |
| C-2 | `src/app/company/page.tsx` 代表者略歴・創業ストーリー署名 | 「陣内 智徳」＋出身大学＋個人職歴。法令義務なし。整理範囲をOwner確認（§個人情報）。 |
| C-3 | `src/components/AppMockup.tsx` / `AppStoreCarousel.tsx` | トップの自作モックUI（旧ブランド調・「12/20問」「模試→弱点補強」等）。差し替えは**デザイン変更＝今回禁止**。AppStoreCarouselは未使用＝削除候補（P2-6）だがコード整理はP2。 |

## D. 法務ページ（今回**編集しない**・修正案のみ §3）

| ファイル | 監査項目 |
| --- | --- |
| `src/app/terms/page.tsx` 第5条 | **P0-7** |
| `src/app/legal/tokushoho/page.tsx` | **P0-8** |
| `src/app/privacy/page.tsx` | U-1（第三者ツール記載）・U-2（制定日2025-01-01が設立前） |

---

# 3. 法務ページ 修正案（提示のみ・未適用・要法務レビュー）

> Release Build 正本: 30日間全機能無料 → 以後 今日の15問＋履歴は無料継続 → **自動課金なし**（freeTrialにStoreKit契約なし）→ Premium¥580(税込)はApple課金・自動更新・いつでも解約の**任意加入**。

### 3-1. `/terms` 第5条（サブスクリプション）修正案
現行「30日間の無料トライアル終了後、自動更新の月額課金へ移行します」は自動転換トライアルを意味し、Release Build と矛盾。案：

```text
第5条（料金・サブスクリプション）
1. 登録から30日間は、すべての機能を無料でご利用いただけます。
2. 30日経過後も、「今日の15問」および学習履歴の閲覧は無料でご利用いただけます。
   30日経過による自動課金は行われません。
3. 分野別演習・模試などの機能をご利用の場合は、任意でプレミアムプラン
   （月額580円・税込）にご加入いただけます。プレミアムプランは自動更新型の
   サブスクリプションで、料金はApple IDに請求されます。
4. 自動更新は、期間終了の24時間前までにオフにしない限り継続します。
   解約はApple IDのサブスクリプション設定からいつでも行えます。
```

### 3-2. `/legal/tokushoho` 修正案（特商法第11条・要法務）
```yaml
販売価格:   プレミアムプラン 月額580円（税込）。登録から30日間および
            30日経過後の「今日の15問」「学習履歴」は無料。
支払方法:   Apple のアプリ内課金（App Store）
提供時期:   購入手続き完了後ただちに利用可能
キャンセル: 自動更新はApple IDの設定からいつでも解約可能。
            解約後も当該課金期間の終了まで利用可能。無料期間中の自動課金は発生しません。
```
※「β版無料／価格未定」表記は全撤去。

### 3-3. `/privacy` 修正案（U-1/U-2）
- U-1: 第3条または新項として、Google Analytics 4・Microsoft Clarity・（本番反映時）Meta Pixel の利用と目的・オプトアウト手段を明記。**要法務**。
- U-2: 「制定日：2025年1月1日」は設立（2025-10-27）より前。**要事実確認**（誤記なら設立日以降へ、実在の別制定なら根拠確認）。

> Obsidian 正本 `50_Website/Legal/{Terms_of_Service,Tokushoho,Privacy_Policy}.md` も同内容で要改訂。コード反映時に同期する（別途Owner承認）。

---

# 4. 実装計画

## 4-1. ブランチ戦略
既存の `feat/ukareru-waitlist-lp` に **§2-B の是正コミットを追加**し、この1本を main へ集約する。
（別ブランチを切らない理由：LP是正とコーポレート是正を分けると本番反映が2回に割れ、
「LPは新・コーポレートは旧」の中間状態が本番に出るため。1本化で中間状態を作らない。）
※法務ページ(§2-D)とC系(App Store/個人情報)は**このブランチに含めない**（承認単位を分離）。

## 4-2. 想定コミット単位
```yaml
commit-1  fix(brand): トップページのβ版表現・旧コピーを新ブランドへ（B-1）
commit-2  fix(brand): 事業内容・会社概要の旧コピー是正（B-2, B-3）
commit-3  fix(news): お知らせ記事のβ版/旧コピーを是正（B-4, B-5）
commit-4  chore(seo): sitemap に services/takken・news を追加（B-6）
（C系・法務は承認後に別コミット）
```

## 4-3. 各コミット後の検証（報告に添付）
```yaml
- npm run lint
- npm run build（TypeScript 0 error / 全ルート生成）
- 変更ページの表示・リンク・GA4/Clarity/Metadata の目視（Preview or ローカル）
- Release Build 正本との文言一致チェック（913/模試1版/¥580/自動課金なし/新ブランド）
```

## 4-4. デプロイ手順（Owner承認後）
```yaml
Step1: 上記コミットを feat/ukareru-waitlist-lp に積む（ローカル）
Step2: git push origin feat/ukareru-waitlist-lp
       → Vercel が Preview を自動生成
Step3: Preview URL で Owner が全ページ最終確認（LIVEと同条件）
Step4: 【Owner承認 = 本番反映GO】
       PR: feat/ukareru-waitlist-lp → main を作成しマージ、または
       main へマージ後 push → Vercel が Production 自動デプロイ
Step5: 本番(www)で再実測（P0全項目）→ Corporate Website Manager 再監査へ提出
```

## 4-5. 本番反映タイミングと前提（Owner対応の外部要因）
```yaml
反映前に確認すべき本番env（当方は値を扱わない）:
  - GAS_WEBHOOK_URL（未設定だと登録が500＝フォーム復旧が成立しない）
  - NEXT_PUBLIC_META_PIXEL_ID（未発行なら空でno-op・広告計測は別途）
反映後の必須確認:
  - 事前登録フォームの実送信テスト1件（実データ書込みを伴うためOwner立会い）
    → HTTP200 かつ Sheets/GAS に登録される事を確認して初めて P0-2 完了
```

## 4-6. 修正順序（依存関係）
```text
①（承認）§2-B のコード是正 → Preview → 本番反映  ← P0-1〜P0-4 と P1-2/P1-3 を解消
②（承認）本番envとフォーム実送信テスト            ← P0-2 の完了確認
③（別承認）法務3ページ（§3の案を確定・要法務）    ← P0-7 / P0-8 / U-1 / U-2
④（別承認）App Store導線（App公開後）・個人情報整理 ← P0-5(保留判断) / C-2
⑤ Corporate Website Manager 再監査
```

---

# 5. Owner確認事項（実装前に回答が必要）

```yaml
Q1【App Store導線 P0-5】:
  App Store未公開のためリンクを追加できない（追加すると必ずリンク切れ）。
  現フェーズのCTA「リリース通知を受け取る」は事前登録として成立している。
  → App Store公開まで導線追加は保留でよいか？（推奨：保留）

Q2【個人情報 C-2】:
  会社概要の「代表者略歴」（氏名＋出身大学＋個人職歴）と創業ストーリー署名について、
  (a) 全て残す / (b) 出身大学など個人特定情報のみ削減 / (c) 略歴は法人視点へ要約し署名は法人名のみ
  のどれにするか。※特商法・会社情報の「陣内 智徳」は法令/登記のため不変。

Q3【お知らせ記事 B-4】:
  β版記事（2026年6月）は履歴。文言のみブランド準拠に是正する方針でよいか、
  それとも「リリース準備」新記事の追加も行うか。

Q4【本番env】:
  GAS_WEBHOOK_URL / NEXT_PUBLIC_META_PIXEL_ID の本番設定状況（フォーム復旧の前提）。

Q5【法務 §3】:
  修正案の方向性で法務レビューへ回してよいか。Obsidian正本も同時改訂してよいか。
```

---

# 6. 本計画で行わないこと（禁止事項の遵守）

```yaml
- Flutterコード / Release Build / RevenueCat / App Store Connect への変更: しない
- UIリニューアル・デザイン変更: しない（AppMockup差し替え等はコピー修正の範囲外）
- 法務3ページの本文編集: しない（§3は案のみ）
- 本番反映・main push・env変更: Owner承認なしに実行しない
- PASS判定: 行わない（Corporate Website Manager の専権）
```
