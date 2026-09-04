export interface PaidSearchAd {
    keyword: string;
    advertiserDomain: string;
    normalizedDomain: string;
    headline: string | null;
    description: string | null;
    displayedUrl: string | null;
    landingUrl: string | null;
    rank: number | null;
    brandName: string | null;
    timestamp: string;
    serpItemType: string;
    rawItem: Record<string, unknown>;
}
/**
 * A shopping ad whose advertiser domain the SERP item did not spell out. It
 * keeps every field a PaidSearchAd needs, so a later resolution step can turn
 * it into a real ad once the seller's domain is verified.
 */
export interface UnresolvedShoppingAd {
    keyword: string;
    seller: string;
    headline: string | null;
    description: string | null;
    landingUrl: string | null;
    rank: number | null;
    timestamp: string;
    serpItemType: string;
    rawItem: Record<string, unknown>;
}
export interface GoogleSerpFetchResult {
    keyword: string;
    paidAds: PaidSearchAd[];
    shoppingAdCount: number;
    otherPaidLikeCount: number;
    /**
     * Shopping sellers whose domain could not be resolved from the SERP item.
     * These are dropped from discovery, and they are disproportionately the small
     * specialists we are looking for, so the loss must stay visible.
     */
    unresolvedShoppingSellers: string[];
    unresolvedShoppingAds: UnresolvedShoppingAd[];
    organicResults: OrganicSerpResult[];
    cost: number;
    rawResponse: Record<string, unknown>;
}
/** Organic SERP row for brand-first discovery (not paid placement). */
export interface OrganicSerpResult {
    keyword: string;
    title: string | null;
    description: string | null;
    url: string | null;
    normalizedDomain: string;
    rank: number | null;
    timestamp: string;
    /** Heuristic: likely multi-brand retailer vs possible first-party brand. */
    likelyRetailer: boolean;
    rawItem: Record<string, unknown>;
}
export interface DiscoveryRunStats {
    keywordsProcessed: number;
    keywordsWithAds: number;
    paidAdsFound: number;
    uniqueAdvertisers: number;
    blacklistedAdvertisers: number;
    newBrands: number;
    existingBrands: number;
    adOccurrencesStored: number;
    errors: number;
    dataForSeoCost: number;
    serpCost: number;
    transparencyCost: number;
    confirmedSearchAds: number;
    confirmedSponsoredShopping: number;
    transparencyConfirmed: number;
    genericShoppingCandidates: number;
    popularProductsCandidates: number;
    uniqueDomains: number;
    leadEligible: number;
    majorRetailersExcluded: number;
    comparisonSitesExcluded: number;
    reclassifiedOccurrences: number;
    transparencyChecksRun: number;
    runId?: string;
}
export interface BrandActivityMetrics {
    brandId: string;
    normalizedDomain: string;
    uniquePaidKeywords: number;
    totalAdOccurrences: number;
    firstSeenAt: string | null;
    lastSeenAt: string | null;
    confirmedPaidKeywords: number;
    confirmedPaidOccurrences: number;
    candidatePaidKeywords: number;
    candidatePaidOccurrences: number;
    transparencyConfirmed: boolean;
    leadEligible: boolean;
    businessType: string;
}
export interface KeywordRecord {
    id: string;
    keyword: string;
    locale: string | null;
    category: string | null;
    active: boolean;
    last_scanned_at: string | null;
}
export interface BrandRecord {
    id: string;
    name: string;
    domain: string | null;
    normalized_domain: string | null;
    first_seen_at: string | null;
    last_seen_at: string | null;
    scan_count: number;
    confirmed_google_advertiser?: boolean;
    confirmation_source?: string | null;
    business_type?: string;
    lead_eligible?: boolean;
    excluded_reason?: string | null;
    transparency_confirmed?: boolean;
}
//# sourceMappingURL=discovery.d.ts.map