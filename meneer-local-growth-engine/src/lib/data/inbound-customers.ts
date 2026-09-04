import { getDataClient } from "@/lib/supabase/data-client";
import type { OfferPackage } from "@/config/verticalOffers";
import { formatOfferPackageLabel } from "@/config/verticalOffers";
import type { InboundSubmissionStatus } from "@/lib/data/customer-labels";

export type { InboundSubmissionStatus } from "@/lib/data/customer-labels";
export {
  submissionStatusLabel,
  paymentStatusLabel,
  paymentStatusTone,
  submissionStatusTone,
} from "@/lib/data/customer-labels";

const PACKAGE_LABELS: Record<OfferPackage, string> = {
  STUDIO_EDITION: "Studio Edition",
  LOCAL_GROWTH: "Local Growth",
  GROWTH_PARTNER: "Growth Partner",
  SIGNATURE_CUSTOM: "Signature",
};

function verticalSlugFromInboundSource(source: string): string {
  if (source === "huidklinieken") return "skin-clinics";
  return "pilates";
}

function labelPackage(key: string | null, source?: string): string | null {
  if (!key) return null;
  if (source) {
    return formatOfferPackageLabel(key, verticalSlugFromInboundSource(source));
  }
  return PACKAGE_LABELS[key as OfferPackage] ?? key.replace(/_/g, " ");
}

export interface CustomerListRow {
  id: string;
  createdAt: string;
  source: string;
  studioName: string;
  city: string | null;
  email: string;
  packageInterest: string | null;
  campaignRef: string | null;
  businessId: string | null;
  businessName: string | null;
  paymentStatus: string;
  submissionStatus: string;
  launchAmountCents: number;
  paidAt: string | null;
  paymentMethod: string | null;
  molliePaymentId: string | null;
  amountPaidCents: number | null;
}

export interface CustomerPaymentRow {
  id: string;
  molliePaymentId: string | null;
  status: string;
  amountCents: number;
  currency: string;
  paidAt: string | null;
  paymentMethod: string | null;
  checkoutUrl: string | null;
  description: string | null;
  packageKey: string | null;
  createdAt: string;
}

export interface CustomerCampaignSnapshot {
  id: string;
  campaignRef: string;
  environment: string;
  engagementLevel: string;
  conversionStatus: string;
  recommendedPackage: string | null;
  selectedPackage: string | null;
  lifecycleStatus: string;
}

export interface CustomerBusinessSnapshot {
  id: string;
  studioName: string;
  cityName: string | null;
  verticalName: string | null;
  leadStatus: string | null;
}

export interface CustomerActivityRow {
  id: string;
  activityType: string;
  title: string;
  description: string | null;
  createdAt: string;
}

export interface CustomerDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  studioName: string;
  city: string | null;
  email: string;
  phone: string | null;
  packageInterest: string | null;
  bookingNeed: string | null;
  message: string | null;
  status: string;
  paymentStatus: string;
  launchPromoActive: boolean;
  launchAmountCents: number;
  campaignRef: string | null;
  campaignId: string | null;
  businessId: string | null;
  internalNotes: string | null;
  metadata: Record<string, unknown>;
  payments: CustomerPaymentRow[];
  campaign: CustomerCampaignSnapshot | null;
  business: CustomerBusinessSnapshot | null;
  activity: CustomerActivityRow[];
}

export interface CustomerOverviewMetrics {
  totalSubmissions: number;
  paidCount: number;
  waivedCount: number;
  withCampaignRef: number;
  paidRevenueCents: number;
}

function formatSource(source: string): string {
  if (source === "pilates-studios") return "Pilates";
  if (source === "huidklinieken") return "Huidklinieken";
  return source;
}

export { formatSource as formatInboundSource };

export async function getCustomerOverviewMetrics(): Promise<CustomerOverviewMetrics> {
  const client = await getDataClient();

  const { data: submissions, error } = await client
    .from("inbound_submissions")
    .select("id, payment_status, launch_amount_cents, campaign_ref");

  if (error) {
    if (error.code === "42P01") {
      return {
        totalSubmissions: 0,
        paidCount: 0,
        waivedCount: 0,
        withCampaignRef: 0,
        paidRevenueCents: 0,
      };
    }
    throw error;
  }

  const rows = submissions ?? [];
  const paidCount = rows.filter((r) => r.payment_status === "paid").length;
  const waivedCount = rows.filter((r) => r.payment_status === "waived").length;
  const withCampaignRef = rows.filter((r) => Boolean(r.campaign_ref)).length;

  const { data: payments } = await client
    .from("commerce_payments")
    .select("amount_cents, status")
    .eq("status", "paid");

  const paidRevenueCents = (payments ?? []).reduce(
    (sum, p) => sum + Number(p.amount_cents ?? 0),
    0,
  );

  return {
    totalSubmissions: rows.length,
    paidCount,
    waivedCount,
    withCampaignRef,
    paidRevenueCents,
  };
}

export async function getCustomerListRows(): Promise<CustomerListRow[]> {
  const client = await getDataClient();

  type PaymentRow = {
    inbound_submission_id: string | null;
    paid_at: string | null;
    payment_method: string | null;
    mollie_payment_id: string | null;
    amount_cents: number;
    status: string;
  };

  const { data: submissions, error } = await client
    .from("inbound_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    if (error.code === "42P01") return [];
    throw error;
  }

  if (!submissions?.length) return [];

  const submissionIds = submissions.map((s) => s.id);
  const businessIds = submissions
    .map((s) => s.business_id)
    .filter((id): id is string => Boolean(id));

  const [{ data: payments }, { data: businesses }] = await Promise.all([
    client
      .from("commerce_payments")
      .select(
        "inbound_submission_id, paid_at, payment_method, mollie_payment_id, amount_cents, status",
      )
      .in("inbound_submission_id", submissionIds)
      .order("created_at", { ascending: false }),
    businessIds.length
      ? client.from("businesses").select("id, studio_name").in("id", businessIds)
      : Promise.resolve({ data: [] as { id: string; studio_name: string }[] }),
  ]);

  const paymentBySubmission = new Map<string, PaymentRow>();
  for (const payment of (payments ?? []) as PaymentRow[]) {
    const sid = payment.inbound_submission_id as string | null;
    if (sid && !paymentBySubmission.has(sid)) {
      paymentBySubmission.set(sid, payment);
    }
  }

  const businessNameById = new Map(
    (businesses ?? []).map((b) => [b.id, b.studio_name] as const),
  );

  return submissions.map((row) => {
    const payment = paymentBySubmission.get(row.id);
    const pkg = labelPackage(row.package_interest, row.source);

    return {
      id: row.id,
      createdAt: row.created_at,
      source: formatSource(row.source),
      studioName: row.studio_name,
      city: row.city,
      email: row.email,
      packageInterest: pkg,
      campaignRef: row.campaign_ref,
      businessId: row.business_id,
      businessName: row.business_id
        ? businessNameById.get(row.business_id) ?? null
        : null,
      paymentStatus: row.payment_status,
      submissionStatus: row.status,
      launchAmountCents: row.launch_amount_cents,
      paidAt: payment?.paid_at ?? null,
      paymentMethod: payment?.payment_method ?? null,
      molliePaymentId: payment?.mollie_payment_id ?? null,
      amountPaidCents:
        payment?.status === "paid" ? Number(payment.amount_cents) : null,
    };
  });
}

export async function getCustomerById(id: string): Promise<CustomerDetail | null> {
  const client = await getDataClient();

  const { data: row, error } = await client
    .from("inbound_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (error.code === "42P01") return null;
    throw error;
  }
  if (!row) return null;

  const businessId = row.business_id as string | null;
  const campaignId = row.campaign_id as string | null;
  const campaignRef = row.campaign_ref as string | null;

  const [
    { data: payments },
    businessResult,
    campaignById,
    campaignByRef,
    activityResult,
  ] = await Promise.all([
    client
      .from("commerce_payments")
      .select("*")
      .eq("inbound_submission_id", id)
      .order("created_at", { ascending: false }),
    businessId
      ? client
          .from("businesses")
          .select("id, studio_name, lead_status, city_id, vertical_id")
          .eq("id", businessId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    campaignId
      ? client.from("campaigns").select("*").eq("id", campaignId).maybeSingle()
      : Promise.resolve({ data: null }),
    !campaignId && campaignRef
      ? client
          .from("campaigns")
          .select("*")
          .eq("campaign_ref", campaignRef)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    businessId
      ? client
          .from("activity_log")
          .select("id, activity_type, title, description, created_at")
          .eq("business_id", businessId)
          .order("created_at", { ascending: false })
          .limit(30)
      : Promise.resolve({ data: [] }),
  ]);

  const businessRow = businessResult.data;
  let cityName: string | null = null;
  let verticalName: string | null = null;

  if (businessRow) {
    const [{ data: city }, { data: vertical }] = await Promise.all([
      businessRow.city_id
        ? client.from("cities").select("name").eq("id", businessRow.city_id).maybeSingle()
        : Promise.resolve({ data: null }),
      businessRow.vertical_id
        ? client.from("verticals").select("name").eq("id", businessRow.vertical_id).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);
    cityName = (city?.name as string) ?? null;
    verticalName = (vertical?.name as string) ?? null;
  }

  const campaignRow = campaignById.data ?? campaignByRef.data;

  const internalNotes =
    "internal_notes" in row
      ? ((row.internal_notes as string | null) ?? null)
      : ((row.metadata as { internal_notes?: string } | null)?.internal_notes ?? null);

  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    source: formatSource(row.source),
    studioName: row.studio_name,
    city: row.city,
    email: row.email,
    phone: row.phone,
    packageInterest: labelPackage(row.package_interest, row.source),
    bookingNeed: row.booking_need,
    message: row.message,
    status: row.status,
    paymentStatus: row.payment_status,
    launchPromoActive: Boolean(row.launch_promo_active),
    launchAmountCents: Number(row.launch_amount_cents ?? 0),
    campaignRef,
    campaignId: campaignRow?.id ? String(campaignRow.id) : campaignId,
    businessId,
    internalNotes,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    payments: (payments ?? []).map((p) => ({
      id: p.id,
      molliePaymentId: p.mollie_payment_id,
      status: p.status,
      amountCents: Number(p.amount_cents ?? 0),
      currency: p.currency ?? "EUR",
      paidAt: p.paid_at,
      paymentMethod: p.payment_method,
      checkoutUrl: p.checkout_url,
      description: p.description,
      packageKey: p.package_key ? labelPackage(p.package_key, row.source) : null,
      createdAt: p.created_at,
    })),
    campaign: campaignRow
      ? {
          id: String(campaignRow.id),
          campaignRef: String(campaignRow.campaign_ref),
          environment: String(campaignRow.environment ?? "DEVELOPMENT"),
          engagementLevel: String(campaignRow.engagement_level ?? "COLD"),
          conversionStatus: String(campaignRow.conversion_status ?? "NONE"),
          recommendedPackage: campaignRow.recommended_package
            ? labelPackage(String(campaignRow.recommended_package), row.source)
            : null,
          selectedPackage: campaignRow.selected_package
            ? labelPackage(String(campaignRow.selected_package), row.source)
            : null,
          lifecycleStatus: String(campaignRow.lifecycle_status ?? "DRAFT"),
        }
      : null,
    business: businessRow
      ? {
          id: String(businessRow.id),
          studioName: String(businessRow.studio_name),
          cityName,
          verticalName,
          leadStatus: (businessRow.lead_status as string) ?? null,
        }
      : null,
    activity: (activityResult.data ?? []).map((a) => ({
      id: a.id,
      activityType: a.activity_type,
      title: a.title,
      description: a.description,
      createdAt: a.created_at,
    })),
  };
}
