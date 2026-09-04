/**
 * Milestone 9.3.4 — concept_contrast_potential.
 *
 * Deliberately separate from business classification. A shop may be a textbook
 * prospect (own brand, international, mature, real ad spend) and still score
 * near zero here, because its product page is already premium and our preview
 * would not surprise anyone.
 *
 * Reads as: room on the page, scaled by our ability to build something better.
 */
import type { CroDataSource } from "./outreachScoring.js";
export type ConceptContrastInput = {
    /** Audited composite of the current product page, 0-100. */
    currentPdpQuality: number | null;
    /** Cheaper composite used when no audit exists. */
    croQualityComposite: number | null;
    croDataSource: CroDataSource;
    auditConfidence: number | null;
    /** How premium the page already looks today. */
    visualDesignQuality: number | null;
    productStorytellingQuality: number | null;
    productPresentationQuality: number | null;
    deepDiveQuality: number | null;
    /** Optional: callers without an audit fall back to the overall page quality. */
    buyblockQuality?: number | null;
    mobilePurchaseQuality?: number | null;
    /** What we would have to work with when building the premium version. */
    conceptAssetReadiness: number | null;
    productCommercialSignal: number | null;
    catalogFocus: number | null;
    businessMaturity: number | null;
    brandCommerceModel: string;
    productDescriptionLength: number;
    reviewCount: number | null;
    siteTechnicallyBroken: boolean;
};
export type ConceptContrastResult = {
    concept_contrast_potential: number;
    band: string;
    confidence: number;
    roomScore: number;
    capabilityScore: number;
    capabilityFactor: number;
    ceilingApplied: string | null;
    evidence: string[];
};
export declare function computeConceptContrastPotential(input: ConceptContrastInput): ConceptContrastResult;
/** Convenience for gates and reports. */
export declare function contrastBlocksDesignTarget(score: number | null): boolean;
export declare const CONTRAST_BAND_ORDER: ("ZEER_HOOG" | "HOOG" | "GEMIDDELD" | "LAAG" | "GEEN_CONTRAST")[];
//# sourceMappingURL=conceptContrastPotential.d.ts.map