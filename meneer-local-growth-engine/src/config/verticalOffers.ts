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

export type VerticalInboundSource = "pilates-studios" | "huidklinieken";

export interface VerticalOutreachCopy {
  introLead: string;
  growthFocus: string;
  partnershipTail: string;
  offerParagraphLabel: string;
  offerPageTeaser: string;
  defaultPrimaryKeyword: (city: string) => string;
}

export interface VerticalOfferConfig {
  slug: VerticalOfferSlug;
  /** Public path on meneermarketing.nl */
  landingPagePath: string;
  landingPageLive: boolean;
  /** Value in inbound_submissions.source */
  inboundSource: VerticalInboundSource;
  packages: OfferPackage[];
  defaultRecommendedPackage: OfferPackage;
  bookingOptions: BookingOption[];
  previewCtaLabel: string;
  previewCtaSubline: string;
  /** Maandprijs ex. btw voor outreach copy (Studio/Clinic Edition). */
  entryMonthlyExclEur: number;
  businessNoun: string;
  /** Display name for STUDIO_EDITION on this vertical */
  editionLabel: string;
  packageLabels: Record<OfferPackage, string>;
  outreach: VerticalOutreachCopy;
}

import { getCachedDynamicVerticalOffer } from "@/services/verticals/dynamicVerticalPack";

const MENEER_BASE =
  process.env.MENEER_MARKETING_BASE_URL?.replace(/\/$/, "") ||
  "https://meneermarketing.nl";

const SHARED_PACKAGE_LABELS: Record<OfferPackage, string> = {
  STUDIO_EDITION: "Studio Edition",
  LOCAL_GROWTH: "Local Growth",
  GROWTH_PARTNER: "Growth Partner",
  SIGNATURE_CUSTOM: "Signature",
};

export const verticalOfferConfigs: Record<VerticalOfferSlug, VerticalOfferConfig> = {
  pilates: {
    slug: "pilates",
    landingPagePath: "/pilates-studios",
    landingPageLive: process.env.MENEER_PILATES_LANDING_LIVE !== "0",
    inboundSource: "pilates-studios",
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
    entryMonthlyExclEur: 89,
    businessNoun: "studio",
    editionLabel: "Studio Edition",
    packageLabels: { ...SHARED_PACKAGE_LABELS },
    outreach: {
      introLead:
        "Ik help Pilates studio's met hun website en vindbaarheid in Google.",
      growthFocus: "boekingen",
      partnershipTail: "studio",
      offerParagraphLabel: "pilates",
      offerPageTeaser:
        "Wil je meer weten hoe ik met pilates samenwerk en wat je van mij kunt verwachten?",
      defaultPrimaryKeyword: (city) => `Pilates ${city}`,
    },
  },
  "skin-clinics": {
    slug: "skin-clinics",
    landingPagePath: "/huidklinieken",
    landingPageLive: process.env.MENEER_SKIN_CLINICS_LANDING_LIVE !== "0",
    inboundSource: "huidklinieken",
    packages: [
      "STUDIO_EDITION",
      "LOCAL_GROWTH",
      "GROWTH_PARTNER",
      "SIGNATURE_CUSTOM",
    ],
    defaultRecommendedPackage: "LOCAL_GROWTH",
    bookingOptions: ["EXISTING_BOOKING", "CUSTOM_FUNNEL", "CUSTOM_APP"],
    previewCtaLabel: "Bekijk Clinic Edition",
    previewCtaSubline: "Website, Maps en intake-marketing",
    entryMonthlyExclEur: 89,
    businessNoun: "kliniek",
    editionLabel: "Clinic Edition",
    packageLabels: {
      ...SHARED_PACKAGE_LABELS,
      STUDIO_EDITION: "Clinic Edition",
    },
    outreach: {
      introLead:
        "Ik help huidklinieken met website, vindbaarheid en intake-flow in Google.",
      growthFocus: "intake-aanvragen",
      partnershipTail: "kliniek",
      offerParagraphLabel: "huidklinieken",
      offerPageTeaser:
        "Wil je meer weten hoe ik met huidklinieken samenwerk en wat je van mij kunt verwachten?",
      defaultPrimaryKeyword: (city) => `Huidkliniek ${city}`,
    },
  },
};

export function normalizeVerticalOfferSlug(
  slug: string | null | undefined,
): VerticalOfferSlug | null {
  if (!slug) return null;
  const normalized = slug.toLowerCase();
  if (normalized === "skin-clinics" || normalized === "huidklinieken") {
    return "skin-clinics";
  }
  if (normalized === "pilates" || normalized === "pilates-studios") {
    return "pilates";
  }
  return verticalOfferConfigs[normalized as VerticalOfferSlug]
    ? (normalized as VerticalOfferSlug)
    : null;
}

export function getVerticalOfferConfig(
  slug: string | null | undefined,
): VerticalOfferConfig | null {
  const normalized = (slug ?? "").toLowerCase();
  const dynamic = getCachedDynamicVerticalOffer(normalized);
  if (dynamic) return dynamic;
  const key = normalizeVerticalOfferSlug(slug);
  if (!key) return null;
  return verticalOfferConfigs[key];
}

export function formatOfferPackageLabel(
  pkg: OfferPackage | string | null | undefined,
  verticalSlug: string | null | undefined,
): string | null {
  if (!pkg) return null;
  const config = getVerticalOfferConfig(verticalSlug);
  const key = pkg as OfferPackage;
  if (config?.packageLabels[key]) return config.packageLabels[key];
  return SHARED_PACKAGE_LABELS[key] ?? String(pkg).replace(/_/g, " ");
}

export function buildLandingPageUrl(input: {
  verticalSlug: string;
  campaignRef: string;
}): string | null {
  const config = getVerticalOfferConfig(input.verticalSlug);
  if (!config || !config.landingPageLive) return null;
  if (!input.campaignRef?.trim()) return null;

  const url = new URL(`${MENEER_BASE}${config.landingPagePath}`);
  url.searchParams.set("ref", input.campaignRef.trim());
  return url.toString();
}

/** Offer URL zonder ref (fallback in templates vóór campaign aanmaak). */
export function buildLandingPageBaseUrl(verticalSlug: string): string | null {
  const config = getVerticalOfferConfig(verticalSlug);
  if (!config || !config.landingPageLive) return null;
  return `${MENEER_BASE}${config.landingPagePath}`;
}

export function getMeneerMarketingBaseUrl(): string {
  return MENEER_BASE;
}

export function isOfferLandingUrlForVertical(
  url: string,
  verticalSlug: string,
): boolean {
  const config = getVerticalOfferConfig(verticalSlug);
  if (!config) return false;
  try {
    const parsed = new URL(url);
    return parsed.pathname.replace(/\/$/, "") === config.landingPagePath;
  } catch {
    return url.includes(config.landingPagePath);
  }
}

/** Haal de eerste offer-URL uit outreach body (pilates-studios of huidklinieken). */
export function extractOfferLandingUrlFromText(text: string): string | null {
  const match = text.match(
    /https?:\/\/[^\s]*meneermarketing\.nl\/(?:huidklinieken|pilates-studios)(?:\?[^\s]*)?/i,
  );
  return match?.[0] ?? null;
}
