/**
 * Laserontharing: de zones en hun tarieven.
 *
 * ⚠ DE BEDRAGEN HIERONDER ZIJN VOORLOPIG EN NIET VAN DIBA. ⚠
 *
 * Ze staan er op uitdrukkelijk verzoek in, zodat de configurator te beoordelen is met
 * echte getallen in plaats van met twintig keer "nog niet bekend". Het zijn plausibele
 * marktbedragen en verder niets: ze zijn niet met de kliniek afgestemd en niemand heeft ze
 * gecontroleerd.
 *
 * Vóór de site live gaat moet Okan deze lijst vervangen. Zolang `VOORLOPIGE_PRIJZEN` op
 * `true` staat zegt de configurator er zelf bij dat de bedragen voorlopig zijn, en die
 * mededeling verdwijnt pas als deze vlag uit gaat. Dat is met opzet aan elkaar geknoopt:
 * zo kan er geen versie bestaan met verzonnen bedragen zonder waarschuwing erbij.
 *
 * [PRIJS-NODIG: alle bedragen, Okan]
 * [GEGEVEN-NODIG: het aantal sessies per zone]
 */

/** Zet op `false` zodra de echte tarieven erin staan. Zie de waarschuwing hierboven. */
export const VOORLOPIGE_PRIJZEN = true;

export type LaserZoneArea = "gelaat" | "bovenlichaam" | "onderlichaam" | "pakket";

export type LaserZone = {
  readonly id: string;
  readonly label: string;
  readonly area: LaserZoneArea;
  /** Prijs per sessie in hele euro's; 0 betekent onbekend, nooit gratis. */
  readonly singlePrice: number;
  /** Optioneel traject; prijs 0 = nog niet bekend. */
  readonly traject?: {
    readonly price: number;
    readonly sessions: string;
    readonly perMonth?: number;
  };
  /** Zone-ids die dit pakket dekt. Die tellen niet nog een keer mee in de opbouw. */
  readonly includesZones?: readonly string[];
};

export const LASER_ZONE_AREAS: readonly { id: LaserZoneArea; label: string }[] = [
  { id: "gelaat", label: "Gelaat" },
  { id: "bovenlichaam", label: "Bovenlichaam" },
  { id: "onderlichaam", label: "Onderlichaam" },
  { id: "pakket", label: "Pakketten" },
] as const;

export const LASER_ZONES: readonly LaserZone[] = [
  { id: "kin", label: "Kin", area: "gelaat", singlePrice: 35 },
  { id: "bovenlip", label: "Bovenlip", area: "gelaat", singlePrice: 35 },
  { id: "wangen", label: "Wangen", area: "gelaat", singlePrice: 45 },
  { id: "voorhoofd", label: "Voorhoofd", area: "gelaat", singlePrice: 40 },
  { id: "wenkbrauwen", label: "Wenkbrauwen", area: "gelaat", singlePrice: 30 },
  {
    id: "volledig-gelaat",
    label: "Volledig gelaat",
    area: "gelaat",
    singlePrice: 95,
  },
  {
    id: "gelaat-pakket",
    label: "Gelaat compleet",
    area: "pakket",
    singlePrice: 125,
    includesZones: [
      "kin",
      "bovenlip",
      "wangen",
      "voorhoofd",
      "wenkbrauwen",
      "volledig-gelaat",
    ],
  },
  { id: "oksel", label: "Oksel", area: "bovenlichaam", singlePrice: 45 },
  { id: "armen", label: "Armen", area: "bovenlichaam", singlePrice: 85 },
  { id: "rug", label: "Rug", area: "bovenlichaam", singlePrice: 110 },
  { id: "borst", label: "Borst", area: "bovenlichaam", singlePrice: 90 },
  { id: "buik", label: "Buik", area: "bovenlichaam", singlePrice: 70 },
  {
    id: "bovenlichaam-pakket",
    label: "Bovenlichaam compleet",
    area: "pakket",
    singlePrice: 245,
    includesZones: ["oksel", "armen", "rug", "borst", "buik"],
  },
  {
    id: "bikinilijn",
    label: "Bikinilijn",
    area: "onderlichaam",
    singlePrice: 55,
  },
  { id: "benen", label: "Onderbenen", area: "onderlichaam", singlePrice: 95 },
  { id: "dijen", label: "Dijen", area: "onderlichaam", singlePrice: 105 },
  { id: "billen", label: "Billen", area: "onderlichaam", singlePrice: 65 },
  { id: "voeten", label: "Voeten", area: "onderlichaam", singlePrice: 30 },
  {
    id: "onderlichaam-pakket",
    label: "Onderlichaam compleet",
    area: "pakket",
    singlePrice: 275,
    includesZones: ["bikinilijn", "benen", "dijen", "billen", "voeten"],
  },
  {
    id: "full-body",
    label: "Full body",
    area: "pakket",
    singlePrice: 495,
    includesZones: [
      "gelaat-pakket",
      "bovenlichaam-pakket",
      "onderlichaam-pakket",
      "kin",
      "bovenlip",
      "wangen",
      "voorhoofd",
      "wenkbrauwen",
      "volledig-gelaat",
      "oksel",
      "armen",
      "rug",
      "borst",
      "buik",
      "bikinilijn",
      "benen",
      "dijen",
      "billen",
      "voeten",
    ],
  },
] as const;

export const FITZPATRICK_TYPES = [
  { id: "I", label: "Type I", description: "Zeer licht, verbrandt snel" },
  { id: "II", label: "Type II", description: "Licht, verbrandt gemakkelijk" },
  { id: "III", label: "Type III", description: "Licht tot medium" },
  { id: "IV", label: "Type IV", description: "Medium tot olijf" },
  { id: "V", label: "Type V", description: "Donker olijf tot bruin" },
  { id: "VI", label: "Type VI", description: "Donker bruin tot zwart" },
] as const;

export type FitzpatrickId = (typeof FITZPATRICK_TYPES)[number]["id"];
