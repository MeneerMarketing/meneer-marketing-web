export interface PrequalifiedRankInput {
    id: string;
    domain: string;
    businessType: string | null;
    platform: string | null;
    maturity: number | null;
    retailerScale: number | null;
    preFit: number | null;
    uniqueSourceKeywords: number;
    avgProspecting: number | null;
    avgCategoryRelevance: number | null;
    /** 0-100 completeness of crawl/platform/maturity signals. */
    intelligenceCompleteness: number;
    confirmedAdvertiser: boolean;
    transparencyStatus: string | null;
    transparencyCheckedAt: string | null;
    transparencyApiStatus: string | null;
}
export interface RankedPrequalified extends PrequalifiedRankInput {
    verificationPriorityScore: number;
}
export declare function scoreVerificationPriority(input: PrequalifiedRankInput): number;
export declare function rankPrequalifiedForTransparency(items: PrequalifiedRankInput[]): RankedPrequalified[];
export declare function scoreConfirmedForTargetResolution(input: {
    preFit: number | null;
    maturity: number | null;
    platform: string | null;
    retailerScale: number | null;
    uniqueSourceKeywords: number;
    avgProspecting: number | null;
    nonBrandedSourceCount: number;
}): number;
export declare function scoreTargetPriority(input: {
    sourceQuality: number | null;
    brandPreFit: number | null;
    maturity: number | null;
    platform: string | null;
    keywordProspecting: number | null;
    isNonBranded: boolean;
    productSignals: number | null;
    targetConfidence: number | null;
}): number;
export declare function computeIntelligenceCompleteness(input: {
    platform: string | null;
    maturity: number | null;
    isEcommerce: boolean | null;
    businessType: string | null;
    lastCrawledAt: string | null;
    retailerScale: number | null;
}): number;
//# sourceMappingURL=verificationRanking.d.ts.map