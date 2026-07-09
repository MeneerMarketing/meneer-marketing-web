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

export const META_ADS_BUREAU: SeoLandingPage = {
  slug: "meta-ads-bureau",
  primaryKeyword: "meta ads bureau",
  category: "google-ads",
  metaTitle: "Meta Ads bureau · Instagram & Facebook die opleveren | Meneer Marketing",
  metaDescription:
    "Meta Ads bureau voor Instagram en Facebook. UGC, creatives en landingspagina's die converteren. Eén strategie met Google Ads.",
  keywords: ["meta ads bureau", "facebook ads bureau", "instagram ads bureau", "meta advertising"],
  eyebrow: "Meta Ads",
  headline: "Meta Ads bureau dat creatives",
  headlineAccent: "niet verloopt in de feed.",
  subheadline:
    "Mooie video, lege winkelwagen. Ik koppel Meta Ads aan landingspagina's, UGC en een plan dat past bij je marge.",
  pains: [
    { title: "Boostpost-gokken", body: "De knop 'promoten' is geen strategie. Het is roulette met je merk." },
    { title: "Stock die niemand gelooft", body: "Mensen scrollen door perfecte stockfoto's alsof het reclame uit 2014 is." },
    { title: "Kanalen los van elkaar", body: "Twee bureaus, twee verhalen. Jij betaalt dubbel voor verwarring." },
  ],
  deliverables: [
    { title: "Meta + Google onder één dak", body: "Eén strategie, geen tegenstrijdige boodschappen." },
    { title: "UGC & creators", body: "Echte mensen, echte hooks. Authentieke content." },
    { title: "Landings die matchen", body: "Ad en pagina zeggen hetzelfde. Anders gooi je geld weg." },
    { title: "Wekelijkse bijstuur", body: "Creatives roteren. Budget naar winnaars." },
  ],
  visual: "meta-ads",
  visualCaption: "Instagram en Facebook met een plan, niet met hoop.",
  processTitle: "Zo pakken we Meta Ads aan",
  processSteps: processDefault,
  proofTitle: "Creators + conversie",
  proofBody: "Bij SkinComplete en andere klanten combineren we UGC met landingspagina's die verkopen. Niet alleen views.",
  hotTake: { label: "Heet take", body: "Een Meta Ads bureau dat geen landingspagina wil aanraken, verkoopt je dopamine, geen omzet." },
  faq: [
    { question: "Doen jullie ook Google Ads?", answer: "Ja. Vaak slim om ze onder één strategie te zetten." },
    { question: "Werken jullie met UGC?", answer: "Ja. Creators, reels, TikTok en Meta in één lijn." },
    { question: "Wat is een realistisch budget?", answer: "Hangt af van je marge. We rekenen breakeven door vóór we opschalen." },
  ],
  ctaTitle: "Meta Ads zonder feed-hoppen?",
  ctaBody: "Vertel je product en doelgroep. Ik schets of Meta nu past.",
  relatedSlugs: ["google-ads-bureau", "google-shopping-ads", "landing-page-laten-maken"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
};

export const ONLINE_MARKETING_BUREAU: SeoLandingPage = {
  slug: "online-marketing-bureau",
  primaryKeyword: "online marketing bureau",
  category: "seo",
  metaTitle: "Online marketing bureau · één lijn, geen losse eilandjes | Meneer Marketing",
  metaDescription:
    "Online marketing bureau dat bouwt, vindbaar maakt en campagnes draait. Site, SEO, Google Ads en Meta. Eén team, één plan.",
  keywords: ["online marketing bureau", "marketing bureau nederland", "digitaal marketing bureau"],
  eyebrow: "Online marketing",
  headline: "Online marketing bureau dat",
  headlineAccent: "alles onder één dak heeft.",
  subheadline:
    "SEO, ads en site onder één dak. Ik ben je online marketing manager: strategie én uitvoering.",
  pains: [
    { title: "Te veel partijen", body: "Iedereen wijst naar de ander als het niet werkt." },
    { title: "Rapporten zonder actie", body: "Mooie slides. Pagina's die niet ranken. Ads die niet converteren." },
    { title: "Verkeerde volgorde", body: "Ads op een site die nog niet klaar is om te verkopen." },
  ],
  deliverables: [
    { title: "Strategie & volgorde", body: "Wat eerst, wat later. Eerlijk en meetbaar." },
    { title: "Bouwen from scratch", body: "Site of shop die meegroeit." },
    { title: "Vindbaarheid", body: "Google én AI-antwoorden." },
    { title: "Campagnes", body: "Google Ads en Meta als het zinvol is." },
  ],
  visual: "content-hub",
  visualCaption: "Eén bureau. Eén verhaal. Eén lijn.",
  processTitle: "Zo werk ik als jouw bureau",
  processSteps: processDefault,
  proofTitle: "SkinComplete & BestRest",
  proofBody: "Van shop tot SEO tot ads: ik ken het traject omdat ik het zo heb gebouwd voor echte klanten.",
  hotTake: { label: "Heet take", body: "Een online marketing bureau dat niet kan bouwen, is een PowerPoint-fabriek." },
  faq: [
    { question: "Vervangen jullie mijn hele team?", answer: "Nee. Ik vul aan waar het moet: strategie, uitvoering, prioriteit." },
    { question: "Werken jullie langdurig?", answer: "Ja, als het klikt. Maandelijks met duidelijke scope." },
  ],
  ctaTitle: "Eén bureau voor alles?",
  ctaBody: "Vertel waar je nu zit. Ik schets de slimste volgorde.",
  relatedSlugs: ["google-ads-bureau", "hoger-in-google", "website-laten-maken", "meta-ads-bureau"],
  pillarSlug: "strategie",
  pillarLabel: "Strategie",
};

export const SHOPIFY_EXPERT: SeoLandingPage = {
  slug: "shopify-expert",
  primaryKeyword: "shopify expert",
  category: "shopify",
  metaTitle: "Shopify expert · custom shops & B2B | Meneer Marketing",
  metaDescription:
    "Shopify expert voor custom themes, B2B-portalen en groei. Custom build. SkinComplete-niveau vakmanschap.",
  keywords: ["shopify expert", "shopify specialist nederland", "shopify ontwikkelaar"],
  eyebrow: "Shopify expert",
  headline: "Shopify expert die je shop",
  headlineAccent: "niet uit een thema-store tilt.",
  subheadline:
    "Shopify is krachtig als je het goed inricht. Ik bouw custom, B2B waar nodig, en koppel marketing er direct op.",
  pains: [
    { title: "Theme-limitaties", body: "Je wilt iets unieks. Het theme zegt nee." },
    { title: "Trage shop", body: "Elke seconde kost omzet. Templates zijn vaak opgeblazen." },
    { title: "Marketing losgekoppeld", body: "Shop klaar, niemand vindt hem." },
  ],
  deliverables: [
    { title: "Custom Shopify theme", body: "Snel, merk-eigen, schaalbaar." },
    { title: "B2B-portaal", body: "Prijzen, login, herbestellen." },
    { title: "SEO & Shopping", body: "Organisch en betaald vanaf één fundament." },
    { title: "Doorlopend beheer", body: "Updates, features, groei." },
  ],
  visual: "webshop",
  processTitle: "Shopify traject",
  processSteps: processDefault,
  proofTitle: "SkinComplete",
  proofBody: "B2B-portaal, marketing en vindbaarheid op Shopify. Dat is mijn referentie, niet een demo-theme.",
  proofCase: "SkinComplete",
  hotTake: { label: "Heet take", body: "Een Shopify expert die alleen themes installeert, is een monteur zonder garage." },
  faq: [
    { question: "Alleen Shopify?", answer: "Voor shops ja. Custom sites doe ik in Next.js." },
    { question: "Migratie van WooCommerce?", answer: "Ja, met SEO en redirects waar nodig." },
  ],
  ctaTitle: "Shopify die echt past?",
  ctaBody: "Vertel je assortiment en ambities.",
  relatedSlugs: ["webshop-laten-maken", "b2b-portaal-bouwen", "google-shopping-ads"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
};

export const GOOGLE_SHOPPING_ADS: SeoLandingPage = {
  slug: "google-shopping-ads",
  primaryKeyword: "google shopping ads",
  category: "google-ads",
  metaTitle: "Google Shopping ads · feeds die verkopen | Meneer Marketing",
  metaDescription:
    "Google Shopping ads met schone feeds, sterke productpagina's en bijsturing op marge. Conversie vóór opschalen.",
  keywords: ["google shopping ads", "google shopping bureau", "shopping campagnes", "merchant center"],
  eyebrow: "Google Shopping",
  headline: "Google Shopping ads zonder",
  headlineAccent: "rommel in je feed.",
  subheadline:
    "Shopping lijkt simpel: upload producten, klaar. Tot je betaalt voor clicks op producten die niet converteren. Ik fix feed, pagina's en biedingen.",
  pains: [
    { title: "Feed-fouten", body: "Afgekeurd, verkeerde prijzen, ontbrekende attributen." },
    { title: "Alle producten gelijk", body: "Budget op items met lage marge. Bankroet in slow motion." },
    { title: "Dunne productpagina's", body: "Klik, afhaker. De feed was oké, de shop niet." },
  ],
  deliverables: [
    { title: "Merchant Center setup", body: "Feed, conversies, policies. Schoon en compleet." },
    { title: "Product-SEO", body: "Pagina's die ranken én converteren." },
    { title: "Marge-gestuurde biedingen", body: "Meer budget op wat winst geeft." },
    { title: "Performance Max slim", body: "Niet blind vertrouwen op de zwarte doos." },
  ],
  visual: "webshop",
  visualCaption: "Shopping werkt als product én pagina kloppen.",
  processTitle: "Shopping die rendeert",
  processSteps: processDefault,
  proofTitle: "E-commerce ervaring",
  proofBody: "SkinComplete en BestRest: verschillende producten, verschillende marges. Shopping vraagt om maatwerk per catalogus.",
  hotTake: { label: "Heet take", body: "Google Shopping ads op een trage shop met template-productpagina's is een dure catalogus die niemand koopt." },
  faq: [
    { question: "Heb ik een Shopify shop nodig?", answer: "Niet per se, wel een goede feed en landings." },
    { question: "Hoe snel live?", answer: "Feed en tracking eerst. Vaak binnen enkele weken testbaar." },
  ],
  ctaTitle: "Shopping laten checken?",
  ctaBody: "Stuur je shop-URL. Ik kijk naar feed en pagina's.",
  relatedSlugs: ["google-ads-bureau", "webshop-laten-maken", "shopify-expert"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
};

export const VINDBAARHEID_AI: SeoLandingPage = {
  slug: "vindbaarheid-ai",
  primaryKeyword: "vindbaarheid ai",
  category: "content",
  metaTitle: "Vindbaarheid in AI · ChatGPT & Gemini | Meneer Marketing",
  metaDescription:
    "Vindbaarheid in AI: genoemd worden in ChatGPT, Gemini en andere antwoorden. Structuur, content en autoriteit die AI citeert.",
  keywords: ["vindbaarheid ai", "chatgpt vindbaarheid", "gemini seo", "ai zoek optimalisatie"],
  eyebrow: "AI-vindbaarheid",
  headline: "Vindbaar in AI.",
  headlineAccent: "Of je bestaat niet meer.",
  subheadline:
    "Steeds meer klanten vragen ChatGPT of Gemini om advies. Sta jij niet in het antwoord, dan ben je geen optie. Ik fix dat: techniek + content die AI snapt.",
  pains: [
    { title: "Onzichtbaar in AI", body: "Je concurrent wél genoemd. Jij niet. Eerste indruk telt." },
    { title: "Alleen klassieke SEO", body: "Google rankt je. AI negeert je. Twee werelden." },
    { title: "AI-prutswerk", body: "Bulk ChatGPT-tekst helpt je niet. Het schaadt je." },
  ],
  deliverables: [
    { title: "AI-audit", body: "Wat antwoorden ChatGPT en Gemini nu op jouw markt?" },
    { title: "Antwoord-pagina's", body: "Content die citeerbaar is, niet fluff." },
    { title: "Schema & structuur", body: "Techniek die machines begrijpen." },
    { title: "Google + AI samen", body: "Eén contentplan, twee kanalen." },
  ],
  visual: "ai-search",
  visualCaption: "Zo klinkt het als jij wél in het antwoord staat.",
  processTitle: "Route naar AI-vindbaarheid",
  processSteps: processDefault,
  proofTitle: "Nieuw speelveld, vroege winst",
  proofBody: "Wie nu autoriteit opbouwt in AI-antwoorden, heeft straks voorsprong. Het is SEO-2010 vibes, maar dan voor ChatGPT.",
  hotTake: { label: "Heet take", body: "Vindbaarheid in AI met alleen een blog over 'top 10 tips' is alsof je een visitekaartje in een zwart gat gooit." },
  faq: [
    { question: "Is dit los van SEO?", answer: "Nee. Sterke SEO-pagina's helpen vaak ook in AI." },
    { question: "Hoe meet je het?", answer: "Handmatige checks + queries die je klanten echt stellen." },
  ],
  ctaTitle: "In AI-antwoorden staan?",
  ctaBody: "Vertel je markt. Ik test wat AI nu zegt.",
  relatedSlugs: ["content-marketing-vindbaarheid", "hoger-in-google", "seo-specialist"],
  pillarSlug: "vindbaarheid",
  pillarLabel: "Vindbaarheid",
};

export const LANDING_PAGE_LATEN_MAKEN: SeoLandingPage = {
  slug: "landing-page-laten-maken",
  primaryKeyword: "landing page laten maken",
  category: "website",
  metaTitle: "Landing page laten maken · converteert, geen praatje | Meneer Marketing",
  metaDescription:
    "Landing page laten maken from scratch. Snel, SEO-klaar en gebouwd voor Google Ads en Meta. Custom build die converteert.",
  keywords: ["landing page laten maken", "landingspagina laten maken", "conversie pagina bouwen"],
  eyebrow: "Landingspagina's",
  headline: "Landing page laten maken die",
  headlineAccent: "ads niet laat bloeden.",
  subheadline:
    "Je ad klikt. Je pagina laat los. Ik bouw landings from scratch: één doel, één CTA, snelheid groen, copy die verkoopt.",
  pains: [
    { title: "Ad ≠ pagina", body: "Belofte in de ad, andere boodschap op de pagina. Afhakers." },
    { title: "Te veel afleiding", body: "Menu, blog, footer met 40 links. Niemand koopt." },
    { title: "Traag op mobiel", body: "70% van je ads is mobiel. Je pagina denkt nog desktop." },
  ],
  deliverables: [
    { title: "Eén doel per pagina", body: "Lead, aankoop of call. Focus op één actie." },
    { title: "Ads-ready", body: "Message match met Google en Meta." },
    { title: "Snel & technisch strak", body: "Core Web Vitals, schema, tracking." },
    { title: "Testen", body: "Varianten als het volume het trekt." },
  ],
  visual: "website-build",
  processTitle: "Landings die converteren",
  processSteps: processDefault,
  proofTitle: "Ads zonder lekke landings",
  proofBody: "BestRest en andere klanten: eerst pagina die converteert, dan pas budget omhoog. Anders verbrand je geld.",
  hotTake: { label: "Heet take", body: "Een landing page laten maken in Canva en dan €3.000 in ads pompen is een kunstproject, geen marketing." },
  faq: [
    { question: "Los van mijn site?", answer: "Kan. Vaak koppel ik aan je domein voor vertrouwen en SEO." },
    { question: "Hoe snel?", answer: "Eenvoudige landings vaak binnen 1-2 weken." },
  ],
  ctaTitle: "Landings die verkopen?",
  ctaBody: "Vertel je campagne of product. Ik schets de pagina.",
  relatedSlugs: ["google-ads-bureau", "meta-ads-bureau", "website-laten-maken"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
};

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
  relatedSlugs: ["google-ads-bureau", "google-ads-beheer", "google-shopping-ads"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
};
