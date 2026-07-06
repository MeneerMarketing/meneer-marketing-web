import type { PillarSlug } from "@/lib/navigation";

export type SeoLandingCategory =
  | "google-ads"
  | "seo"
  | "website"
  | "shopify"
  | "content"
  | "b2b-portal";

/** Welke interactieve illustratie past bij deze landingspagina. */
export type SeoLandingVisual =
  | "google-ads"
  | "meta-ads"
  | "seo-serp"
  | "website-build"
  | "webshop"
  | "b2b-portal"
  | "content-hub"
  | "ai-search";

export interface SeoLandingLocation {
  city: string;
  region?: string;
}

export interface SeoLandingFaq {
  question: string;
  answer: string;
}

export interface SeoLandingCard {
  title: string;
  body: string;
}

export interface SeoLandingStep {
  title: string;
  body: string;
}

export interface SeoLandingHotTake {
  label: string;
  body: string;
}

/**
 * Data-contract voor conversie- én SEO-landingspagina's.
 * Optioneel `location` voor stad-varianten (bijv. google-ads-someren).
 */
export interface SeoLandingPage {
  slug: string;
  primaryKeyword: string;
  category: SeoLandingCategory;
  location?: SeoLandingLocation;

  metaTitle: string;
  metaDescription: string;
  keywords: readonly string[];

  eyebrow: string;
  headline: string;
  headlineAccent?: string;
  subheadline: string;

  pains: readonly SeoLandingCard[];
  deliverables: readonly SeoLandingCard[];

  visual: SeoLandingVisual;
  visualCaption?: string;

  processTitle: string;
  processSteps: readonly SeoLandingStep[];

  proofTitle: string;
  proofBody: string;
  proofCase?: string;

  hotTake: SeoLandingHotTake;

  faq: readonly SeoLandingFaq[];

  ctaTitle: string;
  ctaBody: string;

  relatedSlugs: readonly string[];
  pillarSlug: PillarSlug;
  pillarLabel: string;
}
