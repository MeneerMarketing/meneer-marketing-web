import { SEO_CITY_REGISTRY } from "@/data/seo-landings/city-registry";
import { DEEPDIVE_BATCH2_BATCH3 } from "@/lib/seo-landings-deepdives-batch2-3";
import { DEEPDIVE_BATCH4 } from "@/lib/seo-landings-deepdives-batch4";
import { DEEPDIVE_BATCH5_EXTRA } from "@/lib/seo-landings-deepdives-batch5-extra";
import { STORY_BATCH4 } from "@/lib/seo-landings-stories-batch4";
import {
  BATCH4_PROCESS,
  BATCH4_PROCESS_TITLES,
} from "@/lib/seo-landings-process-batch4";

const ALL_DEEPDIVES = {
  ...DEEPDIVE_BATCH2_BATCH3,
  ...DEEPDIVE_BATCH4,
  ...DEEPDIVE_BATCH5_EXTRA,
};
import { resolveUniqueScenes } from "@/lib/seo-landing-scenes";
import type {
  SeoLandingCategory,
  SeoLandingPage,
  SeoLandingSceneBreak,
  SeoLandingSectionId,
  SeoLandingStep,
  SeoLandingVisual,
} from "@/data/seo-landings/types";

const DEFAULT_PROCESS_TITLE = "Intake zonder salescircus";

interface EditorialConfig {
  processSteps?: readonly SeoLandingStep[];
  sceneBreaks?: readonly SeoLandingSceneBreak[];
  visual?: SeoLandingVisual;
  enrichedOverrides?: SeoLandingPage["enrichedOverrides"];
}

const BATCH2_SLUGS = new Set([
  "conversie-optimalisatie",
  "lokale-seo",
  "zoekmachine-optimalisatie",
  "technische-seo",
  "ppc-bureau",
  "e-commerce-marketing",
  "e-mailmarketing",
  "tiktok-ads-bureau",
  "leadgeneratie-website",
  "woocommerce-naar-shopify",
]);

const BATCH3_SLUGS = new Set([
  "google-ads-specialist",
  "google-ads-uitbesteden",
  "remarketing-google-ads",
  "facebook-ads-bureau",
  "instagram-ads-bureau",
  "shopify-webshop-laten-maken",
  "shopify-seo",
  "nextjs-website-laten-maken",
  "website-laten-bouwen",
  "seo-audit",
  "seo-uitbesteden",
  "linkbuilding-bureau",
  "online-marketing-manager",
  "performance-marketing-bureau",
  "cro-bureau",
  "tracking-google-analytics",
]);

const BATCH4_SLUGS = new Set([
  "digital-marketing-bureau",
  "zoekmachine-marketing",
  "advertentiebeheer",
  "social-media-advertising",
  "ugc-marketing",
  "influencer-marketing-bureau",
  "b2b-marketing-bureau",
  "ecommerce-specialist",
  "webshop-marketing",
  "productpagina-seo",
  "chatgpt-vindbaarheid",
  "google-maps-marketing",
  "webdesign-bureau",
  "growth-marketing-bureau",
  "linkedin-ads-bureau",
  "klaviyo-specialist",
  "core-web-vitals-verbeteren",
  "marketing-consultant-mkb",
  "trage-website-dure-ads",
  "shopify-theme-laten-maken",
]);

const TRIO_BASE_SLUGS = new Set([
  "website-laten-maken",
  "seo-specialist",
  "marketing-bureau",
]);

/** Handgeschreven originelen (pre-batch). */
const ORIGINAL_SLUGS = new Set([
  "google-ads-bureau",
  "google-ads-beheer",
  "hoger-in-google",
  "webshop-laten-maken",
  "content-marketing-vindbaarheid",
  "b2b-portaal-bouwen",
]);

/** Vergelijk-pagina's (batch4-vergelijk). */
const VERGELIJK_SLUGS = new Set([
  "google-ads-of-seo",
  "shopify-of-woocommerce",
  "meta-ads-of-google-ads",
  "bureau-of-freelancer-marketing",
]);

const CATEGORY_PROCESS: Record<SeoLandingCategory, readonly SeoLandingStep[]> = {
  "google-ads": [
    { title: "Account audit", body: "Zoektermen, conversies, landings. Wat lekt, wat wint." },
    { title: "Structuur & marge", body: "Campagnes per intentie. Budget naar wat converteert." },
    { title: "Live + landings", body: "Ads en pagina's matchen. Message match." },
    { title: "Wekelijks bijsturen", body: "Budget naar winnaars. Zoektermen schoon houden." },
  ],
  seo: [
    { title: "Baseline", body: "Rankings, techniek, concurrenten. Weten waar je staat." },
    { title: "Roadmap", body: "Welke pagina's eerst. Volgorde op impact en marge." },
    { title: "Bouwen & publiceren", body: "Landings schrijven en live zetten. Direct uitvoerbaar." },
    { title: "Posities + omzet", body: "Rankings én wat ze opleveren. Bijsturen op data." },
  ],
  website: [
    { title: "Doel & structuur", body: "Wie moet wat doen? Sitemap vóór pixels." },
    { title: "Design & copy", body: "Conversie, vertrouwen, duidelijke CTA." },
    { title: "Custom build", body: "Next.js of Shopify. Snelheid en SEO ingebouwd." },
    { title: "Launch & meten", body: "Tracking, indexatie, klaar voor campagnes." },
  ],
  shopify: [
    { title: "Shop audit", body: "Theme, apps, feed, checkout. Waar knelt het?" },
    { title: "Architectuur", body: "Custom waar de store limieten. B2B meedenken." },
    { title: "Bouwen & koppelen", body: "Shop, mail, portalen. Eén lijn." },
    { title: "Groei", body: "SEO en ads als de basis staat." },
  ],
  content: [
    { title: "Vragen inventariseren", body: "Wat zoeken en vragen klanten echt?" },
    { title: "Content-plan", body: "Pagina's per intentie. Alleen wat je klanten zoeken." },
    { title: "Schrijven & bouwen", body: "Landings live. Interne links mee." },
    { title: "Vindbaar houden", body: "Google én AI-antwoorden. Updates op data." },
  ],
  "b2b-portal": [
    { title: "Proces in kaart", body: "Handwerk tellen. Waar gaat tijd naar toe?" },
    { title: "Stack koppelen", body: "Shop, CRM, mail, facturatie." },
    { title: "Automatiseren", body: "Flows live. Minder copy-paste." },
    { title: "Meten", body: "Tijd terug en omzet per kanaal." },
  ],
};

/** National-extra originelen (pre-batch). */
const EXTRA_SLUGS = new Set([
  "meta-ads-bureau",
  "online-marketing-bureau",
  "shopify-expert",
  "google-shopping-ads",
  "vindbaarheid-ai",
  "landing-page-laten-maken",
  "marketing-automatisering",
  "sea-specialist",
]);

const CATEGORY_SCENES: Record<SeoLandingCategory, readonly SeoLandingSceneBreak[]> = {
  "google-ads": [
    {
      placement: "after-story",
      visual: "metrics-dashboard",
      eyebrow: "Cijfers",
      title: "ROAS en CPA die je bankrekening snappen",
      caption: "Budget naar winnaars. Zoektermen die lekken eruit.",
    },
  ],
  seo: [
    {
      placement: "after-story",
      visual: "local-maps",
      eyebrow: "Lokaal",
      title: "Maps, GBP en reviews die vertrouwen bouwen",
      caption: "Lokaal scoren vraagt meer dan een adres in de footer.",
    },
    {
      placement: "after-deep-dive",
      visual: "ai-search",
      eyebrow: "AI-zoek",
      title: "Ook in ChatGPT en Gemini zichtbaar",
      caption: "Sterke antwoorden op echte vragen. Dan citeert AI je ook.",
    },
  ],
  website: [
    {
      placement: "after-story",
      visual: "tracking-lab",
      eyebrow: "Tracking",
      title: "GA4, GTM en conversies die kloppen",
      caption: "Meten vóór optimaliseren. Anders gok je met budget.",
    },
  ],
  shopify: [
    {
      placement: "after-story",
      visual: "email-flow",
      eyebrow: "Mail",
      title: "Flows die omzet per mailreeks meten",
      caption: "Welkom, cart recovery, win-back. Op het juiste moment.",
    },
  ],
  content: [
    {
      placement: "after-aanpak",
      visual: "ai-search",
      eyebrow: "Vindbaarheid",
      title: "Content die Google en AI citeert",
      caption: "Autoriteit op vragen die je klanten echt stellen.",
    },
  ],
  "b2b-portal": [
    {
      placement: "after-story",
      visual: "tracking-lab",
      eyebrow: "Koppelingen",
      title: "Shop, CRM en facturatie in één lijn",
      caption: "Minder handwerk tussen order en betaling.",
    },
  ],
};

const SLUG_OVERRIDES: Partial<Record<string, EditorialConfig>> = {
  "google-ads-bureau": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "metrics-dashboard",
        eyebrow: "Account check",
        title: "Wat je account echt oplevert per euro",
        caption: "Search, Shopping, remarketing. Landings en tracking bouw ik zelf mee.",
      },
      {
        placement: "after-deep-dive",
        visual: "website-build",
        eyebrow: "Message match",
        title: "Ads zonder landings is budget naar een dichte deur",
        caption: "Ik fix de pagina als die lekt. Zelfde handen, zelfde plan.",
      },
    ],
    enrichedOverrides: {
      story: {
        title: "Google Ads bureau inhuren zonder leergeld",
        paragraphs: [
          "Je hebt een bureau gehad. Of een freelancer die op Start drukte. Dashboard vol kliks, bankrekening stil. Meestal liegt de site, niet het budget. Broad match vreet marge. Niemand leest het zoektermenrapport.",
          "Ik begin bij wat er ná de klik gebeurt. Landings, tracking, marge per productgroep. SkinComplete draaide ads pas na organisch bewijs. BestRest kreeg per matras een eigen aanpak.",
          "Google Ads bureau bij mij is één iemand die je account leest alsof het zijn eigen geld is. En je site aanpast als die dat vraagt.",
        ],
      },
    },
  },
  "google-ads-beheer": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "tracking-lab",
        eyebrow: "Account beheer",
        title: "Wekelijks bijsturen, niet maandelijks hopen",
        caption: "Zoektermen, budget, landings. Wat lekt gaat eruit.",
      },
    ],
    enrichedOverrides: {
      scenario: {
        title: "Stel: je account draait al, maar lekt",
        paragraphs: [
          "Je hebt Google Ads beheer ergens neergelegd. Het dashboard groeit. De inbox niet. Meestal zit het probleem in zoektermen die niemand leest of landings die niet matchen.",
          "Ik begin met een audit van dertig minuten die je zelf ook kunt doen: top 20 zoektermen op kosten, landings op mobiel, conversies vs backend.",
          "Google Ads beheer bij mij is geen retainer voor sentiment. Het is wekelijks je account lezen alsof het mijn eigen budget is.",
        ],
      },
    },
  },
  advertentiebeheer: {
    enrichedOverrides: {
      scenario: {
        title: "Stel: advertentiebeheer voelt als autopilot",
        paragraphs: [
          "Je betaalt voor advertentiebeheer, maar weet niet welke campagnes echt verkopen. De maandrapportage is groen. Je omzet niet.",
          "Advertentiebeheer is hetzelfde werk als Google Ads beheer, alleen zoekt MKB het vaak onder deze term. Ik spreek gewoon Nederlands: zoektermen, budget, landings.",
          "Eerste winst zit meestal in wat je uitzet, niet in wat je toevoegt. Zombie-campagnes zijn gratis geld terug.",
        ],
      },
    },
  },
  "hoger-in-google": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "content-hub",
        eyebrow: "Hoger in Google",
        title: "Posities die ook verkopen",
        caption: "Rankings op koopintentie. Pagina's die ik zelf bouw.",
      },
      {
        placement: "after-deep-dive",
        visual: "ai-search",
        eyebrow: "2026",
        title: "Google én AI-antwoorden",
        caption: "Sterke content die ChatGPT en Gemini kunnen citeren.",
      },
    ],
    enrichedOverrides: {
      story: {
        title: "Hoger in Google zonder rapportenla",
        paragraphs: [
          "Je wilt hoger in Google. Je krijgt tips, blogs, soms links. Zes maanden later sta je op pagina twee voor een term die niemand koopt. De site is nog steeds traag op mobiel.",
          "Ik bouw de pagina's die moeten ranken. Techniek, schema, interne links, copy die antwoord geeft. SkinComplete domineerde salonvragen organisch voordat ads live gingen.",
          "Hoger in Google is bij mij meetbaar in posities én in wat die posities opleveren. Niet in aantal blogs.",
        ],
      },
    },
  },
  "webshop-laten-maken": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "email-flow",
        eyebrow: "Shop + mail",
        title: "Shop die klaar is voor Shopping en mail",
        caption: "Custom Shopify, feed, checkout en flows vanaf dag één.",
      },
    ],
  },
  "content-marketing-vindbaarheid": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "content-hub",
        eyebrow: "Content",
        title: "Antwoorden op echte vragen, niet op een redactiekalender",
        caption: "FAQ, gidsen, vergelijkingen. Geschreven én gebouwd.",
      },
      {
        placement: "after-deep-dive",
        visual: "ai-search",
        eyebrow: "Vindbaarheid",
        title: "Content die Google en AI citeert",
        caption: "Autoriteit op vragen die je klanten echt stellen.",
      },
    ],
  },
  "b2b-portaal-bouwen": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "email-flow",
        eyebrow: "B2B portaal",
        title: "Salons bestellen zelf. Jij typt minder orders over.",
        caption: "Prijzen, herbestellen, facturen. SkinComplete-route.",
      },
    ],
    enrichedOverrides: {
      story: {
        title: "B2B portaal bouwen zonder Excel-chaos",
        paragraphs: [
          "Je B2B-klanten mailen orders. Jij typt ze over. Fouten, vertraging, niemand weet welke prijs gold. Een portaal klinkt duur tot je uren gaat tellen.",
          "Ik bouw portalen op Shopify die salons en groothandel begrijpen. Prijslijsten, herbestellen, login. SkinComplete draait zo. Minder mail, sneller cashflow.",
          "B2B portaal bouwen is bij mij custom code dat blijft draaien. Gebouwd voor salons en groothandel.",
        ],
      },
    },
  },
  "google-ads-of-seo": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "compare-split",
        eyebrow: "Ads vs SEO",
        title: "Snel verkeer of duurzame marge?",
        caption: "Ads voor nu. SEO voor later. Soms beide, altijd met volgorde.",
      },
      {
        placement: "after-aanpak",
        visual: "metrics-dashboard",
        eyebrow: "Beslisboom",
        title: "SkinComplete deed SEO eerst. Dat was geen toeval.",
        caption: "Organisch bewijs, dan pas budget omhoog.",
      },
    ],
    enrichedOverrides: {
      story: {
        title: "Google Ads of SEO: het eerlijke antwoord",
        paragraphs: [
          "Iedereen wil één antwoord. Ads voor snel. SEO voor goedkoop op termijn. Maar de echte vraag is: wat is je site waard als verkeer komt? Traag en vaag? Dan helpen beide niet.",
          "SkinComplete rankte eerst op salonvragen. Daarna ads. BestRest per product bekeken. Logica op marge en tijdlijn.",
          "Ik help je kiezen wat eerst. En ik voer het uit. Eén aanspreekpunt, één lijn voor je budget.",
        ],
      },
    },
  },
  "shopify-of-woocommerce": {
    visual: "webshop",
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "compare-split",
        eyebrow: "Platform keuze",
        title: "Shopify schaalt. WooCommerce eet je tijd op.",
        caption: "Migratie met redirects als het zinvol is. SEO intact.",
      },
    ],
  },
  "meta-ads-of-google-ads": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "compare-split",
        eyebrow: "Meta vs Google",
        title: "Scrollen en zoeken zijn verschillende sporten",
        caption: "Meta creëert vraag. Google vangt intentie. Jouw product bepaalt de mix.",
      },
      {
        placement: "after-aanpak",
        visual: "metrics-dashboard",
        eyebrow: "Eén strategie",
        title: "Twee kanalen, één landingsplan",
        caption: "Message match op beide. Eén strategie, twee platformen.",
      },
    ],
  },
  "bureau-of-freelancer-marketing": {
    visual: "strategy-stack",
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "compare-split",
        eyebrow: "Derde optie",
        title: "Eén senior brein in plaats van een kantoor of vijf freelancers",
        caption: "Bouwen, SEO, ads en mail. Alles onder één dak.",
      },
    ],
  },
  "google-ads-specialist": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "tracking-lab",
        eyebrow: "Specialist",
        title: "Google Ads specialist die je landings ook fixt",
        caption: "Account én pagina na de klik. Ik optimaliseer wat er telt.",
      },
    ],
  },
  "remarketing-google-ads": {
    sceneBreaks: [
      {
        placement: "after-aanpak",
        visual: "metrics-dashboard",
        eyebrow: "Warm verkeer",
        title: "Remarketing zonder stalker-vibe",
        caption: "Segmenten, caps en creatives. Terugbrengen, niet weg jagen.",
      },
    ],
  },
  "facebook-ads-bureau": {
    visual: "meta-ads",
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "content-hub",
        eyebrow: "Meta campagnes",
        title: "Facebook ads met landings die matchen",
        caption: "Feed, Stories, Reels. Creatives én pagina's in één handenpaar.",
      },
    ],
  },
  "instagram-ads-bureau": {
    visual: "meta-ads",
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "website-build",
        eyebrow: "Instagram",
        title: "9:16 creatives op een site die converteert",
        caption: "Mooie ad, trage landings = weggegooid budget.",
      },
    ],
  },
  "shopify-seo": {
    sceneBreaks: [
      {
        placement: "after-deep-dive",
        visual: "seo-serp",
        eyebrow: "Shop + SEO",
        title: "Productpagina's die ranken én verkopen",
        caption: "Collecties, filters, schema. Shopify SEO zonder template-trucs.",
      },
    ],
  },
  "seo-audit": {
    sceneBreaks: [
      {
        placement: "after-aanpak",
        visual: "tracking-lab",
        eyebrow: "Audit",
        title: "Prioriteiten die je morgen kunt uitvoeren",
        caption: "Impact eerst. En ik kan het zelf fixen als je wilt.",
      },
    ],
  },
  "cro-bureau": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "website-build",
        eyebrow: "Conversie",
        title: "CRO op je echte shop, niet op een heatmap-slideshow",
        caption: "Checkout, mobiel, trust. Meten en aanpassen.",
      },
    ],
  },
  "chatgpt-vindbaarheid": {
    visual: "ai-search",
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "content-hub",
        eyebrow: "AI-zoek",
        title: "Gevonden worden in ChatGPT en Gemini",
        caption: "Antwoorden die AI kan citeren. Kwaliteit boven bulk.",
      },
    ],
  },
  "klaviyo-specialist": {
    visual: "email-flow",
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "metrics-dashboard",
        eyebrow: "Klaviyo",
        title: "Flows die omzet per mailreeks meten",
        caption: "Shop gekoppeld. Segmenten die kloppen.",
      },
    ],
  },
  "ugc-marketing": {
    visual: "meta-ads",
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "content-hub",
        eyebrow: "UGC",
        title: "Echte mensen in je ads",
        caption: "Creators en hooks die je feed niet overslaat.",
      },
    ],
  },
  "webshop-marketing": {
    visual: "webshop",
  },
  "zoekmachine-marketing": {
    sceneBreaks: [
      {
        placement: "after-aanpak",
        visual: "seo-serp",
        eyebrow: "SEO + SEA",
        title: "Eén strategie voor organisch en betaald",
        caption: "Eén strategie. Twee platformen die elkaar versterken.",
      },
    ],
  },
  "digital-marketing-bureau": {
    visual: "strategy-stack",
  },
  "lokale-seo": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "local-maps",
        eyebrow: "Lokaal",
        title: "Google Maps en GBP die echt lokale klanten pakken",
        caption: "Profiel, reviews en landings die matchen met lokale intentie.",
      },
    ],
  },
  "e-mailmarketing": {
    visual: "email-flow",
  },
  "website-laten-maken": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "tracking-lab",
        eyebrow: "From scratch",
        title: "Website laten maken zonder template-geur",
        caption: "Next.js custom. Snel, SEO-klaar, klaar voor ads.",
      },
      {
        placement: "after-deep-dive",
        visual: "google-ads",
        eyebrow: "Klaar voor groei",
        title: "Site die campagnes aankan",
        caption: "Landings, tracking, snelheid. Klaar na launch.",
      },
    ],
    enrichedOverrides: {
      story: {
        title: "Website laten maken: waar het misgaat",
        paragraphs: [
          "Je zoekt iemand die een site neerzet. Je krijgt een template met jouw logo, een page builder die traag wordt en een bouwer die na oplevering niet meer opneemt. Zes maanden later wil je adverteren en blijkt je landingspagina drie seconden te laden.",
          "Ik bouw from scratch in Next.js of Shopify custom. Snelheid, SEO, conversie en tracking zitten erin vóór je de link deelt. SkinComplete en BestRest zijn zo gebouwd. Uniek thema, custom build.",
          "Website laten maken bij mij is: één iemand die code schrijft, je vindbaarheid regelt en je site klaarmaakt voor campagnes. Eén lijn van bouwen tot campagnes.",
        ],
      },
    },
  },
  "seo-specialist": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "content-hub",
        eyebrow: "SEO specialist",
        title: "Specialist die de pagina ook bouwt",
        caption: "Landings live, posities meetbaar. Advies én uitvoering.",
      },
      {
        placement: "after-deep-dive",
        visual: "ai-search",
        eyebrow: "2026",
        title: "SEO specialist voor Google én AI",
        caption: "Rankings plus antwoorden die ChatGPT kan citeren.",
      },
    ],
    enrichedOverrides: {
      story: {
        title: "SEO specialist inhuren zonder rapportenla",
        paragraphs: [
          "Je hebt een SEO specialist gehad. Of een bureau. Je kreeg maandrapporten, soms blogs, zelden een pagina die echt rankt op koopintentie. De specialist bleef bij rapporten. De developer snapte SEO niet.",
          "Ik doe beide. Keyword-plan, technische fixes, landings schrijven en bouwen. SkinComplete rankte op salonvragen voordat ads gingen draaien. Dat is hoe een SEO specialist waarde moet leveren.",
          "12 jaar Google. Pagina's die helpen, schema dat klopt en eerlijk advies als ads slimmer zijn dan nog een blog.",
        ],
      },
    },
  },
  "meta-ads-bureau": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "content-hub",
        eyebrow: "Meta campagnes",
        title: "Creatives die landen op een pagina die converteert",
        caption: "UGC, Reels en landings in één lijn. Checkout telt.",
      },
    ],
  },
  "online-marketing-bureau": {
    visual: "strategy-stack",
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "metrics-dashboard",
        eyebrow: "Eén lijn",
        title: "Site, SEO, ads en mail onder één dak",
        caption: "Eén plan. Eén aanspreekpunt. Cijfers die kloppen.",
      },
    ],
  },
  "shopify-expert": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "tracking-lab",
        eyebrow: "Shopify expert",
        title: "Custom waar de theme store stopt",
        caption: "B2B, feed, checkout en koppelingen. Gebouwd voor groei.",
      },
    ],
  },
  "google-shopping-ads": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "metrics-dashboard",
        eyebrow: "Shopping",
        title: "Feed, Merchant Center en ROAS per SKU",
        caption: "Shopping die je marge respecteert. Niet alleen klikken.",
      },
    ],
  },
  "vindbaarheid-ai": {
    visual: "ai-search",
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "content-hub",
        eyebrow: "AI-vindbaarheid",
        title: "Gevonden in ChatGPT, Gemini en Google",
        caption: "Antwoorden op echte vragen. Techniek en copy samen.",
      },
    ],
  },
  "landing-page-laten-maken": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "tracking-lab",
        eyebrow: "Landings",
        title: "Landings die ads en SEO aankunnen",
        caption: "Snelheid, CTA, schema. Gebouwd voor campagnes.",
      },
    ],
  },
  "marketing-automatisering": {
    sceneBreaks: [
      {
        placement: "after-aanpak",
        visual: "email-flow",
        eyebrow: "Automatisering",
        title: "Systemen die handwerk vervangen",
        caption: "Shop, CRM, mail en flows aan elkaar geknoopt.",
      },
    ],
  },
  "sea-specialist": {
    sceneBreaks: [
      {
        placement: "after-story",
        visual: "metrics-dashboard",
        eyebrow: "SEA",
        title: "SEA specialist met landings in dezelfde handen",
        caption: "Google Ads, Shopping en remarketing. Bijsturen op ROAS.",
      },
    ],
  },
};

function resolveBaseSlug(slug: string): string {
  for (const city of SEO_CITY_REGISTRY) {
    const suffix = `-${city.slug}`;
    if (slug.endsWith(suffix)) {
      return slug.slice(0, -suffix.length);
    }
  }
  return slug;
}

function usesDefaultProcess(page: SeoLandingPage): boolean {
  return page.processSteps[0]?.title === DEFAULT_PROCESS_TITLE;
}

function isEditorialEligible(baseSlug: string, page: SeoLandingPage): boolean {
  if (page.layoutProfile === "editorial" || page.layoutProfile === "city") return true;
  return (
    BATCH2_SLUGS.has(baseSlug) ||
    BATCH3_SLUGS.has(baseSlug) ||
    BATCH4_SLUGS.has(baseSlug) ||
    TRIO_BASE_SLUGS.has(baseSlug) ||
    ORIGINAL_SLUGS.has(baseSlug) ||
    VERGELIJK_SLUGS.has(baseSlug) ||
    EXTRA_SLUGS.has(baseSlug)
  );
}

function mergeConfig(baseSlug: string, category: SeoLandingCategory): EditorialConfig {
  const categoryConfig: EditorialConfig = {
    processSteps: CATEGORY_PROCESS[category],
    sceneBreaks: CATEGORY_SCENES[category],
  };
  const slugConfig = SLUG_OVERRIDES[baseSlug] ?? {};
  const batch4Process = BATCH4_SLUGS.has(baseSlug) ? BATCH4_PROCESS[baseSlug] : undefined;
  return {
    processSteps:
      slugConfig.processSteps ?? batch4Process ?? categoryConfig.processSteps,
    sceneBreaks: slugConfig.sceneBreaks ?? categoryConfig.sceneBreaks,
    visual: slugConfig.visual,
    enrichedOverrides: slugConfig.enrichedOverrides,
  };
}

function mergeEnrichedOverrides(
  baseSlug: string,
  overrides: SeoLandingPage["enrichedOverrides"],
): SeoLandingPage["enrichedOverrides"] {
  const deepDive = ALL_DEEPDIVES[baseSlug];
  const story = STORY_BATCH4[baseSlug];
  if (!deepDive && !story && !overrides) return undefined;

  return {
    ...overrides,
    deepDive: overrides?.deepDive ?? deepDive,
    story: overrides?.story ?? story,
  };
}

/**
 * Past editorial layout toe op batch-pagina's, trio-bases, originelen en stad-varianten.
 * Scene-visuals worden altijd uniek gehouden t.o.v. de hero.
 */
export function applyEditorialProfile(page: SeoLandingPage): SeoLandingPage {
  const baseSlug = resolveBaseSlug(page.slug);

  if (!isEditorialEligible(baseSlug, page)) {
    if (page.sceneBreaks?.length) {
      return { ...page, sceneBreaks: resolveUniqueScenes(page, page.sceneBreaks) };
    }
    return page;
  }

  const config = mergeConfig(baseSlug, page.category);
  const isCity = Boolean(page.location);

  const merged: SeoLandingPage = {
    ...page,
    layoutProfile: page.layoutProfile ?? (isCity ? "city" : "editorial"),
    processTitle:
      BATCH4_PROCESS_TITLES[baseSlug] ?? page.processTitle,
    processSteps:
      usesDefaultProcess(page) && config.processSteps
        ? config.processSteps
        : page.processSteps,
    sceneBreaks: page.sceneBreaks ?? config.sceneBreaks,
    visual: config.visual ?? page.visual,
    enrichedOverrides: mergeEnrichedOverrides(
      baseSlug,
      page.enrichedOverrides ?? config.enrichedOverrides,
    ),
    skipSections: isCity
      ? ([
          ...new Set<SeoLandingSectionId>([
            ...(page.skipSections ?? []),
            "confession",
            "nightmare",
            "innerVoice",
          ]),
        ] as const)
      : page.skipSections,
  };

  if (merged.sceneBreaks?.length) {
    return {
      ...merged,
      sceneBreaks: resolveUniqueScenes(merged, merged.sceneBreaks),
    };
  }

  return merged;
}
