/**
 * Milestone 9.7 — first-party store classification gate.
 */
import type { FirstPartyStoreClass } from "../../config/thirdPartyBrandMining.js";
import type { LightBrandCheckResult } from "./lightBrandCheck.js";
import type { PurchaseMode } from "../../config/brandFirstBalancedCalibration.js";
export declare function classifyFirstPartyStore(input: {
    light: LightBrandCheckResult | null;
    purchaseMode: PurchaseMode;
    hasProductPages: boolean;
    heroPrice: number | null;
}): {
    storeClass: FirstPartyStoreClass;
    evidence: string[];
};
export declare function passesDtcEcommerceGate(storeClass: FirstPartyStoreClass): boolean;
//# sourceMappingURL=firstPartyStoreGate.d.ts.map