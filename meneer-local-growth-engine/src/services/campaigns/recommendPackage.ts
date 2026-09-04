import type { OfferPackage } from "@/config/verticalOffers";

type BizSignals = {
  website?: string | null;
  website_url?: string | null;
  website_quality_score?: number | null;
  seo_opportunity_score?: number | null;
  business_quality_score?: number | null;
  lead_score?: number | null;
  prospect_type?: string | null;
  website_transformation_score?: number | null;
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
  const prospectType = input.business.prospect_type ?? null;

  // GROWTH_ONLY studios already have a website worth keeping, so the offer
  // leads with visibility instead of a rebuild.
  if (prospectType === "GROWTH_ONLY") {
    return seoScore >= 45 && businessQuality >= 75
      ? {
          package: "GROWTH_PARTNER",
          reason:
            "Website is al sterk; de groei zit in lokale vindbaarheid en advertenties, niet in een redesign.",
        }
      : {
          package: "LOCAL_GROWTH",
          reason:
            "Website is al sterk genoeg; lokale groei is hier de logische ingang.",
        };
  }

  if (prospectType === "WEBSITE_TRANSFORMATION") {
    return seoScore >= 55
      ? {
          package: "LOCAL_GROWTH",
          reason:
            "Nieuwe website plus lokale vindbaarheid: beide zijn hier meetbaar te verbeteren.",
        }
      : {
          package: "STUDIO_EDITION",
          reason:
            "De website is de duidelijkste hefboom; lokale vindbaarheid is al redelijk op orde.",
        };
  }

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
