import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeEmailForMatch } from "@/lib/email/parseEmailAddress";
import type { OutreachMessage } from "@/types/domain";

export interface InboundWebhookData {
  email_id?: string;
  message_id?: string;
  from?: string;
  to?: string[] | string;
  subject?: string;
  created_at?: string;
}

const OUTBOUND_STATUSES = ["SENT", "DELIVERED", "OPENED", "CLICKED", "REPLIED"] as const;

export async function fetchInboundEmailBody(emailId: string): Promise<{
  text: string | null;
  html: string | null;
  headers: Record<string, string>;
} | null> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !emailId) return null;
  try {
    const resend = new Resend(key);
    const { data, error } = await resend.emails.receiving.get(emailId);
    if (error || !data) return null;
    const headers = (data.headers ?? {}) as Record<string, string>;
    return {
      text: data.text ?? null,
      html: data.html ?? null,
      headers,
    };
  } catch {
    return null;
  }
}

function headerValue(
  headers: Record<string, string>,
  name: string,
): string | null {
  const lower = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lower) return value;
  }
  return null;
}

async function findByInReplyTo(
  inReplyTo: string | null,
  references: string | null,
): Promise<OutreachMessage | null> {
  if (!inReplyTo && !references) return null;
  const client = createAdminClient();
  const needles = [inReplyTo, ...(references?.split(/\s+/) ?? [])]
    .filter(Boolean)
    .map((v) => String(v).trim());

  for (const needle of needles) {
    const compact = needle.replace(/[<>]/g, "");
    const uuidMatch = compact.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
    );
    const lookupId = uuidMatch?.[0] ?? compact;
    const { data } = await client
      .from("outreach_messages")
      .select("*")
      .eq("is_test", false)
      .eq("provider_message_id", lookupId)
      .order("sent_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) return data as OutreachMessage;
  }
  return null;
}

async function findBySenderEmail(fromEmail: string): Promise<OutreachMessage | null> {
  const client = createAdminClient();

  const { data: contact } = await client
    .from("contacts")
    .select("id, business_id, email")
    .ilike("email", fromEmail)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (contact?.business_id) {
    const { data: message } = await client
      .from("outreach_messages")
      .select("*")
      .eq("business_id", contact.business_id)
      .eq("is_test", false)
      .in("status", [...OUTBOUND_STATUSES])
      .order("sent_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (message) return message as OutreachMessage;
  }

  const { data: business } = await client
    .from("businesses")
    .select("id, email")
    .ilike("email", fromEmail)
    .maybeSingle();

  if (business?.id) {
    const { data: message } = await client
      .from("outreach_messages")
      .select("*")
      .eq("business_id", business.id)
      .eq("is_test", false)
      .in("status", [...OUTBOUND_STATUSES])
      .order("sent_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (message) return message as OutreachMessage;
  }

  return null;
}

/** Koppelt inbound mail op info@meneermarketing.nl aan de juiste outreach. */
export async function matchInboundReplyToOutreach(input: {
  data: InboundWebhookData;
  fetchedHeaders?: Record<string, string>;
}): Promise<OutreachMessage | null> {
  const fromEmail = normalizeEmailForMatch(input.data.from);
  if (!fromEmail) return null;

  let headers = input.fetchedHeaders ?? {};
  if (!Object.keys(headers).length && input.data.email_id) {
    const fetched = await fetchInboundEmailBody(input.data.email_id);
    if (fetched?.headers) headers = fetched.headers;
  }

  const inReplyTo =
    headerValue(headers, "in-reply-to") ?? input.data.message_id ?? null;
  const references = headerValue(headers, "references");

  const byThread = await findByInReplyTo(inReplyTo, references);
  if (byThread) return byThread;

  return findBySenderEmail(fromEmail);
}

export function snippetFromBody(text: string | null, html: string | null): string | null {
  const raw = text?.trim() || html?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!raw) return null;
  return raw.slice(0, 280);
}
