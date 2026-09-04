/**
 * Milestone 9.4.1 — concept_asset_feasibility.
 *
 * Can we rebuild a premium PDP from what is actually on the site, without
 * inventing claims or imagery? Counts observed material, not promises.
 */
function clamp(value) {
    return Math.max(0, Math.min(100, Math.round(value)));
}
export function computeConceptAssetFeasibility(input) {
    const rep = input.representation;
    const evidence = [];
    const mediaCount = rep?.aboveTheFold?.productMedia?.length ?? 0;
    const benefits = (rep?.page?.benefits?.length ?? 0) > 0;
    const features = (rep?.page?.features?.length ?? 0) > 0;
    const faq = (rep?.page?.faq?.length ?? 0) > 0;
    const shipping = Boolean(rep?.page?.shipping || rep?.page?.returns);
    const ugc = (rep?.page?.ugc?.length ?? 0) > 0;
    const beforeAfter = (rep?.page?.beforeAfter?.length ?? 0) > 0;
    const hasTitle = Boolean(rep?.aboveTheFold?.productTitle);
    const hasPrice = (rep?.aboveTheFold?.price ?? 0) > 0;
    const mediaQuality = input.conceptSignals?.media_usage_quality ?? null;
    const inventory = {
        packshots: mediaCount >= 2,
        lifestyle: ugc || beforeAfter || (mediaQuality ?? 0) >= 55,
        detailImagery: mediaCount >= 4 || features,
        technologyImagery: features || (input.conceptSignals?.deep_dive_quality ?? 0) >= 50,
        video: false,
        reviewsProof: (input.reviewCount ?? 0) > 0,
        specifications: features,
        benefits: benefits,
        faq: faq,
        brandIdentity: hasTitle && hasPrice,
    };
    let score = 0;
    const weights = [
        { key: "packshots", points: 14, label: "packshots" },
        { key: "lifestyle", points: 12, label: "lifestyle of gebruikbeeld" },
        { key: "detailImagery", points: 10, label: "detailbeelden" },
        { key: "technologyImagery", points: 10, label: "techniek/spec visuals" },
        { key: "video", points: 8, label: "video" },
        { key: "reviewsProof", points: 12, label: "reviews als proof" },
        { key: "specifications", points: 10, label: "specificaties" },
        { key: "benefits", points: 10, label: "benefits" },
        { key: "faq", points: 6, label: "FAQ" },
        { key: "brandIdentity", points: 8, label: "merk en prijs zichtbaar" },
    ];
    for (const item of weights) {
        if (inventory[item.key]) {
            score += item.points;
            evidence.push(item.label);
        }
    }
    if (shipping) {
        score += 4;
        evidence.push("levering/retour info");
    }
    if (input.assetReadinessScore != null && input.assetReadinessScore >= 70) {
        score = Math.max(score, input.assetReadinessScore - 8);
        evidence.push(`asset readiness score ${input.assetReadinessScore}`);
    }
    return {
        conceptAssetFeasibility: clamp(score),
        inventory,
        evidence,
    };
}
//# sourceMappingURL=conceptAssetFeasibility.js.map