/**
 * Milestone 9.3 — Fresh ideal prospect discovery.
 * npm run discover:ideal-prospects
 */

import { config } from "dotenv";
import { execSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import axios from "axios";
import { loadEnv } from "../config/env.js";
import type { KeywordCategoryId } from "../config/keywordCategories.js";
import {
  IDEAL_PROSPECT_CATEGORIES,
  IDEAL_PROSPECT_DISCOVERY_MODE,
  M93_DEFAULTS,
} from "../config/idealProspectProfile.js";
import { M921_CONSERVATIVE_AUDIT_COST } from "../config/outreachCroCoverage.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import { checkGoogleAdsTransparency } from "../services/dataforseo/googleAdsTransparency.js";
import { extractPageSignals } from "../services/crawler/pageExtractor.js";
import { closeCrawlerBrowser } from "../services/crawler/websiteCrawler.js";
import { ensureConceptAuditOpportunity } from "../services/concept/ensureConceptAuditOpportunity.js";
import { loadConceptProspectPool } from "../services/concept/loadConceptProspectPool.js";
import { buildConceptAuditCandidate } from "../services/concept/selectOutreachAuditCandidates.js";
import { auditOpportunity } from "../services/audit/auditRunner.js";
import { computeCurrentPdpQualityScore } from "../services/concept/currentPdpQuality.js";
import { scorePdpTransformationPotential } from "../services/concept/pdpTransformation.js";
import { computeConceptContrastPotential } from "../services/concept/conceptContrastPotential.js";
import {
  computeIdealProspectPreScore,
  scoreDeepDiveFitProxy,
} from "../services/idealProspect/idealProspectScoring.js";
import {
  computeCurrentPdpWeaknessProxy,
  pdpWeaknessSignalsFromHtml,
} from "../services/idealProspect/pdpWeaknessProxy.js";
import { selectIdealProspectKeywords } from "../services/idealProspect/idealKeywordSelector.js";
import {
  evaluateIdealProspectPrequal,
} from "../services/idealProspect/idealProspectPrequal.js";
import { classifyProspectExclusion } from "../services/prospect/prospectPipelineGate.js";
import {
  rankTrueSalesCandidates,
  selectTrueSalesDesignTarget,
} from "../services/idealProspect/trueSalesRanking.js";
import { runKeywordGeneration } from "../services/keywords/keywordEngine.js";
import { classifyKeywordIntentType } from "../services/keywords/keywordIntentType.js";
import {
  assignProspectingTier,
  scoreProspectingValue,
} from "../services/keywords/prospectingValue.js";
import {
  buildProductBrandTokens,
  buildRetailerNameTokens,
} from "../services/keywords/retailerNameDetector.js";
import { qualifyBrandCandidate } from "../services/qualification/brandQualificationRunner.js";
import {
  enrichCandidate,
  saveBrandQualification,
} from "../services/supabase/brandsQualificationRepository.js";
import { upsertQualifiedPage } from "../services/supabase/pagesRepository.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { applyTransparencyResult } from "../services/supabase/transparencyRepository.js";
import {
  evaluateAnthropicBudgetGate,
} from "../services/outreach/anthropicBudget.js";
import { mapWithConcurrency } from "../utils/concurrency.js";
import { logger } from "../utils/logger.js";
import { runGoogleAdsDiscovery } from "./discoverGoogleAds.js";
import type { CroQualityScores } from "../types/audit.js";
import type { ConceptFirstPdpSignals } from "../services/concept/currentPdpQuality.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

type BudgetTracker = { spent: number; cap: number };

function remaining(b: BudgetTracker): number {
  return Math.max(0, b.cap - b.spent);
}

function canSpend(b: BudgetTracker, est: number): boolean {
  return b.spent + est <= b.cap + 1e-9;
}

type ScoredIdealBrand = {
  brandId: string;
  domain: string;
  idealPreScore: number;
  pdpWeaknessProxy: number;
  deepDiveFitProxy: number;
  conceptId: string | null;
  heroUrl: string | null;
  heroTitle: string | null;
  prequalReason: string;
  deprioritized: boolean;
  components: Record<string, number>;
};

async function fetchProductHtml(url: string): Promise<string | null> {
  try {
    const res = await axios.get(url, {
      timeout: 20000,
      maxRedirects: 5,
      headers: { "User-Agent": "MeneerMarketing-COE/1.0" },
      validateStatus: (s) => s < 500,
    });
    if (typeof res.data !== "string") return null;
    return res.data;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  process.env.GOOGLE_DISCOVERY_SKIP_SERP_FETCH = "false";
  process.env.QUALIFICATION_HAIKU_FALLBACK_ENABLED = "false";

  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const dfs = createDataForSeoClient(env);

  const dfsBudget: BudgetTracker = {
    spent: 0,
    cap: env.M93_MAX_DATAFORSEO_COST,
  };
  const anthropicBudget: BudgetTracker = {
    spent: 0,
    cap: env.M93_MAX_ANTHROPIC_COST,
  };

  const run = await createRun(supabase, "ideal_prospect_discovery", {
    milestone: "M9.3",
    mode: IDEAL_PROSPECT_DISCOVERY_MODE,
    apis: { dataforseo: 0, anthropic: 0 },
  });

  const report: Record<string, unknown> = {
    milestone: "M9.3",
    mode: IDEAL_PROSPECT_DISCOVERY_MODE,
    generatedAt: new Date().toISOString(),
  };

  try {
    // --- 1. Activate ideal categories ---
    await supabase
      .from("keyword_categories")
      .update({ paused: false, active: true, updated_at: new Date().toISOString() })
      .in("id", [...IDEAL_PROSPECT_CATEGORIES]);

    let keywordGenCost = 0;
    for (const categoryId of IDEAL_PROSPECT_CATEGORIES) {
      const { count } = await supabase
        .from("keywords")
        .select("id", { count: "exact", head: true })
        .eq("category", categoryId)
        .eq("rejected", false);

      if ((count ?? 0) >= M93_DEFAULTS.minKeywordsPerCategoryBeforeGenerate) continue;
      const estimate = M93_DEFAULTS.estimatedKeywordIdeasCostPerCategory;
      if (!canSpend(dfsBudget, estimate)) break;

      const result = await runKeywordGeneration({
        client: dfs,
        supabase,
        env,
        categoryId: categoryId as KeywordCategoryId,
        dryEstimateOnly: false,
      });
      keywordGenCost += result.actualCost;
      dfsBudget.spent += result.actualCost;
    }

    // Prospect tiers for ideal categories
    const retailerTokens = await buildRetailerNameTokens(supabase);
    const productBrandTokens = await buildProductBrandTokens(supabase);
    const { data: unscored } = await supabase
      .from("keywords")
      .select(
        "id, keyword, commercial_intent_score, product_intent_score, keyword_quality_score, search_volume, competition, cpc, prospect_yield_score, unique_domains_found, retailer_ratio, prospecting_tier"
      )
      .in("category", [...IDEAL_PROSPECT_CATEGORIES])
      .is("prospecting_tier", null)
      .limit(400);

    for (const kw of unscored ?? []) {
      const intent = classifyKeywordIntentType({
        keyword: kw.keyword,
        retailerTokens,
        productBrandTokens,
      });
      const prospecting = scoreProspectingValue({
        keyword: kw.keyword,
        intentType: intent.type,
        commercialIntent: kw.commercial_intent_score,
        productIntent: kw.product_intent_score,
        keywordQuality: kw.keyword_quality_score,
        searchVolume: kw.search_volume,
        competition: kw.competition != null ? Number(kw.competition) : null,
        cpc: kw.cpc != null ? Number(kw.cpc) : null,
        uniqueDomains: kw.unique_domains_found,
        leadEligibleFound: null,
        shopifyFound: null,
        generalRetailersFound: null,
        comparisonSitesFound: null,
      });
      const tier = assignProspectingTier({
        intentType: intent.type,
        prospectingValue: prospecting.score,
        commercialIntent: kw.commercial_intent_score,
        productIntent: kw.product_intent_score,
      });
      await supabase
        .from("keywords")
        .update({
          keyword_intent_type: intent.type,
          keyword_intent_confidence: intent.confidence,
          keyword_intent_reason: intent.reason,
          prospecting_value_score: prospecting.score,
          prospecting_tier: tier.tier,
          eligible_for_auto_approval: tier.eligibleForAutoApproval,
          updated_at: new Date().toISOString(),
        })
        .eq("id", kw.id);
    }

    // --- 2. Keyword selection ---
    const selection = await selectIdealProspectKeywords(supabase, {
      maxKeywords: M93_DEFAULTS.maxKeywords,
      cooldownDays: M93_DEFAULTS.rescanCooldownDays,
    });

    if (!selection.selected.length) {
      throw new Error("No keywords selected for ideal prospect discovery");
    }

    const estimatedSerp =
      selection.selected.length * M93_DEFAULTS.estimatedSerpCostPerKeyword;
    if (!canSpend(dfsBudget, estimatedSerp)) {
      throw new Error(`SERP estimate $${estimatedSerp} exceeds remaining DFS budget`);
    }

    report.discovery = {
      keywords: selection.selected.map((k) => ({
        keyword: k.keyword,
        category: k.category,
        intent: k.keyword_intent_type,
        priority: k.discovery_priority_score,
      })),
      keywordGenCost,
      byCategory: selection.byCategory,
    };

    // --- 3. Google advertiser discovery ---
    const discovery = await runGoogleAdsDiscovery({
      keywordIds: selection.selected.map((k) => k.id),
      skipTransparency: true,
      skipSeedKeywords: true,
      maxKeywords: selection.selected.length,
      maxSerpCost: Math.min(estimatedSerp + 0.02, remaining(dfsBudget)),
    });
    dfsBudget.spent += discovery.serpCost;

    const keywordIds = selection.selected.map((k) => k.id);
    const { data: brandLinks } = await supabase
      .from("ad_occurrences")
      .select(
        "brand_id, keyword_id, brands(id, normalized_domain, last_crawled_at, manual_excluded, business_type, is_ecommerce, retailer_scale_score, business_maturity_score)"
      )
      .in("keyword_id", keywordIds);

    const rawBrandIds = [
      ...new Set(
        (brandLinks ?? [])
          .map((r) => r.brand_id)
          .filter((id): id is string => Boolean(id))
      ),
    ];

    // --- 3b. Central prospect gate, immediately after domain discovery ---
    // Excluded domains stay stored as raw ad intelligence but never reach
    // crawling, hero resolution, scoring, audits or outreach.
    const keywordCategoryById = new Map(
      selection.selected.map((k) => [k.id, String(k.category ?? "UNKNOWN")])
    );
    const brandKeywordSpread = new Map<string, Set<string>>();
    const brandCategorySpread = new Map<string, Set<string>>();
    for (const link of brandLinks ?? []) {
      if (!link.brand_id || !link.keyword_id) continue;
      if (!brandKeywordSpread.has(link.brand_id)) brandKeywordSpread.set(link.brand_id, new Set());
      brandKeywordSpread.get(link.brand_id)!.add(link.keyword_id);
      if (!brandCategorySpread.has(link.brand_id)) brandCategorySpread.set(link.brand_id, new Set());
      const category = keywordCategoryById.get(link.keyword_id);
      if (category) brandCategorySpread.get(link.brand_id)!.add(category);
    }

    const brandSignalById = new Map<string, Record<string, unknown>>();
    for (const link of brandLinks ?? []) {
      const brand = Array.isArray(link.brands) ? link.brands[0] : link.brands;
      if (brand?.id) brandSignalById.set(brand.id, brand as Record<string, unknown>);
    }

    const gateExcluded: Array<{ domain: string; reason: string }> = [];
    const discoveredBrandIds = rawBrandIds.filter((brandId) => {
      const brand = brandSignalById.get(brandId);
      const domain = String(brand?.normalized_domain ?? "");
      if (!domain) return false;
      const verdict = classifyProspectExclusion({
        domain,
        businessType: (brand?.business_type as string | null) ?? null,
        isEcommerce: (brand?.is_ecommerce as boolean | null) ?? null,
        manualExcluded: (brand?.manual_excluded as boolean | null) ?? null,
        retailerScaleScore: (brand?.retailer_scale_score as number | null) ?? null,
        businessMaturityScore: (brand?.business_maturity_score as number | null) ?? null,
        categorySpread: brandCategorySpread.get(brandId)?.size ?? 0,
        keywordSpread: brandKeywordSpread.get(brandId)?.size ?? 0,
      });
      if (!verdict.eligible) {
        gateExcluded.push({ domain, reason: verdict.reason ?? "prospect_gate_rejected" });
      }
      return verdict.eligible;
    });

    logger.info("Prospect gate", {
      raw: rawBrandIds.length,
      eligible: discoveredBrandIds.length,
      excluded: gateExcluded.length,
    });

    const { data: existingCandidates } = await supabase
      .from("coe_concept_candidates")
      .select("brand_id, brands(normalized_domain)")
      .limit(500);

    const existingDomains = new Set(
      (existingCandidates ?? []).map((c) => {
        const b = Array.isArray(c.brands) ? c.brands[0] : c.brands;
        return String(b?.normalized_domain ?? "").toLowerCase();
      })
    );

    report.discovery = {
      ...(report.discovery as object),
      serpCost: discovery.serpCost,
      uniqueAdvertisers: discovery.uniqueAdvertisers,
      rawDomainCount: rawBrandIds.length,
      discoveredBrandCount: discoveredBrandIds.length,
      gateExcludedCount: gateExcluded.length,
      gateExcluded,
      existingPoolDomains: existingDomains.size,
    };

    // --- 4. Qualify uncrawled ---
    const { data: brandRows } = await supabase
      .from("brands")
      .select(
        "id, normalized_domain, name, confirmed_google_advertiser, transparency_confirmed, last_crawled_at, platform, is_ecommerce, business_type, retailer_scale_score, manual_excluded, business_maturity_score, lead_eligible"
      )
      .in(
        "id",
        discoveredBrandIds.length
          ? discoveredBrandIds
          : ["00000000-0000-0000-0000-000000000000"]
      );

    const toQualify = (brandRows ?? []).filter(
      (b) => !b.last_crawled_at && !b.manual_excluded
    );

    let haikuCost = 0;
    try {
      await mapWithConcurrency(toQualify, env.CRAWLER_CONCURRENCY, async (brand) => {
        try {
          const candidate = await enrichCandidate(supabase, brand as never);
          const result = await qualifyBrandCandidate(env, candidate);
          haikuCost += result.haikuCostEstimate ?? 0;
          await saveBrandQualification(supabase, {
            brandId: brand.id,
            crawlStatus: result.crawlStatus,
            isEcommerce: result.isEcommerce,
            ecommerceConfidence: result.ecommerceConfidence,
            platform: result.platform,
            platformConfidence: result.platformConfidence,
            platformCandidate: result.platformCandidate,
            platformEvidence: result.platformEvidence,
            shopifyConfidence: result.shopifyConfidence,
            businessType: result.businessType,
            businessTypeConfidence: result.businessTypeConfidence,
            businessTypeReasoning: result.businessTypeReasoning,
            leadEligible: result.leadEligible,
            qualificationReason: result.qualificationReason,
            qualificationEvidence: result.qualificationEvidence,
            businessMaturityScore: result.businessMaturityScore,
            businessMaturityComponents: result.businessMaturityComponents,
            retailerScaleScore: result.retailerScaleScore,
            crawlMetadata: { errors: result.errors },
          });
          if (result.crawlStatus === "success") {
            await upsertQualifiedPage(supabase, {
              brandId: brand.id,
              url: result.crawlStartUrl,
              finalUrl: result.crawlFinalUrl,
              crawlStatus: result.crawlStatus,
              productPage: result.productPage,
              signals: result.pageSignals,
              maturityScore: result.businessMaturityScore,
            });
          }
        } catch (err) {
          logger.warn("Ideal qualify failed", {
            domain: brand.normalized_domain,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      });
    } finally {
      await closeCrawlerBrowser();
    }
    anthropicBudget.spent += haikuCost;

    // --- 5. Concept score for discovered brands ---
    if (discoveredBrandIds.length) {
      execSync("node dist/jobs/scoreConcepts.js", {
        cwd: projectRoot,
        env: {
          ...process.env,
          M93_SCORE_BRAND_IDS: discoveredBrandIds.join(","),
        },
        stdio: "inherit",
      });
    }

    // --- 6. Ideal pre-score + PDP screen ---
    const { data: candidates } = await supabase
      .from("coe_concept_candidates")
      .select(
        `id, brand_id, brand_commerce_model, catalog_focus_score, estimated_product_count,
         estimated_brand_count, hero_product_score, primary_concept_product_url,
         primary_concept_product_title, primary_concept_product_price,
         product_commercial_signal_score, concept_asset_readiness_score,
         concept_ready_components,
         brands ( normalized_domain, platform, business_type, business_maturity_score,
           retailer_scale_score, confirmed_google_advertiser, transparency_confirmed,
           is_ecommerce, manual_excluded )`
      )
      .in(
        "brand_id",
        discoveredBrandIds.length
          ? discoveredBrandIds
          : ["00000000-0000-0000-0000-000000000000"]
      );

    const idealScored: ScoredIdealBrand[] = [];
    const idealPreScoreMap = new Map<string, number>();
    const newBrandIds = new Set(discoveredBrandIds);

    for (const c of candidates ?? []) {
      const brand = Array.isArray(c.brands) ? c.brands[0] : c.brands;
      if (!brand) continue;
      const domain = String(brand.normalized_domain ?? "");

      const prequal = evaluateIdealProspectPrequal({
        domain,
        isEcommerce: Boolean(brand.is_ecommerce),
        businessType: brand.business_type,
        platform: brand.platform,
        retailerScaleScore: brand.retailer_scale_score,
        estimatedProductCount: c.estimated_product_count,
        estimatedBrandCount: c.estimated_brand_count,
        brandCommerceModel: String(c.brand_commerce_model),
        manualExcluded: Boolean(brand.manual_excluded),
        businessMaturityScore: brand.business_maturity_score,
      });

      if (!prequal.accepted) continue;

      const heroUrl = c.primary_concept_product_url as string | null;
      let pdpWeakness = 50;
      let imageCount: number | null = null;

      if (heroUrl) {
        const html = await fetchProductHtml(heroUrl);
        if (html) {
          const signals = pdpWeaknessSignalsFromHtml(html, heroUrl, brand.platform);
          const weakness = computeCurrentPdpWeaknessProxy({
            ...signals,
            signals: extractPageSignals(html, heroUrl),
          });
          pdpWeakness = weakness.score;
          imageCount = signals.imageCount;
        }
      }

      const descLen = 0;
      const idealInput = {
        confirmedGoogleAdvertiser: Boolean(brand.confirmed_google_advertiser),
        paidConfirmed: false,
        transparencyConfirmed: Boolean(brand.transparency_confirmed),
        platform: brand.platform,
        brandCommerceModel: String(c.brand_commerce_model),
        catalogFocusScore: c.catalog_focus_score,
        estimatedProductCount: c.estimated_product_count,
        heroProductScore: c.hero_product_score,
        productCommercialSignalScore: c.product_commercial_signal_score,
        primaryProductPrice: c.primary_concept_product_price,
        productDescriptionLength: descLen,
        businessMaturityScore: brand.business_maturity_score,
        retailerScaleScore: brand.retailer_scale_score,
        pdpWeaknessProxy: pdpWeakness,
        imageCount,
        reviewCount: null,
        rating: null,
        benefitsRichnessHint: false,
      };

      const pre = computeIdealProspectPreScore(idealInput);
      const deepDive = scoreDeepDiveFitProxy(idealInput);

      if (prequal.deprioritized) {
        pre.ideal_prospect_pre_score = Math.max(0, pre.ideal_prospect_pre_score - 12);
      }

      idealPreScoreMap.set(c.brand_id as string, pre.ideal_prospect_pre_score);

      await supabase
        .from("coe_concept_candidates")
        .update({
          concept_ready_components: {
            ...(typeof c.concept_ready_components === "object"
              ? (c.concept_ready_components as Record<string, unknown>)
              : {}),
            ideal_prospect_v1: {
              pre_score: pre.ideal_prospect_pre_score,
              pdp_weakness_proxy: pdpWeakness,
              deep_dive_fit_proxy: deepDive.score,
              components: pre.components,
              evidence: pre.evidence,
              discovery_run: run.id,
              deprioritized: prequal.deprioritized,
            },
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", c.id);

      idealScored.push({
        brandId: c.brand_id as string,
        domain,
        idealPreScore: pre.ideal_prospect_pre_score,
        pdpWeaknessProxy: pdpWeakness,
        deepDiveFitProxy: deepDive.score,
        conceptId: c.id as string,
        heroUrl,
        heroTitle: c.primary_concept_product_title as string | null,
        prequalReason: prequal.reason,
        deprioritized: prequal.deprioritized,
        components: pre.components,
      });
    }

    idealScored.sort((a, b) => b.idealPreScore - a.idealPreScore);
    const top20 = idealScored.slice(0, M93_DEFAULTS.maxStrongProspects);

    report.prequalification = {
      scored: idealScored.length,
      rejected: (candidates?.length ?? 0) - idealScored.length,
      top20: top20.map((t) => ({
        domain: t.domain,
        preScore: t.idealPreScore,
        pdpWeakness: t.pdpWeaknessProxy,
        deepDiveProxy: t.deepDiveFitProxy,
      })),
    };

    // --- 7. Selective transparency on top pre-scores ---
    const transparencyDomains = top20
      .slice(0, M93_DEFAULTS.transparencyMaxDomains)
      .map((t) => t.domain);
    let transparencyCost = 0;
    for (const domain of transparencyDomains) {
      if (!canSpend(dfsBudget, 0.004)) break;
      try {
        const result = await checkGoogleAdsTransparency({ client: dfs, env }, domain);
        transparencyCost += result.cost;
        dfsBudget.spent += result.cost;
        await applyTransparencyResult(supabase, result);
      } catch {
        // skip
      }
    }

    // --- 8. CRO audits max 8 ---
    const auditResults: Array<Record<string, unknown>> = [];
    const auditCandidates = top20
      .filter((t) => t.heroUrl && t.conceptId)
      .slice(0, M93_DEFAULTS.maxAudits);

    for (const target of auditCandidates) {
      const gate = evaluateAnthropicBudgetGate({
        currentRunCost: anthropicBudget.spent,
        configuredCap: anthropicBudget.cap,
        conservativeNextCallCost: M921_CONSERVATIVE_AUDIT_COST,
        label: target.domain,
      });
      if (!gate.allowed) {
        auditResults.push({
          domain: target.domain,
          skipped: true,
          reason: gate.reason,
        });
        break;
      }

      const opportunityId = await ensureConceptAuditOpportunity(supabase, {
        conceptId: target.conceptId!,
        brandId: target.brandId,
        productUrl: target.heroUrl!,
      });

      const auditCandidate = await buildConceptAuditCandidate(
        supabase,
        opportunityId,
        target.heroUrl!
      );
      if (!auditCandidate) {
        auditResults.push({
          domain: target.domain,
          skipped: true,
          reason: "no_audit_candidate",
        });
        continue;
      }

      const result = await auditOpportunity(env, supabase, auditCandidate, run.id);
      anthropicBudget.spent += result.anthropicCost;

      if (!result.skipped) {
        const { data: auditRow } = await supabase
          .from("audits")
          .select("cro_scores, findings, audit_confidence, page_health_status")
          .eq("opportunity_id", opportunityId)
          .order("audited_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        const cro = (auditRow?.cro_scores ?? {}) as CroQualityScores;
        const findings = auditRow?.findings as {
          concept_first_signals?: ConceptFirstPdpSignals;
        } | null;
        const quality = computeCurrentPdpQualityScore(
          cro,
          findings?.concept_first_signals
        );

        const transform = scorePdpTransformationPotential({
          croQualityScore: quality.score,
          leakCount: 0,
          strengthCount: 0,
          productCommercialSignal: target.components.heroProduct ?? 50,
          assetReadiness: target.components.assetReadinessProxy ?? 50,
          catalogFocus: target.components.catalogFocus ?? 50,
          brandCommerceModel: "UNKNOWN",
          retailerScaleScore: null,
          mmFitScore: result.meneerMarketingFitScore ?? null,
          siteTechnicallyBroken: false,
          storytellingWeak: null,
          aboveFoldWeak: null,
          trustNearBuyblockWeak: null,
          deepDiveWeak: null,
        });

        const contrast = computeConceptContrastPotential({
          currentPdpQuality: quality.score,
          croQualityComposite: quality.score,
          croDataSource: "AUDITED",
          auditConfidence: auditRow?.audit_confidence ?? null,
          visualDesignQuality:
            findings?.concept_first_signals?.premium_design_perception ??
            (cro.visual_design_quality ?? null),
          productStorytellingQuality: cro.product_storytelling_quality ?? null,
          productPresentationQuality: cro.product_presentation_quality ?? null,
          deepDiveQuality:
            findings?.concept_first_signals?.deep_dive_quality ??
            (cro.product_presentation_quality ?? null),
          conceptAssetReadiness: target.components.assetReadinessProxy ?? null,
          productCommercialSignal: target.components.heroProduct ?? null,
          catalogFocus: target.components.catalogFocus ?? null,
          businessMaturity: target.components.businessMaturity ?? null,
          brandCommerceModel: "UNKNOWN",
          productDescriptionLength: 0,
          reviewCount: null,
          siteTechnicallyBroken: false,
        });

        await supabase
          .from("coe_concept_candidates")
          .update({
            pdp_transformation_potential: transform.pdp_transformation_potential,
            concept_contrast_potential: contrast.concept_contrast_potential,
            concept_contrast_band: contrast.band,
            concept_contrast_confidence: contrast.confidence,
            concept_contrast_ceiling: contrast.ceilingApplied,
            concept_contrast_evidence: contrast.evidence,
            concept_contrast_computed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", target.conceptId);

        auditResults.push({
          domain: target.domain,
          skipped: false,
          currentPdpQuality: quality.score,
          transformation: transform.pdp_transformation_potential,
          conceptContrast: contrast.concept_contrast_potential,
          contrastBand: contrast.band,
          auditConfidence: auditRow?.audit_confidence,
          cost: result.anthropicCost,
        });
      } else {
        auditResults.push({
          domain: target.domain,
          skipped: true,
          reason: result.skipReason,
          cost: result.anthropicCost,
        });
      }
    }

    report.audits = auditResults;

    // --- 9. TRUE SALES ranking ---
    const pool = await loadConceptProspectPool(supabase);
    const trueSalesRanked = rankTrueSalesCandidates(pool, idealPreScoreMap, newBrandIds);
    const designTarget = selectTrueSalesDesignTarget(trueSalesRanked);

    report.trueSalesRanking = {
      top10: trueSalesRanked.slice(0, 10),
      designTarget,
    };

    report.costs = {
      dataforseo: dfsBudget.spent,
      anthropic: anthropicBudget.spent,
      dataforseoCap: dfsBudget.cap,
      anthropicCap: anthropicBudget.cap,
      keywordGenCost,
      transparencyCost,
    };

    const reportDir = resolve(
      projectRoot,
      "dashboard/src/preview/concepts/data"
    );
    await mkdir(reportDir, { recursive: true });
    const reportPath = resolve(reportDir, "ideal-prospect-report.json");
    await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

    logger.info("M9.3 ideal prospect discovery complete", {
      discovered: discoveredBrandIds.length,
      top20: top20.length,
      audits: auditResults.filter((a) => !a.skipped).length,
      designTarget: designTarget.recommended?.domain,
      dfsCost: dfsBudget.spent,
      anthropicCost: anthropicBudget.spent,
      reportPath,
    });

    await completeRun(supabase, run.id, "completed", {
      dataForSeoCost: dfsBudget.spent,
      anthropicCost: anthropicBudget.spent,
      discoveredBrands: discoveredBrandIds.length,
      designTarget: designTarget.recommended?.domain ?? null,
    });
  } catch (error) {
    await completeRun(supabase, run.id, "failed", {
      error: error instanceof Error ? error.message : "unknown",
      dataForSeoCost: dfsBudget.spent,
      anthropicCost: anthropicBudget.spent,
    });
    logger.error("M9.3 failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    process.exit(1);
  }
}

main();
