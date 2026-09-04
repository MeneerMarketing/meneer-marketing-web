/**
 * Milestone 9.4 — estimated_contrast_ceiling.
 *
 * M9.3.4 paid for the lesson: an audit on a shop whose product page is already
 * polished can only end in a low concept contrast, and by then the money is
 * gone. This estimates the ceiling from the free signals we collect during
 * discovery, so the expensive audits go to pages that can actually be beaten.
 *
 * It is an upper bound on plausible contrast, not a prediction of it. A real
 * audit may land far below the ceiling; it should rarely land above.
 */
import { CONTRAST_CEILING_RULES } from "../../config/highTicketProspect.js";
function clamp(value, max = 100) {
    return Math.max(0, Math.min(max, Math.round(value)));
}
export function estimateContrastCeiling(input) {
    const rules = CONTRAST_CEILING_RULES;
    const evidence = [];
    if (input.pdpWeaknessProxy == null && input.assetReadinessProxy == null) {
        return {
            estimatedContrastCeiling: rules.unknownCeiling,
            clearsDesignTarget: rules.unknownCeiling >= rules.designTargetContrast,
            evidence: ["huidige pagina niet gemeten, schatting blijft neutraal"],
        };
    }
    const weakness = input.pdpWeaknessProxy ?? 50;
    const assets = input.assetReadinessProxy ?? 50;
    const deepDive = input.deepDivePdpFitProxy ?? 60;
    const ownBrand = input.ownBrandSignal ?? 50;
    // Room comes from the current page, material from everything we would build
    // with. Contrast needs both, so neither side alone can lift the estimate.
    const room = weakness;
    const material = assets * 0.5 + deepDive * 0.3 + ownBrand * 0.2;
    let ceiling = room * 0.6 + material * 0.4;
    if (input.heroPrice != null && input.heroPrice >= 120) {
        ceiling += 4;
        evidence.push("prijspunt rechtvaardigt een uitgebreide pagina");
    }
    if (assets < rules.thinAssetReadiness) {
        ceiling = Math.min(ceiling, rules.thinAssetCeiling);
        evidence.push(`weinig materiaal (${Math.round(assets)}): premium versie wordt dun`);
    }
    if (weakness <= rules.strongPdpWeaknessFloor) {
        ceiling = Math.min(ceiling, rules.strongPdpCeiling);
        evidence.push(`huidige pagina doet al veel goed (weakness ${Math.round(weakness)})`);
    }
    const estimatedContrastCeiling = clamp(ceiling, rules.maxCeiling);
    if (estimatedContrastCeiling >= rules.designTargetContrast) {
        evidence.push(`plafond ${estimatedContrastCeiling}: haalt de design target drempel`);
    }
    else {
        evidence.push(`plafond ${estimatedContrastCeiling}: onder de drempel van ${rules.designTargetContrast}`);
    }
    return {
        estimatedContrastCeiling,
        clearsDesignTarget: estimatedContrastCeiling >= rules.designTargetContrast,
        evidence,
    };
}
//# sourceMappingURL=estimatedContrastCeiling.js.map