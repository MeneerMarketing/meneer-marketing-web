import type { MetadataRoute } from "next";

import { getAllPillarSlugs } from "@/data/pillar-pages";
import { getAllSeoLandingSlugs } from "@/data/seo-landings/registry";
import { seoLandingSitemapPriority } from "@/lib/seo-landings-meta";
import { getAllDienstSlugs } from "@/lib/diensten";
import {
  getKennisbankArticleBySlug,
  getKennisbankSlugs,
} from "@/lib/kennisbank";
import { siteOrigin } from "@/lib/site";

/** Paden die nooit in de sitemap horen (noindex of redirect). */
export const NOINDEX_PATHS = [
  "/intake",
  "/samenwerken",
  "/project-starten",
  "/schaal-op",
  "/groeiscan",
] as const;

const STATIC_INDEXABLE_PATHS = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/strategie", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/bouwen", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/vindbaarheid", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/campagnes", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/behoud", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/diensten", priority: 0.89, changeFrequency: "monthly" as const },
  { path: "/kennisbank", priority: 0.88, changeFrequency: "weekly" as const },
  { path: "/zoeken", priority: 0.87, changeFrequency: "weekly" as const },
  { path: "/cases", priority: 0.86, changeFrequency: "monthly" as const },
  { path: "/over", priority: 0.86, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.86, changeFrequency: "monthly" as const },
  { path: "/werkwijze", priority: 0.84, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.84, changeFrequency: "monthly" as const },
  { path: "/weetjes", priority: 0.8, changeFrequency: "monthly" as const },
  {
    path: "/privacybeleid",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/cookiebeleid",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/algemene-voorwaarden",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
] as const;

const SEO_LANDING_LAST_MOD = new Date("2026-07-06");
const SITE_LAST_MOD = new Date("2026-07-06");

function toOriginUrl(path: string): string {
  return path === "" ? siteOrigin : `${siteOrigin}${path}`;
}

function parseIsoDate(iso: string): Date {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? SITE_LAST_MOD : d;
}

function dedupeAndSort(
  entries: MetadataRoute.Sitemap,
): MetadataRoute.Sitemap {
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const entry of entries) {
    const existing = byUrl.get(entry.url);
    if (!existing || (entry.priority ?? 0) > (existing.priority ?? 0)) {
      byUrl.set(entry.url, entry);
    }
  }

  return [...byUrl.values()].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
  );
}

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const item of STATIC_INDEXABLE_PATHS) {
    entries.push({
      url: toOriginUrl(item.path),
      lastModified: SITE_LAST_MOD,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    });
  }

  for (const slug of getAllPillarSlugs()) {
    if (
      STATIC_INDEXABLE_PATHS.some((p) => p.path === `/${slug}`)
    ) {
      continue;
    }
    entries.push({
      url: `${siteOrigin}/${slug}`,
      lastModified: SITE_LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  for (const slug of getAllDienstSlugs()) {
    entries.push({
      url: `${siteOrigin}/diensten/${slug}`,
      lastModified: SITE_LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.78,
    });
  }

  for (const slug of getKennisbankSlugs()) {
    const article = getKennisbankArticleBySlug(slug);
    entries.push({
      url: `${siteOrigin}/kennisbank/${slug}`,
      lastModified: article
        ? parseIsoDate(article.modifiedAt ?? article.publishedAt)
        : SITE_LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.82,
    });
  }

  for (const slug of getAllSeoLandingSlugs()) {
    entries.push({
      url: `${siteOrigin}/zoeken/${slug}`,
      lastModified: SEO_LANDING_LAST_MOD,
      changeFrequency: "monthly",
      priority: seoLandingSitemapPriority(slug),
    });
  }

  return dedupeAndSort(entries);
}

export function countSitemapEntries(): number {
  return buildSitemapEntries().length;
}
