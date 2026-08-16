/**
 * Herbruikbare Vertical Growth Pages-architectuur.
 * Pilates is de eerste vertical; latere verticals vullen dezelfde shape.
 */

export type VerticalPackageId =
  | "studio-edition"
  | "local-growth"
  | "growth-partner";

export type VerticalInterestId =
  | VerticalPackageId
  | "signature-custom"
  | "unsure";

export interface VerticalMoney {
  /** Bedrag in eurocent of hele euro's. Zie unit. */
  amount: number;
  unit: "eur" | "eur_cents";
  /** Weergavelabel, bv. "per maand" / "eenmalig" */
  cadence: "monthly" | "one_time";
  prefix?: string;
}

export interface VerticalPackage {
  id: VerticalPackageId;
  name: string;
  eyebrow: string;
  tagline: string;
  monthly: VerticalMoney;
  setup: VerticalMoney;
  recommended?: boolean;
  ctaLabel: string;
  inclusions: readonly string[];
  /** Korte ladder-label: Website → + vindbaarheid → complete groei */
  ladderLabel: string;
}

export interface VerticalSignatureCustom {
  name: string;
  heading: string;
  lead: string;
  fromPrice: VerticalMoney;
  bullets: readonly string[];
  ctaLabel: string;
}

export interface VerticalBookingRoute {
  id: "existing" | "branded-app" | "custom";
  title: string;
  lead: string;
  bullets: readonly string[];
  priceNote?: string;
  providerExample?: string;
}

export interface VerticalFaqItem {
  question: string;
  answer: string;
}

export interface VerticalArtDirection {
  id: string;
  name: string;
  blurb: string;
  demoHref: string;
  /** Template-nummer voor UI (1 / 2 / 3). */
  shortLabel?: string;
  /** Of de live preview klaar is om te embedden. */
  ready?: boolean;
}

export interface VerticalFlowPhase {
  id: string;
  title: string;
  body: string;
  detail: string;
}

export interface VerticalCitySlot {
  city: string;
  /** Alleen tonen wanneer statusSource === "engine" */
  status: "available" | "reserved" | "partner_active";
  statusSource: "engine" | "none";
}

export interface VerticalCaseStudy {
  enabled: boolean;
  client: string;
  city: string;
  href: string;
  websiteUrl: string;
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  lead: string;
  facets: readonly { label: string; text: string }[];
}

export interface VerticalCampaignPersonalization {
  businessName?: string;
  city?: string;
  /**
   * LGE city_status snapshot.
   * AVAILABLE | PRIMARY_CANDIDATE | RESERVED | EXCLUSIVE
   */
  cityStatus?: string;
  /** @deprecated gebruik cityStatus */
  cityAvailable?: boolean;
  previewReady?: boolean;
  previewHref?: string;
  recommendedPackage?:
    | "STUDIO_EDITION"
    | "LOCAL_GROWTH"
    | "GROWTH_PARTNER"
    | "SIGNATURE_CUSTOM";
  primaryService?: string;
  selectedTemplate?: string;
  vertical?: string;
}

export interface VerticalLaunchPromo {
  active: boolean;
  /** Huidige launchprijs (bijv. 0) */
  current: VerticalMoney;
  /** Doorgestreepte normale prijs */
  was: VerticalMoney;
  badge: string;
  note: string;
}

export interface VerticalPricingConfig {
  currency: "EUR";
  /** Minimale contractduur in maanden voor maandpakketten */
  minTermMonths: number;
  termDisclaimer: string;
  /** Domein + hosting inbegrepen bij maandpakketten */
  includedInfraNote: string;
  /** Onderhoud, wijzigingen en bereikbaarheid bij maandpakketten */
  includedCareNote: string;
  /** Tijdelijke launch-actie. Override setup-weergave op alle maandpakketten. */
  launchPromo?: VerticalLaunchPromo;
  packages: readonly VerticalPackage[];
  signatureCustom: VerticalSignatureCustom;
}

export interface VerticalLandingConfig {
  slug: string;
  path: string;
  verticalName: string;
  verticalNamePlural: string;
  themeAccent: string;
  seo: {
    title: string;
    description: string;
    keywords: readonly string[];
  };
  pricing: VerticalPricingConfig;
  demo: {
    primaryHref: string;
    primaryLabel: string;
  };
  artDirections: readonly VerticalArtDirection[];
  bookingRoutes: readonly VerticalBookingRoute[];
  bookingProviderNote: string;
  flowPhases: readonly VerticalFlowPhase[];
  exclusivity: {
    headline: string;
    lead: string;
    body: string;
    cities: readonly VerticalCitySlot[];
  };
  caseStudy: VerticalCaseStudy;
  faq: readonly VerticalFaqItem[];
  howItWorks: readonly { title: string; body: string }[];
  localSeoExamples: {
    queries: readonly string[];
    pages: readonly string[];
  };
}
