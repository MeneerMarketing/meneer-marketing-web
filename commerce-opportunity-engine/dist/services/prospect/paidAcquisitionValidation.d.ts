/**
 * Milestone 9.6 — paid acquisition validation (bonus signal, not hard reject).
 */
import type { PaidAcquisitionLevel } from "../../config/brandFirstHighTicket.js";
import type { GoogleSerpClientOptions } from "../dataforseo/googleSerp.js";
export type PaidAcquisitionResult = {
    level: PaidAcquisitionLevel;
    evidence: string[];
    keywordsChecked: string[];
    matchedKeywords: string[];
};
export declare function validatePaidAcquisition(input: {
    domain: string;
    brandName: string;
    productKeywords: string[];
    serpOptions: GoogleSerpClientOptions;
    maxKeywords: number;
}): Promise<PaidAcquisitionResult & {
    cost: number;
}>;
export declare function paidAcquisitionBonus(level: PaidAcquisitionLevel): number;
//# sourceMappingURL=paidAcquisitionValidation.d.ts.map