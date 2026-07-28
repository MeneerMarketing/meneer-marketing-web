"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FigmaWhatsAppLink from "@/components/figma/FigmaWhatsAppLink";
import DibaLogo from "@/components/ui/DibaLogo";
import {
  FIGMA_DESKTOP_NAV,
  FIGMA_MOBILE_NAV,
  figmaNavHref,
  isInternalRoute,
} from "@/lib/figma-site-nav";

type FigmaSiteHeaderBlockProps = {
  /** home = anchors op /, inner = volledige URLs naar homepage-secties */
  variant?: "home" | "inner";
  whatsappHref: string;
};

function NavLink({
  item,
  onHome,
  className,
  onNavigate,
}: {
  item: (typeof FIGMA_DESKTOP_NAV)[number];
  onHome: boolean;
  className: string;
  onNavigate?: () => void;
}) {
  const href = figmaNavHref(item, onHome);

  if (isInternalRoute(href)) {
    return (
      <Link href={href} className={className} onClick={onNavigate}>
        {item.label}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={onNavigate}>
      {item.label}
    </a>
  );
}

/** Top bar + hoofdnav — zelfde chrome als Figma-homepage. */
export default function FigmaSiteHeaderBlock({
  variant = "inner",
  whatsappHref,
}: FigmaSiteHeaderBlockProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const onHome = variant === "home";

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative z-30">
      <div className="flex w-full items-center justify-between bg-[#d8efc8] px-5 py-2.5 text-[9px] font-medium uppercase tracking-[.12em] text-[#285f3a] sm:px-9 lg:px-[7.5vw]">
        <span className="hidden sm:block">Eerlijke huidzorg begint met goed kijken.</span>
        <span className="sm:hidden">Trust the green touch.</span>
        <span className="flex items-center gap-3">
          <span className="hidden md:block">Diba Clinics · Hillegersberg</span>
          <Link
            href="/intake"
            className="rounded-full bg-[#286943] px-3 py-1.5 text-white transition hover:bg-[#174e31]"
          >
            Start hier ↗
          </Link>
        </span>
      </div>

      <div className="mx-auto max-w-[1800px] px-5 sm:px-9 lg:px-[7.5vw]">
        <nav className="flex items-center justify-between py-3.5 sm:py-4" aria-label="Hoofdnavigatie">
          <DibaLogo href={onHome ? "#top" : "/"} variant="dark" priority />

          <div className="hidden items-center gap-7 text-[10px] font-medium uppercase tracking-[.13em] text-[#4f7059] lg:flex">
            {FIGMA_DESKTOP_NAV.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                onHome={onHome}
                className="transition hover:text-[#286943]"
              />
            ))}
            <FigmaWhatsAppLink
              href={whatsappHref}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#b8d0b9] text-[#286943] transition hover:border-[#286943] hover:bg-[#eff8ea]"
            />
            <Link
              href="/intake"
              className="rounded-full bg-[#286943] px-5 py-3 text-white transition hover:bg-[#174e31]"
            >
              Afspraak maken
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <FigmaWhatsAppLink
              href={whatsappHref}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#b8d0b9] text-[#286943]"
            />
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#b8d0b9] lg:hidden"
              aria-expanded={menuOpen}
              aria-label="Menu openen"
            >
              <span className="flex flex-col gap-1">
                <span
                  className={`h-px w-4 bg-[#1e5536] transition ${menuOpen ? "translate-y-1 rotate-45" : ""}`}
                />
                <span
                  className={`h-px w-4 bg-[#1e5536] transition ${menuOpen ? "-rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </nav>

        {menuOpen ? (
          <div className="absolute left-5 right-5 top-[84px] z-40 border border-[#dce8d9] bg-white p-5 shadow-xl lg:hidden">
            {FIGMA_MOBILE_NAV.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                onHome={onHome}
                className="block border-b border-[#edf2eb] py-4 text-xs uppercase tracking-[.13em] last:border-0"
                onNavigate={closeMenu}
              />
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}
