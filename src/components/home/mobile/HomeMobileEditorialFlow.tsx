import { HomeMobileAboutMeneer } from "@/components/home/mobile/HomeMobileAboutMeneer";
import { HomeMobileBillboard } from "@/components/home/mobile/HomeMobileBillboard";
import { HomeMobileBouwenSection } from "@/components/home/mobile/HomeMobileBouwenSection";
import { HomeMobileChapter } from "@/components/home/mobile/HomeMobileChapter";
import { HomeMobileCta } from "@/components/home/mobile/HomeMobileCta";
import { HomeMobileFunFacts } from "@/components/home/mobile/HomeMobileFunFacts";
import { HomeMobileMythSwipe } from "@/components/home/mobile/HomeMobileMythSwipe";
import {
  HOME_MOBILE_BILLBOARD_AI,
  HOME_MOBILE_BILLBOARD_SEO,
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
      <HomeMobileBillboard data={HOME_MOBILE_BILLBOARD_AI} />
      <HomeMobileChapter chapter={HOME_MOBILE_CHAPTER_VINDBAARHEID} />
      <HomeMobileBillboard data={HOME_MOBILE_BILLBOARD_SEO} />
      <HomeMobileMythSwipe />
      <HomeMobileChapter chapter={HOME_MOBILE_CHAPTER_CAMPAGNES} />
      <HomeMobileAboutMeneer />
      <HomeMobileFunFacts />
      <HomeMobileCta />
    </>
  );
}
