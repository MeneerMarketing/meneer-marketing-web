/**
 * Milestone 9.3.1 — keyword pre-gate.
 *
 * Runs before any SERP call. Buyer intent alone is never enough:
 * a keyword must also carry prospecting value for Meneer Marketing.
 */
import { type ArchetypeFitResult } from "./productArchetypeFit.js";
export type KeywordPreGateClass = "NON_BRANDED_SPECIFIC_PRODUCT" | "PROBLEM_SOLUTION_PRODUCT" | "HIGH_CONSIDERATION_PRODUCT" | "RETAILER_BRANDED" | "NAVIGATIONAL" | "REVIEW_RESEARCH" | "GENERIC_CATEGORY" | "VERY_BROAD_PRODUCT" | "PRODUCT_BRANDED_RESELLER";
declare const PRIORITY_CLASSES: KeywordPreGateClass[];
declare const REJECT_CLASSES: KeywordPreGateClass[];
export interface KeywordPreGateInput {
    keyword: string;
    searchVolume?: number | null;
    cpc?: number | null;
    /** Optional richer brand token set (from DB) for reseller detection. */
    productBrandTokens?: Set<string>;
}
export interface KeywordPreGateResult {
    keyword: string;
    preGateClass: KeywordPreGateClass;
    accepted: boolean;
    rejectReason: string | null;
    archetype: ArchetypeFitResult;
    /** 0-100 prospecting value, deliberately independent of commercial intent. */
    prospectingValue: number;
    commercialIntent: number;
    signals: string[];
}
/** Commercial intent, kept separate so the difference stays visible. */
export declare function scoreCommercialIntent(input: KeywordPreGateInput): number;
export declare function evaluateKeywordPreGate(input: KeywordPreGateInput): KeywordPreGateResult;
export { PRIORITY_CLASSES as KEYWORD_PRIORITY_CLASSES, REJECT_CLASSES as KEYWORD_REJECT_CLASSES };
//# sourceMappingURL=keywordPreGate.d.ts.map