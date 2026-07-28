import WerkwijzeStepsFlow from "@/components/ui/WerkwijzeStepsFlow";
import {
  homeContainer,
  homeHeaderLeftNarrow,
  homeHeaderRightWide,
  homeSection,
  homeTitleAfterLabel,
} from "@/lib/home-layout";

export default function HomeWerkwijzeSection() {
  return (
    <section
      id="werkwijze"
      className={`bg-[var(--white)] ${homeSection}`}
      aria-labelledby="home-werkwijze-heading"
    >
      <div className={homeContainer}>
        <div className="grid gap-[var(--space-10)] md:grid-cols-12 md:items-start md:gap-x-[var(--hp-header-gap)]">
          <div className={homeHeaderLeftNarrow}>
            <p className="diba-hp-label">Onze werkwijze</p>
            <h2
              id="home-werkwijze-heading"
              className={`diba-hp-title ${homeTitleAfterLabel}`}
            >
              Eerst begrijpen.
              <br />
              Dan behandelen.
            </h2>
          </div>

          <div className={homeHeaderRightWide}>
            <WerkwijzeStepsFlow variant="opus" />
          </div>
        </div>
      </div>
    </section>
  );
}
