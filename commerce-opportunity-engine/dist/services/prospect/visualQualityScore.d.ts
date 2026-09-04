/**
 * Milestone 9.9.2 — current_visual_quality_score bands.
 */
export type VisualQualityBand = "VERY_WEAK" | "WEAK" | "MODERATE" | "GOOD" | "STRONG" | "UNKNOWN";
export declare function visualQualityBand(score: number | null): VisualQualityBand;
export declare function isVisuallyUnderdesigned(currentVisualQuality: number | null, threshold?: number): boolean;
export declare function serpPositionBandExtended(rank: number | null): string;
//# sourceMappingURL=visualQualityScore.d.ts.map