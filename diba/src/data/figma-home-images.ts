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

/** Hero — laserbehandeling, precisie. Past bij "Geen gokwerk. Wel jouw huid." */
export const FIGMA_HOME_PORTRAIT = {
  src: shoot("hero-behandeling"),
  alt: "Diba-behandelaar voert een laserbehandeling uit bij een cliënt met beschermbril",
} as const satisfies Beeld;

/** Behandelkamer, liggend formaat. */
export const FIGMA_HOME_PORTRAIT_WIDE = {
  src: shoot("behandelkamer"),
  alt: "Behandelaar aan het werk in een behandelkamer van Diba Clinics",
} as const satisfies Beeld;

/** In de kliniek — twee behandelaars tussen twee afspraken door. */
export const FIGMA_HOME_CLINIC = {
  src: shoot("kliniek-team"),
  alt: "Twee behandelaars van Diba Clinics in gesprek in de kliniek in Hillegersberg",
} as const satisfies Beeld;

/** Eerlijk advies — consultmoment met de cliënt. */
export const FIGMA_EERLIJK_ADVIES = {
  src: shoot("eerlijk-advies-consult"),
  alt: "Behandelaar bespreekt een behandelplan met een cliënt in de kliniek",
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
