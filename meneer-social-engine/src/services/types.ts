import { z } from "zod";

export const ContentFormatId = z.enum([
  "DE_REKENING",
  "MENEER_FIXT",
  "MENEER_ZEGT",
  "MENEER_METER",
  "MENEER_ONTLEEDT",
  "DE_OFFERTE",
  "ZESTIG_MINUTEN",
  "BUREAU_BINGO",
  "CASE_BUILD",
  "BUILD_LOG",
  "COMMERCIAL",
]);

export type ContentFormatId = z.infer<typeof ContentFormatId>;

export const MediaType = z.enum(["carousel", "reel", "story", "single"]);
export type MediaType = z.infer<typeof MediaType>;

export const PostStatus = z.enum([
  "draft",
  "awaiting_approval",
  "approved",
  "scheduled",
  "published",
  "rejected",
  "archived",
]);

export type PostStatus = z.infer<typeof PostStatus>;

export const CriticScores = z.object({
  originality: z.number().min(0).max(100),
  meneer_fit: z.number().min(0).max(100),
  hook: z.number().min(0).max(100),
  shareability: z.number().min(0).max(100),
  commercial_value: z.number().min(0).max(100),
  ai_generic_risk: z.number().min(0).max(100),
  overall: z.number().min(0).max(100),
  verdict: z.enum(["APPROVED", "REJECTED"]),
  notes: z.string().optional(),
});

export type CriticScores = z.infer<typeof CriticScores>;

export const ContentIdea = z.object({
  format_id: ContentFormatId,
  hook: z.string(),
  angle: z.string(),
  project_slug: z.string().optional(),
  planned_for: z.string().optional(),
});

export type ContentIdea = z.infer<typeof ContentIdea>;

export const CarouselSlide = z.object({
  headline: z.string(),
  body: z.string().optional(),
  highlight: z.string().optional(),
});

export const GeneratedPost = z.object({
  format_id: ContentFormatId,
  caption: z.string(),
  hashtags: z.array(z.string()),
  template_data: z.record(z.string(), z.unknown()),
  slides: z.array(CarouselSlide).optional(),
  reel_script: z
    .object({
      hook: z.string(),
      scenes: z.array(z.object({ text: z.string(), duration_sec: z.number() })),
    })
    .optional(),
});

export type GeneratedPost = z.infer<typeof GeneratedPost>;

export const MonthlyPlan = z.object({
  month: z.string(),
  ideas: z.array(ContentIdea),
  weekly_rhythm: z.array(
    z.object({
      day: z.string(),
      format_id: ContentFormatId,
      note: z.string(),
    })
  ),
});

export type MonthlyPlan = z.infer<typeof MonthlyPlan>;

// Template-specific payloads
export interface MeneerZegtData {
  everyoneSays: string;
  meneerSays: string;
  explanation: string;
  verdict: string;
}

export interface DeRekeningData {
  /** Bedrag zoals het in beeld komt, bijvoorbeeld "€840" */
  amount: string;
  /** Periode achter het bedrag, bijvoorbeeld "per maand" */
  period: string;
  hook: string;
  problem: string;
  why: string;
  /** Zichtbare rekensom, regel voor regel */
  calculation: { label: string; value: string }[];
  fix: string;
  meneerNote: string;
}

export interface MeneerOntleedtData {
  brand: string;
  hook: string;
  observation: string;
  whyItWorks: string;
  stealThis: string;
}

export interface DeOfferteData {
  hook: string;
  lineItems: { label: string; price: string; verdict: "ok" | "duur" | "onzin" }[];
  total: string;
  meneerVerdict: string;
}

export interface MeneerFixtData {
  hook: string;
  problemLabel: string;
  timeLabel: string;
  resultLabel: string;
  clientName?: string;
}

export interface MeneerMeterData {
  siteName: string;
  scores: { label: string; value: number }[];
  total: number;
  verdict: string;
  oneLiner: string;
}

export interface BureauBingoData {
  cells: string[];
  punchline: string;
  selfAware: string;
}

export interface CaseBuildData {
  clientName: string;
  eyebrow: string;
  title: string;
  metric: string;
  metricHint: string;
  tags: string[];
}
