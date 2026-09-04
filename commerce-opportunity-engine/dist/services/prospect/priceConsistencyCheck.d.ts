/**
 * Milestone 9.8.3 — generic product price consistency across HTML sources.
 */
import type { PriceConfidence } from "./highTicketGapSalesFit.js";
export interface PriceSourceReading {
    source: "json_ld" | "meta" | "dom_selector" | "visible_text";
    raw: string | null;
    value: number | null;
}
export interface PriceConsistencyResult {
    canonicalPrice: number | null;
    priceConfidence: PriceConfidence;
    sources: PriceSourceReading[];
    conflict: boolean;
    conflictReason: string | null;
    evidence: string[];
}
/** Parse NL/EU money strings (79,95 · 1.234,56 · 79.95). */
export declare function parseEuropeanMoneyAmount(raw: string): number | null;
export declare function assessPriceConsistency(input: {
    html: string;
    productUrl: string;
    primaryPrice: number | null;
}): PriceConsistencyResult;
//# sourceMappingURL=priceConsistencyCheck.d.ts.map