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
  metaTitle: "Meta Ads bureau · Instagram & Facebook die verkopen | Meneer Marketing",
  metaDescription:
    "Meta Ads bureau voor Instagram en Facebook. UGC, creatives en landings in één lijn met Google Ads. Wekelijks bijsturen op omzet, niet op likes.",
  keywords: [
    "meta ads bureau",
    "facebook ads bureau",
    "instagram ads bureau",
    "meta advertising",
    "facebook advertising",
    "instagram ads specialist",
  ],
  eyebrow: "Meta Ads · funnel, niet feed-roulette",
  headline: "Meta Ads bureau dat creatives",
  headlineAccent: "niet verloopt in de feed.",
  subheadline:
    "Facebook en Instagram zitten in één Ads Manager. Ik bouw creatives, targeting en landings die bij je marge passen. Boost-knop blijft waar hij hoort: uit.",
  pains: [
    { title: "Boostpost-gokken", body: "De knop 'promoten' is roulette met je merk. Wel bereik, weinig funnel, dikke factuur." },
    { title: "Stock die niemand gelooft", body: "Mensen scrollen door perfecte stockfoto's alsof het reclame uit 2014 is." },
    { title: "Kanalen los van elkaar", body: "Meta hier, Google daar. Twee verhalen. Jij betaalt dubbel voor verwarring." },
  ],
  deliverables: [
    { title: "Meta + Google onder één dak", body: "Eén strategie, één meetlat, één aanspreekpunt." },
    { title: "UGC & creators", body: "Echte mensen, echte hooks. Content die niet als ad schreeuwt." },
    { title: "Landings die matchen", body: "Ad en pagina zeggen hetzelfde. Anders brand je budget." },
    { title: "Wekelijkse bijstuur", body: "Creatives roteren. Budget naar winnaars. Fatigue opsporen vóór het pijn doet." },
  ],
  visual: "meta-ads",
  visualCaption: "Instagram en Facebook met een plan, niet met hoop.",
  processTitle: "Zo pak ik Meta Ads aan",
  processSteps: processDefault,
  proofTitle: "Creators + conversie",
  proofBody:
    "Bij SkinComplete draaide Meta pas hard toen landings en UGC klopten. Views zijn leuk. Orders zijn het doel.",
  hotTake: {
    label: "Heet take",
    body: "Een Meta Ads bureau dat landingspagina's niet mag aanraken, verkoopt dopamine. Omzet zit in de klik ná de ad.",
  },
  faq: [
    {
      question: "Is Facebook Ads bureau hetzelfde als Meta Ads?",
      answer:
        "Ja. Facebook en Instagram zitten in Meta Ads Manager. Eén hub, één strategie. Apart 'Instagram bureau' is vaak dezelfde account met een ander label.",
    },
    {
      question: "Doe je ook Google Ads?",
      answer: "Ja. Vaak slim onder één plan, zodat remarketing en boodschap niet botsen.",
    },
    {
      question: "Werk je met UGC?",
      answer: "Ja. Creators, Reels en landings in één lijn. Stock alleen als het écht past.",
    },
    {
      question: "Wat is een realistisch startbudget?",
      answer: "Hangt af van je marge en ticketprijs. Eerst breakeven rekenen, dan testen, dan opschalen.",
    },
  ],
  ctaTitle: "Meta Ads die verkopen?",
  ctaBody: "Vertel je product en doelgroep. Ik schets of Meta nu past, of dat je site eerst moet.",
  relatedSlugs: ["google-ads-bureau", "ugc-marketing", "landing-page-laten-maken", "social-media-advertising"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
  layoutProfile: "editorial",
  enrichedOverrides: {
    story: {
      title: "Waarom Facebook en Instagram één plan verdienen",
      paragraphs: [
        "Je zoekt een Facebook Ads bureau of een Instagram Ads specialist. In de praktijk is het dezelfde Ads Manager, dezelfde pixel, dezelfde creatives-pipeline. Apart inkopen is dubbel werk.",
        "Ik start bij je landingspagina en je marge. Als de belofte in de ad niet op de pagina terugkomt, stop ik liever de campagne dan dat we views kopen voor niks.",
        "Daarna: UGC of sterke creatives, scherpe targeting, en wekelijkse rotatie. Wat wint krijgt budget. Wat faalt stopt. Simpel, meetbaar, onder één aanspreekpunt.",
      ],
    },
    deepDive: {
      title: "Van boost-knop naar echte funnel",
      paragraphs: [
        "De boost-knop voelt veilig: één post, wat euro's, klaar. Tot je merkt dat je bereik koopt bij mensen die nooit kopen. Funnel-denken is saai. Het is ook het enige dat schaalt.",
        "Ik zet cold, warm en hot apart. Cold krijgt bewijs en een scherpe hook. Warm krijgt social proof. Hot krijgt de deal of de checkout-push. Elke laag een eigen creative en landing.",
        "Google en Meta praten met elkaar via remarketing en dezelfde tracking. Zo betaal je niet twee keer voor dezelfde twijfelaar met twee boodschappen.",
      ],
    },
  },
};

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
  visualCaption: "Eén plan. Eén verhaal. Eén lijn.",
  processTitle: "Zo werk ik als jouw marketingmanager",
  processSteps: processDefault,
  proofTitle: "SkinComplete & BestRest",
  proofBody:
    "Van shop tot SEO tot ads: ik ken het traject omdat ik het zo heb gebouwd voor echte klanten.",
  hotTake: {
    label: "Heet take",
    body: "Een online marketing bureau dat niet kan bouwen, is een PowerPoint-fabriek.",
  },
  faq: [
    {
      question: "Vervang je mijn hele team?",
      answer: "Nee. Ik vul aan waar het moet: strategie, uitvoering, prioriteit.",
    },
    {
      question: "Werk je langdurig?",
      answer: "Ja, als het klikt. Maandelijks met duidelijke scope.",
    },
  ],
  ctaTitle: "Eén aanspreekpunt voor alles?",
  ctaBody: "Vertel waar je nu zit. Ik schets de slimste volgorde.",
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
  enrichedOverrides: {
    story: {
      title: "Online marketing bureau zonder eilandjes",
      paragraphs: [
        "Je zoekt een online marketing bureau omdat SEO, ads en je site nu los van elkaar lopen. Het resultaat: iedereen wijst naar de ander. Ik trek één lijn: eerst fundament, dan verkeer, dan schaal.",
        "Bij SkinComplete bouwde ik het Shopify B2B-portaal, zette e-mail op, liet SEO eerst groeien en zette daarna ads aan. BestRest kreeg een eigen plan per product. Dat is bureauwerk zonder bureau-gedoe.",
        "Jij hebt één aanspreekpunt. Strategie en uitvoering zitten bij mij. Dat scheelt overleg en versnelt wat live gaat.",
      ],
    },
    deepDive: {
      title: "De volgorde die je marge spaart",
      paragraphs: [
        "Eerst site en tracking die kloppen. Dan landings die zoekintentie pakken. Daarna Google Ads of Meta als je breakeven haalt. Anders betaal je voor lekken.",
        "Vindbaarheid in Google én in AI-antwoorden hoort bij hetzelfde plan. Duidelijke expertise-pagina's helpen beide.",
        "Wil je drie bureaus die elkaar mails sturen? Dat kan elders. Wil je één plan met meetbare stappen? Dan starten we met een eerlijke scan van waar je nu staat.",
      ],
    },
  },
};

export const SHOPIFY_EXPERT: SeoLandingPage = {
  slug: "shopify-expert",
  primaryKeyword: "shopify expert",
  category: "shopify",
  metaTitle: "Shopify expert · custom theme & groei | Meneer Marketing",
  metaDescription:
    "Shopify expert voor custom themes, B2B-portalen en shops die klaar zijn voor SEO en Shopping. Zoals bij SkinComplete: eerst organisch, dan ads.",
  keywords: [
    "shopify expert",
    "shopify specialist nederland",
    "shopify ontwikkelaar",
    "shopify webshop laten maken",
    "shopify theme laten maken",
    "custom shopify theme",
  ],
  eyebrow: "Shopify expert · custom, niet theme-store",
  headline: "Shopify expert die je shop",
  headlineAccent: "niet uit een thema-store tilt.",
  subheadline:
    "Ik bouw Shopify die snel blijft, merk-eigen oogt en SEO plus Merchant Center vanaf de build meeneemt. Theme-apps als pleisters? Liever netjes in code.",
  pains: [
    { title: "Theme-limitaties", body: "Je wilt iets unieks. Het theme zegt nee of vraagt drie apps die je shop vertragen." },
    { title: "Trage shop", body: "Elke seconde kost omzet. Opgeblazen templates verdampen Shopping-budget." },
    { title: "Marketing losgekoppeld", body: "Shop live, niemand vindt hem. SEO en feeds waren 'fase twee'." },
  ],
  deliverables: [
    { title: "Custom Shopify theme", body: "Snel, merk-eigen, schaalbaar. Code die meegroeit, geen plugin-stapel." },
    { title: "B2B-portaal", body: "Prijzen, login, herbestellen. Zoals bij SkinComplete." },
    { title: "SEO & Shopping", body: "Organisch en Merchant Center vanaf dag één meedenken." },
    { title: "Doorlopend beheer", body: "Updates, features, groei. Jij praat met mij." },
  ],
  visual: "webshop",
  processTitle: "Shopify traject",
  processSteps: processDefault,
  proofTitle: "SkinComplete",
  proofBody:
    "B2B-portaal, marketing en vindbaarheid op Shopify. Eerst organisch laten groeien, daarna ads. Dat is mijn referentie, niet een demo-theme.",
  proofCase: "SkinComplete",
  hotTake: {
    label: "Heet take",
    body: "Een Shopify expert die alleen themes installeert, is een monteur zonder garage. De winst zit in snelheid, data en marketing-koppelingen.",
  },
  faq: [
    {
      question: "Shopify webshop laten maken of een theme kopen?",
      answer:
        "Koop-theme is prima voor een test. Wil je merk, B2B of serieus adverteren, dan bouw ik custom. Minder apps, meer controle, hogere snelheid.",
    },
    {
      question: "Alleen Shopify?",
      answer: "Voor shops ja. Custom sites en landings doe ik in Next.js als dat slimmer is.",
    },
    {
      question: "Migratie van WooCommerce?",
      answer: "Ja. Redirects, SEO en productdata meenemen zodat je rankings niet in rook opgaan.",
    },
    {
      question: "Regel je ook Shopify SEO?",
      answer: "Ja. Structuur, productcopy, snelheid en Shopping-feed horen bij hetzelfde traject.",
    },
  ],
  ctaTitle: "Shopify die echt past?",
  ctaBody: "Vertel je assortiment en ambities. Ik zeg eerlijk of Shopify of Next.js slimmer is.",
  relatedSlugs: ["webshop-laten-maken", "b2b-portaal-bouwen", "shopify-seo", "google-shopping-ads"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
  layoutProfile: "editorial",
  enrichedOverrides: {
    story: {
      title: "Waarom ik Shopify-webshops from scratch bouw",
      paragraphs: [
        "Je googelt 'Shopify webshop laten maken' of 'Shopify theme laten maken'. Meestal krijg je een theme-installateur met een factuur. Ik bouw de shop als groeimachine: snelheid, checkout, B2B waar nodig, feeds en SEO in één plan.",
        "Bij SkinComplete bouwde ik het B2B-portaal op Shopify, zette e-mailmarketing op, en liet SEO eerst het verkeer domineren. Pas daarna gingen ads hard. Volgorde is alles.",
        "Theme-store is handig om te starten. Zodra je marge, merk of B2B-prijzen serieus worden, wringt elk appje. Dan wil je code die jij begrijpt en ik kan onderhouden.",
      ],
    },
    deepDive: {
      title: "Theme, apps of custom code",
      paragraphs: [
        "Een gekocht theme plus acht apps voelt goedkoop. Tot Core Web Vitals rood staan en Shopping duurder wordt dan je marge toelaat. Custom theme betekent: alleen wat je nodig hebt.",
        "Ik koppel Merchant Center, GA4 en je e-mailstack tijdens de build. Zo test je niet eerst zes maanden in het duister.",
        "Wil je WooCommerce eraf? Dan plan ik redirects en URL-structuur mee. Verhuizen zonder SEO-plan is een stille ranking-moord.",
      ],
    },
  },
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
  metaTitle: "Vindbaarheid in AI · genoemd in ChatGPT | Meneer Marketing",
  metaDescription:
    "Vindbaarheid in AI: genoemd worden in ChatGPT en Gemini. Citeerbare pagina's, schema en autoriteit. Google SEO en AI-antwoorden in één contentplan.",
  keywords: [
    "vindbaarheid ai",
    "chatgpt vindbaarheid",
    "gemini seo",
    "ai zoek optimalisatie",
    "gevonden worden in chatgpt",
    "ai antwoorden seo",
  ],
  eyebrow: "AI-antwoorden · jij in het antwoord",
  headline: "Vindbaar in AI.",
  headlineAccent: "Of je bent geen optie meer.",
  subheadline:
    "Steeds meer klanten vragen ChatGPT of Gemini om advies. Ik bouw content en techniek die machines wél citeren, naast klassieke Google-SEO.",
  pains: [
    { title: "Onzichtbaar in AI", body: "Je concurrent wél genoemd. Jij niet. Eerste indruk telt." },
    { title: "Alleen klassieke SEO", body: "Google rankt je. AI negeert je. Twee werelden, één contentplan nodig." },
    { title: "AI-prutswerk", body: "Bulk ChatGPT-tekst schaadt je autoriteit. Citeerbaar werk wint." },
  ],
  deliverables: [
    { title: "AI-audit", body: "Wat antwoorden ChatGPT en Gemini nu op jouw markt?" },
    { title: "Antwoord-pagina's", body: "Content die citeerbaar is. Feiten, structuur, bewijs." },
    { title: "Schema & structuur", body: "Techniek die machines begrijpen." },
    { title: "Google + AI samen", body: "Eén contentplan, twee kanalen. AI-antwoorden als volwaardige dienst." },
  ],
  visual: "ai-search",
  visualCaption: "Zo klinkt het als jij wél in het antwoord staat.",
  processTitle: "Route naar AI-vindbaarheid",
  processSteps: processDefault,
  proofTitle: "Nieuw speelveld, vroege winst",
  proofBody: "Wie nu autoriteit opbouwt in AI-antwoorden, heeft straks voorsprong. Het is SEO-2010 vibes, maar dan voor ChatGPT.",
  hotTake: { label: "Heet take", body: "Vindbaarheid in AI met alleen een blog over 'top 10 tips' is alsof je een visitekaartje in een zwart gat gooit." },
  faq: [
    {
      question: "Is ChatGPT-vindbaarheid iets anders dan vindbaarheid in AI?",
      answer:
        "ChatGPT is één kanaal. Gemini, Perplexity en AI Overviews horen erbij. Eén hub, één plan: AI-antwoorden.",
    },
    {
      question: "Is dit los van SEO?",
      answer: "Nee. Sterke, feitelijke SEO-pagina's helpen vaak ook in AI. Bulk-fluff juist niet.",
    },
    {
      question: "Hoe meet je het?",
      answer: "Handmatige checks op queries die je klanten écht stellen, plus wat er in AI Overviews verschijnt.",
    },
  ],
  ctaTitle: "In AI-antwoorden staan?",
  ctaBody: "Vertel je markt. Ik test wat AI nu zegt en wat er mist.",
  relatedSlugs: ["content-marketing-vindbaarheid", "hoger-in-google", "seo-specialist"],
  pillarSlug: "vindbaarheid",
  pillarLabel: "Vindbaarheid",
  layoutProfile: "editorial",
  enrichedOverrides: {
    story: {
      title: "ChatGPT noemt je concurrent. Jij niet.",
      paragraphs: [
        "Je typt je markt in ChatGPT. De antwoorden noemen drie merken. Jij staat er niet bij. Dat is de nieuwe 'pagina 2 van Google', alleen erger: er is geen pagina 2.",
        "Ik behandel AI-antwoorden als volwaardig kanaal naast SEO. Zelfde feiten, betere structuur, schema en bronnen die machines durven te citeren.",
        "Bulk-AI-tekst op je site helpt hier juist tegen. Wat wint: duidelijke claims, bewijs, NAP waar nodig, en pagina's die één vraag echt beantwoorden.",
      ],
    },
    deepDive: {
      title: "Zo bouw je citeerbare autoriteit",
      paragraphs: [
        "Eerst audit: wat zeggen ChatGPT en Gemini nu over jouw categorie? Welke bronnen citeren ze? Waar zit het gat.",
        "Daarna antwoord-pagina's: korte, feitelijke blokken, FAQ-schema, interne links naar je money-pages. Klassieke SEO blijft meedraaien.",
        "Tot slot ritme: updates als producten of diensten wijzigen. AI-caches zijn traag. Consistentie wint van een eenmalige contentdump.",
      ],
    },
  },
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
  relatedSlugs: ["google-ads-bureau", "google-shopping-ads"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
};
