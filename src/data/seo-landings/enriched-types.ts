import type { SeoLandingFaq, SeoLandingPage } from "@/data/seo-landings/types";

export interface SeoLandingMyth {
  myth: string;
  reality: string;
}

export interface SeoLandingProseBlock {
  title: string;
  paragraphs: readonly string[];
}

export interface SeoLandingChatLine {
  who: "ondernemer" | "meneer" | "stem";
  text: string;
}

export interface SeoLandingCoffeeChat {
  context: string;
  lines: readonly SeoLandingChatLine[];
}

export interface SeoLandingInnerVoice {
  inHead: string;
  reality: string;
}

export interface SeoLandingAnalogy {
  title: string;
  setup: string;
  punchline: string;
}

export interface SeoLandingRant {
  title: string;
  body: string;
}

export interface SeoLandingConfession {
  title: string;
  body: string;
}

export interface SeoLandingLocalColor {
  title: string;
  paragraphs: readonly string[];
}

export interface SeoLandingTocItem {
  id: string;
  label: string;
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
  coffeeChat: SeoLandingCoffeeChat;
  innerVoice: SeoLandingInnerVoice;
  rant: SeoLandingRant;
  analogy: SeoLandingAnalogy;
  nightmare: { title: string; items: readonly string[] };
  confession: SeoLandingConfession;
  localColor?: SeoLandingLocalColor;
  expertSummary: string;
  keyTakeaways: readonly string[];
  schemaFaqs: readonly SeoLandingFaq[];
  toc: readonly SeoLandingTocItem[];
}

export type EnrichedSeoLandingPage = SeoLandingPage & SeoLandingEnrichedSections;
