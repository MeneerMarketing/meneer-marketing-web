export interface DiscoveryPriorityInput {
    prospectingValue: number | null;
    keywordQuality: number | null;
    commercialIntent: number | null;
    productIntent: number | null;
    /** null = unknown → use neutral, do NOT treat as 0 */
    historicalYield: number | null;
    /** unique domains from prior scans; null = unknown */
    uniqueDomainsFound: number | null;
    retailerRatio: number | null;
    /** null = unknown → neutral 55 */
    categoryRelevance: number | null;
}
export declare function scoreDiscoveryPriority(input: DiscoveryPriorityInput): {
    score: number;
    breakdown: Record<string, number>;
};
//# sourceMappingURL=discoveryPriority.d.ts.map