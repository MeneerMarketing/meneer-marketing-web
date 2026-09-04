export const PRIORITY_DOMAINS = [
    "boozyshop.nl",
    "haarshop.nl",
    "currentbody.nl",
    "obelink.nl",
    "dekbed-discounter.nl",
    "anwb.nl",
];
const BRAND_SELECT = "id, normalized_domain, name, confirmed_google_advertiser, transparency_confirmed, last_crawled_at, platform, is_ecommerce, business_type, retailer_scale_score";
export async function enrichCandidate(client, brand) {
    const { data: adRow } = await client
        .from("ad_occurrences")
        .select("landing_url, keyword_id, ad_signal_type, headline, description, keywords(keyword)")
        .eq("brand_id", brand.id)
        .order("found_at", { ascending: false })
        .limit(1)
        .maybeSingle();
    const keywordJoin = adRow?.keywords;
    const paidSignalStrong = adRow?.ad_signal_type === "CONFIRMED_PAID" ||
        brand.confirmed_google_advertiser ||
        brand.transparency_confirmed;
    return {
        id: brand.id,
        normalizedDomain: brand.normalized_domain,
        name: brand.name,
        confirmedGoogleAdvertiser: brand.confirmed_google_advertiser,
        transparencyConfirmed: brand.transparency_confirmed,
        landingUrl: adRow?.landing_url ?? null,
        keyword: keywordJoin?.keyword ?? null,
        adHeadline: adRow?.headline ?? null,
        adDescription: adRow?.description ?? null,
        paidSignalStrong,
    };
}
function needsWebsiteQualification(brand, forcePriority) {
    if (forcePriority && PRIORITY_DOMAINS.includes(brand.normalized_domain)) {
        return true;
    }
    return (brand.last_crawled_at === null ||
        brand.platform === null ||
        brand.is_ecommerce === null ||
        brand.business_type === "UNKNOWN" ||
        brand.retailer_scale_score === null);
}
export async function loadBrandsForQualification(client, limit, options) {
    const forcePriority = options?.forcePriorityDomains ?? true;
    const selectedIds = new Set();
    const selectedRows = [];
    const { data: priorityBrands, error: priorityError } = await client
        .from("brands")
        .select(BRAND_SELECT)
        .in("normalized_domain", PRIORITY_DOMAINS);
    if (priorityError) {
        throw new Error(`Failed to load priority brands: ${priorityError.message}`);
    }
    const prioritySorted = [...(priorityBrands ?? [])].sort((a, b) => PRIORITY_DOMAINS.indexOf(a.normalized_domain) -
        PRIORITY_DOMAINS.indexOf(b.normalized_domain));
    for (const brand of prioritySorted) {
        if (!needsWebsiteQualification(brand, forcePriority)) {
            continue;
        }
        if (selectedRows.length >= limit) {
            break;
        }
        selectedIds.add(brand.id);
        selectedRows.push(brand);
    }
    if (selectedRows.length < limit) {
        const { data: backlog, error: backlogError } = await client
            .from("brands")
            .select(BRAND_SELECT)
            .not("normalized_domain", "is", null)
            .is("last_crawled_at", null)
            .order("created_at", { ascending: true })
            .limit((limit - selectedRows.length) * 3);
        if (backlogError) {
            throw new Error(`Failed to load backlog brands: ${backlogError.message}`);
        }
        for (const brand of backlog ?? []) {
            if (selectedIds.has(brand.id)) {
                continue;
            }
            if (selectedRows.length >= limit) {
                break;
            }
            selectedIds.add(brand.id);
            selectedRows.push(brand);
        }
    }
    const candidates = [];
    for (const brand of selectedRows) {
        candidates.push(await enrichCandidate(client, brand));
    }
    return candidates;
}
export async function saveBrandQualification(client, result) {
    const now = new Date().toISOString();
    const { data: existing, error: loadError } = await client
        .from("brands")
        .select("manual_excluded")
        .eq("id", result.brandId)
        .maybeSingle();
    if (loadError) {
        throw new Error(`Failed to load brand before qualification save: ${loadError.message}`);
    }
    const manualExcluded = Boolean(existing?.manual_excluded);
    const leadEligible = manualExcluded ? false : result.leadEligible;
    const eligibilityStatus = manualExcluded
        ? "EXCLUDED"
        : leadEligible
            ? "LEAD_ELIGIBLE"
            : result.businessType === "UNKNOWN" ||
                result.crawlStatus !== "success" ||
                result.qualificationReason === "unknown_business_type" ||
                result.qualificationReason.startsWith("crawl_")
                ? "PENDING_QUALIFICATION"
                : "EXCLUDED";
    const { error } = await client
        .from("brands")
        .update({
        is_ecommerce: result.isEcommerce,
        ecommerce_confidence: result.ecommerceConfidence,
        platform: result.platform,
        platform_confidence: result.platformConfidence,
        platform_candidate: result.platformCandidate,
        platform_evidence: result.platformEvidence,
        shopify_confidence: result.shopifyConfidence,
        business_type: result.businessType,
        business_type_confidence: result.businessTypeConfidence,
        business_type_reasoning: result.businessTypeReasoning,
        lead_eligible: leadEligible,
        eligibility_status: eligibilityStatus,
        qualification_reason: result.qualificationReason,
        qualification_evidence: {
            ...result.qualificationEvidence,
            manualExcludedOverride: manualExcluded,
        },
        excluded_reason: leadEligible
            ? null
            : manualExcluded
                ? "manual_excluded"
                : result.qualificationReason,
        business_maturity_score: result.businessMaturityScore,
        business_maturity_components: result.businessMaturityComponents,
        retailer_scale_score: result.retailerScaleScore,
        last_crawled_at: now,
        crawl_status: result.crawlStatus,
        crawl_metadata: result.crawlMetadata,
        updated_at: now,
    })
        .eq("id", result.brandId);
    if (error) {
        throw new Error(`Failed to save brand qualification: ${error.message}`);
    }
}
//# sourceMappingURL=brandsQualificationRepository.js.map