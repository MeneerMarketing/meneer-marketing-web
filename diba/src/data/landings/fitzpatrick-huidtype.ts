import { golflengte, toewijzing } from "@/data/gentlemax";
import { FITZPATRICK_TYPES, type FitzpatrickId } from "@/data/laser-zones";
import {
  INTAKE_PRIJS,
  euro,
  VRAAG_WAAR,
  type Landing,
  type Tabelrij,
} from "@/data/landings/types";

/**
 * Welk huidtype heb je: de schaal van Fitzpatrick.
 *
 * DE EERSTE PAGINA VAN GOLF 3, EN WAAROM DIE GOLF ANDERS IS.
 *
 * Golf 1 en 2 gaan over een behandeling bij ons in Rotterdam. Dit is de laag eronder: de
 * vraag zonder plaatsnaam, die iemand stelt voordat hij weet welke kliniek hij zoekt. Ze
 * verkoopt niets en dat is het punt; ze is het soort antwoord dat aangehaald wordt.
 *
 * WAAROM DEZE PAGINA NIET BOTST MET /laserontharing EN /gentlemax-pro.
 *
 * Die twee gaan over ontharen met de GentleMax Pro en noemen het huidtype als instelling
 * onderweg. Deze pagina gaat over het huidtype zelf: wat de schaal meet, hoe je je eigen
 * type nagaat en wat het betekent bij laser, IPL én peelings. Alles wat hier over
 * golflengtes staat, komt uit dezelfde tabel als de laserpagina (`gentlemax.ts`), dus de
 * twee kunnen niet uit elkaar lopen.
 *
 * WAT UIT ÉÉN BRON KOMT.
 *
 * De zes types en hun omschrijving komen uit `laser-zones.ts`; welke golflengte bij welk
 * type hoort en waarom, uit `gentlemax.ts`. Alleen de laatste kolom van de tabel is hier
 * geschreven, en die staat per regel gemarkeerd voor controle.
 */

/**
 * Waar we per type extra op letten, buiten het ontharen om.
 *
 * Dit is het enige wat hier zelf geschreven is en niet uit een bestaande tabel komt. Het
 * gaat over pigment en over hoe een huid op een behandeling reageert, dus elke regel is
 * een medische uitspraak. [MEDISCHE-CHECK-ROJDA] alle zes.
 */
const LETOP: Record<FitzpatrickId, string> = {
  I: "Verbranden gaat hier sneller dan verkleuren. Zonbescherming is het aandachtspunt, voor en na een behandeling. [MEDISCHE-CHECK-ROJDA]",
  II: "Weinig kans dat er pigment achterblijft na een behandeling. De huid wordt wel snel rood en dat trekt weer weg. [MEDISCHE-CHECK-ROJDA]",
  III: "Vanaf hier telt je voorgeschiedenis mee: bleef er eerder een vlek achter na een puist of een wondje, zeg dat dan. [MEDISCHE-CHECK-ROJDA]",
  IV: "De kans op nieuw pigment na een behandeling is groter. We bouwen de sterkte trager op en beginnen lager. [MEDISCHE-CHECK-ROJDA]",
  V: "IPL is hier vaak niet de juiste keuze, omdat de huid zelf te veel licht opneemt. Laser en peeling gaan met beleid. [MEDISCHE-CHECK-ROJDA]",
  VI: "Energie en sterkte gaan omlaag en een proefplek hoort erbij. Wat hier telt is geduld en niet meer vermogen. [MEDISCHE-CHECK-ROJDA]",
};

const TYPERIJEN: Tabelrij[] = FITZPATRICK_TYPES.map((t) => {
  const keuze = toewijzing(t.id);
  const laser =
    keuze.kies === "beide"
      ? "Alexandriet of Nd:YAG, na een proefplek"
      : `${golflengte(keuze.kies).naam}, ${golflengte(keuze.kies).nm} nm`;
  return { naam: t.label, cellen: [t.description, laser, LETOP[t.id]] };
});

export const FITZPATRICK_HUIDTYPE: Landing = {
  slug: "fitzpatrick-huidtype",
  soort: "vraag",
  gewijzigd: "2026-09-12",
  titel: "Fitzpatrick huidtype: welk type heb je",
  omschrijving:
    "De zes Fitzpatrick-huidtypes, wat je type zegt over laser, IPL en peelings, en hoe je het zelf bepaalt. Uitgelegd door de huidtherapeuten van Diba Clinics.",
  kruimel: "Huidtype",
  h1: { kop: "Welk huidtype", accent: "heb je" },
  antwoord:
    "Het Fitzpatrick-huidtype is een indeling in zes types die zegt hoe je huid op zon reageert: type I verbrandt vrijwel altijd en wordt nauwelijks bruin, type VI verbrandt zelden. Voor laser, IPL en peelings bepaalt je type niet óf iets kan, maar met welke golflengte, welke energie en hoe voorzichtig er wordt opgebouwd. Bij Diba Clinics in Rotterdam stellen we je type vast bij de intake. [MEDISCHE-CHECK-ROJDA]",
  feiten: [
    { kop: "Schaal", waarde: "Zes types, I tot VI" },
    { kop: "Gaat over", waarde: "Reactie op zon" },
    { kop: "Bepaalt", waarde: "De instelling" },
    { kop: "Vastgesteld", waarde: "Bij de intake" },
  ],
  beeld: {
    src: "/images/shoot/man-bij-de-scanner.jpg",
    alt: "Cliënt zit voor de huidscanner in de kliniek, klaar voor een meting",
  },
  kaart: {
    vraag: "Welk huidtype heb je",
    zin: "De zes types van Fitzpatrick, wat je type betekent voor laser, IPL en peelings, en hoe je het zelf nagaat.",
  },

  werking: {
    label: "De schaal",
    anker: "Wat het is",
    kop: "Wat een huidtype",
    accent: "precies zegt",
    intro:
      "Het gaat niet over de kleur die je in de spiegel ziet, maar over wat je huid met zon doet. Verbrand je snel, word je bruin, of allebei een beetje: daar zit de indeling in.",
    alineas: [
      "De schaal is in 1975 bedacht door de Amerikaanse dermatoloog Thomas Fitzpatrick, en hij is er gekomen omdat een behandeling met licht anders uitpakt bij de ene huid dan bij de andere. De vraag was dus niet hoe iemand eruitziet, maar hoeveel licht zijn huid opneemt en wat er daarna gebeurt. [MEDISCHE-CHECK-ROJDA]",
      "Je type volgt uit twee dingen: hoe snel je verbrandt in de eerste zon van het jaar, en hoe makkelijk je daarna bruin wordt. Iemand die na een halfuur rood is en nooit bruin wordt zit aan het begin van de schaal; iemand die zelden verbrandt en diep bruin wordt aan het eind. De meeste mensen in Nederland zitten er ergens tussenin. [MEDISCHE-CHECK-ROJDA]",
      "Het is een grove indeling en zo is hij ook bedoeld. Twee mensen van hetzelfde type kunnen anders reageren, en je eigen huid reageert in maart anders dan in augustus. Daarom is het bij ons een startpunt en geen eindoordeel: wat je huid werkelijk doet, blijkt uit een proefplek en uit hoe de eerste behandeling verloopt. [MEDISCHE-CHECK-ROJDA]",
      "Wat het type níet zegt: hoe droog of gevoelig je huid is, of je snel puistjes krijgt en hoe dik je huid is. Dat zijn andere eigenschappen, en die meten we apart bij de huidanalyse.",
    ],
    verder:
      "Welk type je hebt kun je zelf vastleggen in [je huidprofiel](/huidprofiel), zodat het al bekend is voordat je binnenkomt. Welke van de twee golflengtes bij jouw type hoort, kun je nakijken bij [de laserkiezer](/gentlemax-pro). Wat er tijdens een meting verder langskomt staat bij [de huidanalyse](/kennisbank/huidanalyse-rotterdam).",
  },

  onderscheid: {
    label: "Bij laser",
    anker: "Bij laser",
    kop: "Waarom je type",
    accent: "de laser stuurt",
    intro:
      "Laser en IPL mikken op pigment. Zit er veel pigment in je bovenhuid, dan vangt die een deel van het licht op, en dat is precies wat de instelling moet ondervangen.",
    alineas: [
      "Een ontharingslaser zoekt het pigment in de haarwortel. Het licht moet daar komen zonder onderweg te veel te worden opgenomen door de huid erboven. Bij een lichte huid is dat verschil groot en gaat vrijwel alle energie naar de wortel; bij een donkere huid is het verschil kleiner en moet de golflengte anders gekozen worden. [MEDISCHE-CHECK-ROJDA]",
      "Daarom staan er twee golflengtes in één apparaat. De alexandriet van 755 nanometer wordt sterk opgenomen door pigment en werkt efficiënt bij de types I tot en met III. De Nd:YAG van 1064 nanometer wordt veel minder opgenomen, gaat grotendeels langs de bovenlaag heen en is daarmee de keuze bij type V en VI.",
      "Type IV ligt op de grens, en dat is geen slap compromis maar de eerlijke stand van zaken. Reageert je huid rustig op de proefplek, dan kan de alexandriet op een lagere energie; is er twijfel, dan gaat het naar de Nd:YAG. Die keuze wordt in de behandelkamer gemaakt en niet vooraf op een website.",
      "Bij IPL ligt het anders, want dat is geen laser maar een bundel golflengtes tegelijk. Daar is minder ruimte om om je eigen pigment heen te werken, en bij een donkere huid kiezen we daarom vaker iets anders. [MEDISCHE-CHECK-ROJDA]",
    ],
    beeld: {
      src: "/images/shoot/detail-laserbril.jpg",
      alt: "Laserbril en reinigingsdoekjes klaargelegd op een handdoek in de behandelkamer",
    },
    knop: { href: "/laserontharing", tekst: "Over laserontharing" },
  },

  welNiet: {
    intro:
      "Je type is een van de gegevens waarmee een behandeling wordt ingesteld. Het is er één van meer, en het beslist minder dan mensen denken.",
    wel: [
      "Welke golflengte bij ontharen de veilige en de efficiënte keuze is",
      "Hoe voorzichtig de sterkte van een peeling wordt opgebouwd [MEDISCHE-CHECK-ROJDA]",
      "Hoe groot de kans is dat er na een behandeling pigment achterblijft [MEDISCHE-CHECK-ROJDA]",
      "Of een proefplek vooraf hoort, en hoe lang we die laten staan [MEDISCHE-CHECK-ROJDA]",
    ],
    niet: [
      "Of een behandeling kan. Op elk type wordt hier behandeld, met een andere instelling",
      "Hoe gevoelig, droog of vet je huid is. Dat is iets anders en dat meten we apart",
      "Hoeveel sessies je nodig hebt. Dat hangt vooral af van de zone en van je haar",
      "Wat je huid vandaag aankan. Een gebruinde huid van type II telt op dat moment anders [MEDISCHE-CHECK-ROJDA]",
    ],
  },

  vergelijking: {
    label: "De zes types",
    anker: "De types",
    kop: "De zes types",
    accent: "naast elkaar",
    intro:
      "Wat elk type met zon doet, welke golflengte er bij ontharen bij hoort en waar we verder op letten. De middelste kolom komt uit dezelfde tabel die in de behandelkamer wordt gebruikt.",
    kolommen: [
      "Huidtype",
      "Reactie op zon",
      "Bij ontharen",
      "Waar we op letten",
    ],
    rijen: TYPERIJEN,
    bijschrift:
      "De zes Fitzpatrick-huidtypes met hun reactie op zon, de bijpassende golflengte bij laserontharing en de aandachtspunten per type",
  },

  wie: {
    label: "Wie je type bepaalt",
    zin: `Je type wordt vastgesteld door de huidtherapeut of de laserspecialist die je behandelt, tijdens de intake. Dat gebeurt met de vragen hierboven en met de meting; een losse intake kost ${euro(INTAKE_PRIJS)} en vervalt als er in dezelfde afspraak behandeld wordt.`,
  },

  faq: [
    {
      vraag: "Hoe bepaal ik zelf welk Fitzpatrick-type ik heb?",
      antwoord:
        "Door twee vragen te beantwoorden over de eerste zon van het jaar: verbrand je, en word je daarna bruin? Verbrand je altijd en word je nooit bruin, dan zit je bij type I of II. Verbrand je zelden en word je makkelijk bruin, dan bij type IV of hoger. Twijfel je, dan is dat geen probleem: bij de intake stellen we het samen vast. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan laserontharing bij elk huidtype?",
      antwoord:
        "Ja, de GentleMax Pro werkt op type I tot en met VI. Je type bepaalt niet of het kan, maar met welke golflengte, welke energie en welke koeling er gewerkt wordt. Bij de donkere types gaat dat met de Nd:YAG en met een proefplek vooraf. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Waarom vragen jullie naar mijn huidtype voordat ik kom?",
      antwoord:
        "Omdat het bepaalt wat er op de dag zelf mogelijk is. Staat je type al in je huidprofiel, dan hoeft dat gesprek niet meer aan de balie te beginnen en is de intake korter. Het blijft een startpunt: wat je huid werkelijk doet, blijkt uit de proefplek.",
    },
    {
      vraag: "Verandert mijn huidtype in de zomer?",
      antwoord:
        "Je type zelf niet, je huid op dat moment wel. Een gebruinde huid bevat verse kleur die licht opneemt, en dan wordt er anders ingesteld of even gewacht. Hoeveel weken dat vraagt hoor je bij de intake, want dat verschilt per huid. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Wat betekent mijn type voor een peeling?",
      antwoord:
        "Bij type IV tot en met VI is de kans groter dat er na een peeling pigment achterblijft. Daarom kiezen we de sterkte voorzichtiger, bouwen we trager op en bespreken we vooraf wat je huid eerder deed na een ontsteking of een wondje. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Is IPL geschikt voor een donkere huid?",
      antwoord:
        "Vaak niet. IPL stuurt een bundel golflengtes tegelijk, en een huid met veel eigen pigment neemt daar te veel van op. Bij een donkere huid kiezen we daarom meestal een andere behandeling, en wat dat is hangt af van waarvoor je komt. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Wat is het verschil tussen huidtype en huidconditie?",
      antwoord:
        "Je type ligt vast en gaat over je reactie op zon. Je conditie verandert en gaat over hoe je huid er vandaag voor staat: droog, vettig, gevoelig, ontstoken. Voor de keuze van een behandeling telt de conditie vaak zwaarder dan het type.",
    },
    {
      vraag: "Waarom een proefplek als mijn type al bekend is?",
      antwoord:
        "Omdat de schaal een indeling is en geen meting van jouw huid. Twee mensen van hetzelfde type kunnen anders reageren op dezelfde energie. Een proefplek laat zien wat jouw huid doet, en dat weegt zwaarder dan het getal. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kost het bepalen van mijn huidtype iets apart?",
      antwoord: `Nee. Het hoort bij de intake, samen met de meting van je huid. Een losse intake kost ${euro(INTAKE_PRIJS)} en duurt maximaal dertig minuten. Wordt er in dezelfde afspraak behandeld, dan vervalt dat bedrag en betaal je alleen de behandeling.`,
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je je type",
    accent: "niet zeker",
    zin: "Dat hoeft ook niet voordat je komt. We stellen het vast bij de intake, samen met de meting, en daar volgt uit wat er in jouw geval mogelijk is en met welke instelling. Blijkt behandelen op dat moment niet verstandig, dan hoor je dat en doen we het niet.",
  },

  cta: {
    kop: "Je huidtype",
    accent: "laten bepalen",
    tekst:
      "We meten je huid, stellen je type vast en bespreken wat er daarmee mogelijk is. Is behandelen verantwoord en wil je dat, dan kan het vaak in dezelfde afspraak.",
    topic: "huidtype",
  },

  schema: {},
};
