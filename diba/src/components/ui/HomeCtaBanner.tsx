import Link from "next/link";
import {
  homeCardRadius,
  homeContainer,
  homeHeaderLeft,
  homeTitleAfterLabel,
} from "@/lib/home-layout";

function LeafDecor() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute -right-6 bottom-0 h-[200px] w-[200px] opacity-[0.22] md:-right-2 md:bottom-[-20px] md:h-[300px] md:w-[300px] lg:h-[340px] lg:w-[340px]"
      viewBox="0 0 200 200"
      fill="none"
    >
      <path
        d="M100 12 C35 55 8 118 55 178 C78 145 118 98 168 72 C135 38 118 18 100 12Z"
        fill="var(--diba-mint-bar)"
      />
      <path
        d="M100 38 C68 72 50 115 72 158"
        stroke="var(--white)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

export default function HomeCtaBanner() {
  return (
    <section className="bg-[var(--white)] pb-[var(--space-16)] pt-0 md:pb-[var(--space-20)]">
      <div className={homeContainer}>
        <div
          className={`relative overflow-hidden ${homeCardRadius} bg-[var(--diba-green-900)] px-[var(--space-6)] py-[var(--space-12)] md:px-[var(--space-12)] md:py-[var(--space-16)]`}
        >
          <LeafDecor />
          <div className="relative grid gap-[var(--space-8)] md:grid-cols-12 md:items-end md:gap-x-[var(--hp-header-gap)]">
            <div className={homeHeaderLeft}>
              <p className="diba-hp-label text-[var(--diba-mint-bar)]">
                Jouw eerste afspraak
              </p>
              <h2
                className={`diba-hp-title-lg ${homeTitleAfterLabel} text-[var(--white)]`}
              >
                Kom zoals je bent.
                <br />
                Wij kijken met je mee.
              </h2>
            </div>
            <div className="md:col-span-7 md:max-w-[480px] md:justify-self-end lg:max-w-[520px]">
              <p className="diba-hp-body text-[var(--white)]/90">
                Plan een intake in onze kliniek in Hillegersberg. We nemen de tijd
                voor jouw vragen, huidanalyse en een duidelijk behandelvoorstel.
              </p>
              <div className="mt-[var(--space-8)]">
                <Link
                  href="/intake"
                  className="diba-hp-pill-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--white)]"
                >
                  Maak een afspraak
                  <span aria-hidden="true" className="text-[13px] leading-none">
                    ↗
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
