import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import {
  detectServiceTypesFromBusiness,
  generateCityKeywordUniverse,
  generateKeywordsForCity,
} from "@/services/seo/keywordGenerator";
import {
  clusteredDemand,
  fetchKeywordMetricsCached,
} from "@/services/seo/keywordMetricsService";
import { fetchSerpCached } from "@/services/seo/serpRankingService";
import { scoreSeoOpportunity } from "@/services/seo/seoOpportunityScorer";
import { rankCityVertical } from "@/services/scoring/rankCity";
import type { Business } from "@/types/domain";

export interface SeoCityRunResult {
  city: string;
  keywords: Array<{ keyword: string; cluster: string; volume: number | null }>;
  clustered_demand: number;
  studios: Array<{
    name: string;
    visibility: number;
    seo_opportunity: number;
    lead_score: number | null;
    city_rank: number | null;
    primary: boolean;
    primary_keyword: string;
    current_rank: number | null;
  }>;
  winner: string | null;
  selection_reason?: string;
  api_calls: number;
  api_cost: number;
  cache_hits: number;
  errors: string[];
}

export async function runCitySeoAnalysis(input: {
  citySlug: string;
  verticalSlug?: string;
}): Promise<SeoCityRunResult> {
  const client = createAdminClient();
  const verticalSlug = input.verticalSlug ?? "pilates";
  const maxCost = Number(process.env.SEO_MAX_COST_PER_RUN ?? 0.5);
  const maxKeywords = Number(process.env.SEO_MAX_KEYWORDS_PER_CITY ?? 8);
  const maxSerpPerBusiness = Number(process.env.SEO_MAX_SERP_KEYWORDS_PER_BUSINESS ?? 3);
  const maxCities = Number(process.env.SEO_MAX_CITIES_PER_RUN ?? 1);

  let apiCost = 0;
  let apiCalls = 0;
  let cacheHits = 0;
  const errors: string[] = [];

  if (maxCities < 1) {
    throw new Error("SEO_MAX_CITIES_PER_RUN < 1");
  }

  try {
  const { data: city } = await client
    .from("cities")
    .select("*")
    .eq("slug", input.citySlug)
    .single();
  if (!city) throw new Error(`City ${input.citySlug} ontbreekt`);

  const { data: vertical } = await client
    .from("verticals")
    .select("id")
    .eq("slug", verticalSlug)
    .single();
  if (!vertical) throw new Error("Vertical ontbreekt");

  const { data: rows } = await client
    .from("businesses")
    .select("*")
    .eq("city_id", city.id)
    .eq("vertical_id", vertical.id)
    .eq("is_demo", false);

  const businesses = (rows ?? []) as Business[];

  await writeActivity(client, {
    activity_type: "SEO_ANALYSIS_STARTED",
    title: `SEO analysis · ${city.name}`,
    description: `${businesses.length} studios · budget $${maxCost}`,
    metadata: { city_slug: input.citySlug },
  });

  const serviceSets = businesses.map((b) =>
    detectServiceTypesFromBusiness({
      primary_service: b.primary_service,
      services: b.services,
      google_category: b.google_category,
      additional_categories: b.additional_categories,
      description: b.description,
      tagline: b.tagline,
      studio_name: b.studio_name,
    })
  );

  let cityKeywords = generateCityKeywordUniverse(city.name as string, serviceSets).slice(
    0,
    maxKeywords
  );

  // Prefer PRIMARY/SECONDARY first
  cityKeywords = [
    ...cityKeywords.filter((k) => k.intent === "PRIMARY" || k.intent === "SECONDARY"),
    ...cityKeywords.filter((k) => k.intent !== "PRIMARY" && k.intent !== "SECONDARY"),
  ].slice(0, maxKeywords);

  const metricsResult = await fetchKeywordMetricsCached({
    verticalSlug,
    citySlug: input.citySlug,
    keywords: cityKeywords,
    maxCostRemaining: maxCost - apiCost,
  });
  apiCost += metricsResult.cost;
  apiCalls += metricsResult.apiCalls;
  cacheHits += metricsResult.cacheHits;

  await writeActivity(client, {
    activity_type: "KEYWORD_METRICS_FETCHED",
    title: `Keyword metrics · ${city.name}`,
    description: `${metricsResult.metrics.length} keywords · $${metricsResult.cost.toFixed(4)} · cache ${metricsResult.cacheHits}`,
  });

  const demand = clusteredDemand(metricsResult.metrics);

  // Shared SERP for top city keywords (cache per city+keyword)
  const topKeywords = [...metricsResult.metrics]
    .sort((a, b) => Number(b.search_volume ?? 0) - Number(a.search_volume ?? 0))
    .slice(0, Math.max(maxSerpPerBusiness, 3));

  const citySerps = [];
  for (const kw of topKeywords) {
    if (apiCost >= maxCost) {
      errors.push("SEO budget bereikt bij SERP");
      break;
    }
    try {
      const serp = await fetchSerpCached({
        verticalSlug,
        citySlug: input.citySlug,
        keyword: kw.keyword,
        maxCostRemaining: maxCost - apiCost,
      });
      apiCost += serp.cost;
      if (serp.cache_hit) cacheHits += 1;
      else apiCalls += 1;
      citySerps.push(serp);
    } catch (err) {
      errors.push(
        `SERP ${kw.keyword}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  await writeActivity(client, {
    activity_type: "SERP_RANKINGS_FETCHED",
    title: `SERP · ${city.name}`,
    description: `${citySerps.length} keywords · cost $${apiCost.toFixed(4)}`,
  });

  for (const business of businesses) {
    try {
      await client
        .from("seo_opportunities")
        .update({ status: "ANALYZING", updated_at: new Date().toISOString() })
        .eq("business_id", business.id);

      const types = detectServiceTypesFromBusiness({
        primary_service: business.primary_service,
        services: business.services,
        google_category: business.google_category,
        additional_categories: business.additional_categories,
        description: business.description,
        tagline: business.tagline,
        studio_name: business.studio_name,
      });

      const bizKeywords = generateKeywordsForCity(city.name as string, types);
      const relevantMetrics = metricsResult.metrics.filter((m) =>
        bizKeywords.some((bk) => bk.keyword.toLowerCase() === m.keyword.toLowerCase())
      );
      // Ensure at least core keywords
      const metricsForBiz =
        relevantMetrics.length > 0
          ? relevantMetrics
          : metricsResult.metrics.filter((m) => m.cluster === "pilates_core");

      const serpForBiz = citySerps.filter((s) =>
        metricsForBiz.some((m) => m.keyword.toLowerCase() === s.keyword.toLowerCase())
      );

      const scored = scoreSeoOpportunity({
        business,
        metrics: metricsForBiz,
        serps: serpForBiz,
        serviceTypes: types,
      });

      const seoPayload = {
        business_id: business.id,
        vertical_id: vertical.id,
        city_id: city.id,
        primary_keyword: scored.primary_keyword,
        secondary_keywords: scored.secondary_keywords,
        primary_search_volume: scored.primary_search_volume,
        total_clustered_demand: scored.total_clustered_demand,
        current_rank: scored.current_rank,
        current_ranking_url: scored.current_ranking_url,
        visibility_score: scored.visibility_score,
        seo_readiness_score: scored.seo_readiness_score,
        seo_opportunity_score: scored.seo_opportunity_score,
        opportunity_components: scored.components,
        keyword_metrics: scored.keyword_rows,
        competitor_snapshot: scored.competitors,
        status: scored.status,
        analyzed_at: new Date().toISOString(),
        ranking_version: "final",
        notes: "Milestone 6 SEO analysis",
        updated_at: new Date().toISOString(),
      };

      const { data: existing } = await client
        .from("seo_opportunities")
        .select("id")
        .eq("business_id", business.id)
        .maybeSingle();
      if (existing?.id) {
        await client.from("seo_opportunities").update(seoPayload).eq("id", existing.id);
      } else {
        await client.from("seo_opportunities").insert(seoPayload);
      }

      await client
        .from("businesses")
        .update({
          seo_opportunity_score: scored.seo_opportunity_score,
          seo_visibility_score: scored.visibility_score,
          seo_readiness_score: scored.seo_readiness_score,
          primary_seo_keyword: scored.primary_keyword,
          secondary_seo_keywords: scored.secondary_keywords,
          last_activity_at: new Date().toISOString(),
        })
        .eq("id", business.id);

      await writeActivity(client, {
        business_id: business.id,
        activity_type: "SEO_OPPORTUNITY_CALCULATED",
        title: `SEO opportunity ${scored.seo_opportunity_score} · ${business.studio_name}`,
        description: `${scored.status} · ${scored.primary_keyword} · rank ${scored.current_rank ?? "n/a"}`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`${business.studio_name}: ${message}`);
      await client
        .from("seo_opportunities")
        .update({ status: "FAILED", notes: message })
        .eq("business_id", business.id);
    }
  }

  // Final re-rank with SEO in lead score (clears Milestone 5 development override)
  const ranking = await rankCityVertical({
    cityId: city.id as string,
    verticalId: vertical.id as string,
    selectWinner: true,
    version: "final",
    autoPreview: false,
  });

  await writeActivity(client, {
    activity_type: "SEO_ANALYSIS_COMPLETED",
    title: `SEO analysis completed · ${city.name}`,
    description: `cost $${apiCost.toFixed(4)} · winner ${ranking.winnerName ?? "geen"}`,
    metadata: { api_cost: apiCost, api_calls: apiCalls, cache_hits: cacheHits },
  });

  // Reload businesses for report
  const { data: refreshed } = await client
    .from("businesses")
    .select(
      "id, studio_name, seo_visibility_score, seo_opportunity_score, lead_score, city_rank, primary_candidate, primary_seo_keyword, primary_candidate_source"
    )
    .eq("city_id", city.id)
    .eq("vertical_id", vertical.id)
    .eq("is_demo", false)
    .order("city_rank", { ascending: true });

  const { data: seoRows } = await client
    .from("seo_opportunities")
    .select("business_id, current_rank, primary_keyword")
    .eq("city_id", city.id);

  return {
    city: city.name as string,
    keywords: metricsResult.metrics.map((m) => ({
      keyword: m.keyword,
      cluster: m.cluster,
      volume: m.search_volume,
    })),
    clustered_demand: demand.total,
    studios: (refreshed ?? []).map((b) => {
      const seo = (seoRows ?? []).find((s) => s.business_id === b.id);
      return {
        name: b.studio_name as string,
        visibility: Number(b.seo_visibility_score ?? 0),
        seo_opportunity: Number(b.seo_opportunity_score ?? 0),
        lead_score: b.lead_score != null ? Number(b.lead_score) : null,
        city_rank: b.city_rank != null ? Number(b.city_rank) : null,
        primary: Boolean(b.primary_candidate),
        primary_keyword: (seo?.primary_keyword as string) ?? (b.primary_seo_keyword as string) ?? "",
        current_rank: seo?.current_rank != null ? Number(seo.current_rank) : null,
      };
    }),
    winner: ranking.winnerName,
    selection_reason: ranking.selection_reason,
    api_calls: apiCalls,
    api_cost: apiCost,
    cache_hits: cacheHits,
    errors,
  };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await writeActivity(client, {
      activity_type: "SEO_ANALYSIS_FAILED",
      title: `SEO analysis failed · ${input.citySlug}`,
      description: message,
    });
    throw err;
  }
}
