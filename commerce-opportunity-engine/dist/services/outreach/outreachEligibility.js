import { OUTREACH_ELIGIBILITY } from "../../config/outreach.js";
export function evaluateOutreachEligibility(input) {
    const blockers = [];
    const t = OUTREACH_ELIGIBILITY;
    if (input.manualExcluded)
        blockers.push("manual_excluded");
    if (input.doNotContact)
        blockers.push("do_not_contact");
    if ((input.eligibilityStatus ?? "").toUpperCase() === "EXCLUDED") {
        blockers.push("eligibility_status_excluded");
    }
    if (input.leadEligible === false)
        blockers.push("not_lead_eligible");
    if (input.suppressed)
        blockers.push("suppressed");
    if (input.firstTouchSent)
        blockers.push("first_touch_already_sent");
    const biz = (input.businessType ?? "").toUpperCase();
    if (!biz ||
        !t.relevantBusinessTypes.includes(biz)) {
        blockers.push(`business_type_not_relevant:${biz || "UNKNOWN"}`);
    }
    if (input.croAuditStatus !== "COMPLETED") {
        blockers.push(`audit_status:${input.croAuditStatus ?? "null"}`);
    }
    if (!input.auditValid)
        blockers.push("audit_invalid");
    if ((input.auditConfidence ?? 0) < t.minAuditConfidence) {
        blockers.push(`audit_confidence_below_${t.minAuditConfidence}:${input.auditConfidence ?? 0}`);
    }
    if (input.supportedFindingsCount < t.minSupportedFindings) {
        blockers.push(`supported_findings_below_${t.minSupportedFindings}:${input.supportedFindingsCount}`);
    }
    if ((input.mmFit ?? 0) < t.minMmFit) {
        blockers.push(`mm_fit_below_${t.minMmFit}:${input.mmFit ?? 0}`);
    }
    if (input.recommendedProjectType &&
        t.blockedProjectTypes.includes(input.recommendedProjectType)) {
        blockers.push(`project_type:${input.recommendedProjectType}`);
    }
    if (!input.recommendedProjectType) {
        blockers.push("missing_recommended_project_type");
    }
    // Strong brand / weak commercial gap: skip cold outreach (e.g. CurrentBody)
    if (input.recommendedProjectType === "DESIGN_UPGRADE" &&
        (input.fullRebuildPotential ?? 100) < 40 &&
        (input.pdpImprovementPotential ?? 100) < 45) {
        blockers.push("insufficient_sales_reason_strong_existing_site");
    }
    if (!input.websiteReachable)
        blockers.push("website_unreachable");
    // Soft opportunity score: only block when extremely low AND weak MM fit already handled
    if (input.opportunityScore != null &&
        input.opportunityScore < t.softMinOpportunityScore &&
        (input.mmFit ?? 0) < 80) {
        blockers.push(`opportunity_score_too_low_without_strong_fit:${input.opportunityScore}`);
    }
    // Architecture only: CONCEPT_FIRST_OUTREACH may not draft/send without preview.
    if ((input.outreachStrategy ?? "") === "CONCEPT_FIRST_OUTREACH") {
        if (input.conceptStatus !== "PREVIEW_READY") {
            blockers.push("concept_first_requires_preview_ready");
        }
        if (!input.conceptPreviewUrl) {
            blockers.push("concept_first_requires_preview_url");
        }
    }
    if (blockers.length) {
        return {
            eligible: false,
            reason: blockers.join("; "),
            blockers,
        };
    }
    return {
        eligible: true,
        reason: "passes_conservative_outreach_gate",
        blockers: [],
    };
}
//# sourceMappingURL=outreachEligibility.js.map