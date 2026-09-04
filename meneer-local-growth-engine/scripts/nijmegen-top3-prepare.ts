/**
 * Nijmegen top-3 outreach prepare: select + unique templates + previews.
 *
 * Usage: npx --yes tsx scripts/nijmegen-top3-prepare.ts
 */
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

import { createAdminClient, isAdminConfigured } from "../src/lib/supabase/admin";
import {
  prepareSelectedCityOutreach,
} from "../src/services/city-outreach/cityOutreachService";

const NIJMEGEN_CITY_ID = "b1000000-0000-4000-8000-000000000002";

/** Top 3 preview-eligible WEBSITE_TRANSFORMATION (rank #3 Chiro-fysio skipped).
 *  Template overrides (handmatig):
 *  - Moov Pilates → reformer-minimal
 *  - REFORM STUDIOS → editorial (swap)
 *  - Ruimte in Zijn → soft-movement
 */
const TOP3 = [
  "c1336a08-d950-48ef-9e91-77aa543e0f7c", // REFORM STUDIOS Nijmegen #1
  "f8eaa55e-adc9-4839-a7e5-f8c7aeb56b1e", // Moov Pilates #2
  "e843d6c6-a9d8-458a-86f5-2bbe075dc629", // Ruimte in Zijn #4
];

async function main() {
  if (!isAdminConfigured()) {
    console.error("SUPABASE_SECRET_KEY ontbreekt");
    process.exit(1);
  }

  const client = createAdminClient();
  const { data: vertical } = await client
    .from("verticals")
    .select("id")
    .eq("slug", "pilates")
    .single();

  const verticalId = String(vertical?.id);
  const baseUrl = process.env.NEXT_PUBLIC_PREVIEW_BASE_URL ?? "https://preview.meneermarketing.nl";

  console.log("=== NIJMEGEN TOP 3 · PREPARE ===\n");

  const result = await prepareSelectedCityOutreach({
    verticalId,
    cityId: NIJMEGEN_CITY_ID,
    verticalSlug: "pilates",
    businessIds: TOP3,
  });

  if (!result.ok) {
    console.error("Prepare mislukt:", result.error);
    process.exit(1);
  }

  if (result.assignment) {
    console.log("Template assignment:");
    for (const row of result.assignment.assignments) {
      console.log(`  ${row.studio_name} → ${row.assigned_template}`);
    }
    console.log("");
  }

  for (const row of result.prepared) {
    const { data: preview } = await client
      .from("previews")
      .select("slug, template_variant, status")
      .eq("business_id", row.business_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log(`• ${row.studio_name}`);
    console.log(`  template: ${row.assigned_template}`);
    console.log(`  preview: ${row.preview_ok ? "OK" : "FAIL"}${row.preview_error ? ` (${row.preview_error})` : ""}`);
    if (preview?.slug) {
      console.log(`  url: ${baseUrl}/preview/${preview.slug}`);
    }
    console.log("");
  }

  console.log("Capacity:", result.capacity);
  console.log("Template usage:", result.template_usage);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
