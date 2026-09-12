import { ADVIES_MINUTEN } from "@/data/intake";
import {
  afspraakBlokken,
  alsWoord,
  behandeling,
  euro,
  INTAKE_PRIJS,
  variantPrijs,
  vergelijkingsrij,
  VRAAG_WAAR,
  type Landing,
} from "@/data/landings/types";

/**
 * Fotona 4D in Rotterdam.
 *
 * WAAROM DEZE PAGINA NIET BOTST MET DE BESTAANDE.
 *
 * De Fotona staat op de site op veel plekken: de apparaatpagina, de TimeWalker als platform,
 * Fotona 4D, het volledige pakket, de mannenvariant en de vier stappen los. Geen daarvan
 * beantwoordt "fotona 4d rotterdam": wat is het, wat kost het hier, hoe gaat het. De
 * klachtpagina's over huidveroudering, verslapping en rimpels beginnen bij de klacht. Deze
 * pagina begint bij de behandeling en wijst naar alle stappen.
 *
 * HET AFSPRAAKBLOK is hier anders. Fotona 4D duurt zelf negentig minuten, en een eerste
 * afspraak is maximaal twee uur inclusief de intake. Of dat past, weten we niet zeker; het
 * gewone blok zou dat wel beloven.
 *
 * GEEN REVIEWS: over huidveroudering is in de reviews niets geschreven, en "laser" gaat daar
 * vrijwel altijd over ontharen.
 */

const F4 = behandeling("fotona-4d");
const FF = behandeling("fotona-4d-full");
const KUUR_4D = variantPrijs("fotona-4d", "Kuur van drie");
const KUUR_FF = variantPrijs("fotona-4d-full", "Kuur van drie");

export const FOTONA_4D_ROTTERDAM: Landing = {
  slug: "fotona-4d-rotterdam",
  gewijzigd: "2026-09-11",
  titel: "Fotona 4D Rotterdam",
  omschrijving: `Fotona 4D in Rotterdam: vier laserstappen in één sessie van ${F4.duurMinuten} minuten, zonder naalden. ${euro(F4.prijs)} per behandeling, ${euro(KUUR_4D)} voor een kuur van drie.`,
  kruimel: "Fotona 4D",
  h1: { kop: "Fotona 4D in", accent: "Rotterdam" },
  antwoord: `Fotona 4D is een laserbehandeling in vier stappen in één sessie: eerst van binnenuit door de wang, daarna op diepte in de huid, en tot slot een lichte laserpeeling. Samen werken ze op verslapping, textuur en kleur, zonder naalden. Bij Diba Clinics in Rotterdam duurt een behandeling ${F4.duurMinuten} minuten en kost hij ${euro(F4.prijs)}. [MEDISCHE-CHECK-ROJDA]`,
  feiten: [
    { kop: "Duur", waarde: `${F4.duurMinuten} minuten` },
    { kop: "Tarief", waarde: `${euro(F4.prijs)} per sessie` },
    { kop: "Hersteltijd", waarde: "Uren tot een dag" },
    { kop: "Apparaat", waarde: "Fotona TimeWalker" },
  ],
  beeld: {
    src: "/images/shoot/beh-fotona.jpg",
    alt: "Fotona-laserbehandeling met oogbescherming",
  },
  kaart: {
    vraag: "Wat kost Fotona 4D",
    zin: "De vier stappen van het protocol, wat het doet bij verslapping en textuur, het volledige pakket met hals en kaaklijn, en wat een kuur kost.",
  },

  werking: {
    label: "De werking",
    anker: "De vier stappen",
    kop: "Wat Fotona 4D",
    accent: "met je huid doet",
    intro:
      "Vier behandelingen die in dezelfde sessie op elkaar volgen, elk op een andere diepte. Samen raken ze wat één stap alleen niet haalt.",
    alineas: [
      "Met de jaren maakt je huid minder collageen aan, het bindweefsel dat hem stevig houdt. Dat zie je als verslapping langs de kaaklijn, fijne lijntjes en een huid die minder egaal is. Die veranderingen zitten op verschillende diepten, en daarom werkt Fotona 4D ook op verschillende diepten. [MEDISCHE-CHECK-ROJDA]",
      "Het begint van binnenuit met [SmoothLiftin](/behandelingen/smoothliftin): een handstuk tegen de binnenkant van je wang, dat het weefsel verwarmt waar je van buitenaf niet bij komt. Daarna werkt [FRAC3](/behandelingen/frac3) op diepte op onregelmatigheden, en verwarmt [PIANO](/behandelingen/piano) het weefsel vlak en gelijkmatig. [SupErficial](/behandelingen/superficial-peel) sluit af met een lichte laserpeeling van de bovenste laag. [MEDISCHE-CHECK-ROJDA]",
      "Direct na de sessie ziet de huid er voller uit door de warmte, maar dat is nog geen resultaat. De aanmaak van collageen kost weken, en het verschil bouwt zich op over de reeks: los te doen of als kuur van drie, met vier tot zes weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    ],
    verder:
      "De behandeling zelf staat op [de behandelpagina](/behandelingen/fotona-4d), en welke behandelingen er nog meer op dit apparaat draaien bij [de Fotona TimeWalker](/behandelingen/fotona). Wat een kuur aan tijd vraagt staat bij [het aantal sessies](/kennisbank/hoeveel-sessies).",
  },

  onderscheid: {
    label: "Het apparaat",
    anker: "Twee lasers",
    kop: "Twee lasers",
    accent: "in één apparaat",
    intro:
      "De Fotona TimeWalker is geen behandeling maar een platform. Dat hij twee lasers heeft, is waarom 4D kan wat één laser niet kan.",
    alineas: [
      "In de kast zitten twee lasers. Een Er:YAG op 2940 nanometer, die bijna volledig door water wordt opgenomen en daardoor aan de oppervlakte blijft. En een Nd:YAG op 1064 nanometer, die veel minder door water wordt tegengehouden en dus dieper komt. Samen dekken ze een bereik dat één laser niet haalt.",
      "De verwarmende stappen gebruiken de SMOOTH-modus: de energie komt in een reeks trage pulsen in plaats van één harde. Het weefsel wordt daardoor verwarmd zonder dat de bovenlaag wordt weggenomen. Wat je voelt is een oplopende warmte die net voor het ongemakkelijke stopt, en de behandelaar vraagt tijdens de sessie hoe warm het aanvoelt. [MEDISCHE-CHECK-ROJDA]",
      "Er is ook een volledig pakket, [Fotona 4D Full Package](/behandelingen/fotona-4d-full), waarin de hals en de kaaklijn meegaan. Daar valt verslapping vaak het eerst op, terwijl het gezicht er nog strak uitziet. En er is [Fotona 4D Men](/behandelingen/fotona-4d-men), met instellingen voor de doorgaans dikkere mannenhuid. [MEDISCHE-CHECK-ROJDA]",
    ],
    beeld: {
      src: "/images/shoot/apparaat-fotona.jpg",
      alt: "Het bedieningsscherm van de Fotona met het behandelmenu",
    },
    knop: { href: "/apparatuur/fotona", tekst: "Over de Fotona" },
  },

  tarief: {
    label: "Tarieven",
    anker: "Wat het kost",
    kop: "Wat Fotona 4D",
    accent: "bij ons kost",
    intro:
      "Een losse behandeling of een kuur van drie, voor het gezicht of met de hals en de kaaklijn erbij. De intakeregeling staat er compleet bij.",
    rijen: [
      { naam: "Fotona 4D, losse behandeling", prijs: F4.prijs },
      { naam: "Fotona 4D, kuur van drie", prijs: KUUR_4D },
      { naam: "Full Package, losse behandeling", prijs: FF.prijs },
      { naam: "Full Package, kuur van drie", prijs: KUUR_FF },
    ],
    zin: `Een kuur van drie kost ${euro(KUUR_4D)}, tegen ${euro(3 * F4.prijs)} voor drie losse behandelingen. Het tarief voor Fotona 4D Men hoor je bij de intake. [PRIJS-NODIG: tarief Fotona 4D Men]`,
    afspraak: [
      {
        kop: "Kom je voor het eerst",
        zin: `Dan boek je een behandeling op advies, waar we maximaal ${alsWoord(ADVIES_MINUTEN.nieuw / 60)} uur voor reserveren. Fotona 4D duurt zelf ${F4.duurMinuten} minuten, dus of hij in die eerste afspraak past, hangt af van hoe lang de intake duurt. Past het niet, dan plannen we hem direct daarna in. [GEGEVEN-NODIG: of Fotona 4D in een eerste afspraak van twee uur past, Okan]`,
      },
      ...afspraakBlokken({
        naam: "de Fotona 4D",
        duurMinuten: F4.duurMinuten,
      }).slice(1),
    ],
  },

  welNiet: {
    intro:
      "Fotona 4D werkt op verslapping, textuur en kleur. Voor huid die echt is gaan hangen, en voor wie in één keer resultaat wil, is het niet de goede keuze.",
    wel: [
      "Beginnende verslapping, vooral langs de kaaklijn en rond de mond [MEDISCHE-CHECK-ROJDA]",
      "Fijne lijntjes en een huid die minder egaal is geworden",
      "Werken in vier diepten tegelijk, van het slijmvlies tot de bovenste huidlaag",
      "Een behandeling zonder naalden en zonder snijden",
    ],
    niet: [
      "Huid die echt is gaan hangen. Daarvoor is chirurgie het antwoord [MEDISCHE-CHECK-ROJDA]",
      "Resultaat in één keer. Het effect bouwt zich op over de reeks",
      "Een dag waarop je er meteen weer onberispelijk uit moet zien. Reken op een paar uur tot een dag rood en warm [MEDISCHE-CHECK-ROJDA]",
      "Een vast aantal sessies vooraf. Hoeveel je huid opbouwt verschilt per persoon, dus we leggen het verloop vast",
    ],
  },

  vergelijking: {
    label: "Naast elkaar",
    anker: "Vergelijking",
    kop: "Fotona 4D naast",
    accent: "de alternatieven",
    intro:
      "Voor een stevigere huid zijn er meer wegen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.",
    kolommen: ["Behandeling", "Waarin het verschilt", "Hersteltijd", "Vanaf"],
    rijen: [
      vergelijkingsrij(
        "fotona-4d",
        "Vier laserstappen in één sessie, van binnenuit tot een afsluitende peeling.",
      ),
      vergelijkingsrij(
        "fotona-4d-full",
        "Hetzelfde protocol met de hals en de kaaklijn erbij, in een afspraak van twee uur.",
      ),
      vergelijkingsrij(
        "vectorlift",
        "Laser op het voorhoofd en rond de wenkbrauw, voor wie vooral daar verslapping ziet. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "smootheye",
        "Laser rond de oogcontour, voor kraaienpootjes en fijne lijntjes.",
      ),
      vergelijkingsrij(
        "skinboosters",
        "Werkzame stoffen in de huid met naalden. Werkt op vocht en stevigheid, zonder warmte. [MEDISCHE-CHECK-ROJDA]",
      ),
    ],
    bijschrift:
      "Fotona 4D vergeleken met andere behandelingen voor een stevigere huid op werking, hersteltijd en tarief",
  },

  wie: {
    label: "Wie de behandeling doet",
    zin: "Fotona 4D wordt bij ons gedaan door een huidtherapeut of een laserspecialist. Die stelt het apparaat per stap en per zone in, en past de warmte aan op wat jij tijdens de sessie aangeeft.",
  },

  faq: [
    {
      vraag: "Wat kost Fotona 4D in Rotterdam?",
      antwoord: `Bij Diba Clinics kost Fotona 4D ${euro(F4.prijs)} per behandeling en ${euro(KUUR_4D)} voor een kuur van drie. Het volledige pakket met hals en kaaklijn kost ${euro(FF.prijs)}, of ${euro(KUUR_FF)} als kuur van drie. Kom je voor het eerst, dan begint je afspraak met een intake van ${euro(INTAKE_PRIJS)}.`,
    },
    {
      vraag: "Waarom heet het 4D?",
      antwoord:
        "Omdat er vier behandelingen in een sessie op elkaar volgen, elk op een andere diepte: van het slijmvlies aan de binnenkant van je wang tot de bovenste huidlaag.",
    },
    {
      vraag: "Doet Fotona 4D pijn?",
      antwoord:
        "Het is warm. De eerste stap gebeurt in je mond en voelt warm tegen je wang; daarna loopt de warmte aan de buitenkant op tot net voor het ongemakkelijke. De behandelaar vraagt tijdens de sessie hoe het voelt en stelt het apparaat daarop bij. De laatste stap voelt als korte tikjes. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Heb je hersteltijd na Fotona 4D?",
      antwoord:
        "Weinig. Je bent een paar uur tot een dag rood en warm, alsof je te lang in de zon hebt gezeten. Bij het volledige pakket kan de huid door de afsluitende peeling een paar dagen ruw aanvoelen. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Wanneer zie ik resultaat van Fotona 4D?",
      antwoord:
        "Direct na de sessie ziet de huid er voller uit door de warmte, maar dat is nog geen resultaat. De opbouw van collageen kost weken; het verschil bouwt zich over de reeks op. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Hoeveel behandelingen Fotona 4D heb ik nodig?",
      antwoord:
        "Los te doen of als kuur van drie, met vier tot zes weken ertussen. Bij het volledige pakket volgt na de kuur meestal een keer per jaar onderhoud. Wat bij jou past, hoor je bij de intake. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Is Fotona 4D een alternatief voor een facelift?",
      antwoord:
        "Nee. Fotona 4D werkt op beginnende verslapping, textuur en kleur, zonder naalden en zonder snijden. Voor huid die echt is gaan hangen is chirurgie het antwoord, en dat zeggen we je dan ook. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan ik ook een van de vier stappen los doen?",
      antwoord:
        "Ja. SmoothLiftin, FRAC3, PIANO en SupErficial zijn elk los te boeken. Welke bij jou past, hoor je bij de intake.",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je niet of",
    accent: "Fotona 4D",
    na: "bij je past",
    zin: "Dat hoef je ook niet te weten voordat je komt. We bekijken je huid, bespreken wat je wilt bereiken en zeggen welke behandeling daarbij past. Is dat iets anders dan Fotona, of iets waar laser niet bij helpt, dan hoor je dat.",
  },

  cta: {
    kop: "Fotona 4D in Rotterdam",
    accent: "plannen",
    tekst:
      "We bekijken eerst je huid en bespreken wat Fotona 4D daar kan doen en wat niet. Daarna plannen we de eerste sessie.",
    topic: "fotona",
  },

  schema: {
    procedure: { naam: "Fotona 4D", omschrijving: F4.werking },
    dienst: { naam: "Fotona 4D", soort: "Laserbehandeling" },
  },
};
