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

export const GOOGLE_ADS_SPECIALIST: SeoLandingPage = {
  slug: "google-ads-specialist",
  primaryKeyword: "google ads specialist",
  category: "google-ads",
  metaTitle: "Google Ads specialist · Search, Shopping & landings | Meneer Marketing",
  metaDescription:
    "Google Ads specialist met marge in het hoofd. Campagnes, tracking en landingspagina's. Geen account zonder conversieplan.",
  keywords: ["google ads specialist", "google ads expert", "adwords specialist", "sea specialist nederland"],
  eyebrow: "Google Ads specialist",
  headline: "Google Ads specialist die ook",
  headlineAccent: "je landingspagina fixt.",
  subheadline:
    "Een specialist die alleen in het ads-dashboard leeft, optimaliseert op klikken. Ik optimaliseer op wat er ná de klik gebeurt. Dat scheelt je duizenden euro's leergeld.",
  pains: [
    { title: "Expert zonder site-context", body: "Mooie CPA op papier. Site converteert niet. Specialist wijst naar 'je product'." },
    { title: "Zoektermen-lek", body: "Je betaalt voor gratis, jobs en concurrenten. Niemand leest het zoektermenrapport." },
    { title: "Shopping zonder feed-discipline", body: "Merchant Center rood. Budget brandt terwijl producten afgekeurd zijn." },
  ],
  deliverables: [
    { title: "Search & Shopping", body: "Intentie-gestuurd, marge-bewust per productgroep." },
    { title: "Landings bouwen", body: "Message match. Geen homepage als alles-doos." },
    { title: "Tracking & waarde", body: "Conversies die kloppen met je bankrekening." },
    { title: "Wekelijkse optimalisatie", body: "Budget naar winnaars. Rommel eruit." },
  ],
  visual: "google-ads",
  processTitle: "Google Ads met het volle plaatje",
  processSteps: processDefault,
  proofTitle: "SkinComplete & BestRest",
  proofBody: "Verschillende shops, verschillende marges. Geen copy-paste specialist die elk account hetzelfde behandelt.",
  hotTake: { label: "Heet take", body: "Een Google Ads specialist die landings uitbesteedt, gokt met jouw budget." },
  faq: [
    { question: "Verschil met een Google Ads bureau?", answer: "Zelfde vak, andere zoekterm. Ik pak beide." },
    { question: "Beheer je bestaande accounts?", answer: "Ja. Vaak start ik met een audit: wat lekt, wat werkt." },
  ],
  ctaTitle: "Google Ads specialist nodig?",
  ctaBody: "Vertel je markt en marge. Ik geef eerlijk advies.",
  relatedSlugs: ["google-ads-bureau", "remarketing-google-ads"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
};

export const GOOGLE_ADS_UITBESTEDEN: SeoLandingPage = {
  slug: "google-ads-uitbesteden",
  primaryKeyword: "google ads uitbesteden",
  category: "google-ads",
  metaTitle: "Google Ads uitbesteden · zonder budget te verbranden | Meneer Marketing",
  metaDescription:
    "Google Ads uitbesteden met landings, tracking en wekelijkse bijsturing. Geen account dat op zichzelf draait terwijl je site lekt.",
  keywords: ["google ads uitbesteden", "google ads uitbesteden kosten", "adwords uitbesteden", "sea uitbesteden"],
  eyebrow: "Google Ads uitbesteden",
  headline: "Google Ads uitbesteden",
  headlineAccent: "zonder de controle te verliezen.",
  subheadline:
    "Uitbesteden is niet: budget geven en hopen. Het is: iemand die je account leest alsof het zijn eigen geld is, en je site aanpast als dat nodig is.",
  pains: [
    { title: "Uitbesteed en vergeten", body: "Maandrapport komt binnen. Omzet niet. Niemand vraagt waarom." },
    { title: "Geen transparantie", body: "Je weet niet waar je budget naartoe gaat of welke zoektermen geld stelen." },
    { title: "Site blijft buiten scope", body: "Bureau optimaliseert ads op een pagina die niet converteert." },
  ],
  deliverables: [
    { title: "Volledig beheer", body: "Search, Shopping, remarketing waar zinvol." },
    { title: "Transparante rapportage", body: "Zoektermen, CPA, wat we volgende week doen." },
    { title: "Landings & CRO", body: "Ik hoef niemand anders te bellen als de pagina lekt." },
    { title: "Eerlijke scope", body: "Geen pakket dat niet bij je markt past." },
  ],
  visual: "google-ads",
  processTitle: "Zo pak ik uitbesteding aan",
  processSteps: processDefault,
  proofTitle: "Ads na fundament",
  proofBody: "SkinComplete: eerst organisch en site, dan ads. Die volgorde bespaart je op uitbesteding die te vroeg begint.",
  hotTake: { label: "Heet take", body: "Google Ads uitbesteden aan iemand die je site nooit opent, is een duur experiment." },
  faq: [
    { question: "Wat kost uitbesteden?", answer: "Hangt af van markt en budget. Voorstel na intake, geen vaste pakketten op de site." },
    { question: "Kan ik tussentijds stoppen?", answer: "Ja. Maandelijks met duidelijke scope. Geen jaarcontracten die niemand leest." },
  ],
  ctaTitle: "Google Ads uitbesteden?",
  ctaBody: "Vertel je huidige situatie. Ik kijk eerlijk mee.",
  relatedSlugs: ["google-ads-bureau"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
};

export { REMARKETING_GOOGLE_ADS } from './remarketing-google-ads';

export const FACEBOOK_ADS_BUREAU: SeoLandingPage = {
  slug: "facebook-ads-bureau",
  primaryKeyword: "facebook ads bureau",
  category: "google-ads",
  metaTitle: "Facebook Ads bureau · Meta met een plan | Meneer Marketing",
  metaDescription:
    "Facebook Ads bureau voor campagnes die converteren. Geen boost-knop, wel UGC, landings en koppeling met Google Ads.",
  keywords: ["facebook ads bureau", "facebook advertising bureau", "facebook ads nederland", "meta ads facebook"],
  eyebrow: "Facebook Ads",
  headline: "Facebook Ads bureau dat",
  headlineAccent: "niet op de boost-knop leunt.",
  subheadline:
    "Facebook en Instagram zijn één platform. Maar de meeste MKB'ers zoeken 'Facebook Ads'. Prima. Ik bouw campagnes die verkopen, niet posts die likes krijgen.",
  pains: [
    { title: "Boost-post roulette", body: "Budget in één klik. Geen funnel, geen pixel, geen plan." },
    { title: "Stock die niemand gelooft", body: "Perfecte foto's, nul vertrouwen. Swipe." },
    { title: "Los van Google", body: "Twee verhalen, twee bureaus. Jij betaalt verwarring." },
  ],
  deliverables: [
    { title: "Ads Manager campagnes", body: "Conversies, leads, catalog. Niet alleen bereik." },
    { title: "UGC & creatives", body: "Echte hooks, eerste twee seconden tellen." },
    { title: "Landings op mobiel", body: "95% mobiel. Pagina moet mee." },
    { title: "Meta + Google", body: "Eén strategie onder één dak." },
  ],
  visual: "meta-ads",
  processTitle: "Facebook Ads die opleveren",
  processSteps: processDefault,
  proofTitle: "Creators + conversie",
  proofBody: "UGC en short video zitten in mijn campagne-aanpak. Niet als trucje, als standaard.",
  hotTake: { label: "Heet take", body: "Een Facebook Ads bureau zonder landingspagina wil je dopamine verkopen, geen omzet." },
  faq: [
    { question: "Facebook of Meta?", answer: "Zelfde platform. Ik spreek beide talen." },
    { question: "Doen jullie ook Instagram?", answer: "Ja. Vaak dezelfde campagnes, andere placements." },
  ],
  ctaTitle: "Facebook Ads zonder boost-gokken?",
  ctaBody: "Vertel je product. Ik schets of het nu past.",
  relatedSlugs: ["meta-ads-bureau", "tiktok-ads-bureau"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
};

export const INSTAGRAM_ADS_BUREAU: SeoLandingPage = {
  slug: "instagram-ads-bureau",
  primaryKeyword: "instagram ads bureau",
  category: "google-ads",
  metaTitle: "Instagram Ads bureau · Reels & feed die converteren | Meneer Marketing",
  metaDescription:
    "Instagram Ads bureau met UGC, Reels en landings voor mobiel. Geen feed die alleen mooi is, wel ads die verkopen.",
  keywords: ["instagram ads bureau", "instagram advertising", "instagram ads nederland", "reels ads bureau"],
  eyebrow: "Instagram Ads",
  headline: "Instagram Ads bureau voor",
  headlineAccent: "scroll-stoppers, geen stockfoto's.",
  subheadline:
    "Instagram is visueel en snel. Je ad heeft twee seconden. Daarna swipe. Ik bouw creatives en landings die in die twee seconden vertrouwen pakken.",
  pains: [
    { title: "Mooi maar niet verkopend", body: "Esthetische feed, lege winkelwagen." },
    { title: "Reels zonder hook", body: "Logo eerst, view weg. Budget weg." },
    { title: "Landings voor desktop", body: "Je ad is mobiel. Je pagina denkt nog laptop." },
  ],
  deliverables: [
    { title: "Reels & Stories ads", body: "UGC, creators, short video." },
    { title: "Shopping & catalog", body: "Producten direct in de feed." },
    { title: "Mobiele landings", body: "Snel, één CTA, message match." },
    { title: "Testen op hooks", body: "Creatives roteren op data." },
  ],
  visual: "meta-ads",
  processTitle: "Instagram die verkoopt",
  processSteps: processDefault,
  proofTitle: "Visual + conversie",
  proofBody: "Bij consumer en lifestyle producten is Instagram vaak de eerste indruk. Die moet converteren, niet alleen indrukken.",
  hotTake: { label: "Heet take", body: "Instagram Ads met je product op een witte achtergrond en niets anders is een catalogus die niemand openslaat." },
  faq: [
    { question: "Alleen Instagram?", answer: "Nee. Meta campagnes dekken Instagram en Facebook." },
    { question: "Werken jullie met influencers?", answer: "Ja. UGC en creators onderdeel van het plan." },
  ],
  ctaTitle: "Instagram Ads proberen?",
  ctaBody: "Vertel je doelgroep. Ik zeg eerlijk of het zinvol is.",
  relatedSlugs: ["meta-ads-bureau", "tiktok-ads-bureau"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
};

export const SHOPIFY_WEBSHOP_LATEN_MAKEN: SeoLandingPage = {
  slug: "shopify-webshop-laten-maken",
  primaryKeyword: "shopify webshop laten maken",
  category: "shopify",
  metaTitle: "Shopify webshop laten maken · custom, snel, schaalbaar | Meneer Marketing",
  metaDescription:
    "Shopify webshop laten maken from scratch. Custom theme, B2B waar nodig, SEO en marketing erop. Geen template die je groei remt.",
  keywords: ["shopify webshop laten maken", "shopify shop laten maken", "shopify webshop bouwen", "shopify ontwikkelaar nederland"],
  eyebrow: "Shopify webshop",
  headline: "Shopify webshop laten maken",
  headlineAccent: "zonder theme-store plafond.",
  subheadline:
    "Shopify is krachtig als je het goed inricht. Ik bouw custom shops die snel laden, merk-eigen zijn en meegroeien met je marketing. Geen demo-store die je over twee jaar uitgroeit.",
  pains: [
    { title: "Theme-limitaties", body: "Je wilt uniek. Het theme zegt nee." },
    { title: "Trage shop", body: "Apps en sliders killen conversie en ROAS." },
    { title: "Marketing losgekoppeld", body: "Shop klaar. Niemand vindt hem." },
  ],
  deliverables: [
    { title: "Custom Shopify theme", body: "Snel, schaalbaar, jouw merk." },
    { title: "B2B-portaal optie", body: "Prijzen, login, herbestellen." },
    { title: "SEO & Shopping klaar", body: "Techniek en feed vanaf dag één." },
    { title: "Doorlopend beheer", body: "Features, updates, groei." },
  ],
  visual: "webshop",
  processTitle: "Shopify traject",
  processSteps: processDefault,
  proofTitle: "SkinComplete",
  proofBody: "B2B-portaal, marketing en vindbaarheid op Shopify. Dat is mijn referentie.",
  proofCase: "SkinComplete",
  hotTake: { label: "Heet take", body: "Een Shopify webshop laten maken met alleen een theme installeren is een monteur zonder garage." },
  faq: [
    { question: "Verschil met webshop laten maken?", answer: "Zelfde intentie. Deze pagina is voor wie specifiek Shopify zoekt." },
    { question: "Migratie van WooCommerce?", answer: "Ja, met SEO en redirects." },
  ],
  ctaTitle: "Shopify webshop starten?",
  ctaBody: "Vertel je assortiment en ambities.",
  relatedSlugs: ["shopify-expert", "webshop-laten-maken", "shopify-seo"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
};

export { SHOPIFY_SEO } from './shopify-seo';

export { NEXTJS_WEBSITE_LATEN_MAKEN } from './nextjs-website-laten-maken';

export const WEBSITE_LATEN_BOUWEN: SeoLandingPage = {
  slug: "website-laten-bouwen",
  primaryKeyword: "website laten bouwen",
  category: "website",
  metaTitle: "Website laten bouwen · custom from scratch | Meneer Marketing",
  metaDescription:
    "Website laten bouwen without templates of page builders. Next.js, SEO-klaar, conversiegericht. Jouw online marketing manager bouwt mee.",
  keywords: ["website laten bouwen", "website bouwen op maat", "professionele website laten bouwen", "website laten maken"],
  eyebrow: "Website bouwen",
  headline: "Website laten bouwen",
  headlineAccent: "die Google en klanten serieus nemen.",
  subheadline:
    "Website laten bouwen klinkt als hetzelfde als website laten maken. Klopt grotendeels. Alleen zoek jij misschien 'bouwen' omdat je een fundament wilt, geen skin over oude rotzooi.",
  pains: [
    { title: "Template-plafond", body: "Goedkoop starten, duur uitgroeien." },
    { title: "Geen SEO-fundament", body: "Mooi design, pagina 4 in Google." },
    { title: "Bouwer zonder marketing", body: "Site live. Niemand komt." },
  ],
  deliverables: [
    { title: "Custom build", body: "From scratch in Next.js. Geen page builder." },
    { title: "Conversie & snelheid", body: "CWV groen, duidelijke CTA's." },
    { title: "SEO ingebakken", body: "Schema, structuur, techniek." },
    { title: "Marketing aansluiten", body: "Ads, content en automatisering vanaf dag één meedenken." },
  ],
  visual: "website-build",
  processTitle: "Bouwen dat blijft staan",
  processSteps: processDefault,
  proofTitle: "Sites die groeien",
  proofBody: "Ik bouw niet alleen. Ik denk mee over vindbaarheid en campagnes. Anders heb je een visitekaartje in het zwart.",
  hotTake: { label: "Heet take", body: "Website laten bouwen in Wix en dan €5.000 per maand in ads is een dure poster." },
  faq: [
    { question: "Verschil met website laten maken?", answer: "Zelfde aanpak. Deze pagina vangt zoekers die 'bouwen' typen." },
    { question: "Hoe snel live?", answer: "Hangt af van scope. Landings sneller dan volledige corporate sites." },
  ],
  ctaTitle: "Website laten bouwen?",
  ctaBody: "Vertel je doel. Ik schets de aanpak.",
  relatedSlugs: ["website-laten-maken", "nextjs-website-laten-maken", "leadgeneratie-website"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
};

export { SEO_AUDIT } from './seo-audit';

export const SEO_UITBESTEDEN: SeoLandingPage = {
  slug: "seo-uitbesteden",
  primaryKeyword: "seo uitbesteden",
  category: "seo",
  metaTitle: "SEO uitbesteden · organisch groeien zonder trucjes | Meneer Marketing",
  metaDescription:
    "SEO uitbesteden met techniek, content en AI-vindbaarheid. Geen maandelijkse rapportage zonder rankings. Wel een plan dat blijft staan.",
  keywords: ["seo uitbesteden", "zoekmachine optimalisatie uitbesteden", "seo uitbesteden kosten", "seo beheer uitbesteden"],
  eyebrow: "SEO uitbesteden",
  headline: "SEO uitbesteden",
  headlineAccent: "zonder maandelijkse hoop-briefing.",
  subheadline:
    "Uitbesteden is niet: blogs laten schrijven door iemand die je branche niet snapt. Het is: techniek fixen, pagina's bouwen die ranken, en autoriteit opbouwen die blijft.",
  pains: [
    { title: "Content-zonder-techniek", body: "50 blogs. Site nog traag. Google ongeïnteresseerd." },
    { title: "Geen transparantie", body: "Je weet niet wat er gedaan wordt of waarom." },
    { title: "Garanties die liegen", body: "Pagina 1 in 30 dagen. Run." },
  ],
  deliverables: [
    { title: "Technische SEO", body: "Snelheid, indexatie, schema." },
    { title: "Content met intentie", body: "Pagina's die klanten opleveren." },
    { title: "AI-vindbaarheid", body: "Ook ChatGPT en Gemini meenemen." },
    { title: "Maandelijkse voortgang", body: "Rankings, traffic, wat volgende maand." },
  ],
  visual: "seo-serp",
  processTitle: "SEO die rendeert",
  processSteps: processDefault,
  proofTitle: "SkinComplete organisch eerst",
  proofBody: "SEO uitbesteden werkt als je partner kan bouwen én schrijven. Niet alleen het een of het ander.",
  proofCase: "SkinComplete",
  hotTake: { label: "Heet take", body: "SEO uitbesteden aan een bureau dat je site niet in code kan lezen, is een abonnement op teleurstelling." },
  faq: [
    { question: "Hoe snel resultaat?", answer: "Eerste signalen vaak 6-12 weken. Eerlijk gecommuniceerd." },
    { question: "Verschil met SEO specialist?", answer: "Zelfde werk. 'Uitbesteden' is hoe veel MKB zoekt." },
  ],
  ctaTitle: "SEO uitbesteden?",
  ctaBody: "Vertel je domein en doelen. Ik schets de aanpak.",
  relatedSlugs: ["seo-specialist", "seo-audit"],
  pillarSlug: "vindbaarheid",
  pillarLabel: "Vindbaarheid",
};

export { LINKBUILDING_BUREAU } from './linkbuilding-bureau';

export const ONLINE_MARKETING_MANAGER: SeoLandingPage = {
  slug: "online-marketing-manager",
  primaryKeyword: "online marketing manager",
  category: "seo",
  metaTitle: "Online marketing manager · één aanspreekpunt | Meneer Marketing",
  metaDescription:
    "Jouw online marketing manager: strategie, bouw, SEO, Google Ads en Meta. Geen vijf freelancers, wel één plan en één stem.",
  keywords: ["online marketing manager", "marketing manager inhuren", "online marketing manager mkb", "externe marketing manager"],
  eyebrow: "Online marketing manager",
  headline: "Jouw online marketing manager.",
  headlineAccent: "Zonder HR-gedoe.",
  subheadline:
    "Ik ben geen bureau met 40 junior medewerkers. Ik ben de online marketing manager die je site bouwt, je SEO fixt en je ads bijstuurt. Eén brein, één lijn, geen spaghetti.",
  pains: [
    { title: "Te veel partijen", body: "SEO hier, ads daar, site door een neef. Niemand heeft overzicht." },
    { title: "Intern te duur of te weinig tijd", body: "Een fulltime manager is zwaar voor veel MKB." },
    { title: "Bureau zonder uitvoering", body: "Slides en rapporten. Geen pagina die live gaat." },
  ],
  deliverables: [
    { title: "Strategie & prioriteit", body: "Wat eerst, wat later. Eerlijk." },
    { title: "Uitvoering", body: "Bouwen, schrijven, campagnes draaien." },
    { title: "Wekelijks bijsturen", body: "Geen kwartaalgesprek over cijfers van drie maanden geleden." },
    { title: "Eén aanspreekpunt", body: "Jij praat met mij. Niet met een account manager die wisselt." },
  ],
  visual: "content-hub",
  visualCaption: "Eén manager. Eén plan. Geen eilandjes.",
  processTitle: "Zo werk ik als jouw manager",
  processSteps: processDefault,
  proofTitle: "SkinComplete & BestRest",
  proofBody: "Van shop tot SEO tot ads: ik ken het traject omdat ik het zo heb gedaan voor echte klanten.",
  hotTake: { label: "Heet take", body: "Een online marketing manager die niet kan bouwen, is een planner zonder werkplaats." },
  faq: [
    { question: "Vervang ik mijn hele team?", answer: "Nee. Ik vul aan waar het moet en pak de rode draad." },
    { question: "Hoeveel uur per maand?", answer: "Hangt af van scope. Intake bepaalt wat je nodig hebt." },
  ],
  ctaTitle: "Marketing manager nodig?",
  ctaBody: "Vertel waar je nu zit. Ik schets hoe ik aansluit.",
  relatedSlugs: ["online-marketing-bureau", "google-ads-bureau", "hoger-in-google"],
  pillarSlug: "strategie",
  pillarLabel: "Strategie",
};

export const PERFORMANCE_MARKETING_BUREAU: SeoLandingPage = {
  slug: "performance-marketing-bureau",
  primaryKeyword: "performance marketing bureau",
  category: "google-ads",
  metaTitle: "Performance marketing bureau · meetbaar groeien | Meneer Marketing",
  metaDescription:
    "Performance marketing bureau: Google Ads, Meta, Shopping en landings die converteren. ROAS en CPA met marge in het hoofd.",
  keywords: ["performance marketing bureau", "performance marketing nederland", "datagedreven marketing bureau"],
  eyebrow: "Performance marketing",
  headline: "Performance marketing bureau",
  headlineAccent: "dat je bankrekening snapt.",
  subheadline:
    "Performance marketing klinkt als jargon. Het betekent: elke euro moet je kunnen verantwoorden. Ik meet wat werkt, stop wat lekt, en bouw wat ontbreekt.",
  pains: [
    { title: "Metrics zonder marge", body: "ROAS 5 op producten die verlies draaien." },
    { title: "Klikken als doel", body: "Dashboard groen. Omzet grijs." },
    { title: "Kanalen zonder samenhang", body: "Google en Meta vechten tegen elkaar." },
  ],
  deliverables: [
    { title: "Google & Meta performance", body: "Search, Shopping, social met conversiedoel." },
    { title: "Tracking & attributie", body: "Weten wat echt oplevert." },
    { title: "Landings & CRO", body: "Performance stopt niet bij de klik." },
    { title: "Wekelijkse optimalisatie", body: "Budget naar bewezen winnaars." },
  ],
  visual: "google-ads",
  processTitle: "Performance met discipline",
  processSteps: processDefault,
  proofTitle: "BestRest per product",
  proofBody: "Performance marketing werkt per productlijn, niet op accountniveau met gemiddelden die liegen.",
  hotTake: { label: "Heet take", body: "Performance marketing zonder iemand die je site kan fixen, is optimalisatie in een huis met lekkende ramen." },
  faq: [
    { question: "Verschil met online marketing bureau?", answer: "Performance focust op meetbare acquisitie. Ik pak vaak het bredere plaatje mee." },
    { question: "Minimum budget?", answer: "Afhankelijk van markt. Breakeven eerst doorrekenen." },
  ],
  ctaTitle: "Performance marketing starten?",
  ctaBody: "Vertel je doelen en marge. Ik schets het plan.",
  relatedSlugs: ["google-ads-bureau", "conversie-optimalisatie"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
};

export const CRO_BUREAU: SeoLandingPage = {
  slug: "cro-bureau",
  primaryKeyword: "cro bureau",
  category: "website",
  metaTitle: "CRO bureau · meer omzet uit hetzelfde verkeer | Meneer Marketing",
  metaDescription:
    "CRO bureau voor websites en webshops. Conversie optimalisatie in code, niet alleen heatmaps. Meer verkopen zonder meer ads-budget.",
  keywords: ["cro bureau", "conversion rate optimization bureau", "conversie bureau", "cro specialist nederland"],
  eyebrow: "CRO bureau",
  headline: "CRO bureau dat",
  headlineAccent: "in code fixt, niet alleen rapporteert.",
  subheadline:
    "CRO is niet een heatmap-abonnement. Het is weten waar bezoekers afhaken en dat oplossen in je site. Ik bouw, meet en pas aan. Geen PDF die in een la verdwijnt.",
  pains: [
    { title: "Veel traffic, weinig sales", body: "Ads of SEO werken. Site niet." },
    { title: "A/B-test zonder plan", body: "Knop groen of rood. Geen hypothese." },
    { title: "CRO los van tech", body: "Advies dat dev niet kan bouwen." },
  ],
  deliverables: [
    { title: "Funnel-audit", body: "Waar lekt het van klik tot checkout." },
    { title: "UX & snelheid", body: "Mobiel eerst. CWV groen." },
    { title: "Copy & structuur", body: "Duidelijke belofte, bewijs, CTA." },
    { title: "Implementatie", body: "Ik pas aan in Next.js of Shopify." },
  ],
  visual: "website-build",
  processTitle: "CRO die oplevert",
  processSteps: processDefault,
  proofTitle: "BestRest & shops",
  proofBody: "Elke procent conversie telt op schaal. CRO is de goedkoopste groei als je al verkeer hebt.",
  hotTake: { label: "Heet take", body: "Een CRO bureau dat je site niet aanraakt, verkoopt je inzichten die niemand uitvoert." },
  faq: [
    { question: "Verschil met conversie optimalisatie?", answer: "Zelfde vak. CRO is de engelse term die veel wordt gezocht." },
    { question: "Hoeveel uplift?", answer: "Hangt af van hoe lelijk het nu is. Eerst audit." },
  ],
  ctaTitle: "CRO laten checken?",
  ctaBody: "Stuur je URL. Ik noem de grootste lekken.",
  relatedSlugs: ["conversie-optimalisatie", "landing-page-laten-maken", "google-ads-bureau"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
};

export { TRACKING_GOOGLE_ANALYTICS } from './tracking-google-analytics';

