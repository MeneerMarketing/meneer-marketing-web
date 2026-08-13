/**
 * Milestone 8 — create Infinitum campaign + smoke-test public contract (no prospect mail).
 * Run: npx --yes tsx scripts/run-infinitum-campaign.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createAdminClient } from "../src/lib/supabase/admin";
import {
  ensureCampaignForBusiness,
  getCampaignLandingUrl,
  getCampaignPreviewUrlWithRef,
  ingestCampaignEvent,
  resolvePublicCampaignContext,
} from "../src/services/campaigns/campaignService";
import { maskCampaignRef } from "../src/services/campaigns/types";
import { generateCampaignRef } from "../src/services/campaigns/types";

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
    .select("id, studio_name")
    .ilike("studio_name", "%Infinitum%")
    .eq("is_demo", false)
    .limit(1)
    .single();
  if (!business) throw new Error("Infinitum niet gevonden");

  const { data: outreach } = await client
    .from("outreach_messages")
    .select("id")
    .eq("business_id", business.id)
    .eq("is_test", false)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const campaign = await ensureCampaignForBusiness({
    businessId: business.id as string,
    outreachMessageId: (outreach?.id as string) ?? null,
    createReservation: true,
  });

  const landing = await getCampaignLandingUrl(campaign);
  const previewWithRef = await getCampaignPreviewUrlWithRef(campaign);
  const context = await resolvePublicCampaignContext(campaign.campaign_ref);
  const invalid = await resolvePublicCampaignContext("mmlg_invalid");
  const bogus = await resolvePublicCampaignContext("not-a-ref");
  const opaqueCheck = !/infinitum|arnhem|pilates|a562dd0b/i.test(
    campaign.campaign_ref
  );

  // Smoke events (idempotent)
  await ingestCampaignEvent({
    campaignRef: campaign.campaign_ref,
    eventType: "PREVIEW_OPENED",
    idempotencyKey: `smoke-open-${campaign.id}`,
  });
  const dup = await ingestCampaignEvent({
    campaignRef: campaign.campaign_ref,
    eventType: "PREVIEW_OPENED",
    idempotencyKey: `smoke-open-${campaign.id}`,
  });
  await ingestCampaignEvent({
    campaignRef: campaign.campaign_ref,
    eventType: "LANDING_PAGE_VIEWED",
    idempotencyKey: `smoke-landing-${campaign.id}`,
  });

  // Unit-ish: generator produces opaque refs
  const sampleRefs = Array.from({ length: 5 }, () => generateCampaignRef());

  console.log(
    JSON.stringify(
      {
        business: business.studio_name,
        campaign_ref_masked: maskCampaignRef(campaign.campaign_ref),
        opaque_ref: opaqueCheck,
        sample_refs_look_opaque: sampleRefs.every((r) => r.startsWith("mmlg_")),
        recommended_package: campaign.recommended_package,
        recommendation_reason: campaign.recommendation_reason,
        landing_url: landing,
        preview_url_with_ref_host_only: previewWithRef.replace(
          /ref=[^&]+/,
          "ref=[masked]"
        ),
        public_context_valid: context.valid,
        public_context: context.valid
          ? {
              business_name: context.business_name,
              city: context.city,
              recommended_package: context.recommended_package,
              city_status: context.city_status,
              has_email_leak: JSON.stringify(context).includes("@"),
            }
          : context,
        invalid_ref: invalid,
        bogus_ref: bogus,
        duplicate_event: dup,
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
