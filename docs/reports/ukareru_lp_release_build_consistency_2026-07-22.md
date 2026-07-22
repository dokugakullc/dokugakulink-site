# ウカレル LP — Release Build 整合性修正 報告書（Freeze例外）

- 作成日: 2026-07-22
- 担当: Website Implementation Manager (Claude Code)
- ブランチ: `feat/ukareru-waitlist-lp` / tip `ed568d7b630fbcb20af44c01d0093c871be4658c`
- 種別: Code Freeze 例外（コピー修正のみ）

---

## 1. サマリ

Product/Marketing監査の指摘は、**旧・本番サイト（未デプロイのmain）** に対するものと判明。
今回凍結したLP再構築ブランチでは大半が既に解消済みで、**実修正は「無料期間の明記（Build一致）」1点**。

指示書P0の無料期間文（自動転換トライアル前提）は **Release Build と矛盾**するため、
Owner確認のうえ **Release Build の実文言に一致**させた（下記2.3）。

---

## 2. 修正対象一覧

### 2.1 Premium料金（P0）— 既に解消済み
- 旧・本番LP: 「価格未定」「β版無料」→ 凍結ブランチでは **FAQに「月額580円（税込）」記載済**。追加修正不要。

### 2.2 模試回数 / 問題数（P1）— 該当なし
- 旧・本番LP: 「全問題（1,000問）」「模試（3回分）」→ 凍結ブランチの新LPは **これらを一切記載していない**（数値を保証しない構成）。よって「模試1回」「約913問」への誤記リスクなし。

### 2.3 無料期間（P0）— 今回修正（コピーのみ）
`src/components/UkareruLP.tsx` 料金FAQ回答文。

**修正前**
> 登録から30日間は、すべての機能を無料で体験できます。その後も「今日の15問」と学習履歴の閲覧は無料で続けられます。より深い学習支援を受けられるプレミアムプランは、月額580円（税込）を予定しています（正式リリース時に価格が変更となる場合があります）。

**修正後**
> 登録から30日間は、すべての機能を無料で利用できます。30日を過ぎても、今日の15問と学習履歴の閲覧は無料でそのまま続けられ、**自動で課金されることはありません**。より深い学習支援が必要な場合のみ、プレミアムプラン（月額580円・税込／自動更新・いつでも解約可能）に任意でご加入いただけます（正式リリース時に価格が変更となる場合があります）。

### 2.4 コピー統一（Marketing）— 既に一致
- Hero:「今日の15問が、未来を変える。／独学でも、迷わない。」で統一済（OGP含む）。

### 2.5 導線（Marketing）— 既に適合
- Meta広告 → /landing/takken → 事前登録 → リリース通知、の流れ。**App Store直リンクなし**（追加していない）。

---

## 3. Release Build との差異（LP本体）

```yaml
Release Build 差異（LP本文）: 0件
根拠:
  - 無料期間: takken_app/lib/features/onboarding/.../learning_preferences_form.dart:416-431
      「登録から30日間、すべての学習機能を利用できます」
      「30日後も、今日の15問と学習履歴は無料でそのまま続けられます」
      「自動で課金されることはありません」
    → LP FAQ文言と一致。
  - StoreKit契約: account_security_page.dart:105
      「freeTrial（アプリ独自の30日フルアクセス）にはStoreKit契約がない」
    → LPは自動課金・解約前提の表現をしない（一致）。
  - Premium価格/解約: paywall_page.dart:173「月額580円・いつでも解約できます」
    + app_constants.dart:14 monthlyPremiumPriceJpy = 580
    → LP「月額580円・いつでも解約可能」と一致。
  - Premium機能: 苦手分析 / 合格可能性 / 通知（Obsidian pricing・Decision Log）
    → LPは未実装機能を掲載していない。
```

### ⚠ 指示書テキストとの相違（採用しなかった文言）
指示書P0の「30日経過後に**課金対象**となります／無料期間中に**解約**した場合は無課金」は
**自動転換トライアル**を意味し、Release Build（自動課金なし・freeTrialにStoreKit契約なし）と矛盾。
Owner確認により **Build側を正本として不採用**（DEC-WEB-2026-07-22）。

---

## 4. UI / スクリーンショット（P0）

```yaml
使用素材: App Store提出用スクショ 01_home〜06_result（実画面・デザインイメージではない）
出所: takken-app/takken_app/docs/marketing/app_store/screenshots/ios/
LP=App Store 一致: satisfied（App Storeに載る実画面と同一素材）
最新Release Buildとの一致: UNVERIFIED（当環境でBuildを実行できないため）
必要アクション（Owner）: 最新Release BuildのUIが上記スクショと異なる場合は最新版へ差し替え。
                       異なる場合はブランチに素材を追加いただければ反映する。
```

---

## 5. 完了確認

```yaml
価格: PASS            # 月額580円（税込）記載
模試: PASS            # 誤記なし（回数を記載していない）
問題数: PASS          # 数値を保証しない（記載なし）
UI: CONDITIONAL       # 実画面素材で一致。最新Buildとの一致はOwner確認要（4章）
コピー: PASS          # 今日の15問が、未来を変える。／独学でも、迷わない。
Premium説明: PASS     # 未実装機能なし・Buildと一致
Release Buildとの差異（LP本文）: 0件
Marketingとの差異（LP本文）: 0件
```

---

## 6. LP外で検出した旧コピー残存（Freeze範囲外・要Owner判断）

Meta広告導線（→/landing/takken）には非該当だが、Marketingのコピー統一観点で別タスク化を推奨。
**本報告では未修正**（LP整合のFreeze例外の範囲を超えるため）。

- `src/app/page.tsx`（トップ）: 「現在β版を準備中」「β版事前登録受付中」「忘れた頃に、また出題。」
- `src/app/business/page.tsx` / `src/app/company/page.tsx`: 「忘れた頃に、また出題」「β版」
- `src/app/news/page.tsx` / `src/lib/news.ts`: β版・旧コピーの記事
- **`src/app/legal/tokushoho/page.tsx`**: 「現在β版無料。正式版の価格は決定次第」「無料β版登録のため料金は発生しません」→ **特定商取引法ページ・要法務確認**
- 未使用コンポーネント: `AppMockup.tsx`（模試表記）/ `AppStoreCarousel.tsx`（旧コピー）

---

## 7. 変更証跡

```yaml
Branch: feat/ukareru-waitlist-lp
Commit(today): ed568d7 fix(lp): align free-period copy to Release Build (freeze exception)
Prev tip: 73474fa
Lint: PASS
Build: PASS (TypeScript 0 error, 22 pages)
修正前後スクリーンショット: 本文2.3に修正前後テキストを記載。ビジュアル取得は
  本番/Preview URL または実ブラウザ接続で別途取得（当環境はLighthouse/ブラウザ制約）。
```
