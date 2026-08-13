import type { OfferPackage } from "@/config/verticalOffers";

type BizSignals = {
  website?: string | null;
  website_url?: string | null;
  website_quality_score?: number | null;
  seo_opportunity_score?: number | null;
  business_quality_score?: number | null;
  lead_score?: number | null;
};

type SeoSignals = {
  seo_opportunity_score?: number | null;
  current_rank?: number | null;
  primary_search_volume?: number | null;
} | null;

/**
 * Deterministic package recommendation from internal intelligence.
 * Never expose raw scores publicly.
 */
export function recommendPackage(input: {
  business: BizSignals;
  seo?: SeoSignals;
}): { package: OfferPackage; reason: string } {
  const website = String(input.business.website_url ?? input.business.website ?? "").trim();
  const hasWebsite = Boolean(website);
  const websiteQuality = Number(input.business.website_quality_score ?? 0);
  const seoScore = Number(
    input.seo?.seo_opportunity_score ?? input.business.seo_opportunity_score ?? 0
  );
  const businessQuality = Number(input.business.business_quality_score ?? 0);
  const leadScore = Number(input.business.lead_score ?? 0);
  const rank = input.seo?.current_rank ?? null;

  if (businessQuality >= 90 && leadScore >= 80 && seoScore >= 70) {
    return {
      package: "SIGNATURE_CUSTOM",
      reason:
        "Sterke studio met hoge complexiteit/fit; maatwerktraject past beter dan een standaardpakket.",
    };
  }

  if (
    hasWebsite &&
    websiteQuality >= 70 &&
    rank != null &&
    rank > 0 &&
    rank <= 5 &&
    seoScore < 55
  ) {
    return {
      package: "STUDIO_EDITION",
      reason:
        "Website/positionering is de belangrijkste gap; lokale SEO is al relatief sterk.",
    };
  }

  if (seoScore >= 55 || !hasWebsite || websiteQuality < 65) {
    return {
      package: "LOCAL_GROWTH",
      reason:
        "Conceptwebsite plus lokale vindbaarheid is de logische volgende stap voor deze studio.",
    };
  }

  if (seoScore >= 45 && businessQuality >= 75) {
    return {
      package: "GROWTH_PARTNER",
      reason:
        "Studio is sterk genoeg voor een bredere groeiaanpak naast website en SEO.",
    };
  }

  return {
    package: "LOCAL_GROWTH",
    reason:
      "Standaardaanbeveling: high-end studio-website met lokale groei als basis.",
  };
}
