/**
 * Milestone 9 — concept generation safety gate.
 * Preview generation later may only proceed when all gates pass.
 */
export function evaluateConceptGenerationGate(input) {
    const blocked = [];
    const minAssets = input.min_asset_readiness ?? 50;
    if (input.concept_status !== "BRIEF_READY") {
        blocked.push(`concept_status_must_be_BRIEF_READY_got_${input.concept_status}`);
    }
    if (!input.hero_product_selected) {
        blocked.push("hero_product_not_selected");
    }
    if (input.asset_readiness_score == null ||
        input.asset_readiness_score < minAssets) {
        blocked.push("insufficient_assets");
    }
    if (input.is_excluded)
        blocked.push("brand_excluded");
    if (input.is_dnc)
        blocked.push("do_not_contact");
    if (!input.brand_eligible)
        blocked.push("brand_not_eligible");
    if (!input.template_id)
        blocked.push("template_not_selected");
    if (!input.template_design_available) {
        blocked.push("template_design_not_available_yet");
    }
    return {
        allowed: blocked.length === 0,
        blocked_reasons: blocked,
    };
}
export function evaluateConceptFirstOutreachGate(input) {
    if (input.outreach_strategy !== "CONCEPT_FIRST_OUTREACH") {
        return { allowed: true, blocked_reasons: [] };
    }
    const blocked = [];
    if (input.concept_status !== "PREVIEW_READY") {
        blocked.push("concept_status_must_be_PREVIEW_READY");
    }
    if (!input.preview_url) {
        blocked.push("preview_url_required");
    }
    return { allowed: blocked.length === 0, blocked_reasons: blocked };
}
//# sourceMappingURL=generationGate.js.map