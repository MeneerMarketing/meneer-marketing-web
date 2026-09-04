/**
 * Infer advertiser domain from Google Shopping / popular_products elements.
 */
export declare function inferDomainFromSeller(seller: string | null | undefined): string | null;
export declare function inferDomainFromDescription(description: string | null | undefined): string | null;
export declare function inferShoppingAdvertiserDomain(input: {
    seller?: string | null;
    description?: string | null;
    url?: string | null;
}): string | null;
//# sourceMappingURL=shoppingDomainInference.d.ts.map