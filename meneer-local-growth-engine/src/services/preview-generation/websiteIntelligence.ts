import * as cheerio from "cheerio";
import type { CrawledPage, WebsiteIntelligence } from "./types";
import { extractEmailsFromHtml, pickBestEmail } from "@/lib/extractEmailsFromHtml";

const INTERESTING =
  /home|over|about|les|aanbod|reformer|prijs|tarief|contact|pilates|klas|class|service|team|studio|boek|book|kliniek|huid|behandel|afspraak|locatie|botox|laser|intake|clinical|aesthetic|praktijk|locaties/i;

function normalizeUrl(base: string, href: string): string | null {
  try {
    const url = new URL(href, base);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

async function fetchHtml(url: string, timeoutMs: number): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "MeneerMarketing-LocalGrowthEngine/1.0 (+https://meneermarketing.nl; preview research)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("text/html") && !ct.includes("application/xhtml")) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function parsePage(url: string, html: string): CrawledPage {
  const $ = cheerio.load(html);
  $("script, style, noscript, svg, iframe").remove();
  const title = $("title").first().text().trim();
  const text = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20000);
  const links: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const abs = normalizeUrl(url, href);
    if (abs) links.push(abs);
  });
  return { url, title, text, html, links };
}

export async function analyzeWebsite(
  websiteUrl: string,
  options?: { maxPages?: number; timeoutMs?: number }
): Promise<WebsiteIntelligence> {
  const maxPages = options?.maxPages ?? Number(process.env.PREVIEW_MAX_PAGES_PER_BUSINESS ?? 6);
  const timeoutMs = options?.timeoutMs ?? Number(process.env.PREVIEW_TIMEOUT_MS ?? 12000);
  const errors: string[] = [];

  let base: URL;
  try {
    base = new URL(websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`);
  } catch {
    return {
      base_url: websiteUrl,
      pages: [],
      emails: [],
      phones: [],
      socials: {},
      raw_headings: [],
      errors: ["Ongeldige website URL"],
    };
  }

  const origin = base.origin;
  const queue: string[] = [base.toString()];
  const seen = new Set<string>();
  const pages: CrawledPage[] = [];

  while (queue.length && pages.length < maxPages) {
    const next = queue.shift()!;
    const key = next.replace(/\/$/, "");
    if (seen.has(key)) continue;
    seen.add(key);

    const html = await fetchHtml(next, timeoutMs);
    if (!html) {
      errors.push(`Kon pagina niet laden: ${next}`);
      continue;
    }

    try {
      const page = parsePage(next, html);
      pages.push(page);

      for (const link of page.links) {
        try {
          const u = new URL(link);
          if (u.origin !== origin) continue;
          if (/\.(pdf|jpg|jpeg|png|gif|webp|svg|zip|mp4)(\?|$)/i.test(u.pathname)) continue;
          const path = u.pathname + u.search;
          if (!INTERESTING.test(path) && !INTERESTING.test(link) && pages.length > 0) {
            // still allow shallow same-host paths under depth
            if (u.pathname.split("/").filter(Boolean).length > 2) continue;
          }
          const normalized = u.toString().replace(/\/$/, "");
          if (!seen.has(normalized) && !queue.includes(u.toString())) {
            queue.push(u.toString());
          }
        } catch {
          /* ignore bad links */
        }
      }
    } catch (err) {
      errors.push(
        `Parsefout ${next}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  const emailCandidates: string[] = [];
  for (const page of pages) {
    emailCandidates.push(...extractEmailsFromHtml(page.html));
  }
  const domain = (() => {
    try {
      return base.hostname.replace(/^www\./, "");
    } catch {
      return null;
    }
  })();
  const bestEmail = pickBestEmail(emailCandidates, domain);
  const emails = bestEmail
    ? [bestEmail, ...emailCandidates.filter((e) => e !== bestEmail)].slice(0, 5)
    : [];
  const phones = Array.from(
    new Set(pages.map((p) => p.text).join(" ").match(/(?:\+31|0)[\d\s\-()]{8,16}/g) ?? [])
  ).slice(0, 5);

  const socials: WebsiteIntelligence["socials"] = {};
  for (const page of pages) {
    for (const link of page.links) {
      if (/instagram\.com/i.test(link) && !socials.instagram) socials.instagram = link;
      if (/facebook\.com/i.test(link) && !socials.facebook) socials.facebook = link;
    }
  }

  const raw_headings: string[] = [];
  for (const page of pages) {
    const $ = cheerio.load(page.html);
    $("h1,h2,h3").each((_, el) => {
      const t = $(el).text().replace(/\s+/g, " ").trim();
      if (t && t.length < 120) raw_headings.push(t);
    });
  }

  return {
    base_url: base.toString(),
    pages,
    emails,
    phones,
    socials,
    raw_headings: Array.from(new Set(raw_headings)).slice(0, 40),
    errors,
  };
}
