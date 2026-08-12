"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";

export function PilatesCase() {
  const c = PILATES_VERTICAL.caseStudy;
  if (!c.enabled) return null;

  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="pilates-case-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          <Reveal>
            <figure className="relative overflow-hidden border border-slate-200 bg-slate-100 shadow-[0_24px_50px_rgba(15,23,42,0.1)]">
              <div className="relative aspect-[16/11]">
                <Image
                  src={c.imageSrc}
                  alt={c.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-500">
                <span>
                  {c.client} · {c.city}
                </span>
                <a
                  href={c.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#FF5722] hover:underline"
                >
                  {new URL(c.websiteUrl).hostname}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              {c.eyebrow}
            </p>
            <h2
              id="pilates-case-heading"
              className="mt-3 text-3xl font-extrabold tracking-tighter text-slate-900 sm:text-4xl"
            >
              {c.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              {c.lead}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3">
              {c.facets.map((f) => (
                <div
                  key={f.label}
                  className="border border-slate-200 bg-[#f7fafc] p-3.5"
                >
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900">
                    {f.text}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-xs leading-relaxed text-slate-500">
              Dit traject was een volledige from-scratch build (Signature
              Custom-niveau). Studio Edition is de gespecialiseerde Pilates
              foundation voor een lagere instap.{" "}
              <Link
                href="/bouwen"
                className="font-bold text-slate-700 underline decoration-[#FF5722]/40 underline-offset-2 hover:text-[#FF5722]"
              >
                Meer over websites from scratch
              </Link>
              .
            </p>

            <Link
              href={c.href}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition hover:text-[#FF5722]"
            >
              Lees de case Hills Pilates
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
