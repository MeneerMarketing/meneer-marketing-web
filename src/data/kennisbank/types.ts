import type { PillarSlug } from "@/lib/navigation";

export type ArticleSection =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

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
