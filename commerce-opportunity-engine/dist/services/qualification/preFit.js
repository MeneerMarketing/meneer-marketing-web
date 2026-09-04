import { PRE_FIT_PLATFORM_BONUS, PRE_FIT_WEIGHTS, CONTROLLED_SCALE_DEFAULTS, } from "../../config/controlledScale.js";
export function computePreFit(input) {
    if (input.manualExcluded) {
        return { score: 0, prequalified: false, reason: "manual_excluded" };
    }
    let score = PRE_FIT_WEIGHTS.base;
    const reasons = ["base"];
    if (input.isEcommerce) {
        score += PRE_FIT_WEIGHTS.ecommerceBonus;
        reasons.push("ecommerce");
    }
    const type = (input.businessType ?? "UNKNOWN").toUpperCase();
    if (type === "BRAND") {
        score += PRE_FIT_WEIGHTS.businessTypeBrand;
        reasons.push("brand");
    }
    else if (type === "SPECIALIST_WEBSHOP") {
        score += PRE_FIT_WEIGHTS.businessTypeSpecialist;
        reasons.push("specialist");
    }
    else if (type === "GENERAL_RETAILER" ||
        type === "MARKETPLACE" ||
        type === "COMPARISON_SITE") {
        score -= 40;
        reasons.push(`excluded_type:${type}`);
    }
    const platform = (input.platform ?? "UNKNOWN").toUpperCase();
    const platformBonus = PRE_FIT_PLATFORM_BONUS[platform] ?? 0;
    score += platformBonus;
    if (platformBonus > 0)
        reasons.push(`platform:${platform}`);
    if (input.maturity != null) {
        score += Math.round(input.maturity * PRE_FIT_WEIGHTS.maturityFactor);
    }
    if (input.retailerScale != null) {
        score -= Math.round(input.retailerScale * PRE_FIT_WEIGHTS.retailerScalePenaltyFactor);
    }
    if (input.confirmedAdvertiser || input.transparencyConfirmed) {
        score += PRE_FIT_WEIGHTS.paidConfirmationBonus;
        reasons.push("paid_confirmed");
    }
    score = Math.max(0, Math.min(100, Math.round(score)));
    const prequalified = input.isEcommerce &&
        (type === "BRAND" || type === "SPECIALIST_WEBSHOP") &&
        !input.manualExcluded &&
        (input.retailerScale ?? 0) <= CONTROLLED_SCALE_DEFAULTS.maxRetailerScaleForPrequalified &&
        (input.maturity ?? 0) >= CONTROLLED_SCALE_DEFAULTS.minMaturityForPrequalified;
    return {
        score,
        prequalified,
        reason: reasons.join(","),
    };
}
//# sourceMappingURL=preFit.js.map