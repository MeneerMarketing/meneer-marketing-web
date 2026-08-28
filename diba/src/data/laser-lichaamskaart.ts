/**
 * De tekening onder de laserconfigurator.
 *
 * DERDE VERSIE. De vorige tekende elke kant met de hand, en dat ging mis op de plek waar
 * het opvalt: de romp stond gecentreerd op x=116 terwijl hoofd, armen en benen op 120
 * stonden. Vier pixels. Genoeg om de borstzone links buiten de arm te laten steken en hem
 * rechts eronder te laten verdwijnen, want de zone wordt op de romp bijgesneden en die
 * romp lag scheef. Zoiets is niet met bijtekenen op te lossen: zolang links en rechts twee
 * losse paden zijn, lopen ze vroeg of laat weer uit elkaar.
 *
 * DE REGEL DIE DAT ONMOGELIJK MAAKT.
 *
 * Alles in dit bestand is de LINKERHELFT. De rechterhelft bestaat niet als data; hij wordt
 * gespiegeld getekend om `SPIEGEL_AS`. Er is dus geen rechterkant die kan afwijken, en er
 * valt ook niets meer na te meten. Vormen die de as raken lopen er een paar pixels
 * overheen, zodat de twee helften elkaar overlappen en er geen haarlijn in het midden
 * ontstaat.
 *
 * Dat scheelt ook de helft van de paden: één arm in plaats van twee, één been, één oor.
 *
 * DE ANDERE TWEE PRINCIPES BLIJVEN.
 *
 * Knippen in plaats van stapelen: elk lichaamsdeel is een clippad, elke zone een grove
 * band die daardoor wordt bijgesneden en dus vanzelf de contour volgt. En geen enkele
 * lijn: alles is vulling, de delen overlappen elkaar ruim en delen dezelfde tint, dus de
 * naden vallen weg.
 *
 * HET GEZICHT IS GEEN GEZICHT MEER.
 *
 * Er stonden pupillen in, een gebogen mond en twee wenkbrauwen die omhoog liepen. Dat is
 * precies het recept voor een tekenfilmkop, want uitdrukking zit in de pupil en in de
 * kromming van de mond. Wat deze kaart moet doen is plaats aanwijzen, niet iemand
 * aankijken. Dus: geen pupillen, een rechte mond, geen neuslijn met een haakje. Wat
 * overblijft zijn ijkpunten in twee grijsgroene tinten, zoals een anatomische kaart ze
 * zet. Geen huidtint, geen fotografie, geen persoon (§14).
 */

export type Aanzicht = "voor" | "achter" | "gezicht";

export const AANZICHTEN: readonly { id: Aanzicht; label: string }[] = [
  { id: "voor", label: "Voorkant" },
  { id: "achter", label: "Achterkant" },
  { id: "gezicht", label: "Gezicht" },
];

export const LICHAAM_VIEWBOX = "0 0 240 560";
export const GEZICHT_VIEWBOX = "0 0 240 224";

/**
 * De verticale as waarover gespiegeld wordt.
 *
 * Beide viewboxen zijn 240 breed, dus de as ligt in beide op 120 en dezelfde spiegeling
 * werkt voor het lichaam en het gezicht.
 */
export const SPIEGEL_AS = 240;

/**
 * De onderdelen van het silhouet, elk als eigen clippad-groep. Linkerhelft.
 *
 * Ze overlappen elkaar met opzet ruim: het armpad loopt een stuk de romp in, het beenpad
 * loopt door tot onder het bekken. Zonder randen valt die overlap weg tegen de vulling en
 * ontstaat er geen naad.
 */
export const LICHAAMSDELEN = {
  hoofd: [
    // Schedel: halve ovaal, dicht op de as.
    "M121 32C103 32 91 47 91 66C91 85 103 100 121 100Z",
    // Hals: begint boven de kaaklijn, loopt door tot in de romp.
    "M121 90H106C106 110 105 120 102 128H121Z",
  ],
  romp: [
    /* Schouder, ribben, taille, heup, tot het kruis op de as. De zijkant loopt tussen de
       schouder en de heup bijna recht, en dat is een tekenkeuze met een reden: de arm
       hangt ertegenaan en moet zelf ook recht kunnen zijn. Een romp met een diepe taille
       dwingt de arm mee te golven, en dan krijg je een bult bij de elleboog.
       De deltaspier zit op de arm, niet hier: die geeft de figuur zijn breedte. */
    "M121 122C107 122 96 126 88 133C81 139 79 146 79 156C78 176 78 196 79 216C80 236 79 252 77 266C75 284 72 298 73 310C79 318 100 322 121 322Z",
  ],
  armen: [
    /* Eén arm, hangend, van de deltaspier tot de vingertoppen op het bovenbeen.
       De binnenrand loopt zeven pixels over de romp heen: genoeg om nergens een naad te
       hebben, weinig genoeg om een rompzone niet tot een slabbetje te knijpen. Daarvoor
       lag hij vijfentwintig pixels over de ribben en was er van de borst nog maar de
       helft over. */
    "M102 126C88 129 78 136 71 146C64 155 60 166 59 180C58 200 58 220 59 240C60 258 61 278 62 296C62 308 61 316 60 326C59 342 63 356 71 358C79 360 85 352 85 340C85 330 83 322 82 312C81 296 82 278 83 258C84 238 84 216 85 194C86 176 89 160 94 148C99 136 104 129 102 126Z",
  ],
  benen: [
    /* Eén been, van onder het bekken tot de enkel. De bovenkant valt weg onder de romp.
       De binnenrand begint op de as en loopt naar beneden uit elkaar, zodat de twee benen
       elkaar in het kruis raken. Stond hij eerder recht, dan bleef er tussen de benen een
       reepje romp over dat groen werd zodra je de bikinilijn koos: een tong die daar
       hangt en nergens op slaat. */
    "M76 306C72 336 71 372 74 402C77 432 82 466 88 502L108 502C109 466 111 432 112 402C113 374 116 342 121 316Z",
  ],
  voeten: [
    // Begint hoger dan waar de kuit ophoudt, anders zit er een streepje bij de enkel.
    "M89 494C86 512 83 528 87 534C93 540 106 539 109 532C111 524 110 508 109 494Z",
  ],
  gezicht: [
    /* Schedel het breedst bij de slapen, via het jukbeen smaller naar de kaakhoek, dan een
       ronde kin op de as. Breedte tegen hoogte is 0,685: dat is waar een hoofd op houdt te
       lijken op een ei. */
    "M121 20C101 20 82 27 72 45C63 59 58 76 58 94C58 114 61 130 67 148C75 168 89 185 104 195C110 199 116 201 121 201Z",
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

/**
 * Delen die ná de rompzones nog een keer overheen gaan.
 *
 * De romp loopt onder de armen en onder het bekken door, want anders zit er een naad. Maar
 * een zone die op de romp wordt bijgesneden loopt dan mee tot onder de arm, en dan lijkt
 * het of de borst over de schouder heen bloedt. Door de arm en het been na de rompzones
 * opnieuw te vullen stopt elke rompzone precies in de oksel en in de liesplooi, en dat is
 * ook waar ze op een lichaam ophouden. Hun eigen zones komen daar weer overheen.
 */
export const OVERTEKENEN: readonly Lichaamsdeel[] = [
  "armen",
  "benen",
  "voeten",
];

export type ZoneVorm = {
  /** Welk lichaamsdeel de vorm bijsnijdt. Zo blijft een armzone binnen de arm. */
  readonly knipOp: Lichaamsdeel;
  /** Grove vorm, linkerhelft; het clippad maakt er de juiste van. */
  readonly paden: readonly string[];
  /**
   * Of deze zone ook zichtbaar is als je hem niet gekozen hebt.
   *
   * Alleen op het gezicht, en dat verschil is het hele ontwerp van dat aanzicht. Op de
   * romp vullen de zones bijna het hele silhouet: laat je ze in rust zien, dan staat er
   * een gestreepte figuur zonder betekenis. Op het gezicht zijn het eilanden in een groot
   * vlak, en juist dáár maakt het van de tekening een kaart. Wat overblijft tussen de
   * eilanden zijn de oogband en de neusrug, en die hoeven dan niet meer getekend te
   * worden: de plek waar niets ligt zegt het al.
   *
   * "Volledig gelaat" hoort er niet bij. Dat is de knop voor alles tegelijk; in rust zou
   * hij het hele gezicht één tint maken en precies de indeling wegpoetsen.
   */
  readonly rustvlak?: true;
};

/**
 * De zones per aanzicht. Linkerhelft, net als al het andere.
 *
 * Let op hoe grof de vormen mogen zijn. "Borst" is letterlijk een rechthoek van de rand
 * tot voorbij de as; wat je op het scherm ziet is die rechthoek zoals de romp hem
 * uitknipt, inclusief de welving van de schouders. Dat is het hele idee: de contour zit
 * één keer goed, in het clippad, en niet twintig keer opnieuw in elke zone.
 */
export const ZONE_VORMEN: Readonly<
  Record<string, Partial<Record<Aanzicht, ZoneVorm>>>
> = {
  /* ── Gezicht ──
     De hoogtes volgen de klassieke derdedeling: haarlijn 42, wenkbrauw 92, neusbasis 146,
     kin 201. Daardoor liggen de zones op de plek waar iemand ze op zichzelf ook zoekt.

     Geen rechthoeken. Op een romp kan dat, want daar doet het clippad al het werk en zie
     je alleen de contour. Op een gezicht niet: de zones liggen midden in het vlak, dus je
     ziet hun eigen randen. Een balk over de bovenlip en een balk over de kin was precies
     wat er stond, en dat las als doorstrepen in plaats van als aanwijzen.

     En ze sluiten op elkaar aan met opzettelijke gaten ertussen. Dat gat op ooghoogte is
     de oogband, dat smalle gat in het midden is de neusrug. Zo staan het oog en de neus
     er wel, zonder dat er één getekend hoeft te worden. */
  voorhoofd: {
    // Onderrand iets lager in het midden, want daar loopt de wenkbrauwlijn ook.
    gezicht: {
      knipOp: "gezicht",
      rustvlak: true,
      paden: ["M20 38H121V82C100 82 78 76 20 74Z"],
    },
  },
  wenkbrauwen: {
    // Per wenkbrauw één vorm. Een band van oor tot oor pakt de neusrug mee.
    gezicht: {
      knipOp: "gezicht",
      rustvlak: true,
      paden: [
        "M70 89C82 82 98 81 111 85C113 92 112 100 110 106C98 100 84 101 72 108C69 102 68 95 70 89Z",
      ],
    },
  },
  wangen: {
    /* Ovaal onder de oogband; de binnenrand loopt tot aan de neuslijn en niet erover.
       De veertien pixels tussen de wenkbrauw en deze ovaal zijn de oogband: daar staat
       met opzet niets, en dat lege reepje doet het werk dat een getekend oog deed. */
    gezicht: {
      knipOp: "gezicht",
      rustvlak: true,
      paden: ["M52 146a26 25 0 1 1 52 0a26 25 0 1 1-52 0Z"],
    },
  },
  bovenlip: {
    // Tussen de neusbasis en de mond, niet de lip zelf. Sluit aan op de wang.
    gezicht: {
      knipOp: "gezicht",
      rustvlak: true,
      paden: [
        "M103 148C109 146 115 145 121 145V167C114 167 108 168 103 169C100 162 100 155 103 148Z",
      ],
    },
  },
  kin: {
    /* Loopt met de kaaklijn mee; het clippad snijdt de onderkant af. Het gat tussen deze
       zone en de bovenlip is de mond. */
    gezicht: {
      knipOp: "gezicht",
      rustvlak: true,
      paden: ["M91 178C101 176 112 176 121 176V208H91C85 199 85 187 91 178Z"],
    },
  },
  "volledig-gelaat": {
    gezicht: { knipOp: "gezicht", paden: ["M8 8h113v212H8Z"] },
  },

  // ── Bovenlichaam ──
  oksel: {
    // Ovaal, geen band: de oksel is de enige rompzone die niet tot het midden doorloopt.
    voor: {
      knipOp: "romp",
      paden: ["M58 124C88 124 104 140 104 156C104 174 88 190 58 190Z"],
    },
  },
  /* De hoogtes overlappen elkaar twee pixels. Sloten ze precies op elkaar aan, dan liet
     de randafronding een lichte haarlijn staan tussen twee zones die allebei groen zijn,
     en dan lijkt het of er een streep door de romp loopt. */
  borst: {
    voor: { knipOp: "romp", paden: ["M20 120h101v94H20Z"] },
  },
  buik: {
    voor: { knipOp: "romp", paden: ["M20 212h101v60H20Z"] },
  },
  rug: {
    achter: { knipOp: "romp", paden: ["M20 120h101v152H20Z"] },
  },
  armen: {
    voor: { knipOp: "armen", paden: ["M20 120h101v250H20Z"] },
    achter: { knipOp: "armen", paden: ["M20 120h101v250H20Z"] },
  },

  // ── Onderlichaam ──
  bikinilijn: {
    voor: { knipOp: "romp", paden: ["M20 270h101v54H20Z"] },
  },
  billen: {
    achter: { knipOp: "romp", paden: ["M20 270h101v54H20Z"] },
  },
  dijen: {
    voor: { knipOp: "benen", paden: ["M20 300h101v114H20Z"] },
    achter: { knipOp: "benen", paden: ["M20 300h101v114H20Z"] },
  },
  benen: {
    voor: { knipOp: "benen", paden: ["M20 412h101v98H20Z"] },
    achter: { knipOp: "benen", paden: ["M20 412h101v98H20Z"] },
  },
  voeten: {
    voor: { knipOp: "voeten", paden: ["M20 488h101v60H20Z"] },
    achter: { knipOp: "voeten", paden: ["M20 488h101v60H20Z"] },
  },
};

/**
 * Wat er náást de zones op het gezicht staat. Linkerhelft, gespiegeld getekend.
 *
 * DIT WAS EEN GEZICHT EN IS NU EEN KAART.
 *
 * Er stonden ogen, een neus en een mond. Eerst met pupillen en een lachende mond, daarna
 * zachter en vlakker, maar de kritiek bleef staan en terecht: hoe je een oog ook tekent,
 * een oog kijkt terug. Dan sta je naar iemand te kijken in plaats van naar je eigen
 * kaaklijn, en dat is precies het verschil tussen een tekening en een medische kaart.
 *
 * Ze zijn er alle drie uit. Wat ervoor in de plaats komt is niets: de zones staan in rust
 * al aan, en de gaten die ze tussen zich open laten liggen op ooghoogte en op de neusrug.
 * Het oog en de neus staan er dus nog steeds, alleen als vorm van de leegte. Dat is ook
 * hoe deze site het elders doet — het zonjaar, de ABCDE-lijst, de huidmatrix zijn geen van
 * drieën een plaatje van iets.
 *
 * Wat blijft: het oor en de haarlijn. Die tekenen geen trek maar de rand van het hoofd, en
 * zonder die twee weet je niet hoe groot een gezicht is en waar het vanboven ophoudt.
 */
export const GEZICHT_TREKKEN = {
  /** Het oor hoort bij het silhouet, dus dezelfde vulling. Geen zone, dus geen clippad. */
  silhouet: ["M61 105C53 103 49 111 50 121C51 132 56 141 63 141Z"],
  /**
   * Het haar. Geen trek maar een masker: het dekt het deel van de voorhoofdzone af dat
   * boven de haarlijn zou uitkomen, en houdt daarmee de bovengrens van het gezicht vast.
   *
   * Loopt tot y=42 in het midden en tot y=72 bij de slapen, want daar zit een haarlijn op
   * een hoofd. Stond hij eerder op 27, dan was er geen haar en werd het voorhoofd de hele
   * schedel: een pet in plaats van een zone.
   */
  haarlijn: [
    "M121 20C101 20 82 27 72 45C68 53 65 62 63 72C70 52 92 42 121 42Z",
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
