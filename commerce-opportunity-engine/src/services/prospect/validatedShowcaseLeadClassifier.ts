/**
 * Milestone 9.9.4 — validated showcase / sales lead types.
 */

import type {
  CurrentSiteImpression,
  ShowcaseOwnershipClass,
} from "./showcaseCandidateIntegrity.js";
import type { VisualRedesignOpportunityType } from "./visualRedesignSalesFit.js";

export type M994LeadType =
  | "VALIDATED_SHOWCASE_PROSPECT"
  | "STRONG_SALES_PROSPECT"
  | "CRO_ONLY_OPPORTUNITY"
  | "REJECT";

const OWNERSHIP_SALES_MODELS: ShowcaseOwnershipClass[] = [
  "DTC_OWN_BRAND",
  "MOSTLY_OWN_BRAND",
  "MANUFACTURER_DTC",
  "FOCUSED_PRIVATE_LABEL_BRAND",
];

function ownershipSalesOk(
  model: ShowcaseOwnershipClass,
  confidence: number
): boolean {
  if (model === "GENERAL_RETAILER" || model === "GENERAL_RESELLER") return false;
  if (model === "FOCUSED_SPECIALIST_RESELLER") return false;
  if (OWNERSHIP_SALES_MODELS.includes(model)) return confidence >= 50;
  if (model === "UNKNOWN") return confidence >= 58;
  return false;
}

export function classifyM994LeadType(input: {
  showcaseIntegrityPass: boolean;
  validatedVisualSalesFit: number;
  currentSiteImpression: CurrentSiteImpression;
  refinedBusinessModel: ShowcaseOwnershipClass;
  brandOwnershipConfidence: number;
  businessQualified: boolean;
  visualRedesignOpportunityType: VisualRedesignOpportunityType | null;
  currentVisualQualityScore: number | null;
  redesignMaterialFeasibility: number | null;
  businessModelSalesCandidate: boolean;
  visionScoreAllowed?: boolean;
  captureHealth?: string | null;
  preVisionHardReject?: boolean;
}): {
  leadType: M994LeadType;
  opportunityTier: string;
  whyNotShowcase: string | null;
} {
  const cvq = input.currentVisualQualityScore ?? 60;
  const material = input.redesignMaterialFeasibility ?? 0;

  if (input.preVisionHardReject) {
    return {
      leadType: "REJECT",
      opportunityTier: "NO_VALUE",
      whyNotShowcase: "pre_vision_marketplace_retailer",
    };
  }

  if (!input.visionScoreAllowed || input.captureHealth === "BOT_CHALLENGE" || input.captureHealth === "ACCESS_DENIED" || input.captureHealth === "ERROR_PAGE" || input.captureHealth === "EMPTY") {
    return {
      leadType: "REJECT",
      opportunityTier: "NO_VALUE",
      whyNotShowcase: "invalid_capture",
    };
  }

  if (
    input.showcaseIntegrityPass &&
    input.businessQualified &&
    ownershipSalesOk(input.refinedBusinessModel, input.brandOwnershipConfidence) &&
    (input.currentSiteImpression === "CLEARLY_UNDERDESIGNED" ||
      input.currentSiteImpression === "BASIC_BUT_ACCEPTABLE") &&
    input.validatedVisualSalesFit >= 62 &&
    material >= 60
  ) {
    return {
      leadType: "VALIDATED_SHOWCASE_PROSPECT",
      opportunityTier: "VALIDATED_SHOWCASE_PROSPECT",
      whyNotShowcase: null,
    };
  }

  if (
    input.visualRedesignOpportunityType === "CRO_ONLY_OPPORTUNITY" &&
    (cvq >= 55 || input.currentSiteImpression === "MODERN_ENOUGH") &&
    input.validatedVisualSalesFit >= 48
  ) {
    return {
      leadType: "CRO_ONLY_OPPORTUNITY",
      opportunityTier: "CRO_ONLY_OPPORTUNITY",
      whyNotShowcase: "modern_or_purchase_heavy",
    };
  }

  if (
    input.validatedVisualSalesFit >= 58 &&
    input.businessQualified &&
    input.businessModelSalesCandidate &&
    ownershipSalesOk(input.refinedBusinessModel, input.brandOwnershipConfidence) &&
    material >= 55
  ) {
    return {
      leadType: "STRONG_SALES_PROSPECT",
      opportunityTier: "STRONG_SALES_PROSPECT",
      whyNotShowcase: "strong_business_but_not_primary_showcase",
    };
  }

  let why: string | null = "insufficient_fit";
  if (!input.businessQualified) why = "business_not_qualified";
  else if (!ownershipSalesOk(input.refinedBusinessModel, input.brandOwnershipConfidence)) {
    why = "ownership_or_reseller";
  } else if (
    input.currentSiteImpression === "MODERN_ENOUGH" ||
    input.currentSiteImpression === "PREMIUM"
  ) {
    why = "modern_enough";
  } else if (material < 60) why = "low_material";

  return {
    leadType: "REJECT",
    opportunityTier: "NO_VALUE",
    whyNotShowcase: why,
  };
}
