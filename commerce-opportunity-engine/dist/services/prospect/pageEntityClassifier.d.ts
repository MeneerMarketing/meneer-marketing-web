/**
 * Milestone 9.8.1 — page_entity_type for PDP integrity.
 */
export type PageEntityType = "PRODUCT_DETAIL" | "CATEGORY" | "COLLECTION" | "OTHER_COMMERCE" | "INVALID";
export type PageEntityRejectReason = "CATEGORY" | "COLLECTION" | "SEARCH_RESULT" | "BRAND_OVERVIEW" | "PRODUCT_LISTING" | "CONFIGURATOR_OVERVIEW" | "SERVICE" | "FORM" | "CHECKOUT_LINK" | "INVALID" | null;
export declare function classifyPageEntityFromUrl(productUrl: string, domain: string): {
    pageEntityType: PageEntityType;
    rejectReason: PageEntityRejectReason;
    evidence: string[];
};
export declare function classifyPageEntity(input: {
    productUrl: string;
    domain: string;
    html?: string | null;
    productTitle?: string | null;
    observedPrice?: number | null;
}): {
    pageEntityType: PageEntityType;
    rejectReason: PageEntityRejectReason;
    isValidProductDetail: boolean;
    evidence: string[];
};
//# sourceMappingURL=pageEntityClassifier.d.ts.map