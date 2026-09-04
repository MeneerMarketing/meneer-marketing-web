import { classifyUrlPageType, scoreKeywordMatch, } from "../../utils/urlHelpers.js";
const MIN_PRODUCT_RESOLUTION_CONFIDENCE = 0.45;
/**
 * Classifies / scores candidates starting from an observed URL.
 * When a paid landing URL exists, callers must treat that URL as primary CRO target.
 * This helper follows redirects/canonicals and classifies PRODUCT/COLLECTION/HOME —
 * it must not invent a different brand product as the paid destination.
 */
export function resolveProductCandidates(input) {
    const { startUrl, finalUrl, signals, keyword, adHeadline, adDescription, } = input;
    const secondary = input.secondarySignals ?? [];
    const allSignals = [signals, ...secondary];
    const contextText = [keyword, adHeadline, adDescription].filter(Boolean).join(" ");
    const candidates = new Map();
    const upsert = (candidate) => {
        const existing = candidates.get(candidate.url);
        if (!existing || candidate.score > existing.score) {
            candidates.set(candidate.url, candidate);
        }
        else if (existing) {
            existing.reasons = [...new Set([...existing.reasons, ...candidate.reasons])];
            existing.score = Math.max(existing.score, candidate.score);
        }
    };
    // A/B: landing / final URL if already a product page
    const landingSources = [
        [startUrl, "ads_landing_url"],
        [finalUrl, "final_url"],
    ];
    for (const [url, source] of landingSources) {
        if (classifyUrlPageType(url) === "PRODUCT") {
            const json = pickBestJsonLd(allSignals.flatMap((s) => s.jsonLdProducts), url, contextText);
            upsert({
                url,
                score: 0.85 + scoreKeywordMatch(url + " " + (json?.name ?? ""), contextText) * 0.15,
                source,
                nameHint: json?.name ?? null,
                priceHint: json?.price ?? null,
                currencyHint: json?.currency ?? null,
                reasons: ["url_is_product_path"],
            });
        }
    }
    // D: JSON-LD products
    for (const page of allSignals) {
        for (const product of page.jsonLdProducts) {
            if (!product.url && !product.name) {
                continue;
            }
            const url = product.url ?? finalUrl;
            if (classifyUrlPageType(url) !== "PRODUCT" && !product.url) {
                continue;
            }
            const text = `${product.name ?? ""} ${url}`;
            const overlap = scoreKeywordMatch(text, contextText || keyword);
            upsert({
                url,
                score: 0.55 + overlap * 0.35 + (product.price ? 0.1 : 0),
                source: "json_ld",
                nameHint: product.name ?? null,
                priceHint: product.price ?? null,
                currencyHint: product.currency ?? null,
                reasons: ["json_ld_product", ...(overlap > 0 ? ["keyword_overlap"] : [])],
            });
        }
    }
    // C: internal product links
    const productLinks = [
        ...new Set(allSignals
            .flatMap((s) => s.internalLinks)
            .filter((link) => classifyUrlPageType(link) === "PRODUCT")),
    ];
    for (const link of productLinks.slice(0, 80)) {
        const overlap = scoreKeywordMatch(link, contextText || keyword);
        // With a keyword present, require some semantic overlap for internal links
        if (keyword && overlap < 0.34) {
            continue;
        }
        const score = 0.35 + overlap * 0.5;
        upsert({
            url: link,
            score: Math.min(score, 0.95),
            source: "internal_link",
            nameHint: null,
            priceHint: null,
            currencyHint: null,
            reasons: overlap > 0 ? ["keyword_in_slug"] : ["product_path_link"],
        });
    }
    if (productLinks.length > 0 && !keyword) {
        // Without keyword context, only take the first product link at low confidence
        const first = productLinks[0];
        upsert({
            url: first,
            score: 0.4,
            source: "internal_link",
            nameHint: null,
            priceHint: null,
            currencyHint: null,
            reasons: ["first_product_link_no_keyword"],
        });
    }
    // Collection links as weak fallbacks only when keyword matches
    if (keyword) {
        const collectionLinks = [
            ...new Set(allSignals
                .flatMap((s) => s.internalLinks)
                .filter((link) => {
                const type = classifyUrlPageType(link);
                return type === "COLLECTION" || type === "CATEGORY";
            })),
        ];
        for (const link of collectionLinks.slice(0, 20)) {
            const overlap = scoreKeywordMatch(link, contextText);
            if (overlap < 0.34) {
                continue;
            }
            upsert({
                url: link,
                score: 0.25 + overlap * 0.3,
                source: "collection_link",
                nameHint: null,
                priceHint: null,
                currencyHint: null,
                reasons: ["keyword_matched_collection"],
            });
        }
    }
    return [...candidates.values()].sort((a, b) => b.score - a.score);
}
export function selectBestProductCandidate(candidates) {
    const best = candidates[0];
    if (!best) {
        return null;
    }
    if (best.score < MIN_PRODUCT_RESOLUTION_CONFIDENCE) {
        return null;
    }
    // Never select a collection/category as product unless score is very high and no PRODUCT exists
    if (best.source === "collection_link") {
        const productCandidate = candidates.find((c) => classifyUrlPageType(c.url) === "PRODUCT" && c.score >= MIN_PRODUCT_RESOLUTION_CONFIDENCE);
        return productCandidate ?? null;
    }
    if (classifyUrlPageType(best.url) !== "PRODUCT") {
        return null;
    }
    return best;
}
export function emptyProductPageResult(pageType = "UNKNOWN") {
    return {
        pageType,
        productUrl: null,
        productName: null,
        price: null,
        currency: null,
        reviewCount: null,
        rating: null,
        availability: null,
        productBrand: null,
        description: null,
        shippingText: null,
        returnsText: null,
        guaranteeText: null,
        paymentSignals: [],
        productResolutionConfidence: 0,
        productResolutionSource: "none",
        productCandidateCount: 0,
        extractionEvidence: {},
    };
}
function pickBestJsonLd(products, preferredUrl, contextText) {
    if (products.length === 0) {
        return null;
    }
    let best = products[0];
    let bestScore = scoreKeywordMatch(`${best.name ?? ""} ${best.url ?? ""}`, contextText);
    for (const product of products) {
        let score = scoreKeywordMatch(`${product.name ?? ""} ${product.url ?? ""}`, contextText);
        if (product.url === preferredUrl) {
            score += 0.5;
        }
        if (score > bestScore) {
            best = product;
            bestScore = score;
        }
    }
    return best;
}
/** @deprecated use resolveProductCandidates + product page crawl */
export function findProductPage(startUrl, finalUrl, signals, keyword) {
    const candidates = resolveProductCandidates({
        startUrl,
        finalUrl,
        signals,
        keyword,
        adHeadline: null,
        adDescription: null,
    });
    const best = selectBestProductCandidate(candidates);
    if (!best) {
        return {
            ...emptyProductPageResult(classifyUrlPageType(finalUrl)),
            productCandidateCount: candidates.length,
        };
    }
    return {
        ...emptyProductPageResult("PRODUCT"),
        productUrl: best.url,
        productName: best.nameHint,
        price: best.priceHint,
        currency: best.currencyHint,
        productResolutionConfidence: Math.round(best.score * 1000) / 1000,
        productResolutionSource: best.source,
        productCandidateCount: candidates.length,
        extractionEvidence: { reasons: best.reasons },
    };
}
//# sourceMappingURL=productPageFinder.js.map