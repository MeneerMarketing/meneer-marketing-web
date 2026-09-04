/**
 * Milestone 9.2.1 — ensure opportunity exists for concept hero PDP audit.
 * Uses existing brand/page data only. No keyword discovery.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

function urlPathsMatch(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  try {
    return (
      new URL(a).pathname.replace(/\/$/, "").toLowerCase() ===
      new URL(b).pathname.replace(/\/$/, "").toLowerCase()
    );
  } catch {
    return a === b;
  }
}

export async function ensureConceptAuditOpportunity(
  supabase: SupabaseClient,
  input: {
    conceptId: string;
    brandId: string;
    productUrl: string;
    pageId?: string | null;
  }
): Promise<string> {
  const { data: cand } = await supabase
    .from("coe_concept_candidates")
    .select("opportunity_id, page_id")
    .eq("id", input.conceptId)
    .maybeSingle();

  if (cand?.opportunity_id) return cand.opportunity_id as string;

  const { data: opps } = await supabase
    .from("opportunities")
    .select("id, landing_url, resolved_url")
    .eq("brand_id", input.brandId);

  for (const opp of opps ?? []) {
    if (
      urlPathsMatch(opp.landing_url as string, input.productUrl) ||
      urlPathsMatch(opp.resolved_url as string, input.productUrl)
    ) {
      await linkConceptToOpportunity(
        supabase,
        input.conceptId,
        opp.id as string,
        input.pageId ?? cand?.page_id
      );
      return opp.id as string;
    }
  }

  let pageId = input.pageId ?? (cand?.page_id as string | null) ?? null;
  if (!pageId) {
    const { data: pages } = await supabase
      .from("pages")
      .select("id, url")
      .eq("brand_id", input.brandId);

    const existingPage = (pages ?? []).find((p) =>
      urlPathsMatch(p.url as string, input.productUrl)
    );
    if (existingPage) {
      pageId = existingPage.id as string;
    } else {
      const now = new Date().toISOString();
      const { data: insertedPage, error: pageError } = await supabase
        .from("pages")
        .insert({
          brand_id: input.brandId,
          url: input.productUrl,
          final_url: input.productUrl,
          updated_at: now,
        })
        .select("id")
        .single();

      if (pageError) {
        if (pageError.code === "23505") {
          const { data: retryPages } = await supabase
            .from("pages")
            .select("id, url")
            .eq("url", input.productUrl)
            .maybeSingle();
          pageId = (retryPages?.id as string) ?? null;
        } else {
          throw new Error(`Failed to create page: ${pageError.message}`);
        }
      } else {
        pageId = insertedPage.id as string;
      }
    }
  }

  const now = new Date().toISOString();
  const { data: insertedOpp, error: oppError } = await supabase
    .from("opportunities")
    .insert({
      brand_id: input.brandId,
      status: "NEW",
      landing_url: input.productUrl,
      resolved_url: input.productUrl,
      resolved_page_id: pageId,
      target_key: `concept:${input.conceptId}`,
      cro_readiness_level: "HIGH_CONFIDENCE_TARGET",
      cro_audit_eligible: true,
      cro_ready: false,
      paid_confirmed: false,
      paid_target_status: "CONCEPT_AUDIT",
      ground_truth_source_type: "CONCEPT_HERO_PRODUCT",
      source_type: "CONCEPT_PIPELINE",
      first_seen_at: now,
      last_seen_at: now,
      updated_at: now,
    })
    .select("id")
    .single();

  if (oppError) {
    throw new Error(`Failed to create concept audit opportunity: ${oppError.message}`);
  }

  await linkConceptToOpportunity(
    supabase,
    input.conceptId,
    insertedOpp.id as string,
    pageId
  );

  return insertedOpp.id as string;
}

async function linkConceptToOpportunity(
  supabase: SupabaseClient,
  conceptId: string,
  opportunityId: string,
  pageId?: string | null
): Promise<void> {
  const patch: Record<string, unknown> = {
    opportunity_id: opportunityId,
    updated_at: new Date().toISOString(),
  };
  if (pageId) patch.page_id = pageId;

  await supabase.from("coe_concept_candidates").update(patch).eq("id", conceptId);
}
