import type { PillarSlug } from "@/lib/navigation";

export interface ChecklistMeterCheck {
  id: string;
  label: string;
  fix: string;
}

export interface ChecklistMeterTier {
  id: string;
  min: number;
  max: number;
  label: string;
  quip: string;
}

export interface HotTakeOption {
  id: string;
  label: string;
  verdict: string;
  tone?: "win" | "meh" | "ouch";
}

export type ArticleSection =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "interactive"; id: "brochure-ometer" }
  | {
      type: "interactive";
      id: "checklist-meter";
      eyebrow?: string;
      title: string;
      intro: string;
      storageKey: string;
      eventName: string;
      sharePath: string;
      scoreNoun?: string;
      checks: ChecklistMeterCheck[];
      tiers: ChecklistMeterTier[];
      ctaHref?: string;
      ctaLabel?: string;
    }
  | {
      type: "interactive";
      id: "hot-take";
      eyebrow?: string;
      title: string;
      prompt: string;
      options: HotTakeOption[];
    };

export interface KennisbankArticle {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  modifiedAt?: string;
  readMinutes: number;
  /** Categorie = een van de vijf blokken */
  category: PillarSlug;
  keywords: string[];
  /** Dienst-slugs waar dit artikel bij hoort, voor interne links */
  dienstSlugs: string[];
  /** Optioneel: FAQ voor schema en sectie onder artikel */
  faqs?: readonly { question: string; answer: string }[];
  sections: ArticleSection[];
}
