import {
  kennisbankArticles,
  type KennisbankArticle,
} from "@/data/kennisbank/articles";
import type { PillarSlug } from "@/lib/navigation";

export interface KennisbankCategory {
  slug: PillarSlug;
  name: string;
  /** Korte, speelse omschrijving voor de overzichtspagina */
  tagline: string;
}

/** Categorieën volgen de vijf blokken, zodat kennis en diensten één taal spreken. */
export const kennisbankCategories: KennisbankCategory[] = [
  {
    slug: "strategie",
    name: "Strategie",
    tagline: "Plannen die omzet opleveren in plaats van vergaderingen.",
  },
  {
    slug: "bouwen",
    name: "Bouwen",
    tagline: "Websites, shops en systemen die hun geld terugverdienen.",
  },
  {
    slug: "vindbaarheid",
    name: "Vindbaarheid",
    tagline: "Gevonden worden in Google én in AI-antwoorden.",
  },
  {
    slug: "campagnes",
    name: "Campagnes",
    tagline: "Adverteren waar het rendeert, stoppen waar het lekt.",
  },
  {
    slug: "behoud",
    name: "Behoud",
    tagline: "Klanten vasthouden is goedkoper dan klanten kopen.",
  },
];

export function getAllKennisbankArticles(): KennisbankArticle[] {
  return [...kennisbankArticles].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export function getKennisbankSlugs(): string[] {
  return kennisbankArticles.map((a) => a.slug);
}

export function getKennisbankArticleBySlug(
  slug: string,
): KennisbankArticle | null {
  return kennisbankArticles.find((a) => a.slug === slug) ?? null;
}

export function getKennisbankCategory(
  slug: PillarSlug,
): KennisbankCategory | null {
  return kennisbankCategories.find((c) => c.slug === slug) ?? null;
}

export function getArticlesByCategory(
  category: PillarSlug,
): KennisbankArticle[] {
  return getAllKennisbankArticles().filter((a) => a.category === category);
}

/** Artikelen die bij een dienst horen, voor interne links op dienstpagina's. */
export function getArticlesByDienst(dienstSlug: string): KennisbankArticle[] {
  return getAllKennisbankArticles().filter((a) =>
    a.dienstSlugs.includes(dienstSlug),
  );
}

/** Gerelateerde artikelen: zelfde categorie eerst, aangevuld met recent werk. */
export function getRelatedArticles(
  slug: string,
  limit = 3,
): KennisbankArticle[] {
  const current = getKennisbankArticleBySlug(slug);
  if (!current) return [];
  const sameCategory = getAllKennisbankArticles().filter(
    (a) => a.slug !== slug && a.category === current.category,
  );
  const rest = getAllKennisbankArticles().filter(
    (a) => a.slug !== slug && a.category !== current.category,
  );
  return [...sameCategory, ...rest].slice(0, limit);
}
