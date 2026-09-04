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
export const CONTRAST_ROOM_WEIGHTS = {
  /** Overall page quality: the single strongest indicator of remaining room. */
  currentPdpQuality: 0.24,
  /** How premium the page already looks. Visual polish kills before/after wow. */
  premiumDesignPerception: 0.2,
  /** Whether the product is explained or just listed. */
  storytellingDepth: 0.14,
  /** Photography, video, lifestyle imagery in the current presentation. */
  mediaQuality: 0.1,
  /** Presence of a real deep-dive section instead of a spec dump. */
  deepDiveQuality: 0.1,
  /** Price, variants, CTA and trust at the moment of buying. */
  buyblockQuality: 0.11,
  /** The phone is where most of the paid traffic lands. */
  mobileQuality: 0.11,
} as const;

/** Weights inside the capability factor. They sum to 1. */
export const CONTRAST_CAPABILITY_WEIGHTS = {
  /** Usable photography, copy and product material to build a premium page. */
  assetReadiness: 0.34,
  /** Product that carries a story: price, features, considered purchase. */
  commercialSignal: 0.22,
  /** Own brand means we may reshape the whole story, not just a reseller page. */
  ownBrandFit: 0.18,
  /** A focused catalog keeps the concept about one hero product. */
  catalogFocus: 0.14,
  /** Enough business behind it to act on the preview. */
  businessMaturity: 0.12,
} as const;

/**
 * The capability factor scales the room score. Never above 1: capability can
 * only preserve contrast, never invent it. A page with no room stays at zero
 * no matter how good the assets are.
 */
export const CONTRAST_CAPABILITY_RANGE = {
  min: 0.42,
  max: 1.0,
  /** Capability score that maps to the top of the range. */
  fullAt: 82,
  /** Capability score that maps to the bottom of the range. */
  floorAt: 28,
} as const;

/**
 * A page that already looks premium caps the achievable contrast, whatever the
 * rest of the signals say. This is the rule that keeps polished international
 * DTC brands out of the design pilot without touching their classification.
 */
export const PREMIUM_DESIGN_CEILINGS = [
  { minDesignPerception: 85, maxContrast: 22, label: "al high-end" },
  { minDesignPerception: 75, maxContrast: 38, label: "visueel al sterk" },
  { minDesignPerception: 66, maxContrast: 54, label: "visueel verzorgd" },
] as const;

/** Same logic on overall page quality: little left to beat. */
export const CURRENT_QUALITY_CEILINGS = [
  { minQuality: 84, maxContrast: 20, label: "PDP zeer sterk" },
  { minQuality: 74, maxContrast: 36, label: "PDP sterk" },
  { minQuality: 66, maxContrast: 52, label: "PDP redelijk" },
] as const;

export const CONTRAST_BANDS = [
  { min: 79, band: "ZEER_HOOG" },
  { min: 63, band: "HOOG" },
  { min: 46, band: "GEMIDDELD" },
  { min: 26, band: "LAAG" },
  { min: 0, band: "GEEN_CONTRAST" },
] as const;

export const CONTRAST_ADJUSTMENTS = {
  /** A broken page shows badly in a before/after: the current state is unusable. */
  technicallyBrokenPenalty: 18,
  /** Reseller catalogs limit how far we may restyle someone else's product. */
  resellerPenalty: 16,
  /** Thin source content: nothing to turn into a story. */
  thinContentPenalty: 10,
  /** Rich source content we can restructure into a deep dive. */
  richContentBonus: 6,
  /** Real reviews make the premium version instantly more convincing. */
  socialProofBonus: 5,
} as const;

export const CONTRAST_CONFIDENCE = {
  audited: 82,
  proxy: 48,
  missing: 24,
  /** Bonus when the audit itself was confident about the page. */
  auditConfidenceWeight: 0.18,
} as const;

/**
 * Gates. Contrast is a hard requirement for the design target: it is the whole
 * point of sending a preview. Outreach scoring uses the softer threshold.
 */
export const CONTRAST_GATE_THRESHOLDS = {
  /** Minimum for the TRUE_SALES_CANDIDATE design pilot. */
  minDesignTargetContrast: 62,
  /** Minimum to stay eligible in the outreach pool. */
  minOutreachContrast: 48,
  /** Below this the candidate is not worth a preview at all. */
  hopelessContrast: 30,
} as const;

export function contrastBandFor(score: number): string {
  for (const band of CONTRAST_BANDS) {
    if (score >= band.min) return band.band;
  }
  return "GEEN_CONTRAST";
}
