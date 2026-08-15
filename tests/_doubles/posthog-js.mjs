// テスト専用の posthog-js ダブル。
// 実ライブラリ posthog-js は import 時に navigator 等のブラウザ global を参照し、
// Node のテスト環境ではモジュール評価中にクラッシュする。テストではこの軽量スタブへ
// 差し替える（tests/setup.mjs のローダで bare specifier "posthog-js" を本ファイルへ解決）。
// posthog.ts は default import の { __loaded, init, capture } のみ使用する。
// 差し替えは **テスト実行時のみ**（本番ビルドは実 posthog-js を使う）。
const posthog = {
  __loaded: false,
  init() {},
  capture() {},
  identify() {},
  register() {},
  reset() {},
};
export default posthog;
