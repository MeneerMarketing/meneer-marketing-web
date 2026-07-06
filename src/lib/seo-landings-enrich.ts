import type { SeoLandingCategory, SeoLandingFaq, SeoLandingPage } from "@/data/seo-landings/types";
import {
  buildDisplayHeadline,
  buildExpertSummary,
  buildKeyTakeaways,
  buildSchemaFaqs,
  buildUniqueMetaDescription,
  trimMetaTitle,
} from "@/lib/seo-landings-meta";
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
  "Je hebt een maand. Geen jaar. Je wilt dat {kw} iets oplevert dat je team voelt in de inbox of in de omzet. Wat ik dan niet doe: alles tegelijk aan, zes kanalen openen en hopen dat er eentje raak is.",
  "Wat ik wel doe: eerst meten wat er al gebeurt, dan het grootste lek dichten. Soms is dat je site. Soms je feed. Soms je zoektermenrapport dat niemand ooit opent. Pas daarna budget omhoog.",
  "Het voelt minder sexy dan 'we schalen direct'. Het voelt wel als een plan dat je bankrekening snapt.",
  "Je hebt al iets laten doen. Er is een site, misschien ads, misschien een bureau dat je maandelijks een PDF stuurt. Maar {kw} voelt als geld in een automaat die soms wat uitspuugt en soms slikt.",
  "Dan begin ik niet met verwijten. Ik begin met lezen. Account, analytics, landings op mobiel, zoektermen, marges. Vaak vind ik winst in een week die maandenlang openlag.",
  "Soms is het antwoord: stoppen met een kanaal. Dat zeg ik ook. Liever eerlijk dan een retainer voor sentiment.",
  "In {city} zie ik vaak dat ondernemers denken dat lokaal automatisch betekent: adres op de site. Google is strenger. Je profiel, reviews en landings moeten mee.",
  "Je concurrent adverteert al op '{kw}'. Jij twijfelt nog. Elke week wachten is een week dat hij data verzamelt en jij niet.",
  "Als je marge op je belangrijkste product te laag is voor ads, zeg ik dat hardop. Dan is SEO of je site slimmer dan branden.",
  "SkinComplete groeide eerst organisch. BestRest kreeg per product een plan. Jij krijgt geen copy-paste. Wel een volgorde die klopt.",
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
    paragraphs.push(
      `${page.location.city} voelt als ${profile.vibe}. ${profile.zoekgedrag}. ${profile.detail} Dat is geen algemene SEO-praat. Dat is waarom jouw pagina op /zoeken/${page.slug} niet hetzelfde mag klinken als een template uit Amsterdam.`,
    );
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

function buildExtraFaq(page: SeoLandingPage): readonly SeoLandingFaq[] {
  const v = pageVars(page);
  const faqPool: SeoLandingFaq[] = [
    {
      question: `Wat maakt jullie {kw} anders dan een standaard bureau?`,
      answer:
        "Ik bouw en optimaliseer zelf: site, landings, tracking, campagnes. Geen keten van specialisten die elkaar de schuld geven. Eén aanspreekpunt, één plan.",
    },
    {
      question: "Werken jullie ook voor kleinere budgetten?",
      answer:
        "Ja, als de rekensom klopt. Liever een klein budget met strakke focus dan een groot budget zonder plan. In intake rekenen we door wat realistisch is.",
    },
    {
      question: `Hoe snel kunnen we starten met {kw}?`,
      answer:
        "Intake en plan vaak binnen een week. Uitvoering hangt af van scope: een audit is sneller dan een volledige shop rebuild.",
    },
    {
      question: `Moet ik al verkeer hebben voor {kw}?`,
      answer:
        "Niet per se. Wel helpt data. Geen data? Dan bouwen we eerst meetpunten en een fundament. Gokken op zwart is geen strategie.",
    },
    {
      question: "Wat als het niet werkt?",
      answer:
        "Dan zeg ik waarom en wat we anders doen of stoppen. Ik verleng geen retainer omdat de kalender dat zegt. Cijfers bepalen.",
    },
  ].map((f) => ({
    question: fill(f.question, v),
    answer: f.answer,
  }));

  const picked = pickMany(page.slug, faqPool, 3, "extra-faq");

  if (page.location?.city) {
    const cityQ = page.location.city === "Apeldoorn"
      ? {
          question: "Zit Meneer Marketing echt in Apeldoorn?",
          answer: fill(
            "Ja. Apeldoorn is thuisbasis. Ik werk hier met MKB op de Veluwe en pak ook landelijke opdrachten aan. {kw} bespreek ik met je cijfers open, niet vanuit een postbus in de Randstad.",
            v,
          ),
        }
      : {
          question: `Zijn jullie alleen actief in ${page.location.city}?`,
          answer: fill(
            `Ik ken {city} en {region} goed, maar pak ook landelijke opdrachten. {kw} werkt overal met dezelfde principes: fundament eerst, dan schalen.`,
            v,
          ),
        };
    picked.push(cityQ);
  }

  return picked;
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

  return {
    title: isApeldoorn
      ? "Apeldoorn: thuisbasis, geen postbus-SEO"
      : fill(`{city} is geen generieke footer-regio`, v),
    paragraphs: isApeldoorn
      ? [
          `Ik ben gevestigd in Apeldoorn. ${profile.detail} ${profile.zoekgedrag}.`,
          `MKB op de Veluwe wil ${profile.ondernemerstype}. {kw} van een bureau dat hier zit voelt anders dan een template met 'Apeldoorn' in de footer van een site uit Amsterdam.`,
          `Je bereik gaat verder dan de stad: Deventer, Amersfoort, Arnhem, Zwolle. Maar je fundament begint waar jij staat. Voor mij is dat Apeldoorn.`,
          fill(
            `Online concurreer je met iedereen die ads op '{city}' en '{region}' target. Lokaal winnen is snelheid, vertrouwen en een site die op mobiel niet uit elkaar valt.`,
            v,
          ),
        ].map((p) => fill(p, v))
      : [
          `${page.location.city} in ${page.location.region ?? "de regio"}: ${profile.detail} ${profile.zoekgedrag}.`,
          `Je klant in ${page.location.city} is vaak ${profile.ondernemerstype}. Die ruikt template-copy. Die wil bewijs dat je de regio snapt, niet alleen je postcode kent.`,
          fill(
            `Online concurreer je in {city} met iedereen die ads op jouw regio zet, ook buiten {region}. Lokaal winnen bij {kw} is geen adres in de footer. Het is relevantie, snelheid en vertrouwen.`,
            v,
          ),
        ],
  };
}

export function enrichSeoLandingPage(page: SeoLandingPage): EnrichedSeoLandingPage {
  const kennisbankPool = KENNISBANK_BY_CATEGORY[page.category];
  const kennisbankSlug = pick(page.slug, kennisbankPool, "kb");
  const headline = buildDisplayHeadline(page);
  const faq = [...page.faq, ...buildExtraFaq(page)];
  const expertSummary = buildExpertSummary(page);

  return {
    ...page,
    metaTitle: trimMetaTitle(page.metaTitle),
    metaDescription: buildUniqueMetaDescription(page),
    headline: headline.headline,
    headlineAccent: headline.headlineAccent,
    faq,
    story: buildStory(page),
    scenario: buildScenario(page),
    deepDive: buildDeepDive(page),
    myths: buildMyths(page),
    weirdFact: buildWeirdFact(page),
    honestNo: buildHonestNo(page),
    thisWeek: buildThisWeek(page),
    kennisbankSlug,
    coffeeChat: buildCoffeeChat(page),
    innerVoice: buildInnerVoice(page),
    rant: buildRant(page),
    analogy: buildAnalogy(page),
    nightmare: buildNightmare(page),
    confession: buildConfession(page),
    localColor: buildLocalColor(page),
    expertSummary,
    keyTakeaways: buildKeyTakeaways(page),
    schemaFaqs: buildSchemaFaqs(page, faq),
    toc: PAGE_TOC,
  };
}
