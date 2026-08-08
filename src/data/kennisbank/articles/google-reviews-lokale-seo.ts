import type { KennisbankArticle } from "@/data/kennisbank/types";

export const GOOGLE_REVIEWS_LOKALE_SEO: KennisbankArticle = {
  slug: "google-reviews-lokale-seo",
  title: "Google reviews & lokale SEO: zo blijf je zichtbaar op Maps",
  description:
    "Recente reviews, snelle antwoorden en een levend GBP. Praktische lokale SEO die 'bij mij in de buurt' wint.",
  publishedAt: "2026-07-06",
  modifiedAt: "2026-08-08",
  readMinutes: 14,
  category: "vindbaarheid",
  keywords: [
    "google reviews lokale seo",
    "google business profile reviews",
    "reviews google maps",
    "lokale seo tips",
  ],
  dienstSlugs: ["local-seo", "seo", "content-marketing"],
  faqs: [
    {
      question: "Hoe belangrijk zijn Google reviews voor lokale SEO?",
      answer:
        "Zwaar. Volume, recentie, tekst en owner responses wegen mee voor mensen én Maps. Een stil profiel voelt gesloten, ook als je open bent.",
    },
    {
      question: "Mag ik reviews kopen?",
      answer:
        "Nee. Riskant en dom. Bouw een flow om echte klanten te vragen na tevreden werk. Recent en echt wint van oud en gekocht.",
    },
    {
      question: "Hoe vaak moet ik reviews beantwoorden?",
      answer:
        "Idealiter elke review, ook de negatieve. Snel, menselijk, oplossingsgericht. Copy-paste antwoorden voelen nep.",
    },
    {
      question: "Wanneer vraag ik om een review?",
      answer:
        "Direct na tevreden oplevering of herhaalorder. Eén link, mail of SMS. Drie maanden later voelt het als spam en krijg je minder respons.",
    },
    {
      question: "Helpen reviews zonder lokale pagina's?",
      answer:
        "Half. Reviews versterken GBP. Site en regio-pagina's moeten hetzelfde verhaal vertellen. Alleen sterren zonder lokale landings is onvolledig.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Je Google Business Profile heeft een foto uit 2019, drie reviews waarvan één van je neef, en een post die zegt fijne feestdagen in maart. Je concurrent heeft veertig reviews dit jaar, foto's elke maand, en antwoordt binnen een dag. Raad eens wie wint bij bij mij in de buurt.",
    },
    {
      type: "callout",
      text: "Kort antwoord: vraag actief om reviews, reageer op elke review, post maandelijks iets relevants, en zorg dat je site hetzelfde verhaal vertelt als je GBP.",
    },
    {
      type: "interactive",
      id: "checklist-meter",
      eyebrow: "Review-hygiëne",
      title: "Stil-profiel-meter",
      intro:
        "Vink aan wat voor jouw Google-reviews klopt. Hoe hoger, hoe meer Maps denkt dat je stilstaat. Concurrent met leven wint bij mij in de buurt.",
      storageKey: "mm-reviews-stil",
      eventName: "reviews_stil_complete",
      sharePath: "/kennisbank/google-reviews-lokale-seo",
      scoreNoun: "stilte",
      ctaHref: "/diensten/local-seo",
      ctaLabel: "Lokale SEO",
      checks: [
        {
          id: "oud",
          label: "Laatste reviews zijn maanden of jaren oud",
          fix: "Na tevreden oplevering: één link, mail of SMS. Recent wint van volume uit 2019.",
        },
        {
          id: "familie",
          label: "Bijna alleen reviews van bekenden of collega's",
          fix: "Echte klanten vragen. Gekocht of familie is riskant en voelt nep.",
        },
        {
          id: "stil",
          label: "Owner responses blijven uit, ook bij negatieve reviews",
          fix: "Elke review beantwoorden. Snel, menselijk, oplossingsgericht.",
        },
        {
          id: "sterren",
          label: "Alleen sterren, bijna nooit tekst met details",
          fix: "Vraag om één zin over wat ze kochten of hoe het ging.",
        },
        {
          id: "timing",
          label: "Je vraagt om reviews drie maanden later of nooit",
          fix: "Direct na tevreden moment. Later voelt als spam.",
        },
        {
          id: "site",
          label: "Site en GBP vertellen een ander verhaal over regio of diensten",
          fix: "Zelfde NAP, zelfde regio's, zelfde aanbod. Reviews versterken dat.",
        },
        {
          id: "copy",
          label: "Antwoorden zijn copy-paste of defensief",
          fix: "Naam + concrete volgende stap. Nep-vriendelijkheid ziet iedereen.",
        },
        {
          id: "ads",
          label: "Lokale ads lopen terwijl het review-profiel stil oogt",
          fix: "Eerst leven in reviews. Daarna werkt elke euro harder.",
        },
      ],
      tiers: [
        {
          id: "levend",
          min: 0,
          max: 24,
          label: "Levend etalage",
          quip: "Recent, beantwoord, echt. Houd dat ritme vast.",
        },
        {
          id: "dof",
          min: 25,
          max: 49,
          label: "Dof maar open",
          quip: "Nog te redden. Deze week: drie echte klanten vragen + openstaande antwoorden.",
        },
        {
          id: "stil",
          min: 50,
          max: 74,
          label: "Stil bord",
          quip: "Maps ziet stilstand. Concurrent met verse reviews wint de buurt.",
        },
        {
          id: "dicht",
          min: 75,
          max: 100,
          label: "Gesloten gevoel",
          quip: "Stop de excuses. Flow + antwoorden, dan pas lokale ads opschalen.",
        },
      ],
    },
    {
      type: "h2",
      text: "Waarom reviews zwaarder wegen dan je denkt",
    },
    {
      type: "p",
      text: "Reviews zijn social proof voor mensen én signaal voor Google. Volume, gemiddelde, recentie en owner responses tellen mee. Een profiel dat stil lijkt, voelt alsof het bedrijf stil staat. Dat is niet altijd waar. Maar perception is ranking.",
    },
    {
      type: "ul",
      items: [
        "Recentie: reviews van dit jaar wegen zwaarder dan een stel uit 2019.",
        "Antwoorden: ook op negatieve reviews. Professioneel, menselijk, geen copy-paste.",
        "Details: reviews met tekst helpen meer dan alleen sterren.",
        "Consistentie: NAP op site, GBP en directories moet matchen.",
      ],
    },
    {
      type: "h2",
      text: "Negatieve reviews zijn geen einde",
    },
    {
      type: "p",
      text: "Een driesterren review die je netjes beantwoordt met oplossing en naam, kan vertrouwen geven. Vijf sterren zonder enkele negatieve review wekt soms wantrouwen. Alsof je ze zelf schreef. Reageer. Niet defensief. Oplossingsgericht.",
    },
    {
      type: "h2",
      text: "Een reviewflow die blijft lopen",
    },
    {
      type: "p",
      text: "Vraag op het moment dat de klant tevreden is: na oplevering, na een geslaagde afspraak, na een herhaalorder. Eén link. Geen roman. Mail of SMS. Train je team dat dit bij de afronding hoort, niet bij 'ooit later'.",
    },
    {
      type: "ul",
      items: [
        "Trigger in je CRM of factuurflow: review-link klaarzetten.",
        "Korte tekst: wat je vraagt en waarom (échte feedback, geen druk).",
        "Opvolging één keer als ze vergeten, niet vijf keer stalken.",
        "Meet: hoeveel vragen → hoeveel reviews per maand.",
      ],
    },
    {
      type: "h2",
      text: "GBP is geen eenmalige setup",
    },
    {
      type: "p",
      text: "Foto's van je zaak, team, product. Posts over aanbod, nieuws, tip. Q&A invullen voordat anderen rare antwoorden plaatsen. Openingstijden actueel. Dit kost een uur per maand. Het kost minder dan adverteren om compensatie te zoeken voor een dood profiel.",
    },
    {
      type: "h2",
      text: "Keywords in reviews: niet forceren",
    },
    {
      type: "p",
      text: "Klanten die spontaan 'matras Apeldoorn' of je dienst noemen, helpen. Jij moet ze niet dwingen tot keyword-zinnen. Dat ruikt nep. Vraag om eerlijke ervaring. Specifieke woorden volgen vanzelf bij tevreden mensen.",
    },
    {
      type: "h2",
      text: "Lokaal in Apeldoorn en verder",
    },
    {
      type: "p",
      text: "Ik werk vanuit Apeldoorn op de Veluwe en help ook landelijk. Lokale intentie is een groot deel van Google-zoekgedrag. Je site moet regio serieus nemen met pagina's die kloppen, niet alleen een adres in de footer. Reviews zonder lokale pagina's is half werk. Pagina's zonder reviews ook.",
    },
    {
      type: "h2",
      text: "Reviews naast ads en landings",
    },
    {
      type: "p",
      text: "Sterke reviews op GBP en op je site versterken message match. Ads beloven expertise. Landings en Maps moeten dat bewijzen. Vertrouwen bouw je met bewijs, niet met sterren-stickers zonder verhaal.",
    },
    {
      type: "callout",
      text: "Je GBP is je etalage op Maps. Een stoffige etalage trekt niemand naar binnen.",
    },
    {
      type: "p",
      text: "Vraag deze week drie tevreden klanten om een review. Reageer op oude reviews die nog open staan. Post één update. Klein werk. Zichtbaar effect. Wil je Maps, reviews en regio-pagina's in één plan? Op mijn hub over lokale SEO en Google Maps marketing leg ik die route uit.",
    },
  ],
};
