import {
  pilatesAcquisitionFitConfig,
  VISUAL_COMPONENT_KEYS,
  type TransformationWeights,
} from "@/verticals/pilates";
import type { VisualAssessment } from "@/services/acquisition-fit/visualTransformationJudge";

/**
 * Explainable website transformation score (M8.3).
 *
 * Every component is a 0-100 value where higher always means "better redesign
 * prospect", so the weighted sum reads the same direction as the final score.
 * When no Claude assessment is available the visual weight is redistributed
 * across the deterministic components instead of being silently zeroed.
 */

export interface TransformationInput {
  website_opportunity: number;
  website_quality: number;
  business_quality: number;
  brand_asset_usability: number;
  booking_opportunity: number;
  seo_opportunity: number | null;
  service_fit: number;
  local_reputation: number;
  visual: VisualAssessment | null;
  /** Claude-backed assessments carry full weight, fallbacks are damped. */
  visual_is_claude: boolean;
}

export interface TransformationComponent {
  key: keyof TransformationWeights;
  label: string;
  raw: number;
  weight: number;
  contribution: number;
}

export interface TransformationScoreResult {
  score: number;
  components: TransformationComponent[];
  weights_used: TransformationWeights;
  visual_included: boolean;
  effective_website_quality: number;
  effective_website_opportunity: number;
  missing_inputs: string[];
}

const LABELS: Record<keyof TransformationWeights, string> = {
  website_opportunity: "Website opportunity",
  website_quality_gap: "Website kwaliteitsgat",
  business_quality: "Business quality",
  brand_asset_usability: "Bruikbaar merkmateriaal",
  booking_opportunity: "Booking funnel opportunity",
  seo_opportunity: "SEO opportunity",
  service_fit: "Service fit",
  local_reputation: "Lokale reputatie",
  visual_modernity_gap: "Visuele verouderdheid",
  business_presentation_gap: "Gat studio versus website",
  redesign_impact: "Redesign impact",
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/** Claude's summary verdict, expressed as a nudge instead of a hard override. */
const FIT_BONUS: Record<VisualAssessment["visual_transformation_fit"], number> = {
  VERY_HIGH: 12,
  HIGH: 6,
  MEDIUM: 0,
  LOW: -8,
};

/**
 * Blends the deterministic HTML read with what a designer actually sees.
 * HTML heuristics cannot tell a 2012 layout from a 2025 one; the screenshots can.
 */
export function effectiveWebsiteMetrics(input: {
  deterministic_quality: number;
  deterministic_opportunity: number;
  visual: VisualAssessment | null;
  visual_is_claude: boolean;
}): { quality: number; opportunity: number } {
  if (!input.visual || !input.visual_is_claude) {
    return {
      quality: clamp(input.deterministic_quality),
      opportunity: clamp(input.deterministic_opportunity),
    };
  }

  const quality = clamp(
    input.deterministic_quality * 0.4 + input.visual.visual_quality_score * 0.6
  );

  // redesign_impact answers our actual question ("how much would a rebuild move
  // this business"), so it outweighs the raw quality read.
  const fitBonus = FIT_BONUS[input.visual.visual_transformation_fit] ?? 0;
  const opportunity = clamp(
    input.deterministic_opportunity * 0.3 +
      (100 - input.visual.visual_quality_score) * 0.3 +
      input.visual.redesign_impact_score * 0.4 +
      fitBonus
  );

  return { quality, opportunity };
}

export function computeTransformationScore(
  input: TransformationInput,
  weights: TransformationWeights = pilatesAcquisitionFitConfig.weights
): TransformationScoreResult {
  const missing: string[] = [];
  const visualIncluded = Boolean(input.visual && input.visual_is_claude);

  const { quality: effQuality, opportunity: effOpportunity } = effectiveWebsiteMetrics({
    deterministic_quality: input.website_quality,
    deterministic_opportunity: input.website_opportunity,
    visual: input.visual,
    visual_is_claude: input.visual_is_claude,
  });

  if (input.seo_opportunity == null) missing.push("seo_opportunity");
  if (!input.visual) missing.push("visual_assessment");
  else if (!input.visual_is_claude) missing.push("visual_assessment_is_fallback");

  const rawValues: Record<keyof TransformationWeights, number> = {
    website_opportunity: clamp(effOpportunity),
    website_quality_gap: clamp(100 - effQuality),
    business_quality: clamp(input.business_quality),
    brand_asset_usability: clamp(input.brand_asset_usability),
    booking_opportunity: clamp(input.booking_opportunity),
    // Without SEO data we assume a neutral middle rather than a zero, so an
    // unanalysed studio is not punished for a missing pipeline step.
    seo_opportunity: clamp(input.seo_opportunity ?? 50),
    service_fit: clamp(input.service_fit),
    local_reputation: clamp(input.local_reputation),
    visual_modernity_gap: clamp(100 - (input.visual?.modernity_score ?? 50)),
    business_presentation_gap: clamp(input.visual?.business_presentation_gap_score ?? 50),
    redesign_impact: clamp(input.visual?.redesign_impact_score ?? 50),
  };

  const weightsUsed: TransformationWeights = { ...weights };

  if (!visualIncluded) {
    const visualWeight = VISUAL_COMPONENT_KEYS.reduce((sum, key) => sum + weights[key], 0);
    for (const key of VISUAL_COMPONENT_KEYS) weightsUsed[key] = 0;
    const deterministicKeys = (Object.keys(weights) as Array<keyof TransformationWeights>).filter(
      (key) => !VISUAL_COMPONENT_KEYS.includes(key as (typeof VISUAL_COMPONENT_KEYS)[number])
    );
    const deterministicTotal = deterministicKeys.reduce((sum, key) => sum + weights[key], 0);
    for (const key of deterministicKeys) {
      weightsUsed[key] = weights[key] + (weights[key] / deterministicTotal) * visualWeight;
    }
  }

  const components: TransformationComponent[] = (
    Object.keys(weightsUsed) as Array<keyof TransformationWeights>
  )
    .filter((key) => weightsUsed[key] > 0)
    .map((key) => ({
      key,
      label: LABELS[key],
      raw: rawValues[key],
      weight: Number(weightsUsed[key].toFixed(4)),
      contribution: Number((rawValues[key] * weightsUsed[key]).toFixed(2)),
    }));

  const score = clamp(components.reduce((sum, c) => sum + c.contribution, 0));

  return {
    score,
    components,
    weights_used: weightsUsed,
    visual_included: visualIncluded,
    effective_website_quality: effQuality,
    effective_website_opportunity: effOpportunity,
    missing_inputs: missing,
  };
}
