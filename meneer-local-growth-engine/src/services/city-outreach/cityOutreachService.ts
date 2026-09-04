import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import { generateBusinessPreview } from "@/services/preview-generation/generateBusinessPreview";
import { generateOutreachDraft } from "@/services/outreach/outreachGenerator";
import { ensureCampaignForBusiness } from "@/services/campaigns/campaignService";
import type { Business } from "@/types/domain";
import type { TemplateVariant } from "@/types/studio";
import {
  getOutreachCapacityConfig,
} from "@/verticals/runtime";
import {
  isUnlimitedCityOutreach,
  resolveCityOutreachMax,
} from "@/verticals/pilates/outreachCapacity";
import { isCityManuallyProtected } from "./cityAcquisitionProtection";
import {
  solveCityTemplateAssignment,
  type CityAssignmentResult,
  type TemplateAssignmentRow,
} from "./assignCityTemplates";
import {
  activeTemplatesForVertical,
  calculateTemplateFitScores,
  recommendedTemplateFromFit,
  type TemplateFitMap,
} from "./templateFit";

export interface CityOutreachCapacityView {
  active: number;
  max: number;
  available: number;
  require_unique_template: boolean;
}

export interface TemplateUsageRow {
  template: TemplateVariant;
  label: string;
  status: "AVAILABLE" | "IN_USE";
  business_id: string | null;
  studio_name: string | null;
}

const TEMPLATE_LABELS: Record<TemplateVariant, string> = {
  editorial: "Editorial",
  "reformer-minimal": "Reformer Minimal",
  "soft-movement": "Soft Movement",
  "clinical-atelier": "Atelier Clinical",
};

function asBusiness(row: Record<string, unknown>): Business {
  return row as unknown as Business;
}

export async function countActiveCityOutreach(input: {
  verticalId: string;
  cityId: string;
}): Promise<number> {
  const client = createAdminClient();
  const { count } = await client
    .from("businesses")
    .select("id", { count: "exact", head: true })
    .eq("vertical_id", input.verticalId)
    .eq("city_id", input.cityId)
    .eq("selected_for_outreach", true)
    .eq("is_demo", false);

  return count ?? 0;
}

export async function getCityOutreachCapacity(input: {
  verticalSlug: string;
  verticalId: string;
  cityId: string;
}): Promise<CityOutreachCapacityView> {
  const config = getOutreachCapacityConfig(input.verticalSlug);
  const configuredMax = config?.maxActiveOutreachPerCity ?? 0;
  const max = resolveCityOutreachMax(configuredMax);
  const active = await countActiveCityOutreach({
    verticalId: input.verticalId,
    cityId: input.cityId,
  });

  return {
    active,
    max,
    available: isUnlimitedCityOutreach(configuredMax)
      ? Number.POSITIVE_INFINITY
      : Math.max(0, max - active),
    require_unique_template: config?.requireUniqueTemplatePerCity ?? true,
  };
}

export async function assertAssignedTemplateCityUnique(input: {
  businessId: string;
  verticalId: string;
  cityId: string;
  assignedTemplate: string;
}): Promise<{ ok: boolean; conflict?: { business_id: string; studio_name: string } }> {
  const client = createAdminClient();
  const { data } = await client
    .from("businesses")
    .select("id, studio_name")
    .eq("vertical_id", input.verticalId)
    .eq("city_id", input.cityId)
    .eq("selected_for_outreach", true)
    .eq("assigned_template", input.assignedTemplate)
    .neq("id", input.businessId)
    .eq("is_demo", false)
    .maybeSingle();

  if (data?.id) {
    return {
      ok: false,
      conflict: {
        business_id: String(data.id),
        studio_name: String(data.studio_name),
      },
    };
  }
  return { ok: true };
}

export async function getTemplateUsageInCity(input: {
  verticalSlug: string;
  verticalId: string;
  cityId: string;
}): Promise<TemplateUsageRow[]> {
  const templates = activeTemplatesForVertical(input.verticalSlug);
  const client = createAdminClient();
  const { data: selected } = await client
    .from("businesses")
    .select("id, studio_name, assigned_template")
    .eq("vertical_id", input.verticalId)
    .eq("city_id", input.cityId)
    .eq("selected_for_outreach", true)
    .eq("is_demo", false);

  const byTemplate = new Map<string, { id: string; studio_name: string }>();
  for (const row of selected ?? []) {
    if (row.assigned_template) {
      byTemplate.set(String(row.assigned_template), {
        id: String(row.id),
        studio_name: String(row.studio_name),
      });
    }
  }

  return templates.map((template) => {
    const used = byTemplate.get(template);
    return {
      template,
      label: TEMPLATE_LABELS[template],
      status: used ? "IN_USE" : "AVAILABLE",
      business_id: used?.id ?? null,
      studio_name: used?.studio_name ?? null,
    };
  });
}

export function validateTransformationProspect(business: Business): string[] {
  const reasons: string[] = [];
  if (business.prospect_type !== "WEBSITE_TRANSFORMATION") {
    reasons.push("not_website_transformation");
  }
  if (!business.preview_eligible) reasons.push("not_preview_eligible");
  if (business.lead_status === "DO_NOT_CONTACT") reasons.push("do_not_contact");
  if (!business.website_url) reasons.push("no_website");
  const score = Number(business.website_transformation_score ?? 0);
  if (score < 50) reasons.push("transformation_score_too_low");
  return reasons;
}

export async function setCityOutreachSelection(input: {
  verticalId: string;
  cityId: string;
  verticalSlug: string;
  businessIds: string[];
}): Promise<{
  ok: boolean;
  error?: string;
  capacity?: CityOutreachCapacityView;
}> {
  const client = createAdminClient();
  const capacity = await getCityOutreachCapacity({
    verticalSlug: input.verticalSlug,
    verticalId: input.verticalId,
    cityId: input.cityId,
  });

  if (
    !isUnlimitedCityOutreach(capacity.max) &&
    input.businessIds.length > capacity.max
  ) {
    return {
      ok: false,
      error: `city_outreach_capacity_exceeded (${input.businessIds.length}/${capacity.max})`,
      capacity,
    };
  }

  const protection = await isCityManuallyProtected({
    verticalId: input.verticalId,
    cityId: input.cityId,
  });
  if (protection.protected) {
    return { ok: false, error: "city_manually_protected", capacity };
  }

  const { data: candidates } = await client
    .from("businesses")
    .select("*")
    .eq("vertical_id", input.verticalId)
    .eq("city_id", input.cityId)
    .in("id", input.businessIds)
    .eq("is_demo", false);

  if ((candidates ?? []).length !== input.businessIds.length) {
    return { ok: false, error: "invalid_business_ids", capacity };
  }

  for (const row of candidates ?? []) {
    const business = asBusiness(row as Record<string, unknown>);
    const reasons = validateTransformationProspect(business);
    if (reasons.length) {
      return {
        ok: false,
        error: `${business.studio_name}: ${reasons.join(", ")}`,
        capacity,
      };
    }
  }

  const now = new Date().toISOString();

  const { data: currentlySelected } = await client
    .from("businesses")
    .select("id")
    .eq("vertical_id", input.verticalId)
    .eq("city_id", input.cityId)
    .eq("selected_for_outreach", true)
    .eq("is_demo", false);

  const toDeselect = (currentlySelected ?? [])
    .map((r) => String(r.id))
    .filter((id) => !input.businessIds.includes(id));

  if (toDeselect.length) {
    await client
      .from("businesses")
      .update({
        selected_for_outreach: false,
        selected_for_outreach_at: null,
        assigned_template: null,
        template_assignment_score: null,
        template_assignment_reason: null,
        template_assignment_confidence: null,
        template_assigned_at: null,
        last_activity_at: now,
      })
      .in("id", toDeselect);
  }

  const fitRows = (candidates ?? []).map((row) => {
    const business = asBusiness(row as Record<string, unknown>);
    const fit = calculateTemplateFitScores(business);
    const rec = recommendedTemplateFromFit(fit);
    return {
      business,
      fit,
      recommended_template: rec.template,
      recommended_template_score: rec.score,
    };
  });

  let assignment: CityAssignmentResult | null = null;
  if (input.businessIds.length) {
    assignment = solveCityTemplateAssignment({
      candidates: fitRows.map((r) => ({
        business_id: r.business.id,
        studio_name: r.business.studio_name,
        fit: r.fit,
        recommended_template: r.recommended_template,
        recommended_template_score: r.recommended_template_score,
      })),
      templates: activeTemplatesForVertical(input.verticalSlug),
    });
  }

  const assignmentById = new Map(
    (assignment?.assignments ?? []).map((a) => [a.business_id, a])
  );

  for (const row of fitRows) {
    const assigned = assignmentById.get(row.business.id);
    await client
      .from("businesses")
      .update({
        selected_for_outreach: true,
        selected_for_outreach_at: now,
        template_fit_scores: row.fit,
        recommended_template: row.recommended_template,
        recommended_template_score: row.recommended_template_score,
        assigned_template: assigned?.assigned_template ?? row.recommended_template,
        template_assignment_score: assigned?.template_assignment_score ?? row.recommended_template_score,
        template_assignment_reason: assigned?.template_assignment_reason ?? null,
        template_assignment_confidence: assigned?.template_assignment_confidence ?? null,
        template_assigned_at: now,
        lead_status:
          row.business.lead_status === "DISCOVERED" ? "READY_FOR_OUTREACH" : row.business.lead_status,
        last_activity_at: now,
      })
      .eq("id", row.business.id);

    await writeActivity(client, {
      business_id: row.business.id,
      activity_type: "SELECTED_FOR_OUTREACH",
      title: "Geselecteerd voor city outreach",
      description: assigned
        ? `Assigned template: ${assigned.assigned_template}`
        : "Deselect / backup",
      metadata: {
        recommended_template: row.recommended_template,
        assigned_template: assigned?.assigned_template ?? null,
        template_fit_scores: row.fit,
      },
    });
  }

  for (const id of toDeselect) {
    await writeActivity(client, {
      business_id: id,
      activity_type: "DESELECTED_FROM_OUTREACH",
      title: "Uit city outreach selectie gehaald",
    });
  }

  const updatedCapacity = await getCityOutreachCapacity({
    verticalSlug: input.verticalSlug,
    verticalId: input.verticalId,
    cityId: input.cityId,
  });

  return { ok: true, capacity: updatedCapacity };
}

async function archiveStalePreviewIfNeeded(
  businessId: string,
  assignedTemplate: TemplateVariant
): Promise<void> {
  const client = createAdminClient();
  const { data: preview } = await client
    .from("previews")
    .select("id, template_variant, status")
    .eq("business_id", businessId)
    .in("status", ["READY", "APPROVED", "GENERATING"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (preview?.template_variant && preview.template_variant !== assignedTemplate) {
    await client
      .from("previews")
      .update({ status: "ARCHIVED", updated_at: new Date().toISOString() })
      .eq("id", preview.id);
    await writeActivity(client, {
      business_id: businessId,
      activity_type: "PREVIEW_ARCHIVED",
      title: "Eerdere preview gearchiveerd (template wijziging)",
      metadata: {
        previous_template: preview.template_variant,
        assigned_template: assignedTemplate,
      },
    });
  }
}

export async function prepareSelectedCityOutreach(input: {
  verticalId: string;
  cityId: string;
  verticalSlug: string;
  businessIds?: string[];
}): Promise<{
  ok: boolean;
  error?: string;
  assignment?: CityAssignmentResult;
  prepared: Array<{
    business_id: string;
    studio_name: string;
    assigned_template: string;
    preview_ok: boolean;
    preview_error?: string;
    campaign_id?: string;
    outreach_draft_id?: string;
  }>;
  capacity: CityOutreachCapacityView;
  template_usage: TemplateUsageRow[];
}> {
  const client = createAdminClient();
  const capacity = await getCityOutreachCapacity({
    verticalSlug: input.verticalSlug,
    verticalId: input.verticalId,
    cityId: input.cityId,
  });

  const protection = await isCityManuallyProtected({
    verticalId: input.verticalId,
    cityId: input.cityId,
  });
  if (protection.protected) {
    return {
      ok: false,
      error: "city_manually_protected",
      prepared: [],
      capacity,
      template_usage: await getTemplateUsageInCity(input),
    };
  }

  let targetIds = input.businessIds;
  if (!targetIds?.length) {
    const { data: selected } = await client
      .from("businesses")
      .select("id")
      .eq("vertical_id", input.verticalId)
      .eq("city_id", input.cityId)
      .eq("selected_for_outreach", true)
      .eq("is_demo", false)
      .order("transformation_city_rank", { ascending: true });
    targetIds = (selected ?? []).map((r) => String(r.id));
  }

  if (!targetIds.length) {
    return {
      ok: false,
      error: "no_selected_prospects",
      prepared: [],
      capacity,
      template_usage: await getTemplateUsageInCity(input),
    };
  }

  if (!isUnlimitedCityOutreach(capacity.max) && targetIds.length > capacity.max) {
    return {
      ok: false,
      error: `city_outreach_capacity_reached (${targetIds.length}/${capacity.max})`,
      prepared: [],
      capacity,
      template_usage: await getTemplateUsageInCity(input),
    };
  }

  const selection = await setCityOutreachSelection({
    verticalId: input.verticalId,
    cityId: input.cityId,
    verticalSlug: input.verticalSlug,
    businessIds: targetIds,
  });
  if (!selection.ok) {
    return {
      ok: false,
      error: selection.error,
      prepared: [],
      capacity: selection.capacity ?? capacity,
      template_usage: await getTemplateUsageInCity(input),
    };
  }

  const { data: businesses } = await client
    .from("businesses")
    .select("*")
    .in("id", targetIds)
    .eq("is_demo", false);

  const fitRows = (businesses ?? []).map((row) => {
    const business = asBusiness(row as Record<string, unknown>);
    const fit = calculateTemplateFitScores(business);
    const rec = recommendedTemplateFromFit(fit);
    return {
      business_id: business.id,
      studio_name: business.studio_name,
      fit,
      recommended_template: rec.template,
      recommended_template_score: rec.score,
    };
  });

  const assignment = solveCityTemplateAssignment({
    candidates: fitRows.map((r) => ({
      business_id: r.business_id,
      studio_name: r.studio_name,
      fit: r.fit,
      recommended_template: r.recommended_template,
      recommended_template_score: r.recommended_template_score,
    })),
    templates: activeTemplatesForVertical(input.verticalSlug),
  });

  const now = new Date().toISOString();
  for (const row of assignment.assignments) {
    const unique = await assertAssignedTemplateCityUnique({
      businessId: row.business_id,
      verticalId: input.verticalId,
      cityId: input.cityId,
      assignedTemplate: row.assigned_template,
    });
    if (!unique.ok) {
      return {
        ok: false,
        error: `duplicate_template:${row.assigned_template}:${unique.conflict?.studio_name}`,
        assignment,
        prepared: [],
        capacity: await getCityOutreachCapacity(input),
        template_usage: await getTemplateUsageInCity(input),
      };
    }

    await client
      .from("businesses")
      .update({
        assigned_template: row.assigned_template,
        template_assignment_score: row.template_assignment_score,
        template_assignment_reason: row.template_assignment_reason,
        template_assignment_confidence: row.template_assignment_confidence,
        template_assigned_at: now,
        last_activity_at: now,
      })
      .eq("id", row.business_id);
  }

  const prepared: Array<{
    business_id: string;
    studio_name: string;
    assigned_template: string;
    preview_ok: boolean;
    preview_error?: string;
    campaign_id?: string;
    outreach_draft_id?: string;
  }> = [];

  for (const row of assignment.assignments) {
    const assigned = row.assigned_template as TemplateVariant;
    await archiveStalePreviewIfNeeded(row.business_id, assigned);

    const preview = await generateBusinessPreview(row.business_id, {
      forceTemplate: assigned,
    });

    let campaignId: string | undefined;
    let outreachDraftId: string | undefined;

    if (preview.ok) {
      const campaign = await ensureCampaignForBusiness({
        businessId: row.business_id,
        createReservation: false,
      });
      campaignId = campaign.id;

      try {
        const draft = await generateOutreachDraft({ businessId: row.business_id });
        outreachDraftId = draft.message.id;
      } catch (draftError) {
        prepared.push({
          business_id: row.business_id,
          studio_name: row.studio_name,
          assigned_template: assigned,
          preview_ok: true,
          preview_error:
            draftError instanceof Error ? draftError.message : "Outreach draft mislukt",
          campaign_id: campaignId,
        });
        continue;
      }
    }

    prepared.push({
      business_id: row.business_id,
      studio_name: row.studio_name,
      assigned_template: assigned,
      preview_ok: preview.ok,
      preview_error: preview.ok ? undefined : preview.error,
      campaign_id: campaignId,
      outreach_draft_id: outreachDraftId,
    });
  }

  return {
    ok: true,
    assignment,
    prepared,
    capacity: await getCityOutreachCapacity(input),
    template_usage: await getTemplateUsageInCity(input),
  };
}

export async function overrideAssignedTemplate(input: {
  businessId: string;
  template: TemplateVariant;
}): Promise<{ ok: boolean; error?: string; conflict?: { studio_name: string } }> {
  const client = createAdminClient();
  const { data: business } = await client
    .from("businesses")
    .select("*")
    .eq("id", input.businessId)
    .single();

  if (!business) return { ok: false, error: "business_not_found" };
  if (!business.selected_for_outreach) {
    return { ok: false, error: "not_selected_for_outreach" };
  }

  const unique = await assertAssignedTemplateCityUnique({
    businessId: input.businessId,
    verticalId: String(business.vertical_id),
    cityId: String(business.city_id),
    assignedTemplate: input.template,
  });
  if (!unique.ok) {
    return {
      ok: false,
      error: "template_in_use",
      conflict: { studio_name: unique.conflict?.studio_name ?? "andere prospect" },
    };
  }

  const fit = calculateTemplateFitScores(asBusiness(business as Record<string, unknown>));
  const now = new Date().toISOString();

  await client
    .from("businesses")
    .update({
      assigned_template: input.template,
      template_assignment_score: fit[input.template],
      template_assignment_reason: "Handmatige template override",
      template_assignment_confidence: 70,
      template_assigned_at: now,
      last_activity_at: now,
    })
    .eq("id", input.businessId);

  return { ok: true };
}

export function formatAssignmentReport(input: {
  assignments: TemplateAssignmentRow[];
  fitByBusiness: Map<string, TemplateFitMap>;
  cityAssignment: CityAssignmentResult;
}): string {
  const lines: string[] = [];
  for (const row of input.assignments) {
    const fit = input.fitByBusiness.get(row.business_id) ?? {
      editorial: 0,
      "reformer-minimal": 0,
      "soft-movement": 0,
    };
    lines.push(`\n${row.studio_name.toUpperCase()}`);
    lines.push(`Editorial fit: ${fit.editorial ?? "—"}`);
    lines.push(`Reformer Minimal fit: ${fit["reformer-minimal"] ?? "—"}`);
    lines.push(`Soft Movement fit: ${fit["soft-movement"] ?? "—"}`);
    lines.push(`Recommended: ${row.recommended_template} (${row.recommended_template_score})`);
    lines.push(`Assigned: ${row.assigned_template} (${row.template_assignment_score})`);
    lines.push(`Reason: ${row.template_assignment_reason}`);
  }
  lines.push("\nCITY OPTIMAL ASSIGNMENT");
  for (const row of input.cityAssignment.assignments) {
    lines.push(`${row.studio_name} → ${row.assigned_template}`);
  }
  lines.push(`\nTOTAL ASSIGNMENT FIT: ${input.cityAssignment.total_fit}`);
  lines.push(input.cityAssignment.summary);
  return lines.join("\n");
}

/** Handmatige mail-lijst vanuit lead detail (los van discovery city-panel). */
export async function toggleBusinessMailWishlist(input: {
  businessId: string;
  selected: boolean;
  verticalId?: string;
}): Promise<{
  ok: boolean;
  error?: string;
  capacity?: CityOutreachCapacityView;
}> {
  const client = createAdminClient();
  const { data: row } = await client
    .from("businesses")
    .select("*")
    .eq("id", input.businessId)
    .eq("is_demo", false)
    .maybeSingle();

  if (!row) {
    return { ok: false, error: "Lead niet gevonden" };
  }

  const business = asBusiness(row as Record<string, unknown>);
  const { data: vertical } = await client
    .from("verticals")
    .select("slug, name")
    .eq("id", business.vertical_id)
    .maybeSingle();
  const verticalSlug = String(vertical?.slug ?? "pilates");
  const verticalName = String(vertical?.name ?? verticalSlug);

  if (input.verticalId && input.verticalId !== business.vertical_id) {
    return {
      ok: false,
      error: `Deze lead hoort bij ${verticalName}. Kies die branche in de mail-lijst.`,
    };
  }

  if (business.lead_status === "DO_NOT_CONTACT") {
    return { ok: false, error: "Deze lead staat op do-not-contact." };
  }

  const protection = await isCityManuallyProtected({
    verticalId: business.vertical_id,
    cityId: business.city_id,
  });
  if (protection.protected && input.selected) {
    return { ok: false, error: "Deze stad is handmatig beschermd voor acquisitie." };
  }

  const now = new Date().toISOString();

  if (!input.selected) {
    if (!business.selected_for_outreach) {
      return { ok: true };
    }

    await client
      .from("businesses")
      .update({
        selected_for_outreach: false,
        selected_for_outreach_at: null,
        last_activity_at: now,
      })
      .eq("id", input.businessId);

    await writeActivity(client, {
      business_id: business.id,
      activity_type: "DESELECTED_FROM_OUTREACH",
      title: "Uit mail-lijst gehaald",
      description: business.studio_name,
    });

    return { ok: true };
  }

  if (business.selected_for_outreach) {
    return { ok: true };
  }

  const capacity = await getCityOutreachCapacity({
    verticalSlug,
    verticalId: business.vertical_id,
    cityId: business.city_id,
  });
  if (
    !isUnlimitedCityOutreach(capacity.max) &&
    capacity.active >= capacity.max
  ) {
    return {
      ok: false,
      error: `Je hebt al ${capacity.max} studios in ${verticalSlug} voor deze stad op je mail-lijst. Haal er eerst één af.`,
      capacity,
    };
  }

  const fit = calculateTemplateFitScores(business);
  const rec = recommendedTemplateFromFit(fit);

  await client
    .from("businesses")
    .update({
      selected_for_outreach: true,
      selected_for_outreach_at: now,
      template_fit_scores: fit,
      recommended_template: rec.template,
      recommended_template_score: rec.score,
      assigned_template: business.assigned_template ?? rec.template,
      template_assignment_score:
        business.template_assignment_score ?? rec.score,
      template_assigned_at: business.template_assigned_at ?? now,
      lead_status:
        business.lead_status === "DISCOVERED" ? "READY_FOR_OUTREACH" : business.lead_status,
      last_activity_at: now,
    })
    .eq("id", input.businessId);

  await writeActivity(client, {
    business_id: business.id,
    activity_type: "SELECTED_FOR_OUTREACH",
    title: `Op ${verticalName} mail-lijst gezet`,
    description: `Template: ${rec.template}`,
    metadata: {
      source: "lead_detail",
      recommended_template: rec.template,
      vertical_slug: verticalSlug,
    },
  });

  const updatedCapacity = await getCityOutreachCapacity({
    verticalSlug,
    verticalId: business.vertical_id,
    cityId: business.city_id,
  });

  return { ok: true, capacity: updatedCapacity };
}
