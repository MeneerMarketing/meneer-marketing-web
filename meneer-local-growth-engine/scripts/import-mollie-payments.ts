/**
 * Import paid Mollie payments into LGE Supabase (inbound_submissions + commerce_payments).
 *
 * Usage (from repo root):
 *   cd meneer-local-growth-engine
 *   $env:MOLLIE_API_KEY="test_xxx"   # PowerShell — key uit Mollie dashboard
 *   npx tsx scripts/import-mollie-payments.ts
 *
 * Optional:
 *   $env:SUPABASE_URL / SUPABASE_SECRET_KEY — defaults from .env.local
 *   $env:IMPORT_DRY_RUN="1" — only print, no writes
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal(): void {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/\r$/, "");
    process.env[key] = value;
  }
}

loadEnvLocal();

const MOLLIE_API = "https://api.mollie.com/v2";
const DRY_RUN = process.env.IMPORT_DRY_RUN === "1";

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
  _links?: { self?: { href?: string } };
}

function centsFromMollie(value: string): number {
  return Math.round(parseFloat(value) * 100);
}

async function mollieFetch<T>(path: string, apiKey: string): Promise<T> {
  const res = await fetch(`${MOLLIE_API}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const json = (await res.json().catch(() => null)) as T | { detail?: string };
  if (!res.ok) {
    const detail =
      json && typeof json === "object" && "detail" in json
        ? String((json as { detail?: string }).detail)
        : `HTTP ${res.status}`;
    throw new Error(`Mollie API: ${detail}`);
  }
  return json as T;
}

async function listAllPayments(apiKey: string): Promise<MolliePaymentListItem[]> {
  const out: MolliePaymentListItem[] = [];
  let url: string | null = "/payments?limit=250";

  while (url) {
    const page = await mollieFetch<{
      _embedded?: { payments?: MolliePaymentListItem[] };
      _links?: { next?: { href?: string } };
    }>(url.startsWith("http") ? url.replace(MOLLIE_API, "") : url, apiKey);

    out.push(...(page._embedded?.payments ?? []));
    const nextHref = page._links?.next?.href;
    url = nextHref ? nextHref.replace(MOLLIE_API, "") : null;
  }

  return out;
}

async function getPaymentDetail(
  id: string,
  apiKey: string,
): Promise<MolliePaymentListItem & { billingEmail?: string | null }> {
  return mollieFetch(`/payments/${encodeURIComponent(id)}`, apiKey);
}

async function resolveCampaignLink(
  client: ReturnType<typeof createClient>,
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

async function main(): Promise<void> {
  const mollieKey = process.env.MOLLIE_API_KEY?.trim();
  const supabaseUrl =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!mollieKey) {
    console.error(
      "MOLLIE_API_KEY ontbreekt. Zet je test/live key uit Mollie dashboard:",
    );
    console.error('  $env:MOLLIE_API_KEY="test_..."');
    process.exit(1);
  }
  if (!supabaseUrl || !supabaseKey) {
    console.error("SUPABASE_URL + SUPABASE_SECRET_KEY vereist in .env.local");
    process.exit(1);
  }

  const client = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("Ophalen betalingen uit Mollie…");
  const payments = await listAllPayments(mollieKey);
  const paid = payments.filter((p) => p.status === "paid");
  console.log(`Gevonden: ${payments.length} totaal, ${paid.length} betaald`);

  const { data: existingRows } = await client
    .from("commerce_payments")
    .select("mollie_payment_id");

  const existing = new Set(
    (existingRows ?? [])
      .map((r) => r.mollie_payment_id)
      .filter((id): id is string => Boolean(id)),
  );

  let imported = 0;
  let skipped = 0;

  for (const summary of paid) {
    if (existing.has(summary.id)) {
      skipped += 1;
      continue;
    }

    const payment = await getPaymentDetail(summary.id, mollieKey);
    const meta = payment.metadata ?? {};
    const submissionIdFromMeta = meta.submission_id?.trim() || null;
    const campaignRef = meta.campaign_ref?.trim() || null;
    const source =
      meta.source === "huidklinieken" ? "huidklinieken" : "pilates-studios";
    const amountCents = centsFromMollie(payment.amount.value);
    const email =
      payment.billingEmail?.trim() ||
      meta.email?.trim() ||
      "onbekend@meneermarketing.nl";
    const studioName =
      meta.studio_name?.trim() ||
      payment.description.replace(/^Launch fee ·\s*/i, "").trim() ||
      "Geïmporteerde klant";

    const link = await resolveCampaignLink(client, campaignRef);

    console.log(
      `\n→ Import ${payment.id} · ${studioName} · ${payment.amount.value} EUR · ${email}`,
    );

    if (DRY_RUN) {
      imported += 1;
      continue;
    }

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
          metadata: { imported_from_mollie: true, mollie_payment_id: payment.id },
        })
        .select("id")
        .single();

      if (subErr || !sub) {
        console.error("  Fout inbound:", subErr?.message);
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
      created_at: payment.createdAt,
      updated_at: new Date().toISOString(),
    });

    if (payErr) {
      console.error("  Fout payment:", payErr.message);
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

    imported += 1;
  }

  console.log(`\nKlaar. Geïmporteerd: ${imported}, overgeslagen (al in DB): ${skipped}`);
  if (DRY_RUN) console.log("(dry-run — niets opgeslagen)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
