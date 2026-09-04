import { classifyBusinessType } from "../../config/businessTypes.js";
import { deriveEligibilityStatus } from "./brandExclusionService.js";
export async function findBrandByNormalizedDomain(client, normalizedDomain) {
    const { data, error } = await client
        .from("brands")
        .select("id, name, domain, normalized_domain, first_seen_at, last_seen_at, scan_count, confirmed_google_advertiser, confirmation_source, manual_excluded, eligibility_status, lead_eligible, business_type")
        .eq("normalized_domain", normalizedDomain)
        .maybeSingle();
    if (error) {
        throw new Error(`Failed to find brand: ${error.message}`);
    }
    return data ?? null;
}
export async function upsertBrandFromAd(client, input) {
    const existing = await findBrandByNormalizedDomain(client, input.normalizedDomain);
    const business = classifyBusinessType(input.normalizedDomain);
    if (existing) {
        const manualExcluded = Boolean(existing.manual_excluded);
        const updates = {
            name: input.name,
            domain: input.domain,
            last_seen_at: input.seenAt,
            scan_count: existing.scan_count + 1,
            confirmed_google_advertiser: input.confirmedGoogleAdvertiser ??
                existing.confirmed_google_advertiser ??
                false,
            confirmation_source: input.confirmationSource ?? existing.confirmation_source ?? null,
            updated_at: input.seenAt,
        };
        // Manual exclusion always wins. Discovery must not re-open leads.
        if (!manualExcluded) {
            // Only seed business_type from domain map when still UNKNOWN / unset.
            const currentType = existing.business_type ?? "UNKNOWN";
            if (currentType === "UNKNOWN" && business.businessType !== "UNKNOWN") {
                updates.business_type = business.businessType;
            }
            // Never auto-promote to lead_eligible from discovery alone.
            if (business.businessType !== "UNKNOWN" && NON_PENDING_EXCLUDED.has(business.businessType)) {
                updates.business_type = business.businessType;
                updates.lead_eligible = false;
                updates.eligibility_status = "EXCLUDED";
                updates.excluded_reason = business.excludedReason;
            }
            else if (currentType === "UNKNOWN") {
                updates.lead_eligible = false;
                updates.eligibility_status = "PENDING_QUALIFICATION";
                updates.excluded_reason = "pending_qualification";
            }
        }
        const { data, error } = await client
            .from("brands")
            .update(updates)
            .eq("id", existing.id)
            .select("id, name, domain, normalized_domain, first_seen_at, last_seen_at, scan_count, confirmed_google_advertiser, confirmation_source")
            .single();
        if (error) {
            throw new Error(`Failed to update brand: ${error.message}`);
        }
        return { brand: data, isNew: false };
    }
    const eligibilityStatus = deriveEligibilityStatus({
        leadEligible: false,
        businessType: business.businessType,
        crawlStatus: null,
        qualificationReason: business.excludedReason ?? "pending_qualification",
    });
    const { data, error } = await client
        .from("brands")
        .insert({
        name: input.name,
        domain: input.domain,
        normalized_domain: input.normalizedDomain,
        first_seen_at: input.seenAt,
        last_seen_at: input.seenAt,
        scan_count: 1,
        business_type: business.businessType,
        lead_eligible: false,
        eligibility_status: eligibilityStatus,
        excluded_reason: eligibilityStatus === "EXCLUDED"
            ? business.excludedReason
            : "pending_qualification",
        qualification_reason: "pending_qualification",
        confirmed_google_advertiser: input.confirmedGoogleAdvertiser ?? false,
        confirmation_source: input.confirmationSource ?? null,
    })
        .select("id, name, domain, normalized_domain, first_seen_at, last_seen_at, scan_count, confirmed_google_advertiser, confirmation_source")
        .single();
    if (error) {
        throw new Error(`Failed to insert brand: ${error.message}`);
    }
    return { brand: data, isNew: true };
}
const NON_PENDING_EXCLUDED = new Set([
    "GENERAL_RETAILER",
    "MARKETPLACE",
    "COMPARISON_SITE",
    "SERVICE_BUSINESS",
    "NON_ECOMMERCE",
    "HYBRID_RETAILER",
]);
//# sourceMappingURL=brandsRepository.js.map