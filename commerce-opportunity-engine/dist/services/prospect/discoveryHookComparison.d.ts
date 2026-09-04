/**
 * Milestone 9.8 — compare all discovery hooks including PDP-gap-first.
 */
export type HookMetrics = {
    milestone: string;
    brandsDiscovered: number;
    firstPartyDtcRate: number | null;
    economicQualifiedRate: number | null;
    designGapScreenRate: number | null;
    highGapRate: number | null;
    trueManualReview: number;
};
export type PdpGapFirstHookMetrics = {
    milestone: string;
    validPdpsScreened: number;
    highGapCount: number;
    highGapRate: number | null;
    goodBusinessAfterGap: number;
    goodBusinessAfterGapRate: number | null;
    potentialTargets: number;
    potentialTargetRate: number | null;
    trueManualReview: number;
};
export type DiscoveryHookComparison = {
    adsFirst: HookMetrics | null;
    organicFirstParty: HookMetrics | null;
    organicBalanced: HookMetrics | null;
    thirdPartyMining: HookMetrics | null;
    pdpGapFirst: PdpGapFirstHookMetrics | null;
    note: string;
};
export declare function buildDiscoveryHookComparison(projectRoot: string): Promise<DiscoveryHookComparison>;
//# sourceMappingURL=discoveryHookComparison.d.ts.map