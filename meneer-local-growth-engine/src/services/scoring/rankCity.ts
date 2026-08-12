import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import { scoreBusinessLead, type ScoreComponents } from "@/services/scoring/scoreBusiness";
import { evaluateCityWinner } from "@/services/scoring/winnerSelection";
import { pilatesScoringConfig } from "@/verticals/pilates/scoring";
import { generateBusinessPreview } from "@/services/preview-generation/generateBusinessPreview";
import type { Business } from "@/types/domain";

export interface CityRankingResult {
  cityId: string;
  cityName: string;
  verticalId: string;
  ranked: Array<{
    businessId: string;
    name: string;
    lead_score: number;
    city_rank: number;
    primary_candidate: boolean;
    winner_confidence: number;
    components: ScoreComponents;
  }>;
  winnerId: string | null;
  winnerName: string | null;
  winner_confidence: number | null;
  selection_reason?: string;
  anthropic_cost_usd: number;
}

export async function rankCityVertical(input: {
  cityId: string;
  verticalId?: string;
  verticalSlug?: string;
  selectWinner?: boolean;
  autoPreview?: boolean;
  /** provisional = ignore SEO gate; final = require SEO analyzed + hybrid winner rules */
  version?: "provisional" | "final";
}): Promise<CityRankingResult> {
  const client = createAdminClient();
  const config = pilatesScoringConfig;
  const version = input.version ?? "provisional";

  let verticalId = input.verticalId;
  if (!verticalId) {
    const { data: v } = await client
      .from("verticals")
      .select("id")
      .eq("slug", input.verticalSlug ?? "pilates")
      .single();
    if (!v) throw new Error("Vertical niet gevonden");
    verticalId = v.id as string;
  }

  const { data: city } = await client.from("cities").select("id,name").eq("id", input.cityId).single();
  if (!city) throw new Error("City niet gevonden");

  const { data: exclusivity } = await client
    .from("city_exclusivity")
    .select("*")
    .eq("vertical_id", verticalId)
    .eq("city_id", input.cityId)
    .maybeSingle();

  const { data: rows } = await client
    .from("businesses")
    .select("*")
    .eq("city_id", input.cityId)
    .eq("vertical_id", verticalId)
    .eq("is_demo", false);

  const businesses = (rows ?? []) as Business[];
  const scored: Array<{ business: Business; components: ScoreComponents }> = [];

  for (const business of businesses) {
    const components = await scoreBusinessLead(business, config, {
      skipWebsiteFetch: version === "final",
    });
    scored.push({ business, components });
  }

  scored.sort((a, b) => b.components.lead_score - a.components.lead_score);
  const now = new Date().toISOString();

  if (version === "final" && input.selectWinner !== false) {
    await client
      .from("businesses")
      .update({
        primary_candidate: false,
        primary_candidate_source: null,
        winner_confidence: null,
        winner_reason: null,
        winner_evidence: {},
        winner_path: null,
      })
      .eq("city_id", input.cityId)
      .eq("vertical_id", verticalId);

    await client
      .from("businesses")
      .update({ lead_status: "PREVIEW_READY" })
      .eq("city_id", input.cityId)
      .eq("vertical_id", verticalId)
      .eq("lead_status", "READY_FOR_OUTREACH")
      .eq("preview_status", "READY");

    await client
      .from("businesses")
      .update({ lead_status: "QUALIFIED" })
      .eq("city_id", input.cityId)
      .eq("vertical_id", verticalId)
      .eq("lead_status", "READY_FOR_OUTREACH")
      .neq("preview_status", "READY");
  }

  const secondScore = scored[1]?.components.lead_score ?? null;
  const cityLocked =
    exclusivity?.status === "EXCLUSIVE" || exclusivity?.status === "RESERVED";

  const ranked: CityRankingResult["ranked"] = [];
  let topEvaluation = null as ReturnType<typeof evaluateCityWinner> | null;

  for (let i = 0; i < scored.length; i++) {
    const { business, components } = scored[i]!;
    const city_rank = i + 1;
    const evaluation = evaluateCityWinner({
      business,
      components,
      cityRank: city_rank,
      secondLeadScore: city_rank === 1 ? secondScore : scored[0]?.components.lead_score ?? null,
      cityLocked,
    });

    if (city_rank === 1) topEvaluation = evaluation;

    await client
      .from("businesses")
      .update({
        lead_score: components.lead_score,
        score_components: components,
        city_rank,
        website_quality_score: components.website_quality_score,
        website_opportunity_score: components.website_opportunity_score,
        ranking_updated_at: now,
        ranking_version: version,
        winner_confidence: evaluation.winner_confidence,
        winner_reason: evaluation.winner_reason,
        winner_evidence: evaluation.winner_evidence,
        winner_path: evaluation.path,
        last_activity_at: now,
      })
      .eq("id", business.id);

    ranked.push({
      businessId: business.id,
      name: business.studio_name,
      lead_score: components.lead_score,
      city_rank,
      primary_candidate: false,
      winner_confidence: evaluation.winner_confidence,
      components,
    });
  }

  let winnerId: string | null = null;
  let winnerName: string | null = null;
  let winnerConfidence: number | null = null;
  let selection_reason = "Geen automatische winner";

  if (input.selectWinner !== false && !cityLocked && version === "final") {
    const top = scored[0];
    if (top && topEvaluation?.selected) {
      winnerId = top.business.id;
      winnerName = top.business.studio_name;
      winnerConfidence = topEvaluation.winner_confidence;
      selection_reason = topEvaluation.winner_reason;

      await client
        .from("businesses")
        .update({
          primary_candidate: true,
          primary_candidate_source: "auto_final",
          ranking_updated_at: now,
          ranking_version: "final",
          winner_confidence: topEvaluation.winner_confidence,
          winner_reason: topEvaluation.winner_reason,
          winner_evidence: topEvaluation.winner_evidence,
          winner_path: topEvaluation.path,
        })
        .eq("id", winnerId);

      for (const r of ranked) r.primary_candidate = r.businessId === winnerId;

      await client.from("city_exclusivity").upsert(
        {
          vertical_id: verticalId,
          city_id: input.cityId,
          status: "PRIMARY_CANDIDATE",
          business_id: winnerId,
          notes: selection_reason,
          winner_confidence: topEvaluation.winner_confidence,
          winner_reason: topEvaluation.winner_reason,
          winner_evidence: topEvaluation.winner_evidence,
          updated_at: now,
        },
        { onConflict: "vertical_id,city_id" }
      );

      await writeActivity(client, {
        business_id: winnerId,
        activity_type: "PRIMARY_CANDIDATE_SELECTED",
        title: `FINAL PRIMARY · ${winnerName}`,
        description: selection_reason,
        metadata: {
          city_id: input.cityId,
          lead_score: top.components.lead_score,
          winner_confidence: topEvaluation.winner_confidence,
          path: topEvaluation.path,
          seo_opportunity: top.business.seo_opportunity_score,
        },
      });

      const shouldPreview =
        (input.autoPreview ?? config.autoGenerateWinnerPreview) &&
        (top.business.preview_status === "NOT_GENERATED" || !top.business.preview_status);
      if (shouldPreview) await generateBusinessPreview(winnerId);
      await maybeMarkReadyForOutreach(winnerId);
    } else {
      selection_reason =
        topEvaluation?.winner_reason ??
        (top
          ? `Geen winner: #1 score ${top.components.lead_score} faalt hybride regels`
          : "Geen kandidaten in stad");
      await client
        .from("city_exclusivity")
        .upsert(
          {
            vertical_id: verticalId,
            city_id: input.cityId,
            status: "AVAILABLE",
            business_id: null,
            notes: selection_reason,
            winner_confidence: topEvaluation?.winner_confidence ?? null,
            winner_reason: selection_reason,
            winner_evidence: topEvaluation?.winner_evidence ?? {},
            updated_at: now,
          },
          { onConflict: "vertical_id,city_id" }
        );
      await writeActivity(client, {
        activity_type: "CITY_RERANKED",
        title: `Final ranking · ${city.name} · geen auto-winner`,
        description: selection_reason,
        metadata: {
          winner_confidence: topEvaluation?.winner_confidence ?? null,
          path: topEvaluation?.path ?? "NONE",
        },
      });
    }
  } else if (cityLocked) {
    selection_reason = `Stad gelocked (${exclusivity?.status}) — geen auto-winner`;
  } else if (input.selectWinner !== false && version === "provisional") {
    selection_reason = "Provisional ranking — geen auto PRIMARY tot SEO final";
  }

  await writeActivity(client, {
    activity_type: "CITY_RANKING_COMPLETED",
    title: `City ranking ${version} · ${city.name}`,
    description: `${ranked.length} studios · winner ${winnerName ?? "geen"} · ${selection_reason}`,
    metadata: {
      city_id: input.cityId,
      vertical_id: verticalId,
      version,
      winner_confidence: winnerConfidence,
    },
  });

  return {
    cityId: input.cityId,
    cityName: city.name as string,
    verticalId: verticalId!,
    ranked,
    winnerId,
    winnerName,
    winner_confidence: winnerConfidence,
    anthropic_cost_usd: 0,
    selection_reason,
  };
}

export async function maybeMarkReadyForOutreach(businessId: string): Promise<boolean> {
  const client = createAdminClient();
  const config = pilatesScoringConfig;
  const { data: business } = await client.from("businesses").select("*").eq("id", businessId).single();
  if (!business) return false;

  const { data: seo } = await client
    .from("seo_opportunities")
    .select("id, status, seo_opportunity_score, analyzed_at")
    .eq("business_id", businessId)
    .maybeSingle();

  const { data: exclusivity } = await client
    .from("city_exclusivity")
    .select("*")
    .eq("vertical_id", business.vertical_id)
    .eq("city_id", business.city_id)
    .maybeSingle();

  const components = (business.score_components ?? {}) as Partial<ScoreComponents>;
  const contactScore = Number(components.contactability_score ?? 0);
  const exclusiveOther =
    exclusivity?.status === "EXCLUSIVE" &&
    exclusivity.business_id &&
    exclusivity.business_id !== businessId;

  const seoOk =
    Boolean(seo?.analyzed_at) &&
    seo?.status !== "NOT_ANALYZED" &&
    seo?.status !== "FAILED" &&
    seo?.status !== "ANALYZING";

  const confidence = Number(business.winner_confidence ?? 0);
  const confidenceOk =
    business.primary_candidate_source === "manual" ||
    confidence >= config.winnerRules.minConfidenceForOutreach;

  const ready =
    business.primary_candidate === true &&
    (business.ranking_version === "final" ||
      business.primary_candidate_source === "manual") &&
    confidenceOk &&
    business.preview_status === "READY" &&
    contactScore >= config.contactabilityMinForOutreach &&
    seoOk &&
    !exclusiveOther &&
    exclusivity?.status !== "EXCLUSIVE" &&
    business.lead_status !== "DO_NOT_CONTACT";

  if (ready && business.lead_status !== "READY_FOR_OUTREACH") {
    await client
      .from("businesses")
      .update({
        lead_status: "READY_FOR_OUTREACH",
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", businessId);
    await writeActivity(client, {
      business_id: businessId,
      activity_type: "STATUS_CHANGED",
      title: "READY_FOR_OUTREACH",
      description: `Primary + confidence ${confidence} + preview + SEO + contactability`,
    });
  }
  return ready;
}

export async function setPrimaryCandidateManual(input: {
  businessId: string;
  note?: string;
}): Promise<void> {
  const client = createAdminClient();
  const { data: business } = await client
    .from("businesses")
    .select("*")
    .eq("id", input.businessId)
    .single();
  if (!business) throw new Error("Business niet gevonden");

  await client
    .from("businesses")
    .update({ primary_candidate: false })
    .eq("vertical_id", business.vertical_id)
    .eq("city_id", business.city_id);

  const reason = input.note ?? "Handmatige override";
  await client
    .from("businesses")
    .update({
      primary_candidate: true,
      primary_candidate_source: "manual",
      ranking_updated_at: new Date().toISOString(),
      winner_confidence: 100,
      winner_reason: reason,
      winner_path: "MANUAL",
      winner_evidence: {
        path: "MANUAL",
        note: reason,
        positives: ["Handmatige override"],
        negatives: [],
      },
    })
    .eq("id", input.businessId);

  await client.from("city_exclusivity").upsert(
    {
      vertical_id: business.vertical_id,
      city_id: business.city_id,
      status: "PRIMARY_CANDIDATE",
      business_id: input.businessId,
      notes: reason,
      winner_confidence: 100,
      winner_reason: reason,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "vertical_id,city_id" }
  );

  await writeActivity(client, {
    business_id: input.businessId,
    activity_type: "CITY_WINNER_OVERRIDE",
    title: `Handmatige PRIMARY_CANDIDATE · ${business.studio_name}`,
    description: reason,
  });

  await maybeMarkReadyForOutreach(input.businessId);
}

export async function clearPrimaryCandidate(input: {
  cityId: string;
  verticalId: string;
}): Promise<void> {
  const client = createAdminClient();
  await client
    .from("businesses")
    .update({
      primary_candidate: false,
      winner_confidence: null,
      winner_reason: null,
      winner_path: null,
    })
    .eq("city_id", input.cityId)
    .eq("vertical_id", input.verticalId);

  await client
    .from("city_exclusivity")
    .update({
      status: "AVAILABLE",
      business_id: null,
      notes: "Winner verwijderd",
      winner_confidence: null,
      winner_reason: null,
      updated_at: new Date().toISOString(),
    })
    .eq("city_id", input.cityId)
    .eq("vertical_id", input.verticalId);

  await writeActivity(client, {
    activity_type: "CITY_WINNER_CLEARED",
    title: "PRIMARY_CANDIDATE verwijderd",
    metadata: input,
  });
}
