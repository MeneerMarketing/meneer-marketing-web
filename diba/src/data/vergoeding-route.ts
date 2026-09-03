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
  /**
   * De plaats in de route, uitgeschreven en niet als "01".
   *
   * Deze drie vragen hebben wél een echte volgorde: je komt pas bij de tweede als de
   * eerste met ja is beantwoord. Dat mag je dus zien. Maar een genummerd bolletje met
   * "01" erin is sjabloon-opmaak; woorden lezen als iemand die het uitlegt.
   */
  readonly stap: string;
  readonly vraag: string;
  readonly zin: string;
  /** Wat er gebeurt als het antwoord nee is. Dit is bij elke stap het echte nieuws. */
  readonly nee: string;
  readonly ja: string;
};

export const ROUTE: readonly Stap[] = [
  {
    stap: "Eerste vraag",
    vraag: "Is er een medische reden?",
    zin: "Dit is de enige vraag die er echt toe doet, en hij gaat niet over de behandeling maar over de klacht. Dezelfde laser kan in het ene geval medisch zijn en in het andere cosmetisch.",
    nee: "Dan valt het onder cosmetische zorg en betaal je het zelf. Dat geldt bij elke kliniek en elke verzekeraar, want zo is het stelsel opgezet.",
    ja: "Dan ga je door naar de tweede vraag. Of er een medische reden is, bepaalt een arts.",
  },
  {
    stap: "Tweede vraag",
    vraag: "Zit het in je aanvullende verzekering?",
    zin: "Huidtherapie zit bij de meeste verzekeraars in het aanvullende pakket en niet in de basis. Wat er precies in zit verschilt per verzekeraar én per pakket, en het wijzigt per jaar.",
    nee: "Dan betaal je het zelf, en dat kan een prima keuze zijn. Je weet het alleen vooraf, met de prijs erbij.",
    ja: "Kijk dan meteen naar het maximum per jaar en of er een verwijzing van je huisarts nodig is. Dat laatste wordt het vaakst over het hoofd gezien.",
  },
  {
    stap: "Derde vraag",
    vraag: "Is er een verwijzing nodig?",
    zin: "Veel pakketten vergoeden alleen met een verwijzing van je huisarts, en die moet er zijn vóórdat de behandeling begint.",
    nee: "Dan kun je rechtstreeks terecht. Meld bij de intake wel dat je een vergoeding verwacht, dan wordt er meteen gekeken of alles klopt.",
    ja: "Regel die dan eerst, vóór je afspraak. Achteraf een verwijzing opsturen accepteren verzekeraars zelden, en die rekening blijft dan staan.",
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
    zin: "Wij zetten op je factuur wat er precies gedaan is, zodat je die kunt indienen. Wat jouw polis dekt staat alleen in jouw polis, en dat gesprek voer je met je verzekeraar. Weet je niet waar je moet kijken, vraag het ons dan bij de intake.",
  },
  {
    kop: "Ik hoor het later wel",
    zin: "Een verwijzing of een akkoord telt alleen als het er is vóórdat de behandeling begint. Regel je het van tevoren, dan is het meestal een kwestie van één belletje naar je huisarts.",
  },
];

/**
 * De taakverdeling rond een vergoeding.
 *
 * DIT WAS EEN LIJST MET ONZE BEPERKINGEN.
 *
 * "Zien wat er in jouw polis staat", "toezeggen dat iets vergoed wordt": waar, maar het
 * leverde een donker vlak op met de kop "Wat wij hierin niet kunnen" en daaronder vier keer
 * wat er hier misgaat. Dat is de laatste indruk die je van een kliniek wilt geven aan iemand
 * die uitzoekt of hij het kan betalen.
 *
 * Dezelfde afbakening staat er nu als taakverdeling: ons deel en jouw deel. Voor de lezer is
 * dat bovendien bruikbaarder, want hij weet nu wat hem te doen staat in plaats van wat wij
 * laten liggen.
 *
 * De grens is niet weg. Dat wij geen dekking kunnen toezeggen staat een sectie verder bij de
 * misverstanden, en daar staat hij scherper dan hier: het is precies wat mensen aannemen.
 */
export const ONZE_ROL = {
  wel: [
    "Vertellen wat een behandeling kost, vooraf en compleet",
    "Op je factuur zetten wat er precies gedaan is, zodat je die kunt indienen",
    "Bij de intake zeggen als we denken dat er een medische route bestaat die je nog niet gelopen hebt",
  ],
  jij: [
    "Je polisvoorwaarden nakijken op huidtherapie, of ons vragen waar je moet zoeken",
    "Bij je huisarts een verwijzing halen als je pakket die eist",
    "De factuur na afloop bij je verzekeraar indienen",
  ],
} as const;
