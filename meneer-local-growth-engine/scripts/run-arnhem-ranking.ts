/**
 * Rank Arnhem Pilates leads and select PRIMARY_CANDIDATE.
 * Run: npx --yes tsx scripts/run-arnhem-ranking.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createAdminClient } from "../src/lib/supabase/admin";
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

async function main() {
  loadEnvLocal();
  const client = createAdminClient();
  const { data: city } = await client.from("cities").select("id,name").eq("slug", "arnhem").single();
  if (!city) throw new Error("Arnhem city missing");

  console.log("Ranking", city.name, city.id);
  const result = await rankCityVertical({
    cityId: city.id as string,
    verticalSlug: "pilates",
    selectWinner: true,
    autoPreview: false,
  });

  console.log(
    JSON.stringify(
      {
        city: result.cityName,
        winner: result.winnerName,
        winnerId: result.winnerId,
        ranked: result.ranked.map((r) => ({
          rank: r.city_rank,
          name: r.name,
          score: r.lead_score,
          primary: r.primary_candidate,
          business: r.components.business_quality_score,
          website_opp: r.components.website_opportunity_score,
          reputation: r.components.local_reputation_score,
          services: r.components.service_fit_score,
          brand: r.components.brand_fit_score,
          contact: r.components.contactability_score,
          positives: r.components.explanations.positives.slice(0, 4),
          negatives: r.components.explanations.negatives.slice(0, 3),
        })),
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
