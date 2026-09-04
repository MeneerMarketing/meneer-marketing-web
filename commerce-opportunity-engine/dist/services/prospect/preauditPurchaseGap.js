/**
 * Milestone 9.5 — cheap pre-audit purchase / buyblock gap (0-100).
 *
 * Higher score = weaker current purchase experience, more room for CRO uplift.
 */
function clamp(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
}
export function computePreauditPurchaseGap(input) {
    const evidence = [];
    let gap = 42;
    if (!input.hasAddToCart) {
        gap += 18;
        evidence.push("weak_cta");
    }
    if (!input.hasPrice) {
        gap += 12;
        evidence.push("price_unclear");
    }
    if (!input.hasReviews) {
        gap += 10;
        evidence.push("no_social_proof_near_buy");
    }
    if (!input.benefitsPresent) {
        gap += 10;
        evidence.push("no_benefit_communication");
    }
    if (!input.faqPresent) {
        gap += 5;
        evidence.push("no_faq_reassurance");
    }
    if (input.variantSelectors <= 0) {
        gap += 6;
        evidence.push("no_variant_clarity");
    }
    else if (input.variantSelectors >= 3) {
        gap -= 4;
        evidence.push("clear_variant_options");
    }
    if (input.paymentIcons <= 0) {
        gap += 6;
        evidence.push("no_payment_reassurance");
    }
    else if (input.paymentIcons >= 3) {
        gap -= 5;
        evidence.push("payment_icons_present");
    }
    if (input.shippingMentions <= 0) {
        gap += 6;
        evidence.push("no_shipping_reassurance");
    }
    else if (input.shippingMentions >= 2) {
        gap -= 4;
        evidence.push("shipping_reassurance_present");
    }
    if (!input.stickyAtcSignal) {
        gap += 8;
        evidence.push("no_sticky_atc");
    }
    else {
        gap -= 6;
        evidence.push("sticky_atc_present");
    }
    if (!input.mobileAtcSignal) {
        gap += 6;
        evidence.push("weak_mobile_cta_signal");
    }
    return { score: clamp(gap), evidence };
}
export function extractPurchaseGapSignals(html) {
    const lower = html.toLowerCase();
    const variantSelectors = (html.match(/<select[^>]+name=["'][^"']*variant|product-form__input|variant-picker/gi) ?? []).length;
    const paymentIcons = (lower.match(/klarna|ideal|paypal|visa|mastercard|bancontact|afterpay/g) ?? []).length;
    const shippingMentions = (lower.match(/verzending|levertijd|voor \d{1,2}:\d{2}|gratis verzending|shipping/g) ?? []).length;
    return {
        hasAddToCart: /add-to-cart|in winkelwagen|toevoegen aan|add to cart|btn--add-to-cart/i.test(lower),
        hasPrice: /€|eur|price|prijs|product__price/i.test(lower),
        hasReviews: /review|beoordeling|sterren|rating|jdgm|yotpo|loox/i.test(lower),
        benefitsPresent: /voordeel|benefit|waarom dit|kenmerk|usp/i.test(lower),
        faqPresent: /faq|veelgestelde vragen/i.test(lower),
        variantSelectors,
        paymentIcons,
        shippingMentions,
        stickyAtcSignal: /sticky-atc|sticky-buy|product-sticky|sticky-add|sticky-bar/i.test(lower),
        mobileAtcSignal: /mobile-atc|sticky.*cart|atc-bar|product-form--sticky/i.test(lower),
    };
}
//# sourceMappingURL=preauditPurchaseGap.js.map