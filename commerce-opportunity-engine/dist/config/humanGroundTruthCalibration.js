/**
 * Milestone 9.9.7 — human ground truth calibration fixtures.
 * Used for regression/evaluator calibration only. No domain hardcoded penalties in scoring.
 */
export const M997_HUMAN_GROUND_TRUTH_FIXTURES = [
    {
        domain: "dermacom.shop",
        label: "DERMACOM",
        expectedLikelihood: "NO",
        expectedImpression: "MODERN_ENOUGH",
        expectedOutcome: "NO_FIRST_SHOWCASE",
        reasons: [
            "business interessant",
            "purchase gap sterk",
            "visueel al te goed",
        ],
        proxySignals: {
            catalogEstimate: 45,
            catalogVerified: true,
            categoryLinks: 8,
            currentVisualQualityScore: 58,
            companyScaleFit: 72,
            refinedBusinessModel: "DTC_OWN_BRAND",
        },
    },
    {
        domain: "haarstichting.nl",
        label: "HAARSTICHTING",
        expectedLikelihood: "NO",
        expectedImpression: "MODERN_ENOUGH",
        expectedOutcome: "NO_FIRST_SHOWCASE",
        reasons: [
            "purchase/mobile opportunity",
            "visueel al te verzorgd",
        ],
        proxySignals: {
            catalogEstimate: 35,
            catalogVerified: false,
            categoryLinks: 14,
            currentVisualQualityScore: 62,
            companyScaleFit: 68,
            refinedBusinessModel: "MOSTLY_OWN_BRAND",
        },
    },
    {
        domain: "cleanmastershop.nl",
        label: "CLEANMASTER",
        expectedLikelihood: "WEAK",
        expectedImpression: "BASIC_BUT_ACCEPTABLE",
        expectedOutcome: "REJECT_FIRST_SHOWCASE",
        reasons: [
            "visueel basic maar before/after niet dramatisch genoeg",
            "catalog/business te breed",
        ],
        proxySignals: {
            catalogEstimate: 180,
            catalogVerified: false,
            categoryLinks: 28,
            externalBrandBreadth: 12,
            currentVisualQualityScore: 48,
            companyScaleFit: 78,
            refinedBusinessModel: "FOCUSED_PRIVATE_LABEL_BRAND",
        },
    },
    {
        domain: "nordinahome.nl",
        label: "NORDINAHOME",
        expectedLikelihood: "WEAK",
        expectedImpression: "BASIC_BUT_ACCEPTABLE",
        expectedOutcome: "KEEP_NO_FIRST_SHOWCASE",
        reasons: ["current site te acceptabel voor eerste showcase"],
        proxySignals: {
            catalogEstimate: null,
            catalogVerified: false,
            categoryLinks: 18,
            currentVisualQualityScore: 52,
            companyScaleFit: 92,
            refinedBusinessModel: "MOSTLY_OWN_BRAND",
        },
    },
    {
        domain: "oceancross.nl",
        label: "OCEANCROSS",
        expectedLikelihood: "POSSIBLE",
        expectedImpression: "CLEARLY_UNDERDESIGNED",
        expectedOutcome: "KEEP_NO_FIRST_SHOWCASE",
        reasons: ["visueel zwakker maar ownership en fit nog twijfel"],
        proxySignals: {
            catalogEstimate: null,
            catalogVerified: false,
            categoryLinks: 12,
            currentVisualQualityScore: 42,
            companyScaleFit: 74,
            refinedBusinessModel: "MOSTLY_OWN_BRAND",
        },
    },
];
//# sourceMappingURL=humanGroundTruthCalibration.js.map