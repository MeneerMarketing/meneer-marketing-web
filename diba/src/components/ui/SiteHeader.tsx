"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DibaLogo from "@/components/ui/DibaLogo";
import { figmaContainer } from "@/lib/figma-home-layout";

type NavLink = { label: string; href: string };

const FIGMA_NAV: NavLink[] = [
  { label: "Voor jou", href: "/#voor-jou" },
  { label: "De huidscan", href: "/#huidscan" },
  { label: "Onze werkwijze", href: "/#werkwijze" },
  { label: "Kennisbank", href: "/#kennis" },
];

const MOBIEL_LINKS: NavLink[] = [
  { label: "Voor jou", href: "/#voor-jou" },
  { label: "Huidscan", href: "/#huidscan" },
  { label: "Onze werkwijze", href: "/#werkwijze" },
  { label: "Afspraak maken", href: "/intake" },
];

export type SiteHeaderProps = {
  whatsappHref: string;
};

/** Figma Make — header + mobiel menu (exact classes uit export). */
export default function SiteHeader(_props: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className={`${figmaContainer} relative z-30`}>
      <nav
        className="flex items-center justify-between py-3.5 sm:py-4"
        aria-label="Hoofdnavigatie"
      >
        <DibaLogo href="/" variant="dark" priority />

        <div className="hidden items-center gap-7 text-[10px] font-medium uppercase tracking-[.13em] text-[#4f7059] lg:flex">
          {FIGMA_NAV.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-[#286943]">
              {l.label}
            </Link>
          ))}
          <Link href="/intake" className="rounded-full bg-[#286943] px-5 py-3 text-white transition hover:bg-[#174e31]">
            Afspraak maken
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="grid h-10 w-10 place-items-center rounded-full border border-[#b8d0b9] lg:hidden"
          aria-expanded={menuOpen}
          aria-label="Menu openen"
        >
          <span className="flex flex-col gap-1">
            <span className={`h-px w-4 bg-[#1e5536] transition ${menuOpen ? "translate-y-1 rotate-45" : ""}`} />
            <span className={`h-px w-4 bg-[#1e5536] transition ${menuOpen ? "-translate-y-0 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {menuOpen ? (
        <div className="absolute left-5 right-5 top-[95px] z-40 border border-[#dce8d9] bg-white p-5 shadow-xl lg:hidden">
          {MOBIEL_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-[#edf2eb] py-4 text-xs uppercase tracking-[.13em] last:border-0"
            >
              {l.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
