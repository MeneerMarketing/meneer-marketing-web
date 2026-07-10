"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HOME_ABOUT_MENEER_COLLAB_CTA } from "@/data/home-about-meneer";

/** Full-width CTA onder de About Meneer-sectie. */
export function AboutMeneerCollabCta() {
  const data = HOME_ABOUT_MENEER_COLLAB_CTA;

  return (
    <div className="mt-12 lg:mt-16">
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/10 bg-slate-900 px-6 py-8 text-white shadow-[0_28px_64px_-32px_rgba(15,23,42,0.65)] sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-10 lg:py-9">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,87,34,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#FF5722]/20 blur-3xl"
          aria-hidden
        />

        <div className="relative min-w-0 max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
            {data.eyebrow}
          </p>
          <p className="mt-3 text-pretty text-xl font-extrabold tracking-tight sm:text-2xl">
            {data.title}
          </p>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-300 sm:text-[15px]">
            {data.body}
          </p>
          <p className="mt-4 text-pretty text-sm font-bold leading-snug text-white">
            {data.punch}
          </p>
        </div>

        <Link
          href={data.ctaHref}
          className="group relative mt-6 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#FF5722] px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#f4511e] lg:mt-0"
        >
          {data.ctaLabel}
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}
