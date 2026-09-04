import { contactPageUrls } from "@/lib/contactPageUrls";
import { discoverContactLinks } from "@/lib/discoverContactLinks";
import { extractEmailsFromHtml } from "@/lib/extractEmailsFromHtml";
import { fetchWebsiteHtml } from "@/lib/fetchWebsiteHtml";
import {
  createRenderedHtmlSession,
  type RenderedHtmlSession,
} from "@/services/enrichment/renderedHtmlFetch";

export interface ScrapedEmailCandidate {
  email: string;
  source: string;
}

function normalizePageUrl(url: string): string {
  return url.replace(/\/$/, "").toLowerCase();
}

function sourceLabelForUrl(url: string, homepage: string): string {
  return normalizePageUrl(url) === normalizePageUrl(homepage)
    ? "website_homepage"
    : `website_page:${url}`;
}

async function loadHtmlForUrl(
  url: string,
  renderedSession: RenderedHtmlSession | null,
): Promise<{ html: string | null; via: "http" | "playwright" | null }> {
  const httpHtml = await fetchWebsiteHtml(url);
  if (httpHtml) {
    const emails = extractEmailsFromHtml(httpHtml);
    const needsRender =
      emails.length === 0 &&
      (/__NEXT_DATA__|wix\.com|squarespace|webflow|react-root|id="app"/i.test(httpHtml) ||
        httpHtml.length < 1200);

    if (!needsRender) {
      return { html: httpHtml, via: "http" };
    }
  }

  if (renderedSession) {
    const rendered = await renderedSession.fetch(url);
    if (rendered) {
      return { html: rendered, via: "playwright" };
    }
  }

  return { html: httpHtml, via: httpHtml ? "http" : null };
}

export async function scrapeWebsiteEmailCandidates(input: {
  websiteUrl: string;
  maxPages?: number;
  maxCandidates?: number;
}): Promise<ScrapedEmailCandidate[]> {
  const maxPages = input.maxPages ?? 12;
  const maxCandidates = input.maxCandidates ?? 16;

  let origin: string;
  let homepage: string;
  try {
    const base = new URL(
      input.websiteUrl.startsWith("http") ? input.websiteUrl : `https://${input.websiteUrl}`,
    );
    origin = base.origin;
    homepage = base.toString();
  } catch {
    return [];
  }

  const queue = [...contactPageUrls(homepage)];
  const seen = new Set<string>();
  const candidates: ScrapedEmailCandidate[] = [];
  const renderedSession = await createRenderedHtmlSession();

  try {
    while (queue.length > 0 && seen.size < maxPages && candidates.length < maxCandidates) {
      const url = queue.shift()!;
      const key = normalizePageUrl(url);
      if (seen.has(key)) continue;
      seen.add(key);

      const { html } = await loadHtmlForUrl(url, renderedSession);
      if (!html) continue;

      if (normalizePageUrl(url) === normalizePageUrl(homepage)) {
        for (const link of discoverContactLinks(html, origin)) {
          const linkKey = normalizePageUrl(link);
          if (!seen.has(linkKey) && !queue.some((q) => normalizePageUrl(q) === linkKey)) {
            queue.push(link);
          }
        }
      }

      const source = sourceLabelForUrl(url, homepage);
      for (const email of extractEmailsFromHtml(html)) {
        candidates.push({ email, source });
        if (candidates.length >= maxCandidates) break;
      }
    }
  } finally {
    await renderedSession?.close();
  }

  return candidates;
}
