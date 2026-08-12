import type { TemplateVariant } from "@/types/studio";

export interface CrawledPage {
  url: string;
  title: string;
  text: string;
  html: string;
  links: string[];
}

export interface WebsiteIntelligence {
  base_url: string;
  pages: CrawledPage[];
  emails: string[];
  phones: string[];
  socials: { instagram?: string; facebook?: string };
  raw_headings: string[];
  errors: string[];
}

export interface BrandProfile {
  logo_url: string | null;
  logo_source: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_heading: string | null;
  font_body: string | null;
  visual_keywords: string[];
  confidence: number;
  sources: string[];
}

export interface ExtractedService {
  service_name: string;
  service_type: string;
  source_url: string | null;
  confidence: number;
  short_factual_description: string;
  is_core: boolean;
}

export interface ImageCandidate {
  url: string;
  source_page: string;
  alt_text: string;
  width: number | null;
  height: number | null;
  semantic_type: "hero" | "studio" | "reformer" | "team" | "atmosphere" | "gallery" | "logo" | "other";
  score: number;
}

export interface TemplateSelection {
  variant: TemplateVariant;
  confidence: number;
  reasoning: string;
}

export interface GeneratedContent {
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  intro_title: string;
  intro_text: string;
  tagline: string;
  description: string;
  service_cards: Array<{ name: string; description: string; highlight?: boolean }>;
  reformer_section: string | null;
  benefits: Array<{ title: string; description: string }>;
  about_section: string;
  location_section: string;
  faq: Array<{ question: string; answer: string }>;
  cta_text: string;
  reviews: Array<{ author: string; rating: number; text: string }>;
}

export interface SeoPersonalization {
  primary_keyword: string;
  secondary_keywords: string[];
  seo_title: string;
  meta_description: string;
  h1_recommendation: string;
}
