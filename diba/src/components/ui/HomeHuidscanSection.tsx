import HuidscanVisualShell from "@/components/ui/HuidscanVisualShell";
import Link from "next/link";
import {
  homeContainer,
  homeTitleAfterLabel,
} from "@/lib/home-layout";

export default function HomeHuidscanSection() {
  return (
    <section id="huidscan" className="bg-[#286943] px-5 py-20 text-white sm:px-9 lg:px-[7.5vw] lg:py-28">
      <div
        className={`${homeContainer} grid items-center gap-[var(--space-10)] md:grid-cols-12 md:gap-x-[var(--hp-header-gap)]`}
      >
        <div className="md:col-span-5">
          <p className="diba-hp-label text-[var(--diba-mint-bar)]">
            De Diba huidscan
          </p>
          <h2
            id="home-huidscan-heading"
            className={`diba-hp-title-lg ${homeTitleAfterLabel}`}
          >
            <span className="text-[var(--white)]">Wij gokken niet.</span>
            <br />
            <span className="text-[var(--diba-mint-bar)]">Wij meten.</span>
          </h2>
          <p className="diba-hp-body mt-[var(--space-6)] max-w-[44ch] text-[var(--white)]/90">
            Met de Eve-M huidanalyse maken we een objectieve nulmeting. Zo zien
            we wat jouw huid nodig heeft en volgen we jouw voortgang in beeld.
          </p>
          <div className="mt-[var(--space-8)]">
            <Link
              href="/behandelingen/huidanalyse"
              className="diba-hp-pill-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--white)]"
            >
              Hoe werkt de huidscan?
              <span aria-hidden="true" className="text-[13px] leading-none">
                ›
              </span>
            </Link>
          </div>
        </div>

        <div className="flex justify-center md:col-span-7 md:justify-end">
          <HuidscanVisualShell className="md:ml-auto" />
        </div>
      </div>
    </section>
  );
}
