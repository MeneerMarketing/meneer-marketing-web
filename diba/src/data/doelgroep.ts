export type Doelgroep = {
  readonly slug: string;
  readonly titel: string;
  readonly meta: string;
  readonly korteOmschrijving: string;
};

export const DOELGROEPEN: readonly Doelgroep[] = [
  {
    slug: "jongeren",
    titel: "Huidzorg voor *jongeren*",
    meta: "Jongeren",
    korteOmschrijving: "[COPY-NODIG: jongeren teaser]",
  },
  {
    slug: "mannen",
    titel: "Huidzorg voor *mannen*",
    meta: "Mannen",
    korteOmschrijving: "[COPY-NODIG: mannen teaser]",
  },
  {
    slug: "huid-van-kleur",
    titel: "Huid van *kleur*",
    meta: "Huid van kleur",
    korteOmschrijving:
      "Fitzpatrick I tot VI, allemaal gelijkwaardig. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    slug: "bruiden",
    titel: "Huid voor je *bruiloft*",
    meta: "Bruiden",
    korteOmschrijving: "[COPY-NODIG: bruiden teaser]",
  },
] as const;

export function doelgroepBySlug(slug: string): Doelgroep | undefined {
  return DOELGROEPEN.find((d) => d.slug === slug);
}

export type PillarGroup = {
  readonly label: string;
  readonly slugs: readonly string[];
};

/** Hub-groepering huidproblemen — navigatie, geen duplicate content. */
export const PILLAR_GROUPS: readonly PillarGroup[] = [
  {
    label: "Onzuiverheden en poriën",
    slugs: ["acne", "porien", "huiduitslag"],
  },
  {
    label: "Pigment en kleur",
    slugs: ["pigmentvlekken", "melasma", "huidverkleuring", "donkere-kringen"],
  },
  {
    label: "Roodheid en gevoeligheid",
    slugs: ["rosacea", "gevoelige-huid", "eczeem"],
  },
  {
    label: "Veroudering en littekens",
    slugs: ["huidveroudering", "littekens", "striae", "keloiden"],
  },
  {
    label: "Overig",
    slugs: [
      "droge-huid",
      "psoriasis",
      "huidkanker-naevi",
      "cellulitis",
      "symptoomzoeker",
    ],
  },
] as const;
