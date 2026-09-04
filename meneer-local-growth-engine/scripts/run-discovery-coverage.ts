/**
 * Multi-intent discovery coverage test (M8.3).
 * Run: npx --yes tsx scripts/run-discovery-coverage.ts --city arnhem --max-cost 0.15
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

function arg(name: string, fallback?: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  if (index < 0) return fallback;
  return process.argv[index + 1] ?? fallback;
}

async function main() {
  loadEnvLocal();
  const { runPilatesDiscovery } = await import("../src/services/discovery/runPilatesDiscovery");

  const city = arg("city", "arnhem") as string;
  const maxCost = Number(arg("max-cost", "0.15"));
  const maxResults = Number(arg("max-results", "20"));

  console.log(`Discovery coverage test · ${city} · cap $${maxCost.toFixed(2)}`);

  const result = await runPilatesDiscovery({
    scope: "NL",
    mode: "TEST",
    citySlugs: [city],
    maxCost,
    maxResults,
    maxIntents: Number(arg("max-intents", "9")),
  });

  console.log(
    `\nrun ${result.runId} · ${result.status} · ${result.api_calls} calls · $${result.api_cost.toFixed(4)}`
  );
  console.log(
    `found ${result.businesses_found} · new ${result.new_businesses} · duplicates ${result.duplicates} · qualified ${result.qualified} · excluded ${result.excluded}`
  );

  for (const city of result.coverage) {
    console.log(`\n=== ${city.city_name.toUpperCase()} COVERAGE ===`);
    console.log(
      `queries ${city.queries_run} · unique ${city.unique_businesses} · relevant ${city.relevant_businesses} · duplicates ${city.duplicates} · eligible ${city.eligible_businesses}`
    );
    console.log(
      `confidence ${city.coverage_confidence} (${city.coverage_label}) · saturated ${city.saturated} · cost $${city.api_cost.toFixed(4)}`
    );
    console.log("");
    for (const row of city.incremental_unique_by_query) {
      console.log(
        [
          row.label.padEnd(30),
          `${String(row.results).padStart(3)} results`,
          `${String(row.unique_new).padStart(3)} new unique`,
          `${String(row.relevant_new).padStart(3)} new relevant`,
          `${String(row.duplicates).padStart(3)} dup`,
          row.error ? `ERROR ${row.error}` : "",
        ].join(" · ")
      );
    }
  }

  if (result.errors.length) console.log("\nErrors:", result.errors);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
