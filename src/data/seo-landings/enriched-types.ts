import type { SeoLandingFaq, SeoLandingPage } from "@/data/seo-landings/types";

export interface SeoLandingMyth {
  myth: string;
  reality: string;
}

export interface SeoLandingProseBlock {
  title: string;
  paragraphs: readonly string[];
}

export interface SeoLandingEnrichedSections {
  story: SeoLandingProseBlock;
  scenario: { title: string; paragraphs: readonly string[] };
  deepDive: SeoLandingProseBlock;
  myths: readonly SeoLandingMyth[];
  weirdFact: string;
  honestNo: { title: string; body: string };
  thisWeek: { title: string; items: readonly string[] };
  kennisbankSlug?: string;
}

export type EnrichedSeoLandingPage = SeoLandingPage & SeoLandingEnrichedSections;
