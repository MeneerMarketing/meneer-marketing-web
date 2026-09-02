import { kostenVraag } from "@/data/pillar-kosten";

/**
 * Inhoud van de pagina over een doffe huid.
 *
 * WAAROM DIT EEN PAGINA IS TERWIJL HET GEEN AANDOENING IS.
 *
 * "Dof" staat in geen enkel medisch handboek. Het is consumententaal voor iets dat mensen
 * wel degelijk zien: een huid die het licht niet meer terugkaatst. En het is een van de
 * meest ingetikte termen in dit vak, precies omdat er geen vakterm voor bestaat.
 *
 * Wat het bijzonder maakt is dat dofheid altijd een gevólg is. Er is geen ziekte "dofheid";
 * er is een huid die licht verstrooit in plaats van weerkaatst, en dat kan vier heel
 * verschillende oorzaken hebben. Die vier vragen om vier verschillende dingen, en bij twee
 * ervan is de beste behandeling een gewoonte en geen afspraak.
 *
 * DE LICHTTEST.
 *
 * Dofheid is het enige huidprobleem op deze site dat je kunt meten met een lamp en een
 * hoek. Een gladde huid geeft een aaneengesloten glans terug; een huid met opgehoopte
 * cellen of te weinig vocht verstrooit dat licht in alle richtingen. Dat zie je zelf, als
 * je maar op de goede plek gaat staan.
 *
 * WAT HIER EERLIJK MOET.
 *
 * Een gezichtsbehandeling geeft vrijwel altijd direct effect op dofheid, en dat effect is
 * vaak tijdelijk. Dat is geen bezwaar zolang je het weet: een keer per zes weken glans
 * kopen is een legitieme keuze. Het wordt pas een probleem als iemand denkt een oorzaak te
 * behandelen terwijl hij een symptoom afkoopt.
 *
 * MEDISCH.
 *
 * Alles wat een bewering doet is gemarkeerd voor Rojda.
 */

export type DofBeeld = {
  readonly id: string;
  readonly naam: string;
  readonly klanttaal: string;
  readonly vakterm: string;
  readonly zelfcheck: string;
  readonly watHetIs: string;
  readonly watWijDoen: string;
  readonly binnenBereik: boolean;
};

export const DOF_BEELDEN: readonly DofBeeld[] = [
  {
    id: "cellen",
    naam: "Opgehoopte dode cellen",
    klanttaal: "Je huid voelt ruw en ziet er grauw uit, ook net na het wassen",
    vakterm: "vertraagde desquamatie",
    zelfcheck:
      "Voelt je huid onder je vingertoppen licht ruw, en blijft er op een washandje meer achter dan je zou verwachten?",
    watHetIs:
      "De bovenste laag vernieuwt trager dan vroeger, waardoor er cellen blijven liggen die het licht verstrooien in plaats van weerkaatsen. Dit is de meest voorkomende oorzaak. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "De vernieuwing weer op gang helpen, met een gezichtsbehandeling of een lichte peeling. Hier is het effect direct zichtbaar.",
    binnenBereik: true,
  },
  {
    id: "vocht",
    naam: "Te weinig vocht",
    klanttaal: "Fijne streepjes en een fletse tint, vooral 's ochtends",
    vakterm: "dehydratie van de hoornlaag",
    zelfcheck:
      "Zie je fijne streepjes die per dag verschillen, en trekt je huid kort na het wassen? Dat kan ook bij een vette huid.",
    watHetIs:
      "Een huid met te weinig water in de bovenste laag ligt niet glad, en een oneffen oppervlak oogt dof. Los van hoeveel talg je maakt. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Eerst de barrière herstellen en pas daarna kijken of er nog iets nodig is. Vaak is er dan niets meer nodig.",
    binnenBereik: true,
  },
  {
    id: "pigment",
    naam: "Ongelijke kleur",
    klanttaal:
      "Je huid oogt vlekkerig en daardoor vermoeid, ook zonder losse vlekken",
    vakterm: "diffuse hyperpigmentatie",
    zelfcheck:
      "Zie je in de spiegel geen duidelijke vlekken maar wel een ongelijke tint, en valt het op foto's meer op dan in het echt?",
    watHetIs:
      "Pigment dat ongelijkmatig verdeeld ligt. Je oog leest een ongelijke tint als vermoeid, ook al is er nergens een vlek aan te wijzen. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Dit is geen kwestie van een gezichtsbehandeling maar van pigment aanpakken, en dat loopt over maanden. De pigmentpagina legt dat uit.",
    binnenBereik: false,
  },
  {
    id: "leefstijl",
    naam: "Slaap, roken, uitdroging",
    klanttaal: "Een grauwe tint die komt en gaat met je weken",
    vakterm: "exogene factoren",
    zelfcheck:
      "Is het duidelijk erger na een slechte week en beter na een vakantie? Verandert het met je slaap en hoeveel je drinkt?",
    watHetIs:
      "Doorbloeding en herstel lopen terug bij slaaptekort, roken en te weinig drinken, en dat zie je het eerst aan je gezicht. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Hier verkopen we niets. We benoemen het, want een behandeling die tegen je gewoontes in werkt is weggegooid geld.",
    binnenBereik: false,
  },
];

/**
 * De lichttest.
 *
 * Dofheid is licht dat verstrooit in plaats van weerkaatst, en dat is precies wat je met
 * één lamp zichtbaar maakt. Bewust bij daglicht en niet in de badkamer: gemengd
 * kunstlicht van boven maakt elke huid vlak en verstopt juist wat je wil zien.
 */
export const LICHTTEST_STAPPEN: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "Ga bij een raam staan",
    tekst:
      "Daglicht van opzij, geen lamp boven je hoofd. Badkamerverlichting valt van boven en maakt elke huid even vlak; dat is precies wat je nu niet wil.",
  },
  {
    kop: "Draai langzaam je hoofd",
    tekst:
      "Kijk naar je jukbeen terwijl je draait. Zie je op één punt een aaneengesloten glans meeschuiven, of blijft het overal even mat?",
  },
  {
    kop: "Voel er dan overheen",
    tekst:
      "Blijft het mat en voelt het ruw, dan gaat het om opgehoopte cellen. Blijft het mat en voelt het glad, dan gaat het eerder om vocht of om kleur.",
  },
];

export const DOF_WEL_NIET = {
  wel: [
    "Eerst uitzoeken of het om cellen, vocht, kleur of leefstijl gaat, want dat scheelt een traject",
    "De vernieuwing van de bovenlaag op gang helpen, in een tempo dat je huid aankan",
    "Eerlijk zeggen dat het effect van een gezichtsbehandeling op dofheid vaak tijdelijk is",
    "Zonbescherming, want ongelijke kleur is de traagste van de vier om terug te draaien [MEDISCHE-CHECK-ROJDA]",
    "Benoemen wanneer slaap en water meer opleveren dan wat wij kunnen doen",
  ],
  niet: [
    "Dagelijks scrubben. Je haalt de barrière weg, en een beschadigde barrière oogt doffer [MEDISCHE-CHECK-ROJDA]",
    "Een lang traject starten terwijl een aanpassing in verzorging of gewoonten voldoende kan zijn",
    "Een vette huid uitdrogen om hem minder dof te maken. Die reageert met meer talg [MEDISCHE-CHECK-ROJDA]",
    "Beloven dat glans blijft. Een gezichtsbehandeling geeft direct effect en dat effect zakt weer",
    "Steeds sterker peelen omdat het vorige effect wegtrok",
  ],
} as const;

export const DOF_WIJ_DOEN_NIET = [
  {
    titel: "Geen reeks tegen een slechte maand",
    tekst:
      "Is de tint duidelijk erger na weken van slecht slapen en beter na een vakantie, dan is er geen huidprobleem maar een periode. Wij benoemen dat liever dan dat we er een traject tegenover zetten dat tegen je gewoontes in moet werken.",
  },
  {
    titel: "Geen sterkere peeling omdat het effect wegtrok",
    tekst:
      "Het effect van een behandeling op dofheid zakt na verloop van tijd. Dat is normaal en geen reden om steeds dieper te gaan. Wie die trap opgaat houdt een geïrriteerde huid over die juist doffer oogt. [MEDISCHE-CHECK-ROJDA]",
  },
];

export const DOF_FAQ = [
  {
    vraag: "Waarom ziet mijn huid er 's ochtends doffer uit?",
    antwoord:
      "In je slaap verlies je vocht via je huid en ligt de doorbloeding lager. In de loop van de ochtend trekt dat bij. Blijft het de hele dag, dan zit het niet in je nacht maar in je hoornlaag. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Hoe lang blijft het effect van een gezichtsbehandeling?",
    antwoord:
      "Bij dofheid is het effect vaak direct zichtbaar en meestal een aantal weken merkbaar. Dat is geen tekortkoming zolang je het weet: eens in de zoveel weken glans kopen is een legitieme keuze. Het wordt pas een probleem als je denkt een oorzaak te behandelen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Helpt meer water drinken?",
    antwoord:
      "Als je structureel te weinig drinkt, ja. Boven een normale inname niet: extra water maakt je huid niet extra vochtig. Wat wel scheelt is wat je huid vasthoudt, en daar is met verzorging meer aan te doen dan met een fles. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Is dof hetzelfde als droog?",
    antwoord:
      "Nee. Droog gaat over te weinig vet, uitgedroogd over te weinig water, en dof over hoe je huid licht terugkaatst. Je kunt een vette huid hebben die dof is. Op de pagina over een droge huid staat dat onderscheid uitgewerkt.",
  },
  kostenVraag(),
];
