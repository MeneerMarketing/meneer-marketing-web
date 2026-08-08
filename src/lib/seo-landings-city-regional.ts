import { SEO_CITY_REGISTRY } from "@/data/seo-landings/city-registry";
import type {
  SeoLandingCategory,
  SeoLandingPage,
  SeoLandingStep,
} from "@/data/seo-landings/types";
import { CITY_TRIO_BASE_SLUGS } from "@/lib/seo-landings-city-trio";
import {
  cityProfile,
  fill,
  pageVars,
  pick,
  pickMany,
} from "@/lib/seo-landings-voice";

type RegionBucket =
  | "gelderland"
  | "brabant-limburg"
  | "randstad"
  | "utrecht-flevoland"
  | "overijssel-noord";

function resolveBaseSlug(slug: string): string {
  for (const city of SEO_CITY_REGISTRY) {
    const suffix = `-${city.slug}`;
    if (slug.endsWith(suffix)) {
      return slug.slice(0, -suffix.length);
    }
  }
  return slug;
}

function getRegionBucket(region?: string): RegionBucket {
  if (!region) return "gelderland";
  const r = region.toLowerCase();
  if (r.includes("gelderland")) return "gelderland";
  if (r.includes("brabant") || r.includes("limburg")) return "brabant-limburg";
  if (r.includes("holland")) return "randstad";
  if (r.includes("utrecht") || r.includes("flevoland")) return "utrecht-flevoland";
  if (
    r.includes("overijssel") ||
    r.includes("groningen") ||
    r.includes("friesland")
  ) {
    return "overijssel-noord";
  }
  return "gelderland";
}

const REGIONAL_PAIN_POOL: Record<
  SeoLandingCategory,
  readonly { title: string; body: string }[]
> = {
  "google-ads": [
    { title: "Ads zonder lokale landings", body: "Budget naar {city} terwijl je pagina generiek NL-breed is. Message match mist." },
    { title: "Tracking ontbreekt", body: "{kw} in {region} zonder GA4 en conversies is gokken met MKB-geld." },
    { title: "Account zonder ritme", body: "Zoektermenrapport blijft dicht. Leaks eten marge in {city}." },
    { title: "Randstad target {region}", body: "Concurrenten adverteren op jouw regio. Jij moet scherper zijn, niet luider." },
    { title: "Shopping op vieze feed", body: "Productdata inconsistent. Ads duurder dan nodig rond {city}." },
  ],
  seo: [
    { title: "Footer-SEO", body: "'{city}' in de footer is geen strategie. GBP, reviews en landings ontbreken." },
    { title: "Rapport zonder pagina", body: "{kw} advies zonder live content. Posities stilstaan in {region}." },
    { title: "Dunne dienstpagina", body: "Honderd woorden over kwaliteit. Google ziet niets unieks voor {city}." },
    { title: "AI-zoek gemist", body: "ChatGPT citeert anderen in jouw markt. Jij niet." },
    { title: "Techniek blijft liggen", body: "Crawl errors en trage mobiel. {kw} lijdt in {city}." },
  ],
  website: [
    { title: "Template-plafond", body: "{kw} via page builder remt groei in {region}. Custom schaalt mee." },
    { title: "Mobiel te traag", body: "Klanten in {city} vergelijken op telefoon. Trage site = weg." },
    { title: "Campagne-landings ontbreken", body: "Ads naar homepage. Duur in {city} en daarbuiten." },
    { title: "Bouwer weg na live", body: "Site staat, tracking onduidelijk. Ondernemer in {region} zoekt zelf." },
    { title: "Mooi zonder CTA", body: "Design award, lege inbox. {kw} moet converteren." },
  ],
  shopify: [
    { title: "Theme zonder schaal", body: "Shopify in {city} groeit, theme niet mee. Apps stapelen." },
    { title: "Feed en SEO los", body: "Shopping en organisch delen geen data. Dubbel werk in {region}." },
    { title: "Checkout lekt", body: "Cart abandon hoog terwijl ads draaien op {kw}." },
    { title: "B2B via mail", body: "Zakelijke klanten in {city} willen portal, geen PDF." },
    { title: "Migratie-angst", body: "WooCommerce vast. Redirect-plan voor {region} ontbreekt." },
  ],
  content: [
    { title: "Bulk zonder stem", body: "AI-blogs die niemand in {city} leest. {kw} vraagt antwoorden." },
    { title: "Content zonder interne links", body: "Content-eilanden. Autoriteit stroomt niet in {region}." },
    { title: "Vragen genegeerd", body: "Support-mail is gratis contentplan voor {kw}." },
    { title: "AI-zichtbaarheid nul", body: "Pagina's die ChatGPT kan citeren voor {city} ontbreken." },
    { title: "Content los van site", body: "Blogs ranken niet door trage techniek in {region}." },
  ],
  "b2b-portal": [
    { title: "Orders in mail", body: "B2B in {city} typt handmatig. {kw} kan uren teruggeven." },
    { title: "Self-service ontbreekt", body: "Zakelijke klanten in {region} willen online bestellen." },
    { title: "Leads in Gmail", body: "Formulieren zonder flow. Opvolging hapert." },
    { title: "Excel naast shop", body: "Dubbel werk dat {kw} zou kunnen automatiseren." },
    { title: "Automatisering zonder plan", body: "Tools geïnstalleerd, niets gekoppeld in {city}." },
  ],
};

const REGIONAL_STORY_OPENERS: Record<RegionBucket, readonly string[]> = {
  gelderland: [
    "In {city} en {region} zie ik MKB dat online wil winnen zonder Randstad-bureau retainer. {kw} moet lokaal vertrouwen én techniek hebben.",
    "Gelderland ondernemers zijn direct. {kw} via generieke copy met '{city}' in de titel ruiken ze binnen seconden.",
  ],
  "brabant-limburg": [
    "Brabant en Limburg maken en verkopen. {kw} in {city} vraagt shop of site die marge en snelheid aankan.",
    "Je concurreert in {region} met iedereen die ads op jouw stad zet. Relevantie wint van budget.",
  ],
  randstad: [
    "{city} is competitief en duur. {kw} met template-site valt weg tussen honderden vergelijkbare pagina's.",
    "Randstad MKB wil resultaat deze maand, geen kwartaal-deck over {kw}.",
  ],
  "utrecht-flevoland": [
    "{city} groeit snel. {kw} met starre site remt campagnes af in {region}.",
    "Utrecht en Flevoland zitten tussen Randstad en regio. Je site moet beide aankunnen.",
  ],
  "overijssel-noord": [
    "In {city} heb je offline vaak al naam. Online blijft {kw} hangen op oude site of footer-SEO.",
    "Noord en Overijssel worden onderschat door Randstad-bureaus. {region} verdient context.",
  ],
};

const REGIONAL_STORY_MIDDLES: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "Google Ads en Meta Ads expliciet waar passend. Landings fix ik zelf. Tracking vóór opschalen.",
    "Ik schaal ads pas na organisch bewijs. Per product bekeken waar marge het toelaat. Die volgorde geldt ook in {city}.",
  ],
  seo: [
    "Ik schrijf, bouw en publiceer. GBP, reviews en landings voor {kw} in één lijn.",
    "12 jaar Google plus AI-zoek. Pagina's die ranken én converteren in {region}.",
  ],
  website: [
    "Custom Next.js of Shopify from scratch. Snelheid, schema, tracking vóór launch in {city}.",
    "Landings per dienst, niet alles op homepage. {kw} moet campagnes aankunnen.",
  ],
  shopify: [
    "Feed, checkout en mail gekoppeld. Ads opschalen op lekkende shop is duur in {region}.",
    "Custom theme waar nodig. B2B en retail op één Shopify-fundament.",
  ],
  content: [
    "Antwoord-pagina's per intentie. Interne links vanaf je sterkste content in {city}.",
    "AI als hulpmiddel, niet bulk. {kw} moet menselijk klinken voor {region}.",
  ],
  "b2b-portal": [
    "Portalen, flows, n8n/Make. {kw} moet uren teruggeven aan team in {city}.",
    "Leads horen niet in Gmail te sterven. Automatisering met plan, geen tool-spaghetti.",
  ],
};

const REGIONAL_DEEPDIVE: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "{kw} in {city}: elke klik kost geld. Landings en tracking moeten kloppen vóór budget omhoog.",
    "Message match tussen ad en pagina is marge in {region}, geen detail.",
    "Google Ads en Meta Ads in één strategie als beide passen. Eén plan, geen silo's.",
    "Wekelijks bijsturen op zoektermen en ROAS. Actie per week, niet alleen een maandrapport.",
  ],
  seo: [
    "Lokaal ranken in {city} vraagt GBP, reviews, landings en techniek.",
    "Organisch fundament vóór ads opschalen. Marge beschermen in {region}.",
    "AI-zoek: antwoord-pagina's die ChatGPT kunnen citeren.",
    "Meet op leads en omzet, niet alleen positie.",
  ],
  website: [
    "{kw} from scratch: controle over snelheid, landings en integraties in {city}.",
    "Mobiel-first is realiteit in {region}. Core Web Vitals zijn ranking én conversie.",
    "Homepage is geen vangnet voor al je ads.",
    "After launch meten, bijbouwen, optimaliseren.",
  ],
  shopify: [
    "Shopify in {city}: feed, SEO en mail in één lijn.",
    "Abandoned cart is gratis geld. Flows vóór ads schalen in {region}.",
    "Product-SEO en Shopping delen data.",
    "Custom theme waar theme store stopt.",
  ],
  content: [
    "Content die rankt én citeerbaar is in AI-antwoorden voor {city}.",
    "Vragen uit sales worden antwoord-pagina's.",
    "Interne links vanaf sterke pagina's in {region}.",
  ],
  "b2b-portal": [
    "B2B in {city}: minder handmatig, meer self-service.",
    "Portalen op Shopify waar het past.",
    "{kw} moet zichzelf terugverdienen in uren per week.",
  ],
};

const REGIONAL_PROCESS: Record<
  SeoLandingCategory,
  readonly (readonly SeoLandingStep[])[]
> = {
  "google-ads": [
    [
      { title: "Intake {city}", body: "Waar zit je met {kw}? Cijfers open, plan in mensentaal." },
      { title: "Account & tracking", body: "Conversies, landings, mobiel. Lekken dicht in {region}." },
      { title: "Campagnes live", body: "Google Ads, Meta waar passend. Message match." },
      { title: "Bijsturen", body: "Wekelijks op ROAS. Opschalen als breakeven klopt." },
    ],
  ],
  seo: [
    [
      { title: "Baseline {city}", body: "Rankings, techniek, GBP. Weten waar je staat in {region}." },
      { title: "Prioriteit", body: "Pagina's op marge eerst voor {kw}." },
      { title: "Bouwen & live", body: "Ik publiceer zelf. Direct live, zonder wachten op derden." },
      { title: "Meten", body: "Posities plus pipeline in {city}." },
    ],
  ],
  website: [
    [
      { title: "Doel {city}", body: "Structuur vóór pixels voor {kw}." },
      { title: "Custom build", body: "Next.js from scratch. Snelheid ingebouwd." },
      { title: "Test mobiel", body: "Verkeer in {region} is mobiel." },
      { title: "Launch", body: "Tracking, indexeren, landings klaar." },
    ],
  ],
  shopify: [
    [
      { title: "Shop-scan", body: "Theme, feed, checkout in {city}-context." },
      { title: "Custom waar nodig", body: "Groei in {region} zonder app-hel." },
      { title: "SEO + feed", body: "Organisch en Shopping delen data." },
      { title: "Mail & ads", body: "Fundament staat, dan schalen." },
    ],
  ],
  content: [
    [
      { title: "Vragen verzamelen", body: "Wat stellen klanten in {city}?" },
      { title: "Antwoord-pagina's", body: "Eén intentie per URL voor {kw}." },
      { title: "Interne links", body: "Autoriteit in {region} sturen." },
      { title: "AI + Google", body: "Pagina's die beide snappen." },
    ],
  ],
  "b2b-portal": [
    [
      { title: "Proces map", body: "Handwerk in {city} tellen." },
      { title: "Ontwerp flow", body: "Portal of automatisering voor {kw}." },
      { title: "Bouwen", body: "Live en testen in {region}." },
      { title: "Tijd meten", body: "Uren terug per week." },
    ],
  ],
};

function buildRegionalStory(page: SeoLandingPage): {
  title: string;
  paragraphs: string[];
} {
  const v = pageVars(page);
  const bucket = getRegionBucket(page.location?.region);
  const profile = cityProfile(page.location!.city);
  const titles = [
    "{kw} in {city}: lokaal winnen zonder template",
    "Waarom {kw} in {region} anders vraagt dan NL-breed",
    "{city} en {kw}: online net zo scherp als offline",
  ];
  const title = fill(pick(page.slug, titles, "reg-story-title"), v);
  const opener = fill(
    pick(page.slug, REGIONAL_STORY_OPENERS[bucket], "reg-open"),
    v,
  );
  const middles = pickMany(
    page.slug,
    REGIONAL_STORY_MIDDLES[page.category],
    2,
    "reg-mid",
  ).map((p) => fill(p, v));
  const closer = `${profile.detail} In ${page.location!.city} telt ${profile.ondernemerstype}. Deze pagina over ${page.primaryKeyword} is daarop geschreven.`;
  return { title, paragraphs: [opener, ...middles, closer] };
}

function buildRegionalDeepDive(page: SeoLandingPage): {
  title: string;
  paragraphs: string[];
} {
  const v = pageVars(page);
  const titles = [
    `{kw} in {city}: praktijk`,
    `Dieper op {kw} in {region}`,
    `{kw} onder de motorkap in {city}`,
  ];
  return {
    title: fill(pick(page.slug, titles, "reg-deep-title"), v),
    paragraphs: pickMany(
      page.slug,
      REGIONAL_DEEPDIVE[page.category],
      3,
      "reg-deep-body",
    ).map((p) => fill(p, v)),
  };
}

/**
 * Unieke laag voor handmatige stad-pagina's (Gelderland, Nederland, Brabant).
 * Niet voor Apeldoorn (HQ-laag) of city trio-bases (eigen laag).
 */
export function applyRegionalCityLayer(page: SeoLandingPage): SeoLandingPage {
  if (!page.location || page.location.city === "Apeldoorn") return page;

  const baseSlug = resolveBaseSlug(page.slug);
  if (CITY_TRIO_BASE_SLUGS.has(baseSlug)) return page;

  const v = pageVars(page);
  const pains = pickMany(
    page.slug,
    REGIONAL_PAIN_POOL[page.category],
    3,
    "reg-pains",
  ).map((p) => ({
    title: fill(p.title, v),
    body: fill(p.body, v),
  }));
  const processVariant = pick(
    page.slug,
    REGIONAL_PROCESS[page.category],
    "reg-process",
  );
  const processSteps = processVariant.map((step) => ({
    title: fill(step.title, v),
    body: fill(step.body, v),
  }));
  const processTitle = fill(
    pick(
      page.slug,
      [
        `{kw} in {city}`,
        `Zo pak ik {kw} aan in {region}`,
        `{city}: {kw} op maat`,
      ],
      "reg-process-title",
    ),
    v,
  );

  return {
    ...page,
    pains,
    processSteps,
    processTitle,
    enrichedOverrides: {
      ...page.enrichedOverrides,
      story: buildRegionalStory(page),
      deepDive: buildRegionalDeepDive(page),
    },
  };
}
