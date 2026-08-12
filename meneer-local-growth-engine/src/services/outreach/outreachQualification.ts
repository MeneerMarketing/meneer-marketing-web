import { createAdminClient } from "@/lib/supabase/admin";
import { pilatesScoringConfig } from "@/verticals/pilates/scoring";
import type { Business } from "@/types/domain";

export interface OutreachQualificationResult {
  ok: boolean;
  reasons: string[];
}

export async function qualifyForOutreachDraft(
  business: Business
): Promise<OutreachQualificationResult> {
  const reasons: string[] = [];
  const client = createAdminClient();
  const rules = pilatesScoringConfig.winnerRules;

  if (!business.primary_candidate) reasons.push("not_primary_candidate");
  if (business.lead_status === "DO_NOT_CONTACT") reasons.push("do_not_contact");
  const allowedStatuses = new Set([
    "READY_FOR_OUTREACH",
    "CONTACTED",
    "REPLIED",
    "MEETING",
  ]);
  if (!allowedStatuses.has(business.lead_status)) {
    reasons.push(`lead_status_${business.lead_status}`);
  }
  if (business.preview_status !== "READY") reasons.push("preview_not_ready");
  if (business.seo_opportunity_score == null) reasons.push("seo_not_analyzed");
  if (!business.website_url) reasons.push("no_website");

  const confidence = Number(business.winner_confidence ?? 0);
  if (
    business.primary_candidate_source !== "manual" &&
    confidence < rules.minConfidenceForOutreach
  ) {
    reasons.push("winner_confidence_too_low");
  }

  const { data: seo } = await client
    .from("seo_opportunities")
    .select("analyzed_at, status")
    .eq("business_id", business.id)
    .maybeSingle();
  if (!seo?.analyzed_at || seo.status === "FAILED" || seo.status === "NOT_ANALYZED") {
    reasons.push("seo_record_incomplete");
  }

  const { data: exclusivity } = await client
    .from("city_exclusivity")
    .select("status, business_id")
    .eq("city_id", business.city_id)
    .eq("vertical_id", business.vertical_id)
    .maybeSingle();

  if (
    exclusivity?.status === "EXCLUSIVE" &&
    exclusivity.business_id &&
    exclusivity.business_id !== business.id
  ) {
    reasons.push("city_exclusive_other");
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
