/**
 * Inhoud van de pagina over rimpels en fijne lijntjes.
 *
 * WAAROM NAAST /huidproblemen/huidveroudering.
 *
 * Huidveroudering is een verzamelnaam en beschrijft een proces: elasticiteit, pigment,
 * textuur, verslapping. "Rimpels" is wat iemand in de spiegel ziet en intikt. Dat is
 * dezelfde afstand als tussen "acne" en "acnelittekens": het ene is het onderwerp, het
 * andere is waar iemand mee zit.
 *
 * DE BEWEEGTEST IS DE HELE PAGINA.
 *
 * Ontspan je gezicht en kijk of de lijn er nog staat. Verdwijnt hij, dan is het een
 * mimieklijn en zit het in de spier; blijft hij staan, dan zit het in de huid. Dat verschil
 * bepaalt volledig wat er zin heeft, en het is met een spiegel in tien seconden te maken.
 *
 * WAT HIER EERLIJK MOET.
 *
 * Diba werkt niet met injectables. Voor een zuivere mimieklijn is dat wél de gangbare
 * route, en dat hoort er dan gewoon te staan in plaats van dat we het gesprek naar iets
 * anders buigen. Wat wij doen werkt op de huid: opbouw van collageen, structuur, stevigheid.
 * Dat is iets anders dan een spier stilleggen, en beide hebben hun eigen lijn.
 *
 * MEDISCH.
 *
 * Alles wat een bewering doet is gemarkeerd voor Rojda.
 */

export type Lijnsoort = {
  readonly id: string;
  readonly naam: string;
  readonly klanttaal: string;
  readonly vakterm: string;
  /** Wat de beweegtest bij deze soort doet. */
  readonly beweegtest: string;
  readonly watHetIs: string;
  readonly watWijDoen: string;
  /** Werkt een huidbehandeling hier, of ligt het elders. */
  readonly binnenBereik: boolean;
};

export const LIJNSOORTEN: readonly Lijnsoort[] = [
  {
    id: "droogte",
    naam: "Droogtelijntjes",
    klanttaal: "Fijne streepjes die er 's ochtends zijn en later minder",
    vakterm: "dehydratielijnen",
    beweegtest:
      "Ze verdwijnen al als je je huid goed verzorgt, en verschillen per dag en per seizoen.",
    watHetIs:
      "Geen rimpel maar een huid met te weinig vocht. De bovenste laag ligt dan niet glad en vangt licht in kleine streepjes. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Vaak niets ingrijpends. Barrière herstellen en hydrateren, en dan opnieuw kijken. Dit is het beeld waarbij mensen het vaakst te veel kopen.",
    binnenBereik: true,
  },
  {
    id: "mimiek",
    naam: "Mimieklijnen",
    klanttaal: "Lijnen die je ziet als je lacht of fronst, en anders niet",
    vakterm: "dynamische rimpels",
    beweegtest:
      "Ontspan je gezicht helemaal. Is de lijn dan weg? Dan is hij dynamisch.",
    watHetIs:
      "Een vouw die ontstaat doordat een spier de huid samentrekt. De huid zelf is nog intact. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Hier zijn wij eerlijk: voor een zuivere mimieklijn is een injectable de gangbare route, en dat doen wij niet. Wel kunnen we de huid eromheen steviger maken, waardoor de vouw minder snel blijft staan.",
    binnenBereik: false,
  },
  {
    id: "statisch",
    naam: "Lijnen die blijven staan",
    klanttaal: "Lijnen die er ook zijn als je gezicht in rust is",
    vakterm: "statische rimpels",
    beweegtest:
      "Ontspan je gezicht. Staat de lijn er nog steeds? Dan zit het in de huid en niet in de spier.",
    watHetIs:
      "De huid heeft op die plek collageen en elasticiteit verloren en vouwt niet meer terug. Dit is waar een huidbehandeling werkt. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Herstel op gang brengen in het bindweefsel, met microneedling of laser, in een reeks over maanden. Resultaat is minder diep, niet weg.",
    binnenBereik: true,
  },
  {
    id: "verslapping",
    naam: "Verslapping",
    klanttaal: "Je gezicht zakt en de contour van je kaaklijn wordt vager",
    vakterm: "laxiteit",
    beweegtest:
      "Kijk in de spiegel terwijl je iets voorover buigt, en daarna liggend. Verandert de vorm van je gezicht duidelijk, dan gaat het om verslapping en niet om lijnen.",
    watHetIs:
      "Niet een lijn maar de hele structuur die meegeeft: minder elasticiteit, minder steun, en zwaartekracht die zijn werk doet. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Aanspannen van de diepere lagen met laser, in een reeks. Wat losgelaten huid is wordt hier niet vastgezet; dat is chirurgie. [MEDISCHE-CHECK-ROJDA]",
    binnenBereik: true,
  },
];

export const RIMPELS_WEL_NIET = {
  wel: [
    "Eerst de beweegtest, want een dynamische lijn en een statische lijn vragen om iets anders",
    "Collageenopbouw op gang brengen, in een reeks over maanden en niet in een sessie",
    "Zonbescherming, elke dag. Dit is verreweg de grootste factor in hoe snel er nieuwe lijnen bij komen [MEDISCHE-CHECK-ROJDA]",
    "Een huidanalyse, want bij dit huidprobleem gaat het om maanden en je ziet je eigen gezicht elke dag",
    "Zeggen wanneer verzorging meer oplevert dan een behandeling",
  ],
  niet: [
    "Injectables. Wij werken er niet mee, en voor sommige lijnen is dat juist wel de logische route",
    "Beloven dat lijnen verdwijnen. Minder diep en minder zichtbaar is realistisch [MEDISCHE-CHECK-ROJDA]",
    "Een reeks starten voor lijntjes die door droogte komen. Die zijn met verzorging weg",
    "Losgelaten huid behandelen alsof het verslapping is. Dat is chirurgie [MEDISCHE-CHECK-ROJDA]",
    "Beginnen op een gebruinde huid [MEDISCHE-CHECK-ROJDA]",
  ],
} as const;

export const RIMPELS_WIJ_DOEN_NIET = [
  {
    titel: "Geen injectables, ook niet als je erom vraagt",
    tekst:
      "Botox en fillers horen niet bij wat wij doen. Bij een zuivere mimieklijn is dat vaak wél het antwoord, en dan zeggen we dat in plaats van je iets anders aan te bieden dat minder past. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen reeks voor een droge huid",
    tekst:
      "Zijn het fijne streepjes die per dag verschillen, dan is het vocht en geen verlies van structuur. Dat is met verzorging op te lossen en niet met een apparaat.",
  },
];

export const RIMPELS_FAQ = [
  {
    vraag: "Hoe weet ik of het een rimpel is of een droogtelijntje?",
    antwoord:
      "Kijk een week lang op verschillende momenten. Een droogtelijntje verandert met de dag, het seizoen en je verzorging; een echte rimpel staat er elke ochtend hetzelfde bij. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Doen jullie botox?",
    antwoord:
      "Nee. Wij werken op de huid en niet op de spier. Voor een lijn die alleen zichtbaar is bij beweging is een injectable vaak de logische route, en dan verwijzen we je liever door dan dat we je een reeks verkopen die daar weinig aan verandert.",
  },
  {
    vraag: "Op welke leeftijd moet ik hiermee beginnen?",
    antwoord:
      "Er is geen leeftijd. Wat er wel toe doet is of er iets te winnen valt: bij een huid die nog stevig is levert een reeks weinig op, en dan is zonbescherming de hele behandeling. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Hoe lang duurt het voor ik iets zie?",
    antwoord:
      "Collageenopbouw is een kwestie van maanden en niet van weken. Daarom meten we vooraf: over die termijn is je eigen indruk geen betrouwbare maat. [MEDISCHE-CHECK-ROJDA]",
  },
];

/**
 * De beweegtest.
 *
 * Tien seconden voor de spiegel, en het antwoord bepaalt of een huidbehandeling bij jou
 * iets oplevert of dat je bij iemand anders moet zijn. Dat is dezelfde soort test als de
 * drukproef bij couperose: geen widget maar iets dat op je eigen gezicht werkt.
 */
export const BEWEEGTEST_STAPPEN: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "Ontspan alles",
    tekst:
      "Ga voor de spiegel staan en laat je gezicht helemaal los. Niet lachen, niet fronsen, ook niet een beetje. Dat laatste is lastiger dan het klinkt.",
  },
  {
    kop: "Kijk waar de lijn nog staat",
    tekst:
      "Welke lijnen zijn verdwenen nu je gezicht in rust is, en welke staan er nog? Alleen dat verschil telt; hoe diep ze zijn doet er nu even niet toe.",
  },
  {
    kop: "Trek dan een gezicht",
    tekst:
      "Lach breed, frons, trek je wenkbrauwen op. De lijnen die er alleen nu zijn, zitten in de spier. De lijnen die er ook in rust waren, zitten in je huid.",
  },
];
