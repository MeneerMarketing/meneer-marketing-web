/**
 * Milestone 9.3.3 — deterministic prospect pre-scoring.
 *
 * Answers "is this worth a paid CRO audit?" from signals we already collected.
 * No Claude, no guessing: every component traces back to something observed on
 * the site or in the ad landscape.
 */
import { PRE_SCORE_WEIGHTS, STRONG_PROSPECT_THRESHOLD, TARGET_PROFILE, } from "../../config/productionDiscovery.js";
import { ARCHETYPE_BY_ID } from "../../config/idealProductArchetypes.js";
function clamp(value) {
    return Math.max(0, Math.min(100, Math.round(value)));
}
/**
 * How well the product type carries a long, explanatory PDP. Comes from the
 * archetype traits, tempered by how focused this particular shop is: a great
 * product category inside a sprawling catalog still has no hero to build on.
 */
export function computeDeepDivePdpFitProxy(input) {
    const archetype = ARCHETYPE_BY_ID.get(input.archetypeId);
    if (!archetype)
        return 0;
    const { deepDive, commodity } = archetype;
    const upside = deepDive.highConsideration * 0.25 +
        deepDive.featureRich * 0.2 +
        deepDive.visualStorytelling * 0.15 +
        deepDive.heroProductPotential * 0.2 +
        deepDive.premiumPrice * 0.1 +
        deepDive.brandDifferentiation * 0.1;
    const drag = commodity.commodity * 0.3 +
        commodity.priceOnlyCompetition * 0.25 +
        commodity.simpleStandardized * 0.25 +
        commodity.marketplaceDominated * 0.2;
    const base = upside - drag * 0.4;
    const focusFactor = 0.7 + (input.catalogFocusScore / 100) * 0.3;
    const heroBonus = input.heroScore !== null ? (input.heroScore / 100) * 8 : 0;
    return clamp(base * focusFactor + heroBonus);
}
export function computeProspectPreScore(input) {
    const evidence = [];
    const deepDivePdpFitProxy = computeDeepDivePdpFitProxy({
        archetypeId: input.archetypeId,
        catalogFocusScore: input.catalogFocusScore,
        heroScore: input.heroScore,
    });
    const ownBrand = input.ownBrandSignal ?? 40;
    if (ownBrand >= TARGET_PROFILE.minOwnBrandSignal) {
        evidence.push(`eigen-merk signaal ${ownBrand}`);
    }
    const platformFit = input.platform
        ? TARGET_PROFILE.preferredPlatforms.includes(input.platform)
            ? 100
            : input.platform === "UNKNOWN"
                ? 45
                : 60
        : 45;
    if (platformFit === 100)
        evidence.push(`${input.platform}: goed te verbouwen platform`);
    // Weakness is opportunity: a PDP that already converts well needs us less.
    const pdpWeakness = input.pdpWeaknessScore ?? 50;
    if (pdpWeakness >= 65)
        evidence.push("huidige PDP laat veel liggen");
    const heroStrength = input.heroScore ?? 35;
    if (heroStrength >= 60)
        evidence.push("duidelijk heroproduct gevonden");
    const catalogSize = input.estimatedCatalogSize;
    if (catalogSize !== null &&
        catalogSize >= TARGET_PROFILE.catalogSweetSpotMin &&
        catalogSize <= TARGET_PROFILE.catalogSweetSpotMax) {
        evidence.push(`${catalogSize} producten: precies de sweet spot`);
    }
    const components = {
        catalogFocus: input.catalogFocusScore * PRE_SCORE_WEIGHTS.catalogFocus,
        ownBrand: ownBrand * PRE_SCORE_WEIGHTS.ownBrand,
        deepDiveFit: deepDivePdpFitProxy * PRE_SCORE_WEIGHTS.deepDiveFit,
        pdpWeakness: pdpWeakness * PRE_SCORE_WEIGHTS.pdpWeakness,
        heroStrength: heroStrength * PRE_SCORE_WEIGHTS.heroStrength,
        platformFit: platformFit * PRE_SCORE_WEIGHTS.platformFit,
    };
    let score = Object.values(components).reduce((sum, value) => sum + value, 0);
    // A business too immature to buy is not a prospect, however nice the site is.
    const maturity = input.businessMaturityScore;
    if (maturity !== null && maturity < TARGET_PROFILE.minBusinessMaturity) {
        score -= 12;
        evidence.push(`business maturity ${maturity} onder de ondergrens`);
    }
    // Chain behaviour costs points even below the mass-retail threshold: a shop
    // with branches and a wide range has no single hero to build a story on.
    const breadth = input.retailerBreadthScore;
    if (breadth !== null && breadth >= 45) {
        score -= Math.min(20, Math.round((breadth - 45) / 2));
        evidence.push(`assortimentsbreedte ${breadth}: eerder retailer dan merk`);
    }
    // Unverified catalogs do not get the benefit of the doubt.
    if (!input.catalogVerified) {
        score -= 10;
        evidence.push("catalogusomvang niet geverifieerd");
    }
    const idealProspectPreScore = clamp(score);
    return {
        idealProspectPreScore,
        deepDivePdpFitProxy,
        isStrongProspect: idealProspectPreScore >= STRONG_PROSPECT_THRESHOLD,
        components: Object.fromEntries(Object.entries(components).map(([key, value]) => [key, Math.round(value * 10) / 10])),
        evidence,
    };
}
//# sourceMappingURL=prospectPreScore.js.map