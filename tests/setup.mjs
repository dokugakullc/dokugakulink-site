// node --import ./tests/setup.mjs で読み込むテスト用フック。
//
// ソースはバンドラ規約（tsc "bundler" / Next）に合わせて拡張子なしの相対 import を使う。
// Node の TS 実行は拡張子を要求するため、拡張子なしの相対 specifier が .ts に解決できる場合だけ
// `.ts` を補って解決する。ビルド/型チェックには一切影響しない（テスト実行時のみ有効）。
//
// さらに、tsconfig の paths エイリアス `@/*` → `src/*` を解決する。これにより
// `@/lib/track` のようにエイリアス import するモジュール（例: src/lib/track.ts）を
// テストから直接 import できる（fan-out テストが実装をそのまま検証するため）。
// エイリアスの解決先は本番ビルドと同一（src/ 配下）なので、実装の挙動は変えない。
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// このファイルは <repoRoot>/tests/setup.mjs にある前提。src/ は 1つ上の src/。
const SRC_BASE = new URL("../src/", import.meta.url);
const HAS_EXT = /\.[cm]?[jt]sx?$/i;

// 実 posthog-js は import 時に navigator 等のブラウザ global を参照し node で評価時クラッシュする。
// テスト時のみ軽量ダブルへ差し替える（本番ビルドは実体を使う＝この hook はテスト実行時限定）。
const POSTHOG_DOUBLE = new URL("./_doubles/posthog-js.mjs", import.meta.url).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    // 0) posthog-js（bare specifier）→ テスト用ダブル
    if (specifier === "posthog-js") {
      return nextResolve(POSTHOG_DOUBLE, context);
    }

    // 1) tsconfig paths: "@/..." → "<repoRoot>/src/..."
    if (specifier.startsWith("@/")) {
      const rest = specifier.slice(2); // 例: "lib/track"
      // 拡張子が無く .ts が存在すれば補う（無ければそのまま解決に委ねる）。
      if (!HAS_EXT.test(rest)) {
        const withTs = new URL(`${rest}.ts`, SRC_BASE);
        if (existsSync(fileURLToPath(withTs))) {
          return nextResolve(withTs.href, context);
        }
      }
      return nextResolve(new URL(rest, SRC_BASE).href, context);
    }

    // 2) 拡張子なしの相対 specifier に .ts を補う（従来どおり）。
    const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
    if (isRelative && !HAS_EXT.test(specifier) && context.parentURL) {
      const candidate = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(fileURLToPath(candidate))) {
        return nextResolve(`${specifier}.ts`, context);
      }
    }
    return nextResolve(specifier, context);
  },
});
