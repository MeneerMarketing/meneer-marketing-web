import { type FindingValidationStatus, type SourceType } from "../../config/sourceIntegrityWeights.js";
export type IntegrityAd = {
    id: string;
    keywordId: string | null;
    keyword: string | null;
    category: string | null;
    headline: string | null;
    description: string | null;
    landingUrl: string | null;
    serpItemType: string | null;
    adSignalType: string | null;
    confirmationSource: string | null;
};
export type IntegrityPage = {
    productName: string | null;
    url: string | null;
    finalUrl: string | null;
    productResolutionConfidence: number | null;
};
export type PrimaryKeywordResult = {
    keywordId: string | null;
    keyword: string | null;
    category: string | null;
    confidence: number;
    reason: string;
    candidates: Array<{
        keywordId: string;
        keyword: string;
        score: number;
    }>;
};
export type SourceQualityResult = {
    sourceQualityScore: number;
    sourceType: SourceType;
    discoverySerpItemType: string | null;
    discoveryConfirmationSource: string | null;
    notes: Record<string, unknown>;
    adProductMatch: number;
    keywordProductMatch: number;
};
export declare function scoreKeywordCandidate(input: {
    ad: IntegrityAd;
    page: IntegrityPage | null;
    isPrimaryAd: boolean;
}): number;
export declare function selectPrimaryKeyword(input: {
    ads: IntegrityAd[];
    primaryAdId: string | null;
    page: IntegrityPage | null;
}): PrimaryKeywordResult;
export declare function classifySourceType(ad: IntegrityAd | null): SourceType;
export declare function computeSourceQuality(input: {
    primaryAd: IntegrityAd | null;
    page: IntegrityPage | null;
    primaryKeyword: PrimaryKeywordResult;
}): SourceQualityResult;
export declare function applySourceQualityCap(opportunityScore: number, sourceQualityScore: number, sourceType?: string | null): {
    cappedScore: number;
    capApplied: number | null;
};
export declare function explainOpportunityScore(components: Record<string, number>, penalty: number, weightOverrides?: Record<string, number>): {
    lines: Array<{
        label: string;
        value: number;
        weight: number;
        contribution: number;
    }>;
    weightedSum: number;
    final: number;
};
export declare function validateConversionLeaks(input: {
    leaks: Array<Record<string, unknown>>;
    pageRepresentation: Record<string, unknown> | null;
    adHeadline: string | null;
    productName: string | null;
    keyword: string | null;
}): Array<{
    title: string;
    status: FindingValidationStatus;
    reason: string;
}>;
//# sourceMappingURL=sourceIntegrity.d.ts.map