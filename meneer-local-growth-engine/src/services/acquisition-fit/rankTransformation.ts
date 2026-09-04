import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import { getVerticalRuntime } from "@/verticals/runtime";
import { isCityManuallyProtected } from "@/services/city-outreach/cityAcquisitionProtection";

/**
 * Transformation city ranking (M8.3).
 *
 * Ranks only WEBSITE_TRANSFORMATION prospects. The overall city ranking keeps
 * existing behaviour for business intelligence; this ranking decides who gets
 * the redesign preview and the redesign outreach.
 */

export interface TransformationRankRow {
  business_id: string;
  studio_name: string;
  transformation_score: number;
  transformation_city_rank: number;
  preview_eligible: boolean;
  contactability: number;
  margin: number | null;
  winner_confidence: number;
  is_primary: boolean;
}

export interface TransformationRankingResult {
  city_id: string;
  city_name: string;
  vertical_id: string;
  candidates: TransformationRankRow[];
  primary_candidate_id: string | null;
  primary_candidate_name: string | null;
  winner_confidence: number | null;
  selection_reason: string;
  gates_failed: string[];
  totals: {
    website_transformation: number;
    growth_only: number;
    weak_business: number;
    not_eligible: number;
    unknown: number;
    discovered: number;
    qualified: number;
  };
}

interface CandidateRow {
  id: string;
  studio_name: string;
  website_transformation_score: number;
  preview_eligible: boolean;
  lead_eligible: boolean;
  is_chain: boolean;
  lead_status: string;
  transformation_components: Record<string, unknown> | null;
  visual_assessment_confidence: number | null;
  visual_assessment_source: string | null;
}

function contactabilityOf(row: CandidateRow): number {
  const components = row.transformation_components as { contactability?: number } | null;
  return Number(components?.contactability ?? 0);
}

/**
 * Confidence in the transformation winner: how safely can we build a preview
 * and send a redesign proposal to this specific studio.
 */
function transformationConfidence(input: {
  score: number;
  margin: number | null;
  contactability: number;
  previewEligible: boolean;
  visualConfidence: number | null;
  visualFromClaude: boolean;
  config: ReturnType<typeof getVerticalRuntime>["acquisitionFitConfig"];
  scoringConfig: ReturnType<typeof getVerticalRuntime>["scoringConfig"];
}): number {
  const hardMinContact = input.scoringConfig.winnerRules.hardMinContactability;

  // Certainty about the pick, not a second copy of the score: how clearly this
  // studio leads the field, how solid the evidence is, and whether we can
  // actually act on it.
  let confidence = 40;

  confidence += input.margin == null ? 6 : Math.min(20, Math.max(0, input.margin) * 2);

  if (input.visualFromClaude && input.visualConfidence != null) {
    confidence += Math.max(0, Math.min(15, ((input.visualConfidence - 50) / 50) * 15));
  }

  confidence += Math.max(
    0,
    Math.min(10, ((input.contactability - hardMinContact) / (100 - hardMinContact)) * 10)
  );

  if (input.previewEligible) confidence += 10;

  const headroom = input.score - input.config.transformationPrimaryMinScore;
  confidence += Math.max(
    0,
    Math.min(
      15,
      (headroom / (100 - input.config.transformationPrimaryMinScore)) * 15,
    ),
  );

  return Math.max(0, Math.min(100, Math.round(confidence)));
}

export async function rankCityTransformation(input: {
  cityId: string;
  verticalSlug?: string;
  verticalId?: string;
  selectPrimary?: boolean;
}): Promise<TransformationRankingResult> {
  const client = createAdminClient();
  const verticalSlug = input.verticalSlug ?? "pilates";
  const runtime = getVerticalRuntime(verticalSlug);
  const config = runtime.acquisitionFitConfig;

  let verticalId = input.verticalId ?? null;
  if (!verticalId) {
    const { data: vertical } = await client
      .from("verticals")
      .select("id")
      .eq("slug", input.verticalSlug ?? "pilates")
      .maybeSingle();
    verticalId = vertical?.id ? String(vertical.id) : null;
  }
  if (!verticalId) throw new Error("Vertical niet gevonden");

  const { data: city } = await client
    .from("cities")
    .select("name, slug")
    .eq("id", input.cityId)
    .maybeSingle();

  const cityProtection = await isCityManuallyProtected({
    verticalId,
    cityId: input.cityId,
    citySlug: city?.slug as string | undefined,
  });

  if (cityProtection.protected) {
    return {
      city_id: input.cityId,
      city_name: String(city?.name ?? ""),
      vertical_id: verticalId,
      candidates: [],
      primary_candidate_id: null,
      primary_candidate_name: null,
      winner_confidence: null,
      selection_reason: "Klantstad: geen outreach (Hills Pilates, Apeldoorn).",
      gates_failed: ["client_city_blocked"],
      totals: {
        website_transformation: 0,
        growth_only: 0,
        weak_business: 0,
        not_eligible: 0,
        unknown: 0,
        discovered: 0,
        qualified: 0,
      },
    };
  }

  const { data: rows } = await client
    .from("businesses")
    .select(
      "id, studio_name, prospect_type, website_transformation_score, preview_eligible, lead_eligible, is_chain, lead_status, qualification_status, transformation_components, visual_assessment_confidence, visual_assessment_source"
    )
    .eq("vertical_id", verticalId)
    .eq("city_id", input.cityId)
    .eq("is_demo", false);

  const all = rows ?? [];
  const totals = {
    website_transformation: all.filter((r) => r.prospect_type === "WEBSITE_TRANSFORMATION").length,
    growth_only: all.filter((r) => r.prospect_type === "GROWTH_ONLY").length,
    weak_business: all.filter((r) => r.prospect_type === "WEAK_BUSINESS").length,
    not_eligible: all.filter((r) => r.prospect_type === "NOT_ELIGIBLE").length,
    unknown: all.filter((r) => !r.prospect_type || r.prospect_type === "UNKNOWN").length,
    discovered: all.length,
    qualified: all.filter((r) =>
      ["QUALIFIED", "POTENTIAL"].includes(String(r.qualification_status))
    ).length,
  };

  const candidates = all
    .filter((r) => r.prospect_type === "WEBSITE_TRANSFORMATION")
    .map((r) => ({
      id: String(r.id),
      studio_name: String(r.studio_name),
      website_transformation_score: Number(r.website_transformation_score ?? 0),
      preview_eligible: Boolean(r.preview_eligible),
      lead_eligible: r.lead_eligible !== false,
      is_chain: Boolean(r.is_chain),
      lead_status: String(r.lead_status ?? ""),
      transformation_components: (r.transformation_components ?? null) as Record<
        string,
        unknown
      > | null,
      visual_assessment_confidence:
        r.visual_assessment_confidence != null ? Number(r.visual_assessment_confidence) : null,
      visual_assessment_source: r.visual_assessment_source
        ? String(r.visual_assessment_source)
        : null,
    }))
    .sort((a, b) => b.website_transformation_score - a.website_transformation_score);

  // Clear ranks and the previous winner for this city first, then write the
  // new order. The overall M8.2 primary_candidate is left untouched.
  await client
    .from("businesses")
    .update({
      transformation_city_rank: null,
      transformation_primary_candidate: false,
      transformation_winner_confidence: null,
      transformation_winner_reason: null,
    })
    .eq("vertical_id", verticalId)
    .eq("city_id", input.cityId);

  const second = candidates[1]?.website_transformation_score ?? null;
  const ranked: TransformationRankRow[] = [];
  const nowIso = new Date().toISOString();

  for (const [index, row] of candidates.entries()) {
    const rank = index + 1;
    const margin =
      rank === 1 && second != null
        ? Number((row.website_transformation_score - second).toFixed(1))
        : null;
    const confidence = transformationConfidence({
      score: row.website_transformation_score,
      margin,
      contactability: contactabilityOf(row),
      previewEligible: row.preview_eligible,
      visualConfidence: row.visual_assessment_confidence,
      visualFromClaude: row.visual_assessment_source === "CLAUDE_VISION",
      config,
      scoringConfig: runtime.scoringConfig,
    });

    await client
      .from("businesses")
      .update({
        transformation_city_rank: rank,
        transformation_rank_updated_at: nowIso,
        transformation_winner_confidence: confidence,
      })
      .eq("id", row.id);

    ranked.push({
      business_id: row.id,
      studio_name: row.studio_name,
      transformation_score: row.website_transformation_score,
      transformation_city_rank: rank,
      preview_eligible: row.preview_eligible,
      contactability: contactabilityOf(row),
      margin,
      winner_confidence: confidence,
      is_primary: false,
    });
  }

  // ---------- primary candidate within the transformation pool ----------
  const gatesFailed: string[] = [];
  let primaryId: string | null = null;
  let primaryName: string | null = null;
  let primaryConfidence: number | null = null;
  let selectionReason = "Geen geschikte transformation candidate in deze stad.";

  const top = ranked[0];
  const topRow = candidates[0];

  if (!top || !topRow) {
    gatesFailed.push("no_transformation_candidates");
  } else {
    if (!topRow.preview_eligible) gatesFailed.push("not_preview_eligible");
    if (!topRow.lead_eligible) gatesFailed.push("not_lead_eligible");
    if (topRow.is_chain) gatesFailed.push("is_chain");
    if (topRow.lead_status === "DO_NOT_CONTACT") gatesFailed.push("do_not_contact");
    if (top.transformation_score < config.transformationPrimaryMinScore) {
      gatesFailed.push("transformation_score_below_min");
    }
    if (top.contactability < runtime.scoringConfig.winnerRules.hardMinContactability) {
      gatesFailed.push("contactability_below_min");
    }
    if (
      top.margin != null &&
      top.margin < config.transformationPrimaryMinMargin
    ) {
      gatesFailed.push("margin_too_thin");
    }
    if (top.winner_confidence < runtime.scoringConfig.winnerRules.minWinnerConfidence) {
      gatesFailed.push("winner_confidence_too_low");
    }

    if (!gatesFailed.length) {
      primaryId = top.business_id;
      primaryName = top.studio_name;
      primaryConfidence = top.winner_confidence;
      top.is_primary = true;
      selectionReason =
        `Hoogste transformation score (${top.transformation_score})` +
        (top.margin != null ? ` met ${top.margin} punten marge op #2` : " zonder tegenkandidaat") +
        `, preview eligible, confidence ${top.winner_confidence}.`;
    } else {
      selectionReason = `Geen redesign-winner: ${gatesFailed.join(", ")}.`;
    }
  }

  if (input.selectPrimary !== false && primaryId) {
    await client
      .from("businesses")
      .update({
        transformation_primary_candidate: true,
        transformation_winner_reason: selectionReason,
      })
      .eq("id", primaryId);

    await writeActivity(client, {
      business_id: primaryId,
      activity_type: "TRANSFORMATION_WINNER_SELECTED",
      title: `Redesign winner: ${primaryName}`,
      description: selectionReason,
      metadata: {
        city_id: input.cityId,
        transformation_score: top?.transformation_score,
        winner_confidence: primaryConfidence,
      },
    });
  }

  await writeActivity(client, {
    activity_type: "TRANSFORMATION_RANKING_COMPLETED",
    title: `Transformation ranking · ${city?.name ?? "stad"}`,
    description: `${ranked.length} transformation candidates · ${totals.growth_only} growth-only · ${totals.weak_business} zwak`,
    metadata: { city_id: input.cityId, totals, primary_candidate_id: primaryId },
  });

  return {
    city_id: input.cityId,
    city_name: String(city?.name ?? ""),
    vertical_id: verticalId,
    candidates: ranked,
    primary_candidate_id: primaryId,
    primary_candidate_name: primaryName,
    winner_confidence: primaryConfidence,
    selection_reason: selectionReason,
    gates_failed: gatesFailed,
    totals,
  };
}
