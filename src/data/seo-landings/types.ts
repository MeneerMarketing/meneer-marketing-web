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
  | "ai-search"
  | "email-flow"
  | "strategy-stack"
  | "metrics-dashboard"
  | "local-maps"
  | "tracking-lab"
  | "compare-split";

/** Bepaalt welke persoonlijkheidssecties zichtbaar zijn. */
export type SeoLandingLayoutProfile = "full" | "editorial" | "city";

export type SeoLandingSectionId =
  | "coffeeChat"
  | "innerVoice"
  | "rant"
  | "analogy"
  | "nightmare"
  | "confession"
  | "weirdFact"
  | "thisWeek";

export type SeoLandingScenePlacement =
  | "after-story"
  | "after-aanpak"
  | "after-deep-dive";

/** Illustratieve pauze midden op de pagina. */
export interface SeoLandingSceneBreak {
  placement: SeoLandingScenePlacement;
  visual: SeoLandingVisual;
  eyebrow: string;
  title: string;
  caption?: string;
}

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

/** Handgeschreven vervanging voor hash-pools (story, deep-dive, scenario). */
export interface SeoLandingProseOverride {
  title: string;
  paragraphs: readonly string[];
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

  /** full = alles · editorial = rijker met scenes · city = korter voor stad-varianten */
  layoutProfile?: SeoLandingLayoutProfile;
  sceneBreaks?: readonly SeoLandingSceneBreak[];
  skipSections?: readonly SeoLandingSectionId[];
  enrichedOverrides?: {
    story?: SeoLandingProseOverride;
    deepDive?: SeoLandingProseOverride;
    scenario?: SeoLandingProseOverride;
  };
}
