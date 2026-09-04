/** Definitive platform only at or above this confidence. */
export const PLATFORM_CONFIRM_THRESHOLD = 0.8;
/** Candidate platform retained between this and confirm threshold. */
export const PLATFORM_CANDIDATE_THRESHOLD = 0.5;
export function detectPlatform(html, finalUrl) {
    const htmlLower = html.toLowerCase();
    const urlLower = finalUrl.toLowerCase();
    const signals = [];
    let shopifyScore = 0;
    let wooScore = 0;
    let magentoScore = 0;
    let shopwareScore = 0;
    let genericEcommerceScore = 0;
    if (htmlLower.includes("cdn.shopify.com")) {
        shopifyScore += 0.35;
        signals.push("cdn.shopify.com");
    }
    if (htmlLower.includes("shopifycloud") || htmlLower.includes("shopifycdn.com")) {
        shopifyScore += 0.2;
        signals.push("shopifycloud");
    }
    if (htmlLower.includes("window.shopify") ||
        htmlLower.includes("shopify.theme") ||
        htmlLower.includes("shopify-section")) {
        shopifyScore += 0.25;
        signals.push("shopify_js_object");
    }
    if (urlLower.includes("myshopify.com")) {
        shopifyScore += 0.4;
        signals.push("myshopify_domain");
    }
    if (htmlLower.includes("/cart.js") && htmlLower.includes("cdn.shopify.com")) {
        shopifyScore += 0.15;
        signals.push("shopify_cart_js");
    }
    else if (htmlLower.includes("/cart.js") || htmlLower.includes("cart/add")) {
        genericEcommerceScore += 0.1;
        signals.push("cart_endpoint");
    }
    if (htmlLower.includes("/products/") && shopifyScore >= 0.2) {
        shopifyScore += 0.05;
        signals.push("products_path_with_shopify");
    }
    else if (htmlLower.includes("/products/")) {
        genericEcommerceScore += 0.1;
        signals.push("products_path");
    }
    if (htmlLower.includes("woocommerce") || htmlLower.includes("wp-content/plugins/woocommerce")) {
        wooScore += 0.5;
        signals.push("woocommerce_assets");
    }
    if (htmlLower.includes("wc-ajax") || htmlLower.includes("add_to_cart_button")) {
        wooScore += 0.25;
        signals.push("woocommerce_cart");
    }
    if (htmlLower.includes("wp-content") && htmlLower.includes("woocommerce")) {
        wooScore += 0.1;
        signals.push("wordpress_woocommerce");
    }
    // Magento: require stronger signals than a single string match
    if (htmlLower.includes("mage/cookies") || htmlLower.includes("mage-init")) {
        magentoScore += 0.45;
        signals.push("magento_js");
    }
    if (htmlLower.includes("magento_version") || htmlLower.includes("x-magento")) {
        magentoScore += 0.35;
        signals.push("magento_headers_or_meta");
    }
    if (htmlLower.includes("/static/version") && htmlLower.includes("magento")) {
        magentoScore += 0.25;
        signals.push("magento_static_version");
    }
    // Weak "magento" text alone should not confirm
    if (htmlLower.includes("magento") && magentoScore < 0.3) {
        magentoScore += 0.15;
        signals.push("magento_string_weak");
    }
    if (htmlLower.includes("shopware") || htmlLower.includes("sw-cache-state")) {
        shopwareScore += 0.45;
        signals.push("shopware_assets");
    }
    if (htmlLower.includes("schema.org/product") || htmlLower.includes('"@type":"product"')) {
        genericEcommerceScore += 0.15;
        signals.push("schema_product");
    }
    const scores = [
        { platform: "SHOPIFY", score: Math.min(shopifyScore, 1) },
        { platform: "WOOCOMMERCE", score: Math.min(wooScore, 1) },
        { platform: "MAGENTO", score: Math.min(magentoScore, 1) },
        { platform: "SHOPWARE", score: Math.min(shopwareScore, 1) },
        { platform: "OTHER_ECOMMERCE", score: Math.min(genericEcommerceScore, 1) },
    ];
    scores.sort((a, b) => b.score - a.score);
    const best = scores[0] ?? { platform: "UNKNOWN", score: 0 };
    const platformCandidate = best.score >= PLATFORM_CANDIDATE_THRESHOLD ? best.platform : "UNKNOWN";
    const platform = best.score >= PLATFORM_CONFIRM_THRESHOLD ? best.platform : "UNKNOWN";
    return {
        platform,
        platformConfidence: Math.round(best.score * 1000) / 1000,
        platformCandidate,
        shopifyConfidence: Math.round(Math.min(shopifyScore, 1) * 1000) / 1000,
        signals,
        evidence: {
            scores: Object.fromEntries(scores.map((s) => [s.platform, s.score])),
            confirmThreshold: PLATFORM_CONFIRM_THRESHOLD,
            candidateThreshold: PLATFORM_CANDIDATE_THRESHOLD,
        },
    };
}
/** Merge platform evidence across homepage + secondary pages. */
export function mergePlatformDetections(detections) {
    if (detections.length === 0) {
        return {
            platform: "UNKNOWN",
            platformConfidence: 0,
            platformCandidate: "UNKNOWN",
            shopifyConfidence: 0,
            signals: [],
            evidence: {},
        };
    }
    const scoreMap = {};
    const allSignals = [];
    let maxShopify = 0;
    for (const detection of detections) {
        maxShopify = Math.max(maxShopify, detection.shopifyConfidence);
        allSignals.push(...detection.signals);
        const scores = detection.evidence.scores;
        if (scores) {
            for (const [platform, score] of Object.entries(scores)) {
                scoreMap[platform] = Math.max(scoreMap[platform] ?? 0, score);
            }
        }
        else if (detection.platformCandidate !== "UNKNOWN") {
            scoreMap[detection.platformCandidate] = Math.max(scoreMap[detection.platformCandidate] ?? 0, detection.platformConfidence);
        }
    }
    const ranked = Object.entries(scoreMap)
        .map(([platform, score]) => ({ platform: platform, score }))
        .sort((a, b) => b.score - a.score);
    const best = ranked[0] ?? { platform: "UNKNOWN", score: 0 };
    const platformCandidate = best.score >= PLATFORM_CANDIDATE_THRESHOLD ? best.platform : "UNKNOWN";
    const platform = best.score >= PLATFORM_CONFIRM_THRESHOLD ? best.platform : "UNKNOWN";
    return {
        platform,
        platformConfidence: Math.round(best.score * 1000) / 1000,
        platformCandidate,
        shopifyConfidence: Math.round(maxShopify * 1000) / 1000,
        signals: [...new Set(allSignals)],
        evidence: {
            scores: scoreMap,
            pagesAnalyzed: detections.length,
            confirmThreshold: PLATFORM_CONFIRM_THRESHOLD,
            candidateThreshold: PLATFORM_CANDIDATE_THRESHOLD,
        },
    };
}
//# sourceMappingURL=platformDetector.js.map