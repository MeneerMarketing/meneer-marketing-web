import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import {
  conversionFromEvent,
  engagementFromEvent,
  maxConversion,
  maxEngagement,
  type CampaignEventType,
  type ConversionStatus,
  type EngagementLevel,
} from "@/services/campaigns/types";
import type { OfferPackage, BookingOption } from "@/config/verticalOffers";
import { validateCampaignLaunchReadiness } from "@/services/campaigns/launchReadiness";
import { campaignReservationDays } from "@/services/campaigns/types";

/**
 * Recompute genuine engagement/conversion exclusively from is_test=false events.
 */
export async function recomputeCampaignJourney(campaignId: string): Promise<{
  engagement_level: EngagementLevel;
  conversion_status: ConversionStatus;
  selected_package: OfferPackage | null;
  selected_booking_option: BookingOption | null;
  real_event_count: number;
  test_event_count: number;
  last_real_activity_at: string | null;
}> {
  const client = createAdminClient();
  const { data: campaign } = await client
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();
  if (!campaign) throw new Error("Campaign niet gevonden");

  const { data: events } = await client
    .from("campaign_events")
    .select("event_type, is_test, metadata, created_at")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: true });

  const all = events ?? [];
  const real = all.filter((e) => e.is_test !== true);
  const test = all.filter((e) => e.is_test === true);

  let engagement: EngagementLevel = "COLD";
  let conversion: ConversionStatus = "NONE";
  let selectedPackage: OfferPackage | null = null;
  let selectedBooking: BookingOption | null = null;

  for (const ev of real) {
    const type = ev.event_type as CampaignEventType;
    engagement = maxEngagement(engagement, engagementFromEvent(type));
    const bump = conversionFromEvent(type);
    if (bump) conversion = maxConversion(conversion, bump);

    const meta = (ev.metadata ?? {}) as Record<string, unknown>;
    if (type === "PACKAGE_SELECTED" && typeof meta.package === "string") {
      selectedPackage = meta.package as OfferPackage;
    }
    if (
      type === "BOOKING_OPTION_VIEWED" &&
      typeof meta.booking_option === "string"
    ) {
      selectedBooking = meta.booking_option as BookingOption;
    }
  }

  const lastReal = real.length ? real[real.length - 1]!.created_at : null;
  const firstReal = real.length ? real[0]!.created_at : null;
  const now = new Date().toISOString();

  await client
    .from("campaigns")
    .update({
      engagement_level: engagement,
      conversion_status: conversion,
      selected_package: selectedPackage,
      selected_booking_option: selectedBooking,
      real_event_count: real.length,
      test_event_count: test.length,
      event_count: all.length,
      first_seen_at: firstReal,
      last_seen_at: lastReal,
      last_real_activity_at: lastReal,
      last_activity_at: lastReal ?? campaign.last_activity_at,
      updated_at: now,
    })
    .eq("id", campaignId);

  await client
    .from("businesses")
    .update({
      engagement_level: engagement,
      conversion_status: conversion,
      updated_at: now,
      ...(lastReal ? { last_activity_at: lastReal } : {}),
    })
    .eq("id", campaign.business_id);

  return {
    engagement_level: engagement,
    conversion_status: conversion,
    selected_package: selectedPackage,
    selected_booking_option: selectedBooking,
    real_event_count: real.length,
    test_event_count: test.length,
    last_real_activity_at: lastReal,
  };
}

/**
 * Prepare campaign for pilot: recompute journey, refresh reservation window,
 * validate launch readiness. Never sends mail.
 */
export async function prepareCampaignForPilot(campaignId: string): Promise<{
  recomputed: Awaited<ReturnType<typeof recomputeCampaignJourney>>;
  readiness: Awaited<ReturnType<typeof validateCampaignLaunchReadiness>>;
  reservation_expires_at: string | null;
}> {
  const client = createAdminClient();
  const recomputed = await recomputeCampaignJourney(campaignId);

  const days = campaignReservationDays();
  const reservationExpires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: campaign } = await client
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();
  if (!campaign) throw new Error("Campaign niet gevonden");

  // Refresh soft reservation window without claiming exclusivity falsely
  await client
    .from("campaigns")
    .update({
      reservation_expires_at: reservationExpires,
      lifecycle_status:
        campaign.environment === "PRODUCTION" ? "QA" : "QA",
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId);

  const { data: activeRes } = await client
    .from("campaign_reservations")
    .select("id")
    .eq("campaign_id", campaignId)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (activeRes) {
    await client
      .from("campaign_reservations")
      .update({
        expires_at: reservationExpires,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activeRes.id);
  }

  const readiness = await validateCampaignLaunchReadiness(campaignId);

  await client
    .from("campaigns")
    .update({
      launch_blockers: readiness.blocking_reasons,
      launch_ready_at: readiness.ready ? new Date().toISOString() : null,
      lifecycle_status: readiness.ready ? "LAUNCH_READY" : "QA",
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId);

  await writeActivity(client, {
    business_id: campaign.business_id,
    activity_type: "CAMPAIGN_PREPARE_FOR_PILOT",
    title: "Campaign prepared for pilot",
    description: readiness.ready
      ? "Launch readiness OK"
      : `${readiness.blocking_reasons.length} blockers`,
    metadata: {
      campaign_id: campaignId,
      ready: readiness.ready,
      blockers: readiness.blocking_reasons,
      warnings: readiness.warnings,
      engagement: recomputed.engagement_level,
      conversion: recomputed.conversion_status,
      real_events: recomputed.real_event_count,
      test_events: recomputed.test_event_count,
    },
  });

  return {
    recomputed,
    readiness,
    reservation_expires_at: reservationExpires,
  };
}
