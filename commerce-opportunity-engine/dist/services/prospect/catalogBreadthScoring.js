/**
 * Milestone 9.9.7 — catalog compactness, coherence, and business breadth scoring.
 */
function scoreCompactnessFromCount(size, verified) {
    if (size == null)
        return verified ? 42 : 35;
    if (size <= 10)
        return 88;
    if (size <= 30)
        return 96;
    if (size <= 50)
        return 90;
    if (size <= 80)
        return 74;
    if (size <= 120)
        return 52;
    if (size <= 200)
        return 30;
    return 14;
}
function scoreCoherence(input) {
    let score = 72;
    const evidence = [];
    if (input.categoryLinks <= 8) {
        score += 18;
        evidence.push("smalle navigatie");
    }
    else if (input.categoryLinks <= 15) {
        score += 8;
    }
    else if (input.categoryLinks <= 25) {
        score -= 8;
    }
    else {
        score -= 22;
        evidence.push("brede navigatie");
    }
    if (input.productFamilySpread <= 2)
        score += 14;
    else if (input.productFamilySpread <= 4)
        score += 4;
    else
        score -= 16;
    if (input.externalBrandBreadth >= 25)
        score -= 20;
    else if (input.externalBrandBreadth >= 10)
        score -= 10;
    if (input.catalogEstimate != null &&
        input.catalogEstimate >= 100 &&
        input.productFamilySpread >= 5) {
        score -= 12;
        evidence.push("grote catalogus verspreid over families");
    }
    return Math.max(0, Math.min(100, score));
}
/** HIGH = compact/focused boutique. LOW = broad webshop. */
export function computeBusinessBreadthScore(metrics) {
    const scalePenalty = (metrics.companyScaleFit ?? 50) >= 88 ? -8 : (metrics.companyScaleFit ?? 50) >= 78 ? -4 : 0;
    const categoryPenalty = metrics.categoryLinks >= 30 ? -18 : metrics.categoryLinks >= 20 ? -10 : 0;
    const sizePenalty = metrics.catalogEstimate != null && metrics.catalogEstimate >= 200
        ? -22
        : metrics.catalogEstimate != null && metrics.catalogEstimate >= 120
            ? -12
            : 0;
    const raw = metrics.catalogCompactnessScore * 0.45 +
        metrics.catalogCoherenceScore * 0.45 +
        10 +
        scalePenalty +
        categoryPenalty +
        sizePenalty;
    return Math.max(0, Math.min(100, Math.round(raw)));
}
export function computeCatalogBreadthMetrics(input) {
    const evidence = [];
    const externalBrandBreadth = input.externalBrandBreadth ?? 0;
    const categoryLinks = input.categoryLinks;
    const html = (input.homepageHtml ?? "").toLowerCase();
    let productFamilySpread = 2;
    const familyHints = [
        "handzeep",
        "shampoo",
        "stoel",
        "matras",
        "camping",
        "yoga",
        "serum",
        "cream",
        "deodorant",
        "kitchen",
        "outdoor",
    ];
    let familiesHit = 0;
    for (const hint of familyHints) {
        if (html.includes(hint))
            familiesHit += 1;
    }
    productFamilySpread = Math.max(1, Math.min(8, Math.round(categoryLinks / 4) + familiesHit));
    const catalogConfidence = input.catalogVerified
        ? input.catalogEstimate != null
            ? "MEASURED"
            : "INFERRED"
        : "UNKNOWN";
    const compactness = scoreCompactnessFromCount(input.catalogEstimate, input.catalogVerified);
    if (input.catalogEstimate != null) {
        evidence.push(`catalog_estimate_${input.catalogEstimate}`);
    }
    else if (!input.catalogVerified) {
        evidence.push("catalog_unverified");
    }
    const coherence = scoreCoherence({
        categoryLinks,
        productFamilySpread,
        externalBrandBreadth,
        catalogEstimate: input.catalogEstimate,
    });
    const navigationBreadth = Math.min(100, categoryLinks * 3);
    const categoryBreadth = Math.min(100, categoryLinks * 2 + Math.max(0, productFamilySpread - 2) * 8);
    const businessBreadthScore = computeBusinessBreadthScore({
        catalogCompactnessScore: compactness,
        catalogCoherenceScore: coherence,
        companyScaleFit: input.companyScaleFit,
        categoryLinks,
        catalogEstimate: input.catalogEstimate,
    });
    return {
        catalogEstimate: input.catalogEstimate,
        catalogConfidence,
        catalogCompactnessScore: compactness,
        catalogCoherenceScore: coherence,
        businessBreadthScore,
        categoryBreadth,
        externalBrandBreadth,
        navigationBreadth,
        productFamilySpread,
        evidence,
    };
}
//# sourceMappingURL=catalogBreadthScoring.js.map