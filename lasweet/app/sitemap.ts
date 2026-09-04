import type { MetadataRoute } from "next";
import { isSeoIndexable, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Bij noindex (preview) geen sitemap-URLs serveren die indexatie uitlokken
  if (!isSeoIndexable()) {
    return [];
  }

  const lastModified = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/bestellen`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/matcha-enschede`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/koekjes-enschede`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
