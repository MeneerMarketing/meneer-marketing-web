/**
 * Milestone 9.5 — PDP viewport capture for manual review.
 */
export type ViewportShot = {
    key: string;
    url: string;
    viewport: {
        width: number;
        height: number;
    };
};
export declare function dismissOverlays(page: import("playwright").Page): Promise<void>;
export declare function captureViewportScreenshots(input: {
    outputDir: string;
    domain: string;
    shots: ViewportShot[];
    timeoutMs: number;
}): Promise<Record<string, string>>;
//# sourceMappingURL=pdpViewportCapture.d.ts.map