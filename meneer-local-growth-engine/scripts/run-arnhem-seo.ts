/**
 * Milestone 6 — Arnhem SEO analysis + final ranking.
 * Run: npx --yes tsx scripts/run-arnhem-seo.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createAdminClient } from "../src/lib/supabase/admin";
import { runCitySeoAnalysis } from "../src/services/seo/seoAnalysisRunner";

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
  const client = createAdminClient();

  const { data: city } = await client.from("cities").select("id,name").eq("slug", "arnhem").single();
  if (!city) throw new Error("Arnhem missing");

  const { data: before } = await client
    .from("businesses")
    .select(
      "studio_name, lead_score, city_rank, primary_candidate, seo_opportunity_score, lead_status"
    )
    .eq("city_id", city.id)
    .eq("is_demo", false)
    .order("city_rank", { ascending: true });

  console.log("=== BEFORE (provisional) ===");
  console.log(JSON.stringify(before, null, 2));

  const result = await runCitySeoAnalysis({
    citySlug: "arnhem",
    verticalSlug: "pilates",
  });

  console.log("=== ARNHEM SEO RESULT ===");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
