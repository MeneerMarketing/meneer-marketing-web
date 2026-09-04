import type { KeywordIntentType } from "./keywordIntentType.js";
import { normalizeKeyword } from "./normalizeKeyword.js";

export type ProspectingTier = "PRIMARY" | "SECONDARY" | "LOW_VALUE" | "REJECT";

export interface ProspectingValueInput {
  intentType: KeywordIntentType;
  commercialIntent: number | null;
  productIntent: number | null;
  keywordQuality: number | null;
  searchVolume: number | null;
  competition: number | null;
  cpc: number | null;
  /** Optional observed yield signals (0 if unscanned). */
  uniqueDomains?: number | null;
  leadEligibleFound?: number | null;
  shopifyFound?: number | null;
  generalRetailersFound?: number | null;
  comparisonSitesFound?: number | null;
  confirmedAdvertisersFound?: number | null;
}

export function scoreProspectingValue(input: ProspectingValueInput & { keyword?: string }): {
  score: number;
  reasons: string[];
} {
  let score = 40;
  const reasons: string[] = [];

  switch (input.intentType) {
    case "NON_BRANDED_PRODUCT":
      score += 28;
      reasons.push("intent:non_branded_product");
      break;
    case "PRODUCT_BRANDED":
      score += 8;
      reasons.push("intent:product_branded");
      break;
    case "RETAILER_BRANDED":
      score -= 45;
      reasons.push("intent:retailer_branded");
      break;
    case "BRAND_NAVIGATIONAL":
      score -= 30;
      reasons.push("intent:navigational");
      break;
    case "REVIEW_RESEARCH":
      score -= 18;
      reasons.push("intent:review_research");
      break;
    case "INFORMATIONAL":
      score -= 35;
      reasons.push("intent:informational");
      break;
    case "SERVICE":
      score -= 40;
      reasons.push("intent:service");
      break;
    default:
      score -= 10;
      reasons.push("intent:other");
  }

  const commercial = input.commercialIntent ?? 0;
  const product = input.productIntent ?? 0;
  score += Math.round(commercial * 0.18);
  score += Math.round(product * 0.16);
  reasons.push(`commercial:${commercial}`);
  reasons.push(`product:${product}`);

  if (input.keyword) {
    const tokenCount = normalizeKeyword(input.keyword).split(" ").filter(Boolean).length;
    if (tokenCount >= 2 && tokenCount <= 5) {
      score += 8;
      reasons.push("specificity_good");
    } else if (tokenCount === 1) {
      score -= 10;
      reasons.push("too_broad");
    }
  }

  if (input.searchVolume != null) {
    if (input.searchVolume >= 50 && input.searchVolume <= 5000) {
      score += 8;
      reasons.push("volume_sweet_spot");
    } else if (input.searchVolume > 20000) {
      score -= 8;
      reasons.push("volume_too_broad");
    }
  }

  if ((input.competition ?? 0) >= 0.4 || (input.cpc ?? 0) >= 0.5) {
    score += 6;
    reasons.push("paid_competition_signal");
  }

  const domains = input.uniqueDomains ?? 0;
  const eligible = input.leadEligibleFound ?? 0;
  const shopify = input.shopifyFound ?? 0;
  const retailers = input.generalRetailersFound ?? 0;
  const comparison = input.comparisonSitesFound ?? 0;

  if (domains > 0) {
    if (eligible > 0) {
      score += Math.min(18, eligible * 8);
      reasons.push(`eligible_found:${eligible}`);
    }
    if (shopify > 0) {
      score += Math.min(12, shopify * 5);
      reasons.push(`shopify_found:${shopify}`);
    }
    if (retailers + comparison >= Math.max(3, domains * 0.6)) {
      score -= 22;
      reasons.push("retailer_heavy_serp");
    } else if (retailers >= 3 && eligible === 0) {
      score -= 14;
      reasons.push("retailers_no_eligible");
    }
    if ((input.confirmedAdvertisersFound ?? 0) > 0 && eligible > 0) {
      score += 6;
      reasons.push("confirmed_plus_eligible");
    }
  }

  return {
    score: clamp(score),
    reasons,
  };
}

export function assignProspectingTier(input: {
  intentType: KeywordIntentType;
  prospectingValue: number;
  commercialIntent: number | null;
  productIntent: number | null;
  historicalHighYield?: boolean;
}): { tier: ProspectingTier; eligibleForAutoApproval: boolean; reason: string } {
  if (
    input.intentType === "RETAILER_BRANDED" ||
    input.intentType === "INFORMATIONAL" ||
    input.intentType === "SERVICE" ||
    input.intentType === "BRAND_NAVIGATIONAL"
  ) {
    return {
      tier: input.intentType === "RETAILER_BRANDED" ? "REJECT" : "REJECT",
      eligibleForAutoApproval: false,
      reason: `reject_intent:${input.intentType}`,
    };
  }

  if (input.intentType === "REVIEW_RESEARCH") {
    return {
      tier: input.prospectingValue >= 55 ? "LOW_VALUE" : "REJECT",
      eligibleForAutoApproval: false,
      reason: "review_research",
    };
  }

  if (input.intentType === "PRODUCT_BRANDED") {
    if (input.historicalHighYield) {
      return {
        tier: "PRIMARY",
        eligibleForAutoApproval: false,
        reason: "product_branded_historical_high_yield",
      };
    }
    return {
      tier: "SECONDARY",
      eligibleForAutoApproval: false,
      reason: "product_branded_secondary",
    };
  }

  // NON_BRANDED_PRODUCT / OTHER
  if (
    input.intentType === "NON_BRANDED_PRODUCT" &&
    input.prospectingValue >= 70 &&
    (input.commercialIntent ?? 0) >= 65 &&
    (input.productIntent ?? 0) >= 55
  ) {
    const auto =
      input.prospectingValue >= 75 &&
      (input.commercialIntent ?? 0) >= 70 &&
      (input.productIntent ?? 0) >= 75;
    return {
      tier: "PRIMARY",
      eligibleForAutoApproval: auto,
      reason: auto ? "primary_auto_eligible" : "primary",
    };
  }

  if (input.prospectingValue >= 55) {
    return {
      tier: "SECONDARY",
      eligibleForAutoApproval: false,
      reason: "secondary_moderate_value",
    };
  }

  if (input.prospectingValue >= 35) {
    return {
      tier: "LOW_VALUE",
      eligibleForAutoApproval: false,
      reason: "low_value",
    };
  }

  return {
    tier: "REJECT",
    eligibleForAutoApproval: false,
    reason: "reject_low_prospecting_value",
  };
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}
