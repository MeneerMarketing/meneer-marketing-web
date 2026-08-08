export type NazorgMoment = {
  readonly label: string;
  readonly tekst: string;
};

export type NazorgTraject = {
  readonly slug: string;
  readonly titel: string;
  readonly intro: string;
  readonly pillarHref: string;
  readonly momenten: readonly NazorgMoment[];
};

/**
 * Nazorg-tijdlijnen top-5. Placeholders tot Rojda nazorg-feiten levert.
 */
export const NAZORG_TRAJECTEN: readonly NazorgTraject[] = [
  {
    slug: "acne",
    titel: "Nazorg na *acne*behandeling",
    intro: "[COPY-NODIG: nazorg-intro acne] [MEDISCHE-CHECK-ROJDA]",
    pillarHref: "/huidproblemen/acne",
    momenten: [
      { label: "Direct na", tekst: "[COPY-NODIG: nazorg direct na acne]" },
      { label: "Eerste week", tekst: "[COPY-NODIG: nazorg week 1 acne]" },
      { label: "Eerste maand", tekst: "[COPY-NODIG: nazorg maand 1 acne]" },
      { label: "Thuisfase", tekst: "[COPY-NODIG: nazorg thuisfase acne]" },
    ],
  },
  {
    slug: "pigmentvlekken",
    titel: "Nazorg na *pigment*behandeling",
    intro: "[COPY-NODIG: nazorg-intro pigment] [MEDISCHE-CHECK-ROJDA]",
    pillarHref: "/huidproblemen/pigmentvlekken",
    momenten: [
      { label: "Direct na", tekst: "[COPY-NODIG: nazorg direct na pigment]" },
      { label: "Eerste week", tekst: "[COPY-NODIG: nazorg week 1 pigment]" },
      { label: "Eerste maand", tekst: "[COPY-NODIG: nazorg maand 1 pigment]" },
      { label: "Zonbescherming", tekst: "[COPY-NODIG: nazorg zon pigment]" },
    ],
  },
  {
    slug: "rosacea",
    titel: "Nazorg bij *roodheid*",
    intro: "[COPY-NODIG: nazorg-intro rosacea] [MEDISCHE-CHECK-ROJDA]",
    pillarHref: "/huidproblemen/rosacea",
    momenten: [
      { label: "Direct na", tekst: "[COPY-NODIG: nazorg direct na rosacea]" },
      { label: "Eerste week", tekst: "[COPY-NODIG: nazorg week 1 rosacea]" },
      { label: "Triggers", tekst: "[COPY-NODIG: nazorg triggers rosacea]" },
      { label: "Onderhoud", tekst: "[COPY-NODIG: nazorg onderhoud rosacea]" },
    ],
  },
  {
    slug: "huidveroudering",
    titel: "Nazorg bij *anti-aging*",
    intro: "[COPY-NODIG: nazorg-intro huidveroudering] [MEDISCHE-CHECK-ROJDA]",
    pillarHref: "/huidproblemen/huidveroudering",
    momenten: [
      {
        label: "Direct na",
        tekst: "[COPY-NODIG: nazorg direct na anti-aging]",
      },
      { label: "Eerste week", tekst: "[COPY-NODIG: nazorg week 1 anti-aging]" },
      {
        label: "Eerste maand",
        tekst: "[COPY-NODIG: nazorg maand 1 anti-aging]",
      },
      {
        label: "Thuisfase",
        tekst: "[COPY-NODIG: nazorg thuisfase anti-aging]",
      },
    ],
  },
  {
    slug: "laserontharing",
    titel: "Nazorg na *laser*ontharing",
    intro: "[COPY-NODIG: nazorg-intro laser] [MEDISCHE-CHECK-ROJDA]",
    pillarHref: "/laserontharing",
    momenten: [
      { label: "Direct na", tekst: "[COPY-NODIG: nazorg direct na laser]" },
      { label: "Eerste week", tekst: "[COPY-NODIG: nazorg week 1 laser]" },
      {
        label: "Tussen sessies",
        tekst: "[COPY-NODIG: nazorg tussen sessies laser]",
      },
      { label: "Zon en zonnebank", tekst: "[COPY-NODIG: nazorg zon laser]" },
    ],
  },
] as const;

export function nazorgBySlug(slug: string): NazorgTraject | undefined {
  return NAZORG_TRAJECTEN.find((n) => n.slug === slug);
}
