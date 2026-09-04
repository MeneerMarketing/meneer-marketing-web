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

/** Re-run only the transformation ranking (no Claude, no crawling). */
async function main() {
  const { createAdminClient } = await import("../src/lib/supabase/admin");
  const { rankCityTransformation } = await import(
    "../src/services/acquisition-fit/rankTransformation"
  );
  const client = createAdminClient();

  const { data: cities } = await client.from("cities").select("id, name, slug");
  for (const city of cities ?? []) {
    const result = await rankCityTransformation({ cityId: String(city.id) });
    if (!result.candidates.length && !result.totals.discovered) continue;
    console.log(`\n${result.city_name}`);
    console.log(
      `  totals: transformation=${result.totals.website_transformation} growth=${result.totals.growth_only} weak=${result.totals.weak_business} not_eligible=${result.totals.not_eligible} discovered=${result.totals.discovered} qualified=${result.totals.qualified}`
    );
    for (const candidate of result.candidates) {
      console.log(
        `  #${candidate.transformation_city_rank} ${candidate.studio_name} · score ${candidate.transformation_score} · margin ${candidate.margin ?? "—"} · contact ${Math.round(candidate.contactability)} · confidence ${candidate.winner_confidence} · preview ${candidate.preview_eligible ? "YES" : "no"}${candidate.is_primary ? " · WINNER" : ""}`
      );
    }
    console.log(`  → ${result.selection_reason}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
