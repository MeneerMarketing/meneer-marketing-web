"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import logoWhite from "@/public/brand/la-sweet-logo-white.png";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Matcha", href: "/#matcha" },
  { label: "Cookies", href: "/#cookies" },
  { label: "Bestellen", href: "/bestellen" },
  { label: "Contact", href: "/contact" },
];

function Wordmark({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="group relative block h-9 w-[148px] sm:h-10 sm:w-[168px]"
      aria-label="Lá Sweet by Ela, naar home"
    >
      <Image
        src={logoWhite}
        alt="Lá Sweet by Ela"
        fill
        priority
        sizes="168px"
        className="object-contain object-left transition-opacity group-hover:opacity-85"
      />
    </Link>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-matcha">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 md:px-10">
          <Wordmark />

          <div className="flex items-center gap-10">
            <nav
              className="hidden items-center gap-8 lg:flex"
              aria-label="Hoofdmenu"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cream/85 transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-cream after:transition-transform after:duration-300 hover:text-cream hover:after:origin-left hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/bestellen"
              className="hidden rounded-full bg-cream px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-matcha transition-all duration-300 hover:bg-beige active:scale-[0.98] sm:inline-block"
            >
              Bestel jouw box
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex size-11 items-center justify-center rounded-full border border-cream/35 text-cream transition-colors hover:border-cream hover:bg-cream/10 active:scale-[0.98] lg:hidden"
              aria-label="Menu openen"
              aria-expanded={menuOpen}
            >
              <ListIcon size={22} weight="regular" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex flex-col bg-matcha"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex h-[76px] items-center justify-between px-5 md:px-10">
              <Wordmark onNavigate={() => setMenuOpen(false)} />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex size-11 items-center justify-center rounded-full border border-cream/35 text-cream transition-colors hover:border-cream hover:bg-cream/10 active:scale-[0.98]"
                aria-label="Menu sluiten"
              >
                <XIcon size={22} weight="regular" />
              </button>
            </div>

            <nav
              className="flex flex-1 flex-col items-start justify-center gap-2 px-8"
              aria-label="Mobiel menu"
            >
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.08 + index * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-cream transition-opacity hover:opacity-80"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.08 + NAV_ITEMS.length * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="pt-8"
              >
                <Link
                  href="/bestellen"
                  onClick={() => setMenuOpen(false)}
                  className="inline-block rounded-full bg-cream px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-matcha transition-all duration-300 hover:bg-beige active:scale-[0.98]"
                >
                  Bestel jouw box
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
