/**
 * Inhoud van de pagina over cellulitis.
 *
 * De klinische waarheid die deze pagina eigen maakt: cellulitis is geen vet en geen
 * conditie, het is de manier waarop de bindweefselschotjes onder de huid lopen. Bij
 * vrouwen staan die overwegend rechtop, waardoor het vet ertussen naar boven bolt en de
 * schotjes de huid naar beneden trekken. Bij mannen lopen ze schuin en kruislings, en dan
 * ontstaat dat patroon veel minder. [MEDISCHE-CHECK-ROJDA]
 *
 * Dat ene feit verklaart alles wat mensen niet begrijpen: waarom slanke vrouwen het ook
 * hebben, waarom sporten het patroon niet weghaalt, en waarom mannen er nauwelijks mee
 * zitten. En het verklaart waarom geen enkele crème of apparaat het weghaalt.
 *
 * Wij behandelen dit niet. Deze pagina bestaat om te voorkomen dat iemand geld uitgeeft
 * aan een belofte die niemand kan waarmaken.
 *
 * COPY-STATUS: concept. Medische inhoud langs Rojda. Geen percentages, geen
 * voor-en-na-beloftes (§11).
 */

export type Bouw = {
  readonly id: "verticaal" | "kruislings";
  readonly naam: string;
  readonly onder: string;
  readonly watErGebeurt: string;
  readonly gevolg: string;
};

export const BOUW: Record<Bouw["id"], Bouw> = {
  verticaal: {
    id: "verticaal",
    naam: "Schotjes rechtop",
    onder: "Komt vooral voor bij vrouwen",
    watErGebeurt:
      "De bindweefselschotjes lopen loodrecht van de huid naar de spierlaag. Het vet daartussen kan alleen omhoog, en de schotjes houden de huid op hun aanhechting vast. [MEDISCHE-CHECK-ROJDA]",
    gevolg:
      "Zo ontstaat het patroon van bolletjes met kuiltjes ertussen. Het is een kwestie van hoe je in elkaar zit, niet van hoeveel vet er zit.",
  },
  kruislings: {
    id: "kruislings",
    naam: "Schotjes kruislings",
    onder: "Komt vooral voor bij mannen",
    watErGebeurt:
      "De schotjes lopen schuin en kruisen elkaar, waardoor het vet in kleinere kamers ligt en er geen enkel punt is dat de huid sterk naar beneden trekt. [MEDISCHE-CHECK-ROJDA]",
    gevolg:
      "Dezelfde hoeveelheid vet geeft dan nauwelijks reliëf. Daarom komt het bij mannen veel minder voor, en dat laat zien dat het niet om het vet gaat.",
  },
};

/** Wat er wél verandert als je afvalt, en wat niet. */
export const GEWICHT_TEKST = {
  kop: "En afvallen dan?",
  tekst:
    "Minder vet maakt de bolletjes kleiner, dus het reliëf wordt vlakker. Het patroon zelf blijft, want de schotjes lopen nog steeds waar ze liepen. Bij fors afvallen wordt het soms zelfs duidelijker zichtbaar doordat de huid losser komt te zitten. [MEDISCHE-CHECK-ROJDA]",
} as const;

export const CELLULITIS_MYTHES = [
  {
    mythe: "Het komt door afvalstoffen",
    waarheid:
      "Er is geen ophoping van gifstoffen bij betrokken. Dat verhaal wordt gebruikt om drainerende behandelingen en thee te verkopen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    mythe: "Het betekent dat je te weinig beweegt",
    waarheid:
      "Sporten verandert de spierlaag eronder en niet de richting van de schotjes. Topsporters hebben het ook.",
  },
  {
    mythe: "Met de juiste crème gaat het weg",
    waarheid:
      "Een crème komt niet bij de laag waar dit ontstaat. Wat je wel merkt is dat de huid gladder aanvoelt, en dat is iets anders dan minder kuiltjes.",
  },
  {
    mythe: "Het hoort bij overgewicht",
    waarheid:
      "Slanke vrouwen hebben het net zo goed. Dat is meteen het duidelijkste bewijs dat het niet om de hoeveelheid vet gaat.",
  },
] as const;

export const CELLULITIS_WEL_NIET = {
  wel: [
    "Weten dat dit anatomie is. Dat scheelt schuldgevoel en het scheelt geld aan behandelingen die het niet kunnen.",
    "Krachttraining doen als je wilt bewegen, om je eigen redenen. Het maakt je sterker en het verandert dit patroon niet.",
    "Je huid verzorgen omdat je dat prettig vindt, niet omdat het kuiltjes weghaalt.",
    "Vragen wat er precies verandert als iemand je een behandeling aanbiedt. Vraag naar de kuiltjes en niet naar de huid.",
    "Foto's onder hetzelfde licht vergelijken. Strijklicht maakt elk reliëf dieper.",
  ],
  niet: [
    "Geld uitgeven aan een belofte van gladde benen. Die kan niemand waarmaken en dat weet de verkoper.",
    "Drainerende kuren of thee kopen op het verhaal van afvalstoffen.",
    "Fors afvallen met dit als doel. Het reliëf wordt vlakker en het patroon blijft, en soms wordt het juist duidelijker.",
    "Jezelf vergelijken met foto's uit advertenties. Die zijn gemaakt met licht dat elk reliëf wegneemt.",
    "Denken dat het aan jou ligt. Cellulitis hangt samen met de bouw van je onderhuid en niet met je inzet.",
  ],
} as const;

export const CELLULITIS_WIJ_DOEN_NIET = [
  {
    titel: "Wij behandelen geen cellulitis",
    tekst:
      "We hebben er geen behandeling voor en we gaan er ook geen bedenken. Kom je ervoor langs, dan hoor je hetzelfde als wat hier staat.",
  },
  {
    titel: "Geen apparaat dat het wegneemt",
    tekst:
      "Er bestaan apparaten die tijdelijk zwelling verplaatsen en de huid strakker laten lijken. Dat werkt anders dan minder kuiltjes, en wij verkopen dat verschil niet weg.",
  },
  {
    titel: "Geen voor-en-na met ander licht",
    tekst:
      "Bij dit onderwerp is de belichting het hele resultaat. Wie een foto laat zien met vlak licht ernaast, laat je een lamp zien en geen behandeling.",
  },
] as const;

export const CELLULITIS_FAQ = [
  {
    vraag: "Waarom hebben mannen dit bijna niet?",
    antwoord:
      "Door de richting van de bindweefselschotjes. Bij mannen kruisen ze elkaar, bij vrouwen staan ze overwegend rechtop. Dezelfde hoeveelheid vet geeft dan een heel ander oppervlak. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Ik ben slank en heb het toch. Hoe kan dat?",
    antwoord:
      "Omdat het gaat over hoe het vet eronder is opgedeeld en niet over de hoeveelheid. Daarom betekent slank zijn geen bescherming biedt.",
  },
  {
    vraag: "Helpt drooggeborsteld of masseren?",
    antwoord:
      "Het maakt de huid tijdelijk roder en iets voller, waardoor kuiltjes even minder opvallen. Dat is een uur later weg en het is geen verandering. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Is het schadelijk?",
    antwoord:
      "Nee. Het is geen ziekte en er is medisch gezien niets aan de hand.",
  },
  {
    vraag: "Kan ik hiervoor bij jullie terecht?",
    antwoord:
      "Nee. Kom je voor iets anders en wil je hier iets over vragen, dan krijg je hetzelfde antwoord als hierboven.",
  },
] as const;

/**
 * Wat cellulitis werkelijk is, in vier feiten.
 *
 * Hier stond een dwarsdoorsnede: twee tekeningen met evenveel vet en een verschil in de
 * stand van de bindweefselschotjes. Yasin, 5 september: te zweverig. Hij heeft gelijk dat
 * het veel vraagt om een doorsnede te lezen voor een punt dat in een zin past.
 *
 * Dat punt blijft, want het is het interessantste van de pagina: het zit niet in het vet maar
 * in de richting van het bindweefsel eromheen.
 *
 * De vier mythes verderop gaan over afvalstoffen, bewegen, cremes en overgewicht. Die komen
 * hier dus niet terug.
 */
export const CELLULITIS_FEITEN: readonly {
  readonly kop: string;
  readonly zin: string;
}[] = [
  {
    kop: "Het zit in de verpakking",
    zin: "Onder je huid loopt bindweefsel dat het vet in vakjes houdt. Bij vrouwen staan die schotjes rechtop, dus duwt het vet ertussen omhoog en krijg je kuiltjes. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    kop: "Bij mannen kruislings",
    zin: "Daar lopen dezelfde schotjes schuin door elkaar, als een net. Vet kan er niet in kolommen doorheen, en daarom zie je het bij mannen zelden. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    kop: "Negen van de tien",
    zin: "Zoveel volwassen vrouwen hebben het in enige mate, ongeacht maat of leeftijd. Het is een bouwkenmerk en geen aandoening. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    kop: "Waar wel iets aan te doen is",
    zin: "De schotjes veranderen niet, de huid erboven wel. Steviger en beter doorbloede huid maakt het reliëf minder scherp, en dat is waar wij aan werken.",
  },
];
