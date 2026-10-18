// お知らせ一覧の並び順・公開状態による出し分け・日付表示のテスト。
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatNewsDate, getNewsItems, newsTag } from "../src/lib/news";

test("日付の新しい順に並ぶ（公開前・配信後とも）", () => {
  for (const released of [false, true]) {
    const dates = getNewsItems(released).map((item) => item.date);
    const sorted = [...dates].sort().reverse();
    assert.deepEqual(dates, sorted);
  }
});

test("配信開始の記事は配信後だけ出る", () => {
  const slug = "ukareru-app-store-release";
  assert.equal(getNewsItems(false).some((item) => item.slug === slug), false);
  assert.equal(getNewsItems(true).some((item) => item.slug === slug), true);
});

test("電子印鑑作るさんの記事は公開状態に関係なく出て、最新として先頭に来る", () => {
  for (const released of [false, true]) {
    assert.equal(getNewsItems(released)[0].slug, "inkan-service-launch");
  }
});

test("配信後は過去記事の「事前登録受付中」「開発中」タグを出さない", () => {
  const labels = getNewsItems(true)
    .map((item) => newsTag(item, true)?.label)
    .filter(Boolean);
  assert.equal(labels.includes("事前登録受付中"), false);
  assert.equal(labels.includes("開発中"), false);
});

test("公開前は従来のタグをそのまま出す", () => {
  const labels = getNewsItems(false).map((item) => newsTag(item, false)?.label);
  assert.ok(labels.includes("事前登録受付中"));
  assert.ok(labels.includes("開発中"));
});

test("日付表示：日まで・月までの両形式", () => {
  assert.equal(formatNewsDate("2026-09-20"), "2026年9月20日");
  assert.equal(formatNewsDate("2026-06"), "2026年6月");
  assert.throws(() => formatNewsDate("2026年6月"));
});
