import type { KennisbankArticle } from "@/data/kennisbank/types";

export const ROAS_VS_CPA: KennisbankArticle = {
  slug: "roas-vs-cpa-bankrekening",
  title: "ROAS vs CPA: welke metric je bankrekening snapt",
  description:
    "ROAS klinkt indrukwekkend op een dashboard. CPA ook. Maar welke metric past bij jouw marge? Met rekenvoorbeelden die je echt kunt gebruiken.",
  publishedAt: "2026-07-10",
  readMinutes: 8,
  category: "campagnes",
  keywords: [
    "roas uitleg",
    "cpa google ads",
    "roas vs cpa",
    "google ads metrics",
  ],
  dienstSlugs: ["google-ads", "adverteren", "tracking"],
  sections: [
    {
      type: "p",
      text: "Je opent je ads-dashboard. ROAS is 4,2. Je voelt je goed. Je bankrekening voelt zich minder uitgenodigd. Dat kan. ROAS en CPA zijn handige kompassen, maar ze vertellen niet automatisch of je geld verdient. Dat hangt af van je marge. En marge is het woord dat dashboards graag vergeten.",
    },
    {
      type: "h2",
      text: "Wat ROAS eigenlijk zegt",
    },
    {
      type: "p",
      text: "ROAS = Return On Ad Spend. Omzet gedeeld door advertentiekosten. ROAS 4 betekent: voor elke euro ads kwam er vier euro omzet binnen. Klinkt geweldig. Maar omzet is niet winst. Als je product 80% kostprijs heeft, maak je met ROAS 4 nog steeds verlies. Wiskunde is graag eerlijk, ook als je dashboard dat niet is.",
    },
    {
      type: "callout",
      text: "Vuistregel: ROAS werkt vooral goed als je ecommerce-marges vergelijkbaar zijn. Bij BestRest met verschillende producten en marges wordt ROAS alleen al snel misleidend op accountniveau.",
    },
    {
      type: "h2",
      text: "Wat CPA eigenlijk zegt",
    },
    {
      type: "p",
      text: "CPA = Cost Per Acquisition. Wat kost één conversie (order, lead, afspraak)? Bij leads moet je nog weten hoeveel leads klant worden. Bij orders moet je weten wat die order gemiddeld oplevert en wat er overblijft na kosten. CPA is directer dan ROAS voor dienstverleners met één duidelijke conversie.",
    },
    {
      type: "h2",
      text: "Rekenvoorbeeld dat pijn doet (op een goede manier)",
    },
    {
      type: "p",
      text: "Stel: je verkoopt iets voor €100. Kostprijs en verzending samen €55. Brutomarge €45. Je CPA mag maximaal €45 zijn om break-even te draaien op die order, zonder overhead. Als je CPA €30 is, leer je €15 per order vóór vaste kosten. Als je ROAS 5 is (€20 ads voor €100 omzet), lijkt dat fantastisch. Tot je product met €90 kostprijs ook in dezelfde campagne zit.",
    },
    {
      type: "ul",
      items: [
        "ROAS 4 op product A met 60% marge: feest.",
        "ROAS 4 op product B met 15% marge: faillissement in slow motion.",
        "Gemiddelde ROAS op accountniveau: leuk voor slides, nutteloos voor beslissingen.",
      ],
    },
    {
      type: "h2",
      text: "Welke metric wanneer",
    },
    {
      type: "p",
      text: "Ecommerce met consistente marges per campagne: ROAS kan werken, mits je per productgroep splitst. Mixed catalogus: werk met marge per SKU-groep of CPA per conversie met waarde meegeven. Leadgen: CPA op gekwalificeerde lead, niet op formulier-submit van een student die onderzoek doet.",
    },
    {
      type: "h3",
      text: "Conversiewaarde is je beste vriend",
    },
    {
      type: "p",
      text: "Stuur orderwaarde of leadwaarde terug naar Google. Dan kan smart bidding optimaliseren op waarde, niet op volume. Zonder waarde leert het algoritme dat een €20 order even goed is als een €500 order. Spoiler: dat is niet zo.",
    },
    {
      type: "callout",
      text: "Heet take: een bureau dat alleen ROAS in je maandrapport zet zonder je marge te kennen, rapporteert een thermometer in een sauna.",
    },
    {
      type: "h2",
      text: "Wat je dashboard mínimaal moet tonen",
    },
    {
      type: "p",
      text: "Advertentiekosten. Omzet of leads. CPA of ROAS per campagne met vergelijkbare producten. Marge-indicator (zelfs ruw). En de vraag: als ik morgen budget verdubbel, blijft de unit economics gelijk? Zo nee, schaal niet. Optimaliseer eerst.",
    },
    {
      type: "h2",
      text: "De conclusie zonder spreadsheet-porno",
    },
    {
      type: "p",
      text: "ROAS en CPA zijn geen doelen. Ze zijn signalen. Je doel is winstgevend groeien. Begin met wat een klant mag kosten. Kies de metric die dat het scherpst maakt voor jouw business. En geloof nooit een dashboard dat groen is terwijl je team elke maand zucht bij de bankafschrift.",
    },
  ],
};
