import { kostenVraag } from "@/data/pillar-kosten";

/**
 * Inhoud van de pagina over huidverslapping.
 *
 * WAAROM NAAST /huidproblemen/huidveroudering EN /huidproblemen/rimpels.
 *
 * Drie woorden voor drie verschillende klachten. Huidveroudering is het proces, rimpels
 * zijn de lijnen, en verslapping is de vorm: je kaaklijn wordt vager, je wangen zakken, je
 * hals verliest zijn contour. Iemand die daarmee zit heeft geen last van lijntjes en zoekt
 * ook niet daarop.
 *
 * DE ZWAARTEKRACHTTEST.
 *
 * Verslapping is het enige huidprobleem dat verandert met de stand van je hoofd. Ga liggen
 * en kijk in een spiegel boven je: wat er dan strakker uitziet is precies wat er
 * overdag naar beneden hangt. Dat is meteen de eerlijkste voorspelling die er bestaat van
 * wat een behandeling hooguit kan bereiken, want verder terug dan liggend gaat het niet.
 *
 * WAT HIER EERLIJK MOET.
 *
 * De grens met chirurgie. Wat werkelijk is losgelaten wordt door geen enkel apparaat
 * teruggezet, en die grens ligt niet bij een leeftijd maar bij hoeveel er overblijft als je
 * de huid met twee vingers omhoog duwt. Dat verzwijgen levert een reeks van drie op bij
 * iemand die een facelift zoekt.
 *
 * MEDISCH.
 *
 * Alles wat een bewering doet is gemarkeerd voor Rojda.
 */

export type VerslappingBeeld = {
  readonly id: string;
  readonly naam: string;
  readonly klanttaal: string;
  readonly vakterm: string;
  readonly zelfcheck: string;
  readonly watHetIs: string;
  readonly watWijDoen: string;
  readonly binnenBereik: boolean;
};

export const VERSLAPPING_BEELDEN: readonly VerslappingBeeld[] = [
  {
    id: "elasticiteit",
    naam: "De huid veert langzamer terug",
    klanttaal: "Je knijpt in je wang en het duurt even voor het weer glad is",
    vakterm: "verlies van elasticiteit",
    zelfcheck:
      "Knijp voorzichtig een plooi op je wang of de rug van je hand en laat los. Blijft de plooi een tel staan, dan is dat wat je meet.",
    watHetIs:
      "Elastine en collageen nemen af, waardoor de huid trager terugveert. Dit is het vroegste stadium en het stadium waarin een behandeling het meeste oplevert. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Herstel op gang brengen in de diepere lagen, met laser of needling, in een reeks over maanden. Hier is winst te boeken.",
    binnenBereik: true,
  },
  {
    id: "contour",
    naam: "De kaaklijn wordt vager",
    klanttaal:
      "De grens tussen je kaak en je hals is minder scherp dan vroeger",
    vakterm: "verlies van definitie langs de mandibula",
    zelfcheck:
      "Kijk recht vooruit in de spiegel en daarna met je kin iets omhoog. Wordt de lijn dan wel weer scherp, dan gaat het om de huid en nog niet om volume eronder.",
    watHetIs:
      "De huid houdt de contour niet meer strak, terwijl er onder nog weinig is veranderd. Dit is de klacht waarmee de meeste mensen hier binnenkomen. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Aanspannen van de diepere lagen langs de kaaklijn, in een reeks. Verwacht scherper, niet strak.",
    binnenBereik: true,
  },
  {
    id: "volume",
    naam: "Je gezicht is smaller geworden",
    klanttaal: "Je wangen zijn platter en je gezicht oogt ingevallen",
    vakterm: "volumeverlies",
    zelfcheck:
      "Vergelijk een foto van tien jaar geleden. Is het gezicht vooral smaller geworden in plaats van dat er iets hangt?",
    watHetIs:
      "Vetkussens in het gezicht nemen af en verplaatsen, en bot trekt zich terug. Dat is geen huidprobleem, ook al zie je het aan je huid. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Volume opvullen doen wij niet. De huid steviger maken kan wel, en soms is dat genoeg; is dat het niet, dan zeggen we dat.",
    binnenBereik: false,
  },
  {
    id: "losgelaten",
    naam: "Huid die echt hangt",
    klanttaal: "Een plooi die je kunt vastpakken en die blijft hangen",
    vakterm: "dermatochalasis, laxiteit in gevorderd stadium",
    zelfcheck:
      "Duw de huid met twee vingers omhoog naar je slaap. Moet je meer dan een centimeter verplaatsen om te krijgen wat je wil, dan gaat het hierover.",
    watHetIs:
      "Weefsel dat werkelijk is losgelaten en niet alleen minder stevig. Geen apparaat zet dit terug, hoe vaak je ook komt. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Hier zeggen we nee, en we verwijzen door. Dat is geen onwil: het is het verschil tussen aanspannen en verwijderen.",
    binnenBereik: false,
  },
];

/**
 * De zwaartekrachttest.
 *
 * De eerlijkste voorspelling die er bestaat, en hij kost niets. Wat je liggend ziet is de
 * bovengrens van wat een behandeling kan bereiken; verder dan dat gaat aanspannen niet.
 * Dat is prettig eerlijk in twee richtingen: het temt te hoge verwachtingen, en het laat
 * zien dat er wél iets te winnen valt.
 */
export const ZWAARTEKRACHT_STAPPEN: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "Kijk staand",
    tekst:
      "Recht vooruit in de spiegel, met je gezicht in rust. Zo zie je eruit op de momenten waarop het je opvalt, en dat is waar we vanaf rekenen.",
  },
  {
    kop: "Kijk liggend",
    tekst:
      "Ga op je rug liggen met een spiegel boven je, of maak een foto. Wat nu strakker oogt, trekt de zwaartekracht overdag naar beneden.",
  },
  {
    kop: "Vergelijk de twee",
    tekst:
      "Het verschil tussen die twee beelden geeft ongeveer aan wat er te winnen valt. Is er nauwelijks verschil, dan levert een behandeling weinig op.",
  },
];

export const VERSLAPPING_WEL_NIET = {
  wel: [
    "Eerst vaststellen of het om stevigheid gaat, om volume, of om huid die echt is losgelaten",
    "De diepere lagen aanspannen met laser, in een reeks met weken ertussen",
    "Een huidanalyse, want verandering over maanden zie je in de spiegel niet en op een meting wel",
    "Dagelijkse zonbescherming, omdat uv-straling collageen en elastine afbreekt [MEDISCHE-CHECK-ROJDA]",
    "Zeggen wanneer het verschil te klein wordt om de investering waard te zijn",
  ],
  niet: [
    "Chirurgie nabootsen. Wat is losgelaten wordt hier niet vastgezet [MEDISCHE-CHECK-ROJDA]",
    "Volume opvullen. Wij werken niet met fillers, en bij een smaller geworden gezicht is dat vaak wel het antwoord",
    "Een behandelreeks starten terwijl de beoordeling laat zien dat weinig verbetering te verwachten is",
    "Resultaat beloven in weken. Collageenopbouw loopt over maanden [MEDISCHE-CHECK-ROJDA]",
    "Behandelen op een gebruinde huid [MEDISCHE-CHECK-ROJDA]",
  ],
} as const;

export const VERSLAPPING_WIJ_DOEN_NIET = [
  {
    titel: "Geen apparaat tegen huid die is losgelaten",
    tekst:
      "Kun je een plooi vastpakken die blijft hangen, dan gaat het om weefsel dat verwijderd of verplaatst moet worden. Dat is chirurgie. Een reeks van drie verkopen aan iemand die een lift zoekt is het duurste nee dat wij kunnen uitstellen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen traject zonder meting vooraf",
    tekst:
      "Verandering over maanden is met het blote oog niet te beoordelen, in beide richtingen. Zonder huidanalyse kunnen wij niet aantonen dat het werkte en jij niet nagaan of het geld goed besteed was.",
  },
];

export const VERSLAPPING_FAQ = [
  {
    vraag: "Is dit een alternatief voor een facelift?",
    antwoord:
      "Nee. Aanspannen van de huid en het verwijderen van weefsel zijn twee verschillende dingen, en wij doen alleen het eerste. Wat wij doen werkt in het stadium daarvoor, en op het moment dat dat stadium voorbij is zeggen we dat. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Vanaf welke leeftijd heeft dit zin?",
    antwoord:
      "Leeftijd zegt hier weinig; de zwaartekrachttest zegt meer. Zie je liggend duidelijk verschil met staand, dan valt er iets te winnen. Is dat verschil er nauwelijks, dan is er nog niets om aan te spannen of juist te veel om aan te pakken. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Hoe lang houdt het resultaat aan?",
    antwoord:
      "Het proces zelf gaat door, dus het is geen eindpunt maar een verschuiving. Hoe lang dat merkbaar blijft verschilt sterk per persoon; we spreken vooraf af wanneer we opnieuw meten in plaats van dat we een getal noemen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Doet het pijn?",
    antwoord:
      "Je voelt warmte en soms korte prikjes. De meeste mensen omschrijven het als goed te doen, en er is geen verdoving nodig. Wat je erna merkt hangt af van de behandeling en staat op de behandelpagina. [MEDISCHE-CHECK-ROJDA]",
  },
  kostenVraag(),
];
