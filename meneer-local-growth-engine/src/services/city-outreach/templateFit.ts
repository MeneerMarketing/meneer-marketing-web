import type { Business } from "@/types/domain";
import type { TemplateVariant } from "@/types/studio";
import { getOutreachCapacityConfig } from "@/verticals/runtime";

export type TemplateFitMap = Record<TemplateVariant, number>;

export const PILATES_TEMPLATE_VARIANTS: TemplateVariant[] = [
  "editorial",
  "reformer-minimal",
  "soft-movement",
];

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Berekent template_fit_score voor alle actieve templates van een vertical.
 * Gebruikt bestaande intelligence + visual assessment, geen hardcoded winnaars.
 */
export function calculateTemplateFitScores(business: Business): TemplateFitMap {
  const services = Array.isArray(business.services)
    ? (business.services as Array<string | { name?: string }>).map((s) =>
        typeof s === "string" ? s : String(s.name ?? "")
      )
    : [];

  const blob = [
    business.primary_service,
    ...services,
    business.studio_name,
    business.prospect_type_reason,
    business.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let editorial = 52;
  let reformer = 52;
  let soft = 52;
  let atelier = 52;

  if (/botox|filler|laser|hydrafacial|microneedling|peeling|huidanalyse|intake|kliniek|clinical/.test(blob)) {
    editorial += 18;
    soft += 14;
    atelier += 20;
  }
  if (/premium|luxe|medisch|aesthetic|boutique|private/.test(blob)) {
    editorial += 16;
    atelier += 18;
  }
  if (/wellness|holistic|calm|serene|spa/.test(blob)) {
    soft += 18;
  }
  if (/reformer|cadillac|tower/.test(blob)) {
    reformer += 28;
  }
  if (/boutique|premium|luxe|private|personal|exclusief|editorial/.test(blob)) {
    editorial += 22;
    atelier += 16;
  }
  if (/wellness|holistic|yoga|movement|somatic|flow|mindful|prenatal|postnatal|adem/.test(blob)) {
    soft += 22;
  }
  if (/sculpt|power|fitness|barre/.test(blob)) {
    reformer += 12;
    editorial += 8;
  }

  const modernity = Number(business.visual_modernity_score ?? business.website_modernity_score ?? 50);
  const gap = Number(business.business_presentation_gap_score ?? 50);
  const brand = Number(business.brand_asset_usability_score ?? 50);
  const wo = Number(business.website_opportunity_score ?? 50);
  const visualQuality = Number(business.visual_quality_score ?? 50);

  if (gap >= 65) {
    editorial += 14;
    soft += 10;
    atelier += 12;
  }
  if (modernity < 50) {
    editorial += 10;
    reformer += 8;
  }
  if (modernity >= 78) {
    soft += 6;
  }
  if (brand >= 75) {
    editorial += 16;
    atelier += 14;
  }
  if (wo >= 55) {
    editorial += Math.min(18, Math.round((wo - 45) / 2));
    reformer += Math.min(10, Math.round((wo - 50) / 3));
  }
  if (visualQuality < 55) {
    soft += 8;
  }

  const visual = business.visual_assessment as { visual_transformation_fit?: string } | null;
  if (visual?.visual_transformation_fit === "VERY_HIGH") {
    editorial += 8;
    reformer += 6;
    atelier += 10;
  }

  return {
    editorial: clampScore(editorial),
    "reformer-minimal": clampScore(reformer),
    "soft-movement": clampScore(soft),
    "clinical-atelier": clampScore(atelier),
  };
}

export function recommendedTemplateFromFit(fit: TemplateFitMap): {
  template: TemplateVariant;
  score: number;
} {
  const entries = (Object.entries(fit) as Array<[TemplateVariant, number]>)
    .map(([template, score]) => ({ template, score }))
    .sort((a, b) => b.score - a.score);

  const winner = entries[0] ?? { template: "soft-movement" as TemplateVariant, score: 50 };
  return { template: winner.template, score: winner.score };
}

export function activeTemplatesForVertical(verticalSlug: string): TemplateVariant[] {
  const config = getOutreachCapacityConfig(verticalSlug);
  if (config) {
    return [...config.activeTemplateVariants] as TemplateVariant[];
  }
  return [...PILATES_TEMPLATE_VARIANTS];
}
