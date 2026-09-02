/**
 * Inhoud van de pagina over donkere kringen.
 *
 * De klinische waarheid die deze pagina eigen maakt: "donkere kringen" is geen aandoening
 * maar een uiterlijk kenmerk met drie verschillende oorzaken, en die vragen alle drie iets
 * anders. Eén ervan kan een huidkliniek helemaal niet oplossen en bij een tweede valt maar
 * de helft te halen. Dat niet vertellen levert drie keer dezelfde behandeling op bij drie
 * verschillende problemen.
 *
 * Vocht is bewust géén vierde type. Het veroorzaakt niets, het maakt de andere drie
 * tijdelijk erger, en het staat daarom als losse notitie onder de uitkomst.
 *
 * Het bijzondere is dat je zelf kunt uitzoeken welke van de drie het is, met twee
 * handelingen voor de spiegel die niets kosten. Dat is de interactie geworden: de pagina
 * laat je iets doen met je eigen gezicht en leest daarna mee.
 *
 * COPY-STATUS: concept in de Diba-stem. Medische beweringen gemarkeerd voor Rojda. Geen
 * percentages, geen uitspraken over hoe vaak iets voorkomt: dat weten we niet (A7).
 */

import { kostenVraag } from "@/data/pillar-kosten";

export type Antwoord = {
  readonly id: string;
  readonly label: string;
  readonly onder: string;
};

export type Test = {
  readonly id: "rek" | "licht" | "ochtend";
  readonly nummer: string;
  readonly kop: string;
  readonly opdracht: string;
  readonly waarom: string;
  readonly antwoorden: readonly Antwoord[];
};

export const TESTEN: readonly Test[] = [
  {
    id: "licht",
    nummer: "Eerste test",
    kop: "Licht recht van voren",
    opdracht:
      "Ga voor een raam staan met het daglicht recht in je gezicht, en kijk dan in je telefoon. Vergelijk dat met hoe het eruitziet onder een lamp aan het plafond.",
    waarom:
      "Licht van boven maakt van elke holte een donkere plek. Verdwijnt de kring bij licht van voren, dan kijk je naar een schaduw en niet naar een kleur.",
    antwoorden: [
      {
        id: "verdwijnt",
        label: "Veel lichter of weg",
        onder: "Onder de lamp duidelijk donkerder dan bij het raam",
      },
      {
        id: "blijft",
        label: "Blijft ongeveer gelijk",
        onder: "Het maakt weinig uit waar het licht vandaan komt",
      },
    ],
  },
  {
    id: "rek",
    nummer: "Tweede test",
    kop: "Rek de huid zachtjes",
    opdracht:
      "Leg een vinger op je jukbeen en trek de huid onder je oog voorzichtig een klein stukje naar beneden. Niet aan het ooglid zelf trekken. Kijk wat de donkerte doet.",
    waarom:
      "Bij uitrekken worden doorschijnende bloedvaatjes verder uit elkaar getrokken en verbleekt de kleur. Pigment zit in de huid zelf en verandert niet mee. [MEDISCHE-CHECK-ROJDA]",
    antwoorden: [
      {
        id: "vervaagt",
        label: "Wordt duidelijk lichter",
        onder: "De kleur trekt weg zolang je rekt",
      },
      {
        id: "blijft",
        label: "Verandert nauwelijks",
        onder: "De bruine tint blijft gewoon staan",
      },
    ],
  },
  {
    id: "ochtend",
    nummer: "Derde test",
    kop: "Let op het moment",
    opdracht:
      "Denk aan de afgelopen weken. Is het 's ochtends erger dan 's avonds, of duidelijk erger na een korte nacht, na zout eten of na huilen?",
    waarom:
      "Dan speelt vocht mee. Dat is geen aparte oorzaak maar het maakt elk van de andere drie tijdelijk erger, en het verklaart waarom je resultaat lijkt te schommelen.",
    antwoorden: [
      {
        id: "ja",
        label: "Ja, het wisselt sterk",
        onder: "Sommige ochtenden veel erger",
      },
      {
        id: "nee",
        label: "Nee, het is vrij constant",
        onder: "Elke dag ongeveer hetzelfde",
      },
    ],
  },
] as const;

export type UitkomstId = "schaduw" | "pigment" | "vaten";

export type Uitkomst = {
  readonly id: UitkomstId;
  readonly kop: string;
  readonly vakterm: string;
  readonly watHetIs: string;
  readonly kunnenWij: string;
  /** Bepaalt de toon van het antwoordvlak en de knop. */
  readonly wijHelpen: "ja" | "deels" | "nee";
  readonly zelf: string;
};

export const UITKOMSTEN: Record<UitkomstId, Uitkomst> = {
  schaduw: {
    id: "schaduw",
    kop: "Dit is schaduw, geen kleur",
    vakterm: "traandalgroeve, structurele schaduw",
    watHetIs:
      "De overgang tussen je onderooglid en je wang ligt iets dieper, en licht van boven maakt daar een schaduw van. De huid zelf heeft geen afwijkende kleur. [MEDISCHE-CHECK-ROJDA]",
    kunnenWij:
      "Niets zinvols. Een huidbehandeling verandert de vorm van je gezicht niet, en een lichtere huid maakt een schaduw niet ondieper. Dit hoort bij een arts, of bij niets doen.",
    wijHelpen: "nee",
    zelf: "Wat wél helpt is de richting van het licht: recht van voren, niet van bovenaf. Dat verklaart ook waarom je er op de ene foto uitgerust uitziet en op de andere niet.",
  },
  pigment: {
    id: "pigment",
    kop: "Dit is pigment",
    vakterm: "peri-orbitale hyperpigmentatie",
    watHetIs:
      "Er zit meer kleur in de huid onder je oog. Dat kan erfelijk zijn, kan volgen op eczeem of wrijven, en komt vaker voor bij een donkere huid. [MEDISCHE-CHECK-ROJDA]",
    kunnenWij:
      "Ja, voorzichtig. Dit is het enige type dat echt op behandeling reageert. De huid daar is dun en gevoelig, dus we gaan hier langzamer te werk dan elders in het gezicht.",
    wijHelpen: "ja",
    zelf: "Stoppen met wrijven scheelt meer dan mensen denken, en zonbescherming ook op je ooglid houdt het waar het nu is.",
  },
  vaten: {
    id: "vaten",
    kop: "Dit zijn doorschijnende vaatjes",
    vakterm: "vasculaire kringen",
    watHetIs:
      "De huid onder je oog is de dunste van je lichaam. Bij sommige mensen schemert het bloedvatennetwerk eronder erdoorheen, wat een blauwpaarse tint geeft. [MEDISCHE-CHECK-ROJDA]",
    kunnenWij:
      "Deels. We kunnen niet aan de vaatjes zelf werken op deze plek, wel aan de dikte en stevigheid van de huid erboven. Verwacht minder doorschemeren, geen verdwijnen.",
    wijHelpen: "deels",
    zelf: "Slaap en vocht maken hier het meeste verschil van alle drie de typen, want een gevuld vaatnetwerk schemert sterker door.",
  },
};

/** De extra regel als vocht meespeelt. Geldt bij elke uitkomst. */
export const VOCHT_NOTITIE =
  "Je gaf aan dat het sterk wisselt. Dan speelt vocht mee bovenop wat hierboven staat. Dat is geen aparte oorzaak en ook niets wat wij behandelen, maar het verklaart wel waarom je op sommige dagen denkt dat een behandeling niet werkt.";

/* ── De rest van de pagina ─────────────────────────────────────────────── */

export const KRINGEN_WEL_NIET = {
  wel: [
    "Eerst uitzoeken welk van de drie types het is. Dat kost je twee minuten voor de spiegel en bepaalt of behandelen überhaupt zin heeft.",
    "Zonbescherming tot op het ooglid als het om pigment gaat. Die plek wordt bijna altijd overgeslagen.",
    "Stoppen met wrijven. Wrijven en krabben zijn een bekende aanjager van pigment op deze plek.",
    "Je foto's onder hetzelfde licht vergelijken, want licht van boven maakt elke kring erger.",
    "Accepteren dat een deel van wat je ziet bij je gezicht hoort en niet bij je huid.",
  ],
  niet: [
    "Een behandeling boeken voordat duidelijk is welk type je hebt. Bij één van de drie levert dat niets op en bij een tweede maar de helft.",
    "Agressief werken op de dunne huid onder het oog. Dat geeft daar juist een grotere kans op meer pigment.",
    "Denken dat het aan slaap ligt. Slaap maakt het wisselen erger, maar veroorzaakt geen van de drie types.",
    "Concealer als maatstaf nemen. Die dekt kleur af en verandert niets aan een schaduw.",
    "Op internet gevonden hoeveelheden vitamine K of cafeïne aanhouden. Daar is voor deze plek geen betrouwbaar bewijs voor. [MEDISCHE-CHECK-ROJDA]",
  ],
} as const;

export const KRINGEN_WIJ_DOEN_NIET = [
  {
    titel: "Geen behandeling bij schaduw",
    tekst:
      "Als de test uitwijst dat het schaduw is, sturen we je weg zonder behandeling. Een huidkliniek verandert de vorm van je oogkas niet en doet er dus beter aan dat te zeggen.",
  },
  {
    titel: "Geen agressieve technieken onder het oog",
    tekst:
      "De huid daar is de dunste van je lichaam. We gaan er trager te werk dan elders, ook als dat betekent dat je meer sessies nodig hebt. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen belofte van uitgerust",
    tekst:
      "Wij behandelen kleur, geen vermoeidheid. Als je er moe uitziet omdat je moe bent, is dat geen huidprobleem en zeggen we dat gewoon.",
  },
] as const;

export const KRINGEN_FAQ = [
  {
    vraag: "Komt het echt niet door te weinig slaap?",
    antwoord:
      "Slaaptekort veroorzaakt geen van de drie types. Het maakt wel dat je gezicht vochtiger en bleker is, waardoor bestaande kringen sterker opvallen. Uitslapen laat ze dus tijdelijk meevallen zonder dat er iets veranderd is.",
  },
  {
    vraag: "Mijn moeder heeft ze ook. Is dat toeval?",
    antwoord:
      "Waarschijnlijk niet. Zowel de vorm van de oogkas als de neiging tot pigment op deze plek zit in de familie. Dat verandert niets aan wat er mogelijk is, maar het verklaart wel waarom ze er al vroeg waren. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Ik heb een donkere huid. Verandert dat iets?",
    antwoord:
      "Ja. Pigment onder het oog komt vaker voor bij een donkere huid, en tegelijk is de kans op ongewenste verkleuring na een te stevige behandeling daar groter. Rustiger werken is dan geen voorzichtigheid maar noodzaak. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Helpt een oogcrème?",
    antwoord:
      "Bij pigment kan verzorging meehelpen, bij schaduw doet die niets. Dat is precies waarom het loont om eerst te weten welk type je hebt in plaats van iets te kopen.",
  },
  {
    vraag: "Hoeveel sessies heb ik nodig?",
    antwoord:
      "Meestal drie tot zes, met vier tot zes weken ertussen, en dat hoor je pas na de meting omdat het van de oorzaak afhangt. Bij pigment werken we onder het oog bewust in kleinere stappen, dus reken op meer sessies dan bij dezelfde vlek op je wang. [GEGEVEN-NODIG]",
  },
  kostenVraag(),
] as const;
