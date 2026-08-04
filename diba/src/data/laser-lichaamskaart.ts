/**
 * De tekening onder de laserconfigurator.
 *
 * TWEEDE VERSIE. De eerste bouwde het lichaam en het gezicht uit ronde rechthoeken en
 * ellipsen met een randje eromheen. Dat was een sluiproute en dat was te zien: het gezicht
 * werd een masker met twee ovalen op ooghoogte, en het lichaam een stapel blokken met
 * lijntjes ertussen.
 *
 * Wat het oplost is niet meer detail maar een andere techniek.
 *
 * 1. CONTOUREN IN PLAATS VAN VORMEN. Alles hieronder is een pad met bézierkrommen, geen
 *    primitief. Een schouder die overloopt in een arm is één kromme, geen twee rechthoeken
 *    die elkaar raken.
 *
 * 2. KNIPPEN IN PLAATS VAN STAPELEN. Elk lichaamsdeel is een clippad. Een zone is daarna
 *    een grove band of vlek die door dat clippad wordt bijgesneden, en volgt dus vanzelf de
 *    contour van het lichaam. Daarom heeft geen enkele zone een rand nodig: hij stopt
 *    precies waar het lichaam stopt.
 *
 * 3. GEEN LIJNEN. De delen overlappen elkaar ruim en hebben allemaal dezelfde vulling, dus
 *    de naden vallen weg. Wat overblijft is één silhouet.
 *
 * Het gezicht heeft wél trekken: haarlijn, wenkbrauwen, ogen, neus, mond en oren. Zonder
 * die trekken herkent niemand een gezicht, en dan wordt aanwijzen raden. Ze zijn getekend
 * als diagram in één grijstint, niet als portret: geen huidtint, geen fotografie, geen
 * persoon (§14). Ze liggen bovenop de zones, zodat het gezicht een gezicht blijft ook als
 * er een zone oplicht.
 */

export type Aanzicht = "voor" | "achter" | "gezicht";

export const AANZICHTEN: readonly { id: Aanzicht; label: string }[] = [
  { id: "voor", label: "Voorkant" },
  { id: "achter", label: "Achterkant" },
  { id: "gezicht", label: "Gezicht" },
];

export const LICHAAM_VIEWBOX = "0 0 240 560";
export const GEZICHT_VIEWBOX = "0 0 240 232";

/**
 * De onderdelen van het silhouet, elk als eigen clippad-groep.
 *
 * Ze overlappen elkaar met opzet ruim: waar de arm de schouder raakt loopt het armpad een
 * stuk de romp in. Zonder randen valt die overlap weg tegen de vulling, en er ontstaat dus
 * geen naad. Zou je hier randen aanzetten, dan zag je meteen waarom dit werkt.
 */
export const LICHAAMSDELEN = {
  hoofd: [
    "M120 20c17 0 30 15 30 36 0 15-6 28-17 36-4 3-8 4-13 4s-9-1-13-4c-11-8-17-21-17-36 0-21 13-36 30-36Z",
    // De hals loopt door tot in de romp, dus er valt geen streep onder de kin.
    "M108 88h24c-1 12 0 20 4 28h-32c4-8 5-16 4-28Z",
  ],
  romp: [
    // Het kruis: vult het driehoekje tussen de onderkant van de romp en de twee benen.
    "M74 284a46 30 0 1 1 92 0a46 30 0 1 1-92 0Z",
    "M104 104c-16 1-30 6-38 18-6 9-9 20-8 34 2 32 10 50 13 76 3 20-2 28-1 44 1 18 18 28 46 29 28-1 45-11 46-29 1-16-4-24-1-44 3-26 11-44 13-76 1-14-2-25-8-34-8-12-22-17-38-18Z",
  ],
  armen: [
    "M100 110c-16-2-30 4-38 16-6 10-8 22-8 34-2 34-5 62-7 88-2 24-4 48-4 66 0 14 4 24 11 25 7 1 12-6 13-19 2-24 5-50 8-76 3-26 7-52 11-80 2-14 6-26 12-34 6-8 6-16 2-20Z",
    "M140 110c16-2 30 4 38 16 6 10 8 22 8 34 2 34 5 62 7 88 2 24 4 48 4 66 0 14-4 24-11 25-7 1-12-6-13-19-2-24-5-50-8-76-3-26-7-52-11-80-2-14-6-26-12-34-6-8-6-16-2-20Z",
  ],
  benen: [
    "M74 280c-3 34 1 70 5 106 3 26 5 54 7 82 1 18 2 32 3 42 1 10 9 14 16 11 6-2 7-13 7-25 0-30-1-60 0-90 1-38 3-78 4-112v-12Z",
    "M166 280c3 34-1 70-5 106-3 26-5 54-7 82-1 18-2 32-3 42-1 10-9 14-16 11-6-2-7-13-7-25 0-30 1-60 0-90-1-38-3-78-4-112v-12Z",
  ],
  voeten: [
    // Beginnen hoger dan waar de kuit ophoudt, anders zit er een streepje bij de enkel.
    "M92 494c-4 12-8 26-5 33 4 7 20 7 26 1 4-5 5-20 3-34Z",
    "M148 494c4 12 8 26 5 33-4 7-20 7-26 1-4-5-5-20-3-34Z",
  ],
  gezicht: [
    "M120 26c36 0 62 24 66 64 2 18 0 34-4 50-4 18-10 34-20 46-10 12-24 20-42 20-18 0-32-8-42-20-10-12-16-28-20-46-4-16-6-32-4-50 4-40 30-64 66-64Z",
  ],
} as const;

export type Lichaamsdeel = keyof typeof LICHAAMSDELEN;

/** Welke delen in welk aanzicht getekend worden. */
export const DELEN_PER_AANZICHT: Readonly<
  Record<Aanzicht, readonly Lichaamsdeel[]>
> = {
  voor: ["hoofd", "romp", "armen", "benen", "voeten"],
  achter: ["hoofd", "romp", "armen", "benen", "voeten"],
  gezicht: ["gezicht"],
};

export type ZoneVorm = {
  /** Welk lichaamsdeel de vorm bijsnijdt. Zo blijft een armzone binnen de arm. */
  readonly knipOp: Lichaamsdeel;
  /** Grove vorm; het clippad maakt er de juiste van. */
  readonly paden: readonly string[];
};

/**
 * De zones per aanzicht.
 *
 * Let op hoe grof de vormen mogen zijn. "Borst" is letterlijk een rechthoek van rand tot
 * rand; wat je op het scherm ziet is die rechthoek zoals de romp hem uitknipt, inclusief
 * de welving van de schouders. Dat is het hele idee: de contour zit één keer goed, in het
 * clippad, en niet twintig keer opnieuw in elke zone.
 */
export const ZONE_VORMEN: Readonly<
  Record<string, Partial<Record<Aanzicht, ZoneVorm>>>
> = {
  // ── Gezicht ──
  voorhoofd: {
    gezicht: {
      knipOp: "gezicht",
      paden: ["M30 50h180v32c0 9-40 15-90 15s-90-6-90-15Z"],
    },
  },
  wenkbrauwen: {
    gezicht: {
      knipOp: "gezicht",
      paden: [
        "M78 94h32c6 0 10 4 10 10s-4 10-10 10H78c-6 0-10-4-10-10s4-10 10-10Z",
        "M162 94h-32c-6 0-10 4-10 10s4 10 10 10h32c6 0 10-4 10-10s-4-10-10-10Z",
      ],
    },
  },
  wangen: {
    gezicht: {
      knipOp: "gezicht",
      paden: [
        "M52 152a32 26 0 1 1 64 0a32 26 0 1 1-64 0Z",
        "M124 152a32 26 0 1 1 64 0a32 26 0 1 1-64 0Z",
      ],
    },
  },
  bovenlip: {
    gezicht: {
      knipOp: "gezicht",
      paden: ["M120 152c16 0 28 6 28 13s-12 13-28 13-28-6-28-13 12-13 28-13Z"],
    },
  },
  kin: {
    gezicht: {
      knipOp: "gezicht",
      paden: ["M120 176c19 0 31 9 31 21s-14 25-31 25-31-13-31-25 12-21 31-21Z"],
    },
  },
  "volledig-gelaat": {
    gezicht: { knipOp: "gezicht", paden: ["M10 20h220v210H10Z"] },
  },

  // ── Bovenlichaam ──
  oksel: {
    voor: {
      knipOp: "romp",
      paden: [
        "M50 116c22 0 34 12 34 30s-14 28-34 28Z",
        "M190 116c-22 0-34 12-34 30s14 28 34 28Z",
      ],
    },
  },
  borst: {
    voor: { knipOp: "romp", paden: ["M40 104h160v88H40Z"] },
  },
  buik: {
    voor: { knipOp: "romp", paden: ["M40 192h160v70H40Z"] },
  },
  rug: {
    achter: { knipOp: "romp", paden: ["M40 104h160v158H40Z"] },
  },
  armen: {
    voor: { knipOp: "armen", paden: ["M20 100h200v250H20Z"] },
    achter: { knipOp: "armen", paden: ["M20 100h200v250H20Z"] },
  },

  // ── Onderlichaam ──
  bikinilijn: {
    voor: { knipOp: "romp", paden: ["M40 262h160v56H40Z"] },
  },
  billen: {
    achter: { knipOp: "romp", paden: ["M40 262h160v56H40Z"] },
  },
  dijen: {
    voor: { knipOp: "benen", paden: ["M20 276h200v124H20Z"] },
    achter: { knipOp: "benen", paden: ["M20 276h200v124H20Z"] },
  },
  benen: {
    voor: { knipOp: "benen", paden: ["M20 400h200v120H20Z"] },
    achter: { knipOp: "benen", paden: ["M20 400h200v120H20Z"] },
  },
  voeten: {
    voor: { knipOp: "voeten", paden: ["M20 500h200v50H20Z"] },
    achter: { knipOp: "voeten", paden: ["M20 500h200v50H20Z"] },
  },
};

/**
 * De trekken van het gezicht: haarlijn, oren, wenkbrauwen, ogen, neus, mond.
 *
 * Deze liggen bovenop de zones, want een gezicht waarvan de helft verdwijnt zodra je een
 * wang aanwijst is geen wegwijzer meer. Getekend in één grijstint, als diagram.
 */
export const GEZICHT_TREKKEN = {
  /** Haar en oren: gevulde vormen, in dezelfde tint als het gezicht zelf. */
  vlakken: [
    "M120 24c-32 0-54 20-58 56 15-15 34-22 58-22s43 7 58 22c-4-36-26-56-58-56Z",
  ],
  /** Ogen: amandelvorm. Gevuld, in de lijntint. */
  ogen: [
    "M80 122c5-7 12-10 18-10s13 3 18 10c-5 7-11 10-18 10s-13-3-18-10Z",
    "M160 122c-5-7-12-10-18-10s-13 3-18 10c5 7 11 10 18 10s13-3 18-10Z",
  ],
  pupillen: [
    { cx: 98, cy: 122, r: 5 },
    { cx: 142, cy: 122, r: 5 },
  ],
  /** Wenkbrauwen, neusrug en mond: lijnen. */
  lijnen: [
    "M78 102c10-7 22-7 32 2",
    "M162 102c-10-7-22-7-32 2",
    "M120 130v22c0 5-5 8-10 8",
    "M104 176c10 7 22 7 32 0",
  ],
} as const;

/**
 * De volgorde waarin de zones verschijnen: van boven naar beneden, zoals je naar een
 * lichaam kijkt. Dit stuurt zowel de lijst als de tekenvolgorde in de SVG, en die twee
 * moeten hetzelfde zijn: wie later getekend wordt ligt bovenop, dus de kleine zones horen
 * achteraan. Zonder deze lijst volgde alles de sleutelvolgorde van het object hierboven,
 * en dan begint de voorkant bij de oksel.
 */
export const ZONE_VOLGORDE: Readonly<Record<Aanzicht, readonly string[]>> = {
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
  gezicht: [
    "volledig-gelaat",
    "voorhoofd",
    "wangen",
    "wenkbrauwen",
    "bovenlip",
    "kin",
  ],
};
