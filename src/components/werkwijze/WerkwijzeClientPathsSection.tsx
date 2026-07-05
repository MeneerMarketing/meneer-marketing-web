"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { WERKWIJZE_CLIENT_PATHS } from "@/data/werkwijze-index";

export function WerkwijzeClientPathsSection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const client = WERKWIJZE_CLIENT_PATHS[active]!;

  function selectClient(index: number) {
    setActive(index);
    setRevealed(0);
  }

  function revealNext() {
    setRevealed((r) => Math.min(r + 1, client.steps.length));
  }

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-[#FF5722]"
      aria-labelledby="werkwijze-paths-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:36px_36px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
          Geen copy-paste
        </p>
        <h2
          id="werkwijze-paths-heading"
          className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
        >
          Twee cases. Totaal verschillende routes.
        </h2>
        <p className="mt-3 max-w-xl text-white/85">
          SkinComplete en BestRest zijn geen marketingpraat. Kies een case, klik
          door de route en zie waarom volgorde alles is.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {WERKWIJZE_CLIENT_PATHS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => selectClient(i)}
              aria-pressed={active === i}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                active === i
                  ? "border-white bg-white text-slate-900 shadow-lg"
                  : "border-white/30 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={client.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-8 overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/15"
          >
            <div
              className="h-1 w-full"
              style={{ backgroundColor: client.accent }}
              aria-hidden
            />
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 max-w-xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {client.tagline}
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
                    {client.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {client.body}
                  </p>
                  <div className="mt-4 flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <InteractiveLogo className="size-9 shrink-0" />
                    <p className="text-sm font-bold leading-snug text-slate-800">
                      {client.quip}
                    </p>
                  </div>
                </div>

                <div className="w-full lg:max-w-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Route · klik om te onthullen
                  </p>
                  <ol className="mt-3 space-y-2">
                    {client.steps.map((step, i) => {
                      const visible = i < revealed;
                      return (
                        <li key={step.label}>
                          <motion.div
                            initial={false}
                            animate={
                              visible
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0.35, x: 0 }
                            }
                            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                              visible
                                ? "border-slate-200 bg-white shadow-sm"
                                : "border-dashed border-slate-200 bg-slate-50/50"
                            }`}
                          >
                            <span
                              className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-white ${
                                visible ? "" : "bg-slate-200"
                              }`}
                              style={visible ? { backgroundColor: client.accent } : undefined}
                            >
                              {visible ? (
                                <Check className="size-4" strokeWidth={3} aria-hidden />
                              ) : (
                                <ArrowUpRight className="size-3.5 text-slate-400" aria-hidden />
                              )}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900">{step.label}</p>
                              {visible ? (
                                <p className="text-[11px] text-slate-500">{step.detail}</p>
                              ) : (
                                <p className="text-[11px] text-slate-400">…</p>
                              )}
                            </div>
                          </motion.div>
                        </li>
                      );
                    })}
                  </ol>
                  {revealed < client.steps.length ? (
                    <button
                      type="button"
                      onClick={revealNext}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#FF5722]"
                    >
                      Volgende stap in route
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </button>
                  ) : (
                    <p className="mt-4 text-xs font-bold text-emerald-600">
                      Route compleet. Jouw pad wordt anders. Dat is het punt.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}
