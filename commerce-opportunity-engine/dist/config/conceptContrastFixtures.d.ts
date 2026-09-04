/**
 * Milestone 9.3.4 — regression fixtures for concept_contrast_potential.
 *
 * These are signal profiles, not domains. Nothing in the scorer knows a domain
 * name, so the fixtures have to guard the logic itself: does an already premium
 * page lose contrast, does a strong business with a plain page gain it, and
 * does a shop without material stay out regardless of how bad its page is.
 *
 * The CurrentBody profile is here because it is the exact trap this milestone
 * closes: a perfect business prospect that is a poor design target.
 */
import type { ConceptContrastInput } from "../services/concept/conceptContrastPotential.js";
export type ContrastFixture = {
    label: string;
    reasoning: string;
    input: ConceptContrastInput;
    expectBandOneOf: string[];
    /** Whether this profile may become the PREMIUM_DTC design pilot. */
    expectDesignTarget: boolean;
};
export declare const CONTRAST_FIXTURES: ContrastFixture[];
//# sourceMappingURL=conceptContrastFixtures.d.ts.map