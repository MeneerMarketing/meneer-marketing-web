/**
 * De behandelingen.
 *
 * Elke pagina in deze reeks is om één vraag heen gebouwd, net als bij de huidproblemen.
 * Daar was het "waar begint dit probleem"; hier is het:
 *
 *     Hoe diep komt deze behandeling, en wat kost dat aan hersteltijd?
 *
 * Dat is niet zomaar een kapstok. Het is de enige vraag die de hele lijst tegelijk
 * verklaart: waarom een peeling goedkoper is dan microneedling, waarom je van de een een
 * dag rood bent en van de ander niet, en waarom een behandeling die "dieper" gaat niet
 * automatisch beter is. Wie dat begrijpt hoeft ons niet te geloven op ons woord.
 *
 * DIEPTE IN LAGEN, NIET IN MICROMETERS. Ik zou er getallen bij kunnen zetten, maar dan
 * doe ik alsof er een precisie is die er niet is: hoe diep iets komt hangt af van de
 * instellingen, de zone en de huid van die persoon. Vier lagen is wat je eerlijk kunt
 * zeggen, en het is ook precies genoeg om de vraag te beantwoorden.
 *
 * COPY-STATUS: concept. Alles wat over huid en werking gaat langs Rojda, zonder
 * uitzondering. De prijzen zijn voorlopig, zie `VOORLOPIGE_PRIJZEN`.
 */

import { VOORLOPIGE_PRIJZEN } from "@/data/laser-zones";

export { VOORLOPIGE_PRIJZEN };

/**
 * De lagen van de huid, van buiten naar binnen. Geen volledige anatomie: dit zijn de vier
 * die er voor een behandelkeuze toe doen.
 */
export const HUIDLAGEN = [
  {
    id: "hoornlaag",
    naam: "Hoornlaag",
    zin: "De buitenste laag dode cellen. Wat hier gebeurt zie je snel en het herstelt snel.",
  },
  {
    id: "opperhuid",
    naam: "Opperhuid",
    zin: "Waar je pigment zit en waar nieuwe huidcellen vandaan komen.",
  },
  {
    id: "lederhuid-boven",
    naam: "Bovenste lederhuid",
    zin: "Hier begint het bindweefsel. Wat je hier raakt, herstelt met littekenvorming of met opbouw.",
  },
  {
    id: "lederhuid-diep",
    naam: "Diepe lederhuid",
    zin: "Haarwortels, vaten en de stevigheid van je huid. Diep werken vraagt om een reden.",
  },
] as const;

export type HuidlaagId = (typeof HUIDLAGEN)[number]["id"];

export type Behandeling = {
  readonly slug: string;
  readonly naam: string;
  /** Eén regel die zegt wat het is. Verschijnt op de kaart in het overzicht. */
  readonly kort: string;
  /** De lagen die deze behandeling bereikt, van ondiep naar diep. */
  readonly lagen: readonly HuidlaagId[];
  /** Wat er in die lagen gebeurt. */
  readonly werking: string;
  /** Wat je erna merkt, en hoe lang. Dit is de prijs die niemand op een prijslijst zet. */
  readonly herstel: string;
  /** Hoe vaak. Geen belofte, een orde van grootte. */
  readonly sessies: string;
  /** Prijs per sessie in hele euro's. Voorlopig, zie VOORLOPIGE_PRIJZEN. */
  readonly prijs: number;
  /** Waar het wél iets aan doet. */
  readonly wel: readonly string[];
  /** Waar het niets aan doet. Deze lijst is even lang als de vorige, met opzet. */
  readonly niet: readonly string[];
  /** Wat er in een afspraak gebeurt, in volgorde. */
  readonly stappen: readonly { readonly kop: string; readonly zin: string }[];
  /** Huidproblemen waar deze behandeling bij hoort. */
  readonly bijProblemen: readonly { readonly label: string; readonly href: string }[];
  readonly faq: readonly { readonly vraag: string; readonly antwoord: string }[];
};

export const BEHANDELINGEN: readonly Behandeling[] = [
  {
    slug: "huidanalyse",
    naam: "Huidanalyse",
    kort: "Meten onder vast licht. De enige behandeling waarbij niets aan je huid gebeurt.",
    lagen: [],
    werking:
      "Bij een huidanalyse wordt er niets aan je huid gedaan. We kijken en meten: onder vaste belichting, vanaf een vaste afstand, zodat de opname van vandaag te vergelijken is met die van over drie maanden. Wat je in de spiegel ziet hangt af van je badkamerlamp; wat hier vastligt niet. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Geen. Je loopt hier weg zoals je binnenkwam.",
    sessies: "Eén keer aan het begin, daarna bij elke controle opnieuw",
    prijs: 75,
    wel: [
      "Legt vast wat er nu is, op een manier die over maanden nog vergelijkbaar is",
      "Laat verschil zien tussen wat je ziet en wat er meetbaar aan de hand is",
      "Geeft de basis waar een plan op gebouwd wordt, of waar het advies uit volgt om niets te doen",
    ],
    niet: [
      "Stelt geen diagnose. Dat doet een arts",
      "Verandert niets aan je huid, ook niet een klein beetje",
      "Voorspelt geen resultaat. Een meting is een startpunt, geen belofte",
    ],
    stappen: [
      {
        kop: "Schoon gezicht",
        zin: "Make-up eraf. Een meting over foundation heen is geen meting.",
      },
      {
        kop: "Opname onder vast licht",
        zin: "Zelfde lamp, zelfde afstand, zelfde stand. Dat is wat vergelijken mogelijk maakt.",
      },
      {
        kop: "Samen kijken",
        zin: "Je ziet hetzelfde scherm als wij. Wat er staat wordt uitgelegd, ook als het meevalt.",
      },
    ],
    bijProblemen: [
      { label: "Behandeling Nul", href: "/intake" },
      { label: "Alle huidproblemen", href: "/huidproblemen" },
    ],
    faq: [
      {
        vraag: "Moet ik dit doen voordat ik iets anders kan?",
        antwoord:
          "Ja. Niet omdat het moet van ons, maar omdat een plan zonder beginmeting niet te controleren is. Je weet dan over drie maanden niet of het gewerkt heeft.",
      },
      {
        vraag: "Krijg ik de foto's mee?",
        antwoord:
          "Dat is nog niet geregeld. Het is wel waar Mijn Diba voor bedoeld is. [BESLUIT-OKAN]",
      },
    ],
  },

  {
    slug: "chemische-peeling",
    naam: "Chemische peeling",
    kort: "Werkt aan de buitenkant. Snel zichtbaar, snel weer weg als je stopt.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "Een peeling maakt de verbinding tussen de buitenste huidcellen los, zodat die laag sneller wordt vervangen dan hij uit zichzelf zou doen. Hoe ver dat gaat hangt af van het middel en de sterkte. Wat wij doen blijft in de hoornlaag en de opperhuid: daar zit verkleuring en ruwheid, en daar herstelt de huid ook het snelst. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Twee tot vijf dagen droog en schilferig. Geen wondverzorging nodig. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Meestal een reeks, met weken ertussen [GEGEVEN-NODIG]",
    prijs: 95,
    wel: [
      "Maakt oppervlakkige verkleuring lichter",
      "Haalt ruwheid en doffe textuur weg",
      "Helpt bij verstopte poriën doordat de bovenlaag sneller vernieuwt",
    ],
    niet: [
      "Bereikt geen littekens die dieper zitten dan de opperhuid",
      "Doet niets aan haargroei",
      "Houdt niet vanzelf aan. Stop je, dan komt de oude situatie terug",
    ],
    stappen: [
      {
        kop: "Huid schoonmaken en beoordelen",
        zin: "De sterkte wordt op jouw huid van vandaag gekozen, niet op die van drie maanden geleden.",
      },
      {
        kop: "Aanbrengen en tijd bewaken",
        zin: "De inwerktijd is het middel. Te kort doet niets, te lang is niet beter maar schadelijker.",
      },
      {
        kop: "Neutraliseren en beschermen",
        zin: "Daarna zon vermijden. Dat is geen advies maar een voorwaarde. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    bijProblemen: [
      { label: "Acne", href: "/huidproblemen/acne" },
      { label: "Pigmentvlekken", href: "/huidproblemen/pigmentvlekken" },
      { label: "Poriën", href: "/huidproblemen/porien" },
    ],
    faq: [
      {
        vraag: "Ga ik echt vervellen?",
        antwoord:
          "Vaak wel, en het is geen teken dat het extra goed werkt. Hoeveel je vervelt zegt iets over je huid, niet over het resultaat.",
      },
      {
        vraag: "Kan dit in de zomer?",
        antwoord:
          "Dat hangt af van je huid en van hoeveel zon je krijgt. Bij pigment is het seizoen vaak doorslaggevend, en dan raden we het af. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
  },

  {
    slug: "microneedling",
    naam: "Microneedling",
    kort: "Gaat door de opperhuid heen. Werkt langzaam, maar op de laag waar structuur zit.",
    lagen: ["opperhuid", "lederhuid-boven"],
    werking:
      "Microneedling maakt met fijne naalden heel veel kleine kanaaltjes tot in de bovenste lederhuid. Daar zit het bindweefsel, en de huid reageert daarop met herstel. Dat herstel is het doel; de prikjes zelf zijn alleen de aanleiding. Daarom duurt het weken voor je iets ziet en niet dagen. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Eén tot drie dagen rood, als een stevige zonnegloed. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Een reeks met weken ertussen, want het herstel is het werk [GEGEVEN-NODIG]",
    prijs: 145,
    wel: [
      "Werkt op littekens die door verlies van structuur zijn ontstaan",
      "Maakt fijne lijntjes en ongelijke textuur minder scherp",
      "Bereikt de laag waar een peeling niet komt",
    ],
    niet: [
      "Doet niets aan kleur op zichzelf",
      "Werkt niet in één keer, en een enkele sessie is dus geen halve behandeling maar geen behandeling",
      "Is niet geschikt bij actieve ontsteking of een huidaandoening die eerst behandeld moet worden [MEDISCHE-CHECK-ROJDA]",
    ],
    stappen: [
      {
        kop: "Verdoven en afdekken",
        zin: "Een verdovende crème krijgt tijd om te werken. Dat wachten hoort erbij.",
      },
      {
        kop: "Behandelen per zone",
        zin: "De diepte wordt per zone gekozen. Rond de ogen is de huid dunner dan op de wang.",
      },
      {
        kop: "Rust geven",
        zin: "Daarna niets erop wat er niet op hoeft. De huid staat een dag open. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    bijProblemen: [
      { label: "Littekens en striae", href: "/huidproblemen/littekens" },
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },
      { label: "Poriën", href: "/huidproblemen/porien" },
    ],
    faq: [
      {
        vraag: "Doet het pijn?",
        antwoord:
          "Met verdoving is het goed te doen. Zonder verdoving zou het dat niet zijn, en daarom slaan we die stap niet over.",
      },
      {
        vraag: "Waarom zie ik na één keer niets?",
        antwoord:
          "Omdat het herstel het werk doet, en dat duurt weken. Wie na één sessie resultaat belooft verkoopt je iets anders dan microneedling.",
      },
    ],
  },

  {
    slug: "lasertherapie",
    naam: "Lasertherapie",
    kort: "Mikt op kleur. Kan ondiep of diep werken, afhankelijk van waar de kleur zit.",
    lagen: ["opperhuid", "lederhuid-boven", "lederhuid-diep"],
    werking:
      "Een laser stuurt één golflengte licht de huid in, en die golflengte bepaalt waar het licht wordt opgenomen: door pigment, door bloed of door de haarwortel. Wat de energie opneemt warmt op, de rest niet. Daarom is laser precies en daarom moet je wel weten waar je op mikt. Zit de kleur diep, dan moet het licht daar komen, en dat vraagt een andere instelling dan een vlekje aan de oppervlakte. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Van een paar uur rood tot enkele dagen, afhankelijk van zone en instelling. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Altijd een reeks. Het aantal hangt af van doel en huidtype [GEGEVEN-NODIG]",
    prijs: 125,
    wel: [
      "Werkt op pigment, op zichtbare vaatjes en op haargroei",
      "Kan diep genoeg komen om een haarwortel te bereiken",
      "Is instelbaar op je huidtype, van Fitzpatrick I tot en met VI",
    ],
    niet: [
      "Doet niets aan iets zonder kleurverschil met de omgeving",
      "Is niet één apparaat en niet één instelling. Wie dat suggereert vereenvoudigt te veel",
      "Is niet zonder risico bij een gebruinde huid of bij bepaalde medicatie [MEDISCHE-CHECK-ROJDA]",
    ],
    stappen: [
      {
        kop: "Huidtype en doel bepalen",
        zin: "Zonder die twee is elke instelling een gok, en een gok op een laser is geen gok die je wil nemen.",
      },
      {
        kop: "Proefplekje",
        zin: "Eerst een klein stukje, dan wachten. Dat kost een afspraak extra en het is die afspraak waard. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        kop: "Koelen en behandelen",
        zin: "De koeling beschermt de bovenste laag terwijl het licht dieper zijn werk doet.",
      },
    ],
    bijProblemen: [
      { label: "Pigmentvlekken", href: "/huidproblemen/pigmentvlekken" },
      { label: "Rosacea", href: "/huidproblemen/rosacea" },
      { label: "Laserontharing", href: "/laserontharing" },
    ],
    faq: [
      {
        vraag: "Is laser veilig voor mijn huidtype?",
        antwoord:
          "De GentleMax Pro werkt op Fitzpatrick I tot en met VI. Je type bepaalt niet óf het kan maar met welke instellingen. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Waarom eerst een proefplekje?",
        antwoord:
          "Omdat een huid pas na een paar dagen laat zien hoe hij reageert. Dat vooraf weten op een klein stukje is beter dan het achteraf ontdekken op je hele gezicht.",
      },
    ],
  },

  {
    slug: "ipl",
    naam: "IPL",
    kort: "Breed licht in plaats van één golflengte. Ondieper dan laser, en minder precies.",
    lagen: ["opperhuid", "lederhuid-boven"],
    werking:
      "IPL stuurt geen enkele golflengte de huid in maar een bereik, met een filter dat het grofste eruit haalt. Daardoor raakt het meerdere doelen tegelijk en komt het gemiddeld minder diep dan een laser. Dat is soms precies wat je wil en soms juist niet: breed werkt sneller over een groot vlak, smal werkt nauwkeuriger op één ding. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Meestal een paar uur rood. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Een reeks, meestal meer sessies dan bij laser [GEGEVEN-NODIG]",
    prijs: 110,
    wel: [
      "Behandelt een groot vlak in korte tijd",
      "Werkt op oppervlakkige roodheid en oppervlakkig pigment",
      "Is een goede keuze als het doel breed is en niet één specifiek plekje",
    ],
    niet: [
      "Is minder precies dan laser, en dus niet de eerste keus bij één duidelijk doel",
      "Bereikt niet wat diep zit",
      "Is niet voor elk huidtype geschikt [MEDISCHE-CHECK-ROJDA]",
    ],
    stappen: [
      {
        kop: "Filter kiezen",
        zin: "Het filter bepaalt welk deel van het lichtbereik je huid in gaat. Dat is de belangrijkste keuze van de afspraak.",
      },
      {
        kop: "Gel en flitsen",
        zin: "De gel geleidt en koelt. Per flits wordt een vlak behandeld en niet een punt.",
      },
      {
        kop: "Nakijken",
        zin: "Wat er die dag verandert zegt weinig. Wat er na een week staat wel.",
      },
    ],
    bijProblemen: [
      { label: "Rosacea", href: "/huidproblemen/rosacea" },
      { label: "Pigmentvlekken", href: "/huidproblemen/pigmentvlekken" },
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },
    ],
    faq: [
      {
        vraag: "Wat is het verschil met laser?",
        antwoord:
          "Een laser stuurt één golflengte, IPL een bereik. Smal is preciezer en komt dieper, breed werkt sneller over een groot vlak. Welke van de twee beter is hangt dus af van je doel, niet van welke nieuwer klinkt.",
      },
      {
        vraag: "Is IPL hetzelfde als de apparaten voor thuis?",
        antwoord:
          "Nee. Thuisapparaten werken op veel lagere energie, en dat is precies waarom ze veiliger zijn en waarom ze minder doen. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
  },
];

export function behandelingVoorSlug(slug: string): Behandeling | undefined {
  return BEHANDELINGEN.find((b) => b.slug === slug);
}

/** Hoe diep een behandeling komt, als getal, zodat je op diepte kunt sorteren. */
export function diepte(b: Behandeling): number {
  if (b.lagen.length === 0) return 0;
  const laatste = b.lagen[b.lagen.length - 1];
  return HUIDLAGEN.findIndex((l) => l.id === laatste) + 1;
}
