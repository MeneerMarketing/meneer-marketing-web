import { SOURCE_QUALITY_V2 } from "../../config/sourceIntegrityWeights.js";
function asRecord(value) {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value
        : null;
}
function collectUrlCorpus(input) {
    const parts = [];
    for (const u of [input.landingUrl, input.adUrl, ...(input.adUrlRedirects ?? [])]) {
        if (u)
            parts.push(u);
    }
    const listing = asRecord(input.rawPayload)?.listing;
    const listingRec = asRecord(listing);
    if (listingRec?.url && typeof listingRec.url === "string")
        parts.push(listingRec.url);
    return parts.join("\n").toLowerCase();
}
function detectFreeListingEvidence(corpus) {
    const hits = [];
    if (corpus.includes("utm_medium=free_shopping"))
        hits.push("utm_medium=free_shopping");
    if (corpus.includes("freelisting=yes") || corpus.includes("freelisting=true")) {
        hits.push("freelisting=yes");
    }
    if (corpus.includes("utm_medium=organic"))
        hits.push("utm_medium=organic");
    return hits;
}
function detectPaidEvidence(input, corpus) {
    const hits = [];
    const itemType = (input.merchantItemType ?? "").toLowerCase();
    if (itemType === "google_shopping_paid")
        hits.push("merchant_type:google_shopping_paid");
    if (itemType === "google_shopping_sponsored_carousel_element") {
        hits.push("merchant_type:google_shopping_sponsored_carousel_element");
    }
    if (itemType.includes("sponsored_carousel") && itemType.includes("element")) {
        hits.push(`merchant_type:${itemType}`);
    }
    if (input.shopAdAclk)
        hits.push("shop_ad_aclk_present");
    // Unambiguous Google Shopping Ads LP markers (not free listing)
    if (corpus.includes("ps-sl-shoppingads") && !corpus.includes("free_shopping")) {
        hits.push("url_param:ps-sl-shoppingads");
    }
    if (corpus.includes("gclid=") && corpus.includes("shopping")) {
        hits.push("url_param:gclid+shopping");
    }
    return [...new Set(hits)];
}
function titleKeywordOverlap(keyword, title) {
    const kw = (keyword ?? "").toLowerCase().split(/\s+/).filter((t) => t.length >= 3);
    if (kw.length === 0)
        return 0;
    const t = (title ?? "").toLowerCase();
    return kw.filter((token) => t.includes(token)).length / kw.length;
}
/**
 * Classify a Shopping target from stored Merchant/Sellers evidence.
 * Exact seller URL ≠ paid advertising proof.
 */
export function classifyShoppingTarget(input) {
    const reasons = [];
    const corpus = collectUrlCorpus(input);
    const freeEvidence = detectFreeListingEvidence(corpus);
    const paidEvidence = detectPaidEvidence(input, corpus);
    const hasLanding = Boolean(input.landingUrl);
    const domainOk = input.domainMatchStatus === "MATCH" ||
        input.domainMatchStatus === "SELLER_DOMAIN_MATCH";
    const hasSeller = Boolean(input.seller);
    const hasProductId = Boolean(input.productId);
    const itemType = input.merchantItemType ??
        asRecord(asRecord(input.rawPayload)?.listing)?.type ??
        null;
    // Listing target confidence: product/seller/URL relationship strength
    let listingTargetConfidence = 0;
    if (hasLanding)
        listingTargetConfidence += 45;
    if (domainOk)
        listingTargetConfidence += 25;
    if (hasSeller)
        listingTargetConfidence += 15;
    if (hasProductId)
        listingTargetConfidence += 10;
    const overlap = titleKeywordOverlap(input.keyword, input.title);
    if (overlap >= 0.35)
        listingTargetConfidence += 5;
    listingTargetConfidence = Math.min(100, Math.round(listingTargetConfidence));
    // Paid evidence confidence: only explicit paid signals
    let paidEvidenceConfidence = 0;
    if (paidEvidence.includes("merchant_type:google_shopping_paid")) {
        paidEvidenceConfidence += 70;
    }
    if (paidEvidence.some((e) => e.includes("sponsored_carousel"))) {
        paidEvidenceConfidence += 65;
    }
    if (paidEvidence.includes("shop_ad_aclk_present"))
        paidEvidenceConfidence += 50;
    if (paidEvidence.includes("url_param:ps-sl-shoppingads"))
        paidEvidenceConfidence += 35;
    if (paidEvidence.includes("url_param:gclid+shopping"))
        paidEvidenceConfidence += 20;
    if (freeEvidence.length > 0) {
        paidEvidenceConfidence = Math.min(paidEvidenceConfidence, 15);
        reasons.push("free_listing_evidence_present");
    }
    paidEvidenceConfidence = Math.min(100, Math.round(paidEvidenceConfidence));
    const unambiguousPaid = paidEvidenceConfidence >= 50 &&
        freeEvidence.length === 0 &&
        (paidEvidence.some((e) => e.startsWith("merchant_type:")) ||
            paidEvidence.includes("shop_ad_aclk_present"));
    let sourceType;
    let croReadinessLevel;
    let sourceQualityScore;
    let croReady = false;
    if (!hasLanding || !domainOk) {
        sourceType = "GOOGLE_SHOPPING_CANDIDATE";
        croReadinessLevel = "DISCOVERY_ONLY";
        sourceQualityScore = SOURCE_QUALITY_V2.googleShoppingCandidate.base;
        reasons.push("incomplete_seller_or_landing");
    }
    else if (freeEvidence.length > 0) {
        sourceType = "GOOGLE_SHOPPING_FREE_LISTING";
        croReadinessLevel = "DISCOVERY_ONLY";
        const cfg = SOURCE_QUALITY_V2.googleShoppingFreeListing;
        sourceQualityScore = cfg.base;
        if (domainOk)
            sourceQualityScore += cfg.withDomainMatch;
        if (overlap >= 0.35)
            sourceQualityScore += cfg.withStrongTitleMatch;
        sourceQualityScore = Math.min(cfg.maxScore, Math.round(sourceQualityScore));
        reasons.push(...freeEvidence.map((e) => `free:${e}`));
    }
    else if (unambiguousPaid) {
        sourceType = "GOOGLE_SHOPPING_PAID_EXACT";
        croReadinessLevel = "EXACT_PAID_FUNNEL";
        const cfg = SOURCE_QUALITY_V2.googleShoppingPaidExact;
        sourceQualityScore = cfg.base;
        if (input.shopAdAclk || paidEvidence.includes("shop_ad_aclk_present")) {
            sourceQualityScore += cfg.withResolvedAdUrl;
        }
        if (domainOk)
            sourceQualityScore += cfg.withDomainMatch;
        if (overlap >= 0.35)
            sourceQualityScore += cfg.withStrongTitleMatch;
        sourceQualityScore = Math.min(cfg.maxScore, Math.round(sourceQualityScore));
        croReady = true;
        reasons.push(...paidEvidence.map((e) => `paid:${e}`));
    }
    else if (listingTargetConfidence >= 80) {
        sourceType = "GOOGLE_SHOPPING_EXACT_LISTING";
        croReadinessLevel = "HIGH_CONFIDENCE_TARGET";
        const cfg = SOURCE_QUALITY_V2.googleShoppingExactListing;
        sourceQualityScore = cfg.base;
        if (domainOk)
            sourceQualityScore += cfg.withDomainMatch;
        if (overlap >= 0.35)
            sourceQualityScore += cfg.withStrongTitleMatch;
        if (input.brandConfirmedAdvertiser)
            sourceQualityScore += cfg.withConfirmedAdvertiser;
        sourceQualityScore = Math.min(cfg.maxScore, Math.round(sourceQualityScore));
        croReady = false; // not exact paid funnel
        reasons.push("exact_listing_without_target_paid_proof");
        if (paidEvidence.length > 0) {
            reasons.push(...paidEvidence.map((e) => `weak_paid:${e}`));
        }
    }
    else {
        sourceType = "GOOGLE_SHOPPING_CANDIDATE";
        croReadinessLevel = "DISCOVERY_ONLY";
        sourceQualityScore = SOURCE_QUALITY_V2.googleShoppingCandidate.base;
        reasons.push("listing_target_confidence_too_low");
    }
    return {
        sourceType,
        listingTargetConfidence,
        paidEvidenceConfidence,
        sourceQualityScore,
        croReadinessLevel,
        croReady,
        paidEvidence,
        freeListingEvidence: freeEvidence,
        merchantItemType: itemType,
        reasons,
    };
}
//# sourceMappingURL=shoppingClassification.js.map