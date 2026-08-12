import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ActivityLogEntry,
  Business,
  City,
  CityExclusivity,
  Contact,
  DiscoveryRun,
  LeadListItem,
  LeadStatus,
  OutreachMessage,
  PreviewRecord,
  PreviewStatus,
  SeoOpportunity,
  TemplateRecord,
  Vertical,
} from "@/types/domain";

export async function listVerticals(client: SupabaseClient): Promise<Vertical[]> {
  const { data, error } = await client.from("verticals").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as Vertical[];
}

export async function listCities(client: SupabaseClient): Promise<City[]> {
  const { data, error } = await client.from("cities").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as City[];
}

export async function listTemplates(client: SupabaseClient): Promise<TemplateRecord[]> {
  const { data, error } = await client.from("templates").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as TemplateRecord[];
}

export async function listBusinesses(client: SupabaseClient): Promise<Business[]> {
  const { data, error } = await client
    .from("businesses")
    .select("*")
    .order("last_activity_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Business[];
}

export async function getBusinessById(
  client: SupabaseClient,
  id: string
): Promise<Business | null> {
  const { data, error } = await client.from("businesses").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Business | null) ?? null;
}

export async function listPreviews(client: SupabaseClient): Promise<PreviewRecord[]> {
  const { data, error } = await client
    .from("previews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PreviewRecord[];
}

export async function listPreviewsForBusiness(
  client: SupabaseClient,
  businessId: string
): Promise<PreviewRecord[]> {
  const { data, error } = await client
    .from("previews")
    .select("*")
    .eq("business_id", businessId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PreviewRecord[];
}

export async function listContactsForBusiness(
  client: SupabaseClient,
  businessId: string
): Promise<Contact[]> {
  const { data, error } = await client
    .from("contacts")
    .select("*")
    .eq("business_id", businessId)
    .order("is_primary", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Contact[];
}

export async function listSeoOpportunities(
  client: SupabaseClient
): Promise<SeoOpportunity[]> {
  const { data, error } = await client
    .from("seo_opportunities")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SeoOpportunity[];
}

export async function getSeoForBusiness(
  client: SupabaseClient,
  businessId: string
): Promise<SeoOpportunity | null> {
  const { data, error } = await client
    .from("seo_opportunities")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle();
  if (error) throw error;
  return (data as SeoOpportunity | null) ?? null;
}

export async function listExclusivity(
  client: SupabaseClient
): Promise<CityExclusivity[]> {
  const { data, error } = await client.from("city_exclusivity").select("*");
  if (error) throw error;
  return (data ?? []) as CityExclusivity[];
}

export async function listOutreachMessages(
  client: SupabaseClient
): Promise<OutreachMessage[]> {
  const { data, error } = await client
    .from("outreach_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as OutreachMessage[];
}

export async function getOutreachMessageById(
  client: SupabaseClient,
  id: string
): Promise<OutreachMessage | null> {
  const { data, error } = await client
    .from("outreach_messages")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as OutreachMessage | null) ?? null;
}

export async function listActivity(
  client: SupabaseClient,
  limit = 20
): Promise<ActivityLogEntry[]> {
  const { data, error } = await client
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ActivityLogEntry[];
}

export async function listActivityForBusiness(
  client: SupabaseClient,
  businessId: string
): Promise<ActivityLogEntry[]> {
  const { data, error } = await client
    .from("activity_log")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ActivityLogEntry[];
}

export async function listDiscoveryRuns(
  client: SupabaseClient,
  limit = 20
): Promise<DiscoveryRun[]> {
  const { data, error } = await client
    .from("discovery_runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as DiscoveryRun[];
}

export async function writeActivity(
  client: SupabaseClient,
  entry: {
    business_id?: string | null;
    activity_type: string;
    title: string;
    description?: string | null;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  const { error } = await client.from("activity_log").insert({
    business_id: entry.business_id ?? null,
    activity_type: entry.activity_type,
    title: entry.title,
    description: entry.description ?? null,
    metadata: entry.metadata ?? {},
  });
  if (error) throw error;
}

export async function getLeadListItems(client: SupabaseClient): Promise<LeadListItem[]> {
  const [businesses, verticals, cities, templates, previews, seo, exclusivity] =
    await Promise.all([
      listBusinesses(client),
      listVerticals(client),
      listCities(client),
      listTemplates(client),
      listPreviews(client),
      listSeoOpportunities(client),
      listExclusivity(client),
    ]);

  return businesses.map((business) => {
    const vertical = verticals.find((v) => v.id === business.vertical_id)!;
    const city = cities.find((c) => c.id === business.city_id)!;
    const template = business.selected_template_id
      ? templates.find((t) => t.id === business.selected_template_id) ?? null
      : null;
    const preview =
      previews.find((p) => p.business_id === business.id) ?? null;
    const seoRow = seo.find((s) => s.business_id === business.id) ?? null;
    const exclusivityRow =
      exclusivity.find(
        (e) => e.vertical_id === business.vertical_id && e.city_id === business.city_id
      ) ?? null;

    return {
      business,
      vertical,
      city,
      template,
      preview,
      seo: seoRow,
      exclusivity: exclusivityRow,
    };
  });
}

export interface OverviewMetrics {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  previewsReady: number;
  readyForOutreach: number;
  contacted: number;
  replied: number;
  meetings: number;
  clients: number;
  leadsThisWeek: number;
  previewsThisWeek: number;
  outreachDrafts: number;
  replyRateLabel: string;
  clientRateLabel: string;
  dataMode: "supabase";
  demoCount: number;
  liveCount: number;
}

function isThisWeek(iso: string | null | undefined): boolean {
  if (!iso) return false;
  return new Date(iso).getTime() >= Date.now() - 7 * 86400000;
}

export async function getOverviewMetrics(
  client: SupabaseClient
): Promise<OverviewMetrics> {
  const [businesses, previews, messages] = await Promise.all([
    listBusinesses(client),
    listPreviews(client),
    listOutreachMessages(client),
  ]);

  const countStatus = (statuses: LeadStatus[]) =>
    businesses.filter((b) => statuses.includes(b.lead_status)).length;

  const total = businesses.length;
  const contacted = countStatus(["CONTACTED", "REPLIED", "MEETING", "CLIENT"]);
  const replied = countStatus(["REPLIED", "MEETING", "CLIENT"]);
  const clients = countStatus(["CLIENT"]);

  return {
    totalLeads: total,
    newLeads: countStatus(["DISCOVERED"]),
    qualifiedLeads: businesses.filter(
      (b) =>
        b.qualification_status === "QUALIFIED" ||
        ![
          "DISCOVERED",
          "REJECTED",
          "DO_NOT_CONTACT",
        ].includes(b.lead_status)
    ).length,
    previewsReady: previews.filter((p) =>
      (["READY", "APPROVED"] as PreviewStatus[]).includes(p.status)
    ).length,
    readyForOutreach: countStatus(["READY_FOR_OUTREACH"]),
    contacted,
    replied,
    meetings: countStatus(["MEETING"]),
    clients,
    leadsThisWeek: businesses.filter((b) => isThisWeek(b.created_at)).length,
    previewsThisWeek: previews.filter((p) => isThisWeek(p.created_at)).length,
    outreachDrafts: messages.filter((m) => m.status === "DRAFT" || m.status === "READY")
      .length,
    replyRateLabel:
      contacted === 0 ? "n.v.t. (geen verzonden mails)" : `${Math.round((replied / contacted) * 100)}%`,
    clientRateLabel: total === 0 ? "n.v.t." : `${Math.round((clients / total) * 100)}% van leads`,
    dataMode: "supabase",
    demoCount: businesses.filter((b) => b.is_demo).length,
    liveCount: businesses.filter((b) => !b.is_demo).length,
  };
}
