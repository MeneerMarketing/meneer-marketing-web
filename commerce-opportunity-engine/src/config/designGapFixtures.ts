/**
 * Milestone 9.5 — signal profiles for design-gap regression (no domain hardcoding).
 */

export type DesignGapFixtureProfile = {
  label: string;
  reasoning: string;
  highTicketFocusedFit: number;
  heroPrice: number;
  assetReadinessProxy: number;
  contentAvailableScore: number;
  contentPresentationQuality: number;
  preauditVisualGap: number;
  preauditPurchaseGap: number;
  mobileGapProxy: number;
  estimatedContrastCeiling: number;
  businessMaturity: number;
  ownBrandSignal: number;
  alreadyPolishedPenalty: number;
  /** Relative rank expectation vs other fixtures. */
  expectRankTier: "top" | "mid" | "bottom";
  expectPreauditGate: boolean;
};

export const DESIGN_GAP_FIXTURES: DesignGapFixtureProfile[] = [
  {
    label: "Internationaal premium merk met al volwassen PDP",
    reasoning:
      "CurrentBody-profiel: sterk bedrijf, sterke assets, maar de pagina is al premium. Moet vóór audit worden afgewezen.",
    highTicketFocusedFit: 84,
    heroPrice: 320,
    assetReadinessProxy: 88,
    contentAvailableScore: 82,
    contentPresentationQuality: 86,
    preauditVisualGap: 32,
    preauditPurchaseGap: 28,
    mobileGapProxy: 30,
    estimatedContrastCeiling: 38,
    businessMaturity: 90,
    ownBrandSignal: 88,
    alreadyPolishedPenalty: 18,
    expectRankTier: "bottom",
    expectPreauditGate: false,
  },
  {
    label: "Sterk economisch profiel met degelijke contentpresentatie",
    reasoning:
      "Vitalwave-profiel: business fit sterk, hero economics sterk, assets bruikbaar, maar huidige PDP al storytelling-rijk.",
    highTicketFocusedFit: 82,
    heroPrice: 249,
    assetReadinessProxy: 76,
    contentAvailableScore: 78,
    contentPresentationQuality: 68,
    preauditVisualGap: 44,
    preauditPurchaseGap: 52,
    mobileGapProxy: 48,
    estimatedContrastCeiling: 52,
    businessMaturity: 72,
    ownBrandSignal: 80,
    alreadyPolishedPenalty: 10,
    expectRankTier: "mid",
    expectPreauditGate: false,
  },
  {
    label: "Serieus merk met standaard Shopify PDP",
    reasoning:
      "Ideale design-gap case: sterke business, goede assets, zwakke visuele en commerciële presentatie.",
    highTicketFocusedFit: 74,
    heroPrice: 249,
    assetReadinessProxy: 72,
    contentAvailableScore: 70,
    contentPresentationQuality: 38,
    preauditVisualGap: 78,
    preauditPurchaseGap: 72,
    mobileGapProxy: 70,
    estimatedContrastCeiling: 78,
    businessMaturity: 65,
    ownBrandSignal: 76,
    alreadyPolishedPenalty: 0,
    expectRankTier: "top",
    expectPreauditGate: true,
  },
];
