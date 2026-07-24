<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# dokugakulink-site 開発ルール

このリポジトリで実装・設計・レビューを始める前に、必ずObsidianの正本を参照する。

Obsidian Vault:

```text
/Users/tomonorijinnai/Library/Mobile Documents/com~apple~CloudDocs/obsidian/デフォルト/
```

必須参照:

1. `00_PROJECT_INDEX.md`
2. `00_Product_Constitution.md.md`
3. `01_IMPLEMENTATION_MAP.md`
4. `02_ENVIRONMENT_REGISTRY.md`
5. `03_CURRENT_SPRINT.md`
6. `50_Website/00_README.md.md`

対象に応じて、`50_Website` 内のDecision Log、Backlog、Analytics、Feature Policy、
Roadmap、Brand Guidelines、Legal文書を読むこと。

## Web正本

- ローカル: `/Users/tomonorijinnai/dokugakulink-site/`
- GitHub: `dokugakullc/dokugakulink-site`
- ウカレルLP本体（共有コンポーネント）: `src/components/UkareruLP.tsx`
  - `src/app/landing/takken/`（**Meta広告・SNSの正本遷移先**。正本URL=`/landing/takken`）
  - `src/app/services/takken/`（サイト内「ウカレル」紹介ページ。ヘッダー/フッター/トップの導線先）
  - 両ルートは同一の `UkareruLP` を描画する。**URL・route・canonical は不変**（新規route/redirect禁止）。

`/Users/tomonorijinnai/takken-app/docs/` は静的・法的ページ系、
`takken_app/web/` はFlutter Web用であり、公式LPの正本ではない。

現フェーズ（App Store公開前）の目的は**ウェイティングリスト登録**。リリース後も同じURLを継続利用する。
経緯・決定は Obsidian `50_Website/01_Decision_Log.md` DEC-WEB-2026-07-21、URL戦略は `50_Website/LPs/Takken_LP.md` を参照。

## 作業ルール

- コードだけを見てプロダクト仕様を推測しない。
- Obsidianとコードが異なる場合は差分を報告し、正本の優先順位を確認する。
- ブランド、価格、無料範囲、機能表現を独断で変更しない。
- 実装されていない機能、架空の実績、未確認の合格率を掲載しない。
- GA4、Clarity、フォーム、SEO、OGPへの影響を確認する。
- 秘密情報と `.env` をコミットしない。
- 既存のユーザー変更を無断で破棄しない。

## 完了時

1. リポジトリ既定のlint・build・testを実行する。
2. 表示、リンク、フォーム、Analytics、Metadataを変更範囲に応じて確認する。
3. 仕様変更を同じ作業内でObsidianへ反映する。
4. 優先順位が変わった場合は `03_CURRENT_SPRINT.md` を更新する。
5. 重要な判断はDecision Logへ記録する。

コードだけ更新してObsidianを古い状態に残してはならない。
