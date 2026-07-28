/**
 * Figma homepage beelden — Unsplash tijdens designfase.
 * Vervang door Aleks-shotlist zodra echte beelden beschikbaar zijn.
 */

const unsplashParams = "crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80";

function unsplash(id: string, w: number, h: number) {
  return `https://images.unsplash.com/${id}?${unsplashParams}&w=${w}&h=${h}`;
}

export const FIGMA_HOME_PORTRAIT = {
  src: unsplash("photo-1646488324517-b3e298dd82f1", 1200, 1500),
  alt: "Vrouw met natuurlijke huid in warm groen licht, Diba Clinics sfeerbeeld",
} as const;

export const FIGMA_HOME_PORTRAIT_WIDE = {
  src: unsplash("photo-1646488324517-b3e298dd82f1", 1400, 900),
  alt: "Natuurlijke huid en vertrouwen, warm groen beeld",
} as const;

export const FIGMA_HOME_CLINIC = {
  src: unsplash("photo-1540555700478-4be289fbecef", 1200, 800),
  alt: "Rustige wellnessruimte met warm licht en groene sfeer",
} as const;

/** Eerlijk advies — consultmoment, Unsplash sfeerbeeld. */
export const FIGMA_EERLIJK_ADVIES = {
  src: unsplash("photo-1576091160399-112ba8d25d1d", 1200, 900),
  alt: "Rustig consultmoment over huidzorg in warme, groene sfeer",
} as const;

/** Traject / testimonial — portret naast Mijn Diba-kaart. */
export const FIGMA_TRAJECT_TESTIMONIAL = {
  src: unsplash("photo-1529626455594-4ff0802cfb7e", 1200, 1500),
  alt: "Natuurlijk portret, vertrouwen en rust in huidzorg",
  width: 1200,
  height: 1500,
} as const;

/** Kennisbank + intent-beelden */
export const FIGMA_KENNISBANK_ACNE = {
  src: unsplash("photo-1556228720-195a672e8a03", 900, 675),
  alt: "Huidverzorging en rustige routine bij acne en onzuiverheden",
} as const;

export const FIGMA_KENNISBANK_PIGMENT = {
  src: unsplash("photo-1576091160399-112ba8d25d1d", 900, 675),
  alt: "Professionele huidzorg in een rustige klinieksetting",
} as const;

export const FIGMA_KENNISBANK_LASER = {
  src: unsplash("photo-1515377905703-c4788e51af15", 900, 675),
  alt: "Laserbehandeling in een rustige klinieksetting",
} as const;

export const FIGMA_INTENT_ACNE = {
  src: unsplash("photo-1556228720-195a672e8a03", 800, 600),
  alt: "Huidverzorging bij acne en onzuiverheden",
} as const;

export const FIGMA_INTENT_PIGMENT = {
  src: unsplash("photo-1576091160399-112ba8d25d1d", 800, 600),
  alt: "Professionele behandeling voor pigment en melasma",
} as const;

export const FIGMA_INTENT_LASER = {
  src: unsplash("photo-1515377905703-c4788e51af15", 800, 600),
  alt: "Laserontharing in een klinische setting",
} as const;

export const FIGMA_INTENT_LITTEKENS = {
  src: unsplash("photo-1522337360788-8b13dee7a37e", 800, 600),
  alt: "Behandeling gericht op littekens en huidtextuur",
} as const;

export const FIGMA_INTENT_VEROUDERING = {
  src: unsplash("photo-1544005313-94ddf0286df2", 800, 600),
  alt: "Huidverzorging voor een frissere, rustige huid",
} as const;

export const FIGMA_INTENT_LICHAAM = {
  src: unsplash("photo-1544161515-4ab6ce6db874", 800, 600),
  alt: "Lichaamsbehandeling en huidverzorging",
} as const;

/** @deprecated Gebruik FIGMA_TRAJECT_TESTIMONIAL — alias voor backwards compat. */
export const DIBA_EVE_M_HUIDSCAN = FIGMA_TRAJECT_TESTIMONIAL;

/** @deprecated Gebruik FIGMA_EERLIJK_ADVIES */
export const DIBA_EERLIJK_ADVIES = FIGMA_EERLIJK_ADVIES;
