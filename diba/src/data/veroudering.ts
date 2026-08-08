/**
 * Inhoud van de pagina over huidveroudering.
 *
 * De klinische waarheid die deze pagina eigen maakt: veroudering is niet één proces maar
 * twee die tegelijk lopen. Het ene komt door tijd en dat gaat door wat je ook doet. Het
 * andere komt door zon, en daar zit wél een knop. Dermatologen laten dat al decennia zien
 * met dezelfde demonstratie: kijk naar de binnenkant van je bovenarm, kijk dan naar je
 * gezicht. Even oud, totaal anders. Dat verschil is geen leeftijd.
 *
 * Dat is ook precies waarom deze pagina geen verjongingspagina is. We verkopen geen tien
 * jaar terug, we laten zien welk deel van wat je ziet nog een knop heeft.
 *
 * COPY-STATUS: concept in de Diba-stem. Medische beweringen gemarkeerd voor Rojda. Geen
 * percentages en geen "x jaar jonger": geen belofte zonder meting (A7).
 */

/* ── De onderarmtest ───────────────────────────────────────────────────── */

export const ONDERARM = {
  beschut: {
    label: "Binnenkant bovenarm",
    onder: "Vrijwel nooit zon gezien",
    lezing:
      "Gladder, egaler, weinig vlekken. Dit is wat tijd alleen met je huid doet: hij wordt dunner en droger, maar blijft gelijkmatig. [MEDISCHE-CHECK-ROJDA]",
  },
  blootgesteld: {
    label: "Je gezicht en handen",
    onder: "Elke dag zon, ook in de winter",
    lezing:
      "Fijne lijntjes, ongelijke kleur, verwijde vaatjes, ruwere structuur. Dit is tijd plus tienduizenden uren UV. [MEDISCHE-CHECK-ROJDA]",
  },
} as const;

/* ── Wat begint wanneer ────────────────────────────────────────────────── */

/** Drie standen, geen cijfers: we meten dit niet, dus we doen er ook geen getal omheen. */
export type Stand = "nog-niet" | "loopt" | "zichtbaar";

export type Proces = {
  readonly id: string;
  readonly naam: string;
  readonly vakterm: string;
  /** Tijd, zon, of allebei. Dit is de hele boodschap van de pagina. */
  readonly bron: "tijd" | "zon" | "allebei";
  readonly uitleg: string;
  /** Stand per levensfase, in dezelfde volgorde als FASES. */
  readonly standen: readonly [Stand, Stand, Stand, Stand];
};

export const FASES = [
  { id: "20", label: "20 tot 30 jaar" },
  { id: "30", label: "30 tot 40 jaar" },
  { id: "40", label: "40 tot 55 jaar" },
  { id: "55", label: "55 jaar en ouder" },
] as const;

export const PROCESSEN: readonly Proces[] = [
  {
    id: "collageen",
    naam: "Collageen loopt terug",
    vakterm: "collageenafname",
    bron: "allebei",
    uitleg:
      "De aanmaak zakt geleidelijk vanaf je twintiger jaren. UV versnelt het en breekt bestaand collageen ook af, dus dit spoor loopt bij iedereen maar niet even snel. [MEDISCHE-CHECK-ROJDA]",
    standen: ["loopt", "loopt", "zichtbaar", "zichtbaar"],
  },
  {
    id: "pigment",
    naam: "Vlekken komen op",
    vakterm: "lentigines, hyperpigmentatie",
    bron: "zon",
    uitleg:
      "Dit is bijna volledig een zonspoor. Wat je nu ziet is opgebouwd in jaren die al geweest zijn, en wat je vandaag doet bepaalt de vlekken van over tien jaar.",
    standen: ["nog-niet", "loopt", "zichtbaar", "zichtbaar"],
  },
  {
    id: "vaatjes",
    naam: "Vaatjes worden zichtbaar",
    vakterm: "teleangiëctasieën",
    bron: "zon",
    uitleg:
      "Kleine verwijde bloedvaatjes, vooral op neus en wangen. Zon en warmte zijn de grootste aanjagers. [MEDISCHE-CHECK-ROJDA]",
    standen: ["nog-niet", "loopt", "zichtbaar", "zichtbaar"],
  },
  {
    id: "textuur",
    naam: "Structuur wordt ruwer",
    vakterm: "verhoornings- en textuurverandering",
    bron: "allebei",
    uitleg:
      "De celvernieuwing vertraagt, waardoor de huid doffer oogt en licht anders weerkaatst. Dit is het onderdeel dat het snelst reageert op behandeling.",
    standen: ["nog-niet", "loopt", "zichtbaar", "zichtbaar"],
  },
  {
    id: "volume",
    naam: "Volume verplaatst zich",
    vakterm: "vet- en botremodellering",
    bron: "tijd",
    uitleg:
      "Vetkussentjes worden kleiner en zakken, en ook het bot eronder verandert. Dit is het meest zuivere tijdspoor, en precies het onderdeel waar wij niets aan doen. [MEDISCHE-CHECK-ROJDA]",
    standen: ["nog-niet", "nog-niet", "loopt", "zichtbaar"],
  },
] as const;

/** Wat we per levensfase eerlijk adviseren. Let op de eerste: die kost niets. */
export const FASE_ADVIES: Record<
  string,
  { readonly kop: string; readonly tekst: string }
> = {
  "20": {
    kop: "Hier valt het meeste te winnen en het kost bijna niets",
    tekst:
      "Op deze leeftijd is een behandeling zelden nodig. Wat je nu dagelijks doet aan bescherming bepaalt hoe je huid er over twintig jaar uitziet, en dat is geen verkooppraatje maar de reden dat je nog geen klant bij ons hoeft te zijn.",
  },
  "30": {
    kop: "Nu wordt meten zinvol",
    tekst:
      "De eerste zonschade wordt zichtbaar terwijl er nog niets vastligt. Een nulmeting nu geeft je een vergelijkingspunt, zodat je later weet of iets werkte of dat je het je verbeeldde.",
  },
  "40": {
    kop: "Hier is de volgorde belangrijker dan de techniek",
    tekst:
      "Meerdere sporen lopen tegelijk. Alles tegelijk aanpakken werkt niet en is duur. We beginnen bij het onderdeel dat het snelst reageert en meten of het klopt.",
  },
  "55": {
    kop: "Realistisch, en dat is niet hetzelfde als weinig",
    tekst:
      "Kleur en structuur zijn nog goed te verbeteren. Volume niet, want dat doen wij niet. Wie je hier een strakke kaaklijn belooft met een huidbehandeling, verkoopt je iets.",
  },
};

/* ── De beelden ────────────────────────────────────────────────────────── */

export const VEROUDERING_SOORTEN = [
  {
    id: "lijntjes",
    naam: "Fijne lijntjes",
    klanttaal: "Lijntjes rond ogen en mond die blijven staan",
    vakterm: "statische rimpels",
    watJeZiet:
      "Lijnen die eerst alleen bij lachen of fronsen verschenen en nu ook in rust zichtbaar blijven.",
    watHetBetekent:
      "De huid heeft op die plek minder veerkracht en de vouw is ingesleten. Dat is deels beweging en deels opgebouwde zonschade. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "We werken op de kwaliteit van de huid eromheen, niet op de vouw zelf. Verwacht een zachtere lijn, geen gladde huid.",
    verwarring:
      "Een lijn die alleen verschijnt als je lacht is geen veroudering. Die hoort bij een gezicht dat beweegt.",
  },
  {
    id: "dofheid",
    naam: "Doffe, ongelijke huid",
    klanttaal: "Je huid ziet er moe uit terwijl je niet moe bent",
    vakterm: "verminderde celvernieuwing",
    watJeZiet:
      "De huid weerkaatst licht anders: minder glans, meer ongelijkheid, make-up blijft slechter zitten.",
    watHetBetekent:
      "De bovenste laag vernieuwt trager en ligt onregelmatiger. Dit is het onderdeel dat het snelst en het zichtbaarst reageert.",
    aanpak:
      "Hier boeken we vaak binnen enkele weken zichtbare winst. Dat is meteen de reden dat we hier meestal beginnen.",
    verwarring:
      "Dit wordt vaak aangezien voor huidveroudering terwijl het net zo goed uitdroging, slaap of medicatie kan zijn. Daarom meten we eerst.",
  },
  {
    id: "kleur",
    naam: "Vlekken en verkleuring",
    klanttaal: "Bruine plekjes die er tien jaar geleden niet zaten",
    vakterm: "lentigines",
    watJeZiet:
      "Lichtbruine tot donkere plekjes op gezicht, decolleté en handrug. Vaak scherp begrensd.",
    watHetBetekent:
      "Opgebouwde zonschade die zichtbaar wordt. Dit is het duidelijkste bewijs dat het om zon gaat en niet om leeftijd. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Dit reageert goed, maar alleen met bescherming erbij. Zonder dat komt het terug en dan heb je betaald voor niets.",
    verwarring:
      "Een plekje dat verandert van vorm, kleur of grootte hoort niet bij ons maar bij de huisarts of dermatoloog. Altijd.",
  },
  {
    id: "verslapping",
    naam: "Minder strakke contouren",
    klanttaal: "De kaaklijn en wangen zakken",
    vakterm: "volumeverlies en verslapping",
    watJeZiet:
      "De contour van je gezicht verandert. Wangen worden platter, de kaaklijn minder scherp.",
    watHetBetekent:
      "Vet, spier en bot verplaatsen zich. Dit is het zuiverste tijdspoor en het minst beïnvloedbaar met huidbehandelingen. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Hier zeggen we nee. Wij behandelen huid, geen volume. We vertellen je wat wél realistisch is en wat je elders zou moeten zoeken.",
    verwarring:
      "Geen enkele crème, peeling of laser tilt weefsel op. Wie dat suggereert rekent op je hoop.",
  },
] as const;

export const VEROUDERING_WEL_NIET = {
  wel: [
    "Dagelijks bescherming, ook in de winter en achter glas. Dit is de goedkoopste behandeling die bestaat en de enige die aan alle sporen tegelijk werkt.",
    "Eén onderdeel tegelijk aanpakken en meten of het werkte, in plaats van een pakket kopen.",
    "Beginnen bij kleur en structuur, want daar zie je het snelst of de richting klopt.",
    "Je verwachting vooraf op tafel leggen. Als die niet haalbaar is, hoor je dat vóór je betaalt.",
    "Accepteren dat een deel niet met huidbehandelingen op te lossen is, en dat gewoon benoemen.",
  ],
  niet: [
    "Wachten tot het je echt begint te storen. De sporen die je nu niet ziet lopen al wel.",
    "Een behandelpakket kopen zonder nulmeting. Dan is achteraf niet vast te stellen of het iets deed.",
    "Meerdere agressieve behandelingen kort na elkaar. Een geïrriteerde huid maakt méér pigment aan, geen minder.",
    "Sturen op een leeftijd in plaats van op een huid. Twee mensen van vijftig hebben zelden hetzelfde nodig.",
    "Denken dat een dure crème hetzelfde doet als bescherming. Dat is de duurste manier om niets te doen.",
  ],
} as const;

export const VEROUDERING_WIJ_DOEN_NIET = [
  {
    titel: "Geen jaren terug",
    tekst:
      "Wij zeggen niet hoeveel jaar jonger je eruit gaat zien, want dat is niet te meten en dus niet te beloven. We laten je zien wat er in kleur en structuur veranderde, met de meting ernaast.",
  },
  {
    titel: "Geen volume",
    tekst:
      "Wij behandelen huid. Injectables en volumeopbouw doen we niet, ook niet als je erom vraagt. Dat is geen bescheidenheid maar een grens: het hoort bij een arts.",
  },
  {
    titel: "Geen preventieve pakketten op je twintigste",
    tekst:
      "Een gezonde huid van vijfentwintig heeft geen serie behandelingen nodig. Wie je die verkoopt, verkoopt je iets waar je nog niets aan hebt.",
  },
  {
    titel: "Geen behandeling in een huid die net veel zon had",
    tekst:
      "Direct na een zonvakantie behandelen geeft een grotere kans op nieuwe pigmentvlekken. Dan wachten we, ook als dat je afspraak verzet. [MEDISCHE-CHECK-ROJDA]",
  },
] as const;

export const VEROUDERING_FAQ = [
  {
    vraag: "Vanaf welke leeftijd is dit zinvol?",
    antwoord:
      "Er is geen leeftijd waarop het begint. Er is wel een moment waarop meten zinvol wordt, en dat is zodra je iets wilt veranderen. Zonder beginpunt weet je later niet of het werkte.",
  },
  {
    vraag: "Kan ik zonschade van vroeger nog terugdraaien?",
    antwoord:
      "Deels. Kleur en structuur zijn goed te verbeteren, en dat is precies wat mensen in de spiegel als 'ouder' benoemen. Wat weg is aan volume komt niet terug, en dat zeggen we liever nu dan na vier sessies.",
  },
  {
    vraag: "Waarom beginnen jullie niet meteen met laser?",
    antwoord:
      "Omdat we eerst willen weten waar we naar kijken. Dezelfde lijn kan uitdroging zijn of ingesleten zonschade, en dat vraagt iets anders. De meting kost je één afspraak en bespaart meestal meer.",
  },
  {
    vraag: "Mijn huid is donker. Geldt dit ook voor mij?",
    antwoord:
      "Ja, maar anders. Een donkere huid vertoont minder snel lijntjes en meer pigmentverschuiving, en reageert feller op te agressieve behandeling. De instellingen en de volgorde zijn daarom anders. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Hoe lang houdt het resultaat aan?",
    antwoord:
      "Zolang de oorzaak niet doorloopt. Zonder bescherming bouwt de zonschade gewoon verder en dan zie je hetzelfde terugkomen. Met bescherming houdt het aanzienlijk langer, al is 'aanzienlijk' geen getal dat we hard kunnen maken. [GEGEVEN-NODIG]",
  },
  {
    vraag: "Wat kost dit?",
    antwoord:
      "[PRIJS-NODIG] De nulmeting en het advies staan los van de behandeling, zodat je eerst weet wat er speelt voordat je iets afneemt.",
  },
] as const;
