/**
 * Milestone 9.4 — HIGH-TICKET FOCUSED BRAND DISCOVERY.
 *
 * Looks for a commercial shape instead of a branch: a small or mid-sized brand
 * with a compact catalog, a product of real value that needs explaining, paid
 * traffic already running, and a product page that does not do any of it
 * justice yet.
 *
 * Hard boundaries: no Claude, no CRO audit, no concept brief, no preview, no
 * contact discovery, no outreach. DataForSEO spend is checked before every
 * call, and the sleep and pet branches stay parked.
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { config } from "dotenv";

import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import { fetchGooglePaidAds } from "../services/dataforseo/googleSerp.js";
import { classifySerpSignal } from "../config/signalClassification.js";
import { upsertBrandFromAd } from "../services/supabase/brandsRepository.js";
import { storeAdOccurrence } from "../services/supabase/adOccurrencesRepository.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { isBlacklistedDomain } from "../config/blacklist.js";
import { ARCHETYPE_BY_ID, type ProductArchetypeId } from "../config/idealProductArchetypes.js";
import {
  HIGH_TICKET_BRANCHES,
  M94_DISCOVERY,
  M94_DISCOVERY_VERSION,
  PARKED_ARCHETYPES,
  SCREENSHOT_CONFIG,
  type HighTicketFunnelStage,
} from "../config/highTicketDiscovery.js";
import {
  HIGH_TICKET_PROFILE_VERSION,
  HIGH_TICKET_THRESHOLDS,
} from "../config/highTicketProspect.js";
import {
  expandFamilyKeywords,
  persistFamilyKeywords,
  selectProductionKeywords,
  type FamilyKeyword,
  type RejectedKeyword,
} from "../services/idealProspect/familyKeywordExpander.js";
import {
  computeSerpProspectQuality,
  type KeywordProspectStatus,
} from "../services/idealProspect/serpProspectQuality.js";
import { closeCrawlerBrowser } from "../services/crawler/websiteCrawler.js";
import { classifyProspectExclusion } from "../services/prospect/prospectPipelineGate.js";
import { runLightBrandCheck } from "../services/prospect/lightBrandCheck.js";
import { runCatalogFocusCheck } from "../services/prospect/catalogFocusCheck.js";
import { computeDeepDivePdpFitProxy } from "../services/prospect/prospectPreScore.js";
import { isUsableHeroUrl } from "../services/idealProspect/newProspectPreselection.js";
import { resolveFlagshipProduct } from "../services/prospect/flagshipProductResolver.js";
import { computeCompanyScaleFit } from "../services/prospect/companyScaleFit.js";
import { estimateContrastCeiling } from "../services/prospect/estimatedContrastCeiling.js";
import { computeHighTicketFocusedFit } from "../services/prospect/highTicketFocusedFit.js";
import { recoverShoppingSellerAds } from "../services/prospect/shoppingSellerRecovery.js";
import type { SellerDomainResolution } from "../services/prospect/sellerDomainResolver.js";
import { BUSINESS_CLASSIFIER_VERSION } from "../services/crawler/businessClassifier.js";
import {
  extractAdProduct,
  resolveHeroProducts,
  type AdProduct,
  type ResolvedHero,
} from "../services/prospect/heroProductResolver.js";
import { logger } from "../utils/logger.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const REPORT_PATH = resolve(projectRoot, "reports/high-ticket-discovery-report.json");
const DASHBOARD_REPORT_PATH = resolve(
  projectRoot,
  "dashboard/src/preview/concepts/data/high-ticket-discovery-report.json"
);
const SCREENSHOT_DIR = resolve(projectRoot, SCREENSHOT_CONFIG.outputDir);
const SOURCE = "dataforseo_google_serp_live";

interface DiscoveredDomain {
  domain: string;
  brandId: string | null;
  brandName: string;
  landingUrls: string[];
  archetypeId: ProductArchetypeId;
  familyId: string;
  familyLabel: string;
  keywords: string[];
  sellerResolution: string | null;
  prospectClass: string;
  gateEligible: boolean;
  gateReason: string | null;
  businessType: string | null;
  platform: string | null;
  isEcommerce: boolean | null;
  retailerScaleScore: number | null;
  businessMaturityScore: number | null;
  ownBrandSignal: number | null;
  ownBrandEvidence: string[];
  homepageProductLinks: number;
  homepageCategoryLinks: number;
  retailerBreadthScore: number | null;
  internationalPresenceScore: number | null;
  catalogFocusScore: number | null;
  catalogVerified: boolean;
  estimatedCatalogSize: number | null;
  catalogEvidence: string[];
  adProducts: AdProduct[];
  heroes: ResolvedHero[];
  pdpWeaknessScore: number | null;
  assetReadinessProxy: number | null;
  deepDivePdpFitProxy: number | null;
  /** False when the hero resolved to a homepage or a non-product route. */
  heroUrlIsProductPage: boolean;
  companyScaleFitScore: number | null;
  companyScaleBand: string | null;
  companyScaleEvidence: string[];
  estimatedContrastCeiling: number | null;
  contrastCeilingEvidence: string[];
  highTicketFitScore: number | null;
  priceBand: string | null;
  priceBandLabel: string | null;
  catalogBandLabel: string | null;
  fitEvidence: string[];
  fitPenalties: Array<{ reason: string; points: number }>;
  lightChecked: boolean;
}

interface KeywordOutcome {
  keyword: string;
  keywordId: string | null;
  archetypeId: ProductArchetypeId;
  familyId: string;
  familyLabel: string;
  seed: string;
  generationSource: string;
  archetypeFit: number;
  preGateClass: string;
  prospectingValue: number;
  searchVolume: number | null;
  status: KeywordProspectStatus;
  serpQualityScore: number;
  reason: string | null;
  rawAdvertisers: number;
  prospectEligible: number;
  approvedForDiscovery: boolean;
  cost: number;
  domains: string[];
  recoveredSellers: number;
  unresolvedSellers: string[];
}

interface CandidateRecord {
  rank: number;
  domain: string;
  siteUrl: string;
  heroProductUrl: string | null;
  /** Where the shown product page came from. */
  heroUrlSource: "ad_landing" | "catalog_flagship" | null;
  branch: ProductArchetypeId;
  branchLabel: string;
  familyId: string;
  familyLabel: string;
  platform: string | null;
  businessType: string | null;
  commerceModel: string;
  companyScaleFit: number | null;
  companyScaleBand: string | null;
  businessMaturity: number | null;
  estimatedCatalogSize: number | null;
  catalogFocusScore: number | null;
  catalogVerified: boolean;
  catalogBandLabel: string | null;
  ownBrandSignal: number | null;
  heroProduct: string | null;
  heroPrice: number | null;
  heroCurrency: string | null;
  heroScore: number | null;
  priceBand: string | null;
  priceBandLabel: string | null;
  googleAdsEvidence: { keywords: string[]; landingUrls: string[]; sellerResolution: string | null };
  assetReadinessProxy: number | null;
  deepDivePdpFitProxy: number | null;
  currentPdpWeaknessProxy: number | null;
  estimatedContrastCeiling: number | null;
  contrastCeilingEvidence: string[];
  highTicketFocusedFitScore: number | null;
  evidence: string[];
  penalties: Array<{ reason: string; points: number }>;
  screenshots: Record<string, string> | null;
}

interface HighTicketReport {
  milestone: string;
  version: string;
  profileVersion: string;
  runId: string;
  startedAt: string;
  finishedAt: string;
  discovery: {
    branches: Array<{ archetypeId: ProductArchetypeId; families: string[]; evidence: string }>;
    parkedArchetypes: Array<{ archetypeId: string; reason: string }>;
    keywordsGenerated: number;
    keywordsRejected: RejectedKeyword[];
    keywordsTested: number;
    keywordsApproved: number;
    keywordsNotTested: string[];
    rawAdvertisers: number;
    uniqueAdvertisers: number;
    shoppingSellersResolved: number;
    shoppingSellersUnresolved: number;
    skippedForBudget: string[];
  };
  keywords: KeywordOutcome[];
  funnel: Record<HighTicketFunnelStage, number>;
  funnelYieldPercent: Record<string, number>;
  excludedRetailers: Array<{ domain: string; prospectClass: string; reason: string | null }>;
  candidates: CandidateRecord[];
  ranked: CandidateRecord[];
  manualReview: CandidateRecord[];
  cost: {
    dataForSeo: number;
    dataForSeoCap: number;
    keywordIdeas: number;
    serp: number;
    anthropic: number;
    costPerCandidate: number | null;
    lightChecks: number;
    catalogChecks: number;
    heroResolutions: number;
  };
  downstream: Record<string, number>;
}

type BudgetTracker = { spent: number; cap: number };

function canSpend(budget: BudgetTracker, estimate: number): boolean {
  return budget.spent + estimate <= budget.cap + 1e-9;
}

function percent(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

function approvedForDiscovery(status: KeywordProspectStatus, qualityScore: number): boolean {
  if (status === "APPROVED") return true;
  return status === "MARGINAL" && qualityScore >= M94_DISCOVERY.minKeywordQualityScore;
}

function emptyDomain(input: {
  domain: string;
  brandId: string | null;
  brandName: string;
  archetypeId: ProductArchetypeId;
  familyId: string;
  familyLabel: string;
  sellerResolution: string | null;
}): DiscoveredDomain {
  return {
    ...input,
    landingUrls: [],
    keywords: [],
    prospectClass: "UNKNOWN",
    gateEligible: false,
    gateReason: null,
    businessType: null,
    platform: null,
    isEcommerce: null,
    retailerScaleScore: null,
    businessMaturityScore: null,
    ownBrandSignal: null,
    ownBrandEvidence: [],
    homepageProductLinks: 0,
    homepageCategoryLinks: 0,
    retailerBreadthScore: null,
    internationalPresenceScore: null,
    catalogFocusScore: null,
    catalogVerified: false,
    estimatedCatalogSize: null,
    catalogEvidence: [],
    adProducts: [],
    heroes: [],
    pdpWeaknessScore: null,
    assetReadinessProxy: null,
    deepDivePdpFitProxy: null,
    heroUrlIsProductPage: false,
    companyScaleFitScore: null,
    companyScaleBand: null,
    companyScaleEvidence: [],
    estimatedContrastCeiling: null,
    contrastCeilingEvidence: [],
    highTicketFitScore: null,
    priceBand: null,
    priceBandLabel: null,
    catalogBandLabel: null,
    fitEvidence: [],
    fitPenalties: [],
    lightChecked: false,
  };
}

interface StoredClassification {
  business_type: string | null;
  platform: string | null;
  is_ecommerce: boolean | null;
  manual_excluded: boolean | null;
  retailer_scale_score: number | null;
  business_maturity_score: number | null;
  own_brand_signal_score: number | null;
  business_classifier_version: string | null;
  classification_needs_recompute: boolean | null;
}

async function loadStoredClassifications(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  domains: string[]
): Promise<Map<string, StoredClassification>> {
  const result = new Map<string, StoredClassification>();
  if (domains.length === 0) return result;

  for (let index = 0; index < domains.length; index += 100) {
    const chunk = domains.slice(index, index + 100);
    const { data, error } = await supabase
      .from("brands")
      .select(
        "normalized_domain, business_type, platform, is_ecommerce, manual_excluded, retailer_scale_score, business_maturity_score, own_brand_signal_score, business_classifier_version, classification_needs_recompute"
      )
      .in("normalized_domain", chunk);
    if (error) throw new Error(`classification load failed: ${error.message}`);
    for (const row of data ?? []) {
      result.set(String(row.normalized_domain), row as unknown as StoredClassification);
    }
  }
  return result;
}

/**
 * Crawls fail differently on every pass, so a domain measured in one run can
 * come back empty in the next. Dropping it would mean the candidate list
 * silently changes shape between passes over the same purchased SERP data.
 * Whichever pass measured a domain best wins.
 */
function mergeWithPreviousPass(
  current: CandidateRecord[],
  previous: CandidateRecord[]
): CandidateRecord[] {
  const measured = (entry: CandidateRecord): number =>
    (entry.catalogVerified ? 2 : 0) +
    (entry.heroProductUrl ? 2 : 0) +
    (entry.heroPrice != null ? 1 : 0) +
    (entry.currentPdpWeaknessProxy != null ? 1 : 0) +
    (entry.assetReadinessProxy != null ? 1 : 0);

  const byDomain = new Map<string, CandidateRecord>();
  for (const entry of [...previous, ...current]) {
    const existing = byDomain.get(entry.domain);
    if (!existing) {
      byDomain.set(entry.domain, entry);
      continue;
    }
    const better =
      measured(entry) > measured(existing)
        ? entry
        : measured(entry) < measured(existing)
          ? existing
          : (entry.highTicketFocusedFitScore ?? 0) >= (existing.highTicketFocusedFitScore ?? 0)
            ? entry
            : existing;
    // Screenshots survive whichever record loses, so a shortlist that was
    // already captured does not have to be captured again.
    byDomain.set(entry.domain, {
      ...better,
      screenshots: better.screenshots ?? existing.screenshots ?? entry.screenshots,
    });
  }

  return [...byDomain.values()]
    .sort((a, b) => (b.highTicketFocusedFitScore ?? 0) - (a.highTicketFocusedFitScore ?? 0))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

async function loadPreviousCandidates(): Promise<CandidateRecord[]> {
  try {
    const raw = await readFile(REPORT_PATH, "utf8");
    const parsed = JSON.parse(raw) as { candidates?: CandidateRecord[] };
    return parsed.candidates ?? [];
  } catch {
    return [];
  }
}

/** Rehydrates the exact keyword set a stored run used, lineage included. */
async function loadKeywordsFromRun(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  runId: string
): Promise<Array<FamilyKeyword & { id: string }>> {
  const { data: run } = await supabase
    .from("runs")
    .select("metadata")
    .eq("id", runId)
    .maybeSingle();
  const names = ((run?.metadata ?? {}) as { keywords?: string[] }).keywords ?? [];
  if (names.length === 0) return [];

  const { data, error } = await supabase
    .from("keywords")
    .select(
      "id, keyword, category, cluster, seed_keyword, keyword_source, product_archetype_id, product_family_id, product_archetype_fit_score, keyword_pre_gate_class, prospecting_value_score, search_volume, cpc"
    )
    .in("keyword", names);
  if (error) throw new Error(`replay keywords load failed: ${error.message}`);

  return (data ?? []).map((row) => {
    const archetypeId = String(row.product_archetype_id) as ProductArchetypeId;
    const familyId = String(row.cluster ?? row.product_family_id ?? "");
    const family = ARCHETYPE_BY_ID.get(archetypeId)?.families.find(
      (entry) => entry.id === familyId
    );
    return {
      id: String(row.id),
      keyword: String(row.keyword),
      category: String(row.category ?? ""),
      archetypeId,
      familyId,
      familyLabel: family?.label ?? familyId,
      seed: String(row.seed_keyword ?? row.keyword),
      generationSource:
        row.keyword_source === "ARCHETYPE_EXPANSION"
          ? ("dataforseo_ideas" as const)
          : ("family_seed" as const),
      archetypeFit: Number(row.product_archetype_fit_score ?? 0),
      preGateClass: String(row.keyword_pre_gate_class ?? ""),
      prospectingValue: Number(row.prospecting_value_score ?? 0),
      searchVolume: (row.search_volume as number | null) ?? null,
      cpc: (row.cpc as number | null) ?? null,
    };
  });
}

/**
 * Rebuilds the advertiser sample from a stored run. Same gate, same scoring,
 * zero DataForSEO spend, so a gate fix never means buying the SERPs twice.
 */
async function replayStoredRun(input: {
  supabase: ReturnType<typeof createSupabaseServerClient>;
  runId: string;
  keywords: Array<FamilyKeyword & { id: string }>;
  domainIndex: Map<string, DiscoveredDomain>;
  keywordOutcomes: KeywordOutcome[];
}): Promise<{ recoveredSellers: number }> {
  const { data, error } = await input.supabase
    .from("ad_occurrences")
    .select(
      "keyword_id, brand_id, landing_url, headline, serp_item_type, raw_payload, brands(normalized_domain, name)"
    )
    .eq("run_id", input.runId);
  if (error) throw new Error(`replay load failed: ${error.message}`);

  const rows = data ?? [];
  const recoveredSellers = new Set(
    rows
      .filter(
        (row) =>
          ((row.raw_payload ?? {}) as { seller_domain_resolution?: string })
            .seller_domain_resolution
      )
      .map((row) => String(row.brand_id))
  );

  const storedByDomain = await loadStoredClassifications(input.supabase, [
    ...new Set(
      rows
        .map((row) => {
          const brand = (Array.isArray(row.brands) ? row.brands[0] : row.brands) as {
            normalized_domain?: string;
          } | null;
          return brand?.normalized_domain ?? null;
        })
        .filter((domain): domain is string => Boolean(domain))
    ),
  ]);

  for (const keyword of input.keywords) {
    const keywordRows = rows.filter((row) => row.keyword_id === keyword.id);
    if (keywordRows.length === 0) continue;

    const sample: string[] = [];
    const pending: DiscoveredDomain[] = [];
    const seen = new Set<string>();

    for (const row of keywordRows) {
      const brand = (Array.isArray(row.brands) ? row.brands[0] : row.brands) as {
        normalized_domain?: string;
        name?: string;
      } | null;
      const domain = brand?.normalized_domain;
      if (!domain) continue;
      if (!seen.has(domain)) {
        seen.add(domain);
        sample.push(domain);
      }
      if (isBlacklistedDomain(domain)) continue;

      const rawItem = (row.raw_payload ?? {}) as Record<string, unknown>;
      let entry = input.domainIndex.get(domain);
      if (!entry) {
        entry = emptyDomain({
          domain,
          brandId: row.brand_id ? String(row.brand_id) : null,
          brandName: brand?.name ?? domain,
          archetypeId: keyword.archetypeId,
          familyId: keyword.familyId,
          familyLabel: keyword.familyLabel,
          sellerResolution:
            (rawItem as { seller_domain_resolution?: string }).seller_domain_resolution ?? null,
        });
        input.domainIndex.set(domain, entry);
        pending.push(entry);
      }
      if (!entry.keywords.includes(keyword.keyword)) entry.keywords.push(keyword.keyword);
      const landingUrl = row.landing_url as string | null;
      if (landingUrl && !entry.landingUrls.includes(landingUrl)) entry.landingUrls.push(landingUrl);

      const adProduct = extractAdProduct({
        headline: (row.headline as string | null) ?? null,
        landingUrl,
        serpItemType: String(row.serp_item_type ?? ""),
        rawItem,
      });
      if (adProduct && !entry.adProducts.some((item) => item.title === adProduct.title)) {
        entry.adProducts.push(adProduct);
      }
    }

    const quality = computeSerpProspectQuality(
      sample.map((domain) => ({
        domain,
        businessType: storedByDomain.get(domain)?.business_type ?? null,
      })),
      { archetypeTooBroad: keyword.archetypeFit < 40, coldStart: true }
    );
    const approved = approvedForDiscovery(quality.status, quality.prospectSerpQualityScore);
    if (!approved) {
      for (const entry of pending) input.domainIndex.delete(entry.domain);
    }

    input.keywordOutcomes.push({
      keyword: keyword.keyword,
      keywordId: keyword.id,
      archetypeId: keyword.archetypeId,
      familyId: keyword.familyId,
      familyLabel: keyword.familyLabel,
      seed: keyword.seed,
      generationSource: keyword.generationSource,
      archetypeFit: keyword.archetypeFit,
      preGateClass: keyword.preGateClass,
      prospectingValue: keyword.prospectingValue,
      searchVolume: keyword.searchVolume,
      status: quality.status,
      serpQualityScore: quality.prospectSerpQualityScore,
      reason: quality.stopReason,
      rawAdvertisers: sample.length,
      prospectEligible: quality.prospectDomains.length + quality.provisionalDomains.length,
      approvedForDiscovery: approved,
      cost: 0,
      domains: sample,
      recoveredSellers: 0,
      unresolvedSellers: [],
    });
  }

  return { recoveredSellers: recoveredSellers.size };
}

/**
 * Newsletter and cookie overlays cover exactly the part of the page we want to
 * judge. Escape closes most of them; the rest respond to their own close button.
 */
async function dismissOverlays(page: import("playwright").Page): Promise<void> {
  const closeSelectors = [
    '[aria-label*="close" i]',
    '[aria-label*="sluit" i]',
    ".klaviyo-close-form",
    '[class*="close" i][role="button"]',
    'button[class*="close" i]',
    'button[id*="close" i]',
    '[data-testid*="close" i]',
    "#onetrust-accept-btn-handler",
    'button:has-text("Nee bedankt")',
    'button:has-text("Nee dankje")',
    'button:has-text("Alles accepteren")',
    'button:has-text("Accepteren")',
  ];

  // Popups fade in and some sit inside their own frame, so this runs twice and
  // looks in every frame instead of the main document only.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    await page.keyboard.press("Escape").catch(() => undefined);
    for (const frame of page.frames()) {
      for (const selector of closeSelectors) {
        const target = frame.locator(selector).first();
        if (await target.isVisible().catch(() => false)) {
          await target.click({ timeout: 1500 }).catch(() => undefined);
        }
      }
    }
    await page.waitForTimeout(1200);
  }
}

/** Current desktop, mobile and homepage shots, so the list can be judged by eye. */
async function captureReviewScreenshots(
  candidates: CandidateRecord[]
): Promise<Map<string, Record<string, string>>> {
  const result = new Map<string, Record<string, string>>();
  if (candidates.length === 0) return result;

  await mkdir(SCREENSHOT_DIR, { recursive: true });
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });

  try {
    for (const candidate of candidates) {
      const slug = candidate.domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      const paths: Record<string, string> = {};

      const shots: Array<{ key: string; url: string; viewport: { width: number; height: number } }> =
        [];
      if (candidate.heroProductUrl) {
        shots.push({
          key: "pdpDesktop",
          url: candidate.heroProductUrl,
          viewport: SCREENSHOT_CONFIG.desktop,
        });
        shots.push({
          key: "pdpMobile",
          url: candidate.heroProductUrl,
          viewport: SCREENSHOT_CONFIG.mobile,
        });
      }
      shots.push({ key: "homepage", url: candidate.siteUrl, viewport: SCREENSHOT_CONFIG.desktop });

      for (const shot of shots) {
        const page = await browser.newPage({ viewport: shot.viewport });
        try {
          await page.goto(shot.url, {
            waitUntil: "domcontentloaded",
            timeout: SCREENSHOT_CONFIG.timeoutMs,
          });
          await page.waitForTimeout(4000);
          await dismissOverlays(page);
          const suffix =
            shot.key === "pdpMobile"
              ? "pdp-mobile-390x844"
              : shot.key === "pdpDesktop"
                ? "pdp-desktop-1440x1000"
                : "homepage-1440x1000";
          const file = resolve(SCREENSHOT_DIR, `${slug}-${suffix}.png`);
          await page.screenshot({ path: file });
          paths[shot.key] = file;
        } catch (error) {
          logger.warn("Screenshot failed", {
            domain: candidate.domain,
            url: shot.url,
            error: error instanceof Error ? error.message : "unknown",
          });
        } finally {
          await page.close();
        }
      }

      if (Object.keys(paths).length > 0) result.set(candidate.domain, paths);
    }
  } finally {
    await browser.close();
  }

  return result;
}

export async function runHighTicketDiscovery(options?: {
  dryRun?: boolean;
  /** Re-derive verdicts from a stored run instead of buying the SERPs again. */
  replayRunId?: string;
  /** Ignore stored screenshot paths and shoot the shortlist again. */
  recaptureScreenshots?: boolean;
}): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const dataForSeo = createDataForSeoClient(env);

  const budget: BudgetTracker = { spent: 0, cap: env.M94_MAX_DATAFORSEO_COST };
  const startedAt = new Date().toISOString();

  console.log(`\n=== M9.4 HIGH-TICKET FOCUSED BRAND DISCOVERY (${M94_DISCOVERY_VERSION}) ===`);
  console.log(`DataForSEO cap: $${budget.cap.toFixed(3)} · Anthropic: $0.000`);
  console.log(
    `Geparkeerd: ${PARKED_ARCHETYPES.map((entry) => entry.archetypeId).join(", ")}\n`
  );

  // ---------------------------------------------------------------------
  // 1. Keyword expansion inside the high-ticket families only.
  // ---------------------------------------------------------------------
  console.log("Stap 1 — keyword expansion binnen de high-ticket productfamilies");
  const ideasBudget = 0.04;
  const expansion = await expandFamilyKeywords({
    branches: HIGH_TICKET_BRANCHES,
    client: dataForSeo,
    env,
    ideasLimit: M94_DISCOVERY.keywordIdeasLimit,
    allowIdeas: !options?.dryRun && !options?.replayRunId && canSpend(budget, ideasBudget),
  });
  budget.spent += expansion.ideasCost;

  const selected = selectProductionKeywords(expansion.keywords, {
    maxTotal: M94_DISCOVERY.maxKeywords,
    maxPerFamily: M94_DISCOVERY.maxKeywordsPerFamily,
    branches: HIGH_TICKET_BRANCHES,
  });

  console.log(
    `  ${expansion.keywords.length} keywords met lineage, ${expansion.rejected.length} geweigerd, ` +
      `${selected.length} geselecteerd · ideas $${expansion.ideasCost.toFixed(4)}\n`
  );

  if (options?.dryRun) {
    for (const keyword of selected) {
      console.log(
        `  ${keyword.archetypeId.padEnd(20)} ${keyword.familyId.padEnd(26)} fit ${String(keyword.archetypeFit).padStart(3)} · ${keyword.keyword}`
      );
    }
    console.log(
      `\nDry run: ${selected.length} keywords, geschat $${(selected.length * M94_DISCOVERY.estimatedSerpCostPerKeyword + expansion.ideasCost).toFixed(4)} van cap $${budget.cap.toFixed(3)}.\n`
    );
    return;
  }

  const persisted = options?.replayRunId
    ? await loadKeywordsFromRun(supabase, options.replayRunId)
    : (await persistFamilyKeywords(supabase, selected)).filter(
        (keyword): keyword is FamilyKeyword & { id: string } => keyword.id !== null
      );

  const run = await createRun(supabase, "high_ticket_discovery", {
    milestone: M94_DISCOVERY.milestone,
    version: M94_DISCOVERY_VERSION,
    profile: HIGH_TICKET_PROFILE_VERSION,
    branches: HIGH_TICKET_BRANCHES.map((branch) => branch.archetypeId),
    keywords: persisted.map((keyword) => keyword.keyword),
    maxDataForSeoCost: budget.cap,
  });
  const runId = run.id;

  // ---------------------------------------------------------------------
  // 2. SERP per keyword: quality gate and discovery in one paid call.
  // ---------------------------------------------------------------------
  console.log("Stap 2 — SERP per keyword met quality gate en seller resolution");
  const domainIndex = new Map<string, DiscoveredDomain>();
  const keywordOutcomes: KeywordOutcome[] = [];
  const sellerCache = new Map<string, SellerDomainResolution>();
  const skippedForBudget: string[] = [];
  let serpSpend = 0;
  let recoveredSellerTotal = 0;
  let unresolvedSellerTotal = 0;

  if (options?.replayRunId) {
    const replay = await replayStoredRun({
      supabase,
      runId: options.replayRunId,
      keywords: persisted,
      domainIndex,
      keywordOutcomes,
    });
    recoveredSellerTotal = replay.recoveredSellers;
    console.log(
      `  replay van run ${options.replayRunId}: ${keywordOutcomes.length} keywords, ${domainIndex.size} domeinen, $0.0000 nieuwe kosten`
    );
  }

  for (const keyword of options?.replayRunId ? [] : persisted) {
    if (!canSpend(budget, M94_DISCOVERY.estimatedSerpCostPerKeyword)) {
      skippedForBudget.push(keyword.keyword);
      continue;
    }

    let serp;
    try {
      serp = await fetchGooglePaidAds({ client: dataForSeo, env }, keyword.keyword);
    } catch (error) {
      console.log(
        `  ${keyword.keyword}: SERP mislukt (${error instanceof Error ? error.message : "onbekend"})`
      );
      continue;
    }

    budget.spent += serp.cost;
    serpSpend += serp.cost;

    const recovery = await recoverShoppingSellerAds(serp.unresolvedShoppingAds, {
      timeoutMs: M94_DISCOVERY.sellerProbeTimeoutMs,
      cache: sellerCache,
      maxSellers: M94_DISCOVERY.maxSellerProbesPerKeyword,
    });
    recoveredSellerTotal += recovery.recovered.length;
    unresolvedSellerTotal += recovery.stillUnresolved.length;

    const paidAds = [...serp.paidAds, ...recovery.recovered];
    const sample: Array<{ domain: string }> = [];
    const seenDomains = new Set<string>();
    const pendingDomains: DiscoveredDomain[] = [];

    for (const ad of paidAds) {
      const signal = classifySerpSignal({ serpItemType: ad.serpItemType, rawItem: ad.rawItem });
      if (signal.adSignalType === "NON_PAID") continue;

      if (!seenDomains.has(ad.normalizedDomain)) {
        seenDomains.add(ad.normalizedDomain);
        sample.push({ domain: ad.normalizedDomain });
      }
      if (isBlacklistedDomain(ad.normalizedDomain)) continue;

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

      let entry = domainIndex.get(ad.normalizedDomain);
      if (!entry) {
        entry = emptyDomain({
          domain: ad.normalizedDomain,
          brandId: brand.id,
          brandName,
          archetypeId: keyword.archetypeId,
          familyId: keyword.familyId,
          familyLabel: keyword.familyLabel,
          sellerResolution:
            (ad.rawItem as { seller_domain_resolution?: string } | null)
              ?.seller_domain_resolution ?? null,
        });
        domainIndex.set(ad.normalizedDomain, entry);
        pendingDomains.push(entry);
      }
      if (!entry.keywords.includes(keyword.keyword)) entry.keywords.push(keyword.keyword);
      if (ad.landingUrl && !entry.landingUrls.includes(ad.landingUrl)) {
        entry.landingUrls.push(ad.landingUrl);
      }

      const adProduct = extractAdProduct(ad);
      if (adProduct && !entry.adProducts.some((item) => item.title === adProduct.title)) {
        entry.adProducts.push(adProduct);
      }
    }

    const stored = await loadStoredClassifications(
      supabase,
      sample.map((item) => item.domain)
    );
    const quality = computeSerpProspectQuality(
      sample.map((item) => ({
        domain: item.domain,
        businessType: stored.get(item.domain)?.business_type ?? null,
      })),
      { archetypeTooBroad: keyword.archetypeFit < 40, coldStart: true }
    );

    const approved = approvedForDiscovery(quality.status, quality.prospectSerpQualityScore);
    if (!approved) {
      for (const entry of pendingDomains) domainIndex.delete(entry.domain);
    }

    keywordOutcomes.push({
      keyword: keyword.keyword,
      keywordId: keyword.id,
      archetypeId: keyword.archetypeId,
      familyId: keyword.familyId,
      familyLabel: keyword.familyLabel,
      seed: keyword.seed,
      generationSource: keyword.generationSource,
      archetypeFit: keyword.archetypeFit,
      preGateClass: keyword.preGateClass,
      prospectingValue: keyword.prospectingValue,
      searchVolume: keyword.searchVolume,
      status: quality.status,
      serpQualityScore: quality.prospectSerpQualityScore,
      reason: quality.stopReason,
      rawAdvertisers: sample.length,
      prospectEligible: quality.prospectDomains.length + quality.provisionalDomains.length,
      approvedForDiscovery: approved,
      cost: serp.cost,
      domains: sample.map((item) => item.domain),
      recoveredSellers: recovery.recovered.length,
      unresolvedSellers: recovery.stillUnresolved.map((entry) => entry.seller),
    });

    await supabase
      .from("keywords")
      .update({
        prospect_serp_quality_score: quality.prospectSerpQualityScore,
        keyword_prospect_status: quality.status,
        keyword_prospect_reason: quality.stopReason,
        keyword_prospect_checked_at: new Date().toISOString(),
        serp_cost: serp.cost,
        last_scanned_at: new Date().toISOString(),
      })
      .eq("id", keyword.id);

    console.log(
      `  ${approved ? "OK " : "STOP"} ${quality.status.padEnd(22)} ${keyword.keyword} · ${sample.length} advertisers · quality ${quality.prospectSerpQualityScore} · $${serp.cost.toFixed(4)} (totaal $${budget.spent.toFixed(4)})`
    );
  }

  if (skippedForBudget.length > 0) {
    console.log(`  ${skippedForBudget.length} keyword(s) overgeslagen wegens budgetplafond`);
  }

  const rawAdvertisers = keywordOutcomes.reduce((sum, k) => sum + k.rawAdvertisers, 0);
  const allDiscoveredDomains = new Set(keywordOutcomes.flatMap((k) => k.domains));

  // ---------------------------------------------------------------------
  // 3. Central prospect gate.
  // ---------------------------------------------------------------------
  console.log("\nStap 3 — centrale prospect gate");
  const stored = await loadStoredClassifications(supabase, [...domainIndex.keys()]);
  const excludedRetailers: HighTicketReport["excludedRetailers"] = [];

  for (const entry of domainIndex.values()) {
    const known = stored.get(entry.domain);
    entry.businessType = known?.business_type ?? null;
    entry.platform = known?.platform ?? null;
    entry.isEcommerce = known?.is_ecommerce ?? null;
    entry.retailerScaleScore = known?.retailer_scale_score ?? null;
    entry.businessMaturityScore = known?.business_maturity_score ?? null;
    entry.ownBrandSignal = known?.own_brand_signal_score ?? null;

    const verdict = classifyProspectExclusion({
      domain: entry.domain,
      businessType: known?.business_type,
      isEcommerce: known?.is_ecommerce,
      manualExcluded: known?.manual_excluded,
      retailerScaleScore: known?.retailer_scale_score,
      businessMaturityScore: known?.business_maturity_score,
    });

    entry.prospectClass = verdict.prospectClass;
    entry.gateEligible = verdict.eligible;
    entry.gateReason = verdict.reason;

    if (!verdict.eligible) {
      excludedRetailers.push({
        domain: entry.domain,
        prospectClass: verdict.prospectClass,
        reason: verdict.reason,
      });
    }
  }
  console.log(
    `  ${domainIndex.size - excludedRetailers.length} van ${domainIndex.size} domeinen mogen verder`
  );

  // ---------------------------------------------------------------------
  // 4. Cheap qualification: homepage, then listing page.
  // ---------------------------------------------------------------------
  console.log("\nStap 4 — goedkope kwalificatie");
  const crawlTimeout = Math.min(env.CRAWLER_TIMEOUT_MS, 20000);
  let lightChecks = 0;
  let catalogChecks = 0;

  const eligible = [...domainIndex.values()].filter((entry) => entry.gateEligible);

  for (const entry of eligible) {
    const known = stored.get(entry.domain);
    const hasCurrentClassification =
      known?.business_classifier_version === BUSINESS_CLASSIFIER_VERSION &&
      known?.classification_needs_recompute !== true &&
      known?.business_type &&
      known.business_type !== "UNKNOWN" &&
      known.own_brand_signal_score !== null;

    if (!hasCurrentClassification && lightChecks < M94_DISCOVERY.maxLightChecks) {
      lightChecks += 1;
      try {
        const check = await runLightBrandCheck(entry.domain, crawlTimeout);
        entry.lightChecked = true;
        entry.businessType = check.businessType;
        entry.platform = check.platform;
        entry.isEcommerce = check.isEcommerce;
        entry.retailerScaleScore = check.retailerScaleScore;
        entry.ownBrandSignal = check.ownBrandSignal;
        entry.ownBrandEvidence = check.ownBrandEvidence;
        entry.homepageProductLinks = check.productLinks;
        entry.homepageCategoryLinks = check.categoryLinks;
        entry.retailerBreadthScore = check.retailerBreadthScore;
        entry.internationalPresenceScore = check.internationalPresenceScore;
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
              classification_recompute_reason: "m94_light_check",
              prospect_gate_class: check.prospectClass,
              prospect_gate_reason: check.gateReason,
            })
            .eq("id", entry.brandId);
        }
      } catch {
        // A failed fetch leaves the stored classification in place.
      }
    }

    if (!entry.gateEligible) {
      excludedRetailers.push({
        domain: entry.domain,
        prospectClass: entry.prospectClass,
        reason: entry.gateReason,
      });
      continue;
    }

    if (entry.isEcommerce === false) continue;
    if (catalogChecks >= M94_DISCOVERY.maxCatalogChecks) continue;

    catalogChecks += 1;
    const catalog = await runCatalogFocusCheck(
      entry.domain,
      crawlTimeout,
      entry.homepageProductLinks,
      entry.homepageCategoryLinks
    );
    entry.catalogFocusScore = catalog.catalogFocusScore;
    entry.catalogVerified = catalog.verified;
    entry.estimatedCatalogSize = catalog.estimatedCatalogSize;
    entry.catalogEvidence = catalog.evidence;
  }
  console.log(
    `  ${lightChecks} homepage checks · ${catalogChecks} catalogus checks · geen Claude, geen catalog crawl`
  );

  // ---------------------------------------------------------------------
  // 5. Hero products: the advertised product is the strongest signal we get.
  // ---------------------------------------------------------------------
  console.log("\nStap 5 — heroproducten en productprijs");
  const heroCandidates = eligible
    .filter((entry) => entry.gateEligible && entry.isEcommerce !== false)
    .sort((a, b) => (b.catalogFocusScore ?? 0) - (a.catalogFocusScore ?? 0))
    .slice(0, M94_DISCOVERY.maxHeroResolutions);

  let heroResolutions = 0;
  for (const entry of heroCandidates) {
    heroResolutions += 1;
    const resolved = await resolveHeroProducts({
      domain: entry.domain,
      landingUrls: entry.landingUrls,
      adProducts: entry.adProducts,
      keyword: entry.keywords[0] ?? null,
      timeoutMs: crawlTimeout,
      maxHeroes: M94_DISCOVERY.maxHeroesPerDomain,
    });
    entry.heroes = resolved.heroes;
    entry.pdpWeaknessScore = resolved.pdpWeaknessScore;
    entry.assetReadinessProxy = resolved.assetReadinessProxy;

    // A hero that resolved to the homepage is a price signal, not a page to
    // review. Presenting it as the hero PDP would send the manual review to a
    // page nobody asked about.
    const hero = entry.heroes[0];
    entry.heroUrlIsProductPage = hero ? isUsableHeroUrl(hero.url, entry.domain) : false;
  }
  console.log(`  ${heroResolutions} kandidaten met heroresolutie`);

  // ---------------------------------------------------------------------
  // 6. Scoring: scale, contrast ceiling, high-ticket fit. No Claude.
  // ---------------------------------------------------------------------
  for (const entry of eligible) {
    if (!entry.gateEligible) continue;

    const scale = computeCompanyScaleFit({
      businessType: entry.businessType,
      isEcommerce: entry.isEcommerce,
      retailerScaleScore: entry.retailerScaleScore,
      retailerBreadthScore: entry.retailerBreadthScore,
      businessMaturityScore: entry.businessMaturityScore,
      internationalPresenceScore: entry.internationalPresenceScore,
      estimatedCatalogSize: entry.estimatedCatalogSize,
      homepageProductLinks: entry.homepageProductLinks,
      ownBrandSignal: entry.ownBrandSignal,
    });
    entry.companyScaleFitScore = scale.companyScaleFitScore;
    entry.companyScaleBand = scale.band;
    entry.companyScaleEvidence = scale.evidence;

    entry.deepDivePdpFitProxy = computeDeepDivePdpFitProxy({
      archetypeId: entry.archetypeId,
      catalogFocusScore: entry.catalogFocusScore ?? 50,
      heroScore: entry.heroes[0]?.heroScore ?? null,
    });

    const ceiling = estimateContrastCeiling({
      pdpWeaknessProxy: entry.pdpWeaknessScore,
      assetReadinessProxy: entry.assetReadinessProxy,
      deepDivePdpFitProxy: entry.deepDivePdpFitProxy,
      ownBrandSignal: entry.ownBrandSignal,
      heroPrice: entry.heroes[0]?.price ?? null,
    });
    entry.estimatedContrastCeiling = ceiling.estimatedContrastCeiling;
    entry.contrastCeilingEvidence = ceiling.evidence;

    const fit = computeHighTicketFocusedFit({
      domain: entry.domain,
      businessType: entry.businessType,
      prospectClass: entry.prospectClass,
      estimatedCatalogSize: entry.estimatedCatalogSize,
      catalogFocusScore: entry.catalogFocusScore,
      catalogVerified: entry.catalogVerified,
      ownBrandSignal: entry.ownBrandSignal,
      companyScaleFitScore: scale.companyScaleFitScore,
      assetReadinessProxy: entry.assetReadinessProxy,
      deepDivePdpFitProxy: entry.deepDivePdpFitProxy,
      pdpWeaknessProxy: entry.pdpWeaknessScore,
      heroScore: entry.heroes[0]?.heroScore ?? null,
      heroPrice: entry.heroes[0]?.price ?? null,
      adKeywordCount: entry.keywords.length,
      retailerBreadthScore: entry.retailerBreadthScore,
      businessMaturityScore: entry.businessMaturityScore,
    });
    entry.highTicketFitScore = fit.highTicketFocusedFitScore;
    entry.priceBand = fit.priceBand;
    entry.priceBandLabel = fit.priceBandLabel;
    entry.catalogBandLabel = fit.catalogBandLabel;
    entry.fitEvidence = [...fit.evidence, ...scale.evidence];
    entry.fitPenalties = fit.penalties;
  }

  // ---------------------------------------------------------------------
  // 7. Funnel, candidates and manual review set.
  // ---------------------------------------------------------------------
  const gatePassed = [...domainIndex.values()].filter((entry) => entry.gateEligible);
  const specialists = gatePassed.filter(
    (entry) => entry.businessType === "SPECIALIST_WEBSHOP" || entry.businessType === "BRAND"
  );
  const compact = specialists.filter(
    (entry) => entry.catalogVerified && (entry.estimatedCatalogSize ?? 999) <= 200
  );
  const ownBrand = compact.filter(
    (entry) => (entry.ownBrandSignal ?? 0) >= HIGH_TICKET_THRESHOLDS.minOwnBrandSignal
  );
  const highTicketHero = ownBrand.filter(
    (entry) => (entry.heroes[0]?.price ?? 0) >= HIGH_TICKET_THRESHOLDS.preferredMinHeroPrice
  );
  const serious = gatePassed
    .filter((entry) => (entry.highTicketFitScore ?? 0) >= HIGH_TICKET_THRESHOLDS.seriousCandidate)
    .sort((a, b) => (b.highTicketFitScore ?? 0) - (a.highTicketFitScore ?? 0));

  const funnel: Record<HighTicketFunnelStage, number> = {
    raw_advertisers: rawAdvertisers,
    prospect_eligible: gatePassed.length,
    ecommerce_specialists: specialists.length,
    compact_catalog: compact.length,
    own_brand: ownBrand.length,
    high_ticket_hero: highTicketHero.length,
    serious_candidate: serious.length,
  };

  const toCandidate = (entry: DiscoveredDomain, index: number): CandidateRecord => ({
    rank: index + 1,
    domain: entry.domain,
    siteUrl: `https://${entry.domain}`,
    heroProductUrl: entry.heroUrlIsProductPage ? (entry.heroes[0]?.url ?? null) : null,
    heroUrlSource: entry.heroUrlIsProductPage ? "ad_landing" : null,
    branch: entry.archetypeId,
    branchLabel: ARCHETYPE_BY_ID.get(entry.archetypeId)?.label ?? entry.archetypeId,
    familyId: entry.familyId,
    familyLabel: entry.familyLabel,
    platform: entry.platform,
    businessType: entry.businessType,
    commerceModel:
      (entry.ownBrandSignal ?? 0) >= 72
        ? "DTC_OWN_BRAND"
        : (entry.ownBrandSignal ?? 0) >= 58
          ? "MOSTLY_OWN_BRAND"
          : (entry.ownBrandSignal ?? 0) >= 45
            ? "MIXED"
            : "SPECIALIST_RESELLER",
    companyScaleFit: entry.companyScaleFitScore,
    companyScaleBand: entry.companyScaleBand,
    businessMaturity: entry.businessMaturityScore,
    estimatedCatalogSize: entry.estimatedCatalogSize,
    catalogFocusScore: entry.catalogFocusScore,
    catalogVerified: entry.catalogVerified,
    catalogBandLabel: entry.catalogBandLabel,
    ownBrandSignal: entry.ownBrandSignal,
    heroProduct: entry.heroes[0]?.title ?? null,
    heroPrice: entry.heroes[0]?.price ?? null,
    heroCurrency: entry.heroes[0]?.currency ?? null,
    heroScore: entry.heroes[0]?.heroScore ?? null,
    priceBand: entry.priceBand,
    priceBandLabel: entry.priceBandLabel,
    googleAdsEvidence: {
      keywords: entry.keywords,
      landingUrls: entry.landingUrls.slice(0, 3),
      sellerResolution: entry.sellerResolution,
    },
    assetReadinessProxy: entry.assetReadinessProxy,
    deepDivePdpFitProxy: entry.deepDivePdpFitProxy,
    currentPdpWeaknessProxy: entry.pdpWeaknessScore,
    estimatedContrastCeiling: entry.estimatedContrastCeiling,
    contrastCeilingEvidence: entry.contrastCeilingEvidence,
    highTicketFocusedFitScore: entry.highTicketFitScore,
    evidence: entry.fitEvidence,
    penalties: entry.fitPenalties,
    screenshots: null,
  });

  const pool = (serious.length > 0 ? serious : gatePassed)
    .slice()
    .sort((a, b) => (b.highTicketFitScore ?? 0) - (a.highTicketFitScore ?? 0));

  const candidates = mergeWithPreviousPass(
    pool.map(toCandidate),
    await loadPreviousCandidates()
  ).slice(0, M94_DISCOVERY.maxCandidates);
  const ranked = candidates.slice(0, M94_DISCOVERY.maxRanked);

  // Screenshots only for the shortlist that gets reviewed by hand.
  const reviewSet = ranked.slice(0, M94_DISCOVERY.maxScreenshots);

  // A shortlist entry without a product page cannot be judged, so the most
  // expensive product in the catalog stands in for the advertised one.
  for (const candidate of reviewSet) {
    if (candidate.heroProductUrl) continue;
    const flagship = await resolveFlagshipProduct(
      candidate.domain,
      crawlTimeout,
      candidate.heroProduct
    );
    if (!flagship) continue;
    candidate.heroProductUrl = flagship.url;
    candidate.heroUrlSource = "catalog_flagship";
    candidate.evidence = [
      ...candidate.evidence,
      `advertentie kon niet naar een productpagina worden herleid, productpagina uit de catalogus getoond: ${flagship.title}`,
    ];
    candidate.screenshots = null;
  }

  const needsCapture = options?.recaptureScreenshots
    ? reviewSet
    : reviewSet.filter((candidate) => candidate.screenshots == null);
  console.log(
    `\nStap 6 — screenshots voor de top ${reviewSet.length} (${needsCapture.length} nieuw)`
  );
  const shots = await captureReviewScreenshots(needsCapture);
  for (const candidate of candidates) {
    const paths = shots.get(candidate.domain);
    if (paths) candidate.screenshots = paths;
  }

  const { data: priorRuns } = await supabase
    .from("runs")
    .select("id, metadata")
    .eq("run_type", "high_ticket_discovery");
  const priorSpend = (priorRuns ?? [])
    .filter((row) => String(row.id) !== runId)
    .reduce(
      (sum, row) => sum + (((row.metadata ?? {}) as { dataForSeoCost?: number }).dataForSeoCost ?? 0),
      0
    );
  const totalSpend = budget.spent + priorSpend;

  const selectedKeywordNames = [
    ...new Set([...expansion.keywords, ...persisted].map((keyword) => keyword.keyword)),
  ];

  const report: HighTicketReport = {
    milestone: M94_DISCOVERY.milestone,
    version: M94_DISCOVERY_VERSION,
    profileVersion: HIGH_TICKET_PROFILE_VERSION,
    runId,
    startedAt,
    finishedAt: new Date().toISOString(),
    discovery: {
      branches: HIGH_TICKET_BRANCHES.map((branch) => ({
        archetypeId: branch.archetypeId,
        families: branch.familyIds,
        evidence: branch.evidence,
      })),
      parkedArchetypes: PARKED_ARCHETYPES.map((entry) => ({
        archetypeId: entry.archetypeId,
        reason: entry.reason,
      })),
      keywordsGenerated: selectedKeywordNames.length,
      keywordsRejected: expansion.rejected.slice(0, 40),
      keywordsTested: keywordOutcomes.length,
      keywordsApproved: keywordOutcomes.filter((k) => k.approvedForDiscovery).length,
      keywordsNotTested: selectedKeywordNames.filter(
        (keyword) => !keywordOutcomes.some((entry) => entry.keyword === keyword)
      ),
      rawAdvertisers,
      uniqueAdvertisers: allDiscoveredDomains.size,
      shoppingSellersResolved: recoveredSellerTotal,
      shoppingSellersUnresolved: unresolvedSellerTotal,
      skippedForBudget,
    },
    keywords: keywordOutcomes,
    funnel,
    funnelYieldPercent: {
      prospectYield: percent(gatePassed.length, allDiscoveredDomains.size),
      specialistYield: percent(specialists.length, allDiscoveredDomains.size),
      seriousCandidateYield: percent(serious.length, allDiscoveredDomains.size),
    },
    excludedRetailers: excludedRetailers.slice(0, 40),
    candidates,
    ranked,
    manualReview: reviewSet,
    cost: {
      dataForSeo: Math.round(totalSpend * 10000) / 10000,
      dataForSeoCap: budget.cap,
      keywordIdeas: Math.round(expansion.ideasCost * 10000) / 10000,
      serp: Math.round(serpSpend * 10000) / 10000,
      anthropic: 0,
      costPerCandidate:
        candidates.length > 0 ? Math.round((totalSpend / candidates.length) * 10000) / 10000 : null,
      lightChecks,
      catalogChecks,
      heroResolutions,
    },
    downstream: { croAudits: 0, conceptBriefs: 0, previews: 0, contactDiscovery: 0, outreach: 0 },
  };

  const serialized = JSON.stringify(report, null, 2);
  await writeFile(REPORT_PATH, serialized, "utf8");
  await writeFile(DASHBOARD_REPORT_PATH, serialized, "utf8");

  await completeRun(supabase, runId, "completed", {
    keywordsTested: keywordOutcomes.length,
    keywordsApproved: report.discovery.keywordsApproved,
    candidates: candidates.length,
    dataForSeoCost: budget.spent,
    anthropicCost: 0,
  });

  printReport(report);
}

function printReport(report: HighTicketReport): void {
  console.log("\n=== KEYWORDS ===");
  for (const keyword of report.keywords) {
    console.log(
      `  ${keyword.approvedForDiscovery ? "OK " : "STOP"} ${keyword.status.padEnd(22)} q${String(keyword.serpQualityScore).padStart(3)} · ${keyword.keyword}`
    );
  }

  console.log("\n=== FUNNEL ===");
  for (const [stage, count] of Object.entries(report.funnel)) {
    console.log(`  ${stage.padEnd(22)} ${count}`);
  }
  console.log(
    `  yield: prospect ${report.funnelYieldPercent.prospectYield}% · specialist ${report.funnelYieldPercent.specialistYield}% · serieus ${report.funnelYieldPercent.seriousCandidateYield}%`
  );

  console.log("\n=== TOP KANDIDATEN ===");
  for (const candidate of report.candidates) {
    console.log(
      `\n  #${candidate.rank} ${candidate.domain} · fit ${candidate.highTicketFocusedFitScore} · plafond ${candidate.estimatedContrastCeiling}`
    );
    console.log(
      `     ${candidate.familyLabel} · ${candidate.businessType ?? "?"} op ${candidate.platform ?? "?"} · ${candidate.commerceModel}`
    );
    console.log(
      `     schaal ${candidate.companyScaleFit} (${candidate.companyScaleBand}) · volwassenheid ${candidate.businessMaturity ?? "niet gemeten"} · catalogus ${candidate.estimatedCatalogSize ?? "?"} (${candidate.catalogBandLabel ?? "?"}) · focus ${candidate.catalogFocusScore ?? "?"} · eigen merk ${candidate.ownBrandSignal ?? "?"}`
    );
    console.log(
      `     hero: ${candidate.heroProduct ?? "geen"} ${candidate.heroPrice != null ? `${candidate.heroCurrency ?? "EUR"} ${candidate.heroPrice}` : ""} (${candidate.priceBandLabel ?? "prijs onbekend"})`
    );
    console.log(
      `     materiaal ${candidate.assetReadinessProxy ?? "?"} · deep-dive ${candidate.deepDivePdpFitProxy ?? "?"} · PDP-zwakte ${candidate.currentPdpWeaknessProxy ?? "?"}`
    );
    console.log(`     ads: ${candidate.googleAdsEvidence.keywords.join(", ") || "geen"}`);
    if (candidate.penalties.length > 0) {
      console.log(
        `     aftrek: ${candidate.penalties.map((p) => `${p.reason} (-${p.points})`).join(" · ")}`
      );
    }
  }

  console.log("\n=== HANDMATIGE REVIEW ===");
  for (const candidate of report.manualReview) {
    console.log(`\n  ${candidate.domain} · fit ${candidate.highTicketFocusedFitScore}`);
    console.log(`     homepage: ${candidate.siteUrl}`);
    console.log(`     hero PDP: ${candidate.heroProductUrl ?? "niet gevonden"}`);
    for (const [key, path] of Object.entries(candidate.screenshots ?? {})) {
      console.log(`     ${key}: ${path}`);
    }
  }

  console.log("\n=== KOSTEN ===");
  console.log(
    `  DataForSEO $${report.cost.dataForSeo.toFixed(4)} van cap $${report.cost.dataForSeoCap.toFixed(3)} (ideas $${report.cost.keywordIdeas.toFixed(4)}, SERP $${report.cost.serp.toFixed(4)}) · Anthropic $0`
  );
  console.log(
    `  kosten per kandidaat: ${report.cost.costPerCandidate !== null ? `$${report.cost.costPerCandidate.toFixed(4)}` : "n.v.t."}`
  );
  console.log(`\nRapport: ${REPORT_PATH}\n`);
}

const invokedDirectly = process.argv[1]
  ? resolve(process.argv[1]).endsWith("runHighTicketDiscovery.js")
  : false;

if (invokedDirectly) {
  const replayArg = process.argv.find((arg) => arg.startsWith("--replay="));
  runHighTicketDiscovery({
    dryRun: process.argv.includes("--dry-run"),
    replayRunId: replayArg ? replayArg.slice("--replay=".length) : undefined,
    recaptureScreenshots: process.argv.includes("--recapture"),
  })
    .then(async () => {
      await closeCrawlerBrowser();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error(error);
      await closeCrawlerBrowser().catch(() => undefined);
      process.exit(1);
    });
}
