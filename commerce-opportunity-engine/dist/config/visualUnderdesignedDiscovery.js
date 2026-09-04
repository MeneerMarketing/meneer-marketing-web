/**
 * Milestone 9.9.2 — visually underdesigned focused brand search.
 */
import { FOCUSED_BRAND_GAP_FIRST_TARGET_V1 } from "./focusedBrandGapFirst.js";
export const M992_DISCOVERY_VERSION = "VISUALLY_UNDERDESIGNED_FOCUSED_BRAND_V1";
export const M992_DISCOVERY_ROUTE = "visual_underdesigned_pdp_gap_first";
/** Parked — not first-case targets. */
export const M992_PARKED_FAMILIES = ["SLEEP_COMFORT", "PET_PRODUCTS"];
/** Broad ecommerce niches — avoid device-heavy M9.8.2 pools. */
export const M992_PRODUCT_QUERIES = [
    {
        query: "natuurlijke deodorant webshop kopen",
        familyId: "PERSONAL_CARE",
        familyLabel: "Personal care",
        productArchetype: "natural_deodorant",
        lineage: "M992_PERSONAL",
    },
    {
        query: "luxe handzeep merk kopen",
        familyId: "PERSONAL_CARE",
        familyLabel: "Personal care",
        productArchetype: "luxury_hand_soap",
        lineage: "M992_PERSONAL",
    },
    {
        query: "design keukenaccessoire merk kopen",
        familyId: "KITCHEN_HOME",
        familyLabel: "Kitchen home",
        productArchetype: "kitchen_accessory",
        lineage: "M992_KITCHEN",
    },
    {
        query: "premium koffiebeker kopen",
        familyId: "KITCHEN_HOME",
        familyLabel: "Kitchen home",
        productArchetype: "premium_travel_mug",
        lineage: "M992_KITCHEN",
    },
    {
        query: "ergonomische bureaustoel webshop kopen",
        familyId: "ERGONOMIC",
        familyLabel: "Ergonomic",
        productArchetype: "ergonomic_chair",
        lineage: "M992_ERGO",
    },
    {
        query: "yoga mat premium kopen",
        familyId: "SPORT_WELLNESS",
        familyLabel: "Sport wellness",
        productArchetype: "yoga_mat",
        lineage: "M992_SPORT",
    },
    {
        query: "foam roller merk kopen",
        familyId: "SPORT_WELLNESS",
        familyLabel: "Sport wellness",
        productArchetype: "foam_roller",
        lineage: "M992_SPORT",
    },
    {
        query: "lichtgewicht campingstoel kopen",
        familyId: "OUTDOOR",
        familyLabel: "Outdoor",
        productArchetype: "camping_chair",
        lineage: "M992_OUTDOOR",
    },
    {
        query: "draagstoel outdoor kopen",
        familyId: "OUTDOOR",
        familyLabel: "Outdoor",
        productArchetype: "outdoor_seat",
        lineage: "M992_OUTDOOR",
    },
    {
        query: "design deurmat kopen",
        familyId: "HOME_PRODUCTS",
        familyLabel: "Home products",
        productArchetype: "design_doormat",
        lineage: "M992_HOME",
    },
    {
        query: "premium bedlinnen merk kopen",
        familyId: "HOME_PRODUCTS",
        familyLabel: "Home products",
        productArchetype: "bedlinnen",
        lineage: "M992_HOME",
    },
    {
        query: "aromatherapie diffuser kopen",
        familyId: "HOME_WELLNESS",
        familyLabel: "Home wellness",
        productArchetype: "aroma_diffuser",
        lineage: "M992_WELLNESS",
    },
    {
        query: "eco wasmiddel merk kopen",
        familyId: "HOME_PRODUCTS",
        familyLabel: "Home products",
        productArchetype: "eco_detergent",
        lineage: "M992_HOME",
    },
    {
        query: "babyfoon premium kopen",
        familyId: "BABY_PARENT",
        familyLabel: "Baby parent",
        productArchetype: "baby_monitor",
        lineage: "M992_BABY",
    },
    {
        query: "kinderfiets merk kopen",
        familyId: "BABY_PARENT",
        familyLabel: "Baby parent",
        productArchetype: "kids_bike",
        lineage: "M992_BABY",
    },
    {
        query: "design telefoonhoes kopen",
        familyId: "ACCESSORIES",
        familyLabel: "Premium accessories",
        productArchetype: "phone_case",
        lineage: "M992_ACCESSORIES",
    },
    {
        query: "modelbouw verf set kopen",
        familyId: "HOBBY_SPECIALIST",
        familyLabel: "Hobby specialist",
        productArchetype: "model_paint_set",
        lineage: "M992_HOBBY",
    },
    {
        query: "massagekussen elektrisch kopen",
        familyId: "WELLNESS",
        familyLabel: "Wellness",
        productArchetype: "massage_cushion",
        lineage: "M992_WELLNESS",
    },
];
export const M992_DISCOVERY = {
    milestone: "M9.9.2",
    targetProfile: FOCUSED_BRAND_GAP_FIRST_TARGET_V1,
    maxSourceQueries: 18,
    serpDepth: 50,
    estimatedSerpCostPerKeyword: 0.006,
    maxRawCandidates: 90,
    maxValidPdpScreens: 60,
    maxVisuallyWeakBusinessQual: 22,
    maxVisionScreens: 55,
    maxShowcaseCandidates: 10,
    maxShowcaseScreenshots: 5,
    maxCroOnlyListed: 8,
    currentVisualQualityShowcaseMax: 55,
    currentVisualQualityIdealMax: 45,
    crawlTimeoutMs: 18_000,
    screenshotDir: "m9.9.2-screenshots",
    desktop: { width: 1440, height: 1000 },
    mobile: { width: 390, height: 844 },
    screenshotTimeoutMs: 18_000,
};
export function buildM992HarvestQueries() {
    return M992_PRODUCT_QUERIES.slice(0, M992_DISCOVERY.maxSourceQueries);
}
export const M992_REPORT_PATH = "reports/visual-underdesigned-focused-brand-report.json";
export const M992_DASHBOARD_REPORT_PATH = "dashboard/src/preview/concepts/data/visual-underdesigned-focused-brand-report.json";
//# sourceMappingURL=visualUnderdesignedDiscovery.js.map