export const MANUAL_EXCLUSION_REASONS = [
    "GENERAL_RETAILER",
    "TOO_LARGE",
    "MARKETPLACE",
    "IRRELEVANT_BUSINESS",
    "POOR_PROSPECT",
    "EXISTING_CLIENT",
    "DO_NOT_CONTACT",
    "OTHER",
];
export function deriveEligibilityStatus(input) {
    if (input.manualExcluded)
        return "EXCLUDED";
    if (input.leadEligible)
        return "LEAD_ELIGIBLE";
    const excludedTypes = new Set([
        "GENERAL_RETAILER",
        "MARKETPLACE",
        "COMPARISON_SITE",
        "SERVICE_BUSINESS",
        "NON_ECOMMERCE",
        "HYBRID_RETAILER",
    ]);
    if (excludedTypes.has(input.businessType))
        return "EXCLUDED";
    if (input.businessType === "UNKNOWN" ||
        input.crawlStatus !== "success" ||
        !input.qualificationReason ||
        input.qualificationReason === "pending_qualification" ||
        input.qualificationReason === "unknown_business_type") {
        return "PENDING_QUALIFICATION";
    }
    return "EXCLUDED";
}
export async function manuallyExcludeBrand(client, input) {
    const now = new Date().toISOString();
    const { error } = await client
        .from("brands")
        .update({
        manual_excluded: true,
        manual_excluded_at: now,
        manual_exclusion_reason: input.reason,
        manual_exclusion_note: input.note?.trim() || null,
        eligibility_status: "EXCLUDED",
        lead_eligible: false,
        excluded_reason: `manual_${input.reason.toLowerCase()}`,
        updated_at: now,
    })
        .eq("id", input.brandId);
    if (error) {
        throw new Error(`Failed to exclude brand: ${error.message}`);
    }
    // Mark open opportunities as REJECTED so shortlist/outreach pipelines skip them
    const { error: oppError } = await client
        .from("opportunities")
        .update({
        status: "REJECTED",
        status_updated_at: now,
        updated_at: now,
    })
        .eq("brand_id", input.brandId)
        .in("status", ["NEW", "REVIEWED", "SHORTLISTED"]);
    if (oppError) {
        throw new Error(`Failed to update opportunities after exclusion: ${oppError.message}`);
    }
}
export async function liftManualBrandExclusion(client, brandId) {
    const { data: brand, error: loadError } = await client
        .from("brands")
        .select("business_type, crawl_status, qualification_reason, business_type_confidence, retailer_scale_score, confirmed_google_advertiser, transparency_confirmed")
        .eq("id", brandId)
        .single();
    if (loadError) {
        throw new Error(`Failed to load brand for unexclude: ${loadError.message}`);
    }
    const canBeEligible = (brand.business_type === "BRAND" || brand.business_type === "SPECIALIST_WEBSHOP") &&
        brand.crawl_status === "success" &&
        brand.qualification_reason != null &&
        brand.qualification_reason !== "pending_qualification" &&
        brand.qualification_reason !== "unknown_business_type" &&
        Number(brand.business_type_confidence ?? 0) >= 0.5 &&
        Number(brand.retailer_scale_score ?? 0) < 70 &&
        Boolean(brand.confirmed_google_advertiser || brand.transparency_confirmed);
    const eligibilityStatus = canBeEligible
        ? "LEAD_ELIGIBLE"
        : deriveEligibilityStatus({
            manualExcluded: false,
            leadEligible: false,
            businessType: brand.business_type,
            crawlStatus: brand.crawl_status,
            qualificationReason: brand.qualification_reason,
        });
    const now = new Date().toISOString();
    const { error } = await client
        .from("brands")
        .update({
        manual_excluded: false,
        manual_excluded_at: null,
        manual_exclusion_reason: null,
        manual_exclusion_note: null,
        eligibility_status: eligibilityStatus,
        lead_eligible: eligibilityStatus === "LEAD_ELIGIBLE",
        excluded_reason: eligibilityStatus === "LEAD_ELIGIBLE"
            ? null
            : eligibilityStatus === "PENDING_QUALIFICATION"
                ? "pending_qualification"
                : "exclusion_lifted_pending_requalification",
        updated_at: now,
    })
        .eq("id", brandId);
    if (error) {
        throw new Error(`Failed to lift brand exclusion: ${error.message}`);
    }
    return { eligibilityStatus };
}
//# sourceMappingURL=brandExclusionService.js.map