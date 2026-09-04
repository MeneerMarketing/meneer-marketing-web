/**
 * Milestone 9 — brand-level commerce model from existing merchant relationship + brand signals.
 */
import type { BrandCommerceModel } from "../../config/conceptScoring.js";
export type OwnBrandIntelligenceInput = {
    businessType: string | null;
    productMerchantRelationship: string | null;
    productMerchantConfidence: number | null;
    productMerchantEvidence: unknown;
    retailerScaleScore: number | null;
    domain: string;
    productBrand: string | null;
    distinctProductBrands: number;
};
export type OwnBrandIntelligenceResult = {
    brand_commerce_model: BrandCommerceModel;
    own_brand_ratio_estimate: number | null;
    own_brand_confidence: number;
    own_brand_evidence: string[];
};
export declare function scoreOwnBrandIntelligence(input: OwnBrandIntelligenceInput): OwnBrandIntelligenceResult;
//# sourceMappingURL=ownBrandIntelligence.d.ts.map