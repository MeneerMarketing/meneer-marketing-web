/**
 * Milestone 9.5 — split content richness from presentation quality.
 *
 * Vitalwave lesson: lots of text/features does not mean the page is visually
 * strong. High available + low presentation is the sweet spot.
 */
export type ContentPresentationInput = {
    descriptionLength: number;
    bodyTextLength: number;
    imageCount: number;
    videoPresent: boolean;
    faqPresent: boolean;
    featuresPresent: boolean;
    benefitsPresent: boolean;
    reviewCountProxy: boolean;
    sectionCount: number;
    styledBlocks: number;
    listOnlyBlocks: number;
};
export declare function computeContentPresentationGap(input: ContentPresentationInput): {
    contentAvailableScore: number;
    contentPresentationQuality: number;
    evidence: string[];
};
export declare function extractContentPresentationSignals(html: string): Omit<ContentPresentationInput, "descriptionLength" | "bodyTextLength" | "imageCount"> & {
    descriptionLength: number;
    bodyTextLength: number;
    imageCount: number;
};
//# sourceMappingURL=contentPresentationGap.d.ts.map