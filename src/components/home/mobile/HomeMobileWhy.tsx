"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { HomeMobileWhyOrbit } from "@/components/home/mobile/HomeMobileWhyOrbit";
import { HOME_MOBILE_WHY } from "@/data/home-mobile";
import { siteCtas } from "@/lib/cta";

/** Oranje why-blok met orbit-visual en geanimeerde bullets. */
export function HomeMobileWhy() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="mobile-why-heading"
      className="overflow-x-clip border-b border-[#E64A19] bg-[#FF5722] py-12"
    >
      <div className="mx-auto max-w-6xl px-4">
        <h2
          id="mobile-why-heading"
          className="text-center text-xl font-extrabold leading-snug tracking-tight text-white"
        >
          {HOME_MOBILE_WHY.title}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-relaxed text-white/85">
          Strategie, build, SEO, ads en e-mail. Ik doe het zelf. Jij hoeft niemand
          achterna te bellen.
        </p>

        <div className="mt-8">
          <HomeMobileWhyOrbit />
        </div>

        <ul className="mt-8 space-y-2.5">
          {HOME_MOBILE_WHY.points.map((point, i) => (
            <motion.li
              key={point}
              initial={reduce ? false : { opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="flex items-start gap-2.5 rounded-xl bg-white/12 px-3.5 py-3"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-white" strokeWidth={2.5} aria-hidden />
              <span className="text-sm font-bold leading-snug text-white">{point}</span>
            </motion.li>
          ))}
        </ul>

        <motion.div whileTap={reduce ? undefined : { scale: 0.98 }} className="mt-6">
          <Link
            href={siteCtas.startIntake.href}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-lg"
          >
            Plan een gesprek
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
