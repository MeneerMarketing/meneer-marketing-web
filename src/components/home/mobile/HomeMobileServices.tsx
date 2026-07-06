"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { HomeMobilePillarScene } from "@/components/home/mobile/HomeMobilePillarScene";
import { OFFICE_PILLARS } from "@/data/services-office";

/** Snap-carousel met illustraties per specialisme. */
export function HomeMobileServices() {
  const reduce = useReducedMotion();

  return (
    <section
      id="services"
      aria-labelledby="mobile-services-heading"
      className="overflow-x-clip border-b border-slate-200 bg-slate-950 py-12"
    >
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Diensten
        </p>
        <h2
          id="mobile-services-heading"
          className="mt-3 text-2xl font-extrabold tracking-tight text-white"
        >
          Vijf specialismen. Eén aanspreekpunt.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Swipe door de kaarten. Tik om direct naar het blok te gaan.
        </p>

        <div className="-mx-4 mt-6 overflow-x-clip px-4">
          <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {OFFICE_PILLARS.map((pillar, index) => (
              <motion.li
                key={pillar.id}
                initial={reduce ? false : { opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: index * 0.06, type: "spring", stiffness: 260, damping: 24 }}
                className="w-[min(76vw,272px)] shrink-0 snap-center"
              >
                <motion.div whileTap={reduce ? undefined : { scale: 0.97 }}>
                  <Link
                    href={pillar.pillarHref}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] shadow-[0_16px_40px_-20px_rgba(0,0,0,0.55)]"
                  >
                    <div className="relative flex items-center justify-center border-b border-white/10 bg-white/[0.04] px-4 py-5">
                      <motion.div
                        animate={reduce ? undefined : { y: [0, -3, 0] }}
                        transition={{
                          duration: 2.6 + index * 0.15,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <HomeMobilePillarScene
                          pillarId={pillar.id}
                          className="h-[4.5rem] w-full max-w-[150px]"
                        />
                      </motion.div>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        {pillar.objectLabel}
                      </p>
                      <h3 className="mt-1 text-base font-extrabold leading-snug text-white">
                        {pillar.label}
                      </h3>
                      <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-400">
                        {pillar.title}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#FF5722]">
                        Bekijk {pillar.label.split(" ")[0]?.toLowerCase()}
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </motion.li>
            ))}
          </ul>
          <p className="mt-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500">
            Swipe voor alle vijf
            <ChevronRight className="size-3.5" aria-hidden />
          </p>
        </div>

        <Link
          href="/diensten"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5722]"
        >
          Alle diensten bekijken
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
