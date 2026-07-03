import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { OVER_CTA } from "@/data/over-index";
import { siteCtas } from "@/lib/cta";

export function OverIndexCta() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,87,34,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,87,34,0.04)_1px,transparent_1px)] bg-[size:32px_32px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <InteractiveLogo className="mx-auto h-16 w-16" />
          <h2 className="mt-5 text-2xl font-extrabold text-white sm:text-3xl">
            {OVER_CTA.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">{OVER_CTA.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={siteCtas.groeiscan.href}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/30 transition hover:bg-orange-600"
            >
              {siteCtas.groeiscan.label}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/werkwijze"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-4 text-sm font-bold text-white transition hover:border-white/30"
            >
              Bekijk werkwijze
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
