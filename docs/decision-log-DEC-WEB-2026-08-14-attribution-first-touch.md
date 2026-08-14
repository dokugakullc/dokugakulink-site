# DEC-WEB-2026-08-14 — Attribution Model: First Touch 採用

> 正本は Obsidian `50_Website/01_Decision_Log.md`。本ファイルは Git 追跡下の正式登録エントリ
> （Website Decision Log 規約に準拠）。Vault への反映は Vault 側の運用ルールに従う。

- **ID**: DEC-WEB-2026-08-14
- **日付 / Date**: 2026-08-14
- **ステータス / Status**: ACCEPTED（Owner 承認済み）
- **関連コミット**: `ea2beeb`（feat(marketing): add attribution measurement foundation）

## Context
App Store 公開前の現フェーズは事前登録（ウェイティングリスト）獲得が目的。Meta 広告配信開始を前に、
「広告流入 → LP → 回遊 → 事前登録」を正しく帰属させる計測基盤が必要。ユーザーは広告着地後にサイト内を
回遊し、UTM の無いページ（例 `/services/takken`）から登録することがあるため、流入元をどの時点で確定するかを
決める必要がある。

## Alternatives
- **First Touch**：初回流入の UTM/fbclid を保持し、以降は上書きしない。
- **Last Touch**：最終接触の情報を採用（登録直前の参照元を優先）。
- **Multi-touch / 加重配分**：複数接触を重み付けして配分。

## Evidence
- 現状は単一チャネル（Meta 広告）中心のプリローンチで、複数有料チャネルの同時配信がない
  → Last / Multi の必要性が低い（実データなし）。
- 実装は localStorage（TTL 7日）＋ sessionStorage フォールバックで first-touch を堅牢に保持でき、
  遷移をまたぐ保持を単体テストで実証（261/261 pass、`tsc --noEmit` 0、eslint 0）。
- fbclid はブラウザ計測（GA4/PostHog）へ送らず、サーバー側（`registerPayload` → GAS）のみで保持し
  Privacy に配慮。

## Decision
**First Touch Attribution を採用する。**
- 保持：`utm_source/medium/campaign/content/term` ＋ `fbclid`（server-side のみ）。
- 保存：localStorage 優先 / sessionStorage フォールバック、TTL 7日（定数 `ATTRIBUTION_TTL_MS`）。
- TTL 内は上書きしない。期限切れ後に UTM 付きで再訪した場合のみ更新。

## Reason
- プリローンチの主目的は「どの広告から最初に来たか」の把握であり、初回接触の帰属が意思決定に最も有用。
- 単一チャネル前提では Last / Multi-touch の追加複雑性に見合う便益がない
  （Facts over Assumptions：実データ蓄積前に精緻化しない）。
- First Touch は**因果ではなく初回接触との関連性**を測る指標であることを前提に運用する。

## Impact
- **初回流入クリエイティブ単位（`utm_content`）で、登録との関連性を分析できる。**
  （First Touch は因果を示さず、初回接触と登録の関連性の測定にとどまる。）
- 送信ペイロード形状は不変（form / API / GAS / Sheet 影響なし）。
- 帰属ウィンドウ 7日による過帰属の可能性（定数で調整可）。
- 長期保存の開示・同意は既存 `_ga`/`_fbp`/Clarity と同水準（Cookie 同意 UI は別途検討事項）。

## Future Review Condition
次のいずれかが生じた時点で本 Decision を再評価する（必要なら Superseded）。
- 複数の有料チャネルを同時配信し、チャネル間の最終接触の寄与を分離する必要が生じたとき。
- 実登録・実 CVR データが十分蓄積し、Last-touch / Multi-touch による精緻化の便益が実測で見込めるとき。
- 帰属ウィンドウ（7日）が実運用のクリック→登録リードタイムと乖離していると実データで判明したとき。
- 計測・プライバシー要件（同意管理等）の変更により保存・帰属方針の見直しが必要になったとき。
