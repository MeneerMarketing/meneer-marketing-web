import { classifyFromStoredOccurrence } from "../../config/signalClassification.js";
import { classifyBusinessType } from "../../config/businessTypes.js";
import { logger } from "../../utils/logger.js";
const NON_LEAD_RECLASS = new Set([
    "GENERAL_RETAILER",
    "MARKETPLACE",
    "COMPARISON_SITE",
    "SERVICE_BUSINESS",
    "NON_ECOMMERCE",
    "HYBRID_RETAILER",
]);
export async function reclassifyAllSignals(client) {
    const { data: occurrences, error: occError } = await client
        .from("ad_occurrences")
        .select("id, serp_item_type, raw_payload, brand_id, confirmation_source, ad_signal_type");
    if (occError) {
        throw new Error(`Failed to load ad occurrences: ${occError.message}`);
    }
    let occurrencesUpdated = 0;
    let confirmedPaid = 0;
    let paidCandidates = 0;
    let nonPaid = 0;
    for (const row of occurrences ?? []) {
        if (row.confirmation_source === "google_ads_transparency") {
            confirmedPaid += 1;
            occurrencesUpdated += 1;
            continue;
        }
        const classification = classifyFromStoredOccurrence({
            serp_item_type: row.serp_item_type,
            raw_payload: row.raw_payload,
        });
        const rawPayload = row.raw_payload ?? {};
        const inferredSerpType = row.serp_item_type ??
            (typeof rawPayload.parent_serp_type === "string"
                ? rawPayload.parent_serp_type
                : typeof rawPayload.type === "string" && rawPayload.type.includes("element")
                    ? "popular_products"
                    : rawPayload.type);
        if (classification.adSignalType === "CONFIRMED_PAID") {
            confirmedPaid += 1;
        }
        else if (classification.adSignalType === "PAID_CANDIDATE") {
            paidCandidates += 1;
        }
        else {
            nonPaid += 1;
        }
        const { error } = await client
            .from("ad_occurrences")
            .update({
            serp_item_type: inferredSerpType,
            ad_signal_type: classification.adSignalType,
            paid_confidence: classification.paidConfidence,
            confirmation_source: classification.confirmationSource,
            updated_at: new Date().toISOString(),
        })
            .eq("id", row.id);
        if (error) {
            logger.warn("Failed to update occurrence classification", {
                id: row.id,
                error: error.message,
            });
            continue;
        }
        occurrencesUpdated += 1;
    }
    const { data: brands, error: brandError } = await client
        .from("brands")
        .select("id, normalized_domain, confirmed_google_advertiser, transparency_confirmed, manual_excluded, eligibility_status, business_type");
    if (brandError) {
        throw new Error(`Failed to load brands: ${brandError.message}`);
    }
    let brandsUpdated = 0;
    for (const brand of brands ?? []) {
        if (brand.manual_excluded) {
            continue;
        }
        const normalizedDomain = brand.normalized_domain ?? "";
        const business = classifyBusinessType(normalizedDomain);
        // Discovery reclassification must never invent lead eligibility.
        const eligibilityStatus = business.businessType === "UNKNOWN"
            ? "PENDING_QUALIFICATION"
            : NON_LEAD_RECLASS.has(business.businessType)
                ? "EXCLUDED"
                : brand.eligibility_status === "LEAD_ELIGIBLE"
                    ? "LEAD_ELIGIBLE"
                    : "PENDING_QUALIFICATION";
        const updates = {
            business_type: business.businessType !== "UNKNOWN"
                ? business.businessType
                : brand.business_type,
            lead_eligible: eligibilityStatus === "LEAD_ELIGIBLE",
            eligibility_status: eligibilityStatus,
            excluded_reason: eligibilityStatus === "LEAD_ELIGIBLE"
                ? null
                : business.excludedReason ?? "pending_qualification",
            updated_at: new Date().toISOString(),
        };
        if (!brand.confirmed_google_advertiser && !brand.transparency_confirmed) {
            updates.confirmed_google_advertiser = false;
        }
        const { error } = await client.from("brands").update(updates).eq("id", brand.id);
        if (error) {
            logger.warn("Failed to update brand classification", {
                id: brand.id,
                error: error.message,
            });
            continue;
        }
        brandsUpdated += 1;
    }
    logger.info("Signal reclassification complete", {
        occurrencesUpdated,
        brandsUpdated,
        confirmedPaid,
        paidCandidates,
        nonPaid,
    });
    return {
        occurrencesUpdated,
        brandsUpdated,
        confirmedPaid,
        paidCandidates,
        nonPaid,
    };
}
//# sourceMappingURL=signalReclassificationService.js.map