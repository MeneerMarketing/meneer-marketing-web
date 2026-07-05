"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CONTACT_TOPICS } from "@/data/contact-index";

export function ContactTopicGuide() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const topic = CONTACT_TOPICS[active]!;

  return (
    <section
      className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/80"
      aria-labelledby="contact-topics-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Hulp bij kiezen
        </p>
        <h2
          id="contact-topics-heading"
          className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          Waar gaat het over?
        </h2>
        <p className="mt-3 max-w-xl text-slate-600">
          Twijfel je over het onderwerp? Kies wat het dichtst in de buurt komt. In
          het formulier kun je het verfijnen.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {CONTACT_TOPICS.map((item, index) => {
            const isActive = active === index;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                  isActive
                    ? "border-transparent text-white shadow-lg"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: item.accent,
                        boxShadow: `0 8px 24px -8px ${item.accent}66`,
                      }
                    : undefined
                }
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={topic.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-8 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2 lg:items-center"
          >
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: topic.accent }}
              >
                {topic.label}
              </p>
              <p className="mt-2 text-xl font-extrabold text-slate-900">{topic.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{topic.body}</p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <p className="text-xs text-slate-500">
                Kies in het formulier:{" "}
                <span className="font-bold text-slate-800">
                  {topic.formValue === "strategie"
                    ? "Strategie & prioriteit"
                    : topic.formValue === "web-shop"
                      ? "Website of webshop"
                      : topic.formValue === "marketing"
                        ? "SEO, ads of groei"
                        : "Automatisering & koppelingen"}
                </span>
              </p>
              <a
                href="#formulier"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#FF5722]"
              >
                Naar het formulier
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
              {topic.formValue === "strategie" ? (
                <Link
                  href="/intake"
                  className="text-sm font-bold text-[#FF5722] hover:underline"
                >
                  Of start direct de intake
                </Link>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
