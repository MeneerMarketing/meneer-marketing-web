/**
 * Milestone 9.3 — deterministic current PDP weakness proxy (pre-Claude).
 */
function clamp(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
}
export function computeCurrentPdpWeaknessProxy(input) {
    const evidence = [];
    let weakness = 42;
    if (input.descriptionLength < 80) {
        weakness += 18;
        evidence.push("thin_description");
    }
    else if (input.descriptionLength < 200) {
        weakness += 10;
        evidence.push("moderate_description");
    }
    else {
        weakness -= 4;
    }
    const images = input.imageCount ?? 0;
    if (images <= 1) {
        weakness += 14;
        evidence.push("few_product_images");
    }
    else if (images <= 3) {
        weakness += 8;
    }
    if (!input.hasReviews) {
        weakness += 8;
        evidence.push("no_reviews_near_buyblock");
    }
    if (!input.hasPrice) {
        weakness += 6;
        evidence.push("price_unclear");
    }
    if (!input.hasAddToCart) {
        weakness += 10;
        evidence.push("weak_cta_signal");
    }
    if (!input.benefitsPresent) {
        weakness += 10;
        evidence.push("no_benefits_block");
    }
    if (!input.faqPresent) {
        weakness += 6;
        evidence.push("no_faq");
    }
    if (!input.featuresPresent) {
        weakness += 8;
        evidence.push("no_feature_explanation");
    }
    if (!input.videoPresent) {
        weakness += 4;
    }
    const platform = (input.platform ?? "").toUpperCase();
    if (platform === "SHOPIFY" && input.bodyTextLength < 1200) {
        weakness += 8;
        evidence.push("generic_shopify_thin_page");
    }
    if (input.signals) {
        const s = input.signals;
        if (!s.hasAddToCart && !input.hasAddToCart)
            weakness += 4;
        if (s.productUrlCount <= 1 && s.collectionUrlCount > 3) {
            weakness += 4;
            evidence.push("collection_heavy_not_product_story");
        }
    }
    return { score: clamp(weakness), evidence };
}
export function pdpWeaknessSignalsFromHtml(html, _url, platform) {
    const lower = html.toLowerCase();
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i);
    const metaDesc = descMatch?.[1] ?? "";
    const bodyText = lower.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    const imgCount = (html.match(/<img[\s>]/gi) ?? []).length;
    return {
        platform,
        descriptionLength: metaDesc.length,
        imageCount: imgCount,
        hasReviews: /review|beoordeling|sterren|rating/i.test(lower),
        hasPrice: /€|eur|price|prijs/i.test(lower),
        hasAddToCart: /add-to-cart|in winkelwagen|toevoegen aan|add to cart/i.test(lower),
        bodyTextLength: bodyText.length,
        benefitsPresent: /voordeel|benefit|waarom dit|kenmerk/i.test(lower),
        faqPresent: /faq|veelgestelde vragen/i.test(lower),
        featuresPresent: /specificatie|feature|werking|materiaal|ingredient/i.test(lower),
        videoPresent: /<video|youtube|vimeo/i.test(lower),
    };
}
//# sourceMappingURL=pdpWeaknessProxy.js.map