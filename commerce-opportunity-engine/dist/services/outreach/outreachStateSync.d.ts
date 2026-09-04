/**
 * Milestone 8.1 — keep outreach message status consistent with brand/opportunity safety.
 * Non-sent messages become BLOCKED (or APPROVAL_REVOKED when previously approved).
 * Historical subject/body are preserved.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
export type OutreachBlockReason = "brand_manually_excluded" | "brand_do_not_contact" | "brand_eligibility_excluded" | "brand_not_lead_eligible" | "opportunity_rejected" | "opportunity_excluded" | "outreach_eligible_false" | "suppression" | "contact_unusable";
export type BrandSafetySnapshot = {
    brandId: string;
    domain: string;
    manualExcluded: boolean;
    doNotContact: boolean;
    eligibilityStatus: string | null;
    leadEligible: boolean | null;
    outreachEligible: boolean | null;
    opportunityStatus: string | null;
    contactEmail: string | null;
    contactUsable: boolean;
};
export declare function detectBlockReasons(snap: BrandSafetySnapshot, suppressed: boolean): OutreachBlockReason[];
export declare function humanBlockReason(reasons: OutreachBlockReason[]): string;
export type SyncResult = {
    messageId: string;
    previousStatus: string;
    nextStatus: string | null;
    reasons: OutreachBlockReason[];
};
/**
 * Invalidate non-sent outreach for a brand when safety flags trip.
 */
export declare function syncOutreachMessagesForBrand(client: SupabaseClient, brandId: string, explicitReason?: string): Promise<SyncResult[]>;
export declare function syncAllUnsafeOutreachMessages(client: SupabaseClient): Promise<SyncResult[]>;
//# sourceMappingURL=outreachStateSync.d.ts.map