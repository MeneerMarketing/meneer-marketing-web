/**
 * Milestone 9.3.1 — prospect-first discovery hardening.
 *
 * Reclassification only. Reads the existing M9.3 run from Supabase and replays
 * it through the new archetype, keyword pre-gate, SERP quality and prospect
 * pipeline gates. No DataForSEO calls, no Anthropic calls.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { IDEAL_PRODUCT_ARCHETYPES_V1, IDEAL_PRODUCT_ARCHETYPES_VERSION, normalizedBudgetShares, } from "../config/idealProductArchetypes.js";
import { PROSPECT_GATE_FIXTURES } from "../config/prospectExclusion.js";
import { M93_DEFAULTS } from "../config/idealProspectProfile.js";
import { classifyProspectExclusion, } from "../services/prospect/prospectPipelineGate.js";
import { evaluateKeywordPreGate } from "../services/idealProspect/keywordPreGate.js";
import { computeSerpProspectQuality, } from "../services/idealProspect/serpProspectQuality.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
const RUN_WINDOW_START = process.env.M931_RUN_SINCE ?? "2026-08-13T18:50:00Z";
const REPORT_RELATIVE_PATH = "dashboard/src/preview/concepts/data/prospect-hardening-report.json";
/** Domains that already appear on the ideal-prospect screen. */
async function loadExistingPoolDomains(root) {
    const reportPath = path.resolve(root, "dashboard/src/preview/concepts/data/ideal-prospect-report.json");
    try {
        const parsed = JSON.parse(await readFile(reportPath, "utf8"));
        const domains = [
            ...(parsed.trueSalesRanking?.top10 ?? []),
            ...(parsed.prequalification?.top20 ?? []),
        ]
            .map((row) => String(row.domain ?? "").toLowerCase())
            .filter(Boolean);
        return new Set(domains);
    }
    catch {
        return new Set();
    }
}
async function main() {
    const env = loadEnv();
    const client = createSupabaseServerClient(env);
    console.log("M9.3.1 — PROSPECT-FIRST DISCOVERY HARDENING");
    console.log(`Reclassification window: ${RUN_WINDOW_START}`);
    console.log("DataForSEO budget: $0.00 | Anthropic budget: $0.00\n");
    const { data: occurrences, error: occError } = await client
        .from("ad_occurrences")
        .select("brand_id, keyword_id, ad_signal_type, created_at")
        .gte("created_at", RUN_WINDOW_START)
        .limit(20000);
    if (occError)
        throw new Error(`ad_occurrences load failed: ${occError.message}`);
    const keywordIds = [...new Set((occurrences ?? []).map((o) => o.keyword_id).filter(Boolean))];
    const brandIds = [...new Set((occurrences ?? []).map((o) => o.brand_id).filter(Boolean))];
    const { data: keywordRows } = await client
        .from("keywords")
        .select("id, keyword, category, search_volume, cpc, keyword_intent_type, prospecting_value_score, discovery_priority_score")
        .in("id", keywordIds);
    const { data: brandRows, error: brandError } = await client
        .from("brands")
        .select("id, normalized_domain, business_type, is_ecommerce, manual_excluded, retailer_scale_score, business_maturity_score, eligibility_status, lead_eligible, prequalified_prospect, pre_fit_score")
        .in("id", brandIds);
    if (brandError)
        throw new Error(`brands load failed: ${brandError.message}`);
    const keywordById = new Map((keywordRows ?? []).map((k) => [k.id, k]));
    const brandById = new Map((brandRows ?? []).map((b) => [b.id, b]));
    // Breadth signals: how widely does each domain advertise?
    const brandKeywords = new Map();
    const brandCategories = new Map();
    const keywordBrands = new Map();
    for (const occ of occurrences ?? []) {
        if (!occ.brand_id || !occ.keyword_id)
            continue;
        const keyword = keywordById.get(occ.keyword_id);
        if (!brandKeywords.has(occ.brand_id))
            brandKeywords.set(occ.brand_id, new Set());
        brandKeywords.get(occ.brand_id).add(occ.keyword_id);
        if (!brandCategories.has(occ.brand_id))
            brandCategories.set(occ.brand_id, new Set());
        if (keyword?.category)
            brandCategories.get(occ.brand_id).add(keyword.category);
        if (!keywordBrands.has(occ.keyword_id))
            keywordBrands.set(occ.keyword_id, new Set());
        keywordBrands.get(occ.keyword_id).add(occ.brand_id);
    }
    const domainVerdicts = [];
    for (const [brandId, brand] of brandById) {
        const domain = brand.normalized_domain;
        if (!domain)
            continue;
        const categorySpread = brandCategories.get(brandId)?.size ?? 0;
        const keywordSpread = brandKeywords.get(brandId)?.size ?? 0;
        const verdict = classifyProspectExclusion({
            domain,
            businessType: brand.business_type,
            isEcommerce: brand.is_ecommerce,
            manualExcluded: brand.manual_excluded,
            retailerScaleScore: brand.retailer_scale_score,
            businessMaturityScore: brand.business_maturity_score,
            categorySpread,
            keywordSpread,
        });
        domainVerdicts.push({
            domain,
            previousBusinessType: brand.business_type,
            previousEligibility: brand.eligibility_status,
            prospectClass: verdict.prospectClass,
            eligible: verdict.eligible,
            reason: verdict.reason,
            evidence: verdict.evidence,
            categorySpread,
            keywordSpread,
            previouslyPrequalified: Boolean(brand.prequalified_prospect),
        });
    }
    // Domains that already sit in the ideal-prospect ranking must get a verdict
    // too, otherwise a keten from the legacy pool still shows up on the
    // prospect discovery screen.
    const poolDomainVerdicts = [];
    const existingPoolDomains = await loadExistingPoolDomains(projectRoot);
    const alreadyJudged = new Set(domainVerdicts.map((d) => d.domain));
    const extraDomains = [...existingPoolDomains].filter((d) => !alreadyJudged.has(d));
    if (extraDomains.length > 0) {
        const { data: extraBrands } = await client
            .from("brands")
            .select("id, normalized_domain, business_type, is_ecommerce, manual_excluded, retailer_scale_score, business_maturity_score, eligibility_status, lead_eligible, prequalified_prospect, pre_fit_score")
            .in("normalized_domain", extraDomains);
        const extraByDomain = new Map((extraBrands ?? []).map((b) => [String(b.normalized_domain), b]));
        for (const domain of extraDomains) {
            const brand = extraByDomain.get(domain) ?? null;
            const verdict = classifyProspectExclusion({
                domain,
                businessType: brand?.business_type ?? null,
                isEcommerce: brand?.is_ecommerce ?? null,
                manualExcluded: brand?.manual_excluded ?? null,
                retailerScaleScore: brand?.retailer_scale_score ?? null,
                businessMaturityScore: brand?.business_maturity_score ?? null,
            });
            poolDomainVerdicts.push({
                domain,
                previousBusinessType: brand?.business_type ?? null,
                previousEligibility: brand?.eligibility_status ?? null,
                prospectClass: verdict.prospectClass,
                eligible: verdict.eligible,
                reason: verdict.reason,
                evidence: verdict.evidence,
                categorySpread: 0,
                keywordSpread: 0,
                previouslyPrequalified: Boolean(brand?.prequalified_prospect),
            });
        }
    }
    const eligibleDomains = domainVerdicts.filter((d) => d.eligible);
    const excludedDomains = domainVerdicts.filter((d) => !d.eligible);
    // Domains that previously survived into the expensive pipeline but should not have.
    const lateExclusions = excludedDomains.filter((d) => d.previouslyPrequalified ||
        d.previousEligibility === "PENDING_QUALIFICATION" ||
        d.previousEligibility === "QUALIFIED");
    const keywordVerdicts = [];
    for (const [keywordId, brandSet] of keywordBrands) {
        const keyword = keywordById.get(keywordId);
        if (!keyword)
            continue;
        const preGate = evaluateKeywordPreGate({
            keyword: keyword.keyword,
            searchVolume: keyword.search_volume,
            cpc: keyword.cpc,
        });
        const samples = [...brandSet]
            .map((id) => brandById.get(id))
            .filter((b) => Boolean(b?.normalized_domain))
            .map((b) => ({ domain: b.normalized_domain, businessType: b.business_type }));
        const quality = computeSerpProspectQuality(samples, {
            archetypeTooBroad: preGate.archetype.rejectReason === "TOO_BROAD",
        });
        const status = preGate.accepted ? quality.status : "PRE_GATE_REJECTED";
        keywordVerdicts.push({
            keyword: keyword.keyword,
            category: keyword.category,
            archetype: preGate.archetype.archetypeLabel,
            family: preGate.archetype.familyLabel,
            archetypeFit: preGate.archetype.productArchetypeFitScore,
            searchVolume: keyword.search_volume,
            cpc: keyword.cpc,
            commercialIntent: preGate.commercialIntent,
            prospectingValue: preGate.prospectingValue,
            preGateClass: preGate.preGateClass,
            preGateAccepted: preGate.accepted,
            preGateReason: preGate.rejectReason,
            advertisersSampled: quality.sampled,
            brandsSpecialists: quality.counts.NICHE_BRAND + quality.counts.SPECIALIST,
            retailers: quality.counts.GENERAL_RETAILER + quality.counts.MASS_RETAILER,
            comparison: quality.counts.COMPARISON_SITE,
            marketplaces: quality.counts.MARKETPLACE,
            prospectSerpQuality: quality.prospectSerpQualityScore,
            status,
            stopReason: preGate.accepted ? quality.stopReason : preGate.rejectReason,
            previousIntent: keyword.keyword_intent_type,
            previousProspectingValue: keyword.prospecting_value_score,
            wouldRunDiscovery: preGate.accepted && quality.approved,
            exampleAdvertisers: samples.slice(0, 6).map((s) => s.domain),
        });
    }
    keywordVerdicts.sort((a, b) => b.prospectSerpQuality - a.prospectSerpQuality);
    const approvedKeywords = keywordVerdicts.filter((k) => k.wouldRunDiscovery);
    const rejectedKeywords = keywordVerdicts.filter((k) => !k.wouldRunDiscovery);
    // ------------------------------------------------------------ branch stats
    const branchStats = IDEAL_PRODUCT_ARCHETYPES_V1.map((archetype) => {
        const rows = keywordVerdicts.filter((k) => k.archetype === archetype.label);
        const totalAdvertisers = rows.reduce((sum, r) => sum + r.advertisersSampled, 0);
        const specialists = rows.reduce((sum, r) => sum + r.brandsSpecialists, 0);
        const approved = rows.filter((r) => r.wouldRunDiscovery).length;
        const serpCost = rows.length * M93_DEFAULTS.estimatedSerpCostPerKeyword;
        return {
            id: archetype.id,
            label: archetype.label,
            enabled: archetype.enabled,
            keywordCategory: archetype.keywordCategory,
            budgetShare: archetype.budgetShare,
            families: archetype.families.map((f) => ({ id: f.id, label: f.label, seeds: f.seeds })),
            keywordsInRun: rows.length,
            keywordsApproved: approved,
            advertisersSampled: totalAdvertisers,
            specialistsFound: specialists,
            specialistYield: totalAdvertisers > 0 ? Math.round((specialists / totalAdvertisers) * 100) : 0,
            spend: Math.round(serpCost * 1000) / 1000,
            costPerPrequalifiedProspect: specialists > 0 ? Math.round((serpCost / specialists) * 1000) / 1000 : null,
            notes: archetype.notes,
        };
    });
    // Category level view for keywords that matched no archetype at all.
    const unmatchedKeywords = keywordVerdicts.filter((k) => !k.archetype);
    const categoryStats = [...new Set(keywordVerdicts.map((k) => k.category ?? "UNKNOWN"))].map((category) => {
        const rows = keywordVerdicts.filter((k) => (k.category ?? "UNKNOWN") === category);
        const advertisers = rows.reduce((sum, r) => sum + r.advertisersSampled, 0);
        const specialists = rows.reduce((sum, r) => sum + r.brandsSpecialists, 0);
        return {
            category,
            keywords: rows.length,
            advertisers,
            specialists,
            specialistYield: advertisers > 0 ? Math.round((specialists / advertisers) * 100) : 0,
            approvedUnderNewLogic: rows.filter((r) => r.wouldRunDiscovery).length,
            spend: Math.round(rows.length * M93_DEFAULTS.estimatedSerpCostPerKeyword * 1000) / 1000,
        };
    });
    categoryStats.sort((a, b) => b.specialistYield - a.specialistYield);
    // -------------------------------------------------------------- cost review
    const serpCostPerKeyword = M93_DEFAULTS.estimatedSerpCostPerKeyword;
    const totalSerpCost = keywordVerdicts.length * serpCostPerKeyword;
    const wastedSerpCost = rejectedKeywords.length * serpCostPerKeyword;
    const usefulProspects = eligibleDomains.length;
    const costPerUsefulProspect = usefulProspects > 0 ? totalSerpCost / usefulProspects : null;
    const projectedCostPerUsefulProspect = approvedKeywords.length > 0 && usefulProspects > 0
        ? (approvedKeywords.length * serpCostPerKeyword) /
            Math.max(1, approvedKeywords.reduce((sum, k) => sum + k.brandsSpecialists, 0))
        : null;
    // --------------------------------------------------------- regression tests
    const fixtureResults = PROSPECT_GATE_FIXTURES.map((fixture) => {
        const verdict = classifyProspectExclusion({ domain: fixture.domain, ...fixture.signals });
        const pass = verdict.eligible === fixture.expectEligible &&
            (fixture.expectReason === null || verdict.reason === fixture.expectReason);
        return {
            domain: fixture.domain,
            expectEligible: fixture.expectEligible,
            expectReason: fixture.expectReason,
            actualEligible: verdict.eligible,
            actualReason: verdict.reason,
            prospectClass: verdict.prospectClass,
            pass,
        };
    });
    const fixturesFailed = fixtureResults.filter((f) => !f.pass);
    // -------------------------------------------------------------- root cause
    const problemDomains = [
        "decathlon.nl",
        "kruidvat.nl",
        "beslist.nl",
        "vergelijk.nl",
        "vergelijkeven.nl",
        "kieskeurig.nl",
        "lidl.nl",
        "douglas.nl",
        "zooplus.nl",
        "betersport.nl",
    ];
    const rootCause = problemDomains.map((domain) => {
        const brandEntry = [...brandById.entries()].find(([, b]) => b.normalized_domain === domain);
        const verdict = domainVerdicts.find((d) => d.domain === domain) ?? null;
        const keywords = brandEntry
            ? [...(brandKeywords.get(brandEntry[0]) ?? [])]
                .map((id) => keywordById.get(id)?.keyword)
                .filter((k) => Boolean(k))
            : [];
        const blockedKeywords = keywords.filter((kw) => {
            const record = keywordVerdicts.find((k) => k.keyword === kw);
            return record ? !record.wouldRunDiscovery : false;
        });
        return {
            domain,
            producedByKeywords: keywords,
            previousBusinessType: verdict?.previousBusinessType ?? null,
            previousEligibility: verdict?.previousEligibility ?? null,
            newProspectClass: verdict?.prospectClass ?? "UNKNOWN",
            newReason: verdict?.reason ?? null,
            newEvidence: verdict?.evidence ?? [],
            keywordsNowBlocked: blockedKeywords.length,
            keywordsTotal: keywords.length,
        };
    });
    const report = {
        milestone: "M9.3.1",
        mode: "PROSPECT_FIRST_HARDENING",
        generatedAt: new Date().toISOString(),
        archetypeVersion: IDEAL_PRODUCT_ARCHETYPES_VERSION,
        costs: { dataforseo: 0, anthropic: 0 },
        runWindow: RUN_WINDOW_START,
        summary: {
            rawDomains: domainVerdicts.length,
            prospectEligible: eligibleDomains.length,
            excluded: excludedDomains.length,
            excludedTooLatePreviously: lateExclusions.length,
            keywordsAnalyzed: keywordVerdicts.length,
            keywordsApprovedUnderNewLogic: approvedKeywords.length,
            keywordsRejectedUnderNewLogic: rejectedKeywords.length,
            specialistYieldPercent: domainVerdicts.length > 0
                ? Math.round((eligibleDomains.length / domainVerdicts.length) * 100)
                : 0,
        },
        costReview: {
            serpCostPerKeyword,
            totalSerpCost: Math.round(totalSerpCost * 1000) / 1000,
            wastedSerpCost: Math.round(wastedSerpCost * 1000) / 1000,
            wastedSharePercent: keywordVerdicts.length > 0
                ? Math.round((rejectedKeywords.length / keywordVerdicts.length) * 100)
                : 0,
            costPerUsefulProspect: costPerUsefulProspect === null ? null : Math.round(costPerUsefulProspect * 1000) / 1000,
            projectedCostPerUsefulProspect: projectedCostPerUsefulProspect === null
                ? null
                : Math.round(projectedCostPerUsefulProspect * 1000) / 1000,
        },
        branches: {
            budgetShares: normalizedBudgetShares(),
            stats: branchStats,
        },
        categories: categoryStats,
        keywords: keywordVerdicts,
        domains: [...domainVerdicts, ...poolDomainVerdicts],
        existingPool: {
            judged: poolDomainVerdicts.length,
            excluded: poolDomainVerdicts.filter((d) => !d.eligible).length,
        },
        rootCause,
        unmatchedKeywords: unmatchedKeywords.map((k) => k.keyword),
        regression: {
            total: fixtureResults.length,
            passed: fixtureResults.length - fixturesFailed.length,
            failed: fixturesFailed.length,
            results: fixtureResults,
        },
    };
    const reportPath = path.resolve(projectRoot, REPORT_RELATIVE_PATH);
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
    console.log("DOMAINS");
    console.log(`  raw: ${report.summary.rawDomains}`);
    console.log(`  prospect eligible: ${report.summary.prospectEligible}`);
    console.log(`  excluded: ${report.summary.excluded} (waarvan ${lateExclusions.length} eerder te laat)`);
    console.log("\nKEYWORDS");
    console.log(`  geanalyseerd: ${report.summary.keywordsAnalyzed}`);
    console.log(`  zou nu draaien: ${report.summary.keywordsApprovedUnderNewLogic}`);
    console.log(`  zou nu stoppen: ${report.summary.keywordsRejectedUnderNewLogic}`);
    console.log("\nSTATUS VERDELING");
    const statusCounts = new Map();
    for (const k of keywordVerdicts)
        statusCounts.set(k.status, (statusCounts.get(k.status) ?? 0) + 1);
    for (const [status, count] of [...statusCounts].sort((a, b) => b[1] - a[1])) {
        console.log(`  ${status}: ${count}`);
    }
    console.log("\nREGRESSION");
    console.log(`  ${report.regression.passed}/${report.regression.total} fixtures geslaagd`);
    for (const fail of fixturesFailed) {
        console.log(`  FAIL ${fail.domain}: verwacht ${fail.expectEligible ? "eligible" : fail.expectReason} kreeg ${fail.actualEligible ? "eligible" : fail.actualReason}`);
    }
    console.log(`\nRapport: ${REPORT_RELATIVE_PATH}`);
    if (fixturesFailed.length > 0) {
        process.exitCode = 1;
    }
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=hardenProspectDiscovery.js.map