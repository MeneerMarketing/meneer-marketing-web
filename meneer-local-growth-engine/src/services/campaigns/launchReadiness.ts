import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import { getSenderConfig, isRealSendEnabled } from "@/lib/email/provider";
import { buildLandingPageUrl } from "@/config/verticalOffers";
import {
  isApprovedMarketingHost,
  isApprovedPreviewHost,
  isProductionHttpsUrl,
} from "@/services/campaigns/eventSecurity";
import { formatPublicPreviewUrl } from "@/services/outreach/previewUrl";
import { isCityManuallyProtected } from "@/services/city-outreach/cityAcquisitionProtection";
import { assertAssignedTemplateCityUnique } from "@/services/city-outreach/cityOutreachService";
import type { CampaignRow } from "@/services/campaigns/types";

export interface LaunchReadinessResult {
  ready: boolean;
  blocking_reasons: string[];
  warnings: string[];
}

function previewBase(): string {
  return (
    process.env.OUTREACH_PREVIEW_BASE_URL ||
    process.env.PREVIEW_BASE_URL ||
    ""
  ).replace(/\/$/, "");
}

export async function validateCampaignLaunchReadiness(
  campaignId: string
): Promise<LaunchReadinessResult> {
  const client = createAdminClient();
  const blocking: string[] = [];
  const warnings: string[] = [];

  const { data: campaign } = await client
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .maybeSingle();

  if (!campaign) {
    return {
      ready: false,
      blocking_reasons: ["Campaign niet gevonden"],
      warnings: [],
    };
  }

  const row = campaign as CampaignRow & {
    environment?: string;
    lifecycle_status?: string;
    real_event_count?: number;
  };

  const { data: business } = await client
    .from("businesses")
    .select("*")
    .eq("id", row.business_id)
    .maybeSingle();

  if (!business) {
    blocking.push("Business ontbreekt");
    return { ready: false, blocking_reasons: blocking, warnings };
  }

  if (business.prospect_type !== "WEBSITE_TRANSFORMATION") {
    blocking.push("Geen WEBSITE_TRANSFORMATION prospect");
  }
  if (!business.selected_for_outreach) {
    blocking.push("Niet SELECTED_FOR_OUTREACH");
  }
  if (!business.assigned_template) {
    blocking.push("Geen assigned_template");
  }

  const confidence = Number(
    (business as { winner_confidence?: number | null }).winner_confidence ??
      business.lead_score ??
      0
  );
  if (confidence > 0 && confidence < 50) {
    warnings.push("Winner confidence/lead score relatief laag");
  }

  const { data: preview } = await client
    .from("previews")
    .select("id, slug, status")
    .eq("business_id", business.id)
    .in("status", ["READY", "APPROVED"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!preview || !["READY", "APPROVED"].includes(String(preview.status))) {
    blocking.push("Geen READY preview");
  }

  const base = previewBase();
  if (!base || !isProductionHttpsUrl(base)) {
    blocking.push("Preview base URL is geen productie HTTPS host");
  } else if (!isApprovedPreviewHost(base)) {
    blocking.push("Preview host staat niet op de allowlist");
  }

  if (preview?.slug && base) {
    const previewUrl = formatPublicPreviewUrl(base, String(preview.slug));
    if (!isProductionHttpsUrl(previewUrl)) {
      blocking.push("Preview URL is geen geldige productie-URL");
    }
  }

  const { data: seo } = await client
    .from("seo_opportunities")
    .select("id")
    .eq("business_id", business.id)
    .maybeSingle();
  if (!seo) warnings.push("SEO analysis ontbreekt");

  const { data: outreach, error: outreachError } = await client
    .from("outreach_messages")
    .select("id, status, is_test")
    .eq("business_id", business.id)
    .or("is_test.eq.false,is_test.is.null")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (outreachError || !outreach) {
    blocking.push("Geen hardened outreach draft");
  }

  const { data: contact } = await client
    .from("contacts")
    .select("email, do_not_contact")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const businessEmail =
    (contact ?? []).find((c) => c.email && !c.do_not_contact)?.email ||
    business.email ||
    null;

  if (!businessEmail) {
    blocking.push("Geen zakelijk contactadres");
  }

  if (
    (contact ?? []).some((c) => c.do_not_contact) ||
    business.lead_status === "DO_NOT_CONTACT"
  ) {
    blocking.push("Contact of lead is DO_NOT_CONTACT / suppressed");
  }

  const { data: excl } = await client
    .from("city_exclusivity")
    .select("status, business_id")
    .eq("city_id", business.city_id)
    .eq("vertical_id", business.vertical_id)
    .maybeSingle();

  if (
    excl?.status === "EXCLUSIVE" &&
    excl.business_id &&
    excl.business_id !== business.id
  ) {
    warnings.push("Legacy city_exclusivity EXCLUSIVE voor andere studio (audit only)");
  }

  const protection = await isCityManuallyProtected({
    verticalId: business.vertical_id,
    cityId: business.city_id,
  });
  if (protection.protected) {
    blocking.push("Stad is handmatig acquisition protected");
  }

  if (business.assigned_template) {
    const unique = await assertAssignedTemplateCityUnique({
      businessId: business.id,
      verticalId: business.vertical_id,
      cityId: business.city_id,
      assignedTemplate: business.assigned_template,
    });
    if (!unique.ok) {
      blocking.push(
        `Duplicate assigned template in stad (${unique.conflict?.studio_name ?? "conflict"})`
      );
    }
  }

  if (row.status !== "ACTIVE") {
    blocking.push("Campaign status is niet ACTIVE");
  }

  if (row.environment !== "PRODUCTION") {
    blocking.push("Campaign environment is DEVELOPMENT (geen echte outreach)");
  }

  if (!["LAUNCH_READY", "LIVE"].includes(String(row.lifecycle_status))) {
    blocking.push(
      `Lifecycle is ${row.lifecycle_status ?? "DRAFT"} (vereist LAUNCH_READY of LIVE)`
    );
  }

  const { data: vertical } = await client
    .from("verticals")
    .select("slug")
    .eq("id", business.vertical_id)
    .maybeSingle();

  const landing = buildLandingPageUrl({
    verticalSlug: (vertical?.slug as string) || "pilates",
    campaignRef: row.campaign_ref,
  });

  if (!landing || !isProductionHttpsUrl(landing)) {
    blocking.push("Landing page URL is geen productie HTTPS URL");
  } else if (!isApprovedMarketingHost(landing)) {
    blocking.push("Landing page host is niet meneermarketing.nl");
  }

  if (!row.recommended_package) {
    warnings.push("Geen recommended package");
  }

  if (!isRealSendEnabled()) {
    blocking.push("OUTREACH_REAL_SEND_ENABLED is false");
  }

  const sender = getSenderConfig();
  if (!sender.configured) {
    blocking.push("Resend / sender niet geconfigureerd");
  }

  // Unresolved QA: real engagement polluted? (should be recomputed)
  if (
    Number(row.real_event_count ?? 0) === 0 &&
    (row.engagement_level !== "COLD" || row.conversion_status !== "NONE")
  ) {
    blocking.push(
      "QA state onopgelost: engagement/conversion niet COLD/NONE zonder real events"
    );
  }

  return {
    ready: blocking.length === 0,
    blocking_reasons: blocking,
    warnings,
  };
}
