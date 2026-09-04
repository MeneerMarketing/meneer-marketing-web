/**
 * Milestone 9.4 — high_ticket_focused_fit_score.
 *
 * One number for the question the whole milestone asks: is this a small or
 * mid-sized brand with a product worth explaining, and a page that does not
 * explain it yet?
 *
 * Every input comes from cheap discovery signals. No Claude, no audit.
 */
import { HIGH_TICKET_FIT_WEIGHTS, HIGH_TICKET_PENALTIES, HIGH_TICKET_THRESHOLDS, catalogBandFor, priceBandFor, } from "../../config/highTicketProspect.js";
function clamp(value) {
    return Math.max(0, Math.min(100, Math.round(value)));
}
export function computeHighTicketFocusedFit(input) {
    const evidence = [];
    const penalties = [];
    const price = priceBandFor(input.heroPrice);
    const catalog = catalogBandFor(input.estimatedCatalogSize);
    const ownBrand = input.ownBrandSignal ?? 40;
    const assets = input.assetReadinessProxy ?? 45;
    const deepDive = input.deepDivePdpFitProxy ?? 55;
    const weakness = input.pdpWeaknessProxy ?? 50;
    const hero = input.heroScore ?? 35;
    const components = {
        productValue: price.score * HIGH_TICKET_FIT_WEIGHTS.productValue,
        heroProminence: hero * HIGH_TICKET_FIT_WEIGHTS.heroProminence,
        catalogCompactness: catalog.score * HIGH_TICKET_FIT_WEIGHTS.catalogCompactness,
        ownBrand: ownBrand * HIGH_TICKET_FIT_WEIGHTS.ownBrand,
        companyScaleFit: input.companyScaleFitScore * HIGH_TICKET_FIT_WEIGHTS.companyScaleFit,
        assetReadiness: assets * HIGH_TICKET_FIT_WEIGHTS.assetReadiness,
        deepDiveFit: deepDive * HIGH_TICKET_FIT_WEIGHTS.deepDiveFit,
        currentPdpWeakness: weakness * HIGH_TICKET_FIT_WEIGHTS.currentPdpWeakness,
    };
    let score = Object.values(components).reduce((sum, value) => sum + value, 0);
    if (input.heroPrice != null && input.heroPrice >= HIGH_TICKET_THRESHOLDS.preferredMinHeroPrice) {
        evidence.push(`heroproduct ${Math.round(input.heroPrice)} euro: ${price.label}`);
    }
    if (ownBrand >= HIGH_TICKET_THRESHOLDS.minOwnBrandSignal) {
        evidence.push(`eigen-merksignaal ${ownBrand}`);
    }
    if (input.estimatedCatalogSize != null && input.estimatedCatalogSize <= 50) {
        evidence.push(`${input.estimatedCatalogSize} producten: ${catalog.label}`);
    }
    if (input.adKeywordCount > 0) {
        evidence.push(`betaalde plaatsingen op ${input.adKeywordCount} zoekopdracht(en)`);
    }
    const addPenalty = (reason, points) => {
        penalties.push({ reason, points });
        score -= points;
    };
    const cls = input.prospectClass.toUpperCase();
    const type = (input.businessType ?? "").toUpperCase();
    if (cls === "MASS_RETAILER" ||
        cls === "MARKETPLACE" ||
        cls === "COMPARISON_SITE" ||
        type === "GENERAL_RETAILER") {
        addPenalty(`retailer of platform (${cls})`, HIGH_TICKET_PENALTIES.massRetailer);
    }
    if ((input.estimatedCatalogSize ?? 0) > 200) {
        addPenalty(`catalogus ${input.estimatedCatalogSize} producten`, HIGH_TICKET_PENALTIES.largeCatalog);
    }
    if (ownBrand < HIGH_TICKET_THRESHOLDS.minOwnBrandSignal) {
        addPenalty(`eigen-merksignaal ${ownBrand}: verkoopt vooral andermans merken`, HIGH_TICKET_PENALTIES.resellerHeavy);
    }
    if (input.heroPrice != null && input.heroPrice < HIGH_TICKET_THRESHOLDS.hopelessHeroPrice) {
        addPenalty(`heroprijs ${Math.round(input.heroPrice)} euro`, HIGH_TICKET_PENALTIES.commodityPrice);
    }
    // A page that already leaves little on the table is a bad design case, no
    // matter how attractive the business looks.
    if (input.pdpWeaknessProxy != null && input.pdpWeaknessProxy <= 35) {
        addPenalty(`huidige PDP al sterk (weakness ${input.pdpWeaknessProxy})`, HIGH_TICKET_PENALTIES.alreadyPolishedPdp);
    }
    if (input.businessMaturityScore != null && input.businessMaturityScore < 30) {
        addPenalty(`volwassenheid ${input.businessMaturityScore}`, HIGH_TICKET_PENALTIES.weakBusiness);
    }
    if (!input.catalogVerified) {
        addPenalty("catalogusomvang niet geverifieerd", HIGH_TICKET_PENALTIES.unverifiedCatalog);
    }
    if (input.adKeywordCount === 0) {
        addPenalty("geen advertentiebewijs", HIGH_TICKET_PENALTIES.noAdsEvidence);
    }
    const highTicketFocusedFitScore = clamp(score);
    return {
        highTicketFocusedFitScore,
        priceBand: price.band,
        priceBandLabel: price.label,
        catalogBandLabel: catalog.label,
        isSeriousCandidate: highTicketFocusedFitScore >= HIGH_TICKET_THRESHOLDS.seriousCandidate,
        components: Object.fromEntries(Object.entries(components).map(([key, value]) => [key, Math.round(value * 10) / 10])),
        penalties,
        evidence,
    };
}
//# sourceMappingURL=highTicketFocusedFit.js.map