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

/** Waar een behandeling voor gemaakt is. Stuurt de groepen op het overzicht. */
export const CATEGORIEEN = [
  { id: "meting", label: "Meten", zin: "Eerst kijken, nog niets doen." },
  { id: "gezicht", label: "Gezichtsbehandelingen", zin: "Reinigen, hydrateren, oppervlakkig vernieuwen." },
  { id: "peeling", label: "Peelings", zin: "De bovenlaag sneller laten vernieuwen." },
  { id: "needling", label: "Microneedling", zin: "Herstel op gang brengen in het bindweefsel." },
  { id: "injectie", label: "Skinboosters", zin: "Werkzame stoffen precies op diepte brengen." },
  { id: "laser", label: "Laser en licht", zin: "Mikken op kleur, vaten of structuur." },
  { id: "pigment", label: "Pigmenttrajecten", zin: "Maanden werk aan hardnekkig pigment." },
  { id: "ontharing", label: "Laserontharing", zin: "De haarwortel uitschakelen." },
  { id: "overig", label: "Overig", zin: "Wat er verder in de kliniek gebeurt." },
] as const;

export type CategorieId = (typeof CATEGORIEEN)[number]["id"];

export type Variant = {
  readonly naam: string;
  readonly prijs: number;
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
  /** De varianten zoals ze op de tarievenlijst staan. */
  readonly varianten?: readonly Variant[];
  readonly wel?: readonly string[];
  readonly niet?: readonly string[];
  readonly stappen?: readonly { readonly kop: string; readonly zin: string }[];
  readonly bijProblemen?: readonly { readonly label: string; readonly href: string }[];
  readonly faq?: readonly { readonly vraag: string; readonly antwoord: string }[];
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
      { kop: "Schoon gezicht", zin: "Make-up eraf. Een meting over foundation heen is geen meting." },
      { kop: "Opname onder vast licht", zin: "Zelfde lamp, zelfde afstand, zelfde stand. Dat maakt vergelijken mogelijk." },
      { kop: "Samen kijken", zin: "Je ziet hetzelfde scherm als wij, ook als het meevalt." },
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
    sessies: "Los te doen, of maandelijks als onderhoud [GEGEVEN-NODIG]",
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
    sessies: "Los of als onderhoud [GEGEVEN-NODIG]",
    prijs: 150,
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
    sessies: "Los of als onderhoud [GEGEVEN-NODIG]",
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
    sessies: "Los, vaak vlak voor een gelegenheid [GEGEVEN-NODIG]",
    prijs: 0,
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
    herstel: "Twee tot vijf dagen droog en schilferig, afhankelijk van de sterkte. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Meestal een reeks, met weken ertussen [GEGEVEN-NODIG]",
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
      { kop: "Huid beoordelen", zin: "De sterkte wordt op je huid van vandaag gekozen." },
      { kop: "Aanbrengen en tijd bewaken", zin: "De inwerktijd is het middel. Te lang is niet beter maar schadelijker." },
      { kop: "Neutraliseren en beschermen", zin: "Daarna zon vermijden. Dat is geen advies maar een voorwaarde. [MEDISCHE-CHECK-ROJDA]" },
    ],
    bijProblemen: [
      { label: "Acne", href: "/huidproblemen/acne" },
      { label: "Pigmentvlekken", href: "/huidproblemen/pigmentvlekken" },
      { label: "Poriën", href: "/huidproblemen/porien" },
    ],
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
    herstel: "Eén tot drie dagen rood, als een stevige zonnegloed. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Een reeks met weken ertussen [GEGEVEN-NODIG]",
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
      { kop: "Verdoven en afdekken", zin: "Een verdovende crème krijgt tijd om te werken. Dat wachten hoort erbij." },
      { kop: "Behandelen per zone", zin: "De diepte wordt per zone gekozen. Rond de ogen is de huid dunner." },
      { kop: "Rust geven", zin: "Daarna niets erop wat er niet op hoeft. [MEDISCHE-CHECK-ROJDA]" },
    ],
    bijProblemen: [
      { label: "Littekens en striae", href: "/huidproblemen/littekens" },
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },
      { label: "Poriën", href: "/huidproblemen/porien" },
    ],
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
    sessies: "Een reeks met weken ertussen [GEGEVEN-NODIG]",
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
    herstel: "Kort rood en soms kleine bultjes, meestal binnen een dag weg. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Vaak een kuur van drie [GEGEVEN-NODIG]",
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
    herstel: "Van een paar uur rood tot enkele dagen, afhankelijk van de behandeling. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Los of als kuur van drie [GEGEVEN-NODIG]",
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
    sessies: "Een reeks [GEGEVEN-NODIG]",
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
    herstel: "Vervellen en roodheid in de eerste dagen, en maandenlang strikte zonbescherming. [MEDISCHE-CHECK-ROJDA]",
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
      { naam: "Kuur inclusief lightening crème, oksels of intieme zone", prijs: 300 },
    ],
    bijProblemen: [{ label: "Huidverkleuring", href: "/huidproblemen/huidverkleuring" }],
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
    herstel: "Een paar uur rood, soms bultjes rond de haarzakjes. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Altijd een reeks. Het aantal hangt af van zone en huidtype [GEGEVEN-NODIG]",
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
  },
  {
    slug: "acne-traject",
    naam: "Acnetraject",
    apparaat: "Blemiderm",
    categorie: "overig",
    kort: "Een begeleid traject voor acne, met producten en controles.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "Een traject in plaats van losse behandelingen, omdat acne een verloop heeft en geen moment. [COPY-NODIG: opbouw van het traject] [MEDISCHE-CHECK-ROJDA]",
    herstel: "Wisselt per fase van het traject. [MEDISCHE-CHECK-ROJDA]",
    sessies: "Een traject [GEGEVEN-NODIG]",
    prijs: 570,
    bijProblemen: [{ label: "Acne", href: "/huidproblemen/acne" }],
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
    sessies: "Meestal een reeks [GEGEVEN-NODIG]",
    prijs: 100,
    varianten: [
      { naam: "Litteken 5 tot 10 cm", prijs: 100 },
      { naam: "Litteken 10 tot 20 cm", prijs: 125 },
      { naam: "Litteken 20 tot 30 cm", prijs: 150 },
      { naam: "Keizersnedelitteken", prijs: 125 },
      { naam: "Borstcorrectie", prijs: 175 },
      { naam: "Buikwandcorrectie", prijs: 200 },
    ],
    bijProblemen: [{ label: "Littekens en striae", href: "/huidproblemen/littekens" }],
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
