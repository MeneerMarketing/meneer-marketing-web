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

export type VerticalOfferSlug = "pilates";

export interface VerticalOfferConfig {
  slug: VerticalOfferSlug;
  landingPagePath: string;
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
  if (!config) return null;
  const url = new URL(`${MENEER_BASE}${config.landingPagePath}`);
  url.searchParams.set("ref", input.campaignRef);
  return url.toString();
}

export function getMeneerMarketingBaseUrl(): string {
  return MENEER_BASE;
}
