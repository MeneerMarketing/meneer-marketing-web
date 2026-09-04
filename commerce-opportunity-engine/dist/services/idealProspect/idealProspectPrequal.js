/**
 * Milestone 9.3 — early reject / deprioritize before expensive steps.
 */
import { M93_DEFAULTS } from "../../config/idealProspectProfile.js";
import { classifyProspectExclusion } from "../prospect/prospectPipelineGate.js";
export function evaluateIdealProspectPrequal(input) {
    const gate = classifyProspectExclusion({
        domain: input.domain,
        businessType: input.businessType,
        brandCommerceModel: input.brandCommerceModel,
        isEcommerce: input.isEcommerce,
        manualExcluded: input.manualExcluded,
        retailerScaleScore: input.retailerScaleScore,
        estimatedProductCount: input.estimatedProductCount,
        estimatedBrandCount: input.estimatedBrandCount,
        businessMaturityScore: input.businessMaturityScore,
        categorySpread: input.categorySpread,
        keywordSpread: input.keywordSpread,
    });
    if (!gate.eligible) {
        return { accepted: false, reason: gate.reason ?? "prospect_gate_rejected", deprioritized: false };
    }
    const model = String(input.brandCommerceModel);
    let deprioritized = false;
    if ((input.retailerScaleScore ?? 0) >= 65) {
        deprioritized = true;
    }
    if ((input.estimatedProductCount ?? 0) >= 500) {
        deprioritized = true;
    }
    if (model === "SPECIALIST_RESELLER" && (input.estimatedBrandCount ?? 0) >= 12) {
        deprioritized = true;
    }
    if ((input.businessMaturityScore ?? 0) < 30) {
        deprioritized = true;
    }
    const platform = (input.platform ?? "").toUpperCase();
    if (platform !== "SHOPIFY" && platform !== "WOOCOMMERCE") {
        deprioritized = true;
    }
    return {
        accepted: true,
        reason: deprioritized ? "accepted_deprioritized" : "accepted",
        deprioritized,
    };
}
export function isExistingBrandDedupeSkip(domain, existingDomains) {
    return existingDomains.has(domain.toLowerCase());
}
export const IDEAL_TRANSPARENCY_MAX = M93_DEFAULTS.transparencyMaxDomains;
//# sourceMappingURL=idealProspectPrequal.js.map