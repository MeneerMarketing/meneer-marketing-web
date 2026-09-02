/**
 * PCOS en de huid.
 *
 * DE ENIGE HOUDING DIE HIER KLOPT.
 *
 * PCOS is een hormonale aandoening. Een huidkliniek stelt die diagnose niet, behandelt die
 * niet en neemt de oorzaak niet weg. Wat een huidkliniek wel kan is de zichtbare gevolgen
 * op de huid aanpakken, en dat is iets heel anders. Wie dat verschil niet maakt, verkoopt
 * een traject onder valse voorwendselen.
 *
 * Dus is deze pagina een taakverdeling en geen behandelaanbod: per huidklacht staat wat wij
 * kunnen doen, wat we niet kunnen doen, en wanneer je eerst ergens anders moet zijn.
 *
 * WAT DIT NIET IS.
 *
 * Geen diagnose en geen checklist waarmee je jezelf PCOS aanmeet. Herkenning is geen
 * vaststelling; de huisarts of gynaecoloog gaat daarover. Dat staat ook op de pagina zelf
 * en niet in kleine letters onderaan.
 *
 * WAT WE WEL EERLIJK ZEGGEN.
 *
 * Dat de klachten terugkomen zolang de hormonale oorzaak er is. Bij ontharing betekent dat
 * onderhoud in plaats van een eindpunt, en bij acne dat de huid meebeweegt met wat er
 * onderliggend gebeurt. Dat is geen mooie boodschap en het is wel de juiste, want mensen
 * met PCOS hebben vaak al genoeg beloftes gehoord.
 *
 * [MEDISCHE-CHECK-ROJDA] elke regel van dit bestand. Dit is de meest medische pagina van de
 * site en de enige waar een verkeerde zin iemand van een arts weg kan houden.
 */

export type PcosKlacht = {
  readonly id: string;
  readonly kop: string;
  /** Wat mensen daadwerkelijk merken, in gewone taal. */
  readonly wat: string;
  /** Wat wij eraan kunnen doen. Concreet, met de behandeling erbij. */
  readonly wij: string;
  /** Wat wij er niet aan kunnen doen. Even nadrukkelijk. */
  readonly nietWij: string;
  /** Of dit een reden is om eerst naar een arts te gaan. */
  readonly arts: string | null;
  /** Waar op deze site meer staat. */
  readonly href?: string;
  readonly link?: string;
};

export const PCOS_KLACHTEN: readonly PcosKlacht[] = [
  {
    id: "haargroei",
    kop: "Ongewenste haargroei in een mannelijk patroon",
    wat: "Grover en donkerder haar op plekken waar je het niet gewend bent: kin, kaaklijn, hals, borst of buik. Vaak het gevolg waar mensen zich het meest voor terugtrekken.",
    wij: "Laserontharing werkt hier, en meestal goed. Het haar is grof en donker en dat is precies waar de laser op aangrijpt.",
    nietWij:
      "Wij nemen de prikkel niet weg die dat haar laat groeien. Er zullen nieuwe haren blijven komen, dus dit wordt onderhoud en geen eindpunt. Reken op meer sessies dan het standaardtraject en op periodiek terugkomen daarna.",
    arts: null,
    href: "/laserontharing",
    link: "Zo werkt laserontharing",
  },
  {
    id: "acne",
    kop: "Acne langs de kaaklijn en in de hals",
    wat: "Diepere, gevoelige puistjes die langer blijven zitten dan gewone acne, vaak laag in het gezicht en op de hals. Ze komen en gaan met periodes.",
    wij: "De huid rustiger krijgen, ontstoken plekken aanpakken en littekenvorming beperken. Dat is echt werk en het scheelt merkbaar.",
    nietWij:
      "De oorzaak wegnemen. Zolang die er is, beweegt je huid mee. Een traject dat in maart aanslaat kan in september weer opspelen, en dat is geen mislukt traject maar een aandoening die er nog is.",
    arts: "Bij pijnlijke knobbels onder de huid of littekens die blijven, hoort een arts mee te kijken. Daar bestaat medicatie voor en die kunnen wij niet geven.",
    href: "/huidproblemen/acne",
    link: "Meer over acne",
  },
  {
    id: "hoofdhaar",
    kop: "Dunner wordend hoofdhaar",
    wat: "Minder volume, een breder wordende scheiding, meer haar in de borstel. Anders dan de haargroei elders is dit een verlies en geen overschot.",
    wij: "Meekijken en vastleggen wat we zien, zodat er over maanden iets te vergelijken valt.",
    nietWij:
      "Behandelen. Haarverlies bij PCOS is een hormonale kwestie en daar is bij ons geen behandeling voor. Wie je iets anders vertelt, verkoopt je iets.",
    arts: "Ja. Dit hoort bij de huisarts en zo nodig bij een dermatoloog, en niet bij een huidkliniek.",
  },
  {
    id: "verkleuring",
    kop: "Donkere, fluweelachtige plekken in huidplooien",
    wat: "In de hals, oksels of liezen: een donkerdere verkleuring die zacht aanvoelt en niet weggaat met wassen. Het is geen vuil en geen pigmentvlek.",
    wij: "Hier doen we niets aan, en dat is met opzet.",
    nietWij:
      "Wegwerken. Deze verkleuring is een signaal en geen cosmetisch probleem, en er overheen behandelen maakt het signaal alleen onzichtbaar.",
    arts: "Ja, en dit is de belangrijkste van de vier. Deze verkleuring hangt samen met hoe je lichaam met insuline omgaat. Laat het bij je huisarts nakijken, ook als je er verder geen last van hebt.",
  },
];

/**
 * De taakverdeling in het kort.
 *
 * Drie kolommen, en de middelste is degene die er het vaakst tussenuit valt: wat wij niet
 * kunnen. Juist die bepaalt of iemand met de goede verwachting binnenkomt.
 */
export const PCOS_VERDELING = [
  {
    wie: "De huisarts of gynaecoloog",
    wat: "Vaststellen of er sprake is van PCOS, onderzoek doen, en behandelen wat er onderliggend speelt. Alles wat met hormonen, medicatie en bloedwaardes te maken heeft.",
    hier: false,
  },
  {
    wie: "Wij",
    wat: "De zichtbare gevolgen op je huid: haargroei, acne, littekenvorming. Wat je in de spiegel ziet, niet wat eronder ligt.",
    hier: true,
  },
  {
    wie: "Niemand, voorlopig",
    wat: "Het zichtbare weghalen én weghouden zonder dat de oorzaak verandert. Dat kan geen enkele kliniek, hoe de folder ook geschreven is.",
    hier: false,
  },
] as const;
