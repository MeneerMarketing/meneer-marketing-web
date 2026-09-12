import {
  behandeling,
  euro,
  sessieRij,
  VRAAG_WAAR,
  type Landing,
} from "@/data/landings/types";

/**
 * Hoeveel sessies heb je nodig.
 *
 * WAAROM DEZE PAGINA BESTAAT.
 *
 * Het is de vraag die bij elke behandeling terugkomt en die op geen enkele pagina in zijn
 * geheel beantwoord wordt: per behandelpagina staat het aantal, maar wie wil weten waarom
 * de ene behandeling één keer kan en de andere acht keer vraagt, moet acht pagina's naast
 * elkaar leggen. Dat is precies wat de tabel hier doet.
 *
 * WAAROM HIJ NIET BOTST MET DE BEHANDELPAGINA'S.
 *
 * Elke behandelpagina blijft het antwoord op "wat is dit". Deze pagina gaat over het
 * ritme: waarom een reeks een reeks is, waarom er weken tussen zitten en waarom niemand
 * het exacte aantal vooraf op tafel legt.
 *
 * WAT UIT ÉÉN BRON KOMT.
 *
 * Elke regel in de tabel komt uit het veld `sessies` van de behandeling zelf, met het
 * tarief erachter. Overschrijven zou betekenen dat een pagina over het aantal sessies dat
 * aantal zelf gaat verzinnen, en dat is precies de fout die je pas ziet als iemand aan de
 * balie iets anders hoort dan hij las.
 */

const LASER = behandeling("laserontharing");

export const HOEVEEL_SESSIES: Landing = {
  slug: "hoeveel-sessies",
  soort: "vraag",
  gewijzigd: "2026-09-12",
  titel: "Hoeveel sessies heb je nodig",
  omschrijving:
    "Hoeveel sessies een huidbehandeling vraagt, waarom er weken tussen zitten en waarom het aantal pas na een meting te zeggen is. Per behandeling op een rij.",
  kruimel: "Aantal sessies",
  h1: { kop: "Hoeveel sessies", accent: "heb je nodig" },
  antwoord:
    "Hoeveel sessies je nodig hebt hangt af van de behandeling en van je huid. Een gezichtsbehandeling kan los, microneedling en peelings gaan meestal in een reeks van drie tot zes met vier tot zes weken ertussen, en laserontharing vraagt er zes tot tien, verspreid over maanden, omdat haar in cycli groeit. Bij Diba Clinics in Rotterdam hoor je na de meting welk aantal in jouw geval realistisch is. [MEDISCHE-CHECK-ROJDA]",
  feiten: [
    { kop: "Peeling", waarde: "Vier tot zes keer" },
    { kop: "Microneedling", waarde: "Drie tot zes keer" },
    { kop: "Laserontharing", waarde: "Zes tot tien keer" },
    { kop: "Ertussen", waarde: "Vier tot zes weken" },
  ],
  beeld: {
    src: "/images/shoot/behandelaar-op-bank.jpg",
    alt: "Behandelaar van Diba Clinics zit klaar in de behandelkamer",
  },
  kaart: {
    vraag: "Hoeveel sessies heb je nodig",
    zin: "Waarom de ene behandeling één keer kan en de andere acht keer vraagt, hoeveel tijd er tussen sessies hoort en wanneer het aantal vaststaat.",
  },

  werking: {
    label: "Het ritme",
    anker: "Waarom een reeks",
    kop: "Waarom het vaak",
    accent: "een reeks is",
    intro:
      "Je huid werkt in cycli en je haar ook. Een behandeling die daarop aansluit vraagt herhaling; een behandeling die aan de oppervlakte blijft, vaak niet.",
    alineas: [
      "De bovenste laag van je huid vernieuwt zichzelf in ongeveer vier weken. Een behandeling die daar werkt, zoals een gezichtsbehandeling of een oppervlakkige peeling, doet zijn werk binnen die ene cyclus. Het resultaat is er meteen en het loopt in de weken erna weer terug naar het uitgangspunt, en dat is de reden dat die behandelingen onderhoud heten. [MEDISCHE-CHECK-ROJDA]",
      "Gaat een behandeling dieper, dan werk je niet met de cyclus mee maar zet je herstel in gang. Nieuw collageen bouwt zich over weken op, en elke sessie legt daar een laag bij. Daarom zit er bij microneedling en bij de meeste laserbehandelingen vier tot zes weken tussen: eerder is de vorige sessie nog niet af, later begin je deels opnieuw. [MEDISCHE-CHECK-ROJDA]",
      "Bij ontharen is het weer anders. Een laser raakt alleen het haar dat op dat moment in de groeifase zit, en dat is maar een deel van wat er staat. De rest komt in de weken erna aan de beurt, en daarom zijn er zes tot tien sessies nodig verspreid over maanden. Het aantal hangt af van de zone en van je huidtype. [MEDISCHE-CHECK-ROJDA]",
      "Een pigmenttraject als Cosmelan of Dermamelan telt geen sessies maar maanden: één masker in de kliniek, en daarna een vaste routine thuis met controles onderweg. Wat je daar doet weegt zwaarder dan wat er in de behandelkamer gebeurt.",
    ],
    verder:
      "Het aantal per behandeling staat ook op de behandelpagina zelf, bij [alle behandelingen](/behandelingen). Hoe een eerste afspraak verloopt staat bij [het huidconsult](/intake).",
  },

  onderscheid: {
    label: "Het getal",
    anker: "Het getal",
    kop: "Waarom je vooraf",
    accent: "een reeks hoort",
    intro:
      "Een exact aantal noemen voordat je huid gemeten is, klinkt behulpzaam en is het niet. Wat je wel krijgt, is een reeks met de reden erbij.",
    alineas: [
      "Wat een behandeling doet, hangt af van hoe jouw huid erop reageert, en dat is vooraf een inschatting. Bij de een is de textuur na drie sessies waar hij zijn moet, bij de ander vraagt hetzelfde doel er zes. Een getal dat vooraf vastligt is dus een belofte over iemand anders zijn huid.",
      "Daarom meten we bij het begin en leggen we die meting vast. Bij elke controle komt de nieuwe opname naast de vorige, onder hetzelfde licht en vanuit dezelfde hoek. Zo is er halverwege een gesprek mogelijk over wat er is veranderd, in plaats van een gevoel achteraf.",
      "Levert een aanpak te weinig op, dan is bijstellen of stoppen de uitkomst van dat gesprek. Een reeks afmaken omdat hij nu eenmaal geboekt is, is de verkeerde volgorde. Wat je vooruitbetaalde aan een kuur blijft dan staan voor een andere behandeling. [GEGEVEN-NODIG: wat er gebeurt met een vooruitbetaalde kuur die halverwege stopt, Okan]",
      "Tussentijds stoppen levert het resultaat van een halve reeks op, en dat is iets anders dan de helft van het resultaat. Bij ontharen is dat het duidelijkst: het haar dat tijdens de gemiste sessies in de groeifase zat, is gewoon niet geraakt. [MEDISCHE-CHECK-ROJDA]",
    ],
    beeld: {
      src: "/images/shoot/kb-pigment.jpg",
      alt: "Behandelaar werkt met de Dermapen over het voorhoofd van een cliënt",
    },
    knop: {
      href: "/kennisbank/huidanalyse-rotterdam",
      tekst: "Over de huidanalyse",
    },
  },

  welNiet: {
    intro:
      "Een reeks is er om iets op te bouwen. Voor wat daarbuiten valt, is herhalen het verkeerde antwoord.",
    wel: [
      "Herstel dat zich over weken opbouwt, zoals bij microneedling en laser [MEDISCHE-CHECK-ROJDA]",
      "Haar dat in cycli groeit, waardoor er per keer maar een deel te raken is [MEDISCHE-CHECK-ROJDA]",
      "Onderhoud van een resultaat dat uit zichzelf terugloopt",
      "Een traject waarin de thuisroutine het meeste werk doet",
    ],
    niet: [
      "Een resultaat dat na één keer al vaststaat. Dan is een tweede sessie er een te veel",
      "Een klacht die niet reageert. Blijft de meting gelijk, dan verandert de aanpak",
      "Een huid die op dat moment ontstoken of geïrriteerd is. Die brengen we eerst tot rust [MEDISCHE-CHECK-ROJDA]",
      "Een aantal dat vooraf vastligt zonder dat je huid gemeten is",
    ],
  },

  vergelijking: {
    label: "Per behandeling",
    anker: "Per behandeling",
    kop: "Wat elke behandeling",
    accent: "aan tijd vraagt",
    intro:
      "Hoe vaak een behandeling meestal gebeurt en wat één keer kost. De middelste kolom komt letterlijk van de behandelpagina zelf, zodat de twee niet uit elkaar kunnen lopen.",
    kolommen: ["Behandeling", "Hoe vaak", "Per keer"],
    rijen: [
      sessieRij("hydrafacial"),
      sessieRij("oxygeneo"),
      sessieRij("peelings"),
      sessieRij("skinpen"),
      sessieRij("skinboosters"),
      sessieRij("fotona-4d"),
      sessieRij("nordlys-pigment"),
      {
        naam: LASER.naam,
        href: "/laserontharing",
        /* Met de hand, omdat het tarief van laserontharing per zone verschilt: het
           laagste bedrag als kaal getal zou hier lezen als de prijs van een sessie. */
        cellen: [LASER.sessies, `Vanaf ${euro(LASER.prijs)} per zone`],
      },
      sessieRij("elektrische-epilatie"),
      sessieRij("cosmelan"),
    ],
    bijschrift:
      "Het gebruikelijke aantal sessies per behandeling bij Diba Clinics, met het tarief per keer",
  },

  wie: {
    label: "Wie het aantal bepaalt",
    zin: "De huidtherapeut of laserspecialist die je behandelt, op basis van de meting bij het begin en de controles onderweg. Bij elke controle komen de opnames naast elkaar, en daaruit volgt of de reeks doorgaat zoals hij stond.",
  },

  faq: [
    {
      vraag: "Hoeveel sessies laserontharing heb je nodig?",
      antwoord:
        "Meestal zes tot tien, verspreid over maanden. Dat komt doordat een laser alleen het haar raakt dat op dat moment in de groeifase zit; de rest komt in de weken erna aan de beurt. Het aantal hangt af van de zone, van je huidtype en van je haar, en je hoort bij de intake wat er in jouw geval realistisch is. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Hoeveel sessies microneedling zijn nodig?",
      antwoord:
        "Meestal een reeks van drie tot zes, met vier tot zes weken ertussen. Die tijd is er niet voor de agenda maar voor je huid: nieuw collageen bouwt zich over weken op, en elke sessie legt daar een laag bij. Bij littekens en bij diepere textuur liggen er vaker zes dan drie. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Waarom zit er vier tot zes weken tussen twee sessies?",
      antwoord:
        "Omdat je huid die tijd nodig heeft om af te maken wat de vorige sessie in gang zette. Eerder behandelen betekent op een huid werken die nog bezig is; veel later betekent dat een deel van de winst alweer is teruggelopen. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan ik na één sessie al iets zien?",
      antwoord:
        "Bij een gezichtsbehandeling meestal meteen, want die werkt aan de oppervlakte. Bij microneedling, laser en peelings zie je na de eerste sessie vaak iets in de textuur, maar het doel waarvoor je komt vraagt de hele reeks. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Wat gebeurt er als ik halverwege stop?",
      antwoord:
        "Dan houd je het resultaat van een halve reeks, en dat is iets anders dan de helft van het resultaat. Bij ontharen is dat het duidelijkst: het haar dat tijdens de gemiste sessies in de groeifase zat, is niet geraakt en groeit gewoon door. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Waarom noemen jullie geen vast aantal vooraf?",
      antwoord:
        "Omdat het afhangt van hoe jouw huid reageert, en dat is vooraf een inschatting. Je krijgt een reeks met de reden erbij, een meting aan het begin en een controle onderweg waarin we naast elkaar leggen wat er is veranderd. Daaruit volgt het aantal dat je echt nodig hebt.",
    },
    {
      vraag: "Is een kuur goedkoper dan losse sessies?",
      antwoord:
        "Bij een aantal behandelingen wel. Skinboosters en Fotona 4D hebben een kuurtarief dat lager ligt dan drie losse sessies bij elkaar. De bedragen staan bij de behandeling zelf en op de tarievenpagina, en je kiest pas na de intake.",
    },
    {
      vraag: "Hoe vaak moet ik terugkomen voor onderhoud?",
      antwoord:
        "Bij een gezichtsbehandeling meestal elke vier tot zes weken, omdat het effect uit zichzelf terugloopt. Bij een traject dat herstel opbouwt is onderhoud een controle per half jaar tot een jaar, afhankelijk van wat we meten. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Moet ik alle sessies vooraf boeken?",
      antwoord:
        "Dat hoeft niet, maar het helpt wel. De tijd tussen twee sessies is onderdeel van de behandeling, en een reeks die uitloopt omdat er geen plek was, levert minder op. Je kunt de afspraken in één keer inplannen en later nog verzetten.",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je niet of een",
    accent: "reeks nodig is",
    zin: "Dat is precies wat de eerste afspraak uitwijst. We meten je huid, bespreken wat je wilt veranderen en zeggen wat daarvoor nodig is, ook als dat minder is dan je dacht. Blijkt er niets te zijn wat behandeling vraagt, dan hoor je dat ook.",
  },

  cta: {
    /* Hier stond "Eerst meten, dan een plan". Dat is precies de slogan in twee helften
       waar de stijlgids tegen is, en de controle vangt hem ook. */
    kop: "Een plan met",
    accent: "een aantal erbij",
    tekst:
      "In het huidconsult meten we je huid en bespreken we wat er nodig is, met het aantal sessies en het tarief erbij. Je zit daarna nergens aan vast.",
    topic: "sessies",
  },

  schema: {},
};
