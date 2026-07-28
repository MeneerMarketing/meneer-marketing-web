import HomeFaqAccordion from "@/components/ui/HomeFaqAccordion";
import { HOME_FAQ_ITEMS } from "@/data/home-faq";
import {
  homeContainer,
  homeHeaderLeftNarrow,
  homeHeaderRightWide,
  homeSection,
  homeTitleAfterLabel,
} from "@/lib/home-layout";

export default function HomeFaqSection() {
  return (
    <section className={`bg-[var(--white)] ${homeSection}`}>
      <div className={homeContainer}>
        <div className="grid gap-[var(--space-10)] md:grid-cols-12 md:gap-x-[var(--hp-header-gap)]">
          <div className={homeHeaderLeftNarrow}>
            <p className="diba-hp-label">Goed om te weten</p>
            <h2 className={`diba-hp-title ${homeTitleAfterLabel}`}>
              Eerst even dit.
            </h2>
            <p className="diba-hp-body mt-[var(--space-6)] max-w-[36ch]">
              Duidelijkheid is een vorm van zorg. Daarom beantwoorden we de
              vragen die het vaakst vooraf worden gesteld.
            </p>
          </div>
          <div className={homeHeaderRightWide}>
            <HomeFaqAccordion items={HOME_FAQ_ITEMS} />
          </div>
        </div>
      </div>
    </section>
  );
}
