import type { KennisbankArticle } from "@/data/kennisbank/types";

export const GOOGLE_ADS_VIJF_FOUTEN: KennisbankArticle = {
  slug: "google-ads-vijf-fouten-elke-account",
  title: "Wat ik zag in tientallen Google Ads-accounts (dezelfde fouten, elke keer)",
  description:
    "Na audits in uiteenlopende branches: deze vijf fouten kosten het meeste geld. Herkenbaar, fixbaar, en vaak niet je schuld.",
  publishedAt: "2026-07-02",
  modifiedAt: "2026-08-08",
  readMinutes: 14,
  category: "campagnes",
  keywords: [
    "google ads fouten",
    "google ads account audit",
    "google ads verbeteren",
    "google ads bureau tips",
  ],
  dienstSlugs: ["google-ads", "adverteren", "cro", "tracking"],
  faqs: [
    {
      question: "Wat is de duurste fout in Google Ads?",
      answer:
        "Meestal ads op een site die niet converteert, of tracking die liegt. Budget verhogen lost dat niet op. Het vermenigvuldigt het lek.",
    },
    {
      question: "Hoe snel zie ik of mijn account lekt?",
      answer:
        "Open zoektermen (30 dagen, sort op kosten), check Ads-conversies vs shop/CRM, open je top-landings op mobiel. Twintig minuten geeft vaak een scherpere diagnose dan een dik rapport.",
    },
    {
      question: "Moet ik Performance Max uitzetten?",
      answer:
        "Niet altijd. Wel als feed, landings en tracking nog lekken. PMax op een zwakke basis is een snellere manier om budget te verdelen over Google's netwerk.",
    },
    {
      question: "Wanneer is een audit de moeite waard?",
      answer:
        "Als je structureel spend hebt en de omzet niet meeloopt, of als niemand het zoektermenrapport deelt. Audit vóór je budget verdubbelt, niet erna.",
    },
    {
      question: "Kan ik dit zelf fixen zonder bureau?",
      answer:
        "De hygiëne wel: zoektermen, landings-match, conversies checken. Structuur en bidding bij grotere accounts vraagt ervaring. Begin bij het zwakste schakel, niet bij 'meer budget'.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Ik open regelmatig Google Ads-accounts van bedrijven die ergens anders begonnen zijn. Of zelf zijn begonnen met de beste bedoelingen en een YouTube-tutorial. Het patroon is verrassend voorspelbaar. Verschillende branches, verschillende budgetten, zelfde vijf gaten in de emmer. Dit artikel is geen roast. Het is een veldrapport. Want als je jezelf hierin herkent, ben je niet dom. Je bent normaal. En je kunt het fixen.",
    },
    {
      type: "h2",
      text: "Adverteren op een site die nog niet converteert",
    },
    {
      type: "p",
      text: "Dit is de klassieker. Omzet moet omhoog, dus ads aan. Maar de site laadt traag op mobiel, de CTA is vaag en niemand weet binnen vijf seconden wat je verkoopt. Je koopt bezoekers alsof je een winkel binnenloopt die nog in dozen staat.",
    },
    {
      type: "p",
      text: "Ik kies bewust: eerst shop en SEO, dan pas ads. Niet omdat ads slecht zijn, maar omdat ads op een zwakke bestemming leer geld heten. Tel even mee: 1000 klikken à €2 is €2000. Bij 1% conversie heb je tien orders. Bij 2% conversie twintig. Zelfde budget, dubbele omzet. Dat verschil zit vaak in je pagina, niet in je keyword.",
    },
    {
      type: "callout",
      text: "Vuistregel die ik gebruik: als je organisch verkeer slecht converteert, fix dat eerst. Ads vermenigvuldigen wat er al is. Inclusief de problemen.",
    },
    {
      type: "h2",
      text: "Conversietracking die liegt (of niets meet)",
    },
    {
      type: "p",
      text: "Het dashboard toont 40 conversies. Je team zegt: 'we hebben er acht gehad'. Dat is geen klein verschil, dat is een andere werkelijkheid. Dubbele events, verkeerde attributie, formulier-submit zonder kwalificatie, telefoontjes die niet meetellen. Smart bidding optimaliseert op wat jij meet. Meet je rommel, krijg je rommel.",
    },
    {
      type: "ul",
      items: [
        "Pageview als conversie. Nee. Dat is bezoek, geen resultaat.",
        "Dankpagina die ook zonder formulier bereikbaar is. Je telt fantasie.",
        "Waarde ontbreekt bij ecommerce. ROAS wordt dan een decoratief getal.",
        "Consent mode verkeerd: je mist data en het algoritme vliegt blind.",
      ],
    },
    {
      type: "h2",
      text: "Alles in één campagne-soep",
    },
    {
      type: "p",
      text: "Brand, generiek, concurrent, Shopping, remarketing, allemaal door elkaar of half gestructureerd. Je weet niet wat winst geeft omdat alles in dezelfde pan kookt. Budget gaat automatisch naar wat het luidst klikt, niet naar wat het meeste oplevert.",
    },
    {
      type: "p",
      text: "Producten met verschillende marges horen niet in één logische emmer. Hetzelfde geldt voor intentie. Iemand die je merknaam zoekt, is geen koude prospect. Die hoort niet dezelfde boodschap en zeker niet hetzelfde budgetplafond als iemand die een specifiek probleem intypt.",
    },
    {
      type: "h2",
      text: "Het zoektermenrapport als vergeten tabblad",
    },
    {
      type: "p",
      text: "Broad match, PMax, automatische uitbreidingen: allemaal prima als iemand wekelijks het zoektermenrapport leest en bijstuurt. In de praktijk wordt dat tabblad ontdekt als het budget al maanden lekt. Ik zie termen als 'gratis', 'vacature', 'opleiding', 'DIY' en 'review' regelmatig in de top 10 qua spend. Niet omdat ondernemers dom zijn. Omdat niemand het rapport als vaste routine heeft.",
    },
    {
      type: "callout",
      text: "Heet take: een Google Ads-bureau dat je maandrapport stuurt zonder zoektermen-top 20, verkoopt je geruststelling, geen beheer.",
    },
    {
      type: "h2",
      text: "Landingspagina matcht de ad niet",
    },
    {
      type: "p",
      text: "De advertentie belooft Shopify B2B-portaal in 6 weken. De landingspagina is je homepage met welkom bij ons, specialist in alles. De bezoeker denkt: verkeerde link. Jij denkt: ads werken niet. Message match is de goedkoopste winst in paid search. Zelfde kop, zelfde belofte, zelfde CTA. Saai? Misschien. Effectief? Altijd.",
    },
    {
      type: "p",
      text: "Daarom bouw ik landings from scratch voor campagnes die serieus budget krijgen. Niet omdat homepages lelijk zijn, maar omdat ze te veel keuzes geven. Ads brengen intentie. Landings moeten die intentie bevestigen, niet verdoven met een menu.",
    },
    {
      type: "h2",
      text: "Hoe de vijf fouten elkaar versterken",
    },
    {
      type: "p",
      text: "Zwakke landings plus slechte tracking plus broad match zonder zoektermen-ritme is geen drie problemen. Het is één kettingreactie. Smart bidding krijgt verkeerde signalen, stuurt budget naar verkeerde terms, en jij verhoogt budget omdat het dashboard druk oogt. Stop de keten bij de zwakste schakel. Vaak tracking of landings. Daarna structuur. Daarna volume.",
    },
    {
      type: "h2",
      text: "Audit-volgorde die ik altijd aanhoud",
    },
    {
      type: "ul",
      items: [
        "Conversies vs realiteit (shop, CRM, telefoon).",
        "Top landings op mobiel: belofte, snelheid, CTA.",
        "Zoektermen top 20 op kosten + negatieven.",
        "Campagnestructuur: brand, generiek, shopping, remarketing gescheiden.",
        "Pas daarna bidding, budget en creatives.",
      ],
    },
    {
      type: "h2",
      text: "Bonus: de mindset-fout",
    },
    {
      type: "p",
      text: "Ads als kostenpost in plaats van investering met breakeven. Als je niet weet wat een klant mag kosten, optimaliseer je op klikken en impressies. Leuk voor het ego, nutteloos voor je rekening. Reken eerst terug vanuit marge. Dan pas praat je over CPA en ROAS met betekenis.",
    },
    {
      type: "h2",
      text: "Wat je nu kunt doen (zonder account te slopen)",
    },
    {
      type: "p",
      text: "Pak de afgelopen 30 dagen. Check je top 20 zoektermen op kosten. Check of je conversies kloppen met de realiteit. Kijk naar je belangrijkste landingspagina op mobiel. Vraag jezelf af: zou ik hier kopen? Als het antwoord nee is, is het geen ads-probleem alleen. Het is een ketenprobleem. En ketens fix je vanaf het zwakste schakel, niet door meer benzine te gooien.",
    },
    {
      type: "p",
      text: "De goede news: deze fouten zijn niet mysterieus. Ze zijn saai, zichtbaar en oplosbaar. Precies het soort werk waar de meeste omzetwinst zit voordat je überhaupt je budget hoeft te verhogen.",
    },
  ],
};
