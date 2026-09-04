/**
 * Milestone 9.6.1 — retailer → brand extraction regression (no API).
 */

import {
  classifyOrganicEntitySync,
  extractProductBrandName,
} from "./productBrandExtractor.js";

export type ExtractionRegressionCase = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type ExtractionRegressionResult = {
  passed: number;
  total: number;
  cases: ExtractionRegressionCase[];
};

export function runProductBrandExtractionRegression(): ExtractionRegressionResult {
  const cases: ExtractionRegressionCase[] = [];

  const retailerExternalBrand = classifyOrganicEntitySync({
    normalizedDomain: "beautybylisa.nl",
    title: "FOREO BEAR - Microcurrent Gezichtsapparaat",
    likelyRetailer: true,
    resolvedOfficialDomain: "foreo.com",
  });
  cases.push({
    id: "A",
    label: "retailer verkoopt extern merk → official brand candidate",
    passed:
      retailerExternalBrand.entityRole === "OFFICIAL_BRAND_DOMAIN" &&
      retailerExternalBrand.merchantDomain === "beautybylisa.nl" &&
      retailerExternalBrand.officialBrandDomain === "foreo.com",
    detail: `${retailerExternalBrand.entityRole} / ${retailerExternalBrand.officialBrandDomain ?? "null"}`,
  });

  const privateLabelNoDomain = classifyOrganicEntitySync({
    normalizedDomain: "horecatraders.com",
    title: "House Brand Professional Mixer XL",
    likelyRetailer: true,
    resolvedOfficialDomain: null,
  });
  cases.push({
    id: "B",
    label: "private label retailer zonder official domain → geen verzonnen brand",
    passed:
      privateLabelNoDomain.entityRole === "MERCHANT_DOMAIN" &&
      privateLabelNoDomain.officialBrandDomain == null,
    detail: `${privateLabelNoDomain.entityRole}`,
  });

  const directBrand = classifyOrganicEntitySync({
    normalizedDomain: "gladskin.eu",
    title: "Gladskin Eczema Care",
    likelyRetailer: false,
  });
  cases.push({
    id: "C",
    label: "first-party brand result → direct official candidate",
    passed:
      directBrand.entityRole === "OFFICIAL_BRAND_DOMAIN" &&
      directBrand.officialBrandDomain === "gladskin.eu",
    detail: `${directBrand.entityRole} / ${directBrand.officialBrandDomain ?? "null"}`,
  });

  const brandName = extractProductBrandName("FOREO BEAR Microcurrent Gezichtsapparaat");
  cases.push({
    id: "D",
    label: "product brand extractie uit retailer title",
    passed: brandName === "FOREO",
    detail: `extracted:${brandName ?? "null"}`,
  });

  return {
    passed: cases.filter((c) => c.passed).length,
    total: cases.length,
    cases,
  };
}
