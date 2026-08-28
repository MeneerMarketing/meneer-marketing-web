/**
 * Inhoud van de wallenpagina.
 *
 * WAAROM NAAST /huidproblemen/donkere-kringen.
 *
 * Omdat het twee dingen zijn die mensen door elkaar halen en die om verschillende
 * antwoorden vragen. Een donkere kring is kleur; een wal is volume. Je kunt het ene hebben
 * zonder het andere, en de behandeling van het ene doet niets aan het andere.
 *
 * "Wallen" is bovendien de term waarmee mensen zoeken. Die stond nergens.
 *
 * WAT DEZE PAGINA MOEILIJK MAAKT, EN EERLIJK.
 *
 * Van de drie oorzaken is er precies één waar een huidkliniek iets aan doet. Vocht is te
 * beïnvloeden; uitgezakt vet is een chirurgische kwestie en een schaduw door volumeverlies
 * is dat vaak ook. Dat betekent dat deze pagina de meeste bezoekers doorstuurt.
 *
 * Dat is geen reden om hem niet te maken. Iemand die nu "wallen weg laten halen" zoekt
 * komt bij een aanbieder die wél ja zegt, en betaalt voor iets dat niet werkt. Deze pagina
 * geeft het antwoord dat er in het consult ook zou vallen, alleen eerder.
 *
 * MEDISCH.
 *
 * Alles wat een bewering doet is gemarkeerd voor Rojda. De ochtendtest hieronder is een
 * herkenningshulp en geen diagnose, en dat staat ook op de pagina zelf.
 */

export type WalOorzaak = {
  readonly id: string;
  readonly naam: string;
  readonly klanttaal: string;
  readonly vakterm: string;
  /** De vraag die deze oorzaak van de andere twee onderscheidt. */
  readonly zelfcheck: string;
  readonly watHetIs: string;
  readonly watWijDoen: string;
  /** Ligt dit binnen wat een huidkliniek kan. Stuurt de toon van de kaart. */
  readonly binnenBereik: boolean;
};

export const WAL_OORZAKEN: readonly WalOorzaak[] = [
  {
    id: "vocht",
    naam: "Vocht",
    klanttaal: "'s Ochtends dik, in de loop van de dag minder",
    vakterm: "peri-orbitaal oedeem",
    zelfcheck:
      "Is het bij het opstaan het ergst en tegen de middag een stuk minder? En verschilt het per nacht, na zout eten of een glas te veel?",
    watHetIs:
      "Vocht dat zich 's nachts ophoopt in het losse weefsel onder je ogen en overdag wegzakt. Dit is de enige van de drie die van dag tot dag verandert. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Hier valt iets te doen. Afvoer stimuleren, de huid steviger maken, en kijken wat er in je routine of je nachten meespeelt.",
    binnenBereik: true,
  },
  {
    id: "vet",
    naam: "Uitgezakt vet",
    klanttaal: "Een bolling die er altijd zit, ochtend en avond hetzelfde",
    vakterm: "prolaps van het orbitale vetkussen",
    zelfcheck:
      "Is de bolling 's avonds net zo groot als 's ochtends, en wordt hij duidelijker als je omhoog kijkt?",
    watHetIs:
      "Het vetkussentje achter je oog duwt naar voren doordat het membraan dat het op zijn plek houdt verslapt. Er zit dan niets extra's; het staat alleen op een andere plek. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Hier zeggen we nee. Dit is chirurgie en geen huidbehandeling; een cosmetisch arts of oogarts kan er wél iets aan doen.",
    binnenBereik: false,
  },
  {
    id: "schaduw",
    naam: "Schaduw, geen zwelling",
    klanttaal: "Een groef of holte onder je oog die donker oogt",
    vakterm: "traandalgroeve, tear trough",
    zelfcheck:
      "Verdwijnt het bijna als je van onderaf licht op je gezicht laat vallen, of als je met je vinger de huid iets omhoog duwt?",
    watHetIs:
      "Geen wal en geen kring, maar een dal. Door volumeverlies aan de rand van je oogkas valt er schaduw, en die lees je als donker. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Wij vullen niet op met fillers. Wel kunnen we de huid eromheen steviger maken, en soms is dat genoeg om de schaduw te verzachten.",
    binnenBereik: false,
  },
];

export const OCHTENDTEST: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "Kijk bij het opstaan",
    tekst:
      "Maak een foto van je gezicht, recht van voren, met het licht van boven. Niet lachen; dat verplaatst alles.",
  },
  {
    kop: "Kijk aan het eind van de dag",
    tekst:
      "Zelfde plek, zelfde licht, zelfde gezicht. Het gaat om het verschil en niet om hoe erg het is.",
  },
  {
    kop: "Vergelijk de twee",
    tekst:
      "Duidelijk minder in de avond? Dan is het vocht. Precies hetzelfde? Dan is het vet of schaduw, en dan ligt het antwoord buiten deze kliniek.",
  },
];

export const WALLEN_WEL_NIET = {
  wel: [
    "Eerst vaststellen of het vocht, vet of schaduw is, want twee daarvan lossen we hier niet op",
    "Bij vocht: afvoer stimuleren en de huid rond het oog steviger maken, in een reeks",
    "Zonbescherming rond de ogen, want een dunnere huid laat alles eronder beter zien [MEDISCHE-CHECK-ROJDA]",
    "Meewegen wat er verder speelt: slaap, zout, alcohol, allergie [MEDISCHE-CHECK-ROJDA]",
    "Doorsturen naar een arts als het antwoord daar ligt, ook als je hier al zat",
  ],
  niet: [
    "Fillers onder het oog. Dat doen wij niet, en het is bij een echte wal ook zelden de oplossing",
    "Agressieve behandelingen op de dunste huid van je gezicht [MEDISCHE-CHECK-ROJDA]",
    "Een crème adviseren tegen een vetkussen Een crème kan een uitgezakt vetkussen onder het oog niet verplaatsen.",
    "Beloven dat het weggaat als het van dag tot dag niet verandert",
  ],
} as const;

export const WALLEN_WIJ_DOEN_NIET = [
  {
    titel: "Geen behandeling voor uitgezakt vet",
    tekst:
      "Zit de bolling er 's ochtends en 's avonds hetzelfde bij, dan gaat het om het vetkussen achter je oog. Daar is een ingreep voor, en die hoort bij een cosmetisch arts of oogarts. Wij zouden je een reeks verkopen die niets verandert. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen fillers in de traandal",
    tekst:
      "Wij werken niet met injectables in dit gebied. Dat is een keuze en geen tekort: het is een lastige plek waar te veel of te ondiep spuiten jarenlang zichtbaar blijft. [MEDISCHE-CHECK-ROJDA]",
  },
];

export const WALLEN_FAQ = [
  {
    vraag: "Wat is het verschil tussen wallen en donkere kringen?",
    antwoord:
      "Een wal is volume: er zit iets, of het nu vocht of vet is. Een donkere kring is kleur: pigment of doorschijnende vaatjes in een dunne huid. Ze komen vaak samen voor en vragen om verschillende dingen. Gaat het bij jou vooral om kleur, lees dan verder op de pagina over donkere kringen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Helpt beter slapen?",
    antwoord:
      "Bij vocht scheelt het, net als minder zout en minder alcohol voor het slapen. Bij vet of schaduw verandert er niets van, hoe goed je ook slaapt. Dat is precies waarom we eerst willen weten wat je hebt. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Kan ik er zelf iets aan doen?",
    antwoord:
      "Met je hoofd iets hoger slapen en koelen in de ochtend helpt tegen vocht, tijdelijk. Wrijven in je ogen is het enige dat je echt moet laten: de huid daar is de dunste van je lichaam en rekt makkelijk op. [MEDISCHE-CHECK-ROJDA]",
  },
];
