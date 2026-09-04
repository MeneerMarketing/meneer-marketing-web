/**
 * Milestone 9.6.1 — per-family yield and verdict for calibration.
 */
import type { FamilyVerdict } from "../../config/brandFirstBalancedCalibration.js";
export type FamilyYieldRow = {
    familyId: string;
    familyLabel: string;
    queriesTested: number;
    organicRows: number;
    candidateBrands: number;
    validatedFirstParty: number;
    economicQualified: number;
    designGapScreened: number;
    highGapBrands: number;
    firstPartyYield: number;
    economicYield: number;
    designGapYield: number;
    verdict: FamilyVerdict;
    verdictReason: string;
};
export type FamilyYieldCandidate = {
    productFamilyId: string;
    productFamilyLabel: string;
    firstPartyConfidence: number;
    economicQualified: boolean;
    designGapScreened: boolean;
    preauditVisualGap: number | null;
    preauditPurchaseGap: number | null;
    contentPresentation: number | null;
};
export declare function computeFamilyYieldAnalytics(input: {
    queriesByFamily: Map<string, number>;
    organicRowsByFamily: Map<string, number>;
    candidates: FamilyYieldCandidate[];
    highGapVisualMin: number;
    highGapPurchaseMin: number;
}): FamilyYieldRow[];
export declare function recommendProductionFamilies(rows: FamilyYieldRow[]): string[];
//# sourceMappingURL=familyYieldAnalytics.d.ts.map