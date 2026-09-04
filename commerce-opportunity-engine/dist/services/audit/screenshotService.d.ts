import { type Response } from "playwright";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ScreenshotPaths } from "../../types/audit.js";
export interface CaptureScreenshotsResult {
    paths: ScreenshotPaths;
    html: string;
    finalUrl: string;
    httpStatus: number | null;
    errors: string[];
    attempts: number;
}
export declare function captureOpportunityScreenshots(input: {
    supabase: SupabaseClient;
    bucket: string;
    brandId: string;
    opportunityId: string;
    url: string;
    timeoutMs?: number;
    maxRetries?: number;
    retryDelayMs?: number;
}): Promise<CaptureScreenshotsResult>;
export declare function hashPageContent(html: string, representationJson: string): string;
export declare function createSignedScreenshotUrls(supabase: SupabaseClient, bucket: string, paths: ScreenshotPaths, expiresInSeconds?: number): Promise<Record<string, string | null>>;
export declare function downloadScreenshotBuffers(supabase: SupabaseClient, bucket: string, paths: ScreenshotPaths): Promise<{
    mobilePng?: Buffer;
    desktopPng?: Buffer;
}>;
/** Exported for health checks that need response status from a single navigation. */
export type { Response };
//# sourceMappingURL=screenshotService.d.ts.map