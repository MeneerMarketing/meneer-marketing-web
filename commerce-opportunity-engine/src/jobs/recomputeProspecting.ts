import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { classifyKeywordIntentType } from "../services/keywords/keywordIntentType.js";
import {
  assignProspectingTier,
  scoreProspectingValue,
} from "../services/keywords/prospectingValue.js";
import { computeKeywordYield } from "../services/keywords/keywordYieldService.js";
import {
  buildProductBrandTokens,
  buildRetailerNameTokens,
} from "../services/keywords/retailerNameDetector.js";
import { logger } from "../utils/logger.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const FOCUS_KEYWORDS = [
  "vitamin c serum",
  "led masker gezicht",
  "beste retinol serum",
  "pimple patches kruidvat",
  "cerave retinol serum",
  "la roche-posay b5 serum",
  "kerastase night serum",
];

async function main(): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);

  console.log("");
  console.log("M7.1 — RECOMPUTE PROSPECTING QUALITY");
  console.log("DataForSEO $0 · Anthropic $0 · existing data only");
  console.log("");

  const run = await createRun(supabase, "keyword_prospecting_recompute", {
    phase: "M7.1",
    dataForSeoCost: 0,
    anthropicCost: 0,
  });

  try {
    const retailerTokens = await buildRetailerNameTokens(supabase);
    const productBrandTokens = await buildProductBrandTokens(supabase);

    const { data: keywords, error } = await supabase
      .from("keywords")
      .select(
        "id, keyword, commercial_intent_score, product_intent_score, keyword_quality_score, search_volume, competition, cpc, estimated_serp_cost, serp_cost, discovery_status, last_scanned_at"
      )
      .order("keyword_quality_score", { ascending: false, nullsFirst: false });

    if (error) throw new Error(error.message);

    const now = new Date().toISOString();
    const focusRows: Array<Record<string, unknown>> = [];
    let updated = 0;

    for (const kw of keywords ?? []) {
      const intent = classifyKeywordIntentType({
        keyword: kw.keyword,
        retailerTokens,
        productBrandTokens,
      });

      // Yield only meaningful when scanned / has ads
      const yieldMetrics = await computeKeywordYield(
        supabase,
        kw.id,
        kw.serp_cost ?? kw.estimated_serp_cost ?? (kw.last_scanned_at ? 0.004 : null)
      );

      const prospecting = scoreProspectingValue({
        keyword: kw.keyword,
        intentType: intent.type,
        commercialIntent: kw.commercial_intent_score,
        productIntent: kw.product_intent_score,
        keywordQuality: kw.keyword_quality_score,
        searchVolume: kw.search_volume,
        competition: kw.competition != null ? Number(kw.competition) : null,
        cpc: kw.cpc != null ? Number(kw.cpc) : null,
        uniqueDomains: yieldMetrics.uniqueDomains,
        leadEligibleFound: yieldMetrics.leadEligibleFound,
        shopifyFound: yieldMetrics.shopifyFound,
        generalRetailersFound: yieldMetrics.generalRetailersFound,
        comparisonSitesFound: yieldMetrics.comparisonSitesFound,
        confirmedAdvertisersFound: yieldMetrics.confirmedAdvertisersFound,
      });

      const historicalHighYield =
        intent.type === "PRODUCT_BRANDED" &&
        (yieldMetrics.prospectYieldScore ?? 0) >= 70 &&
        yieldMetrics.leadEligibleFound >= 2;

      const tier = assignProspectingTier({
        intentType: intent.type,
        prospectingValue: prospecting.score,
        commercialIntent: kw.commercial_intent_score,
        productIntent: kw.product_intent_score,
        historicalHighYield,
      });

      const patch = {
        keyword_intent_type: intent.type,
        keyword_intent_confidence: intent.confidence,
        keyword_intent_reason: intent.reason,
        prospecting_value_score: prospecting.score,
        prospecting_tier: tier.tier,
        eligible_for_auto_approval: tier.eligibleForAutoApproval,
        prospect_yield_score: yieldMetrics.prospectYieldScore,
        keyword_efficiency_score: yieldMetrics.keywordEfficiencyScore,
        serp_cost: yieldMetrics.serpCost,
        placements_found: yieldMetrics.placementsFound,
        unique_domains_found: yieldMetrics.uniqueDomains,
        new_domains_found: yieldMetrics.newDomains,
        general_retailers_found: yieldMetrics.generalRetailersFound,
        comparison_sites_found: yieldMetrics.comparisonSitesFound,
        lead_eligible_found: yieldMetrics.leadEligibleFound,
        shopify_found: yieldMetrics.shopifyFound,
        confirmed_advertisers_found: yieldMetrics.confirmedAdvertisersFound,
        high_confidence_targets_found: yieldMetrics.highConfidenceTargetsFound,
        exact_paid_targets_found: yieldMetrics.exactPaidTargetsFound,
        cost_per_new_brand: yieldMetrics.costPerNewBrand,
        cost_per_lead_eligible: yieldMetrics.costPerLeadEligible,
        cost_per_shopify_prospect: yieldMetrics.costPerShopifyProspect,
        retailer_ratio: yieldMetrics.retailerRatio,
        yield_computed_at: now,
        updated_at: now,
      };

      const { error: updError } = await supabase
        .from("keywords")
        .update(patch)
        .eq("id", kw.id);
      if (updError) throw new Error(`Update ${kw.keyword}: ${updError.message}`);
      updated += 1;

      // Persist scan stats row for scanned keywords
      if (kw.last_scanned_at || yieldMetrics.placementsFound > 0) {
        await supabase.from("keyword_scan_stats").insert({
          keyword_id: kw.id,
          run_id: run.id,
          scan_date: kw.last_scanned_at ?? now,
          cost: yieldMetrics.serpCost,
          placements: yieldMetrics.placementsFound,
          unique_domains: yieldMetrics.uniqueDomains,
          new_domains: yieldMetrics.newDomains,
          lead_eligible: yieldMetrics.leadEligibleFound,
          shopify: yieldMetrics.shopifyFound,
          general_retailers: yieldMetrics.generalRetailersFound,
          comparison_sites: yieldMetrics.comparisonSitesFound,
          marketplaces: yieldMetrics.marketplacesFound,
          confirmed_advertisers: yieldMetrics.confirmedAdvertisersFound,
          high_confidence_targets: yieldMetrics.highConfidenceTargetsFound,
          exact_paid_targets: yieldMetrics.exactPaidTargetsFound,
          prospect_yield_score: yieldMetrics.prospectYieldScore,
          metadata: { source: "m7_1_recompute", domains: yieldMetrics.domains.slice(0, 30) },
        });
      }

      if (FOCUS_KEYWORDS.includes(kw.keyword.toLowerCase()) || FOCUS_KEYWORDS.includes(kw.keyword)) {
        focusRows.push({
          keyword: kw.keyword,
          intent: intent.type,
          prospecting: prospecting.score,
          tier: tier.tier,
          advertisers: yieldMetrics.uniqueDomains,
          eligible: yieldMetrics.leadEligibleFound,
          shopify: yieldMetrics.shopifyFound,
          retailers: yieldMetrics.generalRetailersFound,
          comparison: yieldMetrics.comparisonSitesFound,
          yield: yieldMetrics.prospectYieldScore,
          placements: yieldMetrics.placementsFound,
        });
      }
    }

    // Also match focus by normalized includes for hyphen variants
    if (focusRows.length < FOCUS_KEYWORDS.length) {
      for (const focus of FOCUS_KEYWORDS) {
        if (focusRows.some((r) => String(r.keyword).toLowerCase() === focus)) continue;
        const match = (keywords ?? []).find(
          (k) => k.keyword.toLowerCase().replace(/-/g, " ") === focus.replace(/-/g, " ")
        );
        if (!match) continue;
        // already updated; fetch for report
        const { data: row } = await supabase
          .from("keywords")
          .select(
            "keyword, keyword_intent_type, prospecting_value_score, prospecting_tier, unique_domains_found, lead_eligible_found, shopify_found, general_retailers_found, comparison_sites_found, prospect_yield_score, placements_found"
          )
          .eq("id", match.id)
          .maybeSingle();
        if (row) {
          focusRows.push({
            keyword: row.keyword,
            intent: row.keyword_intent_type,
            prospecting: row.prospecting_value_score,
            tier: row.prospecting_tier,
            advertisers: row.unique_domains_found,
            eligible: row.lead_eligible_found,
            shopify: row.shopify_found,
            retailers: row.general_retailers_found,
            comparison: row.comparison_sites_found,
            yield: row.prospect_yield_score,
            placements: row.placements_found,
          });
        }
      }
    }

    await completeRun(supabase, run.id, "completed", {
      phase: "M7.1",
      dataForSeoCost: 0,
      anthropicCost: 0,
      keywordsUpdated: updated,
      retailerTokenCount: retailerTokens.size,
      productBrandTokenCount: productBrandTokens.size,
      focusRows,
    });

    console.log(`Updated keywords: ${updated}`);
    console.log("");
    console.log("FOCUS KEYWORDS");
    console.log(
      "keyword | intent | prospecting | tier | advertisers | eligible | shopify | retailers | yield"
    );
    for (const row of focusRows) {
      console.log(
        `${row.keyword} | ${row.intent} | ${row.prospecting} | ${row.tier} | ${row.advertisers} | ${row.eligible} | ${row.shopify} | ${row.retailers} | ${row.yield ?? "—"}`
      );
    }
    console.log("");
    console.log("DataForSEO $0.0000 · Anthropic $0.0000");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("M7.1 recompute failed", { message });
    await completeRun(supabase, run.id, "failed", {
      phase: "M7.1",
      error: message,
      dataForSeoCost: 0,
      anthropicCost: 0,
    });
    process.exitCode = 1;
  }
}

main();
