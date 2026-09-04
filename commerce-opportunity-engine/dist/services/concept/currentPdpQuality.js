/**
 * Milestone 9.2.1 — current_pdp_quality_score from audited CRO signals.
 */
import { CRO_ALREADY_STRONG_FROM_QUALITY, CURRENT_PDP_QUALITY_BANDS, } from "../../config/outreachCroCoverage.js";
function clamp(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
}
function num(v, fallback = 0) {
    if (v == null || !Number.isFinite(v))
        return fallback;
    return v;
}
export function computeCurrentPdpQualityScore(cro, conceptSignals) {
    const mobileDesktop = (num(cro.mobile_cro_quality) + num(cro.desktop_cro_quality)) / 2;
    const baseComponents = {
        buyblock: clamp((num(cro.above_fold_quality) * 0.22 +
            num(cro.offer_clarity_quality) * 0.2 +
            num(cro.cta_quality) * 0.18 +
            num(cro.trust_quality) * 0.12 +
            num(cro.social_proof_quality) * 0.12) /
            0.84),
        storytelling: num(cro.product_storytelling_quality),
        presentation: num(cro.product_presentation_quality),
        media: num(cro.product_presentation_quality) * 0.6 + num(cro.visual_design_quality) * 0.4,
        deepDive: clamp(num(cro.product_presentation_quality) * 0.35 +
            num(cro.objection_handling_quality) * 0.25 +
            num(cro.product_storytelling_quality) * 0.4),
        mobile: clamp(num(cro.mobile_cro_quality) * 0.55 + num(cro.above_fold_quality) * 0.45),
        design: num(cro.visual_design_quality),
        mobileDesktop: mobileDesktop,
    };
    let score = baseComponents.buyblock * 0.18 +
        baseComponents.storytelling * 0.16 +
        baseComponents.presentation * 0.12 +
        baseComponents.media * 0.1 +
        baseComponents.deepDive * 0.14 +
        baseComponents.mobile * 0.14 +
        baseComponents.design * 0.1 +
        baseComponents.mobileDesktop * 0.06;
    if (conceptSignals) {
        const signalValues = [
            conceptSignals.buyblock_quality,
            conceptSignals.product_storytelling_depth,
            conceptSignals.media_usage_quality,
            conceptSignals.deep_dive_quality,
            conceptSignals.mobile_purchase_quality,
            conceptSignals.premium_design_perception,
        ].filter((v) => v != null && Number.isFinite(v));
        if (signalValues.length > 0) {
            const signalAvg = signalValues.reduce((a, b) => a + b, 0) / signalValues.length;
            score = score * 0.72 + signalAvg * 0.28;
        }
    }
    score = clamp(score);
    let band = "ZEER_STERK";
    if (score <= CURRENT_PDP_QUALITY_BANDS.WEAK_MAX)
        band = "ZWAK";
    else if (score <= CURRENT_PDP_QUALITY_BANDS.MODERATE_MAX)
        band = "MATIG";
    else if (score <= CURRENT_PDP_QUALITY_BANDS.REASONABLE_MAX)
        band = "REDELIJK";
    else if (score <= CURRENT_PDP_QUALITY_BANDS.STRONG_MAX)
        band = "STERK";
    return { score, band, components: baseComponents };
}
export function croAlreadyStrongPenaltyFromQuality(qualityScore) {
    for (const band of CRO_ALREADY_STRONG_FROM_QUALITY) {
        if (qualityScore >= band.min)
            return band.penalty;
    }
    return 0;
}
//# sourceMappingURL=currentPdpQuality.js.map