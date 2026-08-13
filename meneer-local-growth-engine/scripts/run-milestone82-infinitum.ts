/**
 * Milestone 8.2 — mark Infinitum QA + recompute + prepare-for-pilot report.
 * Run: npx --yes tsx scripts/run-milestone82-infinitum.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createAdminClient } from "../src/lib/supabase/admin";
import { recomputeCampaignJourney, prepareCampaignForPilot } from "../src/services/campaigns/recomputeJourney";
import { validateCampaignLaunchReadiness } from "../src/services/campaigns/launchReadiness";
import { maskCampaignRef } from "../src/services/campaigns/types";

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

  const { data: business } = await client
    .from("businesses")
    .select("id, studio_name, engagement_level, conversion_status")
    .ilike("studio_name", "%Infinitum%")
    .eq("is_demo", false)
    .limit(1)
    .single();
  if (!business) throw new Error("Infinitum niet gevonden");

  const { data: campaign } = await client
    .from("campaigns")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (!campaign) throw new Error("Campaign niet gevonden");

  const before = {
    engagement_level: campaign.engagement_level,
    conversion_status: campaign.conversion_status,
    selected_package: campaign.selected_package,
    environment: campaign.environment,
    lifecycle_status: campaign.lifecycle_status,
  };

  // Ensure all events marked test
  await client
    .from("campaign_events")
    .update({ is_test: true, environment: "development" })
    .eq("campaign_id", campaign.id);

  const { count: testCount } = await client
    .from("campaign_events")
    .select("*", { count: "exact", head: true })
    .eq("campaign_id", campaign.id)
    .eq("is_test", true);

  const { count: realCount } = await client
    .from("campaign_events")
    .select("*", { count: "exact", head: true })
    .eq("campaign_id", campaign.id)
    .eq("is_test", false);

  const recomputed = await recomputeCampaignJourney(campaign.id);
  const prepared = await prepareCampaignForPilot(campaign.id);
  const readiness = await validateCampaignLaunchReadiness(campaign.id);

  const { data: reservation } = await client
    .from("campaign_reservations")
    .select("status, expires_at")
    .eq("campaign_id", campaign.id)
    .eq("status", "ACTIVE")
    .maybeSingle();

  console.log(
    JSON.stringify(
      {
        business: business.studio_name,
        campaign_ref_masked: maskCampaignRef(campaign.campaign_ref),
        before,
        test_events: testCount ?? 0,
        real_events: realCount ?? 0,
        after_recompute: recomputed,
        prepare: {
          reservation_expires_at: prepared.reservation_expires_at,
          readiness: prepared.readiness,
        },
        launch_readiness: readiness,
        reservation,
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
