import { classifyBusinessType as classifyDomainFallback } from "../../config/businessTypes.js";
const PRIMARY_LEAD_TYPES = new Set(["BRAND", "SPECIALIST_WEBSHOP"]);
const EXCLUDED_TYPES = new Set([
    "GENERAL_RETAILER",
    "MARKETPLACE",
    "COMPARISON_SITE",
    "SERVICE_BUSINESS",
    "NON_ECOMMERCE",
    "HYBRID_RETAILER",
]);
/**
 * Lead eligibility V2.
 * Flow: crawl → ecommerce → business type → paid → commercial fit → eligible
 */
export function qualifyLead(input) {
    const { candidate, crawlStatus, ecommerce, business, productPage, maturity, platform, platformCandidate, retailerScaleScore, } = input;
    const evidence = {
        crawlStatus,
        isEcommerce: ecommerce.isEcommerce,
        ecommerceConfidence: ecommerce.ecommerceConfidence,
        businessType: business.businessType,
        businessTypeConfidence: business.businessTypeConfidence,
        paidConfirmed: candidate.confirmedGoogleAdvertiser || candidate.transparencyConfirmed,
        paidSignalStrong: candidate.paidSignalStrong,
        platform,
        platformCandidate,
        retailerScaleScore,
        maturityScore: maturity.businessMaturityScore,
        productUrl: productPage.productUrl,
        productResolutionConfidence: productPage.productResolutionConfidence,
    };
    if (crawlStatus !== "success") {
        return {
            leadEligible: false,
            qualificationReason: `crawl_${crawlStatus}`,
            qualificationEvidence: evidence,
        };
    }
    if (!ecommerce.isEcommerce || ecommerce.ecommerceConfidence < 0.4) {
        return {
            leadEligible: false,
            qualificationReason: "not_ecommerce",
            qualificationEvidence: evidence,
        };
    }
    if (EXCLUDED_TYPES.has(business.businessType)) {
        return {
            leadEligible: false,
            qualificationReason: business.businessType.toLowerCase(),
            qualificationEvidence: evidence,
        };
    }
    // Large retailer / scale gate — even if typed as specialist
    if (retailerScaleScore >= 70) {
        return {
            leadEligible: false,
            qualificationReason: "retailer_scale_too_large",
            qualificationEvidence: evidence,
        };
    }
    const paidStrong = candidate.confirmedGoogleAdvertiser ||
        candidate.transparencyConfirmed ||
        candidate.paidSignalStrong;
    if (!paidStrong) {
        return {
            leadEligible: false,
            qualificationReason: "insufficient_paid_signal",
            qualificationEvidence: evidence,
        };
    }
    const fallback = classifyDomainFallback(candidate.normalizedDomain);
    if (!fallback.leadEligible && fallback.excludedReason) {
        return {
            leadEligible: false,
            qualificationReason: fallback.excludedReason,
            qualificationEvidence: { ...evidence, blacklistFallback: true },
        };
    }
    if (!PRIMARY_LEAD_TYPES.has(business.businessType)) {
        return {
            leadEligible: false,
            qualificationReason: "unknown_business_type",
            qualificationEvidence: evidence,
        };
    }
    if (business.businessTypeConfidence < 0.5) {
        return {
            leadEligible: false,
            qualificationReason: "low_business_type_confidence",
            qualificationEvidence: evidence,
        };
    }
    if (maturity.businessMaturityScore < 30) {
        return {
            leadEligible: false,
            qualificationReason: "low_maturity_score",
            qualificationEvidence: evidence,
        };
    }
    // Prefer analysable product pages for future CRO, but do not hard-fail specialists without one yet
    const platformLabel = platform !== "UNKNOWN"
        ? platform.toLowerCase()
        : platformCandidate !== "UNKNOWN"
            ? `${platformCandidate.toLowerCase()}_candidate`
            : "ecommerce";
    const paidLabel = candidate.confirmedGoogleAdvertiser
        ? "confirmed_paid"
        : candidate.transparencyConfirmed
            ? "transparency_confirmed"
            : "paid_candidate";
    const productSuffix = productPage.productUrl ? "_with_product" : "_homepage_only";
    return {
        leadEligible: true,
        qualificationReason: `${paidLabel}_${business.businessType.toLowerCase()}_${platformLabel}${productSuffix}`,
        qualificationEvidence: evidence,
    };
}
//# sourceMappingURL=leadQualificationService.js.map