/**
 * Vertical commercial offer config.
 * Pricing/copy lives on meneermarketing.nl — LGE only stores routing + package keys.
 */

export type OfferPackage =
  | "STUDIO_EDITION"
  | "LOCAL_GROWTH"
  | "GROWTH_PARTNER"
  | "SIGNATURE_CUSTOM";

export type BookingOption =
  | "EXISTING_BOOKING"
  | "BRANDED_APP"
  | "CUSTOM_FUNNEL"
  | "CUSTOM_APP";

export type VerticalOfferSlug = "pilates" | "skin-clinics";

export interface VerticalOfferConfig {
  slug: VerticalOfferSlug;
  landingPagePath: string;
  /** Staat de branchepagina live? Zolang false linken we er niet naartoe in outreach. */
  landingPageLive: boolean;
  packages: OfferPackage[];
  defaultRecommendedPackage: OfferPackage;
  bookingOptions: BookingOption[];
  previewCtaLabel: string;
  previewCtaSubline: string;
}

const MENEER_BASE =
  process.env.MENEER_MARKETING_BASE_URL?.replace(/\/$/, "") ||
  "https://meneermarketing.nl";

export const verticalOfferConfigs: Record<VerticalOfferSlug, VerticalOfferConfig> = {
  pilates: {
    slug: "pilates",
    landingPagePath: "/pilates-studios",
    landingPageLive: process.env.MENEER_PILATES_LANDING_LIVE !== "0",
    packages: [
      "STUDIO_EDITION",
      "LOCAL_GROWTH",
      "GROWTH_PARTNER",
      "SIGNATURE_CUSTOM",
    ],
    defaultRecommendedPackage: "LOCAL_GROWTH",
    bookingOptions: [
      "EXISTING_BOOKING",
      "BRANDED_APP",
      "CUSTOM_FUNNEL",
      "CUSTOM_APP",
    ],
    previewCtaLabel: "Wat kost deze website?",
    previewCtaSubline: "Bekijk mogelijkheden & prijzen",
  },
  "skin-clinics": {
    slug: "skin-clinics",
    landingPagePath: "/huidklinieken",
    landingPageLive: process.env.MENEER_HUIDKLINIEKEN_LANDING_LIVE !== "0",
    packages: [
      "STUDIO_EDITION",
      "LOCAL_GROWTH",
      "GROWTH_PARTNER",
      "SIGNATURE_CUSTOM",
    ],
    defaultRecommendedPackage: "LOCAL_GROWTH",
    bookingOptions: [
      "EXISTING_BOOKING",
      "BRANDED_APP",
      "CUSTOM_FUNNEL",
      "CUSTOM_APP",
    ],
    previewCtaLabel: "Wat kost deze aanpak?",
    previewCtaSubline: "Bekijk mogelijkheden & prijzen",
  },
};

export function getVerticalOfferConfig(
  slug: string | null | undefined
): VerticalOfferConfig | null {
  if (!slug) return null;
  const key = slug.toLowerCase() as VerticalOfferSlug;
  return verticalOfferConfigs[key] ?? null;
}

export function buildLandingPageUrl(input: {
  verticalSlug: string;
  campaignRef: string;
}): string | null {
  const config = getVerticalOfferConfig(input.verticalSlug);
  if (!config || !config.landingPageLive) return null;
  const url = new URL(`${MENEER_BASE}${config.landingPagePath}`);
  url.searchParams.set("ref", input.campaignRef);
  return url.toString();
}

export function getMeneerMarketingBaseUrl(): string {
  return MENEER_BASE;
}
