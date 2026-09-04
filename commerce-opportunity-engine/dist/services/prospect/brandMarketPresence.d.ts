/**
 * Milestone 9.7 — brand market presence from independent third-party sources.
 */
import type { ThirdPartySourceType } from "../../config/thirdPartyBrandMining.js";
export type SourceObservation = {
    sourceDomain: string;
    sourceType: ThirdPartySourceType;
    sourceUrl: string | null;
    discoverySourceQuality: "HIGH" | "MEDIUM" | "LOW";
};
export declare function computeBrandMarketPresenceScore(observations: SourceObservation[]): {
    score: number;
    independentSourceCount: number;
    evidence: string[];
};
//# sourceMappingURL=brandMarketPresence.d.ts.map