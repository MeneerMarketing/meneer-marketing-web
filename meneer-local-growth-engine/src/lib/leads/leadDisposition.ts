import type { SupabaseClient } from "@supabase/supabase-js";
import type { LeadStatus } from "@/types/domain";
import { writeActivity } from "@/lib/repositories/lge";

export type LeadDisposition = "reject" | "dismiss" | "restore";

const DISPOSITION_STATUS: Record<LeadDisposition, LeadStatus> = {
  reject: "REJECTED",
  dismiss: "DO_NOT_CONTACT",
  restore: "DISCOVERED",
};

export async function applyLeadDisposition(
  client: SupabaseClient,
  input: {
    businessId: string;
    disposition: LeadDisposition;
    note?: string;
  }
): Promise<{ leadStatus: LeadStatus }> {
  const leadStatus = DISPOSITION_STATUS[input.disposition];
  const now = new Date().toISOString();

  const patch: Record<string, unknown> = {
    lead_status: leadStatus,
    last_activity_at: now,
  };

  if (input.disposition === "restore") {
    patch.lead_eligible = true;
    patch.primary_candidate = false;
  } else {
    patch.selected_for_outreach = false;
    patch.selected_for_outreach_at = null;
    patch.primary_candidate = false;
    patch.lead_eligible = false;
  }

  const { error } = await client.from("businesses").update(patch).eq("id", input.businessId);
  if (error) throw new Error(error.message);

  const titles: Record<LeadDisposition, string> = {
    reject: "Lead afgewezen",
    dismiss: "Lead uitgesloten (niet benaderen)",
    restore: "Lead hersteld",
  };

  await writeActivity(client, {
    business_id: input.businessId,
    activity_type: "STATUS_CHANGED",
    title: titles[input.disposition],
    description: input.note ?? `Status → ${leadStatus}`,
    metadata: { disposition: input.disposition, lead_status: leadStatus },
  });

  return { leadStatus };
}
