import * as cheerio from "cheerio";

export interface WebsiteOpportunityResult {
  website_quality_score: number;
  website_opportunity_score: number;
  signals: {
    positives: string[];
    negatives: string[];
  };
  details: Record<string, boolean | string | number | null>;
}

async function fetchHtml(url: string, timeoutMs: number): Promise<{ html: string; finalUrl: string } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "MeneerMarketing-LocalGrowthEngine/1.0 (+opportunity-scan)",
        Accept: "text/html",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = await res.text();
    return { html, finalUrl: res.url };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Cheap deterministic website quality + opportunity scan.
 * High opportunity = strong business case for a better site (low quality).
 */
export async function scanWebsiteOpportunity(
  websiteUrl: string | null,
  options?: { timeoutMs?: number; hasProfessionalBrand?: boolean }
): Promise<WebsiteOpportunityResult> {
  const positives: string[] = [];
  const negatives: string[] = [];
  const details: WebsiteOpportunityResult["details"] = {};

  if (!websiteUrl) {
    return {
      website_quality_score: 10,
      website_opportunity_score: 85,
      signals: {
        positives: ["Geen bruikbare website → hoge opportunity"],
        negatives: ["Geen website"],
      },
      details: { has_website: false },
    };
  }

  const timeoutMs = options?.timeoutMs ?? Number(process.env.PREVIEW_TIMEOUT_MS ?? 12000);
  const normalized = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;
  const fetched = await fetchHtml(normalized, timeoutMs);

  if (!fetched) {
    negatives.push("Website niet bereikbaar");
    return {
      website_quality_score: 15,
      website_opportunity_score: 80,
      signals: { positives: ["Onbereikbare site = opportunity"], negatives },
      details: { reachable: false },
    };
  }

  const { html, finalUrl } = fetched;
  const $ = cheerio.load(html);
  $("script, style, noscript").remove();
  const text = $("body").text().replace(/\s+/g, " ").toLowerCase();
  const title = $("title").first().text().trim();
  const metaDesc = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const h1 = $("h1").first().text().trim();
  const viewport = $('meta[name="viewport"]').attr("content");
  const https = finalUrl.startsWith("https:");
  const hasSchema =
    $('script[type="application/ld+json"]').length > 0 ||
    $("[itemtype]").length > 0;
  const hasBooking = /boek|book|schedule|afspraak|reserveer|mindbody|gymmaster|wellnessliving|fresha/i.test(
    `${text} ${$("a[href]").map((_, el) => $(el).attr("href")).get().join(" ")}`
  );
  const hasCta = /boek|probeer|start|aanmelden|contact|plan/i.test(text);
  const hasLessons = /les|class|reformer|mat pilates|aanbod|rooster/i.test(text);
  const yearHints = html.match(/20(1[0-9]|2[0-3])/g) ?? [];
  const looksDated = yearHints.some((y) => Number(y) <= 2019) && !/2024|2025|2026/.test(html);
  const imgCount = $("img").length;
  const navLinks = $("nav a, header a").length;

  let quality = 40;
  details.has_website = true;
  details.https = https;
  details.viewport = Boolean(viewport);
  details.title = title || null;
  details.meta_description = metaDesc ? metaDesc.slice(0, 160) : null;
  details.h1 = h1 || null;
  details.schema = hasSchema;
  details.booking = hasBooking;
  details.cta = hasCta;
  details.lessons = hasLessons;

  if (https) {
    quality += 8;
    positives.push("HTTPS");
  } else {
    quality -= 15;
    negatives.push("Geen HTTPS");
  }

  if (viewport) {
    quality += 10;
    positives.push("Viewport/mobile meta aanwezig");
  } else {
    quality -= 12;
    negatives.push("Geen viewport meta (zwak mobile signaal)");
  }

  if (title && title.length > 8) {
    quality += 6;
    positives.push("Title aanwezig");
  } else {
    quality -= 8;
    negatives.push("Zwakke of ontbrekende title");
  }

  if (metaDesc && metaDesc.length > 40) {
    quality += 5;
    positives.push("Meta description aanwezig");
  } else {
    quality -= 6;
    negatives.push("Geen bruikbare meta description");
  }

  if (h1) {
    quality += 5;
    positives.push("H1 aanwezig");
  } else {
    quality -= 5;
    negatives.push("Geen H1");
  }

  if (hasSchema) {
    quality += 4;
    positives.push("Structured data signaal");
  } else {
    negatives.push("Geen structured data gevonden");
  }

  if (hasBooking) {
    quality += 8;
    positives.push("Boeking/CTA pad gevonden");
  } else {
    quality -= 4;
    negatives.push("Geen duidelijke online booking");
  }

  if (hasCta) quality += 4;
  if (hasLessons) {
    quality += 5;
    positives.push("Lessen/aanbod zichtbaar");
  } else {
    quality -= 6;
    negatives.push("Lessen/aanbod weinig zichtbaar");
  }

  if (looksDated) {
    quality -= 10;
    negatives.push("Design/content lijkt verouderd");
  }

  if (imgCount < 3) {
    quality -= 6;
    negatives.push("Weinig beeldmateriaal");
  } else if (imgCount >= 8) {
    quality += 3;
  }

  if (navLinks < 3) {
    quality -= 4;
    negatives.push("Dunne informatiearchitectuur");
  }

  if (options?.hasProfessionalBrand && quality < 70) {
    positives.push("Professionele branding bij matige site → opportunity");
  }

  quality = Math.max(5, Math.min(95, quality));
  // Opportunity is inverse of quality, with a floor/ceiling for commercial usefulness
  const opportunity = Math.max(15, Math.min(95, Math.round(100 - quality * 0.85)));

  if (opportunity >= 70) positives.push("Duidelijke website-gap (hoge opportunity)");

  return {
    website_quality_score: quality,
    website_opportunity_score: opportunity,
    signals: { positives, negatives },
    details,
  };
}
