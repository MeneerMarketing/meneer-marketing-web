"use client";

import { Reveal } from "@/components/effects/Reveal";
import { formatVerticalMoney } from "@/lib/verticals/format-price";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";

const studio = PILATES_VERTICAL.pricing.packages[0]!;
const monthly = formatVerticalMoney(studio.monthly);

export function PilatesWhyPrice() {
  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="pilates-why-price-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Eerlijk over de prijs
            </p>
            <h2
              id="pilates-why-price-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem] lg:leading-[1.08]"
            >
              {monthly} per maand.
              <span className="mt-1 block text-slate-500">
                Hoe dan, als het er zo premium uitziet?
              </span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Omdat de Pilates-fundering, UX en design systems al staan. Ik
              begin niet iedere keer vanaf een blanco canvas. De uren gaan naar
              jouw branding, lessen, lokale SEO, booking en afwerking.
            </p>
            <p className="mt-4 text-sm font-semibold text-slate-900">
              Slim hergebruik van een specialistische foundation. Niet een
              goedkope shortcut.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid gap-3 sm:grid-cols-2">
              <article className="relative overflow-hidden bg-slate-900 p-6 text-white sm:p-7 sm:col-span-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-300">
                  Studio Edition
                </p>
                <h3 className="mt-2 text-xl font-extrabold tracking-tight">
                  High-end Pilates foundation. Jouw studio erin.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Logo, kleuren, foto&apos;s, lessen, stad, booking. Alles
                  personaliseer ik. De technische basis hoeft niet opnieuw
                  uitgevonden.
                </p>
              </article>
              <article className="border border-slate-200 bg-[#f7fafc] p-6">
                <h3 className="text-base font-extrabold text-slate-900">
                  Wel dit
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>Gespecialiseerde Pilates art direction</li>
                  <li>Aangepast tot het van jou voelt</li>
                  <li>SEO-basis + hosting + onderhoud</li>
                </ul>
              </article>
              <article className="border border-slate-200 bg-white p-6">
                <h3 className="text-base font-extrabold text-slate-900">
                  Niet dit
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>ThemeForest met logo erop</li>
                  <li>Pagebuilder-spaghetti</li>
                  <li>Generieke sportschool-look</li>
                </ul>
              </article>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Wil je écht alles vanaf nul?{" "}
              <a
                href="#signature-custom"
                className="font-bold text-slate-900 underline decoration-[#FF5722]/40 underline-offset-2 hover:text-[#FF5722]"
              >
                Signature Custom
              </a>{" "}
              staat klaar.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
