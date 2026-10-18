# ウカレル｜ユーザー獲得計測の正本

最終更新: 2026-08-23

## 経営指標

- 広告費上限: 2026年8月末まで月額5,000円
- 主要CPA: 広告費 ÷ `mission_five_reached` 到達ユーザー数
- 許容CPA: 500円以下
- 理想CPA: 200円未満
- `mission_five_reached` は「今日のMissionで5回答完了」。クリック、インストール、登録では代用しない
- 分母が0件ならCPAは「算出不能」とし、クリック単価などをCPAとして表示しない

## ファネルと正本

| 段階 | イベント・指標 | 正本 | 現在の状態 |
|---|---|---|---|
| LP到達 | `landing_page_view` | Web GA4 / PostHog | 実装済み |
| App Storeクリック | `app_store_cta_clicked` | Web GA4 / PostHog / Meta Pixel | 実装済み |
| インストール・初回起動 | `first_app_opened` | App PostHog、Meta App Events | PostHog実装済み。Metaマッピング要確認 |
| 登録完了 | `user_signed_up` または認証方式別完了シグナル | App PostHog | 実装済み。認証方式による定義差に注意 |
| 15問開始 | `mission_started` | App PostHog | 実装済み |
| 5問到達 | `mission_five_reached` | App PostHog | 実装済み。Meta App Events未マッピング |
| 15問完了 | `mission_completed` | App PostHog | 実装済み |
| 翌日再訪 | `day2_returned` | App PostHog | 実装済み |

## 重要な境界

WebのUTMとApp内のユーザーをPostHogだけで一対一に接続する実装は、現時点では確認できない。そのため、Webの `app_store_cta_clicked` とAppの `mission_five_reached` を同一人物として機械的に結合してはいけない。

媒体別の5問到達CPAをMetaで評価するには、Meta App Eventsへ `mission_five_reached` を送信し、イベント受信と広告帰属を実機で確認する必要がある。確認完了までは、PostHogで全体の5問到達率を見つつ、Meta側ではクリック・インストール指標を補助指標として扱う。

## Build 16担当への実装依頼

1. `meta_event_mapping.dart` に `mission_five_reached` の安全なカスタムイベントマッピングを追加する。
2. propertyは付与しない。email、UID、問題ID、回答内容などの個人・学習データをMetaへ送らない。
3. `first_app_opened` もMeta App Eventsに到達するか確認し、未マッピングなら追加する。
4. 既存の `mission_five_reached` の1日1回判定を変更しない。
5. マッピングの単体テストを追加する。
6. Meta Events Managerのテストイベントで、実機から `first_app_opened` と `mission_five_reached` が各1回受信されることを確認する。
7. 本番イベント受信確認後、Meta広告の最適化イベント候補を `mission_five_reached` とする。ただしイベント数が少ない初期段階はインストール最適化で配信し、5問到達数が蓄積してから切り替える。

## 日次判断表

| 指標 | 計算式 | 判断 |
|---|---|---|
| LP→Store率 | App Storeクリック ÷ LP到達 | LP訴求・CTAの評価 |
| 初回起動率 | 初回起動 ÷ Meta計測インストール | インストール後の起動障害確認 |
| 5問到達率 | 5問到達ユーザー ÷ 初回起動ユーザー | オンボーディングと初回体験の評価 |
| 5問到達CPA | 広告費 ÷ 広告帰属5問到達ユーザー | 最重要の獲得効率 |

少額運用では1日単位の上下で広告を停止しない。広告費1,500円到達、またはLP到達30件到達の早い方を一次判定点とする。ただし計測異常、リンク切れ、アプリ起動不能は即時停止する。
