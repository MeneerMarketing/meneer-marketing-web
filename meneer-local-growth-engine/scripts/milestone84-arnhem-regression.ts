/**
 * Milestone 8.4 — Arnhem regression (development, geen mail versturen).
 *
 * Usage: npx tsx scripts/milestone84-arnhem-regression.ts
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
  setCityOutreachSelection,
} from "../src/services/city-outreach/cityOutreachService";
import {
  calculateTemplateFitScores,
  recommendedTemplateFromFit,
} from "../src/services/city-outreach/templateFit";
import {
  formatAssignmentReport,
} from "../src/services/city-outreach/cityOutreachService";
import { solveCityTemplateAssignment } from "../src/services/city-outreach/assignCityTemplates";
import type { Business } from "../src/types/domain";
import type { TemplateVariant } from "../src/types/studio";

const ARNHEM_CITY_ID = "b1000000-0000-4000-8000-000000000001";
const PITONYASA = "19a984fb-5215-4799-9a96-076e98b06302";
const SCULPT = "dfed1de5-aae9-4f18-b59b-770bc7123970";
const PILATES_STUDIO_ARNHEM = "c64df247-18c1-4621-9fd1-ebd041f31689";
const PARADISE = "00000000-0000-4000-8000-000000000004"; // placeholder — resolved at runtime

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

  const { data: paradiseRow } = await client
    .from("businesses")
    .select("id, studio_name")
    .eq("city_id", ARNHEM_CITY_ID)
    .ilike("studio_name", "%Paradise%")
    .maybeSingle();

  const paradiseId = paradiseRow?.id ? String(paradiseRow.id) : PARADISE;

  const top3 = [PITONYASA, SCULPT, PILATES_STUDIO_ARNHEM];

  console.log("=== M8.4 ARNHEM REGRESSION ===\n");

  const { data: rows } = await client
    .from("businesses")
    .select("*")
    .in("id", top3);

  const fitCandidates = (rows ?? []).map((row) => {
    const business = row as Business;
    const fit = calculateTemplateFitScores(business);
    const rec = recommendedTemplateFromFit(fit);
    return {
      business_id: business.id,
      studio_name: business.studio_name,
      fit,
      recommended_template: rec.template,
      recommended_template_score: rec.score,
    };
  });

  const assignment = solveCityTemplateAssignment({
    candidates: fitCandidates,
    templates: ["editorial", "reformer-minimal", "soft-movement"] as TemplateVariant[],
  });

  const fitMap = new Map(fitCandidates.map((c) => [c.business_id, c.fit]));
  console.log(
    formatAssignmentReport({
      assignments: assignment.assignments,
      fitByBusiness: fitMap,
      cityAssignment: assignment,
    })
  );

  const prepare = await prepareSelectedCityOutreach({
    verticalId,
    cityId: ARNHEM_CITY_ID,
    verticalSlug: "pilates",
    businessIds: top3,
  });

  if (!prepare.ok) {
    console.error("Prepare failed:", prepare.error);
    process.exit(1);
  }

  console.log("\n=== PREPARE RESULT ===");
  console.log("Capacity:", `${prepare.capacity.active}/${prepare.capacity.max}`);
  for (const row of prepare.prepared) {
    console.log(
      `- ${row.studio_name}: template=${row.assigned_template} preview=${row.preview_ok} campaign=${row.campaign_id ?? "—"} draft=${row.outreach_draft_id ?? "—"}`
    );
  }

  const templates = new Set(prepare.prepared.map((p) => p.assigned_template));
  if (templates.size !== 3) {
    console.error("FAIL: duplicate template assignment detected");
    process.exit(1);
  }

  const blocked = await setCityOutreachSelection({
    verticalId,
    cityId: ARNHEM_CITY_ID,
    verticalSlug: "pilates",
    businessIds: [...top3, paradiseId],
  });
  if (blocked.ok) {
    console.error("FAIL: kandidaat #4 had geblokkeerd moeten worden");
    process.exit(1);
  }
  console.log("\nBackup test OK:", blocked.error);

  const deselect = await setCityOutreachSelection({
    verticalId,
    cityId: ARNHEM_CITY_ID,
    verticalSlug: "pilates",
    businessIds: top3.slice(0, 2),
  });
  console.log("\nDeselect capacity:", `${deselect.capacity?.active}/${deselect.capacity?.max}`);

  if (paradiseRow?.id) {
    const activateBackup = await setCityOutreachSelection({
      verticalId,
      cityId: ARNHEM_CITY_ID,
      verticalSlug: "pilates",
      businessIds: [...top3.slice(0, 2), String(paradiseRow.id)],
    });
    console.log("Backup activate:", activateBackup.ok ? "OK" : activateBackup.error);
  }

  await setCityOutreachSelection({
    verticalId,
    cityId: ARNHEM_CITY_ID,
    verticalSlug: "pilates",
    businessIds: top3,
  });

  console.log("\nRegression complete. Geen mail verstuurd.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
