/**
 * Milestone 9.3.4 — deterministic preselection of the new M9.3.3 prospects.
 *
 * Runs before any Claude call. Everything here comes from the cheap discovery
 * signals, so ranking sixteen prospects costs nothing. The goal is not to find
 * the worst page: it is to find a strong business whose page is the weak part.
 */
import { PRESELECTION_WEIGHTS, PRESELECTION_PENALTIES, PRESELECTION_THRESHOLDS, catalogSweetSpotScore, commerceModelFromOwnBrandSignal, HERO_URL_RULES, M934, } from "../../config/newProspectAudit.js";
function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
}
/**
 * Hero price maps to project value. Cheap commodities cannot carry the kind of
 * project we sell, very expensive products carry it easily.
 */
function heroValueScore(price) {
    if (price == null)
        return 40;
    if (price >= 400)
        return 100;
    if (price >= 200)
        return 92;
    if (price >= 100)
        return 82;
    if (price >= 50)
        return 66;
    if (price >= 25)
        return 48;
    return 22;
}
function platformFitScore(platform) {
    const value = (platform ?? "").toUpperCase();
    if (value.includes("SHOPIFY"))
        return 100;
    if (value.includes("WOO"))
        return 82;
    if (value.includes("LIGHTSPEED") || value.includes("CCV"))
        return 70;
    if (value.includes("MAGENTO"))
        return 55;
    if (!value || value === "UNKNOWN")
        return 45;
    return 60;
}
function adsEvidenceScore(record) {
    const keywords = record.googleAdsEvidence?.keywords?.length ?? 0;
    const landings = record.googleAdsEvidence?.landingUrls?.length ?? 0;
    return clamp(35 + keywords * 18 + landings * 12);
}
/**
 * A hero URL only counts when it points at an actual product page on the same
 * domain. The resolver falls back to the homepage, and auditing a homepage
 * would score the wrong page.
 */
export function isUsableHeroUrl(url, domain) {
    if (!url)
        return false;
    let parsed;
    try {
        parsed = new URL(url);
    }
    catch {
        return false;
    }
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const target = domain.replace(/^www\./, "").toLowerCase();
    if (!host.endsWith(target))
        return false;
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length < HERO_URL_RULES.minPathSegments)
        return false;
    const path = parsed.pathname.toLowerCase();
    if (HERO_URL_RULES.internalArtifactSlugTokens.some((token) => path.includes(token))) {
        return false;
    }
    return HERO_URL_RULES.productPathPatterns.some((pattern) => pattern.test(parsed.pathname));
}
export function scoreNewProspect(record) {
    const catalogBand = catalogSweetSpotScore(record.estimatedCatalogSize);
    const derivedCommerceModel = commerceModelFromOwnBrandSignal(record.ownBrandSignal);
    const components = {
        idealPreScore: record.idealProspectPreScore ?? 0,
        ownBrandSignal: record.ownBrandSignal ?? 40,
        catalogFocus: record.catalogFocusScore ?? 40,
        catalogSweetSpot: catalogBand.score,
        heroProductValue: heroValueScore(record.heroPrice),
        assetReadinessProxy: record.assetReadinessProxy ?? 0,
        deepDiveFitProxy: record.deepDivePdpFitProxy ?? 0,
        googleAdsEvidence: adsEvidenceScore(record),
        platformFit: platformFitScore(record.platform),
    };
    let score = 0;
    for (const [key, weight] of Object.entries(PRESELECTION_WEIGHTS)) {
        score += (components[key] ?? 0) * weight;
    }
    const penalties = [];
    if ((record.ownBrandSignal ?? 0) < PRESELECTION_THRESHOLDS.resellerOwnBrandLimit) {
        penalties.push({
            reason: `reseller-heavy (eigen merk ${record.ownBrandSignal ?? 0})`,
            points: PRESELECTION_PENALTIES.resellerHeavy,
        });
    }
    if ((record.estimatedCatalogSize ?? 0) > PRESELECTION_THRESHOLDS.largeCatalogSize) {
        penalties.push({
            reason: `catalogus te groot (${record.estimatedCatalogSize})`,
            points: PRESELECTION_PENALTIES.largeCatalog,
        });
    }
    if ((record.assetReadinessProxy ?? 0) < PRESELECTION_THRESHOLDS.weakAssetReadiness) {
        penalties.push({
            reason: `te weinig materiaal (asset readiness ${record.assetReadinessProxy ?? 0})`,
            points: PRESELECTION_PENALTIES.weakAssets,
        });
    }
    if (record.heroPrice != null &&
        record.heroPrice < PRESELECTION_THRESHOLDS.lowProductValuePrice) {
        penalties.push({
            reason: `lage productwaarde (€${record.heroPrice})`,
            points: PRESELECTION_PENALTIES.lowProductValue,
        });
    }
    if ((record.retailerBreadthScore ?? 0) > PRESELECTION_THRESHOLDS.retailerBreadthLimit) {
        penalties.push({
            reason: `ketengedrag (retailer breadth ${record.retailerBreadthScore})`,
            points: PRESELECTION_PENALTIES.retailerBreadth,
        });
    }
    if (!record.catalogVerified) {
        penalties.push({
            reason: "catalogus niet geverifieerd",
            points: PRESELECTION_PENALTIES.unverifiedCatalog,
        });
    }
    const penaltyTotal = penalties.reduce((sum, entry) => sum + entry.points, 0);
    const final = clamp(Math.round(score - penaltyTotal));
    const reasons = [];
    reasons.push(`pre-score ${record.idealProspectPreScore ?? "?"}`);
    reasons.push(`${derivedCommerceModel.toLowerCase().replace(/_/g, " ")}`);
    reasons.push(`catalogus ${record.estimatedCatalogSize ?? "?"} (${catalogBand.label})`);
    if (record.heroProduct) {
        reasons.push(`hero ${record.heroProduct}${record.heroPrice != null ? ` €${record.heroPrice}` : ""}`);
    }
    reasons.push(`assets ${record.assetReadinessProxy ?? "?"}`);
    reasons.push(`deep-dive ${record.deepDivePdpFitProxy ?? "?"}`);
    return {
        score: final,
        components,
        penalties,
        reasons,
        derivedCommerceModel,
        catalogBandLabel: catalogBand.label,
    };
}
/**
 * Ranking only. Hero resolution and the audit limit decide which of these
 * actually reach Claude, so that a skip is backed by a real resolution attempt
 * instead of a missing field in the report.
 */
export function preselectNewProspects(records) {
    return records
        .map((record) => {
        const scoring = scoreNewProspect(record);
        const excluded = M934.excludedFromDesignTarget.includes(record.domain);
        return {
            record,
            rank: 0,
            preselectionScore: scoring.score,
            components: scoring.components,
            penalties: scoring.penalties,
            reasons: scoring.reasons,
            derivedCommerceModel: scoring.derivedCommerceModel,
            catalogBandLabel: scoring.catalogBandLabel,
            heroUrlFromReport: isUsableHeroUrl(record.heroProductUrl, record.domain),
            excluded,
            selected: false,
            skipReason: excluded ? "engineering fixture, geen design target" : null,
        };
    })
        .sort((a, b) => b.preselectionScore - a.preselectionScore)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
}
//# sourceMappingURL=newProspectPreselection.js.map