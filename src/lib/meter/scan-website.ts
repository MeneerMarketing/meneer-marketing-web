import * as cheerio from "cheerio";
import {
  applyMeterClientBoost,
  matchMeterClientBoost,
} from "@/lib/meter/client-boost";
import { buildMeterVerdict } from "@/lib/meter/verdicts";
import type {
  MeterScanResult,
  MeterTechnicalFinding,
  MeterFindingStatus,
} from "@/lib/meter/types";
import { normalizeMeterUrl } from "@/lib/meter/url-guard";

interface FetchResult {
  html: string;
  finalUrl: string;
}

interface ScanContext {
  html: string;
  finalUrl: string;
  $: cheerio.CheerioAPI;
  $full: cheerio.CheerioAPI;
  text: string;
  title: string;
  metaDesc: string;
  primaryHeading: string;
  viewport: boolean;
  https: boolean;
  htmlKb: number;
  imgCount: number;
  lazyImages: number;
  scriptCount: number;
  headScriptCount: number;
  navLinks: number;
  hasFontSignals: boolean;
  looksDated: boolean;
  hrefs: string;
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

function pushFinding(
  findings: MeterTechnicalFinding[],
  finding: MeterTechnicalFinding,
): void {
  findings.push(finding);
}

function statusFromPass(pass: boolean, warn?: boolean): MeterFindingStatus {
  if (pass) return "pass";
  if (warn) return "warn";
  return "fail";
}

function parseJsonLdTypes(html: string): string[] {
  const types = new Set<string>();
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    try {
      const parsed: unknown = JSON.parse(match[1]!.trim());
      const collect = (node: unknown) => {
        if (!node || typeof node !== "object") return;
        const record = node as Record<string, unknown>;
        if (typeof record["@type"] === "string") types.add(record["@type"]);
        if (Array.isArray(record["@type"])) {
          record["@type"].forEach((t) => {
            if (typeof t === "string") types.add(t);
          });
        }
        if (Array.isArray(record["@graph"])) record["@graph"].forEach(collect);
      };
      if (Array.isArray(parsed)) parsed.forEach(collect);
      else collect(parsed);
    } catch {
      /* invalid json-ld */
    }
  }
  return [...types];
}

function detectCms(html: string, hrefs: string): string | null {
  if (/wp-content|wordpress/i.test(html)) return "WordPress";
  if (/cdn\.shopify|myshopify/i.test(`${html} ${hrefs}`)) return "Shopify";
  if (/wixstatic|wix\.com/i.test(html)) return "Wix";
  if (/squarespace/i.test(html)) return "Squarespace";
  if (/webflow/i.test(html)) return "Webflow";
  if (/framerusercontent|framer\.com/i.test(html)) return "Framer";
  if (/next\/static|__next/i.test(html)) return "Next.js";
  return null;
}

function buildTechnicalFindings(ctx: ScanContext): MeterTechnicalFinding[] {
  const findings: MeterTechnicalFinding[] = [];
  const canonical = ctx.$('link[rel="canonical"]').attr("href")?.trim() ?? "";
  const robots = ctx.$('meta[name="robots"]').attr("content")?.trim() ?? "";
  const htmlLang = ctx.$("html").attr("lang")?.trim() ?? "";
  const charset =
    ctx.$("meta[charset]").attr("charset")?.trim() ??
    ctx.$('meta[http-equiv="Content-Type"]').attr("content")?.trim() ??
    "";
  const ogTitle = ctx.$('meta[property="og:title"]').attr("content")?.trim() ?? "";
  const ogImage = ctx.$('meta[property="og:image"]').attr("content")?.trim() ?? "";
  const twitterCard = ctx.$('meta[name="twitter:card"]').attr("content")?.trim() ?? "";
  const hreflangCount = ctx.$('link[rel="alternate"][hreflang]').length;
  const preloadCount = ctx.$('link[rel="preload"]').length;
  const stylesheetCount = ctx.$("link[rel='stylesheet'], link[rel=\"stylesheet\"]").length;
  const inlineStyleBytes = (ctx.html.match(/<style[\s\S]*?<\/style>/gi) ?? []).reduce(
    (sum, block) => sum + block.length,
    0,
  );
  const jqueryMatch = ctx.html.match(/jquery[.-]?(\d+\.\d+\.\d+)/i);
  const jsonLdTypes = parseJsonLdTypes(ctx.html);
  const cms = detectCms(ctx.html, ctx.hrefs);

  const images = ctx.$("img").toArray();
  const missingAlt = images.filter((el) => !(ctx.$(el).attr("alt") ?? "").trim()).length;
  const missingDimensions = images.filter((el) => {
    const $el = ctx.$(el);
    return !$el.attr("width") && !$el.attr("height") && !$el.attr("sizes");
  }).length;
  const modernFormats = images.filter((el) => {
    const src = `${ctx.$(el).attr("src") ?? ""} ${ctx.$(el).attr("srcset") ?? ""}`;
    return /\.(webp|avif)(\?|$)/i.test(src);
  }).length;
  const lazyRatio =
    ctx.imgCount > 0 ? Math.round((ctx.lazyImages / ctx.imgCount) * 100) : 0;

  const blockingFonts = /fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit\.net/i.test(
    ctx.html,
  );
  const syncHeadScripts = ctx.$full("head script:not([async]):not([defer])").length;

  pushFinding(findings, {
    category: "Transport",
    status: statusFromPass(ctx.https),
    label: ctx.https ? "TLS actief" : "Geen HTTPS",
    detail: ctx.https
      ? `Final URL op ${new URL(ctx.finalUrl).protocol}//${new URL(ctx.finalUrl).host}`
      : "Mixed content en trust-signalen lijden onder plain HTTP.",
  });

  pushFinding(findings, {
    category: "Markup",
    status: statusFromPass(Boolean(htmlLang)),
    label: htmlLang ? `html lang="${htmlLang}"` : "Geen document language",
    detail: htmlLang
      ? "Crawl hints en accessibility parsers weten welke taal ze lezen."
      : "Zonder lang mist de parser context voor screenreaders en locale targeting.",
  });

  pushFinding(findings, {
    category: "Markup",
    status: statusFromPass(Boolean(charset)),
    label: charset ? "Character encoding gedeclareerd" : "Charset niet expliciet",
    detail: charset
      ? charset.length > 12
        ? charset
        : `meta charset ${charset}`
      : "Encoding niet in de first KB gezet. Zeldzaam probleem, wel slordig.",
  });

  pushFinding(findings, {
    category: "Indexering",
    status: statusFromPass(ctx.title.length >= 25 && ctx.title.length <= 65, ctx.title.length > 0),
    label: `Title element · ${ctx.title.length} tekens`,
    detail:
      ctx.title.length === 0
        ? "Geen parsebare <title> in de HTML response."
        : ctx.title.length < 25
          ? `"${ctx.title.slice(0, 48)}${ctx.title.length > 48 ? "…" : ""}" · dun voor SERP real estate.`
          : ctx.title.length > 65
            ? "Waarschijnlijk afgekapt in Google. Trim of herstructureer."
            : `"${ctx.title.slice(0, 58)}${ctx.title.length > 58 ? "…" : ""}" · SERP-vriendelijk bereik.`,
  });

  pushFinding(findings, {
    category: "Indexering",
    status: statusFromPass(
      ctx.metaDesc.length >= 70 && ctx.metaDesc.length <= 165,
      ctx.metaDesc.length > 0,
    ),
    label: `Meta description · ${ctx.metaDesc.length} tekens`,
    detail:
      ctx.metaDesc.length === 0
        ? "Geen meta description. Google schrijft dan zelf een snippet."
        : ctx.metaDesc.length < 70
          ? "Te kort voor een overtuigende snippet in de SERP."
          : ctx.metaDesc.length > 165
            ? "Snippet wordt waarschijnlijk afgeknipt na ~155 tekens."
            : "Lengte past bij wat Google meestal toont.",
  });

  pushFinding(findings, {
    category: "Indexering",
    status: statusFromPass(Boolean(canonical)),
    label: canonical ? "Canonical tag aanwezig" : "Geen canonical",
    detail: canonical
      ? canonical.startsWith("http")
        ? canonical
        : `Relatief pad: ${canonical}`
      : "Duplicate URL-varianten kunnen authority splitsen zonder self-reference.",
  });

  pushFinding(findings, {
    category: "Indexering",
    status: robots
      ? /noindex/i.test(robots)
        ? "fail"
        : "pass"
      : "info",
    label: robots ? `robots: ${robots}` : "Geen robots meta (default indexeerbaar)",
    detail: robots
      ? /noindex/i.test(robots)
        ? "Pagina vraagt expliciet om niet geïndexeerd te worden."
        : "Index directives expliciet in de HTML response."
      : "Geen meta robots override. Crawlers volgen standaard index,follow gedrag.",
  });

  pushFinding(findings, {
    category: "Markup",
    status: statusFromPass(Boolean(ctx.primaryHeading)),
    label: ctx.primaryHeading
      ? "Primary heading in DOM"
      : "Geen primary heading in DOM",
    detail: ctx.primaryHeading
      ? `"${ctx.primaryHeading.slice(0, 72)}${ctx.primaryHeading.length > 72 ? "…" : ""}"`
      : "Document outline mist een duidelijke entry point voor parsers en screenreaders.",
  });

  pushFinding(findings, {
    category: "Markup",
    status: statusFromPass(ctx.viewport),
    label: ctx.viewport ? "Viewport meta aanwezig" : "Geen viewport meta",
    detail: ctx.viewport
      ? ctx.$('meta[name="viewport"]').attr("content") ?? "width=device-width"
      : "Mobile rendering valt terug op desktop scale. Conversion killer op telefoon.",
  });

  if (hreflangCount > 0) {
    pushFinding(findings, {
      category: "Indexering",
      status: "info",
      label: `hreflang alternates · ${hreflangCount}`,
      detail: "Meertalige of multi-region signalen in de head. Check reciprocity in Search Console.",
    });
  }

  pushFinding(findings, {
    category: "Structured data",
    status: statusFromPass(jsonLdTypes.length > 0),
    label:
      jsonLdTypes.length > 0
        ? `JSON-LD types · ${jsonLdTypes.slice(0, 4).join(", ")}${jsonLdTypes.length > 4 ? "…" : ""}`
        : "Geen JSON-LD gedetecteerd",
    detail:
      jsonLdTypes.length > 0
        ? `${jsonLdTypes.length} schema type(s) in application/ld+json blocks.`
        : "Geen structured data blocks. Rich results en entity clarity blijven liggen.",
  });

  if (ctx.$("[itemtype]").length > 0) {
    pushFinding(findings, {
      category: "Structured data",
      status: "info",
      label: `Microdata itemtypes · ${ctx.$("[itemtype]").length}`,
      detail: "Legacy markup naast of in plaats van JSON-LD. Niet fout, wel ouder patroon.",
    });
  }

  pushFinding(findings, {
    category: "Performance stack",
    status: statusFromPass(ctx.scriptCount <= 18, ctx.scriptCount <= 28),
    label: `Script tags · ${ctx.scriptCount} totaal`,
    detail: `${syncHeadScripts} sync in <head> zonder async/defer. Render-blocking risico op first paint.`,
  });

  pushFinding(findings, {
    category: "Performance stack",
    status: statusFromPass(ctx.htmlKb < 250, ctx.htmlKb < 420),
    label: `HTML payload · ${ctx.htmlKb} KB`,
    detail:
      ctx.htmlKb > 420
        ? "Zware first document. TTFB + parse tijd stapelen vóór CSS/JS zelfs start."
        : "Document size binnen normale range voor een marketing homepage.",
  });

  pushFinding(findings, {
    category: "Performance stack",
    status: statusFromPass(stylesheetCount <= 8, stylesheetCount <= 12),
    label: `Stylesheet requests · ${stylesheetCount}`,
    detail: `Inline CSS blocks ~${Math.round(inlineStyleBytes / 1024)} KB in de HTML. ${preloadCount} preload hint(s).`,
  });

  if (ctx.imgCount > 0) {
    pushFinding(findings, {
      category: "Performance stack",
      status: statusFromPass(lazyRatio >= 35, lazyRatio >= 15),
      label: `Image lazyload · ${ctx.lazyImages}/${ctx.imgCount} (${lazyRatio}%)`,
      detail: `${missingDimensions} img zonder width/height (CLS risico). ${modernFormats} modern format (webp/avif).`,
    });

    pushFinding(findings, {
      category: "Performance stack",
      status: statusFromPass(missingAlt <= ctx.imgCount * 0.15, missingAlt <= ctx.imgCount * 0.35),
      label: `Alt attributes · ${ctx.imgCount - missingAlt}/${ctx.imgCount} gevuld`,
      detail:
        missingAlt > 0
          ? `${missingAlt} afbeelding(en) zonder alt. Accessibility én image search lekken.`
          : "Alle img nodes hebben alt text in de DOM snapshot.",
    });
  }

  if (blockingFonts) {
    pushFinding(findings, {
      category: "Performance stack",
      status: "warn",
      label: "Extern font stack geladen",
      detail: "Google Fonts / Typekit in HTML. Check font-display, subsetting en preload strategy.",
    });
  }

  if (jqueryMatch) {
    pushFinding(findings, {
      category: "CMS & stack",
      status: "warn",
      label: `jQuery ${jqueryMatch[1]} gedetecteerd`,
      detail: "Legacy dependency in de render stack. Vaak teken van oud theme of plugin-bloat.",
    });
  }

  pushFinding(findings, {
    category: "CMS & stack",
    status: cms ? "info" : "pass",
    label: cms ? `Platform fingerprint · ${cms}` : "Geen bekend SaaS-template signatuur",
    detail: cms
      ? `HTML bevat ${cms}-typische asset paths of markers.`
      : "Custom of headless stack signaal. Geen Wix/Squarespace/Webflow smoke detected.",
  });

  pushFinding(findings, {
    category: "Conversie stack",
    status: statusFromPass(
      /boek|book|schedule|afspraak|reserveer|mindbody|gymmaster|wellnessliving|fresha|salonized|planity/i.test(
        `${ctx.text} ${ctx.hrefs}`,
      ),
    ),
    label: "Booking / scheduling stack",
    detail: /boek|book|schedule|afspraak|reserveer|mindbody|gymmaster|wellnessliving|fresha|salonized|planity/i.test(
      `${ctx.text} ${ctx.hrefs}`,
    )
      ? "Reserverings- of boekingsintegratie gevonden in links of copy."
      : "Geen herkenbaar online boekingspad in DOM snapshot.",
  });

  pushFinding(findings, {
    category: "Conversie stack",
    status: statusFromPass(/tel:|mailto:|whatsapp|wa\.me/i.test(`${ctx.text} ${ctx.hrefs}`)),
    label: "Direct contact hooks",
    detail: /tel:|mailto:|whatsapp|wa\.me/i.test(`${ctx.text} ${ctx.hrefs}`)
      ? "tel:, mailto: of WhatsApp deep link aanwezig."
      : "Geen click-to-call, mailto of WhatsApp in de gescande HTML.",
  });

  pushFinding(findings, {
    category: "Conversie stack",
    status: statusFromPass(ogTitle.length > 0 && ogImage.length > 0, ogTitle.length > 0),
    label: ogTitle ? "Open Graph tags" : "Geen Open Graph",
    detail:
      ogTitle && ogImage
        ? `og:title + og:image. Twitter card: ${twitterCard || "niet gezet"}.`
        : ogTitle
          ? "og:title zonder og:image. Social shares missen preview thumbnail."
          : "Social crawlers moeten zelf een preview bouwen. Slordig voor shares.",
  });

  pushFinding(findings, {
    category: "Markup",
    status: statusFromPass(ctx.navLinks >= 4),
    label: `Nav link nodes · ${ctx.navLinks}`,
    detail: "header/nav anchor count in DOM. Te weinig = dunne IA, te veel = ruis.",
  });

  if (ctx.looksDated) {
    pushFinding(findings, {
      category: "CMS & stack",
      status: "warn",
      label: "Verouderd copyright / jaartal signaal",
      detail: "HTML bevat oude jaartallen zonder recente update markers. Trust leak op homepage.",
    });
  }

  return findings;
}

function buildSignalLists(findings: MeterTechnicalFinding[]): {
  good: string[];
  bad: string[];
} {
  const good = findings
    .filter((f) => f.status === "pass")
    .slice(0, 6)
    .map((f) => f.label);
  const bad = findings
    .filter((f) => f.status === "fail" || f.status === "warn")
    .slice(0, 8)
    .map((f) => `${f.label} · ${f.detail.split(".")[0]}`);
  return { good, bad };
}

function scoreDesign(details: {
  https: boolean;
  viewport: boolean;
  imgCount: number;
  looksDated: boolean;
  hasFontSignals: boolean;
  modernImageRatio: number;
}): { value: number; hint: string } {
  let value = 42;
  if (details.https) value += 10;
  if (details.viewport) value += 14;
  if (details.imgCount >= 5) value += 8;
  else if (details.imgCount >= 2) value += 3;
  else value -= 10;
  if (details.hasFontSignals) value += 6;
  if (details.modernImageRatio >= 0.25) value += 5;
  if (details.looksDated) value -= 18;

  const hint =
    value >= 70
      ? "Visuele stack en responsive basis op orde."
      : details.looksDated
        ? "Verouderd design signaal in DOM en assets."
        : "First impression stack kan scherper.";

  return { value: clampScore(value), hint };
}

function scoreFindability(details: {
  title: string;
  metaDesc: string;
  primaryHeading: boolean;
  hasSchema: boolean;
  canonical: boolean;
  robotsOk: boolean;
}): { value: number; hint: string } {
  let value = 38;
  if (details.title.length > 10) value += 14;
  else if (details.title.length > 0) value += 4;
  else value -= 12;

  if (details.metaDesc.length > 50) value += 12;
  else if (details.metaDesc.length > 0) value += 4;
  else value -= 8;

  if (details.primaryHeading) value += 10;
  else value -= 10;

  if (details.hasSchema) value += 12;
  if (details.canonical) value += 6;
  if (!details.robotsOk) value -= 20;

  const hint =
    value >= 72
      ? "Indexeringssignalen en structured data staan stevig."
      : !details.primaryHeading
        ? "Document outline mist een primary entry point."
        : "SERP en crawl hints zijn dun of inconsistent.";

  return { value: clampScore(value), hint };
}

function scoreConversion(details: {
  hasCta: boolean;
  hasBooking: boolean;
  navLinks: number;
  hasContact: boolean;
  ogComplete: boolean;
}): { value: number; hint: string } {
  let value = 35;
  if (details.hasCta) value += 16;
  if (details.hasBooking) value += 18;
  if (details.hasContact) value += 8;
  if (details.ogComplete) value += 4;
  if (details.navLinks >= 5) value += 8;
  else if (details.navLinks >= 3) value += 3;
  else value -= 6;

  const hint =
    value >= 75
      ? "Conversie stack en contact hooks zichtbaar."
      : details.hasBooking
        ? "Boeking gevonden, rest van het pad kan scherper."
        : "Bezoeker moet zelf de volgende stap reverse-engineeren.";

  return { value: clampScore(value), hint };
}

function scoreSpeed(details: {
  htmlKb: number;
  scriptCount: number;
  imgCount: number;
  lazyImages: number;
  syncHeadScripts: number;
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

  if (details.syncHeadScripts > 6) value -= 8;
  if (details.imgCount > 24) value -= 8;
  if (details.lazyImages >= Math.max(2, details.imgCount * 0.35)) value += 6;

  const hint =
    value >= 72
      ? "Render stack relatief licht in HTML snapshot."
      : details.scriptCount > 25
        ? "Script count en blocking head tags drukken first paint."
        : "Performance stack laat winst liggen op LCP/INP.";

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

  if (!fetched) {
    const scores = [
      { label: "Design", value: 18, hint: "Site niet bereikbaar." },
      { label: "Vindbaarheid", value: 15, hint: "Geen HTML om te beoordelen." },
      { label: "Conversie", value: 14, hint: "Geen pagina, geen actie." },
      { label: "Snelheid", value: 12, hint: "Timeout of blok." },
    ];
    const total = 15;
    const { verdict, oneLiner } = buildMeterVerdict(total, scores, normalized.siteName);
    const technicalFindings: MeterTechnicalFinding[] = [
      {
        category: "Transport",
        status: "fail",
        label: "HTTP request timeout",
        detail: "Geen HTML response binnen 12 seconden. DNS, firewall of server down.",
      },
    ];

    const baseResult: MeterScanResult = {
      siteName: normalized.siteName,
      url: normalized.href,
      scores,
      total,
      verdict,
      oneLiner,
      signals: { good: [], bad: ["HTTP timeout · geen response binnen 12s"] },
      technicalFindings,
    };

    return clientRule ? applyMeterClientBoost(baseResult, clientRule) : baseResult;
  }

  const { html, finalUrl } = fetched;
  const $full = cheerio.load(html);
  const $ = cheerio.load(html);
  $("script, style, noscript").remove();

  const text = $("body").text().replace(/\s+/g, " ").toLowerCase();
  const title = $full("title").first().text().trim();
  const metaDesc = $full('meta[name="description"]').attr("content")?.trim() ?? "";
  const primaryHeading = $full("h1").first().text().trim();
  const viewport = Boolean($full('meta[name="viewport"]').attr("content"));
  const https = finalUrl.startsWith("https:");
  const canonical = Boolean($full('link[rel="canonical"]').attr("href")?.trim());
  const robotsMeta = $full('meta[name="robots"]').attr("content")?.trim() ?? "";
  const robotsOk = !/noindex/i.test(robotsMeta);
  const hasSchema =
    parseJsonLdTypes(html).length > 0 || $full("[itemtype]").length > 0;
  const hrefs = $full("a[href]")
    .map((_, el) => $full(el).attr("href") ?? "")
    .get()
    .join(" ");
  const hasBooking = /boek|book|schedule|afspraak|reserveer|mindbody|gymmaster|wellnessliving|fresha|salonized|planity/i.test(
    `${text} ${hrefs}`,
  );
  const hasCta = /boek|probeer|start|aanmelden|contact|plan|afspraak|offerte|bestel/i.test(text);
  const hasContact = /tel:|mailto:|whatsapp|wa\.me|bel (ons|mij)|neem contact/i.test(
    `${text} ${hrefs}`,
  );
  const ogTitle = $full('meta[property="og:title"]').attr("content")?.trim() ?? "";
  const ogImage = $full('meta[property="og:image"]').attr("content")?.trim() ?? "";
  const yearHints = html.match(/20(1[0-9]|2[0-3])/g) ?? [];
  const looksDated =
    yearHints.some((y) => Number(y) <= 2019) && !/2024|2025|2026|2027/.test(html);
  const imgCount = $full("img").length;
  const lazyImages = $full("img[loading='lazy'], img[data-src], img[data-lazy]").length;
  const scriptCount = $full("script").length;
  const headScriptCount = $full("head script").length;
  const syncHeadScripts = $full("head script:not([async]):not([defer])").length;
  const navLinks = $full("nav a, header a").length;
  const hasFontSignals = /font-family|@font-face|fonts\.googleapis|typekit|woff2/i.test(html);
  const htmlKb = Math.round(html.length / 1024);
  const modernFormats = $full("img")
    .toArray()
    .filter((el) => {
      const src = `${$full(el).attr("src") ?? ""} ${$full(el).attr("srcset") ?? ""}`;
      return /\.(webp|avif)(\?|$)/i.test(src);
    }).length;
  const modernImageRatio = imgCount > 0 ? modernFormats / imgCount : 0;

  const ctx: ScanContext = {
    html,
    finalUrl,
    $: $full,
    $full,
    text,
    title,
    metaDesc,
    primaryHeading,
    viewport,
    https,
    htmlKb,
    imgCount,
    lazyImages,
    scriptCount,
    headScriptCount,
    navLinks,
    hasFontSignals,
    looksDated,
    hrefs,
  };

  const technicalFindings = buildTechnicalFindings(ctx);
  const signals = buildSignalLists(technicalFindings);

  const design = scoreDesign({
    https,
    viewport,
    imgCount,
    looksDated,
    hasFontSignals,
    modernImageRatio,
  });
  const findability = scoreFindability({
    title,
    metaDesc,
    primaryHeading: Boolean(primaryHeading),
    hasSchema,
    canonical,
    robotsOk,
  });
  const conversion = scoreConversion({
    hasCta,
    hasBooking,
    navLinks,
    hasContact,
    ogComplete: ogTitle.length > 0 && ogImage.length > 0,
  });
  const speed = scoreSpeed({
    htmlKb,
    scriptCount,
    imgCount,
    lazyImages,
    syncHeadScripts,
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
    signals,
    technicalFindings,
  };

  return clientRule ? applyMeterClientBoost(baseResult, clientRule) : baseResult;
}
