import type { KeywordMetricRow } from "@/services/seo/keywordMetricsService";
import { clusteredDemand } from "@/services/seo/keywordMetricsService";
import type { SerpCacheResult } from "@/services/seo/serpRankingService";
import { findDomainRank, isDirectoryDomain } from "@/services/seo/serpRankingService";
import type { Business } from "@/types/domain";

export interface CompetitorSnap {
  competitor_domain: string;
  keyword: string;
  rank: number | null;
  result_type: string;
  title: string | null;
  is_directory: boolean;
}

export interface SeoOpportunityResult {
  visibility_score: number;
  seo_readiness_score: number;
  seo_opportunity_score: number;
  primary_keyword: string;
  secondary_keywords: string[];
  primary_search_volume: number;
  total_clustered_demand: number;
  current_rank: number | null;
  current_ranking_url: string | null;
  keyword_rows: Array<{
    keyword: string;
    intent?: string;
    cluster: string;
    search_volume: number | null;
    rank: number | null;
    url: string | null;
  }>;
  competitors: CompetitorSnap[];
  components: {
    search_demand: number;
    visibility_gap: number;
    commercial_relevance: number;
    service_relevance: number;
    serp_competition: number;
    seo_readiness: number;
    positives: string[];
    negatives: string[];
  };
  status: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function rankToVisibilityPoints(rank: number | null): number {
  if (rank == null) return 5;
  if (rank <= 3) return 95;
  if (rank <= 10) return 75;
  if (rank <= 20) return 50;
  return 25;
}

export function scoreSeoReadiness(business: Business): {
  score: number;
  positives: string[];
  negatives: string[];
} {
  const positives: string[] = [];
  const negatives: string[] = [];
  let score = 35;

  const intel = (business.website_intelligence ?? {}) as {
    pages?: Array<{ title?: string; text?: string; html?: string; url?: string }>;
    raw_headings?: string[];
  };
  const pages = intel.pages ?? [];
  const blob = pages.map((p) => `${p.title} ${p.text}`).join(" ").toLowerCase();
  const headings = (intel.raw_headings ?? []).join(" ").toLowerCase();

  if (business.website_url?.startsWith("https")) {
    score += 8;
    positives.push("HTTPS");
  } else if (business.website_url) {
    negatives.push("Geen HTTPS");
    score -= 5;
  } else {
    negatives.push("Geen website");
    score -= 20;
  }

  if (/<title>|title aanwezig/i.test(JSON.stringify(pages)) || pages.some((p) => p.title)) {
    score += 8;
    positives.push("Title signalen");
  } else {
    negatives.push("Zwakke title-signalen");
  }

  if (headings.includes("h1") || pages.some((p) => /pilates|reformer/i.test(p.title ?? ""))) {
    score += 6;
  }

  const cityHint = String(business.address ?? "").toLowerCase();
  if (cityHint && blob.includes(cityHint.split(" ")[0] ?? "___")) {
    score += 5;
    positives.push("Lokale city-signalen op site");
  }

  if (/reformer|mat pilates|privé|private|zwanger/i.test(blob)) {
    score += 10;
    positives.push("Service-content zichtbaar");
  } else {
    negatives.push("Beperkte service-pagina signalen");
    score -= 5;
  }

  if (/schema|json-ld|localbusiness/i.test(JSON.stringify(pages))) {
    score += 8;
    positives.push("Structured data hint");
  } else {
    negatives.push("Geen structured data hint");
  }

  // Partial overlap with website opportunity: keep SEO readiness lighter on pure design issues
  if (Number(business.website_quality_score ?? 50) < 40) {
    score -= 5;
    negatives.push("Zwakke technische basis (gedeeltelijk)");
  }

  return { score: clamp(score), positives, negatives };
}

export function scoreVisibility(
  keywordRows: Array<{ keyword: string; search_volume: number | null; rank: number | null }>
): number {
  if (!keywordRows.length) return 10;
  let weighted = 0;
  let weightSum = 0;
  for (const row of keywordRows) {
    const w = Math.max(1, Number(row.search_volume ?? 0) + 5);
    weighted += rankToVisibilityPoints(row.rank) * w;
    weightSum += w;
  }
  return clamp(weighted / weightSum);
}

export function buildCompetitors(
  serps: SerpCacheResult[],
  ownDomain: string | null
): CompetitorSnap[] {
  const own = normalizeOwn(ownDomain);
  const snaps: CompetitorSnap[] = [];
  for (const serp of serps) {
    for (const item of serp.items.slice(0, 8)) {
      const domain = item.domain ?? null;
      if (!domain) continue;
      if (own && normalizeOwn(domain) === own) continue;
      snaps.push({
        competitor_domain: domain,
        keyword: serp.keyword,
        rank: item.rank_absolute ?? item.rank_group,
        result_type: item.type,
        title: item.title,
        is_directory: isDirectoryDomain(domain),
      });
      if (snaps.length >= 5) return snaps;
    }
  }
  return snaps;
}

function normalizeOwn(domain: string | null): string | null {
  if (!domain) return null;
  return domain.replace(/^www\./, "").toLowerCase();
}

export function scoreSeoOpportunity(input: {
  business: Business;
  metrics: KeywordMetricRow[];
  serps: SerpCacheResult[];
  serviceTypes: string[];
}): SeoOpportunityResult {
  const domain = input.business.normalized_domain ?? input.business.domain;
  const keywordRows = input.metrics.map((m) => {
    const serp = input.serps.find((s) => s.keyword.toLowerCase() === m.keyword.toLowerCase());
    const hit = findDomainRank(serp?.items ?? [], domain);
    return {
      keyword: m.keyword,
      intent: m.intent,
      cluster: m.cluster,
      search_volume: m.search_volume,
      rank: hit.rank,
      url: hit.url,
    };
  });

  const demand = clusteredDemand(input.metrics);
  const primary =
    keywordRows.find((k) => k.intent === "PRIMARY") ??
    keywordRows.sort((a, b) => Number(b.search_volume ?? 0) - Number(a.search_volume ?? 0))[0];

  const visibility = scoreVisibility(keywordRows);
  const readiness = scoreSeoReadiness(input.business);
  const competitors = buildCompetitors(input.serps, domain);

  const positives: string[] = [...readiness.positives];
  const negatives: string[] = [...readiness.negatives];

  // search demand 0-100 from clustered volumes (local NL pilates often low absolute)
  const demandScore = clamp(
    demand.total <= 0 ? 15 : demand.total < 10 ? 35 : demand.total < 40 ? 55 : demand.total < 100 ? 75 : 90
  );
  if (demand.total > 0) positives.push(`Clustered local demand ~${demand.total}/mnd`);
  else negatives.push("Geen aantoonbaar search volume");

  const visibilityGap = clamp(100 - visibility);
  if (visibility < 40) positives.push("Grote visibility gap");
  else if (visibility > 75) negatives.push("Al sterk zichtbaar (lagere opportunity)");

  const commercialRelevance = clamp(
    40 +
      (primary?.intent === "PRIMARY" ? 20 : 10) +
      (Number(primary?.search_volume ?? 0) > 0 ? 15 : 0) +
      (input.serviceTypes.includes("reformer") ? 10 : 0)
  );

  const serviceRelevance = clamp(
    30 + input.serviceTypes.length * 12 + (input.serviceTypes.includes("reformer") ? 15 : 0)
  );

  const studioCompetitors = competitors.filter((c) => !c.is_directory);
  const serpCompetition = clamp(
    studioCompetitors.length >= 4 ? 70 : studioCompetitors.length >= 2 ? 55 : 35
  );

  // Avoid double-counting pure website quality: readiness already lightly includes it.
  // Opportunity focuses on demand × gap × relevance.
  const seoOpportunity = clamp(
    demandScore * 0.28 +
      visibilityGap * 0.28 +
      commercialRelevance * 0.14 +
      serviceRelevance * 0.12 +
      (100 - serpCompetition) * 0.08 + // less crowded = higher opp
      readiness.score * 0.1
  );

  let status: SeoOpportunityResult["status"] = "LOW";
  if (seoOpportunity >= 80) status = "VERY_HIGH";
  else if (seoOpportunity >= 65) status = "HIGH";
  else if (seoOpportunity >= 45) status = "MEDIUM";

  const secondary = keywordRows
    .filter((k) => k.keyword !== primary?.keyword)
    .slice(0, 5)
    .map((k) => k.keyword);

  return {
    visibility_score: visibility,
    seo_readiness_score: readiness.score,
    seo_opportunity_score: seoOpportunity,
    primary_keyword: primary?.keyword ?? `Pilates`,
    secondary_keywords: secondary,
    primary_search_volume: Number(primary?.search_volume ?? 0),
    total_clustered_demand: demand.total,
    current_rank: primary?.rank ?? null,
    current_ranking_url: primary?.url ?? null,
    keyword_rows: keywordRows,
    competitors,
    components: {
      search_demand: demandScore,
      visibility_gap: visibilityGap,
      commercial_relevance: commercialRelevance,
      service_relevance: serviceRelevance,
      serp_competition: serpCompetition,
      seo_readiness: readiness.score,
      positives: positives.slice(0, 10),
      negatives: negatives.slice(0, 10),
    },
    status,
  };
}
