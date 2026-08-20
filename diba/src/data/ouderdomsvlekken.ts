/**
 * Inhoud van de pagina over ouderdomsvlekken en zonnevlekken.
 *
 * WAAROM NAAST /huidproblemen/pigmentvlekken EN /huidproblemen/melasma.
 *
 * Pigmentvlekken is de overkoepelende pagina en melasma is een eigen aandoening met een
 * hormonale kant. Wat daartussen viel is de vlek die er door de jaren heen bij is gekomen:
 * plat, bruin, op handen, decolleté en slapen, en bij vrijwel iedereen boven de vijftig.
 * Mensen noemen die ouderdomsvlek of zonnevlek en zoeken daar ook op.
 *
 * WAAROM DEZE PAGINA EEN VEILIGHEIDSPAGINA IS.
 *
 * Van de vier beelden hieronder horen er twee bij de huisarts, en een daarvan is de reden
 * dat deze pagina bestaat: een plek die verandert, van vorm of kleur, is geen kwestie van
 * laseren maar van laten kijken. Een kliniek die alles wat bruin is wegbrandt, brandt op
 * een dag iets weg dat beoordeeld had moeten worden.
 *
 * Vandaar dat de eerste vraag niet "hoe lelijk is het" is maar "verandert het".
 *
 * MEDISCH.
 *
 * Alles wat een bewering doet is gemarkeerd voor Rojda. De ABCDE-check staat al op
 * /huidproblemen/huidkanker-naevi; deze pagina verwijst daarheen in plaats van hem over te
 * schrijven, want twee versies van een veiligheidsregel lopen uit elkaar.
 */

export type PigmentBeeld = {
  readonly id: string;
  readonly naam: string;
  readonly klanttaal: string;
  readonly vakterm: string;
  readonly zelfcheck: string;
  readonly watHetIs: string;
  readonly watWijDoen: string;
  /** Of dit bij ons hoort of bij een arts. Stuurt de toon van de kaart. */
  readonly binnenBereik: boolean;
};

export const PIGMENT_BEELDEN: readonly PigmentBeeld[] = [
  {
    id: "lentigo",
    naam: "Platte bruine vlek",
    klanttaal: "Een egale bruine plek op je hand, slaap of decolleté",
    vakterm: "lentigo solaris, zonnevlek of ouderdomsvlek",
    zelfcheck:
      "Voelt hij helemaal glad, is hij egaal van kleur met een scherpe rand, en zit hij op een plek die veel zon heeft gehad?",
    watHetIs:
      "Pigment dat zich na jaren zonblootstelling op een plek heeft opgehoopt. Onschuldig, en het meest voorkomende beeld op deze pagina. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Dit reageert goed op licht. We meten eerst hoeveel er zit, ook wat je zelf nog niet ziet, en behandelen daarna in een reeks.",
    binnenBereik: true,
  },
  {
    id: "keratose",
    naam: "Ruwe bruine bult",
    klanttaal:
      "Een bruin plekje dat verheven aanvoelt, alsof het erop geplakt zit",
    vakterm: "seborroïsche keratose",
    zelfcheck:
      "Voel je met je vingertop dat het boven de huid uitkomt, en is het oppervlak korrelig of wasachtig in plaats van glad?",
    watHetIs:
      "Een goedaardige woekering van huidcellen. Ondanks het uiterlijk heeft dit niets met zonschade te maken en het is ook geen moedervlek. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Hier doet licht niets: het pigment zit in weefsel dat boven de huid uitsteekt. Verwijderen kan wel, maar dat gebeurt eerst na beoordeling. [MEDISCHE-CHECK-ROJDA]",
    binnenBereik: false,
  },
  {
    id: "melasma",
    naam: "Grote vlakken op je wangen",
    klanttaal:
      "Symmetrische bruine vlakken, vaak na een zwangerschap of de pil",
    vakterm: "melasma",
    zelfcheck:
      "Zit het aan beide kanten ongeveer gelijk, met vage randen in plaats van scherpe? En kwam het in een periode van hormonale verandering?",
    watHetIs:
      "Een ander mechanisme dan een zonnevlek: hormonaal aangestuurd en veel gevoeliger voor licht en warmte. Verkeerd behandelen maakt het aantoonbaar erger. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Hier gaat een eigen traject over, met andere regels en een ander tempo. De melasmapagina legt dat uit.",
    binnenBereik: false,
  },
  {
    id: "verandert",
    naam: "Een plek die verandert",
    klanttaal: "Iets dat groeit, van kleur verschiet, jeukt of bloedt",
    vakterm: "verdachte laesie",
    zelfcheck:
      "Is de plek de afgelopen maanden anders geworden: groter, donkerder, ongelijk van kleur, of met een rafelige rand?",
    watHetIs:
      "Dat weten wij niet, en dat is precies het punt. Alles wat verandert hoort beoordeeld te worden voordat er iets mee gebeurt. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Wij behandelen dit niet en we laseren het zeker niet weg. Je gaat eerst naar de huisarts, ook als het waarschijnlijk niets is.",
    binnenBereik: false,
  },
];

export const OUDERDOMSVLEKKEN_WEL_NIET = {
  wel: [
    "Eerst beoordelen of een plek onschuldig is, en bij twijfel doorsturen in plaats van behandelen",
    "Een nulmeting onder UV-licht, want daar zie je pigment dat er al zit en nog niet zichtbaar is",
    "Zonbescherming, elke dag en het hele jaar. Zonder dat komen de vlekken terug en werkt de rest niet [MEDISCHE-CHECK-ROJDA]",
    "Licht op platte, egale vlekken, in een reeks met tijd ertussen",
    "Eerlijk zeggen dat er nieuwe bij kunnen komen zolang je in de zon komt",
  ],
  niet: [
    "Alles wat bruin is wegbranden. Een plek die verandert hoort eerst beoordeeld te worden [MEDISCHE-CHECK-ROJDA]",
    "Melasma behandelen alsof het een zonnevlek is. Dat maakt het erger en niet beter [MEDISCHE-CHECK-ROJDA]",
    "Bleekcrèmes met hydrochinon op eigen houtje. Dat hoort onder begeleiding [MEDISCHE-CHECK-ROJDA]",
    "Behandelen in de zomer zonder afspraken over zon. Dan is het weggegooid geld",
    "Beginnen op een gebruinde huid [MEDISCHE-CHECK-ROJDA]",
  ],
} as const;

export const OUDERDOMSVLEKKEN_WIJ_DOEN_NIET = [
  {
    titel: "Geen laser op een plek die verandert",
    tekst:
      "Groeit iets, verschiet het van kleur, of heeft het een rafelige rand? Dan gaat het eerst naar de huisarts. Wegbranden maakt niet alleen de plek weg maar ook de mogelijkheid om hem te beoordelen, en dat is een fout die niet te herstellen is. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen pigmentbehandeling zonder afspraken over zon",
    tekst:
      "Ga je binnen een paar weken naar de zon of op wintersport, dan starten we niet. Dat is geen formaliteit: pigment komt na blootstelling terug en dan heb je voor niets betaald. [MEDISCHE-CHECK-ROJDA]",
  },
];

export const OUDERDOMSVLEKKEN_FAQ = [
  {
    vraag: "Zijn ouderdomsvlekken gevaarlijk?",
    antwoord:
      "Een gewone zonnevlek is onschuldig. Het probleem is dat andere dingen er in het begin op lijken, en die zijn dat niet altijd. Daarom is de eerste vraag hier niet hoe je ervan afkomt maar of het is wat je denkt. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Komen ze terug na de behandeling?",
    antwoord:
      "De behandelde vlek komt niet terug, maar er kunnen nieuwe bij komen zolang je huid zon blijft vangen. Dat is de reden dat zonbescherming hier geen advies achteraf is maar onderdeel van de behandeling. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Waarom zie ik na de meting meer vlekken dan in de spiegel?",
    antwoord:
      "Omdat pigment dieper in de huid begint dan waar je het ziet. De meting maakt zichtbaar wat er al ligt, en dat is soms confronterend. Het is ook nuttig: het verklaart waarom er zonder bescherming steeds nieuwe bij lijken te komen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Kan dit ook op mijn handen?",
    antwoord:
      "Ja, en dat is vaak de plek waar mensen het het eerst storend vinden. De huid daar is dunner en herstelt langzamer, dus we gaan er voorzichtiger te werk dan in het gezicht. [MEDISCHE-CHECK-ROJDA]",
  },
];

/**
 * De verandercheck.
 *
 * Niet om vast te stellen wát iets is, want dat kan niemand vanaf een foto. Wel om vast te
 * stellen óf er iets verandert, en dat is het enige dat bepaalt of je eerst naar de
 * huisarts moet. Een foto met datum is daarvoor betrouwbaarder dan je geheugen, en dat is
 * geen belediging: een plek die in acht maanden twee millimeter groeit ziet er elke ochtend
 * hetzelfde uit.
 */
export const VERANDERCHECK_STAPPEN: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "Maak een foto met iets ernaast",
    tekst:
      "Leg een muntje of je vingertop naast de plek en fotografeer recht van boven, bij daglicht. Zonder maatstaf is elke vergelijking later giswerk.",
  },
  {
    kop: "Zet er een datum bij",
    tekst:
      "In je fotomap of in een notitie. Dit is de stap die mensen overslaan, en precies de stap waardoor de vergelijking later iets waard is.",
  },
  {
    kop: "Kijk over drie maanden opnieuw",
    tekst:
      "Zelfde licht, zelfde hoek, zelfde maatstaf. Is er niets veranderd, dan weet je dat. Is er wel iets veranderd, dan ga je naar de huisarts en niet naar ons.",
  },
];
