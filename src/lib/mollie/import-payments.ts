import { getLgeSupabaseAdmin } from "@/lib/lge/supabase-admin";
import { getMolliePayment, isMollieConfigured } from "@/lib/mollie/client";

const MOLLIE_API = "https://api.mollie.com/v2";

interface MolliePaymentListItem {
  id: string;
  status: string;
  amount: { currency: string; value: string };
  description: string;
  method: string | null;
  paidAt: string | null;
  createdAt: string;
  metadata: Record<string, string> | null;
  billingEmail?: string | null;
}

export interface MollieImportResult {
  total: number;
  paid: number;
  imported: number;
  skipped: number;
  errors: string[];
}

function getMollieApiKey(): string {
  const key = process.env.MOLLIE_API_KEY?.trim();
  if (!key) throw new Error("MOLLIE_API_KEY ontbreekt");
  return key;
}

function centsFromMollie(value: string): number {
  return Math.round(parseFloat(value) * 100);
}

async function mollieList(path: string): Promise<{
  payments: MolliePaymentListItem[];
  next: string | null;
}> {
  const res = await fetch(`${MOLLIE_API}${path}`, {
    headers: { Authorization: `Bearer ${getMollieApiKey()}` },
  });
  const json = (await res.json()) as {
    _embedded?: { payments?: MolliePaymentListItem[] };
    _links?: { next?: { href?: string } };
    detail?: string;
  };
  if (!res.ok) {
    throw new Error(json.detail ?? `Mollie list failed (${res.status})`);
  }
  return {
    payments: json._embedded?.payments ?? [],
    next: json._links?.next?.href ?? null,
  };
}

async function listAllPaidPayments(): Promise<MolliePaymentListItem[]> {
  const out: MolliePaymentListItem[] = [];
  let url: string | null = "/payments?limit=250";

  while (url) {
    const page = await mollieList(url.startsWith(MOLLIE_API) ? url.replace(MOLLIE_API, "") : url);
    out.push(...page.payments.filter((p) => p.status === "paid"));
    url = page.next ? page.next.replace(MOLLIE_API, "") : null;
  }

  return out;
}

async function resolveCampaignLink(
  client: ReturnType<typeof getLgeSupabaseAdmin>,
  campaignRef: string | null,
): Promise<{ campaign_id: string | null; business_id: string | null }> {
  if (!campaignRef) return { campaign_id: null, business_id: null };
  const { data } = await client
    .from("campaigns")
    .select("id, business_id")
    .eq("campaign_ref", campaignRef)
    .maybeSingle();
  if (!data) return { campaign_id: null, business_id: null };
  return {
    campaign_id: String(data.id),
    business_id: data.business_id ? String(data.business_id) : null,
  };
}

export async function importPaidMolliePayments(): Promise<MollieImportResult> {
  if (!isMollieConfigured()) {
    throw new Error("Mollie niet geconfigureerd");
  }

  const client = getLgeSupabaseAdmin();
  const all = await listAllPaidPayments();

  const { data: existingRows } = await client
    .from("commerce_payments")
    .select("mollie_payment_id");

  const existing = new Set(
    (existingRows ?? [])
      .map((r) => r.mollie_payment_id)
      .filter((id): id is string => Boolean(id)),
  );

  const result: MollieImportResult = {
    total: all.length,
    paid: all.length,
    imported: 0,
    skipped: 0,
    errors: [],
  };

  for (const summary of all) {
    if (existing.has(summary.id)) {
      result.skipped += 1;
      continue;
    }

    try {
      const payment = await getMolliePayment(summary.id);
      const meta = payment.metadata ?? {};
      const submissionIdFromMeta = meta.submission_id?.trim() || null;
      const campaignRef = meta.campaign_ref?.trim() || null;
      const source =
        meta.source === "huidklinieken" ? "huidklinieken" : "pilates-studios";
      const amountCents = centsFromMollie(payment.amount.value);
      const email =
        meta.email?.trim() ||
        payment.metadata?.email?.trim() ||
        "onbekend@meneermarketing.nl";
      const studioName =
        meta.studio_name?.trim() ||
        payment.description.replace(/^Launch fee ·\s*/i, "").trim() ||
        "Geïmporteerde klant";

      const link = await resolveCampaignLink(client, campaignRef);
      let submissionId = submissionIdFromMeta;

      if (submissionId) {
        const { data: sub } = await client
          .from("inbound_submissions")
          .select("id")
          .eq("id", submissionId)
          .maybeSingle();
        if (!sub) submissionId = null;
      }

      if (!submissionId) {
        const { data: sub, error: subErr } = await client
          .from("inbound_submissions")
          .insert({
            source,
            studio_name: studioName,
            city: meta.city?.trim() || null,
            email: email.toLowerCase(),
            phone: meta.phone?.trim() || null,
            package_interest: meta.package_key?.trim() || null,
            booking_need: "unsure",
            message: "Geïmporteerd uit Mollie (historische betaling)",
            campaign_ref: campaignRef,
            campaign_id: link.campaign_id,
            business_id: link.business_id,
            status: "won",
            payment_status: "paid",
            launch_promo_active: amountCents === 0,
            launch_amount_cents: amountCents,
            metadata: {
              imported_from_mollie: true,
              mollie_payment_id: payment.id,
            },
          })
          .select("id")
          .single();

        if (subErr || !sub) {
          result.errors.push(`${payment.id}: ${subErr?.message ?? "submission"}`);
          continue;
        }
        submissionId = String(sub.id);
      } else {
        await client
          .from("inbound_submissions")
          .update({
            payment_status: "paid",
            status: "won",
            updated_at: new Date().toISOString(),
          })
          .eq("id", submissionId);
      }

      const { error: payErr } = await client.from("commerce_payments").insert({
        inbound_submission_id: submissionId,
        campaign_ref: campaignRef,
        campaign_id: link.campaign_id,
        business_id: link.business_id,
        mollie_payment_id: payment.id,
        amount_cents: amountCents,
        currency: payment.amount.currency,
        description: payment.description,
        payment_kind: "launch_fee",
        package_key: meta.package_key?.trim() || null,
        source,
        status: "paid",
        paid_at: payment.paidAt,
        payment_method: payment.method,
        customer_name: studioName,
        customer_email: email.toLowerCase(),
        metadata: { imported_from_mollie: true },
      });

      if (payErr) {
        result.errors.push(`${payment.id}: ${payErr.message}`);
        continue;
      }

      if (link.business_id) {
        await client
          .from("businesses")
          .update({
            lead_status: "CLIENT",
            last_activity_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", link.business_id);
      }

      if (link.campaign_id) {
        await client
          .from("campaigns")
          .update({
            conversion_status: "WON",
            updated_at: new Date().toISOString(),
            last_activity_at: new Date().toISOString(),
          })
          .eq("id", link.campaign_id);
      }

      result.imported += 1;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      result.errors.push(`${summary.id}: ${msg}`);
    }
  }

  return result;
}
