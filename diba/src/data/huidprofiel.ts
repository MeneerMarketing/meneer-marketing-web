/**
 * Het huidprofiel.
 *
 * De site onthoudt wat je over je huid vertelt en stuurt daar de rest mee aan. Het profiel
 * heeft twee lagen:
 *
 *   KORT (overal in te vullen): doel, huidtype, hersteltijd.
 *   UITGEBREID (op /huidprofiel): huidconditie, gevoeligheid, wat je nu gebruikt, waar je
 *   nu in zit en je voorgeschiedenis.
 *
 * De vraag naar hersteltijd is de Diba-vraag. Geen enkele kliniek stelt hem, terwijl hij
 * vaak beslissender is dan doel en huidtype samen: wie maandag moet werken kan geen
 * behandeling gebruiken waar je drie dagen rood van bent, hoe goed die verder ook past.
 *
 * WAT DIT UITDRUKKELIJK NIET IS. Geen diagnose, geen advies en geen aanbeveling. De
 * uitkomst legt naast elkaar wat jij hebt ingevuld en wat een behandeling doet, en zegt
 * waar dat wringt. Er staat even hard bij wat níet past en waarom. Een matchlijst met
 * alleen groene vinkjes is geen hulp maar een verkoopmachine.
 *
 * Het profiel staat in de browser van de bezoeker en nergens anders. Geen account, geen
 * server, geen cookie die iemand volgt.
 *
 * COPY-STATUS: concept. Elke tabel in dit bestand langs Rojda.
 */

import { BEHANDELINGEN, type Behandeling } from "@/data/behandelingen";
import { FITZPATRICK_TYPES, type FitzpatrickId } from "@/data/laser-zones";

export { FITZPATRICK_TYPES };
export type { FitzpatrickId };

/* ══ De korte vragen ══════════════════════════════════════════════════════ */

/** Wat iemand wil veranderen, in gewone woorden en niet in vaktermen. */
/**
 * Wat iemand wil veranderen.
 *
 * DRIE DOELEN ONTBRAKEN, EN DAT MAAKTE DE UITKOMST ONWAAR.
 *
 * Er stonden er zes. Daardoor konden drie behandelingen uit het aanbod nooit matchen: ze
 * kwamen bij iedereen uit op "werkt niet op wat jij wil veranderen", en dat is een bewering
 * die niet klopte. Het probleem zat niet in die behandelingen maar hier.
 *
 *   - `acne` bestond niet, terwijl acne de meest voorkomende reden is om naar een
 *     huidkliniek te gaan. Beide acnetrajecten kwamen daardoor hooguit op "deels" uit, via
 *     textuur. Textuur gaat over littekens ná acne, niet over de puistjes zelf.
 *   - `haaruitval` bestond niet. XL Hair is een traject tegen dunner wordend haar, en het
 *     enige haar-doel dat er was ging juist over haar dat weg moet. Precies het omgekeerde.
 *   - `oneffenheden` bestond niet, dus fibromen verwijderen hoorde nergens bij.
 *
 * Het oude label "Haargroei" was daarbij dubbelzinnig: dat leest als een doel om haar te
 * krijgen. Nu staat er wat het is.
 *
 * [MEDISCHE-CHECK-ROJDA] de indeling, en dan vooral of actieve acne en acnelittekens hier
 * terecht uit elkaar getrokken zijn.
 */
export const DOELEN = [
  {
    id: "acne",
    label: "Puistjes en acne",
    zin: "Actieve onzuiverheden, ontstoken plekjes",
  },
  {
    id: "textuur",
    label: "Oneffen textuur",
    zin: "Putjes, littekens, een huid die niet glad aanvoelt",
  },
  {
    id: "kleur",
    label: "Vlekken en kleur",
    zin: "Bruine plekken, ongelijke tint, pigment",
  },
  {
    id: "roodheid",
    label: "Roodheid en vaatjes",
    zin: "Blijvende rode wangen, zichtbare adertjes",
  },
  {
    id: "lijntjes",
    label: "Fijne lijntjes",
    zin: "Beginnende rimpeltjes, verslapping",
  },
  {
    id: "haar",
    label: "Ongewenste haargroei",
    zin: "Haar dat je liever kwijt bent, waar dan ook",
  },
  {
    id: "haaruitval",
    label: "Dunner wordend haar",
    zin: "Haaruitval op je hoofd, meer haar in de borstel",
  },
  {
    id: "oneffenheden",
    label: "Bultjes en steelwratjes",
    zin: "Kleine uitsteeksels die je weg wil hebben",
  },
  {
    id: "onbekend",
    label: "Weet ik niet",
    zin: "Er is iets, maar wat precies weet ik niet",
  },
] as const;
export type DoelId = (typeof DOELEN)[number]["id"];

/**
 * Leeftijd, en waarom die er alleen als twee vakjes staat.
 *
 * Er zijn twee acnetrajecten in het aanbod en het enige verschil is de leeftijd: het
 * jongerentraject is voor 18 jaar en jonger. Zonder deze vraag kreeg een veertigjarige het
 * jongerentraject aangeraden en een zestienjarige het volwassentraject. Allebei fout, en
 * allebei onzichtbaar.
 *
 * Meer banden dan deze twee zou betekenen dat we gegevens vragen die we nergens voor
 * gebruiken, en dat is precies wat dataminimalisatie verbiedt.
 */
export const LEEFTIJD = [
  {
    id: "tot-18",
    label: "18 of jonger",
    zin: "Er is een traject dat hier speciaal op gemaakt is",
  },
  {
    id: "18-plus",
    label: "Ouder dan 18",
    zin: "Het hele aanbod staat open",
  },
] as const;
export type LeeftijdId = (typeof LEEFTIJD)[number]["id"];

/** Hoeveel je erna kunt hebben. De vraag die de rest van de branche niet stelt. */
export const HERSTELRUIMTE = [
  { id: "geen", label: "Geen", zin: "Ik moet er meteen weer normaal uitzien" },
  { id: "dag", label: "Een dag", zin: "Een avond en een nacht rood mag" },
  {
    id: "dagen",
    label: "Een paar dagen",
    zin: "Ik kan het inplannen rond een weekend",
  },
] as const;
export type HerstelId = (typeof HERSTELRUIMTE)[number]["id"];

/* ══ De uitgebreide vragen ════════════════════════════════════════════════ */

/**
 * Wat hieronder staat hoort bij de eigen profielpagina.
 *
 * Waarom dit meer is dan een vragenlijst: de meeste antwoorden zijn geen voorkeuren maar
 * feiten die bepalen wat er kán. Wie retinol gebruikt kan niet zomaar een peeling. Wie
 * zwanger is valt af voor de helft van de lijst. Wie volgende week op vakantie gaat kan
 * geen laser. Dat zijn precies de dingen die in de praktijk pas aan de balie boven tafel
 * komen, met een afspraak die dan niet doorgaat.
 *
 * [MEDISCHE-CHECK-ROJDA] elke tabel hieronder, zonder uitzondering.
 */
export const HUIDCONDITIES = [
  { id: "droog", label: "Droog", zin: "Trekkerig, soms schilferig" },
  { id: "vet", label: "Vet", zin: "Glimt snel, vooral in de T-zone" },
  {
    id: "gecombineerd",
    label: "Gecombineerd",
    zin: "Vet in het midden, droog aan de zijkant",
  },
  { id: "normaal", label: "In balans", zin: "Geen van beide echt" },
] as const;
export type ConditieId = (typeof HUIDCONDITIES)[number]["id"];

export const GEVOELIGHEID = [
  { id: "laag", label: "Verdraagt veel", zin: "Ik kan bijna alles gebruiken" },
  {
    id: "gemiddeld",
    label: "Soms gevoelig",
    zin: "Bij sterke producten wordt het rood",
  },
  {
    id: "hoog",
    label: "Snel geïrriteerd",
    zin: "Veel producten prikken of branden",
  },
] as const;
export type GevoeligheidId = (typeof GEVOELIGHEID)[number]["id"];

export const GEBRUIK = [
  {
    id: "retinol",
    label: "Retinol of vitamine A",
    zin: "Moet je tijdig pauzeren",
  },
  { id: "zuren", label: "Zuren", zin: "Glycolzuur, salicylzuur, fruitzuren" },
  { id: "benzoyl", label: "Benzoylperoxide", zin: "Vaak bij acne" },
  { id: "vitamine-c", label: "Vitamine C", zin: "Meestal geen bezwaar" },
  {
    id: "niets",
    label: "Niets bijzonders",
    zin: "Alleen reinigen en hydrateren",
  },
] as const;
export type GebruikId = (typeof GEBRUIK)[number]["id"];

/**
 * `inZin` staat er los van `label` omdat die twee een ander werk doen. Op een vakje leest
 * "Ik ben zwanger" natuurlijk, maar in een zin die de bezoeker aanspreekt werd dat "dat
 * ligt aan één ding: ik ben zwanger". Dat stond er letterlijk tot ik het uitrekende.
 */
export const SITUATIE = [
  { id: "zwanger", label: "Ik ben zwanger", zin: "", inZin: "je zwangerschap" },
  {
    id: "borstvoeding",
    label: "Ik geef borstvoeding",
    zin: "",
    inZin: "dat je borstvoeding geeft",
  },
  {
    id: "gebruind",
    label: "Mijn huid is nu gebruind",
    zin: "Zon of zonnebank",
    inZin: "je gebruinde huid",
  },
  {
    id: "zon-op-komst",
    label: "Binnenkort veel zon",
    zin: "Vakantie of wintersport",
    inZin: "de zon die eraan komt",
  },
  { id: "geen", label: "Niets van dit alles", zin: "", inZin: "" },
] as const;
export type SituatieId = (typeof SITUATIE)[number]["id"];

export const VOORGESCHIEDENIS = [
  {
    id: "isotretinoine",
    label: "Isotretinoïne gebruikt",
    zin: "Nu of in het afgelopen jaar",
  },
  {
    id: "keloid",
    label: "Neiging tot keloïd",
    zin: "Littekens die dik worden en doorgroeien",
  },
  { id: "herpes", label: "Terugkerende koortslip", zin: "" },
  { id: "eerder-laser", label: "Eerder laser of IPL gehad", zin: "" },
  {
    id: "lichtgevoelige-medicatie",
    label: "Lichtgevoelige medicatie",
    zin: "Sommige antibiotica en kruidenmiddelen",
  },
  { id: "geen", label: "Niets van dit alles", zin: "" },
] as const;
export type VoorgeschiedenisId = (typeof VOORGESCHIEDENIS)[number]["id"];

/* ══ De mini-scan ═════════════════════════════════════════════════════════ */

export const SCAN_ASSEN = [
  { id: "hydratatie", label: "Hydratatie" },
  { id: "pigment", label: "Pigment" },
  { id: "porien", label: "Poriën" },
  { id: "roodheid", label: "Roodheid" },
  { id: "textuur", label: "Textuur" },
  { id: "uv", label: "UV-belasting" },
] as const;
export type AsId = (typeof SCAN_ASSEN)[number]["id"];

/**
 * Wat de mini-scan achterlaat. Let op wat er níet in zit: geen meting. Dit is wat iemand
 * zelf heeft aangegeven, en dat onderscheid staat overal waar dit getoond wordt erbij.
 */
export type Huidscan = {
  readonly assen: Readonly<Record<AsId, number>>;
  readonly focusLabel: string;
  readonly pillar: string | null;
  readonly kort: string | null;
  readonly op: string;
};

export type Huidprofiel = {
  readonly doelen: readonly DoelId[];
  readonly leeftijd: LeeftijdId | null;
  readonly huidtype: FitzpatrickId | null;
  readonly herstel: HerstelId | null;
  readonly scan: Huidscan | null;
  readonly conditie: ConditieId | null;
  readonly gevoeligheid: GevoeligheidId | null;
  readonly gebruikt: readonly GebruikId[];
  readonly situatie: readonly SituatieId[];
  readonly voorgeschiedenis: readonly VoorgeschiedenisId[];
};

export const LEEG_PROFIEL: Huidprofiel = {
  doelen: [],
  leeftijd: null,
  huidtype: null,
  herstel: null,
  scan: null,
  conditie: null,
  gevoeligheid: null,
  gebruikt: [],
  situatie: [],
  voorgeschiedenis: [],
};

export function profielIsLeeg(p: Huidprofiel): boolean {
  return (
    p.doelen.length === 0 &&
    p.leeftijd === null &&
    p.huidtype === null &&
    p.herstel === null &&
    p.scan === null &&
    p.conditie === null &&
    p.gevoeligheid === null &&
    p.gebruikt.length === 0 &&
    p.situatie.length === 0 &&
    p.voorgeschiedenis.length === 0
  );
}

/** De drie korte vragen. Stuurt de blaadjes op de behandelingenpagina. */
export function ingevuld(p: Huidprofiel): number {
  return (
    (p.doelen.length > 0 ? 1 : 0) + (p.huidtype ? 1 : 0) + (p.herstel ? 1 : 0)
  );
}

/** Hoe compleet het uitgebreide profiel is. Stuurt de balk op /huidprofiel. */
export const PROFIEL_ONDERDELEN = 9;

/**
 * Het aantal voluit, voor in een kop.
 *
 * De kop stond hardgecodeerd op "in acht stappen" en bleef daar staan toen er een negende
 * vraag bij kwam. Nu volgt hij het getal, maar wel als woord: "in 9 stappen" leest als een
 * formulier en niet als een zin.
 */
const TELWOORDEN = [
  "nul",
  "één",
  "twee",
  "drie",
  "vier",
  "vijf",
  "zes",
  "zeven",
  "acht",
  "negen",
  "tien",
  "elf",
  "twaalf",
] as const;

export function telwoord(n: number): string {
  return TELWOORDEN[n] ?? String(n);
}

export function compleetheid(p: Huidprofiel): number {
  return (
    (p.scan ? 1 : 0) +
    (p.doelen.length > 0 ? 1 : 0) +
    (p.leeftijd ? 1 : 0) +
    (p.huidtype ? 1 : 0) +
    (p.herstel ? 1 : 0) +
    (p.conditie ? 1 : 0) +
    (p.gevoeligheid ? 1 : 0) +
    (p.gebruikt.length > 0 ? 1 : 0) +
    (p.situatie.length > 0 || p.voorgeschiedenis.length > 0 ? 1 : 0)
  );
}

export function aandachtspunten(
  s: Huidscan,
): readonly (typeof SCAN_ASSEN)[number][] {
  return [...SCAN_ASSEN]
    .sort((a, b) => s.assen[b.id] - s.assen[a.id])
    .slice(0, 2);
}

/** "3 dagen geleden", "vorige maand". Zonder bibliotheek en zonder valse precisie. */
export function hoeLangGeleden(iso: string): string {
  const dagen = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (Number.isNaN(dagen) || dagen < 0) return "";
  if (dagen === 0) return "vandaag";
  if (dagen === 1) return "gisteren";
  if (dagen < 14) return `${dagen} dagen geleden`;
  if (dagen < 60) return `${Math.round(dagen / 7)} weken geleden`;
  return `${Math.round(dagen / 30)} maanden geleden`;
}

/* ══ De koppeling naar behandelingen ══════════════════════════════════════ */

/**
 * Welke doelen een behandeling raakt. "Deels" betekent: het doet er iets aan, maar het is
 * niet waar deze behandeling voor gemaakt is.
 *
 * [MEDISCHE-CHECK-ROJDA] de hele tabel.
 */
const DOELMATRIX: Record<string, Partial<Record<DoelId, "vol" | "deels">>> = {
  huidanalyse: {
    acne: "deels",
    textuur: "deels",
    kleur: "deels",
    roodheid: "deels",
    lijntjes: "deels",
    haar: "deels",
    haaruitval: "deels",
    oneffenheden: "deels",
    onbekend: "vol",
  },
  hydrafacial: { textuur: "deels", acne: "deels" },
  oxygeneo: { textuur: "deels" },
  /* Dermaplaning haalt donshaartjes weg, maar dat is geen ontharing: het groeit
     identiek terug. Daarom bewust géén koppeling met het haar-doel; die zou een
     verwachting wekken die de behandeling niet waarmaakt. */
  dermaplaning: { textuur: "deels" },
  peelings: { kleur: "vol", acne: "vol", textuur: "deels", lijntjes: "deels" },
  /* Microneedling mikt op de laag waar structuur zit; acnelittekens vallen daarom onder
     textuur. Actieve, ontstoken acne staat er bewust niet bij. */
  skinpen: { textuur: "vol", lijntjes: "vol" },
  "dermapen-4": { textuur: "vol", lijntjes: "vol" },
  skinboosters: { lijntjes: "vol", kleur: "deels" },
  fotona: { lijntjes: "vol", textuur: "vol" },
  "nordlys-ipl": { roodheid: "vol", kleur: "vol" },
  "led-therapie": { roodheid: "deels", lijntjes: "deels", acne: "deels" },
  "cosmelan-dermamelan": { kleur: "vol" },
  "happy-intim": { kleur: "vol" },
  laserontharing: { haar: "vol" },
  /* Stond hier niet, en kwam daardoor bij iedereen uit op "past niet". */
  "xl-hair": { haaruitval: "vol" },
  "acne-traject": { acne: "vol", textuur: "deels" },
  "jongeren-acne-traject": { acne: "vol", textuur: "deels" },
  littekentherapie: { textuur: "vol" },
  fibromen: { oneffenheden: "vol" },
  voedingsintolerantietest: { onbekend: "deels", acne: "deels" },
};

/** Wat een behandeling aan hersteltijd vraagt, op dezelfde schaal als de vraag. */
const HERSTELVRAAG: Record<string, HerstelId> = {
  huidanalyse: "geen",
  hydrafacial: "geen",
  oxygeneo: "geen",
  dermaplaning: "geen",
  "led-therapie": "geen",
  voedingsintolerantietest: "geen",
  skinboosters: "dag",
  "nordlys-ipl": "dag",
  laserontharing: "dag",
  fotona: "dag",
  "xl-hair": "dag",
  fibromen: "dag",
  peelings: "dagen",
  skinpen: "dagen",
  "dermapen-4": "dagen",
  "cosmelan-dermamelan": "dagen",
  "happy-intim": "dagen",
  "acne-traject": "dagen",
  /* Stond hier niet en viel dus stilzwijgend terug op "dag", terwijl het
     volwassentraject op "dagen" staat. Zelfde traject, andere leeftijd. */
  "jongeren-acne-traject": "dagen",
  littekentherapie: "dagen",
};

const RUIMTE_VOLGORDE: HerstelId[] = ["geen", "dag", "dagen"];

/**
 * Wat een antwoord blokkeert, en waarom.
 *
 * "Blokkeert" betekent: niet nu, en dat is geen gesprek maar een feit. Alles wat wél een
 * gesprek is staat in `LET_OP` en blokkeert niets. Dat onderscheid is met opzet streng
 * gehouden: wie te snel blokkeert verstopt behandelingen die misschien juist wel kunnen.
 *
 * [MEDISCHE-CHECK-ROJDA]
 */
const BLOKKADES: readonly {
  readonly wanneer: (p: Huidprofiel) => boolean;
  readonly slugs: readonly string[];
  readonly reden: string;
  /**
   * Hoort dit thuis in "meld dit tijdens de intake"?
   *
   * Standaard wel: bijna elke blokkade is iets wat de therapeut moet weten. De
   * leeftijdsregels niet, want die zijn geen bijzonderheid maar een routering. Die stonden
   * er wel, en dan las je bij je meldpunten "op jouw leeftijd loopt dit via het
   * jongerentraject" alsof je dat aan de balie moest gaan vertellen.
   */
  readonly melden?: boolean;
}[] = [
  {
    wanneer: (p) => p.situatie.includes("gebruind"),
    slugs: ["laserontharing", "nordlys-ipl", "fotona"],
    reden:
      "Kan niet op een gebruinde huid: het licht wordt dan opgenomen door het pigment in je huid in plaats van door het doel.",
  },
  {
    wanneer: (p) => p.situatie.includes("zon-op-komst"),
    slugs: [
      "peelings",
      "cosmelan-dermamelan",
      "laserontharing",
      "nordlys-ipl",
      "fotona",
      "happy-intim",
    ],
    reden:
      "Niet vlak voor veel zon. De huid is daarna kwetsbaar, en pigment komt juist terug van wat je dan doet.",
  },
  {
    wanneer: (p) =>
      p.situatie.includes("zwanger") || p.situatie.includes("borstvoeding"),
    slugs: [
      "peelings",
      "cosmelan-dermamelan",
      "skinboosters",
      "xl-hair",
      "happy-intim",
      "acne-traject",
    ],
    reden:
      "Vervalt tijdens zwangerschap en borstvoeding. Dermaplaning en een rustige gezichtsbehandeling kunnen meestal wel.",
  },
  {
    wanneer: (p) => p.voorgeschiedenis.includes("isotretinoine"),
    slugs: ["peelings", "skinpen", "dermapen-4", "fotona", "littekentherapie"],
    reden:
      "Na isotretinoïne moet de huid eerst hersteld zijn. Hoe lang dat duurt bepaalt een arts, niet deze pagina.",
  },
  {
    wanneer: (p) => p.voorgeschiedenis.includes("keloid"),
    slugs: ["skinpen", "dermapen-4", "fibromen"],
    reden:
      "Bij neiging tot keloïd kan een prikkel in het bindweefsel juist een dik litteken geven.",
  },
  /* De twee acnetrajecten verschillen alleen in leeftijd. Zonder deze twee regels kreeg
     een veertigjarige het jongerentraject aangeraden en een zestienjarige het
     volwassentraject, en dat was aan niets te zien. */
  {
    wanneer: (p) => p.leeftijd === "18-plus",
    slugs: ["jongeren-acne-traject"],
    reden:
      "Dit traject is gemaakt voor 18 jaar en jonger. Voor jou is het gewone acnetraject de juiste.",
    melden: false,
  },
  {
    wanneer: (p) => p.leeftijd === "tot-18",
    slugs: ["acne-traject"],
    reden:
      "Op jouw leeftijd loopt dit via het jongerentraject, dat op dezelfde klacht is gemaakt maar op jouw huid is afgestemd.",
    melden: false,
  },
];

/** Wat er wél kan, maar besproken moet worden. Blokkeert niets. */
const LET_OP: readonly {
  readonly wanneer: (p: Huidprofiel) => boolean;
  readonly slugs: readonly string[];
  readonly tekst: string;
}[] = [
  {
    wanneer: (p) =>
      p.gebruikt.includes("retinol") || p.gebruikt.includes("zuren"),
    slugs: ["peelings", "skinpen", "dermapen-4", "fotona", "happy-intim"],
    tekst:
      "Je gebruikt retinol of zuren. Die moet je tijdig pauzeren; hoe lang hoor je tijdens de intake.",
  },
  {
    wanneer: (p) => p.gebruikt.includes("benzoyl"),
    slugs: ["peelings", "acne-traject"],
    tekst:
      "Benzoylperoxide maakt de huid gevoeliger. Meld het, dan wordt de sterkte daarop gekozen.",
  },
  {
    wanneer: (p) => p.voorgeschiedenis.includes("herpes"),
    slugs: ["peelings", "fotona", "skinpen", "dermapen-4"],
    tekst:
      "Bij koortslip kan een behandeling een uitbraak uitlokken. Daar is medicatie voor, maar dan moet het vooraf besproken zijn.",
  },
  {
    wanneer: (p) => p.voorgeschiedenis.includes("lichtgevoelige-medicatie"),
    slugs: ["laserontharing", "nordlys-ipl", "fotona"],
    tekst:
      "Lichtgevoelige medicatie verandert hoe je huid op licht reageert. Neem de naam mee naar de intake.",
  },
  {
    wanneer: (p) => p.gevoeligheid === "hoog",
    slugs: ["peelings", "happy-intim", "cosmelan-dermamelan"],
    tekst:
      "Je gaf aan snel geïrriteerd te zijn. Er wordt dan meestal met een lagere sterkte begonnen.",
  },
  {
    wanneer: (p) => p.conditie === "droog",
    slugs: ["peelings", "dermaplaning"],
    tekst:
      "Bij een droge huid wordt de voorbereiding thuis belangrijker dan de behandeling zelf.",
  },
];

export type MatchOordeel = "past" | "deels" | "past-niet";

/**
 * Waarom het oordeel is wat het is.
 *
 * `oordeel` alleen is te grof zodra je het buiten de uitkomstpagina gebruikt. Daar staan
 * de behandelingen in drie bakken met de reden eronder, en dan is "past niet" duidelijk
 * genoeg. Maar op een prijslijst, waar je alleen ruimte hebt voor drie woorden naast een
 * bedrag, gaan twee heel verschillende dingen "past niet" heten:
 *
 * - je bent zwanger, dus deze behandeling kan nu niet;
 * - je zoekt iets tegen acne, en dit is een rimpelbehandeling.
 *
 * Het eerste is een grens die bij jou hoort. Het tweede zegt niets over jou en alles over
 * de behandeling. Ze allebei "viel bij jou af" noemen leest als afwijzing waar er alleen
 * sprake is van een ander onderwerp, en dat is precies het soort onnauwkeurigheid dat deze
 * site niet moet maken.
 */
export type MatchGrond =
  /** Een contra-indicatie: zwangerschap, medicatie, huidtype. Kan nu niet. */
  | "blokkade"
  /** Vraagt meer hersteltijd dan je zei te hebben. Kan wel, maar niet zoals jij wil. */
  | "herstel"
  /** Werkt op iets anders dan wat jij wil veranderen. Niets mis mee. */
  | "ander-doel"
  /** Hiervoor is de behandeling gemaakt. */
  | "raak"
  /** Doet er iets aan, maar is er niet voor gemaakt. */
  | "zijdelings"
  /** Je hebt nog geen doel gekozen, dus valt er niets te zeggen. */
  | "geen-doel";

export type Match = {
  readonly behandeling: Behandeling;
  readonly oordeel: MatchOordeel;
  readonly grond: MatchGrond;
  /** Waarom. Bij "past-niet" is dit de belangrijkste regel op de pagina. */
  readonly reden: string;
  /** Kan wel, maar moet besproken worden. Blokkeert niets. */
  readonly letOp: readonly string[];
};

/**
 * Vergelijkt het profiel met alle behandelingen.
 *
 * De volgorde van de controles is niet willekeurig:
 *
 *   1. Blokkades. Wat niet kan, kan niet, en dat weegt zwaarder dan alle rest.
 *   2. Hersteltijd. Een behandeling die perfect bij je doel past maar die je niet kúnt
 *      inplannen is geen match. Dat andersom vertellen ("past bij je doel, maar…") is
 *      precies hoe je iemand toch een afspraak in praat.
 *   3. Doel.
 *
 * "Let op" loopt daar los naast: het kan bij elk oordeel horen en haalt nooit iets weg.
 */
export function maakMatches(p: Huidprofiel): readonly Match[] {
  return BEHANDELINGEN.map((b): Match => {
    const letOp = LET_OP.filter(
      (l) => l.wanneer(p) && l.slugs.includes(b.slug),
    ).map((l) => l.tekst);

    const blok = BLOKKADES.find(
      (x) => x.wanneer(p) && x.slugs.includes(b.slug),
    );
    if (blok) {
      return {
        behandeling: b,
        oordeel: "past-niet",
        grond: "blokkade",
        reden: blok.reden,
        letOp,
      };
    }

    if (p.herstel) {
      const vraagt = HERSTELVRAAG[b.slug] ?? "dag";
      const ruimte = RUIMTE_VOLGORDE.indexOf(p.herstel);
      const nodig = RUIMTE_VOLGORDE.indexOf(vraagt);
      if (nodig > ruimte) {
        /* De zin bouwt zich op uit twee labels, en dat ging mis bij het eerste.

           `label` is bedoeld voor een keuzeknop ("Geen", "Een dag", "Een paar dagen") en
           daar staat het prima. In een lopende zin werd het "Je gaf geen op", wat geen
           Nederlands is. Vandaar hier een eigen formulering per keuze: een label in een knop
           en een label in een zin zijn twee verschillende teksten. */
        const gaf =
          p.herstel === "geen"
            ? "dat je er meteen weer normaal uit moet zien"
            : p.herstel === "dag"
              ? "dat je een dag kunt hebben"
              : "dat je een paar dagen kunt hebben";
        const moet =
          vraagt === "dagen"
            ? "een paar dagen"
            : vraagt === "dag"
              ? "een dag"
              : "niets";
        return {
          behandeling: b,
          oordeel: "past-niet",
          grond: "herstel",
          reden: `Vraagt meer hersteltijd dan je aangaf. Je gaf aan ${gaf}, en hiervoor moet je rekenen op ${moet}.`,
          letOp,
        };
      }
    }

    if (p.doelen.length > 0) {
      const doelen = DOELMATRIX[b.slug] ?? {};
      const raak = p.doelen.filter((d) => doelen[d] === "vol");
      const zijdelings = p.doelen.filter((d) => doelen[d] === "deels");

      if (raak.length > 0) {
        const namen = raak.map((d) =>
          DOELEN.find((x) => x.id === d)!.label.toLowerCase(),
        );
        return {
          behandeling: b,
          oordeel: "past",
          grond: "raak",
          reden: `Hiervoor is deze behandeling gemaakt: ${namen.join(" en ")}.`,
          letOp,
        };
      }
      if (zijdelings.length > 0) {
        const namen = zijdelings.map((d) =>
          DOELEN.find((x) => x.id === d)!.label.toLowerCase(),
        );
        return {
          behandeling: b,
          oordeel: "deels",
          grond: "zijdelings",
          reden: `Doet iets aan ${namen.join(" en ")}, maar daar is het niet voor gemaakt.`,
          letOp,
        };
      }
      return {
        behandeling: b,
        oordeel: "past-niet",
        grond: "ander-doel",
        reden:
          "Werkt niet op wat jij wil veranderen. Niet minder goed, gewoon iets anders.",
        letOp,
      };
    }

    return {
      behandeling: b,
      oordeel: "deels",
      grond: "geen-doel",
      reden: "Kies eerst wat je wil veranderen.",
      letOp,
    };
  });
}

/**
 * Waarom er niets volledig past, en wat daaraan te doen is.
 *
 * WAAROM DIT BESTAAT.
 *
 * Bij het doorrekenen van echte profielen bleken er twee te zijn die nul volledige matches
 * opleveren, allebei terecht: wie ongewenste haargroei wil aanpakken maar net gebruind is,
 * en wie pigment wil aanpakken maar geen enkele hersteltijd heeft. In beide gevallen kreeg
 * je een lege lijst te zien. Dat is technisch juist en in de praktijk waardeloos: een leeg
 * scherm vertelt niet dat er één ding in de weg staat en dat het volgende maand wel kan.
 *
 * Dus wordt hier uitgezocht wélke voorwaarde het is. Dat gebeurt door de matcher opnieuw te
 * draaien met precies één belemmering weggenomen. Verschijnt er dan wel iets, dan wéten we
 * dat dat de blokkade was en hoeven we het niet te gokken.
 *
 * Het onderscheid tussen "niet nu" en "niet voor jou" is het belangrijkste dat deze functie
 * maakt. Gebruind zijn gaat over, een neiging tot keloïd niet.
 */
export type GeenMatch = {
  readonly soort: "tijdelijk" | "hersteltijd" | "niets-in-aanbod";
  readonly kop: string;
  readonly zin: string;
  /** Wat er zou veranderen. Zonder dit is het alsnog een leeg scherm. */
  readonly wat: string;
  /** Wat er dan wel zou passen. Concreet, want een belofte zonder naam is vaag. */
  readonly danWel: readonly string[];
};

/** Situaties die vanzelf overgaan. De rest is een eigenschap en geen moment. */
const TIJDELIJK: readonly SituatieId[] = [
  "gebruind",
  "zon-op-komst",
  "zwanger",
  "borstvoeding",
];

export function waaromNiets(p: Huidprofiel): GeenMatch | null {
  const nu = maakMatches(p);
  if (nu.some((m) => m.oordeel === "past")) return null;
  if (p.doelen.length === 0) return null;

  const namen = (ms: readonly Match[]) =>
    ms.filter((m) => m.oordeel === "past").map((m) => m.behandeling.naam);

  /* 1. Een tijdelijke situatie. Die weegt het zwaarst, want hij gaat over. */
  const tijdelijk = p.situatie.filter((s) => TIJDELIJK.includes(s));
  if (tijdelijk.length > 0) {
    const zonder = namen(
      maakMatches({
        ...p,
        situatie: p.situatie.filter((s) => !TIJDELIJK.includes(s)),
      }),
    );
    if (zonder.length > 0) {
      const labels = tijdelijk.map(
        (s) => SITUATIE.find((x) => x.id === s)?.inZin ?? s,
      );
      return {
        soort: "tijdelijk",
        kop: "Niet nu, maar wel straks",
        zin: `Er is nu niets dat volledig past, en dat ligt aan één ding: ${labels.join(" en ")}. Dat is een moment en geen eigenschap.`,
        wat: "Zodra dat voorbij is, verandert deze uitkomst vanzelf. Je hoeft er verder niets voor te doen.",
        danWel: zonder,
      };
    }
  }

  /* 2. De hersteltijd. Perfect passend maar niet in te plannen is geen match. */
  if (p.herstel && p.herstel !== "dagen") {
    const zonder = namen(maakMatches({ ...p, herstel: "dagen" }));
    if (zonder.length > 0) {
      /* Zelfde reden als hierboven: "je koos geen hersteltijd" leest als "je hebt geen
         keuze gemaakt", terwijl het betekent dat je er nul wilde. */
      const gaf =
        p.herstel === "geen"
          ? "dat je er meteen weer normaal uit moet zien"
          : "dat je hooguit een dag hebt";
      return {
        soort: "hersteltijd",
        kop: "Alleen de hersteltijd zit in de weg",
        zin: `Voor wat jij wil veranderen bestaat er wel iets, maar niet binnen de ruimte die je opgaf: je gaf aan ${gaf}.`,
        wat: "Kun je het rond een weekend plannen, dan komt er wel iets vrij. Kan dat niet, dan is dat een eerlijk antwoord en geen reden om iets lichters te boeken dat niet gaat werken.",
        danWel: zonder,
      };
    }
  }

  /* 3. Dan ligt het niet aan een voorwaarde maar aan het aanbod. */
  return {
    soort: "niets-in-aanbod",
    kop: "Hier ligt het antwoord niet",
    zin: "Voor wat jij wil veranderen heeft deze kliniek geen behandeling die er volledig op mikt.",
    wat: "Dat is geen afwijzing maar een doorverwijzing. Tijdens de intake kijken we mee waar je wel terechtkunt, en dat kost je niets.",
    danWel: [],
  };
}

/**
 * Alles wat je tijdens de intake moet melden, ongeacht welke behandeling het wordt.
 *
 * Dit is de lijst die deze pagina het meest waard maakt: hij bestaat uit dingen die in de
 * praktijk pas aan de balie boven tafel komen, en dan een afspraak kosten.
 */
export function meldPunten(p: Huidprofiel): readonly string[] {
  const uniek = new Set<string>();
  for (const l of LET_OP) if (l.wanneer(p)) uniek.add(l.tekst);
  for (const b of BLOKKADES) {
    if (b.melden === false) continue;
    if (b.wanneer(p)) uniek.add(b.reden);
  }
  return [...uniek];
}

/**
 * De kanttekening bij het huidtype. Geen enkel type sluit iets uit; wat het wel doet is de
 * instellingen bepalen. [MEDISCHE-CHECK-ROJDA]
 */
/* ══ De uitkomst ══════════════════════════════════════════════════════════ */

/**
 * Alleen de eerste letter klein.
 *
 * Met een gewone toLowerCase() werd "Vitamine C" tot "vitamine c" en "Retinol of
 * vitamine A" tot "vitamine a". Die hoofdletters zijn geen opmaak maar de naam van de
 * stof, en een kliniek die die verkeerd schrijft leest als een kliniek die niet oplet.
 */
function kleinBegin(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/** "a, b en c": een opsomming die als Nederlands leest en niet als een array. */
function opsomming(delen: readonly string[]): string {
  if (delen.length === 0) return "";
  if (delen.length === 1) return delen[0];
  return delen.slice(0, -1).join(", ") + " en " + delen[delen.length - 1];
}

function labelVan<T extends { readonly id: string; readonly label: string }>(
  tabel: readonly T[],
  id: string | null,
): string | null {
  if (!id) return null;
  return tabel.find((r) => r.id === id)?.label ?? null;
}

/**
 * Het profiel teruggegeven in gewone zinnen.
 *
 * WAAROM DIT ER IS.
 *
 * De uitkomst gaf eerder twee lijstjes terug: wat past en wat je moet melden. Allebei
 * bruikbaar, geen van beide herkenbaar. Wie acht vragen invult wil eerst horen dat er
 * geluisterd is, en dat kan alleen als je het teruggeeft in de taal waarin het gevraagd is.
 *
 * Er staat niets in wat je niet zelf hebt ingevuld. Geen conclusie, geen inschatting, geen
 * "waarschijnlijk". Dat is precies de scheiding waar deze pagina op rust: dit is wat jij
 * vertelt, de meting komt daarna.
 */
/**
 * Het profiel als platte tekst, om mee te nemen naar de afspraak.
 *
 * WAAROM DIT PLATTE TEKST IS EN GEEN VERZENDKNOP.
 *
 * Het profiel staat in de browser van de bezoeker en gaat nergens heen; dat staat zo in
 * het privacybeleid en in `huidprofiel-opslag.ts`. Een knop die het naar ons stuurt zou dat
 * omdraaien, en dan is de belofte weg.
 *
 * Dus levert deze functie tekst op die de bezoeker zelf kopieert en meestuurt als hij een
 * afspraak maakt. Hij bepaalt of het verstuurd wordt, wij niet. Dat het via WhatsApp gaat
 * en niet via een formulier is geen omweg maar het hele punt.
 *
 * DE VOLGORDE IS DIE VAN DE BEHANDELKAMER EN NIET DIE VAN DE VRAGENLIJST.
 *
 * Eerst waarvoor iemand komt, dan wat er in de weg kan zitten. Dat laatste is waar het om
 * gaat: het zijn precies de dingen die anders pas aan de balie boven tafel komen.
 */
export function intakeTekst(p: Huidprofiel): string {
  const regels: string[] = ["Mijn huidprofiel van dibaclinics.nl", ""];

  const doelen = p.doelen
    .map((d) => DOELEN.find((x) => x.id === d)?.label)
    .filter(Boolean);
  if (doelen.length > 0) regels.push(`Waarvoor ik kom: ${doelen.join(", ")}`);

  if (p.leeftijd) {
    regels.push(
      `Leeftijd: ${LEEFTIJD.find((l) => l.id === p.leeftijd)?.label}`,
    );
  }
  if (p.huidtype) regels.push(`Huidtype: Fitzpatrick ${p.huidtype}`);
  if (p.herstel) {
    regels.push(
      `Hersteltijd die ik heb: ${HERSTELRUIMTE.find((h) => h.id === p.herstel)?.label}`,
    );
  }
  if (p.conditie) {
    regels.push(
      `Huidconditie: ${HUIDCONDITIES.find((c) => c.id === p.conditie)?.label}`,
    );
  }
  if (p.gevoeligheid) {
    regels.push(
      `Gevoeligheid: ${GEVOELIGHEID.find((g) => g.id === p.gevoeligheid)?.label}`,
    );
  }

  const gebruikt = p.gebruikt
    .filter((g) => g !== "niets")
    .map((g) => GEBRUIK.find((x) => x.id === g)?.label)
    .filter(Boolean);
  if (gebruikt.length > 0) {
    regels.push(`Wat ik nu gebruik: ${gebruikt.join(", ")}`);
  }

  const situatie = p.situatie
    .filter((s) => s !== "geen")
    .map((s) => SITUATIE.find((x) => x.id === s)?.label)
    .filter(Boolean);
  const historie = p.voorgeschiedenis
    .filter((v) => v !== "geen")
    .map((v) => VOORGESCHIEDENIS.find((x) => x.id === v)?.label)
    .filter(Boolean);
  const bijzonder = [...situatie, ...historie];
  if (bijzonder.length > 0) {
    regels.push(`Speelt er nu: ${bijzonder.join(", ")}`);
  }

  const melden = meldPunten(p);
  if (melden.length > 0) {
    /* De meldpunten zijn geschreven als tekst aan de bezoeker ("je gebruikt retinol").
       In een bericht dat diezelfde bezoeker naar de kliniek stuurt, klopt die richting
       niet. Het kopje zegt daarom expliciet dat dit de notities van de site zijn en
       niet zijn eigen woorden; dat is goedkoper dan elke regel dubbel schrijven. */
    regels.push("", "Wat de site aangaf om te bespreken:");
    for (const m of melden) regels.push(`- ${m}`);
  }

  regels.push(
    "",
    "Dit is wat ik zelf heb ingevuld, geen meting. Ik weet dat er niets vaststaat tot er gemeten is.",
  );
  return regels.join("\n");
}

export function profielSamenvatting(p: Huidprofiel): readonly string[] {
  const zinnen: string[] = [];

  const doelen = p.doelen
    .filter((d) => d !== "onbekend")
    .map((d) => {
      const l = DOELEN.find((x) => x.id === d)?.label;
      return l ? kleinBegin(l) : undefined;
    })
    .filter((l): l is string => Boolean(l));

  if (p.doelen.includes("onbekend") && doelen.length === 0) {
    zinnen.push(
      "Je weet dat er iets is, maar niet precies wat. Dat is een prima startpunt: uitzoeken wát het is, is het werk van de meting.",
    );
  } else if (doelen.length > 0) {
    zinnen.push(`Je wil iets doen aan ${opsomming(doelen)}.`);
  }

  const conditie = labelVan(HUIDCONDITIES, p.conditie);
  const gevoelig = labelVan(GEVOELIGHEID, p.gevoeligheid);
  if (conditie && gevoelig) {
    zinnen.push(
      `Je huid is ${kleinBegin(conditie)} en ${kleinBegin(gevoelig)}.`,
    );
  } else if (conditie) {
    zinnen.push(`Je huid is ${kleinBegin(conditie)}.`);
  } else if (gevoelig) {
    zinnen.push(`Je huid ${kleinBegin(gevoelig)}.`);
  }

  if (p.huidtype) {
    zinnen.push(`Je schat jezelf in op Fitzpatrick ${p.huidtype}.`);
  }

  /* Hersteltijd staat er apart, want die stuurt meer weg dan mensen verwachten. */
  if (p.herstel === "geen") {
    zinnen.push(
      "Je hebt geen hersteltijd: je moet er meteen weer normaal uitzien. Dat sluit een deel van de lijst uit, en dat is beter dan erachter komen op de dag zelf.",
    );
  } else if (p.herstel === "dag") {
    zinnen.push("Je kunt een avond en een nacht rood zijn, langer niet.");
  } else if (p.herstel === "dagen") {
    zinnen.push(
      "Je kunt een paar dagen herstel inplannen. Dat opent de zwaardere behandelingen.",
    );
  }

  const gebruikt = p.gebruikt
    .filter((g) => g !== "niets")
    .map((g) => {
      const l = GEBRUIK.find((x) => x.id === g)?.label;
      return l ? kleinBegin(l) : undefined;
    })
    .filter((l): l is string => Boolean(l));
  if (gebruikt.length > 0) {
    zinnen.push(`Je gebruikt nu ${opsomming(gebruikt)}.`);
  } else if (p.gebruikt.includes("niets")) {
    zinnen.push("Je gebruikt niets bijzonders op je huid.");
  }

  return zinnen;
}

/**
 * Wat er met deze antwoorden niet te weten valt, en met een meting wel.
 *
 * DIT IS DE KERN VAN DE PAGINA EN NIET EEN VERKOOPARGUMENT.
 *
 * "Wij gokken niet, wij meten" is een merkregel die alleen iets waard is als hij ergens
 * kosten heeft. Hier heeft hij die: deze pagina geeft je acht antwoorden terug en zegt er
 * daarna bij wat ze níet kunnen beslissen. Dat is oncomfortabel en het is waar, en het is
 * ook precies waarom een meting zin heeft.
 *
 * De punten zijn gekoppeld aan wat iemand zelf heeft ingevuld. Een algemene lijst zou hier
 * hetzelfde zeggen tegen iedereen, en dan is het weer wél een verkooppraatje.
 *
 * [MEDISCHE-CHECK-ROJDA] elke regel hieronder.
 */
export function nogNietGemeten(p: Huidprofiel): readonly string[] {
  const punten: string[] = [];

  if (p.doelen.includes("kleur")) {
    punten.push(
      "Of je pigment oppervlakkig ligt of dieper in de huid zit. Dat verschil bepaalt of een peeling genoeg is of dat er laser aan te pas moet, en het is met het blote oog niet te zien.",
    );
  }
  if (p.doelen.includes("textuur")) {
    punten.push(
      "Hoe diep de oneffenheid zit. Blijft het bij de bovenlaag, dan is de aanpak een andere dan wanneer het bindweefsel eronder is aangedaan.",
    );
  }
  if (p.doelen.includes("roodheid")) {
    punten.push(
      "Of de roodheid van vaatjes komt of van een barrière die van slag is. Dat lijkt op elkaar en vraagt het tegenovergestelde.",
    );
  }
  if (p.doelen.includes("lijntjes")) {
    punten.push(
      "Hoeveel stevigheid er onder de lijntjes nog zit. Verslapping vraagt iets anders dan lijntjes in de bovenlaag, en dat onderscheid maak je niet in de spiegel.",
    );
  }
  if (p.doelen.includes("haar")) {
    punten.push(
      "Hoe je huid op de eerste puls reageert en in welke groeifase je haren zitten. Dat bepaalt de instelling en het interval van je reeks.",
    );
  }
  if (p.doelen.includes("onbekend") || p.doelen.length === 0) {
    punten.push(
      "Wat er eigenlijk aan de hand is. Je hoeft dat niet zelf te weten voordat je komt; uitzoeken is het werk.",
    );
  }

  /* Twee dingen gelden voor iedereen, en die staan achteraan zodat het persoonlijke
     stuk vooropgaat. */
  punten.push(
    "Je vochtwaarde en de staat van je barrière, gemeten in plaats van gevoeld. Een huid die trekkerig aanvoelt is niet altijd een droge huid.",
  );
  punten.push(
    "Een vertrekpunt. Zonder meting van vandaag is over drie maanden niet vast te stellen of er iets veranderd is, behalve op gevoel.",
  );

  return punten;
}

export function huidtypeKanttekening(t: FitzpatrickId | null): string | null {
  if (!t) return null;
  if (t === "V" || t === "VI") {
    return "Bij jouw huidtype worden licht en warmte anders opgenomen. Dat sluit niets uit, maar de instellingen luisteren nauwer en dat bepaalt een mens, niet deze pagina.";
  }
  if (t === "I" || t === "II") {
    return "Bij jouw huidtype is de huid gevoeliger voor zon na een behandeling. Dat is geen beperking maar wel een afspraak over wat je erna doet.";
  }
  return "Bij jouw huidtype is er ruimte in de instellingen. Wat er precies gekozen wordt hoor je tijdens de intake.";
}
