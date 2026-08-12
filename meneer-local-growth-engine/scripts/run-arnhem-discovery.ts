/**
 * One-shot Arnhem Pilates discovery test (Milestone 3).
 * Run: npx --yes tsx scripts/run-arnhem-discovery.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runPilatesDiscovery } from "../src/services/discovery/runPilatesDiscovery";

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

async function main() {
  loadEnvLocal();
  console.log("Starting Arnhem Pilates discovery (TEST)...");
  console.log({
    maxCost: process.env.DISCOVERY_MAX_COST_PER_RUN,
    maxResults: process.env.DISCOVERY_MAX_RESULTS,
    testMode: process.env.DISCOVERY_TEST_MODE,
    hasDataForSeo: Boolean(process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD),
    hasSupabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY),
  });

  const result = await runPilatesDiscovery({
    scope: "NL",
    mode: "TEST",
    citySlugs: ["arnhem"],
    maxCost: Number(process.env.DISCOVERY_MAX_COST_PER_RUN ?? 0.15),
    maxResults: Number(process.env.DISCOVERY_MAX_RESULTS ?? 15),
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
