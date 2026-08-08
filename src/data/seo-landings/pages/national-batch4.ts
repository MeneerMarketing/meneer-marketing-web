import type { SeoLandingPage } from "@/data/seo-landings/types";

const processDefault = [
  { title: "Intake zonder salescircus", body: "Jij vertelt waar je zit. Ik zeg eerlijk wat zin heeft en wat niet." },
  { title: "Plan met volgorde", body: "Niet alles tegelijk. Eerst wat het snelst oplevert of het fundament fixt." },
  { title: "Uitvoeren", body: "Ik bouw, schrijf en zet live. Alles onder één dak." },
  { title: "Meten en bijsturen", body: "Cijfers beslissen. Sentiment niet." },
] as const;

export const DIGITAL_MARKETING_BUREAU: SeoLandingPage = {
  slug: "digital-marketing-bureau",
  primaryKeyword: "digital marketing bureau",
  category: "seo",
  metaTitle: "Digital marketing bureau · online groei from scratch | Meneer Marketing",
  metaDescription: "Digital marketing bureau dat bouwt, vindbaar maakt en campagnes draait. Site, SEO, Google Ads en Meta onder één dak.",
  keywords: ["digital marketing bureau", "digitaal marketing bureau", "digital agency nederland"],
  eyebrow: "Digital marketing",
  headline: "Digital marketing bureau",
  headlineAccent: "zonder PowerPoint-fabriek.",
  subheadline: "Digital marketing is geen apart universum. Het is online groeien met een site die werkt, vindbaarheid die blijft en ads die niet lekken. Ik doe het allemaal. Zelf.",
  pains: [
    { title: "Bureau zonder developers", body: "Mooie strategie. Niemand die hem bouwt." },
    { title: "Kanaal-eilandjes", body: "SEO hier, social daar. Alles los van elkaar." },
    { title: "Rapporten zonder actie", body: "Data zonder pagina die live gaat." },
  ],
  deliverables: [
    { title: "Strategie & volgorde", body: "Wat eerst, wat later." },
    { title: "Bouwen from scratch", body: "Next.js of Shopify, geen templates." },
    { title: "Vindbaarheid", body: "Google én AI-antwoorden." },
    { title: "Campagnes", body: "Google Ads en Meta als het past." },
  ],
  visual: "content-hub",
  processTitle: "Digital met één lijn",
  processSteps: processDefault,
  proofTitle: "SkinComplete & BestRest",
  proofBody: "Digital marketing die werkt, ziet eruit als één verhaal van site tot ad.",
  hotTake: { label: "Heet take", body: "Een digital marketing bureau zonder code in huis, verkoopt je slides." },
  faq: [
    { question: "Verschil met online marketing bureau?", answer: "Engelse vs Nederlandse zoekterm. Zelfde aanpak." },
  ],
  ctaTitle: "Digital marketing starten?",
  ctaBody: "Vertel waar je nu zit. Ik schets de volgorde.",
  relatedSlugs: ["online-marketing-bureau", "online-marketing-manager", "google-ads-bureau"],
  pillarSlug: "strategie",
  pillarLabel: "Strategie",
};

export const ZOEKMACHINE_MARKETING: SeoLandingPage = {
  slug: "zoekmachine-marketing",
  primaryKeyword: "zoekmachine marketing",
  category: "seo",
  metaTitle: "Zoekmachine marketing · SEO & SEA samen | Meneer Marketing",
  metaDescription: "Zoekmachine marketing: organisch én betaald onder één strategie. SEO en SEA die samenwerken.",
  keywords: ["zoekmachine marketing", "zoekmachine marketing bureau", "sem marketing"],
  eyebrow: "Zoekmachine marketing",
  headline: "Zoekmachine marketing",
  headlineAccent: "waar SEO en ads elkaar niet voor de voeten lopen.",
  subheadline: "Zoekmachine marketing is het hele speelveld: Google, rankings, ads, Shopping. Niet twee bureaus die elkaar tegenspreken terwijl jij de rekening betaalt.",
  pains: [
    { title: "SEO vs SEA oorlog", body: "Twee partijen, twee verhalen." },
    { title: "Data in silo's", body: "Organisch en betaald leren niet van elkaar." },
    { title: "Dubbele kosten", body: "Twee retainers voor één zoekmachine." },
  ],
  deliverables: [
    { title: "SEO + SEA integratie", body: "Eén keyword-strategie." },
    { title: "Gedeelde landings", body: "Pagina's die ranken én converteren voor ads." },
    { title: "Budget op intentie", body: "Ads waar SEO nog niet wint. SEO waar het duurzaam is." },
    { title: "Transparante rapportage", body: "Eén dashboard, één waarheid." },
  ],
  visual: "seo-serp",
  processTitle: "Zoekmachines domineren",
  processSteps: processDefault,
  proofTitle: "SkinComplete-volgorde",
  proofBody: "Eerst organisch, dan ads. Zoekmachine marketing met een plan, niet met paniek.",
  hotTake: { label: "Heet take", body: "Zoekmachine marketing door twee bureaus is twee koks in één keuken. Chaos gegarandeerd." },
  faq: [
    { question: "Alleen Google?", answer: "Focus Google. Meta apart maar in één strategie." },
  ],
  ctaTitle: "Zoekmachine marketing uitbesteden?",
  ctaBody: "Vertel je markt. Ik schets SEO + SEA samen.",
  relatedSlugs: ["seo-specialist", "google-ads-bureau"],
  pillarSlug: "vindbaarheid",
  pillarLabel: "Vindbaarheid",
};

export const ADVERTENTIEBEHEER: SeoLandingPage = {
  slug: "advertentiebeheer",
  primaryKeyword: "advertentiebeheer",
  category: "google-ads",
  metaTitle: "Advertentiebeheer · Google & Meta onder controle | Meneer Marketing",
  metaDescription: "Advertentiebeheer voor Google Ads en Meta. Wekelijks bijsturen, zoektermen schoon, landings die matchen.",
  keywords: ["advertentiebeheer", "online advertentiebeheer", "advertenties beheren", "ad account beheer"],
  eyebrow: "Advertentiebeheer",
  headline: "Advertentiebeheer dat",
  headlineAccent: "je budget niet aan zombies geeft.",
  subheadline: "Advertentiebeheer is niet inloggen en hopen. Het is wekelijks zoektermen lezen, budget verschuiven en landings fixen als ze lekken.",
  pains: [
    { title: "Account op autopilot", body: "Niemand kijkt ernaar tot het pijn doet." },
    { title: "Zombie-campagnes", body: "Oude tests die nog budget eten." },
    { title: "Account zonder eigenaar", body: "Iedereen verantwoordelijk, niemand accountable." },
  ],
  deliverables: [
    { title: "Wekelijks beheer", body: "Biedingen, zoektermen, budget." },
    { title: "Maandrapport met actie", body: "Wat we deden, wat volgende week." },
    { title: "Landings bijsturen", body: "Message match blijft kloppen." },
    { title: "Google + Meta", body: "Eén strategie, twee platforms." },
  ],
  visual: "google-ads",
  processTitle: "Beheer dat oplevert",
  processSteps: processDefault,
  proofTitle: "Accounts die ik overnam",
  proofBody: "Vaak vind ik 15-30% budget op zoektermen die niemand zou goedkeuren. Dat is gratis winst.",
  hotTake: { label: "Heet take", body: "Advertentiebeheer zonder zoektermenrapport is een abonnement op hoop." },
  faq: [
    { question: "Verschil met Google Ads beheer?", answer: "Zelfde werk. 'Advertentiebeheer' is hoe veel MKB zoekt." },
  ],
  ctaTitle: "Advertenties laten beheren?",
  ctaBody: "Vertel je huidige spend. Ik kijk eerlijk mee.",
  relatedSlugs: ["google-ads-bureau", "meta-ads-bureau"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
};

export { SOCIAL_MEDIA_ADVERTISING } from './social-media-advertising';

export { UGC_MARKETING } from './ugc-marketing';

export { INFLUENCER_MARKETING_BUREAU } from './influencer-marketing-bureau';

export { B2B_MARKETING_BUREAU } from './b2b-marketing-bureau';

export const ECOMMERCE_SPECIALIST: SeoLandingPage = {
  slug: "ecommerce-specialist",
  primaryKeyword: "ecommerce specialist",
  category: "shopify",
  metaTitle: "E-commerce specialist · shop, SEO & ads | Meneer Marketing",
  metaDescription: "E-commerce specialist voor Shopify groei. Techniek, marketing en automatisering met uitvoering.",
  keywords: ["ecommerce specialist", "e-commerce specialist nederland", "webshop specialist"],
  eyebrow: "E-commerce specialist",
  headline: "E-commerce specialist",
  headlineAccent: "die ook in je theme kan duiken.",
  subheadline: "Een e-commerce specialist die alleen spreadsheets maakt, mist de helft. Ik fix je shop, je feed, je ads en je mail. Eén brein voor je hele keten.",
  pains: [
    { title: "Advies zonder uitvoering", body: "Rapport over ROAS. Niemand fix de site." },
    { title: "Tool-chaos", body: "Tien apps, niemand overzicht." },
    { title: "Groei zonder marge", body: "Omzet omhoog, winst vlak." },
  ],
  deliverables: [
    { title: "Shop optimalisatie", body: "Snelheid, UX, checkout." },
    { title: "SEO & Shopping", body: "Organisch + betaald." },
    { title: "E-mail & retentie", body: "Klaviyo flows die werken." },
    { title: "Automatisering", body: "Minder handwerk, meer schaal." },
  ],
  visual: "webshop",
  processTitle: "E-commerce end-to-end",
  processSteps: processDefault,
  proofTitle: "SkinComplete & BestRest",
  proofBody: "Twee shops, twee strategieën. E-commerce is nooit one-size-fits-all.",
  hotTake: { label: "Heet take", body: "Een e-commerce specialist die Shopify niet kan aanpassen, is een coach zonder gym." },
  faq: [
    { question: "Verschil met e-commerce marketing?", answer: "Overlap. Specialist = meer techniek + uitvoering." },
  ],
  ctaTitle: "E-commerce hulp nodig?",
  ctaBody: "Stuur je shop-URL.",
  relatedSlugs: ["e-commerce-marketing", "shopify-expert"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
};

export const WEBSHOP_MARKETING: SeoLandingPage = {
  slug: "webshop-marketing",
  primaryKeyword: "webshop marketing",
  category: "shopify",
  metaTitle: "Webshop marketing · groei voor je shop | Meneer Marketing",
  metaDescription: "Webshop marketing: SEO, Google Shopping, Meta, e-mail. Eén plan voor je hele shop.",
  keywords: ["webshop marketing", "webshop marketing bureau", "online winkel marketing"],
  eyebrow: "Webshop marketing",
  headline: "Webshop marketing",
  headlineAccent: "zonder benzine in een lekke tank.",
  subheadline: "Meer ads op een shop die niet converteert is verspilling met extra stappen. Webshop marketing begint bij je productpagina en eindigt bij herhaalaankopen.",
  pains: [
    { title: "Alleen nieuwe klanten", body: "Retentie vergeten. CAC explodeert." },
    { title: "Seizoenspaniek", body: "Black Friday zonder plan." },
    { title: "Kanalen los", body: "SEO hier, ads daar, mail nergens." },
  ],
  deliverables: [
    { title: "Marketingkalender", body: "Seizoen, launches, flows." },
    { title: "Acquisitie", body: "Google, Meta, Shopping." },
    { title: "Retentie", body: "E-mail, remarketing." },
    { title: "Meten per kanaal", body: "Weten wat werkt." },
  ],
  visual: "webshop",
  processTitle: "Shop laten groeien",
  processSteps: processDefault,
  proofTitle: "BestRest per product",
  proofBody: "Webshop marketing per productlijn, niet één sop voor alles.",
  hotTake: { label: "Heet take", body: "Webshop marketing met alleen kortingscodes is een uitverkoop, geen strategie." },
  faq: [
    { question: "Klein assortiment?", answer: "Juist dan: focus en marge per SKU." },
  ],
  ctaTitle: "Webshop marketing uitbesteden?",
  ctaBody: "Vertel je omzet en doelen.",
  relatedSlugs: ["e-commerce-marketing", "shopify-seo", "google-shopping-ads"],
  pillarSlug: "strategie",
  pillarLabel: "Strategie",
};

export { PRODUCTPAGINA_SEO } from './productpagina-seo';

export const CHATGPT_VINDBAARHEID: SeoLandingPage = {
  slug: "chatgpt-vindbaarheid",
  primaryKeyword: "chatgpt vindbaarheid",
  category: "content",
  metaTitle: "ChatGPT vindbaarheid · genoemd worden in AI-antwoorden | Meneer Marketing",
  metaDescription: "ChatGPT vindbaarheid: zo kom je in antwoorden van ChatGPT en Gemini. Structuur, content en autoriteit die AI citeert.",
  keywords: ["chatgpt vindbaarheid", "gevonden worden chatgpt", "ai seo chatgpt", "chatgpt marketing"],
  eyebrow: "ChatGPT vindbaarheid",
  headline: "ChatGPT vindbaarheid.",
  headlineAccent: "Of je bestaat niet in het antwoord.",
  subheadline: "Je klant vraagt ChatGPT welk bureau, welk product, welke oplossing. Sta jij er niet tussen, ben je geen optie. ChatGPT vindbaarheid is geen truc. Het is goede content die machines kunnen citeren.",
  pains: [
    { title: "Onzichtbaar in AI", body: "Concurrent wél genoemd. Jij niet." },
    { title: "Alleen klassieke SEO", body: "Google rankt je. ChatGPT negeert je." },
    { title: "AI-blogs bulk", body: "Meer ruis, geen autoriteit." },
  ],
  deliverables: [
    { title: "AI-audit", body: "Wat zegt ChatGPT nu over jouw markt?" },
    { title: "Antwoord-pagina's", body: "Content die citeerbaar is." },
    { title: "Schema & consistentie", body: "Machines snappen wie je bent." },
    { title: "Google + AI samen", body: "Eén plan, twee kanalen." },
  ],
  visual: "ai-search",
  processTitle: "Route naar AI-antwoorden",
  processSteps: processDefault,
  proofTitle: "Vroege winst",
  proofBody: "Wie nu autoriteit bouwt in AI, heeft straks voorsprong. SEO-2010 vibes.",
  hotTake: { label: "Heet take", body: "ChatGPT vindbaarheid met een blog over 'top 10 tips' is een visitekaartje in een zwart gat." },
  faq: [
    { question: "Verschil met vindbaarheid-ai?", answer: "Zelfde dienst. 'ChatGPT' is hoe mensen zoeken." },
  ],
  ctaTitle: "In ChatGPT-antwoorden staan?",
  ctaBody: "Vertel je markt. Ik test wat AI nu zegt.",
  relatedSlugs: ["vindbaarheid-ai", "content-marketing-vindbaarheid", "seo-specialist"],
  pillarSlug: "vindbaarheid",
  pillarLabel: "Vindbaarheid",
};

export { GOOGLE_MAPS_MARKETING } from './google-maps-marketing';

export const WEBDESIGN_BUREAU: SeoLandingPage = {
  slug: "webdesign-bureau",
  primaryKeyword: "webdesign bureau",
  category: "website",
  metaTitle: "Webdesign bureau · design dat converteert | Meneer Marketing",
  metaDescription: "Webdesign bureau from scratch. Mooi én snel, SEO-klaar, conversiegericht.",
  keywords: ["webdesign bureau", "website design bureau", "webdesign bureau nederland"],
  eyebrow: "Webdesign",
  headline: "Webdesign bureau",
  headlineAccent: "waar design niet wint van snelheid.",
  subheadline: "Mooie sites die twintig seconden laden, zijn musea. Ik ontwerp webdesign dat converteert: typografie met punch, oranje accenten die werken, en code die Google en klanten respecteren.",
  pains: [
    { title: "Design zonder dev", body: "Figma-pracht, live ramp." },
    { title: "Template look", body: "Iedereen herkent het theme." },
    { title: "SEO ontbreekt", body: "Mooi op pagina 4." },
  ],
  deliverables: [
    { title: "Custom design", body: "Merk-eigen, geen stock-template." },
    { title: "Conversie-UX", body: "CTA's, hiërarchie, vertrouwen." },
    { title: "Snelheid ingebouwd", body: "CWV als ontwerp-eis." },
    { title: "SEO-structuur", body: "Semantiek en schema vanaf dag één." },
  ],
  visual: "website-build",
  processTitle: "Design dat live gaat",
  processSteps: processDefault,
  proofTitle: "MeneerMarketing aesthetic",
  proofBody: "Minimalistisch, bold type, micro-interacties. Design en dev in één hand.",
  hotTake: { label: "Heet take", body: "Een webdesign bureau dat alleen Photoshop kent, levert een poster, geen website." },
  faq: [
    { question: "Alleen design?", answer: "Nee. Design + bouw in Next.js of Shopify." },
  ],
  ctaTitle: "Webdesign bespreken?",
  ctaBody: "Vertel je merk en doelen.",
  relatedSlugs: ["website-laten-maken", "nextjs-website-laten-maken", "conversie-optimalisatie"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
};

export { GROWTH_MARKETING_BUREAU } from './growth-marketing-bureau';

export { LINKEDIN_ADS_BUREAU } from './linkedin-ads-bureau';

export { KLAVIYO_SPECIALIST } from './klaviyo-specialist';

export { CORE_WEB_VITALS } from './core-web-vitals-verbeteren';

export { MARKETING_CONSULTANT_MKB } from './marketing-consultant-mkb';

export { TRAGE_WEBSITE_DURE_ADS } from './trage-website-dure-ads';

export const SHOPIFY_THEME_LATEN_MAKEN: SeoLandingPage = {
  slug: "shopify-theme-laten-maken",
  primaryKeyword: "shopify theme laten maken",
  category: "shopify",
  metaTitle: "Shopify theme laten maken · custom & snel | Meneer Marketing",
  metaDescription: "Shopify theme laten maken from scratch. Snel, merk-eigen, SEO-klaar.",
  keywords: ["shopify theme laten maken", "custom shopify theme", "shopify theme ontwikkelaar"],
  eyebrow: "Shopify theme",
  headline: "Shopify theme laten maken",
  headlineAccent: "dat je theme-store niet kan.",
  subheadline: "Themes uit de store zijn startpunten. Groei je, dan wringt het. Ik bouw custom Shopify themes die snel zijn, jouw merk dragen en meegroeien met B2B, SEO en marketing.",
  pains: [
    { title: "Theme-limitaties", body: "Je wilt X. Theme zegt nee." },
    { title: "App-bloat", body: "Elke functie een app. Site traag." },
    { title: "Generieke look", body: "Concurrent heeft hetzelfde theme." },
  ],
  deliverables: [
    { title: "Custom theme development", body: "Liquid, performance, UX." },
    { title: "Sections die je team snapt", body: "Beheerbaar zonder dev voor elke wijziging." },
    { title: "SEO & schema", body: "Techniek ingebakken." },
    { title: "Doorontwikkeling", body: "Features als je groeit." },
  ],
  visual: "webshop",
  processTitle: "Theme dat schaalt",
  processSteps: processDefault,
  proofTitle: "SkinComplete",
  proofBody: "Custom theme + B2B + marketing. Dat is het niveau waar je naartoe wilt.",
  proofCase: "SkinComplete",
  hotTake: { label: "Heet take", body: "Een Shopify theme laten maken door iemand die alleen themes installeert, is een Ferrari-bestelling met fietswielen." },
  faq: [
    { question: "Verschil met shopify-expert?", answer: "Theme is onderdeel. Expert is het bredere traject." },
  ],
  ctaTitle: "Custom theme bespreken?",
  ctaBody: "Vertel je shop en wensen.",
  relatedSlugs: ["shopify-expert", "core-web-vitals-verbeteren"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
};
