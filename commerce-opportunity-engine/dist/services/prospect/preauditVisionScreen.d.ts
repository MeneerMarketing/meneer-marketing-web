/**
 * Milestone 9.5 — optional cheap Haiku vision adjustment for prequalified PDPs.
 *
 * Only runs after economic pre-screen. Never screens raw domains.
 */
import type { Env } from "../../config/env.js";
export type VisionScreenResult = {
    visualAdjustment: number;
    purchaseAdjustment: number;
    mobileAdjustment: number;
    presentationQuality: number | null;
    reasoning: string;
    estimatedCost: number;
};
export declare function screenPdpViewportWithVision(env: Env, domain: string, desktopScreenshotPath: string): Promise<VisionScreenResult>;
//# sourceMappingURL=preauditVisionScreen.d.ts.map