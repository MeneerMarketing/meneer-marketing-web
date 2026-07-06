import { HomeMobileAiBillboard } from "@/components/home/mobile/HomeMobileAiBillboard";
import { HomeMobileAboutMeneer } from "@/components/home/mobile/HomeMobileAboutMeneer";
import { HomeMobileBouwenSection } from "@/components/home/mobile/HomeMobileBouwenSection";
import { HomeMobileChapter } from "@/components/home/mobile/HomeMobileChapter";
import { HomeMobileCta } from "@/components/home/mobile/HomeMobileCta";
import { HomeMobileFunFacts } from "@/components/home/mobile/HomeMobileFunFacts";
import { HomeMobileMythSwipe } from "@/components/home/mobile/HomeMobileMythSwipe";
import {
  HOME_MOBILE_CHAPTER_CAMPAGNES,
  HOME_MOBILE_CHAPTER_VINDBAARHEID,
} from "@/data/home-mobile-editorial";

/**
 * Mobiele homepage Concept 4: billboards + editorial hoofdstukken.
 * Geen dienstencatalogus, geen case-carousel.
 */
export function HomeMobileEditorialFlow() {
  return (
    <>
      <HomeMobileBouwenSection />
      <HomeMobileAboutMeneer />
      <HomeMobileAiBillboard />
      <HomeMobileChapter chapter={HOME_MOBILE_CHAPTER_VINDBAARHEID} />
      <HomeMobileChapter chapter={HOME_MOBILE_CHAPTER_CAMPAGNES} />
      <HomeMobileMythSwipe />
      <HomeMobileFunFacts />
      <HomeMobileCta />
    </>
  );
}
