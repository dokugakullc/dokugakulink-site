// node --import ./tests/setup.mjs で読み込むテスト用フック。
//
// ソースはバンドラ規約（tsc "bundler" / Next）に合わせて拡張子なしの相対 import を使う。
// Node の TS 実行は拡張子を要求するため、拡張子なしの相対 specifier が .ts に解決できる場合だけ
// `.ts` を補って解決する。ビルド/型チェックには一切影響しない（テスト実行時のみ有効）。
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

registerHooks({
  resolve(specifier, context, nextResolve) {
    const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
    const hasExt = /\.[cm]?[jt]sx?$/i.test(specifier);
    if (isRelative && !hasExt && context.parentURL) {
      const candidate = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(fileURLToPath(candidate))) {
        return nextResolve(`${specifier}.ts`, context);
      }
    }
    return nextResolve(specifier, context);
  },
});
