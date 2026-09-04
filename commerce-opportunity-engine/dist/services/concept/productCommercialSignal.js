/**
 * Milestone 9 — product commercial signal (not revenue). Observable signals only.
 */
export function scoreProductCommercialSignal(input) {
    const evidence = [];
    let score = 20;
    if (input.price != null) {
        if (input.price >= 75 && input.price <= 500) {
            score += 22;
            evidence.push("price_band_strong_for_deep_pdp");
        }
        else if (input.price >= 30 && input.price < 75) {
            score += 12;
            evidence.push("price_band_moderate");
        }
        else if (input.price > 500) {
            score += 16;
            evidence.push("price_premium");
        }
        else {
            score += 4;
            evidence.push("price_low_still_allowed");
        }
    }
    else {
        evidence.push("price_unknown");
    }
    if (input.reviewCount != null && input.reviewCount > 0) {
        score += Math.min(18, 5 + Math.log10(input.reviewCount + 1) * 7);
        evidence.push(`reviews:${input.reviewCount}`);
    }
    if (input.rating != null && input.rating >= 3.8) {
        score += 6;
        evidence.push(`rating:${input.rating}`);
    }
    if (input.paidOrDiscoveryRelevant) {
        score += 12;
        evidence.push("paid_or_discovery_relevance");
    }
    if (input.heroProminenceScore != null) {
        score += Math.round(input.heroProminenceScore * 0.12);
    }
    if (input.availability && /in.?stock|op voorraad|available/i.test(input.availability)) {
        score += 4;
        evidence.push("in_stock");
    }
    if (input.descriptionLength >= 200) {
        score += 6;
        evidence.push("detail_richness");
    }
    else if (input.descriptionLength >= 80) {
        score += 3;
    }
    if (input.variantCountEstimate != null && input.variantCountEstimate >= 2) {
        score += 4;
        evidence.push(`variants:${input.variantCountEstimate}`);
    }
    if (input.purchaseIntentKeyword) {
        score += 8;
        evidence.push("purchase_intent_keyword");
    }
    return {
        product_commercial_signal_score: Math.max(0, Math.min(100, Math.round(score))),
        evidence,
    };
}
//# sourceMappingURL=productCommercialSignal.js.map