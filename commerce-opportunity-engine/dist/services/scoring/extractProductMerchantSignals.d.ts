export type ExtractedProductSignals = {
    productBrand: string | null;
    productName: string | null;
    shopName: string | null;
    pageTitle: string | null;
    evidence: string[];
};
/**
 * Extract brand/product/shop signals from HTML (JSON-LD + meta + title).
 * Used for product_merchant_relationship — never hardcodes specific brands.
 */
export declare function extractProductMerchantSignals(html: string, url: string): ExtractedProductSignals;
//# sourceMappingURL=extractProductMerchantSignals.d.ts.map