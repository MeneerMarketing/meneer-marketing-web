/**
 * Milestone 9.3.2 — versioned business classification recompute.
 *
 * Brands carrying an older classifier version are re-derived through the normal
 * classifier architecture. Domains where the structural verdict is decisive are
 * corrected immediately at zero API cost. The rest are stamped and flagged so
 * the next crawl cycle refreshes them.
 *
 * No per-domain patches. No DataForSEO. No Anthropic.
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { BUSINESS_CLASSIFIER_VERSION } from "../services/crawler/businessClassifier.js";
import {
  classifyProspectExclusion,
  structuralDomainClass,
} from "../services/prospect/prospectPipelineGate.js";
import { PROSPECT_GATE_FIXTURES } from "../config/prospectExclusion.js";
import {
  runBusinessClassifierRegression,
  type ClassifierRegressionResult,
} from "../services/crawler/businessClassifierRegression.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

export interface RecomputeSummary {
  scanned: number;
  /** Corrections made in this pass. */
  corrected: number;
  /** All domains this classifier generation holds a corrected verdict on. */
  correctedTotal: number;
  flaggedForRecrawl: number;
  unchanged: number;
  corrections: Array<{
    domain: string;
    from: string | null;
    to: string;
    reason: string;
  }>;
  regressionPassed: number;
  regressionTotal: number;
  /** Exclusions withdrawn because the rule behind them was retired. */
  reverted: number;
  revertedDomains: Array<{ domain: string; from: string; reason: string }>;
  /** Gate verdicts left behind by a classification that was withdrawn. */
  staleGateStampsCleared: number;
  staleGateStampDomains: Array<{ domain: string; from: string }>;
  /** Website classifier fixtures: guards the breadth vs international split. */
  classifierRegression: ClassifierRegressionResult;
}

/** Reasoning text written by the retired "many locales means chain" rule. */
const RETIRED_LOCALE_RULE_PATTERN = /landversies in hreflang|internationale operator/i;

/** Gate classes that keep a brand out of the pipeline. */
const EXCLUDING_GATE_CLASSES = [
  "MASS_RETAILER",
  "GENERAL_RETAILER",
  "MARKETPLACE",
  "COMPARISON_SITE",
] as const;

type BrandRow = {
  id: string;
  normalized_domain: string | null;
  business_type: string | null;
  business_type_reasoning: string | null;
  business_type_confidence: number | null;
  is_ecommerce: boolean | null;
  retailer_scale_score: number | null;
  business_maturity_score: number | null;
  lead_eligible: boolean | null;
  eligibility_status: string | null;
  manual_excluded: boolean | null;
  prequalified_prospect: boolean | null;
  business_classifier_version: string | null;
  last_crawled_at: string | null;
};

export async function recomputeBusinessClassification(options?: {
  onlyDomains?: string[];
  limit?: number;
}): Promise<RecomputeSummary> {
  const env = loadEnv();
  const client = createSupabaseServerClient(env);

  let query = client
    .from("brands")
    .select(
      "id, normalized_domain, business_type, business_type_reasoning, business_type_confidence, is_ecommerce, retailer_scale_score, business_maturity_score, lead_eligible, eligibility_status, manual_excluded, prequalified_prospect, business_classifier_version, last_crawled_at"
    )
    .or(
      `business_classifier_version.is.null,business_classifier_version.neq.${BUSINESS_CLASSIFIER_VERSION}`
    );

  if (options?.onlyDomains?.length) {
    query = query.in("normalized_domain", options.onlyDomains);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw new Error(`brands load failed: ${error.message}`);

  const summary: RecomputeSummary = {
    scanned: 0,
    corrected: 0,
    correctedTotal: 0,
    flaggedForRecrawl: 0,
    unchanged: 0,
    corrections: [],
    regressionPassed: 0,
    regressionTotal: 0,
    reverted: 0,
    revertedDomains: [],
    staleGateStampsCleared: 0,
    staleGateStampDomains: [],
    classifierRegression: runBusinessClassifierRegression(),
  };

  // Breadth signals, so unlisted chains are caught by advertising footprint.
  const { data: occurrences } = await client
    .from("ad_occurrences")
    .select("brand_id, keyword_id, keywords(category)")
    .limit(20000);

  const keywordSpread = new Map<string, Set<string>>();
  const categorySpread = new Map<string, Set<string>>();
  for (const occ of occurrences ?? []) {
    if (!occ.brand_id || !occ.keyword_id) continue;
    if (!keywordSpread.has(occ.brand_id)) keywordSpread.set(occ.brand_id, new Set());
    keywordSpread.get(occ.brand_id)!.add(occ.keyword_id);
    const keyword = Array.isArray(occ.keywords) ? occ.keywords[0] : occ.keywords;
    const category = (keyword as { category?: string } | null)?.category;
    if (!categorySpread.has(occ.brand_id)) categorySpread.set(occ.brand_id, new Set());
    if (category) categorySpread.get(occ.brand_id)!.add(category);
  }

  for (const row of (data ?? []) as BrandRow[]) {
    const domain = row.normalized_domain;
    if (!domain) continue;
    summary.scanned += 1;

    const structural = structuralDomainClass(domain);
    const gate = classifyProspectExclusion({
      domain,
      businessType: row.business_type,
      isEcommerce: row.is_ecommerce,
      manualExcluded: row.manual_excluded,
      retailerScaleScore: row.retailer_scale_score,
      businessMaturityScore: row.business_maturity_score,
      categorySpread: categorySpread.get(row.id)?.size ?? 0,
      keywordSpread: keywordSpread.get(row.id)?.size ?? 0,
    });

    const update: Record<string, unknown> = {
      business_classifier_version: BUSINESS_CLASSIFIER_VERSION,
      classification_recomputed_at: new Date().toISOString(),
      prospect_gate_class: gate.prospectClass,
      prospect_gate_reason: gate.reason,
    };

    // Structural verdict, or a breadth verdict from the central gate, is
    // decisive enough to correct the stored classification without a crawl.
    const breadthVerdict =
      gate.reason === "mass_retail_breadth" || gate.reason === "mass_retail_scale"
        ? "MASS_RETAILER"
        : null;
    const correctedType = structural?.businessType ?? breadthVerdict;

    // Verdicts produced by the retired locale rule are not evidence of anything.
    // Without a structural verdict the honest state is "unknown, re-derive",
    // otherwise a wrongly excluded specialist stays excluded forever.
    const fromRetiredLocaleRule =
      !structural &&
      row.business_type === "MASS_RETAILER" &&
      RETIRED_LOCALE_RULE_PATTERN.test(row.business_type_reasoning ?? "");

    if (fromRetiredLocaleRule && !breadthVerdict) {
      update.business_type = "UNKNOWN";
      update.business_type_confidence = 0.3;
      update.business_type_reasoning =
        "Vorige MASS_RETAILER kwam alleen uit hreflang-landversies. Internationale schaal zegt niets over assortimentsbreedte, dus opnieuw bepalen via website.";
      update.excluded_reason = null;
      update.eligibility_status = "PENDING_QUALIFICATION";
      update.classification_needs_recompute = true;
      update.classification_recompute_reason = `reverted_locale_rule_${BUSINESS_CLASSIFIER_VERSION}`;
      // The stored gate verdict was derived from the classification we just
      // withdrew. Keeping it would leave a retailer stamp on a brand we no
      // longer call a retailer.
      update.prospect_gate_class = null;
      update.prospect_gate_reason = null;

      summary.reverted += 1;
      summary.revertedDomains.push({
        domain,
        from: "MASS_RETAILER",
        reason: "internationale schaal is geen assortimentsbreedte",
      });

      const { error: revertError } = await client.from("brands").update(update).eq("id", row.id);
      if (revertError) {
        throw new Error(`brand revert failed for ${domain}: ${revertError.message}`);
      }
      continue;
    }

    if (correctedType && correctedType !== row.business_type) {
      const reason = structural
        ? `structureel domeinoordeel: ${structural.matchedSignal}`
        : (gate.evidence[0] ?? "breedte-signaal");

      update.business_type = correctedType;
      update.business_type_confidence = structural ? 0.95 : 0.85;
      update.business_type_reasoning = reason;
      update.lead_eligible = false;
      update.eligibility_status = "EXCLUDED";
      update.excluded_reason = gate.reason ?? "prospect_gate_rejected";
      update.prequalified_prospect = false;
      update.classification_recompute_reason = `corrected_by_${BUSINESS_CLASSIFIER_VERSION}`;
      update.classification_needs_recompute = false;

      summary.corrected += 1;
      summary.corrections.push({
        domain,
        from: row.business_type,
        to: correctedType,
        reason,
      });
    } else {
      // No structural verdict means the stored type came from website
      // heuristics that this version changed. A version stamp is not a
      // re-derivation, so queue it for the next cheap website check.
      update.classification_needs_recompute = true;
      update.classification_recompute_reason = `awaiting_website_recompute_${BUSINESS_CLASSIFIER_VERSION}`;
      summary.flaggedForRecrawl += 1;
    }

    const { error: updateError } = await client.from("brands").update(update).eq("id", row.id);
    if (updateError) {
      throw new Error(`brand update failed for ${domain}: ${updateError.message}`);
    }
  }

  // Invariant repair: a brand whose classification was withdrawn cannot keep an
  // exclusion stamp from that same withdrawn verdict. Reverts from an earlier
  // run of this version are no longer in the scan window, so they are cleaned
  // up here rather than by patching individual domains.
  const { data: staleStamps } = await client
    .from("brands")
    .select("id, normalized_domain, prospect_gate_class")
    .eq("business_type", "UNKNOWN")
    .eq("classification_needs_recompute", true)
    .in("prospect_gate_class", EXCLUDING_GATE_CLASSES);

  for (const row of staleStamps ?? []) {
    const { error } = await client
      .from("brands")
      .update({ prospect_gate_class: null, prospect_gate_reason: null })
      .eq("id", row.id);
    if (error) {
      throw new Error(`gate stamp cleanup failed for ${row.normalized_domain}: ${error.message}`);
    }
    summary.staleGateStampsCleared += 1;
    summary.staleGateStampDomains.push({
      domain: String(row.normalized_domain),
      from: String(row.prospect_gate_class),
    });
  }

  // Corrections are cumulative state, not a per-run counter: a rerun that finds
  // nothing new must still show what this classifier generation fixed.
  const { data: correctedRows } = await client
    .from("brands")
    .select("normalized_domain, business_type, business_type_reasoning, classification_recompute_reason")
    .not("classification_recompute_reason", "is", null)
    .in("business_type", ["MASS_RETAILER", "MARKETPLACE", "COMPARISON_SITE"]);

  for (const row of correctedRows ?? []) {
    const domain = String(row.normalized_domain);
    if (summary.corrections.some((correction) => correction.domain === domain)) continue;
    summary.corrections.push({
      domain,
      from: null,
      to: String(row.business_type),
      reason: String(row.business_type_reasoning ?? row.classification_recompute_reason ?? ""),
    });
  }
  summary.correctedTotal = summary.corrections.length;

  // Regression: the classifier must reach the documented verdict from signals.
  for (const fixture of PROSPECT_GATE_FIXTURES) {
    summary.regressionTotal += 1;
    const verdict = classifyProspectExclusion({ domain: fixture.domain, ...fixture.signals });
    const pass =
      verdict.eligible === fixture.expectEligible &&
      (fixture.expectReason === null || verdict.reason === fixture.expectReason);
    if (pass) summary.regressionPassed += 1;
  }

  return summary;
}

async function main(): Promise<void> {
  console.log(`Business classifier recompute → ${BUSINESS_CLASSIFIER_VERSION}`);
  const summary = await recomputeBusinessClassification();

  console.log(`  gescand: ${summary.scanned}`);
  console.log(`  gecorrigeerd in deze pass: ${summary.corrected}`);
  console.log(`  totaal gecorrigeerd door deze classifier: ${summary.correctedTotal}`);
  console.log(`  gemarkeerd voor hercrawl: ${summary.flaggedForRecrawl}`);
  console.log(`  ongewijzigd: ${summary.unchanged}`);
  console.log(`  teruggedraaide uitsluitingen: ${summary.reverted}`);
  console.log(`  verouderde gate-stempels opgeruimd: ${summary.staleGateStampsCleared}`);
  console.log(`  gate-regressie: ${summary.regressionPassed}/${summary.regressionTotal}`);
  console.log(
    `  classifier-regressie: ${summary.classifierRegression.passed}/${summary.classifierRegression.total}`
  );
  for (const entry of summary.classifierRegression.cases) {
    console.log(
      `    ${entry.passed ? "ok " : "FOUT"} ${entry.label} → ${entry.verdict} (internationaal ${entry.internationalPresenceScore}, breedte ${entry.retailerBreadthScore})`
    );
  }

  if (summary.staleGateStampDomains.length > 0) {
    console.log("\nGate-stempel opgeruimd:");
    for (const entry of summary.staleGateStampDomains) {
      console.log(`  ${entry.domain}: ${entry.from} → geen stempel, wacht op hercrawl`);
    }
  }

  if (summary.revertedDomains.length > 0) {
    console.log("\nTeruggedraaid:");
    for (const entry of summary.revertedDomains) {
      console.log(`  ${entry.domain}: ${entry.from} → UNKNOWN (${entry.reason})`);
    }
  }

  if (summary.corrections.length > 0) {
    console.log("\nCorrecties:");
    for (const correction of summary.corrections) {
      console.log(
        `  ${correction.domain}: ${correction.from ?? "onbekend"} → ${correction.to} (${correction.reason})`
      );
    }
  }
}

const invokedDirectly = process.argv[1]
  ? resolve(process.argv[1]).endsWith("recomputeBusinessClassification.js")
  : false;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
