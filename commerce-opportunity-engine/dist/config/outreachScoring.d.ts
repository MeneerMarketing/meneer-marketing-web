/**
 * Milestone 9.2 — Outreach prospect selection (vs engineering template QA).
 * Central weights, penalties, thresholds. No magic numbers in scorers.
 */
export type PilotSelectorMode = "ENGINEERING" | "OUTREACH";
/** Domains kept as internal template QA fixtures — ranked naturally, not penalized. */
export declare const ENGINEERING_FIXTURE_DOMAINS: readonly ["tensfact.com"];
export declare const OUTREACH_FIT_WEIGHTS: {
    /**
     * M9.3.4: transformation and weakness both measure "how bad is it now".
     * Concept contrast measures how impressive the before/after will look, which
     * is what actually sells the preview, so it takes weight from both.
     */
    readonly pdpTransformation: 0.16;
    readonly currentPdpWeakness: 0.12;
    readonly conceptContrast: 0.12;
    readonly conceptAssetReadiness: 0.12;
    readonly catalogFocus: 0.08;
    readonly catalogSweetSpot: 0.1;
    readonly ownBrandFit: 0.08;
    readonly heroProductQuality: 0.08;
    readonly commercialSignal: 0.06;
    readonly googleAdsConfirmation: 0.08;
    readonly businessMaturity: 0.05;
    readonly platformFit: 0.04;
    readonly projectEconomicFit: 0.09;
};
export declare const OUTREACH_PENALTIES: {
    readonly croAlreadyStrongMax: 35;
    readonly hugeCatalogMax: 22;
    readonly generalRetailerMax: 40;
    readonly resellerHeavyMax: 18;
    readonly weakAssetsMax: 25;
    readonly tinyBusinessMax: 15;
    readonly technicalFailureMax: 30;
    readonly lowProductValueMax: 12;
    /** When CRO audit missing but assets+catalog suggest polished shop with moderate transformation. */
    readonly decentPdpWithoutAuditMax: 18;
};
export declare const OUTREACH_GATE_THRESHOLDS: {
    readonly minAssetReadiness: 52;
    readonly minTransformation: 55;
    readonly minDeepDivePdpFit: 58;
    readonly minProjectEconomicFit: 50;
    readonly minBusinessMaturity: 42;
    readonly minOutreachConceptFit: 62;
    readonly minCatalogFocus: 45;
};
/**
 * M9.3.4: a candidate whose page is already premium fails here, not in the
 * business classifier. Being a great shop and being a great design target are
 * different questions.
 */
export declare const OUTREACH_CONTRAST_GATE: {
    readonly minConceptContrast: 48;
};
/** Catalog size sweet spot for deep-dive PDP propositions (estimated products). */
export declare const CATALOG_SWEET_SPOT_BANDS: readonly [{
    readonly min: 1;
    readonly max: 5;
    readonly score: 58;
    readonly label: "micro_maturity_check";
}, {
    readonly min: 6;
    readonly max: 30;
    readonly score: 92;
    readonly label: "very_interesting";
}, {
    readonly min: 31;
    readonly max: 75;
    readonly score: 96;
    readonly label: "strong";
}, {
    readonly min: 76;
    readonly max: 150;
    readonly score: 78;
    readonly label: "usable";
}, {
    readonly min: 151;
    readonly max: 500;
    readonly score: 48;
    readonly label: "lower_fit";
}, {
    readonly min: 501;
    readonly max: 999999;
    readonly score: 18;
    readonly label: "huge_catalog";
}];
export declare const OWN_BRAND_FIT_SCORES: Record<string, number>;
export declare const PLATFORM_FIT_SCORES: Record<string, number>;
/** CRO composite above this triggers cro_already_strong penalty ramp. */
export declare const CRO_STRONG_THRESHOLD = 72;
export declare const CRO_EXCEPTIONAL_THRESHOLD = 82;
//# sourceMappingURL=outreachScoring.d.ts.map