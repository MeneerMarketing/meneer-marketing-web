import type { SupabaseClient } from "@supabase/supabase-js";
import { pickBestEmail, sanitizeEmailCandidate } from "@/lib/extractEmailsFromHtml";
import { writeActivity } from "@/lib/repositories/lge";
import {
  evaluateEmailConfidence,
  persistEmailConfidence,
  pickBestEmailByConfidence,
  type EmailConfidenceResult,
} from "@/services/email/emailConfidenceService";
import { getSuppressedEmailSet } from "@/services/deliverability/suppressionDashboardService";

export async function syncBusinessEmailRecord(input: {
  client: SupabaseClient;
  businessId: string;
  studioName: string;
  email: string;
  source: string;
  confidence?: EmailConfidenceResult;
  overwriteContact?: boolean;
}): Promise<void> {
  const email = sanitizeEmailCandidate(input.email);
  if (!email) return;

  await input.client.from("businesses").update({ email }).eq("id", input.businessId);

  const { data: existingContact } = await input.client
    .from("contacts")
    .select("id, email")
    .eq("business_id", input.businessId)
    .eq("is_primary", true)
    .maybeSingle();

  if (existingContact?.id) {
    if (!existingContact.email || input.overwriteContact) {
      await input.client.from("contacts").update({ email }).eq("id", existingContact.id);
    }
    if (input.confidence) {
      await persistEmailConfidence({
        client: input.client,
        businessId: input.businessId,
        contactId: String(existingContact.id),
        email,
        confidence: input.confidence,
      });
    }
    return;
  }

  const { data: inserted } = await input.client
    .from("contacts")
    .insert({
      business_id: input.businessId,
      name: input.studioName,
      email,
      role: "Studio",
      source: input.source,
      is_primary: true,
    })
    .select("id")
    .single();

  if (input.confidence) {
    await persistEmailConfidence({
      client: input.client,
      businessId: input.businessId,
      contactId: inserted?.id ? String(inserted.id) : null,
      email,
      confidence: input.confidence,
    });
  }
}

export async function pickAndPersistBestEmail(input: {
  client: SupabaseClient;
  businessId: string;
  studioName: string;
  candidates: Array<{ email: string; source: string }>;
  businessDomain: string | null;
  suppressed?: ReadonlySet<string>;
  overwriteContact?: boolean;
}): Promise<{ email: string; source: string; confidence: EmailConfidenceResult } | null> {
  const suppressed = input.suppressed ?? (await getSuppressedEmailSet());
  const picked = await pickBestEmailByConfidence(
    input.candidates,
    input.businessDomain,
    suppressed,
  );

  if (picked) {
    await syncBusinessEmailRecord({
      client: input.client,
      businessId: input.businessId,
      studioName: input.studioName,
      email: picked.email,
      source: picked.source,
      confidence: picked.confidence,
      overwriteContact: input.overwriteContact,
    });
    return picked;
  }

  const fallback = pickBestEmail(
    input.candidates.map((c) => c.email),
    input.businessDomain,
    suppressed,
  );
  if (!fallback) return null;

  const source =
    input.candidates.find((c) => c.email === fallback)?.source ?? "website_homepage";
  const confidence = await evaluateEmailConfidence({
    email: fallback,
    businessDomain: input.businessDomain,
    source,
    occurrenceCount: input.candidates.filter((c) => c.email === fallback).length || 1,
  });

  await syncBusinessEmailRecord({
    client: input.client,
    businessId: input.businessId,
    studioName: input.studioName,
    email: fallback,
    source,
    confidence,
    overwriteContact: input.overwriteContact,
  });

  return { email: fallback, source, confidence };
}
