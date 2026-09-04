/**
 * Milestone 9.5 — cheap pre-audit visual design gap (0-100).
 *
 * Higher score = more room for a premium DTC transformation. This is not page
 * quality; it estimates how template-driven or generic the first viewport feels.
 */
function clamp(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
}
export function computePreauditVisualGap(input) {
    const lower = input.html.toLowerCase();
    const evidence = [];
    let gap = 48;
    const premiumSignals = [
        { re: /swiper|slick-slider|fancybox|photoswipe|flickity/i, label: "rich_gallery", penalty: 10 },
        { re: /scroll-trigger|gsap|framer-motion|data-aos/i, label: "motion_design", penalty: 9 },
        { re: /sticky-atc|sticky-buy|product-sticky|sticky-add/i, label: "sticky_commerce", penalty: 6 },
        { re: /accordion|collapsible-tab|faq-section|product-tabs/i, label: "rich_sections", penalty: 7 },
        { re: /editorial|lookbook|story-section|brand-story/i, label: "editorial_story", penalty: 12 },
        { re: /font-face|typekit|custom-font|woff2/i, label: "custom_typography", penalty: 5 },
        { re: /grid--2-col|product__media-list|media-gallery--grid/i, label: "designed_gallery", penalty: 8 },
        { re: /video-hero|background-video|product-video/i, label: "hero_video", penalty: 6 },
    ];
    for (const signal of premiumSignals) {
        if (signal.re.test(lower)) {
            gap -= signal.penalty;
            evidence.push(`premium:${signal.label}`);
        }
    }
    const templateSignals = [
        { re: /theme\.liquid|shopify-section|product-template/i, label: "theme_template", boost: 6 },
        { re: /product-single|product-form__submit|btn--add-to-cart/i, label: "basic_buyblock", boost: 5 },
        { re: /product__title|product-title h1/i, label: "plain_title_stack", boost: 4 },
        { re: /price--large|product__price/i, label: "plain_price", boost: 3 },
        { re: /rte product-single__description/i, label: "thin_rte_description", boost: 8 },
        { re: /collection-grid|featured-collection/i, label: "collection_heavy", boost: 4 },
    ];
    for (const signal of templateSignals) {
        if (signal.re.test(lower)) {
            gap += signal.boost;
            evidence.push(`template:${signal.label}`);
        }
    }
    if (input.sectionCount <= 2) {
        gap += 10;
        evidence.push("few_visible_sections");
    }
    else if (input.sectionCount >= 8) {
        gap -= 8;
        evidence.push("many_structured_sections");
    }
    if (input.imageCount <= 3) {
        gap += 8;
        evidence.push("minimal_gallery");
    }
    else if (input.imageCount >= 12) {
        gap -= 5;
        evidence.push("rich_image_surface");
    }
    if (input.bodyTextLength < 900) {
        gap += 6;
        evidence.push("thin_above_fold_density");
    }
    const platform = (input.platform ?? "").toUpperCase();
    if (platform === "SHOPIFY" && input.sectionCount <= 4) {
        gap += 5;
        evidence.push("generic_shopify_stack");
    }
    if (input.pdpWeaknessProxy != null && input.pdpWeaknessProxy >= 55) {
        gap += 6;
        evidence.push("weakness_proxy_high");
    }
    if (input.estimatedContrastCeiling != null && input.estimatedContrastCeiling <= 48) {
        gap -= 14;
        evidence.push("ceiling_says_already_polished");
    }
    else if (input.estimatedContrastCeiling != null && input.estimatedContrastCeiling >= 72) {
        gap += 8;
        evidence.push("ceiling_says_room_to_transform");
    }
    return { score: clamp(gap), evidence };
}
export function countDomSections(html) {
    const matches = html.match(/<section[\s>]/gi) ?? [];
    const shopifySections = html.match(/shopify-section/gi) ?? [];
    return Math.max(matches.length, Math.floor(shopifySections.length / 2));
}
//# sourceMappingURL=preauditVisualGap.js.map