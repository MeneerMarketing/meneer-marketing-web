/**
 * Milestone 9.6.1 — ecommerce purchase mode from PDP/homepage HTML.
 */

import type { PurchaseMode } from "../../config/brandFirstBalancedCalibration.js";

export type PurchaseModeResult = {
  purchaseMode: PurchaseMode;
  confidence: number;
  evidence: string[];
};

export function detectPurchaseMode(input: {
  html: string;
  url: string | null;
  heroPrice: number | null;
  isEcommerce: boolean | null;
}): PurchaseModeResult {
  const html = input.html.toLowerCase();
  const evidence: string[] = [];
  const textSample = html.slice(0, 120_000);

  const hasPrice = input.heroPrice != null && input.heroPrice > 0;
  const hasAddToCart =
    /add-to-cart|add_to_cart|winkelwagen|in winkelwagen|koop nu|buy now|cart\.add|product-form/i.test(
      textSample
    );
  const hasConfigurator =
    /configurator|configure|customize|op maat|maatwerk|build your|samengesteld/i.test(textSample);
  const hasLeadGen =
    /offerte aanvragen|request quote|contact us|neem contact|bel voor|plan een|book a call|schedule/i.test(
      textSample
    );
  const hasShowroom =
    /showroom|bezoek onze winkel|visit our store|afspraak maken|dealer locator|showroom appointment/i.test(
      textSample
    );

  if (hasConfigurator) evidence.push("configurator_language");
  if (hasLeadGen) evidence.push("lead_generation_language");
  if (hasShowroom) evidence.push("showroom_language");
  if (hasAddToCart) evidence.push("add_to_cart_present");
  if (hasPrice) evidence.push("hero_price_present");

  if (hasLeadGen && !hasAddToCart && !hasPrice) {
    return { purchaseMode: "LEAD_GENERATION", confidence: 78, evidence };
  }

  if (hasShowroom && !hasAddToCart) {
    return { purchaseMode: "SHOWROOM_ASSISTED", confidence: 72, evidence };
  }

  if (hasConfigurator && (input.heroPrice == null || input.heroPrice > 3000)) {
    return { purchaseMode: "CONFIGURABLE_ECOMMERCE", confidence: 70, evidence };
  }

  if (hasAddToCart && hasPrice) {
    return { purchaseMode: "DIRECT_ECOMMERCE", confidence: 85, evidence };
  }

  if (input.isEcommerce && hasPrice) {
    return { purchaseMode: "DIRECT_ECOMMERCE", confidence: 62, evidence };
  }

  return { purchaseMode: "UNKNOWN", confidence: 40, evidence: ["purchase_mode_unclear"] };
}

export function purchaseModeScore(mode: PurchaseMode): number {
  switch (mode) {
    case "DIRECT_ECOMMERCE":
      return 92;
    case "CONFIGURABLE_ECOMMERCE":
      return 58;
    case "UNKNOWN":
      return 48;
    case "LEAD_GENERATION":
      return 18;
    case "SHOWROOM_ASSISTED":
      return 22;
    default:
      return 45;
  }
}
