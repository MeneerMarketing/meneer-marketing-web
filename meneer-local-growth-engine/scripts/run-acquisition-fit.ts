/**
 * Acquisition fit runner (M8.3).
 *
 * Run a city:      npx --yes tsx scripts/run-acquisition-fit.ts --city arnhem
 * Cheap re-run:    npx --yes tsx scripts/run-acquisition-fit.ts --city arnhem --deterministic
 * Single business: npx --yes tsx scripts/run-acquisition-fit.ts --business <uuid>
 * Fresh judging:   npx --yes tsx scripts/run-acquisition-fit.ts --city arnhem --no-cache
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  if (index < 0) return undefined;
  return process.argv[index + 1];
}

function flag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

async function main() {
  loadEnvLocal();
  const { runCityAcquisitionFit } = await import(
    "../src/services/acquisition-fit/runCityAcquisitionFit"
  );
  const { evaluateAcquisitionFit } = await import(
    "../src/services/acquisition-fit/evaluateAcquisitionFit"
  );

  const businessId = arg("business");
  const deterministicOnly = flag("deterministic");
  const useCache = !flag("no-cache");

  if (businessId) {
    const result = await evaluateAcquisitionFit(businessId, {
      deterministicOnly,
      useCache,
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const city = arg("city") ?? "arnhem";
  const maxCost = arg("max-cost") ? Number(arg("max-cost")) : undefined;

  const result = await runCityAcquisitionFit({
    citySlug: city,
    deterministicOnly,
    useCache,
    maxAnthropicCost: maxCost,
  });

  console.log("\n================ ACQUISITION FIT ·", result.city_name.toUpperCase(), "================");
  console.log(
    `evaluated ${result.evaluated.length} · visual ${result.visual_analyses} · fallback ${result.visual_fallbacks} · cache ${result.cache_hits} · screenshots ${result.screenshots_captured} · anthropic $${result.anthropic_cost.toFixed(5)}`
  );

  const sorted = [...result.evaluated].sort(
    (a, b) => b.transformation_score - a.transformation_score
  );
  for (const row of sorted) {
    console.log(
      [
        row.studio_name.slice(0, 42).padEnd(44),
        `T${String(row.transformation_score).padStart(3)}`,
        `bq${String(row.business_quality).padStart(3)}`,
        `wq${String(row.effective_website_quality).padStart(3)}`,
        `wo${String(row.effective_website_opportunity).padStart(3)}`,
        `brand${String(row.brand_asset_usability).padStart(3)}`,
        `book${String(row.booking_opportunity).padStart(3)}`,
        row.visual_source.padEnd(22),
        row.prospect_type.padEnd(23),
        row.preview_eligible ? "PREVIEW" : "-",
      ].join(" ")
    );
  }

  console.log("\nTransformation ranking:");
  for (const c of result.ranking.candidates) {
    console.log(
      `  #${c.transformation_city_rank} ${c.studio_name} · score ${c.transformation_score} · confidence ${c.winner_confidence}${c.is_primary ? "  <-- REDESIGN WINNER" : ""}`
    );
  }
  console.log("\nSelection:", result.ranking.selection_reason);
  console.log("Totals:", JSON.stringify(result.ranking.totals));
  if (result.errors.length) console.log("Errors:", result.errors);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
