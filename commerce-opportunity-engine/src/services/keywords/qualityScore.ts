import { volumeScoreContribution } from "./volumeTier.js";

export interface QualityScoreInput {
  commercialIntent: number;
  productIntent: number;
  searchVolume: number | null;
  cpc: number | null;
  competition: number | null;
  categoryRelevance: number;
}

/**
 * Balanced keyword_quality_score 0-100.
 * High commercial+product intent can beat higher volume broad terms.
 */
export function scoreKeywordQuality(input: QualityScoreInput): {
  score: number;
  breakdown: Record<string, number>;
} {
  const volumePart = volumeScoreContribution(input.searchVolume);

  let cpcPart = 40;
  if (typeof input.cpc === "number" && input.cpc > 0) {
    cpcPart = Math.min(90, 45 + input.cpc * 18);
  }

  let competitionPart = 40;
  if (typeof input.competition === "number" && input.competition > 0) {
    competitionPart = Math.min(85, 35 + input.competition * 50);
  }

  const breakdown = {
    commercial: input.commercialIntent,
    product: input.productIntent,
    volume: volumePart,
    cpc: cpcPart,
    competition: competitionPart,
    category: input.categoryRelevance,
  };

  const score =
    breakdown.commercial * 0.32 +
    breakdown.product * 0.28 +
    breakdown.volume * 0.14 +
    breakdown.cpc * 0.08 +
    breakdown.competition * 0.06 +
    breakdown.category * 0.12;

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    breakdown,
  };
}
