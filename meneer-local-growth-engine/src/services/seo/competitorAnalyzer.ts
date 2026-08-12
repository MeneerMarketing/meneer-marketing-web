/**
 * Competitor snapshot helpers for local SERP analysis.
 * Distinguishes directories/marketplaces from likely real studios.
 */
export {
  buildCompetitors,
  type CompetitorSnap,
} from "@/services/seo/seoOpportunityScorer";
export { isDirectoryDomain } from "@/services/seo/serpRankingService";

export function summarizeCompetitors(
  snaps: Array<{ competitor_domain: string; is_directory: boolean; rank: number | null }>
): {
  studio_domains: string[];
  directory_domains: string[];
  strongest_studio: string | null;
} {
  const studios = snaps.filter((s) => !s.is_directory);
  const directories = snaps.filter((s) => s.is_directory);
  const strongest = [...studios].sort(
    (a, b) => Number(a.rank ?? 999) - Number(b.rank ?? 999)
  )[0];
  return {
    studio_domains: Array.from(new Set(studios.map((s) => s.competitor_domain))).slice(0, 5),
    directory_domains: Array.from(new Set(directories.map((s) => s.competitor_domain))).slice(
      0,
      5
    ),
    strongest_studio: strongest?.competitor_domain ?? null,
  };
}
