/**
 * Milestone 9.3.3 — runs the website classifier against its regression
 * fixtures. Used by the recompute job so a classifier change cannot silently
 * reintroduce the international-equals-mass-retailer bug.
 */
import { BUSINESS_CLASSIFIER_FIXTURES, buildPageSignals, } from "../../config/businessClassifierFixtures.js";
import { classifyBusinessFromWebsite } from "./businessClassifier.js";
function runFixture(fixture) {
    const signals = buildPageSignals(fixture.signals);
    const result = classifyBusinessFromWebsite(fixture.domain, signals, {
        isEcommerce: fixture.isEcommerce,
        ecommerceConfidence: fixture.ecommerceConfidence,
        signals: [],
        secondaryPagesCrawled: 0,
    });
    const forbidden = fixture.expectNot.includes(result.businessType);
    const allowed = fixture.expectOneOf.includes(result.businessType);
    const passed = allowed && !forbidden;
    return {
        label: fixture.label,
        domain: fixture.domain,
        verdict: result.businessType,
        passed,
        detail: passed
            ? result.businessTypeReasoning
            : `verwacht ${fixture.expectOneOf.join(" of ")}, kreeg ${result.businessType}: ${result.businessTypeReasoning}`,
        internationalPresenceScore: result.internationalPresenceScore,
        categoryBreadthScore: result.categoryBreadthScore,
        retailerBreadthScore: result.retailerBreadthScore,
    };
}
export function runBusinessClassifierRegression() {
    const cases = BUSINESS_CLASSIFIER_FIXTURES.map(runFixture);
    return {
        passed: cases.filter((entry) => entry.passed).length,
        total: cases.length,
        cases,
    };
}
//# sourceMappingURL=businessClassifierRegression.js.map