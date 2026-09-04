import { createAdminClient } from "@/lib/supabase/admin";
import { applyLeadDisposition } from "@/lib/leads/leadDisposition";
import {
  BULK_LEAD_ACTION_MAX,
  type BulkLeadAction,
  type BulkLeadActionItemResult,
  type BulkLeadActionResult,
} from "@/lib/leads/bulkLeadActions.shared";
import { formatErrorMessage } from "@/lib/errors";
import { toggleBusinessMailWishlist } from "@/services/city-outreach/cityOutreachService";
import { generateBusinessPreview } from "@/services/preview-generation/generateBusinessPreview";

export { BULK_LEAD_ACTION_MAX };
export type { BulkLeadAction, BulkLeadActionItemResult, BulkLeadActionResult };

async function loadBusinesses(businessIds: string[]) {
  const client = createAdminClient();
  const { data, error } = await client
    .from("businesses")
    .select("id, studio_name, is_demo, website_url, lead_status")
    .in("id", businessIds);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function runBulkLeadAction(input: {
  action: BulkLeadAction;
  businessIds: string[];
}): Promise<BulkLeadActionResult> {
  const uniqueIds = Array.from(new Set(input.businessIds));
  if (uniqueIds.length === 0) {
    throw new Error("Geen leads geselecteerd");
  }
  if (uniqueIds.length > BULK_LEAD_ACTION_MAX) {
    throw new Error(`Maximaal ${BULK_LEAD_ACTION_MAX} leads per bulk actie`);
  }

  const rows = await loadBusinesses(uniqueIds);
  const byId = new Map(rows.map((row) => [String(row.id), row]));
  const client = createAdminClient();
  const results: BulkLeadActionItemResult[] = [];

  for (const businessId of uniqueIds) {
    const row = byId.get(businessId);
    if (!row) {
      results.push({
        businessId,
        studioName: "Onbekend",
        ok: false,
        error: "Lead niet gevonden",
      });
      continue;
    }

    const studioName = String(row.studio_name ?? "Studio");
    if (row.is_demo) {
      results.push({
        businessId,
        studioName,
        ok: false,
        error: "Demo-leads zijn uitgesloten",
      });
      continue;
    }

    try {
      if (input.action === "generate_previews") {
        if (!row.website_url) {
          results.push({
            businessId,
            studioName,
            ok: false,
            error: "Geen website URL",
          });
          continue;
        }
        const preview = await generateBusinessPreview(businessId);
        if (!preview.ok) {
          results.push({
            businessId,
            studioName,
            ok: false,
            error: formatErrorMessage(preview.error),
          });
          continue;
        }
        results.push({
          businessId,
          studioName,
          ok: true,
          detail: preview.slug ? `/${preview.slug}` : "READY",
        });
        continue;
      }

      if (input.action === "add_wishlist") {
        if (row.lead_status === "DO_NOT_CONTACT" || row.lead_status === "REJECTED") {
          results.push({
            businessId,
            studioName,
            ok: false,
            error: "Lead is afgewezen of uitgesloten",
          });
          continue;
        }
        const wishlist = await toggleBusinessMailWishlist({
          businessId,
          selected: true,
        });
        if (!wishlist.ok) {
          results.push({
            businessId,
            studioName,
            ok: false,
            error: wishlist.error ?? "Mail-lijst mislukt",
          });
          continue;
        }
        results.push({
          businessId,
          studioName,
          ok: true,
          detail: "Op mail-lijst",
        });
        continue;
      }

      if (input.action === "dismiss") {
        await applyLeadDisposition(client, {
          businessId,
          disposition: "dismiss",
          note: "Bulk actie vanuit lead pipeline",
        });
        results.push({
          businessId,
          studioName,
          ok: true,
          detail: "DO_NOT_CONTACT",
        });
      }
    } catch (err) {
      results.push({
        businessId,
        studioName,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const succeeded = results.filter((r) => r.ok).length;
  return {
    action: input.action,
    total: results.length,
    succeeded,
    failed: results.length - succeeded,
    results,
  };
}
