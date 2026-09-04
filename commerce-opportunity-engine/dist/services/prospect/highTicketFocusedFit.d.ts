/**
 * Milestone 9.4 — high_ticket_focused_fit_score.
 *
 * One number for the question the whole milestone asks: is this a small or
 * mid-sized brand with a product worth explaining, and a page that does not
 * explain it yet?
 *
 * Every input comes from cheap discovery signals. No Claude, no audit.
 */
import { type HeroPriceBand } from "../../config/highTicketProspect.js";
export interface HighTicketFitInput {
    domain: string;
    businessType: string | null;
    prospectClass: string;
    estimatedCatalogSize: number | null;
    catalogFocusScore: number | null;
    catalogVerified: boolean;
    ownBrandSignal: number | null;
    companyScaleFitScore: number;
    assetReadinessProxy: number | null;
    deepDivePdpFitProxy: number | null;
    pdpWeaknessProxy: number | null;
    heroScore: number | null;
    heroPrice: number | null;
    adKeywordCount: number;
    retailerBreadthScore: number | null;
    businessMaturityScore: number | null;
}
export interface HighTicketFitResult {
    highTicketFocusedFitScore: number;
    priceBand: HeroPriceBand;
    priceBandLabel: string;
    catalogBandLabel: string;
    isSeriousCandidate: boolean;
    components: Record<string, number>;
    penalties: Array<{
        reason: string;
        points: number;
    }>;
    evidence: string[];
}
export declare function computeHighTicketFocusedFit(input: HighTicketFitInput): HighTicketFitResult;
//# sourceMappingURL=highTicketFocusedFit.d.ts.map