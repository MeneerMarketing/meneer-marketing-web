/**
 * Milestone 9.9.4 — visual focused brand production discovery.
 */
import { FOCUSED_BRAND_GAP_FIRST_TARGET_V1 } from "./focusedBrandGapFirst.js";
import { M992_PARKED_FAMILIES, M992_PRODUCT_QUERIES } from "./visualUnderdesignedDiscovery.js";
export const M994_DISCOVERY_VERSION = "VISUAL_FOCUSED_BRAND_PRODUCTION_V1";
export const M994_DISCOVERY_ROUTE = "visual_focused_brand_production";
/** Extra niches beyond M9.9.2 base set. */
const M994_EXTRA_QUERIES = [
    {
        query: "natuurlijke gezichtscreme merk kopen",
        familyId: "BEAUTY",
        familyLabel: "Beauty",
        productArchetype: "face_cream",
        lineage: "M994_BEAUTY",
    },
    {
        query: "haarverzorging merk webshop kopen",
        familyId: "BEAUTY",
        familyLabel: "Beauty",
        productArchetype: "hair_care",
        lineage: "M994_BEAUTY",
    },
    {
        query: "design woonaccessoire merk kopen",
        familyId: "NICHE_HOME",
        familyLabel: "Niche home",
        productArchetype: "home_accessory",
        lineage: "M994_NICHE_HOME",
    },
    {
        query: "premium servies set merk kopen",
        familyId: "KITCHEN_HOME",
        familyLabel: "Kitchen home",
        productArchetype: "tableware_set",
        lineage: "M994_KITCHEN",
    },
    {
        query: "outdoor kookset merk kopen",
        familyId: "OUTDOOR",
        familyLabel: "Outdoor",
        productArchetype: "outdoor_cookset",
        lineage: "M994_OUTDOOR",
    },
    {
        query: "sport recovery product kopen",
        familyId: "SPORT_SPECIALIST",
        familyLabel: "Sport specialist",
        productArchetype: "recovery_product",
        lineage: "M994_SPORT",
    },
];
export const M994_PRODUCT_QUERIES = [
    ...M992_PRODUCT_QUERIES,
    ...M994_EXTRA_QUERIES,
];
export const M994_DISCOVERY = {
    milestone: "M9.9.4",
    targetProfile: FOCUSED_BRAND_GAP_FIRST_TARGET_V1,
    integrityVersion: "SHOWCASE_CANDIDATE_INTEGRITY_V2",
    maxSourceQueries: 22,
    serpDepth: 50,
    serpDepthExtended: 100,
    estimatedSerpCostPerKeyword: 0.006,
    estimatedSerpCostExtendedPerKeyword: 0.01,
    maxRawCandidates: 100,
    maxValidPdpScreens: 28,
    maxVisuallyWeakBusinessQual: 18,
    maxVisionScreens: 28,
    maxValidatedProspectsListed: 5,
    maxStrongSalesListed: 5,
    maxCroOnlyListed: 5,
    currentVisualQualityShowcaseMax: 55,
    currentVisualQualityIdealMax: 45,
    crawlTimeoutMs: 18_000,
    screenshotDir: "m9.9.4-screenshots",
    desktop: { width: 1440, height: 1000 },
    mobile: { width: 390, height: 844 },
    screenshotTimeoutMs: 18_000,
    cleanmasterRegression: {
        domain: "cleanmastershop.nl",
        cvqRange: [30, 50],
        note: "Positive visual fixture; not hardcoded in scoring",
    },
};
export function buildM994HarvestQueries() {
    return M994_PRODUCT_QUERIES.slice(0, M994_DISCOVERY.maxSourceQueries);
}
export const M994_REPORT_PATH = "reports/visual-focused-brand-production-report.json";
export const M994_DASHBOARD_REPORT_PATH = "dashboard/src/preview/concepts/data/visual-focused-brand-production-report.json";
export { M992_PARKED_FAMILIES as M994_PARKED_FAMILIES };
//# sourceMappingURL=visualFocusedBrandProduction.js.map