/**
 * Inhoud van de psoriasispagina.
 *
 * De klinische waarheid die deze pagina eigen maakt: psoriasis is geen huidprobleem maar
 * een afweeraandoening die zich in de huid laat zien. Dat verschil is niet academisch. Het
 * verklaart waarom een crème de plek aanpakt en niet de oorzaak, en het verklaart waarom
 * je nagels en je gewrichten erbij horen.
 *
 * Dat laatste is de reden dat deze pagina bestaat. Gewrichtsklachten bij psoriasis zijn
 * geen bijzaak: schade aan een gewricht komt niet terug. Wie dat niet weet wacht te lang,
 * en dat is precies het soort informatie dat wij wel mogen geven en een behandeling niet.
 *
 * COPY-STATUS: concept. Alle medische inhoud langs Rojda voordat dit online mag. Geen
 * uitspraken over medicatie: dat is niet aan ons.
 */

export type Zone = {
  readonly id: string;
  readonly naam: string;
  readonly vakterm: string;
  /** Korte variant voor op het silhouet; de volle naam staat in de lezing ernaast. */
  readonly kort: string;
  readonly watJeZiet: string;
  readonly waaromHetTelt: string;
  /** Dringend betekent: hier niet mee wachten. */
  readonly dringend: boolean;
};

export const ZONES: readonly Zone[] = [
  {
    id: "hoofdhuid",
    naam: "Hoofdhuid",
    vakterm: "psoriasis capitis",
    kort: "Hoofdhuid",
    watJeZiet:
      "Dikke schilfers die vastzitten aan het haar, vaak tot net over de haargrens op je voorhoofd of achter je oren.",
    waaromHetTelt:
      "Dit wordt het vaakst aangezien voor hardnekkige roos. Het verschil zit in de dikte en in de scherpe rand. [MEDISCHE-CHECK-ROJDA]",
    dringend: false,
  },
  {
    id: "strekzijden",
    naam: "Ellebogen en knieën",
    vakterm: "plaque psoriasis",
    kort: "Ellebogen",
    watJeZiet:
      "Scherp begrensde, iets verheven plekken met zilverwitte schilfers, meestal aan de buitenkant van je gewrichten.",
    waaromHetTelt:
      "De plaats is kenmerkend. Eczeem zit juist vaker in de plooien, aan de binnenkant. [MEDISCHE-CHECK-ROJDA]",
    dringend: false,
  },
  {
    id: "nagels",
    naam: "Nagels",
    vakterm: "nagelpsoriasis",
    kort: "Nagels",
    watJeZiet:
      "Putjes in het nageloppervlak, gele of oranje vlekjes, of een nagel die aan de rand loslaat.",
    waaromHetTelt:
      "Dit wordt vrijwel altijd voor schimmel aangezien en dan met het verkeerde middel behandeld. Nagelafwijkingen hangen bovendien samen met een grotere kans op gewrichtsklachten. [MEDISCHE-CHECK-ROJDA]",
    dringend: false,
  },
  {
    id: "gewrichten",
    naam: "Gewrichten",
    vakterm: "artritis psoriatica",
    kort: "Gewrichten",
    watJeZiet:
      "Stijfheid 's ochtends die langer dan een halfuur duurt, gezwollen vingers of tenen, of pijn in je onderrug die juist beter wordt van bewegen.",
    waaromHetTelt:
      "Hier niet mee wachten. Schade aan een gewricht is blijvend, en juist daarom telt het als je er vroeg bij bent. Noem het bij je huisarts, ook als de huidplekken meevallen. [MEDISCHE-CHECK-ROJDA]",
    dringend: true,
  },
];

export const SILHOUET_SLOT =
  "Vier plekken, één aandoening. Dat is de reden dat een crème de plek aanpakt en niet de oorzaak, en dat dit bij een dermatoloog hoort en niet bij een huidkliniek.";

export const PSORIASIS_WEL_NIET = {
  wel: [
    "Naar de huisarts bij scherp begrensde, schilferende plekken die niet weggaan. Er bestaat behandeling voor en die begint daar.",
    "Gewrichtsklachten meteen noemen, ook als je huid meevalt. Dit is het enige onderdeel waar wachten blijvende schade kan geven. [MEDISCHE-CHECK-ROJDA]",
    "Je nagels laten zien tijdens dat gesprek. Ze worden vaak vergeten en ze zeggen iets.",
    "Blijven insmeren op rustige dagen. Een soepele huid scheurt minder snel open, en beschadiging kan een nieuwe plek uitlokken. [MEDISCHE-CHECK-ROJDA]",
    "Weten dat het in periodes gaat. Dat maakt een rustige periode geen genezing en een opvlamming geen falen.",
  ],
  niet: [
    "Schilfers wegkrabben of schrobben. Beschadiging op een plek kan daar juist nieuwe psoriasis uitlokken.",
    "Nagelafwijkingen op eigen houtje als schimmel behandelen. Dat is de meest gemaakte fout en het duurt maanden voor je weet dat het niet werkt.",
    "Een cosmetische behandeling boeken op actieve plekken.",
    "Stoppen met voorgeschreven medicatie zodra het beter gaat, zonder overleg.",
    "Aannemen dat het besmettelijk is of dat het aan hygiëne ligt. Geen van beide klopt.",
  ],
} as const;

export const PSORIASIS_WIJ_DOEN_NIET = [
  {
    titel: "Wij behandelen geen psoriasis",
    tekst:
      "Dit is een aandoening van het afweersysteem. De behandeling daarvan hoort bij een dermatoloog, en die rol nemen wij niet over.",
  },
  {
    titel: "Geen laser of peeling op plekken",
    tekst:
      "Beschadiging van de huid kan op die plek juist een nieuwe plek uitlokken. Dat is een bekend patroon en het is voor ons een harde grens. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen uitspraken over jouw medicatie",
    tekst:
      "Wat je gebruikt is tussen jou en je arts. Wij zullen nooit adviseren ergens mee te stoppen of te minderen.",
  },
] as const;

export const PSORIASIS_FAQ = [
  {
    vraag: "Is psoriasis besmettelijk?",
    antwoord:
      "Nee. Het is een aandoening van je eigen afweersysteem en niet overdraagbaar, ook niet bij aanraking.",
  },
  {
    vraag: "Waarom hoort dit niet bij een huidkliniek?",
    antwoord:
      "Omdat de oorzaak niet in de huid zit. Wij kunnen een plek verzachten en niets aan de oorzaak doen, en dan verkoop je sessies aan iets dat blijft terugkomen.",
  },
  {
    vraag: "Ik heb alleen putjes in mijn nagels. Telt dat?",
    antwoord:
      "Dat is genoeg reden om het te laten bekijken. Nagelafwijkingen zijn vaak het eerste of enige teken en worden bijna altijd voor schimmel aangezien. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Mijn gewrichten zijn 's ochtends stijf. Hoort dat erbij?",
    antwoord:
      "Dat kan, en het is het onderdeel waarmee je niet moet wachten. Ochtendstijfheid die langer dan een halfuur duurt hoort besproken te worden, ook als je huidplekken klein zijn. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Kan ik bij jullie wel voor iets anders terecht?",
    antwoord:
      "Als je huid op dat moment rustig is en het gaat om een ander onderwerp, dan kijken we mee. We behandelen niet over plekken heen en we zeggen het als we het niet verstandig vinden.",
  },
] as const;
