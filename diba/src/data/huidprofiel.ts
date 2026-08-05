/**
 * Het huidprofiel.
 *
 * Dit is het idee dat de behandelingenpagina van een brochure een gesprek maakt: de site
 * onthoudt drie dingen over jou en stuurt daar de rest mee aan.
 *
 *   1. Wat wil je veranderen
 *   2. Welk huidtype heb je
 *   3. Hoeveel hersteltijd kun je hebben
 *
 * Die derde vraag is de Diba-vraag. Geen enkele kliniek stelt hem, terwijl hij vaak
 * beslissender is dan de eerste twee: wie maandag moet werken kan geen behandeling
 * gebruiken waar je drie dagen rood van bent, hoe goed die verder ook past. Door hem hier
 * te stellen valt de helft van de teleurstelling weg voordat er geboekt is.
 *
 * WAT DIT UITDRUKKELIJK NIET IS. Geen diagnose, geen advies en geen aanbeveling. De
 * uitkomst zegt alleen wat er past bij wat je zélf hebt ingevuld, en zegt er even hard bij
 * wat níet past en waarom. Dat verschil is het hele punt: een matchlijst die alleen groene
 * vinkjes geeft is een verkoopmachine.
 *
 * Het profiel staat in de browser van de bezoeker en nergens anders. Geen account, geen
 * server, geen cookie die iemand volgt. Het is een voorproefje van Mijn Diba, en de
 * spelregel daar wordt dezelfde: jouw gegevens zijn van jou.
 *
 * COPY-STATUS: concept. De koppeling tussen doel en behandeling langs Rojda.
 */

import { BEHANDELINGEN, type Behandeling } from "@/data/behandelingen";
import { FITZPATRICK_TYPES, type FitzpatrickId } from "@/data/laser-zones";

export { FITZPATRICK_TYPES };
export type { FitzpatrickId };

/** Wat iemand wil veranderen, in gewone woorden en niet in vaktermen. */
export const DOELEN = [
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
    label: "Haargroei",
    zin: "Ongewenste haren, waar dan ook",
  },
  {
    id: "onbekend",
    label: "Weet ik niet",
    zin: "Er is iets, maar wat precies weet ik niet",
  },
] as const;

export type DoelId = (typeof DOELEN)[number]["id"];

/** Hoeveel je erna kunt hebben. De vraag die de rest van de site niet stelt. */
export const HERSTELRUIMTE = [
  {
    id: "geen",
    label: "Geen",
    zin: "Ik moet er meteen weer normaal uitzien",
  },
  {
    id: "dag",
    label: "Een dag",
    zin: "Een avond en een nacht rood mag",
  },
  {
    id: "dagen",
    label: "Een paar dagen",
    zin: "Ik kan het inplannen rond een weekend",
  },
] as const;

export type HerstelId = (typeof HERSTELRUIMTE)[number]["id"];

/**
 * De zes assen van de Eve-M-mini-scan.
 *
 * Stonden eerst binnen in `MiniHuidscan` en konden daardoor nergens anders komen. Nu is
 * dit de bron: de scan vult ze, het spinnenweb tekent ze, het uitklapje rechtsonder toont
 * ze terug en de behandelingenpagina leest ze.
 */
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
 * Wat de mini-scan achterlaat.
 *
 * Let op wat er níet in zit: geen meting. Dit is wat iemand zelf heeft aangegeven, en dat
 * onderscheid staat overal waar dit getoond wordt met zoveel woorden erbij. Het
 * spinnenweb houdt daarom ook zijn open buitenring: die ruimte is wat Eve-M er straks
 * echt bij meet.
 */
export type Huidscan = {
  readonly assen: Readonly<Record<AsId, number>>;
  /** Het antwoord op de eerste vraag, letterlijk zoals de bezoeker het koos. */
  readonly focusLabel: string;
  /** De huidprobleempagina die daarbij hoort, als die er is. */
  readonly pillar: string | null;
  readonly kort: string | null;
  /** ISO-datum. Een profiel van een half jaar oud mag zich niet voordoen als vers. */
  readonly op: string;
};

export type Huidprofiel = {
  readonly doelen: readonly DoelId[];
  readonly huidtype: FitzpatrickId | null;
  readonly herstel: HerstelId | null;
  /** Ingevuld zodra iemand de mini-scan heeft gedaan, op welke pagina dan ook. */
  readonly scan: Huidscan | null;
};

export const LEEG_PROFIEL: Huidprofiel = {
  doelen: [],
  huidtype: null,
  herstel: null,
  scan: null,
};

export function profielIsLeeg(p: Huidprofiel): boolean {
  return (
    p.doelen.length === 0 &&
    p.huidtype === null &&
    p.herstel === null &&
    p.scan === null
  );
}

/** Hoeveel van de drie vragen beantwoord zijn. Stuurt de blaadjes. */
export function ingevuld(p: Huidprofiel): number {
  return (
    (p.doelen.length > 0 ? 1 : 0) + (p.huidtype ? 1 : 0) + (p.herstel ? 1 : 0)
  );
}

/** De twee assen waar de scan het hoogst op uitkwam. */
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

/**
 * Welke doelen een behandeling raakt.
 *
 * Dit is de tabel waar alles op draait, en het is ook de tabel die het scherpst langs
 * Rojda moet. "Deels" betekent hier: het doet er iets aan, maar het is niet waar deze
 * behandeling voor gemaakt is.
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
  "chemische-peeling": { kleur: "vol", textuur: "deels", lijntjes: "deels" },
  microneedling: { textuur: "vol", lijntjes: "vol" },
  lasertherapie: { haar: "vol", kleur: "vol", roodheid: "vol" },
  ipl: { roodheid: "vol", kleur: "deels" },
};

/** Wat een behandeling aan hersteltijd vraagt, op dezelfde schaal als de vraag. */
const HERSTELVRAAG: Record<string, HerstelId> = {
  huidanalyse: "geen",
  ipl: "geen",
  lasertherapie: "dag",
  microneedling: "dag",
  "chemische-peeling": "dagen",
};

const RUIMTE_VOLGORDE: HerstelId[] = ["geen", "dag", "dagen"];

export type MatchOordeel = "past" | "deels" | "past-niet";

export type Match = {
  readonly behandeling: Behandeling;
  readonly oordeel: MatchOordeel;
  /** Waarom. Bij "past-niet" is dit de belangrijkste regel op de pagina. */
  readonly reden: string;
};

/**
 * Vergelijkt het profiel met de vijf behandelingen.
 *
 * De volgorde van de controles is niet willekeurig. Eerst hersteltijd, dan doel. Een
 * behandeling die perfect bij je doel past maar die je niet kúnt inplannen is geen match,
 * en dat andersom vertellen ("past bij je doel, maar…") is precies hoe je iemand toch die
 * afspraak in praat.
 */
export function maakMatches(p: Huidprofiel): readonly Match[] {
  return BEHANDELINGEN.map((b): Match => {
    const vraagt = HERSTELVRAAG[b.slug];
    const doelen = DOELMATRIX[b.slug] ?? {};

    /* Hersteltijd eerst. */
    if (p.herstel) {
      const ruimte = RUIMTE_VOLGORDE.indexOf(p.herstel);
      const nodig = RUIMTE_VOLGORDE.indexOf(vraagt);
      if (nodig > ruimte) {
        return {
          behandeling: b,
          oordeel: "past-niet",
          reden: `Vraagt meer hersteltijd dan je aangaf. Je gaf ${
            HERSTELRUIMTE.find((h) => h.id === p.herstel)?.label.toLowerCase() ?? "geen"
          } op, en hiervoor moet je rekenen op ${vraagt === "dagen" ? "een paar dagen" : vraagt === "dag" ? "een dag" : "niets"}.`,
        };
      }
    }

    /* Dan het doel. */
    if (p.doelen.length > 0) {
      const raak = p.doelen.filter((d) => doelen[d] === "vol");
      const zijdelings = p.doelen.filter((d) => doelen[d] === "deels");

      if (raak.length > 0) {
        const namen = raak.map((d) => DOELEN.find((x) => x.id === d)!.label.toLowerCase());
        return {
          behandeling: b,
          oordeel: "past",
          reden: `Hiervoor is deze behandeling gemaakt: ${namen.join(" en ")}.`,
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
        };
      }
      return {
        behandeling: b,
        oordeel: "past-niet",
        reden: "Werkt niet op wat jij wil veranderen. Niet minder goed, gewoon iets anders.",
      };
    }

    /* Nog geen doel gekozen: dan valt er nog niets te matchen. */
    return {
      behandeling: b,
      oordeel: "deels",
      reden: "Kies eerst wat je wil veranderen.",
    };
  });
}

/**
 * De kanttekening bij het huidtype.
 *
 * Geen enkel huidtype sluit iets uit. Wat het wel doet is de instellingen bepalen, en bij
 * de donkerste types is dat geen detail maar de kern van de veiligheid. Dat zeggen we
 * hier, en we zeggen er niet bij wat de uitkomst wordt: dat is aan een mens.
 *
 * [MEDISCHE-CHECK-ROJDA]
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
