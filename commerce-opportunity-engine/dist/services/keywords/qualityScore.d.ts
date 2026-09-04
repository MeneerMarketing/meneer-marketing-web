export interface QualityScoreInput {
    commercialIntent: number;
    productIntent: number;
    searchVolume: number | null;
    cpc: number | null;
    competition: number | null;
    categoryRelevance: number;
}
/**
 * Balanced keyword_quality_score 0-100.
 * High commercial+product intent can beat higher volume broad terms.
 */
export declare function scoreKeywordQuality(input: QualityScoreInput): {
    score: number;
    breakdown: Record<string, number>;
};
//# sourceMappingURL=qualityScore.d.ts.map