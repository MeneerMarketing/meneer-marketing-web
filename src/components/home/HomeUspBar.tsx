"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HOME_USP_STICKERS, HOME_USPS } from "@/data/home-usps";

const STICKER_ROTATIONS = [-2.5, 2, -1.5, 2.5, -2, 1.5, -3, 2];

/**
 * USP-bar op de homepage: waarom Meneer Marketing anders is dan een
 * standaard bureau, plus een sticker-strip met kernkwaliteiten.
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
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Waarom Meneer Marketing
          </p>
          <h2
            id="home-usp-heading"
            className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            Niet nóg een bureau. Eén partner die alles kan.
          </h2>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
          {HOME_USPS.map((usp, index) => {
            const Icon = usp.icon;
            return (
              <motion.li
                key={usp.title}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                  delay: 0.06 * index,
                }}
                className="group h-full"
              >
                <div className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.12)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 will-change-transform hover:-translate-y-0.5 hover:border-[#FF5722]/25 hover:shadow-[0_16px_40px_-20px_rgba(255,87,34,0.2)] sm:p-5">
                  <span
                    className="flex size-11 items-center justify-center rounded-xl bg-[#FF5722]/10 text-[#FF5722] ring-1 ring-[#FF5722]/15 transition duration-300 group-hover:bg-[#FF5722] group-hover:text-white group-hover:ring-[#FF5722]/40"
                    aria-hidden
                  >
                    <Icon className="size-5" strokeWidth={1.85} />
                  </span>
                  <h3 className="mt-4 text-sm font-extrabold leading-snug tracking-tight text-slate-900 sm:text-[15px]">
                    {usp.title}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {usp.body}
                  </p>
                </div>
              </motion.li>
            );
          })}
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
