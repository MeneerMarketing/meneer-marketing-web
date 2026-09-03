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
    subtitle:
      "Mee-eters en ontstekingen, behandeld in de volgorde die bij jouw huid past.",
    href: "/huidproblemen/acne",
    image: FIGMA_INTENT_ACNE.src,
    imageAlt: FIGMA_INTENT_ACNE.alt,
  },
  {
    id: "pigment",
    icoon: "huid-glans",
    title: "Pigment & melasma",
    subtitle:
      "Onder UV-licht wordt pigment zichtbaar dat in gewoon licht lastig te zien is.",
    href: "/huidproblemen/pigmentvlekken",
    image: FIGMA_INTENT_PIGMENT.src,
    imageAlt: FIGMA_INTENT_PIGMENT.alt,
  },
  {
    id: "laser",
    icoon: "haarzakje",
    title: "Laserontharing",
    subtitle:
      "Met alexandriet- en Nd:YAG-laser, ingesteld op jouw huidtype en haarkleur.",
    href: "/laserontharing",
    image: FIGMA_INTENT_LASER.src,
    imageAlt: FIGMA_INTENT_LASER.alt,
  },
  {
    id: "littekens",
    icoon: "huid-bultje",
    title: "Littekens & textuur",
    subtitle:
      "Microneedling en laser wekken nieuwe collageenaanmaak op in littekenweefsel.",
    href: "/huidproblemen/littekens",
    image: FIGMA_INTENT_LITTEKENS.src,
    imageAlt: FIGMA_INTENT_LITTEKENS.alt,
  },
  {
    id: "veroudering",
    icoon: "huid-strakker",
    title: "Huidveroudering",
    subtitle:
      "Collageenopbouw en huidvernieuwing bij fijne lijnen en beginnende verslapping.",
    href: "/huidproblemen/huidveroudering",
    image: FIGMA_INTENT_VEROUDERING.src,
    imageAlt: FIGMA_INTENT_VEROUDERING.alt,
  },
  {
    id: "lichaam",
    icoon: "porie-vocht",
    title: "Lichaam & huid",
    subtitle:
      "Ontharing, littekens en huidverbetering op rug, benen, oksels en bikinilijn.",
    href: "/huidproblemen/cellulitis",
    image: FIGMA_INTENT_LICHAAM.src,
    imageAlt: FIGMA_INTENT_LICHAAM.alt,
  },
] as const;
