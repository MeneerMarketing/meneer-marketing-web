/**
 * Laserontharing zones — structuur voor de configurator.
 * Prijzen: [PRIJS-NODIG] tot Okan levert (waarde 0 = niet ingevuld).
 */

export type LaserZoneArea = "gelaat" | "bovenlichaam" | "onderlichaam" | "pakket";

export type LaserZone = {
  readonly id: string;
  readonly label: string;
  readonly area: LaserZoneArea;
  /** Losse sessieprijs in euro; 0 = [PRIJS-NODIG] */
  readonly singlePrice: number;
  /** Optioneel traject; prijs 0 = [PRIJS-NODIG] */
  readonly traject?: {
    readonly price: number;
    readonly sessions: string;
    readonly perMonth?: number;
  };
  /** Zone-ids die uitgeschakeld worden bij selectie van dit pakket */
  readonly includesZones?: readonly string[];
};

export const LASER_ZONE_AREAS: readonly { id: LaserZoneArea; label: string }[] = [
  { id: "gelaat", label: "Gelaat" },
  { id: "bovenlichaam", label: "Bovenlichaam" },
  { id: "onderlichaam", label: "Onderlichaam" },
  { id: "pakket", label: "Pakketten" },
] as const;

export const LASER_ZONES: readonly LaserZone[] = [
  { id: "kin", label: "Kin", area: "gelaat", singlePrice: 0 },
  { id: "bovenlip", label: "Bovenlip", area: "gelaat", singlePrice: 0 },
  { id: "wangen", label: "Wangen", area: "gelaat", singlePrice: 0 },
  { id: "voorhoofd", label: "Voorhoofd", area: "gelaat", singlePrice: 0 },
  { id: "wenkbrauwen", label: "Wenkbrauwen", area: "gelaat", singlePrice: 0 },
  { id: "volledig-gelaat", label: "Volledig gelaat", area: "gelaat", singlePrice: 0 },
  {
    id: "gelaat-pakket",
    label: "Gelaat compleet",
    area: "pakket",
    singlePrice: 0,
    includesZones: ["kin", "bovenlip", "wangen", "voorhoofd", "wenkbrauwen", "volledig-gelaat"],
  },
  { id: "oksel", label: "Oksel", area: "bovenlichaam", singlePrice: 0 },
  { id: "armen", label: "Armen", area: "bovenlichaam", singlePrice: 0 },
  { id: "rug", label: "Rug", area: "bovenlichaam", singlePrice: 0 },
  { id: "borst", label: "Borst", area: "bovenlichaam", singlePrice: 0 },
  { id: "buik", label: "Buik", area: "bovenlichaam", singlePrice: 0 },
  {
    id: "bovenlichaam-pakket",
    label: "Bovenlichaam compleet",
    area: "pakket",
    singlePrice: 0,
    includesZones: ["oksel", "armen", "rug", "borst", "buik"],
  },
  { id: "bikinilijn", label: "Bikinilijn", area: "onderlichaam", singlePrice: 0 },
  { id: "benen", label: "Benen", area: "onderlichaam", singlePrice: 0 },
  { id: "dijen", label: "Dijen", area: "onderlichaam", singlePrice: 0 },
  { id: "billen", label: "Billen", area: "onderlichaam", singlePrice: 0 },
  { id: "voeten", label: "Voeten", area: "onderlichaam", singlePrice: 0 },
  {
    id: "onderlichaam-pakket",
    label: "Onderlichaam compleet",
    area: "pakket",
    singlePrice: 0,
    includesZones: ["bikinilijn", "benen", "dijen", "billen", "voeten"],
  },
  {
    id: "full-body",
    label: "Full body",
    area: "pakket",
    singlePrice: 0,
    traject: { price: 0, sessions: "[GEGEVEN-NODIG] sessies", perMonth: 0 },
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
