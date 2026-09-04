import { createAdminClient } from "@/lib/supabase/admin";
import {
  getDiscoveryModeConfig,
  type DiscoveryLauncherMode,
} from "@/config/discoveryLauncherModes";
import { setDiscoveryRunPhase } from "@/services/discovery/discoveryRunPhases";
import { resolveCityForDiscovery } from "@/services/discovery/resolveCity";
import { getVerticalPack } from "@/verticals/registry";
import type { CitySeed, DiscoveryScope } from "@/verticals/shared-types";

export type DiscoveryRerunAction = "USE_EXISTING" | "REFRESH" | "DEEPER";

export interface LaunchDiscoveryInput {
  verticalSlug: string;
  countryCode: "NL" | "BE";
  cityName: string;
  region?: string | null;
  mode: DiscoveryLauncherMode;
  rerunAction?: DiscoveryRerunAction;
}

export interface ExistingDiscoverySummary {
  hasData: boolean;
  businessCount: number;
  qualifiedCount: number;
  lastRunAt: string | null;
  lastRunMode: string | null;
  coverageLabel: string | null;
}

export async function getExistingDiscoverySummary(input: {
  verticalSlug: string;
  citySlug: string;
}): Promise<ExistingDiscoverySummary> {
  const client = createAdminClient();
  const pack = getVerticalPack(input.verticalSlug);
  if (!pack) {
    return {
      hasData: false,
      businessCount: 0,
      qualifiedCount: 0,
      lastRunAt: null,
      lastRunMode: null,
      coverageLabel: null,
    };
  }

  const { data: vertical } = await client
    .from("verticals")
    .select("id")
    .eq("slug", input.verticalSlug)
    .maybeSingle();
  const { data: city } = await client
    .from("cities")
    .select("id")
    .eq("slug", input.citySlug)
    .maybeSingle();

  if (!vertical?.id || !city?.id) {
    return {
      hasData: false,
      businessCount: 0,
      qualifiedCount: 0,
      lastRunAt: null,
      lastRunMode: null,
      coverageLabel: null,
    };
  }

  const { count: businessCount } = await client
    .from("businesses")
    .select("id", { count: "exact", head: true })
    .eq("vertical_id", vertical.id)
    .eq("city_id", city.id)
    .eq("is_demo", false);

  const { count: qualifiedCount } = await client
    .from("businesses")
    .select("id", { count: "exact", head: true })
    .eq("vertical_id", vertical.id)
    .eq("city_id", city.id)
    .eq("is_demo", false)
    .in("qualification_status", ["QUALIFIED", "POTENTIAL"]);

  const { data: lastRun } = await client
    .from("discovery_runs")
    .select("created_at, launcher_mode, status")
    .eq("vertical_id", vertical.id)
    .eq("city_id", city.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: coverage } = await client
    .from("discovery_coverage")
    .select("coverage_label")
    .eq("vertical_id", vertical.id)
    .eq("city_id", city.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    hasData: (businessCount ?? 0) > 0,
    businessCount: businessCount ?? 0,
    qualifiedCount: qualifiedCount ?? 0,
    lastRunAt: lastRun?.created_at ? String(lastRun.created_at) : null,
    lastRunMode: lastRun?.launcher_mode ? String(lastRun.launcher_mode) : null,
    coverageLabel: coverage?.coverage_label ? String(coverage.coverage_label) : null,
  };
}

function scopeForCountry(countryCode: "NL" | "BE"): DiscoveryScope {
  return countryCode === "BE" ? "VL" : "NL";
}

export async function createDiscoveryRunRecord(input: LaunchDiscoveryInput): Promise<{
  runId: string;
  cityId: string;
  citySlug: string;
  citySeed: CitySeed;
  verticalId: string;
}> {
  const pack = getVerticalPack(input.verticalSlug);
  if (!pack) throw new Error("Vertical is niet actief of bestaat niet");

  const modeConfig = getDiscoveryModeConfig(input.mode);
  const { cityId, seed, created } = await resolveCityForDiscovery({
    verticalSlug: input.verticalSlug,
    countryCode: input.countryCode,
    cityName: input.cityName,
    region: input.region,
  });

  const client = createAdminClient();
  const { data: vertical } = await client
    .from("verticals")
    .select("id")
    .eq("slug", input.verticalSlug)
    .single();
  if (!vertical?.id) throw new Error("Vertical ontbreekt in database");

  const existing = await getExistingDiscoverySummary({
    verticalSlug: input.verticalSlug,
    citySlug: seed.slug,
  });

  if (existing.hasData && input.rerunAction === "USE_EXISTING") {
    throw new Error("USE_EXISTING");
  }

  const effectiveMode =
    input.rerunAction === "DEEPER" && input.mode !== "DEEP"
      ? "DEEP"
      : input.mode;
  const effectiveConfig = getDiscoveryModeConfig(effectiveMode);

  const { data: run, error } = await client
    .from("discovery_runs")
    .insert({
      vertical_id: vertical.id,
      city_id: cityId,
      scope: scopeForCountry(input.countryCode),
      mode: "FULL",
      launcher_mode: effectiveMode,
      pipeline_phase: "PREPARING",
      rerun_action: input.rerunAction ?? null,
      status: "RUNNING",
      started_at: new Date().toISOString(),
      config_snapshot: {
        vertical: input.verticalSlug,
        country: input.countryCode,
        region: input.region ?? null,
        city: seed.name,
        citySlug: seed.slug,
        cityCreated: created,
        launcherMode: effectiveMode,
        maxCost: effectiveConfig.maxCostUsd,
        maxIntents: effectiveConfig.maxIntents,
        maxResults: effectiveConfig.maxResults,
        rerunAction: input.rerunAction ?? null,
      },
    })
    .select("id")
    .single();

  if (error || !run?.id) throw error ?? new Error("Kon discovery run niet aanmaken");

  return {
    runId: String(run.id),
    cityId,
    citySlug: seed.slug,
    citySeed: seed,
    verticalId: String(vertical.id),
  };
}

export async function executeDiscoveryPipeline(input: {
  runId: string;
  verticalSlug: string;
  citySeed: CitySeed;
  countryCode: "NL" | "BE";
  mode: DiscoveryLauncherMode;
  rerunAction?: DiscoveryRerunAction;
}): Promise<{
  citySlug: string;
  discoveryCost: number;
  qualified: number;
  businessesFound: number;
  coverageLabel: string | null;
}> {
  const pack = getVerticalPack(input.verticalSlug);
  if (!pack) throw new Error("Vertical niet actief");

  const effectiveMode =
    input.rerunAction === "DEEPER" && input.mode !== "DEEP" ? "DEEP" : input.mode;
  const modeConfig = getDiscoveryModeConfig(effectiveMode);
  const client = createAdminClient();

  try {
    await setDiscoveryRunPhase(input.runId, "SEARCHING");

    const discovery = await pack.runDiscovery({
      verticalSlug: input.verticalSlug,
      scope: scopeForCountry(input.countryCode),
      mode: "FULL",
      citySeeds: [input.citySeed],
      citySlugs: [input.citySeed.slug],
      maxCost: modeConfig.maxCostUsd,
      maxIntents: modeConfig.maxIntents,
      maxResults: modeConfig.maxResults,
      existingRunId: input.runId,
      launcherMode: effectiveMode,
      skipTestLimits: true,
    });

    await setDiscoveryRunPhase(input.runId, "QUALIFYING");
    await setDiscoveryRunPhase(input.runId, "WEBSITE_ANALYSIS");

    const fit = await pack.runCityAcquisitionFit({
      citySlug: input.citySeed.slug,
      verticalSlug: input.verticalSlug,
      deterministicOnly: true,
      useCache: input.rerunAction !== "REFRESH",
    });

    await setDiscoveryRunPhase(input.runId, "COVERAGE_CHECK");

    const coverageLabel = discovery.coverage[0]?.coverage_label ?? null;
    const summary = {
      unique_businesses: discovery.coverage[0]?.unique_businesses ?? discovery.businesses_found,
      relevant_businesses: discovery.coverage[0]?.relevant_businesses ?? 0,
      qualified: discovery.qualified,
      transformation_candidates: fit.ranking.totals.website_transformation,
      growth_only: fit.ranking.totals.growth_only,
      coverage_label: coverageLabel,
      acquisition_fit_run_id: fit.run_id,
    };

    await client
      .from("discovery_runs")
      .update({
        pipeline_phase: "COMPLETED",
        status: discovery.status,
        completed_at: new Date().toISOString(),
        coverage_summary: summary,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.runId);

    return {
      citySlug: input.citySeed.slug,
      discoveryCost: discovery.api_cost,
      qualified: discovery.qualified,
      businessesFound: discovery.businesses_found,
      coverageLabel,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await client
      .from("discovery_runs")
      .update({
        pipeline_phase: "FAILED",
        status: "FAILED",
        completed_at: new Date().toISOString(),
        errors: [message],
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.runId);
    throw error;
  }
}
