import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import type { InboundSubmissionStatus } from "@/lib/data/customer-labels";

const STATUS_SET = new Set<InboundSubmissionStatus>([
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
]);

export async function updateInboundCustomer(input: {
  submissionId: string;
  status?: InboundSubmissionStatus;
  internalNotes?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const client = createAdminClient();

  const { data: existing, error: fetchError } = await client
    .from("inbound_submissions")
    .select("id, status, internal_notes, business_id, studio_name")
    .eq("id", input.submissionId)
    .maybeSingle();

  if (fetchError) {
    if (/42P01|Could not find the table/i.test(fetchError.message)) {
      return { ok: false, error: "inbound_table_missing" };
    }
    return { ok: false, error: fetchError.message };
  }
  if (!existing) return { ok: false, error: "not_found" };

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.status !== undefined) {
    if (!STATUS_SET.has(input.status)) {
      return { ok: false, error: "invalid_status" };
    }
    patch.status = input.status;
  }

  if (input.internalNotes !== undefined) {
    patch.internal_notes = input.internalNotes.trim() || null;
  }

  if (Object.keys(patch).length === 1) {
    return { ok: false, error: "nothing_to_update" };
  }

  const { error: updateError } = await client
    .from("inbound_submissions")
    .update(patch)
    .eq("id", input.submissionId);

  if (updateError) {
    if (/internal_notes/i.test(updateError.message)) {
      return {
        ok: false,
        error:
          "internal_notes kolom ontbreekt — draai migratie 20260817240000_inbound_internal_notes.sql",
      };
    }
    return { ok: false, error: updateError.message };
  }

  const businessId = existing.business_id as string | null;
  if (businessId) {
    const parts: string[] = [];
    if (input.status !== undefined && input.status !== existing.status) {
      parts.push(`status → ${input.status}`);
    }
    if (
      input.internalNotes !== undefined &&
      input.internalNotes !== (existing.internal_notes ?? "")
    ) {
      parts.push("notities bijgewerkt");
    }
    if (parts.length) {
      await writeActivity(client, {
        business_id: businessId,
        activity_type: "INBOUND_UPDATED",
        title: `Klantaanvraag · ${existing.studio_name}`,
        description: parts.join(" · "),
        metadata: {
          inbound_submission_id: input.submissionId,
          status: input.status ?? existing.status,
        },
      });
    }
  }

  return { ok: true };
}
