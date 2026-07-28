import Image from "next/image";
import {
  HOME_TRAJECT_METRICS,
  HOME_TRAJECT_QUOTE,
} from "@/data/home-traject";
import { DIBA_EVE_M_HUIDSCAN } from "@/data/figma-home-images";
import {
  homeCardGrid,
  homeCardRadius,
  homeContainer,
  homeHeaderGrid,
  homeHeaderLeft,
  homeHeaderRight,
  homeSection,
  homeTitleAfterLabel,
} from "@/lib/home-layout";

function SparkleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="currentColor"
      className="text-[var(--diba-green-900)]"
    >
      <path d="M9 1.5 10.2 7.8 16.5 9 10.2 10.2 9 16.5 7.8 10.2 1.5 9 7.8 7.8 9 1.5Z" />
    </svg>
  );
}

function TrajectMetricCard({
  label,
  value,
  progress,
}: {
  label: string;
  value: string;
  progress: number;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-[var(--radius-md)] bg-[var(--white)] p-[var(--space-4)]">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--diba-green-500)] md:text-[10px]">
        {label}
      </p>
      <p className="mt-[var(--space-2)] diba-hp-step-title leading-none">
        {value}
      </p>
      <div
        className="mt-[var(--space-4)] h-[3px] overflow-hidden rounded-full bg-[var(--diba-green-200)]"
        role="presentation"
      >
        <div
          className="h-full rounded-full bg-[var(--diba-green-900)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function HomeTrajectSection() {
  return (
    <section
      className={`relative overflow-hidden bg-[var(--white)] ${homeSection}`}
      aria-labelledby="home-traject-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[120px] top-[var(--space-12)] h-[280px] w-[280px] rounded-full border border-[var(--diba-green-200)]/70 md:-left-[80px] md:top-[var(--space-16)] md:h-[360px] md:w-[360px] lg:h-[420px] lg:w-[420px]"
      />

      <div className={`relative ${homeContainer}`}>
        <div className={homeHeaderGrid}>
          <div className={homeHeaderLeft}>
            <p className="diba-hp-label">Niet zomaar een afspraak</p>
            <h2
              id="home-traject-heading"
              className={`diba-hp-title ${homeTitleAfterLabel}`}
            >
              Een traject dat met je meebeweegt.
            </h2>
          </div>
          <p className={`diba-hp-body ${homeHeaderRight}`}>
            Een mooie huid is zelden één moment. Daarom bekijken we samen wat er
            speelt, wat haalbaar is en hoe we jouw voortgang kunnen volgen,
            zonder dat je vastzit aan een pakket.
          </p>
        </div>

        <div className={`${homeCardGrid} md:grid-cols-2`}>
          <div
            className={`flex min-h-[300px] flex-col ${homeCardRadius} bg-[var(--diba-mint-bar)] p-[var(--space-5)] md:min-h-[340px] md:p-[var(--space-6)] lg:p-[var(--space-8)]`}
          >
            <div className="flex items-start justify-between gap-[var(--space-4)]">
              <span className="inline-flex rounded-full bg-[var(--white)] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--diba-green-900)]">
                Mijn Diba
              </span>
              <SparkleIcon />
            </div>

            <h3 className="diba-hp-card-title mt-[var(--space-8)] max-w-[14ch] md:mt-[var(--space-10)]">
              Zie wat je huid je vertelt.
            </h3>

            <div className="mt-auto flex gap-[var(--space-3)] pt-[var(--space-8)]">
              {HOME_TRAJECT_METRICS.map((metric) => (
                <TrajectMetricCard
                  key={metric.id}
                  label={metric.label}
                  value={metric.value}
                  progress={metric.progress}
                />
              ))}
            </div>
          </div>

          <figure
            className={`relative min-h-[300px] overflow-hidden ${homeCardRadius} md:min-h-[340px]`}
          >
            <Image
              src={DIBA_EVE_M_HUIDSCAN.src}
              alt={DIBA_EVE_M_HUIDSCAN.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[center_38%]"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[var(--diba-green-900)]/85 via-[var(--diba-green-900)]/35 to-transparent"
              aria-hidden="true"
            />
            <blockquote className="absolute inset-x-0 bottom-0 p-[var(--space-5)] md:p-[var(--space-6)] lg:p-[var(--space-8)]">
              <p className="diba-hp-quote">
                <span aria-hidden="true" className="text-[var(--white)]/60">
                  &ldquo;
                </span>
                {HOME_TRAJECT_QUOTE}
                <span aria-hidden="true" className="text-[var(--white)]/60">
                  &rdquo;
                </span>
              </p>
            </blockquote>
          </figure>
        </div>
      </div>
    </section>
  );
}
