import * as cheerio from "cheerio";
import {
  applyMeterClientBoost,
  matchMeterClientBoost,
} from "@/lib/meter/client-boost";
import { buildMeterVerdict } from "@/lib/meter/verdicts";
import type { MeterScanResult } from "@/lib/meter/types";
import { normalizeMeterUrl } from "@/lib/meter/url-guard";

interface FetchResult {
  html: string;
  finalUrl: string;
}

async function fetchHtml(url: string, timeoutMs: number): Promise<FetchResult | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "MeneerMarketing-Meter/1.0 (+https://meneermarketing.nl/meter)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = await res.text();
    if (html.length > 1_500_000) return null;
    return { html, finalUrl: res.url };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function clampScore(value: number): number {
  return Math.max(8, Math.min(96, Math.round(value)));
}

function scoreDesign(details: {
  https: boolean;
  viewport: boolean;
  imgCount: number;
  looksDated: boolean;
  hasFontSignals: boolean;
}): { value: number; hint: string } {
  let value = 42;
  if (details.https) value += 10;
  if (details.viewport) value += 14;
  if (details.imgCount >= 5) value += 8;
  else if (details.imgCount >= 2) value += 3;
  else value -= 10;
  if (details.hasFontSignals) value += 6;
  if (details.looksDated) value -= 18;

  const hint =
    value >= 70
      ? "Visuele basis klopt redelijk."
      : details.looksDated
        ? "Design voelt achtergelopen."
        : "Visuele eerste indruk kan scherper.";

  return { value: clampScore(value), hint };
}

function scoreFindability(details: {
  title: string;
  metaDesc: string;
  h1: string;
  hasSchema: boolean;
}): { value: number; hint: string } {
  let value = 38;
  if (details.title.length > 10) value += 14;
  else if (details.title.length > 0) value += 4;
  else value -= 12;

  if (details.metaDesc.length > 50) value += 12;
  else if (details.metaDesc.length > 0) value += 4;
  else value -= 8;

  if (details.h1.length > 0) value += 10;
  else value -= 10;

  if (details.hasSchema) value += 12;

  const hint =
    value >= 72
      ? "SEO-basis staat op de kaart."
      : !details.h1
        ? "Geen duidelijke H1 gevonden."
        : "Vindbaarheidssignalen zijn dun.";

  return { value: clampScore(value), hint };
}

function scoreConversion(details: {
  hasCta: boolean;
  hasBooking: boolean;
  navLinks: number;
  hasContact: boolean;
}): { value: number; hint: string } {
  let value = 35;
  if (details.hasCta) value += 16;
  if (details.hasBooking) value += 18;
  if (details.hasContact) value += 8;
  if (details.navLinks >= 5) value += 8;
  else if (details.navLinks >= 3) value += 3;
  else value -= 6;

  const hint =
    value >= 75
      ? "Conversiepad is zichtbaar."
      : details.hasBooking
        ? "Boeking gevonden, rest kan scherper."
        : "Bezoekers moeten zelf de volgende stap zoeken.";

  return { value: clampScore(value), hint };
}

function scoreSpeed(details: {
  htmlKb: number;
  scriptCount: number;
  imgCount: number;
  lazyImages: number;
  reachable: boolean;
}): { value: number; hint: string } {
  if (!details.reachable) {
    return { value: 12, hint: "Site was niet bereikbaar." };
  }

  let value = 58;
  if (details.htmlKb > 450) value -= 18;
  else if (details.htmlKb > 250) value -= 10;
  else if (details.htmlKb < 120) value += 6;

  if (details.scriptCount > 35) value -= 16;
  else if (details.scriptCount > 18) value -= 8;
  else if (details.scriptCount < 10) value += 4;

  if (details.imgCount > 24) value -= 8;
  if (details.lazyImages >= Math.max(2, details.imgCount * 0.35)) value += 6;

  const hint =
    value >= 72
      ? "Technische ballast valt mee."
      : details.scriptCount > 25
        ? "Veel scripts. Dat voelt traag."
        : "Snelheid kan bezoekers kosten.";

  return { value: clampScore(value), hint };
}

export async function scanWebsiteForMeter(
  rawUrl: string,
  options?: { timeoutMs?: number },
): Promise<MeterScanResult | { error: string }> {
  const normalized = normalizeMeterUrl(rawUrl);
  if (!normalized) {
    return { error: "Dat is geen geldige URL. Probeer bijvoorbeeld jouwstudio.nl." };
  }

  const timeoutMs = options?.timeoutMs ?? 12_000;
  const clientRule = matchMeterClientBoost(normalized.href, normalized.siteName);
  const fetched = await fetchHtml(normalized.href, timeoutMs);

  const good: string[] = [];
  const bad: string[] = [];

  if (!fetched) {
    const scores = [
      { label: "Design", value: 18, hint: "Site niet bereikbaar." },
      { label: "Vindbaarheid", value: 15, hint: "Geen HTML om te beoordelen." },
      { label: "Conversie", value: 14, hint: "Geen pagina, geen actie." },
      { label: "Snelheid", value: 12, hint: "Timeout of blok." },
    ];
    const total = 15;
    const { verdict, oneLiner } = buildMeterVerdict(total, scores, normalized.siteName);

    const baseResult: MeterScanResult = {
      siteName: normalized.siteName,
      url: normalized.href,
      scores,
      total,
      verdict,
      oneLiner,
      signals: { good: [], bad: ["Website niet bereikbaar binnen 12 seconden."] },
    };

    return clientRule ? applyMeterClientBoost(baseResult, clientRule) : baseResult;
  }

  const { html, finalUrl } = fetched;
  const $ = cheerio.load(html);
  $("script, style, noscript").remove();

  const text = $("body").text().replace(/\s+/g, " ").toLowerCase();
  const title = $("title").first().text().trim();
  const metaDesc = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const h1 = $("h1").first().text().trim();
  const viewport = Boolean($('meta[name="viewport"]').attr("content"));
  const https = finalUrl.startsWith("https:");
  const hasSchema =
    $('script[type="application/ld+json"]').length > 0 || $("[itemtype]").length > 0;
  const hrefs = $("a[href]")
    .map((_, el) => $(el).attr("href") ?? "")
    .get()
    .join(" ");
  const hasBooking = /boek|book|schedule|afspraak|reserveer|mindbody|gymmaster|wellnessliving|fresha|salonized|planity/i.test(
    `${text} ${hrefs}`,
  );
  const hasCta = /boek|probeer|start|aanmelden|contact|plan|afspraak|offerte|bestel/i.test(text);
  const hasContact = /tel:|mailto:|whatsapp|bel (ons|mij)|neem contact/i.test(`${text} ${hrefs}`);
  const yearHints = html.match(/20(1[0-9]|2[0-3])/g) ?? [];
  const looksDated =
    yearHints.some((y) => Number(y) <= 2019) && !/2024|2025|2026|2027/.test(html);
  const imgCount = $("img").length;
  const lazyImages = $("img[loading='lazy'], img[data-src], img[data-lazy]").length;
  const scriptCount = cheerio.load(html)("script").length;
  const navLinks = $("nav a, header a").length;
  const hasFontSignals = /font-family|@font-face|fonts\.googleapis|typekit|woff2/i.test(html);
  const htmlKb = Math.round(html.length / 1024);

  if (https) good.push("HTTPS actief");
  else bad.push("Geen HTTPS");
  if (viewport) good.push("Mobile viewport aanwezig");
  else bad.push("Geen viewport meta");
  if (title.length > 8) good.push("Title tag gevonden");
  else bad.push("Zwakke title");
  if (h1) good.push("H1 aanwezig");
  else bad.push("Geen H1");
  if (hasSchema) good.push("Structured data signaal");
  if (hasBooking) good.push("Online boeking pad gevonden");
  else bad.push("Geen duidelijke booking");
  if (hasCta) good.push("Actie-taal op de pagina");
  if (looksDated) bad.push("Verouderd design signaal");

  const design = scoreDesign({ https, viewport, imgCount, looksDated, hasFontSignals });
  const findability = scoreFindability({ title, metaDesc, h1, hasSchema });
  const conversion = scoreConversion({ hasCta, hasBooking, navLinks, hasContact });
  const speed = scoreSpeed({
    htmlKb,
    scriptCount,
    imgCount,
    lazyImages,
    reachable: true,
  });

  const scores = [
    { label: "Design", ...design },
    { label: "Vindbaarheid", ...findability },
    { label: "Conversie", ...conversion },
    { label: "Snelheid", ...speed },
  ];

  const total = clampScore(
    Math.round(scores.reduce((sum, axis) => sum + axis.value, 0) / scores.length),
  );

  const { verdict, oneLiner } = buildMeterVerdict(total, scores, normalized.siteName);

  const baseResult: MeterScanResult = {
    siteName: normalized.siteName,
    url: finalUrl,
    scores,
    total,
    verdict,
    oneLiner,
    signals: { good, bad },
  };

  return clientRule ? applyMeterClientBoost(baseResult, clientRule) : baseResult;
}
