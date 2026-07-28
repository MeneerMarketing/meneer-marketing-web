import Image from "next/image";
import Link from "next/link";
import { DIBA_EERLIJK_ADVIES } from "@/data/figma-home-images";
import {
  homeCardRadius,
  homeContainer,
  homeSection,
  homeTitleAfterLabel,
} from "@/lib/home-layout";

export default function HomeEerlijkAdviesSection() {
  return (
    <section
      className={`bg-[var(--diba-section-soft)] ${homeSection}`}
      aria-labelledby="home-eerlijk-advies-heading"
    >
      <div className={homeContainer}>
        <div
          className={`overflow-hidden ${homeCardRadius} bg-[var(--white)] p-[var(--space-6)] md:p-[var(--space-10)] lg:p-[var(--space-12)]`}
        >
          <div className="grid items-center gap-[var(--space-8)] md:grid-cols-12 md:gap-x-[var(--hp-header-gap)]">
            <div className="md:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
                <Image
                  src={DIBA_EERLIJK_ADVIES.src}
                  alt={DIBA_EERLIJK_ADVIES.alt}
                  fill
                  sizes="(min-width: 768px) 420px, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="md:col-span-7">
              <p className="diba-hp-label">Eerlijk advies</p>
              <h2
                id="home-eerlijk-advies-heading"
                className={`diba-hp-title-serif ${homeTitleAfterLabel}`}
              >
                Soms is niet behandelen
                <br />
                óók het beste advies.
              </h2>
              <p className="diba-hp-body mt-[var(--space-6)] max-w-[52ch]">
                Wij behandelen niet om te behandelen. We adviseren wat past bij
                jouw huid, jouw doel en jouw veiligheid. Ook wanneer dat
                betekent dat je beter eerst iets anders kunt doen.
              </p>
              <div className="mt-[var(--space-8)]">
                <Link
                  href="/intake?topic=second-opinion"
                  className="diba-hp-ghost-btn focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--diba-green-700)]"
                >
                  Vraag een second opinion
                  <span aria-hidden="true" className="text-[13px] leading-none">
                    →
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
