import type { MetadataRoute } from "next";
import { getNewsItems } from "@/lib/news";
import { isUkareruReleased } from "@/lib/ukareruRelease";

const baseUrl = "https://www.dokugakulink.com";

const routes = [
  "",
  "/company",
  "/business",
  "/services/takken",
  // /landing/takken は広告専用LPで noindex のため載せない。
  "/contact",
  "/news",
  "/privacy",
  "/legal/tokushoho",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  // 固定ページはビルド日（＝公開内容が最後に更新された日）を lastmod とする。
  const buildDate = new Date();
  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: buildDate,
  }));

  // お知らせは記事の日付（YYYY-MM-DD または YYYY-MM。どちらも sitemap の W3C Datetime として有効）。
  const newsRoutes = getNewsItems(isUkareruReleased()).map(({ slug, date }) => ({
    url: `${baseUrl}/news/${slug}`,
    lastModified: date,
  }));

  return [...staticRoutes, ...newsRoutes];
}
