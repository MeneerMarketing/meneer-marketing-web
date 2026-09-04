/**
 * Milestone 9.4.1 — final design target validation.
 *
 * Primary: vitalwave.nl (same gates as everyone).
 * Challenger: revigurize.nl after full cheap qualification, else hottublifestyle.nl.
 * Max two Claude audits. No preview, no outreach, no new discovery.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { DESIGN_TARGET_GATE, TRUE_SALES_DESIGN_FORMULA, commerceModelFromOwnBrandSignal, } from "../config/newProspectAudit.js";
import { M941, SHOWCASE_CONTRAST, SCREENSHOT_CONFIG, } from "../config/highTicketValidation.js";
import { isUsableHeroUrl, } from "../services/idealProspect/newProspectPreselection.js";
import { qualifyChallenger } from "../services/prospect/challengerQualification.js";
import { verifyPaidProductTarget } from "../services/prospect/paidProductTargetVerification.js";
import { ensureConceptAuditOpportunity } from "../services/concept/ensureConceptAuditOpportunity.js";
import { buildConceptAuditCandidate } from "../services/concept/selectOutreachAuditCandidates.js";
import { auditOpportunity } from "../services/audit/auditRunner.js";
import { evaluateAnthropicBudgetGate } from "../services/outreach/anthropicBudget.js";
import { computeTrueSalesDesignScore, evaluateDesignTargetGate, } from "../services/concept/trueSalesDesignScore.js";
import { computeConceptAssetFeasibility } from "../services/concept/conceptAssetFeasibility.js";
import { computeDesignInterventionOpportunity } from "../services/concept/designInterventionOpportunity.js";
import { buildInterventionMap } from "../services/concept/interventionMap.js";
import { resolvePrimarySalesProduct, upsertConceptCandidate, loadLatestAudit, scoreAuditedCandidate, persistScores, } from "./auditNewSalesProspects.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
const DISCOVERY_REPORT = resolve(projectRoot, "reports/high-ticket-discovery-report.json");
const REPORT_PATH = resolve(projectRoot, "reports/high-ticket-design-validation-report.json");
const DASHBOARD_REPORT = resolve(projectRoot, "dashboard/src/preview/concepts/data/high-ticket-design-validation-report.json");
const SCREENSHOT_DIR = resolve(projectRoot, SCREENSHOT_CONFIG.outputDir);
function num(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function conceptSignalsFrom(audit) {
    const findings = audit?.findings;
    if (!findings || typeof findings !== "object")
        return null;
    return findings.concept_first_signals ?? null;
}
function representationFrom(audit) {
    const rep = audit?.page_representation;
    if (!rep || typeof rep !== "object")
        return null;
    return rep;
}
function loadDiscoveryReport() {
    if (!existsSync(DISCOVERY_REPORT)) {
        throw new Error(`M9.4 rapport niet gevonden: ${DISCOVERY_REPORT}`);
    }
    return JSON.parse(readFileSync(DISCOVERY_REPORT, "utf8"));
}
function findCandidate(candidates, domain) {
    return candidates.find((entry) => entry.domain === domain) ?? null;
}
function toProspectRecord(candidate) {
    return {
        domain: candidate.domain,
        siteUrl: candidate.siteUrl,
        branch: candidate.branch,
        branchLabel: candidate.branchLabel,
        sourceKeyword: candidate.googleAdsEvidence.keywords[0] ?? null,
        allKeywords: candidate.googleAdsEvidence.keywords,
        familyId: candidate.familyId,
        familyLabel: candidate.familyLabel,
        platform: candidate.platform,
        businessType: candidate.businessType,
        commerceModel: candidate.commerceModel,
        estimatedCatalogSize: candidate.estimatedCatalogSize,
        catalogFocusScore: candidate.catalogFocusScore,
        catalogVerified: candidate.catalogVerified,
        catalogEvidence: candidate.evidence.slice(0, 6),
        retailerBreadthScore: null,
        internationalPresenceScore: null,
        ownBrandSignal: candidate.ownBrandSignal,
        ownBrandEvidence: [],
        googleAdsEvidence: candidate.googleAdsEvidence,
        heroProduct: candidate.heroProduct,
        heroProductUrl: candidate.heroProductUrl,
        heroPrice: candidate.heroPrice,
        heroCurrency: candidate.heroCurrency,
        additionalHeroes: [],
        assetReadinessProxy: candidate.assetReadinessProxy,
        deepDivePdpFitProxy: candidate.deepDivePdpFitProxy,
        currentPdpWeaknessProxy: candidate.currentPdpWeaknessProxy,
        idealProspectPreScore: candidate.highTicketFocusedFitScore,
        preScoreEvidence: candidate.evidence,
    };
}
function toPreselection(record, rank) {
    return {
        record,
        rank,
        preselectionScore: record.idealProspectPreScore ?? 0,
        components: {},
        penalties: [],
        reasons: record.preScoreEvidence.slice(0, 5),
        derivedCommerceModel: record.commerceModel ?? commerceModelFromOwnBrandSignal(record.ownBrandSignal),
        catalogBandLabel: record.catalogVerified ? "geverifieerd" : "onbekend",
        heroUrlFromReport: isUsableHeroUrl(record.heroProductUrl, record.domain),
        excluded: false,
        selected: true,
        skipReason: null,
    };
}
async function loadBrands(supabase, domains) {
    const result = new Map();
    const { data, error } = await supabase
        .from("brands")
        .select("id, name, normalized_domain, platform, business_type, business_maturity_score, retailer_scale_score, confirmed_google_advertiser, transparency_confirmed, manual_excluded")
        .in("normalized_domain", domains);
    if (error)
        throw new Error(error.message);
    for (const row of data ?? []) {
        result.set(row.normalized_domain, row);
    }
    return result;
}
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
async function dismissOverlays(page) {
    const selectors = [
        '[aria-label*="close" i]',
        '[aria-label*="sluit" i]',
        ".klaviyo-close-form",
        'button:has-text("Nee dankje")',
        "#onetrust-accept-btn-handler",
    ];
    for (let attempt = 0; attempt < 2; attempt += 1) {
        await page.keyboard.press("Escape").catch(() => undefined);
        for (const frame of page.frames()) {
            for (const selector of selectors) {
                const target = frame.locator(selector).first();
                if (await target.isVisible().catch(() => false)) {
                    await target.click({ timeout: 1500 }).catch(() => undefined);
                }
            }
        }
        await page.waitForTimeout(1200);
    }
}
async function captureVisualPackage(input) {
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ headless: true });
    const slug = input.domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const paths = {};
    try {
        const home = await browser.newPage({ viewport: SCREENSHOT_CONFIG.desktop });
        try {
            await home.goto(input.siteUrl, {
                waitUntil: "domcontentloaded",
                timeout: SCREENSHOT_CONFIG.timeoutMs,
            });
            await home.waitForTimeout(3000);
            await dismissOverlays(home);
            const file = resolve(SCREENSHOT_DIR, `${slug}-homepage-desktop-1440x1000.png`);
            await home.screenshot({ path: file });
            paths.homepageDesktop = file;
        }
        finally {
            await home.close();
        }
        const desktop = await browser.newPage({ viewport: SCREENSHOT_CONFIG.desktop });
        try {
            await desktop.goto(input.heroUrl, {
                waitUntil: "domcontentloaded",
                timeout: SCREENSHOT_CONFIG.timeoutMs,
            });
            await desktop.waitForTimeout(4000);
            await dismissOverlays(desktop);
            paths.pdpDesktop = resolve(SCREENSHOT_DIR, `${slug}-pdp-desktop-1440x1000.png`);
            await desktop.screenshot({ path: paths.pdpDesktop });
            if (SCREENSHOT_CONFIG.fullPage) {
                paths.pdpDesktopFull = resolve(SCREENSHOT_DIR, `${slug}-pdp-desktop-full.png`);
                await desktop.screenshot({ path: paths.pdpDesktopFull, fullPage: true });
            }
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
            await mobile.goto(input.heroUrl, {
                waitUntil: "domcontentloaded",
                timeout: SCREENSHOT_CONFIG.timeoutMs,
            });
            await mobile.waitForTimeout(4000);
            await dismissOverlays(mobile);
            paths.pdpMobile = resolve(SCREENSHOT_DIR, `${slug}-pdp-mobile-390x844.png`);
            await mobile.screenshot({ path: paths.pdpMobile });
        }
        finally {
            await mobile.close();
        }
    }
    finally {
        await browser.close();
    }
    return paths;
}
function buildVisualSummary(input) {
    const weak = Object.entries(input.subScores)
        .filter(([, value]) => value != null && value < 58)
        .map(([key, value]) => `${key} ${value}`);
    const wow = input.interventionMap
        .filter((row) => row.source.startsWith("subscore"))
        .slice(0, 2)
        .map((row) => row.premiumDtcOpportunity);
    return {
        alreadyGood: input.strengths.slice(0, 4).map((entry) => entry.title),
        clearlyWeak: [
            ...weak,
            ...input.leaks.slice(0, 3).map((leak) => `${leak.severity}: ${leak.title}`),
        ],
        wowMoment: wow.length > 0
            ? wow
            : input.designIntervention != null && input.designIntervention >= 65
                ? ["premium PDP herbouw met bestaande assets en duidelijke UX-gaps"]
                : ["marginale winst: weinig concrete verbeterpunten"],
    };
}
function decideFinalRecommendation(candidates) {
    const audited = candidates.filter((entry) => entry.auditOutcome === "AUDITED");
    const rationale = [];
    if (audited.length === 0) {
        return {
            verdict: "NO_TARGET",
            recommendedDomain: null,
            showcasePreferred: false,
            rationale: ["geen succesvolle audit uitgevoerd"],
        };
    }
    const eligible = audited.filter((entry) => entry.gate?.passed &&
        (entry.conceptContrast ?? 0) >= SHOWCASE_CONTRAST.hardMin);
    if (eligible.length === 0) {
        const contrasts = audited.map((entry) => entry.conceptContrast ?? 0);
        if (contrasts.every((value) => value < SHOWCASE_CONTRAST.hardMin)) {
            rationale.push(`geen kandidaat haalt contrast ${SHOWCASE_CONTRAST.hardMin} (max ${Math.max(...contrasts)})`);
            return {
                verdict: "NO_TARGET",
                recommendedDomain: null,
                showcasePreferred: false,
                rationale,
            };
        }
        rationale.push("gate niet gehaald, maar enige commerciële fit");
        return {
            verdict: "PROMISING_BUT_NOT_STRONG_ENOUGH",
            recommendedDomain: null,
            showcasePreferred: false,
            rationale,
        };
    }
    const best = eligible.sort((a, b) => (b.trueSalesDesignScore ?? 0) - (a.trueSalesDesignScore ?? 0))[0];
    const preferred = (best.conceptContrast ?? 0) >= SHOWCASE_CONTRAST.preferredMin;
    if (preferred) {
        rationale.push(`contrast ${best.conceptContrast} haalt showcase-voorkeur (${SHOWCASE_CONTRAST.preferredMin}+)`);
        return {
            verdict: "TRUE_DESIGN_TARGET",
            recommendedDomain: best.domain,
            showcasePreferred: true,
            rationale,
        };
    }
    rationale.push(`contrast ${best.conceptContrast} haalt harde gate (${SHOWCASE_CONTRAST.hardMin}) maar niet showcase-voorkeur`);
    return {
        verdict: "PROMISING_BUT_NOT_STRONG_ENOUGH",
        recommendedDomain: best.domain,
        showcasePreferred: false,
        rationale,
    };
}
async function runAuditForCandidate(input) {
    const record = toProspectRecord(input.candidate);
    const preselection = toPreselection(record, input.candidate.rank);
    const { hero, reason } = await resolvePrimarySalesProduct(record);
    if (!hero?.url) {
        console.log(`  SKIP ${input.candidate.domain}: ${reason ?? "geen hero"}`);
        return null;
    }
    const targetVerification = input.role === "PRIMARY"
        ? verifyPaidProductTarget({
            domain: record.domain,
            expectedKeyword: M941.expectedPrimaryKeyword,
            adKeywords: record.googleAdsEvidence.keywords,
            heroTitle: hero.title,
            heroUrl: hero.url,
            familyLabel: record.familyLabel,
            heroUrlFromAd: input.candidate.heroUrlSource === "ad_landing",
        })
        : null;
    if (input.dryRun) {
        console.log(`  DRY ${input.role} ${input.candidate.domain} → ${hero.title} · target confidence ${targetVerification?.targetConfidence ?? "n.v.t."}`);
        return null;
    }
    const gate = evaluateAnthropicBudgetGate({
        currentRunCost: input.anthropicSpent,
        configuredCap: input.budgetCap,
        conservativeNextCallCost: M941.conservativeAuditCost,
        label: input.candidate.domain,
    });
    if (!gate.allowed) {
        console.log(`  BUDGET ${input.candidate.domain}: ${gate.reason}`);
        return null;
    }
    const conceptId = await upsertConceptCandidate(input.supabase, {
        brandId: input.brand.id,
        record,
        preselection,
        hero,
        brand: input.brand,
    });
    const opportunityId = await ensureConceptAuditOpportunity(input.supabase, {
        conceptId,
        brandId: input.brand.id,
        productUrl: hero.url,
    });
    const auditCandidate = await buildConceptAuditCandidate(input.supabase, opportunityId, hero.url);
    if (!auditCandidate) {
        console.log(`  SKIP ${input.candidate.domain}: audit candidate niet opgebouwd`);
        return null;
    }
    console.log(`  AUDIT ${input.role} ${input.candidate.domain} → ${hero.url}`);
    const result = await auditOpportunity(input.env, input.supabase, auditCandidate, input.runId);
    const audit = (await loadLatestAudit(input.supabase, opportunityId));
    const claudeRan = result.anthropicCost > 0 && Boolean(audit?.cro_scores);
    if (!claudeRan) {
        return {
            role: input.role,
            domain: input.candidate.domain,
            record,
            preselection,
            hero,
            brand: input.brand,
            targetVerification,
            qualification: null,
            auditOutcome: "SKIPPED",
            auditSkipReason: result.skipReason ?? "page health of audit mislukt",
            pageHealth: result.pageHealthStatus ?? null,
            currentPdpQuality: null,
            subScores: {},
            conceptContrast: null,
            transformation: null,
            deepDiveFit: null,
            economicFit: null,
            salesFit: null,
            trueSalesDesignScore: null,
            measurementConfidence: null,
            gate: null,
            designInterventionOpportunity: null,
            conceptAssetFeasibility: null,
            assetInventory: {},
            interventionMap: [],
            visualSummary: { alreadyGood: [], clearlyWeak: [], wowMoment: [] },
            leaks: [],
            strengths: [],
            anthropicCost: result.anthropicCost,
            screenshots: {},
            showcasePreferred: false,
        };
    }
    const scored = scoreAuditedCandidate({
        record,
        preselection,
        hero,
        brand: input.brand,
        audit: audit,
    });
    const rep = representationFrom(audit);
    const signals = conceptSignalsFrom(audit);
    const assetFeas = computeConceptAssetFeasibility({
        representation: rep,
        conceptSignals: signals,
        reviewCount: num(rep?.aboveTheFold?.reviews),
        rating: num(rep?.aboveTheFold?.rating),
        assetReadinessScore: scored.assetReadiness,
    });
    const intervention = computeDesignInterventionOpportunity({
        subScores: scored.subScores,
        currentPdpQuality: scored.currentPdpQuality,
        transformation: scored.transformation,
        assetFeasibility: assetFeas.conceptAssetFeasibility,
        leaks: scored.leaks,
        pdpImprovementPotential: result.pdpImprovementPotential ?? null,
    });
    const interventionMap = buildInterventionMap({
        subScores: scored.subScores,
        leaks: scored.leaks,
        strengths: scored.strengths,
        assetInventory: assetFeas.inventory,
    });
    const trueSales = computeTrueSalesDesignScore({
        conceptContrast: scored.outreach.contrast.concept_contrast_potential,
        salesFit: scored.outreach.outreachConceptFitScore,
        economicFit: scored.outreach.components.projectEconomicFit,
        auditConfidence: audit?.audit_confidence ?? null,
        contrastConfidence: scored.outreach.contrast.confidence,
        outreachScoreConfidence: scored.outreach.outreachScoreConfidence,
    });
    const gateResult = evaluateDesignTargetGate({
        domain: record.domain,
        currentPdpQuality: scored.currentPdpQuality,
        transformation: scored.transformation,
        conceptContrast: scored.outreach.contrast.concept_contrast_potential,
        assetReadiness: scored.assetReadiness,
        deepDiveFit: scored.outreach.components.deepDivePdpFit,
        businessMaturity: input.brand.business_maturity_score,
        auditConfidence: audit?.audit_confidence ?? null,
        businessType: input.brand.business_type,
        commercialProof: hasCommercialProof(record, input.brand),
        focusedBusiness: isFocusedBusiness(record),
        purchasablePage: scored.purchasablePage,
        excluded: false,
    });
    await persistScores(input.supabase, conceptId, {
        conceptReadyScore: scored.conceptReadyScore,
        assetReadiness: scored.assetReadiness,
        commercialSignal: scored.commercialSignal,
        transformation: scored.transformation,
        outreach: scored.outreach,
    });
    const screenshots = await captureVisualPackage({
        domain: input.candidate.domain,
        siteUrl: input.candidate.siteUrl,
        heroUrl: hero.url,
    });
    const showcasePreferred = (scored.outreach.contrast.concept_contrast_potential ?? 0) >= SHOWCASE_CONTRAST.preferredMin;
    return {
        role: input.role,
        domain: input.candidate.domain,
        record,
        preselection,
        hero,
        brand: input.brand,
        targetVerification,
        qualification: null,
        auditOutcome: "AUDITED",
        auditSkipReason: null,
        pageHealth: audit?.status ?? null,
        currentPdpQuality: scored.currentPdpQuality,
        subScores: scored.subScores,
        conceptContrast: scored.outreach.contrast.concept_contrast_potential,
        transformation: scored.transformation,
        deepDiveFit: scored.outreach.components.deepDivePdpFit,
        economicFit: scored.outreach.components.projectEconomicFit,
        salesFit: scored.outreach.outreachConceptFitScore,
        trueSalesDesignScore: trueSales.score,
        measurementConfidence: trueSales.measurementConfidence,
        gate: gateResult,
        designInterventionOpportunity: intervention.designInterventionOpportunity,
        conceptAssetFeasibility: assetFeas.conceptAssetFeasibility,
        assetInventory: assetFeas.inventory,
        interventionMap,
        visualSummary: buildVisualSummary({
            strengths: scored.strengths,
            subScores: scored.subScores,
            leaks: scored.leaks,
            interventionMap,
            designIntervention: intervention.designInterventionOpportunity,
        }),
        leaks: scored.leaks,
        strengths: scored.strengths,
        anthropicCost: result.anthropicCost,
        screenshots,
        showcasePreferred,
    };
}
export async function auditHighTicketDesignTargets(options) {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const startedAt = new Date().toISOString();
    const dryRun = options?.dryRun ?? process.argv.includes("--dry-run");
    const budgetCap = env.M941_MAX_ANTHROPIC_COST;
    console.log(`\n=== M9.4.1 FINAL DESIGN TARGET VALIDATION ===`);
    console.log(`Anthropic cap $${budgetCap.toFixed(2)} · max ${M941.maxAudits} audits · DataForSEO $0${dryRun ? " · DRY RUN" : ""}\n`);
    const { candidates } = loadDiscoveryReport();
    const primaryRaw = findCandidate(candidates, M941.primaryDomain);
    if (!primaryRaw) {
        throw new Error(`Primary ${M941.primaryDomain} niet in M9.4 rapport`);
    }
    const revigurizeRaw = findCandidate(candidates, M941.challengerFirst);
    const crawlTimeout = env.CRAWLER_TIMEOUT_MS;
    let challengerDomain = M941.challengerFallback;
    let challengerQualification = null;
    console.log("Stap 1 — challenger qualification (revigurize.nl)");
    if (revigurizeRaw) {
        challengerQualification = await qualifyChallenger({
            domain: revigurizeRaw.domain,
            heroProductUrl: revigurizeRaw.heroProductUrl,
            heroProduct: revigurizeRaw.heroProduct,
            heroPrice: revigurizeRaw.heroPrice,
            heroScore: revigurizeRaw.heroScore,
            branch: revigurizeRaw.branch,
            familyId: revigurizeRaw.familyId,
            familyLabel: revigurizeRaw.familyLabel,
            platform: revigurizeRaw.platform,
            businessType: revigurizeRaw.businessType,
            commerceModel: revigurizeRaw.commerceModel,
            googleAdsEvidence: revigurizeRaw.googleAdsEvidence,
            assetReadinessProxy: revigurizeRaw.assetReadinessProxy,
            deepDivePdpFitProxy: revigurizeRaw.deepDivePdpFitProxy,
            currentPdpWeaknessProxy: revigurizeRaw.currentPdpWeaknessProxy,
            adKeywordCount: revigurizeRaw.googleAdsEvidence.keywords.length,
        }, crawlTimeout);
        if (challengerQualification.qualified) {
            challengerDomain = M941.challengerFirst;
            console.log(`  revigurize.nl gekwalificeerd als challenger`);
        }
        else {
            console.log(`  revigurize.nl niet gekwalificeerd: ${challengerQualification.blockers.join(" · ")}`);
            console.log(`  fallback challenger: ${M941.challengerFallback}`);
        }
    }
    else {
        console.log(`  revigurize.nl niet in rapport, fallback ${M941.challengerFallback}`);
    }
    const challengerRaw = findCandidate(candidates, challengerDomain);
    if (!challengerRaw) {
        throw new Error(`Challenger ${challengerDomain} niet in M9.4 rapport`);
    }
    const brands = await loadBrands(supabase, [primaryRaw.domain, challengerRaw.domain]);
    const primaryBrand = brands.get(primaryRaw.domain);
    const challengerBrand = brands.get(challengerRaw.domain);
    if (!primaryBrand || !challengerBrand) {
        throw new Error("Primary of challenger mist brandrecord in Supabase");
    }
    const primaryVerification = verifyPaidProductTarget({
        domain: primaryRaw.domain,
        expectedKeyword: M941.expectedPrimaryKeyword,
        adKeywords: primaryRaw.googleAdsEvidence.keywords,
        heroTitle: primaryRaw.heroProduct,
        heroUrl: primaryRaw.heroProductUrl,
        familyLabel: primaryRaw.familyLabel,
        heroUrlFromAd: primaryRaw.heroUrlSource === "ad_landing",
    });
    console.log("\nStap 2 — primary target verification (vitalwave.nl)");
    console.log(`  keyword: ${primaryVerification.keywordUsed} · confidence ${primaryVerification.targetConfidence} · aligned ${primaryVerification.aligned}`);
    for (const line of primaryVerification.evidence) {
        console.log(`    · ${line}`);
    }
    if (dryRun) {
        console.log("\nStap 3 — dry run audit queue");
        await runAuditForCandidate({
            env,
            supabase,
            runId: "dry",
            role: "PRIMARY",
            candidate: primaryRaw,
            brand: primaryBrand,
            anthropicSpent: 0,
            budgetCap,
            dryRun: true,
        });
        await runAuditForCandidate({
            env,
            supabase,
            runId: "dry",
            role: "CHALLENGER",
            candidate: challengerRaw,
            brand: challengerBrand,
            anthropicSpent: 0,
            budgetCap,
            dryRun: true,
        });
        console.log("\nGeen audits, geen kosten.");
        return;
    }
    const run = await createRun(supabase, "high_ticket_design_validation", {
        milestone: M941.milestone,
        primary: primaryRaw.domain,
        challenger: challengerRaw.domain,
        anthropicCap: budgetCap,
    });
    let anthropicSpent = 0;
    const validated = [];
    const primaryResult = await runAuditForCandidate({
        env,
        supabase,
        runId: run.id,
        role: "PRIMARY",
        candidate: primaryRaw,
        brand: primaryBrand,
        anthropicSpent,
        budgetCap,
        dryRun: false,
    });
    if (primaryResult) {
        anthropicSpent += primaryResult.anthropicCost;
        if (primaryResult.targetVerification == null) {
            primaryResult.targetVerification = primaryVerification;
        }
        validated.push(primaryResult);
    }
    const challengerResult = await runAuditForCandidate({
        env,
        supabase,
        runId: run.id,
        role: "CHALLENGER",
        candidate: challengerRaw,
        brand: challengerBrand,
        anthropicSpent,
        budgetCap,
        dryRun: false,
    });
    if (challengerResult) {
        anthropicSpent += challengerResult.anthropicCost;
        if (challengerQualification) {
            challengerResult.qualification = challengerQualification;
        }
        validated.push(challengerResult);
    }
    const final = decideFinalRecommendation(validated);
    const finishedAt = new Date().toISOString();
    const report = {
        milestone: M941.milestone,
        version: M941.version,
        runId: run.id,
        startedAt,
        finishedAt,
        primary: {
            domain: primaryRaw.domain,
            targetVerification: primaryVerification,
            highTicketFit: primaryRaw.highTicketFocusedFitScore,
            estimatedContrastCeiling: primaryRaw.estimatedContrastCeiling,
        },
        challenger: {
            domain: challengerRaw.domain,
            selectionReason: challengerDomain === M941.challengerFirst
                ? "revigurize.nl volledig gekwalificeerd"
                : "revigurize.nl niet gekwalificeerd, fallback hottublifestyle.nl",
            qualification: challengerQualification,
        },
        qualification: challengerQualification,
        audits: validated,
        finalRecommendation: final,
        designTargetGate: DESIGN_TARGET_GATE,
        showcaseContrast: SHOWCASE_CONTRAST,
        trueSalesDesignFormula: TRUE_SALES_DESIGN_FORMULA,
        cost: {
            anthropic: anthropicSpent,
            anthropicCap: budgetCap,
            dataForSeo: 0,
            auditsRun: validated.filter((entry) => entry.auditOutcome === "AUDITED").length,
        },
    };
    writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    writeFileSync(DASHBOARD_REPORT, JSON.stringify(report, null, 2));
    await completeRun(supabase, run.id, "completed", {
        anthropicCost: anthropicSpent,
        finalVerdict: final.verdict,
        recommendedDomain: final.recommendedDomain,
    });
    console.log("\n=== AUDIT RESULTATEN ===");
    for (const entry of validated) {
        console.log(`\n  ${entry.role} ${entry.domain} · audit ${entry.auditOutcome} · contrast ${entry.conceptContrast ?? "?"} · true sales ${entry.trueSalesDesignScore ?? "?"}`);
        console.log(`     intervention ${entry.designInterventionOpportunity ?? "?"} · asset feasibility ${entry.conceptAssetFeasibility ?? "?"}`);
        if (entry.gate) {
            console.log(`     gate ${entry.gate.passed ? "PASS" : "FAIL"}${entry.gate.blockers.length ? `: ${entry.gate.blockers.join(", ")}` : ""}`);
        }
    }
    console.log("\n=== FINAL RECOMMENDATION ===");
    console.log(`  ${final.verdict}${final.recommendedDomain ? `: ${final.recommendedDomain}` : ""}`);
    console.log(`  showcase preferred: ${final.showcasePreferred}`);
    for (const line of final.rationale)
        console.log(`  · ${line}`);
    console.log(`\nKosten: Anthropic $${anthropicSpent.toFixed(4)} van cap $${budgetCap.toFixed(2)}`);
    console.log(`Rapport: ${REPORT_PATH}\n`);
}
const invokedDirectly = process.argv[1]
    ? resolve(process.argv[1]).endsWith("auditHighTicketDesignTargets.js")
    : false;
if (invokedDirectly) {
    auditHighTicketDesignTargets()
        .then(() => process.exit(0))
        .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
//# sourceMappingURL=auditHighTicketDesignTargets.js.map