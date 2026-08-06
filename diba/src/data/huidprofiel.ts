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
export const DOELEN = [
  { id: "textuur", label: "Oneffen textuur", zin: "Putjes, littekens, een huid die niet glad aanvoelt" },
  { id: "kleur", label: "Vlekken en kleur", zin: "Bruine plekken, ongelijke tint, pigment" },
  { id: "roodheid", label: "Roodheid en vaatjes", zin: "Blijvende rode wangen, zichtbare adertjes" },
  { id: "lijntjes", label: "Fijne lijntjes", zin: "Beginnende rimpeltjes, verslapping" },
  { id: "haar", label: "Haargroei", zin: "Ongewenste haren, waar dan ook" },
  { id: "onbekend", label: "Weet ik niet", zin: "Er is iets, maar wat precies weet ik niet" },
] as const;
export type DoelId = (typeof DOELEN)[number]["id"];

/** Hoeveel je erna kunt hebben. De vraag die de rest van de branche niet stelt. */
export const HERSTELRUIMTE = [
  { id: "geen", label: "Geen", zin: "Ik moet er meteen weer normaal uitzien" },
  { id: "dag", label: "Een dag", zin: "Een avond en een nacht rood mag" },
  { id: "dagen", label: "Een paar dagen", zin: "Ik kan het inplannen rond een weekend" },
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
  { id: "gecombineerd", label: "Gecombineerd", zin: "Vet in het midden, droog aan de zijkant" },
  { id: "normaal", label: "In balans", zin: "Geen van beide echt" },
] as const;
export type ConditieId = (typeof HUIDCONDITIES)[number]["id"];

export const GEVOELIGHEID = [
  { id: "laag", label: "Verdraagt veel", zin: "Ik kan bijna alles gebruiken" },
  { id: "gemiddeld", label: "Soms gevoelig", zin: "Bij sterke producten wordt het rood" },
  { id: "hoog", label: "Snel geïrriteerd", zin: "Veel producten prikken of branden" },
] as const;
export type GevoeligheidId = (typeof GEVOELIGHEID)[number]["id"];

export const GEBRUIK = [
  { id: "retinol", label: "Retinol of vitamine A", zin: "Moet je tijdig pauzeren" },
  { id: "zuren", label: "Zuren", zin: "Glycolzuur, salicylzuur, fruitzuren" },
  { id: "benzoyl", label: "Benzoylperoxide", zin: "Vaak bij acne" },
  { id: "vitamine-c", label: "Vitamine C", zin: "Meestal geen bezwaar" },
  { id: "niets", label: "Niets bijzonders", zin: "Alleen reinigen en hydrateren" },
] as const;
export type GebruikId = (typeof GEBRUIK)[number]["id"];

export const SITUATIE = [
  { id: "zwanger", label: "Ik ben zwanger", zin: "" },
  { id: "borstvoeding", label: "Ik geef borstvoeding", zin: "" },
  { id: "gebruind", label: "Mijn huid is nu gebruind", zin: "Zon of zonnebank" },
  { id: "zon-op-komst", label: "Binnenkort veel zon", zin: "Vakantie of wintersport" },
  { id: "geen", label: "Niets van dit alles", zin: "" },
] as const;
export type SituatieId = (typeof SITUATIE)[number]["id"];

export const VOORGESCHIEDENIS = [
  { id: "isotretinoine", label: "Isotretinoïne gebruikt", zin: "Nu of in het afgelopen jaar" },
  { id: "keloid", label: "Neiging tot keloïd", zin: "Littekens die dik worden en doorgroeien" },
  { id: "herpes", label: "Terugkerende koortslip", zin: "" },
  { id: "eerder-laser", label: "Eerder laser of IPL gehad", zin: "" },
  { id: "lichtgevoelige-medicatie", label: "Lichtgevoelige medicatie", zin: "Sommige antibiotica en kruidenmiddelen" },
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
export const PROFIEL_ONDERDELEN = 8;

export function compleetheid(p: Huidprofiel): number {
  return (
    (p.scan ? 1 : 0) +
    (p.doelen.length > 0 ? 1 : 0) +
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
  return [...SCAN_ASSEN].sort((a, b) => s.assen[b.id] - s.assen[a.id]).slice(0, 2);
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
    textuur: "deels",
    kleur: "deels",
    roodheid: "deels",
    lijntjes: "deels",
    haar: "deels",
    onbekend: "vol",
  },
  hydrafacial: { textuur: "deels" },
  oxygeneo: { textuur: "deels" },
  dermaplaning: { textuur: "deels" },
  coolift: { lijntjes: "deels" },
  peelings: { kleur: "vol", textuur: "deels", lijntjes: "deels" },
  skinpen: { textuur: "vol", lijntjes: "vol" },
  "dermapen-4": { textuur: "vol", lijntjes: "vol" },
  skinboosters: { lijntjes: "vol", kleur: "deels" },
  fotona: { lijntjes: "vol", textuur: "vol" },
  "nordlys-ipl": { roodheid: "vol", kleur: "vol" },
  "lumi-8-led": { roodheid: "deels", lijntjes: "deels" },
  "cosmelan-dermamelan": { kleur: "vol" },
  "happy-intim": { kleur: "vol" },
  laserontharing: { haar: "vol" },
  "acne-traject": { textuur: "deels" },
  littekentherapie: { textuur: "vol" },
  voedingsintolerantietest: { onbekend: "deels" },
};

/** Wat een behandeling aan hersteltijd vraagt, op dezelfde schaal als de vraag. */
const HERSTELVRAAG: Record<string, HerstelId> = {
  huidanalyse: "geen",
  hydrafacial: "geen",
  oxygeneo: "geen",
  dermaplaning: "geen",
  coolift: "geen",
  "lumi-8-led": "geen",
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
}[] = [
  {
    wanneer: (p) => p.situatie.includes("gebruind"),
    slugs: ["laserontharing", "nordlys-ipl", "fotona"],
    reden:
      "Kan niet op een gebruinde huid: het licht wordt dan opgenomen door het pigment in je huid in plaats van door het doel.",
  },
  {
    wanneer: (p) => p.situatie.includes("zon-op-komst"),
    slugs: ["peelings", "cosmelan-dermamelan", "laserontharing", "nordlys-ipl", "fotona", "happy-intim"],
    reden:
      "Niet vlak voor veel zon. De huid is daarna kwetsbaar, en pigment komt juist terug van wat je dan doet.",
  },
  {
    wanneer: (p) =>
      p.situatie.includes("zwanger") || p.situatie.includes("borstvoeding"),
    slugs: ["peelings", "cosmelan-dermamelan", "skinboosters", "xl-hair", "happy-intim", "acne-traject"],
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
];

/** Wat er wél kan, maar besproken moet worden. Blokkeert niets. */
const LET_OP: readonly {
  readonly wanneer: (p: Huidprofiel) => boolean;
  readonly slugs: readonly string[];
  readonly tekst: string;
}[] = [
  {
    wanneer: (p) => p.gebruikt.includes("retinol") || p.gebruikt.includes("zuren"),
    slugs: ["peelings", "skinpen", "dermapen-4", "fotona", "happy-intim"],
    tekst:
      "Je gebruikt retinol of zuren. Die moet je tijdig pauzeren; hoe lang hoor je in de intake.",
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

export type Match = {
  readonly behandeling: Behandeling;
  readonly oordeel: MatchOordeel;
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
    const letOp = LET_OP.filter((l) => l.wanneer(p) && l.slugs.includes(b.slug)).map(
      (l) => l.tekst,
    );

    const blok = BLOKKADES.find((x) => x.wanneer(p) && x.slugs.includes(b.slug));
    if (blok) {
      return { behandeling: b, oordeel: "past-niet", reden: blok.reden, letOp };
    }

    if (p.herstel) {
      const vraagt = HERSTELVRAAG[b.slug] ?? "dag";
      const ruimte = RUIMTE_VOLGORDE.indexOf(p.herstel);
      const nodig = RUIMTE_VOLGORDE.indexOf(vraagt);
      if (nodig > ruimte) {
        const gaf =
          HERSTELRUIMTE.find((h) => h.id === p.herstel)?.label.toLowerCase() ?? "geen";
        const moet =
          vraagt === "dagen" ? "een paar dagen" : vraagt === "dag" ? "een dag" : "niets";
        return {
          behandeling: b,
          oordeel: "past-niet",
          reden: `Vraagt meer hersteltijd dan je aangaf. Je gaf ${gaf} op, en hiervoor moet je rekenen op ${moet}.`,
          letOp,
        };
      }
    }

    if (p.doelen.length > 0) {
      const doelen = DOELMATRIX[b.slug] ?? {};
      const raak = p.doelen.filter((d) => doelen[d] === "vol");
      const zijdelings = p.doelen.filter((d) => doelen[d] === "deels");

      if (raak.length > 0) {
        const namen = raak.map((d) => DOELEN.find((x) => x.id === d)!.label.toLowerCase());
        return {
          behandeling: b,
          oordeel: "past",
          reden: `Hiervoor is deze behandeling gemaakt: ${namen.join(" en ")}.`,
          letOp,
        };
      }
      if (zijdelings.length > 0) {
        const namen = zijdelings.map(
          (d) => DOELEN.find((x) => x.id === d)!.label.toLowerCase(),
        );
        return {
          behandeling: b,
          oordeel: "deels",
          reden: `Doet iets aan ${namen.join(" en ")}, maar daar is het niet voor gemaakt.`,
          letOp,
        };
      }
      return {
        behandeling: b,
        oordeel: "past-niet",
        reden: "Werkt niet op wat jij wil veranderen. Niet minder goed, gewoon iets anders.",
        letOp,
      };
    }

    return {
      behandeling: b,
      oordeel: "deels",
      reden: "Kies eerst wat je wil veranderen.",
      letOp,
    };
  });
}

/**
 * Alles wat je in de intake moet melden, ongeacht welke behandeling het wordt.
 *
 * Dit is de lijst die deze pagina het meest waard maakt: hij bestaat uit dingen die in de
 * praktijk pas aan de balie boven tafel komen, en dan een afspraak kosten.
 */
export function meldPunten(p: Huidprofiel): readonly string[] {
  const uniek = new Set<string>();
  for (const l of LET_OP) if (l.wanneer(p)) uniek.add(l.tekst);
  for (const b of BLOKKADES) if (b.wanneer(p)) uniek.add(b.reden);
  return [...uniek];
}

/**
 * De kanttekening bij het huidtype. Geen enkel type sluit iets uit; wat het wel doet is de
 * instellingen bepalen. [MEDISCHE-CHECK-ROJDA]
 */
export function huidtypeKanttekening(t: FitzpatrickId | null): string | null {
  if (!t) return null;
  if (t === "V" || t === "VI") {
    return "Bij jouw huidtype worden licht en warmte anders opgenomen. Dat sluit niets uit, maar de instellingen luisteren nauwer en dat bepaalt een mens, niet deze pagina.";
  }
  if (t === "I" || t === "II") {
    return "Bij jouw huidtype is de huid gevoeliger voor zon na een behandeling. Dat is geen beperking maar wel een afspraak over wat je erna doet.";
  }
  return "Bij jouw huidtype is er ruimte in de instellingen. Wat er precies gekozen wordt hoor je in de intake.";
}
