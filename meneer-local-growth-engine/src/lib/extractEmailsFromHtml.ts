import * as cheerio from "cheerio";

import { normalizeScrapedEmail } from "@/lib/utils/email";



const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const OBFUSCATED_AT_RE =

  /([a-z0-9._%+-]+)\s*(?:\[at\]|\(at\)|\{at\}|&#64;|&commat;|\s+at\s+)\s*([a-z0-9.-]+\.[a-z]{2,})/gi;



const PREFERRED_LOCAL =

  /^(info|hello|hallo|studio|contact|mail|welkom|booking|boekingen)@/i;

const GENERIC_LOCAL = /^(info|mail)@/i;



const JUNK_DOMAIN =

  /example\.|sentry\.|wixpress|schema\.org|png|jpg|jpeg|webp|svg|u003e|u002f|facebook\.com|instagram\.com|twitter\.com|linkedin\.com/i;



function isLikelyFirstNameEmail(email: string): boolean {

  const local = email.split("@")[0] ?? "";

  const tagged = `${local}@`;

  if (PREFERRED_LOCAL.test(tagged) || GENERIC_LOCAL.test(tagged)) return false;

  if (/^[a-zà-ü]{2,15}$/.test(local)) return true;

  if (/^[a-zà-ü]{2,12}\.[a-zà-ü]{2,15}$/.test(local)) return true;

  return false;

}



function decodeCloudflareEmail(encoded: string): string | null {

  const hex = encoded.replace(/^#/, "").trim();

  if (!/^[0-9a-f]+$/i.test(hex) || hex.length < 4 || hex.length % 2 !== 0) return null;

  const key = Number.parseInt(hex.slice(0, 2), 16);

  let email = "";

  for (let i = 2; i < hex.length; i += 2) {

    email += String.fromCharCode(Number.parseInt(hex.slice(i, i + 2), 16) ^ key);

  }

  return sanitizeEmailCandidate(email);

}



function deobfuscateEmailText(text: string): string {

  return text.replace(OBFUSCATED_AT_RE, "$1@$2");

}



export function sanitizeEmailCandidate(raw: string): string | null {

  const normalized = normalizeScrapedEmail(raw);

  if (normalized && !JUNK_DOMAIN.test(normalized)) {

    return normalized;

  }



  let email = raw.trim().toLowerCase();

  const match = email.match(/([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})$/i);

  if (!match) return null;

  email = match[1]!.toLowerCase();

  const cleaned = normalizeScrapedEmail(email) ?? email;

  if (JUNK_DOMAIN.test(cleaned)) return null;

  return cleaned;

}



export function scoreEmailCandidate(email: string, domain: string | null): number {

  let score = 10;

  if (PREFERRED_LOCAL.test(email)) score += 40;

  if (isLikelyFirstNameEmail(email)) score += 35;

  if (domain && email.endsWith(`@${domain.replace(/^www\./, "")}`)) score += 25;

  if (/gmail|hotmail|outlook|yahoo|icloud|live\.|ziggo|kpnmail/.test(email)) score -= 20;

  return score;

}



function collectFromBlob(blob: string, found: Set<string>): void {

  const normalized = deobfuscateEmailText(blob);

  for (const hit of normalized.match(EMAIL_RE) ?? []) {

    const clean = sanitizeEmailCandidate(hit);

    if (clean) found.add(clean);

  }

}



function collectFromJsonValue(value: unknown, found: Set<string>): void {

  if (value == null) return;

  if (typeof value === "string") {

    collectFromBlob(value, found);

    return;

  }

  if (Array.isArray(value)) {

    for (const item of value) collectFromJsonValue(item, found);

    return;

  }

  if (typeof value === "object") {

    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {

      if (key.toLowerCase() === "email" && typeof nested === "string") {

        const clean = sanitizeEmailCandidate(nested);

        if (clean) found.add(clean);

      }

      collectFromJsonValue(nested, found);

    }

  }

}



/**

 * Haalt e-mails uit HTML, ook wanneer ze in JSON/script staan (bv. HeyMarvelous-footers).

 * Ondersteunt mailto, Cloudflare email protection, schema.org JSON-LD en info [at] domein.nl.

 */

export function extractEmailsFromHtml(html: string): string[] {

  const found = new Set<string>();

  const $ = cheerio.load(html);



  $('a[href^="mailto:"]').each((_, el) => {

    const href = $(el).attr("href") ?? "";

    const raw = href.replace(/^mailto:/i, "").split("?")[0] ?? "";

    const clean = sanitizeEmailCandidate(raw);

    if (clean) found.add(clean);

  });



  $('a[href*="/cdn-cgi/l/email-protection"]').each((_, el) => {

    const href = $(el).attr("href") ?? "";

    const hash = href.split("#")[1];

    if (!hash) return;

    const decoded = decodeCloudflareEmail(hash);

    if (decoded) found.add(decoded);

  });



  $("[data-cfemail]").each((_, el) => {

    const encoded = $(el).attr("data-cfemail");

    if (!encoded) return;

    const decoded = decodeCloudflareEmail(encoded);

    if (decoded) found.add(decoded);

  });



  $('[data-email], [data-mail]').each((_, el) => {

    const raw = $(el).attr("data-email") ?? $(el).attr("data-mail") ?? "";

    const clean = sanitizeEmailCandidate(raw);

    if (clean) found.add(clean);

  });



  $('script[type="application/ld+json"]').each((_, el) => {

    const raw = $(el).html()?.trim();

    if (!raw) return;

    try {

      collectFromJsonValue(JSON.parse(raw), found);

    } catch {

      collectFromBlob(raw, found);

    }

  });



  const visibleText = $.root().text();

  collectFromBlob(visibleText, found);

  collectFromBlob(html, found);



  return Array.from(found);

}



export function pickBestEmail(

  emails: string[],

  domain: string | null,

  exclude?: ReadonlySet<string>,

): string | null {

  const unique = Array.from(

    new Set(emails.map((e) => sanitizeEmailCandidate(e)).filter(Boolean)),

  ).filter((email) => !exclude?.has(email!));

  if (unique.length === 0) return null;

  unique.sort((a, b) => scoreEmailCandidate(b!, domain) - scoreEmailCandidate(a!, domain));

  return unique[0]!;

}


