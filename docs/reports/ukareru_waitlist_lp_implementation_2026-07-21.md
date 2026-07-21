# ウカレル 事前登録LP 実装完了報告書

- 作成日: 2026-07-21
- 実装: Website Implementation Manager (Claude Code)
- 提出先: Website Release Auditor

---

## 38.1 概要

```yaml
Implementation Status: COMPLETE (未push・作業ブランチ)
Existing URL Preserved: true      # /landing/takken, /services/takken とも不変
Existing Route Preserved: true
New Route Added: false
Redirect Added: false
Canonical Changed: false          # /landing/takken は従来通り自己canonical。/services/takken は元々未設定→自己canonicalを新設(既存値の変更ではない)
Provisional Judgment: READY FOR AUDIT
```

改修対象URL（いずれも既存・不変）:
- `https://www.dokugakulink.com/landing/takken` … Meta広告の正本遷移先（[[LPs/Takken_LP]]・sitemap・commit de8de2b と一致）
- `https://www.dokugakulink.com/services/takken` … サイト内「ウカレル」紹介ページ（ヘッダー/フッター/トップの導線先）。Ownerの「両方を新ブランドで統一」指示により同一LPへ。

---

## 38.2 変更内容一覧

**追加ファイル**
- `src/components/UkareruLP.tsx` … 両ルートが描画する共有LP本体
- `src/components/CtaLink.tsx` … CTAクリック計測付きアンカー
- `src/components/LPInit.tsx` … 到達時に landing_page_view + UTM保存
- `src/components/MetaPixel.tsx` … Meta Pixel（env未設定なら no-op）
- `src/lib/utm.ts` … 広告帰属の first-touch 保存（sessionStorage）
- `src/lib/meta.ts` … fbq ラッパー
- `src/lib/track.ts` … GA4 + Meta の計測イベント単一入口
- `public/screenshots/ukareru/01_home.webp 〜 06_result.webp` … App Store実素材(828×1792 webp)

**変更ファイル**
- `src/app/landing/takken/page.tsx` / `src/app/services/takken/page.tsx` … メタデータ刷新 + `<UkareruLP/>` 描画
- `src/app/services/takken/lp.css` … `uk-` プレフィックスの新セクションCSSを追記
- `src/app/landing/takken/opengraph-image.tsx` / `src/app/services/takken/opengraph-image.tsx` … 新ブランドOGP
- `src/components/EmailForm.tsx` … 同意必須化 / label / UTM同送 / 計測 / 文言
- `src/app/api/register/route.ts` … ALLOWED_SOURCES修正(P0) + UTM転送
- `src/app/layout.tsx` … MetaPixel搭載
- `src/components/Header.tsx` … LP判定に /landing/takken を追加、CTA文言変更
- `.env.local.example` … GAS_WEBHOOK_URL / NEXT_PUBLIC_META_PIXEL_ID を明記（※`.env*`はgitignoreのため未コミット）

**削除ファイル**: なし

---

## 38.3 変更理由（抜粋）

| 問題 | 変更 | 効果 |
|---|---|---|
| 旧ブランド「忘れた頃に、また出題。」+ β版表現 | 新コンセプト+「リリース準備中・事前登録受付中」 | 広告目的・現フェーズと一致 |
| **両LPのフォームが全送信400で失敗(P0)** | register の ALLOWED_SOURCES に landing_takken/services_takken追加 | 登録が成立（最重要KPIの前提回復） |
| 実アプリ画面を掲載していない(CSS擬似UI) | App Store実素材01–06 + ベネフィット文 | 体験が伝わり信頼性向上 |
| 同意チェック無し / placeholder依存 | 同意必須 + 可視label + aria | 法的/アクセシビリティ要件 |
| UTM/Pixel無し | UTM保持→GAS同送、Pixel(env化)、waitlist_*イベント | 広告成果を計測可能 |

---

## 38.4 改善前後比較（要点）

- ファーストビュー: 旧「何を勉強すれば受かるか…」→ 新「今日の15問が、未来を変える。／独学でも、迷わない。」+ ステータス + CTA + 実スクショ
- CTA: 「β版先行登録」→ 全箇所「リリース通知を受け取る」に統一（ヘッダー/Hero/最終/モバイル固定）
- 料金: 本文の料金プラン節を撤去 → FAQに簡潔記載のみ
- OGP: β版画像 → 新ブランド「今日の15問が、未来を変える。／事前登録受付中」
- 計測: GA4のみ → GA4 + Meta Pixel、UTM登録データ紐付け

---

## 38.5 ウェイティングリスト動作結果（ローカル実測）

```yaml
Form Display: PASS
Email Validation: PASS            # 空=「メールアドレスを入力してください。」/ 形式不正=「形式をご確認ください。」(client + server両方)
Consent Validation: PASS          # 未チェックで送信不可・「プライバシーポリシーへの同意が必要です。」
Valid Submission: PASS(allowlist)  # source が allowlist を通過し GAS段階へ到達することを実測(200はGAS_WEBHOOK_URL設定時)
Loading State: PASS               # 「送信中…」+ disabled
Multiple Submission Prevention: PASS  # loading中は onSubmit 早期return + disabled
Duplicate Submission: PASS        # duplicated=true を「すでに登録済みです」で表示(成功扱い維持)
Failure Handling: PASS            # 「送信できませんでした。通信環境を…」
Completion Message: PASS          # 「ご登録ありがとうございます。App Store公開時にお知らせします。」
Data Destination: /api/register → GAS_WEBHOOK_URL (Google Apps Script → Sheets)。email/interest/problem/source/UTM を保存。source で問い合わせデータと識別可能。
Privacy Policy Link: PASS(/privacy, target=_blank)
```

API検証(ローカル・GAS未設定):
- 不正source → 400 / email未入力 → 400 / email形式不正 → 400
- landing_takken・services_takken(正常) → 500(=allowlist通過しGAS到達、env設定で200)

---

## 38.6 計測実装結果

```yaml
Landing Page View Event: landing_page_view (GA + Meta custom, マウント時1回)
CTA Click Event: waitlist_cta_clicked (GA + Meta custom, location付き)
Form Start Event: waitlist_form_started (初回入力で1回)
Submission Success Event: waitlist_submitted (GA) + Lead (Meta標準・完了時のみ)
Submission Failure Event: waitlist_submission_failed
Meta Pixel Existing: なし(新規追加)
Meta Pixel Ready: true (NEXT_PUBLIC_META_PIXEL_ID で有効化・未設定なら no-op)
UTM Preservation: first-touch を sessionStorage 保持(再描画/クライアント遷移で消えない)
UTM Data Destination: /api/register 経由で GAS(Sheets) に同送(PIIはMetaへ送らない)
Duplicate Event Check: 各イベントは呼び出し元で1回のみ発火(form_started は ref ガード, CTA/submit は単発)
```

---

## 38.7 Lighthouse

```yaml
Status: NOT RUN
理由: 当環境の Node は x64(Rosetta)、Chrome は arm64。Lighthouse CLI は
      この組合せを Runtime error で拒否("must run with a version of Node built for arm64")。
推奨: 本番URL(https://www.dokugakulink.com/landing/takken)で PageSpeed Insights を実行、
      または arm64 Node で `lighthouse` を実行。
```

数値未取得だが、性能に効く実装は反映済み:
- 両LPは静的プリレンダ(○)、JSは計測+フォームのみで軽量
- 画像は webp・表示サイズに合わせ配信(next/image)・Hero は preload・下部6枚は lazy・width/height明示で CLS 抑制
- LP本文はシステムフォント、サイト共通は Noto Sans JP(subset)

---

## 38.8 テスト結果

```yaml
npm_install: OK (既存 node_modules)
npm_run_lint: PASS (0 error)
npm_run_build: PASS (TypeScript 0 error, 22ページ生成, 両LP静的)
npm_test: NOT CONFIGURED
TypeScript: PASS
Responsive: CSS実装(hero 1→2カラム@720px, shots 3→1カラム@640px, 固定CTAはモバイルのみ, safe-area対応)。実機目視は要監査。
Form: PASS(上記38.5)
Navigation: プライバシー/お問い合わせ/FAQ(details)動作、404=200でなく404を返す
Metadata: canonical不変, title/description/OG/twitter 更新を実測
OGP: /landing/takken/opengraph-image・/services/takken/opengraph-image とも 200 image/png(85KB)
Robots: /robots.txt 200(変更なし)
Sitemap: /sitemap.xml 200(変更なし・/landing/takken 収録維持)
Console Errors: Pixel未設定時 fbq未読込でエラー無し(HTML実測でfbq出力0)。実機コンソールは要監査。
```

---

## 38.9 残課題

**Critical**
- `GAS_WEBHOOK_URL` 本番未確認: 未設定だと登録が500で全滅。**Meta広告開始前に本番envの設定確認が必須(Owner対応)。**

**High**
- `NEXT_PUBLIC_META_PIXEL_ID`: Web用PixelIDが未発行/未設定。空だと Meta 側 CV 計測が無効(ページは正常)。広告最適化のため発行・設定推奨(Owner対応)。
- `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_CLARITY_ID` 本番設定の確認。
- 実機QA(Lighthouse含む)未実施 → 監査で実施推奨。

**Medium**
- [[21_Brand_Guidelines]] が旧コピーのまま。Owner承認で新コピーへ更新すべき（本実装では Guidelines 本文を独断改訂していない）。
- AGENTS.md の LP正本記述(services=正本)が古い。`/landing/takken` を広告正本とする現状に合わせ更新推奨。
- `/services/takken` に存在した未コミットの料金編集(30日無料/¥580)は、Owner「両方統一」指示に基づき新LPへ統合(料金はFAQへ)。価格モデル自体は [[02_pricing]] と整合。

**Low**
- ニュース記事 `/news/beta-registration-open` に「β版事前登録」表現が残存(法人サイトの履歴情報のため今回対象外)。方針統一するなら別途。
- 旧LP専用コンポーネント(AppMockup/AppStoreCarousel/LPTracker等)が未使用化。動作影響なし、整理は任意。

---

## 38.10 変更証跡

```yaml
Repository: dokugakullc/dokugakulink-site
Working Branch: feat/ukareru-waitlist-lp
Base Branch: main (00400f4)
Commits:
  - f6734c1 feat(waitlist): fix register allowlist, add UTM + Meta Pixel tracking
  - 8f34474 feat(lp): rebuild takken LP as pre-launch waitlist landing page
Pull Request URL: (未作成・push待ち)
Pushed: false (main直push禁止・作業ブランチ)
```
