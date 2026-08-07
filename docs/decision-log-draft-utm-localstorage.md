# Decision Log ドラフト（Vault未反映・要オーナー確定）

> このファイルはリポジトリ内のドラフトです。正本は Obsidian `50_Website/01_Decision_Log.md`。
> 読み取り専用Vaultは変更していません。ID採番・最終文言はオーナーが確定してください。

## DEC-WEB-2026-08-06（案）: 広告帰属 first-touch を TTL付き localStorage 化＋URLサニタイズ

- **日付**: 2026-08-06
- **ステータス**: 実装済み（未コミット・未デプロイ）／Decision Log正本反映は保留
- **背景**:
  - 実登録・問い合わせの `utm_content` が空になる件を診断した結果、パイプライン（LP→フォーム→GAS→シート）は正常で、空の実CVは非広告流入（fbclidなし）だったと判明。
  - ただし first-touch を sessionStorage で保持していたため、**別タブ・タブを閉じての再訪・翌日以降**の登録では広告帰属を取りこぼす可能性があることを実機テストで確認。
  - さらに `landing_url`（pathname+全クエリ）と `referrer`（全クエリ+ハッシュ）をそのまま保存しており、URLに混入した email / token 等がブラウザに残りうる懸念があった。
- **決定**:
  1. `src/lib/utm.ts` の first-touch 保持を **TTL付き localStorage**（既定7日・定数 `ATTRIBUTION_TTL_MS`）へ変更。localStorage不可時は sessionStorage フォールバック。旧 sessionStorage データは読み取り＋localStorageへ移行。
  2. `landing_url` は **origin+pathname＋許可クエリ（utm_*/fbclid）のみ**、`referrer` は **origin+pathname のみ**（クエリ・ハッシュ除去）へ縮約。http(s)以外・解釈不能は空へフォールバック。最大長を設定。書き込み直前と読み出し時の両方でサニタイズ。
  3. PII（氏名/メール/トークン）は保存しない（allowlist）。フォーム・API・GAS・シートのペイロード形式は不変。
  4. プライバシーポリシー（`src/app/privacy/page.tsx` §4）へ、UTM/クリックID/参照元/着地URLを約7日ブラウザ保存する旨を最小限・非断定で追記。
- **代替案と却下理由**:
  - 1st-party cookie: 毎リクエスト送信・4KB制約。サーバー側でUTMを読む要件が無いため localStorage を採用。
  - TTLなし永続: 過帰属・プライバシー負荷が大きく却下。7日（Metaのクリック計測窓に整合）。
- **影響/リスク**:
  - 帰属ウィンドウ7日による過帰属の可能性（定数で調整可）。
  - 長期保存の開示・同意（現状サイトは同意バナー無し。既存 `_ga`/`_fbp`/Clarity と同水準）。
  - 本番ビルド検証はCI/Vercel（ローカルは既知の lightningcss ネイティブ不整合で不可）。
- **campaign 命名（別項目として維持）**:
  - `utm_campaign`（URL・現行 `prelaunch_202607`）と シートの手入力 `campaign_name`（`UKR_事前登録_Traffic_202607`）は別項目として維持。
  - 新規キャンペーン命名規則（ドキュメント案）: `utm_source=meta` / `utm_medium=paid_social` / `utm_campaign=ukareru_{phase}_{yyyymm}` / `utm_content=ad_{枝番}_{訴求}`。
- **検証**: unit 18件（utm）含む 185件 PASS・`tsc --noEmit` 0・eslint 0。実機5ケースは Vercel Preview で再確認予定。
