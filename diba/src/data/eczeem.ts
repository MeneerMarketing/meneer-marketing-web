/**
 * Inhoud van de eczeempagina.
 *
 * De klinische waarheid die deze pagina eigen maakt: eczeem is een cirkel en geen plek.
 * Jeuk leidt tot krabben, krabben beschadigt de barrière, een beschadigde barrière laat
 * meer prikkels door, en die geven weer jeuk. Wie alleen naar de plek kijkt behandelt één
 * punt van een lus die gewoon doordraait.
 *
 * Daarom is de interactie een cirkel met vier plekken waar hij te doorbreken valt, en
 * staat er bij elke plek wie dat doet. Bij twee van de vier zijn wij dat niet: eczeem
 * hoort bij de huisarts of de dermatoloog, en wij ondersteunen hooguit de barrière.
 *
 * COPY-STATUS: concept. Alle medische inhoud langs Rojda voordat dit online mag. Geen
 * uitspraken over medicatie of doseringen: dat is niet aan ons.
 */

export type Schakel = {
  readonly id: string;
  readonly naam: string;
  /** Korte variant voor op de ring; de volle naam staat in de lezing ernaast. */
  readonly kort: string;
  readonly watGebeurtEr: string;
  /** Waar de lus te doorbreken valt, en door wie. */
  readonly doorbreken: string;
  readonly wie: "huisarts" | "jij" | "wij";
};

export const CIRKEL: readonly Schakel[] = [
  {
    id: "jeuk",
    naam: "Jeuk",
    kort: "Jeuk",
    watGebeurtEr:
      "De huid geeft een prikkel af die je bijna niet kunt negeren, en die 's avonds en 's nachts het sterkst is. [MEDISCHE-CHECK-ROJDA]",
    doorbreken:
      "Dit is het punt waar medicatie het meest uitmaakt. Een ontstekingsremmende zalf op het juiste moment breekt de lus vaak in dagen, en dat schrijft je huisarts voor.",
    wie: "huisarts",
  },
  {
    id: "krabben",
    naam: "Krabben",
    kort: "Krabben",
    watGebeurtEr:
      "Krabben geeft even opluchting doordat de jeukprikkel wordt overstemd. Daarna komt hij harder terug.",
    doorbreken:
      "Hier ligt het enige punt dat volledig bij jou ligt. Nagels kort, koelen in plaats van krabben, en 's nachts iets tussen je nagels en je huid. Dat klinkt klein en het is de meest onderschatte stap.",
    wie: "jij",
  },
  {
    id: "barriere",
    naam: "Barrière kapot",
    kort: "Barrière",
    watGebeurtEr:
      "De bovenste laag raakt beschadigd en houdt geen vocht meer vast. De huid wordt droger, ruwer en gevoeliger dan hij al was. [MEDISCHE-CHECK-ROJDA]",
    doorbreken:
      "Dit is het enige punt waar wij iets kunnen betekenen: de barrière ondersteunen zodat hij minder lekt. Wij behandelen het eczeem niet, we maken de omstandigheden minder ongunstig.",
    wie: "wij",
  },
  {
    id: "prikkels",
    naam: "Prikkels binnen",
    kort: "Prikkels",
    watGebeurtEr:
      "Door de kapotte barrière komen stoffen naar binnen die er normaal niet doorheen komen, en het afweersysteem reageert daarop. [MEDISCHE-CHECK-ROJDA]",
    doorbreken:
      "Uitzoeken wat jouw prikkels zijn en die vermijden. Bij een vermoeden van allergie hoort daar onderzoek bij, en dat gaat via de huisarts.",
    wie: "huisarts",
  },
];

export const WIE_LABEL = {
  huisarts: "Dit doet je huisarts",
  jij: "Dit doe jij",
  wij: "Hier kunnen wij iets",
} as const;

export const CIRKEL_SLOT =
  "Twee van de vier punten liggen buiten onze deur, en dat is geen bescheidenheid maar de verdeling zoals hij is. Wie je vertelt dat een huidbehandeling eczeem oplost, kijkt naar één punt van een cirkel die daarna gewoon doordraait.";

/* ── Wanneer het geen eczeem is ────────────────────────────────────────── */

export const VERWAR_NIET = [
  {
    naam: "Een uitgedroogde huid",
    verschil:
      "Trekkerig en ruw, maar zonder de jeuk die je uit je slaap houdt en zonder plekken die steeds op dezelfde plaats terugkomen.",
    pad: "/huidproblemen/droge-huid",
    link: "Naar de droge huid",
  },
  {
    naam: "Contactallergie",
    verschil:
      "De reactie zit op een afgebakende plek met een duidelijke vorm en begint uren tot dagen na contact met iets.",
    pad: "/huidproblemen/huiduitslag",
    link: "Naar huiduitslag",
  },
  {
    naam: "Psoriasis",
    verschil:
      "Dikkere, scherp begrensde plekken met zilverwitte schilfers, vaak op ellebogen, knieën en hoofdhuid, en meestal minder jeuk.",
    pad: "/huidproblemen/psoriasis",
    link: "Naar psoriasis",
  },
] as const;

export const ECZEEM_WEL_NIET = {
  wel: [
    "Naar de huisarts bij aanhoudende jeuk, kloofjes of plekken die terugkomen. Dit is een aandoening met behandeling, en die begint daar.",
    "Dagelijks blijven insmeren, ook op de dagen dat er niets te zien is. Dat is bij eczeem de basis en geen bijzaak. [MEDISCHE-CHECK-ROJDA]",
    "Lauw en kort douchen, en daarna binnen enkele minuten insmeren.",
    "Nagels kort houden en 's nachts iets tussen je nagels en je huid. Het meeste krabben gebeurt in je slaap.",
    "Bijhouden wanneer het opvlamt. Prikkels zijn persoonlijk en een patroon zie je alleen achteraf.",
  ],
  niet: [
    "Wachten met de huisarts omdat je eerst een crème wilt proberen. Hoe langer de cirkel draait, hoe moeilijker hij te doorbreken is.",
    "Stoppen met een voorgeschreven zalf zodra het beter gaat, zonder dat met je arts te overleggen.",
    "Zeep en heet water gebruiken op een plek die al kapot is.",
    "Zelf diëten schrappen op verdenking van allergie. Dat kost je voedingsstoffen en levert zelden een antwoord op. [MEDISCHE-CHECK-ROJDA]",
    "Een cosmetische behandeling boeken op actief eczeem. Daar wordt het erger van en wij doen het dus niet.",
  ],
} as const;

export const ECZEEM_WIJ_DOEN_NIET = [
  {
    titel: "Wij behandelen geen eczeem",
    tekst:
      "Eczeem is een aandoening met een medische behandeling, en die hoort bij je huisarts of een dermatoloog. Wij nemen die rol niet over en gaan er ook geen mening over geven.",
  },
  {
    titel: "Geen behandeling op actieve plekken",
    tekst:
      "Is het op dit moment actief, dan behandelen we niet in dat gebied. Een geïrriteerde huid reageert feller en het resultaat is slechter.",
  },
  {
    titel: "Geen uitspraken over jouw medicatie",
    tekst:
      "Wat je smeert of slikt is tussen jou en je arts. We zullen je nooit aanraden ergens mee te stoppen of te minderen.",
  },
] as const;

export const ECZEEM_FAQ = [
  {
    vraag: "Kan ik met eczeem bij jullie terecht?",
    antwoord:
      "Voor het eczeem zelf niet, dat gaat naar de huisarts. Voor de huid eromheen soms wel, als die rustig is en je iets anders wilt aanpakken. We kijken dan of het verstandig is en zeggen het als het dat niet is.",
  },
  {
    vraag: "Gaat eczeem ooit over?",
    antwoord:
      "Bij kinderen verdwijnt het vaak grotendeels. Bij volwassenen gaat het meestal in periodes, met rustige tijden en opvlammingen. Dat betekent niet dat er niets aan te doen is, wel dat het beheerd wordt. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Is het besmettelijk?",
    antwoord: "Nee. Eczeem is niet overdraagbaar.",
  },
  {
    vraag: "Waarom is het 's nachts erger?",
    antwoord:
      "Je bent overdag afgeleid en 's avonds niet, en de huid is dan ook warmer. Daar komt bij dat je in je slaap krabt zonder het te merken. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Helpt zonlicht?",
    antwoord:
      "Bij sommige mensen wel en bij anderen niet, en verbranden maakt het altijd erger. Lichttherapie bestaat als behandeling maar die hoort bij de dermatoloog en niet bij een huidkliniek. [MEDISCHE-CHECK-ROJDA]",
  },
] as const;
