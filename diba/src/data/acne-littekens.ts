/**
 * Inhoud van de pagina over acnelittekens.
 *
 * WAAROM DEZE PAGINA BESTAAT NAAST /huidproblemen/littekens EN /huidproblemen/acne.
 *
 * Omdat "acnelittekens" bijna nooit is wat het woord zegt. Iemand tikt het in, bedoelt
 * "wat er na de puistjes achterbleef", en dat is in de meeste gevallen helemaal geen
 * litteken maar kleur: een rood vlekje dat nog aan het wegtrekken is, of een bruine vlek
 * van pigment. Die drie zien er op een foto bijna hetzelfde uit, ze vragen om drie
 * verschillende behandelingen, en twee ervan trekken deels vanzelf weg terwijl de derde
 * dat nooit doet.
 *
 * De littekenpagina gaat over littekenweefsel in het algemeen: operatie, keizersnede,
 * striae. De acnepagina gaat over de acne zelf. Wat er tussenin valt, en wat mensen
 * werkelijk zoeken, stond op geen van beide.
 *
 * DE TRIAGE IS DE HELE PAGINA.
 *
 * Niet uitleggen wat een litteken is, maar vaststellen of je er een hebt. Vier uitkomsten,
 * en bij drie ervan is het antwoord iets anders dan wat je kwam halen. Dat is precies waar
 * deze kliniek voor staat, en het scheelt mensen een traject dat niet had gewerkt.
 *
 * De volgorde is niet vrijblijvend: is de acne nog actief, dan is elke littekenbehandeling
 * te vroeg. Die vraag staat daarom eerst.
 *
 * MEDISCH.
 *
 * Alles wat een bewering doet is gemarkeerd voor Rojda. De zelfcheck hieronder is een
 * herkenningshulp en geen diagnose, en dat staat ook op de pagina zelf.
 */

export type NaAcneBeeld = {
  readonly id: string;
  readonly naam: string;
  /** Wat iemand zonder vakkennis zou zeggen. */
  readonly klanttaal: string;
  /** De vakterm ernaast, niet in plaats daarvan (§10). */
  readonly vakterm: string;
  /** De vraag die dit beeld van de andere drie onderscheidt. */
  readonly zelfcheck: string;
  readonly watHetIs: string;
  readonly watWijDoen: string;
  /** Trekt dit vanzelf weg, en in welke mate. Het antwoord dat mensen zoeken. */
  readonly vanzelf: string;
  /** Is dit werkelijk littekenweefsel. Stuurt de kleur en de toon van de kaart. */
  readonly echtLitteken: boolean;
};

export const NA_ACNE_BEELDEN: readonly NaAcneBeeld[] = [
  {
    id: "actief",
    naam: "Er zit nog actieve acne",
    klanttaal: "Er komen nog steeds nieuwe puistjes bij",
    vakterm: "actieve acne",
    zelfcheck:
      "Kwam er de afgelopen maand nog een nieuw ontstoken plekje bij? Dan is dit je antwoord, ook als je vooral naar de oude plekken kijkt.",
    watHetIs:
      "Zolang er nieuwe ontstekingen bij komen, komen er ook nieuwe plekken bij. Behandelen wat er al ligt terwijl de bron nog loopt is dweilen. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Eerst de acne rustig krijgen. Pas daarna kijken we naar wat er is achtergebleven, en dan is dat vaak minder dan je nu denkt.",
    vanzelf:
      "Niet zolang de acne actief is. De plekken die nu wegtrekken worden aangevuld door nieuwe.",
    echtLitteken: false,
  },
  {
    id: "rood",
    naam: "Rode of paarse vlekjes",
    klanttaal: "Platte rode plekjes waar een puistje zat",
    vakterm: "post-inflammatoir erytheem, PIE",
    zelfcheck:
      "Voelt de plek helemaal glad aan als je er met je vinger overheen gaat, zonder kuiltje of bobbeltje? En is hij rood en niet bruin?",
    watHetIs:
      "Geen litteken maar een vaatreactie: de ontsteking is weg, de doorbloeding is nog verhoogd. Dit is wat de meeste mensen bedoelen als ze acnelittekens zeggen. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Vaak niets meteen, en dat is een advies en geen afhouden. Blijft het na maanden staan, dan is licht op de vaatjes de logische stap.",
    vanzelf:
      "Meestal wel, in weken tot maanden. Hoe lichter je huid, hoe langer het zichtbaar blijft. [MEDISCHE-CHECK-ROJDA]",
    echtLitteken: false,
  },
  {
    id: "bruin",
    naam: "Bruine of donkere vlekken",
    klanttaal: "Donkere plekken die blijven staan waar de puistjes zaten",
    vakterm: "post-inflammatoire hyperpigmentatie, PIH",
    zelfcheck:
      "Is de plek glad maar bruin of grijsbruin, en wordt hij donkerder na een dag in de zon?",
    watHetIs:
      "Pigment dat na de ontsteking is achtergebleven. Ook dit is geen litteken: de huid is heel, alleen de kleur klopt niet. Komt vaker en heftiger voor bij een donkerder huidtype. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Zonbescherming is hier geen bijzaak maar de behandeling zelf; zonder dat werkt de rest niet. Daarnaast peelings of een pigmenttraject, afhankelijk van hoe diep het zit.",
    vanzelf:
      "Deels, maar langzaam: maanden tot meer dan een jaar. Zonlicht maakt het elke keer opnieuw donkerder, dus zonder bescherming schiet het niet op. [MEDISCHE-CHECK-ROJDA]",
    echtLitteken: false,
  },
  {
    id: "putje",
    naam: "Kuiltjes of putjes",
    klanttaal: "Deukjes in je huid die je in zijlicht het beste ziet",
    vakterm: "atrofische acnelittekens: ice pick, boxcar, rolling",
    zelfcheck:
      "Zie je een schaduw in de plek als het licht van opzij komt, of voel je een randje met je vingertop?",
    watHetIs:
      "Dit is wél littekenweefsel. Er is bij de ontsteking bindweefsel verloren gegaan en de huid is daar ingezakt. Kleur kan er los van staan; een putje kan gewoon huidkleurig zijn. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Herstel op gang brengen in het bindweefsel, met microneedling of laser, in een reeks over maanden. De vorm van het putje bepaalt wat er zin heeft. [MEDISCHE-CHECK-ROJDA]",
    vanzelf:
      "Nee. Een putje dat er een jaar zit, zit er over vijf jaar nog. Dit is het enige van de vier waarbij afwachten niets oplevert.",
    echtLitteken: true,
  },
];

/**
 * De volgorde waarin het moet, en waarom.
 *
 * Dit is geen tijdlijn met beloftes over hoe snel iets gaat; die stond op de acnepagina en
 * is er in augustus 2026 uitgehaald omdat mensen erop afhaakten. Dit is iets anders: de
 * volgorde van behandelen, waarbij elke stap onmogelijk is zolang de vorige niet klaar is.
 */
export const VOLGORDE: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "Eerst de ontsteking",
    tekst:
      "Zolang er nieuwe puistjes bij komen, komen er nieuwe plekken bij. Elke littekenbehandeling in een ontstoken huid maakt de ontsteking bovendien erger.",
  },
  {
    kop: "Dan de kleur laten zakken",
    tekst:
      "Rood en bruin trekken deels vanzelf weg. Wat je na een half jaar nog ziet, is pas wat er echt zit; daarvoor behandel je iets dat toch was verdwenen.",
  },
  {
    kop: "Pas dan de putjes",
    tekst:
      "Wat overblijft is littekenweefsel. Dat is het enige type waar een reeks behandelingen op de lange termijn echt iets aan verandert.",
  },
];

export const ACNE_LITTEKENS_WEL_NIET = {
  wel: [
    "Eerst vaststellen of het littekenweefsel is of kleur, want dat scheelt vaak een heel traject",
    "Wachten tot de acne rustig is voordat er iets aan de littekens gebeurt",
    "Zonbescherming, elke dag. Bij bruine vlekken is dit geen aanvulling maar de kern [MEDISCHE-CHECK-ROJDA]",
    "Een nulmeting in zijlicht, want in recht licht zie je putjes nauwelijks",
    "Zeggen wanneer afwachten meer oplevert dan behandelen, ook als je hier zat voor een behandeling",
  ],
  niet: [
    "Laseren of needlen in een huid met actieve ontstekingen. Dat verergert de acne en kan het litteken juist vastzetten [MEDISCHE-CHECK-ROJDA]",
    "Een pigmentvlek behandelen alsof het een litteken is. Het is een andere laag en een andere aanpak",
    "Beloven dat putjes helemaal verdwijnen. Minder diep en minder zichtbaar is realistisch, weg niet [MEDISCHE-CHECK-ROJDA]",
    "Zelf uitknijpen vergroot de kans op diepere ontstekingen, verkleuringen en littekens",
    "Beginnen op een gebruinde huid [MEDISCHE-CHECK-ROJDA]",
  ],
} as const;

export const ACNE_LITTEKENS_WIJ_DOEN_NIET = [
  {
    titel: "Geen littekenbehandeling op een actieve huid",
    tekst:
      "Komen er nog nieuwe ontstoken plekjes bij, dan behandelen we die eerst. Needlen of laseren in actieve acne verergert de ontsteking en kan het litteken vastzetten. Dat kost je maanden in plaats van dat het ze scheelt. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen reeks voor iets dat vanzelf weggaat",
    tekst:
      "Is het rood en glad, dan is de kans groot dat het over een paar maanden weg is. Dan zeggen we dat, ook als je hier zat om iets te boeken. Blijft het staan, dan kun je altijd terugkomen.",
  },
];

export const ACNE_LITTEKENS_FAQ = [
  {
    vraag: "Hoe weet ik of het een litteken is of alleen kleur?",
    antwoord:
      "Met je vinger en met licht van opzij. Voel je een kuiltje of een randje, en zie je een schaduw als het licht schuin valt, dan is er weefsel verloren gegaan. Voelt het glad en zie je alleen kleur, dan is het rood of pigment en geen litteken. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Gaan acnelittekens vanzelf weg?",
    antwoord:
      "Rode en bruine plekken deels wel, in maanden. Kuiltjes niet: die zitten er over jaren nog net zo. Dat onderscheid bepaalt of afwachten verstandig is of juist zonde van de tijd. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Hoe lang moet ik wachten na mijn laatste puistje?",
    antwoord:
      "Er is geen vaste termijn; het gaat erom dat er geen nieuwe ontstekingen meer bij komen en dat de huid rustig is. Bij de meting kijken we daarnaar, en soms is het antwoord dat we over een paar maanden opnieuw kijken. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Kunnen putjes helemaal verdwijnen?",
    antwoord:
      "Nee. Wat wel kan is ze ondieper en minder zichtbaar maken, over een reeks van meerdere sessies. Wij beloven geen gladde huid, want dat kunnen we voor de meting niet weten en erna meestal ook niet. [MEDISCHE-CHECK-ROJDA]",
  },
];
