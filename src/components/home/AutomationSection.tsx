import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { StrategyChartBoard } from "@/components/home/StrategyChartBoard";
import { siteCtas } from "@/lib/cta";

export function AutomationSection() {
  return (
    <section
      className="border-b border-mm-border bg-mm-sky-subtle"
      aria-labelledby="automation-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <Reveal>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-mm-sky-deep">
                Strategie
              </p>
              <h2
                id="automation-heading"
                className="mt-3 text-3xl font-extrabold tracking-tighter text-mm-text sm:text-4xl"
              >
                Eerst het plan.{" "}
                <span className="text-mm-sky-deep">
                  Dan pas het vuurwerk.
                </span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-tight text-mm-muted">
                De meeste marketing mislukt niet door slechte uitvoering, maar
                door geen plan. Losse campagnes, een site die niet meewerkt en
                kanalen die elkaar tegenspreken. Ik draai het om: eerst
                bepalen waar jouw omzet zit, dan pas bouwen en adverteren. In de
                juiste volgorde.
              </p>

              <Link
                href={siteCtas.startIntake.href}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-mm-accent px-5 py-3 text-sm font-bold tracking-tight text-white shadow-md transition hover:bg-mm-accent-hover"
              >
                {siteCtas.startIntake.label}
                <ArrowUpRight className="size-4" />
              </Link>

              <ul className="mt-8 space-y-3 text-sm tracking-tight text-mm-text">
                <li className="flex gap-2">
                  <span className="font-bold text-mm-sky-deep">→</span>
                  Kanalen die elkaar versterken: SEO, ads, social en e-mail met
                  één verhaal.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-mm-sky-deep">→</span>
                  Een website of shop die dat verhaal waarmaakt zodra de klik
                  binnen is.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-mm-sky-deep">→</span>
                  Meten, bijsturen en opschalen waar de winst zit. Stoppen waar
                  die niet zit.
                </li>
              </ul>

              <Link
                href="/strategie"
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-mm-sky-deep hover:text-mm-sky"
              >
                Meer over groeistrategie
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal className="min-w-0" delay={0.08}>
            <StrategyChartBoard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
