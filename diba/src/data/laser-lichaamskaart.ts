/**
 * De tekening onder de laserconfigurator.
 *
 * Een lijst met vakjes werkt hier niet. Wie laserontharing overweegt denkt niet in
 * woorden als "bovenlichaam" maar wijst aan waar het zit, en de helft van de twijfel gaat
 * over de vraag of een zone doorloopt tot waar je hem wil hebben. Dat los je op door het
 * te laten zien, niet door het te beschrijven.
 *
 * Drie aanzichten. Voor en achter voor het lichaam, en het gezicht apart: op een silhouet
 * van vierhonderd pixels hoog is een bovenlip vier pixels, en dan wordt aanwijzen raden.
 *
 * Het silhouet is opgebouwd uit ronde rechthoeken en cirkels, in dezelfde geest als het
 * silhouet op de psoriasispagina: schematisch, zonder gezicht, zonder huidtint, zonder
 * geslacht. Dat is geen artistieke keuze maar §14, en het heeft een tweede voordeel: wie
 * er ook kijkt, niemand hoeft zich erin te herkennen om het te kunnen gebruiken.
 *
 * De vormen hieronder gebruiken alleen `x, y, breedte, hoogte, straal` of een cirkel.
 * Geen paden: die zijn niet te lezen, niet te verschuiven en niet te controleren, en er
 * is hier niets bij wat een pad nodig heeft.
 */

/** Rechthoek met ronde hoeken. */
export type VormRechthoek = {
  readonly soort: "rechthoek";
  readonly x: number;
  readonly y: number;
  readonly b: number;
  readonly h: number;
  readonly r: number;
};

export type VormCirkel = {
  readonly soort: "cirkel";
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
};

export type VormEllips = {
  readonly soort: "ellips";
  readonly cx: number;
  readonly cy: number;
  readonly rx: number;
  readonly ry: number;
};

export type Vorm = VormRechthoek | VormCirkel | VormEllips;

export type Aanzicht = "voor" | "achter" | "gezicht";

export const AANZICHTEN: readonly { id: Aanzicht; label: string }[] = [
  { id: "voor", label: "Voorkant" },
  { id: "achter", label: "Achterkant" },
  { id: "gezicht", label: "Gezicht" },
];

/** Het lichaam zelf, in beide aanzichten hetzelfde. Alleen tekening, niet aanklikbaar. */
export const LICHAAM: readonly Vorm[] = [
  { soort: "cirkel", cx: 100, cy: 32, r: 21 },
  { soort: "rechthoek", x: 92, y: 46, b: 16, h: 18, r: 6 },
  /* Romp en heupen als één vorm. Als losse blokken viel er een lijn dwars over de buik
     die er anatomisch niet is, en dan lijkt het een tekening van blokken in plaats van
     een schematisch lichaam. */
  { soort: "rechthoek", x: 64, y: 60, b: 72, h: 155, r: 20 },
  { soort: "rechthoek", x: 42, y: 70, b: 20, h: 78, r: 10 },
  { soort: "rechthoek", x: 138, y: 70, b: 20, h: 78, r: 10 },
  { soort: "rechthoek", x: 41, y: 144, b: 18, h: 68, r: 9 },
  { soort: "rechthoek", x: 141, y: 144, b: 18, h: 68, r: 9 },
  { soort: "rechthoek", x: 70, y: 210, b: 26, h: 92, r: 13 },
  { soort: "rechthoek", x: 104, y: 210, b: 26, h: 92, r: 13 },
  { soort: "rechthoek", x: 72, y: 298, b: 22, h: 88, r: 11 },
  { soort: "rechthoek", x: 106, y: 298, b: 22, h: 88, r: 11 },
  { soort: "rechthoek", x: 69, y: 384, b: 26, h: 15, r: 7 },
  { soort: "rechthoek", x: 105, y: 384, b: 26, h: 15, r: 7 },
];

/** Het gezicht, alleen in het derde aanzicht. Geen ogen, geen mond, geen neus. */
export const GEZICHT: readonly Vorm[] = [
  { soort: "ellips", cx: 100, cy: 118, rx: 62, ry: 84 },
];

export const LICHAAM_VIEWBOX = "0 0 200 412";
export const GEZICHT_VIEWBOX = "0 0 200 232";

/**
 * Welke vormen bij welke zone horen, per aanzicht.
 *
 * De sleutels zijn de zone-ids uit `laser-zones.ts`. Dit bestand voegt daar geen zones aan
 * toe en haalt er geen weg: het tekent alleen wat daar al staat. Een zone zonder tekening
 * verschijnt gewoon in de lijst ernaast, dus de kaart kan nooit stiekem iets verbergen.
 */
export const ZONE_VORMEN: Readonly<
  Record<string, Partial<Record<Aanzicht, readonly Vorm[]>>>
> = {
  // ── Gezicht ──
  voorhoofd: {
    gezicht: [{ soort: "rechthoek", x: 56, y: 50, b: 88, h: 34, r: 16 }],
  },
  wenkbrauwen: {
    gezicht: [
      { soort: "rechthoek", x: 60, y: 92, b: 34, h: 12, r: 6 },
      { soort: "rechthoek", x: 106, y: 92, b: 34, h: 12, r: 6 },
    ],
  },
  wangen: {
    gezicht: [
      { soort: "ellips", cx: 66, cy: 144, rx: 25, ry: 20 },
      { soort: "ellips", cx: 134, cy: 144, rx: 25, ry: 20 },
    ],
  },
  bovenlip: {
    gezicht: [{ soort: "rechthoek", x: 82, y: 156, b: 36, h: 14, r: 7 }],
  },
  kin: {
    gezicht: [{ soort: "ellips", cx: 100, cy: 184, rx: 26, ry: 16 }],
  },
  "volledig-gelaat": {
    gezicht: [{ soort: "ellips", cx: 100, cy: 118, rx: 60, ry: 82 }],
  },

  // ── Bovenlichaam ──
  oksel: {
    voor: [
      { soort: "cirkel", cx: 67, cy: 92, r: 9 },
      { soort: "cirkel", cx: 133, cy: 92, r: 9 },
    ],
  },
  borst: {
    voor: [{ soort: "rechthoek", x: 68, y: 72, b: 64, h: 46, r: 14 }],
  },
  buik: {
    voor: [{ soort: "rechthoek", x: 68, y: 120, b: 64, h: 50, r: 12 }],
  },
  rug: {
    achter: [{ soort: "rechthoek", x: 68, y: 70, b: 64, h: 100, r: 14 }],
  },
  armen: {
    voor: [
      { soort: "rechthoek", x: 42, y: 70, b: 20, h: 78, r: 10 },
      { soort: "rechthoek", x: 138, y: 70, b: 20, h: 78, r: 10 },
      { soort: "rechthoek", x: 41, y: 144, b: 18, h: 68, r: 9 },
      { soort: "rechthoek", x: 141, y: 144, b: 18, h: 68, r: 9 },
    ],
    achter: [
      { soort: "rechthoek", x: 42, y: 70, b: 20, h: 78, r: 10 },
      { soort: "rechthoek", x: 138, y: 70, b: 20, h: 78, r: 10 },
      { soort: "rechthoek", x: 41, y: 144, b: 18, h: 68, r: 9 },
      { soort: "rechthoek", x: 141, y: 144, b: 18, h: 68, r: 9 },
    ],
  },

  // ── Onderlichaam ──
  bikinilijn: {
    voor: [{ soort: "rechthoek", x: 72, y: 176, b: 56, h: 34, r: 14 }],
  },
  billen: {
    achter: [{ soort: "rechthoek", x: 69, y: 170, b: 62, h: 42, r: 14 }],
  },
  dijen: {
    voor: [
      { soort: "rechthoek", x: 70, y: 210, b: 26, h: 92, r: 13 },
      { soort: "rechthoek", x: 104, y: 210, b: 26, h: 92, r: 13 },
    ],
    achter: [
      { soort: "rechthoek", x: 70, y: 210, b: 26, h: 92, r: 13 },
      { soort: "rechthoek", x: 104, y: 210, b: 26, h: 92, r: 13 },
    ],
  },
  benen: {
    voor: [
      { soort: "rechthoek", x: 72, y: 298, b: 22, h: 88, r: 11 },
      { soort: "rechthoek", x: 106, y: 298, b: 22, h: 88, r: 11 },
    ],
    achter: [
      { soort: "rechthoek", x: 72, y: 298, b: 22, h: 88, r: 11 },
      { soort: "rechthoek", x: 106, y: 298, b: 22, h: 88, r: 11 },
    ],
  },
  voeten: {
    voor: [
      { soort: "rechthoek", x: 69, y: 384, b: 26, h: 15, r: 7 },
      { soort: "rechthoek", x: 105, y: 384, b: 26, h: 15, r: 7 },
    ],
    achter: [
      { soort: "rechthoek", x: 69, y: 384, b: 26, h: 15, r: 7 },
      { soort: "rechthoek", x: 105, y: 384, b: 26, h: 15, r: 7 },
    ],
  },
};

/** De zones die in een aanzicht te zien zijn, in tekenvolgorde: groot eerst, klein erop. */
export function zonesInAanzicht(aanzicht: Aanzicht): readonly string[] {
  const volgorde: Record<Aanzicht, readonly string[]> = {
    gezicht: [
      "volledig-gelaat",
      "voorhoofd",
      "wangen",
      "wenkbrauwen",
      "bovenlip",
      "kin",
    ],
    voor: [
      "borst",
      "buik",
      "bikinilijn",
      "dijen",
      "benen",
      "armen",
      "voeten",
      "oksel",
    ],
    achter: ["rug", "billen", "dijen", "benen", "armen", "voeten"],
  };
  return volgorde[aanzicht];
}
