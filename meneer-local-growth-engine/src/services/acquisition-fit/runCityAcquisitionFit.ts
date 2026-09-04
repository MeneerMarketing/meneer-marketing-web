import { createAdminClient } from "@/lib/supabase/admin";
import {
  evaluateAcquisitionFit,
  type AcquisitionFitResult,
} from "@/services/acquisition-fit/evaluateAcquisitionFit";
import {
  rankCityTransformation,
  type TransformationRankingResult,
} from "@/services/acquisition-fit/rankTransformation";
import { getVerticalRuntime } from "@/verticals/runtime";

/**
 * City-level acquisition fit run (M8.3).
 *
 * Evaluates every non-demo business in a city, keeps a shared Anthropic budget
 * so a single city can never run away with cost, then ranks the transformation
 * pool and records an auditable run row.
 */

export interface CityAcquisitionFitInput {
  citySlug?: string;
  cityId?: string;
  verticalSlug?: string;
  deterministicOnly?: boolean;
  useCache?: boolean;
  maxAnthropicCost?: number;
  /** Only evaluate these business ids (used by regression fixtures). */
  businessIds?: string[];
}

export interface CityAcquisitionFitResult {
  run_id: string | null;
  city_id: string;
  city_name: string;
  evaluated: AcquisitionFitResult[];
  ranking: TransformationRankingResult;
  anthropic_cost: number;
  screenshots_captured: number;
  visual_analyses: number;
  visual_fallbacks: number;
  cache_hits: number;
  errors: string[];
}

export async function runCityAcquisitionFit(
  input: CityAcquisitionFitInput
): Promise<CityAcquisitionFitResult> {
  const client = createAdminClient();
  const verticalSlug = input.verticalSlug ?? "pilates";
  const config = getVerticalRuntime(verticalSlug).acquisitionFitConfig;
  const errors: string[] = [];

  const { data: vertical } = await client
    .from("verticals")
    .select("id")
    .eq("slug", input.verticalSlug ?? "pilates")
    .maybeSingle();
  if (!vertical?.id) throw new Error("Vertical niet gevonden");

  let cityId = input.cityId ?? null;
  let cityName = "";
  if (!cityId && input.citySlug) {
    const { data: city } = await client
      .from("cities")
      .select("id, name")
      .eq("slug", input.citySlug)
      .maybeSingle();
    cityId = city?.id ? String(city.id) : null;
    cityName = String(city?.name ?? "");
  } else if (cityId) {
    const { data: city } = await client
      .from("cities")
      .select("name")
      .eq("id", cityId)
      .maybeSingle();
    cityName = String(city?.name ?? "");
  }
  if (!cityId) throw new Error("Stad niet gevonden");

  let query = client
    .from("businesses")
    .select("id")
    .eq("vertical_id", vertical.id)
    .eq("city_id", cityId)
    .eq("is_demo", false);
  if (input.businessIds?.length) query = query.in("id", input.businessIds);

  const { data: businessRows } = await query;
  const ids = (businessRows ?? []).map((row) => String(row.id));

  const budget = input.maxAnthropicCost ?? config.visualJudge.maxCostPerRun;
  let spent = 0;
  let screenshots = 0;
  let visualAnalyses = 0;
  let visualFallbacks = 0;
  let cacheHits = 0;
  let judgedCount = 0;

  const { data: run } = await client
    .from("acquisition_fit_runs")
    .insert({
      vertical_id: vertical.id,
      city_id: cityId,
      scope: "CITY",
      status: "RUNNING",
      thresholds_snapshot: {
        version: config.version,
        gates: config.gates,
        weights: config.weights,
        visual_judge: config.visualJudge,
      },
    })
    .select("id")
    .maybeSingle();

  const byId = new Map<string, AcquisitionFitResult>();

  const runOne = async (id: string, deterministicOnly: boolean) => {
    const budgetLeft = Math.max(0, budget - spent);
    try {
      const result = await evaluateAcquisitionFit(id, {
        deterministicOnly,
        useCache: input.useCache,
        costBudgetRemaining: budgetLeft,
        verticalSlug,
      });
      byId.set(id, result);
      spent += result.anthropic_cost;
      screenshots += result.screenshots_captured;
      if (result.cache_hit) cacheHits += 1;
      if (result.visual_source === "CLAUDE_VISION") {
        visualAnalyses += 1;
        if (!result.cache_hit) judgedCount += 1;
      } else if (result.visual_source === "DETERMINISTIC_FALLBACK") {
        visualFallbacks += 1;
      }
      return result;
    } catch (err) {
      errors.push(`${id}: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  };

  // Pass 1 is cheap and covers everyone. Only then do we know which studios
  // deserve the limited Claude Vision budget.
  for (const id of ids) await runOne(id, true);

  if (!input.deterministicOnly) {
    const shortlist = [...byId.values()]
      .filter(
        (row) =>
          row.prospect_type !== "NOT_ELIGIBLE" &&
          row.has_website &&
          row.business_quality >= config.visualJudge.minBusinessQuality
      )
      .sort((a, b) => b.transformation_score - a.transformation_score)
      .slice(0, config.visualJudge.maxCandidatesPerCity);

    for (const row of shortlist) {
      if (spent >= budget - 0.005) break;
      if (judgedCount >= config.visualJudge.maxCandidatesPerCity) break;
      // The cheap pass already wrote a fallback assessment, so revisiting these
      // studios upgrades them to a real visual verdict.
      visualFallbacks = Math.max(0, visualFallbacks - 1);
      await runOne(row.business_id, false);
    }
  }

  const evaluated = [...byId.values()];

  const ranking = await rankCityTransformation({
    cityId,
    verticalId: String(vertical.id),
    verticalSlug,
  });

  if (run?.id) {
    await client
      .from("acquisition_fit_runs")
      .update({
        status: errors.length && !evaluated.length ? "FAILED" : "COMPLETED",
        businesses_evaluated: evaluated.length,
        website_scans: evaluated.length,
        screenshots_captured: screenshots,
        visual_analyses: visualAnalyses,
        visual_fallbacks: visualFallbacks,
        cache_hits: cacheHits,
        anthropic_cost: Number(spent.toFixed(6)),
        classification_totals: ranking.totals,
        errors,
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);
  }

  return {
    run_id: run?.id ? String(run.id) : null,
    city_id: cityId,
    city_name: cityName || ranking.city_name,
    evaluated,
    ranking,
    anthropic_cost: Number(spent.toFixed(6)),
    screenshots_captured: screenshots,
    visual_analyses: visualAnalyses,
    visual_fallbacks: visualFallbacks,
    cache_hits: cacheHits,
    errors,
  };
}
