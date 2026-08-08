import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DienstFAQ } from "@/components/diensten/DienstFAQ";
import { Reveal } from "@/components/effects/Reveal";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { WERKWIJZE_CTA, WERKWIJZE_FAQ } from "@/data/werkwijze-index";
import { siteCtas } from "@/lib/cta";

export function WerkwijzeFaqSection() {
  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="werkwijze-faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <h2
            id="werkwijze-faq-heading"
            className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            Vragen over hoe ik werk
          </h2>
          <p className="mt-2 text-slate-600">
            Kort en eerlijk. Staat je vraag er niet tussen? Start de intake of
            neem contact op.
          </p>
        </Reveal>
        <div className="mt-8">
          <DienstFAQ items={[...WERKWIJZE_FAQ]} idPrefix="werkwijze" />
        </div>
      </div>
    </section>
  );
}

export function WerkwijzeCtaSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,87,34,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,87,34,0.04)_1px,transparent_1px)] bg-[size:32px_32px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <InteractiveLogo className="mx-auto h-16 w-16" />
        <h2 className="mt-5 text-2xl font-extrabold text-white sm:text-3xl">
          {WERKWIJZE_CTA.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">{WERKWIJZE_CTA.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={siteCtas.startIntake.href}
            className="inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/30 transition hover:bg-orange-600"
          >
            {siteCtas.startIntake.label}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
          <Link
            href={siteCtas.contact.href}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-4 text-sm font-bold text-white transition hover:border-white/30"
          >
            {siteCtas.contact.label}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
