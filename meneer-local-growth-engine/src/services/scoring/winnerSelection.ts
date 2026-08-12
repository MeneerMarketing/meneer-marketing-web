import type { Business } from "@/types/domain";
import type { ScoreComponents } from "@/services/scoring/scoreBusiness";
import {
  pilatesScoringConfig,
  type WinnerRuleThresholds,
} from "@/verticals/pilates/scoring";

export type WinnerPath =
  | "STRONG_ABSOLUTE"
  | "STRONG_RELATIVE"
  | "EXCEPTIONAL_OPPORTUNITY"
  | "NONE";

export interface WinnerEvidence {
  city_rank: number;
  lead_score: number;
  margin: number | null;
  seo_opportunity: number | null;
  business_quality: number;
  website_opportunity: number;
  contactability: number;
  preview_status: string | null;
  data_completeness: number;
  path: WinnerPath;
  gates_failed: string[];
  positives: string[];
  negatives: string[];
}

export interface WinnerEvaluation {
  eligible: boolean;
  selected: boolean;
  path: WinnerPath;
  winner_confidence: number;
  winner_reason: string;
  winner_evidence: WinnerEvidence;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function dataCompleteness(business: Business, components: ScoreComponents): number {
  let score = 20;
  if (business.website_url) score += 15;
  if (business.email || business.phone) score += 12;
  if (business.google_place_id) score += 8;
  if (business.seo_opportunity_score != null) score += 15;
  if (business.preview_status === "READY") score += 12;
  if (components.business_quality_score > 0) score += 8;
  if (business.google_rating != null) score += 5;
  if (business.brand_profile || business.logo || business.google_logo_url) score += 5;
  return clamp(score);
}

function gateFailures(
  business: Business,
  components: ScoreComponents,
  rules: WinnerRuleThresholds
): string[] {
  const fails: string[] = [];
  if (business.lead_eligible === false) fails.push("not_lead_eligible");
  if (business.is_chain) fails.push("is_chain");
  if (business.lead_status === "DO_NOT_CONTACT") fails.push("do_not_contact");
  if (!business.website_url) fails.push("no_website");
  if (business.qualification_status === "UNQUALIFIED") fails.push("unqualified");
  if (business.seo_opportunity_score == null) fails.push("seo_not_analyzed");
  if (components.lead_score < rules.hardMinLeadScore) fails.push("lead_score_below_hard_min");
  if (components.contactability_score < rules.hardMinContactability) {
    fails.push("contactability_too_low");
  }
  return fails;
}

function detectPath(
  input: {
    leadScore: number;
    cityRank: number;
    margin: number | null;
    seo: number;
    businessQuality: number;
  },
  rules: WinnerRuleThresholds
): WinnerPath {
  if (input.leadScore >= rules.absoluteMinLeadScore) return "STRONG_ABSOLUTE";

  if (
    input.leadScore >= rules.relativeMinLeadScore &&
    input.cityRank === 1 &&
    input.margin != null &&
    input.margin >= rules.relativeMinMargin &&
    input.seo >= rules.relativeMinSeoOpportunity &&
    input.businessQuality >= rules.relativeMinBusinessQuality
  ) {
    return "STRONG_RELATIVE";
  }

  if (
    input.seo >= rules.exceptionalMinSeoOpportunity &&
    input.leadScore >= rules.exceptionalMinLeadScore &&
    input.cityRank === 1
  ) {
    return "EXCEPTIONAL_OPPORTUNITY";
  }

  return "NONE";
}

function buildReason(input: {
  name: string;
  path: WinnerPath;
  leadScore: number;
  margin: number | null;
  seo: number;
  preview: string | null;
  confidence: number;
  selected: boolean;
  gatesFailed: string[];
}): string {
  if (input.gatesFailed.length) {
    return `Not selected: failed gates (${input.gatesFailed.join(", ")}).`;
  }
  if (!input.selected) {
    if (input.path === "NONE") {
      return `Ranked #1 with lead score ${input.leadScore} but does not meet absolute (≥${pilatesScoringConfig.winnerRules.absoluteMinLeadScore}), relative, or exceptional winner paths.`;
    }
    return `Meets ${input.path} signals but winner confidence ${input.confidence} is below threshold.`;
  }

  const marginText =
    input.margin != null ? `a ${input.margin}-point margin versus #2` : "no close #2 competitor";
  const previewText =
    input.preview === "READY"
      ? "and a ready personalized preview"
      : "though preview is not ready yet";

  if (input.path === "STRONG_ABSOLUTE") {
    return `Highest ranked eligible studio with a strong absolute lead score of ${input.leadScore}, SEO opportunity ${input.seo}, ${marginText}, ${previewText}.`;
  }
  if (input.path === "STRONG_RELATIVE") {
    return `Highest ranked eligible studio with a ${input.margin}-point margin, strong local fit, high SEO opportunity (${input.seo}) and lead score ${input.leadScore}, ${previewText}.`;
  }
  return `Exceptional SEO opportunity (${input.seo}) with solid lead score ${input.leadScore} as city #1, ${previewText}.`;
}

/**
 * Compute winner confidence for a ranked candidate.
 * Confidence ≠ lead score: it measures certainty that this is the city winner.
 */
export function evaluateCityWinner(input: {
  business: Business;
  components: ScoreComponents;
  cityRank: number;
  secondLeadScore: number | null;
  cityLocked?: boolean;
  rules?: WinnerRuleThresholds;
}): WinnerEvaluation {
  const rules = input.rules ?? pilatesScoringConfig.winnerRules;
  const { business, components, cityRank } = input;
  const margin =
    input.secondLeadScore != null
      ? Math.round((components.lead_score - input.secondLeadScore) * 10) / 10
      : null;
  const seo = Number(business.seo_opportunity_score ?? components.seo_opportunity_score ?? 0);
  const completeness = dataCompleteness(business, components);
  const gatesFailed = gateFailures(business, components, rules);

  if (input.cityLocked) gatesFailed.push("city_exclusive_or_reserved");
  if (cityRank !== 1) gatesFailed.push("not_city_rank_1");

  // Near-ties: even if #1, refuse when margin too thin (unless absolute monster)
  if (
    cityRank === 1 &&
    margin != null &&
    margin < rules.hardMinMarginWhenTied &&
    components.lead_score < rules.absoluteMinLeadScore
  ) {
    gatesFailed.push("margin_too_thin");
  }

  const path =
    gatesFailed.length === 0
      ? detectPath(
          {
            leadScore: components.lead_score,
            cityRank,
            margin,
            seo,
            businessQuality: components.business_quality_score,
          },
          rules
        )
      : "NONE";

  const positives: string[] = [];
  const negatives: string[] = [];

  if (cityRank === 1) positives.push("City rank #1");
  else negatives.push(`City rank #${cityRank}`);

  if (margin != null && margin >= rules.relativeMinMargin) {
    positives.push(`Margin +${margin} vs #2`);
  } else if (margin != null && margin < rules.hardMinMarginWhenTied) {
    negatives.push(`Thin margin (+${margin})`);
  } else if (margin != null) {
    negatives.push(`Margin +${margin} below relative threshold`);
  }

  if (components.lead_score >= rules.absoluteMinLeadScore) {
    positives.push(`Absolute lead score ${components.lead_score}`);
  } else if (components.lead_score >= rules.relativeMinLeadScore) {
    positives.push(`Solid lead score ${components.lead_score}`);
  } else {
    negatives.push(`Lead score ${components.lead_score} below relative floor`);
  }

  if (seo >= rules.relativeMinSeoOpportunity) positives.push(`SEO opportunity ${seo}`);
  else negatives.push(`SEO opportunity ${seo} below relative floor`);

  if (components.business_quality_score >= rules.relativeMinBusinessQuality) {
    positives.push(`Business quality ${components.business_quality_score}`);
  } else {
    negatives.push(`Business quality ${components.business_quality_score}`);
  }

  if (business.preview_status === "READY") positives.push("Preview READY");
  else negatives.push(`Preview ${business.preview_status ?? "missing"}`);

  if (components.contactability_score >= rules.hardMinContactability) {
    positives.push(`Contactability ${components.contactability_score}`);
  } else {
    negatives.push(`Weak contactability ${components.contactability_score}`);
  }

  // Confidence formula (0-100): certainty this is the right city pick
  let confidence =
    components.lead_score * 0.28 +
    Math.min(100, (margin ?? 0) * 6) * 0.18 +
    seo * 0.16 +
    components.business_quality_score * 0.12 +
    components.website_opportunity_score * 0.08 +
    components.contactability_score * 0.08 +
    completeness * 0.1;

  if (cityRank === 1) confidence += 4;
  if (business.preview_status === "READY") confidence += 3;
  if (path === "STRONG_ABSOLUTE") confidence += 6;
  if (path === "STRONG_RELATIVE") confidence += 5;
  if (path === "EXCEPTIONAL_OPPORTUNITY") confidence += 4;
  if (gatesFailed.length) confidence -= 25 + gatesFailed.length * 4;

  confidence = clamp(confidence);

  const selected =
    gatesFailed.length === 0 &&
    path !== "NONE" &&
    confidence >= rules.minWinnerConfidence;

  const evidence: WinnerEvidence = {
    city_rank: cityRank,
    lead_score: components.lead_score,
    margin,
    seo_opportunity: business.seo_opportunity_score != null ? seo : null,
    business_quality: components.business_quality_score,
    website_opportunity: components.website_opportunity_score,
    contactability: components.contactability_score,
    preview_status: business.preview_status ?? null,
    data_completeness: completeness,
    path,
    gates_failed: gatesFailed,
    positives: positives.slice(0, 8),
    negatives: negatives.slice(0, 8),
  };

  return {
    eligible: gatesFailed.length === 0,
    selected,
    path,
    winner_confidence: confidence,
    winner_reason: buildReason({
      name: business.studio_name,
      path,
      leadScore: components.lead_score,
      margin,
      seo,
      preview: business.preview_status ?? null,
      confidence,
      selected,
      gatesFailed,
    }),
    winner_evidence: evidence,
  };
}
