import type { AxiosInstance } from "axios";
import type { Env } from "../../config/env.js";
export type ShoppingPaidItemType = "google_shopping_paid" | "google_shopping_sponsored_carousel_element" | "google_shopping_serp";
export type ShoppingPaidListing = {
    itemType: ShoppingPaidItemType;
    keyword: string;
    title: string | null;
    description: string | null;
    seller: string | null;
    domain: string | null;
    price: number | null;
    currency: string | null;
    rankGroup: number | null;
    rankAbsolute: number | null;
    shopAdAclk: string | null;
    /** Deprecated by DataForSEO; may still appear in some responses */
    url: string | null;
    productId: string | null;
    dataDocid: string | null;
    raw: Record<string, unknown>;
};
export type ShoppingProductsResult = {
    keyword: string;
    taskId: string;
    cost: number;
    itemTypes: string[];
    itemsCount: number;
    paidItems: ShoppingPaidListing[];
    rawResult: Record<string, unknown> | null;
};
/**
 * Extract explicit paid Shopping evidence from Merchant Products results.
 *
 * - google_shopping_paid: always include (classic Shopping text ads)
 * - google_shopping_sponsored_carousel_element: sponsored = paid
 * - google_shopping_serp: ONLY when shop_ad_aclk is present (resolvable seller ad URL).
 *   Without aclk these are product cards without paid-URL proof.
 *
 * Never treat organic SERP popular_products as Shopping paid.
 */
export declare function extractPaidShoppingListings(keyword: string, items: unknown[]): ShoppingPaidListing[];
/**
 * DataForSEO Merchant Google Shopping Products (Standard POST + GET).
 * @see https://docs.dataforseo.com/v3/merchant/google/products/task_post/
 */
export declare function fetchShoppingPaidListings(input: {
    client: AxiosInstance;
    env: Env;
    keyword: string;
    depth: number;
    maxWaitMs?: number;
}): Promise<ShoppingProductsResult>;
//# sourceMappingURL=shoppingProducts.d.ts.map