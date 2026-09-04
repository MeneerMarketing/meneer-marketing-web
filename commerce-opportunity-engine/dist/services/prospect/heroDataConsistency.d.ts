/**
 * Milestone 9.5.1 — compare hero targets across milestone reports.
 */
export type HeroConsistencyCase = {
    domain: string;
    m94: {
        heroProductId: string | null;
        heroTitle: string | null;
        heroPrice: number | null;
        heroProductUrl: string | null;
        keywords: string[];
    } | null;
    m95: {
        heroProductId: string | null;
        heroTitle: string | null;
        heroPrice: number | null;
        heroProductUrl: string | null;
        keywords: string[];
    } | null;
    assessment: string;
    likelyCause: string;
};
export declare function runHeroDataConsistencyCheck(projectRoot: string): Promise<{
    cases: HeroConsistencyCase[];
    vitalwaveNote: string;
}>;
//# sourceMappingURL=heroDataConsistency.d.ts.map