import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import type { ProspectTypeValue } from "@/types/domain";

/**
 * Server-side acquisition gates (M8.3).
 *
 * The redesign proposition ("I already built you a new website") only holds up
 * for WEBSITE_TRANSFORMATION prospects. These checks run on the server so the
 * UI cannot be the only thing standing between a GROWTH_ONLY studio and a
 * redesign email.
 */

export interface GateDecision {
  allowed: boolean;
  /** Manual overrides are allowed for previews, but never silently. */
  warning: string | null;
  reason: string;
  prospect_type: ProspectTypeValue | null;
  preview_eligible: boolean;
  transformation_score: number | null;
  transformation_city_rank: number | null;
}

interface GateRow {
  prospect_type: string | null;
  prospect_type_reason: string | null;
  preview_eligible: boolean | null;
  preview_eligibility_reason: string | null;
  website_transformation_score: number | null;
  transformation_city_rank: number | null;
  studio_name: string | null;
  is_demo: boolean | null;
}

async function loadGateRow(businessId: string): Promise<GateRow | null> {
  const client = createAdminClient();
  const { data } = await client
    .from("businesses")
    .select(
      "prospect_type, prospect_type_reason, preview_eligible, preview_eligibility_reason, website_transformation_score, transformation_city_rank, studio_name, is_demo"
    )
    .eq("id", businessId)
    .maybeSingle();
  return (data as GateRow) ?? null;
}

function baseDecision(row: GateRow | null): Omit<GateDecision, "allowed" | "warning" | "reason"> {
  return {
    prospect_type: (row?.prospect_type as ProspectTypeValue) ?? null,
    preview_eligible: row?.preview_eligible === true,
    transformation_score:
      row?.website_transformation_score != null ? Number(row.website_transformation_score) : null,
    transformation_city_rank:
      row?.transformation_city_rank != null ? Number(row.transformation_city_rank) : null,
  };
}

/**
 * Preview generation policy. Demo studios and manual overrides stay possible,
 * but anything outside the transformation pool comes back with a warning that
 * the dashboard must show.
 */
export async function checkPreviewGate(
  businessId: string,
  options: { allowDemo?: boolean; override?: boolean } = {}
): Promise<GateDecision> {
  const row = await loadGateRow(businessId);
  const base = baseDecision(row);

  if (!row) {
    return { ...base, allowed: false, warning: null, reason: "Business niet gevonden." };
  }

  if (row.is_demo && options.allowDemo) {
    return { ...base, allowed: true, warning: null, reason: "Demo-preview." };
  }

  if (base.prospect_type === "WEBSITE_TRANSFORMATION" && base.preview_eligible) {
    return {
      ...base,
      allowed: true,
      warning: null,
      reason: row.prospect_type_reason ?? "Transformation prospect met preview-eligibility.",
    };
  }

  const blocker =
    base.prospect_type == null
      ? "Deze studio is nog niet beoordeeld op acquisition fit."
      : base.prospect_type !== "WEBSITE_TRANSFORMATION"
        ? `Prospect type is ${base.prospect_type}, niet WEBSITE_TRANSFORMATION. ${row.prospect_type_reason ?? ""}`.trim()
        : (row.preview_eligibility_reason ?? "Voldoet nog niet aan de preview-voorwaarden.");

  if (options.override) {
    const client = createAdminClient();
    await writeActivity(client, {
      business_id: businessId,
      activity_type: "PREVIEW_GATE_BLOCKED",
      title: "Preview handmatig geforceerd",
      description: blocker,
      metadata: {
        prospect_type: base.prospect_type,
        preview_eligible: base.preview_eligible,
        override: true,
      },
    });
    return { ...base, allowed: true, warning: blocker, reason: blocker };
  }

  return { ...base, allowed: false, warning: blocker, reason: blocker };
}

/**
 * Redesign outreach is hard-gated: no override, because a wrong email cannot be
 * taken back.
 */
export async function checkRedesignOutreachGate(businessId: string): Promise<GateDecision> {
  const row = await loadGateRow(businessId);
  const base = baseDecision(row);

  if (!row) {
    return { ...base, allowed: false, warning: null, reason: "Business niet gevonden." };
  }

  if (base.prospect_type === "WEBSITE_TRANSFORMATION") {
    return {
      ...base,
      allowed: true,
      warning: base.preview_eligible
        ? null
        : "Deze studio is wel een transformation prospect, maar staat nog niet als preview eligible.",
      reason: row.prospect_type_reason ?? "Transformation prospect.",
    };
  }

  const blocker =
    base.prospect_type == null
      ? "Nog geen acquisition fit bepaald. Draai eerst de acquisition fit voor deze stad."
      : `Redesign-outreach is alleen voor WEBSITE_TRANSFORMATION. Deze studio is ${base.prospect_type}. ${row.prospect_type_reason ?? ""}`.trim();

  const client = createAdminClient();
  await writeActivity(client, {
    business_id: businessId,
    activity_type: "OUTREACH_GATE_BLOCKED",
    title: "Redesign-outreach geblokkeerd",
    description: blocker,
    metadata: { prospect_type: base.prospect_type },
  });

  return { ...base, allowed: false, warning: blocker, reason: blocker };
}
