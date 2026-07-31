/**
 * Inhoud van de pagina over huidverkleuring.
 *
 * "Verkleuring" is een verzamelwoord waar mensen op zoeken omdat ze de goede term niet
 * kennen. Deze pagina behandelt dus geen aandoening: hij sorteert. En hij sorteert op het
 * eerste dat een behandelaar ook doet, namelijk de kleur, want die zegt meteen iets over
 * de laag waarin het zit en dus over wat er mogelijk is.
 *
 * Bruin is pigment, rood is bloedvaten, wit is verlies van pigment, blauwpaars is diepte
 * of doorschijnen. Vier kleuren, vier verhalen, vier andere antwoorden. [MEDISCHE-CHECK-ROJDA]
 *
 * Deze pagina verkoopt niets. Hij stuurt je door naar de pagina die er wél over gaat, en
 * bij wit stuurt hij je de deur uit.
 *
 * COPY-STATUS: concept. Medische inhoud langs Rojda.
 */

export type Kleur = {
  readonly id: "bruin" | "rood" | "wit" | "blauw";
  readonly naam: string;
  readonly staal: string;
  readonly watHetIs: string;
  readonly vraag: string;
  readonly routes: readonly {
    readonly naam: string;
    readonly wanneer: string;
    readonly pad: string;
  }[];
};

export const KLEUREN: readonly Kleur[] = [
  {
    id: "bruin",
    naam: "Bruin of beige",
    staal: "var(--warn)",
    watHetIs:
      "Meer pigment dan de huid eromheen. De vraag die telt is niet hoe donker maar waaróm het er zit, want dat bepaalt wat er mogelijk is. [MEDISCHE-CHECK-ROJDA]",
    vraag: "Kwam het geleidelijk met de jaren, of kwam het in vlakken tegelijk?",
    routes: [
      {
        naam: "Pigmentvlekken",
        wanneer: "Losse plekjes die er tien jaar geleden niet zaten, vooral waar zon komt.",
        pad: "/huidproblemen/pigmentvlekken",
      },
      {
        naam: "Melasma",
        wanneer:
          "Grotere vlakken op wangen, bovenlip of voorhoofd, vaak begonnen bij zwangerschap of de pil.",
        pad: "/huidproblemen/melasma",
      },
      {
        naam: "Donkere kringen",
        wanneer: "Alleen onder je ogen, en de rest van je gezicht is egaal.",
        pad: "/huidproblemen/donkere-kringen",
      },
    ],
  },
  {
    id: "rood",
    naam: "Rood of roze",
    staal: "var(--litteken-rijpend)",
    watHetIs:
      "Bloed in de vaatjes, of ontsteking. Rood is bijna altijd iets dat leeft en beweegt, en dat is precies waarom het anders reageert dan bruin. [MEDISCHE-CHECK-ROJDA]",
    vraag: "Komt het op en gaat het weer weg, of staat het er altijd?",
    routes: [
      {
        naam: "Rosacea",
        wanneer:
          "Blijvende roodheid op wangen en neus, met opvlammingen na warmte, alcohol of inspanning.",
        pad: "/huidproblemen/rosacea",
      },
      {
        naam: "Acne",
        wanneer: "Rode plekjes met bultjes of puistjes erin, die komen en gaan.",
        pad: "/huidproblemen/acne",
      },
      {
        naam: "Huiduitslag",
        wanneer:
          "Plotseling opgekomen, verspreid, of samen met ziek zijn. Doe dan eerst de glastest.",
        pad: "/huidproblemen/huiduitslag",
      },
      {
        naam: "Littekens",
        wanneer: "Eén rode streep of plek op de plaats van een oude wond of van striae.",
        pad: "/huidproblemen/littekens",
      },
    ],
  },
  {
    id: "wit",
    naam: "Wit of lichter",
    staal: "var(--litteken-oud)",
    watHetIs:
      "Minder pigment dan de huid eromheen. Dit is de lastigste categorie, want verloren pigment komt zelden terug en een deel hoort bij de huisarts. [MEDISCHE-CHECK-ROJDA]",
    vraag: "Zit het op één oude plek, of komen er verspreid nieuwe plekken bij?",
    routes: [
      {
        naam: "Littekens en striae",
        wanneer: "Eén plek die precies samenvalt met een oud litteken of oude striae.",
        pad: "/huidproblemen/littekens",
      },
      {
        naam: "Naar de huisarts",
        wanneer:
          "Verspreide witte plekken die groter worden of erbij komen. Dat hoort bij een arts en niet bij ons.",
        pad: "/huidproblemen/moedervlekken",
      },
    ],
  },
  {
    id: "blauw",
    naam: "Blauw of paars",
    staal: "var(--litteken-verkleurend)",
    watHetIs:
      "Meestal iets dat door de huid heen schemert, of pigment dat dieper zit dan gewoonlijk. De kleur zegt hier vooral iets over de diepte. [MEDISCHE-CHECK-ROJDA]",
    vraag: "Zit het onder je ogen, of ergens anders?",
    routes: [
      {
        naam: "Donkere kringen",
        wanneer: "Onder de ogen, blauwpaars van tint, en het wisselt met slaap en vocht.",
        pad: "/huidproblemen/donkere-kringen",
      },
      {
        naam: "Littekens en striae",
        wanneer: "Paarse strepen op buik, dijen of borsten, vaak nog vrij nieuw.",
        pad: "/huidproblemen/littekens",
      },
      {
        naam: "Naar de huisarts",
        wanneer:
          "Een blauwe plek zonder dat je je gestoten hebt, of iets dat snel verandert.",
        pad: "/huidproblemen/moedervlekken",
      },
    ],
  },
];

export const KLEUR_UITLEG =
  "Waarom de kleur en niet de plaats: de kleur zegt iets over de laag waarin het zit. Pigment ligt anders dan bloedvaten, en dat bepaalt of iets reageert op behandeling. Een behandelaar kijkt daarom als eerste hiernaar, en jij kunt dat ook.";

export const VERKLEURING_FAQ = [
  {
    vraag: "Wat als ik meerdere kleuren tegelijk heb?",
    antwoord:
      "Dat komt vaak voor en het betekent meestal dat er meer dan één ding speelt. Begin bij de kleur die je het meest stoort; de rest komt in het gesprek vanzelf aan bod.",
  },
  {
    vraag: "Ik weet niet goed welke kleur het is.",
    antwoord:
      "Kijk bij daglicht en niet onder een lamp, en houd je onderarm ernaast als vergelijking. Twijfel je tussen bruin en rood, druk er dan even op: rood verbleekt onder druk, bruin niet.",
  },
  {
    vraag: "Is verkleuring gevaarlijk?",
    antwoord:
      "Meestal niet, en er zijn uitzonderingen die er wel toe doen. Een plek die verandert van vorm, kleur of grootte hoort bij de huisarts, en dat geldt voor elke kleur.",
  },
  {
    vraag: "Waarom staat er geen prijs op deze pagina?",
    antwoord:
      "Omdat hier niets te koop is. Dit is een wegwijzer; de prijzen staan bij de behandeling die er uiteindelijk bij hoort.",
  },
] as const;
