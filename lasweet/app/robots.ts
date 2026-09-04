import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Crawl altijd toestaan. Indexatie wordt gestuurd via meta robots
 * (NEXT_PUBLIC_SEO_INDEX / VERCEL_ENV), niet via Disallow.
 * Disallow + noindex tegelijk is een anti-pattern.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
