/**
 * Milestone 9.3.3 — international reach, category breadth and retailer breadth
 * as three separate measurements.
 *
 * The previous classifier collapsed them: a shop with many hreflang alternates
 * was called a mass retailer, which wrongly excluded international specialist
 * and DTC brands like CurrentBody. Selling in twenty countries says nothing
 * about how wide the assortment is.
 *
 * Only retailer breadth may drive a MASS_RETAILER verdict. International
 * presence feeds scale and maturity instead.
 */
import type { PageExtractedSignals } from "../../types/crawler.js";
export interface BreadthSignals {
    /** 0-100. How many countries this shop serves. Never excludes on its own. */
    internationalPresenceScore: number;
    /** 0-100. How many unrelated product verticals the assortment spans. */
    categoryBreadthScore: number;
    /** 0-100. Assortment width plus chain behaviour. Drives MASS_RETAILER. */
    retailerBreadthScore: number;
    verticalHits: number;
    localeAlternates: number;
    evidence: string[];
}
export declare const BREADTH_THRESHOLDS: {
    /** Verticals before an assortment counts as genuinely broad. */
    readonly broadVerticals: 4;
    /** Verticals plus category links before it is chain territory. */
    readonly chainVerticals: 5;
    readonly chainCategoryLinks: 40;
    /** Retailer breadth needed for a MASS_RETAILER verdict from the website. */
    readonly massRetailerBreadthScore: 70;
    /** Locale alternates before a shop counts as a full international operator. */
    readonly internationalOperatorLocales: 12;
};
export declare function countVerticalBreadth(text: string): number;
export declare function computeBreadthSignals(signals: PageExtractedSignals): BreadthSignals;
/**
 * A shop is only a mass retailer when the assortment is wide. International
 * reach is explicitly excluded here: that is the bug this milestone fixes.
 */
export declare function qualifiesAsMassRetailer(breadth: BreadthSignals): boolean;
//# sourceMappingURL=breadthSignals.d.ts.map