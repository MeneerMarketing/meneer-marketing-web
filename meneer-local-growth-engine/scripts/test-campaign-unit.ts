/**
 * Pure Milestone 8 unit checks (no network / DB).
 * Run: npx --yes tsx scripts/test-campaign-unit.ts
 */
import { recommendPackage } from "../src/services/campaigns/recommendPackage";
import {
  generateCampaignRef,
  engagementFromEvent,
  maxEngagement,
  conversionFromEvent,
  maskCampaignRef,
} from "../src/services/campaigns/types";
import { buildLandingPageUrl } from "../src/config/verticalOffers";

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

const refs = Array.from({ length: 20 }, () => generateCampaignRef());
assert(refs.every((r) => /^mmlg_[A-Za-z0-9_-]+$/.test(r)), "ref format");
assert(new Set(refs).size === refs.length, "refs unique");
assert(refs.every((r) => !/infinitum|arnhem|@[a-z]/i.test(r)), "no PII in ref");

const rec = recommendPackage({
  business: {
    website_url: "https://example.com",
    website_quality_score: 40,
    seo_opportunity_score: 70,
    lead_score: 72,
  },
  seo: { seo_opportunity_score: 70, current_rank: 12 },
});
assert(rec.package === "LOCAL_GROWTH", `expected LOCAL_GROWTH got ${rec.package}`);

assert(engagementFromEvent("PREVIEW_OPENED") === "OPENED", "opened");
assert(engagementFromEvent("LANDING_PAGE_VIEWED") === "ENGAGED", "engaged");
assert(engagementFromEvent("CONTACT_SUBMITTED") === "INBOUND", "inbound");
assert(maxEngagement("OPENED", "HIGH_INTENT") === "HIGH_INTENT", "max eng");
assert(conversionFromEvent("CONTACT_SUBMITTED") === "INBOUND_LEAD", "conv");

process.env.MENEER_MARKETING_BASE_URL = "https://meneermarketing.nl";
const landing = buildLandingPageUrl({
  verticalSlug: "pilates",
  campaignRef: "mmlg_testref1234567890",
});
assert(
  landing ===
    "https://meneermarketing.nl/pilates-studios?ref=mmlg_testref1234567890",
  `landing ${landing}`
);

assert(maskCampaignRef("mmlg_abcdefghijklmnop").includes("…"), "mask");

console.log(
  JSON.stringify(
    {
      ok: true,
      package: rec.package,
      reason: rec.reason,
      sample_ref_masked: maskCampaignRef(refs[0]!),
      landing,
    },
    null,
    2
  )
);
