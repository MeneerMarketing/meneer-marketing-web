import { ADVIES_MINUTEN, INTAKE_MINUTEN } from "@/data/intake";
import {
  behandeling,
  euro,
  INTAKE_PRIJS,
  tariefrijen,
  VRAAG_WAAR,
  type Landing,
} from "@/data/landings/types";

/**
 * Huidanalyse in Rotterdam.
 *
 * WAAROM DEZE PAGINA NIET BOTST MET /behandelingen/huidanalyse EN /intake.
 *
 * De behandelpagina heet "Consult met EVE-M huidanalyse" en gaat over de meting als
 * behandeling; /intake heet "Het huidconsult" en gaat over wat er in die afspraak gebeurt.
 * Geen van beide beantwoordt de zoekvraag "huidanalyse rotterdam": wat meet het, wat kost
 * het hier, en welke afspraak boek je. Beide wijzen hierheen of worden hier genoemd.
 *
 * DE GETALLEN.
 *
 * De tijden komen uit intake.ts en het bedrag uit de behandelingentabel. De stijlgids zegt
 * nog "maximaal zestig minuten" voor een losse intake; de beslissing van 10 september 2026
 * (Yasin, naast Salonized) is dertig, en /intake toont dertig. Deze pagina volgt /intake,
 * want twee getallen voor dezelfde afspraak is precies wat hier niet mag.
 *
 * DE STIJLGIDS OVER DE EVE-M.
 *
 * "Schrijf niet dat iedere behandeling standaard met een EVE-M-huidscan begint." Daarom staat
 * er nergens dat elke afspraak met een scan begint, en is de vraag daarover gemarkeerd.
 */

const HA = behandeling("huidanalyse");

export const HUIDANALYSE_ROTTERDAM: Landing = {
  slug: "huidanalyse-rotterdam",
  gewijzigd: "2026-09-11",
  titel: "Huidanalyse Rotterdam met de EVE-M",
  omschrijving: `Huidanalyse in Rotterdam met de EVE-M. Een losse intake duurt maximaal ${INTAKE_MINUTEN} minuten en kost ${euro(INTAKE_PRIJS)}. Wat er gemeten wordt en welke afspraak je boekt.`,
  kruimel: "Huidanalyse",
  h1: { kop: "Huidanalyse in", accent: "Rotterdam" },
  antwoord: `Een huidanalyse is een meting van je huid met een scanner die elke keer onder hetzelfde licht opneemt en ook onder UV kijkt, zodat je ziet wat er onder de oppervlakte zit. Bij Diba Clinics in Rotterdam gebeurt dat met de EVE-M, als onderdeel van de intake. Een losse intake met huidanalyse duurt maximaal ${INTAKE_MINUTEN} minuten en kost ${euro(INTAKE_PRIJS)}.`,
  feiten: [
    { kop: "Duur", waarde: `Max. ${INTAKE_MINUTEN} minuten` },
    { kop: "Tarief", waarde: euro(INTAKE_PRIJS) },
    { kop: "Apparaat", waarde: "EVE-M" },
    { kop: "Aanraking", waarde: "Geen" },
  ],
  beeld: {
    src: "/images/shoot/beh-huidanalyse.jpg",
    alt: "Cliënt in de EVE-M huidscanner, met de opname op het scherm ernaast",
  },
  kaart: {
    vraag: "Wat kost een huidanalyse",
    zin: "Wat de EVE-M meet, waarom dat anders is dan een foto met je telefoon, wat de intake kost en wanneer dat bedrag bij een behandeling vervalt.",
  },

  werking: {
    label: "De meting",
    anker: "Wat het meet",
    kop: "Wat een huidanalyse",
    accent: "laat zien",
    intro:
      "Wat je in de spiegel ziet is de buitenkant. Een meting laat zien wat eronder zit, en legt het vast op een manier die je later kunt vergelijken.",
    alineas: [
      "Twee mensen met dezelfde vlekken kunnen iets heel anders hebben. Pigment kan in de opperhuid zitten of dieper, en die diepte bepaalt welke behandeling er iets aan doet. Roodheid kan van een vaatje komen of van een ontsteking. In gewoon licht zie je dat verschil vaak niet, en dan behandel je op een gok. [MEDISCHE-CHECK-ROJDA]",
      "De EVE-M legt je huid vast en meet. Je gezicht komt in een vaste houder, zodat de afstand en de hoek bij elke opname gelijk zijn, en de belichting komt uit het apparaat zelf. Naast gewoon licht wordt er ook onder UV opgenomen, en dan is pigment dat dieper zit wel te zien. Er raakt niets je huid. [MEDISCHE-CHECK-ROJDA]",
      "Wat eruit komt is geen diagnose; die stelt een arts. Het is een vastlegging van wat er nu is: pigment, roodheid, poriën, vocht en tekenen van veroudering. Daarop bouwt de behandelaar het plan, en bij elke controle wordt dezelfde meting herhaald. Dan zie je op de opnames of het werkt, in plaats van dat je het moet geloven.",
    ],
    verder:
      "Hoe het apparaat werkt staat op de pagina over de [EVE-M](/apparatuur/eve-m). Wat er in de rest van de intake gebeurt, staat bij [het huidconsult](/intake).",
  },

  onderscheid: {
    label: "Waarom meten",
    anker: "Waarom meten",
    kop: "Waarom geen",
    accent: "telefoonfoto",
    intro:
      "Iedereen kan een foto van zijn huid maken. Het verschil zit in wat je er na acht weken mee kunt.",
    alineas: [
      "Een foto met je telefoon is elke keer anders: een andere afstand, ander licht, een andere hoek. Leg je er na acht weken een nieuwe naast, dan weet je nog steeds niet of er iets veranderd is of dat de zon anders stond.",
      "De EVE-M neemt die verschillen weg. Omdat de omstandigheden bij elke opname hetzelfde zijn, is een verschil op de opname ook een verschil in je huid. Daarmee kun je een traject bijsturen op wat er gemeten is, en stoppen als iets niet werkt.",
      "Het meten zelf doet niets met je huid. Je gaat meteen door met je dag, en wil je in dezelfde afspraak behandeld worden, dan reserveren we daar tijd voor.",
    ],
    beeld: {
      src: "/images/shoot/apparaat-eve-m.jpg",
      alt: "Behandelaar plaatst een cliënt in de EVE-M huidscanner",
    },
    knop: { href: "/apparatuur/eve-m", tekst: "Over de EVE-M" },
  },

  tarief: {
    label: "Tarieven",
    anker: "Wat het kost",
    kop: "Wat een huidanalyse",
    accent: "bij ons kost",
    intro:
      "Een vast bedrag, en een regeling die bepaalt of je het apart betaalt. Die staat er compleet bij.",
    rijen: tariefrijen("huidanalyse"),
    zin: "De drie consulten kosten hetzelfde; ze verschillen in waar de behandelaar naar kijkt. [GEGEVEN-NODIG: wat er per consult anders is, Okan]",
    afspraak: [
      {
        kop: "Alleen een huidanalyse",
        zin: `Dan boek je een losse intake. We reserveren daar maximaal ${INTAKE_MINUTEN} minuten voor, je huid wordt gemeten en je krijgt een behandelplan mee. Er wordt in deze afspraak niet behandeld, en de intake kost altijd ${euro(INTAKE_PRIJS)}.`,
      },
      {
        kop: "Meten en meteen beginnen",
        zin: `Dan boek je een behandeling op advies, de afspraak die de meeste mensen kiezen. We reserveren maximaal ${ADVIES_MINUTEN.nieuw / 60 === 2 ? "twee uur" : `${ADVIES_MINUTEN.nieuw} minuten`}: de intake met de meting, en daarna minstens een uur om te behandelen. Wordt er behandeld, dan vervalt de intake en betaal je alleen de behandeling.`,
      },
      {
        kop: "Tijdens een traject",
        zin: "Dan wordt dezelfde meting herhaald bij de controles. Zo zie je op de opnames wat er veranderd is, onder hetzelfde licht als de eerste keer.",
      },
    ],
  },

  welNiet: {
    intro:
      "Een huidanalyse legt vast wat er is. Hij behandelt niets en hij stelt geen diagnose.",
    wel: [
      "Vastleggen wat er nu is, op een manier die over maanden nog vergelijkbaar is",
      "Zien wat er onder de oppervlakte zit, zoals pigment dat dieper ligt",
      "Een behandelplan dat op een meting rust in plaats van op een inschatting",
      "De voortgang van een traject controleren in plaats van inschatten",
    ],
    niet: [
      "Een diagnose stellen. Voor een plek of aandoening kijkt een arts mee [MEDISCHE-CHECK-ROJDA]",
      "Behandelen. Er gebeurt tijdens de meting niets met je huid",
      "Voorspellen wat een behandeling gaat opleveren",
      "Een moedervlek beoordelen die verandert. Daarvoor ga je naar je huisarts [MEDISCHE-CHECK-ROJDA]",
    ],
  },

  vergelijking: {
    label: "Naast elkaar",
    anker: "Welke afspraak",
    kop: "Welke afspraak",
    accent: "je boekt",
    intro:
      "Er zijn drie manieren om met een meting te beginnen. Het verschil zit in de tijd die we reserveren en in wat je betaalt.",
    kolommen: ["Afspraak", "Wat er gebeurt", "Gereserveerd", "Kosten"],
    rijen: [
      {
        naam: "Losse intake",
        href: "/intake",
        cellen: [
          "Een meting van je huid en een behandelplan, zonder behandeling.",
          `Max. ${INTAKE_MINUTEN} minuten`,
          euro(INTAKE_PRIJS),
        ],
      },
      {
        naam: "Behandeling op advies",
        href: "/behandeling-op-advies",
        cellen: [
          "De meting, het plan, en daarna de eerste behandeling als dat verantwoord is.",
          `Max. ${ADVIES_MINUTEN.nieuw} minuten`,
          `Alleen de behandeling, of ${euro(INTAKE_PRIJS)} als er niet behandeld wordt`,
        ],
      },
      {
        naam: "Als je al klant bent",
        cellen: [
          "Geen nieuwe intake; je komt voor je behandeling, en bij controles wordt er opnieuw gemeten.",
          `${ADVIES_MINUTEN.bestaand} minuten`,
          "De behandeling",
        ],
      },
    ],
    bijschrift:
      "De drie manieren om met een huidanalyse te beginnen, vergeleken op wat er gebeurt, de tijd en de kosten",
  },

  wie: {
    label: "Wie de meting doet",
    zin: "De meting en het plan doet een huidtherapeut of een orthomoleculair huidspecialist. Rojda, de oprichter, legt de meting vaak zelf uit, en zij zegt het ook als behandelen geen zin heeft.",
  },

  reviews: {
    onderwerp: "intake",
    intro:
      "Reviews van klanten over hun intake en de uitleg die ze kregen. Ze komen rechtstreeks uit onze agenda en staan er zoals ze geschreven zijn.",
  },

  faq: [
    {
      vraag: "Wat kost een huidanalyse in Rotterdam?",
      antwoord: `Bij Diba Clinics kost een intake met huidanalyse ${euro(INTAKE_PRIJS)}. Boek je een behandeling op advies en wordt er in dezelfde afspraak behandeld, dan vervalt dat bedrag en betaal je alleen de behandeling.`,
    },
    {
      vraag: "Hoe lang duurt een huidanalyse?",
      antwoord: `Een losse intake met huidanalyse duurt maximaal ${INTAKE_MINUTEN} minuten. Wil je in dezelfde afspraak ook behandeld worden, dan reserveren we maximaal twee uur, met minstens een uur om te behandelen.`,
    },
    {
      vraag: "Wat meet de EVE-M?",
      antwoord:
        "Pigment, ook als het dieper in de huid zit, roodheid, poriën, vocht en tekenen van huidveroudering. De opnames worden onder vast licht en ook onder UV gemaakt, zodat ze bij een volgende meting te vergelijken zijn. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Doet een huidanalyse pijn?",
      antwoord:
        "Nee. Je gezicht komt in een houder en het apparaat maakt opnames; er raakt niets je huid. Je gaat daarna meteen door met je dag.",
    },
    {
      vraag: "Moet ik een huidanalyse doen voordat ik behandeld kan worden?",
      antwoord:
        "Bij een eerste afspraak begin je met een intake, en bij de meeste klachten hoort daar een meting bij. Ben je al klant en kom je voor een behandeling die je eerder had, dan is er geen nieuwe intake nodig. [GEGEVEN-NODIG: wanneer de EVE-M wel en niet in de intake zit, Okan]",
    },
    {
      vraag: "Krijg ik een diagnose?",
      antwoord:
        "Nee. Een meting is geen diagnose; dat is werk voor een arts. Wat je krijgt is wat er gemeten is en wat dat betekent voor wat er kan. Zien we iets waar een arts naar moet kijken, dan hoor je dat.",
    },
    {
      vraag: "Waarom niet gewoon een foto met mijn telefoon?",
      antwoord:
        "Omdat die niet met een vorige te vergelijken is. Een andere afstand, ander licht, een andere hoek: na acht weken weet je dan nog steeds niet of er iets veranderd is of dat de zon anders stond.",
    },
    {
      vraag: "Hoe vaak wordt er gemeten?",
      antwoord: `${HA.sessies}. Zo zie je op de opnames of een traject werkt.`,
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je niet waar je",
    accent: "moet beginnen",
    zin: "Dan is dit de plek. Een meting laat zien wat er speelt, en daarna hoor je wat erbij past, ook als het antwoord is dat je niets hoeft te doen.",
  },

  cta: {
    kop: "Een huidanalyse in Rotterdam",
    accent: "plannen",
    tekst:
      "Een meting van je huid met de EVE-M, en een plan dat daaruit volgt. Wil je meteen beginnen, boek dan een behandeling op advies.",
    topic: "huidanalyse",
  },

  schema: {
    procedure: { naam: "Huidanalyse met de EVE-M", omschrijving: HA.werking },
    dienst: { naam: "Huidanalyse", soort: "Huidanalyse" },
  },
};
