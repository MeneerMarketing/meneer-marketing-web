import type { SeoLandingPage } from "@/data/seo-landings/types";
import { SEO_CITY_REGISTRY } from "@/data/seo-landings/city-registry";
import { withSeoLandingLocation } from "@/lib/seo-landings-location";
import { WEBSITE_LATEN_MAKEN } from "@/data/seo-landings/pages/website-laten-maken";
import { SEO_SPECIALIST } from "@/data/seo-landings/pages/seo-specialist";
import { MARKETING_BUREAU } from "@/data/seo-landings/pages/national-batch5";

const CITY_TRIO_BASES = [
  WEBSITE_LATEN_MAKEN,
  MARKETING_BUREAU,
  SEO_SPECIALIST,
] as const;

/**
 * Vult per stad de kern-trio aan (website, marketing bureau, seo specialist)
 * alleen waar die slug nog niet bestaat. Voorkomt duplicaten en cannibalisatie.
 */
export function buildCityTrioFillPages(
  existingPages: readonly SeoLandingPage[],
): SeoLandingPage[] {
  const existingSlugs = new Set(existingPages.map((page) => page.slug));
  const added: SeoLandingPage[] = [];

  for (const city of SEO_CITY_REGISTRY) {
    for (const base of CITY_TRIO_BASES) {
      const slug = `${base.slug}-${city.slug}`;
      if (existingSlugs.has(slug)) continue;

      const page = withSeoLandingLocation(
        base,
        { city: city.city, region: city.region },
        city.slug,
      );
      added.push(page);
      existingSlugs.add(slug);
    }
  }

  return added;
}
