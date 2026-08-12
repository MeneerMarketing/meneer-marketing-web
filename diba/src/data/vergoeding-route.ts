/**
 * De route naar een vergoeding.
 *
 * WAAROM DIT GEEN LIJST MET BEDRAGEN IS.
 *
 * Op /vergoedingen stond een raster met verzekeraarsnamen en twee algemene zinnen. Dat
 * suggereert dat de naam van je verzekeraar de vraag beantwoordt, en dat is precies de
 * verkeerde volgorde. Voor het overgrote deel van wat hier gedaan wordt is het antwoord
 * namelijk hetzelfde ongeacht de verzekeraar: niets, en dat is normaal.
 *
 * Wat wel bepalend is, is de vraag die eraan voorafgaat: is jouw behandeling medisch
 * noodzakelijk of cosmetisch. Daarna pas komt je polis in beeld.
 *
 * WAAROM HIER GEEN BEDRAGEN EN GEEN PAKKETNAMEN STAAN.
 *
 * Voorwaarden en maxima veranderen per jaar en per pakket. Een bedrag op een website is
 * binnen twaalf maanden onjuist, en bij geld is onjuist erger dan afwezig. Dus staat hier
 * het mechaniek, dat verandert niet, en voor het bedrag ga je naar je eigen polis.
 *
 * [MEDISCHE-CHECK-ROJDA] de voorbeelden van wat medisch kan zijn: die grens loopt langs
 * klachten en niet langs behandelnamen, en ik wil niet dat iemand hier leest dat zijn geval
 * vergoed wordt terwijl dat aan een arts is.
 * [BESLUIT-OKAN] of we de losse verzekeraarspagina's houden. Ze staan er nog en ze linken
 * door, maar als daar geen actuele voorwaarden op komen te staan zijn het lege pagina's die
 * wel de indruk wekken dat wij het antwoord hebben.
 */

export type Stap = {
  readonly nr: string;
  readonly vraag: string;
  readonly zin: string;
  /** Wat er gebeurt als het antwoord nee is. Dit is bij elke stap het echte nieuws. */
  readonly nee: string;
  readonly ja: string;
};

export const ROUTE: readonly Stap[] = [
  {
    nr: "01",
    vraag: "Is er een medische reden?",
    zin: "Dit is de enige vraag die er echt toe doet, en hij gaat niet over de behandeling maar over de klacht. Dezelfde laser kan in het ene geval medisch zijn en in het andere cosmetisch.",
    nee: "Dan wordt er niets vergoed, door geen enkele verzekeraar. Dat is geen strengheid van jouw polis maar hoe het stelsel is opgezet: cosmetische zorg valt er buiten. Voor het grootste deel van wat wij doen is dit het antwoord.",
    ja: "Dan gaat het verder naar de volgende vraag. Of er een medische reden is, bepaalt een arts en niet wij.",
  },
  {
    nr: "02",
    vraag: "Zit het in je aanvullende verzekering?",
    zin: "Huidtherapie valt bij de meeste mensen niet onder de basisverzekering maar onder het aanvullende pakket. Wat daarin zit verschilt per verzekeraar én per pakket, en het wijzigt per jaar.",
    nee: "Dan betaal je zelf. Dat kan ook een prima keuze zijn, maar dan weet je het vooraf en niet achteraf.",
    ja: "Kijk dan meteen naar het maximum per jaar en of er een verwijzing van je huisarts nodig is. Dat laatste wordt het vaakst over het hoofd gezien.",
  },
  {
    nr: "03",
    vraag: "Is er een verwijzing nodig?",
    zin: "Veel pakketten vergoeden alleen met een verwijzing van je huisarts, en die moet er zijn vóórdat de behandeling begint.",
    nee: "Dan kun je rechtstreeks terecht. Meld bij de intake wel dat je een vergoeding verwacht, dan wordt er meteen gekeken of alles klopt.",
    ja: "Regel die eerst. Een verwijzing achteraf laten opsturen werkt in de praktijk vrijwel nooit, en dan sta je met een rekening die niet meer terug te draaien is.",
  },
];

/**
 * Wat mensen het vaakst verkeerd hebben.
 *
 * De eerste is de belangrijkste en scheelt letterlijk geld: vergoeding uit een aanvullende
 * verzekering gaat niet van je eigen risico af. Het eigen risico hoort bij de
 * basisverzekering. Heel veel mensen stellen zorg uit omdat ze denken van wel.
 */
export const MISVERSTANDEN: readonly { kop: string; zin: string }[] = [
  {
    kop: "Dit gaat van mijn eigen risico af",
    zin: "Bij een vergoeding uit je aanvullende verzekering niet. Het eigen risico hoort bij de basisverzekering. Veel mensen stellen behandeling uit omdat ze denken dat ze eerst honderden euro's kwijt zijn, en dat klopt hier niet.",
  },
  {
    kop: "Mijn verzekeraar vergoedt huidtherapie, dus dit ook",
    zin: "Vergoeding hangt aan de klacht en aan wie de behandeling uitvoert, niet aan de naam van de behandeling. Twee mensen met dezelfde afspraak kunnen een verschillend antwoord krijgen.",
  },
  {
    kop: "Dat regelt de kliniek wel voor me",
    zin: "Wij kunnen je vertellen wat er gedaan is en wat het kost. Of jouw polis het dekt kunnen wij niet zien en niet toezeggen. Dat gesprek voer je met je verzekeraar.",
  },
  {
    kop: "Ik hoor het later wel",
    zin: "Achteraf iets rechtzetten lukt bijna nooit. Een verwijzing of een akkoord moet er zijn voordat de behandeling begint, anders is het antwoord nee en blijft het nee.",
  },
];

/**
 * Wat wij wel en niet doen rond vergoeding.
 *
 * Dit is de eerlijke afbakening. Klinieken laten hier graag in het midden wie waarvoor aan
 * de lat staat, en dan is de teleurstelling voor de klant.
 */
export const ONZE_ROL = {
  wel: [
    "Vertellen wat een behandeling kost, vooraf en compleet",
    "Op je factuur zetten wat er precies gedaan is, zodat je die kunt indienen",
    "Bij de intake zeggen als we denken dat er een medische route bestaat die je nog niet gelopen hebt",
  ],
  niet: [
    "Zien wat er in jouw polis staat",
    "Toezeggen dat iets vergoed wordt",
    "Een verwijzing schrijven, want dat doet je huisarts",
    "Rechtstreeks bij je verzekeraar declareren",
  ],
} as const;
