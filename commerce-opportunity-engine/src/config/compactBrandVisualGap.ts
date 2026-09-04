/**
 * Milestone 9.9.7 — compact brand + strong visual gap production discovery.
 */

import type { M992ProductQuery } from "./visualUnderdesignedDiscovery.js";
import { M992_PARKED_FAMILIES, M992_PRODUCT_QUERIES } from "./visualUnderdesignedDiscovery.js";

export const M997_TARGET_PROFILE = "COMPACT_BRAND_STRONG_VISUAL_GAP_V1" as const;
export const M997_DISCOVERY_VERSION = "COMPACT_BRAND_VISUAL_GAP_PRODUCTION_V1" as const;
export const M997_DISCOVERY_ROUTE = "compact_brand_visual_gap_production" as const;

const M997_EXTRA_QUERIES: M992ProductQuery[] = [
  {
    query: "natuurlijke gezichtscreme merk kopen",
    familyId: "BEAUTY",
    familyLabel: "Beauty",
    productArchetype: "face_cream",
    lineage: "M997_BEAUTY",
  },
  {
    query: "haarverzorging merk webshop kopen",
    familyId: "BEAUTY",
    familyLabel: "Beauty",
    productArchetype: "hair_care",
    lineage: "M997_BEAUTY",
  },
  {
    query: "design woonaccessoire merk kopen",
    familyId: "NICHE_HOME",
    familyLabel: "Niche home",
    productArchetype: "home_accessory",
    lineage: "M997_NICHE_HOME",
  },
  {
    query: "premium servies set merk kopen",
    familyId: "KITCHEN_HOME",
    familyLabel: "Kitchen home",
    productArchetype: "tableware_set",
    lineage: "M997_KITCHEN",
  },
  {
    query: "outdoor kookset merk kopen",
    familyId: "OUTDOOR",
    familyLabel: "Outdoor",
    productArchetype: "outdoor_cookset",
    lineage: "M997_OUTDOOR",
  },
  {
    query: "sport recovery product kopen",
    familyId: "SPORT_SPECIALIST",
    familyLabel: "Sport specialist",
    productArchetype: "recovery_product",
    lineage: "M997_SPORT",
  },
  {
    query: "baby verzorging merk webshop kopen",
    familyId: "BABY_PARENT",
    familyLabel: "Baby parent",
    productArchetype: "baby_care",
    lineage: "M997_BABY",
  },
  {
    query: "wellness supplement merk kopen",
    familyId: "WELLNESS",
    familyLabel: "Wellness",
    productArchetype: "wellness_supplement",
    lineage: "M997_WELLNESS",
  },
];

export const M997_PRODUCT_QUERIES: M992ProductQuery[] = [
  ...M992_PRODUCT_QUERIES,
  ...M997_EXTRA_QUERIES,
];

export const M997_PARKED_FAMILIES = M992_PARKED_FAMILIES;

export function buildM997HarvestQueries(): M992ProductQuery[] {
  return M997_PRODUCT_QUERIES.slice(0, 24);
}

export const M997_DISCOVERY = {
  milestone: "M9.9.7",
  targetProfile: M997_TARGET_PROFILE,
  integrityVersion: "PRE_VISION_MARKETPLACE_CAPTURE_INTEGRITY_V1",
  maxSourceQueries: 24,
  serpDepth: 50,
  serpDepthExtended: 100,
  estimatedSerpCostPerKeyword: 0.006,
  estimatedSerpCostExtendedPerKeyword: 0.01,
  maxRawCandidates: 100,
  maxValidPdpScreens: 50,
  maxVisuallyWeakBusinessQual: 22,
  maxVisionScreens: 55,
  maxHumanReviewCandidates: 10,
  maxValidatedProspectsListed: 5,
  currentVisualQualityShowcaseMax: 48,
  currentVisualQualityIdealMax: 42,
  crawlTimeoutMs: 18_000,
  screenshotDir: "m9.9.7-screenshots",
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
  screenshotTimeoutMs: 18_000,
  skipReportPaths: [
    "reports/visual-focused-brand-production-report.json",
    "reports/compact-brand-visual-gap-production-report.json",
  ],
};

export const M997_REPORT_PATH = "reports/compact-brand-visual-gap-production-report.json";
export const M997_DASHBOARD_REPORT_PATH =
  "dashboard/src/preview/concepts/data/compact-brand-visual-gap-production-report.json";
