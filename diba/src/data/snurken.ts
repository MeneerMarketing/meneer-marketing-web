/**
 * Inhoud van de snurkpagina.
 *
 * WAAROM DEZE PAGINA NIET BIJ DE HUIDPROBLEMEN STAAT.
 *
 * Omdat het er geen is. Iemand die op snurken zoekt komt niet binnen bij een huidkliniek
 * en gaat op /huidproblemen niets aanklikken. Andersom zou de reeks huidproblemen er een
 * vreemde eend bij krijgen die de indeling stukmaakt.
 *
 * Vandaar een eigen route op het hoogste niveau, net als /pcos. Dat is dezelfde soort
 * pagina: een klacht die bij Diba terechtkomt zonder dat het over de huid gaat.
 *
 * DE VOLGORDE IS HET HELE PUNT.
 *
 * De makkelijke pagina heet "NightLase behandeling" en begint bij het apparaat. Deze
 * begint bij de vraag waar het geluid vandaan komt, want dat bepaalt of NightLase bij jou
 * überhaupt iets oplevert. Trilt je zachte gehemelte, dan is er iets te doen. Zit het in
 * je neus, je kaakstand of je tong, dan niet, en dat hoor je liever hier dan na drie
 * sessies.
 *
 * Dat is exact hetzelfde principe als de rest van de site: eerst meten, dan behandelen.
 * Hier is het alleen extra zichtbaar, want bij snurken is de oorzaak minder makkelijk aan
 * te wijzen dan bij een huidklacht.
 *
 * DE GRENS DIE ER MOET STAAN.
 *
 * Snurken is niet hetzelfde als slaapapneu. Bij ademstops hoort slaaponderzoek, en dat
 * loopt via de huisarts. Die zin staat niet als kleine lettertjes onderaan maar als een
 * eigen blok, want het is het enige op deze pagina dat echt gevaarlijk kan zijn om te
 * missen.
 *
 * MEDISCH.
 *
 * Alles wat een bewering doet is gemarkeerd voor Rojda. De herkenningsvragen hieronder
 * zijn een wegwijzer en geen diagnose, en dat staat ook op de pagina zelf.
 */

export type Snurkbron = {
  readonly id: string;
  readonly naam: string;
  /** Wat iemand zelf zou merken of wat zijn partner vertelt. */
  readonly herkenning: string;
  readonly watHetBetekent: string;
  /** Doet NightLase hier iets, en wat is anders het antwoord. */
  readonly watWijDoen: string;
  /** Of dit binnen ons bereik ligt. Stuurt de kleur en de toon van de kaart. */
  readonly binnenBereik: boolean;
};

export const SNURKBRONNEN: readonly Snurkbron[] = [
  {
    id: "gehemelte",
    naam: "Het zachte gehemelte",
    herkenning:
      "Een laag, ratelend geluid met je mond open. Vaak erger op je rug en na een glas wijn.",
    watHetBetekent:
      "Het slappe weefsel achter in je mond trilt mee op de luchtstroom. Dit is de meest voorkomende bron en de enige waar een laser iets aan verandert. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Hier heeft NightLase zin. We kijken eerst mee achter in je mond en spreken daarna een reeks af.",
    binnenBereik: true,
  },
  {
    id: "neus",
    naam: "Je neus",
    herkenning:
      "Je slaapt met je mond open omdat je neus dicht zit, of je snurkt vooral tijdens een verkoudheid of hooikoortsseizoen.",
    watHetBetekent:
      "Een verstopte of scheve neus dwingt je tot ademen door je mond, en dan gaat het gehemelte pas meetrillen. De oorzaak zit dan een stuk eerder. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Wij beginnen hier niet. Dit hoort bij je huisarts of een KNO-arts, en die kan er vaak meer aan doen dan wij.",
    binnenBereik: false,
  },
  {
    id: "tong",
    naam: "Je tong",
    herkenning:
      "Alleen op je rug, met een dieper en onregelmatiger geluid. Op je zij is het vaak weg.",
    watHetBetekent:
      "De tong zakt in je slaap naar achteren en vernauwt de luchtweg. Dat is een ander mechanisme dan een trillend gehemelte. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Hier zeggen we eerlijk dat een laser op het gehemelte weinig verandert. Er zijn andere oplossingen, en die liggen buiten deze kliniek.",
    binnenBereik: false,
  },
  {
    id: "kaak",
    naam: "Je kaakstand of gebit",
    herkenning:
      "Je onderkaak staat naar achteren, of je draagt al een beugel of snurkbeugel.",
    watHetBetekent:
      "De ruimte achter in je keel is dan kleiner dan gemiddeld, ongeacht hoe strak het gehemelte staat. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Dit hoort bij de tandarts of orthodontist. Soms combineert het wel met NightLase, en dat bespreken we dan samen.",
    binnenBereik: false,
  },
];

/**
 * De vragen die bepalen of je eerst naar een arts moet.
 *
 * Dit is geen vragenlijst met een uitslag. Eén keer ja is genoeg om ergens anders te
 * beginnen, en dat is precies wat er staat. Een score zou suggereren dat twee keer ja
 * minder erg is dan drie, en dat weten wij niet.
 */
export const ALARMSIGNALEN: readonly string[] = [
  "Je partner hoort je in je slaap stoppen met ademen",
  "Je wordt wakker met het gevoel dat je naar adem hapt",
  "Je bent overdag ongewoon slaperig, ook na een volle nacht",
  "Je hebt 's ochtends vaak hoofdpijn",
  "Je hebt hoge bloeddruk of een hartaandoening",
];

export const SNURKEN_WEL_NIET = {
  wel: [
    "Eerst kijken waar het geluid vandaan komt, want dat bepaalt of dit bij jou iets oplevert",
    "Doorsturen naar de huisarts als er ook maar één alarmsignaal is, ook als je hier al staat",
    "NightLase als reeks van drie, met vooraf afgesproken momenten om te kijken of het werkt",
    "Eerlijk zeggen dat het effect niet blijvend is en dat herhalen erbij hoort",
    "Meewegen wat er verder speelt: gewicht, alcohol voor het slapen, slaaphouding [MEDISCHE-CHECK-ROJDA]",
  ],
  niet: [
    "Beginnen zonder te weten waar het geluid zit. Dan verkoop je een reeks en geen oplossing",
    "Behandelen bij een vermoeden van slaapapneu. Daar hoort eerst slaaponderzoek bij [MEDISCHE-CHECK-ROJDA]",
    "Beloven dat het snurken helemaal verdwijnt. Minder is realistisch, weg niet altijd [MEDISCHE-CHECK-ROJDA]",
    "Een neusspray of een beugel verkopen naast de behandeling. Dat is niet ons vak",
  ],
} as const;

export const SNURKEN_WIJ_DOEN_NIET = [
  {
    titel: "Geen behandeling bij een vermoeden van slaapapneu",
    tekst:
      "Zijn er ademstops, of ben je overdag ongewoon slaperig, dan sturen we je naar de huisarts voor slaaponderzoek. Snurken zachter maken terwijl er ademstops onder zitten is het alarm uitzetten en het probleem laten staan. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen reeks als het geluid ergens anders zit",
    tekst:
      "Komt het uit je neus, je tong of je kaakstand, dan doet een laser op het gehemelte daar weinig aan. Dan zeggen we dat, ook als je er al voor zat.",
  },
];

export const SNURKEN_FAQ = [
  {
    vraag: "Waar komt het geluid eigenlijk vandaan?",
    antwoord:
      "Van weefsel dat meetrilt op je ademhaling. In je slaap ontspannen de spieren in je keel, waardoor het zachte gehemelte en de huig gaan wapperen op de luchtstroom. Hoe nauwer de doorgang, hoe harder het geluid. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Is snurken hetzelfde als slaapapneu?",
    antwoord:
      "Nee. Snurken is geluid; slaapapneu is dat je ademhaling tijdens de slaap kortdurend stopt. Ze komen vaak samen voor, en daarom vragen wij er altijd naar. Is er een vermoeden, dan hoort er eerst slaaponderzoek bij en beginnen wij niet. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Moet ik voor NightLase onder narcose?",
    antwoord:
      "Nee, en er wordt ook niet gesneden. Je zit erbij, je bent bij kennis en je gaat er daarna zelf vandaan. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Hoeveel sessies heb ik nodig?",
    antwoord:
      "Meestal drie, met ongeveer drie weken ertussen. Het effect bouwt over die reeks op; na de eerste sessie is er zelden al iets te horen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Blijft het weg?",
    antwoord:
      "Niet vanzelf. Het weefsel geeft na verloop van tijd weer mee, en dan is een herhaling nodig. Definitief noemen we het daarom niet, en je hoort vooraf dat er een herhaling bij hoort. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Wat kost dit?",
    antwoord:
      "Het tarief voor NightLase staat op de prijzenpagina zodra het vastligt. [PRIJS-NODIG: tarief NightLase per sessie en als reeks van drie, Okan]",
  },
];
