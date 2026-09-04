/**
 * Milestone 9.5.1 — normalized hero target fields for reports and scoring audit.
 */
export function heroProductIdFromUrl(url) {
    if (!url)
        return null;
    const match = url.match(/\/products\/([^/?#]+)/i);
    return match?.[1] ?? null;
}
export function heroPriceConfidenceFromSource(source, price) {
    if (price == null || !Number.isFinite(price))
        return "UNKNOWN";
    if (source === "paid_landing")
        return "HIGH";
    if (source === "shopping_ad")
        return "MEDIUM";
    if (source === "landing_linked_product" || source === "catalog_flagship")
        return "MEDIUM";
    if (source === "homepage_prominent")
        return "LOW";
    return "UNKNOWN";
}
export function buildHeroTargetRecord(input) {
    const hero = input.hero;
    const source = input.resolutionSource ?? hero?.source ?? "unknown";
    const url = hero?.url ?? null;
    return {
        heroProductId: heroProductIdFromUrl(url),
        heroProductUrl: url,
        heroTitle: hero?.title ?? null,
        heroPrice: hero?.price ?? null,
        heroCurrency: hero?.currency ?? null,
        heroScore: hero?.heroScore ?? null,
        heroConfidence: hero?.heroConfidence ?? null,
        heroPriceConfidence: heroPriceConfidenceFromSource(source, hero?.price ?? null),
        heroResolutionSource: source,
        heroResolutionEvidence: hero?.evidence ?? [],
        matchedKeywords: input.keywords,
        heroSelectionEvidence: input.heroSelectionEvidence ?? hero?.evidence ?? [],
    };
}
//# sourceMappingURL=heroTargetMetadata.js.map