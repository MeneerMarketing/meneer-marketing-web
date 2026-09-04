/**
 * Milestone 9.1 / 9.2 — Shared concept pilot hydration (targeted crawl + snapshot).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildPremiumDtcViewModel } from "./premiumDtcModelLoader.js";
import type { PilotCandidateRow } from "./selectPremiumDtcPilot.js";
export type HydrateConceptPilotResult = {
    conceptId: string;
    domain: string;
    productUrl: string;
    snapshotPath: string;
    reportPath: string;
    previewPath: string;
    viewModel: Awaited<ReturnType<typeof buildPremiumDtcViewModel>>;
    crawlSummary: {
        images: number;
        benefits: number;
        faqs: number;
        reviews: number;
        logo: boolean;
        price: number | null;
        pages: string[];
    };
};
export declare function hydrateConceptPilot(supabase: SupabaseClient, winner: PilotCandidateRow, projectRoot: string, options?: {
    reportSuffix?: string;
    updateLatest?: boolean;
}): Promise<HydrateConceptPilotResult>;
//# sourceMappingURL=hydrateConceptPilot.d.ts.map