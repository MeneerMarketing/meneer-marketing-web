import type { SeoLandingPage } from "@/data/seo-landings/types";

const processDefault = [
  {
    title: "Intake zonder salescircus",
    body: "Jij vertelt waar je zit. Ik zeg eerlijk wat zin heeft en wat niet.",
  },
  {
    title: "Plan met volgorde",
    body: "Niet alles tegelijk. Eerst wat het snelst oplevert of het fundament fixt.",
  },
  {
    title: "Uitvoeren",
    body: "Ik bouw, schrijf en zet live. Alles onder één dak.",
  },
  {
    title: "Meten en bijsturen",
    body: "Cijfers beslissen. Sentiment niet.",
  },
] as const;

export { META_ADS_BUREAU } from './meta-ads-bureau';

export const ONLINE_MARKETING_BUREAU: SeoLandingPage = {
  slug: "online-marketing-bureau",
  primaryKeyword: "online marketing bureau",
  category: "seo",
  metaTitle: "Online marketing bureau · één aanspreekpunt | Meneer Marketing",
  metaDescription:
    "Online marketing bureau voor site, SEO, Google Ads en Meta Ads. Ik ben strategie én uitvoering. Eerst volgorde, dan budget dat rendeert.",
  keywords: [
    "online marketing bureau",
    "marketing bureau nederland",
    "digitaal marketing bureau",
    "marketing bureau",
    "digital marketing bureau",
    "internetmarketing bureau",
    "online marketing specialist",
  ],
  eyebrow: "Online marketing · ik ben je manager",
  headline: "Online marketing bureau dat",
  headlineAccent: "alles onder één dak heeft.",
  subheadline:
    "Site, SEO, Google Ads en Meta onder één lijn. Ik ben je online marketing manager: prioriteiten, bouw en campagnes, zonder doorgeefluik.",
  pains: [
    {
      title: "Te veel partijen",
      body: "Websitebouwer, SEO, ads, mail. Iedereen wijst naar de ander als het niet werkt. Jij zit in het midden als projectmanager zonder mandaat.",
    },
    {
      title: "Rapporten zonder actie",
      body: "Mooie slides, lege pipeline. Pagina's die niet ranken, ads die niet converteren, en niemand die de site mag aanpassen.",
    },
    {
      title: "Verkeerde volgorde",
      body: "Ads op een site die nog niet klaar is om te verkopen. Budget brandt, terwijl het fundament nog wankelt.",
    },
  ],
  deliverables: [
    {
      title: "Strategie en volgorde",
      body: "Wat eerst, wat later, wat wacht. Eerlijk en meetbaar, zodat budget de juiste volgorde volgt.",
    },
    {
      title: "Bouwen from scratch",
      body: "Site of shop die meegroeit. Custom waar het moet, snel genoeg voor SEO en ads.",
    },
    {
      title: "Vindbaarheid",
      body: "Google én AI-antwoorden. Landings die intentie pakken, niet alleen blogs voor volume.",
    },
    {
      title: "Campagnes",
      body: "Google Ads en Meta Ads als het zinvol is. Gekoppeld aan landings en marge, niet als los eiland.",
    },
  ],
  visual: "content-hub",
  visualCaption: "Eén plan. Eén verhaal. Eén lijn.",
  processTitle: "Zo werk ik als jouw online marketing manager",
  processSteps: [
    {
      title: "Scan zonder theater",
      body: "Site, tracking, SEO, ads, aanbod. Ik zeg waar het lekt en wat de snelste winst is. Soms is dat geen campagne, maar een pagina.",
    },
    {
      title: "Volgorde vastzetten",
      body: "Fundament, dan verkeer, dan schaal. Jij krijgt één roadmap. Geen drie bureaus die elkaars planning doorkruisen.",
    },
    {
      title: "Uitvoeren onder één dak",
      body: "Ik bouw, publiceer, zet campagnes strak en stuur bij. Strategie en handen zitten bij dezelfde persoon.",
    },
    {
      title: "Maandelijks bijsturen",
      body: "Wat leverde leads of omzet? Wat stoppen we? Wat verdient meer budget? Rapportage met besluiten, niet alleen grafieken.",
    },
  ],
  proofTitle: "SkinComplete en BestRest",
  proofBody:
    "Bij SkinComplete bouwde ik het Shopify B2B-portaal, zette e-mail op, liet SEO eerst groeien en zette daarna ads aan. BestRest kreeg een eigen plan per product. Dat is hoe een online marketing bureau moet voelen: één lijn, echte uitvoering.",
  proofCase: "SkinComplete",
  hotTake: {
    label: "Heet take",
    body: "Een online marketing bureau dat niet kan bouwen, is een PowerPoint-fabriek.",
  },
  faq: [
    {
      question: "Vervang je mijn hele marketingteam?",
      answer:
        "Nee. Ik vul aan waar het moet: strategie, prioriteit, bouw en campagnes. Heb je al iemand intern, dan trek ik één lijn zodat iedereen dezelfde volgorde volgt.",
    },
    {
      question: "Wat doet een online marketing bureau bij jou anders?",
      answer:
        "Ik ben één persoon: strategie én uitvoering. Site, SEO, Google Ads en Meta onder één plan. Minder overleg, sneller live, en niemand kan naar 'de andere afdeling' wijzen.",
    },
    {
      question: "Werk je langdurig samen?",
      answer:
        "Ja, als het klikt. Maandelijks met duidelijke scope. Projecten voor een site of migratie kunnen, groei daarna ook. Geen jaarcontract voor show.",
    },
    {
      question: "Moet ik meteen ads aanschaffen?",
      answer:
        "Alleen als je site en tracking klaar zijn om te converteren. Anders eerst fundament. Ik zeg dat hard, ook als dat betekent dat we ads een maand later aanzetten.",
    },
    {
      question: "Doe je SEO én Google Ads én Meta?",
      answer:
        "Ja, als het in jouw plan past. Niet alles tegelijk hard aanzetten. Wel alles in dezelfde strategie, zodat kanalen elkaar versterken in plaats van tegenspreken.",
    },
    {
      question: "Voor wie ben je juist géén match?",
      answer:
        "Als je alleen een logo-refresh wilt, of een bureau zoekt met twintig specialisten achter een receptie. Ik werk het best met ondernemers die snelheid en eerlijkheid willen.",
    },
    {
      question: "Hoe start een traject?",
      answer:
        "Intake over markt, cijfers en wat nu faalt. Daarna een voorstel met volgorde en prijsindicatie. Eerste wins gaan zo snel mogelijk live, zodat je voelt of de samenwerking werkt.",
    },
  ],
  ctaTitle: "Eén aanspreekpunt voor alles?",
  ctaBody: "Vertel waar je nu zit. Ik schets de slimste volgorde en wat ik eerst zou aanpakken.",
  relatedSlugs: [
    "google-ads-bureau",
    "seo-specialist",
    "hoger-in-google",
    "website-laten-maken",
    "meta-ads-bureau",
  ],
  pillarSlug: "strategie",
  pillarLabel: "Strategie",
  layoutProfile: "editorial",
  lockContent: true,
  enrichedOverrides: {
    story: {
      title: "Online marketing bureau zonder eilandjes",
      paragraphs: [
        "Je zoekt een online marketing bureau omdat SEO, ads en je site nu los van elkaar lopen. Het resultaat: iedereen wijst naar de ander. Ik trek één lijn: eerst fundament, dan verkeer, dan schaal.",
        "Bij SkinComplete bouwde ik het Shopify B2B-portaal, zette e-mail op, liet SEO eerst groeien en zette daarna ads aan. BestRest kreeg een eigen plan per product. Dat is bureauwerk zonder bureau-gedoe.",
        "Jij hebt één aanspreekpunt. Strategie en uitvoering zitten bij mij. Dat scheelt overleg, voorkomt tegenstrijdige beloftes en versnelt wat live gaat.",
        "Ik praat in omzet, leads en marge, niet in 'awareness' als einddoel. Campagnes en content dienen hetzelfde verhaal. Anders betaal je twee keer voor ruis.",
        "Wil je drie partijen die elkaar mails sturen? Dat kan elders. Wil je één plan met meetbare stappen en iemand die ook bouwt? Dan starten we met een eerlijke scan.",
      ],
    },
    deepDive: {
      title: "De volgorde die je marge spaart",
      paragraphs: [
        "Eerst site en tracking die kloppen. Dan landings die zoekintentie pakken. Daarna Google Ads of Meta als je breakeven haalt. Anders betaal je voor lekken en noem je het 'testen'.",
        "Vindbaarheid in Google én in AI-antwoorden hoort bij hetzelfde plan. Duidelijke expertise-pagina's helpen beide. Ik schrijf antwoorden die mensen én systemen kunnen gebruiken.",
        "SEO zonder ads kan. Ads zonder SEO ook. Samen onder één manager wint vaker: organisch bouwt assets, betaald vult tempo en leert welke boodschap converteert.",
        "Maandelijks kijken we naar wat opleverde. Kanalen zonder bewijs krijgen minder. Winnaars krijgen gas. Zo blijft marketing een investering met stuur, geen vaste kostenpost.",
        "Rapportage is kort en besluitgericht. Wat stoppen we, wat publiceren we, wat schalen we? Als jij na een call weet wat er volgende week live gaat, werkt het bureau.",
      ],
    },
    scenario: {
      title: "Stel: je hebt al drie leveranciers",
      paragraphs: [
        "De site-man zegt dat ads moeten. Ads zegt dat de site faalt. SEO wil meer blogs. Jij betaalt drie facturen en mist één plan. Herkenbaar, en oplosbaar.",
        "Ik zet alles op één roadmap: wat mag blijven, wat weg mag, wat ik overneem. Geen big-bang ontslag van iedereen als iets al werkt. Wel één stuur.",
        "Eerste maand: quick wins en duidelijkheid. Daarna structureel bouwen. Zo voel je of één aanspreekpunt rust geeft voordat je alles omgooit.",
      ],
    },
  },
};

export { SHOPIFY_EXPERT } from './shopify-expert';

export { GOOGLE_SHOPPING_ADS } from './google-shopping-ads';

export { VINDBAARHEID_AI } from './vindbaarheid-ai';

export { LANDING_PAGE_LATEN_MAKEN } from './landing-page-laten-maken';

export const MARKETING_AUTOMATISERING: SeoLandingPage = {
  slug: "marketing-automatisering",
  primaryKeyword: "marketing automatisering",
  category: "b2b-portal",
  metaTitle: "Marketing automatisering · systemen koppelen | Meneer Marketing",
  metaDescription:
    "Marketing automatisering: leads, mail, CRM en shop aan elkaar. Minder handwerk, meer overzicht. n8n, Make en custom koppelingen.",
  keywords: ["marketing automatisering", "marketing automation", "systemen koppelen marketing"],
  eyebrow: "Automatisering",
  headline: "Marketing automatisering zonder",
  headlineAccent: "Excel-chaos.",
  subheadline:
    "Leads in mail, orders in WhatsApp, rapporten in vijf tools. Ik knoop systemen aan elkaar zodat jij kunt groeien in plaats van copy-pasten.",
  pains: [
    { title: "Handmatig werk", body: "Elke lead dubbel intypen. Foutgevoelig en traag." },
    { title: "Attributie ontbreekt", body: "Niemand weet welke campagne welke klant bracht." },
    { title: "Tool-spaghetti", body: "Tien apps die niet praten. Duur en irritant." },
  ],
  deliverables: [
    { title: "Leadflows", body: "Formulier → CRM → mail → opvolging." },
    { title: "E-commerce koppelingen", body: "Shop, voorraad, mail, ads-data." },
    { title: "Rapportage", body: "Eén dashboard in plaats van vijf exports." },
    { title: "Documentatie", body: "Je team snapt wat er gebeurt." },
  ],
  visual: "b2b-portal",
  processTitle: "Automatisering die blijft werken",
  processSteps: processDefault,
  proofTitle: "E-commerce op autopilot",
  proofBody: "SkinComplete-style flows: minder handwerk, meer tijd voor groei. Automatisering is geen luxe, het is schaal.",
  hotTake: { label: "Heet take", body: "Marketing automatisering zonder iemand die je site en ads snapt, is duct tape op een lekkende pijp." },
  faq: [
    { question: "Welke tools?", answer: "Wat past bij je stack: n8n, Make, custom API's." },
    { question: "Vervangt dit mijn team?", answer: "Nee. Het haalt rotwerk weg." },
  ],
  ctaTitle: "Minder handwerk?",
  ctaBody: "Vertel welke systemen je gebruikt. Ik schets de koppelingen.",
  relatedSlugs: ["b2b-portaal-bouwen", "online-marketing-bureau", "webshop-laten-maken"],
  pillarSlug: "behoud",
  pillarLabel: "Behoud",
};

export const SEA_SPECIALIST: SeoLandingPage = {
  slug: "sea-specialist",
  primaryKeyword: "sea specialist",
  category: "google-ads",
  metaTitle: "SEA specialist · Google Ads met marge in het hoofd | Meneer Marketing",
  metaDescription:
    "SEA specialist voor Search, Shopping en Performance Max. Landingspagina's en tracking inbegrepen. Elk account met conversieplan.",
  keywords: ["sea specialist", "sea bureau", "zoekmachine adverteren specialist", "google ads specialist"],
  eyebrow: "SEA",
  headline: "SEA specialist die ook",
  headlineAccent: "je landingspagina fixt.",
  subheadline:
    "SEA is niet alleen bieden op zoekwoorden. Het is weten welke klik geld oplevert en wat er daarna gebeurt. Ik doe beide.",
  pains: [
    { title: "CPA zonder context", body: "Mooie CPA op een product dat niets verdient." },
    { title: "Zoektermen-lek", body: "Je betaalt voor gratis, jobs en concurrenten." },
    { title: "Message match scheurt", body: "Ad belooft A, pagina zegt B." },
  ],
  deliverables: [
    { title: "Search & Shopping", body: "Intentie-gestuurd, marge-bewust." },
    { title: "Tracking & attributie", body: "Weten wat echt converteert." },
    { title: "Landings bouwen", body: "Ik hoef niemand anders te bellen." },
    { title: "Wekelijkse optimalisatie", body: "Budget naar winnaars." },
  ],
  visual: "google-ads",
  processTitle: "SEA met het volle plaatje",
  processSteps: processDefault,
  proofTitle: "Ads na fundament",
  proofBody: "Organisch eerst bij SkinComplete, daarna SEA. Die volgorde bespaart je duizenden euro's aan leer geld.",
  hotTake: { label: "Heet take", body: "Een SEA specialist die 'landing page' uitbesteedt aan een goedkope freelancer, gokt met jouw geld." },
  faq: [
    { question: "Verschil met Google Ads bureau?", answer: "Zelfde vak, andere zoekterm. Ik pak beide." },
    { question: "Minimum budget?", answer: "Hangt af van markt. We rekenen eerst door of het kan." },
  ],
  ctaTitle: "SEA zonder gokken?",
  ctaBody: "Vertel je markt en marge. Ik geef eerlijk advies.",
  relatedSlugs: ["google-ads-bureau", "google-shopping-ads"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
};
