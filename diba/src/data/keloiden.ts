/**
 * Inhoud van de keloidenpagina.
 *
 * WAAROM DEZE PAGINA ER WEER IS.
 *
 * Keloiden stonden als redirect naar de littekenpagina. Yasin wil een eigen pagina, en die
 * is er ook nodig: wie hier zoekt heeft meestal al een diagnose en zoekt of er iets aan te
 * doen is.
 *
 * DE GRENS DIE BLIJFT.
 *
 * Een keloid groeit over de oorspronkelijke wond heen en heeft de neiging terug te komen,
 * feller, na een prikkel. Te stevig behandelen maakt het groter. Daarom loopt de
 * behandeling van een keloid via een arts, en werken wij daarnaast.
 *
 * Dat is geen wegsturen. Het onderscheid tussen een hypertrofisch litteken en een keloid
 * maken wij wel, en een hypertrofisch litteken behandelen we ook. Het verschil is dat de
 * eerste binnen de wondranden blijft en na verloop van tijd vlakker wordt.
 *
 * [MEDISCHE-CHECK-ROJDA] alles hieronder over wat wij bij welk type doen, en de vraag of
 * we bij een keloid met een verwijzing wel kunnen behandelen of alleen meekijken.
 */

export const KELOID_BEOORDELING: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "Of het over de wondrand heen groeit",
    tekst:
      "Een hypertrofisch litteken blijft binnen de oorspronkelijke wond. Een keloid groeit eroverheen, de gezonde huid in.",
  },
  {
    kop: "Hoe oud het is en wat het doet",
    tekst:
      "Een hypertrofisch litteken wordt na maanden tot een jaar vaak vlakker. Een keloid blijft of groeit door, en dat verschil telt.",
  },
  {
    kop: "Waar het zit en of het jeukt",
    tekst:
      "Borstbeen, schouders en oorlellen zijn de plekken waar keloid het vaakst ontstaat. Jeuk en pijn horen erbij en zeggen iets over de activiteit.",
  },
];

export const KELOID_SOORTEN: readonly {
  readonly id: string;
  readonly naam: string;
  readonly klanttaal: string;
  readonly vakterm: string;
  readonly watHetIs: string;
  readonly watWijDoen: string;
  readonly verwachting: string;
}[] = [
  {
    id: "hypertrofisch",
    naam: "Verdikt litteken binnen de wondrand",
    klanttaal: "Verhoogd en rood, maar niet groter dan het litteken zelf",
    vakterm: "hypertrofisch litteken",
    watHetIs:
      "De aanmaak van collageen is doorgeschoten tijdens de genezing, maar het weefsel blijft binnen de grenzen van de oorspronkelijke wond.",
    watWijDoen:
      "Dit behandelen we, met microneedling en laser die het weefsel gelijkmatiger maken. Vaak in overleg met je arts. [MEDISCHE-CHECK-ROJDA]",
    verwachting:
      "Vlakker en minder rood is haalbaar. Hoeveel en in hoeveel afspraken, hoor je na de beoordeling.",
  },
  {
    id: "keloid",
    naam: "Litteken dat over de rand heen groeit",
    klanttaal: "Groeit door tot buiten het oorspronkelijke wondje",
    vakterm: "keloid",
    watHetIs:
      "Het weefsel groeit over de wondranden heen, de gezonde huid in. Keloid komt vaker voor bij een donkere huid; dat hangt samen met aanleg.",
    watWijDoen:
      "Hier loopt de behandeling via je arts of dermatoloog. Wij beoordelen mee en stemmen af, want een te stevige prikkel maakt een keloid groter. [MEDISCHE-CHECK-ROJDA]",
    verwachting:
      "Met een verwijzing kijken we wat er naast de medische behandeling mogelijk is.",
  },
];

export const KELOID_WEL_NIET = {
  wel: [
    "Een nieuw litteken beschermen tegen zon en spanning, zeker het eerste jaar",
    "Bij aanleg voor keloid dat vooraf melden bij elke ingreep, ook bij een piercing",
    "Laten beoordelen zodra het verhoogd blijft of begint te groeien",
    "Jeuk en pijn benoemen, want die zeggen iets over hoe actief het weefsel is",
  ],
  niet: [
    "Zelf krabben, knijpen of er een pleister strak overheen trekken",
    "Een keloid laten behandelen zonder dat een arts ernaar heeft gekeken",
    "Wachten tot het vanzelf overgaat. Een keloid doet dat meestal niet",
    "Een nieuwe piercing of tatoeage op een plek waar eerder keloid ontstond",
  ],
} as const;

export const KELOID_FAQ: readonly {
  readonly vraag: string;
  readonly antwoord: string;
}[] = [
  {
    vraag: "Wat is het verschil met een gewoon dik litteken?",
    antwoord:
      "Een hypertrofisch litteken blijft binnen de oorspronkelijke wond en wordt na verloop van tijd vaak vlakker. Een keloid groeit eroverheen en blijft. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Behandelen jullie keloid?",
    antwoord:
      "De behandeling van een keloid loopt via je arts of dermatoloog. Wij beoordelen mee en stemmen af over wat er daarnaast mogelijk is, want een te stevige prikkel maakt een keloid groter.",
  },
  {
    vraag: "Waarom krijg ik ze en anderen niet?",
    antwoord:
      "Aanleg speelt de grootste rol, en keloid komt vaker voor bij een donkere huid. Het zegt niets over hoe je een wond hebt verzorgd.",
  },
  {
    vraag: "Kan ik nog een piercing of tatoeage nemen?",
    antwoord:
      "Op een plek waar eerder keloid ontstond is dat af te raden. Bespreek het met je arts voordat je iets laat zetten. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Komt het terug na behandeling?",
    antwoord:
      "Bij keloid is de kans daarop reeel, en dat is precies waarom het bij een arts hoort. Wat de kans is in jouw geval, hoor je daar. [MEDISCHE-CHECK-ROJDA]",
  },
];
