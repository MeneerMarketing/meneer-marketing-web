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
    zin: "Werkzame stoffen op diepte brengen.",
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
  /**
   * De behandeling in uitvoering, uit de eigen shoot.
   *
   * Alleen daar waar de opname onmiskenbaar bij deze behandeling hoort. Bij twijfel geen
   * foto: een willekeurige behandelfoto onder een specifieke naam wekt de indruk dat je
   * ziet wat je krijgt, en dat is dan niet waar.
   */
  /**
   * Hoe de afspraak zelf verloopt, vanuit de stoel.
   *
   * De rest van deze pagina gaat over wat het apparaat doet; dit gaat over wat jij meemaakt.
   * Dat is wat iemand wil weten die twijfelt of hij een afspraak maakt, en het is bovendien
   * het enige deel dat een behandelpagina onderscheidt van de apparatuurpagina ernaast.
   *
   * De gebruikelijke gang van zaken, niet het protocol van deze kliniek.
   * [MEDISCHE-CHECK-ROJDA]
   */
  readonly inDeStoel?: readonly string[];

  /**
   * Een eigen kop boven de wel/niet-kolommen.
   *
   * Standaard staat daar "Wat een behandeling met je huid doet". Dat klopt bij twintig van
   * de tweeëntwintig. Bij de huidanalyse spreekt het de pagina tegen — daar staat drie
   * regels hoger dat er niets aan je huid gebeurt — en bij de intolerantietest ook, want
   * dat is een bloedafname.
   */
  readonly welNietKop?: { readonly kop: string; readonly accent: string };

  readonly foto?: { readonly src: string; readonly alt: string };
  /**
   * Een staande foto naast "Wat je ervan merkt in de stoel".
   *
   * Die sectie is een raster van twee kolommen waarvan de linker alleen een kop draagt en
   * daaronder leeg blijft. Een smalle kolom vraagt om een staande foto; een liggende zou
   * daar de helft van zijn onderwerp verliezen.
   */
  readonly fotoInDeStoel?: { readonly src: string; readonly alt: string };
  /**
   * Behandelingen die hierbij horen, met per stuk de reden.
   *
   * Fotona 4D bestaat uit vier andere behandelingen die elk een eigen pagina hebben. Zonder
   * dit veld zijn dat vijf losse pagina's die toevallig op hetzelfde apparaat draaien.
   *
   * De reden is het punt: een rijtje namen zegt niets, "de eerste van de vier stappen"
   * zegt waarom je zou klikken.
   */
  readonly verwant?: readonly {
    readonly slug: string;
    readonly waarom: string;
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
    fotoInDeStoel: {
      src: "/images/shoot/stoel-huidanalyse.jpg",
      alt: "De opname van de huidscan op het scherm",
    },
    welNietKop: { kop: "Wat een meting", accent: "je vertelt" },
    inDeStoel: [
      "Je gezicht komt in een houder zodat de afstand en de hoek elke keer hetzelfde zijn. De opnames zijn in een paar minuten klaar: gewoon licht, gepolariseerd licht en UV, achter elkaar door. Je merkt er niets van, want er raakt niets je huid.",
      "De rest van het uur gaat over wat eruit komt. Je kijkt mee op het scherm en hoort waar de waardes vandaan komen, wat opvalt en wat het betekent. Aan het eind ligt er een voorstel: welke behandelingen erbij passen, in welke volgorde en over hoeveel tijd.",
    ],
    foto: {
      src: "/images/shoot/beh-huidanalyse.jpg",
      alt: "Cliënt in de EVE-M huidscanner, met de opname op het scherm ernaast",
    },
    naam: "Consult met EVE-M huidanalyse",
    apparaat: "EVE-M",
    categorie: "meting",
    kort: "De meting waar elk traject mee begint. Je huid in kaart, en een behandelplan dat daaruit volgt.",
    lagen: [],
    werking:
      "De EVE-M brengt de conditie van je huid in kaart en maakt zichtbaar wat met het blote oog niet altijd te zien is: beginnende pigmentatie, vochttekort, poriestructuur en tekenen van huidveroudering. Verschillende huidlagen worden geanalyseerd. Daarna volgt advies en een behandelplan, en de meting wordt herhaald om voortgang objectief zichtbaar te maken. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Je gaat meteen door met je dag. Wil je in dezelfde afspraak behandeld worden, dan reserveren we daar tijd voor.",
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
      "Voor de diagnose van een plek of aandoening kijkt eerst een arts mee [MEDISCHE-CHECK-ROJDA]",
      "Wil je in dezelfde afspraak behandeld worden, plan dan intake met behandeling",
      "Verandering aan je huid begint bij de behandeling die eruit volgt",
    ],
    stappen: [
      {
        kop: "Schoon gezicht",
        zin: "Kom zonder make-up. Foundation zit tussen de camera en je huid in.",
      },
      {
        kop: "Opname onder vast licht",
        zin: "Zelfde lamp, zelfde afstand, zelfde stand. Dat maakt vergelijken mogelijk.",
      },
      {
        kop: "Samen kijken",
        zin: "Je kijkt mee op hetzelfde scherm en hoort wat de waardes betekenen.",
      },
    ],
    bijProblemen: [
      { label: "Huidconsult", href: "/intake" },
      { label: "Alle huidproblemen", href: "/huidproblemen" },
    ],
    faq: [
      {
        vraag: "Moet ik dit doen voordat ik iets anders kan?",
        antwoord:
          "Ja, elk traject begint hiermee. De meting is het vertrekpunt waar we het resultaat later mee vergelijken, zodat je over drie maanden ziet wat er veranderd is.",
      },
    ],
    duurMinuten: 45,
  },

  /* ── Gezichtsbehandelingen ─────────────────────────────────────────────── */
  {
    slug: "hydrafacial",
    fotoInDeStoel: {
      src: "/images/shoot/stoel-hydrafacial.jpg",
      alt: "Het HydraFacial-mondstuk gaat over de wang",
    },
    inDeStoel: [
      "Je ligt achterover en het mondstuk gaat in banen over je gezicht. Wat je voelt is vooral de zuiging: een licht trekkend gevoel dat rond je neus en kin sterker is dan op je wangen. Pijn hoort er niet bij; wel merk je duidelijk waar een porie vastzit.",
      "Tussendoor wisselt de behandelaar van tip en van vloeistof. De laatste stap voelt koeler dan de rest, omdat er dan serum in plaats van alleen zuiging op je huid komt.",
      "Erna ben je meteen klaar. Je huid is roze en voelt strak aan, en dat trekt binnen een uur weg. Make-up kan diezelfde dag, al is het zonde van het resultaat om er meteen overheen te gaan.",
    ],
    foto: {
      src: "/images/shoot/beh-hydrafacial.jpg",
      alt: "HydraFacial-behandeling in uitvoering bij Diba Clinics",
    },
    naam: "HydraFacial",
    apparaat: "HydraFacial",
    categorie: "gezicht",
    kort: "Reinigen, exfoliëren en hydrateren. In één doorloop, direct zichtbaar en zonder hersteltijd.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "Een apparaat dat in één behandeling reinigt, de bovenste laag losmaakt, poriën leegzuigt en er daarna werkzame stoffen in brengt. Het werkt op de bovenste lagen, en juist daarom zie je het resultaat direct en heb je geen hersteltijd. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Er is doorgaans geen hersteltijd en je kunt na de afspraak je dag vervolgen.",
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
      "Voor littekens of pigment dieper in de huid past microneedling beter",
      "Voor blijvend verschil in structuur wordt het een reeks behandelingen",
      "Bij actieve acne begin je met het acnetraject",
    ],
    bijProblemen: [
      { label: "Poriën", href: "/huidproblemen/porien" },
      { label: "Droge huid", href: "/huidproblemen/droge-huid" },

      { label: "Doffe huid", href: "/huidproblemen/doffe-huid" },
      { label: "Onzuivere huid", href: "/huidproblemen/onzuivere-huid" },
    ],
    duurMinuten: 60,
  },
  {
    slug: "oxygeneo",
    fotoInDeStoel: {
      src: "/images/shoot/stoel-oxygeneo.jpg",
      alt: "De OxyGeneo-kop werkt over de huid",
    },
    inDeStoel: [
      "Een klein handstuk gaat over je huid terwijl er een gel op ligt. De twee reageren met elkaar en dat bruist licht: je hoort het meer dan dat je het voelt. Het is een van de rustigste behandelingen die we doen.",
      "Erna is je huid roze en voelt hij zacht aan. Je kunt meteen door met je dag; er is niets waar je rekening mee hoeft te houden behalve zonbescherming, en die geldt sowieso.",
    ],
    foto: {
      src: "/images/shoot/beh-oxygeneo.jpg",
      alt: "Behandelgel op de huid met het handstuk erop",
    },
    naam: "Oxygeneo glow",
    apparaat: "OxyGeneo",
    categorie: "gezicht",
    kort: "Exfoliëren en zuurstof in de huid brengen, in één behandeling.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "Een gezichtsbehandeling die de bovenste laag losmaakt en tegelijk werkzame stoffen inbrengt, waarbij er in de huid zelf zuurstof vrijkomt. Het werkt op de bovenste lagen, met resultaat dat je meteen ziet. [MEDISCHE-CHECK-ROJDA]",
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
      "Voor wat in de lederhuid speelt kies je microneedling of laser [MEDISCHE-CHECK-ROJDA]",
      "Voor littekens, diepe rimpels of pigment past een andere behandeling",
      "Voor blijvend verschil plan je een reeks in plaats van een losse keer",
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
          "Het effect houdt dagen aan, geen weken. Veel mensen plannen deze behandeling daarom vlak voor een gelegenheid. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Kan dit bij een gevoelige huid?",
        antwoord:
          "Meestal wel. De behandelaar beoordeelt dat tijdens de intake; bij actieve rosacea of ontstoken acne brengen we eerst je huid tot rust. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    bijProblemen: [
      { label: "Droge huid", href: "/huidproblemen/droge-huid" },
      { label: "Grove poriën", href: "/huidproblemen/porien" },

      { label: "Doffe huid", href: "/huidproblemen/doffe-huid" },
    ],
    duurMinuten: 60,
  },
  {
    slug: "dermaplaning",
    foto: {
      src: "/images/shoot/beh-dermaplaning.jpg",
      alt: "Dermaplaning met een chirurgisch mesje over de wang",
    },
    inDeStoel: [
      "Je huid wordt strak getrokken en het mesje gaat er onder een vaste hoek overheen, in korte halen. Het geluid is het gekste eraan: een zacht schrapen dat je in je kaak voelt meer dan op je huid. Pijn doet het niet.",
      "Vlak erna is je gezicht opvallend glad en neemt het crème makkelijker op. De donshaartjes komen terug zoals ze waren, dus wie het bevalt komt ongeveer maandelijks terug.",
    ],
    naam: "Dermaplaning",
    categorie: "gezicht",
    kort: "Dode huidcellen en donshaartjes weg met een mesje. Werkt zonder zuren, dus ook bij een gevoelige huid.",
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
      "Werkt op de buitenste laag; dieper komt microneedling",
      "Voor pigment of littekens dieper in de huid kies je laser",
      "De donshaartjes groeien terug; blijvend weg is laserontharing",
    ],
    bijProblemen: [
      { label: "Droge huid", href: "/huidproblemen/droge-huid" },
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },

      { label: "Doffe huid", href: "/huidproblemen/doffe-huid" },
    ],
    duurMinuten: 45,
  },
  {
    slug: "coolift",
    fotoInDeStoel: {
      src: "/images/shoot/stoel-coolift.jpg",
      alt: "De CooLift-kop brengt koude CO2 op de huid",
    },
    inDeStoel: [
      "Vijf minuten, en het is vooral koud. De gasstroom komt onder druk uit een handstuk dat op tien centimeter van je gezicht blijft, en die kou is scherp en meteen weg zodra het handstuk verder gaat.",
      "Er komt geen naald aan te pas en er wordt niets weggehaald. Je kunt er direct mee de deur uit, en veel mensen plannen het daarom vlak voor iets waar ze goed op willen staan.",
    ],
    foto: {
      src: "/images/shoot/beh-lichaam.jpg",
      alt: "Een lichaamsbehandeling met een gekoeld handstuk",
    },
    naam: "CooLift Cryo Therapy",
    apparaat: "CooLifting",
    categorie: "gezicht",
    kort: "Koude CO2 onder druk brengt werkzame stoffen in de huid. Je huid voelt er meteen strakker door.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "Een CO2-straal van min twintig graden wordt onder hoge druk op de huid geschoten, samen met een hoge concentratie werkzame stoffen zoals hyaluronzuur en peptiden. De kou laat de vaatjes samentrekken en daarna weer uitzetten; de combinatie met de druk brengt de stoffen dieper. De behandeling duurt vijf minuten. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Geen.",
    sessies:
      "De behandeling kan eenmalig worden gedaan of als kuur van meestal vier tot zes afspraken. [MEDISCHE-CHECK-ROJDA]",
    prijs: 75,
    wel: [
      "Laat je huid binnen vijf minuten strakker aanvoelen door de kou en de druk",
      "Brengt werkzame stoffen mee naar binnen zonder dat er een naald aan te pas komt",
      "Kan direct voor een afspraak of gelegenheid, want er is niets aan je te zien",
    ],
    niet: [
      "Het effect houdt dagen aan; voor opbouw kies je microneedling [MEDISCHE-CHECK-ROJDA]",
      "Voor aanmaak van collageen zijn naalden of laser het gereedschap",
      "Voor pigment of littekens die er al zitten past laser of needling",
    ],
    stappen: [
      {
        kop: "Vijf minuten",
        zin: "De behandeling duurt een paar minuten, van begin tot eind.",
      },
      {
        kop: "Koude straal",
        zin: "De CO2 komt er onder druk uit en dat voelt koud en stevig. Het is even wennen, maar goed te doen.",
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
          "Een dag tot enkele dagen, en dat verschilt per huid. Voor blijvende opbouw kies je microneedling of laser; CooLift is er voor het moment zelf. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Wanneer plan ik dit het beste?",
        antwoord:
          "Vlak voor een gelegenheid. Het effect is er meteen, er is niets aan je te zien en je kunt direct door met je dag.",
      },
    ],
    bijProblemen: [
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },

      { label: "Huidverslapping", href: "/huidproblemen/huidverslapping" },
    ],
    duurMinuten: 20,
  },

  /* ── Peelings ──────────────────────────────────────────────────────────── */
  {
    slug: "peelings",
    fotoInDeStoel: {
      src: "/images/shoot/stoel-peeling.jpg",
      alt: "Een flacon peeling boven een client op de behandelbank",
    },
    inDeStoel: [
      "De vloeistof gaat met een kwastje in lagen op je huid. Binnen een halve minuut begint het te prikken of te tintelen, en dat loopt op naarmate er lagen bij komen. De behandelaar kijkt naar je huid én naar de klok; dat samen bepaalt wanneer het eraf gaat.",
      "Prikken hoort erbij, branden niet. Zeg het dus meteen als het gaat branden, dan past de behandelaar de instelling aan.",
      "Wat erna komt hangt af van de sterkte. Bij een lichte peeling is je huid een dag wat rood en droog. Bij een sterkere ga je vervellen, en dan is de belangrijkste afspraak dat je er niet aan plukt. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/beh-peeling.jpg",
      alt: "Een peeling wordt met een wattenstaafje op het voorhoofd aangebracht",
    },
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
      "Voor littekens dieper dan de opperhuid kies je microneedling",
      "Bij hardnekkig pigment is Cosmelan het zwaardere traject",
      "Het resultaat houd je bij met herhaling, anders komt de oude situatie terug",
    ],
    stappen: [
      {
        kop: "Huid beoordelen",
        zin: "De sterkte wordt op je huid van vandaag gekozen.",
      },
      {
        kop: "Aanbrengen en tijd bewaken",
        zin: "De inwerktijd wordt afgemeten op je huid. Langer laten zitten geeft geen beter resultaat.",
      },
      {
        kop: "Neutraliseren en beschermen",
        zin: "Vermijd de zon in de weken erna, en gebruik dagelijks SPF 50. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    bijProblemen: [
      { label: "Acne", href: "/huidproblemen/acne" },
      { label: "Pigmentvlekken", href: "/huidproblemen/pigmentvlekken" },
      { label: "Poriën", href: "/huidproblemen/porien" },

      { label: "Doffe huid", href: "/huidproblemen/doffe-huid" },
      { label: "Onzuivere huid", href: "/huidproblemen/onzuivere-huid" },
      { label: "Ouderdomsvlekken", href: "/huidproblemen/ouderdomsvlekken" },
    ],
    duurMinuten: 45,
  },

  /* ── Microneedling ─────────────────────────────────────────────────────── */
  {
    slug: "skinpen",
    fotoInDeStoel: {
      src: "/images/shoot/stoel-skinpen.jpg",
      alt: "Microneedling met de SkinPen in de behandelkamer",
    },
    inDeStoel: [
      "Er gaat eerst een verdovende crème op, die een half uur moet intrekken. Daarna gaat de pen in banen over de zone. Wat je voelt is een trilling en een druk, het sterkst op je voorhoofd en rond je kaaklijn, waar de huid dun over bot ligt.",
      "Direct erna ben je rood, ongeveer als een stevige zonnegloed, en voelt je huid warm. Dat zakt in een tot drie dagen. De eerste vierentwintig uur laat je je huid met rust: geen make-up, geen sport, geen sauna.",
      "Wat je ziet komt niet die week. Bindweefsel bouwt zich over weken op, dus de vergelijking die telt is die met de meting van vóór de eerste sessie. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/beh-skinpen.jpg",
      alt: "Microneedling met de SkinPen op het voorhoofd",
    },
    naam: "SkinPen Microneedling",
    apparaat: "SkinPen CIT",
    categorie: "needling",
    kort: "Medisch gecertificeerd microneedlen. Werkt op de laag waar de structuur van je huid zit.",
    lagen: ["opperhuid", "lederhuid-boven"],
    werking:
      "Met fijne naalden worden heel veel kleine kanaaltjes tot in de bovenste lederhuid gemaakt. Daar zit het bindweefsel, en de huid reageert daarop met herstel en collageenaanmaak. Dat herstel is het doel; de prikjes zelf zijn de aanleiding. Het resultaat bouwt zich daarom over weken op. [MEDISCHE-CHECK-ROJDA]",
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
      "Voor kleur en pigment kies je laser of IPL",
      "Een enkele sessie is te weinig; dit werkt in een reeks",
      "Bij een actieve ontsteking behandelen we die eerst [MEDISCHE-CHECK-ROJDA]",
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
        zin: "Daarna alleen de producten die de behandelaar meegeeft. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    bijProblemen: [
      { label: "Littekens en striae", href: "/huidproblemen/littekens" },
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },
      { label: "Poriën", href: "/huidproblemen/porien" },

      { label: "Acnelittekens", href: "/huidproblemen/acne-littekens" },
      { label: "Striae", href: "/huidproblemen/striae" },
      { label: "Rimpels", href: "/huidproblemen/rimpels" },
    ],
    duurMinuten: 75,
  },
  {
    slug: "dermapen-4",
    fotoInDeStoel: {
      src: "/images/shoot/stoel-dermapen.jpg",
      alt: "Het handstuk van de Dermapen 4 op de huid",
    },
    inDeStoel: [
      "Hetzelfde verloop als bij de SkinPen: verdovende crème, een half uur wachten, en dan de pen in banen over de zone. De Dermapen werkt sneller, dus een vlak is eerder af.",
      "De diepte wordt per zone bijgesteld. Rond je ogen en op je voorhoofd gaat hij ondieper dan op je wangen, en dat merk je: hoe dieper, hoe meer druk je voelt.",
      "Erna gelden dezelfde afspraken. Een tot drie dagen rood, de eerste dag met rust laten, en zonbescherming daarna niet overslaan. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/beh-dermapen.jpg",
      alt: "Behandeling met de Dermapen 4 bij een cliënt",
    },
    naam: "Dermapen 4",
    apparaat: "Dermapen 4",
    categorie: "needling",
    kort: "Microneedling met trillende naaldjes, die gelijkmatig door de huid komen.",
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

      { label: "Acnelittekens", href: "/huidproblemen/acne-littekens" },
      { label: "Rimpels", href: "/huidproblemen/rimpels" },
      { label: "Striae", href: "/huidproblemen/striae" },
    ],
    wel: [
      "Maakt kanaaltjes in de huid die je eigen herstel op gang brengen [MEDISCHE-CHECK-ROJDA]",
      "Werkt op fijne lijntjes, acnelittekens, grove poriën en een doffe structuur",
      "Komt met trillende naaldjes gelijkmatiger door de huid dan met een rollende beweging",
    ],
    niet: [
      "Wat je na een keer ziet is zwelling; het resultaat komt over de reeks",
      "Diepe of ingetrokken littekens vragen een combinatie met laser [MEDISCHE-CHECK-ROJDA]",
      "Bij actieve ontstekingen behandelen we eerst de ontsteking en daarna de structuur",
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
          "Na een paar weken. Collageenopbouw kost tijd, dus wat je vlak na de eerste sessie ziet is herstel. Daarom leggen we vooraf vast hoe je huid erbij staat. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Wat is het verschil met de SkinPen?",
        antwoord:
          "Het principe is hetzelfde en het apparaat is anders. Welke van de twee bij je past hangt af van je huid en de zone, en dat bepalen we tijdens de intake.",
      },
    ],
    duurMinuten: 75,
  },

  /* ── Skinboosters ──────────────────────────────────────────────────────── */
  {
    slug: "skinboosters",
    fotoInDeStoel: {
      src: "/images/shoot/stoel-skinboosters.jpg",
      alt: "Ampullen en injector klaargelegd voor de behandeling",
    },
    inDeStoel: [
      "Dit is een injectiebehandeling, dus er zijn prikjes. De injector zet ze snel achter elkaar en op een gelijke diepte, wat het gelijkmatiger maakt dan met de hand. Verdovende crème vooraf hoort erbij.",
      "Vlak erna zie je kleine bultjes op de plek van elke prik. Die zakken doorgaans binnen een dag. Blauwe plekjes kunnen, vooral rond de ogen, en die duren langer.",
      "Plan dit dus niet vlak voor iets waar je op de foto moet. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/beh-skinbooster.jpg",
      alt: "Een skinbooster wordt onder het oog ingebracht",
    },
    naam: "Skinboosters en mesotherapie",
    apparaat: "U225 intradermale injector",
    categorie: "injectie",
    kort: "Werkzame stoffen ín de huid gebracht in plaats van erop, op een vaste diepte per prik.",
    lagen: ["lederhuid-boven"],
    werking:
      "Bij mesotherapie worden werkzame stoffen direct in de huid gebracht in plaats van erop. De behandelaar werkt met de U225, die elke prik op dezelfde diepte zet. Daardoor komt het middel gelijkmatig over het gebied. Er zijn verschillende skinboosters: voor fijne lijnen, en een depigmentatiebooster voor gezicht, hals en décolleté bij hyperpigmentatie, zonneschade en melasma. [MEDISCHE-CHECK-ROJDA]",
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

      { label: "Rimpels", href: "/huidproblemen/rimpels" },
    ],
    wel: [
      "Brengt werkzame stoffen ín de huid in plaats van erop",
      "Zet de naald op een vaste diepte, zodat het niet per plek verschilt",
      "Heeft een aparte booster voor pigment, zonneschade en melasma [MEDISCHE-CHECK-ROJDA]",
    ],
    niet: [
      "Voor volume of vorm is een filler het middel en niet dit",
      "Dit is een kuur, dus je plant de sessies achter elkaar in",
      "Zonder zonbescherming loopt pigment door, ook tijdens de kuur",
    ],
    stappen: [
      {
        kop: "Kiezen welke booster",
        zin: "Voor fijne lijnen of voor pigment. Elk doel vraagt een ander mengsel.",
      },
      {
        kop: "De injector",
        zin: "De naald zit los van de spuit gemonteerd en beweegt niet met de hand mee. Daardoor is elke prik even diep.",
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
          "Omdat de huid tussen de sessies door het werk doet. Er zijn meerdere prikkels nodig voordat er iets wordt opgebouwd. [MEDISCHE-CHECK-ROJDA]",
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
    slug: "rrs-eyes",
    inDeStoel: [
      "Je ligt achterover en de behandelaar zet met een fijne naald een reeks kleine depots onder en naast je oog. Elke prik voelt als een korte tik; het gebied rond de ogen is gevoeliger dan de wang, dus daar merk je het meer.",
      "Na afloop staan er kleine bultjes op de plek van elke prik. Dat hoort erbij en het is de vloeistof die nog niet is opgenomen; binnen een paar uur tot een dag zijn ze weg. [MEDISCHE-CHECK-ROJDA]",
      "Je kunt daarna gewoon door met je dag. Blauwe plekjes komen voor rond de ogen, dus plan het niet vlak voor iets waar je op de foto moet.",
    ],
    foto: {
      src: "/images/shoot/beh-rrs-eyes.jpg",
      alt: "Een RRS Eyes-injectie bij de ooghoek",
    },
    fotoInDeStoel: {
      src: "/images/shoot/stoel-rrs-eyes.jpg",
      alt: "De behandelaar zet een depot onder het oog tijdens een RRS Eyes-behandeling",
    },
    naam: "RRS Eyes",
    categorie: "injectie",
    kort: "Werkzame stoffen rond de oogcontour. Voor donkere kringen, fijne lijntjes en een vermoeide blik.",
    lagen: ["opperhuid", "lederhuid-boven"],
    werking:
      "Bij mesotherapie worden werkzame stoffen in de huid gebracht in plaats van erop. RRS Eyes is een mengsel dat op de oogcontour is afgestemd, met onder meer hyaluronzuur, vitaminen en aminozuren, en wordt in kleine depots onder en naast het oog gezet. De huid daar is dun, dus de behandelaar werkt met minder volume en op een geringere diepte dan op de wang. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Kleine bultjes die binnen een dag wegtrekken. Blauwe plekjes komen voor rond de ogen. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Een reeks, met een paar weken ertussen, daarna onderhoud. Het aantal hoor je tijdens de intake. [GEGEVEN-NODIG: aantal sessies per reeks]",
    prijs: 0,
    bijProblemen: [
      { label: "Donkere kringen", href: "/huidproblemen/donkere-kringen" },
      { label: "Wallen", href: "/huidproblemen/wallen" },
      { label: "Rimpels", href: "/huidproblemen/rimpels" },
    ],
    wel: [
      "Werkt op de oogcontour zelf, waar een crème niet diep genoeg komt",
      "Brengt vocht en werkzame stoffen ín de huid in plaats van erop",
      "Is te combineren met een behandeling op de rest van je gezicht",
    ],
    niet: [
      "Voor volume onder het oog is een filler het middel en niet dit",
      "Komt de schaduw van je botstructuur, dan verandert kleur weinig [MEDISCHE-CHECK-ROJDA]",
      "Dit is een reeks, dus je plant de sessies achter elkaar in",
    ],
    welNietKop: {
      kop: "Waar dit rond het oog",
      accent: "wel en niet bij helpt",
    },
    stappen: [
      {
        kop: "Eerst kijken",
        zin: "Donkere kringen komen van pigment, van doorschijnende vaatjes of van schaduw. Wat het bij jou is bepaalt of dit iets oplevert.",
      },
      {
        kop: "Kleine depots",
        zin: "Met een fijne naald zet de behandelaar het mengsel onder en naast het oog, in een reeks kleine porties.",
      },
      {
        kop: "Direct door",
        zin: "De bultjes trekken binnen een dag weg. Make-up laat je die dag liever nog even zitten.",
      },
    ],
    faq: [
      {
        vraag: "Is het pijnlijk?",
        antwoord:
          "Het voelt als een reeks korte prikjes. Rond de ogen is de huid dunner dan op de wang, dus daar merk je het duidelijker dan bij een behandeling op je gezicht.",
      },
      {
        vraag: "Waarom staan er bultjes na afloop?",
        antwoord:
          "Dat is de vloeistof die nog niet is opgenomen. Ze trekken binnen een paar uur tot een dag weg. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Helpt dit tegen donkere kringen?",
        antwoord:
          "Dat hangt af van waar de kleur vandaan komt. Bij pigment en bij een dunne huid met doorschijnende vaatjes valt er iets te doen; komt de donkerte van schaduw door je botstructuur, dan verandert er weinig. Dat stellen we vast tijdens de intake. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Wat kost het?",
        antwoord:
          "Dat hangt af van het aantal sessies dat bij jou past, en dat stellen we tijdens de intake vast. De intake kost € 50 en dat bedrag gaat eraf zodra je in dezelfde afspraak behandeld wordt. [PRIJS-NODIG: tarief per sessie]",
      },
    ],
    duurMinuten: 30,
  },
  {
    slug: "fotona",
    fotoInDeStoel: {
      src: "/images/shoot/stoel-fotona.jpg",
      alt: "Een Fotona-behandeling langs de kaaklijn",
    },
    inDeStoel: [
      "Je krijgt een beschermbril op en die blijft de hele behandeling op. Wat je voelt hangt af van de modus: bij de verwarmende stand is het een oplopende warmte die net voor het ongemakkelijke stopt, bij de andere korte tikjes.",
      "De behandelaar vraagt tijdens de sessie hoe warm het aanvoelt. Met jouw antwoord stelt zij het apparaat bij.",
      "Erna ben je meestal rood en warm, alsof je te lang in de zon hebt gezeten. Dat trekt in een paar uur tot een dag weg. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/beh-fotona.jpg",
      alt: "Fotona-laserbehandeling met oogbescherming",
    },
    naam: "Fotona TimeWalker",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Vijftien behandelingen op een apparaat, van een lichte laserpeel tot de complete 4D. Elk met een eigen doel.",
    lagen: ["opperhuid", "lederhuid-boven", "lederhuid-diep"],
    werking:
      "De Fotona TimeWalker is geen behandeling maar een platform: twee lasertypen in een kast, waarmee vijftien verschillende behandelingen te doen zijn. Wat je krijgt hangt af van de instelling, de puls en de zone, en dat maakt het verschil tussen een lichte peeling en een complete gezichtsbehandeling. Fotona 4D is daarvan de bekendste: vier behandelingen in een sessie, van binnenuit door de wang tot een afsluitende peeling. Hieronder staat welke er zijn en waar elk voor bedoeld is. [MEDISCHE-CHECK-ROJDA]",
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

      { label: "Rimpels", href: "/huidproblemen/rimpels" },
      { label: "Huidverslapping", href: "/huidproblemen/huidverslapping" },
    ],
    wel: [
      "Werkt in meerdere richtingen: van binnenuit via de mond en van buitenaf op de huid",
      "Heeft per gebied een eigen behandeling, van oogcontour tot lippen tot het hele gelaat",
      "Kan zonder naalden en zonder snijden [MEDISCHE-CHECK-ROJDA]",
    ],
    niet: [
      "Voor losgelaten huid is chirurgie het antwoord [MEDISCHE-CHECK-ROJDA]",
      "Hoeveel je huid opbouwt verschilt per persoon, dus we leggen het verloop vast",
      "Fotona is het apparaat; welke behandeling erop past bepaalt de behandelaar",
    ],
    stappen: [
      {
        kop: "Vaststellen wat je krijgt",
        zin: "4D, VectorLift, SmoothEye en LipLase draaien op hetzelfde apparaat. Welke bij jou past, kiest de behandelaar.",
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
          "Dat hoor je na de meting. Het aantal hangt af van je huid en van het gebied, en dat stelt de behandelaar dan vast. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    duurMinuten: 75,
  },
  /* ── Snurken ───────────────────────────────────────────────────────────
     NightLase draait op dezelfde Fotona als de 4D-behandelingen, maar hoort in geen enkele
     huidcategorie thuis: er wordt niets aan een huid gedaan. Vandaar "overig" en niet
     "laser"; wie de laserlijst scant zoekt daar naar kleur, vaten of structuur.

     Dit is bovendien de enige behandeling op de site die niet cosmetisch is en niet over
     de huid gaat. Dat maakt hem geen buitenbeentje maar wel een die zijn eigen grens moet
     benoemen, en die grens staat in "niet": snurken is niet hetzelfde als slaapapneu. */
  {
    slug: "fotona-4d",
    verwant: [
      {
        slug: "smoothliftin",
        waarom: "De eerste van de vier stappen, van binnenuit door de wang.",
      },
      {
        slug: "frac3",
        waarom:
          "De tweede stap: fractioneel op de diepte, gericht op onregelmatigheden.",
      },
      {
        slug: "piano",
        waarom: "De derde stap: vlakke, diepe verwarming voor versteviging.",
      },
      {
        slug: "superficial-peel",
        waarom: "De afsluitende stap: een lichte laserpeeling voor gladheid.",
      },
      {
        slug: "fotona-4d-men",
        waarom: "Hetzelfde protocol, ingesteld op een dikkere huid.",
      },
    ],
    inDeStoel: [
      "Je krijgt een beschermbril op die de hele behandeling op blijft. De eerste stap gebeurt in je mond: er komt een handstuk tegen de binnenkant van je wang en dat voelt warm.",
      "Daarna werkt de behandelaar aan de buitenkant. De verwarmende stand loopt op tot net voor het ongemakkelijke, en zij vraagt tijdens de sessie hoe warm het aanvoelt. De laatste stap voelt als korte tikjes. [MEDISCHE-CHECK-ROJDA]",
    ],
    naam: "Fotona 4D",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Vier laserbehandelingen in een sessie. Van binnenuit door de wang tot een afsluitende peeling.",
    lagen: ["opperhuid", "lederhuid-boven", "lederhuid-diep"],
    werking:
      "Fotona 4D is geen losse behandeling maar een protocol van vier lagen die in dezelfde sessie op elkaar volgen. Het begint van binnenuit met SmoothLiftin door de wangslijmvlies, daarna gaat FRAC3 op de diepte, PIANO verwarmt het weefsel vlak en gelijkmatig, en SupErficial sluit af met een lichte laserpeeling. Elke stap raakt een andere diepte, en samen pakken ze verslapping, textuur en kleur in een keer aan. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Een paar uur tot een dag rood en warm, alsof je te lang in de zon hebt gezeten. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Los te doen of als kuur van drie, met vier tot zes weken ertussen. Wat er bij jou past hoor je tijdens de intake. [MEDISCHE-CHECK-ROJDA]",
    prijs: 370,
    bijProblemen: [
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },
      { label: "Huidverslapping", href: "/huidproblemen/huidverslapping" },
      { label: "Rimpels", href: "/huidproblemen/rimpels" },
    ],
    wel: [
      "Werkt in vier diepten tegelijk: van het slijmvlies tot de bovenste huidlaag",
      "Pakt verslapping, textuur en kleur in dezelfde sessie aan",
      "Vraagt geen naalden en geen snijden",
    ],
    niet: [
      "Voor losgelaten huid is chirurgie het antwoord [MEDISCHE-CHECK-ROJDA]",
      "Hoeveel je huid opbouwt verschilt per persoon, dus we leggen het verloop vast",
      "Dit is een reeks, dus je plant de sessies achter elkaar in",
    ],
    stappen: [
      {
        kop: "Van binnenuit",
        zin: "SmoothLiftin verwarmt het weefsel door de wang, waar de huid van buitenaf niet bij te komen is.",
      },
      {
        kop: "Op diepte",
        zin: "FRAC3 en PIANO werken in de lederhuid: de eerste gericht op onregelmatigheden, de tweede als gelijkmatige warmte. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        kop: "Afsluitend",
        zin: "SupErficial haalt met een lichte laserpeeling de bovenste laag eraf, wat de huid gladder maakt.",
      },
    ],
    faq: [
      {
        vraag: "Waarom heet het 4D?",
        antwoord:
          "Omdat er vier behandelingen in een sessie op elkaar volgen, elk op een andere diepte. Van het slijmvlies aan de binnenkant tot de bovenste huidlaag.",
      },
      {
        vraag: "Kan ik ook een van de vier los doen?",
        antwoord:
          "Ja. SmoothLiftin, FRAC3, PIANO en SupErficial hebben elk een eigen pagina en zijn los te boeken. Welke bij jou past hoor je tijdens de intake.",
      },
      {
        vraag: "Wanneer zie ik er iets van?",
        antwoord:
          "Direct na de sessie ziet de huid er voller uit door de warmte, maar dat is nog geen resultaat. De opbouw van collageen kost weken; het verschil bouwt zich over de reeks op. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    duurMinuten: 90,
  },
  {
    slug: "fotona-4d-men",
    verwant: [
      {
        slug: "fotona-4d",
        waarom: "Hetzelfde protocol met de standaardinstellingen.",
      },
      {
        slug: "laserontharing",
        waarom: "Voor wie de baardlijn wil laten behandelen.",
      },
    ],
    inDeStoel: [
      "Het verloop is hetzelfde als bij de standaardbehandeling: een bril op, eerst van binnenuit door de wang, daarna van buitenaf.",
      "Wat je merkt is dat de warmte iets verder oploopt. Dat is de bedoeling: een dikkere huid heeft meer nodig om dezelfde diepte te bereiken.",
    ],
    naam: "Fotona 4D Men",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Hetzelfde protocol van vier, ingesteld op de doorgaans dikkere mannenhuid.",
    lagen: ["opperhuid", "lederhuid-boven", "lederhuid-diep"],
    werking:
      "De mannenhuid is gemiddeld dikker, bevat meer collageen en heeft meer talgklieren en haarfollikels. Daardoor reageert hij anders op warmte en vraagt hij andere instellingen dan de standaardinstelling. Fotona 4D Men doorloopt dezelfde vier stappen, maar met een aangepast energieniveau en een aangepaste opbouw. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Een paar uur tot een dag rood en warm. Bij een baard let de behandelaar extra op de zones rond de haargroei. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Los te doen of als kuur van drie, met vier tot zes weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 0,
    bijProblemen: [
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },
      { label: "Huidverslapping", href: "/huidproblemen/huidverslapping" },
    ],
    wel: [
      "Volgt hetzelfde protocol van vier, met instellingen voor een dikkere huid",
      "Werkt op de kaaklijn, de hals en de nasolabiale plooien",
      "Vraagt geen naalden en geen snijden",
    ],
    niet: [
      "Voor losgelaten huid is chirurgie het antwoord [MEDISCHE-CHECK-ROJDA]",
      "Bij een volle baard beoordeelt de behandelaar eerst welke zones kunnen [MEDISCHE-CHECK-ROJDA]",
      "Dit is een reeks, dus je plant de sessies achter elkaar in",
    ],
    stappen: [
      {
        kop: "Instellen op je huid",
        zin: "De behandelaar meet je huidtype en stelt de energie daarop af; lichter doet hier te weinig. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        kop: "Dezelfde vier stappen",
        zin: "SmoothLiftin, FRAC3, PIANO en SupErficial volgen op elkaar, net als bij de standaardbehandeling.",
      },
      {
        kop: "Rond de baard",
        zin: "Zones met stevige haargroei vragen aandacht, want haar neemt de energie anders op dan huid.",
      },
    ],
    faq: [
      {
        vraag: "Waarom een aparte behandeling voor mannen?",
        antwoord:
          "Omdat de huid gemiddeld dikker is en meer talgklieren en haarfollikels heeft. Met dezelfde instelling bereik je dan niet dezelfde diepte. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Kan het met een baard?",
        antwoord:
          "Meestal wel, en de behandelaar beoordeelt vooraf welke zones geschikt zijn. Haar neemt de energie anders op dan huid.",
      },
      {
        vraag: "Wat kost het?",
        antwoord:
          "Dat hangt af van de zones die we behandelen en dat stellen we tijdens de intake vast. De intake kost € 50 en dat bedrag gaat eraf zodra je in dezelfde afspraak behandeld wordt. [PRIJS-NODIG: tarief bevestigen]",
      },
    ],
    duurMinuten: 90,
  },
  {
    slug: "smoothliftin",
    verwant: [
      {
        slug: "fotona-4d",
        waarom:
          "De complete behandeling waar dit de eerste van vier stappen in is.",
      },
      {
        slug: "smootheye",
        waarom: "Voor de oogcontour, waar SmoothLiftin niet bij komt.",
      },
    ],
    inDeStoel: [
      "Je ligt achterover met je mond open en het handstuk gaat tegen de binnenkant van je wang. Wat je voelt is warmte die oploopt, en de behandelaar vraagt tussendoor hoe warm het aanvoelt.",
      "Erna is er aan de buitenkant niets te zien. Je kunt gewoon eten en drinken; sommige mensen vinden het de eerste uren wat droog aanvoelen in de mond.",
    ],
    naam: "SmoothLiftin",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Collageenstimulatie van binnenuit, door het slijmvlies van je wang.",
    lagen: ["lederhuid-boven"],
    werking:
      "Bij SmoothLiftin werkt de laser vanaf de binnenkant van je mond. Het slijmvlies van de wang ligt vlak tegen het weefsel rond je mond en je nasolabiale plooien aan, en van die kant is die zone te bereiken zonder dat de buitenste huidlaag wordt geraakt. De warmte trekt bestaand collageen samen en zet de aanmaak van nieuw collageen in gang. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Geen. Je gaat er direct mee de deur uit en er is aan de buitenkant niets te zien.",
    sessies:
      "Meestal een reeks, met enkele weken ertussen. Ook los te doen als onderdeel van Fotona 4D. [MEDISCHE-CHECK-ROJDA]",
    prijs: 0,
    bijProblemen: [
      { label: "Huidverslapping", href: "/huidproblemen/huidverslapping" },
      { label: "Rimpels", href: "/huidproblemen/rimpels" },
    ],
    wel: [
      "Bereikt het middengezicht vanaf de binnenkant, waar de huid van buiten niet bij komt",
      "Laat de buitenste huidlaag onaangeroerd, dus er is geen hersteltijd",
      "Werkt op de nasolabiale plooien en het mondgebied",
    ],
    niet: [
      "Voor de oogcontour is SmoothEye de behandeling",
      "Voor structuur en poriën aan de buitenkant kies je FRAC3 of SupErficial",
      "Dit is een reeks, dus je plant de sessies achter elkaar in",
    ],
    stappen: [
      {
        kop: "Mond open",
        zin: "Het handstuk gaat tegen de binnenkant van je wang. Je krijgt een beschermbril op, ook al werkt de laser binnen.",
      },
      {
        kop: "Warmte in banen",
        zin: "De behandelaar gaat in banen over het slijmvlies. Het voelt warm en de warmte loopt op tot net voor het ongemakkelijke.",
      },
      {
        kop: "Direct door",
        zin: "Er is aan de buitenkant niets te zien, dus je gaat meteen door met je dag.",
      },
    ],
    faq: [
      {
        vraag: "Werkt een laser in je mond echt op je huid?",
        antwoord:
          "Het slijmvlies ligt vlak tegen het weefsel van je middengezicht aan. De warmte komt daardoor bij de laag waar collageen zit, zonder dat de buitenste huidlaag geraakt wordt. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Doet het pijn?",
        antwoord:
          "Het is warm en het is even wennen, maar het doet geen pijn. Er komt geen verdoving aan te pas.",
      },
      {
        vraag: "Wat kost het?",
        antwoord:
          "Dat hangt af van het aantal sessies dat bij jou past, en dat stellen we tijdens de intake vast. [PRIJS-NODIG: tarief bevestigen]",
      },
    ],
    duurMinuten: 30,
  },
  {
    slug: "frac3",
    verwant: [
      {
        slug: "fotona-4d",
        waarom:
          "De complete behandeling waar dit de tweede van vier stappen in is.",
      },
      {
        slug: "fotona-resurfacing",
        waarom: "Gaat verder op structuur en poriën, met meer hersteltijd.",
      },
    ],
    inDeStoel: [
      "Elke puls voelt als een kort, scherp tikje, alsof er een elastiekje tegen je huid schiet. Op de wang is dat goed te doen; boven de lip en langs de neus merk je het duidelijker.",
      "Erna ben je rood en warm. In de dagen die volgen kan de huid fijn korrelig aanvoelen en licht schilferen; dat is de oude bovenlaag die eraf komt. [MEDISCHE-CHECK-ROJDA]",
    ],
    naam: "FRAC3",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Fractionele laser die dieper gaat, voor structuur, poriën en onregelmatigheden.",
    lagen: ["opperhuid", "lederhuid-boven", "lederhuid-diep"],
    werking:
      "FRAC3 werkt fractioneel: de energie gaat niet als een vlak over de huid maar in eilandjes, waardoor er intact weefsel tussen blijft staan dat het herstel op gang helpt. De pulsen zoeken vanzelf de plekken op waar meer pigment of meer bloed zit, dus de onregelmatigheden krijgen meer energie dan de rustige huid eromheen. Daarmee komt het bij structuur, poriën, roodheid en ongelijke kleur. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Een tot enkele dagen rood, soms met een fijne korrelige structuur die eraf schilfert. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Meestal een reeks van drie tot vier, met vier tot zes weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 0,
    bijProblemen: [
      { label: "Poriën", href: "/huidproblemen/porien" },
      { label: "Littekens en striae", href: "/huidproblemen/littekens" },
      { label: "Acnelittekens", href: "/huidproblemen/acne-littekens" },
    ],
    wel: [
      "Werkt op structuur, poriën en ongelijke kleur in dezelfde sessie",
      "Zoekt vanzelf de onregelmatigheden op en spaart de rustige huid",
      "Is onderdeel van Fotona 4D en ook los te doen",
    ],
    niet: [
      "Voor verslapping van binnenuit is SmoothLiftin de stap",
      "Voor alleen een frisse huid zonder hersteltijd kies je SupErficial",
      "Vlak voor veel zon plannen we het niet in [MEDISCHE-CHECK-ROJDA]",
    ],
    stappen: [
      {
        kop: "Koelen en beschermen",
        zin: "Je krijgt een beschermbril op en de huid wordt gekoeld voordat de eerste puls komt.",
      },
      {
        kop: "In eilandjes",
        zin: "De laser gaat in banen over de zone. Elke puls raakt kleine eilandjes en laat de huid ertussen intact.",
      },
      {
        kop: "Rood erna",
        zin: "De huid is een tot enkele dagen rood en voelt warm. Zonbescherming hoort er de weken erna bij. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    faq: [
      {
        vraag: "Wat betekent fractioneel?",
        antwoord:
          "Dat de energie in eilandjes de huid in gaat in plaats van als een vlak. Het weefsel dat ertussen intact blijft, helpt het herstel op gang en dat scheelt hersteltijd.",
      },
      {
        vraag: "Hoeveel sessies heb ik nodig?",
        antwoord:
          "Meestal drie tot vier, met vier tot zes weken ertussen. Hoeveel het er bij jou zijn hangt af van je huid en van wat er speelt. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Wat kost het?",
        antwoord:
          "Dat hangt af van de zone en het aantal sessies, en dat stellen we tijdens de intake vast. [PRIJS-NODIG: tarief bevestigen]",
      },
    ],
    duurMinuten: 45,
  },
  {
    slug: "piano",
    verwant: [
      {
        slug: "fotona-4d",
        waarom:
          "De complete behandeling waar dit de derde van vier stappen in is.",
      },
      {
        slug: "vectorlift",
        waarom: "Dezelfde gedachte, maar gericht op voorhoofd en wenkbrauw.",
      },
    ],
    inDeStoel: [
      "Wat je voelt is een oplopende warmte die net voor het ongemakkelijke stopt. De behandelaar vraagt tijdens de sessie hoe warm het aanvoelt en stelt het apparaat op jouw antwoord bij.",
      "Erna voelt de huid warm en ziet hij er wat voller uit. Dat is de warmte en nog geen resultaat; de opbouw komt over de weken erna.",
    ],
    naam: "PIANO skin tightening",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Diepe, gelijkmatige verwarming voor versteviging van gezicht, kaaklijn en hals.",
    lagen: ["lederhuid-boven", "lederhuid-diep"],
    werking:
      "PIANO is een lange, trage puls die het weefsel over een groot oppervlak gelijkmatig verwarmt in plaats van punt voor punt. Daardoor komt de warmte dieper en blijft de bovenste huidlaag koel. Bestaand collageen trekt samen en de aanmaak van nieuw collageen komt op gang, wat de huid steviger maakt. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Geen tot een paar uur lichte roodheid. Je gaat er meestal direct mee de deur uit.",
    sessies:
      "Een reeks van drie tot vier, met vier tot zes weken ertussen. Ook onderdeel van Fotona 4D. [MEDISCHE-CHECK-ROJDA]",
    prijs: 0,
    bijProblemen: [
      { label: "Huidverslapping", href: "/huidproblemen/huidverslapping" },
      { label: "Huidveroudering", href: "/huidproblemen/huidveroudering" },
    ],
    wel: [
      "Verwarmt gelijkmatig over een groot oppervlak in plaats van punt voor punt",
      "Werkt op de kaaklijn, de hals en de wangen",
      "Laat de bovenste huidlaag koel, dus er is nauwelijks hersteltijd",
    ],
    niet: [
      "Voor losgelaten huid is chirurgie het antwoord [MEDISCHE-CHECK-ROJDA]",
      "Voor poriën en structuur kies je FRAC3 of SupErficial",
      "Dit is een reeks; van een enkele sessie zie je weinig",
    ],
    stappen: [
      {
        kop: "Bril op",
        zin: "Je krijgt een beschermbril op en de behandelaar brengt een dunne laag gel aan.",
      },
      {
        kop: "Warmte in banen",
        zin: "Het handstuk gaat in rustige banen over de zone. De warmte loopt op en blijft daar even hangen.",
      },
      {
        kop: "Direct door",
        zin: "De huid is hooguit licht roze. Meestal ga je er direct mee de deur uit.",
      },
    ],
    faq: [
      {
        vraag: "Waarom voelt dit anders dan andere laser?",
        antwoord:
          "Omdat de puls lang en traag is in plaats van kort en scherp. Je voelt geen tikjes maar een warmte die oploopt.",
      },
      {
        vraag: "Zie ik er meteen iets van?",
        antwoord:
          "De huid ziet er direct na de sessie voller uit door de warmte. Het echte verschil komt uit de collageenopbouw, en die kost weken. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Wat kost het?",
        antwoord:
          "Dat hangt af van de zone en het aantal sessies, en dat stellen we tijdens de intake vast. [PRIJS-NODIG: tarief bevestigen]",
      },
    ],
    duurMinuten: 45,
  },
  {
    slug: "superficial-peel",
    verwant: [
      {
        slug: "fotona-4d",
        waarom:
          "De complete behandeling waar dit de laatste van vier stappen in is.",
      },
      {
        slug: "peelings",
        waarom:
          "Hetzelfde doel met een chemisch middel in plaats van met licht.",
      },
    ],
    inDeStoel: [
      "Elke puls voelt als een korte warme tik. Het gaat snel en de meeste mensen vinden het goed te doen.",
      "Erna is je huid roze en voelt hij strak aan. Dat trekt binnen een paar uur weg en de dag erna is je huid zichtbaar gladder.",
    ],
    naam: "SupErficial laserpeel",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Een oppervlakkige laserpeeling voor een gladdere huid en meer glans.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "SupErficial haalt met korte pulsen een dunne laag van de hoornlaag af. Dat is dezelfde gedachte als bij een chemische peeling, maar dan met licht in plaats van met zuur: er komt geen middel op je huid dat moet inwerken en de diepte is per puls te sturen. De huid eronder komt sneller aan de beurt, wat hem gladder maakt en het licht beter laat weerkaatsen. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Een paar uur licht rood. Make-up kan meestal de volgende dag weer.",
    sessies:
      "Los te doen als opfrisser of als reeks. Ook de laatste stap van Fotona 4D. [MEDISCHE-CHECK-ROJDA]",
    prijs: 0,
    bijProblemen: [
      { label: "Doffe huid", href: "/huidproblemen/doffe-huid" },
      { label: "Poriën", href: "/huidproblemen/porien" },
    ],
    wel: [
      "Maakt de huid meteen gladder en laat het licht beter weerkaatsen",
      "Werkt zonder zuren, dus de diepte is per puls te sturen",
      "Is de afsluitende stap van Fotona 4D en ook los te doen",
    ],
    niet: [
      "Blijft in de bovenste lagen; voor structuur dieper kies je FRAC3",
      "Voor verslapping is PIANO of SmoothLiftin de stap",
      "Het resultaat houd je bij met herhaling",
    ],
    stappen: [
      {
        kop: "Schoon en beschermd",
        zin: "Make-up eraf en een beschermbril op. De huid wordt kort gekoeld.",
      },
      {
        kop: "Laag voor laag",
        zin: "De behandelaar gaat in banen over je gezicht en bepaalt per zone hoe diep de peeling gaat.",
      },
      {
        kop: "Direct door",
        zin: "De huid is een paar uur licht rood. Zonbescherming hoort er de dagen erna bij.",
      },
    ],
    faq: [
      {
        vraag: "Wat is het verschil met een chemische peeling?",
        antwoord:
          "Bij een chemische peeling doet een middel het werk en bepaalt de inwerktijd de diepte. Hier doet licht het werk en stelt de behandelaar de diepte per puls in.",
      },
      {
        vraag: "Kan dit vlak voor een gelegenheid?",
        antwoord:
          "Reken op een paar uur roodheid. Een dag ervoor is meestal goed te doen; diezelfde dag is krap.",
      },
      {
        vraag: "Wat kost het?",
        antwoord:
          "Dat hangt af van de zone en of je het los doet of als onderdeel van 4D. Dat stellen we tijdens de intake vast. [PRIJS-NODIG: tarief bevestigen]",
      },
    ],
    duurMinuten: 30,
  },
  {
    slug: "smootheye",
    verwant: [
      {
        slug: "vectorlift",
        waarom: "Werkt boven de wenkbrauw, waar SmoothEye eronder werkt.",
      },
      {
        slug: "fotona-4d",
        waarom: "De complete gezichtsbehandeling op hetzelfde apparaat.",
      },
    ],
    inDeStoel: [
      "De oogschelpen zijn even wennen en voelen koel. Zodra ze zitten zie je niets meer, en dat duurt de hele behandeling.",
      "Wat je voelt is een warmte die oploopt rond je oog. De behandelaar vraagt tussendoor hoe warm het is en stelt daarop bij.",
    ],
    naam: "SmoothEye",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Laser rond de oogcontour, voor kraaienpootjes en fijne lijntjes.",
    lagen: ["opperhuid", "lederhuid-boven"],
    werking:
      "De huid rond je ogen is de dunste van je gezicht en verslapt daardoor als eerste. SmoothEye verwarmt die zone met een lange, trage puls waarbij de bovenste laag koel blijft. Bestaand collageen trekt samen en er komt nieuwe aanmaak op gang, wat de fijne lijntjes minder scherp maakt en het ooglid iets steviger. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Een paar uur licht rood rond de ogen. Je gaat er meestal direct mee de deur uit.",
    sessies:
      "Een reeks van drie tot vier, met enkele weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 150,
    bijProblemen: [
      { label: "Rimpels", href: "/huidproblemen/rimpels" },
      { label: "Wallen", href: "/huidproblemen/wallen" },
    ],
    wel: [
      "Werkt op de dunne huid rond de ogen, waar veel behandelingen niet mogen komen",
      "Maakt kraaienpootjes en fijne lijntjes minder scherp [MEDISCHE-CHECK-ROJDA]",
      "Vraagt geen naalden en geen hersteltijd",
    ],
    niet: [
      "Voor donkere kringen door pigment of vaatjes kies je een andere behandeling",
      "Voor een echt ooglidoverschot is dit te licht; dat is chirurgie [MEDISCHE-CHECK-ROJDA]",
      "Dit is een reeks; van een enkele sessie zie je weinig",
    ],
    stappen: [
      {
        kop: "Ogen beschermd",
        zin: "Er komen metalen oogschelpen onder je oogleden. Die blijven de hele behandeling zitten.",
      },
      {
        kop: "Warmte rond het oog",
        zin: "Het handstuk gaat in rustige banen over de oogcontour. De warmte loopt op en blijft daar even hangen.",
      },
      {
        kop: "Direct door",
        zin: "De huid is een paar uur licht roze. Make-up kan meestal diezelfde dag weer.",
      },
    ],
    faq: [
      {
        vraag: "Is het veilig zo dicht bij je ogen?",
        antwoord:
          "Ja, met de metalen oogschelpen die eronder gaan. Die schermen het oog volledig af en blijven de hele behandeling zitten. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Helpt dit tegen donkere kringen?",
        antwoord:
          "Meestal niet. Kringen komen van pigment, van doorschijnende vaatjes of van schaduw, en dat vraagt een andere aanpak. Wat het bij jou is stellen we tijdens de intake vast.",
      },
      {
        vraag: "Hoeveel sessies heb ik nodig?",
        antwoord:
          "Meestal drie tot vier, met enkele weken ertussen. Daarna houd je het bij met een sessie af en toe. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    duurMinuten: 30,
  },
  {
    slug: "liplase",
    verwant: [
      {
        slug: "fotona-4d",
        waarom: "De complete gezichtsbehandeling op hetzelfde apparaat.",
      },
      {
        slug: "smoothliftin",
        waarom: "Werkt ook van binnenuit, maar op het middengezicht.",
      },
    ],
    inDeStoel: [
      "Het handstuk komt eerst tegen de binnenkant van je lip en daarna aan de buitenkant. Wat je voelt is warmte, geen prikken.",
      "Direct erna zijn je lippen wat gezwollen en voelen ze warm. Dat trekt binnen enkele uren weg; bij sommige mensen duurt het tot de volgende dag. [MEDISCHE-CHECK-ROJDA]",
    ],
    naam: "LipLase",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Vollere en gladdere lippen zonder filler, met laser van binnen en buiten.",
    lagen: ["opperhuid", "lederhuid-boven"],
    werking:
      "LipLase verwarmt het weefsel van je lippen en de rand eromheen, zowel van de binnenkant als van buiten. De warmte zet de aanmaak van collageen in gang, waardoor de lip wat voller wordt en de lijntjes eromheen minder scherp. Het gaat om je eigen weefsel dat opbouwt, dus het verschil is subtieler dan bij een filler en het bouwt zich op over de reeks. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Enkele uren gezwollen lippen, soms tot een dag. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Een reeks van drie, met enkele weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 150,
    bijProblemen: [{ label: "Rimpels", href: "/huidproblemen/rimpels" }],
    wel: [
      "Werkt met je eigen weefsel, dus zonder dat er iets ingebracht wordt",
      "Maakt de lijntjes rond de lip minder scherp [MEDISCHE-CHECK-ROJDA]",
      "Vraagt geen naalden",
    ],
    niet: [
      "Voor duidelijk meer volume is een filler het middel en niet dit",
      "Het verschil is subtiel en bouwt zich op over de reeks",
      "Bij een actieve koortslip stellen we de behandeling uit [MEDISCHE-CHECK-ROJDA]",
    ],
    stappen: [
      {
        kop: "Van binnenuit",
        zin: "Het handstuk gaat eerst tegen de binnenkant van je lip. Dat voelt warm.",
      },
      {
        kop: "En van buiten",
        zin: "Daarna werkt de behandelaar aan de buitenkant, over de lip en de rand eromheen.",
      },
      {
        kop: "Even gezwollen",
        zin: "De lippen zijn enkele uren wat gezwollen. Dat trekt vanzelf weg.",
      },
    ],
    faq: [
      {
        vraag: "Is dit hetzelfde als een filler?",
        antwoord:
          "Nee. Bij een filler wordt er iets ingebracht en is het volume er meteen. Hier bouwt je eigen weefsel op, dus het verschil is subtieler en het komt over de reeks.",
      },
      {
        vraag: "Doet het pijn?",
        antwoord:
          "Het is warm en even wennen, maar het doet geen pijn. Er komt geen verdoving aan te pas.",
      },
      {
        vraag: "Hoe lang houdt het aan?",
        antwoord:
          "Dat verschilt per persoon. Het gaat om opgebouwd collageen, en dat neemt na verloop van tijd weer af; de meeste mensen komen periodiek terug. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    duurMinuten: 30,
  },
  {
    slug: "vectorlift",
    verwant: [
      {
        slug: "smootheye",
        waarom: "Werkt op de oogcontour, direct onder de zone van VectorLift.",
      },
      {
        slug: "fotona-4d",
        waarom: "De complete gezichtsbehandeling op hetzelfde apparaat.",
      },
    ],
    inDeStoel: [
      "Wat je voelt is een oplopende warmte op je voorhoofd. Het is geen prikken maar warmte die blijft hangen.",
      "Erna voelt de huid warm en strak. Dat trekt binnen een paar uur weg.",
    ],
    naam: "VectorLift",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Laser wenkbrauwlift en versteviging van het voorhoofd, zonder naalden.",
    lagen: ["lederhuid-boven", "lederhuid-diep"],
    werking:
      "VectorLift verwarmt het weefsel van je voorhoofd en de zone boven je wenkbrauw in vaste banen. Doordat collageen samentrekt en er nieuwe aanmaak op gang komt, komt de wenkbrauw iets omhoog te liggen en wordt het voorhoofd steviger. Het gaat om millimeters en om je eigen weefsel, niet om een chirurgische lift. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Een paar uur licht rood op het voorhoofd. Je gaat er direct mee de deur uit.",
    sessies:
      "Een reeks van drie tot vier, met enkele weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 150,
    bijProblemen: [
      { label: "Huidverslapping", href: "/huidproblemen/huidverslapping" },
      { label: "Rimpels", href: "/huidproblemen/rimpels" },
    ],
    wel: [
      "Tilt de wenkbrauwlijn iets op met je eigen weefsel [MEDISCHE-CHECK-ROJDA]",
      "Maakt het voorhoofd steviger zonder naalden of snijden",
      "Is goed te combineren met SmoothEye op de oogcontour",
    ],
    niet: [
      "Dit is geen chirurgische wenkbrauwlift; het gaat om millimeters [MEDISCHE-CHECK-ROJDA]",
      "Voor fronsrimpels door spierbeweging is dit niet het middel",
      "Dit is een reeks; van een enkele sessie zie je weinig",
    ],
    stappen: [
      {
        kop: "Bril op",
        zin: "Je krijgt een beschermbril op en de behandelaar bepaalt de banen op je voorhoofd.",
      },
      {
        kop: "Warmte in lijnen",
        zin: "Het handstuk gaat in vaste banen over het voorhoofd en boven de wenkbrauw.",
      },
      {
        kop: "Direct door",
        zin: "De huid is een paar uur licht roze. Make-up kan diezelfde dag weer.",
      },
    ],
    faq: [
      {
        vraag: "Hoeveel gaat mijn wenkbrauw omhoog?",
        antwoord:
          "Het gaat om millimeters. Dit is geen chirurgische lift; wat je opbouwt is je eigen collageen, en hoeveel dat is verschilt per persoon. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Kan ik dit combineren met SmoothEye?",
        antwoord:
          "Ja, die twee sluiten op elkaar aan: VectorLift werkt boven de wenkbrauw en SmoothEye op de oogcontour eronder.",
      },
      {
        vraag: "Hoe lang houdt het aan?",
        antwoord:
          "Dat verschilt per persoon en het is niet blijvend. De meeste mensen komen periodiek terug om het bij te houden. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    duurMinuten: 30,
  },
  {
    slug: "fotona-acne-control",
    verwant: [
      {
        slug: "acne-traject",
        waarom: "Het traject waar deze sessie meestal onderdeel van is.",
      },
      {
        slug: "fotona-scar-repair",
        waarom: "Voor littekens die al zijn ontstaan.",
      },
    ],
    inDeStoel: [
      "Je krijgt een beschermbril op en de behandelaar gaat met korte pulsen over de aangedane zones. Op ontstoken plekken voel je het duidelijker dan op de rustige huid.",
      "Erna ben je een paar uur rood. Bij actieve ontstekingen kan de huid de eerste dag wat geprikkeld aanvoelen; dat hoort erbij. [MEDISCHE-CHECK-ROJDA]",
    ],
    naam: "Fotona Acne Control",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Laser bij actieve acne, gericht op de ontsteking en de talgklier.",
    lagen: ["opperhuid", "lederhuid-boven"],
    werking:
      "Bij actieve acne mikt de laser op twee dingen tegelijk: de ontsteking in de huid en de talgklier die hem voedt. De warmte remt de activiteit van de klier en werkt op de bacterie die bij acne een rol speelt. Het is geen vervanging van een acnetraject maar een stap erbinnen, want acne heeft een verloop en vraagt om meer dan een sessie. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Een paar uur rood. Bij actieve ontstekingen kan de huid de eerste dag wat geprikkeld aanvoelen. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Meestal een reeks binnen een acnetraject, met enkele weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 0,
    bijProblemen: [
      { label: "Acne", href: "/huidproblemen/acne" },
      { label: "Onzuivere huid", href: "/huidproblemen/onzuivere-huid" },
    ],
    wel: [
      "Werkt op de ontsteking en op de talgklier tegelijk [MEDISCHE-CHECK-ROJDA]",
      "Is te combineren met de peelings en producten uit het acnetraject",
      "Vraagt geen naalden en geen zuren op de huid",
    ],
    niet: [
      "Vervangt het acnetraject niet; het is een stap daarbinnen",
      "Bij zware of littekenvormende acne kijkt eerst een arts mee [MEDISCHE-CHECK-ROJDA]",
      "Voor littekens die al zijn ontstaan kies je Fotona Scar Repair",
    ],
    stappen: [
      {
        kop: "Beoordelen",
        zin: "De huidtherapeut bekijkt of het om actieve ontstekingen gaat en welke zones aan de beurt zijn.",
      },
      {
        kop: "Laser op de zone",
        zin: "Het handstuk gaat over de aangedane plekken. Je voelt korte warme tikjes.",
      },
      {
        kop: "Verder in het traject",
        zin: "De sessie staat zelden op zichzelf; hij past binnen het acnetraject met de producten en controles.",
      },
    ],
    faq: [
      {
        vraag: "Is dit genoeg om van mijn acne af te komen?",
        antwoord:
          "Zelden. Acne heeft een verloop en vraagt om een traject met behandelingen, producten en controles. Deze laser is daar een stap in en geen vervanging van.",
      },
      {
        vraag: "Kan het bij ontstoken acne?",
        antwoord:
          "Ja, en daar is het juist voor bedoeld. De huidtherapeut beoordeelt vooraf welke zones geschikt zijn. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Wat kost het?",
        antwoord:
          "Dat hangt af van of je het los doet of binnen een acnetraject, en dat stellen we tijdens de intake vast. [PRIJS-NODIG: tarief bevestigen]",
      },
    ],
    duurMinuten: 30,
  },
  {
    slug: "fotona-scar-repair",
    verwant: [
      {
        slug: "littekentherapie",
        waarom: "Voor littekens na een operatie of keizersnede.",
      },
      {
        slug: "skinpen",
        waarom: "Microneedling op dezelfde littekens, vaak in combinatie.",
      },
    ],
    inDeStoel: [
      "Elke puls voelt als een kort, scherp tikje. Op littekenweefsel voel je vaak minder dan op de huid eromheen, want de zenuwen lopen daar anders.",
      "Erna is de zone rood en warm. Hoe lang dat duurt hangt af van de diepte waarop is gewerkt; reken op een tot enkele dagen. [MEDISCHE-CHECK-ROJDA]",
    ],
    naam: "Fotona Scar Repair",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Laser op littekens: acnelittekens, operatielittekens en striae.",
    lagen: ["opperhuid", "lederhuid-boven", "lederhuid-diep"],
    werking:
      "Een litteken is weefsel dat anders is opgebouwd dan de huid eromheen: strakker, met vezels die in een andere richting lopen. De laser brengt in dat weefsel gecontroleerde warmte aan, waarna het herstel de vezels opnieuw ordent. Daardoor wordt het litteken vlakker en minder rood, en sluit het beter aan bij de huid eromheen. Weg gaat het niet. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Een tot enkele dagen rood, afhankelijk van de diepte en de zone. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Meestal drie tot zes, met vier tot zes weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 0,
    bijProblemen: [
      { label: "Acnelittekens", href: "/huidproblemen/acne-littekens" },
      { label: "Littekens en striae", href: "/huidproblemen/littekens" },
      { label: "Striae", href: "/huidproblemen/striae" },
    ],
    wel: [
      "Werkt op acnelittekens, operatielittekens en striae",
      "Maakt het litteken vlakker en minder rood [MEDISCHE-CHECK-ROJDA]",
      "Is te combineren met microneedling in hetzelfde traject",
    ],
    niet: [
      "Een litteken is blijvend weefsel; het wordt rustiger, niet weg [MEDISCHE-CHECK-ROJDA]",
      "Een litteken dat nog geneest laten we eerst met rust",
      "Bij een keloid loopt de behandeling via je arts [MEDISCHE-CHECK-ROJDA]",
    ],
    stappen: [
      {
        kop: "Beoordelen",
        zin: "De huidtherapeut kijkt hoe oud het litteken is, hoe diep het zit en welke kant het op loopt. Dat bepaalt de instelling. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        kop: "Laser op het litteken",
        zin: "De pulsen gaan gericht over het litteken en een stukje van de huid eromheen.",
      },
      {
        kop: "Herstel doet het werk",
        zin: "In de weken erna ordent het weefsel zich opnieuw. Daarom zitten er vier tot zes weken tussen de sessies.",
      },
    ],
    faq: [
      {
        vraag: "Gaat mijn litteken helemaal weg?",
        antwoord:
          "Nee. Een litteken is blijvend weefsel. Wat er wel gebeurt is dat het vlakker en minder rood wordt en beter aansluit bij de huid eromheen. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Hoe oud mag een litteken zijn?",
        antwoord:
          "Een litteken dat nog aan het genezen is laten we eerst met rust. Daarna geldt: hoe jonger, hoe meer er te winnen valt, maar ook bij oude littekens is er vaak iets te doen. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Wat kost het?",
        antwoord:
          "Dat hangt af van de lengte van het litteken en het aantal sessies, en dat stellen we tijdens de intake vast. [PRIJS-NODIG: tarief bevestigen]",
      },
    ],
    duurMinuten: 45,
  },
  {
    slug: "fotona-resurfacing",
    verwant: [
      {
        slug: "frac3",
        waarom: "Werkt fractioneel op de diepte, met minder hersteltijd.",
      },
      {
        slug: "superficial-peel",
        waarom: "De lichte variant, zonder noemenswaardige hersteltijd.",
      },
    ],
    inDeStoel: [
      "Elke puls voelt als een korte warme tik. Hoe dieper de instelling, hoe duidelijker je het merkt; de behandelaar vraagt tussendoor hoe het gaat.",
      "Erna is je huid rood en warm, en in de dagen die volgen komt de oude bovenlaag eraf. Niet krabben en niet schrobben; dat is precies waar een vlek van blijft. [MEDISCHE-CHECK-ROJDA]",
    ],
    naam: "Fotona Resurfacing",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Huidvernieuwing met laser, voor poriën, textuur en een gladdere huid.",
    lagen: ["hoornlaag", "opperhuid", "lederhuid-boven"],
    werking:
      "Resurfacing haalt gecontroleerd een deel van de bovenste huidlaag weg en verwarmt de laag eronder. De huid vernieuwt zich daarna sneller dan hij uit zichzelf zou doen, en dat maakt poriën minder opvallend en de structuur gelijkmatiger. Hoe diep dat gaat bepaalt de behandelaar per zone, en die diepte bepaalt ook hoeveel hersteltijd je nodig hebt. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Van een paar uur tot enkele dagen, afhankelijk van de gekozen diepte. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Een reeks van drie tot vier, met vier tot zes weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 0,
    bijProblemen: [
      { label: "Poriën", href: "/huidproblemen/porien" },
      { label: "Doffe huid", href: "/huidproblemen/doffe-huid" },
      { label: "Acnelittekens", href: "/huidproblemen/acne-littekens" },
    ],
    wel: [
      "Maakt poriën minder opvallend en de structuur gelijkmatiger [MEDISCHE-CHECK-ROJDA]",
      "De diepte is per zone in te stellen, dus ook lichter uit te voeren",
      "Werkt zonder zuren op de huid",
    ],
    niet: [
      "Voor verslapping is PIANO of SmoothLiftin de stap",
      "Hoe dieper de instelling, hoe meer hersteltijd je nodig hebt",
      "Vlak voor veel zon plannen we het niet in [MEDISCHE-CHECK-ROJDA]",
    ],
    stappen: [
      {
        kop: "Diepte kiezen",
        zin: "De huidtherapeut bepaalt per zone hoe diep het gaat, op je huid en op je hersteltijd. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        kop: "Laag voor laag",
        zin: "De laser gaat in banen over de zone en haalt gecontroleerd een deel van de bovenlaag weg.",
      },
      {
        kop: "Herstel",
        zin: "De huid is rood en vernieuwt zich in de dagen erna. Zonbescherming hoort er de weken daarna bij. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    faq: [
      {
        vraag: "Hoeveel hersteltijd heb ik nodig?",
        antwoord:
          "Dat hangt af van de diepte. Licht uitgevoerd ben je een paar uur rood; dieper reken je op enkele dagen. Dat spreken we vooraf af, zodat het niet samenvalt met iets belangrijks. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Wat is het verschil met een chemische peeling?",
        antwoord:
          "Bij een peeling doet een middel het werk en bepaalt de inwerktijd de diepte. Hier doet licht het werk en stelt de behandelaar de diepte per zone in.",
      },
      {
        vraag: "Wat kost het?",
        antwoord:
          "Dat hangt af van de zone en de diepte, en dat stellen we tijdens de intake vast. [PRIJS-NODIG: tarief bevestigen]",
      },
    ],
    duurMinuten: 45,
  },
  {
    slug: "hairestart",
    verwant: [
      { slug: "xl-hair", waarom: "Het traject waar deze sessies in passen." },
    ],
    inDeStoel: [
      "Je zit rechtop en de behandelaar gaat in banen over je hoofdhuid. Wat je voelt is warmte die per baan even oploopt.",
      "Erna kun je direct door met je dag en je haar gewoon wassen. Er is niets aan je te zien.",
    ],
    naam: "HAIRestart",
    apparaat: "Fotona 4D TimeWalker",
    categorie: "laser",
    kort: "Laser op de hoofdhuid bij beginnende haarverdunning.",
    lagen: ["opperhuid", "lederhuid-boven"],
    werking:
      "HAIRestart werkt op de hoofdhuid met warmte die de doorbloeding en de activiteit rond de haarzakjes stimuleert. Het richt zich op zakjes die er nog zijn maar minder actief; waar het zakje verdwenen is, valt er niets meer te starten. Daarom telt het moment: hoe eerder er naar gekeken wordt, hoe meer er te behouden valt. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Geen. Je kunt er direct mee de deur uit en je haar gewoon wassen.",
    sessies:
      "Een traject over meerdere maanden, want haar groeit in cycli. Het aantal hoor je tijdens de intake. [MEDISCHE-CHECK-ROJDA]",
    prijs: 0,
    wel: [
      "Richt zich op haarzakjes die nog aanwezig zijn maar minder actief [MEDISCHE-CHECK-ROJDA]",
      "Werkt zonder naalden en zonder hersteltijd",
      "Is te combineren met het XL Hair-traject",
    ],
    niet: [
      "Waar het haarzakje weg is, komt geen haar terug [MEDISCHE-CHECK-ROJDA]",
      "Heeft de haaruitval een medische oorzaak, dan hoort dat bij een arts",
      "Reken op maanden; haar groeit in cycli en die laten zich niet opjagen",
    ],
    stappen: [
      {
        kop: "Hoofdhuid beoordelen",
        zin: "De huidtherapeut kijkt waar het dunner wordt en sinds wanneer. Dat is het vertrekpunt. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        kop: "Laser over de zone",
        zin: "Het handstuk gaat in banen over de hoofdhuid. Je voelt warmte, geen prikken.",
      },
      {
        kop: "Over de maanden",
        zin: "Het traject loopt door over meerdere maanden, want haargroei volgt cycli.",
      },
    ],
    faq: [
      {
        vraag: "Werkt dit bij kale plekken?",
        antwoord:
          "Nee. Waar het haarzakje verdwenen is valt er niets te starten. Dit richt zich op zakjes die er nog zijn maar minder actief zijn geworden. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Wanneer zie ik verschil?",
        antwoord:
          "Reken op maanden. Haar groeit in cycli en dit traject volgt die cycli. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Wat kost het?",
        antwoord:
          "Dat hangt af van de duur van het traject, en dat stellen we tijdens de intake vast. [PRIJS-NODIG: tarief bevestigen]",
      },
    ],
    duurMinuten: 30,
  },
  {
    slug: "nightlase",
    fotoInDeStoel: {
      src: "/images/shoot/stoel-nightlase.jpg",
      alt: "Het laserhandstuk wordt achter in de mond gebracht tijdens een NightLase-behandeling",
    },
    inDeStoel: [
      "Deze behandeling werkt op je gehemelte en niet op je huid. Je mond blijft open met een spreider en de laser gaat er in drie of vier doorgangen overheen.",
      "Het is warm en het is even wennen, maar het doet geen pijn. Er komt geen mes en geen verdoving aan te pas.",
      "Erna kun je gewoon eten en drinken. Sommige mensen hebben een dag een wat droge keel. [MEDISCHE-CHECK-ROJDA]",
    ],
    naam: "NightLase",
    apparaat: "Fotona TimeWalker",
    categorie: "overig",
    kort: "Laser tegen snurken. Het zachte gehemelte wordt steviger, zonder operatie of beugel.",
    lagen: [],
    werking:
      "Het zachte gehemelte en het weefsel achter in je mond worden in een reeks pulsen gecontroleerd verwarmd. Daardoor trekt het weefsel samen en gaat het minder meetrillen op de luchtstroom, en juist die trilling is het geluid dat snurken heet. Er wordt niet gesneden en er blijft niets achter. [MEDISCHE-CHECK-ROJDA]",
    herstel:
      "Je kunt na NightLase normaal eten en praten. Sommige mensen voelen tijdelijk een licht schrapend gevoel in de keel. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Een reeks van drie, met ongeveer drie weken ertussen. Het effect bouwt over die reeks op en is niet blijvend; herhalen na verloop van tijd hoort erbij. [MEDISCHE-CHECK-ROJDA]",
    prijs: 0,
    duurMinuten: 30,
    bijProblemen: [{ label: "Snurken", href: "/snurken" }],
    wel: [
      "Werkt zonder snijden, zonder naalden en zonder iets dat je 's nachts in moet doen",
      "Je kunt er meteen na weer gewoon eten, praten en werken",
      "Is te herhalen als het effect terugloopt",
    ],
    niet: [
      "Bij ademstops hoort eerst slaaponderzoek via een arts [MEDISCHE-CHECK-ROJDA]",
      "Het weefsel geeft na verloop van tijd mee, dus je herhaalt het",
      "Komt het geluid ergens anders vandaan, dan kijkt een arts mee [MEDISCHE-CHECK-ROJDA]",
    ],
    stappen: [
      {
        kop: "Eerst kijken waar het geluid zit",
        zin: "Niet elk snurkgeluid komt uit het zachte gehemelte. Dat bepaalt of dit bij jou iets oplevert.",
      },
      {
        kop: "Pulsen op het gehemelte",
        zin: "In een vast patroon over het weefsel, in ongeveer een half uur. Je zit erbij en je bent bij kennis.",
      },
      {
        kop: "Drie keer, met weken ertussen",
        zin: "Het weefsel trekt tussen de sessies door aan. Na de derde weet je wat het bij jou doet.",
      },
    ],
    faq: [
      {
        vraag: "Doet het pijn?",
        antwoord:
          "Je voelt warmte achter in je mond. Er komt geen verdoving aan te pas en er wordt niets gesneden. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Werkt het ook bij slaapapneu?",
        antwoord:
          "Daar is dit geen behandeling voor. Zijn er ademstops gemeld, of ben je overdag ongewoon slaperig, dan hoort daar eerst slaaponderzoek bij via je huisarts. Weet je wat er speelt, dan kijken we wat we kunnen doen. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Hoe lang houdt het aan?",
        antwoord:
          "Dat verschilt per persoon en het is niet blijvend. We spreken vooraf af wanneer we opnieuw kijken. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
  },
  {
    slug: "nordlys-ipl",
    fotoInDeStoel: {
      src: "/images/shoot/beh-nordlys-in-de-stoel.jpg",
      alt: "Behandeling met de Nordlys, met beschermbril op",
    },
    inDeStoel: [
      "Er gaat een koele gel op en daarna komt het handstuk op je huid. Elke flits voelt als een kort tikje met een elastiekje, en je ziet hem ook door je oogleden heen; daarom gaat er een bril op.",
      "Bij vaatjes en pigment is de reactie meteen te zien: een vaatje wordt donkerder, een pigmentvlek komt tijdelijk scherper naar voren. Dat hoort erbij en betekent niet dat het erger wordt.",
      "Erna ben je een paar uur rood. Pigment dat naar boven komt vervaagt in de dagen erna. Zonbescherming is hier geen advies maar onderdeel van de behandeling. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/beh-nordlys.jpg",
      alt: "Nordlys IPL-behandeling met beschermbril",
    },
    naam: "Nordlys IPL",
    apparaat: "Nordlys",
    categorie: "laser",
    kort: "Breed licht op roodheid, vaatjes en pigment. Minimale hersteltijd.",
    lagen: ["opperhuid", "lederhuid-boven"],
    werking:
      "IPL werkt met een bereik van golflengtes in plaats van met een enkele, en een filter haalt het grofste eruit. Daardoor raakt het meerdere doelen tegelijk: roodheid, zichtbare vaatjes en oppervlakkig pigment. Het komt gemiddeld minder diep dan een laser, en dat is precies wat je nodig hebt bij oppervlakkige roodheid of pigment. [MEDISCHE-CHECK-ROJDA]",
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
      "Voor een enkel plekje is een laser met een golflengte preciezer",
      "Voor pigment of vaatjes die dieper zitten kies je laser",
      "Bij een donkerder huidtype kijken we naar een alternatief [MEDISCHE-CHECK-ROJDA]",
    ],
    bijProblemen: [
      { label: "Rosacea", href: "/huidproblemen/rosacea" },
      { label: "Pigmentvlekken", href: "/huidproblemen/pigmentvlekken" },

      { label: "Couperose", href: "/huidproblemen/couperose" },
      { label: "Ouderdomsvlekken", href: "/huidproblemen/ouderdomsvlekken" },
    ],
    duurMinuten: 45,
  },
  {
    slug: "led-therapie",
    inDeStoel: [
      "Je krijgt een bril op en ligt met je ogen dicht. Het paneel hangt op een handbreedte boven je gezicht en geeft licht in de kleur die de behandelaar heeft ingesteld. Er is licht en verder weinig: geen prik, geen tinteling, hooguit milde warmte.",
      "De sessie loopt op een vaste tijd. Meestal plannen we hem aansluitend op een andere behandeling, terwijl je toch al ligt, en dan is het het rustigste deel van de afspraak.",
      "Erna ga je direct door met je dag. Er is geen roodheid om te verbergen en er zijn geen instructies voor thuis.",
    ],
    foto: {
      src: "/images/shoot/beh-led-therapie.jpg",
      alt: "LED-therapie met rood licht op het gezicht, in de behandelkamer",
    },
    naam: "LED-therapie",
    apparaat: "Precision Photonic System",
    categorie: "laser",
    kort: "Licht dat de huid rustiger maakt. In meerdere golflengtes, zonder naalden of zuren.",
    lagen: ["opperhuid"],
    werking:
      "Bij LED-therapie neemt de huid licht op van een bepaalde golflengte. Dat licht wordt opgenomen door de mitochondriën in je cellen, de onderdelen die energie leveren, waarna er meer energie beschikbaar is voor herstel en aanmaak. Die werking heet fotobiomodulatie. Er wordt niets verwarmd en niets weggehaald, en juist daarom is er geen hersteltijd. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Geen.",
    sessies:
      "Meestal aansluitend op een andere behandeling. Als losse reeks bij roodheid, met een paar dagen tot een week ertussen. [MEDISCHE-CHECK-ROJDA]",
    prijs: 30,
    bijProblemen: [
      { label: "Rosacea", href: "/huidproblemen/rosacea" },
      { label: "Roodheid", href: "/huidproblemen/couperose" },
      { label: "Gevoelige huid", href: "/huidproblemen/gevoelige-huid" },
    ],
    wel: [
      "Maakt roodheid en rosacea rustiger [MEDISCHE-CHECK-ROJDA]",
      "Ondersteunt het herstel na needling of een peeling",
      "Komt bovenop een behandeling zonder extra hersteltijd",
    ],
    niet: [
      "Voor pigment of haargroei kies je laser of IPL",
      "Voor structuur en littekens werkt microneedling dieper",
      "Licht werkt door herhaling, dus je plant een reeks",
    ],
    welNietKop: { kop: "Waar licht", accent: "wel en niet bij helpt" },
    stappen: [
      {
        kop: "De kleur gekozen",
        zin: "Blauw blijft aan de oppervlakte, rood komt in de lederhuid en infrarood komt het verst. De behandelaar kiest wat past. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        kop: "Onder de boog",
        zin: "Ogen dicht, bril op, licht aan. Het paneel hangt op een handbreedte boven je gezicht en de tijd staat vooraf ingesteld.",
      },
      {
        kop: "Direct door",
        zin: "Geen roodheid, geen wachttijd en geen instructies voor thuis. Make-up mag diezelfde dag weer.",
      },
    ],
    faq: [
      {
        vraag: "Waarom is dit zo goedkoop?",
        antwoord:
          "Omdat de behandeling kort is en er geen materiaal bij opgaat. Vaak plannen we hem aansluitend op iets anders, terwijl je toch al ligt.",
      },
      {
        vraag: "Kan ik alleen hiervoor komen?",
        antwoord:
          "Ja, dat kan. Bij roodheid of rosacea plannen mensen het ook als losse reeks, omdat het licht dan het werk doet.",
      },
      {
        vraag: "Wat merk ik ervan tijdens de sessie?",
        antwoord:
          "Weinig. Er komt licht op lage sterkte en hooguit voel je milde warmte. Je ogen blijven dicht en je krijgt een bril op.",
      },
      {
        vraag: "Op welk apparaat gebeurt dit?",
        antwoord:
          "Op het Precision Photonic System van Skin Complete. Welke golflengte en welke tijd erbij horen, bepaalt de behandelaar na de huidanalyse.",
      },
    ],
    duurMinuten: 20,
  },

  /* ── Pigmenttrajecten ──────────────────────────────────────────────────── */
  {
    slug: "cosmelan-dermamelan",
    foto: {
      src: "/images/shoot/beh-cosmelan-masker.jpg",
      alt: "Het Cosmelan-masker wordt op het gezicht aangebracht",
    },
    inDeStoel: [
      "De eerste afspraak duurt kort. Er gaat een masker op je gezicht dat je zelf mee naar huis neemt en er thuis afhaalt, na het aantal uren dat je meekrijgt. Dat aantal is geen richtlijn maar een afspraak.",
      "De weken daarna doe jij het werk. Je krijgt producten mee met een schema, en dat schema volgen bepaalt de uitkomst meer dan wat er in de kliniek gebeurt.",
      "Na een paar dagen ga je vervellen. We spreken daarom vooraf af wanneer je begint, zodat het niet samenvalt met een vakantie of een drukke week. [MEDISCHE-CHECK-ROJDA]",
    ],
    naam: "Cosmelan en dermamelan",
    apparaat: "Mesoestetic",
    categorie: "pigment",
    kort: "Een traject van maanden tegen hyperpigmentatie en melasma, met begeleiding in de kliniek en thuis.",
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
      "Het thuiswerk hoort erbij; zonder dat deel loopt het traject vast",
      "Zon brengt pigment terug, dus bescherming blijft onderdeel van het plan",
      "Of het bij jou past, stelt de behandelaar tijdens de intake vast [MEDISCHE-CHECK-ROJDA]",
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
    inDeStoel: [
      "Een behandeling in een gebied waar je je kwetsbaar voelt, en daar wordt naar gehandeld. Je hoort vooraf precies wat er gebeurt en wat je aan- of uithoudt, en je kunt op elk moment zeggen dat het genoeg is.",
      "De behandeling zelf is een peeling: vloeistof erop, kort inwerken, eraf. Prikken hoort erbij, branden niet.",
      "Erna is de huid daar een paar dagen gevoeliger. Strakke kleding en sporten laat je die dagen even. [MEDISCHE-CHECK-ROJDA]",
    ],
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
      "Komt de verkleuring door scheren of wrijving, dan blijft die oorzaak staan [MEDISCHE-CHECK-ROJDA]",
      "Het doel is een egale kleur, dus je huid wordt niet lichter dan hij van zichzelf is",
      "Bij een pas onthaarde huid wachten we tot die hersteld is",
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
    fotoInDeStoel: {
      src: "/images/shoot/stoel-laserontharing.jpg",
      alt: "Laserontharing met oogbescherming op",
    },
    inDeStoel: [
      "De zone wordt geschoren als dat nog niet gebeurd is, want de laser moet bij de wortel kunnen en niet bij het haar erboven. Daarna gaat er een bril op en werkt de behandelaar de zone in banen af.",
      "Elke puls voelt als een warm tikje, met een koude stoot er direct omheen. Op je bovenlip en langs je bikinilijn voel je meer dan op je benen; dat is overal zo en het gaat snel voorbij.",
      "Erna is de zone een paar uur rood en warm. Sauna, sport en zon laat je die dag even, en zonbescherming hoort daarna bij het traject en niet erna. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/apparaat-gentle-laser.jpg",
      alt: "Laserontharing van de oksel met beschermbrillen",
    },
    naam: "Laserontharing",
    apparaat: "Gentle Laser Pro-U",
    categorie: "ontharing",
    kort: "De haarwortel uitschakelen. Per zone of als pakket, voor dames en heren.",
    lagen: ["lederhuid-diep"],
    werking:
      "De laser mikt op het pigment in de haarwortel, en die zit diep. Wat de energie opneemt warmt op, de rest niet. Daarom werkt de laser gericht, en daarom stelt de behandelaar hem in op jouw huidtype. Eén sessie raakt alleen de haren die op dat moment groeien, en dat is nooit alles tegelijk. [MEDISCHE-CHECK-ROJDA]",
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
      "Haren groeien in fasen, dus er zijn meerdere sessies nodig",
      "Voor pigment of textuur kies je IPL",
      "Bij een gebruinde huid plannen we het later in [MEDISCHE-CHECK-ROJDA]",
    ],
    bijProblemen: [
      { label: "Alle zones en prijzen", href: "/laserontharing/configurator" },
      { label: "Over laserontharing", href: "/laserontharing" },

      { label: "Ingegroeide haren", href: "/huidproblemen/ingegroeide-haren" },
    ],
    duurMinuten: 30,
  },

  /* ── Overig ────────────────────────────────────────────────────────────── */
  {
    slug: "xl-hair",
    inDeStoel: [
      "Injecties in de hoofdhuid, met een injector die de diepte gelijk houdt. Het is een reeks prikjes die snel achter elkaar gaan; de hoofdhuid is gevoelig, en dat merk je vooral in de eerste minuut.",
      "Dit is een traject en geen losse sessie. Haar groeit in cycli, dus het resultaat bouwt zich over maanden op. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/beh-xl-hair.jpg",
      alt: "De XL Hair-behandeling wordt toegelicht bij een cliënt",
    },
    naam: "XL Hair",
    apparaat: "U225 mesotherapie",
    categorie: "overig",
    kort: "Tegen haaruitval en dunner wordend haar. Een traject van maanden, afgestemd op je hoofdhuid.",
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
      "Waar het haarzakje weg is, komt geen haar terug [MEDISCHE-CHECK-ROJDA]",
      "Heeft de haaruitval een medische oorzaak, dan hoort dat bij een arts",
      "Wat je opbouwt houd je bij, anders loopt het weer terug",
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
          "Reken op maanden. Haar groeit in cycli, en dit traject volgt die cycli. [MEDISCHE-CHECK-ROJDA]",
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
    fotoInDeStoel: {
      src: "/images/shoot/stoel-acne-traject.jpg",
      alt: "Een behandeling bij actieve acne",
    },
    inDeStoel: [
      "Het traject begint met een meting en een gesprek, niet met een behandeling. Wat daaruit komt bepaalt de volgorde, en die volgorde is de kern: ontsteking eerst, littekens later, nooit tegelijk.",
      "Daarna zie je ons met vaste tussenpozen. Elke afspraak is deels behandeling en deels controle, en bij elke controle wordt er opnieuw gemeten onder dezelfde belichting.",
      "Tussen de afspraken door verzorg je je huid zelf, met de producten en het schema die je meekrijgt. Dat bepaalt voor een groot deel het resultaat. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/beh-acne-verzorging.jpg",
      alt: "Huidtherapeut brengt een verzorgingsproduct aan tijdens een acnebehandeling",
    },
    naam: "Acnetraject",
    apparaat: "Blemiderm",
    categorie: "overig",
    kort: "Een begeleid traject voor acne: behandelingen in de kliniek, producten en controles thuis.",
    lagen: ["hoornlaag", "opperhuid"],
    werking:
      "Een traject in plaats van losse behandelingen, omdat acne over weken verandert en niet op een moment ontstaat. Het begint met een meting en een schema voor thuis; daarna volgen behandelingen in de kliniek met om de vier tot zes weken een controle waarin het schema wordt bijgesteld. Het eindigt met afbouwen naar wat je zelf volhoudt. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Wisselt per fase van het traject. [MEDISCHE-CHECK-ROJDA]",
    sessies:
      "Een traject van drie tot zes maanden, met een controle om de vier tot zes weken. [MEDISCHE-CHECK-ROJDA]",
    prijs: 570,
    bijProblemen: [
      { label: "Acne", href: "/huidproblemen/acne" },
      { label: "Onzuivere huid", href: "/huidproblemen/onzuivere-huid" },
    ],
    wel: [
      "Volgt het verloop van acne in plaats van er één moment uit te pikken",
      "Combineert behandelingen in de kliniek met producten en controles thuis",
      "Legt bij elke controle vast wat er veranderd is, zodat je niet op je geheugen vergelijkt",
    ],
    niet: [
      "Acne heeft een verloop, dus een einddatum spreken we niet vooraf af [MEDISCHE-CHECK-ROJDA]",
      "Bij zware of littekenvormende acne kijkt eerst een arts mee [MEDISCHE-CHECK-ROJDA]",
      "Het grootste deel gebeurt thuis, dus de producten horen bij het traject",
    ],
    stappen: [
      {
        kop: "Meting vooraf",
        zin: "We kijken waar het zit, om welk type het gaat en hoe je huid er nu voor staat.",
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
          "Drie tot zes maanden, met een controle om de vier tot zes weken. Waar je in die marge valt hangt af van het type acne en van hoe je huid reageert, en dat hoor je na de meting. [GEGEVEN-NODIG: bevestiging van de trajectduur]",
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
    foto: {
      src: "/images/shoot/beh-jongeren-acne.jpg",
      alt: "Producten uit het jongerentraject bij een client met acne",
    },
    inDeStoel: [
      "Hetzelfde traject, ingericht op een leven met school, sport en een bijbaan. De afspraken zijn korter en de thuisroutine is met opzet klein gehouden: drie stappen die je ook volhoudt als je te laat opstaat.",
      "Je ouders mogen mee naar binnen, en je mag het gesprek ook alleen doen. Dat kies je zelf.",
      "Bij de controles kijken we samen naar de meting van de vorige keer. Niet om te beoordelen of je je best hebt gedaan, maar om te zien of het plan klopt. [MEDISCHE-CHECK-ROJDA]",
    ],
    naam: "Jongeren acne traject",
    categorie: "overig",
    kort: "Een begeleid programma van drie maanden, opgezet voor jongeren tot en met achttien jaar.",
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
      "Hoe je huid er na drie maanden bij staat, verschilt per persoon [MEDISCHE-CHECK-ROJDA]",
      "Bij ernstige acne met kans op littekens kijkt eerst een arts mee [MEDISCHE-CHECK-ROJDA]",
      "Onder de achttien komt er iemand mee en tekenen je ouders mee",
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
        zin: "Je gaat naar huis met een verzorgingsschema dat je zelf kunt volhouden.",
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
    inDeStoel: [
      "De eerste afspraak gaat vooral over kijken en meten. Hoe oud een litteken is en hoe het aanvoelt bepaalt wat er mogelijk is, en dat is een gesprek dat je niet in vijf minuten voert.",
      "De behandeling zelf hangt af van wat eruit komt, en dat verschilt per litteken. Wat overal geldt is dat het een reeks is en geen losse sessie, met tussenpozen die het weefsel de tijd geven.",
      "Bij een litteken na een operatie of keizersnede rekenen we naar lengte. Dat hoor je vooraf, in een bedrag en niet in een schatting. [MEDISCHE-CHECK-ROJDA]",
    ],
    naam: "Littekentherapie",
    categorie: "overig",
    kort: "Voor littekens na een operatie of keizersnede. De prijs volgt de lengte van het litteken.",
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

      { label: "Keloiden", href: "/huidproblemen/keloiden" },
    ],
    wel: [
      "Is afgestemd op littekens van een operatie of keizersnede, die anders reageren dan acnelittekens [MEDISCHE-CHECK-ROJDA]",
      "Rekent naar de lengte van het litteken, zodat je vooraf weet waar je aan toe bent",
      "Kijkt eerst naar de leeftijd van het litteken, want dat bepaalt wat er nog te winnen valt [MEDISCHE-CHECK-ROJDA]",
    ],
    niet: [
      "Een litteken is blijvend weefsel; het wordt vlakker en rustiger [MEDISCHE-CHECK-ROJDA]",
      "Een litteken dat nog geneest laten we eerst met rust, daarna beginnen we",
      "Hoeveel het opschuift verschilt per persoon, dus we leggen het verloop vast",
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
          "Meestal drie tot zes, met vier tot zes weken ertussen. Bij een lang of jong litteken loopt dat op; bij een oud en smal litteken blijft het aan de onderkant. Dat hoor je na de meting. [GEGEVEN-NODIG: aantal sessies per littekentype]",
      },
    ],
    duurMinuten: 45,
  },
  {
    slug: "fibromen",
    fotoInDeStoel: {
      src: "/images/shoot/stoel-fibromen.jpg",
      alt: "Een fibroom wordt met een fijn handstuk weggenomen",
    },
    inDeStoel: [
      "Kort en gericht. Het steelwratje wordt verdoofd met een crème of een prikje en daarna verwijderd; het geheel duurt per plekje ongeveer een minuut.",
      "Er blijft een klein korstje achter dat er binnen een week tot tien dagen afgaat. Eraan zitten is de enige manier om er een litteken van te maken.",
      "We rekenen per kwartier en niet per plekje, dus meerdere in één afspraak is meestal voordeliger dan een paar keer terugkomen. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/beh-fibromen.jpg",
      alt: "Een fibroom wordt verwijderd naast de neus",
    },
    naam: "Fibromen verwijderen",
    categorie: "overig",
    kort: "Steelwratjes weghalen, meestal in één afspraak. De behandeltijd rekenen we per kwartier.",
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
      "Verandert een plekje, dan beoordeelt eerst een arts of dermatoloog [MEDISCHE-CHECK-ROJDA]",
      "Wie ze aanmaakt blijft ze aanmaken, dus er kunnen nieuwe bij komen",
      "Er blijft een klein plekje achter dat langzaam vervaagt [MEDISCHE-CHECK-ROJDA]",
    ],
    stappen: [
      {
        kop: "Eerst kijken",
        zin: "Of het een fibroom is. Twijfelen we, dan laten we het eerst door een arts beoordelen.",
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

      { label: "Steelwratjes", href: "/huidproblemen/steelwratjes" },
    ],
    duurMinuten: 15,
  },
  {
    slug: "voedingsintolerantietest",
    welNietKop: { kop: "Wat deze test", accent: "aantoont" },
    inDeStoel: [
      "Dit is geen huidbehandeling. Er wordt een klein beetje bloed afgenomen en dat gaat naar een laboratorium; in de kliniek zelf ben je binnen een kwartier klaar.",
      "De uitslag bespreken we in een aparte afspraak, want een lijst met waardes zonder uitleg leidt vooral tot onnodig schrappen in je eten.",
      "Wat een intolerantietest wel en niet kan zeggen hoor je in dat gesprek, en ook als het antwoord is dat je er in jouw geval weinig aan hebt. [MEDISCHE-CHECK-ROJDA]",
    ],
    naam: "Voedingsintolerantietest",
    categorie: "overig",
    kort: "Een bloedtest die in kaart brengt op welke voedingsmiddelen je lichaam reageert.",
    lagen: [],
    werking:
      "Een test die in kaart brengt op welke voedingsmiddelen je lichaam reageert. Het is geen huidbehandeling, maar de uitslag geeft soms een verklaring voor wat er op je huid gebeurt. [MEDISCHE-CHECK-ROJDA]",
    herstel: "Geen.",
    sessies: "Eén keer",
    prijs: 300,
    wel: [
      "Brengt in kaart op welke voedingsmiddelen je lichaam reageert [MEDISCHE-CHECK-ROJDA]",
      "Geeft soms een verklaring voor huidklachten waar niets aan de huid zelf te vinden is",
      "Levert een uitslag die je meeneemt, ook als je verder niets bij ons doet",
    ],
    niet: [
      "Voor een allergietest of een diagnose ben je bij een arts [MEDISCHE-CHECK-ROJDA]",
      "Aan je huid zelf gebeurt hier niets; dat is een aparte afspraak",
      "Of je huid opknapt van weglaten, verschilt per persoon [MEDISCHE-CHECK-ROJDA]",
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
        zin: "Wat er in de uitslag staat en wat je ermee kunt. Daar gaat het gesprek over.",
      },
    ],
    faq: [
      {
        vraag: "Wordt dit vergoed?",
        antwoord:
          "Dat verschilt per verzekeraar en per polis. Op de vergoedingenpagina staat wat er per verzekeraar bekend is; je eigen polis is daarbij leidend.",
      },
      {
        vraag: "Wat als er niets uitkomt?",
        antwoord:
          "Ook dat is een bruikbare uitkomst: je weet dan dat je verder moet zoeken dan je voeding. [MEDISCHE-CHECK-ROJDA]",
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
