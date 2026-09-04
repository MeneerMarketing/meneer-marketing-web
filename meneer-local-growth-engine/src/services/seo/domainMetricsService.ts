import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeDomain } from "@/lib/utils/normalize";
import { dataForSeoPost } from "@/services/seo/dataforseoClient";

export interface DomainMetrics {
  domain: string;
  domainRating: number | null;
  backlinksRank: number | null;
  backlinksTotal: number | null;
}

interface BacklinksSummaryResponse {
  tasks?: Array<{
    cost?: number;
    result?: Array<{
      items?: Array<{
        target?: string;
        rank?: number;
        backlinks?: number;
      }>;
    }>;
  }>;
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function normalizeHost(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  return normalizeDomain(raw)?.replace(/^www\./, "").toLowerCase() ?? null;
}

export function backlinksRankToDomainRating(rank: number | null | undefined): number | null {
  if (rank == null || Number.isNaN(rank)) return null;
  return Math.max(0, Math.min(100, Math.round(Number(rank) / 10)));
}

export async function getDomainMetricsCached(
  domains: string[],
): Promise<Map<string, DomainMetrics>> {
  const client = createAdminClient();
  const hosts = Array.from(
    new Set(domains.map((d) => normalizeHost(d)).filter(Boolean) as string[]),
  );
  const map = new Map<string, DomainMetrics>();
  if (hosts.length === 0) return map;

  const { data } = await client
    .from("seo_domain_metrics_cache")
    .select("domain, backlinks_rank, domain_rating, backlinks_total, fetched_at")
    .in("domain", hosts);

  const cutoff = Date.now() - CACHE_TTL_MS;
  for (const row of data ?? []) {
    const fetchedAt = new Date(String(row.fetched_at)).getTime();
    if (Number.isNaN(fetchedAt) || fetchedAt < cutoff) continue;
    map.set(String(row.domain), {
      domain: String(row.domain),
      domainRating: row.domain_rating != null ? Number(row.domain_rating) : null,
      backlinksRank: row.backlinks_rank != null ? Number(row.backlinks_rank) : null,
      backlinksTotal: row.backlinks_total != null ? Number(row.backlinks_total) : null,
    });
  }
  return map;
}

export async function fetchAndCacheDomainMetrics(input: {
  domains: string[];
  maxCost?: number;
}): Promise<{ metrics: Map<string, DomainMetrics>; cost: number }> {
  const client = createAdminClient();
  const cached = await getDomainMetricsCached(input.domains);
  const missing = Array.from(
    new Set(
      input.domains
        .map((d) => normalizeHost(d))
        .filter((d): d is string => typeof d === "string" && !cached.has(d)),
    ),
  );

  const metrics = new Map(cached);
  let cost = 0;
  const maxCost = input.maxCost ?? Number(process.env.SEO_MAX_DOMAIN_METRICS_COST ?? 0.08);

  if (missing.length === 0 || maxCost <= 0) {
    return { metrics, cost };
  }

  const batch = missing.slice(0, 8);
  const { data, cost: apiCost } = await dataForSeoPost<BacklinksSummaryResponse>(
    "/backlinks/summary/live",
    batch.map((target) => ({
      target,
      internal_list_limit: 1,
      backlinks_status_type: "live",
    })),
  );
  cost += apiCost;

  const items = data.tasks?.[0]?.result?.[0]?.items ?? [];
  const rows: Array<{
    domain: string;
    backlinks_rank: number | null;
    domain_rating: number | null;
    backlinks_total: number | null;
    fetched_at: string;
  }> = [];

  for (const item of items) {
    const domain = normalizeHost(item.target ?? null);
    if (!domain) continue;
    const backlinksRank = item.rank != null ? Number(item.rank) : null;
    const domainRating = backlinksRankToDomainRating(backlinksRank);
    const entry: DomainMetrics = {
      domain,
      domainRating,
      backlinksRank,
      backlinksTotal: item.backlinks != null ? Number(item.backlinks) : null,
    };
    metrics.set(domain, entry);
    rows.push({
      domain,
      backlinks_rank: backlinksRank,
      domain_rating: domainRating,
      backlinks_total: entry.backlinksTotal,
      fetched_at: new Date().toISOString(),
    });
  }

  if (rows.length > 0) {
    await client.from("seo_domain_metrics_cache").upsert(rows, { onConflict: "domain" });
  }

  return { metrics, cost };
}
