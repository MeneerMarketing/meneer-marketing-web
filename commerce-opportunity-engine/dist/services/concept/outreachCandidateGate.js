/**
 * Milestone 9.2 — Outreach pilot eligibility gate.
 */
import { OUTREACH_CONTRAST_GATE, OUTREACH_GATE_THRESHOLDS, } from "../../config/outreachScoring.js";
import { OUTREACH_PILOT_GATE } from "../../config/outreachCroCoverage.js";
export function evaluateOutreachCandidateGate(input) {
    const blocked = [];
    const row = input.row;
    const c = input.outreach.components;
    const t = OUTREACH_GATE_THRESHOLDS;
    if (row.manual_excluded)
        blocked.push("manual_excluded");
    if (row.do_not_contact)
        blocked.push("do_not_contact");
    if (row.status !== "BRIEF_READY")
        blocked.push(`status_not_BRIEF_READY:${row.status}`);
    if (row.suggested_template_family !== "PREMIUM_DTC") {
        blocked.push("template_not_PREMIUM_DTC");
    }
    if (!row.primary_concept_product_url)
        blocked.push("missing_product_url");
    if (!row.primary_concept_product_title)
        blocked.push("missing_product_title");
    const model = String(row.brand_commerce_model);
    if (model === "GENERAL_RESELLER" || model === "MARKETPLACE") {
        blocked.push("general_retailer_or_marketplace");
    }
    if (!input.pageHealthOk)
        blocked.push("page_health_not_usable");
    if ((row.concept_asset_readiness_score ?? 0) < t.minAssetReadiness) {
        blocked.push("insufficient_asset_readiness");
    }
    if ((row.pdp_transformation_potential ?? 0) < t.minTransformation) {
        blocked.push("insufficient_transformation");
    }
    // A polished shop is still a fine business, just not one where a preview
    // creates a convincing difference.
    if (c.conceptContrast < OUTREACH_CONTRAST_GATE.minConceptContrast) {
        blocked.push(`insufficient_concept_contrast:${c.conceptContrast}:${input.outreach.contrast.band}`);
    }
    if (c.deepDivePdpFit < t.minDeepDivePdpFit)
        blocked.push("insufficient_deep_dive_fit");
    if (c.projectEconomicFit < t.minProjectEconomicFit) {
        blocked.push("insufficient_project_economic_fit");
    }
    if (c.businessMaturity < t.minBusinessMaturity) {
        blocked.push("insufficient_business_maturity");
    }
    if (input.outreach.outreachConceptFitScore < t.minOutreachConceptFit) {
        blocked.push("insufficient_outreach_concept_fit");
    }
    if (c.catalogFocus < t.minCatalogFocus)
        blocked.push("insufficient_catalog_focus");
    if (OUTREACH_PILOT_GATE.preferAudited) {
        if (input.outreach.croDataSource !== "AUDITED") {
            if (input.outreach.outreachScoreConfidence <
                OUTREACH_PILOT_GATE.minOutreachConfidenceProxyException) {
                blocked.push("cro_not_audited_insufficient_proxy_confidence");
            }
        }
        else {
            if ((input.outreach.outreachScoreConfidence ?? 0) <
                OUTREACH_PILOT_GATE.minOutreachConfidenceWhenAudited) {
                blocked.push("insufficient_outreach_score_confidence");
            }
            if ((input.auditConfidence ?? 0) < OUTREACH_PILOT_GATE.minAuditConfidence) {
                blocked.push("insufficient_audit_confidence");
            }
        }
    }
    return { eligible: blocked.length === 0, blockedReasons: blocked };
}
//# sourceMappingURL=outreachCandidateGate.js.map