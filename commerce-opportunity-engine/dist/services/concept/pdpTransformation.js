/**
 * Milestone 9 — PDP transformation potential.
 * NOT simply 100 - CRO quality. Needs room to improve + product/asset fit.
 */
export function scorePdpTransformationPotential(input) {
    const evidence = [];
    let score = 40;
    // Strong existing PDP: use presentation/storytelling average when available
    if (input.croQualityScore != null) {
        if (input.croQualityScore <= 45) {
            score += 22;
            evidence.push("cro_quality_low_room_to_improve");
        }
        else if (input.croQualityScore <= 60) {
            score += 14;
            evidence.push("cro_quality_moderate");
        }
        else if (input.croQualityScore <= 72) {
            score += 4;
            evidence.push("cro_quality_decent_limited_delta");
        }
        else if (input.croQualityScore <= 82) {
            score -= 22;
            evidence.push("cro_already_strong_less_transform_need");
        }
        else {
            score -= 30;
            evidence.push("cro_exceptional_minimal_transform_need");
        }
    }
    else {
        evidence.push("cro_quality_unknown");
        score += 2;
    }
    score += Math.min(14, input.leakCount * 3);
    if (input.leakCount > 0)
        evidence.push(`supported_leaks:${input.leakCount}`);
    score -= Math.min(10, input.strengthCount * 2);
    // Positive: good product + assets
    score += Math.round(input.productCommercialSignal * 0.12);
    score += Math.round(input.assetReadiness * 0.1);
    score += Math.round(input.catalogFocus * 0.05);
    if (input.storytellingWeak === true) {
        score += 8;
        evidence.push("weak_storytelling");
    }
    if (input.aboveFoldWeak === true) {
        score += 7;
        evidence.push("weak_above_fold");
    }
    if (input.trustNearBuyblockWeak === true) {
        score += 6;
        evidence.push("weak_buyblock_trust");
    }
    if (input.deepDiveWeak === true) {
        score += 6;
        evidence.push("weak_deep_dive");
    }
    // Negatives
    if (input.siteTechnicallyBroken) {
        score -= 25;
        evidence.push("technically_broken");
    }
    const model = input.brandCommerceModel;
    if (model === "MARKETPLACE" || model === "GENERAL_RESELLER") {
        score -= 18;
        evidence.push("marketplace_or_general_reseller_penalty");
    }
    if ((input.retailerScaleScore ?? 0) >= 70) {
        score -= 12;
        evidence.push("high_retailer_scale");
    }
    if ((input.mmFitScore ?? 50) < 35) {
        score -= 15;
        evidence.push("low_project_fit");
    }
    if (input.productCommercialSignal < 30) {
        score -= 12;
        evidence.push("weak_commercial_product_signal");
    }
    if (input.assetReadiness < 35) {
        score -= 14;
        evidence.push("insufficient_assets_for_premium_concept");
    }
    return {
        pdp_transformation_potential: Math.max(0, Math.min(100, Math.round(score))),
        evidence,
    };
}
//# sourceMappingURL=pdpTransformation.js.map