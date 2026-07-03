"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ClipboardList, Mail, Radar, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CONTACT_ROUTES, type ContactRoute } from "@/data/contact-index";

const SCENE_ICONS = {
  form: ClipboardList,
  mail: Mail,
  scan: Radar,
  intake: Zap,
} as const;

function RouteScene({ route, active }: { route: ContactRoute; active: boolean }) {
  const reduce = useReducedMotion();
  const Icon = SCENE_ICONS[route.scene];
  const on = active || !!reduce;

  return (
    <motion.div
      animate={on ? { scale: 1, opacity: 1 } : { scale: 0.92, opacity: 0.5 }}
      className="flex h-36 flex-col items-center justify-center gap-3 p-4"
    >
      <span
        className="flex size-14 items-center justify-center rounded-2xl text-white shadow-lg"
        style={{ backgroundColor: route.accent }}
      >
        <Icon className="size-7" strokeWidth={1.6} aria-hidden />
      </span>
      {on ? (
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs font-bold italic text-[#FF5722]"
        >
          {route.quip}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

export function ContactRoutePicker() {
  const [active, setActive] = useState(0);
  const route = CONTACT_ROUTES[active]!;

  return (
    <section
      className="border-b border-slate-200 bg-gradient-to-b from-slate-50/80 to-white"
      aria-labelledby="contact-routes-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Kies je route
        </p>
        <h2
          id="contact-routes-heading"
          className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          Vier manieren om te starten
        </h2>
        <p className="mt-3 max-w-xl text-slate-600">
          Geen verkeerde keuze. Tik een route en zie wat er gebeurt.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="grid gap-2 sm:grid-cols-2">
            {CONTACT_ROUTES.map((item, index) => {
              const isActive = active === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  className={`flex h-full flex-col rounded-2xl border p-4 text-left transition-all ${
                    isActive
                      ? "border-[#FF5722]/40 bg-[#FF5722]/[0.04] shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: item.accent }}
                    aria-hidden
                  />
                  <span className="mt-3 text-sm font-extrabold text-slate-900">
                    {item.title}
                  </span>
                  <span className="mt-1 flex-1 text-xs leading-relaxed text-slate-600">
                    {item.body}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_56px_-32px_rgba(15,23,42,0.15)]">
            <RouteScene route={route} active />
            <div className="border-t border-slate-100 px-5 py-4">
              <p className="text-sm font-extrabold text-slate-900">{route.title}</p>
              <p className="mt-1 text-sm text-slate-600">{route.body}</p>
              {route.external ? (
                <a
                  href={route.href}
                  className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: route.accent }}
                >
                  Ga verder
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              ) : route.href.startsWith("#") ? (
                <a
                  href={route.href}
                  className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: route.accent }}
                >
                  Ga verder
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              ) : (
                <Link
                  href={route.href}
                  className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: route.accent }}
                >
                  Ga verder
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
