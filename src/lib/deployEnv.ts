// Vercel のデプロイ環境判定（純粋関数・DI しやすい形）。
//
// Vercel は実行環境に `VERCEL_ENV` を注入する:
//   "production" | "preview" | "development"、ローカル（Vercel外）では undefined。
// これらは NEXT_PUBLIC_ ではないサーバー専用の環境変数なので、参照はサーバー側
// （Route Handler / Server Component）に限定する。クライアントからは読まない。

export function isPreviewDeployment(vercelEnv: string | undefined): boolean {
  return vercelEnv === "preview";
}

/**
 * 本番相当（外部計測を有効化してよい環境）か。
 * 安全優先: Vercel の production のみ true。preview・development・ローカル(undefined) は false。
 * これにより Preview 閲覧やローカル開発から本番 Analytics（Meta Pixel 等）へ計測が混入しない。
 */
export function isProductionDeployment(vercelEnv: string | undefined): boolean {
  return vercelEnv === "production";
}
