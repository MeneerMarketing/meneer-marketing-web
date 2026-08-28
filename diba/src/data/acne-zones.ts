/**
 * De acnekaart — waar het zit is informatie.
 *
 * Dit is de kern van de pagina en het onderdeel dat geen enkele andere kliniek heeft.
 * De plek van acne draagt klinische betekenis: de T-zone is talgrijk, de kaaklijn wijst
 * het vaakst op een hormonale factor, en wangen zijn contact, wrijving of ook hormonaal. Door de
 * bezoeker zijn eigen zones te laten aantikken vertelt de pagina iets dat écht over hem
 * gaat, in plaats van een algemene beschrijving van acne.
 *
 * Dit is geen diagnose. De lezing hieronder is een patroonduiding en dat staat er ook.
 * Alles wat een medische bewering doet is gemarkeerd voor Rojda.
 */

export type ZoneId =
  "voorhoofd" | "neus" | "wangen" | "kin" | "kaaklijn" | "rug";

export type Zone = {
  readonly id: ZoneId;
  readonly naam: string;
  /** Waar de chip staat als de zone niet op het gezicht ligt. */
  readonly buitenGezicht?: boolean;
  /** Wat deze zone op zichzelf meestal betekent. */
  readonly opZichzelf: string;
};

export const ACNE_ZONES: readonly Zone[] = [
  {
    id: "voorhoofd",
    naam: "Voorhoofd",
    opZichzelf:
      "Talgrijke zone. Bij een strakke haargrens kijken we ook naar shampoo, gel en pet of helm.",
  },
  {
    id: "neus",
    naam: "Neus",
    opZichzelf:
      "Hier zitten de grootste poriën van je gezicht. Meestal mee-eters, minder vaak echte ontsteking.",
  },
  {
    id: "wangen",
    naam: "Wangen",
    opZichzelf:
      "Vaak contact en wrijving, maar zeker zo vaak hormonaal. We vragen door naar je telefoon, je kussensloop, of je een mondkapje draagt op werk en naar je cyclus. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    id: "kin",
    naam: "Kin",
    opZichzelf:
      "Komt het in golven en rond een vast moment in de maand? Dan kijken we naar hormonen, niet naar je gezichtsreiniger.",
  },
  {
    id: "kaaklijn",
    naam: "Kaaklijn",
    opZichzelf:
      "Van alle zones is dit de sterkste aanwijzing voor een hormonale factor. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    id: "rug",
    naam: "Rug en schouders",
    buitenGezicht: true,
    opZichzelf:
      "Veel talgklieren, plus zweet en wrijving. Sportbeha, rugzak en een shirt dat niet ademt doen hier meer dan je denkt.",
  },
] as const;

export type Lezing = {
  readonly kop: string;
  readonly tekst: string;
  /** Wat wij als eerste zouden doen bij dit patroon. */
  readonly eersteStap: string;
};

type Regel = {
  /** Alle zones die aan moeten staan. */
  readonly vereist: readonly ZoneId[];
  /** Zones die er niet bij mogen zitten, anders is het een ander patroon. */
  readonly zonder?: readonly ZoneId[];
  readonly lezing: Lezing;
};

/**
 * Regels op volgorde van specifiek naar algemeen. De eerste die past, wint.
 * Zo krijgt "kin plus kaaklijn" de hormonale lezing en niet de algemene.
 */
const REGELS: readonly Regel[] = [
  {
    vereist: ["kin", "kaaklijn"],
    lezing: {
      kop: "Dit patroon wijst op een hormonale factor",
      tekst:
        "Kin en kaaklijn samen is het klassieke beeld. Vaak in golven, vaak rond een vast moment in de maand, vaak diepere plekjes die langer blijven zitten. [MEDISCHE-CHECK-ROJDA]",
      eersteStap:
        "We vragen door over je cyclus, de pil en eventuele PCOS. Huidbehandeling helpt het beeld, maar we sturen je ook naar je huisarts als de oorzaak daar ligt.",
    },
  },
  {
    vereist: ["voorhoofd", "neus"],
    zonder: ["kin", "kaaklijn"],
    lezing: {
      kop: "Een klassieke T-zone",
      tekst:
        "De zone met de meeste talgklieren. Meestal gaat het hier om talg en verhoorning, niet om hormonen. Dat is het type dat vaak met de minste sessies rustig wordt.",
      eersteStap:
        "Poriën reinigen en de verhoorning aanpakken, in stappen. En we kijken naar je haarproducten, want die lopen precies over deze zone.",
    },
  },
  {
    vereist: ["wangen"],
    zonder: ["voorhoofd", "neus", "kin", "kaaklijn"],
    lezing: {
      kop: "Wangen: van buitenaf of hormonaal",
      /* Stond op "wijst vaak naar buiten", met alleen contact als verklaring. Rojda,
         augustus 2026: wangen zijn ook vaak hormonaal. Iemand die hier alleen las dat het
         aan zijn kussensloop lag, ging thuis het verkeerde veranderen. */
      tekst:
        "Zit het alleen op je wangen, dan kan het iets zijn dat je huid raakt: telefoon, kussensloop, mondkapje, sportband. Maar net zo vaak speelt er hormonaal iets mee, en dat zie je van buiten niet. [MEDISCHE-CHECK-ROJDA]",
      eersteStap:
        "Uitzoeken wat er tegen je huid komt, en vragen naar je cyclus en je medicatie. Soms is het op te lossen zonder één behandeling, en dan zeggen we dat.",
    },
  },
  {
    vereist: ["rug"],
    zonder: ["voorhoofd", "neus", "wangen", "kin", "kaaklijn"],
    lezing: {
      kop: "Alleen op je rug of schouders",
      tekst:
        "Deze plek wordt vaak vergeten, ook door klinieken. Er zitten veel talgklieren, en zweet plus wrijving houden het in stand.",
      eersteStap:
        "We kijken naar sport, kleding en wat er na het zweten met je huid gebeurt. Behandelen kan, maar zonder die gewoontes verandert er weinig.",
    },
  },
  {
    vereist: ["kaaklijn"],
    zonder: ["voorhoofd", "neus", "wangen"],
    lezing: {
      kop: "Kaaklijn is een aanwijzing",
      tekst:
        "Van alle zones is dit degene die het vaakst met hormonen te maken heeft. Zeker als het diepere, gevoelige plekjes zijn. [MEDISCHE-CHECK-ROJDA]",
      eersteStap:
        "We beginnen met vragen, niet met behandelen. Wat het patroon in de tijd doet, zegt hier meer dan wat we op de huid zien.",
    },
  },
];

/** Wanneer het over vier of meer zones verspreid zit. */
const VERSPREID: Lezing = {
  kop: "Verspreid over je hele huid",
  tekst:
    "Als het overal zit, kijken we niet naar losse plekken maar naar de huidbarrière als geheel. Dat verandert de aanpak: rustiger opbouwen, minder tegelijk.",
  eersteStap:
    "Een nulmeting eerst. Bij verspreide acne is meten belangrijker dan bij een enkele zone, omdat je het verschil anders niet ziet.",
};

/** Als er precies één zone aan staat waar geen eigen regel voor is. */
function enkeleZone(zone: Zone): Lezing {
  return {
    kop: `Alleen op je ${zone.naam.toLowerCase()}`,
    tekst: zone.opZichzelf,
    eersteStap:
      "Bij één zone kijken we eerst of er een oorzaak buiten je huid is. Zo niet, dan is dit vaak een kort traject.",
  };
}

const NIETS: Lezing = {
  kop: "Tik aan waar het zit",
  tekst:
    "Je kunt meerdere zones kiezen. Waar acne zit vertelt vaak meer over de oorzaak dan hoe het eruitziet.",
  eersteStap:
    "Als je het niet goed kunt aangeven, lopen we de zones tijdens de intake samen na.",
};

export function lees(gekozen: readonly ZoneId[]): Lezing {
  if (gekozen.length === 0) return NIETS;
  if (gekozen.length >= 4) return VERSPREID;

  for (const regel of REGELS) {
    const heeftAlle = regel.vereist.every((z) => gekozen.includes(z));
    const heeftGeenVerboden = (regel.zonder ?? []).every(
      (z) => !gekozen.includes(z),
    );
    if (heeftAlle && heeftGeenVerboden) return regel.lezing;
  }

  if (gekozen.length === 1) {
    const zone = ACNE_ZONES.find((z) => z.id === gekozen[0]);
    if (zone) return enkeleZone(zone);
  }

  return {
    kop: "Een gemengd beeld",
    tekst:
      "Je acne zit in meerdere zones die elk iets anders kunnen betekenen. Dat komt vaak voor en het is geen slecht teken; het betekent alleen dat we beter moeten kijken voordat we iets doen.",
    eersteStap:
      "De nulmeting maakt dit concreet. Daarna weten we welke zone het meeste aandacht vraagt.",
  };
}
