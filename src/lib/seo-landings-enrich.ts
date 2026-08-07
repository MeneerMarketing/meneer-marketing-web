import type { SeoLandingCategory, SeoLandingPage } from "@/data/seo-landings/types";
import {
  buildDisplayHeadline,
  buildExpertSummary,
  buildKeyTakeaways,
  buildSchemaFaqs,
  buildUniqueMetaDescription,
  trimMetaTitle,
} from "@/lib/seo-landings-meta";
import {
  buildExpandedExtraFaqs,
  buildPainSectionIntro,
  buildUniqueOpener,
  variateSeoLandingPage,
} from "@/lib/seo-landings-uniqueness";
import { applyCityTrioLayer } from "@/lib/seo-landings-city-trio";
import { applyApeldoornCityLayer } from "@/lib/seo-landings-city-apeldoorn";
import { applyRegionalCityLayer } from "@/lib/seo-landings-city-regional";
import { applyEditorialProfile } from "@/lib/seo-landings-editorial";
import { resolveUniqueScenes } from "@/lib/seo-landing-scenes";
import type { SeoLandingTocItem } from "@/data/seo-landings/enriched-types";
import {
  ANALOGIES,
  APELDOORN_COFFEE_CHATS,
  APELDOORN_STORY_BODY,
  APELDOORN_STORY_TITLES,
  cityProfile,
  COFFEE_CHATS,
  CONFESSIONS,
  DEEPDIVE_BANK,
  fill,
  INNER_MONOLOGUE,
  MYTH_POOL,
  NIGHTMARES,
  pageVars,
  pick,
  pickMany,
  RANTS,
  STORY_BODY_BANK,
  STORY_TITLES,
  WEIRD_FACTS,
} from "@/lib/seo-landings-voice";
import type {
  EnrichedSeoLandingPage,
  SeoLandingMyth,
  SeoLandingProseBlock,
} from "@/data/seo-landings/enriched-types";

const PAGE_TOC: readonly SeoLandingTocItem[] = [
  { id: "samenvatting", label: "Kort antwoord" },
  { id: "verhaal", label: "Verhaal" },
  { id: "mythes", label: "Mythes" },
  { id: "herkenning", label: "Herkenning" },
  { id: "aanpak", label: "Aanpak" },
  { id: "deep-dive", label: "Dieper" },
  { id: "proces", label: "Proces" },
  { id: "faq", label: "Vragen" },
];

const KENNISBANK_BY_CATEGORY: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "zoektermenrapport-google-ads",
    "broad-match-google-ads-verrassingsbox",
    "google-ads-vijf-fouten-elke-account",
    "performance-max-zwarte-doos",
    "remarketing-zonder-stalken",
    "roas-vs-cpa-bankrekening",
    "homepage-geen-landingspagina",
  ],
  seo: [
    "concurrent-hoger-in-google",
    "google-reviews-lokale-seo",
    "google-business-profile-spookhuis",
    "ai-content-bulk-onzichtbaar",
    "semantische-seo-2026",
    "ai-zoek-vindbaarheid-chatgpt",
    "wordpress-theme-groeien-nextjs",
  ],
  website: [
    "homepage-geen-landingspagina",
    "wordpress-theme-groeien-nextjs",
    "bestrest-matrassen-eigen-marketingplan",
    "marketingbudget-volgorde-mkb",
    "cro-checkout-vertrouwen",
  ],
  shopify: [
    "b2b-verkopen-via-shopify",
    "shopify-performance-roas",
    "abandoned-cart-emails-die-converteren",
    "performance-max-zwarte-doos",
  ],
  content: [
    "ai-content-bulk-onzichtbaar",
    "ai-zoek-vindbaarheid-chatgpt",
    "semantische-seo-2026",
    "concurrent-hoger-in-google",
  ],
  "b2b-portal": [
    "leads-gmail-opvolging",
    "b2b-verkopen-via-shopify",
    "n8n-eerste-workflow",
    "marketingbudget-volgorde-mkb",
  ],
};

const SCENARIO_TITLES = [
  "Stel: volgende maand moet het kantelen",
  "Stel: je bent al een tijdje bezig en het schuurt",
  "Stel: je concurrent wint online en jij niet",
  "Stel: je hebt budget, maar geen plan",
  "Stel: je site is nieuw en je wilt direct ads",
  "Stel: je vorige bureau ging 'goed' op papier",
] as const;

const SCENARIO_BODY_BANK = [
  "Je hebt een maand. Korte tijdlijn. Je wilt dat {kw} iets oplevert dat je team voelt in de inbox of in de omzet. Wat ik dan niet doe: alles tegelijk aan, zes kanalen openen en hopen dat er eentje raak is.",
  "Wat ik wel doe: eerst meten wat er al gebeurt, dan het grootste lek dichten. Soms is dat je site. Soms je feed. Soms je zoektermenrapport dat niemand ooit opent. Pas daarna budget omhoog.",
  "Het voelt minder sexy dan 'we schalen direct'. Het voelt wel als een plan dat je bankrekening snapt.",
  "Je hebt al iets laten doen. Er is een site, misschien ads, misschien een bureau dat je maandelijks een PDF stuurt. Maar {kw} voelt als geld in een automaat die soms wat uitspuugt en soms slikt.",
  "Dan begin ik niet met verwijten. Ik begin met lezen. Account, analytics, landings op mobiel, zoektermen, marges. Vaak vind ik winst in een week die maandenlang openlag.",
  "Soms is het antwoord: stoppen met een kanaal. Dat zeg ik ook. Liever eerlijk dan een retainer voor sentiment.",
  "In {city} zie ik vaak dat ondernemers denken dat lokaal automatisch betekent: adres op de site. Google is strenger. Je profiel, reviews en landings moeten mee.",
  "Je concurrent adverteert al op '{kw}'. Jij twijfelt nog. Elke week wachten is een week dat hij data verzamelt en jij niet.",
  "Als je marge op je belangrijkste product te laag is voor ads, zeg ik dat hardop. Dan is SEO of je site slimmer dan branden.",
  "SkinComplete groeide eerst organisch. BestRest kreeg per product een plan. Jij krijgt een volgorde op maat die klopt.",
  "In {city} telt niet wie het hardst schreeuwt op LinkedIn. Het telt wie de snelste, duidelijkste pagina heeft als iemand op zoek is naar {kw}.",
  "Je concurrent in {region} adverteert misschien al op jouw stad. Lokaal winnen betekent: betere landings, niet per se meer budget.",
  "Mond-tot-mond werkt nog steeds in {city}. Maar de mond begint steeds vaker met een Google-zoekopdracht.",
  "MKB in {region} wil geen maandrapport met groene pijltjes. Ze willen weten of {kw} iets oplevert deze maand.",
  "Als je alleen je stadnaam in de footer plakt, denkt Google dat je postbus-SEO doet. Dat zie je klanten ook.",
  "Reviews, snelheid, duidelijke dienst: in {city} is dat vaak het verschil tussen bellen en doorklikken.",
] as const;

const LOCAL_COLOR_TITLES = [
  "{city} is geen generieke footer-regio",
  "Lokaal in {city}: meer dan een adres",
  "{kw} in {city} vraagt context",
  "Waarom {city} anders zoekt dan Randstad-bureaus denken",
  "{region} en {city}: online is het speelveld groter dan je postcode",
] as const;

const LOCAL_COLOR_BODY_BANK = [
  "Online concurreer je in {city} met iedereen die ads op jouw regio zet, ook buiten {region}. Lokaal winnen bij {kw} is relevantie, snelheid en vertrouwen.",
  "Je klant in {city} vergelijkt op z'n telefoon tussen afspraken door. Eén trage landings en je bent de backup-optie.",
  "Lokaal vertrouwen in {city} begint online: reviews, duidelijke dienst, pagina's die {kw} echt uitleggen.",
  "Generieke copy met '{city}' in de titel werkt niet. Mensen in {region} merken binnen vijf seconden of je de regio snapt.",
  "Je bereik in {city} gaat verder dan je postcode. Concurrenten uit Eindhoven, Utrecht of Amsterdam targeten {region} ook. Jij moet scherper zijn, niet luider.",
  "MKB in {city} wil resultaat zien, geen bureau uit de Randstad dat de A1 kent als filemelding.",
  "Als {kw} alleen op je homepage staat en nergens anders, mis je long-tail zoekers uit {city} en omgeving.",
  "Mond-tot-mond in {city} start steeds vaker met Google. Je offline reputatie en je site moeten hetzelfde verhaal vertellen.",
] as const;

const HONEST_NO_TITLES = [
  "Wanneer ik nee zeg tegen je opdracht",
  "Dit is geen match als je...",
  "Liever eerlijk dan je portemonnee leegtrekken",
  "Waar ik niet voor te huur ben",
] as const;

const HONEST_NO_BODIES = [
  "Als {kw} niet past bij je marge, je timing of je fundament, zeg ik het. Ads op een shop die niet converteert? Eerst fixen. SEO beloven met garantie op pagina 1? Nee. Nep verwachtingen helpen niemand, behalve je concurrent.",
  "...vooral de goedkoopste offerte zoekt, ...wilt schalen zonder cijfers te delen, of ...alleen een rapport nodig hebt om in een vergadering te zwaaien. {kw} bij Meneer Marketing is samenwerken met iemand die je site aanraakt, je account leest en je bankrekening serieus neemt.",
  "Als je alleen validatie wilt voor wat je al doet, ben ik vervelend. Ik stel vragen. Soms ongemakkelijke. Dat hoort bij {kw} die echt werkt.",
  "Bureau dat belooft 'viral te gaan' of 'guaranteed rankings'? Dat ben ik niet. Ik ben wel iemand die je vertelt waar je geld naartoe gaat en waarom.",
] as const;

const RANT_TITLES = [
  "Even heel eerlijk",
  "Meneer zegt het maar",
  "Dit kan ik niet meer zien",
  "Korte uitbarsting",
] as const;

function buildStory(page: SeoLandingPage): SeoLandingProseBlock {
  const v = pageVars(page);

  if (page.location?.city === "Apeldoorn") {
    const title = fill(pick(page.slug, APELDOORN_STORY_TITLES, "apel-title"), v);
    const paragraphs = [
      ...pickMany(page.slug, APELDOORN_STORY_BODY, 3, "apel-body").map((p) => fill(p, v)),
      ...pickMany(page.slug, STORY_BODY_BANK[page.category], 2, "apel-cat-body").map((p) =>
        fill(p, v),
      ),
    ];
    return { title, paragraphs };
  }

  const title = fill(pick(page.slug, STORY_TITLES[page.category], "story-title"), v);
  const paragraphs = pickMany(page.slug, STORY_BODY_BANK[page.category], 4, "story-body").map(
    (p) => fill(p, v),
  );

  if (page.location?.city) {
    const profile = cityProfile(page.location.city);
    const cityClosers = [
      `${page.location.city} voelt als ${profile.vibe}. ${profile.zoekgedrag}. ${profile.detail} Dat is waarom /zoeken/${page.slug} niet klinkt als een template uit Amsterdam.`,
      `In ${page.location.city} telt ${profile.ondernemerstype}. ${profile.zoekgedrag}. Deze pagina over ${page.primaryKeyword} is daarop geschreven, niet op een Randstad-bureau-template.`,
      `${profile.detail} Ondernemers in ${page.location.city} zoeken ${page.primaryKeyword} met andere verwachtingen dan in Utrecht of Rotterdam. ${profile.vibe}.`,
      `${page.location.city}: ${profile.zoekgedrag}. Ik schrijf ${page.primaryKeyword} voor die realiteit, niet voor 'Nederland generiek' met je stadnaam erachter.`,
    ];
    paragraphs.push(pick(page.slug, cityClosers, "story-city-close"));
  }

  return { title, paragraphs };
}

function buildScenario(page: SeoLandingPage): { title: string; paragraphs: readonly string[] } {
  const v = pageVars(page);
  const title = fill(pick(page.slug, SCENARIO_TITLES, "scenario-title"), v);
  const paragraphs = pickMany(page.slug, SCENARIO_BODY_BANK, 3, "scenario-body").map((p) =>
    fill(p, v),
  );
  return { title, paragraphs };
}

function buildDeepDive(page: SeoLandingPage): SeoLandingProseBlock {
  const v = pageVars(page);
  const titles = [
    `Wat {kw} in de praktijk betekent`,
    `Hoe ik naar {kw} kijk (zonder bullshit)`,
    `{kw}: waar het misgaat en waar het wint`,
    `Dieper op {kw} dan je gewend bent`,
  ];
  const title = fill(pick(page.slug, titles, "deep-title"), v);
  const paragraphs = pickMany(page.slug, DEEPDIVE_BANK[page.category], 4, "deep-body").map((p) =>
    fill(p, v),
  );
  return { title, paragraphs };
}

function buildMyths(page: SeoLandingPage): readonly SeoLandingMyth[] {
  const v = pageVars(page);
  return pickMany(page.slug, MYTH_POOL[page.category], 3, "myths").map((m) => ({
    myth: fill(m.myth, v),
    reality: fill(m.reality, v),
  }));
}

function buildWeirdFact(page: SeoLandingPage): string {
  const v = pageVars(page);
  return fill(pick(page.slug, WEIRD_FACTS, "weird"), v);
}

function buildHonestNo(page: SeoLandingPage): { title: string; body: string } {
  const v = pageVars(page);
  return {
    title: fill(pick(page.slug, HONEST_NO_TITLES, "honest-title"), v),
    body: fill(pick(page.slug, HONEST_NO_BODIES, "honest-body"), v),
  };
}

function buildThisWeek(page: SeoLandingPage): { title: string; items: readonly string[] } {
  const v = pageVars(page);
  const byCategory: Record<SeoLandingCategory, readonly string[]> = {
    "google-ads": [
      `Zoektermenrapport openen en de top 20 op kosten beoordelen voor {kw}`,
      "Controleren of mobiele landings even snel zijn als desktop",
      "Conversiewaarde meesturen als je ecommerce draait",
      "Eén campagne die lekt pauzeren in plaats van alles opschalen",
      "Je negatievenlijst uitbreiden met wat je nooit zou willen betalen",
      "Landingspagina naadloos laten matchen met je sterkste ad",
    ],
    seo: [
      `Google '{kw}' en lees de top 3 als een detective, niet als ondernemer`,
      "PageSpeed op je belangrijkste landings checken op mobiel",
      "Interne links vanaf je homepage naar je sterkste dienstpagina's",
      "ChatGPT vragen wie ze aanraden in jouw branche. Sta jij erbij?",
      "GBP openen en kijken of je laatste post jonger is dan je laatste klant",
      "Eén dunne pagina kiezen om te verbeteren in plaats van een nieuwe te stapelen",
    ],
    website: [
      "Je formulier of checkout zelf invullen op je telefoon",
      "Meten hoeveel seconden tot je eerste CTA zichtbaar is",
      "Eén pagina kiezen die alleen verkeer krijgt en die verbeteren",
      "Schema markup laten controleren op je belangrijkste pagina",
      "Bounce rate op mobiel vergelijken met desktop",
      "Je hero bekijken zonder te scrollen. Zie je wat je moet doen?",
    ],
    shopify: [
      "Merchant Center diagnostics openen als je Shopping draait",
      "Drie bestsellers lezen alsof je klant bent, niet als eigenaar",
      "Abandoned cart flow testen met je eigen e-mail",
      "Apps inventariseren die je in drie maanden niet hebt aangeraakt",
      "Checkout op 4G doorlopen tot betaling",
      "Producttitels vergelijken met wat mensen echt zoeken",
    ],
    content: [
      "Vijf vragen noteren die klanten je deze maand stelden",
      "Eén antwoord-pagina plannen per vraag, niet één blog voor alles",
      "Interne links toevoegen vanuit je best bezochte pagina",
      "AI laten antwoorden op je markt en kijken wie geciteerd wordt",
      "Een oude post updaten in plaats van alleen nieuwe maken",
      "Je sterkste pagina lezen alsof je hem nooit hebt gezien",
    ],
    "b2b-portal": [
      "Tellen hoeveel uur per week handmatige orders kosten",
      "Leadflow tekenen van formulier tot eerste contact",
      "Eén automatisering kiezen die direct tijd teruggeeft",
      "B2B-klant bellen en vragen wat frictie geeft bij bestellen",
      "Excel-tabs tellen die dubbel werk doen",
      "Checken of je prijslijst online dezelfde is als in je PDF",
    ],
  };

  const items = pickMany(page.slug, byCategory[page.category], 4, "thisweek").map((item) =>
    fill(item, v),
  );

  return {
    title: fill(`Als je deze week maar één ding doet voor {kw}`, v),
    items,
  };
}

function buildCoffeeChat(page: SeoLandingPage) {
  const v = pageVars(page);
  const chat =
    page.location?.city === "Apeldoorn"
      ? pick(page.slug, APELDOORN_COFFEE_CHATS, "apel-coffee")
      : pick(page.slug, COFFEE_CHATS[page.category], "coffee");
  return {
    context: fill(chat.context, v),
    lines: chat.lines.map((line) => ({
      who: line.who,
      text: fill(line.text, v),
    })),
  };
}

function buildInnerVoice(page: SeoLandingPage) {
  const v = pageVars(page);
  const pair = pick(page.slug, INNER_MONOLOGUE[page.category], "inner");
  return {
    inHead: fill(pair.inHead, v),
    reality: fill(pair.reality, v),
  };
}

function buildRant(page: SeoLandingPage) {
  const v = pageVars(page);
  return {
    title: fill(pick(page.slug, RANT_TITLES, "rant-title"), v),
    body: fill(pick(page.slug, RANTS[page.category], "rant-body"), v),
  };
}

function buildAnalogy(page: SeoLandingPage) {
  const v = pageVars(page);
  const a = pick(page.slug, ANALOGIES[page.category], "analogy");
  return {
    title: fill(a.title, v),
    setup: fill(a.setup, v),
    punchline: fill(a.punchline, v),
  };
}

function buildNightmare(page: SeoLandingPage) {
  const v = pageVars(page);
  const items = pickMany(page.slug, NIGHTMARES[page.category], 4, "nightmare").map((item) =>
    fill(item, v),
  );
  return {
    title: fill(`Nachtmerries die ik zie bij {kw}`, v),
    items,
  };
}

function buildConfession(page: SeoLandingPage) {
  const v = pageVars(page);
  const c = pick(page.slug, CONFESSIONS, "confession");
  return {
    title: fill(c.title, v),
    body: fill(c.body, v),
  };
}

function buildLocalColor(page: SeoLandingPage) {
  if (!page.location?.city) return undefined;
  const v = pageVars(page);
  const profile = cityProfile(page.location.city);
  const isApeldoorn = page.location.city === "Apeldoorn";
  const vars = {
    ...v,
    ondernemerstype: profile.ondernemerstype,
  };

  const title = isApeldoorn
    ? "Apeldoorn: thuisbasis, geen postbus-SEO"
    : fill(pick(page.slug, LOCAL_COLOR_TITLES, "local-title"), v);

  const pickedBodies = pickMany(page.slug, LOCAL_COLOR_BODY_BANK, 3, "local-body").map((p) =>
    fill(p, v),
  );

  const intro = isApeldoorn
    ? `Ik ben gevestigd in Apeldoorn. ${profile.detail} ${profile.zoekgedrag}.`
    : `${page.location.city} in ${page.location.region ?? "de regio"}: ${profile.detail} ${profile.zoekgedrag}.`;

  const ondernemerLine = `Je klant in ${page.location.city} is vaak ${profile.ondernemerstype}. Die ruikt template-copy en wil bewijs, geen '{city}' in een H1.`;

  return {
    title,
    paragraphs: [intro, ondernemerLine, ...pickedBodies].map((p) => fill(p, vars)),
  };
}

export function enrichSeoLandingPage(page: SeoLandingPage): EnrichedSeoLandingPage {
  const editorial = applyEditorialProfile(page);
  const varied = variateSeoLandingPage(editorial);
  let ready = applyCityTrioLayer(varied);
  ready = applyApeldoornCityLayer(ready);
  ready = applyRegionalCityLayer(ready);
  if (ready.sceneBreaks?.length) {
    ready = {
      ...ready,
      sceneBreaks: resolveUniqueScenes(ready, ready.sceneBreaks),
    };
  }
  const kennisbankPool = KENNISBANK_BY_CATEGORY[ready.category];
  const kennisbankSlug = pick(ready.slug, kennisbankPool, "kb");
  const headline = buildDisplayHeadline(ready);
  const extraFaqs = ready.lockContent ? [] : buildExpandedExtraFaqs(ready);
  const faq = [...ready.faq, ...extraFaqs].filter(
    (f, i, arr) => arr.findIndex((x) => x.question === f.question) === i,
  );
  const expertSummary = buildExpertSummary(ready);

  return {
    ...ready,
    uniqueOpener: buildUniqueOpener(ready),
    painSectionIntro: buildPainSectionIntro(ready),
    metaTitle: trimMetaTitle(ready.metaTitle),
    metaDescription: buildUniqueMetaDescription(ready),
    headline: headline.headline,
    headlineAccent: headline.headlineAccent,
    faq,
    story: ready.enrichedOverrides?.story ?? buildStory(ready),
    scenario: ready.enrichedOverrides?.scenario ?? buildScenario(ready),
    deepDive: ready.enrichedOverrides?.deepDive ?? buildDeepDive(ready),
    myths: buildMyths(ready),
    weirdFact: buildWeirdFact(ready),
    honestNo: buildHonestNo(ready),
    thisWeek: buildThisWeek(ready),
    kennisbankSlug,
    coffeeChat: buildCoffeeChat(ready),
    innerVoice: buildInnerVoice(ready),
    rant: buildRant(ready),
    analogy: buildAnalogy(ready),
    nightmare: buildNightmare(ready),
    confession: buildConfession(ready),
    localColor: buildLocalColor(ready),
    expertSummary,
    keyTakeaways: buildKeyTakeaways(ready),
    schemaFaqs: buildSchemaFaqs(ready, faq),
    toc: PAGE_TOC,
  };
}
