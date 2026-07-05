import type { MetadataRoute } from "next";
import { getAllPillarSlugs } from "@/data/pillar-pages";
import { getAllDienstSlugs } from "@/lib/diensten";
import { getKennisbankSlugs } from "@/lib/kennisbank";
import { siteOrigin } from "@/lib/site";

const origin = siteOrigin;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastMod = new Date();

  const staticPaths = [
    "",
    "/diensten",
    "/cases",
    "/over",
    "/contact",
    "/werkwijze",
    "/faq",
    "/groeiscan",
    "/samenwerken",
    "/project-starten",
    "/intake",
    "/schaal-op",
    "/kennisbank",
    "/weetjes",
    "/privacybeleid",
    "/cookiebeleid",
    "/algemene-voorwaarden",
  ] as const;

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${origin}${path}`,
    lastModified: lastMod,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.85,
  }));

  const pillarEntries: MetadataRoute.Sitemap = getAllPillarSlugs().map(
    (slug) => ({
      url: `${origin}/${slug}`,
      lastModified: lastMod,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }),
  );

  const diensten: MetadataRoute.Sitemap = getAllDienstSlugs().map((slug) => ({
    url: `${origin}/diensten/${slug}`,
    lastModified: lastMod,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const kennisbank: MetadataRoute.Sitemap = getKennisbankSlugs().map(
    (slug) => ({
      url: `${origin}/kennisbank/${slug}`,
      lastModified: lastMod,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }),
  );

  return [
    ...staticEntries,
    ...pillarEntries,
    ...diensten,
    ...kennisbank,
  ];
}
