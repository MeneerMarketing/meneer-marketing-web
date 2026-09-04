import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { HeroSlider } from "@/components/hero-slider";

export function Hero() {
  return (
    <section className="relative flex items-start overflow-hidden lg:min-h-[calc(100svh-76px)] lg:items-center">
      {/* Zachte beige gloed achter de fotokant */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 size-[640px] -translate-y-1/2 rounded-full bg-beige-mist blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-8 px-5 pb-12 pt-4 md:gap-14 md:px-10 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-0">
        {/* Copy */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <a
              href="https://www.tubantia.nl/enschede/ze-zijn-bijna-te-mooi-om-op-te-eten-de-crumble-cookies-van-ela-19-zijn-een-hit-in-enschede~a2b62938/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex -rotate-2 items-center gap-2 rounded-[1.1rem] bg-beige px-3.5 py-2 shadow-[3px_4px_0_0_rgba(68,57,43,0.18)] transition-transform duration-300 hover:rotate-0 hover:-translate-y-0.5 sm:px-4 sm:py-2.5"
            >
              <span
                aria-hidden="true"
                className="font-logo text-lg leading-none text-matcha-deep/80 transition-transform duration-300 group-hover:scale-110"
              >
                &ldquo;
              </span>
              <span className="font-display text-[13px] font-bold leading-none tracking-tight text-ink sm:text-sm">
                Zoals Tubantia schreef
              </span>
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block text-ink/70 transition-transform duration-300 group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-ink md:text-6xl xl:text-7xl">
              Bijna te
              <br />
              <span className="font-bold text-matcha">mooi</span> om
              <br />
              op te eten.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
              Handgemaakte crumble cookies en matcha drinks. Vers gebakken, op
              bestelling, in kleine batches. Gewoon vanuit Enschede.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/bestellen"
                className="group flex items-center gap-2 rounded-full bg-matcha px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-matcha-deep active:scale-[0.98]"
              >
                Bestel jouw box
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
              <Link
                href="#cookies"
                className="rounded-full border border-ink/20 px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-matcha hover:text-matcha-deep active:scale-[0.98]"
              >
                Bekijk de smaken
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="mt-6 text-[9px] font-medium uppercase tracking-[0.1em] text-ink-soft sm:text-xs sm:tracking-[0.14em]">
              Vanaf 4 cookies · afhalen in Enschede · walk-in op zaterdag
            </p>
          </Reveal>
        </div>

        {/* Speelse fotoslider */}
        <div className="relative order-1 mx-auto w-full max-w-[340px] sm:max-w-[440px] lg:order-2 lg:max-w-[540px]">
          <Reveal delay={0.1}>
            <HeroSlider />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
