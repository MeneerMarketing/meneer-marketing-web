import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { DIENSTEN_CASE_PROOF } from "@/data/diensten-index";

export function DienstenCaseProof() {
  return (
    <section
      className="border-b border-slate-200 bg-slate-50"
      aria-labelledby="diensten-cases-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            {DIENSTEN_CASE_PROOF.eyebrow}
          </p>
          <h2
            id="diensten-cases-heading"
            className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            {DIENSTEN_CASE_PROOF.title}
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-5 sm:grid-cols-3">
          {DIENSTEN_CASE_PROOF.cases.map((c) => (
            <li key={c.name}>
              <Link
                href={c.href}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#FF5722]/30 hover:shadow-md"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Case
                </p>
                <h3 className="mt-2 text-lg font-extrabold text-slate-900 group-hover:text-[#FF5722]">
                  {c.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {c.hook}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {c.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#FF5722]">
                  Bekijk case
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
