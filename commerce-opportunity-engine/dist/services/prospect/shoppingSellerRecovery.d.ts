/**
 * Milestone 9.3.2 — recovering shopping ads that lost their domain.
 *
 * Google Shopping items frequently carry a seller name and nothing else. Those
 * sellers skew heavily towards the small specialists we want, so silently
 * dropping them means the calibration measures our parser instead of the
 * market. This turns verified sellers back into normal PaidSearchAd records so
 * the rest of the pipeline treats them like any other advertiser.
 *
 * Costs nothing at DataForSEO: verification is a single HTTP probe per
 * candidate domain.
 */
import type { PaidSearchAd, UnresolvedShoppingAd } from "../../types/discovery.js";
import { type SellerDomainResolution } from "./sellerDomainResolver.js";
export interface ShoppingSellerRecoveryResult {
    recovered: PaidSearchAd[];
    /** Sellers we still could not tie to a live domain, with the reason. */
    stillUnresolved: Array<{
        seller: string;
        reason: string;
    }>;
    resolutions: SellerDomainResolution[];
}
export interface ShoppingSellerRecoveryOptions {
    timeoutMs: number;
    /** Shared across keywords so a repeated seller is probed only once. */
    cache?: Map<string, SellerDomainResolution>;
    /** Guards runtime when a SERP dumps a long tail of sellers. */
    maxSellers?: number;
}
export declare function recoverShoppingSellerAds(unresolvedAds: UnresolvedShoppingAd[], options: ShoppingSellerRecoveryOptions): Promise<ShoppingSellerRecoveryResult>;
//# sourceMappingURL=shoppingSellerRecovery.d.ts.map