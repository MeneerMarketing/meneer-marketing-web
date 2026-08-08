import type { KennisbankArticle } from "@/data/kennisbank/types";

export const ROAS_VS_CPA: KennisbankArticle = {
  slug: "roas-vs-cpa-bankrekening",
  title: "ROAS vs CPA: welke metric je bankrekening snapt",
  description:
    "ROAS klinkt indrukwekkend op een dashboard. CPA ook. Maar welke metric past bij jouw marge? Met rekenvoorbeelden die je echt kunt gebruiken.",
  publishedAt: "2026-07-10",
  modifiedAt: "2026-08-08",
  readMinutes: 15,
  category: "campagnes",
  keywords: [
    "roas uitleg",
    "cpa google ads",
    "roas vs cpa",
    "google ads metrics",
  ],
  dienstSlugs: ["google-ads", "adverteren", "tracking"],
  faqs: [
    {
      question: "Wat is een goede ROAS?",
      answer:
        "Die bestaat niet zonder marge. ROAS 4 is feest bij 60% marge en verlies bij 15%. Reken terug vanaf kostprijs + vaste kosten, niet vanaf wat concurrenten op LinkedIn posten.",
    },
    {
      question: "Wanneer kies ik CPA in plaats van ROAS?",
      answer:
        "Bij leads, afspraken of diensten met één duidelijke conversie. Of bij gemengde catalogus waar gemiddelde ROAS producten met verschillende marges door elkaar gooit.",
    },
    {
      question: "Moet ik tROAS of tCPA in Google Ads zetten?",
      answer:
        "tROAS als je betrouwbare conversiewaarde meestuurt en marges binnen de camp vergelijkbaar zijn. tCPA als elke conversie ongeveer evenveel mag kosten. Verkeerde target op rommeldata is sneller kapot dan handmatig.",
    },
    {
      question: "Telt branded search mee in ROAS?",
      answer:
        "Vaak ja in het dashboard, en dat maakt je ROAS mooier dan acquisitie echt is. Rapportageer branded apart. Anders juich je voor mensen die je naam al kenden.",
    },
    {
      question: "Hoe koppel ik marge aan Ads?",
      answer:
        "Stuur orderwaarde of aangepaste waarde (marge) terug. Split campagnes per productgroep met vergelijkbare economics. Dashboard zonder marge is theater.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Je opent je ads-dashboard. ROAS is 4,2. Je voelt je goed. Je bankrekening voelt zich minder uitgenodigd. Dat kan. ROAS en CPA zijn handige kompassen, maar ze vertellen niet automatisch of je geld verdient. Dat hangt af van je marge. En marge is het woord dat dashboards graag vergeten.",
    },
    {
      type: "interactive",
      id: "hot-take",
      eyebrow: "Metric-keuze",
      title: "Welke metric stuurt je week?",
      prompt:
        "Kies hoe jij Ads nu stuurt. Ik zeg of je bankrekening meeluistert of alleen je dashboard.",
      options: [
        {
          id: "roas-blind",
          label: "ROAS zo hoog mogelijk, marge kijk ik later",
          verdict:
            "Dashboard juicht, kas mogelijk niet. Zonder marge is ROAS theater met procenten.",
          tone: "ouch",
        },
        {
          id: "cpa-lead",
          label: "CPA per lead of afspraak, met win-rate in het hoofd",
          verdict:
            "Dit is mijn default bij diensten. Eén conversie, één plafond, dan pas schalen.",
          tone: "win",
        },
        {
          id: "troas",
          label: "tROAS op catalogus met vergelijkbare marges + waarde terug",
          verdict:
            "Slim als data klopt. Gemengde marges in één target? Dan stuurt Google de verkeerde producten.",
          tone: "win",
        },
        {
          id: "branded",
          label: "Account-ROAS inclusief branded, want het ziet er lekker uit",
          verdict:
            "Je juicht voor mensen die je naam al kenden. Split branded. Anders leer je niks over acquisitie.",
          tone: "ouch",
        },
      ],
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
      text: "Vuistregel: ROAS werkt vooral goed als je ecommerce-marges vergelijkbaar zijn. Bij een gemengde catalogus met verschillende producten en marges wordt ROAS alleen al snel misleidend op accountniveau.",
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
      type: "h2",
      text: "POAS: de metric die niemand in Ads ziet",
    },
    {
      type: "p",
      text: "Profit on Ad Spend. Omzet min kostprijs, gedeeld door ad spend. Google ziet dat niet standaard. Jij wel in je sheet. Als je schaalt op ROAS zonder POAS, schaal je soms omzet die je liever niet had. Per SKU-groep andere inkoop. B2B-orders andere waarde dan consumentenklikken. Meet wat overblijft.",
    },
    {
      type: "h2",
      text: "Hoe ik dit aanpak",
    },
    {
      type: "p",
      text: "B2B-waarde telt anders dan een losse consumentenorder. Marge verschilt per productlijn. Zelfde dashboard-metrics, andere beslissingen. Daarom split ik campagnes en rapportages op wat economisch hetzelfde is.",
    },
    {
      type: "callout",
      text: "Heet take: een bureau dat alleen ROAS in je maandrapport zet zonder je marge te kennen, rapporteert een thermometer in een sauna.",
    },
    {
      type: "h2",
      text: "Wat je dashboard minimaal moet tonen",
    },
    {
      type: "p",
      text: "Advertentiekosten. Omzet of leads. CPA of ROAS per campagne met vergelijkbare producten. Marge-indicator (zelfs ruw). En de vraag: als ik morgen budget verdubbel, blijft de unit economics gelijk? Zo nee, schaal niet. Optimaliseer eerst.",
    },
    {
      type: "ul",
      items: [
        "Kosten en omzet (of gekwalificeerde leads) naast elkaar.",
        "CPA of ROAS per campagne met vergelijkbare marge.",
        "Uitsluitingen: wat telt niet mee als succes?",
        "Trend over weken, niet alleen gisteren groen.",
      ],
    },
    {
      type: "h2",
      text: "De conclusie zonder spreadsheet-porno",
    },
    {
      type: "p",
      text: "ROAS en CPA zijn geen doelen. Ze zijn signalen. Je doel is winstgevend groeien. Begin met wat een klant mag kosten. Kies de metric die dat het scherpst maakt voor jouw business. En geloof nooit een dashboard dat groen is terwijl je team elke maand zucht bij het bankafschrift.",
    },
  ],
};
