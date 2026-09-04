/**
 * Milestone 9.1 / 9.2 — PREMIUM_DTC pilot selection.
 * ENGINEERING: brief quality + assets + renderability.
 * OUTREACH: transformation contrast + commercial pitch fit.
 */
import type { PilotSelectorMode } from "../../config/outreachScoring.js";
import type { BrandCommerceModel } from "../../config/conceptScoring.js";
import type { OutreachScoringResult } from "./outreachScoring.js";
export type PilotCandidateRow = {
    id: string;
    brand_id: string;
    concept_ready_score: number;
    brand_commerce_model: BrandCommerceModel | string;
    catalog_focus_score: number | null;
    concept_asset_readiness_score: number | null;
    pdp_transformation_potential: number | null;
    hero_product_score: number | null;
    primary_concept_product_title: string | null;
    primary_concept_product_url: string | null;
    primary_concept_product_price: number | null;
    suggested_template_family: string | null;
    needs_assets: boolean | null;
    status: string;
    normalized_domain: string;
    brand_name: string;
    do_not_contact: boolean;
    manual_excluded: boolean;
    eligibility_status?: string | null;
    estimated_product_count?: number | null;
    product_commercial_signal_score?: number | null;
    business_type?: string | null;
    platform?: string | null;
    opportunity_id?: string | null;
    page_id?: string | null;
};
export type PilotSelectionResult = {
    mode: PilotSelectorMode;
    winner: PilotCandidateRow;
    score: number;
    engineeringScore?: number;
    outreachScore?: number;
    reasons: string[];
    rejected: Array<{
        id: string;
        domain: string;
        reason: string;
    }>;
    ranked: Array<{
        id: string;
        domain: string;
        score: number;
        engineeringScore?: number;
        outreachScore?: number;
    }>;
};
export declare function isEligiblePilotRow(row: PilotCandidateRow): string | null;
export declare function scoreEngineeringPilotRow(row: PilotCandidateRow): number;
/** @deprecated Use scoreEngineeringPilotRow */
export declare function scorePilotRow(row: PilotCandidateRow): number;
export type SelectPilotOptions = {
    mode?: PilotSelectorMode;
    outreachScores?: Map<string, OutreachScoringResult>;
};
export declare function selectPremiumDtcPilot(rows: PilotCandidateRow[], options?: SelectPilotOptions): PilotSelectionResult;
//# sourceMappingURL=selectPremiumDtcPilot.d.ts.map