import type { KennisbankArticle } from "@/data/kennisbank/types";

export const GOOGLE_ANALYTICS_4_MKB: KennisbankArticle = {
  slug: "google-analytics-4-mkb",
  title: "GA4 meet alles behalve wat je wilt weten",
  description:
    "Google Analytics 4 vol voor MKB: welke events ertoe doen, conversies die kloppen en antwoorden op de vraag welke campagne geld opleverde.",
  publishedAt: "2026-07-06",
  readMinutes: 8,
  category: "behoud",
  keywords: [
    "google analytics 4 mkb",
    "ga4 conversies meten",
    "tracking website conversie",
    "google ads conversie tracking",
  ],
  dienstSlugs: ["tracking", "google-ads", "strategie"],
  sections: [
    {
      type: "p",
      text: "Je opent GA4. Duizend grafieken. Sessions, engaged sessions, scroll depth, iets met explorations. Je vraag is simpel: welke campagne leverde gisteren een order op? Stilte. GA4 is geen slecht product. Het is een product dat je vertelt dat je druk bent, niet dat je rijk wordt.",
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
        "Conversies die alles meet behalve geld: scroll 90%, session > 10 sec.",
        "Geen waarde op ecommerce events, dus ROAS liegt.",
        "Ads en GA4 praten langs elkaar door verkeerde tagging.",
        "Niemand die maandelijks checkt of data nog klopt na site-update.",
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
      text: "Als Google Ads optimaliseert op 'bedanktpagina bekeken' terwijl je denkt dat het op orders optimaliseert, brand je budget. Ik zie accounts die maanden draaien op verkeerde events. Dashboard groen. Omzet flat.",
    },
    {
      type: "h3",
      text: "Server-side wordt normaler",
    },
    {
      type: "p",
      text: "Cookies verdwijnen, adblockers groeien. Server-side tracking via GTM server of tag manager cloud is niet meer alleen enterprise. Voor shops met serieus ad spend is het steeds vaker de juiste investering. Niet omdat het hip is. Omdat je anders blind optimaliseert.",
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
        "Vergelijk Ads conversies met je shop admin op dezelfde dag.",
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
