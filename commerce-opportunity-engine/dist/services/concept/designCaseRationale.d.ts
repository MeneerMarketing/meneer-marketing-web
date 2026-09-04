/**
 * Milestone 9.3.4 — internal rationale per design case.
 *
 * Composed from measured audit data, not from a second Claude call. Every line
 * has to be traceable to a score, a leak or a discovery signal, because this is
 * what we use to decide where the design effort goes.
 */
import type { ConversionLeak } from "../../types/audit.js";
export interface DesignCaseInput {
    domain: string;
    branchLabel: string;
    familyLabel: string;
    businessType: string | null;
    platform: string | null;
    commerceModel: string;
    estimatedCatalogSize: number | null;
    catalogFocus: number | null;
    ownBrandSignal: number | null;
    businessMaturity: number | null;
    adKeywords: string[];
    heroProduct: string | null;
    heroPrice: number | null;
    heroCurrency: string | null;
    reviewCount: number | null;
    rating: number | null;
    currentPdpQuality: number | null;
    subScores: {
        buyblock: number | null;
        visual: number | null;
        storytelling: number | null;
        media: number | null;
        deepDive: number | null;
        mobile: number | null;
    };
    assetReadiness: number | null;
    transformation: number | null;
    contrastRoom: number | null;
    contrastCapability: number | null;
    conceptContrast: number | null;
    deepDiveFit: number | null;
    economicFit: number | null;
    salesFit: number | null;
    leaks: ConversionLeak[];
    strengths: Array<{
        title: string;
    }>;
}
export interface DesignCaseRationale {
    business: string[];
    product: string[];
    pdpProblems: string[];
    ourImprovements: string[];
    beforeAfter: string[];
}
export declare function buildDesignCaseRationale(input: DesignCaseInput): DesignCaseRationale;
//# sourceMappingURL=designCaseRationale.d.ts.map