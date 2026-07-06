import type { SeoLandingCategory, SeoLandingPage } from "@/data/seo-landings/types";
import { fill, hashSlug, pick, pickMany } from "@/lib/seo-landings-voice";

const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 158;

const META_DESC_MIDDLES: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "Eerst site en tracking, dan Search of Shopping op koopintentie.",
    "Geen budget naar 'gratis' zoektermen. Wel landings die converteren.",
    "Wekelijks bijsturen op marge, niet op impressies.",
  ],
  seo: [
    "Techniek, intentie en content die één vraag echt beantwoordt.",
    "Core Web Vitals, schema en interne links ingebakken.",
    "Organisch én vindbaar in ChatGPT, met echte expertise.",
  ],
  website: [
    "Custom build in Next.js: snel, vindbaar, klaar voor campagnes.",
    "Geen page builder die je groei remt. Wel semantische HTML.",
    "Landings en CTA's die op mobiel werken vóór je ads aanzet.",
  ],
  shopify: [
    "Feeds, snelheid en checkout vóór je Shopping opschaalt.",
    "Custom theme waar nodig. Geen app-hel die je CWV sloopt.",
    "Van migratie tot B2B: Shopify als schaalbaar fundament.",
  ],
  content: [
    "Antwoord-pagina's die ranken en converteren, geen bulk-ruis.",
    "Owned content op je domein met interne links en echte stem.",
    "Content die mensen en AI kunnen citeren.",
  ],
  "b2b-portal": [
    "Minder handmatig werk, meer orders zonder team verdubbelen.",
    "Portalen, flows en koppelingen die je stack verbinden.",
    "Automatisering die tijd teruggeeft aan je team.",
  ],
};

const META_DESC_CLOSERS = [
  "Eerlijk advies van Meneer Marketing.",
  "SkinComplete en BestRest als referentie waar het past.",
  "Intake vaak binnen een week.",
  "Geen retainer zonder plan.",
  "Eén aanspreekpunt, geen keten van specialisten.",
  "Fundament eerst, dan schalen.",
  "Jij/je, direct, soms droog grappig.",
  "Custom build, geen templates.",
] as const;

const CITY_HEADLINES: Record<
  SeoLandingCategory,
  readonly { headline: string; headlineAccent: string }[]
> = {
  "google-ads": [
    { headline: "{kw} in {city}:", headlineAccent: "eerst je site, dan je budget." },
    { headline: "Betaal in {city} niet voor", headlineAccent: "kliks zonder conversie." },
    { headline: "{kw} zonder", headlineAccent: "broad-match-spookgeld." },
  ],
  seo: [
    { headline: "{kw} in {city}:", headlineAccent: "ranken is niet genoeg." },
    { headline: "Vindbaar in {city}", headlineAccent: "zonder SEO-template." },
    { headline: "{kw} die Google", headlineAccent: "en mensen overtuigt." },
  ],
  website: [
    { headline: "{kw} in {city}:", headlineAccent: "from scratch, niet from theme." },
    { headline: "Je site in {city}", headlineAccent: "moet verkopen om 23:00." },
    { headline: "{kw} zonder", headlineAccent: "page-builder-gedoe." },
  ],
  shopify: [
    { headline: "{kw} in {city}:", headlineAccent: "shop die meeschaaft." },
    { headline: "Shopify in {city}", headlineAccent: "zonder app-hel." },
    { headline: "{kw} met", headlineAccent: "feed, snelheid en marge." },
  ],
  content: [
    { headline: "{kw} in {city}:", headlineAccent: "antwoorden, geen volume." },
    { headline: "Content in {city}", headlineAccent: "die geld oplevert." },
    { headline: "{kw} zonder", headlineAccent: "AI-ruis in bulk." },
  ],
  "b2b-portal": [
    { headline: "{kw} in {city}:", headlineAccent: "minder Excel, meer orders." },
    { headline: "B2B in {city}", headlineAccent: "zonder handmatig gedoe." },
    { headline: "{kw} die", headlineAccent: "je team tijd teruggeeft." },
  ],
};

const NATIONAL_HEADLINE_ACCENTS = [
  "zonder marketingtheater.",
  "met je marge als kompas.",
  "dat je bankrekening snapt.",
  "zonder template-gedoe.",
  "from scratch, niet from hope.",
] as const;

const EXPERT_SUMMARY_OPENERS: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "{kw} bij Meneer Marketing begint met de vraag: mag je überhaupt adverteren met je huidige marge en site?",
    "Wie zoekt op {kw} wil vaak snel resultaat. Ik begin met tracking, landings en zoektermen die geld mogen kosten.",
  ],
  seo: [
    "{kw} is geen trucjeslijst. Het is techniek, content met intentie en consistentie over maanden.",
    "Voor {kw} bouw ik pagina's die één zoekvraag beter beantwoorden dan de top 10 die er nu staat.",
  ],
  website: [
    "{kw} bij mij is een custom build die vindbaar is, snel laadt en converteert vóór je campagnes live gaan.",
    "Wie {kw} zoekt bij Meneer Marketing krijgt geen theme met je logo. Wel Next.js of Shopify op maat.",
  ],
  shopify: [
    "{kw} draait om feeds, snelheid, checkout en schaalbaarheid. Niet om twaalf apps die elkaar tegenwerken.",
    "Shopify voor {kw} betekent: custom waar nodig, SEO vanaf dag één, geen demo-store mentaliteit.",
  ],
  content: [
    "{kw} werkt als je antwoordt wat klanten echt vragen. Niet als je drie blogs per week publiceert uit gewoonte.",
    "Content voor {kw} moet ranken, converteren en citeerbaar zijn voor Google én AI.",
  ],
  "b2b-portal": [
    "{kw} fixt vooral procesfrictie: mail, Excel, wachten. Niet je product.",
    "B2B groeit sneller met portalen en automatisering dan met extra handen die copy-pasten.",
  ],
};

const KEY_TAKEAWAY_BANK: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "Breakeven en marge vóór opschalen",
    "Zoektermenrapport is je pinpas",
    "Landings moeten matchen met je ad",
    "Performance Max vraagt schone input",
    "Remarketing op de juiste doelgroep",
    "Shopping begint bij je feed",
  ],
  seo: [
    "Eén pagina per zoekintentie",
    "Core Web Vitals zijn geen bijlage",
    "Interne links vormen je routekaart",
    "GBP en site vertellen één verhaal",
    "AI-zoek vraagt duidelijke antwoorden",
    "Dunne content verliest van sterk",
  ],
  website: [
    "Mobiel eerst testen, altijd",
    "Semantische HTML en schema",
    "CTA zichtbaar zonder scrollen",
    "Geen page builder als eindstation",
    "Landings per dienst of campagne",
    "Snelheid is conversie",
  ],
  shopify: [
    "Apps alleen met business case",
    "Checkout-frictie zie je in omzet",
    "Product-SEO in titels en structuur",
    "Abandoned cart is gratis geld",
    "Migratie: redirects of dip accepteren",
    "B2B kan op Shopify",
  ],
  content: [
    "Vragen van klanten = contentplan",
    "Owned media op je domein",
    "Interne links vanaf sterke pagina's",
    "Update oude posts vóór nieuwe stapelen",
    "Stem herkenbaar, geen AI-ruis",
    "FAQ kan ranken én converteren",
  ],
  "b2b-portal": [
    "Tel uren op handmatig werk",
    "Leads horen niet in Gmail te sterven",
    "Self-service naast persoonlijk contact",
    "Koppelingen voorkomen dubbel werk",
    "Automatisering is geen later-project",
    "Procesfrictie kost klanten",
  ],
};

function pageVars(page: SeoLandingPage) {
  const city = page.location?.city ?? "";
  const region = page.location?.region ?? "";
  return {
    kw: page.primaryKeyword,
    city,
    region,
    loc: page.location
      ? page.location.region
        ? ` in ${city} en ${region}`
        : ` rond ${city}`
      : "",
    slug: page.slug,
  };
}

function clampDescription(text: string): string {
  let d = text.replace(/\s+/g, " ").trim();
  if (d.length > DESC_MAX) {
    d = `${d.slice(0, DESC_MAX - 1).trimEnd()}…`;
  }
  if (d.length < DESC_MIN && d.length > 0) {
    return d;
  }
  return d;
}

export function trimMetaTitle(title: string): string {
  const t = title.replace(/\s+/g, " ").trim();
  if (t.length <= TITLE_MAX) return t;
  return `${t.slice(0, TITLE_MAX - 1).trimEnd()}…`;
}

export function buildUniqueMetaDescription(page: SeoLandingPage): string {
  const v = pageVars(page);
  const middle = fill(pick(page.slug, META_DESC_MIDDLES[page.category], "meta-mid"), v);
  const closer = pick(page.slug, META_DESC_CLOSERS, "meta-close");

  if (page.location?.city === "Apeldoorn") {
    return clampDescription(
      `Meneer Marketing, gevestigd in Apeldoorn. ${middle} ${closer} Thuisbasis Veluwe, ook landelijk.`,
    );
  }

  if (page.location) {
    return clampDescription(
      `${page.primaryKeyword} in ${page.location.city}${page.location.region ? ` (${page.location.region})` : ""}: ${middle} ${closer}`,
    );
  }

  return clampDescription(`${page.primaryKeyword}: ${middle} ${closer}`);
}

export function buildDisplayHeadline(page: SeoLandingPage): {
  headline: string;
  headlineAccent?: string;
} {
  const v = pageVars(page);

  if (page.location) {
    const pair = pick(page.slug, CITY_HEADLINES[page.category], "city-h1");
    return {
      headline: fill(pair.headline, v),
      headlineAccent: fill(pair.headlineAccent, v),
    };
  }

  const accent = pick(page.slug, NATIONAL_HEADLINE_ACCENTS, "nat-accent");
  return {
    headline: page.headline,
    headlineAccent: page.headlineAccent ?? accent,
  };
}

export function buildExpertSummary(page: SeoLandingPage): string {
  const v = pageVars(page);
  const opener = fill(pick(page.slug, EXPERT_SUMMARY_OPENERS[page.category], "expert"), v);
  const cityNote = page.location
    ? page.location.city === "Apeldoorn"
      ? " Ik zit in Apeldoorn, geen postbus in de Randstad."
      : ` Ook actief rond ${page.location.city}${page.location.region ? ` en ${page.location.region}` : ""}.`
    : " Landelijk en regionaal, altijd met hetzelfde fundament.";
  const closer = pick(page.slug, META_DESC_MIDDLES[page.category], "expert-close");
  return `${opener}${cityNote} ${fill(closer, v)}`;
}

export function buildKeyTakeaways(page: SeoLandingPage): readonly string[] {
  const v = pageVars(page);
  return pickMany(page.slug, KEY_TAKEAWAY_BANK[page.category], 4, "takeaways").map((t) =>
    fill(t, v),
  );
}

export function buildSchemaFaqs(
  page: SeoLandingPage,
  enrichedFaqs: readonly { question: string; answer: string }[],
): readonly { question: string; answer: string }[] {
  const v = pageVars(page);
  const primary = {
    question: fill(`Wat is {kw} bij Meneer Marketing?`, v),
    answer: buildExpertSummary(page),
  };
  const unique = enrichedFaqs.filter(
    (f, i, arr) => arr.findIndex((x) => x.question === f.question) === i,
  );
  return [primary, ...unique.slice(0, 7)];
}

export function seoLandingSitemapPriority(slug: string): number {
  if (slug.endsWith("-apeldoorn")) return 0.92;
  if (
    slug.includes("-amsterdam") ||
    slug.includes("-rotterdam") ||
    slug.includes("-utrecht") ||
    slug.includes("-den-haag") ||
    slug.includes("-eindhoven")
  ) {
    return 0.86;
  }
  const citySuffixes = [
    "-arnhem",
    "-nijmegen",
    "-tilburg",
    "-breda",
    "-groningen",
    "-maastricht",
    "-enschede",
  ];
  if (citySuffixes.some((s) => slug.endsWith(s))) return 0.85;
  if (slug.includes("-")) return 0.84;
  return 0.8;
}
