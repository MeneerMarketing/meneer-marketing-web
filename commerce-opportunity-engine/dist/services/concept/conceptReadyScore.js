/**
 * Milestone 9 — Concept Ready score (deterministic).
 *
 * FORMULA (documented):
 *   raw = Σ (weight_i × component_i) for all CONCEPT_READY_WEIGHTS
 *   retailer_penalty = f(retailer_scale_score) using CONCEPT_RETAILER_SCALE_PENALTY
 *   concept_ready_score = clamp(0, 100, round(raw - retailer_penalty))
 *
 * Components are 0–100. Weights sum to 1.0.
 * CRO quality is NOT a direct weight (avoid double-counting); use pdpTransformationPotential.
 */
import { CONCEPT_PLATFORM_FIT, CONCEPT_READY_WEIGHTS, CONCEPT_RETAILER_SCALE_PENALTY, CONCEPT_TRANSFORM_SOFT_CAPS, OWN_BRAND_FIT_BY_MODEL, conceptVerdictFromScore, } from "../../config/conceptScoring.js";
function clamp(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
}
export function retailerScalePenalty(scale) {
    if (scale == null)
        return 0;
    const { softStart, hardStart, maxPenalty } = CONCEPT_RETAILER_SCALE_PENALTY;
    if (scale < softStart)
        return 0;
    if (scale >= hardStart) {
        const t = Math.min(1, (scale - hardStart) / 30);
        return Math.round(maxPenalty * (0.55 + 0.45 * t));
    }
    const t = (scale - softStart) / (hardStart - softStart);
    return Math.round(maxPenalty * 0.55 * t);
}
/** Extra penalty for high-maturity multi-brand retailers without DTC fit. */
export function megaRetailerFitPenalty(input) {
    if (input.businessMaturity < 80)
        return 0;
    if (input.ownBrandFit >= 70)
        return 0;
    let p = 0;
    if (input.platformFit <= 40)
        p += 10;
    if (input.catalogFocus < 55)
        p += 8;
    if (input.businessMaturity >= 85 && input.ownBrandFit <= 55)
        p += 10;
    return Math.min(22, p);
}
export function recommendConceptType(input, score) {
    if (score < 50)
        return "NOT_SUITABLE";
    const model = input.brandCommerceModel;
    const ownHeavy = model === "DTC_OWN_BRAND" || model === "MOSTLY_OWN_BRAND";
    const focusedEnough = input.catalogFocus >= 65;
    if (input.isShopify &&
        ownHeavy &&
        focusedEnough &&
        score >= 78 &&
        input.pdpTransformationPotential >= 55) {
        return "SHOPIFY_REBUILD_CONCEPT";
    }
    if (input.isWoo && ownHeavy && focusedEnough && score >= 72) {
        return "WOOCOMMERCE_MIGRATION_CONCEPT";
    }
    if (input.mobileWeak === true && input.pdpTransformationPotential >= 50) {
        return "MOBILE_FIRST_PDP";
    }
    if (input.buyblockWeak === true && input.deepDiveWeak !== true) {
        return "BUYBLOCK_REDESIGN";
    }
    if (input.deepDiveWeak === true && input.productCommercialSignal >= 45) {
        return "DEEP_DIVE_PRODUCT_STORY";
    }
    if (score >= 55)
        return "FULL_PDP_REDESIGN";
    return "NOT_SUITABLE";
}
export function scoreConceptReady(input) {
    const platformKey = (input.platform ?? "UNKNOWN").toUpperCase();
    const platformFit = CONCEPT_PLATFORM_FIT[platformKey] ?? CONCEPT_PLATFORM_FIT.UNKNOWN;
    const ownBrandFit = OWN_BRAND_FIT_BY_MODEL[input.brandCommerceModel];
    const hero = input.heroProductScore ?? 25;
    const components = {
        mmOrPreFit: clamp(input.mmOrPreFit),
        businessMaturity: clamp(input.businessMaturity),
        platformFit: clamp(platformFit),
        catalogFocus: clamp(input.catalogFocus),
        ownBrandFit: clamp(ownBrandFit),
        heroProductQuality: clamp(hero),
        productCommercialSignal: clamp(input.productCommercialSignal),
        pdpTransformationPotential: clamp(input.pdpTransformationPotential),
        conceptAssetReadiness: clamp(input.conceptAssetReadiness),
        googleAdvertiserSignal: clamp(input.googleAdvertiserSignal),
    };
    const w = CONCEPT_READY_WEIGHTS;
    const raw = components.mmOrPreFit * w.mmOrPreFit +
        components.businessMaturity * w.businessMaturity +
        components.platformFit * w.platformFit +
        components.catalogFocus * w.catalogFocus +
        components.ownBrandFit * w.ownBrandFit +
        components.heroProductQuality * w.heroProductQuality +
        components.productCommercialSignal * w.productCommercialSignal +
        components.pdpTransformationPotential * w.pdpTransformationPotential +
        components.conceptAssetReadiness * w.conceptAssetReadiness +
        components.googleAdvertiserSignal * w.googleAdvertiserSignal;
    const penalty = retailerScalePenalty(input.retailerScaleScore);
    const megaPenalty = megaRetailerFitPenalty({
        businessMaturity: components.businessMaturity,
        ownBrandFit: components.ownBrandFit,
        platformFit: components.platformFit,
        catalogFocus: components.catalogFocus,
    });
    let concept_ready_score = clamp(raw - penalty - megaPenalty);
    let transformCapApplied = null;
    for (const cap of CONCEPT_TRANSFORM_SOFT_CAPS) {
        if (input.pdpTransformationPotential < cap.maxTransformExclusive) {
            if (concept_ready_score > cap.maxConceptReady) {
                concept_ready_score = cap.maxConceptReady;
                transformCapApplied = cap.maxConceptReady;
            }
            break;
        }
    }
    const concept_verdict = conceptVerdictFromScore(concept_ready_score);
    const recommended_concept_type = recommendConceptType(input, concept_ready_score);
    return {
        concept_ready_score,
        concept_verdict,
        recommended_concept_type,
        components: {
            ...components,
            transform_soft_cap_applied: transformCapApplied ?? 0,
            mega_retailer_penalty: megaPenalty,
        },
        weights: CONCEPT_READY_WEIGHTS,
        retailer_scale_penalty: penalty,
        formula: "concept_ready = clamp(0,100, round(Σ(w_i×c_i) − retailer_scale_penalty − mega_retailer_penalty)); then CONCEPT_TRANSFORM_SOFT_CAPS; CRO not a direct weight",
    };
}
//# sourceMappingURL=conceptReadyScore.js.map