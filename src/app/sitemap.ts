import type { MetadataRoute } from "next";

const baseUrl = "https://www.dokugakulink.com";

const routes = [
  "",
  "/company",
  "/business",
  "/contact",
  "/privacy",
  "/legal/tokushoho",
  "/landing/takken",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
  }));
}
