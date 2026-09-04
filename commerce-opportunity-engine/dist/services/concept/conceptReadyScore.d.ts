/**
 * Milestone 9 — Concept Ready score (deterministic).
 *
 * FORMULA (documented):
 *   raw = Σ (weight_i × component_i) for all CONCEPT_READY_WEIGHTS
 *   retailer_penalty = f(retailer_scale_score) using CONCEPT_RETAILER_SCALE_PENALTY
 *   concept_ready_score = clamp(0, 100, round(raw - retailer_penalty))
 *
 * Components are 0–100. Weights sum to 1.0.
 * CRO quality is NOT a direct weight (avoid double-counting); use pdpTransformationPotential.
 */
import { CONCEPT_READY_WEIGHTS, type BrandCommerceModel, type ConceptVerdict, type RecommendedConceptType } from "../../config/conceptScoring.js";
export type ConceptReadyInput = {
    mmOrPreFit: number;
    businessMaturity: number;
    platform: string | null;
    catalogFocus: number;
    brandCommerceModel: BrandCommerceModel;
    heroProductScore: number | null;
    productCommercialSignal: number;
    pdpTransformationPotential: number;
    conceptAssetReadiness: number;
    googleAdvertiserSignal: number;
    retailerScaleScore: number | null;
    /** For recommended concept type */
    isShopify: boolean;
    isWoo: boolean;
    mobileWeak: boolean | null;
    buyblockWeak: boolean | null;
    deepDiveWeak: boolean | null;
};
export type ConceptReadyResult = {
    concept_ready_score: number;
    concept_verdict: ConceptVerdict;
    recommended_concept_type: RecommendedConceptType;
    components: Record<string, number>;
    weights: typeof CONCEPT_READY_WEIGHTS;
    retailer_scale_penalty: number;
    formula: string;
};
export declare function retailerScalePenalty(scale: number | null): number;
/** Extra penalty for high-maturity multi-brand retailers without DTC fit. */
export declare function megaRetailerFitPenalty(input: {
    businessMaturity: number;
    ownBrandFit: number;
    platformFit: number;
    catalogFocus: number;
}): number;
export declare function recommendConceptType(input: ConceptReadyInput, score: number): RecommendedConceptType;
export declare function scoreConceptReady(input: ConceptReadyInput): ConceptReadyResult;
//# sourceMappingURL=conceptReadyScore.d.ts.map