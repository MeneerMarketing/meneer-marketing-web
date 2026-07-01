import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { AutomationFlowPlay } from "@/components/home/AutomationFlowPlay";
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
                Het maximale halen.{" "}
                <span className="text-mm-sky-deep">
                  Met een plan dat klopt.
                </span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-tight text-mm-muted">
                Geen losse campagnes of mooie sites zonder resultaat. Wij
                bedenken groeistrategieën op maat: welke kanalen, welke
                boodschap en welke prioriteiten. Daarna voeren we het uit met SEO,
                ads, social, e-mail en een website of shop die meegroeit.
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
                  Marketingmix op maat: SEO, SEA, social en e-mail die op elkaar
                  aansluiten.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-mm-sky-deep">→</span>
                  High-end websites en Shopify-shops die Google en klanten
                  overtuigen.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-mm-sky-deep">→</span>
                  Meten wat werkt en opschalen waar de winst zit.
                </li>
              </ul>

              <Link
                href="/groeien"
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-mm-sky-deep hover:text-mm-sky"
              >
                Meer over groeistrategie
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal className="min-w-0" delay={0.08}>
            <AutomationFlowPlay />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
