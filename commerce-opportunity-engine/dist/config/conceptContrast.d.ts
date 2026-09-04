/**
 * Milestone 9.3.4 — concept_contrast_potential.
 *
 * Business classification answers "what kind of shop is this?".
 * Concept contrast answers something completely different:
 *
 *   How impressive and commercially convincing is the difference between the
 *   CURRENT product page and our PREMIUM_DTC preview going to be?
 *
 * A shop can be a perfect prospect on every business signal (own brand,
 * international, mature, great assets, real ad spend) and still be a poor
 * design target, because the current page is already high-end. The preview
 * would land as "nice, but we already have that".
 *
 * Contrast is the product of two things, and both are required:
 *   room      — how much of the page is left on the table today
 *   capability — whether there is enough material to build something premium
 *
 * Great room with no assets produces a mockup nobody believes. Great assets
 * with no room produces a preview nobody is impressed by.
 */
/**
 * Weights inside the room score. They sum to 1.
 *
 * All six audited dimensions carry their own weight. Leaving buy block and
 * mobile inside the composite only would understate exactly the two places
 * where a before/after is most visible: the purchase moment and the phone.
 */
export declare const CONTRAST_ROOM_WEIGHTS: {
    /** Overall page quality: the single strongest indicator of remaining room. */
    readonly currentPdpQuality: 0.24;
    /** How premium the page already looks. Visual polish kills before/after wow. */
    readonly premiumDesignPerception: 0.2;
    /** Whether the product is explained or just listed. */
    readonly storytellingDepth: 0.14;
    /** Photography, video, lifestyle imagery in the current presentation. */
    readonly mediaQuality: 0.1;
    /** Presence of a real deep-dive section instead of a spec dump. */
    readonly deepDiveQuality: 0.1;
    /** Price, variants, CTA and trust at the moment of buying. */
    readonly buyblockQuality: 0.11;
    /** The phone is where most of the paid traffic lands. */
    readonly mobileQuality: 0.11;
};
/** Weights inside the capability factor. They sum to 1. */
export declare const CONTRAST_CAPABILITY_WEIGHTS: {
    /** Usable photography, copy and product material to build a premium page. */
    readonly assetReadiness: 0.34;
    /** Product that carries a story: price, features, considered purchase. */
    readonly commercialSignal: 0.22;
    /** Own brand means we may reshape the whole story, not just a reseller page. */
    readonly ownBrandFit: 0.18;
    /** A focused catalog keeps the concept about one hero product. */
    readonly catalogFocus: 0.14;
    /** Enough business behind it to act on the preview. */
    readonly businessMaturity: 0.12;
};
/**
 * The capability factor scales the room score. Never above 1: capability can
 * only preserve contrast, never invent it. A page with no room stays at zero
 * no matter how good the assets are.
 */
export declare const CONTRAST_CAPABILITY_RANGE: {
    readonly min: 0.42;
    readonly max: 1;
    /** Capability score that maps to the top of the range. */
    readonly fullAt: 82;
    /** Capability score that maps to the bottom of the range. */
    readonly floorAt: 28;
};
/**
 * A page that already looks premium caps the achievable contrast, whatever the
 * rest of the signals say. This is the rule that keeps polished international
 * DTC brands out of the design pilot without touching their classification.
 */
export declare const PREMIUM_DESIGN_CEILINGS: readonly [{
    readonly minDesignPerception: 85;
    readonly maxContrast: 22;
    readonly label: "al high-end";
}, {
    readonly minDesignPerception: 75;
    readonly maxContrast: 38;
    readonly label: "visueel al sterk";
}, {
    readonly minDesignPerception: 66;
    readonly maxContrast: 54;
    readonly label: "visueel verzorgd";
}];
/** Same logic on overall page quality: little left to beat. */
export declare const CURRENT_QUALITY_CEILINGS: readonly [{
    readonly minQuality: 84;
    readonly maxContrast: 20;
    readonly label: "PDP zeer sterk";
}, {
    readonly minQuality: 74;
    readonly maxContrast: 36;
    readonly label: "PDP sterk";
}, {
    readonly minQuality: 66;
    readonly maxContrast: 52;
    readonly label: "PDP redelijk";
}];
export declare const CONTRAST_BANDS: readonly [{
    readonly min: 79;
    readonly band: "ZEER_HOOG";
}, {
    readonly min: 63;
    readonly band: "HOOG";
}, {
    readonly min: 46;
    readonly band: "GEMIDDELD";
}, {
    readonly min: 26;
    readonly band: "LAAG";
}, {
    readonly min: 0;
    readonly band: "GEEN_CONTRAST";
}];
export declare const CONTRAST_ADJUSTMENTS: {
    /** A broken page shows badly in a before/after: the current state is unusable. */
    readonly technicallyBrokenPenalty: 18;
    /** Reseller catalogs limit how far we may restyle someone else's product. */
    readonly resellerPenalty: 16;
    /** Thin source content: nothing to turn into a story. */
    readonly thinContentPenalty: 10;
    /** Rich source content we can restructure into a deep dive. */
    readonly richContentBonus: 6;
    /** Real reviews make the premium version instantly more convincing. */
    readonly socialProofBonus: 5;
};
export declare const CONTRAST_CONFIDENCE: {
    readonly audited: 82;
    readonly proxy: 48;
    readonly missing: 24;
    /** Bonus when the audit itself was confident about the page. */
    readonly auditConfidenceWeight: 0.18;
};
/**
 * Gates. Contrast is a hard requirement for the design target: it is the whole
 * point of sending a preview. Outreach scoring uses the softer threshold.
 */
export declare const CONTRAST_GATE_THRESHOLDS: {
    /** Minimum for the TRUE_SALES_CANDIDATE design pilot. */
    readonly minDesignTargetContrast: 62;
    /** Minimum to stay eligible in the outreach pool. */
    readonly minOutreachContrast: 48;
    /** Below this the candidate is not worth a preview at all. */
    readonly hopelessContrast: 30;
};
export declare function contrastBandFor(score: number): string;
//# sourceMappingURL=conceptContrast.d.ts.map