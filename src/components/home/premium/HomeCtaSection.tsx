import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";

import { InteractiveLogo } from "@/components/site/InteractiveLogo";

import { HOME_CTA } from "@/data/home-premium";

import { siteCtas } from "@/lib/cta";



export function HomeCtaSection() {

  return (

    <section

      id="home-cta"

      data-scroll-hint={HOME_CTA.scrollHint}

      className="relative overflow-hidden border-t border-slate-800 bg-slate-950"

    >

      <div

        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,87,34,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,87,34,0.04)_1px,transparent_1px)] bg-[size:32px_32px]"

        aria-hidden

      />

      <div

        className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-[#FF5722]/15 blur-3xl"

        aria-hidden

      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">

        <Reveal>

          <span className="mx-auto inline-block" aria-hidden>

            <InteractiveLogo className="h-16 w-16" />

          </span>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">

            {HOME_CTA.eyebrow}

          </p>

          <h2 className="mt-3 text-balance text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">

            {HOME_CTA.title}

            <span className="mt-1 block text-[#FF5722]">{HOME_CTA.titleAccent}</span>

          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-slate-300">

            {HOME_CTA.body}

          </p>

          <Link
            href={siteCtas.startIntake.href}
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#FF5722]/30 transition duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF5722]/40"
          >
            <span>{HOME_CTA.buttonLabel}</span>
            <ArrowUpRight
              className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>

          <p className="mt-4 text-xs text-slate-500">

            {HOME_CTA.secondaryLead}{" "}

            <Link href="/contact" className="font-semibold text-slate-400 transition hover:text-white">

              {HOME_CTA.secondaryLink}

            </Link>

            . {HOME_CTA.secondarySuffix}

          </p>

        </Reveal>

      </div>

    </section>

  );

}


