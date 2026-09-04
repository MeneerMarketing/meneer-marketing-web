import { createAdminClient } from "@/lib/supabase/admin";

import { sanitizeEmailCandidate } from "@/lib/extractEmailsFromHtml";

import { writeActivity } from "@/lib/repositories/lge";

import {

  evaluateEmailConfidence,

  persistEmailConfidence,

} from "@/services/email/emailConfidenceService";

import { pickAndPersistBestEmail } from "@/services/enrichment/emailSyncService";

import { scrapeWebsiteEmailCandidates } from "@/services/enrichment/scrapeWebsiteEmails";

import { getSuppressedEmailSet } from "@/services/deliverability/suppressionDashboardService";

import type { Business, Contact } from "@/types/domain";



export interface ResolvedContact {

  contact: Contact;

  source: string;

  created: boolean;

}



export async function resolveBusinessContact(

  business: Business

): Promise<ResolvedContact | null> {

  const client = createAdminClient();

  const suppressed = await getSuppressedEmailSet();



  const { data: existing } = await client

    .from("contacts")

    .select("*")

    .eq("business_id", business.id)

    .order("is_primary", { ascending: false })

    .limit(5);



  const withEmail = (existing ?? []).find((c) => c.email);

  if (withEmail?.email) {

    const cleaned = sanitizeEmailCandidate(String(withEmail.email));

    if (cleaned && !suppressed.has(cleaned)) {

      const confidence = await evaluateEmailConfidence({

        email: cleaned,

        businessDomain: business.normalized_domain ?? business.domain,

        source: String(withEmail.source ?? "existing_contact"),

      });

      await persistEmailConfidence({

        client,

        businessId: business.id,

        contactId: String(withEmail.id),

        email: cleaned,

        confidence,

      });

      if (cleaned !== withEmail.email) {

        await client.from("contacts").update({ email: cleaned }).eq("id", withEmail.id);

      }

      return {

        contact: {

          ...(withEmail as Contact),

          email: cleaned,

          email_confidence: confidence.score,

          email_confidence_level: confidence.level,

          email_confidence_reasons: confidence.reasons,

        },

        source: String(withEmail.source ?? "existing_contact"),

        created: false,

      };

    }

  }



  const candidates: Array<{ email: string; source: string }> = [];



  const businessEmail = sanitizeEmailCandidate(String(business.email ?? ""));

  if (businessEmail && !suppressed.has(businessEmail)) {

    candidates.push({ email: businessEmail, source: "business_record" });

  }



  if (business.website_url) {

    const scraped = await scrapeWebsiteEmailCandidates({

      websiteUrl: business.website_url,

    });

    for (const entry of scraped) {

      if (suppressed.has(entry.email)) continue;

      candidates.push(entry);

    }

  }



  const domain = business.normalized_domain ?? business.domain;

  const picked = await pickAndPersistBestEmail({

    client,

    businessId: business.id,

    studioName: business.studio_name,

    candidates,

    businessDomain: domain,

    suppressed,

    overwriteContact: true,

  });

  if (!picked) return null;



  const { data: contact } = await client

    .from("contacts")

    .select("*")

    .eq("business_id", business.id)

    .eq("is_primary", true)

    .maybeSingle();



  const resolvedEmail =

    sanitizeEmailCandidate(String(contact?.email ?? "")) ??

    sanitizeEmailCandidate(String(business.email ?? "")) ??

    picked.email;



  if (!resolvedEmail) return null;



  await writeActivity(client, {

    business_id: business.id,

    activity_type: "BUSINESS_UPDATED",

    title: `Contact e-mail gevonden · ${picked.email}`,

    description: `Bron: ${picked.source} · confidence ${picked.confidence.level} (${picked.confidence.score})`,

  });



  return {

    contact: {

      ...(contact as Contact),

      email: resolvedEmail,

      email_confidence: picked.confidence.score,

      email_confidence_level: picked.confidence.level,

      email_confidence_reasons: picked.confidence.reasons,

    },

    source: picked.source,

    created: true,

  };

}


