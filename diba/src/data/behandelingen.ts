/**
 * De behandelingen van Diba Clinics.
 *
 * ⚠ HERKOMST: overgenomen van dibaclinics.nl (augustus 2026), niet verzonnen. ⚠
 *
 * De vorige versie van dit bestand had vijf zelfbedachte behandelingen met zelfbedachte
 * prijzen. Dat klopte dus niet. Deze versie komt uit de echte site: de namen, de
 * apparatuur, de merken en de tarieven staan er zoals de kliniek ze zelf publiceert.
 *
 * Wat ik wél zelf heb toegevoegd, en wat dus langs Rojda moet:
 *
 * - De indeling in huidlagen. Dat staat nergens op hun site en het is de kapstok van de
 *   hele pagina. Het is een inschatting, geen meting.
 *   [MEDISCHE-CHECK-ROJDA]
 * - De hersteltijden. Sommige staan bij benadering op hun site, de meeste niet.
 *   [MEDISCHE-CHECK-ROJDA]
 * - De wel/niet-lijsten en de stappen, waar ik ze heb ingevuld.
 *
 * De prijzen zijn de gepubliceerde tarieven van de kliniek zelf. Waar een behandeling
 * meerdere varianten heeft staat de laagste als `prijs` en de rest in `varianten`; dat is
 * eerlijker dan een gemiddelde en het houdt de prijslijst kloppend.
 *
 * De ordenende vraag blijft dezelfde, en werkt bij achttien behandelingen nog beter dan
 * bij vijf:
 *
 *     Hoe diep komt deze behandeling, en wat kost dat aan hersteltijd?
 */

/**
 * De prijzen hieronder zijn de gepubliceerde tarieven van de kliniek zelf. Er staat dus
 * geen voorlopigheidsvlag meer bij; die hoort nu alleen nog bij de laserzones.
 *
 * Nul betekent "nog niet gevonden op de tarievenlijst" en nooit "gratis". Dat verschil
 * staat in `prijsTekst`, en het is belangrijker dan het lijkt: wie € 0 ziet staan denkt
 * aan een aanbieding.
 */
const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function prijsTekst(bedrag: number): string {
  return bedrag === 0 ? "Op aanvraag" : euro.format(bedrag);
}

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
    zin: "Hier begint het bindweefsel. Wat je hier raakt, herstelt met opbouw.",
  },
  {
    id: "lederhuid-diep",
    naam: "Diepe lederhuid",
    zin: "Haarwortels, vaten en de stevigheid van je huid. Diep werken vraagt om een reden.",
  },
] as const;

export type HuidlaagId = (typeof HUIDLAGEN)[number]["id"];

/**
 * Hoeveel van de doorsnede elke laag beslaat, in procenten.
 *
 * Dit staat hier en niet in een component, omdat drie plekken dezelfde schaal gebruiken:
 * het werkingsvenster op de apparatuurpagina's, de vergelijkingsas op het overzicht en de
 * behandelpagina's. Zodra die uit elkaar lopen is vergelijken een truc geworden.
 *
 * De verhoudingen zijn schematisch en niet anatomisch exact. [MEDISCHE-CHECK-ROJDA]
 */
export const LAAGAANDEEL = [9.5, 20, 29.5, 41] as const;

/**
 * De onderkant van de diepste laag die geraakt wordt, als percentage van de doorsnede.
 *
 * Een behandeling erft niet de maximale diepte van het apparaat waar hij op draait. De
 * Fotona haalt vijfentachtig procent, maar dat betekent niet dat elke behandeling erop
 * zo diep gaat. Wat een behandeling raakt staat in haar eigen `lagen`, en dat is wat
 * hier geteld wordt.
 */
export function diepteVanLagen(lagen: readonly HuidlaagId[]): number {
  if (lagen.length === 0) return 0;
  const diepste = HUIDLAGEN.reduce(
    (tot, laag, i) => (lagen.includes(laag.id) ? i : tot),
    -1,
  );
  if (diepste < 0) return 0;
  return LAAGAANDEEL.slice(0, diepste + 1).reduce((s, d) => s + d, 0);
}

/** Waar een behandeling voor gemaakt is. Stuurt de groepen op het overzicht. */
export const CATEGORIEEN = [
  { id: "meting", label: "Meten", zin: "Eerst kijken, nog niets doen." },
  {
    id: "gezicht",
    label: "Gezichtsbehandelingen",
    zin: "Reinigen, hydrateren, oppervlakkig vernieuwen.",
  },
  {
    id: "peeling",
    label: "Peelings",
    zin: "De bovenlaag sneller laten vernieuwen.",
  },
  {
    id: "needling",
    label: "Microneedling",
    zin: "Herstel op gang brengen in het bindweefsel.",
  },
  {
    id: "injectie",
    label: "Skinboosters",
    zin: "Werkzame stoffen precies op diepte brengen.",
  },
  {
    id: "laser",
    label: "Laser en licht",
    zin: "Mikken op kleur, vaten of structuur.",
  },
  {
    id: "pigment",
    label: "Pigmenttrajecten",
    zin: "Maanden werk aan hardnekkig pigment.",
  },
  {
    id: "ontharing",
    label: "Laserontharing",
    zin: "De haarwortel uitschakelen.",
  },
  {
    id: "overig",
    label: "Overig",
    zin: "Wat er verder in de kliniek gebeurt.",
  },
] as const;

export type CategorieId = (typeof CATEGORIEEN)[number]["id"];

export type Variant = {
  readonly naam: string;
  readonly prijs: number;
  /**
   * Hoe lang je ervoor in de kliniek bent, in minuten.
   *
   * Stond nergens, terwijl dit de vraag is die bepaalt of je er een ochtend voor
   * vrij moet nemen. In minuten en niet als tekst, zodat er later mee te rekenen
   * valt en de agenda erop kan aansluiten.
   *
   * Voorlopige waarden. [GEGEVEN-NODIG: bevestiging van de behandelduur, Okan]
   */
  readonly duurMinuten?: number;
  readonly bij?: string;
};

export type Behandeling = {
  readonly slug: string;
  readonly naam: string;
  /** Het apparaat of merk waar de kliniek mee werkt, als dat bekend is. */
  readonly apparaat?: string;
  readonly categorie: CategorieId;
  /** Eén regel die zegt wat het is. Verschijnt op de kaart in het overzicht. */
  readonly kort: string;
  /** De lagen die deze behandeling bereikt, van ondiep naar diep. */
  readonly lagen: readonly HuidlaagId[];
  readonly werking: string;
  /** Wat je erna merkt, en hoe lang. De prijs die niemand op een prijslijst zet. */
  readonly herstel: string;
  readonly sessies: string;
  /** Laagste gepubliceerde tarief, in hele euro's. */
  readonly prijs: number;
  /**
   * Hoe lang je ervoor in de kliniek bent, in minuten.
   *
   * Stond nergens, terwijl dit de vraag is die bepaalt of je er een ochtend voor vrij
   * moet nemen. In minuten en niet als tekst, zodat er later mee te rekenen valt en de
   * agenda erop kan aansluiten.
   *
   * Voorlopige waarden. [GEGEVEN-NODIG: bevestiging van de behandelduur, Okan]
   */
  readonly duurMinuten?: number;
  /** De varianten zoals ze op de tarievenlijst staan. */
  readonly varianten?: readonly Variant[];
  readonly wel?: readonly string[];
  readonly niet?: readonly string[];
  readonly stappen?: readonly { readonly kop: string; readonly zin: string }[];
  readonly bijProblemen?: readonly {
    readonly label: string;
    readonly href: string;
  }[];
  readonly faq?: readonly {
    readonly vraag: string;
    readonly antwoord: string;
  }[];
};

export const BEHANDELINGEN: readonly Behandeling[] = [
  /* ── Meten ─────────────────────────────────────────────────────────────── */
  {
    slug: "huidanalyse",
    naam: "Consult met Eve-M huidanalyse",
    apparaat: "Eve-M",
    categorie: "meting",
    kort: "De nulmeting. De enige afspraak waarbij er niets aan je huid gebeurt.",
    lagen: [],
    werking:
      "De Eve-M brengt de conditie van je huid in kaart en maakt zichtbaar wat met het blote oog niet altijd te zien is: beginnende pigmentatie, vochttekort, poriestructuur en tekenen van huidveroudering. Verschillende huidlagen worden geanalyseerd. Daarna volgt advies en een behandelplan, en de meting wordt herhaald om voortgang objectief zichtbaar te maken. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Geen. Je loopt hier weg zoals je binnenkwam.",
    sessies: "Eén keer aan het begin, daarna bij elke controle opnieuw",
    prijs: 50,
    varianten: [
      { naam: "Consult gelaat", prijs: 50 },
      { naam: "Consult lichaam", prijs: 50 },
      { naam: "Consult laserontharen", prijs: 50 },
    ],
    wel: [
      "Legt vast wat er nu is, op een manier die over maanden nog vergelijkbaar is",
      "Laat verschil zien tussen wat je ziet en wat er meetbaar aan de hand is",
      "Geeft de basis waar een behandelplan op gebouwd wordt",
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
        zin: "Zelfde lamp, zelfde afstand, zelfde stand. Dat maakt vergelijken mogelijk.",
      },
      {
        kop: "Samen kijken",
        zin: "Je ziet hetzelfde scherm als wij, ook als het meevalt.",
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
    ],
    duurMinuten: 45,
  },

  /* ── Gezichtsbehandelingen ─────────────────────────────────────────────── */
  {
    slug: "hydrafacial",
    naam: "HydraFacial",
    apparaat: "HydraFacial",
    categorie: "gezicht",
    kort: "Reinigen, exfoliëren en hydrateren in één doorloop. Direct zichtbaar, geen hersteltijd.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "Een apparaat dat in één behandeling reinigt, de bovenste laag losmaakt, poriën leegzuigt en er daarna werkzame stoffen in brengt. Het blijft aan de oppervlakte, en juist daarom zie je het meteen en merk je er verder niets van. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Geen. Je kunt er direct mee de deur uit.",
    sessies:
      "Los te doen, of maandelijks als onderhoud. Een startreeks is meestal drie tot zes. [MEDISCHE-CHECK-ROJDA]",
    prijs: 170,
    varianten: [
      { naam: "Signature", prijs: 170 },
      { naam: "Deluxe", prijs: 190 },
      { naam: "Platinum", prijs: 220 },
    ],
    wel: [
      "Maakt de huid meteen schoner, gladder en frisser",
      "Werkt op verstopte poriën en een doffe huid",
      "Is te combineren met een peeling of microneedling",
    ],
    niet: [
      "Bereikt geen littekens of pigment dat dieper zit",
      "Houdt niet vanzelf aan; het is onderhoud, geen behandeltraject",
      "Doet niets aan haargroei",
    ],
    bijProblemen: [
      { label: "Poriën", href: "/huidproblemen/porien" },
      { label: "Droge huid", href: "/huidproblemen/droge-huid" },
    ],
    duurMinuten: 60,
  },
  {
    slug: "oxygeneo",
    naam: "OxyGeneo Glow",
    apparaat: "OxyGeneo",
    categorie: "gezicht",
    kort: "Exfoliëren en zuurstof in de huid brengen, in één behandeling.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "Een gezichtsbehandeling die de bovenste laag losmaakt en tegelijk werkzame stoffen inbrengt, waarbij er in de huid zelf zuurstof vrijkomt. Oppervlakkig werk met direct resultaat. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Geen.",
    sessies:
      "Los, of als onderhoud elke vier tot zes weken. [MEDISCHE-CHECK-ROJDA]",
    prijs: 150,
    wel: [
      "Maakt de bovenste laag los en brengt in dezelfde beweging werkzame stoffen in",
      "Laat je huid er meteen na afloop frisser en egaler uitzien",
      "Past vlak voor een gelegenheid, want er is geen dag waarop je binnen moet blijven",
    ],
    niet: [
      "Komt niet dieper dan de bovenste lagen. Wat in de lederhuid speelt blijft daar [MEDISCHE-CHECK-ROJDA]",
      "Haalt geen littekens, diepe rimpels of pigment weg. Daar is dit niet het gereedschap voor",
      "Houdt niet vanzelf aan. Eén keer glow is één keer glow, geen verandering in je huid",
    ],
    stappen: [
      {
        kop: "Eerst schoon",
        zin: "Make-up en talg eraf. Anders werkt de rest op een laagje in plaats van op je huid.",
      },
      {
        kop: "Losmaken en inbrengen",
        zin: "De kop gaat over je huid en doet twee dingen tegelijk: de bovenste laag los, de stoffen erin.",
      },
      {
        kop: "Meteen weer de deur uit",
        zin: "Je huid is kort roze en dat trekt binnen een uur weg. Make-up mag dezelfde dag.",
      },
    ],
    faq: [
      {
        vraag: "Hoe lang zie ik er iets van?",
        antwoord:
          "Dagen, geen weken. Dit is een opfrisser en geen kuur, en dat is precies waarom hij vaak vlak voor iets gepland wordt. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Kan dit bij een gevoelige huid?",
        antwoord:
          "Meestal wel, en dat bepalen we in de intake en niet op deze pagina. Bij actieve rosacea of ontstoken acne kijken we eerst naar de rust in je huid. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    bijProblemen: [
      { label: "Droge huid", href: "/huidproblemen/droge-huid" },
      { label: "Grove poriën", href: "/huidproblemen/porien" },
    ],
    duurMinuten: 60,
  },
  {
    slug: "dermaplaning",
    naam: "Dermaplaning",
    categorie: "gezicht",
    kort: "Dode huidcellen en donshaartjes weg met een mesje. Geen zuren, dus ook bij een gevoelige huid.",
    lagen: ["hoornlaag"],
    werking:
      "Dode huidcellen en donshaartjes worden verwijderd met een chirurgisch mesje, onder een hoek van 45 graden. Er komen geen zuren aan te pas, waardoor het ook kan bij een gevoelige, droge of allergische huid en tijdens de zwangerschap. Het is pijnloos en het resultaat is meteen zichtbaar. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Geen.",
    sessies:
      "Los, of elke vier tot zes weken als onderhoud. [MEDISCHE-CHECK-ROJDA]",
    prijs: 150,
    wel: [
      "Geeft direct een gladde, egale huid",
      "Kan bij een huid die chemische exfoliatie niet verdraagt",
      "Is te combineren met bijna elke andere behandeling",
    ],
    niet: [
      "Werkt alleen op de buitenste laag",
      "Doet niets aan pigment of littekens dieper in de huid",
      "Is geen ontharing; de donshaartjes komen terug",
    ],
    bijProblemen: [
      { label: "Droge huid", href: "/huidproblemen/droge-huid" },
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },
    ],
    duurMinuten: 45,
  },
  {
    slug: "coolift",
    naam: "CooLift Cryo Therapy",
    apparaat: "CooLifting",
    categorie: "gezicht",
    kort: "Vijf minuten, koude CO2 onder hoge druk. Direct strakker aanvoelen.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "Een CO2-straal van min twintig graden wordt onder hoge druk op de huid geschoten, samen met een hoge concentratie werkzame stoffen zoals hyaluronzuur en peptiden. De kou laat de vaatjes samentrekken en daarna weer uitzetten; de combinatie met de druk brengt de stoffen dieper. De behandeling duurt vijf minuten. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Geen.",
    sessies:
      "Los, vaak vlak voor een gelegenheid. Als kuur meestal vier tot zes. [MEDISCHE-CHECK-ROJDA]",
    prijs: 75,
    wel: [
      "Laat je huid binnen vijf minuten strakker aanvoelen door de kou en de druk",
      "Brengt werkzame stoffen mee naar binnen zonder dat er een naald aan te pas komt",
      "Kan direct voor een afspraak of gelegenheid, want er is niets aan je te zien",
    ],
    niet: [
      "Verandert niets aan je huid op de lange duur. Het effect is tijdelijk en dat is de hele afspraak [MEDISCHE-CHECK-ROJDA]",
      "Maakt geen collageen aan zoals naalden of laser dat doen",
      "Doet niets aan pigment, littekens of rimpels die er al zijn",
    ],
    stappen: [
      {
        kop: "Vijf minuten",
        zin: "Korter dan de tijd die je kwijt bent aan parkeren. Dat is geen verkooppraatje maar de hele behandelduur.",
      },
      {
        kop: "Koude straal",
        zin: "De CO2 komt er onder druk uit en dat voelt koud en stevig. Onaangenaam is het niet, verrassend wel.",
      },
      {
        kop: "Direct verder",
        zin: "Geen roodheid om te verbergen, geen dag om vrij te nemen.",
      },
    ],
    faq: [
      {
        vraag: "Hoe lang houdt het aan?",
        antwoord:
          "Een dag tot enkele dagen, en dat verschilt per huid. Wie iets blijvends wil, zit bij dit apparaat verkeerd en dat zeggen we liever nu dan achteraf. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Waarom staat er geen prijs bij?",
        antwoord:
          "Vijf minuten werk, en dat zie je terug in het tarief. Het staat op de prijzenpagina en niet pas aan de balie. [PRIJS-NODIG: bevestiging van het bedrag]",
      },
    ],
    bijProblemen: [
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },
    ],
    duurMinuten: 20,
  },

  /* ── Peelings ──────────────────────────────────────────────────────────── */
  {
    slug: "peelings",
    naam: "Medische peelings",
    apparaat: "Mesoestetic, Dermaceutic, Image Skincare, Skin Tech Pharma",
    categorie: "peeling",
    kort: "Van licht tot stevig. De sterkte bepaalt hoe diep het gaat en hoeveel je vervelt.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "Een peeling maakt de verbinding tussen de buitenste huidcellen los, zodat die laag sneller wordt vervangen dan hij uit zichzelf zou doen. Hoe ver dat gaat hangt af van het middel en de sterkte: de kliniek werkt met peelings van Skin Tech Pharma, Image Skincare, ADO en Mesoestetic, in drie niveaus. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Twee tot vijf dagen droog en schilferig, afhankelijk van de sterkte. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Meestal een reeks van vier tot zes, met twee tot vier weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 140,
    varianten: [
      { naam: "Mesoestetic peeling", prijs: 140 },
      { naam: "Kruidenpeeling", prijs: 150 },
      { naam: "TCA Dermaceutic 12 tot 20%", prijs: 180 },
      { naam: "Mesoestetic peeling rug", prijs: 160 },
      { naam: "Kruidenpeeling rug", prijs: 200 },
    ],
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
        kop: "Huid beoordelen",
        zin: "De sterkte wordt op je huid van vandaag gekozen.",
      },
      {
        kop: "Aanbrengen en tijd bewaken",
        zin: "De inwerktijd is het middel. Te lang is niet beter maar schadelijker.",
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
    duurMinuten: 45,
  },

  /* ── Microneedling ─────────────────────────────────────────────────────── */
  {
    slug: "skinpen",
    naam: "SkinPen microneedling",
    apparaat: "SkinPen CIT",
    categorie: "needling",
    kort: "Medisch gecertificeerd microneedlen. Werkt langzaam, op de laag waar structuur zit.",
    lagen: ["opperhuid", "lederhuid-boven"],
    werking:
      "Met fijne naalden worden heel veel kleine kanaaltjes tot in de bovenste lederhuid gemaakt. Daar zit het bindweefsel, en de huid reageert daarop met herstel en collageenaanmaak. Dat herstel is het doel; de prikjes zelf zijn alleen de aanleiding. Daarom duurt het weken voor je iets ziet en niet dagen. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Eén tot drie dagen rood, als een stevige zonnegloed. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Een reeks van drie tot zes, met vier tot zes weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 180,
    varianten: [
      { naam: "Gezicht", prijs: 180 },
      { naam: "Gezicht en hals", prijs: 210 },
      { naam: "Gezicht, hals en décolleté", prijs: 240 },
      { naam: "Rug", prijs: 255 },
    ],
    wel: [
      "Werkt op littekens die door verlies van structuur zijn ontstaan",
      "Maakt fijne lijntjes en ongelijke textuur minder scherp",
      "Bereikt de laag waar een peeling niet komt",
    ],
    niet: [
      "Doet niets aan kleur op zichzelf",
      "Werkt niet in één keer; een enkele sessie is geen halve behandeling maar geen behandeling",
      "Is niet geschikt bij actieve ontsteking [MEDISCHE-CHECK-ROJDA]",
    ],
    stappen: [
      {
        kop: "Verdoven en afdekken",
        zin: "Een verdovende crème krijgt tijd om te werken. Dat wachten hoort erbij.",
      },
      {
        kop: "Behandelen per zone",
        zin: "De diepte wordt per zone gekozen. Rond de ogen is de huid dunner.",
      },
      {
        kop: "Rust geven",
        zin: "Daarna niets erop wat er niet op hoeft. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    bijProblemen: [
      { label: "Littekens en striae", href: "/huidproblemen/littekens" },
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },
      { label: "Poriën", href: "/huidproblemen/porien" },
    ],
    duurMinuten: 75,
  },
  {
    slug: "dermapen-4",
    naam: "Dermapen 4",
    apparaat: "Dermapen 4",
    categorie: "needling",
    kort: "Microneedling met trillende naaldjes. Zelfde principe, ander apparaat.",
    lagen: ["opperhuid", "lederhuid-boven"],
    werking:
      "Een microneedlingapparaat dat met minuscule, trillende naaldjes microscopisch kleine kanaaltjes in de huid maakt om het natuurlijke herstelproces te stimuleren. Dat stimuleert de collageenaanmaak, waardoor de huid steviger, gladder en egaler wordt. Werkt op fijne lijntjes, acnelittekens, grove poriën en een doffe huid. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Eén tot drie dagen rood. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Een reeks van drie tot zes, met vier tot zes weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 180,
    varianten: [
      { naam: "Gezicht", prijs: 180 },
      { naam: "Gezicht en hals", prijs: 210 },
      { naam: "Gezicht, hals en décolleté", prijs: 240 },
      { naam: "Rug", prijs: 255 },
    ],
    bijProblemen: [
      { label: "Littekens en striae", href: "/huidproblemen/littekens" },
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },
    ],
    wel: [
      "Maakt kanaaltjes in de huid die je eigen herstel op gang brengen [MEDISCHE-CHECK-ROJDA]",
      "Werkt op fijne lijntjes, acnelittekens, grove poriën en een doffe structuur",
      "Komt met trillende naaldjes gelijkmatiger door de huid dan met een rollende beweging",
    ],
    niet: [
      "Werkt niet in één sessie. Wat je na één keer ziet is zwelling en geen resultaat",
      "Haalt geen diepe of ingetrokken littekens helemaal weg [MEDISCHE-CHECK-ROJDA]",
      "Past niet op een huid met actieve ontsteking. Dan gaat rust eerst",
    ],
    stappen: [
      {
        kop: "Verdovende crème",
        zin: "Die trekt een half uur in. Zonder is het te scherp en met is het goed te doen.",
      },
      {
        kop: "Het werk zelf",
        zin: "Per zone, met een vaste diepte-instelling. Je hoort het apparaat meer dan dat je het voelt.",
      },
      {
        kop: "Rood naar huis",
        zin: "Eén tot drie dagen, alsof je te lang in de zon hebt gezeten. Make-up de eerste dag niet.",
      },
    ],
    faq: [
      {
        vraag: "Wanneer zie ik er iets van?",
        antwoord:
          "Niet meteen. Collageenopbouw kost weken, dus wat je na de eerste sessie ziet is herstel en niet resultaat. Daarom meten we vooraf: anders vergelijk je met een herinnering. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Wat is het verschil met de SkinPen?",
        antwoord:
          "Het principe is hetzelfde en het apparaat is anders. Welke van de twee bij je past hangt af van je huid en de zone, en dat bepalen we in de intake.",
      },
    ],
    duurMinuten: 75,
  },

  /* ── Skinboosters ──────────────────────────────────────────────────────── */
  {
    slug: "skinboosters",
    naam: "Skinboosters en mesotherapie",
    apparaat: "U225 intradermale injector",
    categorie: "injectie",
    kort: "Werkzame stoffen precies op diepte, met een injector die niet met de hand meebeweegt.",
    lagen: ["lederhuid-boven"],
    werking:
      "Bij mesotherapie worden werkzame stoffen direct in de huid gebracht in plaats van erop. De U225 doet dat automatisch en regelmatig; de naald zit los van de spuit gemonteerd, wat de precisie van de toediening verbetert. Er zijn verschillende skinboosters: voor fijne lijnen, en een depigmentatiebooster voor gezicht, hals en décolleté bij hyperpigmentatie, zonneschade en melasma. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Kort rood en soms kleine bultjes, meestal binnen een dag weg. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Vaak een kuur van drie, met twee tot vier weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 175,
    varianten: [
      { naam: "Skinbooster los", prijs: 180 },
      { naam: "RRS hyalift mini filler booster", prijs: 175 },
      { naam: "Kuur van drie", prijs: 500 },
      { naam: "RRS Eyes", prijs: 130 },
      { naam: "RRS Eyes kuur van drie", prijs: 350 },
    ],
    bijProblemen: [
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },
      { label: "Melasma", href: "/huidproblemen/melasma" },
      { label: "Donkere kringen", href: "/huidproblemen/donkere-kringen" },
    ],
    wel: [
      "Brengt werkzame stoffen ín de huid in plaats van erop",
      "Zet de naald op een vaste diepte, zodat het niet per plek verschilt",
      "Heeft een aparte booster voor pigment, zonneschade en melasma [MEDISCHE-CHECK-ROJDA]",
    ],
    niet: [
      "Is geen filler. Er wordt niets opgevuld en er verandert niets aan je vorm",
      "Werkt niet na één keer. Dit is een kuur en zo staat hij ook geprijsd",
      "Doet niets aan huid die vooral zon nodig heeft te mijden. Zonder bescherming loopt pigment gewoon door",
    ],
    stappen: [
      {
        kop: "Kiezen welke booster",
        zin: "Voor fijne lijnen of voor pigment. Dat is niet dezelfde vloeistof en niet hetzelfde doel.",
      },
      {
        kop: "De injector",
        zin: "De naald zit los van de spuit gemonteerd en beweegt dus niet met de hand mee. Dat is het hele voordeel van dit apparaat.",
      },
      {
        kop: "Kort rood",
        zin: "Soms kleine bultjes waar de naald ging. Meestal binnen een dag weg.",
      },
    ],
    faq: [
      {
        vraag: "Waarom een kuur van drie?",
        antwoord:
          "Omdat de huid tussen de sessies door het werk doet. Eén sessie is één prikkel en daar bouwt een huid niets van op. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Is het pijnlijk?",
        antwoord:
          "Het voelt als een reeks korte prikjes en het gaat snel. Rond de ogen is het gevoeliger dan op de wang.",
      },
    ],
    duurMinuten: 45,
  },

  /* ── Laser en licht ────────────────────────────────────────────────────── */
  {
    slug: "fotona",
    naam: "Fotona TimeWalker",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Laser die van binnenuit en van buitenaf werkt. Van laserpeel tot een complete 4D-lift.",
    lagen: ["opperhuid", "lederhuid-boven", "lederhuid-diep"],
    werking:
      "Naarmate de huid veroudert wordt die slapper en minder elastisch. De Fotona TimeWalker pakt dat aan met verschillende gespecialiseerde laserbehandelingen die elk op één probleem mikken: 4D Lift voor een complete lifting van binnen én buiten, VectorLift voor de wenkbrauw- en oogregio, SmoothEye voor de oogcontour en LipLase voor lipvolume. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Van een paar uur rood tot enkele dagen, afhankelijk van de behandeling. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Los of als kuur van drie, met vier tot zes weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 150,
    varianten: [
      { naam: "SmoothEye", prijs: 150 },
      { naam: "LipLase", prijs: 150 },
      { naam: "VectorLift", prijs: 150 },
      { naam: "Laserpeel gelaat", prijs: 170 },
      { naam: "Full Face Brushing", prijs: 170 },
      { naam: "Fractional laser", prijs: 195 },
      { naam: "Fotona 4D", prijs: 370 },
      { naam: "Fotona 4D Full Package", prijs: 575 },
      { naam: "Fotona 4D kuur van drie", prijs: 995 },
    ],
    bijProblemen: [
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },
      { label: "Littekens en striae", href: "/huidproblemen/littekens" },
    ],
    wel: [
      "Werkt in meerdere richtingen: van binnenuit via de mond en van buitenaf op de huid",
      "Heeft per gebied een eigen behandeling, van oogcontour tot lippen tot het hele gelaat",
      "Kan zonder naalden en zonder snijden [MEDISCHE-CHECK-ROJDA]",
    ],
    niet: [
      "Vervangt geen chirurgie. Wat losgelaten huid is, wordt hier niet vastgezet [MEDISCHE-CHECK-ROJDA]",
      "Geeft geen vaste uitkomst. Hoeveel je huid opbouwt hangt van je huid af en niet van het apparaat",
      "Is niet één behandeling. De naam Fotona zegt nog niets over wat je krijgt; de instelling en de zone doen dat",
    ],
    stappen: [
      {
        kop: "Vaststellen wat je krijgt",
        zin: "4D, VectorLift, SmoothEye of LipLase zijn verschillende behandelingen op hetzelfde apparaat. Die keuze valt in de intake.",
      },
      {
        kop: "Laag voor laag",
        zin: "Bij de 4D wordt er in meerdere doorgangen gewerkt, elk op een andere diepte.",
      },
      {
        kop: "Warm en rood",
        zin: "Van een paar uur tot enkele dagen, afhankelijk van welke behandeling je kreeg.",
      },
    ],
    faq: [
      {
        vraag: "Waarom lopen de prijzen zo uiteen?",
        antwoord:
          "Omdat het geen prijzen voor één behandeling zijn maar voor verschillende. Een laserpeel is iets anders dan een volledige 4D, en dat staat per regel apart.",
      },
      {
        vraag: "Hoeveel sessies heb ik nodig?",
        antwoord:
          "Dat hoor je na de meting. Wat we niet doen is vooraf een aantal noemen dat we niet kunnen onderbouwen. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    duurMinuten: 75,
  },
  {
    slug: "nordlys-ipl",
    naam: "Nordlys IPL",
    apparaat: "Nordlys",
    categorie: "laser",
    kort: "Breed licht op roodheid, vaatjes en pigment. Minimale hersteltijd.",
    lagen: ["opperhuid", "lederhuid-boven"],
    werking:
      "IPL stuurt geen enkele golflengte de huid in maar een bereik, met een filter dat het grofste eruit haalt. Daardoor raakt het meerdere doelen tegelijk: roodheid, zichtbare vaatjes en oppervlakkig pigment. Het komt gemiddeld minder diep dan een laser, en dat is soms precies wat je wil. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Meestal een paar uur rood. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Een reeks van drie tot zes, met vier weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 75,
    varianten: [
      { naam: "Neus", prijs: 75 },
      { naam: "Wangen", prijs: 150 },
      { naam: "Wangen, neus en kin", prijs: 200 },
      { naam: "Hele gelaat", prijs: 250 },
    ],
    wel: [
      "Behandelt een groot vlak in korte tijd",
      "Werkt op oppervlakkige roodheid en oppervlakkig pigment",
      "Is een goede keuze als het doel breed is en niet één plekje",
    ],
    niet: [
      "Is minder precies dan een laser met één golflengte",
      "Bereikt niet wat diep zit",
      "Is niet voor elk huidtype geschikt [MEDISCHE-CHECK-ROJDA]",
    ],
    bijProblemen: [
      { label: "Rosacea", href: "/huidproblemen/rosacea" },
      { label: "Pigmentvlekken", href: "/huidproblemen/pigmentvlekken" },
    ],
    duurMinuten: 45,
  },
  {
    slug: "lumi-8-led",
    naam: "Lumi 8 LED",
    apparaat: "Lumi 8",
    categorie: "laser",
    kort: "LED-licht zonder naalden of zuren. Wordt meestal als toevoeging gedaan.",
    lagen: ["opperhuid"],
    werking:
      "Een niet-invasief LED-toestel met rood, geel en bijna-infrarood licht, in een gepatenteerde pulscyclus. Die wisselende pulsen voorkomen dat de huid aan de lichtenergie went. Wordt ingezet bij roodheid en rosacea en bij fijne lijntjes. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Geen.",
    sessies: "Meestal als toevoeging bij een andere behandeling",
    prijs: 30,
    bijProblemen: [{ label: "Rosacea", href: "/huidproblemen/rosacea" }],
    wel: [
      "Werkt zonder naalden, zuren of hersteltijd",
      "Wordt ingezet bij roodheid, rosacea en fijne lijntjes [MEDISCHE-CHECK-ROJDA]",
      "Wisselt de pulsen af, zodat de huid niet aan het licht went",
    ],
    niet: [
      "Doet weinig als losse behandeling. Dit is een toevoeging en zo verkopen we het ook",
      "Verwijdert niets. Geen pigment, geen vaatjes, geen littekens",
      "Werkt niet in één keer. Licht is een prikkel die je herhaalt of het doet niets [MEDISCHE-CHECK-ROJDA]",
    ],
    stappen: [
      {
        kop: "Na de hoofdbehandeling",
        zin: "Meestal aansluitend, terwijl je toch al ligt.",
      },
      {
        kop: "Onder de lamp",
        zin: "Ogen dicht, licht aan. Je voelt er niets van, hooguit lichte warmte.",
      },
      {
        kop: "Klaar",
        zin: "Geen roodheid, geen wachttijd, geen instructies voor thuis.",
      },
    ],
    faq: [
      {
        vraag: "Waarom is dit zo goedkoop?",
        antwoord:
          "Omdat het weinig tijd kost en meestal aan iets anders wordt toegevoegd. Een lage prijs betekent hier ook een bescheiden effect, en dat hoort erbij.",
      },
      {
        vraag: "Kan ik alleen hiervoor komen?",
        antwoord:
          "Dat kan, maar dan is de vraag of het je rit waard is. We zeggen liever dat het als toevoeging tot zijn recht komt.",
      },
    ],
    duurMinuten: 20,
  },

  /* ── Pigmenttrajecten ──────────────────────────────────────────────────── */
  {
    slug: "cosmelan-dermamelan",
    naam: "Cosmelan en Dermamelan",
    apparaat: "Mesoestetic",
    categorie: "pigment",
    kort: "Een traject van maanden tegen hyperpigmentatie en melasma. Geen losse behandeling.",
    lagen: ["opperhuid"],
    werking:
      "Cosmelan is een behandeltraject van zes maanden. Het begint met twee weken voorbereiding thuis met specifieke producten, daarna volgt de behandeling in de praktijk en een vaste huidverzorgingsroutine. De specialist bepaalt welke van de twee bij jouw indicatie past. Zon, hormonen, zwangerschap en genen bepalen mee waarom pigment ontstaat, en daarom is het thuiswerk geen bijzaak. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Vervellen en roodheid in de eerste dagen, en maandenlang strikte zonbescherming. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Eén traject van ongeveer zes maanden",
    prijs: 550,
    varianten: [
      { naam: "Cosmelan traject inclusief producten", prijs: 720 },
      { naam: "Dermamelan traject inclusief producten", prijs: 920 },
      { naam: "Dermamelan Intimate", prijs: 550 },
    ],
    niet: [
      "Is geen losse behandeling. Zonder het thuiswerk werkt het niet",
      "Geeft geen garantie dat pigment wegblijft; zon brengt het terug",
      "Is niet geschikt voor iedereen [MEDISCHE-CHECK-ROJDA]",
    ],
    bijProblemen: [
      { label: "Melasma", href: "/huidproblemen/melasma" },
      { label: "Pigmentvlekken", href: "/huidproblemen/pigmentvlekken" },
    ],
    wel: [
      "Pakt hardnekkig pigment aan waar losse behandelingen op stuklopen [MEDISCHE-CHECK-ROJDA]",
      "Loopt door thuis, want het grootste deel van dit traject gebeurt buiten de kliniek",
      "Werkt op melasma, dat bekendstaat als het lastigste soort pigment om rustig te krijgen [MEDISCHE-CHECK-ROJDA]",
    ],
    duurMinuten: 60,
  },
  {
    slug: "happy-intim",
    naam: "Happy Intim",
    apparaat: "Happy Intim®",
    categorie: "pigment",
    kort: "Peelings die pigment in de intieme zone en oksels lichter en egaler maken.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "Door hormonen, leeftijd of scheren kan de huid in het intieme gebied donkerder worden. Happy Intim werkt met chemische peelings die het pigment daar verlichten en de textuur egaler maken. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Enkele dagen droog en gevoelig. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Los of als kuur",
    prijs: 175,
    varianten: [
      { naam: "Los", prijs: 175 },
      {
        naam: "Kuur inclusief lightening crème, oksels of intieme zone",
        prijs: 300,
      },
    ],
    bijProblemen: [
      { label: "Huidverkleuring", href: "/huidproblemen/huidverkleuring" },
    ],
    wel: [
      "Maakt donkerder geworden huid in de intieme zone of oksels lichter en egaler [MEDISCHE-CHECK-ROJDA]",
      "Werkt met peelings die op deze huid zijn afgestemd en niet met een gezichtspeeling op een andere plek",
      "Kan als kuur, inclusief een crème voor thuis",
    ],
    niet: [
      "Haalt de oorzaak niet weg. Komt de verkleuring door scheren of wrijving, dan komt hij terug [MEDISCHE-CHECK-ROJDA]",
      "Maakt niets bleker dan je eigen huid. Egaler is het doel, niet lichter dan je bent",
      "Past niet bij een huid die net onthaard of geïrriteerd is. Dan wachten we",
    ],
    stappen: [
      {
        kop: "Rustige huid",
        zin: "Niet scheren of harsen in de dagen ervoor. Een geprikkelde huid reageert anders op een peeling.",
      },
      {
        kop: "De peeling",
        zin: "Kort inwerken, met tijden die per huid verschillen. Je voelt het prikken en dat hoort.",
      },
      {
        kop: "Enkele dagen droog",
        zin: "De huid schilfert licht en voelt gevoelig. Geen strakke kleding en geen sauna.",
      },
    ],
    faq: [
      {
        vraag: "Is dit gênant?",
        antwoord:
          "Het is een behandeling zoals elke andere en de deur gaat dicht. Wat er wél anders is: je bepaalt zelf hoeveel je vertelt over waarom je komt.",
      },
      {
        vraag: "Hoeveel sessies zijn er nodig?",
        antwoord:
          "Dat hangt af van hoe donker het gebied is en waar het door komt. Er staat daarom zowel een losse prijs als een kuurprijs. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    duurMinuten: 45,
  },

  /* ── Laserontharing ────────────────────────────────────────────────────── */
  {
    slug: "laserontharing",
    naam: "Laserontharing",
    apparaat: "Gentle Laser Pro-U",
    categorie: "ontharing",
    kort: "De haarwortel uitschakelen. Per zone of als pakket, voor dames en heren.",
    lagen: ["lederhuid-diep"],
    werking:
      "De laser mikt op het pigment in de haarwortel, en die zit diep. Wat de energie opneemt warmt op, de rest niet. Daarom is laser precies, en daarom moet je weten waar je op mikt. Eén sessie raakt alleen de haren die op dat moment groeien, en dat is nooit alles tegelijk. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Een paar uur rood, soms bultjes rond de haarzakjes. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Altijd een reeks, meestal zes tot tien. Het aantal hangt af van zone en huidtype. [MEDISCHE-CHECK-ROJDA]",
    prijs: 20,
    wel: [
      "Werkt op haargroei op vrijwel elke zone",
      "Is instelbaar op je huidtype",
      "Vermindert ingegroeide haren en irritatie van scheren",
    ],
    niet: [
      "Werkt niet in één sessie, en dat is geen verkooptruc maar hoe haargroei werkt",
      "Doet niets aan pigment of textuur",
      "Is niet zonder risico bij een gebruinde huid [MEDISCHE-CHECK-ROJDA]",
    ],
    bijProblemen: [
      { label: "Alle zones en prijzen", href: "/laserontharing/configurator" },
      { label: "Over laserontharing", href: "/laserontharing" },
    ],
    duurMinuten: 30,
  },

  /* ── Overig ────────────────────────────────────────────────────────────── */
  {
    slug: "xl-hair",
    naam: "XL Hair",
    apparaat: "U225 mesotherapie",
    categorie: "overig",
    kort: "Tegen haaruitval en dunner wordend haar. Een traject van maanden, geen losse sessie.",
    lagen: ["lederhuid-boven"],
    werking:
      "XL Hair stimuleert de haarzakjes en verbetert de doorbloeding van de hoofdhuid om de natuurlijke haargroei te ondersteunen. Het traject wordt afgestemd op je haarconditie en hoofdhuid, en loopt over meerdere maanden. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Kort gevoelige hoofdhuid. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Zes sessies voor mannen, acht voor vrouwen",
    prijs: 800,
    varianten: [
      { naam: "Mannen, zes behandelingen inclusief producten", prijs: 800 },
      { naam: "Mannen, zes behandelingen plus Hair Restart", prijs: 1100 },
      { naam: "Vrouwen, acht behandelingen inclusief producten", prijs: 1000 },
      { naam: "Vrouwen, acht behandelingen plus Hair Restart", prijs: 1300 },
    ],
    wel: [
      "Richt zich op de haarzakjes en de doorbloeding van de hoofdhuid [MEDISCHE-CHECK-ROJDA]",
      "Loopt over meerdere maanden, want haargroei laat zich niet versnellen",
      "Wordt afgestemd op je hoofdhuid en niet op een standaardschema",
    ],
    niet: [
      "Brengt geen haar terug op plekken waar het zakje weg is [MEDISCHE-CHECK-ROJDA]",
      "Is geen behandeling voor haaruitval met een medische oorzaak. Dat hoort bij een arts",
      "Werkt niet als je stopt. Wat je hier opbouwt houd je bij of je verliest het weer",
    ],
    stappen: [
      {
        kop: "Kijken naar je hoofdhuid",
        zin: "Waar het dunner wordt en sinds wanneer. Zonder dat vertrekpunt valt er later niets te vergelijken.",
      },
      {
        kop: "De sessies",
        zin: "Zes voor mannen, acht voor vrouwen, met weken ertussen. Dat aantal is het traject en geen richtprijs.",
      },
      {
        kop: "Thuis doorgaan",
        zin: "De producten horen bij het traject en staan in de prijs. Overslaan haalt de rest onderuit.",
      },
    ],
    faq: [
      {
        vraag: "Wanneer zie ik verschil?",
        antwoord:
          "Niet binnen weken. Haar groeit in cycli en die laten zich niet opjagen, dus dit traject wordt in maanden gemeten. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Waarom is het voor vrouwen duurder?",
        antwoord:
          "Omdat er acht sessies in zitten in plaats van zes. Het verschil zit in het aantal en niet in het tarief.",
      },
    ],
    bijProblemen: [{ label: "Alle huidproblemen", href: "/huidproblemen" }],
    duurMinuten: 45,
  },
  {
    slug: "acne-traject",
    naam: "Acnetraject",
    apparaat: "Blemiderm",
    categorie: "overig",
    kort: "Een begeleid traject voor acne, met producten en controles.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "Een traject in plaats van losse behandelingen, omdat acne een verloop heeft en geen moment. Het begint met een meting en een schema voor thuis; daarna volgen behandelingen in de kliniek met om de vier tot zes weken een controle waarin het schema wordt bijgesteld. Het eindigt met afbouwen naar wat je zelf volhoudt. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Wisselt per fase van het traject. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Een traject van drie tot zes maanden, met een controle om de vier tot zes weken. [MEDISCHE-CHECK-ROJDA]",
    prijs: 570,
    bijProblemen: [{ label: "Acne", href: "/huidproblemen/acne" }],
    wel: [
      "Volgt het verloop van acne in plaats van er één moment uit te pikken",
      "Combineert behandelingen in de kliniek met producten en controles thuis",
      "Legt bij elke controle vast wat er veranderd is, zodat je niet op je geheugen vergelijkt",
    ],
    niet: [
      "Is geen kuur met een einddatum die we vooraf beloven [MEDISCHE-CHECK-ROJDA]",
      "Vervangt geen behandeling door een arts. Bij zware of littekenvormende acne hoor je daar eerst [MEDISCHE-CHECK-ROJDA]",
      "Werkt niet als de producten thuis blijven liggen. Het grootste deel van dit traject gebeurt buiten de kliniek",
    ],
    stappen: [
      {
        kop: "Meting vooraf",
        zin: "Waar het zit, welk type en hoe je huid er nu aan toe is. Dat is het vertrekpunt.",
      },
      {
        kop: "Behandelen en bijsturen",
        zin: "Sessies in de kliniek met producten thuis, en bij elke controle kijken of het schema klopt.",
      },
      {
        kop: "Afbouwen",
        zin: "Een traject eindigt met wat je zelf volhoudt. Anders komt het terug en begint alles opnieuw.",
      },
    ],
    faq: [
      {
        vraag: "Hoe lang duurt het traject?",
        antwoord:
          "Dat staat er bewust nog niet, omdat het per huid verschilt en we geen getal noemen dat we niet waar kunnen maken. Je hoort het na de meting. [GEGEVEN-NODIG] duur van het traject in maanden",
      },
      {
        vraag: "Zit alles in de prijs?",
        antwoord:
          "In het tarief zitten de behandelingen in de kliniek, de controles en de producten voor thuis. Wat er niet in zit zijn losse behandelingen die je er tussendoor wilt, en die staan dan gewoon op de prijzenpagina. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    duurMinuten: 60,
  },
  {
    slug: "jongeren-acne-traject",
    naam: "Jongeren Acne Traject",
    categorie: "overig",
    kort: "Voor 18 jaar en jonger. Een begeleid programma van drie maanden.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "Acne op jonge leeftijd kan zwaar zijn voor je zelfvertrouwen. Hiervoor is een medisch onderbouwd programma van drie maanden met begeleiding, opgezet voor jongeren van achttien jaar en jonger. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Wisselt per fase van het traject. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Drie maanden met begeleiding",
    prijs: 450,
    bijProblemen: [{ label: "Acne", href: "/huidproblemen/acne" }],
    wel: [
      "Is opgezet voor achttien jaar en jonger, met een programma van drie maanden [MEDISCHE-CHECK-ROJDA]",
      "Werkt met begeleiding, want op die leeftijd is volhouden het lastigste deel",
      "Neemt de huid serieus zonder er een probleem van te maken dat groter is dan het is",
    ],
    niet: [
      "Belooft geen schone huid binnen drie maanden [MEDISCHE-CHECK-ROJDA]",
      "Is geen behandeling voor acne die littekens maakt. Dan gaat een arts voor [MEDISCHE-CHECK-ROJDA]",
      "Gaat niet buiten je ouders om. Onder de achttien komt er iemand mee en tekenen zij mee",
    ],
    stappen: [
      {
        kop: "Kennismaken",
        zin: "Wat je zelf al probeert en wat er tot nu toe wel en niet hielp. Dat scheelt drie maanden opnieuw uitproberen.",
      },
      {
        kop: "Drie maanden",
        zin: "Een vast schema met controles ertussen, zodat er bijgestuurd wordt voordat het misloopt.",
      },
      {
        kop: "Wat erna",
        zin: "Je gaat naar huis met iets wat je zelf kunt volhouden. Dat is het echte doel.",
      },
    ],
    faq: [
      {
        vraag: "Waarom staat er geen prijs?",
        antwoord:
          "Het traject van drie maanden staat als één bedrag op de prijzenpagina, inclusief de controles en de producten. Er komt niets bij aan de balie. [PRIJS-NODIG: bevestiging van het bedrag]",
      },
      {
        vraag: "Moet mijn ouder mee?",
        antwoord:
          "Ja. Onder de achttien is toestemming van een ouder of verzorger nodig, en bij de intake willen we die er ook bij hebben.",
      },
    ],
    duurMinuten: 60,
  },
  {
    slug: "littekentherapie",
    naam: "Littekentherapie",
    categorie: "overig",
    kort: "Voor littekens na een operatie of keizersnede. Prijs naar lengte van het litteken.",
    lagen: ["opperhuid", "lederhuid-boven"],
    werking:
      "Littekens van een operatie reageren anders dan littekens van acne: ze zijn langer, dieper en vaak jonger. De behandeling en het aantal sessies hangen af van hoe oud het litteken is en waar het zit. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Wisselt per techniek. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Meestal een reeks van drie tot zes, met vier tot zes weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 100,
    varianten: [
      { naam: "Litteken 5 tot 10 cm", prijs: 100 },
      { naam: "Litteken 10 tot 20 cm", prijs: 125 },
      { naam: "Litteken 20 tot 30 cm", prijs: 150 },
      { naam: "Keizersnedelitteken", prijs: 125 },
      { naam: "Borstcorrectie", prijs: 175 },
      { naam: "Buikwandcorrectie", prijs: 200 },
    ],
    bijProblemen: [
      { label: "Littekens en striae", href: "/huidproblemen/littekens" },
    ],
    wel: [
      "Is afgestemd op littekens van een operatie of keizersnede, die anders reageren dan acnelittekens [MEDISCHE-CHECK-ROJDA]",
      "Rekent naar de lengte van het litteken, zodat je vooraf weet waar je aan toe bent",
      "Kijkt eerst naar de leeftijd van het litteken, want dat bepaalt wat er nog te winnen valt [MEDISCHE-CHECK-ROJDA]",
    ],
    niet: [
      "Laat geen litteken verdwijnen. Een litteken is blijvend weefsel en dat verandert niet [MEDISCHE-CHECK-ROJDA]",
      "Werkt niet op een litteken dat nog aan het genezen is. Daar wachten we op",
      "Geeft geen voorspelling vooraf. Hoeveel een litteken opschuift verschilt per persoon en per plek",
    ],
    stappen: [
      {
        kop: "Kijken en meten",
        zin: "Lengte, leeftijd, kleur en of het verhoogd of ingetrokken is. Dat bepaalt zowel de techniek als het tarief.",
      },
      {
        kop: "De reeks",
        zin: "Meestal meerdere sessies met weken ertussen, want het herstel doet het werk en niet de behandeling zelf.",
      },
      {
        kop: "Vergelijken",
        zin: "Foto's onder hetzelfde licht. Bij littekens maakt de lamp het verschil groter dan de behandeling.",
      },
    ],
    faq: [
      {
        vraag: "Mijn litteken is tien jaar oud. Heeft het nog zin?",
        antwoord:
          "Soms wel en minder dan bij een jong litteken. Een oud litteken is uitgerijpt en reageert daardoor rustiger. Wat er in jouw geval te verwachten is hoor je na de meting. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Hoeveel sessies?",
        antwoord:
          "Dat hangt af van de lengte en de leeftijd van het litteken, en het staat er daarom niet als getal. [GEGEVEN-NODIG] aantal sessies per littekentype",
      },
    ],
    duurMinuten: 45,
  },
  {
    slug: "fibromen",
    naam: "Fibromen verwijderen",
    categorie: "overig",
    kort: "Steelwratjes weghalen. Per kwartier gerekend, niet per stuk.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "Fibromen zijn goedaardige huidaanhangsels die vaak in de hals, oksels of liezen zitten. Ze worden per behandelsessie weggenomen. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Kleine korstjes die in dagen verdwijnen. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Meestal één keer",
    prijs: 30,
    varianten: [{ naam: "Per kwartier", prijs: 30 }],
    wel: [
      "Haalt goedaardige steelwratjes weg, meestal in hals, oksels of liezen [MEDISCHE-CHECK-ROJDA]",
      "Rekent per kwartier, dus meerdere kleine plekjes in één keer kost niet meer per stuk",
      "Is in één afspraak klaar bij de meeste mensen",
    ],
    niet: [
      "Beoordeelt geen moedervlekken of plekjes die veranderen. Dat hoort bij de huisarts of dermatoloog [MEDISCHE-CHECK-ROJDA]",
      "Voorkomt niet dat er nieuwe komen. Wie ze aanmaakt, blijft ze aanmaken",
      "Is geen behandeling zonder spoor. Er blijft een klein plekje dat langzaam vervaagt [MEDISCHE-CHECK-ROJDA]",
    ],
    stappen: [
      {
        kop: "Eerst kijken",
        zin: "Is het een fibroom en geen ander plekje. Twijfelen we, dan sturen we je door en behandelen we niet.",
      },
      {
        kop: "Weghalen",
        zin: "Per plekje een korte handeling. Meerdere achter elkaar binnen hetzelfde kwartier.",
      },
      {
        kop: "Korstjes",
        zin: "Die vallen er in dagen vanzelf af. Niet krabben, want dan wordt het wel een litteken.",
      },
    ],
    faq: [
      {
        vraag: "Is het pijnlijk?",
        antwoord:
          "Kort en scherp per plekje, en het is snel voorbij. Bij grotere of gevoelige plekken verdoven we.",
      },
      {
        vraag: "Waarom per kwartier en niet per stuk?",
        antwoord:
          "Omdat het aantal minder uitmaakt dan de tijd. Wie er twintig kleine heeft, betaalt anders het twintigvoudige voor hetzelfde kwartier werk.",
      },
    ],
    bijProblemen: [
      {
        label: "Moedervlekken en plekjes",
        href: "/huidproblemen/moedervlekken",
      },
    ],
    duurMinuten: 15,
  },
  {
    slug: "voedingsintolerantietest",
    naam: "Voedingsintolerantietest",
    categorie: "overig",
    kort: "Een test die kijkt of voeding meespeelt. Geen huidbehandeling.",
    lagen: [],
    werking:
      "Een test die in kaart brengt op welke voedingsmiddelen je lichaam reageert. Geen behandeling van de huid zelf, maar soms een verklaring voor wat er op de huid gebeurt. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Geen.",
    sessies: "Eén keer",
    prijs: 300,
    wel: [
      "Brengt in kaart op welke voedingsmiddelen je lichaam reageert [MEDISCHE-CHECK-ROJDA]",
      "Geeft soms een verklaring voor huidklachten waar niets aan de huid zelf te vinden is",
      "Levert een uitslag die je meeneemt, ook als je verder niets bij ons doet",
    ],
    niet: [
      "Is geen allergietest en geen medische diagnose. Dat hoort bij een arts [MEDISCHE-CHECK-ROJDA]",
      "Behandelt je huid niet. Er gebeurt hier niets aan je gezicht",
      "Geeft geen garantie dat je huid opknapt als je iets weglaat [MEDISCHE-CHECK-ROJDA]",
    ],
    stappen: [
      {
        kop: "De afname",
        zin: "Eén keer, en verder hoef je niets voor te bereiden.",
      },
      {
        kop: "Wachten op de uitslag",
        zin: "De uitslag komt van het laboratorium en niet uit de behandelkamer.",
      },
      {
        kop: "Samen doornemen",
        zin: "Wat er staat en wat het niet betekent. Dat tweede is bij dit soort tests het belangrijkste deel.",
      },
    ],
    faq: [
      {
        vraag: "Wordt dit vergoed?",
        antwoord:
          "Dat verschilt per verzekeraar en per polis. Kijk bij vergoedingen wat er over jouw verzekeraar bekend is, en ga uit van wat je polis zegt en niet van wat wij zeggen.",
      },
      {
        vraag: "Wat als er niets uitkomt?",
        antwoord:
          "Dan is dat ook een uitkomst. Het sluit voeding als factor niet uit, maar het haalt hem wel van je lijstje met vermoedens af. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    bijProblemen: [
      { label: "Acne", href: "/huidproblemen/acne" },
      { label: "Rosacea", href: "/huidproblemen/rosacea" },
    ],
    duurMinuten: 20,
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
