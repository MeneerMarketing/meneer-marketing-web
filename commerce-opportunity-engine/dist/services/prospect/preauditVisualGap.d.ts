/**
 * Milestone 9.5 — cheap pre-audit visual design gap (0-100).
 *
 * Higher score = more room for a premium DTC transformation. This is not page
 * quality; it estimates how template-driven or generic the first viewport feels.
 */
export type PreauditVisualGapInput = {
    html: string;
    url: string;
    platform: string | null;
    bodyTextLength: number;
    imageCount: number;
    sectionCount: number;
    pdpWeaknessProxy: number | null;
    estimatedContrastCeiling: number | null;
};
export declare function computePreauditVisualGap(input: PreauditVisualGapInput): {
    score: number;
    evidence: string[];
};
export declare function countDomSections(html: string): number;
//# sourceMappingURL=preauditVisualGap.d.ts.map