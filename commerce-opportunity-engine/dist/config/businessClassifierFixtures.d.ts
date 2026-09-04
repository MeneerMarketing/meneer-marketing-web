/**
 * Milestone 9.3.3 — regression fixtures for the website business classifier.
 *
 * These guard the general logic, not specific companies. Every fixture uses a
 * neutral domain carrying a realistic signal profile, so a passing test proves
 * the rules work rather than that a domain was hardcoded. The labels name the
 * archetype each profile represents.
 *
 * The rule under test: international reach must never on its own produce
 * MASS_RETAILER. Only assortment width may.
 */
import type { PageExtractedSignals } from "../types/crawler.js";
export interface BusinessClassifierFixture {
    label: string;
    domain: string;
    isEcommerce: boolean;
    ecommerceConfidence: number;
    signals: Partial<PageExtractedSignals> & {
        bodyTextSample: string;
    };
    /** Verdicts that are acceptable. */
    expectOneOf: string[];
    /** Verdicts that would be a regression. */
    expectNot: string[];
}
export declare function buildPageSignals(overrides: Partial<PageExtractedSignals> & {
    bodyTextSample: string;
}): PageExtractedSignals;
export declare const BUSINESS_CLASSIFIER_FIXTURES: BusinessClassifierFixture[];
//# sourceMappingURL=businessClassifierFixtures.d.ts.map