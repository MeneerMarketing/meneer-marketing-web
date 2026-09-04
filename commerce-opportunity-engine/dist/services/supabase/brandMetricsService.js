export async function getBrandActivityMetrics(client, brandIds, signalFilter) {
    let query = client
        .from("ad_occurrences")
        .select("brand_id, keyword_id, found_at, ad_signal_type, brands!inner(normalized_domain, lead_eligible, business_type, transparency_confirmed)");
    if (brandIds && brandIds.length > 0) {
        query = query.in("brand_id", brandIds);
    }
    if (signalFilter) {
        query = query.eq("ad_signal_type", signalFilter);
    }
    const { data, error } = await query;
    if (error) {
        throw new Error(`Failed to load ad occurrences for metrics: ${error.message}`);
    }
    const metricsMap = new Map();
    for (const row of data ?? []) {
        const brandId = row.brand_id;
        const keywordId = row.keyword_id;
        const foundAt = row.found_at;
        const signalType = row.ad_signal_type;
        const brandJoin = row.brands;
        let accumulator = metricsMap.get(brandId);
        if (!accumulator) {
            accumulator = {
                brandId,
                normalizedDomain: brandJoin?.normalized_domain ?? "unknown",
                leadEligible: brandJoin?.lead_eligible ?? true,
                businessType: brandJoin?.business_type ?? "UNKNOWN",
                transparencyConfirmed: brandJoin?.transparency_confirmed ?? false,
                allKeywordIds: new Set(),
                confirmedKeywordIds: new Set(),
                candidateKeywordIds: new Set(),
                totalAdOccurrences: 0,
                confirmedPaidOccurrences: 0,
                candidatePaidOccurrences: 0,
                firstSeenAt: null,
                lastSeenAt: null,
            };
            metricsMap.set(brandId, accumulator);
        }
        accumulator.totalAdOccurrences += 1;
        if (keywordId) {
            accumulator.allKeywordIds.add(keywordId);
        }
        if (signalType === "CONFIRMED_PAID") {
            accumulator.confirmedPaidOccurrences += 1;
            if (keywordId) {
                accumulator.confirmedKeywordIds.add(keywordId);
            }
        }
        else if (signalType === "PAID_CANDIDATE") {
            accumulator.candidatePaidOccurrences += 1;
            if (keywordId) {
                accumulator.candidateKeywordIds.add(keywordId);
            }
        }
        if (foundAt && (!accumulator.firstSeenAt || foundAt < accumulator.firstSeenAt)) {
            accumulator.firstSeenAt = foundAt;
        }
        if (foundAt && (!accumulator.lastSeenAt || foundAt > accumulator.lastSeenAt)) {
            accumulator.lastSeenAt = foundAt;
        }
    }
    return Array.from(metricsMap.values())
        .map((entry) => ({
        brandId: entry.brandId,
        normalizedDomain: entry.normalizedDomain,
        uniquePaidKeywords: entry.allKeywordIds.size,
        totalAdOccurrences: entry.totalAdOccurrences,
        firstSeenAt: entry.firstSeenAt,
        lastSeenAt: entry.lastSeenAt,
        confirmedPaidKeywords: entry.confirmedKeywordIds.size,
        confirmedPaidOccurrences: entry.confirmedPaidOccurrences,
        candidatePaidKeywords: entry.candidateKeywordIds.size,
        candidatePaidOccurrences: entry.candidatePaidOccurrences,
        transparencyConfirmed: entry.transparencyConfirmed,
        leadEligible: entry.leadEligible,
        businessType: entry.businessType,
    }))
        .sort((a, b) => {
        if (b.confirmedPaidKeywords !== a.confirmedPaidKeywords) {
            return b.confirmedPaidKeywords - a.confirmedPaidKeywords;
        }
        if (b.confirmedPaidOccurrences !== a.confirmedPaidOccurrences) {
            return b.confirmedPaidOccurrences - a.confirmedPaidOccurrences;
        }
        return b.candidatePaidOccurrences - a.candidatePaidOccurrences;
    });
}
export async function getTopAdvertisersForRun(client, runId, signalFilter, limit = 10) {
    const { data, error } = await client
        .from("ad_occurrences")
        .select("brand_id")
        .eq("run_id", runId)
        .eq("ad_signal_type", signalFilter);
    if (error) {
        throw new Error(`Failed to load run advertisers: ${error.message}`);
    }
    const brandIds = [...new Set((data ?? []).map((row) => row.brand_id).filter(Boolean))];
    const metrics = await getBrandActivityMetrics(client, brandIds, signalFilter);
    return metrics.slice(0, limit);
}
export async function countBrandsByBusinessCategory(client) {
    const { data, error } = await client
        .from("brands")
        .select("business_type, lead_eligible, transparency_confirmed");
    if (error) {
        throw new Error(`Failed to count brands: ${error.message}`);
    }
    let leadEligible = 0;
    let majorRetailersExcluded = 0;
    let comparisonSitesExcluded = 0;
    let transparencyConfirmed = 0;
    for (const row of data ?? []) {
        if (row.lead_eligible) {
            leadEligible += 1;
        }
        if (row.business_type === "GENERAL_RETAILER" || row.business_type === "MARKETPLACE") {
            majorRetailersExcluded += 1;
        }
        if (row.business_type === "COMPARISON_SITE") {
            comparisonSitesExcluded += 1;
        }
        if (row.transparency_confirmed) {
            transparencyConfirmed += 1;
        }
    }
    return {
        leadEligible,
        majorRetailersExcluded,
        comparisonSitesExcluded,
        uniqueDomains: data?.length ?? 0,
        transparencyConfirmed,
    };
}
export async function countOccurrencesBySignal(client, runId) {
    let query = client
        .from("ad_occurrences")
        .select("confirmation_source, serp_item_type, ad_signal_type");
    if (runId) {
        query = query.eq("run_id", runId);
    }
    const { data, error } = await query;
    if (error) {
        throw new Error(`Failed to count occurrence signals: ${error.message}`);
    }
    let confirmedSearchAds = 0;
    let confirmedSponsoredShopping = 0;
    let genericShoppingCandidates = 0;
    let popularProductsCandidates = 0;
    for (const row of data ?? []) {
        const source = row.confirmation_source;
        const serpType = row.serp_item_type;
        const signal = row.ad_signal_type;
        if (source === "serp_paid_text" || serpType === "paid") {
            confirmedSearchAds += 1;
        }
        else if (source === "serp_sponsored_shopping") {
            confirmedSponsoredShopping += 1;
        }
        else if (signal === "PAID_CANDIDATE" && serpType === "shopping") {
            genericShoppingCandidates += 1;
        }
        else if (signal === "PAID_CANDIDATE" &&
            (serpType === "popular_products" || source === "serp_popular_products")) {
            popularProductsCandidates += 1;
        }
    }
    return {
        confirmedSearchAds,
        confirmedSponsoredShopping,
        genericShoppingCandidates,
        popularProductsCandidates,
    };
}
//# sourceMappingURL=brandMetricsService.js.map