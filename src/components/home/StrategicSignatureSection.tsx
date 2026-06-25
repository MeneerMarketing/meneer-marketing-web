import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  Compass,
  Ear,
  GitBranch,
  Layers,
} from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import {
  STRATEGY_MANIFESTO,
  STRATEGY_SIGNATURE_INSIGHTS,
} from "@/data/dienst-strategic";

const insightIcons = [Layers, Ear, GitBranch] as const;

export function StrategicSignatureSection() {
  return (
    <section
      className="relative overflow-hidden border-y border-mm-border bg-gradient-to-b from-mm-sky-subtle/50 via-white to-mm-bg py-14 sm:py-20"
      aria-labelledby="strategic-signature-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgb(224_242_254/0.9),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center lg:text-left">
          <Reveal>
            <p className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-mm-sky-deep lg:justify-start">
              <Compass className="size-4" aria-hidden />
              Aanpak
            </p>
            <h2
              id="strategic-signature-heading"
              className="mx-auto mt-3 max-w-3xl text-balance text-3xl font-extrabold tracking-tight text-mm-text sm:text-4xl lg:mx-0"
            >
              {STRATEGY_MANIFESTO.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed tracking-tight text-mm-text/90 sm:text-lg lg:mx-0">
              Strategie en uitvoering op maat. Drie principes die elke
              samenwerking richting geven, zonder standaardpakketten.
            </p>
          </Reveal>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3 lg:mt-12 lg:gap-5">
          {STRATEGY_SIGNATURE_INSIGHTS.map((item, i) => {
            const Icon = insightIcons[i] ?? Layers;
            return (
              <Reveal key={item.title} delay={0.04 * (i + 1)}>
                <li className="group h-full">
                  <div
                    className="relative flex h-full flex-col rounded-2xl border border-mm-border/90 bg-white/90 p-5 shadow-mm-card backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 will-change-transform hover:-translate-y-0.5 hover:border-mm-sky/35 hover:shadow-mm-float sm:p-6"
                  >
                    <div
                      className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-mm-sky-subtle to-white text-mm-sky-deep ring-1 ring-mm-sky/15 transition group-hover:ring-mm-sky/30"
                      aria-hidden
                    >
                      <Icon className="size-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-4 text-base font-bold leading-snug text-mm-text">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-mm-muted">
                      {item.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ul>

        <div className="mt-10 lg:mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-12">
          <Reveal delay={0.12}>
            <details className="group rounded-2xl border border-mm-border/80 bg-mm-surface/60 px-5 py-4 open:bg-mm-surface open:shadow-sm sm:px-6 sm:py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left text-sm font-bold text-mm-text marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2">
                  <span className="text-mm-sky-deep">Dieper uitlezen</span>
                  <span className="font-normal text-mm-muted">
                    (volledige toelichting in drie stukken)
                  </span>
                </span>
                <ChevronDown
                  className="size-5 shrink-0 text-mm-muted transition group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="mt-5 space-y-4 border-t border-mm-border/60 pt-5 text-sm leading-relaxed text-mm-muted">
                {STRATEGY_MANIFESTO.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </details>
            <Link
              href="/werkwijze"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-mm-sky-deep hover:text-mm-sky"
            >
              Bekijk hoe een traject verloopt
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-10 rounded-3xl border border-mm-border bg-white p-6 shadow-mm-card sm:p-8 lg:mt-0">
              <p className="text-xs font-bold uppercase tracking-wider text-mm-muted">
                Wat je kunt verwachten
              </p>
              <ul className="mt-5 space-y-3.5 text-sm font-medium leading-snug text-mm-text">
                <li className="flex gap-3">
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-mm-accent"
                    aria-hidden
                  />
                  Eerst context. Geen offerte vóór er helderheid is.
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-mm-accent"
                    aria-hidden
                  />
                  Daarna de mix. Kanaal en platform die bij jouw situatie passen.
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-mm-accent"
                    aria-hidden
                  />
                  Strategie, pixels en API&apos;s in één lijn.
                </li>
              </ul>
              <Link
                href="/contact"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-mm-accent px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-mm-accent-hover"
              >
                Plan een gesprek
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
