import type { ProductMerchantRelationship } from "../../config/commercialFit.js";
export interface ProductMerchantInput {
    productBrand: string | null;
    productName: string | null;
    shopName: string | null;
    domain: string;
    businessType: string | null;
    pageTitle: string | null;
    adHeadline: string | null;
}
export interface ProductMerchantResult {
    relationship: ProductMerchantRelationship;
    confidence: number;
    evidence: string[];
}
/**
 * Deterministic OWN_BRAND vs RESELLER_PRODUCT classifier.
 * Uses product brand vs shop/domain tokens — never hardcodes specific brands.
 */
export declare function classifyProductMerchantRelationship(input: ProductMerchantInput): ProductMerchantResult;
//# sourceMappingURL=productMerchantRelationship.d.ts.map