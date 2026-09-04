/**
 * Milestone 9.3 — TRUE_SALES_CANDIDATE ranking (existing + new audited pool).
 */
import type { ProspectPoolEntry } from "../concept/loadConceptProspectPool.js";
export type TrueSalesRankedRow = {
    domain: string;
    conceptId: string;
    category: string | null;
    platform: string | null;
    commerceModel: string;
    catalogFocus: number | null;
    catalogSize: number | null;
    heroProduct: string | null;
    productPrice: number | null;
    adsStatus: string;
    currentPdpQuality: number | null;
    conceptContrast: number;
    contrastBand: string;
    contrastCeiling: string | null;
    transformation: number | null;
    assetReadiness: number | null;
    deepDiveFit: number;
    economicFit: number;
    salesFit: number;
    scoreConfidence: number;
    croDataSource: string;
    engineeringFixture: boolean;
    contrastGatePass: boolean;
    contrastBlocked: string[];
    idealPreScore: number | null;
    source: "EXISTING_POOL" | "M93_NEW";
};
export type TrueSalesWinnerResult = {
    recommended: TrueSalesRankedRow | null;
    runnerUps: TrueSalesRankedRow[];
    why: string[];
    note: string;
};
export declare function evaluateStrongContrastGate(input: {
    currentPdpQuality: number | null;
    conceptContrast: number;
    contrastBand: string;
    transformation: number | null;
    assetReadiness: number | null;
    deepDiveFit: number;
    salesFit: number;
    auditConfidence: number | null;
    scoreConfidence: number;
    croDataSource: string;
    pageHealthOk: boolean;
    confirmedAdvertiser: boolean;
}): {
    passes: boolean;
    blocked: string[];
};
export declare function rankTrueSalesCandidates(entries: ProspectPoolEntry[], idealPreScores: Map<string, number>, newBrandIds: Set<string>): TrueSalesRankedRow[];
export declare function selectTrueSalesDesignTarget(ranked: TrueSalesRankedRow[]): TrueSalesWinnerResult;
//# sourceMappingURL=trueSalesRanking.d.ts.map