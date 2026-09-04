import type { SignalClassification } from "../types/signals.js";
import { loadSignalWeights } from "./signalWeights.js";

export function classifySerpSignal(input: {
  serpItemType: string;
  rawItem: Record<string, unknown>;
}): SignalClassification {
  const weights = loadSignalWeights();
  const rawType = typeof input.rawItem.type === "string" ? input.rawItem.type : "";
  const isPaidFlag = input.rawItem.is_paid === true;

  if (input.serpItemType === "paid" || rawType === "paid") {
    return {
      adSignalType: "CONFIRMED_PAID",
      paidConfidence: weights.confirmedSearchAd,
      confirmationSource: "serp_paid_text",
    };
  }

  if (input.serpItemType === "shopping" || input.serpItemType === "popular_products") {
    if (isPaidFlag) {
      return {
        adSignalType: "CONFIRMED_PAID",
        paidConfidence: weights.sponsoredShopping,
        confirmationSource: "serp_sponsored_shopping",
      };
    }

    if (input.serpItemType === "popular_products") {
      return {
        adSignalType: "PAID_CANDIDATE",
        paidConfidence: weights.popularProducts,
        confirmationSource: "serp_popular_products",
      };
    }

    return {
      adSignalType: "PAID_CANDIDATE",
      paidConfidence: weights.genericShopping,
      confirmationSource: "serp_generic_shopping",
    };
  }

  if (rawType === "popular_products_element" || rawType === "shopping_element") {
    if (isPaidFlag) {
      return {
        adSignalType: "CONFIRMED_PAID",
        paidConfidence: weights.sponsoredShopping,
        confirmationSource: "serp_sponsored_shopping",
      };
    }

    return {
      adSignalType: "PAID_CANDIDATE",
      paidConfidence: weights.popularProducts,
      confirmationSource: "serp_popular_products",
    };
  }

  return {
    adSignalType: "NON_PAID",
    paidConfidence: 0,
    confirmationSource: null,
  };
}

export function classifyFromStoredOccurrence(row: {
  serp_item_type?: string | null;
  raw_payload?: Record<string, unknown> | null;
}): SignalClassification {
  const rawPayload = row.raw_payload ?? {};
  const serpItemType =
    row.serp_item_type ??
    (typeof rawPayload.parent_serp_type === "string" ? rawPayload.parent_serp_type : "") ??
    (typeof rawPayload.type === "string" ? rawPayload.type : "unknown");

  return classifySerpSignal({
    serpItemType,
    rawItem: rawPayload,
  });
}
