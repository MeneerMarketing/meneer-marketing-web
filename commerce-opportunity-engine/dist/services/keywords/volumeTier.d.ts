export type VolumeTier = "HIGH_VOLUME" | "MEDIUM_VOLUME" | "LOW_VOLUME" | "VERY_LOW_VOLUME" | "UNKNOWN";
export declare function classifyVolumeTier(searchVolume: number | null | undefined): VolumeTier;
/** Soft volume contribution 0-100 for quality scoring (never hard-filters). */
export declare function volumeScoreContribution(searchVolume: number | null | undefined): number;
//# sourceMappingURL=volumeTier.d.ts.map