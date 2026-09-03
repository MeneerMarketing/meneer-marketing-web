import type { HuidIconNaam } from "@/components/ui/HuidIcon";
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
  /** Het icoon uit de set. Zie HUIDICONEN in components/ui/HuidIcon. */
  readonly icoon: HuidIconNaam;
  readonly title: string;
  readonly subtitle: string;
  readonly href: string;
  readonly image: string;
  readonly imageAlt: string;
};

export const HOME_INTENTS: readonly HomeIntent[] = [
  {
    id: "acne",
    icoon: "verstopte-porie",
    title: "Acne & onzuiverheden",
    subtitle: "Rust in je huid, met een plan dat past.",
    href: "/huidproblemen/acne",
    image: FIGMA_INTENT_ACNE.src,
    imageAlt: FIGMA_INTENT_ACNE.alt,
  },
  {
    id: "pigment",
    icoon: "huid-glans",
    title: "Pigment & melasma",
    subtitle: "Behandel met kennis, niet met beloftes.",
    href: "/huidproblemen/pigmentvlekken",
    image: FIGMA_INTENT_PIGMENT.src,
    imageAlt: FIGMA_INTENT_PIGMENT.alt,
  },
  {
    id: "laser",
    icoon: "haarzakje",
    title: "Laserontharing",
    subtitle: "Veilig, helder en afgestemd op jouw huidtype.",
    href: "/laserontharing",
    image: FIGMA_INTENT_LASER.src,
    imageAlt: FIGMA_INTENT_LASER.alt,
  },
  {
    id: "littekens",
    icoon: "huid-bultje",
    title: "Littekens & textuur",
    subtitle: "Werk stap voor stap aan herstel en structuur.",
    href: "/huidproblemen/littekens",
    image: FIGMA_INTENT_LITTEKENS.src,
    imageAlt: FIGMA_INTENT_LITTEKENS.alt,
  },
  {
    id: "veroudering",
    icoon: "huid-strakker",
    title: "Huidveroudering",
    subtitle: "Frisser zonder dat je jezelf kwijtraakt.",
    href: "/huidproblemen/huidveroudering",
    image: FIGMA_INTENT_VEROUDERING.src,
    imageAlt: FIGMA_INTENT_VEROUDERING.alt,
  },
  {
    id: "lichaam",
    icoon: "porie-vocht",
    title: "Lichaam & huid",
    subtitle: "Ook je lichaam verdient gerichte huidzorg.",
    href: "/huidproblemen/cellulitis",
    image: FIGMA_INTENT_LICHAAM.src,
    imageAlt: FIGMA_INTENT_LICHAAM.alt,
  },
] as const;
