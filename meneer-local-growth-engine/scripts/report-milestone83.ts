import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
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
loadEnvLocal();


/** Final report for milestone 8.3: classification totals per city. */

const CITIES = ["arnhem", "nijmegen", "utrecht", "brugge"];

function n(value: unknown): string {
  if (value == null) return "—";
  return String(Math.round(Number(value)));
}

async function main() {
  const { createAdminClient } = await import("../src/lib/supabase/admin");
  const client = createAdminClient();

  const { data: cities } = await client.from("cities").select("id, slug, name");
  const cityById = new Map((cities ?? []).map((c) => [c.id as string, c]));
  const wanted = new Set(
    (cities ?? []).filter((c) => CITIES.includes(String(c.slug))).map((c) => c.id as string)
  );

  const { data: businesses } = await client
    .from("businesses")
    .select(
      "id, studio_name, city_id, website_url, is_demo, qualification_status, prospect_type, prospect_type_reason, website_transformation_score, transformation_city_rank, preview_eligible, preview_eligibility_reason, brand_asset_usability_score, visual_quality_score, visual_modernity_score, visual_mobile_score, business_presentation_gap_score, redesign_impact_score, visual_transformation_fit, visual_assessment_source, visual_assessment_cost, visual_assessment_model, transformation_components, score_components, lead_score, winner_confidence, primary_candidate"
    );

  const rows = (businesses ?? []).filter((b) => wanted.has(String(b.city_id)) && !b.is_demo);

  const totals: Record<string, number> = {};
  let anthropicCost = 0;
  let visualRuns = 0;
  let fallbacks = 0;

  for (const slug of CITIES) {
    const city = (cities ?? []).find((c) => c.slug === slug);
    if (!city) continue;
    const cityRows = rows.filter((b) => b.city_id === city.id);
    console.log(`\n=== ${String(city.name).toUpperCase()} (${cityRows.length} businesses) ===`);

    const sorted = [...cityRows].sort(
      (a, b) =>
        Number(b.website_transformation_score ?? 0) - Number(a.website_transformation_score ?? 0)
    );

    for (const b of sorted) {
      const parts = (b.transformation_components ?? {}) as {
        effective_website_quality?: number;
        effective_website_opportunity?: number;
        components?: Array<{ key: string; raw: number }>;
      };
      const sc = (b.score_components ?? {}) as { business_quality_score?: number };
      const type = String(b.prospect_type ?? "UNSCORED");
      totals[type] = (totals[type] ?? 0) + 1;
      if (b.visual_assessment_source === "CLAUDE_VISION") {
        visualRuns += 1;
        anthropicCost += Number(b.visual_assessment_cost ?? 0);
      } else if (b.visual_assessment_source) {
        fallbacks += 1;
      }

      console.log(
        [
          `  ${b.studio_name}`,
          `    type=${type} score=${n(b.website_transformation_score)} rank=${b.transformation_city_rank ?? "—"} preview=${b.preview_eligible ? "YES" : "no"}`,
          `    site quality=${n(parts.effective_website_quality)} opportunity=${n(parts.effective_website_opportunity)} business=${n(sc.business_quality_score)} brand=${n(b.brand_asset_usability_score)}`,
          `    visual quality=${n(b.visual_quality_score)} modernity=${n(b.visual_modernity_score)} mobile=${n(b.visual_mobile_score)} gap=${n(b.business_presentation_gap_score)} impact=${n(b.redesign_impact_score)} fit=${b.visual_transformation_fit ?? "—"} src=${b.visual_assessment_source ?? "—"}`,
          `    url=${b.website_url ?? "—"}`,
          `    why=${b.prospect_type_reason ?? "—"}`,
          b.preview_eligible ? "" : `    preview_block=${b.preview_eligibility_reason ?? "—"}`,
        ]
          .filter(Boolean)
          .join("\n")
      );
    }
  }

  console.log("\n=== TOTALS ===");
  for (const [type, count] of Object.entries(totals).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
  }
  console.log(`  Claude Vision runs: ${visualRuns}`);
  console.log(`  Deterministic fallbacks: ${fallbacks}`);
  console.log(`  Anthropic cost: $${anthropicCost.toFixed(4)}`);

  const { data: coverage } = await client
    .from("discovery_coverage")
    .select("*")
    .order("created_at", { ascending: false });
  console.log("\n=== DISCOVERY COVERAGE ===");
  for (const row of coverage ?? []) {
    const city = cityById.get(String(row.city_id));
    console.log(
      `  ${city?.name ?? row.city_id}: ${row.queries_run} queries, ${row.unique_businesses} unique, ${row.relevant_businesses} relevant, confidence ${row.coverage_confidence} (${row.coverage_label}), saturated=${row.saturated}`
    );
    for (const q of (row.incremental_unique_by_query ?? []) as Array<{
      label: string;
      results: number;
      unique_new: number;
      relevant_new: number;
      duplicates: number;
      out_of_city?: number;
    }>) {
      console.log(
        `     ${q.label}: ${q.results} results, +${q.unique_new} new, +${q.relevant_new} relevant, ${q.duplicates} dupes, ${q.out_of_city ?? 0} out-of-city`
      );
    }
  }

  const { data: runs } = await client
    .from("discovery_runs")
    .select("created_at, cost_usd, cache_hits, api_calls, status")
    .order("created_at", { ascending: false })
    .limit(10);
  console.log("\n=== RECENT DISCOVERY RUNS ===");
  let dfsCost = 0;
  let cacheHits = 0;
  for (const run of runs ?? []) {
    dfsCost += Number(run.cost_usd ?? 0);
    cacheHits += Number(run.cache_hits ?? 0);
    console.log(
      `  ${run.created_at}: ${run.status} cost=$${Number(run.cost_usd ?? 0).toFixed(4)} calls=${run.api_calls ?? 0} cache_hits=${run.cache_hits ?? 0}`
    );
  }
  console.log(`  Total (last 10): $${dfsCost.toFixed(4)}, cache hits ${cacheHits}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
