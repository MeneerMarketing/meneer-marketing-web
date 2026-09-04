/**
 * Milestone 9.5.1 — wide cheap design-gap screen on existing M9.5 pool.
 */
export declare const M951_DISCOVERY_VERSION: "DESIGN_GAP_WIDE_SCREEN_V1";
export declare const M951_WIDE_SCREEN: {
    readonly milestone: "M9.5.1";
    /** Max domains with viewport capture + optional vision. */
    readonly maxViewportScreens: 25;
    readonly maxVisionScreens: 25;
    readonly crawlTimeoutMs: 20000;
    readonly screenshotDir: "m9.5.1-screenshots";
    readonly desktop: {
        readonly width: 1440;
        readonly height: 1000;
    };
    readonly mobile: {
        readonly width: 390;
        readonly height: 844;
    };
    readonly screenshotTimeoutMs: 45000;
    readonly combinedTopN: 10;
    readonly designGapTopN: 10;
};
/** Calibration bands — not hard gates. */
export declare const GAP_SCORE_BANDS: {
    readonly veryHighMin: 75;
    readonly highMin: 60;
    readonly mediumMin: 40;
};
export type GapScoreBand = "VERY_HIGH" | "HIGH" | "MEDIUM" | "LOW";
export declare function gapScoreBand(score: number | null): GapScoreBand;
//# sourceMappingURL=designGapWideScreen.d.ts.map