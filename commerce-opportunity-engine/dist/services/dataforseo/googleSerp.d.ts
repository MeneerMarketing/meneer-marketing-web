import type { AxiosInstance } from "axios";
import type { Env } from "../../config/env.js";
import type { GoogleSerpFetchResult } from "../../types/discovery.js";
export interface GoogleSerpClientOptions {
    client: AxiosInstance;
    env: Env;
}
export declare function fetchGooglePaidAds(options: GoogleSerpClientOptions, keyword: string, fetchOptions?: {
    depth?: number;
}): Promise<GoogleSerpFetchResult>;
export declare function saveSerpFixture(path: string, responseData: Record<string, unknown>): Promise<void>;
//# sourceMappingURL=googleSerp.d.ts.map