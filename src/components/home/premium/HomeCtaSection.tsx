import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { HOME_CTA } from "@/data/home-premium";
import { siteCtas } from "@/lib/cta";

export function HomeCtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-slate-950">
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
          <h2 className="mt-5 text-balance text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {HOME_CTA.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">{HOME_CTA.body}</p>
          <Link
            href={siteCtas.groeiscan.href}
            className="group relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#FF5722] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#FF5722]/30 transition hover:shadow-[#FF5722]/50"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 origin-bottom translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-0"
            />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-slate-900">
              {siteCtas.groeiscan.label}
            </span>
            <ArrowUpRight
              className="relative z-10 size-5 transition-colors duration-300 group-hover:text-slate-900"
              aria-hidden
            />
          </Link>
          <p className="mt-4 text-xs text-slate-500">
            Liever direct mailen? Vul je contactgegevens in op de Groeiscan-pagina.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
