import type { SeoLandingPage } from "@/data/seo-landings/types";

export const TRACKING_GOOGLE_ANALYTICS: SeoLandingPage = {
  slug: "tracking-google-analytics",
  primaryKeyword: "google analytics tracking",
  category: "b2b-portal",
  metaTitle: "Google Analytics tracking · data die klopt | Meneer Marketing",
  metaDescription:
    "Google Analytics, GTM en conversietracking goed zetten. Consent mode, ecommerce events, ads-koppeling. Optimaliseren op cijfers die kloppen.",
  keywords: [
    "google analytics tracking",
    "gtm specialist",
    "conversietracking setup",
    "google tag manager bureau",
    "ga4 setup",
  ],
  eyebrow: "Tracking · GA4, GTM, conversies",
  headline: "Google Analytics tracking",
  headlineAccent: "zonder fantasie-cijfers.",
  subheadline:
    "Je optimaliseert op wat je meet. Meet je rommel, krijg je rommel. Ik zet GA4, GTM en ads-tracking zo dat je team en algoritmes de waarheid zien.",
  pains: [
    {
      title: "Dubbele conversies",
      body: "Dashboard toont veertig sales. Je had er acht. Smart bidding juicht. Jij niet.",
    },
    {
      title: "Ecommerce zonder waarde",
      body: "ROAS is decoratie als orders geen value meesturen. Algoritmes optimaliseren op volume.",
    },
    {
      title: "Consent kapot",
      body: "Data mist. Smart bidding vliegt blind. Privacy goed doen én meten kan wél.",
    },
  ],
  deliverables: [
    {
      title: "GA4 & GTM setup",
      body: "Schone container, duidelijke events, documentatie die je team snapt.",
    },
    {
      title: "Ecommerce tracking",
      body: "Orders, waarde, producten. Wat je bankrekening wil weten.",
    },
    {
      title: "Ads-koppeling",
      body: "Google en Meta conversies correct. Primary goals die kloppen.",
    },
    {
      title: "Consent mode",
      body: "GDPR-proof setup die niet meteen een data-zwart gat wordt.",
    },
  ],
  visual: "b2b-portal",
  visualCaption: "Meet eerst. Optimaliseer daarna. Anders gok je met budget.",
  processTitle: "Tracking die blijft werken",
  processSteps: [
    {
      title: "Audit",
      body: "Wat vuurt er nu? Wat telt als conversie? Wat wijkt af van shop of CRM?",
    },
    {
      title: "Opschonen",
      body: "Dubbele tags eruit. Primary conversions scherp. Rommel-events degraderen.",
    },
    {
      title: "Bouwen en testen",
      body: "GTM, GA4, ads. Test aankoop of lead end-to-end. Screenshot-bewijs.",
    },
    {
      title: "Documenteren",
      body: "Wat meet wat. Zodat de volgende theme-update niet stiekem alles breekt.",
    },
  ],
  proofTitle: "Ads plus data",
  proofBody:
    "Zonder tracking fix je geen ads-account. Ik begin vaak hier voordat budget omhoog gaat. Orderwaarde, lead-events en primary conversions moeten kloppen met shop of CRM. Anders optimaliseer je op fantomen.",
  proofCase: "Tracking-audit",
  hotTake: {
    label: "Heet take",
    body: "Google Ads optimaliseren zonder werkende conversietracking is autorijden met een beslagen voorruit.",
  },
  faq: [
    {
      question: "Alleen tracking-setup, of breder traject?",
      answer:
        "Beide kan. Setup alleen, of onderdeel van ads en CRO. Liever data die klopt vóór ik budget opschaal.",
    },
    {
      question: "Shopify of custom?",
      answer:
        "Beide. Andere stack, zelfde principes: juiste events, waarde, consent, ads-import.",
    },
    {
      question: "Fix je ook Meta Pixel en CAPI?",
      answer:
        "Ja, als het in scope zit. Google en Meta moeten dezelfde waarheid benaderen, niet twee fantasiewerelden.",
    },
    {
      question: "Wat is Consent Mode v2?",
      answer:
        "De manier waarop Google tags omgaan met toestemming. Verkeerd gezet = gaten in data of compliance-risico. Ik zet het correct.",
    },
    {
      question: "Server-side tracking nodig?",
      answer:
        "Niet altijd week één. Bij serieus ad spend steeds vaker wel. Eerst client-side schoon, dan server waar het loont.",
    },
    {
      question: "Hoe check ik of tracking klopt?",
      answer:
        "Test zelf een order of lead. Vergelijk GA4, Ads en shop/CRM op dezelfde dag. Structurele afwijking = fix vóór opschalen.",
    },
    {
      question: "Past dit bij GA4 kennisbank-advies?",
      answer:
        "Ja. Meet weinig, meet het goed. Primary conversies, waarde, ads-koppeling. De rest van het dashboard mag wachten.",
    },
  ],
  ctaTitle: "Tracking laten checken?",
  ctaBody: "Vertel je stack. Ik scan wat er misgaat en wat eerst moet.",
  relatedSlugs: [
    "google-ads-bureau",
    "performance-marketing-bureau",
    "conversie-optimalisatie",
    "e-commerce-marketing",
  ],
  pillarSlug: "behoud",
  pillarLabel: "Behoud",
  layoutProfile: "editorial",
  lockContent: true,
  enrichedOverrides: {
    story: {
      title: "Google Analytics tracking is de waarheid achter je ads",
      paragraphs: [
        "Je zoekt google analytics tracking omdat dashboards liegen of omdat niemand weet welke campagne geld opleverde. GA4 is geen orakel. Het is een gereedschap. Slecht gezet = dure gokken.",
        "Ik audit tags, events en ads-import. Dubbele conversies eruit. Waarde erin. Consent correct. Daarna pas budget omhoog.",
        "Of het nu e-commerce of B2B-leads is: ik meet wat de bankrekening snapt. Zelfde discipline, andere events.",
        "Theme-updates en apps breken tracking stiekem. Documentatie en een testritme horen bij de oplevering.",
        "Wil je alleen een GA4-property? Dat is vijf minuten. Wil je data waarop smart bidding mag leren? Dan bouw ik het netjes.",
      ],
    },
    deepDive: {
      title: "Events, waarde, consent en ads die dezelfde waarheid zien",
      paragraphs: [
        "Primary conversions: purchase, generate_lead, call. Scroll en engaged session zijn diagnostisch, geen biedingsdoel. Als alles een conversie is, optimaliseert Google op ruis.",
        "Ecommerce: value, currency, items. Zonder waarde is ROAS theater. In Nederland wil je ook duidelijke lead-events als je geen webshop hebt: formulier, bel, WhatsApp waar relevant.",
        "Consent Mode v2: tags respecteren de keuze. Modellering helpt bij gaten, maar lost een rommelige GTM niet op. Cookiebot 'aan' zonder GA4-check is schijnzekerheid.",
        "Google Ads importeert alleen wat klopt. Optimaliseer niet op bedanktpagina-views of page_view. Enhanced conversions en offline import alleen als de keten schoon is.",
        "Nazorg na elke release: Tag Assistant, DebugView, testorders. Tracking is onderhoud, geen eenmalige checkbox bij livegang.",
        "Goede GA4 in Nederland betekent: meet wat je bankrekening snapt, respecteer consent, en laat Search en Meta niet op verschillende fantomen optimaliseren.",
      ],
    },
    scenario: {
      title: "Stel: Ads toont 3× meer conversies dan je shop",
      paragraphs: [
        "Dan optimaliseer je op fantomen. Ik zoek dubbele tags, verkeerde triggers, enhanced conversions die dubbeltellen of bedanktpagina's die te vroeg vuren.",
        "Na de fix daalt het dashboard-cijfer vaak. Dat is goed nieuws. Eerlijkheid is goedkoper dan valse ROAS en opgeblazen budget.",
        "Daarna pas campagne-optimalisatie. Tracking eerst. Budget later.",
      ],
    },
  },
};
