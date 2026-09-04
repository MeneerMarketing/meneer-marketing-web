import type { SupabaseClient } from "@supabase/supabase-js";
import {
  applySourceQualityCap,
  computeSourceQuality,
  explainOpportunityScore,
  selectPrimaryKeyword,
  validateConversionLeaks,
  type IntegrityAd,
  type IntegrityPage,
} from "../scoring/sourceIntegrity.js";
import { one } from "../../utils/one.js";
import { logger } from "../../utils/logger.js";

export async function validateOpportunitySourceIntegrity(
  client: SupabaseClient,
  opportunityId?: string
): Promise<{
  processed: number;
  updated: number;
  results: Array<Record<string, unknown>>;
}> {
  let query = client.from("opportunities").select(
    `
      id, brand_id, primary_ad_occurrence_id, keyword_id, landing_url, resolved_url,
      ad_headline, ad_description, paid_signal_type, paid_confirmed, opportunity_score,
      opportunity_verdict, audit_confidence, cro_gap, ad_landing_gap, rebuild_potential,
      latest_audit_id, resolved_page_id,
      brands ( normalized_domain, business_maturity_score, retailer_scale_score, platform ),
      pages (
        product_name, url, final_url, product_resolution_confidence, price
      ),
      keywords!opportunities_keyword_id_fkey ( id, keyword, category )
    `
  );

  if (opportunityId) {
    query = query.eq("id", opportunityId);
  }

  const { data: opportunities, error } = await query;
  if (error) throw new Error(error.message);

  const results: Array<Record<string, unknown>> = [];
  let updated = 0;

  for (const opp of opportunities ?? []) {
    const brand = one(opp.brands as Record<string, unknown> | Record<string, unknown>[]);
    const pageRow = one(opp.pages as Record<string, unknown> | Record<string, unknown>[]);

    const { data: linkedAds, error: adsError } = await client
      .from("opportunity_ad_occurrences")
      .select(
        `
        ad_occurrence_id,
        ad_occurrences (
          id, keyword_id, headline, description, landing_url, serp_item_type,
          ad_signal_type, confirmation_source,
          keywords ( id, keyword, category )
        )
      `
      )
      .eq("opportunity_id", opp.id);

    if (adsError) throw new Error(adsError.message);

    const ads: IntegrityAd[] = [];
    for (const link of linkedAds ?? []) {
      const ad = one(
        link.ad_occurrences as Record<string, unknown> | Record<string, unknown>[]
      );
      if (!ad) continue;
      const kw = one(ad.keywords as Record<string, unknown> | Record<string, unknown>[]);
      ads.push({
        id: ad.id as string,
        keywordId: (ad.keyword_id as string | null) ?? (kw?.id as string | null) ?? null,
        keyword: (kw?.keyword as string | null) ?? null,
        category: (kw?.category as string | null) ?? null,
        headline: (ad.headline as string | null) ?? null,
        description: (ad.description as string | null) ?? null,
        landingUrl: (ad.landing_url as string | null) ?? null,
        serpItemType: (ad.serp_item_type as string | null) ?? null,
        adSignalType: (ad.ad_signal_type as string | null) ?? null,
        confirmationSource: (ad.confirmation_source as string | null) ?? null,
      });
    }

    // Fallback: load primary ad directly if link table empty
    if (ads.length === 0 && opp.primary_ad_occurrence_id) {
      const { data: primary } = await client
        .from("ad_occurrences")
        .select(
          `id, keyword_id, headline, description, landing_url, serp_item_type, ad_signal_type, confirmation_source,
           keywords ( id, keyword, category )`
        )
        .eq("id", opp.primary_ad_occurrence_id)
        .maybeSingle();
      if (primary) {
        const kw = one(
          primary.keywords as Record<string, unknown> | Record<string, unknown>[]
        );
        ads.push({
          id: primary.id as string,
          keywordId:
            (primary.keyword_id as string | null) ?? (kw?.id as string | null) ?? null,
          keyword: (kw?.keyword as string | null) ?? null,
          category: (kw?.category as string | null) ?? null,
          headline: (primary.headline as string | null) ?? null,
          description: (primary.description as string | null) ?? null,
          landingUrl: (primary.landing_url as string | null) ?? null,
          serpItemType: (primary.serp_item_type as string | null) ?? null,
          adSignalType: (primary.ad_signal_type as string | null) ?? null,
          confirmationSource: (primary.confirmation_source as string | null) ?? null,
        });
      }
    }

    const page: IntegrityPage | null = pageRow
      ? {
          productName: (pageRow.product_name as string | null) ?? null,
          url: (pageRow.url as string | null) ?? null,
          finalUrl: (pageRow.final_url as string | null) ?? null,
          productResolutionConfidence:
            pageRow.product_resolution_confidence != null
              ? Number(pageRow.product_resolution_confidence)
              : null,
        }
      : null;

    const primaryKeyword = selectPrimaryKeyword({
      ads,
      primaryAdId: (opp.primary_ad_occurrence_id as string | null) ?? null,
      page,
    });

    const primaryAd =
      ads.find((a) => a.id === opp.primary_ad_occurrence_id) ?? ads[0] ?? null;

    const source = computeSourceQuality({
      primaryAd,
      page,
      primaryKeyword,
    });

    let scoreFormula: Record<string, unknown> | null = null;
    let findingValidations: Array<Record<string, unknown>> = [];
    let cappedScore: number | null =
      opp.opportunity_score != null ? Number(opp.opportunity_score) : null;
    let capApplied: number | null = null;
    let verdict = opp.opportunity_verdict as string | null;

    if (opp.latest_audit_id) {
      const { data: audit } = await client
        .from("audits")
        .select(
          "id, scoring_breakdown, conversion_leaks, page_representation, opportunity_score, opportunity_verdict"
        )
        .eq("id", opp.latest_audit_id)
        .maybeSingle();

      if (audit) {
        const breakdown = (audit.scoring_breakdown ?? {}) as {
          components?: Record<string, number>;
          penalty?: number;
        };
        const components = breakdown.components ?? {};
        const penalty = Number(breakdown.penalty ?? 0);
        const explained = explainOpportunityScore(components, penalty);
        const rawScore = explained.final;
        const capped = applySourceQualityCap(rawScore, source.sourceQualityScore);
        cappedScore = capped.cappedScore;
        capApplied = capped.capApplied;
        verdict = verdictFor(cappedScore);

        scoreFormula = {
          ...explained,
          penalty,
          sourceQualityScore: source.sourceQualityScore,
          sourceQualityCap: capApplied,
          uncappedScore: rawScore,
          finalScore: cappedScore,
          verdict,
        };

        findingValidations = validateConversionLeaks({
          leaks: (audit.conversion_leaks as Array<Record<string, unknown>>) ?? [],
          pageRepresentation:
            (audit.page_representation as Record<string, unknown> | null) ?? null,
          adHeadline: (opp.ad_headline as string | null) ?? primaryAd?.headline ?? null,
          productName: page?.productName ?? null,
          keyword: primaryKeyword.keyword,
        });

        await client
          .from("audits")
          .update({
            finding_validations: findingValidations,
            score_formula_breakdown: scoreFormula,
            opportunity_score: cappedScore,
            opportunity_verdict: verdict,
            updated_at: new Date().toISOString(),
          })
          .eq("id", audit.id);
      }
    }

    const { error: updateError } = await client
      .from("opportunities")
      .update({
        keyword_id: primaryKeyword.keywordId ?? opp.keyword_id,
        primary_keyword_confidence: primaryKeyword.confidence,
        primary_keyword_reason: primaryKeyword.reason,
        source_quality_score: source.sourceQualityScore,
        source_type: source.sourceType,
        discovery_serp_item_type: source.discoverySerpItemType,
        discovery_confirmation_source: source.discoveryConfirmationSource,
        source_integrity_notes: {
          ...source.notes,
          adProductMatch: source.adProductMatch,
          keywordProductMatch: source.keywordProductMatch,
          candidates: primaryKeyword.candidates,
          findingValidations,
          scoreFormula,
        },
        source_validated_at: new Date().toISOString(),
        ...(cappedScore != null
          ? {
              opportunity_score: cappedScore,
              opportunity_verdict: verdict,
            }
          : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", opp.id);

    if (updateError) throw new Error(updateError.message);
    updated += 1;

    results.push({
      domain: brand?.normalized_domain ?? null,
      opportunityId: opp.id,
      primaryKeyword: primaryKeyword.keyword,
      primaryKeywordConfidence: primaryKeyword.confidence,
      sourceType: source.sourceType,
      sourceQualityScore: source.sourceQualityScore,
      opportunityScore: cappedScore,
      verdict,
      capApplied,
      findingValidations,
    });

    logger.info("Source integrity validated", {
      domain: brand?.normalized_domain,
      sourceQuality: source.sourceQualityScore,
      keywordConfidence: primaryKeyword.confidence,
    });
  }

  return { processed: opportunities?.length ?? 0, updated, results };
}

function verdictFor(score: number): string {
  if (score >= 93) return "CONTACT_IMMEDIATELY";
  if (score >= 85) return "HIGH_PRIORITY";
  if (score >= 70) return "INTERESTING";
  if (score >= 50) return "LOW_PRIORITY";
  return "SKIP";
}
