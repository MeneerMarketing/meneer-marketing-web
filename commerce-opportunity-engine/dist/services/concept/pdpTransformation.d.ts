/**
 * Milestone 9 — PDP transformation potential.
 * NOT simply 100 - CRO quality. Needs room to improve + product/asset fit.
 */
export type PdpTransformInput = {
    croQualityScore: number | null;
    leakCount: number;
    strengthCount: number;
    productCommercialSignal: number;
    assetReadiness: number;
    catalogFocus: number;
    brandCommerceModel: string;
    retailerScaleScore: number | null;
    mmFitScore: number | null;
    siteTechnicallyBroken: boolean;
    storytellingWeak: boolean | null;
    aboveFoldWeak: boolean | null;
    trustNearBuyblockWeak: boolean | null;
    deepDiveWeak: boolean | null;
};
export declare function scorePdpTransformationPotential(input: PdpTransformInput): {
    pdp_transformation_potential: number;
    evidence: string[];
};
//# sourceMappingURL=pdpTransformation.d.ts.map