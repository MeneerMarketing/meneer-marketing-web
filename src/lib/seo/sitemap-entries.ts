import type { MetadataRoute } from "next";

import { getAllCaseSlugs } from "@/data/cases-detail";
import { getAllPillarSlugs } from "@/data/pillar-pages";
import { getAllSeoLandingPages } from "@/data/seo-landings/registry";
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

/** Landings na hub-verdieping + topical map pack. */
const SEO_LANDING_LAST_MOD = new Date("2026-08-09");
/** Hubs/static: sitemap-hygiëne + content SEO pack. */
const SITE_LAST_MOD = new Date("2026-08-09");

const NOINDEX_PATH_SET = new Set<string>(NOINDEX_PATHS);

function toOriginUrl(path: string): string {
  return path === "" ? siteOrigin : `${siteOrigin}${path}`;
}

function isNoindexPath(pathname: string): boolean {
  if (NOINDEX_PATH_SET.has(pathname)) return true;
  for (const blocked of NOINDEX_PATHS) {
    if (pathname === blocked || pathname.startsWith(`${blocked}/`)) return true;
  }
  return false;
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
    if (item.path && isNoindexPath(item.path)) continue;
    entries.push({
      url: toOriginUrl(item.path),
      lastModified: SITE_LAST_MOD,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    });
  }

  for (const slug of getAllPillarSlugs()) {
    const path = `/${slug}`;
    if (STATIC_INDEXABLE_PATHS.some((p) => p.path === path)) continue;
    if (isNoindexPath(path)) continue;
    entries.push({
      url: `${siteOrigin}${path}`,
      lastModified: SITE_LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  for (const slug of getAllDienstSlugs()) {
    const path = `/diensten/${slug}`;
    if (isNoindexPath(path)) continue;
    entries.push({
      url: `${siteOrigin}${path}`,
      lastModified: SITE_LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.78,
    });
  }

  for (const slug of getAllCaseSlugs()) {
    const path = `/cases/${slug}`;
    if (isNoindexPath(path)) continue;
    entries.push({
      url: `${siteOrigin}${path}`,
      lastModified: SITE_LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.85,
    });
  }

  for (const slug of getKennisbankSlugs()) {
    const path = `/kennisbank/${slug}`;
    if (isNoindexPath(path)) continue;
    const article = getKennisbankArticleBySlug(slug);
    entries.push({
      url: `${siteOrigin}${path}`,
      lastModified: article
        ? parseIsoDate(article.modifiedAt ?? article.publishedAt)
        : SITE_LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.82,
    });
  }

  for (const page of getAllSeoLandingPages()) {
    const path = `/zoeken/${page.slug}`;
    if (isNoindexPath(path)) continue;
    entries.push({
      url: `${siteOrigin}${path}`,
      lastModified: SEO_LANDING_LAST_MOD,
      changeFrequency: "monthly",
      priority: seoLandingSitemapPriority(page.slug, Boolean(page.location)),
    });
  }

  return dedupeAndSort(entries).filter((entry) => {
    try {
      const pathname = new URL(entry.url).pathname.replace(/\/$/, "") || "/";
      if (pathname === "/") return true;
      return !isNoindexPath(pathname);
    } catch {
      return false;
    }
  });
}

export function countSitemapEntries(): number {
  return buildSitemapEntries().length;
}
