import {
  FIGMA_KENNISBANK_ACNE,
  FIGMA_KENNISBANK_LASER,
  FIGMA_KENNISBANK_PIGMENT,
} from "@/data/figma-home-images";

export type KennisbankArticle = {
  readonly id: string;
  readonly tag: string;
  readonly title: string;
  readonly summary: string;
  readonly href: string;
  readonly image: { src: string; alt: string };
};

export const HOME_KENNISBANK_ARTICLES: readonly KennisbankArticle[] = [
  {
    id: "acne",
    tag: "Acne & huidzorg",
    title: "Acne zonder TikTok-hypes",
    summary: "Wat helpt je huid wel, en wat kun je beter laten?",
    href: "/huidproblemen/acne",
    image: FIGMA_KENNISBANK_ACNE,
  },
  {
    id: "pigment",
    tag: "Pigment & melasma",
    title: "Pigment: een realistisch plan",
    summary: "Waarom geduld en bescherming net zo belangrijk zijn als behandeling.",
    href: "/huidproblemen/pigmentvlekken",
    image: FIGMA_KENNISBANK_PIGMENT,
  },
  {
    id: "laser",
    tag: "Laserontharing",
    title: "Laserontharing uitgelegd",
    summary: "Veiligheid, huidtype, zones en wat je per sessie kunt verwachten.",
    href: "/laserontharing",
    image: FIGMA_KENNISBANK_LASER,
  },
] as const;
