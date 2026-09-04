/**
 * Milestone 9.7 — product entity extraction from third-party SERP rows.
 */

import { extractProductBrandName } from "./productBrandExtractor.js";

export const GENERIC_BRAND_BLOCKLIST = new Set([
  "best",
  "beste",
  "low",
  "high",
  "new",
  "the",
  "werkt",
  "voorbij",
  "led",
  "betaalbaar",
  "mijn",
  "what",
  "shop",
  "webshop",
  "online",
  "premium",
  "professional",
  "pro",
  "smart",
  "beauty",
  "wellness",
  "sonic",
  "laser",
  "therapy",
  "device",
  "apparaat",
  "elektrische",
  "compact",
  "multi",
  "gen",
  "series",
  "philips",
  "oral",
]);

export type ThirdPartyProductExtraction = {
  productBrand: string | null;
  productTitle: string | null;
  productModel: string | null;
  observedPrice: number | null;
  currency: string | null;
  productBrandConfidence: number;
  evidence: string[];
};

function readPrice(raw: Record<string, unknown>): number | null {
  const priceBlock = raw.price as Record<string, unknown> | undefined;
  const candidates = [
    priceBlock?.current,
    priceBlock?.value,
    raw.price_current,
    raw.price,
  ];
  for (const value of candidates) {
    const num = Number(value);
    if (Number.isFinite(num) && num > 0) return num;
  }
  return null;
}

function extractModel(title: string | null): string | null {
  if (!title) return null;
  const modelMatch = title.match(/\b([A-Z]{1,3}[-]?\d{2,5}[A-Z]?)\b/);
  if (modelMatch) return modelMatch[1];
  const proMatch = title.match(/\b([A-Za-z]+(?:\s+Pro|\s+MAX|\s+Plus))\b/i);
  return proMatch?.[1]?.trim() ?? null;
}

export function isPlausibleMinedBrand(name: string | null): boolean {
  if (!name || name.length < 3) return false;
  const lower = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (GENERIC_BRAND_BLOCKLIST.has(lower)) return false;
  if (lower.length < 3) return false;
  return true;
}

export function extractThirdPartyProductEntity(input: {
  title: string | null;
  description: string | null;
  rawItem?: Record<string, unknown>;
}): ThirdPartyProductExtraction {
  const evidence: string[] = [];
  const raw = input.rawItem ?? {};
  const productTitle = input.title?.trim() ?? null;

  let productBrand = extractProductBrandName(productTitle);
  const schemaBrand =
    typeof raw.brand === "string"
      ? raw.brand
      : typeof (raw.product as Record<string, unknown> | undefined)?.brand === "string"
        ? ((raw.product as Record<string, unknown>).brand as string)
        : null;
  if (schemaBrand && isPlausibleMinedBrand(schemaBrand)) {
    productBrand = schemaBrand.trim();
    evidence.push("schema_brand");
  } else if (productBrand) {
    evidence.push("title_brand_pattern");
  }

  if (!isPlausibleMinedBrand(productBrand)) {
    return {
      productBrand: null,
      productTitle,
      productModel: extractModel(productTitle),
      observedPrice: readPrice(raw),
      currency: typeof raw.currency === "string" ? raw.currency : "EUR",
      productBrandConfidence: 0,
      evidence: ["implausible_or_missing_brand"],
    };
  }

  let confidence = 45;
  if (evidence.includes("schema_brand")) confidence += 25;
  if (evidence.includes("title_brand_pattern")) confidence += 18;
  if (productTitle && productTitle.toLowerCase().includes(productBrand!.toLowerCase())) {
    confidence += 12;
    evidence.push("brand_in_title");
  }
  const price = readPrice(raw);
  if (price != null) {
    confidence += 8;
    evidence.push("price_observed");
  }
  const model = extractModel(productTitle);
  if (model) {
    confidence += 6;
    evidence.push(`model:${model}`);
  }

  return {
    productBrand: productBrand!,
    productTitle,
    productModel: model,
    observedPrice: price,
    currency: "EUR",
    productBrandConfidence: Math.max(0, Math.min(100, confidence)),
    evidence,
  };
}
