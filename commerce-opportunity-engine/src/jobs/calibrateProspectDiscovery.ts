/**
 * Milestone 9.3.2 — PROSPECT DISCOVERY CALIBRATION.
 *
 * A small controlled SERP sample over the new archetype keyword families, to
 * prove whether they surface niche brands and focused specialists.
 *
 * Hard boundaries: no CRO audit, no Claude, no concepts, no preview, no contact
 * discovery, no outreach. DataForSEO spend is capped and checked before every
 * call.
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";
import { config } from "dotenv";

import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import { fetchGooglePaidAds, saveSerpFixture } from "../services/dataforseo/googleSerp.js";
import { classifySerpSignal } from "../config/signalClassification.js";
import { upsertBrandFromAd } from "../services/supabase/brandsRepository.js";
import { storeAdOccurrence } from "../services/supabase/adOccurrencesRepository.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { isBlacklistedDomain } from "../config/blacklist.js";
import {
  ARCHETYPE_BY_ID,
  type ProductArchetypeId,
} from "../config/idealProductArchetypes.js";
import {
  CALIBRATION_BRANCHES,
  M932_CALIBRATION,
  M932_CALIBRATION_VERSION,
  branchVerdict,
  type BranchVerdict,
} from "../config/prospectCalibration.js";
import {
  seedArchetypeKeywords,
  selectCalibrationKeywords,
} from "../services/idealProspect/archetypeKeywordSeeder.js";
import {
  computeSerpProspectQuality,
  type KeywordProspectStatus,
} from "../services/idealProspect/serpProspectQuality.js";
import { classifyProspectExclusion } from "../services/prospect/prospectPipelineGate.js";
import {
  runLightBrandCheck,
  type LightBrandCheckResult,
} from "../services/prospect/lightBrandCheck.js";
import { recoverShoppingSellerAds } from "../services/prospect/shoppingSellerRecovery.js";
import type { SellerDomainResolution } from "../services/prospect/sellerDomainResolver.js";
import { recomputeBusinessClassification } from "./recomputeBusinessClassification.js";
import { BUSINESS_CLASSIFIER_VERSION } from "../services/crawler/businessClassifier.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const REPORT_PATH = resolve(projectRoot, "reports/prospect-calibration-report.json");
const DASHBOARD_REPORT_PATH = resolve(
  projectRoot,
  "dashboard/src/preview/concepts/data/prospect-calibration-report.json"
);
const SOURCE = "dataforseo_google_serp_live";

interface SampledDomain {
  domain: string;
  brandId: string | null;
  brandName: string;
  landingUrl: string | null;
  prospectClass: string;
  gateEligible: boolean;
  gateReason: string | null;
  businessType: string | null;
  platform: string | null;
  isEcommerce: boolean | null;
  retailerScaleScore: number | null;
  ownBrandSignal: number | null;
  checked: boolean;
  keywords: string[];
  archetypeId: ProductArchetypeId;
  familyId: string;
}

interface KeywordResult {
  keyword: string;
  keywordId: string;
  archetypeId: ProductArchetypeId;
  archetypeLabel: string;
  familyId: string;
  familyLabel: string;
  archetypeFit: number;
  preGateClass: string;
  rawAdvertisers: number;
  uniqueAdvertisers: number;
  nicheBrands: number;
  specialists: number;
  retailers: number;
  comparison: number;
  marketplaces: number;
  unknown: number;
  prospectEligible: number;
  serpQualityScore: number;
  status: KeywordProspectStatus;
  reason: string | null;
  evidence: string[];
  cost: number;
  domains: string[];
  unresolvedShoppingSellers: string[];
}

interface BranchResult {
  archetypeId: ProductArchetypeId;
  label: string;
  keywordsTested: number;
  approvedKeywords: number;
  marginalKeywords: number;
  rawAdvertisers: number;
  uniqueAdvertisers: number;
  prospectEligible: number;
  nicheBrands: number;
  specialists: number;
  retailersExcluded: number;
  comparisonExcluded: number;
  marketplacesExcluded: number;
  specialistYieldPercent: number;
  prospectYieldPercent: number;
  cost: number;
  costPerProspectEligible: number | null;
  unresolvedShoppingSellers: number;
  verdict: BranchVerdict;
  bestFamily: string | null;
  worstFamily: string | null;
}

interface CalibrationReport {
  milestone: string;
  version: string;
  runId: string;
  startedAt: string;
  finishedAt: string;
  classifier: {
    version: string;
    scanned: number;
    corrected: number;
    flaggedForRecrawl: number;
    unchanged: number;
    corrections: Array<{ domain: string; from: string | null; to: string; reason: string }>;
    regression: string;
  };
  keywordSelection: {
    seeded: number;
    preGateSkipped: Array<{ keyword: string; reason: string }>;
    selected: Array<{
      keyword: string;
      archetypeId: ProductArchetypeId;
      familyId: string;
      archetypeFit: number;
      preGateClass: string;
    }>;
    skippedForBudget: string[];
  };
  branchResults: BranchResult[];
  keywordResults: KeywordResult[];
  bestDomains: Array<{
    domain: string;
    brandId: string | null;
    businessType: string | null;
    platform: string | null;
    isEcommerce: boolean | null;
    ownBrandSignal: number | null;
    retailerScaleScore: number | null;
    archetypeId: ProductArchetypeId;
    familyId: string;
    keywords: string[];
    checked: boolean;
  }>;
  rejectedLandscape: Array<{
    domain: string;
    prospectClass: string;
    reason: string | null;
    businessType: string | null;
  }>;
  sellerRecovery?: {
    recovered: number;
    stillUnresolved: number;
  };
  cost: {
    dataForSeo: number;
    dataForSeoCap: number;
    anthropic: number;
    lightChecks: number;
  };
  downstream: Record<string, number>;
}

type BudgetTracker = { spent: number; cap: number };

function canSpend(budget: BudgetTracker, estimate: number): boolean {
  return budget.spent + estimate <= budget.cap + 1e-9;
}

/** Corrections are cumulative across passes; the newest verdict per domain wins. */
function mergeCorrections(
  prior: CalibrationReport["classifier"]["corrections"],
  current: CalibrationReport["classifier"]["corrections"]
): CalibrationReport["classifier"]["corrections"] {
  const byDomain = new Map(prior.map((correction) => [correction.domain, correction]));
  for (const correction of current) byDomain.set(correction.domain, correction);
  return [...byDomain.values()];
}

function percent(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

/**
 * Rebuilds the advertiser sample from a previous calibration run. Same verdict
 * logic, zero API cost, so scoring fixes never require paying for SERPs twice.
 */
async function replayStoredSample(input: {
  supabase: ReturnType<typeof createSupabaseServerClient>;
  runId: string;
  selected: Array<{ id: string; keyword: string; archetypeId: ProductArchetypeId; familyId: string }>;
  domainIndex: Map<string, SampledDomain>;
  keywordSamples: Map<
    string,
    Array<{ domain: string; brandId: string | null; landingUrl: string | null }>
  >;
  keywordCosts: Map<string, number>;
  recoveredSellers: string[];
}): Promise<void> {
  const { data, error } = await input.supabase
    .from("ad_occurrences")
    .select("keyword_id, brand_id, landing_url, raw_payload, brands(normalized_domain, name)")
    .eq("run_id", input.runId);

  if (error) throw new Error(`replay load failed: ${error.message}`);

  // Sellers recovered by an HTTP probe carry their method in the payload, so a
  // replay reports the same recovery count without probing again.
  input.recoveredSellers.push(
    ...new Set(
      (data ?? [])
        .filter(
          (row) =>
            ((row.raw_payload ?? {}) as { seller_domain_resolution?: string })
              .seller_domain_resolution
        )
        .map((row) => String(row.brand_id))
    )
  );

  for (const keyword of input.selected) {
    const rows = (data ?? []).filter((row) => row.keyword_id === keyword.id);
    const sample: Array<{ domain: string; brandId: string | null; landingUrl: string | null }> = [];
    const seen = new Set<string>();

    for (const row of rows) {
      const brand = (Array.isArray(row.brands) ? row.brands[0] : row.brands) as {
        normalized_domain?: string;
        name?: string;
      } | null;
      const domain = brand?.normalized_domain;
      if (!domain || seen.has(domain)) continue;
      seen.add(domain);
      sample.push({
        domain,
        brandId: row.brand_id ? String(row.brand_id) : null,
        landingUrl: (row.landing_url as string | null) ?? null,
      });

      if (!input.domainIndex.has(domain)) {
        input.domainIndex.set(domain, {
          domain,
          brandId: row.brand_id ? String(row.brand_id) : null,
          brandName: brand?.name ?? domain,
          landingUrl: (row.landing_url as string | null) ?? null,
          prospectClass: "UNKNOWN",
          gateEligible: false,
          gateReason: null,
          businessType: null,
          platform: null,
          isEcommerce: null,
          retailerScaleScore: null,
          ownBrandSignal: null,
          checked: false,
          keywords: [],
          archetypeId: keyword.archetypeId,
          familyId: keyword.familyId,
        });
      }
      input.domainIndex.get(domain)!.keywords.push(keyword.keyword);
    }

    input.keywordSamples.set(keyword.id, sample);
    input.keywordCosts.set(keyword.id, 0);
  }
}

export async function runProspectDiscoveryCalibration(options?: {
  dryRun?: boolean;
  /** Recompute verdicts from a stored run instead of buying new SERPs. */
  replayRunId?: string;
  /** Re-measure a subset of branches without paying for the others again. */
  branches?: ProductArchetypeId[];
}): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const dataForSeo = createDataForSeoClient(env);

  const budget: BudgetTracker = { spent: 0, cap: env.M932_MAX_DATAFORSEO_COST };
  const startedAt = new Date().toISOString();

  console.log(`\n=== M9.3.2 PROSPECT DISCOVERY CALIBRATION (${M932_CALIBRATION_VERSION}) ===`);
  console.log(`DataForSEO cap: $${budget.cap.toFixed(3)} · Anthropic: $0.000\n`);

  // ---------------------------------------------------------------------
  // 1. Classifier data first: no stale business intelligence in the database.
  // ---------------------------------------------------------------------
  console.log("Stap 1 — business classifier recompute");
  const recompute = await recomputeBusinessClassification();
  console.log(
    `  ${recompute.corrected} nieuw gecorrigeerd (${recompute.correctedTotal} totaal), ${recompute.flaggedForRecrawl} in wachtrij, regressie ${recompute.regressionPassed}/${recompute.regressionTotal}\n`
  );

  // ---------------------------------------------------------------------
  // 2. Seed and select calibration keywords.
  // ---------------------------------------------------------------------
  console.log("Stap 2 — archetype keywords seeden en selecteren");
  const branches =
    options?.branches && options.branches.length > 0 ? options.branches : CALIBRATION_BRANCHES;
  if (branches !== CALIBRATION_BRANCHES) {
    console.log(`  branch filter actief: ${branches.join(", ")}`);
  }
  const { seeded, skipped } = await seedArchetypeKeywords(supabase, branches);
  const selected = selectCalibrationKeywords(seeded, {
    maxPerBranch: M932_CALIBRATION.maxKeywordsPerBranch,
    maxPerFamily: M932_CALIBRATION.maxKeywordsPerFamily,
    maxTotal: M932_CALIBRATION.maxKeywordsTotal,
  });
  console.log(
    `  ${seeded.length} seeds beschikbaar, ${skipped.length} geweigerd door pre-gate, ${selected.length} geselecteerd\n`
  );

  if (options?.dryRun) {
    for (const keyword of selected) {
      console.log(
        `  ${keyword.archetypeId.padEnd(18)} ${keyword.familyId.padEnd(28)} fit ${String(keyword.archetypeFit).padStart(3)} · ${keyword.preGateClass.padEnd(28)} ${keyword.keyword}`
      );
    }
    console.log(
      `\nDry run: ${selected.length} keywords, geschatte SERP-kosten $${(selected.length * M932_CALIBRATION.estimatedSerpCostPerKeyword).toFixed(4)} van cap $${budget.cap.toFixed(3)}. Geen API-calls gedaan.\n`
    );
    return;
  }

  const run = await createRun(supabase, "prospect_discovery_calibration", {
    milestone: "M9.3.2",
    version: M932_CALIBRATION_VERSION,
    branches,
    keywords: selected.map((k) => k.keyword),
    maxDataForSeoCost: budget.cap,
  });
  const runId = run.id;

  // ---------------------------------------------------------------------
  // 3. SERP sample per keyword, with budget guard before every call.
  // ---------------------------------------------------------------------
  console.log("Stap 3 — SERP sample per keyword");
  const domainIndex = new Map<string, SampledDomain>();
  const keywordSamples = new Map<
    string,
    Array<{ domain: string; brandId: string | null; landingUrl: string | null }>
  >();
  const keywordCosts = new Map<string, number>();
  const unresolvedSellers = new Map<string, string[]>();
  const sellerCache = new Map<string, SellerDomainResolution>();
  const skippedForBudget: string[] = [];
  let recoveredSellerCount = 0;
  let priorCorrections: CalibrationReport["classifier"]["corrections"] = [];
  let priorUnresolved = new Map<string, string[]>();

  let previousReport: CalibrationReport | null = null;
  try {
    previousReport = JSON.parse(await readFile(REPORT_PATH, "utf8")) as CalibrationReport;
  } catch {
    // First run: nothing to carry over.
  }

  if (options?.replayRunId) {
    // A replay reuses paid SERPs, so the corrections from earlier passes stay
    // in the report instead of resetting to zero.
    if (previousReport) {
      priorCorrections = previousReport.classifier.corrections;
      priorUnresolved = new Map(
        previousReport.keywordResults.map((k) => [k.keyword, k.unresolvedShoppingSellers ?? []])
      );
    }

    const recoveredSellers: string[] = [];
    await replayStoredSample({
      supabase,
      runId: options.replayRunId,
      selected,
      domainIndex,
      keywordSamples,
      keywordCosts,
      recoveredSellers,
    });
    recoveredSellerCount = recoveredSellers.length;
    console.log(
      `  replay van run ${options.replayRunId}: ${keywordSamples.size} keywords, ${domainIndex.size} domeinen, $0.0000 nieuwe kosten\n`
    );
  }

  for (const keyword of options?.replayRunId ? [] : selected) {
    if (!canSpend(budget, M932_CALIBRATION.estimatedSerpCostPerKeyword)) {
      skippedForBudget.push(keyword.keyword);
      continue;
    }

    let serp;
    try {
      serp = await fetchGooglePaidAds({ client: dataForSeo, env }, keyword.keyword);
    } catch (error) {
      console.log(
        `  ${keyword.keyword}: SERP call mislukt (${error instanceof Error ? error.message : "onbekend"})`
      );
      continue;
    }

    budget.spent += serp.cost;
    keywordCosts.set(keyword.id, serp.cost);

    // Shopping sellers without a domain are disproportionately the small
    // specialists we are calibrating for, so recover them before measuring.
    const recovery = await recoverShoppingSellerAds(serp.unresolvedShoppingAds, {
      timeoutMs: M932_CALIBRATION.sellerProbeTimeoutMs,
      cache: sellerCache,
      maxSellers: M932_CALIBRATION.maxSellerProbesPerKeyword,
    });
    const paidAds = [...serp.paidAds, ...recovery.recovered];
    recoveredSellerCount += recovery.recovered.length;
    unresolvedSellers.set(
      keyword.id,
      recovery.stillUnresolved.map((entry) => entry.seller)
    );
    if (recovery.recovered.length > 0) {
      console.log(
        `    ${recovery.recovered.length} shopping-verkoper(s) alsnog naar domein herleid`
      );
    }

    // Keep the raw response so a rerun of the analysis never costs money again.
    await saveSerpFixture(
      resolve(projectRoot, `fixtures/calibration/${keyword.keyword.replace(/\s+/g, "-")}.json`),
      serp.rawResponse
    ).catch(() => undefined);

    const sample: Array<{ domain: string; brandId: string | null; landingUrl: string | null }> = [];
    const seenDomains = new Set<string>();

    for (const ad of paidAds) {
      const signal = classifySerpSignal({ serpItemType: ad.serpItemType, rawItem: ad.rawItem });
      if (signal.adSignalType === "NON_PAID") continue;
      if (isBlacklistedDomain(ad.normalizedDomain)) {
        // Still counted as landscape, never persisted as a prospect.
        if (!seenDomains.has(ad.normalizedDomain)) {
          seenDomains.add(ad.normalizedDomain);
          sample.push({ domain: ad.normalizedDomain, brandId: null, landingUrl: ad.landingUrl });
        }
        continue;
      }

      const brandName = ad.brandName?.trim() || ad.normalizedDomain;
      const isConfirmed = signal.adSignalType === "CONFIRMED_PAID";

      const { brand } = await upsertBrandFromAd(supabase, {
        name: brandName,
        domain: ad.advertiserDomain,
        normalizedDomain: ad.normalizedDomain,
        seenAt: ad.timestamp,
        confirmedGoogleAdvertiser: isConfirmed,
        confirmationSource: isConfirmed ? signal.confirmationSource : null,
      });

      await storeAdOccurrence(supabase, {
        runId,
        keywordId: keyword.id,
        brandId: brand.id,
        ad,
        source: SOURCE,
        signal,
      });

      if (!seenDomains.has(ad.normalizedDomain)) {
        seenDomains.add(ad.normalizedDomain);
        sample.push({
          domain: ad.normalizedDomain,
          brandId: brand.id,
          landingUrl: ad.landingUrl,
        });
      }

      if (!domainIndex.has(ad.normalizedDomain)) {
        domainIndex.set(ad.normalizedDomain, {
          domain: ad.normalizedDomain,
          brandId: brand.id,
          brandName,
          landingUrl: ad.landingUrl,
          prospectClass: "UNKNOWN",
          gateEligible: false,
          gateReason: null,
          businessType: null,
          platform: null,
          isEcommerce: null,
          retailerScaleScore: null,
          ownBrandSignal: null,
          checked: false,
          keywords: [],
          archetypeId: keyword.archetypeId,
          familyId: keyword.familyId,
        });
      }
      domainIndex.get(ad.normalizedDomain)!.keywords.push(keyword.keyword);
    }

    keywordSamples.set(keyword.id, sample);
    console.log(
      `  ${keyword.keyword} → ${sample.length} advertisers · $${serp.cost.toFixed(4)} (totaal $${budget.spent.toFixed(4)})`
    );
  }

  if (skippedForBudget.length > 0) {
    console.log(`  ${skippedForBudget.length} keyword(s) overgeslagen wegens budgetplafond`);
  }

  // ---------------------------------------------------------------------
  // 4. Stored classifications for everything we already know.
  // ---------------------------------------------------------------------
  const allDomains = [...domainIndex.keys()];
  const knownBrands = new Map<
    string,
    {
      business_type: string | null;
      is_ecommerce: boolean | null;
      platform: string | null;
      retailer_scale_score: number | null;
      business_maturity_score: number | null;
      manual_excluded: boolean | null;
      business_classifier_version: string | null;
      classification_needs_recompute: boolean | null;
      own_brand_signal_score: number | null;
    }
  >();

  for (let i = 0; i < allDomains.length; i += 100) {
    const chunk = allDomains.slice(i, i + 100);
    const { data } = await supabase
      .from("brands")
      .select(
        "normalized_domain, business_type, is_ecommerce, platform, retailer_scale_score, business_maturity_score, manual_excluded, business_classifier_version, classification_needs_recompute, own_brand_signal_score"
      )
      .in("normalized_domain", chunk);
    for (const row of data ?? []) {
      knownBrands.set(String(row.normalized_domain), row as never);
    }
  }

  // ---------------------------------------------------------------------
  // 5. Cheap domain checks. Only for domains the structural gate lets through
  //    and where we lack a current classification.
  // ---------------------------------------------------------------------
  console.log("\nStap 4 — goedkope domeinchecks");
  let checksRun = 0;

  // The own-brand signal lives only in the report, so a replay reuses the
  // value from the pass that paid for the crawl instead of showing blanks.
  const priorSignals = new Map(
    (previousReport?.bestDomains ?? []).map((d) => [d.domain, d.ownBrandSignal])
  );

  for (const entry of domainIndex.values()) {
    const known = knownBrands.get(entry.domain);
    const preVerdict = classifyProspectExclusion({
      domain: entry.domain,
      businessType: known?.business_type,
      isEcommerce: known?.is_ecommerce,
      manualExcluded: known?.manual_excluded,
      retailerScaleScore: known?.retailer_scale_score,
      businessMaturityScore: known?.business_maturity_score,
    });

    entry.businessType = known?.business_type ?? null;
    entry.platform = known?.platform ?? null;
    entry.isEcommerce = known?.is_ecommerce ?? null;
    entry.retailerScaleScore = known?.retailer_scale_score ?? null;
    entry.prospectClass = preVerdict.prospectClass;
    entry.gateEligible = preVerdict.eligible;
    entry.gateReason = preVerdict.reason;
    entry.ownBrandSignal = known?.own_brand_signal_score ?? priorSignals.get(entry.domain) ?? null;

    // The own-brand signal is part of a current classification: without it we
    // cannot rank the sample, so a missing value earns one cheap fetch.
    const hasCurrentClassification =
      known?.business_classifier_version === BUSINESS_CLASSIFIER_VERSION &&
      known?.classification_needs_recompute !== true &&
      known?.business_type &&
      known.business_type !== "UNKNOWN" &&
      known.own_brand_signal_score !== null;

    if (!preVerdict.eligible) continue;
    if (hasCurrentClassification) continue;
    if (checksRun >= M932_CALIBRATION.maxLightChecks) continue;

    checksRun += 1;
    let check: LightBrandCheckResult;
    try {
      check = await runLightBrandCheck(entry.domain, Math.min(env.CRAWLER_TIMEOUT_MS, 20000));
    } catch (error) {
      console.log(
        `  ${entry.domain}: check mislukt (${error instanceof Error ? error.message : "onbekend"})`
      );
      continue;
    }

    entry.checked = true;
    entry.businessType = check.businessType;
    entry.platform = check.platform;
    entry.isEcommerce = check.isEcommerce;
    entry.retailerScaleScore = check.retailerScaleScore;
    entry.ownBrandSignal = check.ownBrandSignal;
    entry.prospectClass = check.prospectClass;
    entry.gateEligible = check.gateEligible;
    entry.gateReason = check.gateReason;

    if (entry.brandId && check.crawlStatus === "success") {
      await supabase
        .from("brands")
        .update({
          business_type: check.businessType,
          business_type_confidence: check.businessTypeConfidence,
          business_type_reasoning: check.businessTypeReasoning,
          is_ecommerce: check.isEcommerce,
          ecommerce_confidence: check.ecommerceConfidence,
          platform: check.platform,
          platform_confidence: check.platformConfidence,
          retailer_scale_score: check.retailerScaleScore,
          own_brand_signal_score: check.ownBrandSignal,
          business_classifier_version: BUSINESS_CLASSIFIER_VERSION,
          classification_needs_recompute: false,
          classification_recomputed_at: new Date().toISOString(),
          classification_recompute_reason: "m932_light_check",
          prospect_gate_class: check.prospectClass,
          prospect_gate_reason: check.gateReason,
        })
        .eq("id", entry.brandId);
    }
  }
  console.log(`  ${checksRun} domeinen goedkoop gecheckt (1 homepage fetch, geen catalog crawl)`);

  // ---------------------------------------------------------------------
  // 6. Keyword verdicts.
  // ---------------------------------------------------------------------
  const keywordResults: KeywordResult[] = [];

  for (const keyword of selected) {
    const sample = keywordSamples.get(keyword.id);
    if (!sample) continue;

    const archetype = ARCHETYPE_BY_ID.get(keyword.archetypeId);
    const quality = computeSerpProspectQuality(
      sample.map((item) => ({
        domain: item.domain,
        businessType: domainIndex.get(item.domain)?.businessType ?? null,
      })),
      { archetypeTooBroad: keyword.archetypeFit < 40 }
    );

    const status = quality.status;
    const cost = keywordCosts.get(keyword.id) ?? 0;

    keywordResults.push({
      keyword: keyword.keyword,
      keywordId: keyword.id,
      archetypeId: keyword.archetypeId,
      archetypeLabel: archetype?.label ?? keyword.archetypeId,
      familyId: keyword.familyId,
      familyLabel: keyword.familyLabel,
      archetypeFit: keyword.archetypeFit,
      preGateClass: keyword.preGateClass,
      rawAdvertisers: sample.length,
      uniqueAdvertisers: new Set(sample.map((s) => s.domain)).size,
      nicheBrands: quality.counts.NICHE_BRAND,
      specialists: quality.counts.SPECIALIST,
      retailers: quality.counts.GENERAL_RETAILER + quality.counts.MASS_RETAILER,
      comparison: quality.counts.COMPARISON_SITE,
      marketplaces: quality.counts.MARKETPLACE,
      unknown: quality.counts.UNKNOWN,
      prospectEligible: quality.prospectDomains.length,
      serpQualityScore: quality.prospectSerpQualityScore,
      status,
      reason: quality.stopReason,
      evidence: quality.excludedDomains.slice(0, 6),
      cost,
      domains: sample.map((s) => s.domain),
      unresolvedShoppingSellers:
        unresolvedSellers.get(keyword.id) ?? priorUnresolved.get(keyword.keyword) ?? [],
    });

    await supabase
      .from("keywords")
      .update({
        prospect_serp_quality_score: quality.prospectSerpQualityScore,
        keyword_prospect_status: status,
        keyword_prospect_reason: quality.stopReason,
        keyword_prospect_checked_at: new Date().toISOString(),
        serp_cost: cost,
        last_scanned_at: new Date().toISOString(),
      })
      .eq("id", keyword.id);
  }

  // ---------------------------------------------------------------------
  // 7. Branch yield.
  // ---------------------------------------------------------------------
  const branchResults: BranchResult[] = [];

  for (const archetypeId of branches) {
    const archetype = ARCHETYPE_BY_ID.get(archetypeId);
    const keywords = keywordResults.filter((k) => k.archetypeId === archetypeId);
    if (keywords.length === 0) continue;

    const domains = [...domainIndex.values()].filter((d) =>
      keywords.some((k) => k.domains.includes(d.domain))
    );
    const uniqueDomains = new Set(domains.map((d) => d.domain));
    const eligible = domains.filter((d) => d.gateEligible);
    const nicheBrands = eligible.filter((d) => d.businessType === "BRAND").length;
    const specialists = eligible.filter((d) => d.businessType === "SPECIALIST_WEBSHOP").length;
    const retailersExcluded = domains.filter(
      (d) => d.prospectClass === "GENERAL_RETAILER" || d.prospectClass === "MASS_RETAILER"
    ).length;
    const comparisonExcluded = domains.filter((d) => d.prospectClass === "COMPARISON_SITE").length;
    const marketplacesExcluded = domains.filter((d) => d.prospectClass === "MARKETPLACE").length;

    const rawAdvertisers = keywords.reduce((sum, k) => sum + k.rawAdvertisers, 0);
    const cost = keywords.reduce((sum, k) => sum + k.cost, 0);

    const familyScores = new Map<string, { label: string; eligible: number; raw: number }>();
    for (const keyword of keywords) {
      const current = familyScores.get(keyword.familyId) ?? {
        label: keyword.familyLabel,
        eligible: 0,
        raw: 0,
      };
      current.eligible += keyword.prospectEligible;
      current.raw += keyword.rawAdvertisers;
      familyScores.set(keyword.familyId, current);
    }
    const familyRanking = [...familyScores.entries()].sort(
      (a, b) => percent(b[1].eligible, b[1].raw) - percent(a[1].eligible, a[1].raw)
    );

    const prospectYieldPercent = percent(eligible.length, uniqueDomains.size);

    branchResults.push({
      archetypeId,
      label: archetype?.label ?? archetypeId,
      keywordsTested: keywords.length,
      approvedKeywords: keywords.filter((k) => k.status === "APPROVED").length,
      marginalKeywords: keywords.filter((k) => k.status === "MARGINAL").length,
      rawAdvertisers,
      uniqueAdvertisers: uniqueDomains.size,
      prospectEligible: eligible.length,
      nicheBrands,
      specialists,
      retailersExcluded,
      comparisonExcluded,
      marketplacesExcluded,
      specialistYieldPercent: percent(nicheBrands + specialists, uniqueDomains.size),
      prospectYieldPercent,
      cost,
      costPerProspectEligible:
        eligible.length > 0 ? Math.round((cost / eligible.length) * 10000) / 10000 : null,
      unresolvedShoppingSellers: keywords.reduce(
        (sum, k) => sum + k.unresolvedShoppingSellers.length,
        0
      ),
      verdict: branchVerdict(prospectYieldPercent, nicheBrands + specialists),
      bestFamily: familyRanking[0]?.[1].label ?? null,
      worstFamily:
        familyRanking.length > 1 ? (familyRanking[familyRanking.length - 1][1].label ?? null) : null,
    });
  }

  // ---------------------------------------------------------------------
  // 8. Report.
  // ---------------------------------------------------------------------
  const bestDomains = [...domainIndex.values()]
    .filter((d) => d.gateEligible)
    .sort((a, b) => {
      const brandRank = (entry: SampledDomain) =>
        entry.businessType === "BRAND" ? 2 : entry.businessType === "SPECIALIST_WEBSHOP" ? 1 : 0;
      const rank = brandRank(b) - brandRank(a);
      if (rank !== 0) return rank;
      return (b.ownBrandSignal ?? 0) - (a.ownBrandSignal ?? 0);
    })
    .slice(0, 15);

  const rejectedLandscape = [...domainIndex.values()]
    .filter((d) => !d.gateEligible)
    .slice(0, 25)
    .map((d) => ({
      domain: d.domain,
      prospectClass: d.prospectClass,
      reason: d.gateReason,
      businessType: d.businessType,
    }));

  // A partial re-measure only pays for the branches it tested, so the results
  // of the untouched branches carry over instead of disappearing.
  const carriedBranches =
    previousReport?.branchResults.filter((b) => !branches.includes(b.archetypeId)) ?? [];
  const carriedKeywords =
    previousReport?.keywordResults.filter((k) => !branches.includes(k.archetypeId)) ?? [];
  const carriedDomains =
    previousReport?.bestDomains.filter((d) => !branches.includes(d.archetypeId)) ?? [];
  // Spend is cumulative across every calibration pass, so the report reads the
  // runs table rather than whatever this single process happened to pay.
  const { data: priorRuns } = await supabase
    .from("runs")
    .select("id, metadata")
    .eq("run_type", "prospect_discovery_calibration");
  const priorSpend = (priorRuns ?? [])
    .filter((row) => String(row.id) !== runId)
    .reduce(
      (sum, row) => sum + (((row.metadata ?? {}) as { dataForSeoCost?: number }).dataForSeoCost ?? 0),
      0
    );

  const report: CalibrationReport = {
    milestone: "M9.3.2",
    version: M932_CALIBRATION_VERSION,
    runId,
    startedAt,
    finishedAt: new Date().toISOString(),
    classifier: {
      version: BUSINESS_CLASSIFIER_VERSION,
      scanned: recompute.scanned,
      corrected: recompute.correctedTotal,
      flaggedForRecrawl: recompute.flaggedForRecrawl,
      unchanged: recompute.unchanged,
      corrections: mergeCorrections(priorCorrections, recompute.corrections),
      regression: `${recompute.regressionPassed}/${recompute.regressionTotal}`,
    },
    keywordSelection: {
      seeded: seeded.length,
      preGateSkipped: skipped,
      selected: selected.map((k) => ({
        keyword: k.keyword,
        archetypeId: k.archetypeId,
        familyId: k.familyId,
        archetypeFit: k.archetypeFit,
        preGateClass: k.preGateClass,
      })),
      skippedForBudget,
    },
    branchResults: [...branchResults, ...carriedBranches],
    keywordResults: [...keywordResults, ...carriedKeywords],
    bestDomains: bestDomains.map((d) => ({
      domain: d.domain,
      brandId: d.brandId,
      businessType: d.businessType,
      platform: d.platform,
      isEcommerce: d.isEcommerce,
      ownBrandSignal: d.ownBrandSignal,
      retailerScaleScore: d.retailerScaleScore,
      archetypeId: d.archetypeId,
      familyId: d.familyId,
      keywords: d.keywords,
      checked: d.checked,
    })).concat(carriedDomains),
    rejectedLandscape,
    sellerRecovery: {
      recovered: recoveredSellerCount,
      stillUnresolved: keywordResults.reduce(
        (sum, k) => sum + k.unresolvedShoppingSellers.length,
        0
      ),
    },
    cost: {
      dataForSeo: Math.round((budget.spent + priorSpend) * 10000) / 10000,
      dataForSeoCap: budget.cap,
      anthropic: 0,
      lightChecks: checksRun,
    },
    downstream: {
      croAudits: 0,
      conceptRecomputes: 0,
      previews: 0,
      contactDiscovery: 0,
      outreach: 0,
    },
  };

  const serialized = JSON.stringify(report, null, 2);
  await writeFile(REPORT_PATH, serialized, "utf8");
  await writeFile(DASHBOARD_REPORT_PATH, serialized, "utf8");

  await completeRun(supabase, runId, "completed", {
    keywordsTested: keywordResults.length,
    approvedKeywords: keywordResults.filter((k) => k.status === "APPROVED").length,
    dataForSeoCost: budget.spent,
    anthropicCost: 0,
  });

  printReport(report);
}

function printReport(report: CalibrationReport): void {
  console.log("\n=== BRANCH RESULTS ===");
  for (const branch of report.branchResults) {
    console.log(
      `\n${branch.label} (${branch.archetypeId}) → ${branch.verdict}\n` +
        `  keywords ${branch.keywordsTested} (approved ${branch.approvedKeywords}, marginal ${branch.marginalKeywords})\n` +
        `  advertisers raw ${branch.rawAdvertisers} · uniek ${branch.uniqueAdvertisers} · eligible ${branch.prospectEligible}\n` +
        `  merken ${branch.nicheBrands} · specialisten ${branch.specialists} · specialist yield ${branch.specialistYieldPercent}%\n` +
        `  geblokkeerd: retailers ${branch.retailersExcluded} · vergelijkers ${branch.comparisonExcluded} · marketplaces ${branch.marketplacesExcluded}\n` +
        `  prospect yield ${branch.prospectYieldPercent}% · kosten $${branch.cost.toFixed(4)}` +
        (branch.costPerProspectEligible !== null
          ? ` · $${branch.costPerProspectEligible.toFixed(4)} per eligible domein`
          : "") +
        (branch.unresolvedShoppingSellers > 0
          ? `\n  let op: ${branch.unresolvedShoppingSellers} shopping-verkopers zonder domein weggevallen`
          : "")
    );
  }

  console.log("\n=== KEYWORD RESULTS ===");
  for (const keyword of report.keywordResults) {
    console.log(
      `${keyword.status.padEnd(22)} ${keyword.keyword} · ${keyword.archetypeLabel} / ${keyword.familyLabel} · ` +
        `raw ${keyword.rawAdvertisers} · merk+specialist ${keyword.nicheBrands + keyword.specialists} · ` +
        `retail ${keyword.retailers} · vergelijk ${keyword.comparison} · quality ${keyword.serpQualityScore}` +
        (keyword.reason ? ` · ${keyword.reason}` : "")
    );
  }

  console.log("\n=== BEST DOMAINS ===");
  for (const domain of report.bestDomains) {
    console.log(
      `  ${domain.domain} · ${domain.businessType ?? "onbekend"} · ${domain.platform ?? "platform onbekend"} · own-brand ${domain.ownBrandSignal ?? "n/a"} · ${domain.keywords[0] ?? ""}`
    );
  }

  console.log("\n=== REJECTED LANDSCAPE ===");
  for (const domain of report.rejectedLandscape) {
    console.log(`  ${domain.domain} · ${domain.prospectClass} · ${domain.reason ?? ""}`);
  }

  console.log("\n=== COST ===");
  console.log(
    `  DataForSEO $${report.cost.dataForSeo.toFixed(4)} van cap $${report.cost.dataForSeoCap.toFixed(3)}`
  );
  console.log(`  Anthropic $0.0000`);
  console.log(`  Goedkope domeinchecks: ${report.cost.lightChecks}`);
  console.log(`\nRapport: ${REPORT_PATH}\n`);
}

const invokedDirectly = process.argv[1]
  ? resolve(process.argv[1]).endsWith("calibrateProspectDiscovery.js")
  : false;

const replayArg = process.argv.find((arg) => arg.startsWith("--replay="));
const branchArg = process.argv.find((arg) => arg.startsWith("--branches="));

if (invokedDirectly) {
  runProspectDiscoveryCalibration({
    dryRun: process.argv.includes("--dry-run"),
    replayRunId: replayArg ? replayArg.slice("--replay=".length) : undefined,
    branches: branchArg
      ? (branchArg
          .slice("--branches=".length)
          .split(",")
          .map((value) => value.trim().toUpperCase())
          .filter(Boolean) as ProductArchetypeId[])
      : undefined,
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
