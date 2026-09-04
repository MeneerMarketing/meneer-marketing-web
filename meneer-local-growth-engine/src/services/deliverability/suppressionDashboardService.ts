import { createAdminClient } from "@/lib/supabase/admin";
import {
  classifyEmailIssue,
  invalidEmailLabel,
  normalizeEmail,
  suppressionReasonLabel,
  type InvalidEmailIssue,
} from "@/lib/utils/emailValidation";

export interface CityDeliverabilityRow {
  cityId: string;
  cityName: string;
  suppressions: number;
  bounces: number;
  invalidEmails: number;
  deadLeads: number;
}

export interface VerticalDeliverabilityRow {
  verticalId: string;
  verticalName: string;
  suppressions: number;
  bounces: number;
  invalidEmails: number;
  deadLeads: number;
  cities: CityDeliverabilityRow[];
}

export interface SuppressionListRow {
  email: string;
  reason: string;
  reasonLabel: string;
  source: string | null;
  studioName: string | null;
  cityName: string | null;
  verticalName: string | null;
  businessId: string | null;
  createdAt: string;
}

export interface InvalidLeadRow {
  businessId: string;
  studioName: string;
  cityName: string;
  verticalName: string;
  issue: InvalidEmailIssue;
  issueLabel: string;
  email: string | null;
}

export interface DeliverabilityDashboardSummary {
  totals: {
    suppressions: number;
    bounces: number;
    invalidEmails: number;
    deadLeads: number;
  };
  byVertical: VerticalDeliverabilityRow[];
  suppressions: SuppressionListRow[];
  invalidLeads: InvalidLeadRow[];
}

interface BusinessRow {
  id: string;
  studio_name: string;
  city_id: string;
  vertical_id: string;
  email: string | null;
  is_demo: boolean;
}

function pickBusinessEmail(
  business: BusinessRow,
  contacts: Array<{ email: string | null; is_primary: boolean }>,
): string | null {
  const primary = contacts.find((c) => c.is_primary && c.email)?.email;
  const anyContact = contacts.find((c) => c.email)?.email;
  return normalizeEmail(primary ?? anyContact ?? business.email);
}

export async function getDeliverabilityDashboard(): Promise<DeliverabilityDashboardSummary> {
  const client = createAdminClient();

  const [
    { data: suppressionsRaw },
    { data: businessesRaw },
    { data: contactsRaw },
    { data: citiesRaw },
    { data: verticalsRaw },
    { data: bouncedMessages },
  ] = await Promise.all([
    client
      .from("email_suppressions")
      .select("id, email, reason, source, business_id, created_at")
      .order("created_at", { ascending: false }),
    client.from("businesses").select("id, studio_name, city_id, vertical_id, email, is_demo"),
    client.from("contacts").select("business_id, email, is_primary"),
    client.from("cities").select("id, name"),
    client.from("verticals").select("id, name"),
    client
      .from("outreach_messages")
      .select("business_id")
      .eq("is_test", false)
      .eq("status", "BOUNCED"),
  ]);

  const cityMap = new Map((citiesRaw ?? []).map((c) => [String(c.id), String(c.name)]));
  const verticalMap = new Map((verticalsRaw ?? []).map((v) => [String(v.id), String(v.name)]));
  const businessMap = new Map(
    (businessesRaw ?? []).map((b) => [String(b.id), b as BusinessRow]),
  );

  const contactsByBusiness = new Map<string, Array<{ email: string | null; is_primary: boolean }>>();
  for (const row of contactsRaw ?? []) {
    const businessId = String(row.business_id);
    const list = contactsByBusiness.get(businessId) ?? [];
    list.push({
      email: (row.email as string | null) ?? null,
      is_primary: Boolean(row.is_primary),
    });
    contactsByBusiness.set(businessId, list);
  }

  const suppressionEmailSet = new Set<string>();
  for (const row of suppressionsRaw ?? []) {
    const email = normalizeEmail(row.email as string);
    if (email) suppressionEmailSet.add(email);
  }

  const bouncedBusinessIds = new Set(
    (bouncedMessages ?? []).map((m) => String(m.business_id)).filter(Boolean),
  );

  const deadByCityVertical = new Map<
    string,
    { suppressions: number; bounces: number; invalid: number; dead: Set<string> }
  >();

  function bucketKey(verticalId: string, cityId: string): string {
    return `${verticalId}:${cityId}`;
  }

  function ensureBucket(verticalId: string, cityId: string) {
    const key = bucketKey(verticalId, cityId);
    if (!deadByCityVertical.has(key)) {
      deadByCityVertical.set(key, {
        suppressions: 0,
        bounces: 0,
        invalid: 0,
        dead: new Set(),
      });
    }
    return deadByCityVertical.get(key)!;
  }

  function markDead(
    businessId: string,
    verticalId: string,
    cityId: string,
    kind: "suppressions" | "bounces" | "invalid",
  ) {
    const bucket = ensureBucket(verticalId, cityId);
    bucket[kind] += 1;
    bucket.dead.add(businessId);
  }

  const suppressionRows: SuppressionListRow[] = (suppressionsRaw ?? []).map((row) => {
    const businessId = row.business_id ? String(row.business_id) : null;
    const business = businessId ? businessMap.get(businessId) : undefined;
    const reason = String(row.reason);
    if (business && !business.is_demo) {
      markDead(business.id, business.vertical_id, business.city_id, "suppressions");
    }
    return {
      email: String(row.email),
      reason,
      reasonLabel: suppressionReasonLabel(reason),
      source: (row.source as string | null) ?? null,
      studioName: business?.studio_name ?? null,
      cityName: business ? cityMap.get(business.city_id) ?? null : null,
      verticalName: business ? verticalMap.get(business.vertical_id) ?? null : null,
      businessId,
      createdAt: String(row.created_at),
    };
  });

  for (const businessId of bouncedBusinessIds) {
    const business = businessMap.get(businessId);
    if (!business || business.is_demo) continue;
    markDead(business.id, business.vertical_id, business.city_id, "bounces");
  }

  const invalidLeads: InvalidLeadRow[] = [];

  for (const business of businessMap.values()) {
    if (business.is_demo) continue;
    const contacts = contactsByBusiness.get(business.id) ?? [];
    const email = pickBusinessEmail(business, contacts);
    const issue = classifyEmailIssue({
      email,
      suppressed: email ? suppressionEmailSet.has(email) : false,
    });
    if (!issue) continue;
    markDead(business.id, business.vertical_id, business.city_id, "invalid");
    invalidLeads.push({
      businessId: business.id,
      studioName: business.studio_name,
      cityName: cityMap.get(business.city_id) ?? "—",
      verticalName: verticalMap.get(business.vertical_id) ?? "—",
      issue,
      issueLabel: invalidEmailLabel(issue),
      email,
    });
  }

  invalidLeads.sort((a, b) => a.cityName.localeCompare(b.cityName, "nl"));

  const verticalBuckets = new Map<string, VerticalDeliverabilityRow>();

  for (const [key, bucket] of deadByCityVertical.entries()) {
    const [verticalId, cityId] = key.split(":");
    let vertical = verticalBuckets.get(verticalId);
    if (!vertical) {
      vertical = {
        verticalId,
        verticalName: verticalMap.get(verticalId) ?? "—",
        suppressions: 0,
        bounces: 0,
        invalidEmails: 0,
        deadLeads: 0,
        cities: [],
      };
      verticalBuckets.set(verticalId, vertical);
    }
    vertical.suppressions += bucket.suppressions;
    vertical.bounces += bucket.bounces;
    vertical.invalidEmails += bucket.invalid;
    vertical.deadLeads += bucket.dead.size;
    vertical.cities.push({
      cityId,
      cityName: cityMap.get(cityId) ?? "—",
      suppressions: bucket.suppressions,
      bounces: bucket.bounces,
      invalidEmails: bucket.invalid,
      deadLeads: bucket.dead.size,
    });
  }

  const byVertical = [...verticalBuckets.values()]
    .map((row) => ({
      ...row,
      cities: row.cities.sort(
        (a, b) => b.deadLeads - a.deadLeads || a.cityName.localeCompare(b.cityName, "nl"),
      ),
    }))
    .sort(
      (a, b) => b.deadLeads - a.deadLeads || a.verticalName.localeCompare(b.verticalName, "nl"),
    );

  const deadLeadIds = new Set<string>();
  for (const bucket of deadByCityVertical.values()) {
    for (const id of bucket.dead) deadLeadIds.add(id);
  }

  const totals = {
    suppressions: suppressionRows.length,
    bounces: bouncedBusinessIds.size,
    invalidEmails: invalidLeads.length,
    deadLeads: deadLeadIds.size,
  };

  return {
    totals,
    byVertical,
    suppressions: suppressionRows.slice(0, 100),
    invalidLeads: invalidLeads.slice(0, 120),
  };
}

export async function getSuppressedEmailSet(): Promise<Set<string>> {
  const client = createAdminClient();
  const { data } = await client.from("email_suppressions").select("email");
  const set = new Set<string>();
  for (const row of data ?? []) {
    const email = normalizeEmail(row.email as string);
    if (email) set.add(email);
  }
  return set;
}
