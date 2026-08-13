"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";

export function HuidkliniekCase() {
  const c = HUIDKLINIEKEN_VERTICAL.caseStudy;
  if (!c.enabled) return null;

  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="Huidkliniek-case-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <Reveal className="h-full">
            <figure className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-[0_24px_50px_rgba(15,23,42,0.1)]">
              <div className="relative aspect-[16/11] flex-1">
                <Image
                  src={c.imageSrc}
                  alt={c.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3.5 text-xs font-medium text-slate-500">
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

          <Reveal delay={0.08} className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-slate-200/90 bg-slate-50 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                {c.eyebrow}
              </p>
              <h2
                id="Huidkliniek-case-heading"
                className="mt-3 text-3xl font-extrabold tracking-tighter text-slate-900 sm:text-4xl"
              >
                {c.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                {c.lead}
              </p>

              <dl className="mt-8 grid flex-1 grid-cols-2 content-start gap-3">
                {c.facets.map((f) => (
                  <div
                    key={f.label}
                    className="rounded-2xl border border-slate-200 bg-white p-3.5 transition hover:border-[#FF5722]/35"
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
                Custom-niveau). Clinic Edition is de gespecialiseerde
                huidkliniek-foundation voor een lagere instap.{" "}
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
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF5722] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#e64a19]"
              >
                Lees de case
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
