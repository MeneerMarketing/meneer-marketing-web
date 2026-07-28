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

function CircleIcon({ variant }: { variant: "plus" | "minus" }) {
  const isPlus = variant === "plus";
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        isPlus
          ? "bg-[var(--diba-mint-bar)] text-[var(--diba-green-700)]"
          : "bg-[var(--white)] text-[var(--diba-green-900)]"
      }`}
      aria-hidden="true"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        {isPlus ? <path d="M6 2v8M2 6h8" /> : <path d="M2 6h8" />}
      </svg>
    </span>
  );
}

function KliniekVisualCard() {
  return (
    <div
      className={`relative flex min-h-[240px] flex-col justify-between overflow-hidden ${homeCardRadius} bg-[var(--diba-card-olive)] p-[var(--space-5)] md:min-h-[260px] md:p-[var(--space-6)]`}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 400 320"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <circle cx="72" cy="200" r="88" fill="var(--diba-mint-bar)" opacity="0.55" />
        <rect x="210" y="48" width="56" height="200" rx="28" fill="var(--white)" opacity="0.92" />
        <rect x="278" y="72" width="48" height="176" rx="24" fill="var(--diba-green-900)" opacity="0.35" />
      </svg>

      <span className="relative z-[1] inline-flex w-fit rounded-full bg-[var(--white)] px-[var(--space-4)] py-[var(--space-2)] text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--diba-green-900)]">
        Diba, Rotterdam
      </span>

      <p className="relative z-[1] diba-hp-kliniek-quote">
        Warm in gevoel. Scherp in kennis.
      </p>
    </div>
  );
}

export default function HomeKliniekSection() {
  return (
    <section
      className={`bg-[var(--diba-section-mint)] ${homeSection}`}
      aria-labelledby="home-kliniek-heading"
    >
      <div className={homeContainer}>
        <div className={homeHeaderGrid}>
          <div className={homeHeaderLeft}>
            <p className="diba-hp-label">In de kliniek</p>
            <h2
              id="home-kliniek-heading"
              className={`diba-hp-title-serif ${homeTitleAfterLabel}`}
            >
              Een groene pauze in je dag.
            </h2>
          </div>
          <p className={`diba-hp-body max-w-[36ch] ${homeHeaderRight}`}>
            Van de eerste kop thee tot je nazorg: we hebben aandacht voor de
            hele ervaring.
          </p>
        </div>

        <div className={`${homeCardGrid} md:grid-cols-3`}>
          <article
            className={`flex min-h-[240px] flex-col ${homeCardRadius} bg-[var(--diba-card-sage)] p-[var(--space-5)] md:min-h-[260px] md:p-[var(--space-6)]`}
          >
            <CircleIcon variant="minus" />
            <h3 className="diba-hp-card-title mt-[var(--space-6)]">
              Geen haast.
            </h3>
            <p className="diba-hp-card-body mt-[var(--space-3)] max-w-[28ch]">
              Er is ruimte voor je vragen, en voor twijfel.
            </p>
          </article>

          <KliniekVisualCard />

          <article
            className={`flex min-h-[240px] flex-col ${homeCardRadius} bg-[var(--white)] p-[var(--space-5)] md:min-h-[260px] md:p-[var(--space-6)]`}
          >
            <CircleIcon variant="plus" />
            <h3 className="diba-hp-card-title mt-[var(--space-6)]">
              Heldere keuzes.
            </h3>
            <p className="diba-hp-card-body mt-[var(--space-3)] max-w-[30ch]">
              Over behandeling, kosten en wat je kunt verwachten.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
