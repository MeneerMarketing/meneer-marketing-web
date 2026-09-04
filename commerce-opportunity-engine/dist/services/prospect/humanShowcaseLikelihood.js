/**
 * Milestone 9.9.7 — human showcase likelihood synthesis.
 */
export function assessHumanShowcaseLikelihood(input) {
    if (!input.visionScoreAllowed) {
        return { likelihood: "NO", rationale: "invalid_or_missing_capture" };
    }
    const cvq = input.currentVisualQualityScore ?? 55;
    const material = input.materialFeasibility ?? 0;
    const hero = input.heroCandidateScore ?? 0;
    const impression = input.currentSiteImpression ?? "MODERN_ENOUGH";
    if (input.refinedBusinessModel === "GENERAL_RETAILER" ||
        input.refinedBusinessModel === "GENERAL_RESELLER" ||
        input.refinedBusinessModel === "FOCUSED_SPECIALIST_RESELLER") {
        return { likelihood: "NO", rationale: "reseller_or_broad_retail_profile" };
    }
    if (impression === "MODERN_ENOUGH" || impression === "PREMIUM" || cvq >= 58) {
        return { likelihood: "NO", rationale: "site_already_too_polished_for_dramatic_showcase" };
    }
    if (input.businessBreadthScore < 38) {
        return {
            likelihood: "WEAK",
            rationale: "catalog_or_navigation_too_broad_for_compact_brand_showcase",
        };
    }
    if (input.catalogConfidence === "UNKNOWN" && input.businessBreadthScore < 52) {
        return { likelihood: "WEAK", rationale: "catalog_breadth_unverified_and_likely_broad" };
    }
    const visualStrong = impression === "CLEARLY_UNDERDESIGNED" &&
        cvq <= 44 &&
        input.templateDriven;
    const visualPossible = impression === "CLEARLY_UNDERDESIGNED" ||
        (impression === "BASIC_BUT_ACCEPTABLE" && cvq <= 48 && input.templateDriven);
    const businessStrong = input.businessBreadthScore >= 68 &&
        input.catalogCompactnessScore >= 70 &&
        material >= 70 &&
        hero >= 55;
    if (visualStrong && businessStrong) {
        return {
            likelihood: "STRONG",
            rationale: "clearly_underdesigned_compact_brand_with_real_assets",
        };
    }
    if (visualStrong && input.businessBreadthScore >= 55) {
        return { likelihood: "POSSIBLE", rationale: "strong_visual_gap_needs_breadth_confirmation" };
    }
    if (visualPossible && businessStrong) {
        return { likelihood: "POSSIBLE", rationale: "acceptable_visual_gap_on_focused_brand" };
    }
    if (impression === "BASIC_BUT_ACCEPTABLE" && cvq >= 50) {
        return {
            likelihood: "WEAK",
            rationale: "basic_but_not_dramatically_underdesigned",
        };
    }
    if (visualPossible) {
        return { likelihood: "WEAK", rationale: "some_visual_room_but_not_obvious_at_first_glance" };
    }
    return { likelihood: "NO", rationale: "insufficient_transformation_signal" };
}
//# sourceMappingURL=humanShowcaseLikelihood.js.map