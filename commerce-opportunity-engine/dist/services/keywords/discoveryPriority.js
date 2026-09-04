import { DISCOVERY_PRIORITY_NEUTRAL, DISCOVERY_PRIORITY_WEIGHTS, RETAILER_RATIO_PENALTY, } from "../../config/controlledScale.js";
import { PAID_VERIFY_DEFAULTS } from "../../config/paidVerify.js";
export function scoreDiscoveryPriority(input) {
    const prospecting = clamp01to100(input.prospectingValue ?? 50);
    const quality = clamp01to100(input.keywordQuality ?? 50);
    const commercial = clamp01to100(input.commercialIntent ?? 50);
    const product = clamp01to100(input.productIntent ?? 50);
    const yieldScore = input.historicalYield === null || input.historicalYield === undefined
        ? DISCOVERY_PRIORITY_NEUTRAL.historicalYield
        : clamp01to100(input.historicalYield);
    let diversity = DISCOVERY_PRIORITY_NEUTRAL.advertiserDiversity;
    if (input.uniqueDomainsFound != null && input.uniqueDomainsFound > 0) {
        diversity = clamp01to100(30 + input.uniqueDomainsFound * 6);
    }
    const categoryRelevance = input.categoryRelevance === null || input.categoryRelevance === undefined
        ? 55
        : clamp01to100(input.categoryRelevance);
    let score = prospecting * DISCOVERY_PRIORITY_WEIGHTS.prospectingValue +
        quality * DISCOVERY_PRIORITY_WEIGHTS.keywordQuality +
        commercial * DISCOVERY_PRIORITY_WEIGHTS.commercialIntent +
        product * DISCOVERY_PRIORITY_WEIGHTS.productIntent +
        yieldScore * DISCOVERY_PRIORITY_WEIGHTS.historicalYield +
        diversity * DISCOVERY_PRIORITY_WEIGHTS.advertiserDiversity +
        categoryRelevance * DISCOVERY_PRIORITY_WEIGHTS.categoryRelevance;
    if (input.retailerRatio != null && input.retailerRatio > 0) {
        const ratio = Math.min(1, input.retailerRatio / RETAILER_RATIO_PENALTY.fullPenaltyAt);
        score -= ratio * RETAILER_RATIO_PENALTY.maxPenalty;
    }
    // Off-category keywords cannot stay PRIMARY scan priority even with prospecting 100.
    if (categoryRelevance < PAID_VERIFY_DEFAULTS.relevancePriorityCapBelow) {
        score = Math.min(score, PAID_VERIFY_DEFAULTS.discoveryPriorityCapWhenLowRelevance);
    }
    return {
        score: clamp01to100(score),
        breakdown: {
            prospecting,
            quality,
            commercial,
            product,
            yield: yieldScore,
            diversity,
            categoryRelevance,
            retailerRatio: input.retailerRatio ?? -1,
        },
    };
}
function clamp01to100(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
}
//# sourceMappingURL=discoveryPriority.js.map