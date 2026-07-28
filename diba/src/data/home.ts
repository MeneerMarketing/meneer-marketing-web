import type { HomeTemplateProps } from "@/components/templates/HomeTemplate";
import {
  FIGMA_HERO_PORTRAIT,
  FIGMA_HERO_PORTRAIT_ALT,
} from "@/lib/figma-home-layout";

export const HOME_DATA: Omit<HomeTemplateProps, "homeProofItems"> = {
  hero: {
    image: {
      src: FIGMA_HERO_PORTRAIT,
      alt: FIGMA_HERO_PORTRAIT_ALT,
    },
  },
};
