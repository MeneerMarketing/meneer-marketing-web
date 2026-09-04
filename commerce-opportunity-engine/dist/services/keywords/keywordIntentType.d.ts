export type KeywordIntentType = "NON_BRANDED_PRODUCT" | "PRODUCT_BRANDED" | "RETAILER_BRANDED" | "BRAND_NAVIGATIONAL" | "REVIEW_RESEARCH" | "INFORMATIONAL" | "SERVICE" | "OTHER";
export interface KeywordIntentTypeResult {
    type: KeywordIntentType;
    confidence: number;
    reason: string;
}
export declare function classifyKeywordIntentType(input: {
    keyword: string;
    retailerTokens: Set<string>;
    productBrandTokens: Set<string>;
}): KeywordIntentTypeResult;
//# sourceMappingURL=keywordIntentType.d.ts.map