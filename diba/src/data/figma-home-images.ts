/**
 * Homepage-beelden — eigen Diba-fotografie.
 *
 * Kwamen tot 28-07-2026 van Unsplash. Dat was op drie manieren fout: stockfoto's zijn
 * verboden (DIBA-RULES §2), het waren externe requests bij elke bezoeker (§14), en het
 * beeld toonde spa-sfeer in plaats van een kliniek.
 *
 * Nu bijgesneden uit de eigen shoots. Ze volgen de beeldsignatuur uit Addendum A10:
 * handen aan het werk, warm daglicht, echte behandelaars — geen apparaten-glamour.
 *
 * OPEN PUNT — toestemming. Op een deel van deze foto's zijn cliënten herkenbaar in
 * beeld. Voor publicatie is per persoon een vastgelegde toestemming nodig (AVG). Zolang
 * die er niet is, blijven dit demobeelden voor de testversie. Bij twijfel: kies een
 * variant waarop niemand herkenbaar is — `HANDEN_DETAIL` is daar de veilige val voor.
 */

type Beeld = { readonly src: string; readonly alt: string };

const shoot = (naam: string) => `/images/shoot/${naam}.jpg`;

/**
 * Hero van de homepage: een IPL-behandeling in uitvoering.
 *
 * Hier stond `hero-behandeling`. Die opname is niet fout, maar deze is beter voor de plek:
 * je ziet het handstuk op de huid, de beschermbril en de behandelaar die kijkt waar ze
 * mikt. Dat is wat "Geen gokwerk. Wel jouw huid." bedoelt, en het is een van de weinige
 * beelden waarop het werk zelf herkenbaar is in plaats van de sfeer eromheen.
 *
 * Camera-origineel 4S3A9362 uit de eigen shoot.
 */
export const FIGMA_HOME_PORTRAIT = {
  src: shoot("hero-ipl-behandeling"),
  alt: "Behandelaar van Diba Clinics voert een IPL-behandeling uit bij een cliënt met beschermbril",
} as const satisfies Beeld;

/**
 * De hero van de homepage: de huidscan die samen bekeken wordt.
 *
 * WAAROM DEZE FOTO EN NIET DE BEHANDELKAMER.
 *
 * Hier stond `behandelkamer`, en dat was een sfeerbeeld: iemand aan het werk in een
 * kamer. Deze foto toont wat deze kliniek van andere onderscheidt, namelijk dat je
 * hetzelfde scherm ziet als de behandelaar. Dat is precies wat de kop eronder belooft en
 * wat op de intakepagina staat, dus het beeld zegt nu hetzelfde als de tekst.
 *
 * WAAROM 3000 PIXELS BREED.
 *
 * Dit beeld vult de volle breedte én hoogte van het eerste scherm. Het vorige bestand was
 * 1400x900 op 108 kB en werd dus fors uitgerekt; op een gewoon 1440-scherm met dubbele
 * pixeldichtheid is er bijna 2900 pixels nodig. Vandaar dat het zacht oogde. Dit is de
 * bron waar Next zelf uit schaalt, niet wat er verstuurd wordt.
 *
 * De cliënt in de kamer is van achteren gefotografeerd en dus niet herkenbaar. Op het
 * scherm van de tablet staat wél een gezicht: dat is een scan en daar hoort toestemming
 * bij, net als bij de andere beelden hieronder.
 */
export const FIGMA_HOME_PORTRAIT_WIDE = {
  src: shoot("hero-huidscan"),
  alt: "Behandelaar van Diba Clinics bespreekt de uitkomst van een huidscan met een cliënt",
} as const satisfies Beeld;

/** In de kliniek — twee behandelaars tussen twee afspraken door. */
export const FIGMA_HOME_CLINIC = {
  src: shoot("kliniek-team"),
  alt: "Twee behandelaars van Diba Clinics in gesprek in de kliniek in Rotterdam",
} as const satisfies Beeld;

/**
 * Eerlijk advies: het moment waarop iets uitgelegd wordt.
 *
 * Hier stond `eerlijk-advies-consult`, en daarop is een XL Hair-behandeling te zien met de
 * verpakking in beeld. Dat is een product tonen, niet advies geven, en het staat naast een
 * kop die precies het tegenovergestelde belooft. Wie de foto herkent leest de sectie als
 * verkoop.
 *
 * Nu een opname waarop een behandelaar met een doorsnedemodel van de huid uitlegt wat er
 * waar zit, met de client ernaast. Dat is letterlijk wat de drie punten eronder claimen:
 * eerst begrijpen waar het over gaat, dan pas kiezen. Camera-origineel _DSC4085.
 */
export const FIGMA_EERLIJK_ADVIES = {
  src: shoot("uitleg-huidlagen"),
  alt: "Behandelaar legt aan de hand van een doorsnedemodel van de huid uit wat er waar zit",
} as const satisfies Beeld;

/**
 * Traject — detail van handen aan het werk, niemand herkenbaar in beeld.
 * Bewust géén portret: de quote ernaast is nog conceptcopy, en een echt gezicht naast
 * een niet-uitgesproken citaat wekt een indruk die we niet kunnen waarmaken.
 */
export const FIGMA_TRAJECT_TESTIMONIAL = {
  src: shoot("handen-detail"),
  alt: "Handen met handschoenen voeren een precieze huidbehandeling uit",
  width: 1200,
  height: 1500,
} as const;

/** Kennisbank */
export const FIGMA_KENNISBANK_ACNE = {
  src: shoot("kb-acne"),
  alt: "Huid met acne wordt van dichtbij beoordeeld door een behandelaar",
} as const satisfies Beeld;

export const FIGMA_KENNISBANK_PIGMENT = {
  src: shoot("kb-pigment"),
  alt: "Behandeling gericht op pigment in een klinische setting",
} as const satisfies Beeld;

export const FIGMA_KENNISBANK_LASER = {
  src: shoot("kb-laser"),
  alt: "Laserbehandeling met beschermbril bij Diba Clinics",
} as const satisfies Beeld;

/** Intent-kaarten */
export const FIGMA_INTENT_ACNE = {
  src: shoot("intent-acne"),
  alt: "Behandeling van acne en onzuiverheden",
} as const satisfies Beeld;

export const FIGMA_INTENT_PIGMENT = {
  src: shoot("intent-pigment"),
  alt: "Behandelaar werkt aan pigment en melasma",
} as const satisfies Beeld;

export const FIGMA_INTENT_LASER = {
  src: shoot("intent-laser"),
  alt: "Laserontharing met beschermbril en huidkoeling",
} as const satisfies Beeld;

export const FIGMA_INTENT_LITTEKENS = {
  src: shoot("intent-littekens"),
  alt: "Behandeling gericht op littekens en huidtextuur",
} as const satisfies Beeld;

export const FIGMA_INTENT_VEROUDERING = {
  src: shoot("intent-veroudering"),
  alt: "Huidverstevigende behandeling in de kliniek",
} as const satisfies Beeld;

export const FIGMA_INTENT_LICHAAM = {
  src: shoot("intent-lichaam"),
  alt: "Lichaamsbehandeling met een huidapparaat",
} as const satisfies Beeld;

/** @deprecated Gebruik FIGMA_TRAJECT_TESTIMONIAL — alias voor backwards compat. */
export const DIBA_EVE_M_HUIDSCAN = FIGMA_TRAJECT_TESTIMONIAL;

/** @deprecated Gebruik FIGMA_EERLIJK_ADVIES */
export const DIBA_EERLIJK_ADVIES = FIGMA_EERLIJK_ADVIES;
