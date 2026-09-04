import type { SupabaseClient } from "@supabase/supabase-js";
import type { GoogleAdsTransparencyResult } from "../../types/signals.js";
export declare function applyTransparencyResult(client: SupabaseClient, result: GoogleAdsTransparencyResult): Promise<void>;
export declare function selectDomainsForTransparencyCheck(client: SupabaseClient, limit: number, preferredDomains?: string[]): Promise<string[]>;
//# sourceMappingURL=transparencyRepository.d.ts.map