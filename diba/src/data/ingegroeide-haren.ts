/**
 * Inhoud van de pagina over ingegroeide haren en scheerbultjes.
 *
 * WAAROM DEZE PAGINA ER MOET ZIJN.
 *
 * Omdat het de kortste weg is van een klacht naar een behandeling die Diba al aanbiedt, en
 * omdat die weg nu ontbreekt. Iemand met bultjes in zijn nek, bikinilijn of benen zoekt op
 * "scheerbultjes" of "ingegroeide haren", niet op "laserontharing". Op de site stond wel
 * de behandeling en niet de klacht.
 *
 * WAT DEZE PAGINA EERLIJK MAAKT.
 *
 * De verleiding is om alles wat op een ingegroeid haar lijkt naar de laser te sturen. Dat
 * klopt in veel gevallen, maar niet in alle: er zijn bultjes op precies dezelfde plekken
 * die geen haar bevatten en die van laser niet minder worden. Vandaar dat de eerste vraag
 * hier is of er een haar in zit, en niet hoe erg het is.
 *
 * En er is een tweede eerlijkheid: bij een ingegroeid haar is de oorzaak vaak de manier
 * van ontharen zelf. Soms is het antwoord dus niet een behandeling maar anders scheren, en
 * dat kost ons een klant.
 *
 * MEDISCH.
 *
 * Alles wat een bewering doet is gemarkeerd voor Rojda. Pseudofolliculitis komt vaker en
 * heftiger voor bij krullend haar en bij een donkerder huidtype, en dat is een gegeven waar
 * de instellingen van het apparaat rekening mee moeten houden.
 */

export type BultBeeld = {
  readonly id: string;
  readonly naam: string;
  readonly klanttaal: string;
  readonly vakterm: string;
  readonly zelfcheck: string;
  readonly watHetIs: string;
  readonly watWijDoen: string;
  readonly binnenBereik: boolean;
};

export const BULT_BEELDEN: readonly BultBeeld[] = [
  {
    id: "ingegroeid",
    naam: "Een haar die niet naar buiten komt",
    klanttaal: "Een bultje met een donkere krul erin die je er niet uit krijgt",
    vakterm: "pseudofolliculitis barbae, ingegroeid haar",
    zelfcheck:
      "Zie je bij goed licht een donkere lus of punt onder het velletje zitten, en zit het bultje op een plek die je scheert of epileert?",
    watHetIs:
      "Het haar krult terug de huid in in plaats van eruit, en je afweer reageert op iets dat er hoort te zijn. Komt vaker en heftiger voor bij krullend haar. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Dit is het beeld waarbij ontharen met licht het meeste oplevert: geen haar, geen ingroei. Eerst kijken of je huidtype en haarkleur daarvoor geschikt zijn.",
    binnenBereik: true,
  },
  {
    id: "ontsteking",
    naam: "Rood, warm en met een puskopje",
    klanttaal: "Pijnlijke rode bultjes met een geel kopje, kort na het scheren",
    vakterm: "folliculitis",
    zelfcheck:
      "Doet het zeer, voelt het warm aan, en is het in dagen ontstaan in plaats van geleidelijk?",
    watHetIs:
      "Een ontstoken haarzakje, meestal door bacteriën. Anders dan een ingegroeid haar gaat dit vaak vanzelf over, maar het kan ook hardnekkig worden. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Niet laseren zolang het actief is. Zit het er al weken of komt het steeds terug, dan hoort er eerst een huisarts naar te kijken. [MEDISCHE-CHECK-ROJDA]",
    binnenBereik: false,
  },
  {
    id: "keratose",
    naam: "Ruwe bultjes zonder haar",
    klanttaal: "Kippenvel dat niet weggaat, op je bovenarmen of dijen",
    vakterm: "keratosis pilaris",
    zelfcheck:
      "Voelt het als schuurpapier over een groter vlak, zonder dat er in de bultjes een haar of pus zit? En zit het vooral op je bovenarmen?",
    watHetIs:
      "Verhoorning rond de haarzakjes, en geen ingegroeid haar. Onschuldig, vaak erfelijk, en het wordt van ontharen niet minder. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Hier helpt laserontharing niet. Wat wel iets doet is de bovenlaag geleidelijk soepeler maken, en de verwachting daarbij eerlijk houden.",
    binnenBereik: false,
  },
  {
    id: "donkere-vlekjes",
    naam: "Donkere vlekjes zonder bultje",
    klanttaal: "Bruine puntjes op de plek waar de bultjes zaten",
    vakterm: "post-inflammatoire hyperpigmentatie",
    zelfcheck:
      "Is de huid glad geworden maar zit de kleur er nog, en wordt het donkerder na de zon?",
    watHetIs:
      "Pigment dat na de ontsteking is achtergebleven. Dit is wat er van jarenlang scheren vaak overblijft, en het is geen litteken. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Eerst de oorzaak wegnemen, anders komen er steeds nieuwe bij. Daarna pas naar de kleur kijken.",
    binnenBereik: true,
  },
];

/**
 * De haarcheck.
 *
 * Één vraag met licht en een spiegel, en het antwoord bepaalt of ontharen bij jou zin
 * heeft. Bewust geen instructie om te gaan pulken: dat is precies hoe een ingegroeid haar
 * een litteken wordt.
 */
export const HAARCHECK_STAPPEN: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "Onder vergroting",
    tekst:
      "De huidtherapeut kijkt met vergroting of er een haar in het bultje zit. Dat onderscheid bepaalt of ontharen zin heeft of dat het om iets anders gaat.",
  },
  {
    kop: "De lus of de punt",
    tekst:
      "Zit er onder het velletje een donkere lus of punt, dan gaat het om ingroei. Is daar niets van te zien, dan kijken we verder naar wat het wel is.",
  },
  {
    kop: "Over een groter vlak",
    tekst:
      "Daarna beoordelen we de hele zone. Zit het op een plek of over een groter gebied, want dat bepaalt of je een zone laat behandelen of een enkel plekje.",
  },
];

export const INGEGROEID_WEL_NIET = {
  wel: [
    "Eerst kijken of er werkelijk een haar in zit, want zonder haar doet ontharen niets",
    "De haarwortel uitschakelen, want een haar dat er niet is kan ook niet ingroeien",
    "Kijken naar hoe je nu onthaart. Soms is anders scheren de hele oplossing, en dan zeggen we dat",
    "Instellingen aanpassen op je huidtype, want juist bij een donkerder huid moet dat nauwkeuriger [MEDISCHE-CHECK-ROJDA]",
    "Zonbescherming op de behandelde zone, anders blijven de donkere vlekjes staan [MEDISCHE-CHECK-ROJDA]",
  ],
  niet: [
    "Laseren op een zone die op dit moment ontstoken is [MEDISCHE-CHECK-ROJDA]",
    "Zelf uitpeuteren met een pincet of een naald. Dat is de snelste route naar een donkere vlek of een kuiltje",
    "Scrubben tegen ingegroeide haren. Op een geïrriteerde zone maakt het de ontsteking erger",
    "Behandelen op een gebruinde huid [MEDISCHE-CHECK-ROJDA]",
    "Beloven dat elk haartje weggaat. Lichte en grijze haren reageren nauwelijks op licht [MEDISCHE-CHECK-ROJDA]",
  ],
} as const;

export const INGEGROEID_WIJ_DOEN_NIET = [
  {
    titel: "Geen laser op wat nu ontstoken is",
    tekst:
      "Rode, warme bultjes met een puskopje laten we eerst tot rust komen. Licht op een ontstoken haarzakje verergert de ontsteking en vergroot de kans op een blijvende vlek. Komt het steeds terug, dan kijkt er eerst een huisarts naar. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen traject als je haar er niet geschikt voor is",
    tekst:
      "Licht mikt op het pigment in de haarwortel. Blond, rood of grijs haar bevat daar te weinig van, en dan werkt het niet, hoeveel sessies je ook neemt. Dat stellen we vast voordat je iets afspreekt en niet erna. [MEDISCHE-CHECK-ROJDA]",
  },
];

export const INGEGROEID_FAQ = [
  {
    vraag: "Gaan ingegroeide haren weg van laserontharing?",
    antwoord:
      "Bij het merendeel wel, en om een logische reden: waar geen haar groeit kan ook niets ingroeien. Het gaat geleidelijk, over een reeks sessies, en het werkt alleen als het haar donker genoeg is om licht op te vangen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Waarom krijg ik ze vooral in mijn nek en bikinilijn?",
    antwoord:
      "Daar groeit het haar vaker krullend en ligt de haarzak schuiner, waardoor een teruggroeiend haar sneller de huid weer in gaat. Kleding die wrijft en strak scheren maken het erger. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Mag ik blijven scheren tijdens het traject?",
    antwoord:
      "Scheren mag en moet zelfs: de zone hoort kort te zijn op de dag van de behandeling. Wat niet mag is epileren, harsen of een epilator, want dan trek je precies de wortel weg waar het licht op mikt. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "En die donkere vlekjes die overblijven?",
    antwoord:
      "Dat is pigment en geen litteken. Zolang er nieuwe bultjes bij komen heeft behandelen weinig zin, want dan komen er ook nieuwe vlekjes bij. Eerst de oorzaak, dan de kleur. [MEDISCHE-CHECK-ROJDA]",
  },
];
