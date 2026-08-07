/**
 * Laserontharing: de zones en hun tarieven.
 *
 * ⚠ HERKOMST: overgenomen van de tarievenpagina van dibaclinics.nl (augustus 2026). ⚠
 *
 * Hiervoor stonden hier verzonnen marktbedragen met een waarschuwing erbij. Dit zijn de
 * echte gepubliceerde tarieven, letterlijk overgenomen, inclusief de indeling in dames en
 * heren die de kliniek zelf aanhoudt. Er is niets afgerond, niets samengevoegd en niets
 * weggelaten, op één regel na die hieronder apart staat.
 *
 * DE PRIJSLIJSTEN VERSCHILLEN, EN DAT IS GEEN DETAIL.
 *
 * Dezelfde zone kost bij heren stelselmatig meer dan bij dames: onderkin 45 tegen 65,
 * gehele rug 160 tegen 200. Dat komt door haardikte en oppervlak, en het staat zo op hun
 * lijst. Eén gemiddelde tonen zou voor iedereen het verkeerde bedrag zijn, dus de
 * configurator vraagt het en rekent per lijst.
 *
 * WAT ER NIET IN STAAT.
 *
 * Trajectprijzen en het aantal sessies staan niet op de tarievenpagina, dus staan ze hier
 * ook niet. Ze verzinnen zou dezelfde fout zijn als de vorige keer, alleen minder
 * zichtbaar omdat de rest nu wel klopt. [GEGEVEN-NODIG: aantal sessies per zone, Okan]
 *
 * DE ENE REGEL DIE IK NIET HEB OVERGENOMEN.
 *
 * "Haarlijn – €6" bij dames. Bij heren staat diezelfde zone op €70, en elke andere
 * gezichtszone bij dames ligt tussen de 20 en 60. Zes euro is vrijwel zeker een ontbrekende
 * nul. Ik zet er geen 60 neer want dat zou ik verzinnen, en geen 6 want dan publiceren we
 * een fout die mensen aan de balie meebrengen. Hij staat op 0 en de site zegt dan "Nog niet
 * bekend". [PRIJS-NODIG: haarlijn dames, Okan; staat nu als €6 op dibaclinics.nl]
 */

/** Stond op `true` toen de bedragen verzonnen waren. Ze komen nu van de kliniek zelf. */
export const VOORLOPIGE_PRIJZEN = false;

export type LaserZoneArea =
  "gelaat" | "bovenlichaam" | "onderlichaam" | "pakket";

/** De twee prijslijsten die de kliniek publiceert. */
export type LaserGeslacht = "dames" | "heren";

export const LASER_GESLACHTEN: readonly {
  readonly id: LaserGeslacht;
  readonly label: string;
}[] = [
  { id: "dames", label: "Dames" },
  { id: "heren", label: "Heren" },
];

export type LaserZone = {
  readonly id: string;
  readonly label: string;
  readonly area: LaserZoneArea;
  readonly geslacht: LaserGeslacht;
  /** Prijs per sessie in hele euro's; 0 betekent onbekend, nooit gratis. */
  readonly singlePrice: number;
  /**
   * De vormen op de lichaamskaart die deze zone laat oplichten.
   *
   * Er zijn meer tarieven dan tekeningen: "bovenarmen" en "onderarmen" delen één arm op de
   * kaart, en "gehele benen" licht er twee tegelijk op. Dat is beter dan voor elk tarief
   * een eigen vormpje maken, want dan wordt de kaart een technische tekening en niet meer
   * een lichaam. Zones zonder vorm (hals, nek) blijven gewoon in de lijst kiesbaar.
   */
  readonly kaartVormen?: readonly string[];
  /** Zone-ids die dit pakket dekt. Die tellen niet nog een keer mee in de opbouw. */
  readonly includesZones?: readonly string[];
};

export const LASER_ZONE_AREAS: readonly { id: LaserZoneArea; label: string }[] =
  [
    { id: "gelaat", label: "Gelaat" },
    { id: "bovenlichaam", label: "Bovenlichaam" },
    { id: "onderlichaam", label: "Onderlichaam" },
    { id: "pakket", label: "Pakketten" },
  ] as const;

/**
 * De tarieven als tabel: label, prijs, gebied, kaartvormen.
 *
 * Bewust een tabel en geen tweeënzestig objectliteralen. Twee prijslijsten die grotendeels
 * dezelfde zones bevatten voor een ander bedrag laten zich alleen controleren als ze onder
 * elkaar staan; in losse objecten verdwijnt precies die vergelijking uit het zicht, en dan
 * valt een overgeslagen zone niemand meer op.
 */
type Rij = readonly [
  sleutel: string,
  label: string,
  area: Exclude<LaserZoneArea, "pakket">,
  vormen: readonly string[],
  dames: number,
  heren: number,
];

/** `-1` betekent: deze zone staat niet op die prijslijst. */
const ONTBREEKT = -1;

const TARIEVEN: readonly Rij[] = [
  // ── Gelaat ──
  ["haarlijn", "Haarlijn", "gelaat", ["voorhoofd"], 0, 70],
  ["voorhoofd", "Voorhoofd", "gelaat", ["voorhoofd"], 50, 65],
  [
    "tussen-wenkbrauwen",
    "Tussen de wenkbrauwen",
    "gelaat",
    ["wenkbrauwen"],
    20,
    25,
  ],
  ["wangen", "Wangen", "gelaat", ["wangen"], 50, 70],
  ["bovenlip", "Bovenlip", "gelaat", ["bovenlip"], 30, 35],
  ["bakkebaard", "Bakkebaard", "gelaat", ["wangen"], 40, 50],
  ["kin", "Kin", "gelaat", ["kin"], 35, 45],
  ["onderkin", "Onderkin", "gelaat", ["kin"], 45, 65],
  ["hals", "Hals", "gelaat", [], 60, 70],
  ["nek", "Nek", "gelaat", [], 55, 70],
  ["bovenlip-kin", "Bovenlip + kin", "gelaat", ["bovenlip", "kin"], 60, 75],
  ["kin-onderkin", "Kin + onderkin", "gelaat", ["kin"], 70, 85],
  ["wangen-bakkebaard", "Wangen + bakkebaard", "gelaat", ["wangen"], 75, 90],
  ["onderkin-hals", "Onderkin + hals", "gelaat", ["kin"], 85, 100],
  ["gehele-gezicht", "Gehele gezicht", "gelaat", ["volledig-gelaat"], 125, 150],
  ["gehele-gelaat", "Gehele gelaat", "gelaat", ["volledig-gelaat"], 150, 190],

  // ── Bovenlichaam ──
  ["oksels", "Oksels", "bovenlichaam", ["oksel"], 50, 60],
  ["bovenarmen", "Bovenarmen", "bovenlichaam", ["armen"], 90, 110],
  ["onderarmen", "Onderarmen", "bovenlichaam", ["armen"], 90, 110],
  ["gehele-armen", "Gehele armen", "bovenlichaam", ["armen"], 150, 200],
  ["buik", "Buik", "bovenlichaam", ["buik"], 95, 125],
  [
    "tussen-borsten",
    "Tussen de borsten",
    "bovenlichaam",
    ["borst"],
    30,
    ONTBREEKT,
  ],
  ["rond-tepels", "Rond de tepels", "bovenlichaam", ["borst"], 60, ONTBREEKT],
  ["borsten", "Borsten", "bovenlichaam", ["borst"], 95, 125],
  [
    "buik-borstkas",
    "Buik + borstkas",
    "bovenlichaam",
    ["buik", "borst"],
    ONTBREEKT,
    230,
  ],
  ["navelstrook", "Navelstrook", "bovenlichaam", ["buik"], 30, ONTBREEKT],
  ["schouders", "Schouders", "bovenlichaam", ["rug"], 90, 95],
  ["bovenrug", "Bovenrug", "bovenlichaam", ["rug"], ONTBREEKT, 125],
  ["onderrug", "Onderrug", "bovenlichaam", ["rug"], 100, 95],
  ["gehele-rug", "Gehele rug", "bovenlichaam", ["rug"], 160, 200],

  // ── Onderlichaam ──
  ["bovenbenen", "Bovenbenen", "onderlichaam", ["dijen"], 110, ONTBREEKT],
  ["onderbenen", "Onderbenen", "onderlichaam", ["benen"], 110, ONTBREEKT],
  [
    "gehele-benen",
    "Gehele benen",
    "onderlichaam",
    ["dijen", "benen"],
    200,
    ONTBREEKT,
  ],
  ["bilnaad", "Bilnaad", "onderlichaam", ["billen"], 80, ONTBREEKT],
  [
    "bikinilijn-klein",
    "Bikinilijn klein",
    "onderlichaam",
    ["bikinilijn"],
    80,
    ONTBREEKT,
  ],
  [
    "bikinilijn-groot",
    "Bikinilijn groot",
    "onderlichaam",
    ["bikinilijn"],
    130,
    ONTBREEKT,
  ],
  ["bilwangen", "Bilwangen", "onderlichaam", ["billen"], 100, ONTBREEKT],
];

/** De pakketten, per prijslijst, met de losse zones die ze dekken. */
type PakketRij = readonly [
  sleutel: string,
  label: string,
  prijs: number,
  dekt: readonly string[],
];

const PAKKETTEN: Readonly<Record<LaserGeslacht, readonly PakketRij[]>> = {
  dames: [
    [
      "a",
      "Pakket A: oksels en bikinilijn groot",
      75,
      ["oksels", "bikinilijn-groot"],
    ],
    [
      "b",
      "Pakket B: oksels, gehele armen en bikinilijn groot",
      125,
      [
        "oksels",
        "gehele-armen",
        "bovenarmen",
        "onderarmen",
        "bikinilijn-groot",
      ],
    ],
    [
      "c",
      "Pakket C: oksels, gehele armen en gehele benen",
      175,
      [
        "oksels",
        "gehele-armen",
        "bovenarmen",
        "onderarmen",
        "gehele-benen",
        "bovenbenen",
        "onderbenen",
      ],
    ],
    [
      "d",
      "Pakket D: oksels, gehele benen en bikinilijn groot",
      175,
      [
        "oksels",
        "gehele-benen",
        "bovenbenen",
        "onderbenen",
        "bikinilijn-groot",
      ],
    ],
    [
      "e",
      "Pakket E: full body zonder gezicht",
      349,
      [
        "oksels",
        "gehele-benen",
        "bovenbenen",
        "onderbenen",
        "gehele-armen",
        "bovenarmen",
        "onderarmen",
        "bikinilijn-groot",
        "bikinilijn-klein",
      ],
    ],
    [
      "gelaat-hals",
      "Gelaat inclusief hals",
      99,
      [
        "gehele-gelaat",
        "gehele-gezicht",
        "hals",
        "voorhoofd",
        "wangen",
        "bovenlip",
        "kin",
        "onderkin",
        "bakkebaard",
        "tussen-wenkbrauwen",
      ],
    ],
  ],
  heren: [
    [
      "1",
      "Pakket 1: baardlijn, wangen en hals",
      80,
      ["wangen", "bakkebaard", "hals", "kin", "onderkin"],
    ],
    ["2", "Pakket 2: borst en buik", 200, ["borsten", "buik", "buik-borstkas"]],
    [
      "3",
      "Pakket 3: borst, buik en rug",
      300,
      [
        "borsten",
        "buik",
        "buik-borstkas",
        "gehele-rug",
        "bovenrug",
        "onderrug",
      ],
    ],
    [
      "4",
      "Pakket 4: borst, buik, rug en schouders",
      350,
      [
        "borsten",
        "buik",
        "buik-borstkas",
        "gehele-rug",
        "bovenrug",
        "onderrug",
        "schouders",
      ],
    ],
    [
      "5",
      "Pakket 5: full body, intieme zone en gezicht",
      500,
      [
        "borsten",
        "buik",
        "buik-borstkas",
        "gehele-rug",
        "bovenrug",
        "onderrug",
        "schouders",
        "oksels",
        "gehele-armen",
        "bovenarmen",
        "onderarmen",
        "gehele-gelaat",
        "gehele-gezicht",
        "hals",
        "nek",
      ],
    ],
  ],
};

/** Het id waar de rest van de app mee werkt: prijslijst plus zone. */
export function zoneId(geslacht: LaserGeslacht, sleutel: string): string {
  return `${geslacht}-${sleutel}`;
}

function bouwZones(): LaserZone[] {
  const uit: LaserZone[] = [];

  for (const geslacht of ["dames", "heren"] as const) {
    for (const [sleutel, label, area, vormen, dames, heren] of TARIEVEN) {
      const prijs = geslacht === "dames" ? dames : heren;
      if (prijs === ONTBREEKT) continue;
      uit.push({
        id: zoneId(geslacht, sleutel),
        label,
        area,
        geslacht,
        singlePrice: prijs,
        kaartVormen: vormen.length > 0 ? vormen : undefined,
      });
    }

    for (const [sleutel, label, prijs, dekt] of PAKKETTEN[geslacht]) {
      uit.push({
        id: zoneId(geslacht, `pakket-${sleutel}`),
        label,
        area: "pakket",
        geslacht,
        singlePrice: prijs,
        includesZones: dekt.map((s) => zoneId(geslacht, s)),
      });
    }
  }

  return uit;
}

export const LASER_ZONES: readonly LaserZone[] = bouwZones();

/** De zones van één prijslijst. De configurator toont er nooit twee door elkaar. */
export function zonesVoor(geslacht: LaserGeslacht): readonly LaserZone[] {
  return LASER_ZONES.filter((z) => z.geslacht === geslacht);
}

/**
 * Welke zone je kiest als je op een vorm op de lichaamskaart klikt.
 *
 * Er zijn meer tarieven dan vormen. Op "wangen" komen drie regels uit de prijslijst uit
 * (wangen, bakkebaard, wangen + bakkebaard) en een klik kan niet raden welke je bedoelt.
 * Daarom wijst een klik de hele regio aan, en staan de fijnere tarieven in de lijst
 * ernaast. Dat is één klik meer voor wie het preciezer wil, en geen enkele gok voor wie
 * dat niet wil.
 *
 * Bikinilijn wijst naar groot en niet naar klein. Naar de goedkoopste wijzen zou hier het
 * "vanaf"-trucje zijn in een andere vorm, en groot is bovendien wat er in de pakketten zit.
 *
 * Voeten staan niet in de lijst. Die vorm blijft dus dood op de kaart, en dat is juist:
 * de kliniek publiceert er geen tarief voor.
 */
export const VORM_HOOFDZONE: Readonly<Record<string, string>> = {
  voorhoofd: "voorhoofd",
  wenkbrauwen: "tussen-wenkbrauwen",
  wangen: "wangen",
  bovenlip: "bovenlip",
  kin: "kin",
  "volledig-gelaat": "gehele-gelaat",
  oksel: "oksels",
  armen: "gehele-armen",
  borst: "borsten",
  buik: "buik",
  rug: "gehele-rug",
  bikinilijn: "bikinilijn-groot",
  billen: "bilwangen",
  dijen: "bovenbenen",
  benen: "onderbenen",
};

/** De zone die bij een vorm hoort, of niets als die prijslijst hem niet kent. */
export function zoneVoorVorm(
  vorm: string,
  geslacht: LaserGeslacht,
): LaserZone | undefined {
  const sleutel = VORM_HOOFDZONE[vorm];
  if (!sleutel) return undefined;
  return LASER_ZONES.find((z) => z.id === zoneId(geslacht, sleutel));
}

/** De vormen die oplichten bij deze keuze, ook die van combinatietarieven. */
export function vormenVanZones(zoneIds: readonly string[]): Set<string> {
  const uit = new Set<string>();
  for (const id of zoneIds) {
    const z = LASER_ZONES.find((x) => x.id === id);
    z?.kaartVormen?.forEach((v) => uit.add(v));
  }
  return uit;
}

export const FITZPATRICK_TYPES = [
  { id: "I", label: "Type I", description: "Zeer licht, verbrandt snel" },
  { id: "II", label: "Type II", description: "Licht, verbrandt gemakkelijk" },
  { id: "III", label: "Type III", description: "Licht tot medium" },
  { id: "IV", label: "Type IV", description: "Medium tot olijf" },
  { id: "V", label: "Type V", description: "Donker olijf tot bruin" },
  { id: "VI", label: "Type VI", description: "Donker bruin tot zwart" },
] as const;

export type FitzpatrickId = (typeof FITZPATRICK_TYPES)[number]["id"];
