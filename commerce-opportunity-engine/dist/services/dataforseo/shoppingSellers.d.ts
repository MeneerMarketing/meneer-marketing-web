import type { AxiosInstance } from "axios";
import type { Env } from "../../config/env.js";
export type ShoppingSellerOffer = {
    sellerName: string | null;
    domain: string | null;
    url: string | null;
    title: string | null;
    details: string | null;
    price: number | null;
    totalPrice: number | null;
    currency: string | null;
    shopAdAclk: string | null;
    productAvailability: string | null;
    raw: Record<string, unknown>;
};
export type ShoppingSellersResult = {
    productId: string;
    cost: number;
    offers: ShoppingSellerOffer[];
};
/**
 * Google Shopping Sellers — exact merchant offers + product URLs for a product_id.
 * @see https://docs.dataforseo.com/v3/merchant/google/sellers/task_post/
 */
export declare function fetchShoppingSellers(input: {
    client: AxiosInstance;
    env: Env;
    keyword: string;
    productId: string;
    depth?: number;
    maxWaitMs?: number;
}): Promise<ShoppingSellersResult>;
export declare function pickMatchingSellerOffer(offers: ShoppingSellerOffer[], preferredSeller: string | null): ShoppingSellerOffer | null;
/**
 * Pick seller offer that hard-matches the known brand domain.
 * Never returns a URL on a different domain.
 */
export declare function pickSellerOfferForBrandDomain(offers: ShoppingSellerOffer[], brandNormalizedDomain: string): ShoppingSellerOffer | null;
//# sourceMappingURL=shoppingSellers.d.ts.map