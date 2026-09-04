/**
 * Milestone 9.9.5 — screenshot capture health before visual scoring.
 */
export type CaptureHealth = "VALID_CONTENT" | "PARTIAL_CONTENT" | "BOT_CHALLENGE" | "ACCESS_DENIED" | "ERROR_PAGE" | "EMPTY" | "TIMEOUT" | "UNKNOWN";
export type CaptureConfidence = "HIGH" | "MEDIUM" | "LOW";
export type VisualScoreSource = "LIVE_VALID_CAPTURE" | "CACHED_VALID_CAPTURE" | "INVALID_CAPTURE" | "MISSING";
export declare function classifyCaptureHealthFromText(input: {
    visionReasoning?: string | null;
    manualLook?: string | null;
    htmlSnippet?: string | null;
}): {
    health: CaptureHealth;
    confidence: CaptureConfidence;
    visionScoreAllowed: boolean;
    evidence: string[];
};
export declare function classifyCaptureHealthFromScreenshot(input: {
    screenshotPath: string | null | undefined;
    visionReasoning?: string | null;
    manualLook?: string | null;
    htmlSnippet?: string | null;
    liveCapture?: boolean;
}): Promise<{
    health: CaptureHealth;
    confidence: CaptureConfidence;
    visionScoreAllowed: boolean;
    visualScoreSource: VisualScoreSource;
    evidence: string[];
}>;
export declare function nullVisualScoresWhenCaptureInvalid(input: {
    visionScoreAllowed: boolean;
    currentVisualQualityScore: number | null;
    visualGap: number | null;
    purchaseGap: number | null;
    mobileGap: number | null;
    preauditVisualGap?: number | null;
}): {
    currentVisualQualityScore: number | null;
    visualGap: number | null;
    purchaseGap: number | null;
    mobileGap: number | null;
    visuallyUnderdesigned: boolean | null;
};
//# sourceMappingURL=captureHealthClassifier.d.ts.map