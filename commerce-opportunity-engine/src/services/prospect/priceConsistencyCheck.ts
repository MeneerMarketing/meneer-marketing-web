/**
 * Milestone 9.8.3 — generic product price consistency across HTML sources.
 */

import * as cheerio from "cheerio";
import { extractPageSignals } from "../crawler/pageExtractor.js";
import type { PriceConfidence } from "./highTicketGapSalesFit.js";

export interface PriceSourceReading {
  source: "json_ld" | "meta" | "dom_selector" | "visible_text";
  raw: string | null;
  value: number | null;
}

export interface PriceConsistencyResult {
  canonicalPrice: number | null;
  priceConfidence: PriceConfidence;
  sources: PriceSourceReading[];
  conflict: boolean;
  conflictReason: string | null;
  evidence: string[];
}

/** Parse NL/EU money strings (79,95 · 1.234,56 · 79.95). */
export function parseEuropeanMoneyAmount(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const numeric = trimmed.replace(/[^\d,.\-]/g, "").replace(/[.,]+$/g, "");
  if (!numeric) return null;

  let normalized = numeric;

  if (numeric.includes(",") && numeric.includes(".")) {
    const lastComma = numeric.lastIndexOf(",");
    const lastDot = numeric.lastIndexOf(".");
    if (lastComma > lastDot) {
      normalized = numeric.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = numeric.replace(/,/g, "");
    }
  } else if (numeric.includes(",")) {
    const parts = numeric.split(",");
    if (parts.length === 2 && parts[1].length === 2) {
      normalized = `${parts[0].replace(/\./g, "")}.${parts[1]}`;
    } else {
      normalized = numeric.replace(",", ".");
    }
  } else if (numeric.includes(".")) {
    const parts = numeric.split(".");
    if (parts.length === 2 && parts[1].length === 2) {
      normalized = numeric;
    } else if (parts.length === 2 && parts[1].length === 3) {
      normalized = parts.join("");
    } else {
      normalized = numeric.replace(/\./g, "");
    }
  }

  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

function pricesConflict(a: number, b: number): boolean {
  const max = Math.max(a, b);
  const min = Math.min(a, b);
  if (max <= 0) return false;
  const ratio = max / min;
  if (ratio >= 8 && max >= 500 && min < 250) return true;
  if (ratio >= 3 && max - min >= 150) return true;
  return false;
}

function isLikelyDecimalParseError(high: number, low: number): boolean {
  if (high < 500 || low >= 250) return false;
  const ratio = high / low;
  return ratio >= 80 && ratio <= 120;
}

export function assessPriceConsistency(input: {
  html: string;
  productUrl: string;
  primaryPrice: number | null;
}): PriceConsistencyResult {
  const evidence: string[] = [];
  const sources: PriceSourceReading[] = [];
  const signals = extractPageSignals(input.html, input.productUrl);
  const $ = cheerio.load(input.html);

  const jsonProduct = signals.jsonLdProducts[0] ?? null;
  if (jsonProduct?.price != null) {
    sources.push({
      source: "json_ld",
      raw: String(jsonProduct.price),
      value: jsonProduct.price,
    });
  }

  const metaRaw =
    $('meta[property="product:price:amount"]').attr("content") ??
    $('meta[itemprop="price"]').attr("content") ??
    null;
  if (metaRaw) {
    const metaValue = parseEuropeanMoneyAmount(metaRaw);
  const metaSuspectBareInteger =
    metaValue != null &&
    metaValue > 10000 &&
    !metaRaw.includes(",") &&
    !metaRaw.includes(".");
  if (metaValue != null && !metaSuspectBareInteger) {
    sources.push({
      source: "meta",
      raw: metaRaw,
      value: metaValue,
    });
  } else if (metaSuspectBareInteger) {
    evidence.push("meta_bare_integer_ignored");
  }
  }

  for (const selector of [
    "[itemprop='price']",
    ".price",
    ".product-price",
    "[class*='product-price']",
    "[data-product-price]",
  ]) {
    const el = $(selector).first();
    if (el.length === 0) continue;
    const text = el.text().trim();
    if (!text) continue;
    sources.push({
      source: "dom_selector",
      raw: text,
      value: parseEuropeanMoneyAmount(text),
    });
    break;
  }

  for (const match of signals.priceMatches.slice(0, 4)) {
    const value = parseEuropeanMoneyAmount(match);
    if (value != null) {
      sources.push({ source: "visible_text", raw: match, value });
    }
  }

  if (input.primaryPrice != null) {
    const hasPrimary = sources.some((s) => s.value === input.primaryPrice);
    if (!hasPrimary) {
      sources.push({
        source: "dom_selector",
        raw: String(input.primaryPrice),
        value: input.primaryPrice,
      });
    }
  }

  const values = sources
    .map((s) => s.value)
    .filter((v): v is number => v != null && v > 0);

  const plausible = values.filter((v) => v >= 15 && v <= 15000);
  const workingValues = plausible.length > 0 ? plausible : values;

  let conflict = false;
  let conflictReason: string | null = null;

  if (values.length >= 2) {
    const sorted = [...workingValues].sort((a, b) => a - b);
    const low = sorted[0];
    const high = sorted[sorted.length - 1];
    if (pricesConflict(high, low)) {
      conflict = true;
      conflictReason = isLikelyDecimalParseError(high, low)
        ? "decimal_thousands_parse_mismatch"
        : "multi_source_price_conflict";
      evidence.push(conflictReason);
    }
  }

  let canonicalPrice: number | null = input.primaryPrice;
  let priceConfidence: PriceConfidence = "UNKNOWN";

  if (conflict) {
    const sorted = [...workingValues].sort((a, b) => a - b);
    const low = sorted[0];
    const high = sorted[sorted.length - 1];
    if (isLikelyDecimalParseError(high, low)) {
      canonicalPrice = low;
      priceConfidence = "LOW";
      evidence.push("used_lower_price_after_parse_conflict");
    } else {
      const domOrVisible = sources.find(
        (s) => s.source === "dom_selector" || s.source === "visible_text"
      );
      canonicalPrice = domOrVisible?.value ?? low;
      priceConfidence = "LOW";
      evidence.push("conflict_defaults_to_visible_low");
    }
  } else if (workingValues.length === 1) {
    canonicalPrice = workingValues[0];
    priceConfidence = "HIGH";
    evidence.push("single_source_agreement");
  } else if (workingValues.length >= 2) {
    const median = workingValues[Math.floor(workingValues.length / 2)];
    canonicalPrice = median;
    priceConfidence = "HIGH";
    evidence.push("multi_source_agreement");
  } else if (input.primaryPrice != null) {
    canonicalPrice = input.primaryPrice;
    priceConfidence = "MEDIUM";
    evidence.push("primary_price_only");
  }

  return {
    canonicalPrice,
    priceConfidence,
    sources,
    conflict,
    conflictReason,
    evidence,
  };
}
