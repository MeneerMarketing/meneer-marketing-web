import * as cheerio from "cheerio";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import type { Business, Contact } from "@/types/domain";

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PREFERRED_LOCAL =
  /^(info|hello|hallo|studio|contact|mail|welkom|booking|boekingen)@/i;

function sanitizeCandidate(raw: string): string | null {
  let email = raw.trim().toLowerCase();
  // Fix concatenated phone+email like 0610758555info@domain.nl
  const match = email.match(/([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})$/i);
  if (!match) return null;
  email = match[1]!.toLowerCase();
  if (/example\.|sentry\.|wixpress|schema\.org|png|jpg|jpeg|webp|svg/.test(email)) {
    return null;
  }
  return email;
}

function scoreEmail(email: string, domain: string | null): number {
  let score = 10;
  if (PREFERRED_LOCAL.test(email)) score += 40;
  if (domain && email.endsWith(`@${domain.replace(/^www\./, "")}`)) score += 25;
  if (/gmail|hotmail|outlook|yahoo|icloud|live\.|ziggo|kpnmail/.test(email)) score -= 20;
  return score;
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "MeneerMarketing-LGE/1.0" },
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractEmailsFromHtml(html: string): string[] {
  const $ = cheerio.load(html);
  const found = new Set<string>();
  $('a[href^="mailto:"]').each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const raw = href.replace(/^mailto:/i, "").split("?")[0] ?? "";
    const clean = sanitizeCandidate(raw);
    if (clean) found.add(clean);
  });
  const text = $.root().text() + " " + html;
  for (const hit of text.match(EMAIL_RE) ?? []) {
    const clean = sanitizeCandidate(hit);
    if (clean) found.add(clean);
  }
  return Array.from(found);
}

export interface ResolvedContact {
  contact: Contact;
  source: string;
  created: boolean;
}

export async function resolveBusinessContact(
  business: Business
): Promise<ResolvedContact | null> {
  const client = createAdminClient();

  const { data: existing } = await client
    .from("contacts")
    .select("*")
    .eq("business_id", business.id)
    .order("is_primary", { ascending: false })
    .limit(5);

  const withEmail = (existing ?? []).find((c) => c.email);
  if (withEmail?.email) {
    const cleaned = sanitizeCandidate(String(withEmail.email));
    if (cleaned) {
      if (cleaned !== withEmail.email) {
        await client.from("contacts").update({ email: cleaned }).eq("id", withEmail.id);
      }
      return {
        contact: { ...(withEmail as Contact), email: cleaned },
        source: String(withEmail.source ?? "existing_contact"),
        created: false,
      };
    }
  }

  const candidates: Array<{ email: string; source: string }> = [];

  const businessEmail = sanitizeCandidate(String(business.email ?? ""));
  if (businessEmail) {
    candidates.push({ email: businessEmail, source: "business_record" });
  }

  const base = business.website_url;
  if (base) {
    const urls = [
      base,
      new URL("/contact", base).toString(),
      new URL("/contacteer-ons", base).toString(),
      new URL("/over-ons", base).toString(),
      new URL("/about", base).toString(),
    ];
    for (const url of urls) {
      const html = await fetchPage(url);
      if (!html) continue;
      for (const email of extractEmailsFromHtml(html)) {
        candidates.push({
          email,
          source: url === base ? "website_homepage" : `website_page:${url}`,
        });
      }
      if (candidates.length >= 3) break;
    }
  }

  const domain = business.normalized_domain ?? business.domain;
  candidates.sort(
    (a, b) => scoreEmail(b.email, domain) - scoreEmail(a.email, domain)
  );
  const best = candidates[0];
  if (!best) return null;

  const payload = {
    business_id: business.id,
    name: business.studio_name,
    email: best.email,
    phone: business.phone,
    role: "Studio",
    source: best.source,
    is_primary: true,
  };

  const { data: inserted, error } = await client
    .from("contacts")
    .insert(payload)
    .select("*")
    .single();
  if (error || !inserted) {
    // Unique or race: try update business email and re-read
    await client
      .from("businesses")
      .update({ email: best.email })
      .eq("id", business.id);
    const { data: again } = await client
      .from("contacts")
      .select("*")
      .eq("business_id", business.id)
      .eq("email", best.email)
      .maybeSingle();
    if (!again) return null;
    return { contact: again as Contact, source: best.source, created: false };
  }

  await client.from("businesses").update({ email: best.email }).eq("id", business.id);
  await writeActivity(client, {
    business_id: business.id,
    activity_type: "BUSINESS_UPDATED",
    title: `Contact e-mail gevonden · ${best.email}`,
    description: `Bron: ${best.source}`,
  });

  return { contact: inserted as Contact, source: best.source, created: true };
}
