import type { AxiosInstance } from "axios";
import type { Env } from "../../config/env.js";
import type { GoogleAdsTransparencyResult } from "../../types/signals.js";
export interface GoogleAdsTransparencyClientOptions {
    client: AxiosInstance;
    env: Env;
}
export declare function checkGoogleAdsTransparency(options: GoogleAdsTransparencyClientOptions, domain: string): Promise<GoogleAdsTransparencyResult>;
//# sourceMappingURL=googleAdsTransparency.d.ts.map