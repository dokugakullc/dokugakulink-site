import type { MetadataRoute } from "next";
import { newsItems } from "@/lib/news";

const baseUrl = "https://www.dokugakulink.com";

const routes = [
  "",
  "/company",
  "/business",
  "/services/takken",
  "/landing/takken",
  "/contact",
  "/news",
  "/privacy",
  "/legal/tokushoho",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
  }));

  const newsRoutes = newsItems.map(({ slug }) => ({
    url: `${baseUrl}/news/${slug}`,
  }));

  return [...staticRoutes, ...newsRoutes];
}
