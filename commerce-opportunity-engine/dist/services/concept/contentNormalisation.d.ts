/**
 * Milestone 9.1.1 — content normalisation.
 * Source facts → short display copy. No new claims. No raw ellipsis pills.
 */
export type NormalisedBenefit = {
    title: string;
    body: string;
    source: "SOURCE_CONTENT" | "DERIVED_COPY";
    provenance: string;
};
export type NormalisedTrustItem = {
    label: string;
    source: "SOURCE_CONTENT";
    provenance: string;
};
export declare function compactProductTitle(sourceTitle: string): {
    displayTitle: string;
    subheadline: string | null;
};
/**
 * Human editorial one-liner, composed only from facts that were verified
 * in the source (no new claim, no adjectives that add promise).
 */
export declare function buildEditorialSubline(benefits: NormalisedBenefit[], fallback: string | null): string | null;
/**
 * Story body written from verified facts instead of the raw description,
 * which is scraped prose (wrong person, mid-sentence cuts, SEO filler).
 */
export declare function buildStoryBody(benefits: NormalisedBenefit[]): string | null;
/** Pull clean trust chips from noisy page text. */
export declare function parseTrustItems(rawBody: string): NormalisedTrustItem[];
export declare function parseSocialProof(rawBody: string): {
    customersLabel: string | null;
};
/**
 * Map long description / FAQ facts into short benefit rows.
 * Only keep rows whose meaning is grounded in source text.
 */
export declare function normaliseBenefitsFromSource(input: {
    description: string | null;
    faqs: Array<{
        question: string;
        answer: string;
    }>;
    metaDescription?: string | null;
}): NormalisedBenefit[];
export declare function buildFeatureDeepDive(benefits: NormalisedBenefit[], images: Array<{
    url: string;
    kind: string;
}>): Array<{
    title: string;
    meta?: string;
    body: string;
    image?: string | null;
    source: "DERIVED_COPY" | "SOURCE_CONTENT";
}>;
export declare function cleanSnippet(raw: string | null | undefined, max?: number): string | null;
//# sourceMappingURL=contentNormalisation.d.ts.map