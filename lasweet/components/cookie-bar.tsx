"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CookieIcon } from "@phosphor-icons/react";

const STORAGE_KEY = "lasweet-cookie-consent";

type ConsentValue = "all" | "essential";

export function CookieBar() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function save(value: ConsentValue) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // private mode: banner verdwijnt alsnog deze sessie
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-bar-title"
          aria-describedby="cookie-bar-text"
          initial={reduceMotion ? false : { opacity: 0, y: 40, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 28, rotate: -3, transition: { duration: 0.25 } }
          }
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-md md:bottom-6 md:left-6 md:right-auto md:max-w-[380px]"
        >
          <div className="rounded-[1.75rem] border border-ink/10 bg-cream p-5 shadow-[0_28px_70px_-28px_rgba(68,57,43,0.55)] md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-12 shrink-0 -rotate-6 items-center justify-center rounded-2xl bg-matcha text-cream shadow-[3px_3px_0_0_rgba(68,57,43,0.15)]">
                <CookieIcon size={26} weight="fill" />
              </span>

              <div className="min-w-0 pt-0.5">
                <p
                  id="cookie-bar-title"
                  className="font-display text-xl font-semibold tracking-tight text-ink"
                >
                  Cookies?{" "}
                  <span className="font-semibold text-matcha">Graag.</span>
                </p>
                <p
                  id="cookie-bar-text"
                  className="mt-1.5 text-sm leading-relaxed text-ink-soft"
                >
                  De eetbare bakken we zelf. Deze digitale helpen de site soepel
                  lopen. Kortom: een klein hapje voor de techniek.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => save("all")}
                className="flex-1 rounded-full bg-matcha px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-cream transition-all duration-200 hover:bg-matcha-deep active:scale-[0.98]"
              >
                Oké, smullen maar
              </button>
              <button
                type="button"
                onClick={() => save("essential")}
                className="flex-1 rounded-full border border-ink/15 bg-white/70 px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-all duration-200 hover:border-matcha hover:text-matcha-deep active:scale-[0.98]"
              >
                Alleen de droge
              </button>
            </div>

            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.14em] text-ink-soft/70">
              Echte cookies vanaf 4 · deze gratis
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
