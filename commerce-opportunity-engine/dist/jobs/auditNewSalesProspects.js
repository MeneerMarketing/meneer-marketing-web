/**
 * Milestone 9.3.4 — from the new M9.3.3 prospect pool to one design target.
 *
 * Flow: load strong prospects -> deterministic rank -> resolve hero products ->
 * page health -> at most six real PDP audits -> recompute transformation and
 * contrast on measured data -> true sales ranking -> top three -> screenshots.
 *
 * Stops there on purpose. No preview, no outreach, no new discovery.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { logger } from "../utils/logger.js";
import { STRONG_PROSPECT_THRESHOLD } from "../config/productionDiscovery.js";
import { M934, SCREENSHOT_CONFIG, TRUE_SALES_DESIGN_FORMULA, DESIGN_TARGET_GATE, EXTRACTION_FALLBACK, HERO_PAGE_VALIDITY, } from "../config/newProspectAudit.js";
import { preselectNewProspects, isUsableHeroUrl, } from "../services/idealProspect/newProspectPreselection.js";
import { resolveHeroProducts } from "../services/prospect/heroProductResolver.js";
import { ensureConceptAuditOpportunity } from "../services/concept/ensureConceptAuditOpportunity.js";
import { buildConceptAuditCandidate } from "../services/concept/selectOutreachAuditCandidates.js";
import { auditOpportunity } from "../services/audit/auditRunner.js";
import { evaluateAnthropicBudgetGate } from "../services/outreach/anthropicBudget.js";
import { computeCurrentPdpQualityScore } from "../services/concept/currentPdpQuality.js";
import { scorePdpTransformationPotential } from "../services/concept/pdpTransformation.js";
import { scoreConceptAssetReadiness } from "../services/concept/assetReadiness.js";
import { scoreProductCommercialSignal } from "../services/concept/productCommercialSignal.js";
import { scoreConceptReady } from "../services/concept/conceptReadyScore.js";
import { scoreEngineeringPilotRow } from "../services/concept/selectPremiumDtcPilot.js";
import { scoreOutreachConceptFit, } from "../services/concept/outreachScoring.js";
import { computeTrueSalesDesignScore, evaluateDesignTargetGate, } from "../services/concept/trueSalesDesignScore.js";
import { buildDesignCaseRationale } from "../services/concept/designCaseRationale.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
const DISCOVERY_REPORT_PATH = resolve(projectRoot, "reports/focused-production-discovery-report.json");
const REPORT_PATH = resolve(projectRoot, "reports/new-sales-prospect-audit-report.json");
const DASHBOARD_REPORT_PATH = resolve(projectRoot, "dashboard/src/preview/concepts/data/new-sales-prospect-audit-report.json");
const SCREENSHOT_DIR = resolve(projectRoot, SCREENSHOT_CONFIG.outputDir);
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function num(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function conceptSignalsFrom(audit) {
    const findings = audit?.findings;
    if (!findings || typeof findings !== "object")
        return null;
    return (findings.concept_first_signals ?? null);
}
function representationFrom(audit) {
    const rep = audit?.page_representation;
    if (!rep || typeof rep !== "object")
        return null;
    return rep;
}
function croComposite(cro) {
    if (!cro)
        return null;
    const parts = [
        num(cro.desktop_cro_quality),
        num(cro.product_presentation_quality),
        num(cro.product_storytelling_quality),
        num(cro.above_fold_quality),
    ].filter((entry) => entry != null);
    if (parts.length === 0)
        return null;
    return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}
/** Google Ads placements are the commercial proof this milestone leans on. */
function hasCommercialProof(record, brand) {
    if (brand?.confirmed_google_advertiser)
        return true;
    return (record.googleAdsEvidence?.keywords?.length ?? 0) > 0;
}
function isFocusedBusiness(record) {
    const type = (record.businessType ?? "").toUpperCase();
    const specialist = type === "SPECIALIST_WEBSHOP" || type === "BRAND";
    return specialist && record.catalogVerified && (record.catalogFocusScore ?? 0) >= 55;
}
// ---------------------------------------------------------------------------
// Load the strong pool from the M9.3.3 report
// ---------------------------------------------------------------------------
/**
 * The M9.3.3 discovery ran more than once, and live crawls differ per pass: a
 * shop that blocked the crawler on one pass shows up on the next. Taking the
 * union across passes keeps the whole approved strong pool in play instead of
 * whichever pass happened to run last. Per domain the record with a real hero
 * product URL wins, then the higher pre-score.
 */
function loadStrongProspects() {
    if (!existsSync(DISCOVERY_REPORT_PATH)) {
        throw new Error(`M9.3.3 report not found at ${DISCOVERY_REPORT_PATH}. Run the focused production discovery first.`);
    }
    const reportDir = dirname(DISCOVERY_REPORT_PATH);
    const sources = readdirSync(reportDir)
        .filter((file) => /^focused-production-discovery-report.*\.json$/.test(file))
        .sort();
    const byDomain = new Map();
    for (const file of sources) {
        const raw = JSON.parse(readFileSync(resolve(reportDir, file), "utf8"));
        for (const record of raw.topProspects ?? []) {
            if ((record.idealProspectPreScore ?? 0) < STRONG_PROSPECT_THRESHOLD)
                continue;
            const existing = byDomain.get(record.domain);
            if (!existing) {
                byDomain.set(record.domain, record);
                continue;
            }
            const existingHero = isUsableHeroUrl(existing.heroProductUrl, existing.domain);
            const candidateHero = isUsableHeroUrl(record.heroProductUrl, record.domain);
            if (candidateHero && !existingHero) {
                byDomain.set(record.domain, record);
            }
            else if (candidateHero === existingHero &&
                (record.idealProspectPreScore ?? 0) > (existing.idealProspectPreScore ?? 0)) {
                byDomain.set(record.domain, record);
            }
        }
    }
    return { records: [...byDomain.values()], sources };
}
async function loadBrands(supabase, domains) {
    const result = new Map();
    for (let index = 0; index < domains.length; index += 100) {
        const chunk = domains.slice(index, index + 100);
        const { data, error } = await supabase
            .from("brands")
            .select("id, name, normalized_domain, platform, business_type, business_maturity_score, retailer_scale_score, confirmed_google_advertiser, transparency_confirmed, manual_excluded, lead_eligible")
            .in("normalized_domain", chunk);
        if (error)
            throw new Error(error.message);
        for (const row of data ?? []) {
            result.set(row.normalized_domain, row);
        }
    }
    return result;
}
// ---------------------------------------------------------------------------
// Hero product resolution
// ---------------------------------------------------------------------------
export async function resolvePrimarySalesProduct(record) {
    const adProducts = [
        record.heroProduct
            ? {
                title: record.heroProduct,
                url: record.heroProductUrl,
                price: record.heroPrice,
                currency: record.heroCurrency,
                isShopping: true,
            }
            : null,
        ...record.additionalHeroes.map((hero) => ({
            title: hero.title,
            url: hero.url,
            price: hero.price,
            currency: record.heroCurrency,
            isShopping: false,
        })),
    ].filter((entry) => entry != null);
    try {
        const resolution = await resolveHeroProducts({
            domain: record.domain,
            landingUrls: record.googleAdsEvidence?.landingUrls ?? [],
            adProducts,
            keyword: record.sourceKeyword,
            timeoutMs: 20000,
            maxHeroes: 3,
        });
        const usable = resolution.heroes.find((hero) => isUsableHeroUrl(hero.url, record.domain) && hero.heroScore >= M934.minHeroScore);
        if (usable)
            return { hero: usable, reason: null };
        // The discovery run may have found a product page that today's crawl could
        // not reach. That earlier evidence still beats auditing a homepage.
        if (isUsableHeroUrl(record.heroProductUrl, record.domain) && record.heroProduct) {
            return {
                hero: {
                    title: record.heroProduct,
                    url: record.heroProductUrl,
                    brand: null,
                    price: record.heroPrice,
                    currency: record.heroCurrency,
                    heroScore: resolution.heroes[0]?.heroScore ?? M934.minHeroScore,
                    heroConfidence: 55,
                    evidence: ["hero_from_discovery_report"],
                    source: "shopping_ad",
                },
                reason: null,
            };
        }
        return {
            hero: null,
            reason: resolution.heroes.length === 0
                ? "geen hero product gevonden"
                : "hero zonder betrouwbare product-URL",
        };
    }
    catch (error) {
        return { hero: null, reason: `hero resolutie mislukt: ${error.message}` };
    }
}
// ---------------------------------------------------------------------------
// Concept candidate row (the audit pipeline needs one to hang the audit on)
// ---------------------------------------------------------------------------
export async function upsertConceptCandidate(supabase, input) {
    const { record, hero, preselection } = input;
    const commercial = scoreProductCommercialSignal({
        price: hero.price,
        reviewCount: null,
        rating: null,
        paidOrDiscoveryRelevant: true,
        heroProminenceScore: hero.heroScore,
        availability: null,
        descriptionLength: 0,
        variantCountEstimate: null,
        purchaseIntentKeyword: Boolean(record.sourceKeyword),
    });
    const patch = {
        brand_id: input.brandId,
        status: "CONCEPT_CANDIDATE",
        brand_commerce_model: preselection.derivedCommerceModel,
        own_brand_ratio_estimate: record.ownBrandSignal != null ? Math.round(record.ownBrandSignal) / 100 : null,
        own_brand_evidence: record.ownBrandEvidence ?? [],
        estimated_product_count: record.estimatedCatalogSize,
        catalog_focus_score: record.catalogFocusScore,
        catalog_evidence: record.catalogEvidence ?? [],
        primary_concept_product_title: hero.title,
        primary_concept_product_url: hero.url,
        primary_concept_product_price: hero.price,
        primary_concept_product_currency: hero.currency ?? "EUR",
        hero_product_score: hero.heroScore,
        hero_product_confidence: hero.heroConfidence,
        hero_product_reasoning: `M9.3.4 hero uit ${hero.source}`,
        hero_product_evidence: hero.evidence,
        product_commercial_signal_score: commercial.product_commercial_signal_score,
        concept_asset_readiness_score: record.assetReadinessProxy,
        updated_at: new Date().toISOString(),
    };
    const { data: existing } = await supabase
        .from("coe_concept_candidates")
        .select("id")
        .eq("brand_id", input.brandId)
        .maybeSingle();
    if (existing?.id) {
        const { error } = await supabase
            .from("coe_concept_candidates")
            .update(patch)
            .eq("id", existing.id);
        if (error)
            throw new Error(error.message);
        return existing.id;
    }
    const { data, error } = await supabase
        .from("coe_concept_candidates")
        .insert(patch)
        .select("id")
        .single();
    if (error)
        throw new Error(error.message);
    return data.id;
}
export async function loadLatestAudit(supabase, opportunityId) {
    const { data, error } = await supabase
        .from("audits")
        .select("id, status, audit_valid, audit_confidence, cro_scores, conversion_leaks, strengths, findings, page_health_status, page_representation, meneer_marketing_fit_score, anthropic_cost, screenshot_paths")
        .eq("opportunity_id", opportunityId)
        .order("created_at", { ascending: false })
        .limit(1);
    if (error)
        throw new Error(error.message);
    return data?.[0] ?? null;
}
// ---------------------------------------------------------------------------
// Post-audit scoring on measured data
// ---------------------------------------------------------------------------
/**
 * Separates a real product page from an order form parked on the product route.
 * Any single positive signal is enough; only a page with none of them counts as
 * a form.
 */
function isPurchasablePage(rep, buyblock) {
    if (!HERO_PAGE_VALIDITY.enabled)
        return true;
    if ((num(rep?.aboveTheFold?.price) ?? 0) > 0)
        return true;
    if ((rep?.page?.payments?.length ?? 0) > 0)
        return true;
    return (buyblock ?? 0) >= HERO_PAGE_VALIDITY.minBuyblockForPurchasePage;
}
export function scoreAuditedCandidate(input) {
    const { record, hero, brand, audit } = input;
    const cro = audit.cro_scores ?? null;
    const signals = conceptSignalsFrom(audit);
    const rep = representationFrom(audit);
    const description = rep?.page?.description ?? "";
    const reviewCount = num(rep?.aboveTheFold?.reviews);
    const rating = num(rep?.aboveTheFold?.rating);
    const mediaCount = rep?.aboveTheFold?.productMedia?.length ?? null;
    const signalScores = {
        storytelling: signals?.product_storytelling_depth ?? null,
        deepDive: signals?.deep_dive_quality ?? null,
        media: signals?.media_usage_quality ?? null,
    };
    const auditSawContent = (signalScores.storytelling ?? 0) >= EXTRACTION_FALLBACK.minSignalForContent ||
        (signalScores.deepDive ?? 0) >= EXTRACTION_FALLBACK.minSignalForContent;
    // The extractor misses copy in tabs and accordions; the audit reads the
    // rendered page. Believing an empty extraction over a high storytelling score
    // would punish exactly the shops with the most material to work with.
    const effectiveDescriptionLength = description.length > 0
        ? description.length
        : auditSawContent
            ? EXTRACTION_FALLBACK.assumedDescriptionLength
            : 0;
    const assets = scoreConceptAssetReadiness({
        productTitle: rep?.aboveTheFold?.productTitle ?? hero.title,
        price: num(rep?.aboveTheFold?.price) ?? hero.price,
        descriptionLength: effectiveDescriptionLength,
        reviewCount,
        rating,
        hasLogo: null,
        brandColorsDetected: null,
        imageCount: mediaCount,
        highResImagesLikely: null,
        lifestyleImageryLikely: (rep?.page?.ugc?.length ?? 0) > 0 ||
            (signalScores.media ?? 0) >= EXTRACTION_FALLBACK.minSignalForContent
            ? true
            : null,
        benefitsPresent: (rep?.page?.benefits?.length ?? 0) > 0 || auditSawContent,
        featuresPresent: (rep?.page?.features?.length ?? 0) > 0 || auditSawContent,
        faqPresent: (rep?.page?.faq?.length ?? 0) > 0 ? true : null,
        deliveryReturnsPresent: Boolean(rep?.page?.shipping || rep?.page?.returns),
        specsPresent: (rep?.page?.features?.length ?? 0) > 0 ? true : null,
        videoPresent: null,
        beforeAfterPresent: (rep?.page?.beforeAfter?.length ?? 0) > 0,
        hasScreenshots: Boolean(audit.screenshot_paths && Object.values(audit.screenshot_paths).some(Boolean)),
    });
    const commercial = scoreProductCommercialSignal({
        price: num(rep?.aboveTheFold?.price) ?? hero.price,
        reviewCount,
        rating,
        paidOrDiscoveryRelevant: true,
        heroProminenceScore: hero.heroScore,
        availability: rep?.aboveTheFold?.delivery ?? null,
        descriptionLength: effectiveDescriptionLength,
        variantCountEstimate: null,
        purchaseIntentKeyword: Boolean(record.sourceKeyword),
    });
    let currentPdpQuality = null;
    if (cro) {
        currentPdpQuality = computeCurrentPdpQualityScore(cro, signals).score;
    }
    const subScores = {
        buyblock: signals?.buyblock_quality ?? num(cro?.cta_quality),
        visual: signals?.premium_design_perception ?? num(cro?.visual_design_quality),
        storytelling: signals?.product_storytelling_depth ?? num(cro?.product_storytelling_quality),
        media: signals?.media_usage_quality ?? num(cro?.product_presentation_quality),
        deepDive: signals?.deep_dive_quality ?? num(cro?.objection_handling_quality),
        mobile: signals?.mobile_purchase_quality ?? num(cro?.mobile_cro_quality),
    };
    const leaks = (Array.isArray(audit.conversion_leaks)
        ? audit.conversion_leaks
        : []);
    const strengths = (Array.isArray(audit.strengths) ? audit.strengths : []);
    const transformation = scorePdpTransformationPotential({
        croQualityScore: currentPdpQuality,
        leakCount: leaks.length,
        strengthCount: strengths.length,
        productCommercialSignal: commercial.product_commercial_signal_score,
        assetReadiness: assets.concept_asset_readiness_score,
        catalogFocus: record.catalogFocusScore ?? 50,
        brandCommerceModel: input.preselection.derivedCommerceModel,
        retailerScaleScore: brand?.retailer_scale_score ?? null,
        mmFitScore: audit.meneer_marketing_fit_score,
        siteTechnicallyBroken: String(audit.status ?? "").toUpperCase().includes("FAILED"),
        storytellingWeak: subScores.storytelling != null ? subScores.storytelling < 55 : null,
        aboveFoldWeak: num(cro?.above_fold_quality) != null ? num(cro?.above_fold_quality) < 55 : null,
        trustNearBuyblockWeak: num(cro?.trust_quality) != null ? num(cro?.trust_quality) < 55 : null,
        deepDiveWeak: subScores.deepDive != null ? subScores.deepDive < 55 : null,
    });
    const outreachInput = {
        domain: record.domain,
        brandCommerceModel: input.preselection.derivedCommerceModel,
        platform: record.platform ?? brand?.platform ?? null,
        businessMaturityScore: brand?.business_maturity_score ?? null,
        retailerScaleScore: brand?.retailer_scale_score ?? null,
        confirmedGoogleAdvertiser: Boolean(brand?.confirmed_google_advertiser),
        paidConfirmed: true,
        transparencyConfirmed: Boolean(brand?.transparency_confirmed),
        exactPaidFunnelLikely: hero.source === "shopping_ad" || hero.source === "paid_landing",
        pdpTransformationPotential: transformation.pdp_transformation_potential,
        conceptAssetReadinessScore: assets.concept_asset_readiness_score,
        catalogFocusScore: record.catalogFocusScore,
        estimatedProductCount: record.estimatedCatalogSize,
        estimatedBrandCount: null,
        heroProductScore: hero.heroScore,
        productCommercialSignalScore: commercial.product_commercial_signal_score,
        primaryProductPrice: num(rep?.aboveTheFold?.price) ?? hero.price,
        croQualityComposite: croComposite(cro),
        currentPdpQualityScore: currentPdpQuality,
        croDataSource: currentPdpQuality != null ? "AUDITED" : "MISSING",
        auditConfidence: audit.audit_confidence,
        productStorytellingQuality: num(cro?.product_storytelling_quality),
        aboveFoldQuality: num(cro?.above_fold_quality),
        productPresentationQuality: num(cro?.product_presentation_quality),
        trustNearBuyblockQuality: num(cro?.trust_quality),
        visualDesignQuality: subScores.visual,
        deepDiveQuality: subScores.deepDive,
        buyblockQuality: subScores.buyblock,
        mobilePurchaseQuality: subScores.mobile,
        conversionLeakCount: leaks.length,
        strengthCount: strengths.length,
        siteTechnicallyBroken: String(audit.status ?? "").toUpperCase().includes("FAILED"),
        mmFitScore: audit.meneer_marketing_fit_score,
        reviewCount,
        rating,
        productDescriptionLength: effectiveDescriptionLength,
        benefitsRichnessHint: (rep?.page?.benefits?.length ?? 0) > 0 || auditSawContent,
    };
    const engineeringScore = scoreEngineeringPilotRow({
        id: "m934",
        brand_id: brand?.id ?? "",
        concept_ready_score: 0,
        brand_commerce_model: input.preselection.derivedCommerceModel,
        catalog_focus_score: record.catalogFocusScore,
        concept_asset_readiness_score: assets.concept_asset_readiness_score,
        pdp_transformation_potential: transformation.pdp_transformation_potential,
        hero_product_score: hero.heroScore,
        primary_concept_product_title: hero.title,
        primary_concept_product_url: hero.url,
        primary_concept_product_price: hero.price,
        suggested_template_family: null,
        needs_assets: false,
        status: "CONCEPT_CANDIDATE",
        normalized_domain: record.domain,
        brand_name: brand?.name ?? record.domain,
        do_not_contact: false,
        manual_excluded: Boolean(brand?.manual_excluded),
    });
    const outreach = scoreOutreachConceptFit(outreachInput, engineeringScore);
    const conceptReady = scoreConceptReady({
        mmOrPreFit: audit.meneer_marketing_fit_score ?? record.idealProspectPreScore ?? 50,
        businessMaturity: brand?.business_maturity_score ?? 40,
        platform: record.platform ?? brand?.platform ?? null,
        catalogFocus: record.catalogFocusScore ?? 50,
        brandCommerceModel: input.preselection.derivedCommerceModel,
        heroProductScore: hero.heroScore,
        productCommercialSignal: commercial.product_commercial_signal_score,
        pdpTransformationPotential: transformation.pdp_transformation_potential,
        conceptAssetReadiness: assets.concept_asset_readiness_score,
        googleAdvertiserSignal: brand?.confirmed_google_advertiser ? 90 : 60,
        retailerScaleScore: brand?.retailer_scale_score ?? null,
        isShopify: /shopify/i.test(record.platform ?? ""),
        isWoo: /woo/i.test(record.platform ?? ""),
        mobileWeak: subScores.mobile != null ? subScores.mobile < 55 : null,
        buyblockWeak: subScores.buyblock != null ? subScores.buyblock < 55 : null,
        deepDiveWeak: subScores.deepDive != null ? subScores.deepDive < 55 : null,
    });
    return {
        currentPdpQuality,
        subScores,
        assetReadiness: assets.concept_asset_readiness_score,
        commercialSignal: commercial.product_commercial_signal_score,
        transformation: transformation.pdp_transformation_potential,
        outreach,
        conceptReadyScore: conceptReady.concept_ready_score,
        purchasablePage: isPurchasablePage(rep, subScores.buyblock),
        leaks,
        strengths,
    };
}
export async function persistScores(supabase, conceptId, input) {
    const now = new Date().toISOString();
    const { error } = await supabase
        .from("coe_concept_candidates")
        .update({
        concept_ready_score: input.conceptReadyScore,
        concept_asset_readiness_score: input.assetReadiness,
        product_commercial_signal_score: input.commercialSignal,
        pdp_transformation_potential: input.transformation,
        concept_contrast_potential: input.outreach.contrast.concept_contrast_potential,
        concept_contrast_band: input.outreach.contrast.band,
        concept_contrast_confidence: input.outreach.contrast.confidence,
        concept_contrast_ceiling: input.outreach.contrast.ceilingApplied,
        concept_contrast_evidence: input.outreach.contrast.evidence,
        concept_contrast_computed_at: now,
        scored_at: now,
        updated_at: now,
    })
        .eq("id", conceptId);
    if (error)
        throw new Error(error.message);
}
// ---------------------------------------------------------------------------
// Screenshots of the current product page
// ---------------------------------------------------------------------------
async function captureCurrentPdpScreenshots(cases) {
    const result = new Map();
    if (cases.length === 0)
        return result;
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ headless: true });
    try {
        for (const entry of cases) {
            const slug = entry.domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
            const paths = {};
            const desktop = await browser.newPage({ viewport: SCREENSHOT_CONFIG.desktop });
            try {
                await desktop.goto(entry.url, {
                    waitUntil: "domcontentloaded",
                    timeout: SCREENSHOT_CONFIG.timeoutMs,
                });
                await desktop.waitForTimeout(2500);
                const deskPath = resolve(SCREENSHOT_DIR, `${slug}-current-desktop-1440x1000.png`);
                await desktop.screenshot({ path: deskPath });
                paths.desktop = deskPath;
                if (SCREENSHOT_CONFIG.fullPage) {
                    const fullPath = resolve(SCREENSHOT_DIR, `${slug}-current-desktop-full.png`);
                    await desktop.screenshot({ path: fullPath, fullPage: true });
                    paths.desktopFull = fullPath;
                }
            }
            catch (error) {
                logger.warn("Desktop screenshot failed", {
                    domain: entry.domain,
                    error: error.message,
                });
            }
            finally {
                await desktop.close();
            }
            const mobile = await browser.newPage({
                viewport: SCREENSHOT_CONFIG.mobile,
                isMobile: true,
                hasTouch: true,
            });
            try {
                await mobile.goto(entry.url, {
                    waitUntil: "domcontentloaded",
                    timeout: SCREENSHOT_CONFIG.timeoutMs,
                });
                await mobile.waitForTimeout(2500);
                const mobilePath = resolve(SCREENSHOT_DIR, `${slug}-current-mobile-390x844.png`);
                await mobile.screenshot({ path: mobilePath });
                paths.mobile = mobilePath;
            }
            catch (error) {
                logger.warn("Mobile screenshot failed", {
                    domain: entry.domain,
                    error: error.message,
                });
            }
            finally {
                await mobile.close();
            }
            result.set(entry.domain, paths);
        }
    }
    finally {
        await browser.close();
    }
    return result;
}
// ---------------------------------------------------------------------------
// Regression comparison rows
// ---------------------------------------------------------------------------
async function loadRegressionRows(supabase, domains) {
    const { data, error } = await supabase
        .from("coe_concept_candidates")
        .select("concept_contrast_potential, concept_contrast_band, concept_contrast_ceiling, pdp_transformation_potential, concept_asset_readiness_score, status, brands!inner(normalized_domain, business_type)")
        .in("brands.normalized_domain", domains);
    if (error)
        throw new Error(error.message);
    return (data ?? []).map((row) => {
        const brand = (Array.isArray(row.brands) ? row.brands[0] : row.brands);
        return {
            domain: brand?.normalized_domain,
            businessType: brand?.business_type,
            status: row.status,
            conceptContrast: row.concept_contrast_potential,
            contrastBand: row.concept_contrast_band,
            contrastCeiling: row.concept_contrast_ceiling,
            transformation: row.pdp_transformation_potential,
            assetReadiness: row.concept_asset_readiness_score,
            designTargetEligible: false,
            note: row.concept_contrast_band === "GEEN_CONTRAST" || (row.concept_contrast_potential ?? 0) < 40
                ? "te weinig contrast voor een overtuigende before/after"
                : "alleen ter vergelijking, geen kandidaat in deze run",
        };
    });
}
// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const startedAt = new Date().toISOString();
    const { records, sources } = loadStrongProspects();
    if (records.length === 0) {
        throw new Error("Geen strong prospects gevonden in het M9.3.3 rapport.");
    }
    const brands = await loadBrands(supabase, records.map((record) => record.domain));
    const dryRun = process.argv.includes("--dry-run");
    const rescore = process.argv.includes("--rescore");
    const ranked = preselectNewProspects(records);
    const budgetCap = env.M934_MAX_ANTHROPIC_COST;
    const mode = dryRun ? " · DRY RUN" : rescore ? " · RESCORE (geen nieuwe audits)" : "";
    console.log(`\n=== M9.3.4 · ${records.length} strong prospects · max ${M934.maxAudits} audits · cap $${budgetCap}${mode} ===\n`);
    // -------------------------------------------------------------------------
    // Hero resolution. Free, so it runs before anything is written or spent.
    // A candidate without a real product page never reaches Claude.
    // -------------------------------------------------------------------------
    const auditQueue = [];
    for (const entry of ranked) {
        if (entry.excluded)
            continue;
        if (auditQueue.length >= M934.maxAuditAttempts) {
            if (!entry.skipReason)
                entry.skipReason = "buiten de audit-limiet";
            continue;
        }
        const brand = brands.get(entry.record.domain) ?? null;
        if (!brand) {
            entry.skipReason = "geen brandrecord in de database";
            continue;
        }
        const { hero, reason } = await resolvePrimarySalesProduct(entry.record);
        if (!hero?.url) {
            entry.skipReason = reason ?? "geen betrouwbare hero product URL";
            console.log(`  SKIP ${entry.record.domain}: ${entry.skipReason}`);
            continue;
        }
        console.log(`  HERO ${entry.record.domain} → ${hero.title} (${hero.source}, score ${hero.heroScore})`);
        auditQueue.push({ entry, brand, hero });
    }
    if (dryRun) {
        console.log("\n=== DRY RUN: preselectie ===");
        for (const entry of ranked) {
            const queued = auditQueue.findIndex((item) => item.entry.record.domain === entry.record.domain);
            console.log(`  ${queued > -1 && queued < M934.maxAudits ? "AUDIT" : "     "} #${String(entry.rank).padStart(2)} ${entry.record.domain.padEnd(26)} ${String(entry.preselectionScore).padStart(3)} · ${entry.derivedCommerceModel}${entry.skipReason ? ` · ${entry.skipReason}` : ""}`);
        }
        console.log("\nGeen audits uitgevoerd, geen kosten gemaakt.");
        return;
    }
    const run = await createRun(supabase, "new_prospect_sales_audit", {
        milestone: M934.milestone,
        poolSize: records.length,
        maxAudits: M934.maxAudits,
        anthropicCap: budgetCap,
    });
    const audited = [];
    let anthropicSpent = 0;
    let attempts = 0;
    let completedAudits = 0;
    for (const { entry, brand, hero } of auditQueue) {
        if (completedAudits >= M934.maxAudits) {
            if (!entry.skipReason)
                entry.skipReason = "buiten de audit-limiet";
            continue;
        }
        const record = entry.record;
        if (!rescore) {
            const gate = evaluateAnthropicBudgetGate({
                currentRunCost: anthropicSpent,
                configuredCap: budgetCap,
                conservativeNextCallCost: M934.conservativeAuditCost,
                label: record.domain,
            });
            if (!gate.allowed) {
                entry.skipReason = "budget op";
                console.log(`  SKIP ${record.domain}: ${gate.reason}`);
                break;
            }
        }
        attempts += 1;
        entry.selected = true;
        const heroUrl = hero.url;
        const conceptId = await upsertConceptCandidate(supabase, {
            brandId: brand.id,
            record,
            preselection: entry,
            hero,
            brand,
        });
        const opportunityId = await ensureConceptAuditOpportunity(supabase, {
            conceptId,
            brandId: brand.id,
            productUrl: heroUrl,
        });
        const candidate = await buildConceptAuditCandidate(supabase, opportunityId, heroUrl);
        if (!candidate) {
            entry.skipReason = "audit candidate kon niet worden opgebouwd";
            continue;
        }
        // Rescore reads the audit that is already stored, so a scoring change costs
        // nothing and never re-photographs a page we already measured.
        const result = rescore
            ? { anthropicCost: 0, skipReason: undefined, pageHealthStatus: undefined }
            : await auditOpportunity(env, supabase, candidate, run.id);
        if (!rescore)
            console.log(`  AUDIT ${record.domain} → ${hero.url}`);
        anthropicSpent += result.anthropicCost;
        const audit = await loadLatestAudit(supabase, opportunityId);
        const claudeRan = rescore
            ? Boolean(audit?.cro_scores)
            : result.anthropicCost > 0 && Boolean(audit?.cro_scores);
        if (rescore) {
            console.log(`  RESCORE ${record.domain} → ${claudeRan ? "audit gevonden" : "geen bruikbare audit"}`);
        }
        const base = {
            domain: record.domain,
            rank: entry.rank,
            preselectionScore: entry.preselectionScore,
            record,
            preselection: entry,
            brandId: brand.id,
            conceptId,
            opportunityId,
            hero,
            auditOutcome: claudeRan ? "AUDITED" : "SKIPPED_PAGE_HEALTH",
            auditSkipReason: claudeRan
                ? null
                : (result.skipReason ?? audit?.page_health_status ?? "pagina niet leesbaar"),
            pageHealth: result.pageHealthStatus ?? audit?.page_health_status ?? null,
            auditConfidence: audit?.audit_confidence ?? null,
            currentPdpQuality: null,
            subScores: {
                buyblock: null,
                visual: null,
                storytelling: null,
                media: null,
                deepDive: null,
                mobile: null,
            },
            assetReadiness: null,
            commercialSignal: null,
            transformation: null,
            contrastRoom: null,
            contrastCapability: null,
            conceptContrast: null,
            contrastBand: null,
            contrastCeiling: null,
            deepDiveFit: null,
            economicFit: null,
            salesFit: null,
            trueSalesDesignScore: null,
            measurementConfidence: null,
            gate: null,
            leaks: [],
            strengths: [],
            // In rescore mode this run spends nothing, but the numbers still rest on
            // an audit that was paid for. The report has to say what it cost.
            anthropicCost: result.anthropicCost || (audit?.anthropic_cost ?? 0),
        };
        if (!claudeRan || !audit) {
            // A blocked or broken page produces no scores, on purpose. The slot goes
            // to the next ranked candidate.
            console.log(`    geen audit: ${base.auditSkipReason} (page health ${base.pageHealth ?? "onbekend"})`);
            audited.push(base);
            continue;
        }
        const scored = scoreAuditedCandidate({
            record,
            preselection: entry,
            hero,
            brand,
            audit,
        });
        await persistScores(supabase, conceptId, {
            conceptReadyScore: scored.conceptReadyScore,
            assetReadiness: scored.assetReadiness,
            commercialSignal: scored.commercialSignal,
            transformation: scored.transformation,
            outreach: scored.outreach,
        });
        const trueSales = computeTrueSalesDesignScore({
            conceptContrast: scored.outreach.contrast.concept_contrast_potential,
            salesFit: scored.outreach.outreachConceptFitScore,
            economicFit: scored.outreach.components.projectEconomicFit,
            auditConfidence: audit.audit_confidence,
            contrastConfidence: scored.outreach.contrast.confidence,
            outreachScoreConfidence: scored.outreach.outreachScoreConfidence,
        });
        const designGate = evaluateDesignTargetGate({
            domain: record.domain,
            currentPdpQuality: scored.currentPdpQuality,
            transformation: scored.transformation,
            conceptContrast: scored.outreach.contrast.concept_contrast_potential,
            assetReadiness: scored.assetReadiness,
            deepDiveFit: scored.outreach.components.deepDivePdpFit,
            businessMaturity: brand.business_maturity_score,
            auditConfidence: audit.audit_confidence,
            businessType: record.businessType ?? brand.business_type,
            commercialProof: hasCommercialProof(record, brand),
            focusedBusiness: isFocusedBusiness(record),
            purchasablePage: scored.purchasablePage,
            excluded: entry.excluded,
        });
        audited.push({
            ...base,
            currentPdpQuality: scored.currentPdpQuality,
            subScores: scored.subScores,
            assetReadiness: scored.assetReadiness,
            commercialSignal: scored.commercialSignal,
            transformation: scored.transformation,
            contrastRoom: scored.outreach.contrast.roomScore,
            contrastCapability: scored.outreach.contrast.capabilityScore,
            conceptContrast: scored.outreach.contrast.concept_contrast_potential,
            contrastBand: scored.outreach.contrast.band,
            contrastCeiling: scored.outreach.contrast.ceilingApplied,
            deepDiveFit: scored.outreach.components.deepDivePdpFit,
            economicFit: scored.outreach.components.projectEconomicFit,
            salesFit: scored.outreach.outreachConceptFitScore,
            trueSalesDesignScore: trueSales.score,
            measurementConfidence: trueSales.measurementConfidence,
            gate: designGate,
            leaks: scored.leaks,
            strengths: scored.strengths,
        });
        completedAudits += 1;
        console.log(`    PDP ${scored.currentPdpQuality} · transformatie ${scored.transformation} · contrast ${scored.outreach.contrast.concept_contrast_potential} · sales design ${trueSales.score} · $${result.anthropicCost.toFixed(4)}`);
    }
    // -------------------------------------------------------------------------
    // Ranking, top three and design target
    // -------------------------------------------------------------------------
    const scoredCandidates = audited
        .filter((entry) => entry.auditOutcome === "AUDITED")
        .sort((a, b) => (b.trueSalesDesignScore ?? 0) - (a.trueSalesDesignScore ?? 0));
    const topThree = scoredCandidates.slice(0, M934.maxDesignCases);
    const designTarget = scoredCandidates.find((entry) => entry.gate?.passed) ?? null;
    const screenshots = await captureCurrentPdpScreenshots(topThree
        .filter((entry) => entry.hero?.url)
        .map((entry) => ({ domain: entry.domain, url: entry.hero.url })));
    const designCases = topThree.map((entry) => ({
        domain: entry.domain,
        trueSalesDesignScore: entry.trueSalesDesignScore,
        rationale: buildDesignCaseRationale({
            domain: entry.domain,
            branchLabel: entry.record.branchLabel,
            familyLabel: entry.record.familyLabel,
            businessType: entry.record.businessType,
            platform: entry.record.platform,
            commerceModel: entry.preselection.derivedCommerceModel,
            estimatedCatalogSize: entry.record.estimatedCatalogSize,
            catalogFocus: entry.record.catalogFocusScore,
            ownBrandSignal: entry.record.ownBrandSignal,
            businessMaturity: brands.get(entry.domain)?.business_maturity_score ?? null,
            adKeywords: entry.record.googleAdsEvidence?.keywords ?? [],
            heroProduct: entry.hero?.title ?? null,
            heroPrice: entry.hero?.price ?? null,
            heroCurrency: entry.hero?.currency ?? null,
            reviewCount: null,
            rating: null,
            currentPdpQuality: entry.currentPdpQuality,
            subScores: entry.subScores,
            assetReadiness: entry.assetReadiness,
            transformation: entry.transformation,
            contrastRoom: entry.contrastRoom,
            contrastCapability: entry.contrastCapability,
            conceptContrast: entry.conceptContrast,
            deepDiveFit: entry.deepDiveFit,
            economicFit: entry.economicFit,
            salesFit: entry.salesFit,
            leaks: entry.leaks,
            strengths: entry.strengths,
        }),
        screenshots: screenshots.get(entry.domain) ?? {},
    }));
    const regression = await loadRegressionRows(supabase, ["currentbody.nl", "tensfact.com"]);
    const report = {
        milestone: M934.milestone,
        runId: run.id,
        startedAt,
        finishedAt: new Date().toISOString(),
        preselection: {
            poolSize: records.length,
            poolSources: sources,
            maxAudits: M934.maxAudits,
            selected: audited.length,
            formula: "gewogen som van de M9.3.3 signalen minus penalties voor reseller-breedte, te grote catalogus, zwak materiaal, lage productwaarde en ketengedrag",
            candidates: ranked.map((entry) => ({
                rank: entry.rank,
                domain: entry.record.domain,
                preselectionScore: entry.preselectionScore,
                idealPreScore: entry.record.idealProspectPreScore,
                commerceModel: entry.derivedCommerceModel,
                catalogBand: entry.catalogBandLabel,
                heroFromReport: entry.heroUrlFromReport,
                selected: entry.selected,
                skipReason: entry.skipReason,
                penalties: entry.penalties,
                reasons: entry.reasons,
                components: entry.components,
            })),
        },
        audits: audited.map((entry) => ({
            domain: entry.domain,
            rank: entry.rank,
            preselectionScore: entry.preselectionScore,
            branch: entry.record.branchLabel,
            family: entry.record.familyLabel,
            category: `${entry.record.branchLabel} · ${entry.record.familyLabel}`,
            platform: entry.record.platform,
            commerceModel: entry.preselection.derivedCommerceModel,
            catalogEstimate: entry.record.estimatedCatalogSize,
            catalogFocus: entry.record.catalogFocusScore,
            heroProduct: entry.hero?.title ?? null,
            heroUrl: entry.hero?.url ?? null,
            heroPrice: entry.hero?.price ?? null,
            heroSource: entry.hero?.source ?? null,
            adsEvidence: entry.record.googleAdsEvidence,
            auditOutcome: entry.auditOutcome,
            auditSkipReason: entry.auditSkipReason,
            pageHealth: entry.pageHealth,
            currentPdpQuality: entry.currentPdpQuality,
            visualQuality: entry.subScores.visual,
            buyblockQuality: entry.subScores.buyblock,
            storytellingQuality: entry.subScores.storytelling,
            mediaQuality: entry.subScores.media,
            deepDiveQuality: entry.subScores.deepDive,
            mobileQuality: entry.subScores.mobile,
            assetReadiness: entry.assetReadiness,
            commercialSignal: entry.commercialSignal,
            transformation: entry.transformation,
            contrastRoom: entry.contrastRoom,
            contrastCapability: entry.contrastCapability,
            conceptContrast: entry.conceptContrast,
            contrastBand: entry.contrastBand,
            contrastCeiling: entry.contrastCeiling,
            deepDiveFit: entry.deepDiveFit,
            economicFit: entry.economicFit,
            salesFit: entry.salesFit,
            trueSalesDesignScore: entry.trueSalesDesignScore,
            confidence: entry.measurementConfidence,
            auditConfidence: entry.auditConfidence,
            gatePassed: entry.gate?.passed ?? false,
            gateBlockers: entry.gate?.blockers ?? [],
            gateWarnings: entry.gate?.warnings ?? [],
            leaks: entry.leaks.map((leak) => ({
                severity: leak.severity,
                title: leak.title,
                evidence: leak.evidence,
            })),
            anthropicCost: entry.anthropicCost,
        })),
        topThree: designCases,
        designTarget: designTarget
            ? {
                domain: designTarget.domain,
                trueSalesDesignScore: designTarget.trueSalesDesignScore,
                conceptContrast: designTarget.conceptContrast,
                currentPdpQuality: designTarget.currentPdpQuality,
                transformation: designTarget.transformation,
                heroUrl: designTarget.hero?.url ?? null,
                warnings: designTarget.gate?.warnings ?? [],
                note: "aanbeveling, nog geen preview gebouwd",
            }
            : null,
        designTargetGate: DESIGN_TARGET_GATE,
        trueSalesDesignFormula: TRUE_SALES_DESIGN_FORMULA,
        regression,
        cost: {
            anthropic: Math.round(anthropicSpent * 10000) / 10000,
            anthropicCap: budgetCap,
            /** What the audits behind this report cost in total, across runs. */
            underlyingAuditCost: Math.round(audited.reduce((sum, entry) => sum + entry.anthropicCost, 0) * 10000) /
                10000,
            dataForSeo: 0,
            auditsRun: completedAudits,
            auditAttempts: attempts,
            costPerAudit: completedAudits > 0
                ? Math.round((anthropicSpent / completedAudits) * 10000) / 10000
                : 0,
        },
    };
    mkdirSync(dirname(REPORT_PATH), { recursive: true });
    writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    mkdirSync(dirname(DASHBOARD_REPORT_PATH), { recursive: true });
    writeFileSync(DASHBOARD_REPORT_PATH, JSON.stringify(report, null, 2));
    await completeRun(supabase, run.id, "completed", {
        anthropicCost: anthropicSpent,
        auditsRun: completedAudits,
        designTarget: designTarget?.domain ?? null,
    });
    printReport(report);
}
function printReport(report) {
    console.log("\n=== PRESELECTIE ===");
    for (const candidate of report.preselection.candidates) {
        const mark = candidate.selected ? "AUDIT" : "     ";
        console.log(`  ${mark} #${String(candidate.rank).padStart(2)} ${candidate.domain.padEnd(24)} score ${String(candidate.preselectionScore).padStart(3)} · ${candidate.commerceModel}${candidate.skipReason ? ` · ${candidate.skipReason}` : ""}`);
    }
    console.log("\n=== AUDITS ===");
    for (const audit of report.audits) {
        if (audit.auditOutcome !== "AUDITED") {
            console.log(`\n  ${audit.domain}: geen audit (${audit.auditSkipReason})`);
            continue;
        }
        console.log(`\n  ${audit.domain} · ${audit.category}\n` +
            `    hero: ${audit.heroProduct ?? "?"}${audit.heroPrice != null ? ` €${audit.heroPrice}` : ""}\n` +
            `    PDP ${audit.currentPdpQuality} (buyblock ${audit.buyblockQuality} · visueel ${audit.visualQuality} · verhaal ${audit.storytellingQuality} · beeld ${audit.mediaQuality} · verdieping ${audit.deepDiveQuality} · mobiel ${audit.mobileQuality})\n` +
            `    materiaal ${audit.assetReadiness} · transformatie ${audit.transformation} · contrast ${audit.conceptContrast} (ruimte ${audit.contrastRoom} · materiaal ${audit.contrastCapability})\n` +
            `    deep-dive fit ${audit.deepDiveFit} · economisch ${audit.economicFit} · sales fit ${audit.salesFit} · SALES DESIGN ${audit.trueSalesDesignScore} · confidence ${audit.confidence}\n` +
            `    gate: ${audit.gatePassed ? "OK" : audit.gateBlockers.join("; ")}`);
    }
    console.log("\n=== TOP 3 ===");
    for (const design of report.topThree) {
        console.log(`\n  ${design.domain} · sales design ${design.trueSalesDesignScore}`);
        console.log("    bedrijf:");
        design.rationale.business.forEach((line) => console.log(`      ${line}`));
        console.log("    product:");
        design.rationale.product.forEach((line) => console.log(`      ${line}`));
        console.log("    wat er nu misgaat:");
        design.rationale.pdpProblems.forEach((line) => console.log(`      ${line}`));
        console.log("    wat wij doen:");
        design.rationale.ourImprovements.forEach((line) => console.log(`      ${line}`));
        console.log("    before/after:");
        design.rationale.beforeAfter.forEach((line) => console.log(`      ${line}`));
        const shots = Object.values(design.screenshots);
        if (shots.length > 0) {
            console.log("    screenshots:");
            shots.forEach((path) => console.log(`      ${path}`));
        }
    }
    console.log("\n=== DESIGN TARGET ===");
    if (report.designTarget) {
        console.log(`  ${report.designTarget.domain} · sales design ${report.designTarget.trueSalesDesignScore} · contrast ${report.designTarget.conceptContrast}`);
        console.log(`  ${report.designTarget.heroUrl}`);
        if (report.designTarget.warnings.length > 0) {
            console.log(`  let op: ${report.designTarget.warnings.join("; ")}`);
        }
        console.log("  aanbeveling. Nog geen preview gebouwd.");
    }
    else {
        console.log("  geen kandidaat haalt de strong design target gate. Niets geforceerd.");
    }
    console.log("\n=== REGRESSIE ===");
    for (const row of report.regression) {
        console.log(`  ${row.domain}: contrast ${row.conceptContrast ?? "?"} (${row.contrastBand ?? "?"}) · ${row.note}`);
    }
    console.log("\n=== KOSTEN ===");
    console.log(`  Anthropic $${report.cost.anthropic} van cap $${report.cost.anthropicCap} · ${report.cost.auditsRun} audits · DataForSEO $0`);
    if (report.cost.underlyingAuditCost > report.cost.anthropic) {
        console.log(`  Onderliggende audits kostten eerder $${report.cost.underlyingAuditCost}`);
    }
}
const invokedDirectly = process.argv[1]
    ? resolve(process.argv[1]).endsWith("auditNewSalesProspects.js")
    : false;
if (invokedDirectly) {
    main().catch((error) => {
        logger.error("M9.3.4 audit run failed", { error: error.message });
        console.error(error);
        process.exit(1);
    });
}
//# sourceMappingURL=auditNewSalesProspects.js.map