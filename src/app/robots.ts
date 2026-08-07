import type { MetadataRoute } from "next";

import { ROBOTS_DISALLOW_PATHS } from "@/lib/seo/robots-policy";
import { siteOrigin } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...ROBOTS_DISALLOW_PATHS],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/llms.txt", "/kennisbank", "/zoeken", "/diensten", "/over"],
        disallow: [...ROBOTS_DISALLOW_PATHS],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: [...ROBOTS_DISALLOW_PATHS],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: [...ROBOTS_DISALLOW_PATHS],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/llms.txt", "/kennisbank", "/zoeken", "/diensten", "/over"],
        disallow: [...ROBOTS_DISALLOW_PATHS],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/llms.txt", "/kennisbank", "/zoeken", "/diensten", "/over"],
        disallow: [...ROBOTS_DISALLOW_PATHS],
      },
    ],
    sitemap: `${siteOrigin}/sitemap.xml`,
    // Hostname only (Yandex Host). Google gebruikt vooral Sitemap:.
    host: new URL(siteOrigin).host,
  };
}
