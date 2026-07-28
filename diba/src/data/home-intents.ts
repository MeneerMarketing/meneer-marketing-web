import {
  FIGMA_INTENT_ACNE,
  FIGMA_INTENT_LASER,
  FIGMA_INTENT_LICHAAM,
  FIGMA_INTENT_LITTEKENS,
  FIGMA_INTENT_PIGMENT,
  FIGMA_INTENT_VEROUDERING,
} from "@/data/figma-home-images";

export type HomeIntent = {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly href: string;
  readonly image: string;
  readonly imageAlt: string;
};

export const HOME_INTENTS: readonly HomeIntent[] = [
  {
    id: "acne",
    title: "Acne & onzuiverheden",
    subtitle: "Rust in je huid, met een plan dat past.",
    href: "/huidproblemen/acne",
    image: FIGMA_INTENT_ACNE.src,
    imageAlt: FIGMA_INTENT_ACNE.alt,
  },
  {
    id: "pigment",
    title: "Pigment & melasma",
    subtitle: "Behandel met kennis, niet met beloftes.",
    href: "/huidproblemen/pigmentvlekken",
    image: FIGMA_INTENT_PIGMENT.src,
    imageAlt: FIGMA_INTENT_PIGMENT.alt,
  },
  {
    id: "laser",
    title: "Laserontharing",
    subtitle: "Veilig, helder en afgestemd op jouw huidtype.",
    href: "/laserontharing",
    image: FIGMA_INTENT_LASER.src,
    imageAlt: FIGMA_INTENT_LASER.alt,
  },
  {
    id: "littekens",
    title: "Littekens & textuur",
    subtitle: "Werk stap voor stap aan herstel en structuur.",
    href: "/huidproblemen/littekens",
    image: FIGMA_INTENT_LITTEKENS.src,
    imageAlt: FIGMA_INTENT_LITTEKENS.alt,
  },
  {
    id: "veroudering",
    title: "Huidveroudering",
    subtitle: "Frisser zonder dat je jezelf kwijtraakt.",
    href: "/huidproblemen/huidveroudering",
    image: FIGMA_INTENT_VEROUDERING.src,
    imageAlt: FIGMA_INTENT_VEROUDERING.alt,
  },
  {
    id: "lichaam",
    title: "Lichaam & huid",
    subtitle: "Ook je lichaam verdient gerichte huidzorg.",
    href: "/huidproblemen/cellulitis",
    image: FIGMA_INTENT_LICHAAM.src,
    imageAlt: FIGMA_INTENT_LICHAAM.alt,
  },
] as const;
