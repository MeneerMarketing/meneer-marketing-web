/**
 * Milestone 9.8 — raw_pdp_redesign_opportunity (gap-only, no business weighting).
 */
function clamp(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
}
export function computeAssetQualityProxy(input) {
    let score = 30;
    if (input.imageCount >= 6)
        score += 28;
    else if (input.imageCount >= 3)
        score += 16;
    else if (input.imageCount >= 1)
        score += 6;
    if (input.videoPresent)
        score += 14;
    if (input.featuresPresent)
        score += 10;
    if (input.faqPresent)
        score += 8;
    return clamp(score);
}
export function computeBrandDistinctivenessProxy(input) {
    const presentation = input.contentPresentationQuality ?? 55;
    let genericPenalty = 0;
    if (input.listOnlyBlocks >= 4 && input.styledBlocks <= 2) {
        genericPenalty = 18;
    }
    else if (input.listOnlyBlocks >= 2 && input.styledBlocks <= 1) {
        genericPenalty = 10;
    }
    const distinctiveness = clamp(72 - presentation * 0.45 - genericPenalty);
    return distinctiveness;
}
export function computeRawPdpRedesignOpportunity(input) {
    const evidence = [];
    const visual = input.preauditVisualGap ?? 42;
    const purchase = input.preauditPurchaseGap ?? 42;
    const mobile = input.mobileGap ?? 42;
    const available = input.contentAvailableScore ?? 45;
    const presentation = input.contentPresentationQuality ?? 55;
    const assets = input.assetQualityProxy ?? 45;
    const distinctiveness = input.brandDistinctivenessProxy ?? 50;
    let materialBoost = 0;
    const materialSweetSpot = available >= 62 && presentation <= 52;
    if (materialSweetSpot) {
        materialBoost += 16;
        evidence.push("material_sweet_spot_high_available_low_presentation");
    }
    else if (available >= 55 && presentation <= 45) {
        materialBoost += 10;
        evidence.push("moderate_material_sweet_spot");
    }
    if (assets >= 70 && presentation <= 55) {
        materialBoost += 8;
        evidence.push("assets_underused");
    }
    if (presentation >= 72) {
        materialBoost -= 18;
        evidence.push("premium_presentation_penalty");
    }
    else if (presentation >= 62) {
        materialBoost -= 8;
        evidence.push("decent_presentation_penalty");
    }
    if (available < 35 && assets < 40) {
        materialBoost -= 14;
        evidence.push("thin_shop_penalty");
    }
    const raw = visual * 0.32 +
        purchase * 0.28 +
        mobile * 0.18 +
        distinctiveness * 0.08 +
        assets * 0.06 +
        materialBoost;
    return {
        score: clamp(raw),
        evidence,
        materialSweetSpot,
    };
}
//# sourceMappingURL=rawPdpRedesignOpportunity.js.map