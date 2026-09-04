export interface CategoryRelevanceResult {
    score: number;
    reasons: string[];
    matchedAllow: string[];
    matchedDeny: string[];
}
/**
 * Deterministic category_relevance_score 0-100.
 * High commercial intent alone is not enough — keyword must fit the category.
 */
export declare function scoreCategoryRelevance(keyword: string, categoryId: string, cluster?: string | null): CategoryRelevanceResult;
//# sourceMappingURL=categoryRelevance.d.ts.map