import { createAdminClient } from "@/lib/supabase/admin";
import { getVerticalRuntime } from "@/verticals/runtime";
import { isCityManuallyProtected } from "@/services/city-outreach/cityAcquisitionProtection";
import { assertAssignedTemplateCityUnique } from "@/services/city-outreach/cityOutreachService";
import type { Business } from "@/types/domain";

export interface OutreachQualificationResult {
  ok: boolean;
  reasons: string[];
}

export type OutreachQualificationMode = "pipeline" | "manual";

/**
 * Outreach gates v2 (M8.4): city rank #1 is geen harde gate meer.
 * `manual` = dashboard-knop: alleen preview + veiligheid, geen pipeline-vlaggen.
 */
export async function qualifyForOutreachDraft(
  business: Business,
  options?: { mode?: OutreachQualificationMode },
): Promise<OutreachQualificationResult> {
  const mode = options?.mode ?? "pipeline";
  const reasons: string[] = [];
  const client = createAdminClient();

  const { data: verticalRow } = await client
    .from("verticals")
    .select("slug")
    .eq("id", business.vertical_id)
    .maybeSingle();
  const verticalSlug = String(verticalRow?.slug ?? "pilates");
  const runtime = getVerticalRuntime(verticalSlug);
  const scoringConfig = runtime.scoringConfig;
  const acquisitionConfig = runtime.acquisitionFitConfig;

  if (business.is_demo) reasons.push("demo_lead");
  if (business.lead_status === "DO_NOT_CONTACT") reasons.push("do_not_contact");
  if (business.lead_status === "INBOUND") reasons.push("inbound_form_submitted");
  if (business.preview_status !== "READY") reasons.push("preview_not_ready");
  if (!business.website_url && !business.domain) reasons.push("no_website");

  const protection = await isCityManuallyProtected({
    verticalId: business.vertical_id,
    cityId: business.city_id,
  });
  if (protection.protected) reasons.push("city_manually_protected");

  if (mode === "manual") {
    return { ok: reasons.length === 0, reasons };
  }

  if (business.prospect_type !== "WEBSITE_TRANSFORMATION") {
    reasons.push("not_website_transformation");
  }
  if (!business.preview_eligible) reasons.push("not_preview_eligible");
  if (!business.selected_for_outreach) reasons.push("not_selected_for_outreach");
  if (!business.assigned_template) reasons.push("assigned_template_missing");

  const allowedStatuses = new Set([
    "READY_FOR_OUTREACH",
    "CONTACTED",
    "REPLIED",
    "MEETING",
    "PREVIEW_GENERATING",
    "PREVIEW_READY",
  ]);
  if (!allowedStatuses.has(business.lead_status)) {
    reasons.push(`lead_status_${business.lead_status}`);
  }

  const transformationScore = Number(business.website_transformation_score ?? 0);
  if (
    transformationScore <
    acquisitionConfig.transformationPrimaryMinScore
  ) {
    reasons.push("transformation_score_too_low");
  }

  const visualConfidence = Number(business.visual_assessment_confidence ?? 0);
  const transformationConfidence = Number(business.transformation_winner_confidence ?? 0);
  const confidence = Math.max(visualConfidence, transformationConfidence);
  if (
    transformationScore < 65 &&
    confidence > 0 &&
    confidence < scoringConfig.winnerRules.minConfidenceForOutreach
  ) {
    reasons.push("transformation_confidence_too_low");
  }

  const { data: seo } = await client
    .from("seo_opportunities")
    .select("analyzed_at, status")
    .eq("business_id", business.id)
    .maybeSingle();
  if (!seo?.analyzed_at || seo.status === "FAILED" || seo.status === "NOT_ANALYZED") {
    reasons.push("seo_record_incomplete");
  }

  if (business.assigned_template) {
    const unique = await assertAssignedTemplateCityUnique({
      businessId: business.id,
      verticalId: business.vertical_id,
      cityId: business.city_id,
      assignedTemplate: business.assigned_template,
    });
    if (!unique.ok) reasons.push("duplicate_assigned_template_in_city");
  }

  const { data: primaryContact } = await client
    .from("contacts")
    .select("email, email_confidence_level")
    .eq("business_id", business.id)
    .eq("is_primary", true)
    .maybeSingle();

  const confidenceLevel =
    (primaryContact?.email_confidence_level as string | null) ??
    (business.email_confidence_level as string | null) ??
    null;

  if (confidenceLevel === "skip") {
    reasons.push("email_confidence_skip");
  }

  return { ok: reasons.length === 0, reasons };
}

export async function isEmailSuppressed(email: string): Promise<boolean> {
  const client = createAdminClient();
  const normalized = email.trim().toLowerCase();
  const { data } = await client
    .from("email_suppressions")
    .select("id")
    .eq("email", normalized)
    .maybeSingle();
  return Boolean(data?.id);
}

export async function addSuppression(input: {
  email: string;
  reason: string;
  businessId?: string | null;
  contactId?: string | null;
  source?: string;
}): Promise<void> {
  const client = createAdminClient();
  await client.from("email_suppressions").upsert(
    {
      email: input.email.trim().toLowerCase(),
      reason: input.reason,
      business_id: input.businessId ?? null,
      contact_id: input.contactId ?? null,
      source: input.source ?? "system",
      unsubscribed_at:
        input.reason === "unsubscribed" || input.reason === "complained"
          ? new Date().toISOString()
          : null,
    },
    { onConflict: "email" }
  );
}
