/**
 * Discovery hook registry — M9.8.1 primary hook designation.
 */
export type DiscoveryHookId = "PDP_GAP_FIRST" | "ORGANIC_BRAND_FIRST" | "THIRD_PARTY_BRAND_MINING" | "ADS_FIRST";
export type DiscoveryHookStatus = "PRIMARY" | "SECONDARY" | "EXPERIMENTAL";
export declare const DISCOVERY_HOOKS: Record<DiscoveryHookId, {
    label: string;
    status: DiscoveryHookStatus;
    milestone: string;
}>;
export declare const PRIMARY_DISCOVERY_HOOK: DiscoveryHookId;
//# sourceMappingURL=discoveryHooks.d.ts.map