/**
 * Milestone 9.6.1 — ecommerce purchase mode from PDP/homepage HTML.
 */
import type { PurchaseMode } from "../../config/brandFirstBalancedCalibration.js";
export type PurchaseModeResult = {
    purchaseMode: PurchaseMode;
    confidence: number;
    evidence: string[];
};
export declare function detectPurchaseMode(input: {
    html: string;
    url: string | null;
    heroPrice: number | null;
    isEcommerce: boolean | null;
}): PurchaseModeResult;
export declare function purchaseModeScore(mode: PurchaseMode): number;
//# sourceMappingURL=purchaseModeDetector.d.ts.map