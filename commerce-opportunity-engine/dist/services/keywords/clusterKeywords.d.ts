import { type KeywordCategoryId } from "../../config/keywordCategories.js";
export declare function assignKeywordCluster(input: {
    keyword: string;
    categoryId: string;
    seedKeyword?: string | null;
}): string;
export declare function scoreCategoryRelevance(input: {
    keyword: string;
    categoryId: KeywordCategoryId | string;
    seedKeyword?: string | null;
    dfsCategories?: unknown;
}): number;
//# sourceMappingURL=clusterKeywords.d.ts.map