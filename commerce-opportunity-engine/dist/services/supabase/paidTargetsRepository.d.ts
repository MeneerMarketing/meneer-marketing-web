import type { SupabaseClient } from "@supabase/supabase-js";
import type { LabsPaidKeywordItem } from "../dataforseo/rankedPaidKeywords.js";
import type { DomainMatchStatus } from "../shopping/domainValidation.js";
export declare function normalizeLandingUrl(url: string | null | undefined): string | null;
export type ShoppingTargetUpsertInput = {
    brandId: string;
    keyword: string;
    keywordId: string | null;
    itemType: string;
    title: string | null;
    description: string | null;
    seller: string | null;
    sellerDomain: string | null;
    price: number | null;
    currency: string | null;
    rankGroup: number | null;
    rankAbsolute: number | null;
    shopAdAclk: string | null;
    adUrl: string | null;
    adUrlRedirects: string[];
    landingUrl: string | null;
    productId: string | null;
    dataDocid: string | null;
    domainMatchStatus: DomainMatchStatus;
    dataQualityIssues: string[];
    domainMatched: boolean;
    resolvedAdUrl: boolean;
    rawPayload: Record<string, unknown>;
    observedAt: string;
};
export declare function upsertPaidSearchTargets(input: {
    client: SupabaseClient;
    brandId: string;
    items: LabsPaidKeywordItem[];
    observedAt: string;
}): Promise<{
    upserted: number;
    croReadyLandingCount: number;
}>;
export declare function upsertShoppingPaidTarget(client: SupabaseClient, input: ShoppingTargetUpsertInput): Promise<{
    id: string;
    croReady: boolean;
    sourceQualityScore: number;
    sourceType: string;
    croReadinessLevel: string;
    listingTargetConfidence: number | null;
    paidEvidenceConfidence: number | null;
    domainMatched: boolean;
}>;
/**
 * Upsert CRO-ready opportunity for an exact paid landing URL.
 * Merges Search + Shopping evidence onto one opportunity (no duplicates).
 */
export declare function upsertCroReadyOpportunityFromTarget(input: {
    client: SupabaseClient;
    brandId: string;
    targetId: string;
    keyword: string;
    keywordId: string | null;
    landingUrl: string;
    adTitle: string | null;
    adDescription: string | null;
    sourceType: string;
    sourceQualityScore: number;
    channel: "SEARCH" | "SHOPPING";
    discoverySerpItemType: string;
    confirmationSource: string;
    croReadinessLevel?: string;
    listingTargetConfidence?: number;
    paidEvidenceConfidence?: number;
}): Promise<{
    opportunityId: string;
    created: boolean;
}>;
/**
 * Build CRO-ready opportunities from paid_search_targets with concrete landing URLs.
 * Does NOT attach arbitrary brand products. Does NOT run Claude.
 */
export declare function generateOpportunitiesFromPaidTargets(client: SupabaseClient, brandId: string): Promise<{
    opportunitiesUpserted: number;
    croReady: number;
}>;
export declare function markBrandWaitingForPaidTarget(client: SupabaseClient, brandId: string, paidTargetsCount: number): Promise<void>;
//# sourceMappingURL=paidTargetsRepository.d.ts.map