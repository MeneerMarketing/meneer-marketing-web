/**
 * Retailer scale score: high = too large / general for ideal lead pool.
 * Independent from business maturity.
 */
export function computeRetailerScaleScore(input) {
    const signals = mergeForScale(input.signals, input.secondarySignals ?? []);
    let score = 0;
    const categories = signals.estimatedCategoryLinks;
    const products = signals.estimatedProductLinks;
    if (categories >= 80)
        score += 35;
    else if (categories >= 40)
        score += 25;
    else if (categories >= 20)
        score += 15;
    else if (categories >= 10)
        score += 8;
    if (products >= 100)
        score += 20;
    else if (products >= 40)
        score += 12;
    else if (products >= 20)
        score += 6;
    if (signals.storeLocatorMentions >= 2)
        score += 20;
    else if (signals.storeLocatorMentions >= 1)
        score += 10;
    if (signals.sellerMentions >= 2)
        score += 15;
    if (signals.compareMentions >= 2)
        score += 10;
    if (signals.insuranceServiceMentions >= 2)
        score += 15;
    // Broad vertical hints in body text
    const verticalHits = countVerticalBreadth(signals.bodyTextSample);
    if (verticalHits >= 4)
        score += 20;
    else if (verticalHits >= 3)
        score += 12;
    else if (verticalHits >= 2)
        score += 6;
    // Large outdoor / camping warehouse profile
    const titleMeta = `${signals.title ?? ""} ${signals.metaDescription ?? ""}`.toLowerCase();
    if (/kampeerwinkel|campingwinkel|outdoorwinkel/i.test(titleMeta)) {
        score += 40;
    }
    else if (/(kampeer|camping)/i.test(signals.bodyTextSample) &&
        /(grootste|europa|assortiment|filiaal|vestiging)/i.test(signals.bodyTextSample)) {
        score += 35;
    }
    if (/filialen|vestigingen|store locator|winkel zoeken/i.test(signals.bodyTextSample + titleMeta)) {
        score += 15;
    }
    if (input.businessType === "GENERAL_RETAILER")
        score += 15;
    if (input.businessType === "MARKETPLACE")
        score += 20;
    if (input.businessType === "SERVICE_BUSINESS")
        score += 10;
    return Math.min(100, Math.max(0, Math.round(score)));
}
function mergeForScale(primary, secondary) {
    if (secondary.length === 0) {
        return primary;
    }
    return {
        ...primary,
        estimatedProductLinks: primary.estimatedProductLinks +
            secondary.reduce((s, p) => s + p.estimatedProductLinks, 0),
        estimatedCategoryLinks: Math.max(primary.estimatedCategoryLinks, ...secondary.map((p) => p.estimatedCategoryLinks)),
        storeLocatorMentions: Math.max(primary.storeLocatorMentions, ...secondary.map((p) => p.storeLocatorMentions)),
        sellerMentions: Math.max(primary.sellerMentions, ...secondary.map((p) => p.sellerMentions)),
        compareMentions: Math.max(primary.compareMentions, ...secondary.map((p) => p.compareMentions)),
        insuranceServiceMentions: Math.max(primary.insuranceServiceMentions, ...secondary.map((p) => p.insuranceServiceMentions)),
        bodyTextSample: [primary.bodyTextSample, ...secondary.map((p) => p.bodyTextSample)]
            .join(" ")
            .slice(0, 12000),
    };
}
function countVerticalBreadth(text) {
    const verticals = [
        "elektronica",
        "electronics",
        "baby",
        "voeding",
        "food",
        "huishouden",
        "household",
        "beauty",
        "mode",
        "fashion",
        "tuin",
        "sport",
        "diy",
        "klussen",
        "dieren",
        "pet",
        "woning",
        "meubel",
        "verzekering",
        "reis",
        "travel",
        "camping",
        "kampeer",
    ];
    let hits = 0;
    for (const vertical of verticals) {
        if (text.includes(vertical)) {
            hits += 1;
        }
    }
    return hits;
}
//# sourceMappingURL=retailerScaleScorer.js.map