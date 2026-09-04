import { CONFIRMED_TARGET_RANK_WEIGHTS, TARGET_PRIORITY_WEIGHTS, VERIFICATION_RANK_WEIGHTS, } from "../../config/paidVerify.js";
import { PRE_FIT_PLATFORM_BONUS } from "../../config/controlledScale.js";
export function scoreVerificationPriority(input) {
    const w = VERIFICATION_RANK_WEIGHTS;
    let score = (input.preFit ?? 50) * w.preFit +
        (input.maturity ?? 40) * w.maturity +
        (input.avgProspecting ?? 50) * w.avgProspecting +
        (input.avgCategoryRelevance ?? 50) * w.avgCategoryRelevance +
        input.intelligenceCompleteness * w.intelligenceCompleteness +
        input.uniqueSourceKeywords * w.sourceKeywordCount;
    const type = (input.businessType ?? "").toUpperCase();
    if (type === "BRAND")
        score += w.brandTypeBonus;
    else if (type === "SPECIALIST_WEBSHOP")
        score += w.specialistTypeBonus;
    const platform = (input.platform ?? "").toUpperCase();
    if (platform === "SHOPIFY")
        score += w.shopifyBonus;
    else
        score += PRE_FIT_PLATFORM_BONUS[platform] ?? 0;
    score -= (input.retailerScale ?? 0) * w.retailerScalePenalty;
    return Math.max(0, Math.min(100, Math.round(score)));
}
export function rankPrequalifiedForTransparency(items) {
    return items
        .map((item) => ({
        ...item,
        verificationPriorityScore: scoreVerificationPriority(item),
    }))
        .sort((a, b) => b.verificationPriorityScore - a.verificationPriorityScore);
}
export function scoreConfirmedForTargetResolution(input) {
    const w = CONFIRMED_TARGET_RANK_WEIGHTS;
    let score = (input.preFit ?? 50) * w.preFit +
        (input.maturity ?? 40) * w.maturity +
        (input.avgProspecting ?? 50) * w.avgProspecting +
        input.uniqueSourceKeywords * w.sourceKeywordCount;
    if ((input.platform ?? "").toUpperCase() === "SHOPIFY")
        score += w.shopifyBonus;
    if (input.nonBrandedSourceCount > 0)
        score += w.nonBrandedBonus;
    score -= (input.retailerScale ?? 0) * w.retailerScalePenalty;
    return Math.max(0, Math.min(100, Math.round(score)));
}
export function scoreTargetPriority(input) {
    const w = TARGET_PRIORITY_WEIGHTS;
    let score = (input.sourceQuality ?? 50) * w.sourceQuality +
        (input.brandPreFit ?? 50) * w.brandPreFit +
        (input.maturity ?? 40) * w.maturity +
        (input.keywordProspecting ?? 50) * w.keywordProspecting +
        (input.productSignals ?? 50) * w.productSignals +
        (input.targetConfidence ?? 50) * w.targetConfidence;
    if ((input.platform ?? "").toUpperCase() === "SHOPIFY")
        score += w.shopifyBonus;
    if (input.isNonBranded)
        score += w.nonBrandedBonus;
    return Math.max(0, Math.min(100, Math.round(score)));
}
export function computeIntelligenceCompleteness(input) {
    let score = 20;
    if (input.lastCrawledAt)
        score += 25;
    if (input.platform && input.platform !== "UNKNOWN")
        score += 20;
    if (input.maturity != null)
        score += 15;
    if (input.isEcommerce)
        score += 10;
    if (input.businessType)
        score += 10;
    if (input.retailerScale != null)
        score += 5;
    return Math.max(0, Math.min(100, score));
}
//# sourceMappingURL=verificationRanking.js.map