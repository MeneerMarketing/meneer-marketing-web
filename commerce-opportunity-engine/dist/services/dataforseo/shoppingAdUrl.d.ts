import type { AxiosInstance } from "axios";
export type ShoppingAdUrlResolution = {
    shopAdAclk: string;
    adUrl: string | null;
    adUrlRedirects: string[];
    finalUrl: string | null;
    finalDomain: string | null;
    cost: number;
    raw: Record<string, unknown> | null;
};
/**
 * Resolve seller landing URL from shop_ad_aclk.
 * @see https://docs.dataforseo.com/v3/merchant/google/sellers/ad_url/
 */
export declare function resolveShoppingAdUrl(input: {
    client: AxiosInstance;
    shopAdAclk: string;
}): Promise<ShoppingAdUrlResolution>;
//# sourceMappingURL=shoppingAdUrl.d.ts.map