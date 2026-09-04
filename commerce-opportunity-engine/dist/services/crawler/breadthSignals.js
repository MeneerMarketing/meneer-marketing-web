/**
 * Milestone 9.3.3 — international reach, category breadth and retailer breadth
 * as three separate measurements.
 *
 * The previous classifier collapsed them: a shop with many hreflang alternates
 * was called a mass retailer, which wrongly excluded international specialist
 * and DTC brands like CurrentBody. Selling in twenty countries says nothing
 * about how wide the assortment is.
 *
 * Only retailer breadth may drive a MASS_RETAILER verdict. International
 * presence feeds scale and maturity instead.
 */
/** Unrelated verticals. Hitting several means a department store assortment. */
const VERTICALS = [
    "elektronica",
    "baby",
    "voeding",
    "huishouden",
    "beauty",
    "mode",
    "tuin",
    "sport",
    "diy",
    "dieren",
    "meubel",
    "verzekering",
    "reis",
    "camping",
    "kampeer",
    "auto",
];
/** Language a chain uses about itself: branches, warehouses, national coverage. */
const CHAIN_LANGUAGE = /\b(filialen|vestigingen|warenhuis|hypermarkt|winkelketen|landelijke dekking|onze winkels|alle vestigingen)\b/i;
/** A wall of third-party brands is reseller behaviour, not an own-brand shop. */
const BRAND_WALL_LANGUAGE = /\b(alle merken|shop by brand|topmerken|a-merken|merken a-z)\b/i;
export const BREADTH_THRESHOLDS = {
    /** Verticals before an assortment counts as genuinely broad. */
    broadVerticals: 4,
    /** Verticals plus category links before it is chain territory. */
    chainVerticals: 5,
    chainCategoryLinks: 40,
    /** Retailer breadth needed for a MASS_RETAILER verdict from the website. */
    massRetailerBreadthScore: 70,
    /** Locale alternates before a shop counts as a full international operator. */
    internationalOperatorLocales: 12,
};
export function countVerticalBreadth(text) {
    let hits = 0;
    for (const vertical of VERTICALS) {
        // Word boundaries, otherwise "automatisch" counts as the auto vertical.
        if (new RegExp(`\\b${vertical}\\b`, "i").test(text))
            hits += 1;
    }
    return hits;
}
export function computeBreadthSignals(signals) {
    const evidence = [];
    const text = signals.bodyTextSample;
    const verticalHits = countVerticalBreadth(text);
    const localeAlternates = signals.localeAlternateCount ?? 0;
    const categoryLinks = signals.estimatedCategoryLinks;
    // International presence: reach only, deliberately blind to assortment.
    const internationalPresenceScore = Math.min(100, Math.round((localeAlternates / BREADTH_THRESHOLDS.internationalOperatorLocales) * 100));
    if (localeAlternates >= BREADTH_THRESHOLDS.internationalOperatorLocales) {
        evidence.push(`${localeAlternates} landversies: internationale schaal`);
    }
    // Category breadth: how many unrelated verticals the assortment spans.
    let categoryBreadthScore = Math.min(100, verticalHits * 18);
    if (categoryLinks >= BREADTH_THRESHOLDS.chainCategoryLinks) {
        categoryBreadthScore = Math.min(100, categoryBreadthScore + 15);
        evidence.push(`${categoryLinks} categorielinks`);
    }
    if (verticalHits >= BREADTH_THRESHOLDS.broadVerticals) {
        evidence.push(`${verticalHits} verschillende productverticals`);
    }
    // Retailer breadth: assortment width plus the behaviour of a chain.
    let retailerBreadthScore = categoryBreadthScore;
    if (CHAIN_LANGUAGE.test(text)) {
        retailerBreadthScore += 20;
        evidence.push("keten-taal over vestigingen of warenhuis");
    }
    if (signals.storeLocatorMentions >= 2) {
        retailerBreadthScore += 15;
        evidence.push("winkelzoeker met meerdere vestigingen");
    }
    if (BRAND_WALL_LANGUAGE.test(text)) {
        retailerBreadthScore += 10;
        evidence.push("merkenmuur van externe merken");
    }
    if (signals.brandNamesInText.length >= 12) {
        retailerBreadthScore += 10;
        evidence.push(`${signals.brandNamesInText.length} externe merknamen op de homepage`);
    }
    return {
        internationalPresenceScore,
        categoryBreadthScore,
        retailerBreadthScore: Math.min(100, retailerBreadthScore),
        verticalHits,
        localeAlternates,
        evidence,
    };
}
/**
 * A shop is only a mass retailer when the assortment is wide. International
 * reach is explicitly excluded here: that is the bug this milestone fixes.
 */
export function qualifiesAsMassRetailer(breadth) {
    return (breadth.retailerBreadthScore >= BREADTH_THRESHOLDS.massRetailerBreadthScore &&
        breadth.verticalHits >= BREADTH_THRESHOLDS.broadVerticals);
}
//# sourceMappingURL=breadthSignals.js.map