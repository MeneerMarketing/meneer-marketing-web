import type { PlatformDetectionResult } from "../../types/crawler.js";
/** Definitive platform only at or above this confidence. */
export declare const PLATFORM_CONFIRM_THRESHOLD = 0.8;
/** Candidate platform retained between this and confirm threshold. */
export declare const PLATFORM_CANDIDATE_THRESHOLD = 0.5;
export declare function detectPlatform(html: string, finalUrl: string): PlatformDetectionResult;
/** Merge platform evidence across homepage + secondary pages. */
export declare function mergePlatformDetections(detections: PlatformDetectionResult[]): PlatformDetectionResult;
//# sourceMappingURL=platformDetector.d.ts.map