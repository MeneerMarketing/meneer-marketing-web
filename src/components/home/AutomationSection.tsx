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
                Automatisering
              </p>
              <h2
                id="automation-heading"
                className="mt-3 text-3xl font-extrabold tracking-tighter text-mm-text sm:text-4xl"
              >
                Eén rustig systeem.{" "}
                <span className="text-mm-sky-deep">
                  Zonder dubbel werk.
                </span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-tight text-mm-muted">
                Andere bureaus stoppen bij mooie campagnes. Wij koppelen je
                shop, ads, CRM en boekhouding aan elkaar. Zodat schalen geen
                chaos wordt en jij niet elke avond data hoeft over te typen.
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
                  Workflows voor orders, voorraad en facturatie die zichzelf
                  draaien.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-mm-sky-deep">→</span>
                  Chatbots en mailflows op jouw data. Geen generieke praat.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-mm-sky-deep">→</span>
                  Tracking die klopt, zodat je ziet wat écht werkt.
                </li>
              </ul>

              <Link
                href="/diensten/automatisering"
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-mm-sky-deep hover:text-mm-sky"
              >
                Meer over automatisering
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
