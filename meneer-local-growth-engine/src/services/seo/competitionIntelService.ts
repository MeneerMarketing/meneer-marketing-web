import { createAdminClient } from "@/lib/supabase/admin";
import { getVerticalOfferConfig } from "@/config/verticalOffers";
import {
  fetchAndCacheDomainMetrics,
  getDomainMetricsCached,
  type DomainMetrics,
} from "@/services/seo/domainMetricsService";
import {
  findDomainRank,
  isDirectoryDomain,
  type SerpOrganicItem,
} from "@/services/seo/serpRankingService";
import type { Business, SeoOpportunity } from "@/types/domain";

export interface CompetitionIntelRow {
  domain: string;
  title: string | null;
  rank: number;
  domainRating: number | null;
  isDirectory: boolean;
}

export interface LeadCompetitionIntel {
  keyword: string;
  competitorCountTop10: number;
  ownRank: number | null;
  ownRankingUrl: string | null;
  competitors: CompetitionIntelRow[];
  headline: string;
  growthPlanSnippet: string | null;
  analyzedAt: string | null;
  hasSerpData: boolean;
}

function normalizeOwn(domain: string | null | undefined): string | null {
  if (!domain?.trim()) return null;
  return domain.replace(/^www\./, "").toLowerCase();
}

function defaultKeyword(cityName: string, verticalSlug: string): string {
  const offer = getVerticalOfferConfig(verticalSlug);
  return offer?.outreach?.defaultPrimaryKeyword?.(cityName) ?? `Pilates ${cityName}`;
}

function extractTop10Competitors(
  items: SerpOrganicItem[],
  ownDomain: string | null,
): CompetitionIntelRow[] {
  const own = normalizeOwn(ownDomain);
  const seen = new Set<string>();
  const rows: CompetitionIntelRow[] = [];

  for (const item of items) {
    const rank = item.rank_absolute ?? item.rank_group;
    if (rank == null || rank > 10) continue;
    const domain = normalizeOwn(item.domain ?? item.url);
    if (!domain || seen.has(domain)) continue;
    if (isDirectoryDomain(domain)) continue;
    if (own && (domain === own || domain.endsWith(`.${own}`) || own.endsWith(`.${domain}`))) {
      continue;
    }
    seen.add(domain);
    rows.push({
      domain,
      title: item.title,
      rank,
      domainRating: null,
      isDirectory: false,
    });
  }

  return rows.sort((a, b) => a.rank - b.rank);
}

function snapshotFallback(
  snapshot: unknown,
  keyword: string,
): CompetitionIntelRow[] {
  const rows = (snapshot as Array<{
    competitor_domain?: string;
    rank?: number | null;
    title?: string | null;
    is_directory?: boolean;
    keyword?: string;
  }> | null) ?? [];

  return rows
    .filter((row) => !row.is_directory && row.competitor_domain)
    .filter((row) => !row.keyword || row.keyword.toLowerCase() === keyword.toLowerCase())
    .map((row) => ({
      domain: String(row.competitor_domain),
      title: row.title ?? null,
      rank: Number(row.rank ?? 999),
      domainRating: null,
      isDirectory: false,
    }))
    .filter((row) => row.rank <= 10)
    .sort((a, b) => a.rank - b.rank);
}

function attachDomainRatings(
  rows: CompetitionIntelRow[],
  metrics: Map<string, DomainMetrics>,
): CompetitionIntelRow[] {
  return rows.map((row) => ({
    ...row,
    domainRating: metrics.get(row.domain)?.domainRating ?? row.domainRating,
  }));
}

export function buildCompetitionHeadline(keyword: string, count: number): string {
  const label = count === 1 ? "concurrent" : "concurrenten";
  return `${count} ${label} in top 10 Google voor '${keyword}'`;
}

export function buildGrowthPlanSnippet(
  intel: LeadCompetitionIntel,
  addressing: "singular" | "plural" = "singular",
): string | null {
  if (intel.competitorCountTop10 <= 0) return null;

  const examples = intel.competitors
    .slice(0, 2)
    .map((row) => {
      if (row.domainRating != null) {
        return `${row.domain} op #${row.rank} (DR ${row.domainRating})`;
      }
      return `${row.domain} op #${row.rank}`;
    })
    .join(" en ");

  const countLabel =
    intel.competitorCountTop10 === 1 ? "één concurrent" : `${intel.competitorCountTop10} concurrenten`;

  let sentence = `In Google voor ${intel.keyword} staan nu ${countLabel} in de top 10`;
  if (examples) sentence += `, waaronder ${examples}`;
  sentence += ".";

  const you = addressing === "singular" ? "Je" : "Jullie";
  if (intel.ownRank == null) {
    sentence += " Daar wil ik tussen.";
  } else if (intel.ownRank > 10) {
    sentence += ` ${you} staan nu op #${intel.ownRank}, buiten die top 10.`;
  }

  return sentence;
}

export async function getLeadCompetitionIntel(input: {
  businessId: string;
  fetchMissingMetrics?: boolean;
}): Promise<LeadCompetitionIntel | null> {
  const client = createAdminClient();
  const { data: businessRow } = await client
    .from("businesses")
    .select("*")
    .eq("id", input.businessId)
    .maybeSingle();
  if (!businessRow) return null;

  const business = businessRow as Business;
  const [{ data: city }, { data: vertical }, { data: seoRow }] = await Promise.all([
    client.from("cities").select("name, slug").eq("id", business.city_id).maybeSingle(),
    client.from("verticals").select("slug").eq("id", business.vertical_id).maybeSingle(),
    client.from("seo_opportunities").select("*").eq("business_id", business.id).maybeSingle(),
  ]);

  if (!city?.name) return null;
  const verticalSlug = String(vertical?.slug ?? "pilates");
  const seo = (seoRow as SeoOpportunity | null) ?? null;
  const keyword = seo?.primary_keyword ?? defaultKeyword(String(city.name), verticalSlug);
  const ownDomain = business.normalized_domain ?? business.domain;

  let serpItems: SerpOrganicItem[] = [];
  let competitors: CompetitionIntelRow[] = [];
  let hasSerpData = false;

  if (city.slug) {
    const { data: serpCache } = await client
      .from("seo_serp_cache")
      .select("items")
      .eq("vertical_slug", verticalSlug)
      .eq("city_slug", String(city.slug))
      .eq("keyword", keyword.toLowerCase())
      .maybeSingle();

    serpItems = (serpCache?.items as SerpOrganicItem[] | null) ?? [];
    if (serpItems.length > 0) {
      hasSerpData = true;
      competitors = extractTop10Competitors(serpItems, ownDomain);
    }
  }

  if (competitors.length === 0 && seo?.competitor_snapshot) {
    competitors = snapshotFallback(seo.competitor_snapshot, keyword);
    hasSerpData = competitors.length > 0;
  }

  const ownHit = findDomainRank(serpItems, ownDomain);
  const ownRank = seo?.current_rank ?? ownHit.rank ?? null;
  const ownRankingUrl = seo?.current_ranking_url ?? ownHit.url ?? null;

  let metrics = await getDomainMetricsCached(competitors.map((c) => c.domain));
  if (input.fetchMissingMetrics) {
    const enriched = await fetchAndCacheDomainMetrics({
      domains: competitors.map((c) => c.domain),
    });
    metrics = enriched.metrics;
  }

  competitors = attachDomainRatings(competitors, metrics);

  const intelBase: LeadCompetitionIntel = {
    keyword,
    competitorCountTop10: competitors.length,
    ownRank,
    ownRankingUrl,
    competitors,
    headline: buildCompetitionHeadline(keyword, competitors.length),
    growthPlanSnippet: null,
    analyzedAt: seo?.analyzed_at ?? null,
    hasSerpData,
  };

  return {
    ...intelBase,
    growthPlanSnippet: buildGrowthPlanSnippet(intelBase),
  };
}
