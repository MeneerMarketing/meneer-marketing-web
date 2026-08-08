import type { KennisbankArticle } from "@/data/kennisbank/types";

export const PERFORMANCE_MAX_ZWARTE_DOOS: KennisbankArticle = {
  slug: "performance-max-zwarte-doos",
  title: "Performance Max: de zwarte doos waarin je budget verdwijnt met een glimlach",
  description:
    "PMax kan werken. Ook zonder controle als je een verrassing wilt. Wanneer Performance Max past, wanneer niet, en wat je eerst op orde moet hebben.",
  publishedAt: "2026-07-06",
  modifiedAt: "2026-08-08",
  readMinutes: 15,
  category: "campagnes",
  keywords: [
    "performance max uitleg",
    "performance max werkt niet",
    "google ads pmax",
    "performance max shopping",
  ],
  dienstSlugs: ["google-ads", "adverteren", "shopify-enterprise"],
  faqs: [
    {
      question: "Wanneer werkt Performance Max wél?",
      answer:
        "Met schone feeds of sterke assets, landings die converteren, genoeg conversiedata en realistische marges. Zonder dat is PMax sneller budget verdelen, geen shortcut.",
    },
    {
      question: "Moet ik Search stopzetten voor PMax?",
      answer:
        "Niet blind. Vaak eerst Search of Shopping met controle, dan PMax testen met beperkt budget. Alles op PMax omdat Google het aanraadt is geen plan.",
    },
    {
      question: "Waarom zie ik weinig detail in PMax?",
      answer:
        "Google optimaliseert over veel placements en toont minder query-detail. Daarom moet input schoon zijn: anders optimaliseer je blind op ruis.",
    },
    {
      question: "Hoeveel conversies heb ik nodig voor PMax?",
      answer:
        "Hoe meer betrouwbare conversies met waarde, hoe beter. Te weinig per maand? Algoritme gokt. Dan is strakkere Search of Shopping vaak slimmer.",
    },
    {
      question: "Mag ik heel mijn catalogus in één PMax?",
      answer:
        "Alleen bij vergelijkbare economie en schone feed. Bij gemengde catalogus met verschillende marges: split per productgroep. Gemiddelde ROAS over alles liegt.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Performance Max is Google's antwoord op: vertrouw het systeem, het optimaliseert wel. Je stopt assets erin. Budget erbij. De campagne verschijnt op Search, Display, YouTube, Discover, Maps en Gmail. Klinkt als magie. Voelt soms als een zwarte doos met je pinpas erin.",
    },
    {
      type: "callout",
      text: "Kort antwoord: PMax werkt het best met schone feeds, sterke landings, goede conversiedata en realistische marges. Zonder dat is het geen shortcut. Het is sneller budget verdelen over Google's netwerk.",
    },
    {
      type: "interactive",
      id: "hot-take",
      eyebrow: "Zwarte-doos-test",
      title: "Zet jij PMax aan?",
      prompt:
        "Kies je situatie. Ik zeg of je een versterker aanzet of een snellere kraan.",
      options: [
        {
          id: "google-says",
          label: "Google raadt het aan, dus alles op PMax",
          verdict:
            "Outsourcing van verantwoordelijkheid. Platformadvies is geen plan. Hygiëne eerst, dan beperkt testen.",
          tone: "ouch",
        },
        {
          id: "ready",
          label: "Feed groen, landings scherp, conversies met waarde, klein testbudget",
          verdict:
            "Dit is wanneer ik ja zeg. Insights lezen alsof het je bankafschrift is. Daarna pas oordelen.",
          tone: "win",
        },
        {
          id: "catalog",
          label: "Hele catalogus in één PMax, verschillende marges",
          verdict:
            "Gemiddelde ROAS liegt. Split per productgroep met vergelijkbare economie.",
          tone: "ouch",
        },
        {
          id: "search-first",
          label: "Eerst Search/Shopping met controle, PMax later naast",
          verdict:
            "Mijn favoriete volgorde. Controle bouwt data. PMax versterkt wat al werkt.",
          tone: "win",
        },
      ],
    },
    {
      type: "h2",
      text: "Wat PMax wél goed doet",
    },
    {
      type: "ul",
      items: [
        "Shopping en feed-gedreven ecommerce als je Merchant Center klopt.",
        "Schaal wanneer je conversiedata rijk genoeg is om smart bidding te voeden.",
        "Bereik over meerdere kanalen zonder zelf tien campagnes te bouwen.",
        "Testen van creatieven en audiences als je input sterk is.",
      ],
    },
    {
      type: "h2",
      text: "Waar het misgaat",
    },
    {
      type: "p",
      text: "PMax verbergt veel detail. Je ziet minder welke placement, welke query, welke asset echt converteerde. Handig voor Google. Lastig voor jou als ondernemer die wil weten waar geld naartoe gaat.",
    },
    {
      type: "ul",
      items: [
        "Rommelige feed: verkeerde prijzen, ontbrekende attributen, afgekeurde producten.",
        "Landings die niet converteren: PMax stuurt verkeer, je site laat het weglopen.",
        "Te weinig conversies: algoritme gokt. Gokken met je budget is geen strategie.",
        "Te brede doelen: optimaliseren op micro-conversies die nooit iemand bellen.",
      ],
    },
    {
      type: "h3",
      text: "PMax is broad match in een pak",
    },
    {
      type: "p",
      text: "Minder controle op zoektermen dan klassieke Search. Meer automatisering. Dat is geen probleem als je fundament perfect is. Het is een probleem als je account al lekt en je hoopt dat PMax het toverstafje is. Spoiler: dat is het zelden.",
    },
    {
      type: "h2",
      text: "De volgorde die wél werkt",
    },
    {
      type: "p",
      text: "Ik laat eerst organisch verkeer groeien. De shop moet bewijzen dat ze overtuigt. Pas daarna ads, eerst strakker, later meer automated. Bij ecommerce met Shopping: feed diagnostics groen, landings snel, remarketing lists gevuld, dan PMax testen met beperkt budget.",
    },
    {
      type: "ul",
      items: [
        "Merchant Center zonder rode vlaggen.",
        "Conversietracking die waarde meestuurt, niet alleen pageviews.",
        "Landings per productgroep of intentie waar het kan.",
        "Klein PMax-budget, weken data, dan pas oordelen.",
        "Insights-tab lezen alsof het je bankafschrift is.",
      ],
    },
    {
      type: "callout",
      text: "Heet take: alles op PMax omdat Google het aanraadt is geen plan. Het is outsourcing van verantwoordelijkheid naar een algoritme dat van volume houdt.",
    },
    {
      type: "h2",
      text: "Asset groups en productgroep-logica",
    },
    {
      type: "p",
      text: "Stop niet alles in één asset group. Groepeer wat economisch hetzelfde is: zelfde marge, zelfde intentie, zelfde landings. Toppers en premium producten horen niet in één soep. Anders optimaliseert PMax op wat makkelijk klikt, niet op wat jij wilt verdienen.",
    },
    {
      type: "h2",
      text: "Brand vs non-brand onder PMax",
    },
    {
      type: "p",
      text: "PMax pakt graag branded queries mee. Je ROAS ziet er dan mooier uit dan acquisitie echt is. Houd brand Search apart waar je kunt. Rapportageer eerlijk. Anders juich je voor mensen die je naam al kenden.",
    },
    {
      type: "h2",
      text: "Wanneer ik nee zeg tegen PMax",
    },
    {
      type: "p",
      text: "Als je site niet converteert. Als je feed liegt. Als je te weinig conversies per maand hebt om te leren. Als je eerlijk geen tijd hebt om assets te maken en toch kwaliteit wilt. Dan is klassieke Search of Shopping strakker vaak slimmer. Saai? Soms. Winstgevend? Vaker dan je denkt.",
    },
    {
      type: "p",
      text: "PMax is geen vijand. Het is een versterker. En een versterker op ruis levert harder ruis. Fix de ruis eerst. Op mijn Google Ads bureau- en Shopping-pagina's leg ik uit hoe feed, landings en biedingen samenhangen voordat je de zwarte doos meer budget geeft.",
    },
    {
      type: "h2",
      text: "Hoe ik een PMax-week lees",
    },
    {
      type: "p",
      text: "Ik open Insights alsof het een bankafschrift is. Welke asset groups trekken spend? Welke productgroepen verdienen? Welk aandeel is branded? Als de omzet mooi is maar non-brand stilstaat, juich ik niet. Dan trek ik budget terug naar Search of Shopping met meer controle tot de zwarte doos bewijs levert.",
    },
    {
      type: "p",
      text: "Drie vragen elke week: wat kocht Google namens mij, wat leverde marge, wat was toerisme? Zonder die drie is PMax een gevoel. Met die drie is het een knop die je bewust groter of kleiner draait.",
    },
  ],
};
