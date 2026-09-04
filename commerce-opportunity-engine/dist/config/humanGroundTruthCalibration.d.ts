/**
 * Milestone 9.9.7 — human ground truth calibration fixtures.
 * Used for regression/evaluator calibration only. No domain hardcoded penalties in scoring.
 */
export type HumanGroundTruthOutcome = "NO_FIRST_SHOWCASE" | "KEEP_NO_FIRST_SHOWCASE" | "REJECT_FIRST_SHOWCASE";
export type HumanGroundTruthFixture = {
    domain: string;
    label: string;
    expectedLikelihood: "STRONG" | "POSSIBLE" | "WEAK" | "NO";
    expectedImpression: "CLEARLY_UNDERDESIGNED" | "BASIC_BUT_ACCEPTABLE" | "MODERN_ENOUGH" | "PREMIUM";
    expectedOutcome: HumanGroundTruthOutcome;
    reasons: string[];
    /** Optional signals for offline calibration when live crawl unavailable. */
    proxySignals?: {
        catalogEstimate?: number | null;
        catalogVerified?: boolean;
        categoryLinks?: number;
        externalBrandBreadth?: number;
        currentVisualQualityScore?: number | null;
        companyScaleFit?: number | null;
        refinedBusinessModel?: string;
    };
};
export declare const M997_HUMAN_GROUND_TRUTH_FIXTURES: HumanGroundTruthFixture[];
//# sourceMappingURL=humanGroundTruthCalibration.d.ts.map