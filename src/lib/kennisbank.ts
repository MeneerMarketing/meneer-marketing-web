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

const DIENST_ZOEKEN_MAP: Record<string, { slug: string; label: string }> = {
  "google-ads": { slug: "google-ads-bureau", label: "Google Ads bureau" },
  adverteren: { slug: "google-ads-beheer", label: "Google Ads beheer" },
  seo: { slug: "hoger-in-google", label: "Hoger in Google" },
  "ai-zoek": { slug: "chatgpt-vindbaarheid", label: "Vindbaar in ChatGPT" },
  "content-marketing": {
    slug: "zoekmachine-optimalisatie",
    label: "Zoekmachine optimalisatie",
  },
  webdevelopment: {
    slug: "website-laten-bouwen",
    label: "Website laten bouwen",
  },
  "shopify-enterprise": {
    slug: "shopify-webshop-laten-maken",
    label: "Shopify webshop laten maken",
  },
  cro: { slug: "cro-bureau", label: "CRO bureau" },
  automatisering: {
    slug: "online-marketing-manager",
    label: "Online marketing manager",
  },
  tracking: {
    slug: "tracking-google-analytics",
    label: "Tracking & Google Analytics",
  },
  branding: { slug: "webdesign-bureau", label: "Webdesign bureau" },
  webdesign: { slug: "webdesign-bureau", label: "Webdesign bureau" },
  optimalisatie: { slug: "technische-seo", label: "Technische SEO" },
  strategie: {
    slug: "digital-marketing-bureau",
    label: "Digital marketing bureau",
  },
  workflows: {
    slug: "online-marketing-manager",
    label: "Online marketing manager",
  },
};

const ARTICLE_ZOEKEN_OVERRIDES: Partial<
  Record<string, readonly { slug: string; label: string }[]>
> = {
  "concurrent-hoger-in-google": [
    { slug: "hoger-in-google", label: "Hoger in Google" },
    { slug: "seo-uitbesteden", label: "SEO uitbesteden" },
  ],
  "google-reviews-lokale-seo": [
    { slug: "lokale-seo", label: "Lokale SEO" },
    { slug: "google-maps-marketing", label: "Google Maps marketing" },
  ],
  "instagram-ads-geen-leads": [
    { slug: "instagram-ads-bureau", label: "Instagram Ads bureau" },
    { slug: "facebook-ads-bureau", label: "Facebook Ads bureau" },
  ],
  "google-business-profile-spookhuis": [
    { slug: "lokale-seo", label: "Lokale SEO" },
    { slug: "google-maps-marketing", label: "Google Maps marketing" },
  ],
};

/** Interne links naar relevante /zoeken-landings voor SEO-kruisverwijzing. */
export function getZoekenLinksForArticle(
  slug: string,
  limit = 2,
): { slug: string; label: string }[] {
  const overrides = ARTICLE_ZOEKEN_OVERRIDES[slug];
  if (overrides?.length) return [...overrides].slice(0, limit);

  const article = getKennisbankArticleBySlug(slug);
  if (!article) return [];

  const seen = new Set<string>();
  const links: { slug: string; label: string }[] = [];

  for (const dienstSlug of article.dienstSlugs) {
    const match = DIENST_ZOEKEN_MAP[dienstSlug];
    if (match && !seen.has(match.slug)) {
      seen.add(match.slug);
      links.push(match);
      if (links.length >= limit) break;
    }
  }

  return links;
}

/** Zoek-landings gekoppeld aan een dienstslug (dienstpagina → commerciële keywords). */
export function getZoekenLinksForDienst(
  dienstSlug: string,
  limit = 2,
): { slug: string; label: string }[] {
  const match = DIENST_ZOEKEN_MAP[dienstSlug];
  return match ? [match].slice(0, limit) : [];
}
