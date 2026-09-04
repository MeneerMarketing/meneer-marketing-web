import { createAdminClient } from "@/lib/supabase/admin";
import { pilatesAcquisitionFitConfig } from "@/verticals/pilates";

export interface VisualCandidateRow {
  business_id: string;
  studio_name: string;
  website_url: string | null;
  website_transformation_score: number | null;
  website_opportunity_score: number | null;
  business_quality_score: number | null;
  prospect_type: string | null;
  preview_eligible: boolean;
  recommended: boolean;
  recommend_reason: string | null;
  already_judged: boolean;
}

/**
 * Goedkope preselectie voor Claude Vision. Geen AI — alleen signalen die we al
 * hebben na fase A (deterministische website crawl + fit).
 */
export async function recommendVisualCandidates(input: {
  cityId: string;
  verticalId: string;
  limit?: number;
}): Promise<VisualCandidateRow[]> {
  const client = createAdminClient();
  const config = pilatesAcquisitionFitConfig.visualJudge;
  const limit = input.limit ?? config.maxCandidatesPerCity;

  const { data: rows } = await client
    .from("businesses")
    .select(
      "id, studio_name, website_url, website_transformation_score, website_opportunity_score, business_quality_score, prospect_type, preview_eligible, visual_assessment_source, visual_assessed_at, qualification_status, is_chain, lead_status"
    )
    .eq("vertical_id", input.verticalId)
    .eq("city_id", input.cityId)
    .eq("is_demo", false)
    .in("qualification_status", ["QUALIFIED", "POTENTIAL"]);

  const candidates = (rows ?? [])
    .map((row) => {
      const businessQuality = Number(row.business_quality_score ?? 0);
      const websiteOpportunity = Number(row.website_opportunity_score ?? 0);
      const transformationScore =
        row.website_transformation_score != null
          ? Number(row.website_transformation_score)
          : null;
      const hasWebsite = Boolean(row.website_url);
      const alreadyJudged = row.visual_assessment_source === "CLAUDE_VISION";

      let recommended = false;
      let recommendReason: string | null = null;

      if (
        hasWebsite &&
        !row.is_chain &&
        row.lead_status !== "DO_NOT_CONTACT" &&
        businessQuality >= config.minBusinessQuality &&
        websiteOpportunity >= config.minWebsiteOpportunity
      ) {
        recommended = true;
        recommendReason = "Eigen site + voldoende business quality en website opportunity";
      }

      return {
        business_id: String(row.id),
        studio_name: String(row.studio_name),
        website_url: row.website_url ? String(row.website_url) : null,
        website_transformation_score: transformationScore,
        website_opportunity_score:
          row.website_opportunity_score != null
            ? Number(row.website_opportunity_score)
            : null,
        business_quality_score:
          row.business_quality_score != null ? Number(row.business_quality_score) : null,
        prospect_type: row.prospect_type ? String(row.prospect_type) : null,
        preview_eligible: Boolean(row.preview_eligible),
        recommended,
        recommend_reason: recommendReason,
        already_judged: alreadyJudged,
      };
    })
    .sort((a, b) => {
      const scoreA = a.website_transformation_score ?? a.website_opportunity_score ?? 0;
      const scoreB = b.website_transformation_score ?? b.website_opportunity_score ?? 0;
      return scoreB - scoreA;
    });

  const recommendedFirst = [
    ...candidates.filter((row) => row.recommended && !row.already_judged),
    ...candidates.filter((row) => !row.recommended || row.already_judged),
  ];

  return recommendedFirst.slice(0, limit);
}

export function estimateVisualAnalysisCost(candidateCount: number): number {
  const perBusiness = 0.012;
  return Math.round(candidateCount * perBusiness * 1000) / 1000;
}
