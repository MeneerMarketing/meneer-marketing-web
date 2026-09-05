/**
 * Inhoud van de melasmapagina.
 *
 * De klinische waarheid die deze pagina eigen maakt: melasma is geen vlek maar een
 * aandoening met een aan- en uitknop die je niet zelf bedient. Hij komt terug. Wie je
 * hier verdwijning belooft, verkoopt je iets, en wie er agressief op laseert maakt het
 * vaak erger dan het was.
 *
 * De tweede waarheid is minder bekend en bepaalt alles: het gaat om de diepte. Pigment
 * dat hoog in de huid zit reageert; pigment dat dieper ligt vrijwel niet. In gewoon licht
 * zie je dat verschil niet, onder een woodlamp wel. Daarom is de lamp de interactie
 * geworden: je verplaatst hem zelf over de vlek en ziet dat wat de uitkomst bepaalt
 * onzichtbaar is zolang je er met het blote oog naar kijkt.
 *
 * COPY-STATUS: concept in de Diba-stem. Elk medisch punt langs Rojda. Geen percentages,
 * geen uitspraken over hoe vaak melasma terugkomt: dat weten we niet in cijfers (A7).
 */

/* ── Melasma of een zonvlek ────────────────────────────────────────────── */

/**
 * De vraag die iemand met een vlek in de spiegel echt heeft.
 *
 * Hier stond een woodlamp-tool waarin je zelf drie dieptes kon aanklikken. Dat is werk voor
 * de behandelaar en niet voor de bezoeker, hetzelfde bezwaar als bij de zelftests die van
 * de andere huidprobleempagina's af gingen.
 *
 * Vier kenmerken, twee kolommen, in tien seconden te scannen.
 *
 * [MEDISCHE-CHECK-ROJDA] het onderscheid zelf en de vier kenmerken.
 */
export const VERSCHIL: readonly {
  readonly kenmerk: string;
  readonly melasma: string;
  readonly zonvlek: string;
}[] = [
  {
    kenmerk: "Het patroon",
    melasma: "Vlakken met vage randen, links en rechts meestal even veel.",
    zonvlek: "Losse vlekjes met een scherpe rand, willekeurig verdeeld.",
  },
  {
    kenmerk: "De plek",
    melasma: "Wangen, voorhoofd, boven de lip en langs de kaaklijn.",
    zonvlek: "Waar de zon jarenlang op stond: gezicht, handen, decollete.",
  },
  {
    kenmerk: "Het verloop",
    melasma: "Wordt donkerder in de zomer en lichter in de winter.",
    zonvlek: "Blijft zoals hij is, en er komen er langzaam bij.",
  },
  {
    kenmerk: "De aanjager",
    melasma:
      "Hormonen, zon en warmte samen. Vaak begonnen tijdens een zwangerschap.",
    zonvlek: "Opgetelde zonuren over de jaren, zonder hormonale kant.",
  },
];

/**
 * Drie dingen die de meeste mensen met melasma nog niet weten.
 *
 * De diepte staat in het derde, want dat is bij melasma waar het op aankomt en het was het
 * enige uit de oude tool dat de bezoeker echt aanging.
 *
 * [MEDISCHE-CHECK-ROJDA] alle drie.
 */
export const WETENSWAARD: readonly {
  readonly kop: string;
  readonly zin: string;
}[] = [
  {
    kop: "Ook achter glas",
    zin: "UVA komt door een autoruit en door je raam heen. Ook binnen en op een grijze dag loopt pigment gewoon door.",
  },
  {
    kop: "Warmte telt ook mee",
    zin: "Het gaat niet alleen om UV. Een hete keuken, een sauna of een fohn dicht op je gezicht wakkert melasma net zo goed aan.",
  },
  {
    kop: "De diepte bepaalt het tempo",
    zin: "Pigment hoog in de huid wordt sneller lichter. Zit het dieper, dan vraagt het meer sessies en meer geduld.",
  },
];

/* ── De drie kranen ────────────────────────────────────────────────────── */

export const AANJAGERS = [
  {
    id: "zon",
    naam: "Zon",
    tekst:
      "De sterkste van de drie, en de enige die je volledig zelf in de hand hebt. Ook winterlicht en licht door een autoruit telt mee. [MEDISCHE-CHECK-ROJDA]",
    knop: "Volledig",
  },
  {
    id: "hormonen",
    naam: "Hormonen",
    tekst:
      "Zwangerschap, de pil en hormoonspiralen spelen mee. Dit is de reden dat melasma vaker bij vrouwen voorkomt en soms vanzelf wegtrekt na een bevalling. [MEDISCHE-CHECK-ROJDA]",
    knop: "Nauwelijks",
  },
  {
    id: "warmte",
    naam: "Warmte",
    tekst:
      "Sauna, hete douches, een warme keuken, en ook de warmte van een behandeling zelf. Dit is de aanjager die het vaakst over het hoofd wordt gezien. [MEDISCHE-CHECK-ROJDA]",
    knop: "Deels",
  },
] as const;

/* ── De rest van de pagina ─────────────────────────────────────────────── */

export const MELASMA_WEL_NIET = {
  wel: [
    "Elke dag beschermen, het hele jaar door. Dit is bij melasma geen advies maar de behandeling zelf; zonder dit werkt de rest niet.",
    "Rustig behandelen en langzaam opbouwen. Melasma is de enige aandoening op deze site waarbij harder werken je verder van huis brengt.",
    "Eerst kijken hoe diep het zit. Dat bepaalt of behandelen zin heeft, en het kost één afspraak.",
    "Warmte vermijden rond een behandeling, ook sauna en hete douches.",
    "Accepteren dat dit beheerd wordt en niet genezen. Wie dat vooraf weet, is achteraf niet teleurgesteld.",
  ],
  niet: [
    "Een agressieve laser of stevige peeling. Bij melasma is dat de bekendste manier om het erger te maken dan het was.",
    "In de zomer beginnen. Dan werk je tegen de aanjager in die je net probeert uit te zetten.",
    "Stoppen met beschermen zodra het lichter wordt. Dan is het binnen een seizoen terug en heb je voor niets betaald.",
    "Melasma behandelen alsof het gewone pigmentvlekken zijn. Dezelfde aanpak geeft hier een ander en slechter resultaat.",
    "Zelf bleekmiddelen bestellen die je hier niet zonder recept krijgt. Die zijn er niet voor niets aan banden gelegd. [MEDISCHE-CHECK-ROJDA]",
  ],
} as const;

export const MELASMA_WIJ_DOEN_NIET = [
  {
    titel: "Geen belofte van weg",
    tekst:
      "Melasma verdwijnt niet, het wordt beheerd. Wij zeggen lichter en rustiger, en we zeggen erbij dat het terugkomt zodra de aanjagers weer aanstaan.",
  },
  {
    titel: "Geen behandeling in de zomer",
    tekst:
      "We beginnen liever in het najaar. Dat kost je een paar maanden wachten en het scheelt een behandeling die tegen de zon in werkt.",
  },
  {
    titel: "Geen zware laser op melasma",
    tekst:
      "Hoe verleidelijk ook, agressief werken geeft hier vaak meer pigment in plaats van minder. Dat is bij melasma een bekend en pijnlijk patroon. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen behandeling bij diep pigment",
    tekst:
      "Zit het onder de laag die zich vernieuwt, dan raden we het af. Je betaalt dan voor sessies waarvan we vooraf weten dat ze weinig gaan doen.",
  },
] as const;

export const MELASMA_FAQ = [
  {
    vraag: "Gaat melasma ooit helemaal weg?",
    antwoord:
      "Meestal niet uit zichzelf, en behandelen maakt het lichter zonder het weg te nemen. Na een zwangerschap trekt het soms grotendeels weg; dat is dan het hormonale deel dat wegvalt en niet iets wat een behandeling deed. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Waarom is dit anders dan gewone pigmentvlekken?",
    antwoord:
      "Een zonvlek zit er en blijft er. Melasma heeft een kraan die open- en dichtgaat, en die kraan staat deels buiten je macht. Dezelfde behandeling geeft daarom een ander resultaat.",
  },
  {
    vraag: "Ik ben zwanger. Kan ik nu iets doen?",
    antwoord:
      "Beschermen wel, behandelen niet. We wachten tot na de zwangerschap en de borstvoeding, ook omdat een deel dan vanzelf terugloopt. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Ik heb een donkere huid. Verandert dat iets?",
    antwoord:
      "Ja, in twee richtingen. Melasma komt vaker voor, en de kans dat een te stevige behandeling juist meer pigment achterlaat is groter. Rustiger werken is dan geen voorzichtigheid maar noodzaak. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Hoe lang duurt het voor ik iets zie?",
    antwoord:
      "De eerste verandering zie je meestal na twee tot drie maanden. Reken dus op maanden en niet op weken, en op onderhoud daarna. Dat laatste is geen bijzaak maar het grootste deel van het werk. [GEGEVEN-NODIG]",
  },
  {
    vraag: "Wat kost dit?",
    antwoord:
      "De meting kost vijftig euro; de trajecten daarna staan met hun tarief op de tarievenpagina. Blijkt uit de meting dat het pigment diep zit, dan raden we behandelen af en houdt het daar op. [PRIJS-NODIG]",
  },
] as const;
