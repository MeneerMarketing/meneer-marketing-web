import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import {
  buildLandingPageUrl,
  getVerticalOfferConfig,
} from "@/config/verticalOffers";
import { formatPublicPreviewUrl } from "@/services/outreach/previewUrl";
import { recommendPackage } from "@/services/campaigns/recommendPackage";
import {
  campaignReservationDays,
  conversionFromEvent,
  engagementFromEvent,
  generateCampaignRef,
  maxConversion,
  maxEngagement,
  type CampaignEventType,
  type CampaignRow,
  type PublicCampaignContext,
  type PublicCampaignContextInvalid,
} from "@/services/campaigns/types";
import type { Business } from "@/types/domain";
import type {
  BookingOption,
  OfferPackage,
} from "@/config/verticalOffers";

function previewBaseUrl(): string {
  return (
    process.env.OUTREACH_PREVIEW_BASE_URL ||
    process.env.PREVIEW_BASE_URL ||
    ""
  ).replace(/\/$/, "");
}

function buildAbsolutePreview(slug: string | null | undefined): string {
  if (!slug) return "";
  const base = previewBaseUrl();
  if (!base) return `/preview/${slug}`;
  return formatPublicPreviewUrl(base, slug);
}

export async function ensureCampaignForBusiness(input: {
  businessId: string;
  outreachMessageId?: string | null;
  createReservation?: boolean;
}): Promise<CampaignRow> {
  const client = createAdminClient();

  const { data: existing } = await client
    .from("campaigns")
    .select("*")
    .eq("business_id", input.businessId)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    if (
      input.outreachMessageId &&
      existing.outreach_message_id !== input.outreachMessageId
    ) {
      const { data: updated } = await client
        .from("campaigns")
        .update({
          outreach_message_id: input.outreachMessageId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select("*")
        .single();
      return (updated ?? existing) as CampaignRow;
    }
    return existing as CampaignRow;
  }

  const { data: business } = await client
    .from("businesses")
    .select("*")
    .eq("id", input.businessId)
    .single();
  if (!business) throw new Error("Business niet gevonden");

  const [{ data: preview }, { data: seo }, { data: exclusivity }, { data: vertical }] =
    await Promise.all([
      client
        .from("previews")
        .select("id, slug, template_variant, status")
        .eq("business_id", input.businessId)
        .in("status", ["READY", "APPROVED"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      client
        .from("seo_opportunities")
        .select("*")
        .eq("business_id", input.businessId)
        .maybeSingle(),
      client
        .from("city_exclusivity")
        .select("status, business_id")
        .eq("city_id", business.city_id)
        .eq("vertical_id", business.vertical_id)
        .maybeSingle(),
      client
        .from("verticals")
        .select("slug")
        .eq("id", business.vertical_id)
        .maybeSingle(),
    ]);

  const recommendation = recommendPackage({
    business: business as {
      website_url?: string | null;
      website_quality_score?: number | null;
      seo_opportunity_score?: number | null;
      business_quality_score?: number | null;
      lead_score?: number | null;
    },
    seo: seo as {
      seo_opportunity_score?: number | null;
      current_rank?: number | null;
      primary_search_volume?: number | null;
    } | null,
  });

  const cityStatus =
    (exclusivity?.status as string | undefined) ??
    (business.exclusive_status === "reserved"
      ? "RESERVED"
      : business.exclusive_status === "active"
        ? "EXCLUSIVE"
        : "AVAILABLE");

  const days = campaignReservationDays();
  const reservationExpires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000
  ).toISOString();

  const ref = generateCampaignRef();
  const now = new Date().toISOString();

  const { data: campaign, error } = await client
    .from("campaigns")
    .insert({
      campaign_ref: ref,
      business_id: input.businessId,
      preview_id: preview?.id ?? null,
      outreach_message_id: input.outreachMessageId ?? null,
      vertical_id: business.vertical_id,
      city_id: business.city_id,
      status: "ACTIVE",
      environment:
        (process.env.CAMPAIGN_DEFAULT_ENVIRONMENT as "DEVELOPMENT" | "PRODUCTION") ||
        "DEVELOPMENT",
      lifecycle_status: "QA",
      conversion_status: "NONE",
      engagement_level: "COLD",
      recommended_package: recommendation.package,
      recommendation_reason: recommendation.reason,
      city_status_snapshot: cityStatus,
      real_event_count: 0,
      test_event_count: 0,
      reservation_expires_at:
        input.createReservation !== false ? reservationExpires : null,
      metadata: {
        vertical_slug: vertical?.slug ?? "pilates",
        preview_slug: preview?.slug ?? null,
      },
      created_at: now,
      updated_at: now,
      last_activity_at: now,
    })
    .select("*")
    .single();

  if (error || !campaign) {
    throw new Error(error?.message ?? "Campaign aanmaken mislukt");
  }

  await client
    .from("businesses")
    .update({
      active_campaign_id: campaign.id,
      recommended_package: recommendation.package,
      conversion_status: "NONE",
      engagement_level: "COLD",
      updated_at: now,
    })
    .eq("id", input.businessId);

  await writeActivity(client, {
    business_id: input.businessId,
    activity_type: "CAMPAIGN_CREATED",
    title: "Campaign aangemaakt",
    description: recommendation.package,
    metadata: {
      campaign_id: campaign.id,
      campaign_ref_masked: `${ref.slice(0, 8)}…`,
      recommended_package: recommendation.package,
    },
  });

  if (input.createReservation !== false) {
    await maybeReserveCityForCampaign({
      campaign: campaign as CampaignRow,
      business: business as Business,
      expiresAt: reservationExpires,
    });
  }

  return campaign as CampaignRow;
}

async function maybeReserveCityForCampaign(input: {
  campaign: CampaignRow;
  business: Business;
  expiresAt: string;
}): Promise<void> {
  const client = createAdminClient();
  const { data: exclusivity } = await client
    .from("city_exclusivity")
    .select("*")
    .eq("city_id", input.business.city_id)
    .eq("vertical_id", input.business.vertical_id)
    .maybeSingle();

  const status = exclusivity?.status as string | undefined;
  // Do not override EXCLUSIVE / active client holds
  if (status === "EXCLUSIVE") return;
  if (
    status === "RESERVED" &&
    exclusivity?.business_id &&
    exclusivity.business_id !== input.business.id
  ) {
    return;
  }

  // Soft reserve for this lead when AVAILABLE or PRIMARY_CANDIDATE for same business
  const canReserve =
    !status ||
    status === "AVAILABLE" ||
    status === "PRIMARY_CANDIDATE" ||
    (status === "RESERVED" && exclusivity?.business_id === input.business.id);

  if (!canReserve) return;

  await client.from("city_exclusivity").upsert(
    {
      city_id: input.business.city_id,
      vertical_id: input.business.vertical_id,
      business_id: input.business.id,
      status: "RESERVED",
      updated_at: new Date().toISOString(),
      notes: `Campaign reservation · ${input.campaign.id}`,
    },
    { onConflict: "city_id,vertical_id" }
  );

  await client.from("campaign_reservations").insert({
    campaign_id: input.campaign.id,
    city_id: input.business.city_id,
    vertical_id: input.business.vertical_id,
    business_id: input.business.id,
    status: "ACTIVE",
    expires_at: input.expiresAt,
  });

  await client
    .from("campaigns")
    .update({
      city_status_snapshot: "RESERVED",
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.campaign.id);

  await writeActivity(client, {
    business_id: input.business.id,
    activity_type: "CITY_RESERVED",
    title: "Stad tijdelijk gereserveerd voor campaign",
    metadata: {
      campaign_id: input.campaign.id,
      expires_at: input.expiresAt,
      days: campaignReservationDays(),
    },
  });
}

export async function resolvePublicCampaignContext(
  ref: string
): Promise<PublicCampaignContext | PublicCampaignContextInvalid> {
  if (!ref || !/^mmlg_[A-Za-z0-9_-]{16,}$/.test(ref)) {
    return { valid: false, error: "invalid" };
  }

  const client = createAdminClient();
  const { data: campaign } = await client
    .from("campaigns")
    .select("*")
    .eq("campaign_ref", ref)
    .maybeSingle();

  if (!campaign) return { valid: false, error: "not_found" };
  if (campaign.status === "REVOKED") return { valid: false, error: "revoked" };
  if (
    campaign.status === "EXPIRED" ||
    (campaign.expires_at && new Date(campaign.expires_at) < new Date())
  ) {
    return { valid: false, error: "expired" };
  }

  const [{ data: business }, { data: city }, { data: vertical }, { data: preview }] =
    await Promise.all([
      client
        .from("businesses")
        .select("studio_name, primary_service, city_id, vertical_id")
        .eq("id", campaign.business_id)
        .single(),
      campaign.city_id
        ? client.from("cities").select("name").eq("id", campaign.city_id).maybeSingle()
        : Promise.resolve({ data: null }),
      campaign.vertical_id
        ? client
            .from("verticals")
            .select("slug")
            .eq("id", campaign.vertical_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      campaign.preview_id
        ? client
            .from("previews")
            .select("slug, template_variant")
            .eq("id", campaign.preview_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  if (!business) return { valid: false, error: "not_found" };

  const verticalSlug = (vertical?.slug as string) || "pilates";
  const offer = getVerticalOfferConfig(verticalSlug);
  const previewSlug =
    (preview?.slug as string | undefined) ||
    ((campaign.metadata as { preview_slug?: string } | null)?.preview_slug ??
      null);

  // Refresh live city status (do not invent exclusivity)
  let cityStatus = campaign.city_status_snapshot;
  if (campaign.city_id && campaign.vertical_id) {
    const { data: excl } = await client
      .from("city_exclusivity")
      .select("status, business_id")
      .eq("city_id", campaign.city_id)
      .eq("vertical_id", campaign.vertical_id)
      .maybeSingle();
    if (excl?.status) {
      // Only expose RESERVED if still for this business
      if (excl.status === "RESERVED" && excl.business_id !== campaign.business_id) {
        cityStatus = "AVAILABLE";
      } else {
        cityStatus = excl.status as string;
      }
    }
  }

  return {
    valid: true,
    vertical: verticalSlug,
    business_name: business.studio_name as string,
    city: (city?.name as string) || "",
    preview_url: buildAbsolutePreview(previewSlug),
    selected_template: (preview?.template_variant as string) || null,
    city_status: cityStatus,
    primary_service: (business.primary_service as string) || null,
    recommended_package: (campaign.recommended_package as OfferPackage) || null,
    preview_cta_label: offer?.previewCtaLabel ?? "Bekijk de mogelijkheden",
    landing_path: offer?.landingPagePath ?? "/pilates-studios",
  };
}

const PACKAGE_SET = new Set<OfferPackage>([
  "STUDIO_EDITION",
  "LOCAL_GROWTH",
  "GROWTH_PARTNER",
  "SIGNATURE_CUSTOM",
]);

const BOOKING_SET = new Set<BookingOption>([
  "EXISTING_BOOKING",
  "BRANDED_APP",
  "CUSTOM_FUNNEL",
  "CUSTOM_APP",
]);

function whitelistMetadata(
  eventType: CampaignEventType,
  metadata: Record<string, unknown> | undefined
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (!metadata) return out;

  if (eventType === "PACKAGE_SELECTED" || eventType === "PACKAGE_SECTION_VIEWED") {
    const pkg = String(metadata.package ?? "");
    if (PACKAGE_SET.has(pkg as OfferPackage)) out.package = pkg;
  }
  if (eventType === "BOOKING_OPTION_VIEWED") {
    const opt = String(metadata.booking_option ?? "");
    if (BOOKING_SET.has(opt as BookingOption)) out.booking_option = opt;
  }
  if (typeof metadata.path === "string" && metadata.path.length < 200) {
    out.path = metadata.path;
  }
  if (typeof metadata.section === "string" && metadata.section.length < 80) {
    out.section = metadata.section;
  }
  return out;
}

export async function ingestCampaignEvent(input: {
  campaignRef: string;
  eventType: CampaignEventType;
  metadata?: Record<string, unknown>;
  idempotencyKey?: string | null;
  source?: string;
  /** Server-resolved only — never trust browser body for this */
  isTest?: boolean;
}): Promise<
  | { ok: true; duplicate?: boolean; is_test?: boolean }
  | { ok: false; error: string }
> {
  const client = createAdminClient();
  const { data: campaign } = await client
    .from("campaigns")
    .select("*")
    .eq("campaign_ref", input.campaignRef)
    .maybeSingle();

  if (!campaign || campaign.status !== "ACTIVE") {
    return { ok: false, error: "invalid_campaign" };
  }

  const environment =
    (campaign.environment as "DEVELOPMENT" | "PRODUCTION" | undefined) ||
    "DEVELOPMENT";
  const isTest =
    environment === "DEVELOPMENT" ? true : Boolean(input.isTest);

  const cleanMeta = whitelistMetadata(input.eventType, input.metadata);
  const idem =
    input.idempotencyKey?.slice(0, 120) ||
    `${input.eventType}:${isTest ? "t" : "r"}:${Math.floor(Date.now() / 60_000)}`;

  const { error: insertError } = await client.from("campaign_events").insert({
    campaign_id: campaign.id,
    event_type: input.eventType,
    idempotency_key: idem,
    metadata: cleanMeta,
    source: input.source ?? "public_api",
    is_test: isTest,
    environment: isTest ? "development" : "production",
  });

  if (insertError && /duplicate|unique/i.test(insertError.message)) {
    return { ok: true, duplicate: true, is_test: isTest };
  }
  if (insertError) return { ok: false, error: insertError.message };

  await writeActivity(client, {
    business_id: campaign.business_id,
    activity_type: input.eventType,
    title: isTest
      ? `TEST · Campaign · ${input.eventType}`
      : `Campaign · ${input.eventType}`,
    metadata: {
      campaign_id: campaign.id,
      is_test: isTest,
      ...cleanMeta,
    },
  });

  // Test events never mutate commercial engagement / conversion / package interest
  if (isTest) {
    await client
      .from("campaigns")
      .update({
        test_event_count: Number(campaign.test_event_count ?? 0) + 1,
        event_count: Number(campaign.event_count ?? 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaign.id);
    return { ok: true, is_test: true };
  }

  const now = new Date().toISOString();
  const nextEngagement = maxEngagement(
    campaign.engagement_level,
    engagementFromEvent(input.eventType)
  );
  const convBump = conversionFromEvent(input.eventType);
  const nextConversion = convBump
    ? maxConversion(campaign.conversion_status, convBump)
    : campaign.conversion_status;

  const patch: Record<string, unknown> = {
    engagement_level: nextEngagement,
    conversion_status: nextConversion,
    event_count: Number(campaign.event_count ?? 0) + 1,
    real_event_count: Number(campaign.real_event_count ?? 0) + 1,
    last_seen_at: now,
    last_real_activity_at: now,
    last_activity_at: now,
    updated_at: now,
    first_seen_at: campaign.first_seen_at ?? now,
  };

  if (
    input.eventType === "PACKAGE_SELECTED" &&
    typeof cleanMeta.package === "string"
  ) {
    patch.selected_package = cleanMeta.package;
  }
  if (
    input.eventType === "BOOKING_OPTION_VIEWED" &&
    typeof cleanMeta.booking_option === "string"
  ) {
    patch.selected_booking_option = cleanMeta.booking_option;
  }

  await client.from("campaigns").update(patch).eq("id", campaign.id);

  await client
    .from("businesses")
    .update({
      engagement_level: nextEngagement,
      conversion_status: nextConversion,
      last_activity_at: now,
      updated_at: now,
    })
    .eq("id", campaign.business_id);

  return { ok: true, is_test: false };
}

export async function getCampaignLandingUrl(campaign: CampaignRow): Promise<string | null> {
  const client = createAdminClient();
  let verticalSlug = "pilates";
  if (campaign.vertical_id) {
    const { data } = await client
      .from("verticals")
      .select("slug")
      .eq("id", campaign.vertical_id)
      .maybeSingle();
    if (data?.slug) verticalSlug = data.slug as string;
  }
  return buildLandingPageUrl({
    verticalSlug,
    campaignRef: campaign.campaign_ref,
  });
}

export async function getCampaignPreviewUrlWithRef(
  campaign: CampaignRow
): Promise<string> {
  const meta = campaign.metadata as { preview_slug?: string };
  let slug = meta.preview_slug ?? null;
  if (!slug && campaign.preview_id) {
    const client = createAdminClient();
    const { data } = await client
      .from("previews")
      .select("slug")
      .eq("id", campaign.preview_id)
      .maybeSingle();
    slug = (data?.slug as string) || null;
  }
  const base = buildAbsolutePreview(slug);
  if (!base) return "";
  try {
    const url = new URL(base, "https://preview.meneermarketing.nl");
    url.searchParams.set("ref", campaign.campaign_ref);
    return url.toString();
  } catch {
    return `${base}?ref=${encodeURIComponent(campaign.campaign_ref)}`;
  }
}

export async function expireDueReservations(): Promise<number> {
  const client = createAdminClient();
  const now = new Date().toISOString();
  const { data: due } = await client
    .from("campaign_reservations")
    .select("*")
    .eq("status", "ACTIVE")
    .lt("expires_at", now)
    .limit(50);

  if (!due?.length) return 0;
  let count = 0;

  for (const row of due) {
    // Skip if business moved further in funnel
    const { data: campaign } = await client
      .from("campaigns")
      .select("conversion_status, status")
      .eq("id", row.campaign_id)
      .maybeSingle();

    if (
      campaign &&
      ["INBOUND_LEAD", "PROPOSAL", "WON"].includes(campaign.conversion_status)
    ) {
      continue;
    }

    const { data: excl } = await client
      .from("city_exclusivity")
      .select("*")
      .eq("city_id", row.city_id)
      .eq("vertical_id", row.vertical_id)
      .maybeSingle();

    if (excl?.status === "EXCLUSIVE") continue;
    if (excl?.business_id === row.business_id && excl.status === "RESERVED") {
      await client
        .from("city_exclusivity")
        .update({
          status: "AVAILABLE",
          business_id: null,
          updated_at: now,
          notes: "Campaign reservation expired",
        })
        .eq("city_id", row.city_id)
        .eq("vertical_id", row.vertical_id);
    }

    await client
      .from("campaign_reservations")
      .update({
        status: "EXPIRED",
        released_at: now,
        release_reason: "expired",
        updated_at: now,
      })
      .eq("id", row.id);

    await writeActivity(client, {
      business_id: row.business_id,
      activity_type: "CITY_RESERVATION_EXPIRED",
      title: "Campaign-reservatie verlopen",
      metadata: { campaign_id: row.campaign_id },
    });
    count += 1;
  }

  return count;
}

export async function buildLeadJourney(businessId: string): Promise<
  Array<{
    key: string;
    label: string;
    at: string | null;
    done: boolean;
    isTest?: boolean;
  }>
> {
  const client = createAdminClient();
  const { data: activities } = await client
    .from("activity_log")
    .select("activity_type, created_at, title, metadata")
    .eq("business_id", businessId)
    .order("created_at", { ascending: true })
    .limit(200);

  const { data: campaign } = await client
    .from("campaigns")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: outreach } = await client
    .from("outreach_messages")
    .select("status, sent_at, created_at, is_test")
    .eq("business_id", businessId)
    .eq("is_test", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: realEvents } = campaign
    ? await client
        .from("campaign_events")
        .select("event_type, created_at, is_test")
        .eq("campaign_id", campaign.id)
        .eq("is_test", false)
        .order("created_at", { ascending: true })
    : { data: [] as { event_type: string; created_at: string; is_test: boolean }[] };

  const findActivity = (types: string[]) =>
    activities?.find((a) => types.includes(a.activity_type as string))?.created_at ??
    null;

  const findRealEvent = (types: string[]) =>
    realEvents?.find((e) => types.includes(e.event_type))?.created_at ?? null;

  const steps = [
    {
      key: "winner",
      label: "Selected as city winner",
      at:
        findActivity([
          "PRIMARY_CANDIDATE_SELECTED",
          "CITY_WINNER_SELECTED",
          "CITY_WINNER_OVERRIDE",
        ]) || null,
    },
    {
      key: "preview",
      label: "Preview generated",
      at: findActivity(["PREVIEW_CREATED", "PREVIEW_APPROVED"]),
    },
    {
      key: "outreach_draft",
      label: "Outreach draft ready",
      at: findActivity(["OUTREACH_DRAFT_GENERATED", "OUTREACH_CREATED"]),
    },
    {
      key: "campaign",
      label: "Campaign created",
      at: findActivity(["CAMPAIGN_CREATED"]) || campaign?.created_at || null,
    },
    {
      key: "email",
      label: "Email sent",
      at: outreach?.sent_at || findActivity(["EMAIL_SENT"]),
    },
    {
      key: "preview_opened",
      label: "Campaign preview viewed",
      at: findRealEvent(["PREVIEW_OPENED"]),
    },
    {
      key: "offer",
      label: "Pricing page viewed",
      at: findRealEvent(["LANDING_PAGE_VIEWED", "PREVIEW_CTA_CLICKED"]),
    },
    {
      key: "interest",
      label: campaign?.selected_package
        ? `${campaign.selected_package} selected`
        : "Package interest",
      at: findRealEvent(["PACKAGE_SELECTED"]),
    },
    {
      key: "contact",
      label: "Contact submitted",
      at: findRealEvent(["CONTACT_SUBMITTED"]),
    },
  ];

  return steps.map((s) => ({
    ...s,
    done: Boolean(s.at),
    isTest: false,
  }));
}

export async function getCampaignEventSplit(campaignId: string): Promise<{
  real: Array<{ event_type: string; created_at: string }>;
  test: Array<{ event_type: string; created_at: string }>;
}> {
  const client = createAdminClient();
  const { data } = await client
    .from("campaign_events")
    .select("event_type, created_at, is_test")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = data ?? [];
  return {
    real: rows
      .filter((e) => !e.is_test)
      .map((e) => ({ event_type: e.event_type, created_at: e.created_at })),
    test: rows
      .filter((e) => e.is_test)
      .map((e) => ({ event_type: e.event_type, created_at: e.created_at })),
  };
}
