import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const client = createAdminClient();

    const { data: run, error } = await client
      .from("discovery_runs")
      .select(
        "id, vertical_id, city_id, scope, mode, launcher_mode, pipeline_phase, rerun_action, status, config_snapshot, coverage_summary, started_at, completed_at, api_calls, api_cost, businesses_found, new_businesses, duplicates, qualified, excluded, errors, created_at, updated_at"
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !run) {
      return NextResponse.json({ ok: false, error: "Run niet gevonden" }, { status: 404 });
    }

    let citySlug: string | null = null;
    let cityName: string | null = null;
    let verticalSlug: string | null = null;

    if (run.city_id) {
      const { data: city } = await client
        .from("cities")
        .select("slug, name")
        .eq("id", run.city_id)
        .maybeSingle();
      citySlug = city?.slug ? String(city.slug) : null;
      cityName = city?.name ? String(city.name) : null;
    }

    const { data: vertical } = await client
      .from("verticals")
      .select("slug")
      .eq("id", run.vertical_id)
      .maybeSingle();
    verticalSlug = vertical?.slug ? String(vertical.slug) : null;

    const { data: coverage } = run.city_id
      ? await client
          .from("discovery_coverage")
          .select("*")
          .eq("discovery_run_id", run.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      : { data: null };

    return NextResponse.json({
      ok: true,
      run,
      citySlug,
      cityName,
      verticalSlug,
      coverage,
      redirectUrl:
        verticalSlug && citySlug
          ? `/dashboard/discovery/${verticalSlug}/${citySlug}`
          : null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Status ophalen mislukt",
      },
      { status: 500 }
    );
  }
}

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const client = createAdminClient();

    const { data: run } = await client
      .from("discovery_runs")
      .select("id, launcher_mode, rerun_action, config_snapshot, city_id, vertical_id, status")
      .eq("id", id)
      .maybeSingle();

    if (!run?.id) {
      return NextResponse.json({ ok: false, error: "Run niet gevonden" }, { status: 404 });
    }

    const snapshot = (run.config_snapshot ?? {}) as Record<string, unknown>;
    const { executeDiscoveryPipeline } = await import(
      "@/services/discovery/launchDiscovery"
    );
    const { getVerticalPack } = await import("@/verticals/registry");

    const verticalSlug = String(snapshot.vertical ?? "pilates");
    const pack = getVerticalPack(verticalSlug);
    if (!pack) {
      return NextResponse.json({ ok: false, error: "Vertical niet actief" }, { status: 400 });
    }

    const citySlug = String(snapshot.citySlug ?? "");
    const seed = pack.knownCitySeeds().find((city) => city.slug === citySlug);
    const { data: cityRow } = await client
      .from("cities")
      .select("*")
      .eq("id", run.city_id)
      .maybeSingle();

    const citySeed = seed ?? {
      slug: String(cityRow?.slug ?? citySlug),
      name: String(cityRow?.name ?? snapshot.city ?? citySlug),
      country_code: (cityRow?.country_code as "NL" | "BE") ?? "NL",
      region: String(cityRow?.region ?? ""),
      region_group: (cityRow?.region_group as "NL" | "VL") ?? "NL",
      latitude: Number(cityRow?.latitude ?? 0),
      longitude: Number(cityRow?.longitude ?? 0),
      radius_km: 12,
    };

    const result = await executeDiscoveryPipeline({
      runId: String(run.id),
      verticalSlug,
      citySeed,
      countryCode: (snapshot.country as "NL" | "BE") ?? "NL",
      mode: (run.launcher_mode as "QUICK" | "STANDARD" | "DEEP") ?? "STANDARD",
      rerunAction: run.rerun_action as "REFRESH" | "DEEPER" | undefined,
    });

    return NextResponse.json({
      ok: true,
      runId: run.id,
      redirectUrl: `/dashboard/discovery/${verticalSlug}/${result.citySlug}`,
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Pipeline start mislukt",
      },
      { status: 500 }
    );
  }
}
