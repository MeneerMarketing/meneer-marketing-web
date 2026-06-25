/**
 * Strategische boodschap per dienst: benadrukt maatwerk, niche-denken en allround-expertise.
 * Geen copy-paste trajecten. Elke opdracht start met context.
 */

export interface StrategicScenario {
  title: string;
  body: string;
}

export interface DienstStrategicContent {
  /** Unieke invalshoek voor deze dienst */
  deepTitle: string;
  deepLead: string;
  deepExtended: string;
  /** Waar we bij intake op letten (transparant voor de klant) */
  signals: string[];
  scenarios: StrategicScenario[];
}

const PILLAR_LENS: Record<string, string> = {
  Bouwen:
    "Binnen Bouwen kijk ik niet alleen naar ‘een site’ of ‘een shop’, maar naar hoe jouw bedrijf over vijf jaar nog steeds snel kan groeien. Dat bepaalt welk platform we kiezen, hoe we koppelingen ontwerpen en waar we problemen voorkomen. Zo sluit alles aan op hoe jij echt werkt — niet op een standaard template.",
  Groeien:
    "Binnen Groeien vertaal ik groei naar kanalen én naar wat je site aankan. Soms is de grootste winst een scherpere landingspagina; andere keren een betere Google-vindbaarheid, e-mailflows of advertenties die eindelijk hetzelfde beloven als je product. Ik kies wat past bij jouw marge, verkoopcycli en team.",
  Automatiseren:
    "Binnen Automatiseren zoek ik eerst naar rust in je operatie: welke handmatige stappen kosten tijd, fouten en frustratie? Pas daarna kiezen we tooling (n8n, Make, custom). Het doel is altijd eigenaarschap bij jouw team: flows die je begrijpt en die niet instorten bij de eerste API-storing.",
  Vormgeven:
    "Binnen Vormgeven is het doel niet ‘mooi voor mooi’, maar herkenning en conversie. Ik vertaal je propositie naar kleur, type, beeld en motion. Consistent over site, mail en ads. Zo voelt elk touchpoint alsof het uit één merk komt, wat vertrouwen en conversie direct voedt.",
};

const SCENARIOS_BY_PILLAR: Record<string, StrategicScenario[]> = {
  Bouwen: [
    {
      title: "Schaal-up e-commerce",
      body: "Je groeit hard: meer SKU’s, internationale storefronts of B2B naast B2C. Dan moet je theme en data-laag niet breken bij elke feature.",
    },
    {
      title: "Content & SEO-machine",
      body: "Je redactie publiceert dagelijks. Dan is editor-ervaring, interne linking en performance geen luxe. Het is je businessmodel.",
    },
    {
      title: "Portal of tool",
      body: "Je klanten of medewerkers loggen in voor data, orders of documenten. Dan is UX, security en onderhoudbaarheid leidend.",
    },
  ],
  Groeien: [
    {
      title: "Nieuwe markt testen",
      body: "Je wilt een nieuw segment of land proberen. Dan ontwerp ik een compacte test met duidelijke criteria: wanneer stoppen, wanneer opschalen.",
    },
    {
      title: "SEO herstel of groei",
      body: "Je site heeft historie of technische problemen. Dan combineren we technische fixes met content die écht nieuw en nuttig is.",
    },
    {
      title: "Ads + conversie samen",
      body: "Je advertenties wisselen in resultaat. Dan ligt de oplossing vaak half in de advertentie, half in de landingspagina. Ik behandel beide als één geheel.",
    },
    {
      title: "E-mailmarketing opzetten",
      body: "Je verliest klanten na aankoop of stuurt geen nieuwsbrieven. Dan bouwen we flows en campagnes die op het juiste moment aankomen.",
    },
  ],
  Automatiseren: [
    {
      title: "Orderstress",
      body: "Orders hopen op en spreadsheets raken vol. Dan automatiseren we eerst de pijnlijkste stap. Met zichtbare tijdwinst binnen weken.",
    },
    {
      title: "Dubbele invoer",
      body: "Zelfde klantgegevens in drie systemen. Dan ontwerp ik één bron van waarheid met duidelijke sync-regels.",
    },
    {
      title: "Support & FAQ",
      body: "Team herhaalt dezelfde antwoorden. Dan combineren we kennisbank, bot en escalatie zodat mensen alleen waardevolle cases zien.",
    },
  ],
  Vormgeven: [
    {
      title: "Rebranding of vernieuwing",
      body: "Je propositie is verschoven. Dan herschrijf ik visuele taal en componenten zodat site en campagnes weer één verhaal vertellen.",
    },
    {
      title: "Conversie op mobiel",
      body: "Desktop ziet er goed uit, mobiel niet. Dan herschik ik hiërarchie en microcopy. Zonder je merk te verliezen.",
    },
    {
      title: "Campagne-eenheid",
      body: "Ads voelen los van de site. Dan lever ik creatives en landingspatronen die dezelfde hook en belofte dragen.",
    },
  ],
};

const BY_SLUG: Record<string, Omit<DienstStrategicContent, "scenarios">> = {
  "shopify-enterprise": {
    deepTitle: "Shopify enterprise: maatwerk zonder chaos",
    deepLead:
      "Geen twee enterprise-Shops zijn hetzelfde: het ene bedrijf zit in B2B-bundles, het andere in internationale prijzen, weer een ander in headless + app-ecosysteem. Ik start met jouw order-ticket-flow, catalogus-complexiteit en marketingstack. En kies architectuur die daar eerlijk op inspeelt.",
    deepExtended:
      "Soms is de beste move een strak OS2.0-theme met minimale apps; andere keren is API-first of een hybride met maatwerk front. Ik laat je zien waarom, wat het betekent voor onderhoud en wat het doet met snelheid en SEO. Zo koop je geen ‘enterprise-label’, maar een oplossing die past bij jouw volgende fase.",
    signals: [
      "Hoe complex is je variant- en prijslogica (B2B, regio’s, kortingen)?",
      "Welke apps zijn echt kritisch. En welke vervangen we door maatwerk?",
      "Waar zit je omzet: SEO, ads, e-mail. En wat verwacht je storefront daarvoor?",
      "Hoe ziet je release-proces eruit (staging, QA, rollback)?",
    ],
  },
  webdevelopment: {
    deepTitle: "Maatwerk websites: from scratch, gebouwd voor jouw bedrijf",
    deepLead:
      "Ik bouw geen kant-en-klare templates. Elke site start op een leeg canvas: design, structuur en code passend bij jouw merk, doelen en team. Of het nu een bedrijfswebsite, landingspagina of portal is.",
    deepExtended:
      "Snelheid en veiligheid zijn standaard. De prioriteit verschilt wel: een webshop heeft andere eisen dan een site met veel content of zware formulieren. Ik leg uit welke keuzes we maken, hoe je zelf content kunt beheren en hoe we voorkomen dat je over drie jaar vastzit aan obscure oplossingen.",
    signals: [
      "Wie past content aan, en hoe vaak?",
      "Welke koppelingen (CRM, webshop, boekhouding) zijn must-haves?",
      "Wil je vooral gevonden worden, verkopen, of beide?",
      "Zijn er speciale eisen (toegankelijkheid, branche-regels)?",
    ],
  },
  "web-apps": {
    deepTitle: "Web-apps: productdenken in plaats van eenmalig project",
    deepLead:
      "Portals, tools en interne apps falen als ze alleen ‘mooi gebouwd’ zijn maar niet aansluiten op rollen, rechten en datastromen. Ik map jouw gebruikers, edge cases en integraties voordat we UI polish doen.",
    deepExtended:
      "Technisch kies ik wat past bij jouw team: Next.js, auth-providers, API-stijl. Business-wise vertaal ik het naar schermen die vertrouwen geven en stappen die logisch zijn. Zodat adoptie niet stokt na launch.",
    signals: [
      "Welke rollen doen wat. En welke data mogen ze zien?",
      "Moet de app offline-kunnen, realtime, of batch synchroniseren?",
      "Welke legacy-systemen blijven even staan. En hoe koppelen we veilig?",
      "Wat is je definitie van ‘succes’ na 90 dagen?",
    ],
  },
  optimalisatie: {
    deepTitle: "Snelheid: geen score-jacht, maar conversie en crawlruimte",
    deepLead:
      "Een goede optimalisatie start met meten op de pagina’s die geld of autoriteit dragen. Niet met een willekeurige homepage-score. Ik koppel LCP/INP aan templates, landingsverkeer en SEO-prioriteiten.",
    deepExtended:
      "Soms win je meer met het trimmen van één zware app op productpagina’s dan met micro-optimalisatie overal. Ik maak die afweging expliciet, inclusief wat het betekent voor je roadmap en je marketing.",
    signals: [
      "Welke URL-templates dragen de meeste omzet of leads?",
      "Welke third-parties zijn strikt nodig voor ads, consent of chat?",
      "Hoe snel schip je nu features. En waar botst dat met performance?",
      "Wat zijn je huidige CWV-knelpunten per device?",
    ],
  },
  seo: {
    deepTitle: "SEO: semantiek en echte antwoorden. Per niche anders",
    deepLead:
      "Lokale dienstverlening vraagt een andere informatiearchitectuur dan een SaaS met lange salescyclus of een webshop met duizenden SKU’s. Ik bouw clusters en techniek die passen bij hoe jouw doelgroep zoekt én koopt.",
    deepExtended:
      "Ik vermijd generieke ‘blogkalenders’ zonder zoekintentie. In plaats daarvan koppel ik content aan entities, interne links en conversiepaden. Zodat SEO en business hetzelfde doel hebben.",
    signals: [
      "Welke vragen stelt je ideale klant vóór de aankoop?",
      "Waar concurreer je: prijs, expertise, snelheid, vertrouwen?",
      "Hoe sterk is je technische basis (crawl, indexatie, duplicates)?",
      "Welke landen of talen zijn relevant. Nu of straks?",
    ],
  },
  adverteren: {
    deepTitle: "Ads: budget naar het juiste verhaal op het juiste moment",
    deepLead:
      "B2B met lange deals vraagt andere campagnes dan D2C met impulsaankopen. Ik koppel accountstructuur aan marge, inventaris en wat je site echt kan uitdragen. Geen losse creaties zonder landingspagina.",
    deepExtended:
      "We sturen op learning speed: welke audiences en hooks leveren snel inzicht? Daarna schalen we wat werkt en snijden we wat ruis geeft. Inclusief samenwerking met SEO/CRO als die de bottleneck is.",
    signals: [
      "Wat is je break-even CPA of ROAS. En hoe zeker is je marge?",
      "Welke landingspagina’s zijn ‘campaign-ready’?",
      "Hoe volwassen is je feed/catalogus voor shopping?",
      "Welke creatie-capaciteit heb je in-house?",
    ],
  },
  cro: {
    deepTitle: "CRO: psychologie + data. Per branche andere frictie",
    deepLead:
      "Checkout-frictie bij consumenten is iets anders dan formulier-angst bij B2B of vertrouwen bij hoge AOV. Ik formuleer hypotheses vanuit gedrag op jouw site. Niet vanuit ‘best practices’ die elders werkten.",
    deepExtended:
      "Experimenten zet ik alleen op als meetbaarheid klopt. Soms levert een UX-sprint met sessie-opnames meer op dan een A/B-test met te weinig volume. Dat maak ik inzichtelijk.",
    signals: [
      "Waar haken gebruikers af (scroll, rage clicks, formulier)?",
      "Wat is je traffic-volume per belangrijke funnel?",
      "Welke trust-signalen passen bij jouw doelgroep (reviews, keurmerken, menselijk contact)?",
      "Hoe ‘mobiel-first’ is je omzet werkelijk?",
    ],
  },
  leadgeneratie: {
    deepTitle: "Leads: kwaliteit boven volume. Per niche een ander aanbod",
    deepLead:
      "Een leadmagnet voor accountants ziet er anders uit dan voor e-commerce merchants of SaaS-trialers. Ik ontwerp aanbod, landingspagina en opvolging als één keten. Met scoring waar het zinvol is.",
    deepExtended:
      "Ik koppel leads aan CRM-automatisering zodat sales geen inbox-chaos krijgt. En we meten wat telt: niet alleen CPL, maar ook kwaliteit en doorlooptijd naar deal.",
    signals: [
      "Wie qualificeert leads. Sales, founder, SDR?",
      "Welke data vraag je wanneer (progressive profiling)?",
      "Welke concurrentie heeft vergelijkbare proposities. Hoe differentieer je?",
      "Welk CRM of stack gebruik je vandaag?",
    ],
  },
  automatisering: {
    deepTitle: "Automatisering: robuust waar het pijn doet",
    deepLead:
      "Ik automatiseer niet alles tegelijk. We beginnen waar handwerk het meest zeer doet of fouten maakt. En bouwen flows met logging en fallbacks zodat operations niet op zwart zaad zit.",
    deepExtended:
      "Tooling kies ik op basis van jouw hosting, budget en team-skill: soms is n8n self-hosted logisch, andere keren Make sneller. Transparantie over trade-offs hoort daarbij.",
    signals: [
      "Welke systemen zijn bron van waarheid voor klant, order, voorraad?",
      "Hoe vaak falen API’s vandaag. En wie lost dat op?",
      "Welke compliance (AVG, financieel) speelt mee?",
      "Wie beheert flows na live-gang?",
    ],
  },
  workflows: {
    deepTitle: "E-commerce workflows: keten denken, niet stapjes plakken",
    deepLead:
      "Van betaalde order tot retour: elke stap heeft edge cases (deels verzonden, gedeeltelijke refund, voorraad op meerdere locaties). Ik teken je keten uit voordat we automatiseren.",
    deepExtended:
      "Zo voorkom je ‘bijna goed’ mails naar klanten of voorraad die niet klopt. En je team weet wat er gebeurt als een koppeling uitvalt. Geen paniek, wel een duidelijk playbook.",
    signals: [
      "Hoe ziet je fulfilment eruit (eigen magazijn, 3PL, dropship)?",
      "Welke uitzonderingen komen wekelijks voor?",
      "Hoe communiceer je nu met klanten over status?",
      "Welke financiële exports moeten altijd kloppen?",
    ],
  },
  chatbots: {
    deepTitle: "AI & chatbots: nuttig voor team én klant",
    deepLead:
      "Een bot die foute antwoorden geeft is erger dan geen bot. Ik train op jouw echte kennisbronnen en ontwerp escalatie zodat mensen complexe cases zien. Met context.",
    deepExtended:
      "We meten welke vragen binnenkomen, waar gebruikers afhaken en wat tijd bespaart. Privacy en datastromen regelen we vanaf het begin, niet als patch.",
    signals: [
      "Welke vragen komen het vaakst bij support of sales?",
      "Welke documenten en feeds zijn leidend en up-to-date?",
      "Wanneer moet een mens overnemen. En hoe ziet die handoff eruit?",
      "Welke tone-of-voice past bij je merk?",
    ],
  },
  tracking: {
    deepTitle: "Tracking: één waarheid voor marketing en management",
    deepLead:
      "Als events niet kloppen, vechten kanalen om schuld. En optimaliseren is gokken. Ik ontwerp een event-spec die aansluit op je funnel, consent en tooling.",
    deepExtended:
      "Server-side of client-side tagging bepaal ik op risico, precisie en onderhoud. Het doel is dat jij campagnes én boardroom met dezelfde cijfers kunt bespreken.",
    signals: [
      "Welke conversies zijn ‘leading’ voor jullie beslissingen?",
      "Hoe ziet je cookie/consent setup eruit?",
      "Gebruik je enhanced conversions, offline imports, refunds?",
      "Welke dashboards gebruik je vandaag. En wat mist daar?",
    ],
  },
  branding: {
    deepTitle: "Branding: onderscheid dat ook in Figma en ads werkt",
    deepLead:
      "Positionering is geen woordenlijst. Het is keuzes in toon, kleur en vorm die overal terugkomen. Ik vertaal strategie naar richtlijnen die je team en partners kunnen volgen.",
    deepExtended:
      "Zo voorkom je dat je site strak is maar je ads nog ‘oud’ aanvoelen. Of omgekeerd. Eenheid bouwt vertrouwen, vooral bij hogere tickets of B2B.",
    signals: [
      "Wie zijn je echte alternatieven in het hoofd van de klant?",
      "Welke emotie of belofte moet je merk dragen (rust, energie, autoriteit)?",
      "Welke kanalen zijn het zichtbaarst. En waar breekt consistentie nu?",
      "Heb je al merkassets die we moeten respecteren of juist doorbreken?",
    ],
  },
  webdesign: {
    deepTitle: "UI/UX: conversie is context. Geen one-size template",
    deepLead:
      "Een checkout voor luxe goederen vraagt andere hiërarchie dan een snelle SaaS-trial of een formulier voor zorg. Ik ontwerp flows en schermen vanuit jouw klantreis.",
    deepExtended:
      "Design lever ik development-klaar: componenten, states en toegankelijkheid. Zo wordt bouwen voorspelbaar en blijft je merk consistent bij iteraties.",
    signals: [
      "Wat is de primaire actie per scherm. En wat is bewust secundair?",
      "Hoe kritisch is mobiel voor jouw omzet?",
      "Welke bestaande design systemen of merkregels gelden?",
      "Welke objections zien sales/support vaak terug in de funnel?",
    ],
  },
  animaties: {
    deepTitle: "Motion: energie die conversie dient",
    deepLead:
      "Te veel beweging afleidt; te weinig voelt saai. Ik kies per sectie welke animatie vertrouwen, hiërarchie of speelsheid ondersteunt. Binnen een performance-budget.",
    deepExtended:
      "Reduced motion respecteren hoort standaard. Zo blijft je site premium zonder gebruikers te verliezen die geen trillingen willen.",
    signals: [
      "Welke secties moeten ‘rust’ uitstralen. Welke ‘tempo’?",
      "Hoe zwaar is je pagina al vóór motion?",
      "Welk merkkarakter past bij beweging (strak, speels, luxe)?",
      "Waar mag animatie een story vertellen (product, proces)?",
    ],
  },
  media: {
    deepTitle: "Creatives: hooks die passen bij platform én merk",
    deepLead:
      "Wat werkt op Meta werkt niet 1:1 op YouTube of Display. Ik ontwerp varianten en hooks om te testen. Met dezelfde belofte als je landingspagina.",
    deepExtended:
      "Snel itereren op data hoort bij growth-teams; ik lever structuur in bestanden en benaming zodat je campagnes overzichtelijk blijven.",
    signals: [
      "Welke formats en lengtes gebruik je nu. En wat mist?",
      "Hoeveel creatie-capaciteit heb je intern?",
      "Welke UGC of studio-stijl past bij je doelgroep?",
      "Welke landings-URL’s zijn gekoppeld aan welke campagnes?",
    ],
  },
  email: {
    deepTitle: "E-mailmarketing: op het juiste moment, met de juiste boodschap",
    deepLead:
      "E-mail werkt als je de juiste mail op het juiste moment stuurt. Ik help met strategie, opzet en design: van je eerste nieuwsbrief tot automatische welkomstmails, herinnermails en opvolging na aankoop.",
    deepExtended:
      "Of je nu Klaviyo, Shopify Mail of een andere tool gebruikt: ik zorg dat je mails er professioneel uitzien, logisch doorlopen en aansluiten op je merk. Geen spam — wel mails die klanten waarderen en die verkopen ondersteunen.",
    signals: [
      "Welke mails stuur je nu al (welkom, nieuwsbrief, herinnering)?",
      "Welke e-mailtool gebruik je (Klaviyo, Shopify, Mailchimp)?",
      "Hoe segmenteer je klanten — en welke data heb je betrouwbaar?",
      "Welke toon past bij je merk: zakelijk, persoonlijk, luxe?",
    ],
  },
};

function fallbackSlugContent(slug: string): Omit<DienstStrategicContent, "scenarios"> {
  return {
    deepTitle: "Op maat voor jouw situatie",
    deepLead:
      "Deze dienst wordt per klant anders ingevuld: ik start met jouw markt, stack en doelen. Niet met een standaard pakket.",
    deepExtended:
      "In een kort gesprek breng ik scope, risico’s en quick wins in kaart. Daarna krijg je een voorstel waarin duidelijk is wat we bouwen, meten en opleveren. Transparant en zonder jargon waar het niet nodig is.",
    signals: [
      "Wat wil je over 90 dagen bereikt zien?",
      "Welke systemen en teams raken we?",
      "Wat is nu de grootste bottleneck. Techniek, traffic of conversie?",
      "Hoe wil je samenwerken (embedded, project, retainer)?",
    ],
  };
}

export function getDienstStrategic(
  slug: string,
  pillar: string,
): DienstStrategicContent & { pillarLens: string } {
  const core = BY_SLUG[slug] ?? fallbackSlugContent(slug);
  const scenarios =
    SCENARIOS_BY_PILLAR[pillar] ?? SCENARIOS_BY_PILLAR.Bouwen;
  return {
    ...core,
    scenarios,
    pillarLens:
      PILLAR_LENS[pillar] ??
      PILLAR_LENS.Bouwen,
  };
}

export const STRATEGY_MANIFESTO = {
  title: "Geen standaardpakketten. Wél een plan op maat",
  paragraphs: [
    "Ik geloof niet dat hetzelfde plan voor elke onderneming werkt. Wat een webshop nodig heeft, verschilt van een B2B-dienstverlener of een lokale retailer. Zelfs als ze allemaal ‘een site’ willen.",
    "Daarom start elk traject met luisteren: wie is je klant, waar zit je winst, welke systemen gebruik je, en waar verlies je nu tijd of omzet? Pas daarna kies ik welke diensten, tools en volgorde het beste passen.",
    "Als allrounder verbind ik web, marketing en dagelijkse operatie. Jij krijgt geen eindeloze keten van losse specialisten, maar één duidelijke lijn — met taal die je begrijpt, niet jargon om indruk te maken.",
  ],
} as const;

/** Korte inzichten voor de homepage. Lange manifesto-paragrafen blijven op dienstpagina’s */
export const STRATEGY_SIGNATURE_INSIGHTS = [
  {
    title: "Elke markt vraagt om een eigen route",
    body: "Webshop, B2B, retail of SaaS: zelfs met dezelfde wens (‘een site’) hoort een andere aanpak. Geen kopie van de vorige klant.",
  },
  {
    title: "Eerst begrijpen, dan pas kiezen",
    body: "Klant, winst, systemen en knelpunten bepalen of je site, SEO, ads, e-mail of automatisering nu het meeste oplevert.",
  },
  {
    title: "Eén lijn, geen eindeloze keten",
    body: "Web, marketing en operatie hangen samen. Jij krijgt één duidelijke lijn — minder gedoe tussen losse partijen.",
  },
] as const;
