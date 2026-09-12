import {
  afspraakBlokken,
  behandeling,
  euro,
  INTAKE_PRIJS,
  variantPrijs,
  vergelijkingsrij,
  VRAAG_WAAR,
  type Landing,
} from "@/data/landings/types";

/**
 * Elektrische epilatie in Rotterdam.
 *
 * WAAROM DEZE PAGINA ER IS.
 *
 * Wie grijs, wit of heel licht blond haar heeft, hoort vroeg of laat dat laser daar niet op
 * werkt, en zoekt dan naar wat wel werkt. Dat is een kleine, gerichte zoekvraag, en /laserontharing
 * beantwoordt hem niet: die pagina gaat over haar met kleur. Deze pagina wel, en hij legt uit
 * hoe de twee samengaan.
 *
 * DE H1 zonder plaatsnaam: "Elektrische epilatie in Rotterdam" loopt over drie regels. De
 * plaats staat in de titel, het antwoordblok en de omschrijving.
 *
 * HET BEELD bovenaan toont een fijn naaldje naast de wenkbrauw. De alt-tekst beschrijft wat je
 * ziet en noemt de behandeling niet. [BEELD-NODIG: bevestigen dat deze foto elektrische
 * epilatie toont, anders een foto die dat wel doet, Okan]
 *
 * DE VERWIJZING NAAR /pcos is bewust: dat was de enige pagina op de site waar niets naartoe
 * wees, en haargroei door PCOS is precies waar deze behandeling bij hoort.
 *
 * GEEN REVIEWS: over elektrische epilatie is in de reviews niets geschreven.
 */

const EE = behandeling("elektrische-epilatie");
const KWARTIER = variantPrijs("elektrische-epilatie", "Per kwartier");

export const ELEKTRISCHE_EPILATIE_ROTTERDAM: Landing = {
  slug: "elektrische-epilatie-rotterdam",
  gewijzigd: "2026-09-11",
  titel: "Elektrische epilatie Rotterdam",
  omschrijving: `Elektrische epilatie in Rotterdam: haar voor haar, ook grijs, wit en licht blond haar waar de laser niet op werkt. ${euro(KWARTIER)} per kwartier.`,
  kruimel: "Elektrische epilatie",
  h1: { kop: "Elektrische", accent: "epilatie" },
  antwoord: `Elektrische epilatie is een ontharingsmethode waarbij een dun naaldje langs de haar de wortel bereikt en die met een korte stroomstoot uitschakelt, haar voor haar. Omdat kleur er niet toe doet, werkt het ook op grijs, wit en licht blond haar waar de laser niet op reageert. Bij Diba Clinics in Rotterdam kost het ${euro(KWARTIER)} per kwartier. [MEDISCHE-CHECK-ROJDA]`,
  feiten: [
    { kop: "Tarief", waarde: `${euro(KWARTIER)} per kwartier` },
    { kop: "Haarkleur", waarde: "Elke kleur" },
    { kop: "Gebied", waarde: "Klein, per haar" },
    { kop: "Hersteltijd", waarde: "Een paar uur rood" },
  ],
  beeld: {
    src: "/images/shoot/handen-detail.jpg",
    alt: "Een behandelaar werkt met een fijn naaldje vlak naast de wenkbrauw",
  },
  kaart: {
    vraag: "Wat kost elektrische epilatie",
    zin: "Waarom de laser grijs en wit haar niet ziet, hoe het haar voor haar gaat, voor welke gebieden het bedoeld is en hoe het samengaat met laser.",
  },

  werking: {
    label: "De werking",
    anker: "Wat het doet",
    kop: "Wat elektrische",
    accent: "epilatie doet",
    intro:
      "Waar de laser een kleur nodig heeft om op te mikken, gaat dit rechtstreeks naar de wortel. Daarom maakt de kleur van het haar hier niet uit.",
    alineas: [
      "De laser mikt op het pigment in de haarwortel. Zit daar geen pigment meer, zoals bij grijs, wit en heel licht blond haar, dan is er niets om op te mikken. Dat ligt niet aan het apparaat of aan de instelling; zo werkt laserontharing. [MEDISCHE-CHECK-ROJDA]",
      "Bij elektrische epilatie gaat er een dun naaldje langs de haar het haarkanaal in, tot bij de wortel. Die krijgt een korte stroomstoot, en daarmee is het de wortel zelf die wordt aangepakt en niet de kleur. Je voelt per haar een korte prik. [MEDISCHE-CHECK-ROJDA]",
      "Het gaat haar voor haar, en dat maakt het trager dan laser. Daarom is het bedoeld voor kleine gebieden, zoals de kin, de bovenlip en rond de wenkbrauw, en voor de losse haren die na een laserkuur zijn blijven staan. Een haar reageert alleen in de groeifase, dus je komt in een reeks, met een paar weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    ],
    verder:
      "Heeft je haar wel kleur, dan is [laserontharing](/laserontharing) sneller en voordeliger. Bij haargroei door PCOS staat meer op [de pagina over PCOS](/pcos). De behandeling zelf staat op [de behandelpagina](/behandelingen/elektrische-epilatie).",
  },

  onderscheid: {
    label: "Laser of epilatie",
    anker: "Laser of epilatie",
    kop: "Laser en",
    accent: "epilatie samen",
    intro:
      "De twee sluiten elkaar niet uit. In de meeste gevallen is het een volgorde, en die scheelt je tijd en geld.",
    alineas: [
      "Heeft een deel van je haar nog kleur, dan begin je met een laserkuur. De laser pakt in één flits een heel vlak aan en werkt daardoor veel sneller dan haar voor haar. Wat daarna blijft staan, meestal de lichte of grijze haren, gaat met elektrische epilatie. Zo betaal je niet per haar voor wat sneller kan.",
      "Is al je haar grijs, wit of heel licht, dan is elektrische epilatie de methode die voor die haren bedoeld is. Dat is geen tweede keus maar de juiste behandeling voor dat haar. [MEDISCHE-CHECK-ROJDA]",
      "Voor grote vlakken, zoals benen of rug, is het niet geschikt: haar voor haar kost daar te veel tijd en te veel sessies. Ook dat hoor je bij de intake, samen met wat er in jouw geval wel kan.",
    ],
    beeld: {
      src: "/images/shoot/laser-met-bril.jpg",
      alt: "Laserontharing met beschermbril, uitgevoerd door een huidtherapeut",
    },
    knop: { href: "/laserontharing", tekst: "Over laserontharing" },
  },

  tarief: {
    label: "Tarieven",
    anker: "Wat het kost",
    kop: "Wat epilatie",
    accent: "bij ons kost",
    intro:
      "Het tarief gaat per kwartier, want het hangt af van hoeveel haren er staan. De intakeregeling staat er compleet bij.",
    rijen: [{ naam: "Elektrische epilatie, per kwartier", prijs: KWARTIER }],
    zin: "Hoeveel kwartieren je nodig hebt, hangt af van het gebied en van het aantal haren. Dat schatten we bij de intake in, en na de eerste afspraak weet je het beter. [MEDISCHE-CHECK-ROJDA]",
    afspraak: afspraakBlokken({
      naam: "de eerste epilatie",
      duurMinuten: EE.duurMinuten,
    }),
  },

  welNiet: {
    intro:
      "Elektrische epilatie is precisiewerk voor kleine gebieden. Voor grote vlakken met donker haar is de laser het betere antwoord.",
    wel: [
      "Grijs, wit en heel licht blond haar, waar de laser niet op werkt",
      "De losse haren die na een laserkuur zijn blijven staan",
      "Kleine gebieden waar precisie telt, zoals kin, bovenlip en wenkbrauw",
      "Wie geen laser kan of wil, bijvoorbeeld door het huidtype [MEDISCHE-CHECK-ROJDA]",
    ],
    niet: [
      "Grote vlakken zoals benen of rug. Daar is laserontharing sneller en voordeliger",
      "Een vol gebied in weinig sessies. Het gaat per haar, dus het vraagt meer tijd",
      "Resultaat na één afspraak. Het bouwt op over de reeks",
      "Een huid die op dat moment geïrriteerd of ontstoken is [MEDISCHE-CHECK-ROJDA]",
    ],
  },

  vergelijking: {
    label: "Naast elkaar",
    anker: "Vergelijking",
    kop: "Epilatie naast",
    accent: "de alternatieven",
    intro:
      "Er zijn meer manieren om van haar af te komen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.",
    kolommen: ["Behandeling", "Waarin het verschilt", "Hersteltijd", "Vanaf"],
    rijen: [
      vergelijkingsrij(
        "elektrische-epilatie",
        "Haar voor haar, via de wortel. Werkt op elke haarkleur, en daardoor ook op grijs en wit.",
      ),
      vergelijkingsrij(
        "laserontharing",
        "Licht op het pigment in de wortel. Snel over een groot vlak, maar alleen op haar met kleur. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "dermaplaning",
        "Een mesje haalt donshaar tijdelijk weg, samen met dode huidcellen. Het haar groeit terug zoals het was.",
      ),
    ],
    bijschrift:
      "Elektrische epilatie vergeleken met andere manieren van ontharen op werking, hersteltijd en tarief",
  },

  wie: {
    label: "Wie de behandeling doet",
    zin: "De behandelaar kijkt eerst of een deel van je haar nog op laser reageert, want dan is dat de snellere weg. Wat overblijft, doet de behandelaar haar voor haar. [GEGEVEN-NODIG: welke functies elektrische epilatie doen, Okan]",
  },

  faq: [
    {
      vraag: "Wat kost elektrische epilatie in Rotterdam?",
      antwoord: `Bij Diba Clinics kost elektrische epilatie ${euro(KWARTIER)} per kwartier. Hoeveel kwartieren je nodig hebt, hangt af van het gebied en het aantal haren. Kom je voor het eerst, dan begint je afspraak met een intake van ${euro(INTAKE_PRIJS)}, die vervalt als we in dezelfde afspraak behandelen.`,
    },
    {
      vraag: "Waarom werkt de laser niet op grijs haar?",
      antwoord:
        "Omdat de laser het pigment in de haarwortel opzoekt en de warmte daar zijn werk doet. Grijs en wit haar heeft dat pigment niet meer, dus er is niets om op te mikken. Dat ligt niet aan het apparaat of aan de instelling.",
    },
    {
      vraag: "Doet elektrische epilatie pijn?",
      antwoord:
        "Je voelt per haar een korte prik, en daarna een warm gevoel op die plek. Het is goed te doen, maar omdat het haar voor haar gaat, is een langere sessie wel merkbaar. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Is elektrische epilatie blijvend?",
      antwoord:
        "Een haar waarvan de wortel goed is uitgeschakeld, komt niet terug. Omdat haren niet allemaal tegelijk in de groeifase zitten, heb je wel een reeks afspraken nodig om een gebied rustig te krijgen. Hoeveel verschilt per persoon. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan ik het combineren met laserontharing?",
      antwoord:
        "Dat is de gebruikelijke volgorde. Eerst de laserkuur voor alles wat pigment heeft, en daarna elektrische epilatie voor de haren die zijn blijven staan. Zo betaal je niet per haar voor wat sneller kan.",
    },
    {
      vraag: "Welke gebieden kun je met elektrische epilatie behandelen?",
      antwoord:
        "Kleine gebieden waar precisie belangrijker is dan snelheid: de kin, de bovenlip en rond de wenkbrauw. Voor grote vlakken zoals benen of rug is het niet bedoeld; daar is laser sneller en voordeliger.",
    },
    {
      vraag: "Hoe zie ik eruit na elektrische epilatie?",
      antwoord:
        "De behandelde plekjes zijn een paar uur rood en kunnen wat opstaan, vergelijkbaar met na het harsen. Bij de meeste mensen is dat dezelfde dag weg. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Helpt elektrische epilatie bij haargroei door PCOS?",
      antwoord:
        "Voor de lichte haren die de laser niet ziet, ja. Bij PCOS blijft je lichaam nieuwe haren aanmaken, dus bij laser en bij epilatie hoort dan onderhoud. Meer daarover staat op onze pagina over PCOS. [MEDISCHE-CHECK-ROJDA]",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je niet of je",
    accent: "haar",
    na: "op laser reageert",
    zin: "Dat hoef je ook niet te weten voordat je komt. Bij de intake kijken we naar de kleur en de dikte van je haar, en dan hoor je of laser, epilatie of een combinatie het beste werkt.",
  },

  cta: {
    kop: "Elektrische epilatie",
    accent: "in Rotterdam",
    tekst:
      "We kijken eerst naar je haar en je huid, en zeggen dan of laser, epilatie of allebei past. Past epilatie, dan kan de eerste sessie vaak in dezelfde afspraak.",
    topic: "elektrische-epilatie",
  },

  schema: {
    procedure: { naam: "Elektrische epilatie", omschrijving: EE.werking },
    dienst: { naam: "Elektrische epilatie", soort: "Ontharing" },
  },
};
