"use client";

import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { HOME_MOBILE_MYTHS, HOME_MOBILE_MYTH_SECTION } from "@/data/home-mobile-editorial";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Marketing-fabeltjes: snap-carousel met grappige reality checks. */
export function HomeMobileMythSwipe() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const activeMyth = HOME_MOBILE_MYTHS[active] ?? HOME_MOBILE_MYTHS[0]!;
  const eyebrow =
    activeMyth.eyebrow ?? HOME_MOBILE_MYTH_SECTION.eyebrow;

  return (
    <section
      aria-labelledby="mobile-myth-heading"
      className="overflow-x-clip border-b border-slate-200 bg-slate-50 py-14"
    >
      <div className="mx-auto max-w-6xl px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={eyebrow}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]"
          >
            {eyebrow}
          </motion.p>
        </AnimatePresence>
        <h2
          id="mobile-myth-heading"
          className="mt-4 text-pretty text-[1.65rem] font-extrabold leading-[1.1] tracking-tight text-slate-900"
        >
          {HOME_MOBILE_MYTH_SECTION.title}
        </h2>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-600">
          {HOME_MOBILE_MYTH_SECTION.subtitle}
        </p>

        <div className="-mx-4 mt-8 overflow-x-clip px-4">
          <ul
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={(e) => {
              const el = e.currentTarget;
              const card = el.querySelector("li");
              if (!card) return;
              const idx = Math.round(el.scrollLeft / (card.clientWidth + 12));
              setActive(Math.min(idx, HOME_MOBILE_MYTHS.length - 1));
            }}
          >
            {HOME_MOBILE_MYTHS.map((item, index) => (
              <motion.li
                key={item.id}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ delay: index * 0.06, duration: 0.4, ease: EASE }}
                className="w-[min(88vw,320px)] shrink-0 snap-center"
              >
                <article className="flex h-full min-h-[17.5rem] flex-col overflow-hidden rounded-[1.35rem] border border-slate-200/90 bg-white shadow-[0_20px_48px_-22px_rgba(15,23,42,0.12)]">
                  {/* Mythe */}
                  <div className="border-b border-slate-100 bg-slate-100/80 px-4 py-4">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <X className="size-3.5" strokeWidth={2.5} aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                          {HOME_MOBILE_MYTH_SECTION.mythLabel}
                        </p>
                        <p className="mt-1 text-sm font-bold leading-snug text-slate-700 line-through decoration-red-400/70 decoration-2">
                          {item.myth}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Meneer */}
                  <div className="flex flex-1 flex-col px-4 py-4">
                    <div className="flex items-start gap-3">
                      <InteractiveLogo className="size-9 shrink-0" interactive={false} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                          {HOME_MOBILE_MYTH_SECTION.meneerLabel}
                        </p>
                        <p className="mt-2 text-sm font-bold leading-[1.55] tracking-tight text-slate-900">
                          {item.meneer}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={item.href}
                      className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-extrabold text-[#FF5722]"
                    >
                      {item.linkLabel}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </Link>
                  </div>
                </article>
              </motion.li>
            ))}
          </ul>

          {/* Dot indicators */}
          <div className="mt-4 flex items-center justify-center gap-2" aria-hidden>
            {HOME_MOBILE_MYTHS.map((m, i) => (
              <span
                key={m.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-[#FF5722]" : "w-1.5 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
