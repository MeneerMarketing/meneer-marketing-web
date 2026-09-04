import { getDataClient } from "@/lib/supabase/data-client";
import * as repo from "@/lib/repositories/lge";
import type {
  ActivityLogEntry,
  Business,
  City,
  CityExclusivity,
  Contact,
  DiscoveryRun,
  LeadListItem,
  PipelineKanbanItem,
  OutreachMessage,
  PreviewRecord,
  SeoOpportunity,
  TemplateRecord,
  Vertical,
} from "@/types/domain";
import { getVerticalPack } from "@/verticals/registry";
import type { OverviewMetrics } from "@/lib/repositories/lge";

export type { OverviewMetrics } from "@/lib/repositories/lge";

export async function getVerticals(): Promise<Vertical[]> {
  return repo.listVerticals(await getDataClient());
}

export async function getCities(): Promise<City[]> {
  return repo.listCities(await getDataClient());
}

export async function getTemplates(): Promise<TemplateRecord[]> {
  return repo.listTemplates(await getDataClient());
}

export async function getBusinesses(): Promise<Business[]> {
  return repo.listBusinesses(await getDataClient());
}

export async function getBusinessById(id: string): Promise<Business | undefined> {
  const row = await repo.getBusinessById(await getDataClient(), id);
  return row ?? undefined;
}

export async function getPreviews(): Promise<PreviewRecord[]> {
  return repo.listPreviews(await getDataClient());
}

export async function getPreviewsForBusiness(businessId: string): Promise<PreviewRecord[]> {
  return repo.listPreviewsForBusiness(await getDataClient(), businessId);
}

export async function getContactsForBusiness(businessId: string): Promise<Contact[]> {
  return repo.listContactsForBusiness(await getDataClient(), businessId);
}

export async function getSeoOpportunities(): Promise<SeoOpportunity[]> {
  return repo.listSeoOpportunities(await getDataClient());
}

export async function getSeoForBusiness(businessId: string): Promise<SeoOpportunity | undefined> {
  const row = await repo.getSeoForBusiness(await getDataClient(), businessId);
  return row ?? undefined;
}

export async function getExclusivity(): Promise<CityExclusivity[]> {
  return repo.listExclusivity(await getDataClient());
}

export async function getOutreachMessages(): Promise<OutreachMessage[]> {
  return repo.listOutreachMessages(await getDataClient());
}

export async function getOutreachMessageById(id: string): Promise<OutreachMessage | undefined> {
  const row = await repo.getOutreachMessageById(await getDataClient(), id);
  return row ?? undefined;
}

export async function getActivity(limit = 20): Promise<ActivityLogEntry[]> {
  return repo.listActivity(await getDataClient(), limit);
}

export async function getActivityForBusiness(businessId: string): Promise<ActivityLogEntry[]> {
  return repo.listActivityForBusiness(await getDataClient(), businessId);
}

export async function getDiscoveryRuns(limit = 20): Promise<DiscoveryRun[]> {
  return repo.listDiscoveryRuns(await getDataClient(), limit);
}

export interface DiscoveryRunEnriched {
  run: DiscoveryRun;
  verticalName: string;
  verticalSlug: string;
  cityName: string | null;
  citySlug: string | null;
  transformationCandidates: number;
  winnerName: string | null;
}

export async function getDiscoveryRunsEnriched(
  limit = 15
): Promise<DiscoveryRunEnriched[]> {
  const client = await getDataClient();
  const [runs, cities, verticals, businesses] = await Promise.all([
    repo.listDiscoveryRuns(client, limit),
    repo.listCities(client),
    repo.listVerticals(client),
    repo.listBusinesses(client),
  ]);

  return runs.map((run) => {
    const city = cities.find((c) => c.id === run.city_id) ?? null;
    const vertical = verticals.find((v) => v.id === run.vertical_id) ?? null;
    const summary = (run.coverage_summary ?? {}) as Record<string, unknown>;
    const transformationCandidates = Number(summary.transformation_candidates ?? 0);

    const cityBusinesses = businesses.filter(
      (b) =>
        b.city_id === run.city_id &&
        b.vertical_id === run.vertical_id &&
        !b.is_demo
    );
    const winner =
      cityBusinesses.find((b) => b.transformation_primary_candidate) ??
      cityBusinesses.find((b) => b.primary_candidate) ??
      null;

    return {
      run,
      verticalName: vertical?.name ?? "—",
      verticalSlug: vertical?.slug ?? "—",
      cityName: city?.name ?? null,
      citySlug: city?.slug ?? null,
      transformationCandidates,
      winnerName: winner?.studio_name ?? null,
    };
  });
}

export async function getLeadListItems(): Promise<LeadListItem[]> {
  return repo.getLeadListItems(await getDataClient());
}

export async function getPipelineKanbanItems(): Promise<PipelineKanbanItem[]> {
  return repo.getPipelineKanbanItems(await getDataClient());
}

export async function getOverviewMetrics(): Promise<OverviewMetrics> {
  return repo.getOverviewMetrics(await getDataClient());
}

export async function getDiscoveryStats() {
  const client = await getDataClient();
  const [verticals, cities, businesses, exclusivity] = await Promise.all([
    repo.listVerticals(client),
    repo.listCities(client),
    repo.listBusinesses(client),
    repo.listExclusivity(client),
  ]);

  return verticals.map((vertical) => {
    const verticalBusinesses = businesses.filter((b) => b.vertical_id === vertical.id);
    const cityIds = new Set(verticalBusinesses.map((b) => b.city_id));
    const exclusive = exclusivity.filter(
      (e) => e.vertical_id === vertical.id && e.status === "EXCLUSIVE"
    ).length;
    const qualified = verticalBusinesses.filter(
      (b) => b.qualification_status === "QUALIFIED" || b.qualification_status === "POTENTIAL"
    ).length;

    return {
      vertical,
      cityCount: cityIds.size || cities.filter((c) => c.country_code === "NL" || c.region_group === "VL").length,
      businessCount: verticalBusinesses.length,
      qualifiedCount: qualified,
      exclusiveCities: exclusive,
      lastScanLabel: getVerticalPack(vertical.slug)
        ? "Live Supabase · discovery beschikbaar"
        : "Nog niet gescand",
    };
  });
}

export async function getCityOpportunityRows(verticalSlug = "pilates") {
  const client = await getDataClient();
  const [verticals, cities, businesses, exclusivity] = await Promise.all([
    repo.listVerticals(client),
    repo.listCities(client),
    repo.listBusinesses(client),
    repo.listExclusivity(client),
  ]);

  const vertical = verticals.find((v) => v.slug === verticalSlug);
  if (!vertical) return [];

  return cities
    .map((city) => {
      const cityBusinesses = businesses.filter(
        (b) => b.vertical_id === vertical.id && b.city_id === city.id && !b.is_demo
      );
      const exclusivityRow = exclusivity.find(
        (e) => e.vertical_id === vertical.id && e.city_id === city.id
      );
      const winner =
        cityBusinesses.find((b) => b.primary_candidate) ??
        cityBusinesses
          .filter((b) => b.lead_score != null)
          .sort((a, b) => Number(b.lead_score) - Number(a.lead_score))[0] ??
        null;
      return {
        city,
        found: cityBusinesses.length,
        qualified: cityBusinesses.filter((b) => b.qualification_status === "QUALIFIED").length,
        exclusiveStatus: exclusivityRow?.status ?? "AVAILABLE",
        winner,
        winnerScore: winner?.lead_score ?? null,
        winnerPreview: winner?.preview_status ?? null,
        hasScored: cityBusinesses.some((b) => b.lead_score != null),
      };
    })
    .filter((row) => row.found > 0 || row.city.slug === "arnhem")
    .sort((a, b) => b.found - a.found);
}

export async function getCityDetail(verticalSlug: string, citySlug: string) {
  const client = await getDataClient();
  const [verticals, cities, businesses, exclusivity, previews, seoRows] = await Promise.all([
    repo.listVerticals(client),
    repo.listCities(client),
    repo.listBusinesses(client),
    repo.listExclusivity(client),
    repo.listPreviews(client),
    repo.listSeoOpportunities(client),
  ]);
  const vertical = verticals.find((v) => v.slug === verticalSlug);
  const city = cities.find((c) => c.slug === citySlug);
  if (!vertical || !city) return null;

  const cityBusinesses = businesses
    .filter((b) => b.vertical_id === vertical.id && b.city_id === city.id && !b.is_demo)
    .sort((a, b) => {
      if (a.city_rank != null && b.city_rank != null) return a.city_rank - b.city_rank;
      return Number(b.lead_score ?? 0) - Number(a.lead_score ?? 0);
    });

  const citySeo = seoRows.filter((s) => s.city_id === city.id);
  const clusteredDemand = Math.max(
    0,
    ...citySeo.map((s) => Number(s.total_clustered_demand ?? 0))
  );
  const highestOpp = [...cityBusinesses].sort(
    (a, b) => Number(b.seo_opportunity_score ?? 0) - Number(a.seo_opportunity_score ?? 0)
  )[0];
  const strongestVisibility = [...cityBusinesses].sort(
    (a, b) => Number(b.seo_visibility_score ?? 0) - Number(a.seo_visibility_score ?? 0)
  )[0];

  const keywordMarket: Array<{ keyword: string; volume: number | null; cluster: string }> = [];
  const seenKw = new Set<string>();
  for (const row of citySeo) {
    const metrics = (row.keyword_metrics ?? []) as Array<{
      keyword?: string;
      search_volume?: number | null;
      cluster?: string;
    }>;
    for (const m of metrics) {
      const key = String(m.keyword ?? "").toLowerCase();
      if (!key || seenKw.has(key)) continue;
      seenKw.add(key);
      keywordMarket.push({
        keyword: String(m.keyword),
        volume: m.search_volume ?? null,
        cluster: m.cluster ?? "unknown",
      });
    }
  }

  let coverage: {
    queries_run: number;
    unique_businesses: number;
    relevant_businesses: number;
    eligible_businesses: number;
    coverage_confidence: number;
    coverage_label: string;
    saturated: boolean;
    incremental_unique_by_query: Array<{
      label: string;
      results: number;
      unique_new: number;
      relevant_new: number;
      duplicates: number;
    }>;
    created_at: string | null;
  } | null = null;

  try {
    const admin = await import("@/lib/supabase/admin");
    if (admin.isAdminConfigured()) {
      const adminClient = admin.createAdminClient();
      const { data: coverageRow } = await adminClient
        .from("discovery_coverage")
        .select("*")
        .eq("vertical_id", vertical.id)
        .eq("city_id", city.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (coverageRow) {
        coverage = {
          queries_run: Number(coverageRow.queries_run ?? 0),
          unique_businesses: Number(coverageRow.unique_businesses ?? 0),
          relevant_businesses: Number(coverageRow.relevant_businesses ?? 0),
          eligible_businesses: Number(coverageRow.eligible_businesses ?? 0),
          coverage_confidence: Number(coverageRow.coverage_confidence ?? 0),
          coverage_label: String(coverageRow.coverage_label ?? "UNKNOWN"),
          saturated: Boolean(coverageRow.saturated),
          incremental_unique_by_query: (coverageRow.incremental_unique_by_query ??
            []) as Array<{
            label: string;
            results: number;
            unique_new: number;
            relevant_new: number;
            duplicates: number;
          }>,
          created_at: coverageRow.created_at ? String(coverageRow.created_at) : null,
        };
      }
    }
  } catch {
    coverage = null;
  }

  let outreachMeta: {
    capacity: { active: number; max: number; available: number };
    template_usage: Array<{
      template: string;
      label: string;
      status: "AVAILABLE" | "IN_USE";
      business_id: string | null;
      studio_name: string | null;
    }>;
    acquisition_protected: boolean;
    protection_reason: string | null;
    active_clients_in_city: number;
  } | null = null;

  try {
    const admin = await import("@/lib/supabase/admin");
    if (admin.isAdminConfigured()) {
      const { getCityOutreachCapacity, getTemplateUsageInCity } = await import(
        "@/services/city-outreach/cityOutreachService"
      );
      const { isCityManuallyProtected } = await import(
        "@/services/city-outreach/cityAcquisitionProtection"
      );
      const adminClient = admin.createAdminClient();
      const [capacity, templateUsage, protection] = await Promise.all([
        getCityOutreachCapacity({
          verticalSlug,
          verticalId: vertical.id,
          cityId: city.id,
        }),
        getTemplateUsageInCity({
          verticalSlug,
          verticalId: vertical.id,
          cityId: city.id,
        }),
        isCityManuallyProtected({
          verticalId: vertical.id,
          cityId: city.id,
          citySlug: city.slug,
        }),
      ]);

      const { count: activeClients } = await adminClient
        .from("businesses")
        .select("id", { count: "exact", head: true })
        .eq("vertical_id", vertical.id)
        .eq("city_id", city.id)
        .eq("lead_status", "CLIENT")
        .eq("is_demo", false);

      outreachMeta = {
        capacity: {
          active: capacity.active,
          max: capacity.max,
          available: capacity.available,
        },
        template_usage: templateUsage,
        acquisition_protected: protection.protected,
        protection_reason: protection.reason,
        active_clients_in_city: activeClients ?? 0,
      };
    }
  } catch {
    outreachMeta = null;
  }

  return {
    vertical,
    city,
    coverage,
    exclusivity:
      exclusivity.find((e) => e.vertical_id === vertical.id && e.city_id === city.id) ?? null,
    market: {
      clustered_demand: clusteredDemand,
      highest_opportunity: highestOpp
        ? {
            name: highestOpp.studio_name,
            score: highestOpp.seo_opportunity_score,
          }
        : null,
      strongest_visibility: strongestVisibility
        ? {
            name: strongestVisibility.studio_name,
            score: strongestVisibility.seo_visibility_score,
          }
        : null,
      keywords: keywordMarket.sort(
        (a, b) => Number(b.volume ?? 0) - Number(a.volume ?? 0)
      ),
    },
    businesses: cityBusinesses.map((b) => ({
      business: b,
      preview: previews.find((p) => p.business_id === b.id && p.status === "READY") ?? null,
      seo: citySeo.find((s) => s.business_id === b.id) ?? null,
    })),
    outreach: outreachMeta,
  };
}
