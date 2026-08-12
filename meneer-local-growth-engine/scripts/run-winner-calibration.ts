/**
 * Milestone 6.1 — City winner calibration
 * 1) Re-rank Arnhem with hybrid winner rules (no API)
 * 2) Limited discovery + SEO for up to 3 extra cities (budget $0.30)
 *
 * Run: npx --yes tsx scripts/run-winner-calibration.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createAdminClient } from "../src/lib/supabase/admin";
import { runPilatesDiscovery } from "../src/services/discovery/runPilatesDiscovery";
import { runCitySeoAnalysis } from "../src/services/seo/seoAnalysisRunner";
import { rankCityVertical } from "../src/services/scoring/rankCity";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

type CityRow = {
  city: string;
  slug: string;
  leads: number;
  first: string | null;
  firstScore: number | null;
  second: string | null;
  secondScore: number | null;
  margin: number | null;
  seoOpp: number | null;
  confidence: number | null;
  primary: boolean;
  reason: string | null;
  ready: boolean;
};

async function snapshotCity(slug: string): Promise<CityRow | null> {
  const client = createAdminClient();
  const { data: city } = await client.from("cities").select("id,name,slug").eq("slug", slug).single();
  if (!city) return null;

  const { data: rows } = await client
    .from("businesses")
    .select(
      "studio_name, lead_score, city_rank, seo_opportunity_score, winner_confidence, winner_reason, primary_candidate, lead_status"
    )
    .eq("city_id", city.id)
    .eq("is_demo", false)
    .order("city_rank", { ascending: true });

  const list = rows ?? [];
  const first = list[0];
  const second = list[1];
  const margin =
    first?.lead_score != null && second?.lead_score != null
      ? Math.round((Number(first.lead_score) - Number(second.lead_score)) * 10) / 10
      : null;

  return {
    city: city.name as string,
    slug: city.slug as string,
    leads: list.length,
    first: (first?.studio_name as string) ?? null,
    firstScore: first?.lead_score != null ? Number(first.lead_score) : null,
    second: (second?.studio_name as string) ?? null,
    secondScore: second?.lead_score != null ? Number(second.lead_score) : null,
    margin,
    seoOpp:
      first?.seo_opportunity_score != null ? Number(first.seo_opportunity_score) : null,
    confidence: first?.winner_confidence != null ? Number(first.winner_confidence) : null,
    primary: Boolean(first?.primary_candidate),
    reason: (first?.winner_reason as string) ?? null,
    ready: list.some((r) => r.lead_status === "READY_FOR_OUTREACH"),
  };
}

async function main() {
  loadEnvLocal();
  const client = createAdminClient();
  const budget = Number(process.env.CALIBRATION_MAX_DATAFORSEO_COST ?? 0.3);
  let spent = 0;
  let anthropic = 0;

  const report: {
    cities: CityRow[];
    discovery: unknown[];
    seo: unknown[];
    dataforseo_cost: number;
    anthropic_cost: number;
  } = { cities: [], discovery: [], seo: [], dataforseo_cost: 0, anthropic_cost: 0 };

  // 1) Arnhem final re-rank only (SEO already done)
  const { data: arnhem } = await client
    .from("cities")
    .select("id,name")
    .eq("slug", "arnhem")
    .single();
  if (!arnhem) throw new Error("Arnhem missing");

  console.log("=== Re-rank Arnhem (hybrid winner) ===");
  const arnhemRank = await rankCityVertical({
    cityId: arnhem.id as string,
    verticalSlug: "pilates",
    selectWinner: true,
    version: "final",
    autoPreview: false,
  });
  console.log({
    winner: arnhemRank.winnerName,
    confidence: arnhemRank.winner_confidence,
    reason: arnhemRank.selection_reason,
  });

  // 2) Extra calibration cities: mid / larger / smaller
  const extraCities = [
    { slug: "nijmegen", scope: "NL" as const, label: "middelgroot" },
    { slug: "utrecht", scope: "NL" as const, label: "groter" },
    { slug: "brugge", scope: "VL" as const, label: "kleiner" },
  ];

  for (const city of extraCities) {
    const remaining = budget - spent;
    if (remaining < 0.04) {
      console.log(`Budget te laag voor ${city.slug}, stop discovery/SEO`);
      break;
    }

    // Discovery share ~40% of remaining, capped
    const discoveryBudget = Math.min(0.08, remaining * 0.4);
    console.log(`=== Discovery ${city.slug} ($${discoveryBudget.toFixed(3)}) ===`);
    try {
      const disc = await runPilatesDiscovery({
        scope: city.scope,
        mode: "TEST",
        citySlugs: [city.slug],
        maxCost: discoveryBudget,
        maxResults: 8,
        terms: ["Pilates"],
      });
      spent += disc.api_cost;
      report.discovery.push({ city: city.slug, ...disc });
      console.log({ found: disc.businesses_found, cost: disc.api_cost });
    } catch (err) {
      console.error(`Discovery ${city.slug} failed`, err);
      report.discovery.push({
        city: city.slug,
        error: err instanceof Error ? err.message : String(err),
      });
      continue;
    }

    const remainingAfterDiscovery = budget - spent;
    if (remainingAfterDiscovery < 0.05) {
      console.log(`Budget te laag voor SEO ${city.slug}`);
      // Still provisional rank
      const { data: c } = await client.from("cities").select("id").eq("slug", city.slug).single();
      if (c) {
        await rankCityVertical({
          cityId: c.id as string,
          verticalSlug: "pilates",
          selectWinner: false,
          version: "provisional",
        });
      }
      continue;
    }

    // Tight SEO budget per city
    const seoBudget = Math.min(0.12, remainingAfterDiscovery);
    process.env.SEO_MAX_COST_PER_RUN = String(seoBudget);
    process.env.SEO_MAX_KEYWORDS_PER_CITY = "5";
    process.env.SEO_MAX_SERP_KEYWORDS_PER_BUSINESS = "2";

    console.log(`=== SEO ${city.slug} ($${seoBudget.toFixed(3)}) ===`);
    try {
      const seo = await runCitySeoAnalysis({
        citySlug: city.slug,
        verticalSlug: "pilates",
      });
      spent += seo.api_cost;
      report.seo.push(seo);
      console.log({
        winner: seo.winner,
        cost: seo.api_cost,
        studios: seo.studios.length,
      });
    } catch (err) {
      console.error(`SEO ${city.slug} failed`, err);
      report.seo.push({
        city: city.slug,
        error: err instanceof Error ? err.message : String(err),
      });
      const { data: c } = await client.from("cities").select("id").eq("slug", city.slug).single();
      if (c) {
        await rankCityVertical({
          cityId: c.id as string,
          verticalSlug: "pilates",
          selectWinner: true,
          version: "final",
        });
      }
    }
  }

  for (const slug of ["arnhem", ...extraCities.map((c) => c.slug)]) {
    const row = await snapshotCity(slug);
    if (row) report.cities.push(row);
  }

  report.dataforseo_cost = spent;
  report.anthropic_cost = anthropic;

  const { data: ready } = await client
    .from("businesses")
    .select("studio_name, lead_status, primary_candidate, winner_confidence, city_id")
    .eq("is_demo", false)
    .eq("lead_status", "READY_FOR_OUTREACH");

  console.log("=== CALIBRATION REPORT ===");
  console.log(JSON.stringify({ ...report, ready_for_outreach: ready ?? [] }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
