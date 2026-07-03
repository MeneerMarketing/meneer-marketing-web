"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HomeUspCard } from "@/components/home/usp/HomeUspCard";
import { HOME_USP_STICKERS, HOME_USPS } from "@/data/home-usps";

const STICKER_ROTATIONS = [-2.5, 2, -1.5, 2.5, -2, 1.5, -3, 2];

/**
 * USP-bar op de homepage: pakkende kop, vijf illustratieve kaarten en sticker-strip.
 */
export function HomeUspBar() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="home-usp-heading"
      className="relative overflow-hidden border-y border-slate-200 bg-gradient-to-b from-slate-50 via-white to-white"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-[#FF5722]/6 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Waarom Meneer Marketing
          </p>
          <h2
            id="home-usp-heading"
            className="mt-3 text-balance text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-[2rem] lg:leading-tight"
          >
            Alles wat online groei vraagt.{" "}
            <span className="relative inline-block text-[#FF5722]">
              Onder één hoed.
              <svg
                className="pointer-events-none absolute -right-3 -top-4 hidden h-8 w-8 text-[#FF5722]/80 sm:block"
                viewBox="0 0 32 32"
                aria-hidden
                fill="none"
              >
                <path
                  d="M4 22c6-10 18-14 24-10 2 1.5 3 4 3 6 0 3-2 5-5 5H8c-2 0-4-2-4-4 0-1 .5-2 0-3Z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M6 20c5-8 16-11 22-8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Vijf specialismen, één aanspreekpunt. Geen doorschuiven tussen bureaus.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3.5">
          {HOME_USPS.map((usp, index) => (
            <HomeUspCard key={usp.scene} usp={usp} index={index} />
          ))}
        </ul>
      </div>

      <div className="relative border-t border-slate-200/80 bg-slate-50/80">
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2.5 px-4 py-6 sm:gap-3 sm:px-6 lg:px-8">
          {HOME_USP_STICKERS.map((item, index) => {
            const rotate = STICKER_ROTATIONS[index % STICKER_ROTATIONS.length];
            return (
              <motion.li
                key={item}
                initial={
                  reduce ? false : { opacity: 0, y: 14, rotate: rotate * 2.5, scale: 0.85 }
                }
                whileInView={{ opacity: 1, y: 0, rotate, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 18,
                  delay: 0.05 * index,
                }}
                whileHover={reduce ? undefined : { rotate: 0, scale: 1.06, y: -2 }}
                className="cursor-default select-none rounded-full border border-slate-900/90 bg-white px-3.5 py-1.5 text-xs font-bold tracking-tight text-slate-900 shadow-[2px_3px_0_rgba(15,23,42,0.88)] transition-colors hover:border-[#FF5722] hover:text-[#FF5722] hover:shadow-[2px_3px_0_rgba(255,87,34,0.88)] sm:px-4 sm:py-2 sm:text-sm"
              >
                {item}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
