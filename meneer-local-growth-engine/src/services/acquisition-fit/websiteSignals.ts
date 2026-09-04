import * as cheerio from "cheerio";

/**
 * Deterministic website analysis for the website transformation layer (M8.3).
 *
 * The original opportunity scan only looked at meta tags, HTTPS and the word
 * "boek". Every template builder ships those, so a 2013 Wix site and a 2025
 * Framer site both scored in the nineties. This module reads the signals that
 * actually separate a dated site from a modern one: platform era, layout
 * technique, responsive image handling, CSS capabilities, booking funnel and
 * usable brand assets.
 */

export type PlatformEra = "MODERN" | "CURRENT" | "AGING" | "DATED" | "UNKNOWN";

export interface DetectedPlatform {
  name: string;
  era: PlatformEra;
  evidence: string;
}

export interface WebsiteSignalReport {
  reachable: boolean;
  final_url: string | null;
  https: boolean;
  status_code: number | null;
  platform: DetectedPlatform | null;
  /** 0-100, higher = more contemporary craft */
  modernity_score: number;
  /** 0-100, higher = better current website */
  website_quality_score: number;
  /** 0-100, higher = more room for a redesign */
  website_opportunity_score: number;
  /** 0-100, higher = weaker booking funnel = more room */
  booking_opportunity_score: number;
  /** 0-100, higher = more usable material for a new site */
  brand_asset_usability_score: number;
  booking: {
    platforms: string[];
    booking_link_in_nav: boolean;
    trial_class_cta: boolean;
    schedule_visible: boolean;
    booking_anywhere: boolean;
    contact_only: boolean;
  };
  brand: {
    logo: boolean;
    own_images: number;
    total_images: number;
    descriptive_alt_ratio: number;
    studio_imagery: boolean;
    team_imagery: boolean;
    reformer_imagery: boolean;
    instagram: boolean;
    declared_colors: string[];
    webfonts: string[];
  };
  technical: {
    viewport: boolean;
    title: string | null;
    meta_description: string | null;
    h1: string | null;
    structured_data: boolean;
    open_graph: boolean;
    responsive_images: boolean;
    lazy_loading: boolean;
    modern_image_formats: boolean;
    css_custom_properties: boolean;
    modern_layout_css: boolean;
    fluid_typography: boolean;
    table_layout: boolean;
    legacy_html: boolean;
    legacy_jquery: boolean;
    fixed_width_layout: boolean;
    flash_or_embed: boolean;
    stale_copyright_year: number | null;
    html_bytes: number;
    image_count: number;
    nav_links: number;
    stylesheets_read: number;
  };
  positives: string[];
  negatives: string[];
}

interface FetchedDoc {
  html: string;
  finalUrl: string;
  status: number;
}

const UA =
  "MeneerMarketing-LocalGrowthEngine/1.0 (+website-transformation-scan)";

async function fetchDoc(url: string, timeoutMs: number): Promise<FetchedDoc | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": UA, Accept: "text/html,*/*" },
      redirect: "follow",
    });
    const html = await res.text();
    if (!res.ok && !html) return null;
    return { html, finalUrl: res.url || url, status: res.status };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url: string, timeoutMs: number, maxBytes = 180_000): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": UA },
      redirect: "follow",
    });
    if (!res.ok) return "";
    const text = await res.text();
    return text.slice(0, maxBytes);
  } catch {
    return "";
  } finally {
    clearTimeout(timer);
  }
}

const BOOKING_PLATFORMS: Array<[RegExp, string]> = [
  [/momoyoga\.com/i, "Momoyoga"],
  [/eversports\.(nl|com|de|be)/i, "Eversports"],
  [/bsport\.io/i, "bsport"],
  [/virtuagym\.com|virtuagym\.nl/i, "Virtuagym"],
  [/mindbodyonline\.com|mindbody\.io/i, "Mindbody"],
  [/fitmanager\.com|fitmanager\.nl/i, "Fitmanager"],
  [/wellnessliving\.com/i, "WellnessLiving"],
  [/gymly\.io/i, "Gymly"],
  [/ubindi\.com/i, "Ubindi"],
  [/fresha\.com/i, "Fresha"],
  [/treatwell\.nl/i, "Treatwell"],
  [/salonized\.com/i, "Salonized"],
  [/calendly\.com/i, "Calendly"],
  [/supersaas\.nl|supersaas\.com/i, "SuperSaaS"],
  [/planningpme|reservio\.com|bookeo\.com|appointy\.com/i, "Booking tool"],
  [/sportbit|trainin\.app|sportivity/i, "Sportbit/Trainin"],
];

const PLATFORM_FINGERPRINTS: Array<[RegExp, string, PlatformEra]> = [
  [/framer\.com|data-framer|__framer/i, "Framer", "MODERN"],
  [/\/_next\/static|__NEXT_DATA__/i, "Next.js", "MODERN"],
  [/__NUXT__|\/_nuxt\//i, "Nuxt", "MODERN"],
  [/webflow\.js|w-webflow|data-wf-page/i, "Webflow", "MODERN"],
  [/wixstatic\.com\/.*wix-studio|thunderbolt/i, "Wix Studio", "CURRENT"],
  [/squarespace\.com|static1\.squarespace/i, "Squarespace", "CURRENT"],
  [/cdn\.shopify\.com/i, "Shopify", "CURRENT"],
  [/canva\.site|canva-site/i, "Canva Sites", "AGING"],
  [/elementor-|elementor\/assets/i, "WordPress + Elementor", "CURRENT"],
  [/\/wp-content\/themes\/(divi|Divi)/i, "WordPress + Divi", "AGING"],
  [/wp-content|wp-includes/i, "WordPress", "AGING"],
  [/static\.parastorage\.com|wix\.com|wixsite/i, "Wix (klassiek)", "AGING"],
  [/jimdo|jimstatic/i, "Jimdo", "DATED"],
  [/weebly\.com|weeblycloud/i, "Weebly", "DATED"],
  [/joomla|com_content/i, "Joomla", "DATED"],
  [/drupal\.js|sites\/all\/modules/i, "Drupal (legacy)", "DATED"],
  [/mijndomein|strato\.nl\/apps|homestead/i, "Hosting website builder", "DATED"],
  [/frontpage|adobe golive|microsoft word/i, "Legacy HTML editor", "DATED"],
];

function detectPlatform(html: string): DetectedPlatform | null {
  for (const [pattern, name, era] of PLATFORM_FINGERPRINTS) {
    const match = html.match(pattern);
    if (match) {
      return { name, era, evidence: match[0].slice(0, 60) };
    }
  }
  return null;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export async function analyzeWebsiteSignals(
  websiteUrl: string | null,
  options?: { timeoutMs?: number; googleLogo?: string | null; googleImage?: string | null }
): Promise<WebsiteSignalReport> {
  const timeoutMs = options?.timeoutMs ?? Number(process.env.PREVIEW_TIMEOUT_MS ?? 12000);
  const positives: string[] = [];
  const negatives: string[] = [];

  const empty: WebsiteSignalReport = {
    reachable: false,
    final_url: null,
    https: false,
    status_code: null,
    platform: null,
    modernity_score: 10,
    website_quality_score: 10,
    website_opportunity_score: 88,
    booking_opportunity_score: 90,
    brand_asset_usability_score: options?.googleImage || options?.googleLogo ? 35 : 20,
    booking: {
      platforms: [],
      booking_link_in_nav: false,
      trial_class_cta: false,
      schedule_visible: false,
      booking_anywhere: false,
      contact_only: false,
    },
    brand: {
      logo: Boolean(options?.googleLogo),
      own_images: 0,
      total_images: 0,
      descriptive_alt_ratio: 0,
      studio_imagery: false,
      team_imagery: false,
      reformer_imagery: false,
      instagram: false,
      declared_colors: [],
      webfonts: [],
    },
    technical: {
      viewport: false,
      title: null,
      meta_description: null,
      h1: null,
      structured_data: false,
      open_graph: false,
      responsive_images: false,
      lazy_loading: false,
      modern_image_formats: false,
      css_custom_properties: false,
      modern_layout_css: false,
      fluid_typography: false,
      table_layout: false,
      legacy_html: false,
      legacy_jquery: false,
      fixed_width_layout: false,
      flash_or_embed: false,
      stale_copyright_year: null,
      html_bytes: 0,
      image_count: 0,
      nav_links: 0,
      stylesheets_read: 0,
    },
    positives: [],
    negatives: [],
  };

  if (!websiteUrl) {
    return {
      ...empty,
      negatives: ["Geen website gevonden"],
      positives: ["Zonder site is een volledig nieuwe site de enige stap"],
    };
  }

  const normalized = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;
  const doc = await fetchDoc(normalized, timeoutMs);
  if (!doc || !doc.html) {
    return {
      ...empty,
      website_quality_score: 15,
      website_opportunity_score: 82,
      negatives: ["Website niet bereikbaar of leeg"],
    };
  }

  const { html, finalUrl, status } = doc;
  const $ = cheerio.load(html);
  const siteHost = hostOf(finalUrl);
  const https = finalUrl.startsWith("https:");

  const headHtml = $("head").html() ?? "";
  const scriptSrcs = $("script[src]")
    .map((_, el) => $(el).attr("src") ?? "")
    .get()
    .join(" ");
  const inlineStyles = $("style")
    .map((_, el) => $(el).html() ?? "")
    .get()
    .join("\n");

  // Read up to two same-origin stylesheets: the strongest modernity signal
  // lives in the CSS, not in the markup.
  const cssHrefs = $('link[rel="stylesheet"][href]')
    .map((_, el) => $(el).attr("href") ?? "")
    .get()
    .filter(Boolean)
    .slice(0, 2)
    .map((href) => {
      try {
        return new URL(href, finalUrl).toString();
      } catch {
        return "";
      }
    })
    .filter(Boolean);

  const cssTexts = await Promise.all(cssHrefs.map((href) => fetchText(href, timeoutMs)));
  const css = [inlineStyles, ...cssTexts].join("\n");
  const stylesheetsRead = cssTexts.filter((t) => t.length > 0).length;

  const $clone = cheerio.load(html);
  $clone("script, style, noscript").remove();
  const text = $clone("body").text().replace(/\s+/g, " ").toLowerCase();

  const title = $("title").first().text().trim() || null;
  const metaDesc = $('meta[name="description"]').attr("content")?.trim() || null;
  const h1 = $("h1").first().text().trim() || null;
  const viewport = Boolean($('meta[name="viewport"]').attr("content"));
  const structuredData =
    $('script[type="application/ld+json"]').length > 0 || $("[itemtype]").length > 0;
  const openGraph = $('meta[property^="og:"]').length > 0;

  const images = $("img");
  const imageCount = images.length;
  const srcsetCount = $("img[srcset], picture source[srcset]").length;
  const lazyCount = $('img[loading="lazy"]').length;
  const modernFormats = /\.(webp|avif)(\?|$|")/i.test(html);

  const cssCustomProps = /--[a-z0-9-]+\s*:/i.test(css);
  const modernLayout = /display\s*:\s*(grid|flex)/i.test(css) || /grid-template/i.test(css);
  const fluidType = /clamp\(|min\(|max\(|aspect-ratio\s*:/i.test(css);

  const tableLayout =
    $("table").filter((_, el) => {
      const $el = $(el);
      return (
        Boolean($el.attr("width")) ||
        Boolean($el.attr("cellpadding")) ||
        Boolean($el.attr("border")) ||
        $el.find("table").length > 0
      );
    }).length > 0;

  const legacyHtml =
    $("font, center, marquee").length > 0 ||
    $("[bgcolor], [align]").length > 3 ||
    /<frameset|<iframe[^>]+frameborder="1"/i.test(html);

  const jqueryMatch = html.match(/jquery[.-]?(\d+)\.(\d+)(\.\d+)?(\.min)?\.js/i);
  const legacyJquery = Boolean(
    (jqueryMatch && Number(jqueryMatch[1]) < 3) || /jquery-migrate/i.test(scriptSrcs)
  );

  // Only a hard `width` counts. `max-width: 1100px` is standard modern practice.
  const fixedWidth = /(?<![a-z-])width\s*:\s*(9[0-9]{2}|1000|1024|1100)px/i.test(css);
  const flashOrEmbed = $("embed, object[type*='flash']").length > 0;

  const yearMatches = (html.match(/©\s*(20\d{2})|copyright[^0-9]{0,12}(20\d{2})/gi) ?? [])
    .map((m) => Number(m.match(/20\d{2}/)?.[0] ?? 0))
    .filter((y) => y > 2000);
  const latestCopyright = yearMatches.length ? Math.max(...yearMatches) : null;
  const currentYear = new Date().getFullYear();
  const staleCopyright =
    latestCopyright && currentYear - latestCopyright >= 2 ? latestCopyright : null;

  const platform = detectPlatform(html + " " + scriptSrcs);
  const navLinks = $("nav a, header a").length;
  const htmlBytes = Buffer.byteLength(html, "utf8");

  // ---------- modernity ----------
  let modernity = 45;
  if (platform) {
    if (platform.era === "MODERN") {
      modernity += 22;
      positives.push(`Modern platform: ${platform.name}`);
    } else if (platform.era === "CURRENT") {
      modernity += 10;
      positives.push(`Actueel platform: ${platform.name}`);
    } else if (platform.era === "AGING") {
      modernity -= 8;
      negatives.push(`Verouderend platform: ${platform.name}`);
    } else if (platform.era === "DATED") {
      modernity -= 25;
      negatives.push(`Sterk verouderd platform: ${platform.name}`);
    }
  }

  if (viewport) modernity += 6;
  else {
    modernity -= 22;
    negatives.push("Geen viewport meta: site is niet responsive opgezet");
  }

  if (cssCustomProps) {
    modernity += 8;
    positives.push("CSS custom properties (moderne stijlarchitectuur)");
  } else {
    modernity -= 6;
    negatives.push("Geen CSS variabelen: oudere stylesheet-opbouw");
  }

  if (modernLayout) {
    modernity += 8;
    positives.push("Flexbox/grid layout");
  } else {
    modernity -= 12;
    negatives.push("Geen flex/grid layout gevonden");
  }

  if (fluidType) {
    modernity += 6;
    positives.push("Fluid typografie / aspect-ratio");
  }

  if (srcsetCount > 0) {
    modernity += 6;
    positives.push("Responsive images (srcset)");
  } else if (imageCount > 3) {
    modernity -= 8;
    negatives.push("Beeld zonder srcset: zware, niet-responsive afbeeldingen");
  }

  if (lazyCount > 0) modernity += 3;
  if (modernFormats) {
    modernity += 5;
    positives.push("WebP/AVIF beeldformaten");
  } else if (imageCount > 3) {
    modernity -= 5;
    negatives.push("Alleen JPG/PNG beelden");
  }

  if (tableLayout) {
    modernity -= 20;
    negatives.push("Tabel-gebaseerde layout");
  }
  if (legacyHtml) {
    modernity -= 18;
    negatives.push("Legacy HTML (font/center/bgcolor)");
  }
  if (legacyJquery) {
    modernity -= 10;
    negatives.push("Verouderde jQuery-versie");
  }
  if (fixedWidth) {
    modernity -= 10;
    negatives.push("Vaste kolombreedte uit het pre-mobile tijdperk");
  }
  if (flashOrEmbed) {
    modernity -= 15;
    negatives.push("Flash/embed elementen");
  }
  if (staleCopyright) {
    modernity -= 8;
    negatives.push(`Copyright blijft steken op ${staleCopyright}`);
  }

  modernity = clamp(modernity);

  // ---------- booking funnel ----------
  const allHrefs = $("a[href]")
    .map((_, el) => $(el).attr("href") ?? "")
    .get();
  const navHrefText = $("nav a, header a")
    .map((_, el) => `${$(el).attr("href") ?? ""} ${$(el).text()}`)
    .get()
    .join(" ")
    .toLowerCase();
  const hrefBlob = allHrefs.join(" ");

  const bookingPlatforms = BOOKING_PLATFORMS.filter(([pattern]) =>
    pattern.test(hrefBlob + " " + html)
  ).map(([, name]) => name);

  const bookingWord = /boek|reserveer|inschrijv|aanmeld|book now|plan je les|schrijf je in/i;
  const bookingLinkInNav = bookingWord.test(navHrefText);
  const bookingAnywhere =
    bookingWord.test(text) || bookingPlatforms.length > 0 || /\/boeken|\/booking|\/rooster/i.test(hrefBlob);
  const trialCta = /proefles|gratis les|kennismaking|intake|probeerles|introles|first class free/i.test(
    text
  );
  const scheduleVisible = /rooster|lesrooster|agenda|schedule|tijdschema|planning/i.test(
    text + " " + navHrefText
  );
  const contactOnly =
    !bookingAnywhere && /contact|bel|mail|whatsapp|app me|stuur een bericht/i.test(text);

  let bookingOpportunity = 50;
  if (!bookingAnywhere) {
    bookingOpportunity += 25;
    negatives.push("Geen online boekingspad zichtbaar");
  } else {
    bookingOpportunity -= 10;
  }
  if (!bookingLinkInNav) {
    bookingOpportunity += 12;
    negatives.push("Boekknop ontbreekt in de hoofdnavigatie");
  } else {
    bookingOpportunity -= 12;
    positives.push("Boekknop staat in de navigatie");
  }
  if (!trialCta) {
    bookingOpportunity += 12;
    negatives.push("Geen duidelijke proefles-instap");
  } else {
    bookingOpportunity -= 8;
    positives.push("Proefles-CTA aanwezig");
  }
  if (!scheduleVisible) {
    bookingOpportunity += 8;
    negatives.push("Rooster niet vindbaar vanaf de homepage");
  } else {
    bookingOpportunity -= 5;
  }
  if (bookingPlatforms.length > 0 && !bookingLinkInNav) {
    bookingOpportunity += 6;
    negatives.push(`Extern boekingsplatform (${bookingPlatforms[0]}) zonder duidelijke funnel`);
  }
  if (contactOnly) {
    bookingOpportunity += 10;
    negatives.push("Alleen contact/bellen als aanmeldroute");
  }
  if (!viewport) bookingOpportunity += 8;
  bookingOpportunity = clamp(bookingOpportunity);

  // ---------- brand asset usability ----------
  const imgData = images
    .map((_, el) => {
      const $el = $(el);
      return {
        src: $el.attr("src") ?? $el.attr("data-src") ?? "",
        alt: ($el.attr("alt") ?? "").trim(),
        cls: $el.attr("class") ?? "",
      };
    })
    .get();

  // Content imagery, not chrome. Site CDNs count as own material; icons,
  // tracking pixels and social badges do not.
  const CHROME_PATTERN = /icon|sprite|pixel|badge|favicon|placeholder|1x1|spacer|arrow|chevron/i;
  const SITE_CDN_PATTERN =
    /website-files\.com|squarespace-cdn|wixstatic\.com|cdn\.shopify|cloudinary\.com|imgix\.net|wp-content|framerusercontent|ctfassets\.net|prismic\.io/i;
  const ownImages = imgData.filter((img) => {
    if (!img.src || img.src.startsWith("data:")) return false;
    if (CHROME_PATTERN.test(img.src)) return false;
    if (SITE_CDN_PATTERN.test(img.src)) return true;
    let host = "";
    try {
      host = hostOf(new URL(img.src, finalUrl).toString());
    } catch {
      return false;
    }
    return !host || host === siteHost || host.endsWith(siteHost);
  }).length;

  const imageBlob = imgData.map((i) => `${i.src} ${i.alt} ${i.cls}`).join(" ").toLowerCase();
  const logoInHeader =
    $("header img, .logo img, #logo img, [class*='logo'] img, header svg").length > 0 ||
    /logo/i.test(imageBlob);
  const hasLogo = logoInHeader || Boolean(options?.googleLogo);
  const descriptiveAlts = imgData.filter((i) => i.alt.length >= 8).length;
  const altRatio = imageCount ? descriptiveAlts / imageCount : 0;

  const studioImagery = /studio|interieur|interior|ruimte|zaal|space|locatie/i.test(
    imageBlob + " " + text.slice(0, 4000)
  );
  const teamImagery = /team|trainer|instructeur|docent|coach|over-mij|about/i.test(imageBlob);
  const reformerImagery = /reformer|toestel|apparatuur|cadillac|wunda|tower/i.test(
    imageBlob + " " + text
  );
  const instagram = /instagram\.com/i.test(hrefBlob);

  const declaredColors = Array.from(
    new Set(
      [
        ...(css.match(/--[a-z0-9-]*colou?r[a-z0-9-]*\s*:\s*(#[0-9a-f]{3,8})/gi) ?? []),
        ...(headHtml.match(/theme-color"\s*content="(#[0-9a-f]{3,8})/gi) ?? []),
      ]
        .map((m) => m.match(/#[0-9a-f]{3,8}/i)?.[0] ?? "")
        .filter(Boolean)
    )
  ).slice(0, 6);

  const webfonts = Array.from(
    new Set(
      (html.match(/fonts\.googleapis\.com\/css2?\?family=([A-Za-z+0-9]+)/g) ?? [])
        .map((m) => decodeURIComponent(m.split("family=")[1] ?? "").replace(/\+/g, " "))
        .filter(Boolean)
    )
  ).slice(0, 4);

  let brandUsability = 30;
  if (hasLogo) {
    brandUsability += 16;
    positives.push("Bruikbaar logo aanwezig");
  } else {
    brandUsability -= 10;
    negatives.push("Geen herkenbaar logo gevonden");
  }
  if (ownImages >= 12) brandUsability += 22;
  else if (ownImages >= 6) brandUsability += 16;
  else if (ownImages >= 3) brandUsability += 8;
  else {
    brandUsability -= 12;
    negatives.push("Weinig eigen fotografie op de site");
  }
  if (studioImagery) {
    brandUsability += 8;
    positives.push("Studio/interieurbeeld beschikbaar");
  }
  if (teamImagery) {
    brandUsability += 7;
    positives.push("Trainers in beeld");
  }
  if (reformerImagery) {
    brandUsability += 7;
    positives.push("Reformer/lesbeeld beschikbaar");
  }
  if (instagram) {
    brandUsability += 6;
    positives.push("Instagram als extra beeldbron");
  }
  if (declaredColors.length >= 2) brandUsability += 6;
  if (webfonts.length >= 1) brandUsability += 5;
  if (altRatio >= 0.5) brandUsability += 4;
  if (options?.googleImage) brandUsability += 4;
  brandUsability = clamp(brandUsability);

  // ---------- website quality ----------
  // Content/tech hygiene carries roughly a third; craft and modernity dominate,
  // because a template site with perfect meta tags is still a redesign case.
  let hygiene = 50;
  if (https) hygiene += 8;
  else {
    hygiene -= 18;
    negatives.push("Geen HTTPS");
  }
  if (title && title.length > 8) hygiene += 6;
  else {
    hygiene -= 8;
    negatives.push("Zwakke of ontbrekende title");
  }
  if (metaDesc && metaDesc.length > 40) hygiene += 5;
  else {
    hygiene -= 6;
    negatives.push("Geen bruikbare meta description");
  }
  if (h1) hygiene += 5;
  else {
    hygiene -= 6;
    negatives.push("Geen H1");
  }
  if (structuredData) hygiene += 6;
  else negatives.push("Geen structured data");
  if (openGraph) hygiene += 4;
  if (navLinks >= 4) hygiene += 5;
  else {
    hygiene -= 8;
    negatives.push("Dunne informatiearchitectuur");
  }
  if (imageCount >= 6) hygiene += 4;
  else if (imageCount < 3) {
    hygiene -= 8;
    negatives.push("Nauwelijks beeldmateriaal");
  }
  if (htmlBytes < 6000) {
    hygiene -= 10;
    negatives.push("Zeer dunne homepage");
  }
  hygiene = clamp(hygiene);

  const bookingQuality = clamp(100 - bookingOpportunity);
  const quality = clamp(modernity * 0.5 + hygiene * 0.32 + bookingQuality * 0.18);

  // Opportunity is not a plain inverse: a professional studio behind a weak
  // site is worth more than a weak studio behind the same site, and usable
  // brand material makes the redesign visibly better.
  let opportunity = 100 - quality;
  if (brandUsability >= 70 && quality < 70) opportunity += 8;
  if (platform?.era === "DATED") opportunity += 6;
  if (!viewport) opportunity += 6;
  opportunity = clamp(opportunity, 5, 97);

  if (opportunity >= 65) positives.push("Duidelijke website-gap (hoge opportunity)");

  return {
    reachable: true,
    final_url: finalUrl,
    https,
    status_code: status,
    platform,
    modernity_score: modernity,
    website_quality_score: quality,
    website_opportunity_score: opportunity,
    booking_opportunity_score: bookingOpportunity,
    brand_asset_usability_score: brandUsability,
    booking: {
      platforms: bookingPlatforms,
      booking_link_in_nav: bookingLinkInNav,
      trial_class_cta: trialCta,
      schedule_visible: scheduleVisible,
      booking_anywhere: bookingAnywhere,
      contact_only: contactOnly,
    },
    brand: {
      logo: hasLogo,
      own_images: ownImages,
      total_images: imageCount,
      descriptive_alt_ratio: Number(altRatio.toFixed(2)),
      studio_imagery: studioImagery,
      team_imagery: teamImagery,
      reformer_imagery: reformerImagery,
      instagram,
      declared_colors: declaredColors,
      webfonts,
    },
    technical: {
      viewport,
      title,
      meta_description: metaDesc ? metaDesc.slice(0, 160) : null,
      h1,
      structured_data: structuredData,
      open_graph: openGraph,
      responsive_images: srcsetCount > 0,
      lazy_loading: lazyCount > 0,
      modern_image_formats: modernFormats,
      css_custom_properties: cssCustomProps,
      modern_layout_css: modernLayout,
      fluid_typography: fluidType,
      table_layout: tableLayout,
      legacy_html: legacyHtml,
      legacy_jquery: legacyJquery,
      fixed_width_layout: fixedWidth,
      flash_or_embed: flashOrEmbed,
      stale_copyright_year: staleCopyright,
      html_bytes: htmlBytes,
      image_count: imageCount,
      nav_links: navLinks,
      stylesheets_read: stylesheetsRead,
    },
    positives: Array.from(new Set(positives)),
    negatives: Array.from(new Set(negatives)),
  };
}
