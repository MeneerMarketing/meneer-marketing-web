import { clampWords, plainText } from "@/lib/text";
import type { StudioTeamMember } from "@/types/studio";

const ABOUT_PATHS = [
  "/overmij",
  "/over-mij",
  "/about",
  "/over-ons",
  "/team",
  "/about-us",
  "/wie-zijn-wij",
] as const;

function normalizeWebsiteOrigin(websiteUrl: string): string | null {
  try {
    const parsed = new URL(
      websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`
    );
    return parsed.origin;
  } catch {
    return null;
  }
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scorePortraitUrl(url: string): number {
  const lower = decodeURIComponent(url).toLowerCase();
  let score = 0;
  if (/\.(jpe?g|webp)(\?|$)/i.test(lower)) score += 30;
  if (/squarespace-cdn|wixstatic|onewebmedia|usercontent\.one/.test(lower)) score += 12;
  if (/format=1500w|format=1000w|w=\d{3,4}/.test(lower)) score += 10;
  if (/logo|favicon|icon|tiktok|instagram|facebook|badge|emoji|spacer|1x1/.test(lower)) {
    score -= 80;
  }
  if (/\/nou\b|nou\+|%28%29/.test(lower)) score -= 60;
  if (/portrait|team|about|over|founder|trainer|instructor|headshot/.test(lower)) score += 18;
  return score;
}

function pickPortraitFromHtml(html: string, pageUrl: string): string | null {
  const ranked = new Map<string, number>();

  const push = (raw: string | undefined) => {
    if (!raw?.trim()) return;
    try {
      const absolute = new URL(raw.trim(), pageUrl).href;
      if (!/^https?:\/\//i.test(absolute)) return;
      const score = scorePortraitUrl(absolute);
      if (score <= 0) return;
      ranked.set(absolute, Math.max(ranked.get(absolute) ?? 0, score));
    } catch {
      /* ignore */
    }
  };

  for (const match of html.matchAll(
    /(?:src|data-src|data-image|data-srcset)="([^"]+)"/gi
  )) {
    push(match[1]);
    const srcset = match[1].split(",").map((part) => part.trim().split(/\s+/)[0]);
    for (const part of srcset) push(part);
  }

  for (const match of html.matchAll(
    /https?:\/\/images\.squarespace-cdn\.com\/content\/v1\/[^"'\s)]+\.(?:jpe?g|webp|png)(?:\?[^"'\s)]*)?/gi
  )) {
    push(match[0]);
  }

  const best = [...ranked.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!best) return null;

  const [url] = best;
  if (/squarespace-cdn/i.test(url) && !/format=\d+w/.test(url)) {
    return `${url.split("?")[0]}?format=1500w`;
  }
  return url;
}

function extractFounderName(html: string): string | null {
  const text = stripTags(html);
  const match =
    text.match(/(?:hi,?\s+)?ik ben\s+([A-ZÀ-ÿ][a-zà-ÿ'-]+)/i) ??
    text.match(/(?:welkom,?\s+)?ik ben\s+([A-ZÀ-ÿ][a-zà-ÿ'-]+)/i);
  return match?.[1] ? plainText(match[1]) : null;
}

function extractFounderRole(html: string): string {
  const text = stripTags(html).toLowerCase();
  if (/oprichtster/.test(text)) return "Oprichtster & hoofdtrainer";
  if (/oprichter/.test(text)) return "Oprichter & hoofdtrainer";
  if (/eigenaar|eigenares/.test(text)) return "Eigenaar & hoofdtrainer";
  return "Founder & hoofdtrainer";
}

function extractFounderBio(html: string, studioName: string): string {
  const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => plainText(stripTags(match[1] ?? "")))
    .filter((paragraph) => paragraph.length >= 48)
    .filter(
      (paragraph) =>
        !/cookie|doorgaan naar inhoud|menu openen|algemene voorwaarden/i.test(
          paragraph
        )
    )
    .filter(
      (paragraph) =>
        /pilates|studio|reformer|ondernemer|opricht|train|beweg/i.test(paragraph) ||
        paragraph.toLowerCase().includes("ik ben")
    );

  const bio =
    paragraphs.slice(0, 2).join(" ") ||
    paragraphs[0] ||
    `${studioName} is opgericht vanuit een persoonlijke passie voor beweging, techniek en een rustige studio-ervaring.`;

  return clampWords(bio, 38);
}

export function extractTeamMemberFromAboutHtml(
  html: string,
  pageUrl: string,
  studioName: string
): Omit<StudioTeamMember, "id"> | null {
  const imageUrl = pickPortraitFromHtml(html, pageUrl);
  const name = extractFounderName(html);
  if (!imageUrl || !name) return null;

  return {
    name,
    role: extractFounderRole(html),
    bio: extractFounderBio(html, studioName),
    image_url: imageUrl,
  };
}

export async function fetchWebsiteTeamMember(
  websiteUrl: string,
  studioName: string
): Promise<StudioTeamMember | null> {
  const origin = normalizeWebsiteOrigin(websiteUrl);
  if (!origin) return null;

  for (const path of ABOUT_PATHS) {
    try {
      const pageUrl = `${origin}${path}`;
      const response = await fetch(pageUrl, {
        signal: AbortSignal.timeout(8_000),
        headers: { "User-Agent": "MeneerMarketing-Preview/1.0" },
      });
      if (!response.ok) continue;

      const html = await response.text();
      const member = extractTeamMemberFromAboutHtml(html, pageUrl, studioName);
      if (!member) continue;

      return {
        id: `website-team-${path.replace(/\//g, "-")}`,
        ...member,
      };
    } catch {
      continue;
    }
  }

  return null;
}
