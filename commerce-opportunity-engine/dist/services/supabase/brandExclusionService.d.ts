import type { SupabaseClient } from "@supabase/supabase-js";
export declare const MANUAL_EXCLUSION_REASONS: readonly ["GENERAL_RETAILER", "TOO_LARGE", "MARKETPLACE", "IRRELEVANT_BUSINESS", "POOR_PROSPECT", "EXISTING_CLIENT", "DO_NOT_CONTACT", "OTHER"];
export type ManualExclusionReason = (typeof MANUAL_EXCLUSION_REASONS)[number];
export type EligibilityStatus = "PENDING_QUALIFICATION" | "LEAD_ELIGIBLE" | "EXCLUDED";
export declare function deriveEligibilityStatus(input: {
    manualExcluded?: boolean;
    leadEligible: boolean;
    businessType: string;
    crawlStatus?: string | null;
    qualificationReason?: string | null;
}): EligibilityStatus;
export declare function manuallyExcludeBrand(client: SupabaseClient, input: {
    brandId: string;
    reason: ManualExclusionReason;
    note?: string | null;
}): Promise<void>;
export declare function liftManualBrandExclusion(client: SupabaseClient, brandId: string): Promise<{
    eligibilityStatus: EligibilityStatus;
}>;
//# sourceMappingURL=brandExclusionService.d.ts.map