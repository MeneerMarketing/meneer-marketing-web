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

export type Laag = {
  readonly id: "epidermaal" | "gemengd" | "dermaal";
  readonly naam: string;
  readonly vakterm: string;
  /** Wat de lamp laat zien als je erboven staat. */
  readonly onderDeLamp: string;
  readonly watHetBetekent: string;
  readonly watMogelijkIs: string;
  /** Stuurt de toon van het antwoord en de knop. */
  readonly vooruitzicht: "goed" | "matig" | "beperkt";
};

export const LAGEN: readonly Laag[] = [
  {
    id: "epidermaal",
    naam: "Hoog in de huid",
    vakterm: "epidermaal melasma",
    onderDeLamp:
      "De rand wordt scherper en de vlek lijkt donkerder dan in gewoon licht. Je ziet waar hij ophoudt.",
    watHetBetekent:
      "Het pigment zit in de bovenste laag. Dat is de laag die zichzelf vernieuwt, dus daar is iets aan te doen. [MEDISCHE-CHECK-ROJDA]",
    watMogelijkIs:
      "Dit is het gunstigste beeld. Verwacht duidelijk lichter worden, en verwacht dat het terugkomt zodra de bescherming wegvalt.",
    vooruitzicht: "goed",
  },
  {
    id: "gemengd",
    naam: "Deels diep",
    vakterm: "gemengd melasma",
    onderDeLamp:
      "Een deel van de vlek springt eruit, een ander deel blijft juist vaag. Dat verschil zie je alleen onder de lamp.",
    watHetBetekent:
      "Er zit pigment in twee lagen tegelijk. Het bovenste deel reageert, het diepere deel blijft grotendeels staan. [MEDISCHE-CHECK-ROJDA]",
    watMogelijkIs:
      "Reken op verbetering die je ziet en op een rest die blijft. Wie je hier een schone huid belooft, kijkt niet naar de diepte.",
    vooruitzicht: "matig",
  },
  {
    id: "dermaal",
    naam: "Diep in de huid",
    vakterm: "dermaal melasma",
    onderDeLamp:
      "De vlek wordt onder de lamp niet duidelijker. De rand blijft vaag en het contrast neemt niet toe.",
    watHetBetekent:
      "Het pigment ligt onder de laag die zich vernieuwt. Daar kom je met een oppervlakkige behandeling niet bij, en dieper gaan maakt de kans op méér pigment groter. [MEDISCHE-CHECK-ROJDA]",
    watMogelijkIs:
      "Hier zeggen we meestal nee tegen behandelen. Het levert te weinig op en het risico weegt niet op tegen de winst. Dat is een vervelend antwoord en het is wel het eerlijke.",
    vooruitzicht: "beperkt",
  },
] as const;

export const LAMP_UITLEG =
  "Een woodlamp is een lamp met bijna alleen ultraviolet licht. Pigment dat hoog in de huid zit kaatst dat anders terug dan pigment dat dieper ligt, waardoor het contrast toeneemt of juist niet. Het is geen apparaat dat iets behandelt: het laat alleen zien waar je naar kijkt.";

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
      "De meting kost vijftig euro; de trajecten daarna staan met hun tarief op de prijzenpagina. Blijkt uit de meting dat het pigment diep zit, dan raden we behandelen af en houdt het daar op. [PRIJS-NODIG]",
  },
] as const;
