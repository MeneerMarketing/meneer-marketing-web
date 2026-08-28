/**
 * Inhoud van de pagina over steelwratjes.
 *
 * WAAROM DEZE PAGINA ER MOET ZIJN.
 *
 * Omdat de behandeling al bestaat en de klacht nergens stond. Fibromen verwijderen staat
 * onder /behandelingen met een tarief per kwartier; wie een hangend velletje in zijn hals
 * heeft zoekt op "steelwratje" en niet op "fibromen".
 *
 * DE VEILIGHEIDSKANT.
 *
 * Deze pagina hoort niet alleen over wegnemen te gaan. Er hangt van alles aan een hals dat
 * op een steelwratje lijkt, en niet alles is onschuldig. Een kliniek die alles wat uitsteekt
 * wegknipt, knipt op een dag iets weg dat beoordeeld had moeten worden, en dan is er niets
 * meer om te beoordelen.
 *
 * Vandaar dat de eerste vraag hier is of het een steeltje heeft en of het onveranderd is,
 * en niet hoe storend het is.
 *
 * WAAROM MENSEN HET ZELF PROBEREN.
 *
 * Omdat het internet vol staat met draadjes, nagelknippers en tape. Dat gaat vaak lang goed
 * en één keer niet, en die ene keer is een ontsteking in een hals of een litteken op een
 * ooglid. Dat staat er met zoveel woorden, want een pagina die alleen zegt "kom langs"
 * overtuigt iemand niet die het al drie keer zelf heeft geprobeerd.
 *
 * MEDISCH.
 *
 * Alles wat een bewering doet is gemarkeerd voor Rojda. Elk plekje wordt beoordeeld voordat
 * er iets mee gebeurt; dat is geen formaliteit maar de kern van deze pagina.
 */

export type UitsteekselBeeld = {
  readonly id: string;
  readonly naam: string;
  readonly klanttaal: string;
  readonly vakterm: string;
  readonly zelfcheck: string;
  readonly watHetIs: string;
  readonly watWijDoen: string;
  readonly binnenBereik: boolean;
};

export const UITSTEEKSEL_BEELDEN: readonly UitsteekselBeeld[] = [
  {
    id: "steelwratje",
    naam: "Een velletje aan een steeltje",
    klanttaal: "Een zacht hangend velletje in je hals, oksel of lies",
    vakterm: "fibroma pendulans, acrochordon",
    zelfcheck:
      "Hangt het aan een smaller steeltje, is het zacht, huidkleurig tot lichtbruin, en zit het er al maanden onveranderd bij?",
    watHetIs:
      "Een goedaardig uitstulpinkje van huid en bindweefsel, meestal op plekken waar huid over huid schuurt. Onschuldig, en het gaat niet vanzelf weg. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Beoordelen en daarna weghalen, meestal in één afspraak. Er wordt per kwartier gerekend, dus meerdere kleine plekjes tegelijk kost niet meer per stuk.",
    binnenBereik: true,
  },
  {
    id: "keratose",
    naam: "Een ruwe bruine bult",
    klanttaal:
      "Een bruin plekje dat verheven aanvoelt, alsof het erop geplakt zit",
    vakterm: "seborroïsche keratose",
    zelfcheck:
      "Zit het met een breed vlak op de huid in plaats van aan een steeltje, en voelt het oppervlak korrelig of wasachtig?",
    watHetIs:
      "Ook goedaardig, maar een ander weefsel en een andere aanpak. Het wordt vaak voor een moedervlek aangezien en is dat niet. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Eerst laten beoordelen. Verwijderen kan vaak wel, maar dat gaat anders dan bij een steeltje. [MEDISCHE-CHECK-ROJDA]",
    binnenBereik: false,
  },
  {
    id: "moedervlek",
    naam: "Een verheven moedervlek",
    klanttaal: "Een bruine bult die er al jaren zit, soms met een haartje erin",
    vakterm: "naevus",
    zelfcheck:
      "Is het gelijkmatig bruin, rond en scherp begrensd, en zit het er al sinds je jeugd of tienertijd?",
    watHetIs:
      "Een moedervlek en geen steelwratje. Die halen wij niet weg, ook niet als hij stoort: beoordelen en verwijderen hoort bij een arts. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Doorsturen. Een moedervlek die weg moet, hoort onderzocht te worden en dat kunnen wij niet.",
    binnenBereik: false,
  },
  {
    id: "verandert",
    naam: "Iets dat verandert",
    klanttaal: "Een plekje dat groeit, kleurt, jeukt of bloedt",
    vakterm: "verdachte laesie",
    zelfcheck:
      "Is het de afgelopen maanden anders geworden: groter, donkerder, ongelijk van kleur, of bloedt het zonder dat je eraan zat?",
    watHetIs:
      "Dat weten wij niet, en dat is het punt. Alles wat verandert hoort beoordeeld te worden vóórdat er iets mee gebeurt. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Wij halen dit niet weg. Je gaat eerst naar de huisarts, ook als het waarschijnlijk niets is.",
    binnenBereik: false,
  },
];

/**
 * De steeltjescheck.
 *
 * Drie waarnemingen die bepalen of dit hier thuishoort of bij een arts. Bewust zonder
 * instructie om eraan te trekken of te knijpen: dat is precies wat mensen thuis doen en
 * waar het misgaat.
 */
export const STEELTJESCHECK_STAPPEN: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "Kijk of er een steeltje is",
    tekst:
      "Hangt het los aan een smaller stukje huid, of zit het met een breed vlak vast? Een steeltje wijst op een fibroom; een breed vlak op iets anders.",
  },
  {
    kop: "Kijk naar de kleur",
    tekst:
      "Huidkleurig of lichtbruin en overal gelijk is gewoon. Ongelijk bruin, zwart, of meerdere kleuren door elkaar is een reden om er eerst iemand anders naar te laten kijken.",
  },
  {
    kop: "Denk terug",
    tekst:
      "Zat het er een half jaar geleden precies zo bij? Onveranderd is geruststellend. Groeit het, jeukt het of bloedt het, dan gaat het naar de huisarts en niet naar ons.",
  },
];

export const STEELWRAT_WEL_NIET = {
  wel: [
    "Elk plekje beoordelen voordat er iets mee gebeurt, ook als je precies weet wat je wil",
    "Goedaardige steelwratjes weghalen, meestal in één afspraak",
    "Per kwartier rekenen, zodat meerdere kleine plekjes tegelijk niet per stuk duurder worden",
    "Doorsturen naar de huisarts bij alles wat verandert of niet duidelijk is [MEDISCHE-CHECK-ROJDA]",
    "Uitleggen waarom ze op die plekken zitten, want dan snap je waarom er nieuwe bij komen",
  ],
  niet: [
    "Moedervlekken verwijderen. Die horen beoordeeld te worden en dat kunnen wij niet [MEDISCHE-CHECK-ROJDA]",
    "Iets weghalen dat verandert. Dan is er niets meer over om te onderzoeken [MEDISCHE-CHECK-ROJDA]",
    "Zelf afbinden met een draadje of afknippen met een nagelschaar. Dat gaat vaak lang goed en één keer niet",
    "Beloven dat er nooit meer nieuwe bij komen. De aanleg en de wrijving blijven [MEDISCHE-CHECK-ROJDA]",
  ],
} as const;

export const STEELWRAT_WIJ_DOEN_NIET = [
  {
    titel: "Niets weghalen dat niet beoordeeld is",
    tekst:
      "Ook niet als je zeker weet wat het is en er speciaal voor bent gekomen. Wat weg is kan niet meer bekeken worden, en dat is een fout die niet te herstellen valt. Het kost twee minuten om er eerst naar te kijken. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen moedervlekken",
    tekst:
      "Een verheven moedervlek die stoort halen wij niet weg. Beoordelen en verwijderen van pigmentplekjes hoort bij een arts, en die kan het weefsel laten onderzoeken. Wij verwijzen daarvoor door. [MEDISCHE-CHECK-ROJDA]",
  },
];

export const STEELWRAT_FAQ = [
  {
    vraag: "Waarom krijg ik ze in mijn hals en oksels?",
    antwoord:
      "Op die plekken schuurt huid over huid, en dat is de plek waar dit soort uitstulpinkjes ontstaan. Kleding, een ketting of een bh-bandje versnellen het. Aanleg speelt ook mee: bij sommige mensen komen ze met tientallen tegelijk. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Mag ik ze zelf afbinden?",
    antwoord:
      "Liever niet, en dat is geen omzetargument. Het gaat vaak lang goed en één keer niet, en die ene keer is een ontsteking in een hals of een litteken op een ooglid. Bovendien knip je dan iets weg dat niemand meer heeft bekeken. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Komen ze terug?",
    antwoord:
      "Een verwijderd steelwratje komt niet terug, maar er kunnen nieuwe ontstaan op andere plekken. De aanleg en de wrijving veranderen niet door een behandeling. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Blijft er een litteken achter?",
    antwoord:
      "Bij een klein steelwratje meestal een rood puntje dat in weken wegtrekt. Hoe groter de basis, hoe meer kans dat er iets zichtbaar blijft. Dat bespreken we vooraf per plekje en niet achteraf. [MEDISCHE-CHECK-ROJDA]",
  },
];
