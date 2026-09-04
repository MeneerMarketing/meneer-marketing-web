/**
 * Milestone 9.9.2 — strict cheap vision for visual underdesign detection.
 */
import type { Env } from "../../config/env.js";
export type VisualRedesignVisionResult = {
    currentVisualQuality: number | null;
    visualAdjustment: number;
    purchaseAdjustment: number;
    mobileAdjustment: number;
    templateDriven: boolean;
    artDirectionWeak: boolean;
    reasoning: string;
    estimatedCost: number;
};
export declare function screenPdpVisualRedesignWithVision(env: Env, domain: string, desktopScreenshotPath: string): Promise<VisualRedesignVisionResult>;
//# sourceMappingURL=visualRedesignVisionScreen.d.ts.map