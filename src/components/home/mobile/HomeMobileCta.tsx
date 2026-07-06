"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { HOME_CTA } from "@/data/home-premium";
import { siteCtas } from "@/lib/cta";

/** Afsluitende CTA op mobiel met subtiele Meneer-animatie. */
export function HomeMobileCta() {
  const reduce = useReducedMotion();

  return (
    <section
      id="mobile-cta"
      data-scroll-hint={HOME_CTA.scrollHint}
      className="border-t border-slate-800 bg-slate-950 py-14 pb-24"
    >
      <div className="mx-auto max-w-6xl px-4 text-center">
        <motion.div
          animate={reduce ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto w-fit"
        >
          <InteractiveLogo className="size-14" interactive={false} />
        </motion.div>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          {HOME_CTA.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
          {HOME_CTA.title}{" "}
          <span className="text-[#FF5722]">{HOME_CTA.titleAccent}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-pretty text-sm leading-relaxed text-slate-400">
          {HOME_CTA.body}
        </p>
        <motion.div whileTap={reduce ? undefined : { scale: 0.98 }} className="mt-6">
          <Link
            href={siteCtas.startIntake.href}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5722] px-5 py-4 text-base font-bold text-white shadow-lg shadow-[#FF5722]/25"
          >
            {HOME_CTA.buttonLabel}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </motion.div>
        <p className="mt-4 text-xs text-slate-500">
          {HOME_CTA.secondaryLead}{" "}
          <Link href="/contact" className="font-semibold text-slate-300 underline-offset-2 hover:underline">
            {HOME_CTA.secondaryLink}
          </Link>
          . {HOME_CTA.secondarySuffix}
        </p>
      </div>
    </section>
  );
}
