export type ArticleSection =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  modifiedAt?: string;
  readMinutes: number;
  category: string;
  keywords: string[];
  sections: ArticleSection[];
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "shopify-performance-roas",
    title: "Waarom jouw Shopify-theme je ROAS saboteert (en wat wél werkt)",
    description:
      "Snelheid, script-bloat en verkeerde secties kosten conversie. En maken je ads duurder. Zo pak je het structureel aan.",
    publishedAt: "2026-03-12",
    modifiedAt: "2026-03-28",
    readMinutes: 8,
    category: "E-commerce",
    keywords: [
      "Shopify snelheid",
      "ROAS verbeteren",
      "Core Web Vitals shop",
      "Shopify theme performance",
    ],
    sections: [
      {
        type: "p",
        text: "Je ads kunnen nog zo scherp staan: als je storefront traag reageert, betaal je voor klikken die nooit een eerlijke kans krijgen. Bij Shopify zit het probleem zelden in één afbeelding. Het zit in stapeling: apps, secties, fonts en third-party scripts die allemaal ‘even nodig’ waren.",
      },
      {
        type: "h2",
        text: "De verborgen kosten van een zwaar theme",
      },
      {
        type: "p",
        text: "Themes die alles in één mega-bundle stoppen, dwingen de browser om werk te doen vóór de eerste interactie. Dat raakt Largest Contentful Paint (LCP) en Interaction to Next Paint (INP). Precies de metrics die correleren met conversie en kwaliteitsscores in Google Ads.",
      },
      {
        type: "ul",
        items: [
          "Elke app voegt JS toe. Vaak op elke pagina, ook waar je het niet nodig hebt.",
          "Hero-sliders met hoge-res video’s zijn conversiekillers op mobiel.",
          "Te veel variant-swatches en filters zonder lazy boundaries vertragen collection pages.",
        ],
      },
      {
        type: "callout",
        text: "Regel: als een sectie niet direct bijdraagt aan vertrouwen of checkout, moet hij kritisch worden beoordeeld. Niet ‘handig voor later’.",
      },
      {
        type: "h2",
        text: "Wat wél werkt: architectuur boven patches",
      },
      {
        type: "p",
        text: "Wij starten met meten: welke templates zijn het zwaarst, waar komt verkeer vandaan, en waar zit de omzet? Daarna herschikken we assets, isoleren we app-logica per template en maken we kritieke content server-side of statisch waar het kan.",
      },
      {
        type: "h3",
        text: "Koppel performance aan je advertenties",
      },
      {
        type: "p",
        text: "Verbeter je LCP en INP op landingspagina’s die ads ontvangen. Niet alleen op de homepage. Zo dalen bounce rates en stijgt effective CPM-efficiency, omdat platforms meer vertrouwen krijgen in je bestemming.",
      },
      {
        type: "h2",
        text: "Conclusie",
      },
      {
        type: "p",
        text: "Shopify schaalt als je thema, apps en content dezelfde discipline volgen. Performance is geen SEO-truc. Het is een groeistrategie die je ROAS beschermt.",
      },
    ],
  },
  {
    slug: "semantische-seo-2026",
    title: "Semantische SEO in 2026: minder ‘keywords’, meer betekenis",
    description:
      "Zo structureren je site en content voor mensen, zoekmachines én AI-samenvattingen. Zonder ouderwets keyword-stuffing.",
    publishedAt: "2026-02-20",
    readMinutes: 7,
    category: "SEO",
    keywords: [
      "semantische SEO",
      "E-E-A-T",
      "contentstrategie 2026",
      "interne linking",
    ],
    sections: [
      {
        type: "p",
        text: "SEO draait steeds minder om exacte zoektermen en meer om betekenisclusters: welke vragen beantwoord jij fundamenteel goed, en hoe ziet je site eruit als één samenhangend systeem?",
      },
      {
        type: "h2",
        text: "Entiteiten en onderwerpen, niet losse pagina’s",
      },
      {
        type: "p",
        text: "Een sterke site heeft een duidelijke hiërarchie: hoofdthema’s, subthema’s en ondersteunende pagina’s die elkaar versterken. Interne links zijn geen bijzaak. Ze zijn de routekaart voor crawlers en gebruikers.",
      },
      {
        type: "ul",
        items: [
          "Gebruik duidelijke URL’s en titels die het onderwerp beschrijven. Niet clickbait zonder inhoud.",
          "Voeg structured data toe waar het de waarheid versterkt. Niet als spam-signaal.",
          "Schrijf voor informatie-winst: antwoorden die verder gaan dan de eerste zin van Wikipedia.",
        ],
      },
      {
        type: "h2",
        text: "Techniek als fundament",
      },
      {
        type: "p",
        text: "Zonder snelle, crawlable templates verlies je zichtbaarheid voordat je content kansen krijgt. Technische SEO en contentstrategie zijn één keten. Vooral bij grote shops en publishers.",
      },
      {
        type: "callout",
        text: "Tip: map je top 20 pagina’s op intentie (informatie vs. transactie) en controleer of je interne links die intentie ondersteunen. Niet alleen naar je homepage.",
      },
    ],
  },
  {
    slug: "n8n-eerste-workflow",
    title: "Van spreadsheet naar n8n: je eerste workflow die tijd teruggeeft",
    description:
      "Geen mega-project: een eerste automatisering die wél in productie gaat. Met logging, eigenaarschap en ruimte om uit te breiden.",
    publishedAt: "2026-01-15",
    readMinutes: 6,
    category: "Automatisering",
    keywords: ["n8n", "workflow automatisering", "Make.com", "e-commerce integratie"],
    sections: [
      {
        type: "p",
        text: "De meeste automatisering faalt niet door de tool, maar door scope: te groot, te vaag, te weinig eigenaar. Begin met één pijnlijk handmatig proces dat vaak voorkomt en relatief stabiele API’s heeft.",
      },
      {
        type: "h2",
        text: "Kies een proces met duidelijke trigger en output",
      },
      {
        type: "p",
        text: "Bijvoorbeeld: nieuwe order in Shopify → factuurinformatie naar boekhoudtool → bevestiging naar Slack. De trigger is helder, het resultaat is meetbaar en je team ziet direct winst.",
      },
      {
        type: "h2",
        text: "Bouw defensief",
      },
      {
        type: "ul",
        items: [
          "Retries en error branches. API’s falen, dat is normaal.",
          "Logging: wat ging er mis, wanneer, met welke payload?",
          "Documentatie: welke credentials, welke versie, wie is owner?",
        ],
      },
      {
        type: "p",
        text: "Als je eerste flow stabiel draait, wordt de business case voor de tweede en derde flow veel makkelijker. Je hebt patronen, monitoring en vertrouwen.",
      },
    ],
  },
  {
    slug: "cro-checkout-vertrouwen",
    title: "CRO in checkout: vertrouwen bouwen zonder rommelige trust-badges",
    description:
      "Psychologie, microcopy en rustige UI slaan trust-icon-bingo. Vooral op mobiel.",
    publishedAt: "2026-03-02",
    readMinutes: 5,
    category: "Conversie",
    keywords: ["CRO", "checkout optimalisatie", "e-commerce conversie", "trust signals"],
    sections: [
      {
        type: "p",
        text: "Checkouts worden vaak geoptimaliseerd met meer badges, meer zinnen, meer opties. Soms werkt dat. Maar vaker verhoog je cognitieve load precies waar focus nodig is.",
      },
      {
        type: "h2",
        text: "Wat gebruikers echt willen weten",
      },
      {
        type: "ul",
        items: [
          "Wanneer wordt er afgeschreven en wanneer wordt er verzonden?",
          "Hoe werkt retourneren. In één zin, met link naar beleid.",
          "Waarom wordt er om een telefoonnummer gevraagd?",
        ],
      },
      {
        type: "p",
        text: "Test hypotheses met events en sessie-opnames. Soms wint een rustigere stap met betere microcopy het van tien trust-logo’s.",
      },
    ],
  },
  {
    slug: "wordpress-blokken-team",
    title: "WordPress-blokken waar je marketingteam blij van wordt",
    description:
      "Zo ontwerp je editor-ervaringen die schaal geven. Zonder dat elke campagne een developer nodig heeft.",
    publishedAt: "2026-02-08",
    readMinutes: 6,
    category: "Bouwen",
    keywords: ["WordPress Gutenberg", "custom blocks", "content workflows"],
    sections: [
      {
        type: "p",
        text: "Marketing wil snel schipperen; development wil geen oneindige edge cases. Het antwoord zit in herhaalbare blokken, duidelijke design tokens en restricties die creativiteit kanaliseren in plaats van remmen.",
      },
      {
        type: "h2",
        text: "Patronen boven vrijheid",
      },
      {
        type: "p",
        text: "In plaats van 40 variaties op een hero, lever je 3 goede patronen met gecontroleerde opties (achtergrond, CTA-stijl, sociale proof). Zo blijft performance en merkconsistent onder controle.",
      },
      {
        type: "callout",
        text: "Werk met een korte ‘content playbook’: wanneer welk blok, met voorbeelden. Minder vragen aan dev, snellere live-gang.",
      },
    ],
  },
  {
    slug: "branding-die-verkoopt-b2b",
    title: "Branding die verkoopt. Ook als je B2B ‘saai’ vindt",
    description:
      "Positionering en visuele hiërarchie voor langere salescycli: vertrouwen vóór flashy trends.",
    publishedAt: "2026-01-28",
    readMinutes: 6,
    category: "Vormgeven",
    keywords: ["B2B branding", "positionering", "huisstijl", "trust design"],
    sections: [
      {
        type: "p",
        text: "B2B-kopers zijn geen robots: ze zoeken risico-reductie. Je merk moet daarom helderheid en competentie uitstralen. Niet per se schreeuwerigheid.",
      },
      {
        type: "h2",
        text: "Van propositie naar visuele taal",
      },
      {
        type: "p",
        text: "Start met één zin: waarom jij, waarom nu? Vertaal die zin naar kleur (rust vs. energie), typografie (leesbaarheid op lange pagina’s) en beeldtaal die aansluit op je doelgroep.",
      },
      {
        type: "p",
        text: "Wanneer merk en UI hetzelfde verhaal vertellen als je salesdeck, versnelt elke campagne. Omdat herkenning vertrouwen bouwt.",
      },
    ],
  },
];
