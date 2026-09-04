import { createAdminClient } from "@/lib/supabase/admin";

export interface ReplyInboxBusiness {
  id: string;
  studio_name: string;
  city_id: string;
  preview_status: string | null;
  lead_status: string;
}

export interface ReplyInboxMessage {
  id: string;
  subject: string;
  preview_url: string | null;
  status: string;
  message_kind: string | null;
  sent_at: string | null;
}

export interface ReplyInboxItem {
  id: string;
  receivedAt: string;
  fromEmail: string | null;
  subject: string | null;
  bodySnippet: string | null;
  acknowledgedAt: string | null;
  business: ReplyInboxBusiness | null;
  outreachMessage: ReplyInboxMessage | null;
  previewUrl: string | null;
  cityName: string | null;
}

export interface ReplyInboxSummary {
  unreadCount: number;
  items: ReplyInboxItem[];
  inboxAddress: string;
}

function defaultInboxAddress(): string {
  return process.env.INBOX_REPLY_ADDRESS?.trim() || "info@meneermarketing.nl";
}

export async function listReplyInbox(limit = 12): Promise<ReplyInboxSummary> {
  const client = createAdminClient();

  const { data: rows, error } = await client
    .from("outreach_inbound_replies")
    .select(
      "id, received_at, from_email, subject, body_text, acknowledged_at, business_id, outreach_message_id, businesses:business_id(id, studio_name, city_id, preview_status, lead_status), outreach_messages:outreach_message_id(id, subject, preview_url, status, message_kind, sent_at)",
    )
    .is("acknowledged_at", null)
    .order("received_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { unreadCount: 0, items: [], inboxAddress: defaultInboxAddress() };
  }

  const cityIds = [
    ...new Set(
      (rows ?? [])
        .map((r) => (r.businesses as { city_id?: string } | null)?.city_id)
        .filter(Boolean),
    ),
  ] as string[];

  const [{ data: cities }, { count: unreadCount }] = await Promise.all([
    cityIds.length
      ? client.from("cities").select("id, name").in("id", cityIds)
      : Promise.resolve({ data: [] }),
    client
      .from("outreach_inbound_replies")
      .select("id", { count: "exact", head: true })
      .is("acknowledged_at", null),
  ]);

  const cityMap = new Map((cities ?? []).map((c) => [c.id as string, c.name as string]));

  const items: ReplyInboxItem[] = (rows ?? []).map((row) => {
    const businessRaw = row.businesses as ReplyInboxBusiness | ReplyInboxBusiness[] | null;
    const messageRaw = row.outreach_messages as
      | ReplyInboxMessage
      | ReplyInboxMessage[]
      | null;
    const business = Array.isArray(businessRaw) ? businessRaw[0] ?? null : businessRaw;
    const message = Array.isArray(messageRaw) ? messageRaw[0] ?? null : messageRaw;
    return {
      id: row.id as string,
      receivedAt: row.received_at as string,
      fromEmail: (row.from_email as string | null) ?? null,
      subject: (row.subject as string | null) ?? null,
      bodySnippet: (row.body_text as string | null)?.slice(0, 280) ?? null,
      acknowledgedAt: (row.acknowledged_at as string | null) ?? null,
      business,
      outreachMessage: message,
      previewUrl: message?.preview_url ?? null,
      cityName: business?.city_id ? cityMap.get(business.city_id) ?? null : null,
    };
  });

  return {
    unreadCount: unreadCount ?? items.length,
    items,
    inboxAddress: defaultInboxAddress(),
  };
}

export async function acknowledgeReplyInboxItem(replyId: string): Promise<boolean> {
  const client = createAdminClient();
  const now = new Date().toISOString();
  const { error } = await client
    .from("outreach_inbound_replies")
    .update({ acknowledged_at: now })
    .eq("id", replyId)
    .is("acknowledged_at", null);
  return !error;
}

export async function acknowledgeAllReplies(): Promise<number> {
  const client = createAdminClient();
  const now = new Date().toISOString();
  const { data } = await client
    .from("outreach_inbound_replies")
    .update({ acknowledged_at: now })
    .is("acknowledged_at", null)
    .select("id");
  return data?.length ?? 0;
}
