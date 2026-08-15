# ウカレル Meta広告 Phase 1 入稿パッケージ

目的：App Store公開前の事前登録（Meta標準イベント `Lead`）。

## 配信条件

- キャンペーン全体の日額上限：**300円**
- 構成：1キャンペーン / 1広告セット / 3広告
- 3広告で共通にするもの：オーディエンス、配置、最適化イベント、本文、見出し、遷移先
- 広告間で変えるもの：画像と `utm_content` のみ
- 最適化イベント：Webサイトの `Lead`
- 遷移先：`https://www.dokugakulink.com/landing/takken`
- CTA：詳しくはこちら
- `utm_source=meta`
- `utm_medium=paid_social`
- `utm_campaign=waitlist_validation_202608`
- 広告公開・予算投入：Owner最終承認まで保留

日額300円では統計的なA/Bテストに必要なデータが短期間で集まりにくいため、Phase 1は**勝敗を断定するテストではなく探索配信**とする。Meta側の配分を許容し、配信量が極端に偏った場合は、同時均等配信ではなく広告を期間で入れ替えて観察する。

## H1 — 現在地

- Creative ID：`h1_current_position_final`
- 見出し：独学でも、合格までの現在地が分かる。
- 本文：今日やるべき学習と、合格までの現在地をひと目で。宅建を独学で学ぶ社会人のための学習アプリ「ウカレル」。現在、無料の事前登録を受付中です。
- 説明：App Store公開時にお知らせ
- URL：`https://www.dokugakulink.com/landing/takken?utm_source=meta&utm_medium=paid_social&utm_campaign=waitlist_validation_202608&utm_content=h1_current_position_final`
- 画像：`h1_current_position_final-4x5.png` / `h1_current_position_final-1x1.png`

## H2 — 15問だけ

- Creative ID：`h2_15_questions_final`
- 見出し：今日は、15問だけ。
- 本文：今日の15問から。すきま時間でも学習を積み重ねられる。宅建を独学で学ぶ社会人のための学習アプリ「ウカレル」。現在、無料の事前登録を受付中です。
- 説明：App Store公開時にお知らせ
- URL：`https://www.dokugakulink.com/landing/takken?utm_source=meta&utm_medium=paid_social&utm_campaign=waitlist_validation_202608&utm_content=h2_15_questions_final`
- 画像：`h2_15_questions_final-4x5.png` / `h2_15_questions_final-1x1.png`

## H3 — 復習タイミング

- Creative ID：`h3_review_timing_final`
- 見出し：忘れた頃に、もう一度。
- 本文：解いた問題を、後日もう一度。復習のタイミングに迷わない。宅建を独学で学ぶ社会人のための学習アプリ「ウカレル」。現在、無料の事前登録を受付中です。
- 説明：App Store公開時にお知らせ
- URL：`https://www.dokugakulink.com/landing/takken?utm_source=meta&utm_medium=paid_social&utm_campaign=waitlist_validation_202608&utm_content=h3_review_timing_final`
- 画像：`h3_review_timing_final-4x5.png` / `h3_review_timing_final-1x1.png`

## 評価方法

確認順序：

1. `waitlist_submitted` / Meta `Lead`
2. ランディングページビュー
3. リンクCTR
4. CPC

- 日額上限はキャンペーン合計300円から増額しない。
- 初期観察期間は7日（最大消化額2,100円）。途中で計測異常やリンク不備があれば停止する。
- 7日終了時点でLeadが少ない場合、CTRだけで勝敗を決めず「判定保留」とする。
- 配信量が一案へ偏った場合、未配信案を不採用とは判断しない。

## 入稿前チェック

- 本番LPで事前登録が成功する
- Meta Events Managerで `PageView` と `Lead` を確認できる
- 同一メールの重複登録、入力エラー、API失敗では `Lead` が発火しない
- GA4 / PostHogの `waitlist_submitted` にfirst-touchの `utm_*` が入る
- 3本とも日額300円ではなく、**キャンペーン合計が日額300円**になっている
- 公開ボタンを押す前にOwnerが最終確認する

## 制作方法

- 4:5完成版：組み込み画像生成ツールで、承認済みアートディレクションと実UIを参照して制作
- 1:1完成版：各4:5完成版を編集対象に、コピー・UI・CTA・免責を維持して再構成
- 元の承認済み3:4画像：`h1_current_position_master-3x4.png`（配信用ではなく制作基準）
