import type { EnrichedSeoLandingPage } from "@/data/seo-landings/enriched-types";
import {
  getAllSeoLandingPages,
  getSeoLandingBySlug,
} from "@/data/seo-landings/registry";
import { getKennisbankArticleBySlug } from "@/lib/kennisbank";

/** Slimme nav-teasers: geen volledige registry op de client. */
export interface SeoLandingNavLink {
  slug: string;
  primaryKeyword: string;
}

export interface SeoLandingKennisbankTeaser {
  slug: string;
  title: string;
  description: string;
}

export interface SeoLandingNavProps {
  related: SeoLandingNavLink[];
  citySiblings: SeoLandingNavLink[];
  kennisbankTeaser: SeoLandingKennisbankTeaser | null;
}

function toNavLink(page: EnrichedSeoLandingPage): SeoLandingNavLink {
  return { slug: page.slug, primaryKeyword: page.primaryKeyword };
}

/** Server-only: resolve related / city siblings / kennisbank voor één landing. */
export function resolveSeoLandingNav(
  page: EnrichedSeoLandingPage,
): SeoLandingNavProps {
  const related = page.relatedSlugs
    .map((slug) => getSeoLandingBySlug(slug))
    .filter((p): p is EnrichedSeoLandingPage => Boolean(p))
    .map(toNavLink);

  const citySiblings = page.location
    ? getAllSeoLandingPages()
        .filter(
          (p) =>
            p.location?.city === page.location?.city && p.slug !== page.slug,
        )
        .slice(0, 8)
        .map((p) => getSeoLandingBySlug(p.slug))
        .filter((p): p is EnrichedSeoLandingPage => Boolean(p))
        .map(toNavLink)
    : [];

  const article = page.kennisbankSlug
    ? getKennisbankArticleBySlug(page.kennisbankSlug)
    : null;

  const kennisbankTeaser = article
    ? {
        slug: article.slug,
        title: article.title,
        description: article.description,
      }
    : null;

  return { related, citySiblings, kennisbankTeaser };
}
