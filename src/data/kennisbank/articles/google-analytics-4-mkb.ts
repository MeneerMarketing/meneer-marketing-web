import type { KennisbankArticle } from "@/data/kennisbank/types";

export const GOOGLE_ANALYTICS_4_MKB: KennisbankArticle = {
  slug: "google-analytics-4-mkb",
  title: "GA4 meet alles behalve wat je wilt weten",
  description:
    "Google Analytics 4 voor MKB: welke events ertoe doen, conversies die kloppen en antwoorden op de vraag welke campagne geld opleverde.",
  publishedAt: "2026-07-06",
  modifiedAt: "2026-08-08",
  readMinutes: 14,
  category: "behoud",
  keywords: [
    "google analytics 4 mkb",
    "ga4 conversies meten",
    "tracking website conversie",
    "google ads conversie tracking",
  ],
  dienstSlugs: ["tracking", "google-ads", "strategie"],
  faqs: [
    {
      question: "Welke GA4-conversies moet ik als primary zetten?",
      answer:
        "Alleen wat je bankrekening herkent: purchase met waarde, of generate_lead / call-click bij diensten. Scroll, engaged session en 'form start' horen niet in Smart Bidding.",
    },
    {
      question: "Waarom wijken Ads en GA4 af van mijn shop?",
      answer:
        "Consent, adblockers, verkeerde tags, dubbele firings, of attributievensters. Vergelijk op dezelfde dag met admin of CRM. Structureel verschil? Fix tags vóór je budget verhoogt.",
    },
    {
      question: "Heb ik server-side tracking nodig?",
      answer:
        "Niet vanaf dag één. Wel zodra ad spend serieus is en cookies/adblockers je data leegtrekken. Server-side is hygiëne bij schaal, geen statussymbool.",
    },
    {
      question: "Is GA4 genoeg om campagnes te sturen?",
      answer:
        "Voor richting ja, voor optimalisatie wil je Ads-conversies die kloppen plus backend. GA4 alleen zonder waarde en Ads-import is een mooi dashboard met een gat in de bodem.",
    },
    {
      question: "Hoe vaak moet ik tracking checken?",
      answer:
        "Na elke site- of checkout-wijziging, en wekelijks een snelle sanity check. Maandelijks: Ads vs shop/CRM. Tracking rot stil als niemand kijkt.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Je opent GA4. Duizend grafieken. Sessions, engaged sessions, scroll depth, iets met explorations. Je vraag is simpel: welke campagne leverde gisteren een order op? Stilte. GA4 is geen slecht product. Het is een product dat je vertelt dat je druk bent, niet dat je rijk wordt.",
    },
    {
      type: "callout",
      text: "Mijn regel: meet weinig, meet het goed. Eén primaire conversie die je bankrekening herkent, slaat twintig vanity-events.",
    },
    {
      type: "interactive",
      id: "checklist-meter",
      eyebrow: "Dashboard-detox",
      title: "Vanity-event-meter",
      intro:
        "Vink aan wat in jouw GA4 of Ads als ‘succes’ telt. Hoe hoger, hoe meer je optimaliseert op drukte in plaats van geld.",
      storageKey: "mm-ga4-vanity",
      eventName: "ga4_vanity_complete",
      sharePath: "/kennisbank/google-analytics-4-mkb",
      scoreNoun: "vanity",
      ctaHref: "/diensten/tracking",
      ctaLabel: "Tracking",
      checks: [
        {
          id: "scroll",
          label: "Scroll 90% of engaged session staat als primary conversie",
          fix: "Haal het uit primary. Dat is diagnostiek, geen doel.",
        },
        {
          id: "waarde",
          label: "Purchase zonder value of currency",
          fix: "Stuur orderwaarde mee. Anders is ROAS decoratie.",
        },
        {
          id: "mismatch",
          label: "Ads-cijfers wijken structureel af van shop of CRM",
          fix: "Test zelf een conversie. Fix tags vóór je budget verhoogt.",
        },
        {
          id: "micro",
          label: "Form start of pageview stuurt Smart Bidding",
          fix: "Alleen generate_lead / purchase / call die ertoe doen.",
        },
        {
          id: "consent",
          label: "Banner en Consent Mode heb je nooit in Tag Assistant getest",
          fix: "Incognito: accepteer en weiger. Zie je verschil? Zo nee, kapot.",
        },
        {
          id: "events",
          label: "Meer dan tien events gemarkeerd als conversie",
          fix: "Snoei tot wat je bankrekening snapt. Minder is slimmer.",
        },
        {
          id: "utm",
          label: "UTM's zijn een wildwest; niemand houdt dezelfde namen aan",
          fix: "Eén naamconventie. Anders vergelijk je appels met koekjes.",
        },
        {
          id: "never",
          label: "Na de laatste site-update heeft niemand tracking gecheckt",
          fix: "Na elke checkout- of tag-wijziging: sanity check. Tracking rot stil.",
        },
      ],
      tiers: [
        {
          id: "bank",
          min: 0,
          max: 24,
          label: "Bankrekening-first",
          quip: "Je meet wat telt. Blijf vies van scroll-als-doel.",
        },
        {
          id: "rommel",
          min: 25,
          max: 49,
          label: "Bijna bruikbaar",
          quip: "Er zit nog theater in. Snoei primary conversies deze week.",
        },
        {
          id: "druk",
          min: 50,
          max: 74,
          label: "Drukte-dashboard",
          quip: "GA4 juicht. Omzet zucht. Klassiek MKB-patroon.",
        },
        {
          id: "fantasie",
          min: 75,
          max: 100,
          label: "Fantasie-funnel",
          quip: "Smart Bidding vliegt op fantomen. Stop opschalen tot tags kloppen.",
        },
      ],
    },
    {
      type: "callout",
      text: "Kort antwoord: meet weinig, maar meet het goed. Primaire conversie (koop, lead, call), waarde meesturen, koppeling met Ads. De rest is hobby tenzij je team tijd heeft.",
    },
    {
      type: "h2",
      text: "Waar GA4 ondernemers kwijtraakt",
    },
    {
      type: "ul",
      items: [
        "Te veel events standaard aan zonder business betekenis.",
        "Conversies die alles meten behalve geld: scroll 90%, session langer dan 10 seconden.",
        "Waarde ontbreekt op ecommerce events, dus ROAS liegt.",
        "Ads en GA4 praten langs elkaar door verkeerde tagging.",
        "Niemand die maandelijks checkt of data nog klopt na een site-update.",
      ],
    },
    {
      type: "h2",
      text: "Wat je wél moet meten",
    },
    {
      type: "p",
      text: "Begin bij je bankrekening. Wat is een succes? Aankoop met waarde. Lead die je belt terug. Afspraak in je agenda. Demo-aanvraag voor B2B. Alles daaronder is diagnostisch, geen doel.",
    },
    {
      type: "ul",
      items: [
        "purchase / generate_lead / phone_call_click als primaire conversies.",
        "Ecommerce parameters: value, currency, items waar van toepassing.",
        "UTM-structuur die je team ook echt gebruikt.",
        "Enhanced conversions waar privacy het toelaat.",
        "Google Ads import van primaire conversies only.",
      ],
    },
    {
      type: "h2",
      text: "De Ads-koppeling is geen luxe",
    },
    {
      type: "p",
      text: "Als Google Ads optimaliseert op bedanktpagina bekeken terwijl jij denkt dat het op orders optimaliseert, brand je budget. Ik zie accounts die maanden draaien op verkeerde events. Dashboard groen. Omzet flat.",
    },
    {
      type: "p",
      text: "Check wekelijks: Ads-conversies versus shop-admin of CRM op dezelfde dag. Wijkt het structureel af, dan optimaliseer je op fantomen. Fix de tag vóór je budget verhoogt.",
    },
    {
      type: "h3",
      text: "Server-side wordt normaler",
    },
    {
      type: "p",
      text: "Cookies verdwijnen, adblockers groeien. Server-side tracking via GTM server of een cloud tag manager is niet meer alleen enterprise. Voor shops met serieus ad spend is het steeds vaker de juiste investering. Niet omdat het hip is. Omdat je anders blind optimaliseert.",
    },
    {
      type: "h2",
      text: "Leadgeneratie meet anders dan shops",
    },
    {
      type: "p",
      text: "Bij diensten is purchase zeldzaam. Dan telt generate_lead of een call-click. Kwaliteit meet je in CRM: welke leads werden klant? GA4 alleen zegt hoeveel formulieren binnenkwamen. Sales zegt hoeveel ertoe deden. Beide nodig.",
    },
    {
      type: "h2",
      text: "Consent Mode en GA4 in één adem",
    },
    {
      type: "p",
      text: "Zonder nette banner en Consent Mode v2 mist GA4 een deel van je traffic en modelleert de rest. Dat voelt als 'Analytics liegt'. Vaak is het privacy + implementatie. Lees het Consent Mode-artikel als Ads en shop uit elkaar lopen terwijl tags 'groen' staan in Tag Assistant na accept.",
    },
    {
      type: "h2",
      text: "Explorations die wél de moeite waard zijn",
    },
    {
      type: "ul",
      items: [
        "Landingspagina × conversie: welke URL's verdienen ads-budget?",
        "Bron/medium × aankoopwaarde: welke kanalen brengen marge, niet alleen sessies?",
        "Funnel: view_item → add_to_cart → begin_checkout → purchase. Waar valt het stil?",
      ],
    },
    {
      type: "p",
      text: "Mijn volgorde: shop en meting eerst, ads later. Per product telt de waarde mee, anders optimaliseer je op omzet zonder marge. GA4 zonder value is een scorebord zonder punten.",
    },
    {
      type: "h2",
      text: "Checklist die je vandaag kunt doen",
    },
    {
      type: "ul",
      items: [
        "Admin > Events: welke zijn gemarkeerd als conversie? Klopt dat?",
        "Test zelf een aankoop of formulier. Komt het in GA4 en Ads binnen?",
        "Vergelijk Ads-conversies met je shop admin of CRM op dezelfde dag.",
        "Verwijder rommel-conversies uit primary goals.",
      ],
    },
    {
      type: "callout",
      text: "Data zonder actie is decoratie. Eén goede conversie die klopt verslaat twintig events die niemand leest.",
    },
    {
      type: "p",
      text: "GA4 is een gereedschap, geen orakel. Stel eerst de vraag: wat wil mijn bankrekening zien? Meet dat. Optimaliseer daarop. De rest van het dashboard mag wachten.",
    },
  ],
};
