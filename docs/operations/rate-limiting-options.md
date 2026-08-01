# レート制限 実装方式の比較（調査のみ・未実装）

問い合わせ・事前登録 API のレート制限方式を一次情報で比較する。**本タスクでは実装・外部設定を行わない**
（契約・設定・実装は Owner 承認待ち）。Turnstile（bot 対策）とは独立の追加防御。

## 前提（不採用）

- **メモリ内 Map によるレート制限は採用しない**：Vercel Functions は Serverless で複数インスタンスに分散し、
  カウンタがインスタンス間で共有されず、再起動で消えるため正確に効かない。

## 候補比較

| 観点 | Vercel WAF Rate Limiting（ダッシュボード） | @vercel/firewall SDK（コード） | 外部ストア（Upstash Redis 等） | Cloudflare WAF / Rate Limiting |
|---|---|---|---|---|
| Serverless での正確性 | Vercel 管理の分散カウンタ（**リージョン単位**で計数） | 同上（Vercel 管理） | 中央ストアで正確（往復レイテンシ増） | エッジで正確（Cloudflare 前段時） |
| 状態管理 | Vercel 管理（自前ストア不要） | Vercel 管理（自前ストア不要） | 自前（Redis）運用が必要 | Cloudflare 管理 |
| 識別子 | IP・JA4（Enterprise で UA/任意ヘッダ） | 既定 IP・`rateLimitKey` で任意 | 任意（IP/ユーザーID 等）自前実装 | IP 等 |
| プライバシー | IP は Vercel 側で処理（アプリで保持不要） | 同左（keyに PII を入れない設計にできる） | key 設計次第（IP 保存に注意） | Cloudflare 側 |
| NAT 共有誤遮断 | IP 単位は共有 IP で誤遮断リスク（全方式共通） | key を工夫可（過度に緩めない） | key 設計次第 | IP 単位は同リスク |
| 分散環境 | 対応（リージョン跨ぎは合算超過あり=公式注記） | 同左 | 中央集約で一貫 | エッジ集約 |
| コスト | 全プラン無料枠（Hobby 100万許可req/1ルール）超過は使用量課金 | 同上（ルールは要ダッシュボード作成） | Redis 利用料＋運用 | Cloudflare プラン依存 |
| Hobby 可否 | **可**（1ルール/プロジェクト・計数 IP/JA4・窓 10s〜10min・固定窓） | 可（要ルール作成・Preview は Protection Bypass 必要） | 可（外部契約要） | 現状 Vercel 配信のため要前段構成変更 |
| 設定変更 | ダッシュボードで完結（コード変更なし） | ダッシュボードでルール作成＋コード | 依存追加＋ストア構築 | DNS/前段を Cloudflare へ（大きい） |
| 障害時 | Vercel 側でフェイル制御 | 同左 | ストア障害時の fail-open/closed を自前設計 | Cloudflare 側 |
| contact/register 別ルール | ルール条件（パス等）で分離可（Hobby は1ルール制約） | コードで per-route・per-key 制御が容易 | 自前で自由 | ルールで分離 |
| Preview 除外 | ルール条件やドメインで制御 | env/条件で除外（Preview は Protection Bypass 前提） | 自前 | 前段構成次第 |
| ログ／監視 | Firewall ダッシュボードで可視化（Log アクション有） | 同左＋アプリログ | 自前 | Cloudflare 側 |
| 運用負荷 | 低（UI 設定・依存ゼロ） | 中（UI＋コード） | 高（ストア運用） | 高（配信構成変更） |

（出典：Vercel 公式 `docs/vercel-firewall/vercel-waf/rate-limiting`・`.../rate-limiting-sdk`。プラン別 Limits と
「リージョン単位計数」の注記は公式ページに記載。）

## 推奨（Owner 承認待ち）

**推奨＝Vercel WAF Rate Limiting（ダッシュボードのカスタムルール）を第一候補**とする。理由：

- 現構成（Vercel 配信）と相性がよく、**メモリ Map の欠点（分散非共有・再起動消失）を Vercel 管理カウンタで回避**。
- **全プランで利用可・依存追加ゼロ・コード変更なし**。IP／JA4 で固定窓の per-source 制限が可能。
- まず `/api/contact`・`/api/register` を対象に **Log アクションで観測 → Deny/Challenge** の段階導入ができる。
- per-route の細かな条件やキー設計が必要になった段階で **`@vercel/firewall`（`checkRateLimit`）へ拡張**
  （Vercel 管理カウンタのままコード制御・Preview は Protection Bypass を有効化）。外部 Redis は運用コストが増える
  ため現時点では非推奨。

### 留意点

- Hobby は**レート制限ルール 1/プロジェクト**（＋カスタムルール計 3）。contact/register を1ルールで束ねるか
  Pro 昇格が要る場合がある（Owner 判断）。
- リージョン単位計数のため、複数リージョンからの攻撃は単一リージョンの上限を超え得る（公式注記）。
- IP 単位は NAT／社内共有 IP で誤遮断があり得る。**しきい値は Log 観測後に調整**する。
- 設定・契約・有効化は **Owner 承認待ち**（本タスクでは実施しない）。
