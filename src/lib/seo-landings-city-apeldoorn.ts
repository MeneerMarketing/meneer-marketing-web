import { SEO_CITY_REGISTRY } from "@/data/seo-landings/city-registry";
import type {
  SeoLandingCategory,
  SeoLandingPage,
  SeoLandingSceneBreak,
  SeoLandingStep,
} from "@/data/seo-landings/types";
import {
  cityProfile,
  fill,
  pageVars,
  pick,
  pickMany,
} from "@/lib/seo-landings-voice";

function resolveBaseSlug(slug: string): string {
  for (const city of SEO_CITY_REGISTRY) {
    const suffix = `-${city.slug}`;
    if (slug.endsWith(suffix)) {
      return slug.slice(0, -suffix.length);
    }
  }
  return slug;
}

const APELDOORN_PAIN_POOL: Record<
  SeoLandingCategory,
  readonly { title: string; body: string }[]
> = {
  "google-ads": [
    {
      title: "Ads zonder Veluwe-context",
      body: "Bureau op afstand target {region} zonder {kw} lokaal te snappen. Message match en vertrouwen missen.",
    },
    {
      title: "Budget vóór tracking",
      body: "Campagnes live in Apeldoorn terwijl GA4 en conversies nog niet kloppen. Gokken met MKB-geld.",
    },
    {
      title: "Landings uit Randstad",
      body: "Generieke pagina's voor {kw}. Ondernemers in Apeldoorn merken template-copy binnen seconden.",
    },
    {
      title: "Account zonder eigenaar",
      body: "Maandelijks rapport, niemand die wekelijks zoektermen leest. Leaks blijven open.",
    },
    {
      title: "Shopping op vieze feed",
      body: "Productdata inconsistent. Ads duurder dan nodig voor webshops rond Apeldoorn.",
    },
  ],
  seo: [
    {
      title: "Postbus-SEO",
      body: "Adres in footer, verder niets. {kw} in Apeldoorn vraagt GBP, reviews en echte landings.",
    },
    {
      title: "Rapport zonder live pagina",
      body: "SEO-advies voor {region}, maar niemand publiceert. Posities stilstaan.",
    },
    {
      title: "Volume boven marge",
      body: "Ranken op termen die Veluwe-MKB niet koopt. Mooie grafiek, lege inbox.",
    },
    {
      title: "AI-zoek genegeerd",
      body: "ChatGPT kent je niet. Concurrent wel, omdat die antwoord-pagina's heeft.",
    },
    {
      title: "Techniek blijft liggen",
      body: "Crawl errors, trage mobiel. Advies in Drive, site in Apeldoorn wacht.",
    },
  ],
  website: [
    {
      title: "Theme-plafond",
      body: "{kw} via page builder remt groei in {region}. Custom build schaalt mee met campagnes.",
    },
    {
      title: "Mobiel afterthought",
      body: "Veluwe-ondernemers zoeken op telefoon. Trage site = backup-optie.",
    },
    {
      title: "Geen landings voor ads",
      body: "Google Ads en Meta Ads naar homepage. Duur in Apeldoorn en daarbuiten.",
    },
    {
      title: "Bouwer verdwenen",
      body: "Site live, vragen over tracking? Radio stilte. Thuisbasis helpt, maar alleen als iemand opneemt.",
    },
    {
      title: "Mooi zonder conversie",
      body: "Design award in je hoofd, lege formulieren in GA4. {kw} moet verkopen.",
    },
  ],
  shopify: [
    {
      title: "Theme zonder B2B",
      body: "Salons en zakelijke klanten in {region} willen self-service. Excel naast shop is keuze.",
    },
    {
      title: "Feed en SEO los",
      body: "Shopping en organisch delen productdata niet. Dubbel werk, dubbele fouten.",
    },
    {
      title: "Apps die CWV slopen",
      body: "Elke plugin kost milliseconden. {kw} op mobiel lijdt eronder.",
    },
    {
      title: "Checkout lekt",
      body: "Cart abandon hoog terwijl ads draaien. Gratis geld onbenut.",
    },
    {
      title: "Migratie-angst",
      body: "WooCommerce vast, Shopify spannend. Geen plan = rankings gok.",
    },
  ],
  content: [
    {
      title: "Bulk zonder stem",
      body: "AI-blogs die niemand leest. {kw} vraagt antwoorden die ranken én converteren.",
    },
    {
      title: "Geen interne links",
      body: "Content eilanden. Autoriteit stroomt niet naar dienstpagina's.",
    },
    {
      title: "Vragen van klanten genegeerd",
      body: "Support-mail is gratis contentplan. Toch maandelijks random topics.",
    },
    {
      title: "AI-zichtbaarheid nul",
      body: "Geen pagina's die ChatGPT kan citeren. {region} concurrence wél.",
    },
    {
      title: "Content los van site",
      body: "Blogs ranken niet omdat techniek en structuur achterlopen.",
    },
  ],
  "b2b-portal": [
    {
      title: "Orders in mail",
      body: "B2B in Apeldoorn typt nog handmatig. {kw} automatiseert uren per week.",
    },
    {
      title: "Geen self-service",
      body: "Zakelijke klanten willen online bestellen. PDF en telefoon remmen groei.",
    },
    {
      title: "Leads in Gmail",
      body: "Formulieren zonder flow. Opvolging hapert in {region}.",
    },
    {
      title: "Excel als eindstation",
      body: "Shopify B2B kan. Toch parallel spreadsheet. Dubbel werk.",
    },
    {
      title: "Automatisering zonder plan",
      body: "n8n/Make geïnstalleerd, niets gekoppeld. {kw} begint bij één workflow die tijd teruggeeft.",
    },
  ],
};

const APELDOORN_PROCESS: Record<
  SeoLandingCategory,
  readonly (readonly SeoLandingStep[])[]
> = {
  "google-ads": [
    [
      {
        title: "Intake in Apeldoorn",
        body: "Thuisbasis: cijfers open, geen salescircus. Waar zit je met {kw}?",
      },
      {
        title: "Account & tracking",
        body: "Zoektermen, conversies, landings op mobiel. Lekken dicht vóór opschalen.",
      },
      {
        title: "Campagnes + landings",
        body: "Google Ads, Meta Ads waar passend. Message match, ik fix pagina's zelf.",
      },
      {
        title: "Wekelijks bijsturen",
        body: "Budget naar winnaars. Rapport met besluit, niet alleen dashboard.",
      },
    ],
    [
      {
        title: "Baseline Veluwe",
        body: "Wat draait al in {region}? Marges, feed, site-snelheid.",
      },
      {
        title: "Structuur op intentie",
        body: "Search, Shopping, remarketing. Geen alles-in-één-zak.",
      },
      {
        title: "Live + test",
        body: "Landings die {kw} uitleggen voor Apeldoorn en beyond.",
      },
      {
        title: "ROAS-review",
        body: "Opschalen als breakeven klopt. Stoppen als marge niet volgt.",
      },
    ],
  ],
  seo: [
    [
      {
        title: "Audit lokaal + nationaal",
        body: "GBP, site, rankings. Apeldoorn-context, niet postbus.",
      },
      {
        title: "Prioriteit op marge",
        body: "Welke pagina's leveren leads in {region}? Die eerst.",
      },
      {
        title: "Bouwen & publiceren",
        body: "Ik schrijf én zet live. Geen wachten op derden voor {kw}.",
      },
      {
        title: "Bijsturen op omzet",
        body: "Posities plus pipeline. AI-zoek meenemen.",
      },
    ],
    [
      {
        title: "Techniek fixen",
        body: "Crawl, CWV, schema. Fundament vóór content-stapelen.",
      },
      {
        title: "Keyword-kaart",
        body: "Koopintentie Veluwe en landelijk waar relevant.",
      },
      {
        title: "Landings live",
        body: "Antwoord-pagina's voor {kw}. Custom, snel.",
      },
      {
        title: "Lokaal versterken",
        body: "Reviews, GBP, interne links. Apeldoorn online kloppend.",
      },
    ],
  ],
  website: [
    [
      {
        title: "Doel & structuur",
        body: "Wie moet wat doen? Sitemap vóór design voor {kw}.",
      },
      {
        title: "Custom build",
        body: "Next.js from scratch. Snelheid, schema, tracking ingebouwd.",
      },
      {
        title: "Test op mobiel",
        body: "Veluwe-verkeer is mobiel. Alles getest vóór launch.",
      },
      {
        title: "Launch + groei",
        body: "Indexeren, landings voor campagnes. Klaar voor ads.",
      },
    ],
    [
      {
        title: "Audit huidige site",
        body: "Waar lekt {kw}? Snelheid, CTA, vertrouwen.",
      },
      {
        title: "Copy + UX",
        body: "Teksten die Apeldoorn én landelijk overtuigen.",
      },
      {
        title: "Bouwen in code",
        body: "Geen page builder. Controle over elke URL.",
      },
      {
        title: "Overdracht",
        body: "Documentatie, tracking. Jij bent niet gevangen.",
      },
    ],
  ],
  shopify: [
    [
      {
        title: "Shop-diagnose",
        body: "Theme, apps, feed, checkout. Waar knelt marge in {region}?",
      },
      {
        title: "Custom waar nodig",
        body: "B2B, portalen, unieke flows. SkinComplete-model.",
      },
      {
        title: "SEO + feed",
        body: "Productdata klopt voor organisch en Shopping.",
      },
      {
        title: "Mail & ads klaar",
        body: "Flows live vóór budget opschalen.",
      },
    ],
    [
      {
        title: "Scope Apeldoorn",
        body: "Assortiment, groei, integraties. Eerlijk over Shopify-fit.",
      },
      {
        title: "Theme & snelheid",
        body: "CWV groen bij launch. Geen app-hel.",
      },
      {
        title: "Migratie of rebuild",
        body: "Redirects, data, test checkout op 4G.",
      },
      {
        title: "Marketing-lijn",
        body: "{kw} gekoppeld aan campagnes en mail.",
      },
    ],
  ],
  content: [
    [
      {
        title: "Vragen verzamelen",
        body: "Wat stellen klanten in Apeldoorn en online? Dat wordt content.",
      },
      {
        title: "Antwoord-pagina's",
        body: "Eén intentie per URL. Geen bulk-ruis.",
      },
      {
        title: "Interne links",
        body: "Autoriteit vanaf sterkste pagina's naar {kw}.",
      },
      {
        title: "AI + Google",
        body: "Pagina's die citeerbaar zijn in 2026.",
      },
    ],
  ],
  "b2b-portal": [
    [
      {
        title: "Proces in kaart",
        body: "Orders, leads, mail. Waar kost handwerk uren in {region}?",
      },
      {
        title: "Portal of flow",
        body: "Self-service, prijslijsten, koppelingen. Shopify B2B waar past.",
      },
      {
        title: "Bouwen & testen",
        body: "n8n/Make, formulieren, CRM. Eén lijn.",
      },
      {
        title: "Tijd terug meten",
        body: "Uren bespaard per week. Opschalen wat werkt.",
      },
    ],
  ],
};

const APELDOORN_STORY_TITLES: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "{kw} vanuit Apeldoorn: thuisbasis, geen postbus",
    "Ads in {region} met iemand die je landings opent",
    "Google Ads en Meta Ads voor Veluwe-MKB",
  ],
  seo: [
    "{kw} in Apeldoorn zonder rapportenla",
    "Vindbaarheid vanaf de Veluwe, landelijk schaalbaar",
    "SEO in {region} met uitvoering, niet alleen advies",
  ],
  website: [
    "{kw} from scratch, gebouwd in Apeldoorn",
    "Site voor Veluwe-ondernemers die online willen winnen",
    "Custom build voor {kw}, geen template uit de Randstad",
  ],
  shopify: [
    "{kw} met shop die meegroeit",
    "Shopify in Apeldoorn: SkinComplete-model",
    "Webshop voor {region} die campagnes aankan",
  ],
  content: [
    "{kw} die rankt én converteert",
    "Content vanuit Apeldoorn, niet AI-bulk",
    "Antwoorden voor {region} die Google en AI snappen",
  ],
  "b2b-portal": [
    "{kw} voor MKB dat groeit zonder handwerk",
    "B2B in Apeldoorn: minder mail, meer portal",
    "Automatisering die tijd teruggeeft in {region}",
  ],
};

const APELDOORN_STORY_OPENERS: readonly string[] = [
  "Apeldoorn is thuisbasis van Meneer Marketing. Ik zit niet in een postbus in Amsterdam. {kw} bespreek ik met je alsof we aan tafel zitten, met cijfers open en een plan dat je begrijpt.",
  "Veluwe-MKB werkt hard en heeft weinig geduld voor bureau-theater. {kw} in Apeldoorn moet deze maand iets opleveren, niet vol kwartaal in slides.",
  "Je concurreert online met iedereen die {region} target, ook buiten Gelderland. {kw} wint op snelheid, relevantie en vertrouwen, niet op hardste schreeuwer.",
  "Offline ken je mensen in Apeldoorn. Online moet hetzelfde vertrouwen voelbaar zijn. Generieke copy met 'Apeldoorn' in de H1 werkt niet.",
  "Van Osseveld tot Ugchelen, van centrum tot bedrijventerreinen richting Deventer: je markt is breder dan je postcode. {kw} moet dat aankunnen.",
];

const APELDOORN_STORY_MIDDLES: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "Ik beheer accounts zelf, fix landings en zet tracking goed vóór opschalen. Google Ads en Meta Ads expliciet in het plan, niet verstopt achter jargon.",
    "SkinComplete schaalde ads na organisch bewijs. BestRest per product bekeken. Die volgorde geldt ook voor Veluwe-ondernemers.",
  ],
  seo: [
    "Ik schrijf, bouw en publiceer. Geen PDF die in Drive verrot. GBP, reviews en landings voor {kw} in één lijn.",
    "12 jaar Google plus AI-zoek in 2026. Pagina's die ChatGPT kunnen citeren, niet keyword-lists uit 2014.",
  ],
  website: [
    "Custom Next.js of Shopify. Snelheid, schema, landings en tracking vóór je trots de link deelt. Geen page builder die vastloopt bij groei.",
    "MeneerMarketing.nl zelf, klantportalen en shops: from scratch in Apeldoorn, schaalbaar landelijk.",
  ],
  shopify: [
    "SkinComplete draait op custom Shopify met B2B, SEO en mail gekoppeld. {kw} volgt dat model waar het past.",
    "Feed, checkout en abandoned cart horen standaard. Ads opschalen op lekkende shop is lerngeld.",
  ],
  content: [
    "Vragen van klanten worden antwoord-pagina's. Eén intentie per URL, interne links vanaf je sterkste content.",
    "AI als hulpmiddel, niet als bulk-vervanger van je stem. {kw} moet menselijk klinken.",
  ],
  "b2b-portal": [
    "Leads horen niet in Gmail te sterven. Portalen, flows en koppelingen knopen je stack aan elkaar.",
    "Tel uren op handmatig werk vóór je bouwt. {kw} moet zichzelf terugverdienen.",
  ],
};

const APELDOORN_DEEPDIVE: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "{kw} in Apeldoorn: je betaalt per klik. Landings en tracking moeten kloppen vóór budget omhoog. Message match is geen detail, het is marge.",
    "Thuisbasis betekent korte lijnen. Geen accountmanager die je shop nooit opende. Ik lees zoektermen, fix pagina's, stuur bij op ROAS.",
    "Veluwe-ondernemers adverteren soms tegen Randstad-bureaus die {region} als targeting zien. Jij wint op relevantie en snelheid.",
    "Google Ads en Meta Ads samen in één strategie als beide passen. Zelfde landings, andere hooks. Geen silo's.",
  ],
  seo: [
    "Lokaal ranken in Apeldoorn vraagt GBP, reviews, landings en techniek. Footer-adres alleen is postbus-SEO.",
    "Organisch fundament vóór ads opschalen. SkinComplete-gedachte werkt ook voor salon, maakbedrijf of dienstverlener op de Veluwe.",
    "AI-zoek: antwoord-pagina's, schema, updates op oude content. {kw} in 2026 is Google én ChatGPT.",
    "Ik meet op leads en omzet, niet alleen positie. Ranking zonder pipeline is decoratie.",
  ],
  website: [
    "{kw} from scratch: controle over snelheid, landings en integraties. Theme-plafond remt campagnes.",
    "Mobiel-first is realiteit in {region}. Core Web Vitals zijn ranking én conversie.",
    "Landings per dienst of campagne. Homepage is geen vangnet voor al je ads.",
    "After launch blijf ik betrokken. Site aanpassen, meten, bijbouwen. Geen bouwer die verdwijnt.",
  ],
  shopify: [
    "Shopify in Apeldoorn: B2B, retail of beide. Custom theme waar theme store stopt.",
    "Product-SEO en Shopping-feed delen data. Inconsistentie kost organisch én paid.",
    "Abandoned cart is gratis geld. Flows horen standaard vóór ads schalen.",
    "Migratie met redirects. Organische dip is geen must als je het plant.",
  ],
  content: [
    "Content die rankt én in AI-antwoorden geciteerd kan worden. Bulk-blogs zonder diepgang verdwijnen.",
    "Interne links vanaf homepage en sterkste pagina's. Autoriteit stromen, niet stapelen.",
    "Vragen uit support en sales worden je contentplan. {kw} schrijft zichzelf.",
  ],
  "b2b-portal": [
    "B2B in {region} loopt vaak via mail en Excel. {kw} automatiseert wat nu uren kost.",
    "Self-service moet makkelijker zijn dan bellen. Portalen op Shopify waar het past.",
    "n8n/Make koppelingen zonder dubbel typen. Eén workflow die direct tijd teruggeeft.",
  ],
};

const APELDOORN_SCENES: Record<SeoLandingCategory, readonly SeoLandingSceneBreak[]> = {
  "google-ads": [
    {
      placement: "after-story",
      visual: "google-ads",
      eyebrow: "Apeldoorn · thuisbasis",
      title: "{kw} met landings in dezelfde handen",
      caption: "Google Ads, Meta Ads, tracking. Geen bureau op afstand dat alleen dashboards stuurt.",
    },
  ],
  seo: [
    {
      placement: "after-story",
      visual: "local-maps",
      eyebrow: "Veluwe · lokaal",
      title: "GBP en site die samen scoren",
      caption: "{kw} in Apeldoorn: profiel, reviews, landings op lokale intentie.",
    },
    {
      placement: "after-deep-dive",
      visual: "ai-search",
      eyebrow: "2026",
      title: "Vindbaar in Google én AI",
      caption: "Antwoord-pagina's die ChatGPT en Gemini kunnen citeren.",
    },
  ],
  website: [
    {
      placement: "after-story",
      visual: "website-build",
      eyebrow: "From scratch · HQ",
      title: "Gebouwd in Apeldoorn, schaalbaar landelijk",
      caption: "Next.js custom. Snel, SEO-klaar, klaar voor campagnes.",
    },
  ],
  shopify: [
    {
      placement: "after-story",
      visual: "webshop",
      eyebrow: "Shopify · Apeldoorn",
      title: "Shop die feed, mail en ads koppelt",
      caption: "SkinComplete-model: B2B, SEO, flows onder één dak.",
    },
  ],
  content: [
    {
      placement: "after-deep-dive",
      visual: "content-hub",
      eyebrow: "Content · Veluwe",
      title: "Antwoorden die ranken",
      caption: "{kw}: owned content op je domein, geen bulk-ruis.",
    },
  ],
  "b2b-portal": [
    {
      placement: "after-aanpak",
      visual: "b2b-portal",
      eyebrow: "B2B · Apeldoorn",
      title: "Minder handmatig, meer orders",
      caption: "Portalen en flows die tijd teruggeven aan je team.",
    },
  ],
};

const APELDOORN_HOT_TAKES: readonly { label: string; body: string }[] = [
  {
    label: "Thuisbasis",
    body: "{kw} vanuit Apeldoorn betekent: korte lijn, cijfers open, geen Randstad-postbus.",
  },
  {
    label: "Eerlijk",
    body: "Veluwe-MKB heeft geen tijd voor retainer-theater. {kw} moet live werk opleveren.",
  },
  {
    label: "Meneer zegt",
    body: "Als je alleen 'Apeldoorn' in je H1 plakt, ruikt iedereen template-SEO. Inclusief Google.",
  },
];

const APELDOORN_PROOF = [
  "Meneer Marketing is gevestigd in Apeldoorn. SkinComplete, BestRest en MeneerMarketing.nl: gebouwd from scratch, landelijk schaalbaar. {kw} krijgt diezelfde hands-on aanpak.",
  "Thuisbasis Veluwe betekent: ik ken {region}, ik open je shop en accounts zelf, en ik zeg nee als {kw} niet past bij je marge.",
  "Praktijk uit Apeldoorn, resultaat landelijk. Geen slides-fabriek, wel pagina's en campagnes die live gaan.",
];

const APELDOORN_PROCESS_TITLES: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": ["{kw} vanuit Apeldoorn", "Ads met Veluwe-context", "Campagnes + landings HQ"],
  seo: ["SEO hands-on Apeldoorn", "{kw} met uitvoering", "Vindbaarheid Veluwe + NL"],
  website: ["Bouwen in Apeldoorn", "{kw} from scratch", "Site klaar voor groei"],
  shopify: ["Shopify traject HQ", "{kw} op maat", "Shop + marketing één lijn"],
  content: ["Content die rankt", "{kw} op antwoorden", "Owned content Apeldoorn"],
  "b2b-portal": ["B2B automatiseren", "{kw} zonder Excel", "Portal + flows HQ"],
};

function buildApeldoornStory(page: SeoLandingPage): {
  title: string;
  paragraphs: string[];
} {
  const v = pageVars(page);
  const profile = cityProfile("Apeldoorn");
  const title = fill(
    pick(page.slug, APELDOORN_STORY_TITLES[page.category], "apel-story-title"),
    v,
  );
  const opener = fill(pick(page.slug, APELDOORN_STORY_OPENERS, "apel-open"), v);
  const middles = pickMany(
    page.slug,
    APELDOORN_STORY_MIDDLES[page.category],
    2,
    "apel-mid",
  ).map((p) => fill(p, v));
  const closer = fill(
    pick(page.slug, [
      `${profile.detail} Ondernemers in Apeldoorn zijn ${profile.ondernemerstype}. Deze pagina over ${page.primaryKeyword} is daarop geschreven.`,
      `${profile.zoekgedrag} {kw} vanuit thuisbasis Apeldoorn, niet vanuit template met stadnaam erachter.`,
      `Van centrum tot Ugchelen: je markt is Veluwe en verder. {kw} moet online net zo overtuigen als offline.`,
    ], "apel-close"),
    v,
  );
  return { title, paragraphs: [opener, ...middles, closer] };
}

function buildApeldoornDeepDive(page: SeoLandingPage): {
  title: string;
  paragraphs: string[];
} {
  const v = pageVars(page);
  const titles = [
    `{kw} in Apeldoorn: onder de motorkap`,
    `Dieper op {kw} vanaf de Veluwe`,
    `Wat {kw} in thuisbasis praktijk betekent`,
  ];
  return {
    title: fill(pick(page.slug, titles, "apel-deep-title"), v),
    paragraphs: pickMany(
      page.slug,
      APELDOORN_DEEPDIVE[page.category],
      4,
      "apel-deep-body",
    ).map((p) => fill(p, v)),
  };
}

/**
 * Unieke contentlaag voor alle Apeldoorn-varianten (~45 pagina's).
 * Thuisbasis Meneer Marketing: Veluwe-context, HQ-proof, eigen story/deep-dive.
 */
export function applyApeldoornCityLayer(page: SeoLandingPage): SeoLandingPage {
  if (page.location?.city !== "Apeldoorn") return page;

  const v = pageVars(page);
  const hotTake = pick(page.slug, APELDOORN_HOT_TAKES, "apel-hot");
  const proofBody = fill(pick(page.slug, APELDOORN_PROOF, "apel-proof"), v);
  const processVariant = pick(page.slug, APELDOORN_PROCESS[page.category], "apel-process");
  const processSteps = processVariant.map((step) => ({
    title: fill(step.title, v),
    body: fill(step.body, v),
  }));
  const processTitle = fill(
    pick(page.slug, APELDOORN_PROCESS_TITLES[page.category], "apel-process-title"),
    v,
  );
  const pains = pickMany(
    page.slug,
    APELDOORN_PAIN_POOL[page.category],
    3,
    "apel-pains",
  ).map((p) => ({
    title: fill(p.title, v),
    body: fill(p.body, v),
  }));
  const sceneBreaks = APELDOORN_SCENES[page.category].map((scene) => ({
    ...scene,
    eyebrow: fill(scene.eyebrow, v),
    title: fill(scene.title, v),
    caption: scene.caption ? fill(scene.caption, v) : undefined,
  }));

  return {
    ...page,
    pains,
    processSteps,
    processTitle,
    proofBody,
    hotTake: {
      label: hotTake.label,
      body: fill(hotTake.body, v),
    },
    sceneBreaks,
    enrichedOverrides: {
      ...page.enrichedOverrides,
      story: buildApeldoornStory(page),
      deepDive: buildApeldoornDeepDive(page),
    },
  };
}
