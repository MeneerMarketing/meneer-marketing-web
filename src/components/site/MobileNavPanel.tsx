"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { siteCtas } from "@/lib/cta";
import { mainNavLinks, megaMenuColumns } from "@/lib/navigation";

const EASE = [0.22, 1, 0.36, 1] as const;

const MENU_QUIPS = [
  {
    title: "Verdwaald op internet?",
    sub: "Snap ik. Kies een deur, ik ken de route.",
  },
  {
    title: "Welke deur moet open?",
    sub: "Tik een deur. Ik help je kiezen.",
  },
  {
    title: "Oké, waar wil je heen?",
    sub: "Ik help je kiezen wat eerst zin heeft.",
  },
  {
    title: "Plekje vrij in mijn menu?",
    sub: "Strategie, bouwen, ads. Jij kiest.",
  },
] as const;

interface MobileNavPanelProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNavPanel({ open, onClose }: MobileNavPanelProps) {
  const reduce = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  const [quipIndex, setQuipIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuipIndex(Math.floor(Math.random() * MENU_QUIPS.length));
  }, [open]);

  const quip = MENU_QUIPS[quipIndex] ?? MENU_QUIPS[0];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-slate-900/45 backdrop-blur-[2px] lg:hidden"
            aria-label="Menu sluiten"
            onClick={onClose}
          />

          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigatie"
            initial={reduce ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.32, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-[85] flex max-h-[min(82dvh,640px)] flex-col overflow-hidden rounded-t-2xl border border-b-0 border-slate-200 bg-white shadow-[0_-20px_60px_-12px_rgba(15,23,42,0.28)] lg:hidden"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                  Meneer zegt
                </p>
                <p className="text-pretty text-sm font-extrabold leading-snug text-slate-900">
                  {quip.title}
                </p>
                <p className="mt-0.5 text-pretty text-xs font-medium leading-relaxed text-slate-500">
                  {quip.sub}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600"
                aria-label="Sluiten"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2">
              {megaMenuColumns.map((col) => (
                <details key={col.category} className="group border-b border-slate-100">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 py-2.5 [&::-webkit-details-marker]:hidden">
                    <span className="text-sm font-extrabold text-slate-900">{col.category}</span>
                    <span
                      className="text-xs font-bold text-slate-400 transition group-open:rotate-45 group-open:text-[#FF5722]"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <Link
                    href={`/${col.pillarSlug}`}
                    className="mb-1.5 flex items-center justify-between gap-2 rounded-lg bg-orange-50 px-2.5 py-2 text-xs font-bold text-[#FF5722]"
                    onClick={onClose}
                  >
                    <span className="truncate">{col.pillarOverviewCta}</span>
                    <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
                  </Link>
                  <ul className="space-y-0.5 pb-2">
                    {col.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-2 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                          onClick={onClose}
                        >
                          {item.menuLabel ?? item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}

              <div className="flex gap-1 border-b border-slate-100 py-2">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex-1 rounded-lg py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-50"
                    onClick={onClose}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <Link
                href={siteCtas.meter.href}
                className="mt-2 flex items-center justify-between rounded-xl border border-[#FF5722]/20 bg-orange-50 px-3 py-2.5 text-sm font-bold text-[#FF5722]"
                onClick={onClose}
              >
                {siteCtas.meter.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>

            <div className="shrink-0 border-t border-slate-100 p-3">
              <Link
                href={siteCtas.startIntake.href}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-slate-900 py-3 text-sm font-bold text-white hover:bg-[#FF5722]"
                onClick={onClose}
              >
                {siteCtas.startIntake.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
