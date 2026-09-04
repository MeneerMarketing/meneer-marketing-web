import type { SupabaseClient } from "@supabase/supabase-js";

export async function logActivity(
  client: SupabaseClient,
  input: {
    brandId?: string | null;
    opportunityId?: string | null;
    eventType: string;
    title: string;
    detail?: string | null;
    actor?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  await client.from("operator_activity_log").insert({
    brand_id: input.brandId ?? null,
    opportunity_id: input.opportunityId ?? null,
    event_type: input.eventType,
    title: input.title,
    detail: input.detail ?? null,
    actor: input.actor ?? "operator",
    metadata: input.metadata ?? {},
  });
}

export const EXCLUSION_REASONS = [
  "GENERAL_RETAILER",
  "TOO_LARGE",
  "MARKETPLACE",
  "IRRELEVANT_BUSINESS",
  "POOR_PROSPECT",
  "EXISTING_CLIENT",
  "COMPETITOR",
  "DO_NOT_CONTACT",
  "OTHER",
] as const;

export type ExclusionReason = (typeof EXCLUSION_REASONS)[number];

export function slugifyTag(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
