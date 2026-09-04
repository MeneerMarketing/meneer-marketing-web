import type { SupabaseClient } from "@supabase/supabase-js";

import { sanitizeEmailCandidate } from "@/lib/extractEmailsFromHtml";

import { writeActivity } from "@/lib/repositories/lge";

import { pickAndPersistBestEmail } from "@/services/enrichment/emailSyncService";

import { scrapeWebsiteEmailCandidates } from "@/services/enrichment/scrapeWebsiteEmails";

import { getSuppressedEmailSet } from "@/services/deliverability/suppressionDashboardService";



export interface EnrichBusinessEmailResult {

  email: string | null;

  source: string | null;

  updated: boolean;

}



/**

 * Contact- en locatiepagina's scannen en business/contacts bijwerken als er nog geen e-mail is.

 */

export async function enrichBusinessEmailFromWebsite(

  client: SupabaseClient,

  input: {

    businessId: string;

    websiteUrl: string | null;

    domain: string | null;

    studioName: string;

    existingEmail?: string | null;

    force?: boolean;

  },

): Promise<EnrichBusinessEmailResult> {

  const suppressed = await getSuppressedEmailSet();

  const existing = sanitizeEmailCandidate(String(input.existingEmail ?? ""));

  if (existing && !input.force) {

    if (suppressed.has(existing)) {

      return { email: null, source: "suppressed", updated: false };

    }

    return { email: existing, source: "existing", updated: false };

  }



  const { data: businessRow } = await client

    .from("businesses")

    .select("email")

    .eq("id", input.businessId)

    .maybeSingle();



  const stored = sanitizeEmailCandidate(String(businessRow?.email ?? ""));

  if (stored && !input.force) {

    if (suppressed.has(stored)) {

      return { email: null, source: "suppressed", updated: false };

    }

    return { email: stored, source: "business_record", updated: false };

  }



  if (!input.websiteUrl) {

    return { email: null, source: null, updated: false };

  }



  const scraped = await scrapeWebsiteEmailCandidates({

    websiteUrl: input.websiteUrl,

  });



  const candidates = scraped.filter((entry) => !suppressed.has(entry.email));



  const picked = await pickAndPersistBestEmail({

    client,

    businessId: input.businessId,

    studioName: input.studioName,

    candidates,

    businessDomain: input.domain,

    suppressed,

    overwriteContact: input.force,

  });



  if (!picked) {

    return { email: null, source: null, updated: false };

  }



  await writeActivity(client, {

    business_id: input.businessId,

    activity_type: "BUSINESS_UPDATED",

    title: `E-mail gevonden op website · ${picked.email}`,

    description: `Bron: ${picked.source} · confidence ${picked.confidence.level}`,

  });



  return { email: picked.email, source: picked.source, updated: true };

}


