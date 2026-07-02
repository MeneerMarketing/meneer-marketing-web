"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { siteCtas } from "@/lib/cta";
import { megaMenuIconForHref } from "@/lib/mega-menu-icons";
import { mainNavLinks, megaMenuColumns } from "@/lib/navigation";
import { Logo } from "@/components/site/Logo";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { Magnetic } from "@/components/effects/Magnetic";

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const activeColumn =
    openMenu !== null ? (megaMenuColumns[openMenu] ?? null) : null;

  function handleEnter(index: number) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(index);
  }

  function handleLeaveDelayed() {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  }

  return (
    <header
      className={`relative sticky top-0 z-50 border-b transition-[background-color,border-color] duration-200 ${
        scrolled || openMenu !== null || mobileOpen
          ? "border-mm-border/90 bg-white/90 backdrop-blur-md"
          : "border-transparent bg-mm-bg/70 backdrop-blur-sm"
      }`}
      onMouseLeave={handleLeaveDelayed}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo icon={<InteractiveLogo className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />} />

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Hoofdnavigatie"
        >
          {megaMenuColumns.map((col, index) => (
            <div
              key={col.category}
              className="relative"
              onMouseEnter={() => handleEnter(index)}
            >
              <Magnetic strength={10} radius={110}>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold tracking-tight text-mm-text transition-colors hover:bg-mm-sky-subtle/60 hover:text-mm-sky-deep"
                  aria-expanded={openMenu === index}
                  aria-haspopup="true"
                >
                  {col.category}
                </button>
              </Magnetic>
            </div>
          ))}
          {mainNavLinks.map((link) => (
            <Magnetic key={link.href} strength={10} radius={110}>
              <Link
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold tracking-tight text-mm-muted transition-colors hover:bg-mm-surface hover:text-mm-text"
              >
                {link.name}
              </Link>
            </Magnetic>
          ))}
        </nav>

        <div className="hidden lg:flex lg:items-center">
          <Magnetic strength={12} radius={140}>
            <Link
              href={siteCtas.groeiscan.href}
              className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-[#FF5722] px-5 py-2.5 text-sm font-bold tracking-tight text-white shadow-sm shadow-[#FF5722]/25 transition hover:shadow-[#FF5722]/40"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 origin-bottom bg-slate-900 transition-transform duration-[550ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-0 translate-y-full"
              />
              <span className="relative z-10">{siteCtas.groeiscan.label}</span>
              <ArrowUpRight className="relative z-10 size-4" aria-hidden />
            </Link>
          </Magnetic>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-mm-text lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="mobile-nav"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-mm-border bg-white lg:hidden"
          >
            <div className="mx-auto max-h-[min(70vh,calc(100dvh-5rem))] overflow-y-auto px-4 py-4">
              {megaMenuColumns.map((col) => (
                <details
                  key={col.category}
                  className="group border-b border-mm-border py-2"
                >
                  <summary className="cursor-pointer list-none py-2 text-base font-bold text-mm-text">
                    {col.category}
                    <span className="mt-0.5 block text-xs font-medium text-mm-muted">
                      {col.subtitle}
                    </span>
                  </summary>
                  <Link
                    href={`/${col.pillarSlug}`}
                    className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-mm-border/80 bg-mm-sky-subtle/40 px-3 py-2.5 text-sm font-bold text-mm-sky-deep hover:bg-mm-sky-subtle"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{col.pillarOverviewCta}</span>
                    <ArrowUpRight className="size-4 shrink-0 opacity-70" aria-hidden />
                  </Link>
                  <ul className="space-y-1 pb-3 pt-1">
                    {col.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-2 py-2 text-sm text-mm-text hover:bg-mm-sky-subtle/50"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="font-semibold">
                            {item.menuLabel ?? item.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-mm-muted">
                            {item.menuDescription ?? item.description}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
              <div className="flex flex-col gap-2 pt-4">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-2 py-2 text-sm font-semibold text-mm-text hover:bg-mm-surface"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="mt-4 border-t border-mm-border pt-4">
                  <Link
                    href={siteCtas.groeiscan.href}
                    className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-mm-accent px-4 py-3.5 text-sm font-bold text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {siteCtas.groeiscan.label}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                  <p className="mt-3 px-2 text-center text-xs text-mm-muted">
                    Andere opties vind je op de homepage: intake, schalen,
                    samenwerken.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {activeColumn && !mobileOpen ? (
          <motion.div
            key={activeColumn.category}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-[100] border-b border-mm-border/90 bg-white shadow-[0_24px_48px_-12px_rgba(15,23,42,0.14)]"
            onMouseEnter={() => {
              if (closeTimer.current) clearTimeout(closeTimer.current);
            }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mm-sky/40 to-transparent" aria-hidden />
            <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
                <div className="min-w-0 flex-1 lg:max-w-[58%]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <div className="min-w-0">
                      <p className="sr-only">{activeColumn.category}</p>
                      <p className="text-2xl font-extrabold tracking-tight text-mm-text sm:text-[1.65rem]">
                        {activeColumn.subtitle}
                      </p>
                      <p className="mt-1.5 text-xs font-medium text-mm-muted">
                        Diensten onder deze pijler. Kies een traject of ga naar
                        het overzicht.
                      </p>
                    </div>
                    <Link
                      href={`/${activeColumn.pillarSlug}`}
                      className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-mm-sky/25 bg-mm-sky-subtle/80 px-4 py-2.5 text-sm font-bold text-mm-sky-deep transition hover:border-mm-sky/50 hover:bg-mm-sky-subtle sm:self-auto"
                    >
                      {activeColumn.pillarOverviewCta}
                      <ArrowUpRight
                        className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </Link>
                  </div>
                  <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {activeColumn.items.map((item) => {
                      const ItemIcon = megaMenuIconForHref(item.href);
                      return (
                        <li
                          key={item.href}
                          className="sm:last:odd:col-span-2"
                        >
                          <Link
                            href={item.href}
                            className="group relative flex gap-3.5 rounded-2xl border border-mm-border/80 bg-mm-bg/40 p-3.5 transition-[transform,box-shadow,border-color,background-color] duration-200 will-change-transform hover:-translate-y-px hover:border-mm-sky/30 hover:bg-white hover:shadow-mm-float"
                          >
                            <span
                              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-mm-sky-deep ring-1 ring-mm-border/80 transition group-hover:ring-mm-sky/25"
                              aria-hidden
                            >
                              <ItemIcon className="size-5" strokeWidth={1.65} />
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                              <span className="flex items-start justify-between gap-2">
                                <span className="line-clamp-2 text-sm font-bold leading-tight text-mm-text group-hover:text-mm-sky-deep">
                                  {item.menuLabel ?? item.name}
                                </span>
                                <ArrowUpRight
                                  className="mt-px size-4 shrink-0 text-mm-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-mm-sky-deep"
                                  aria-hidden
                                />
                              </span>
                              <span className="line-clamp-2 text-xs leading-snug text-mm-muted">
                                {item.menuDescription ?? item.description}
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <aside className="relative flex w-full min-h-[200px] flex-col justify-between self-start overflow-hidden rounded-2xl border border-mm-border bg-gradient-to-br from-mm-sky-subtle via-white to-white p-6 shadow-mm-card lg:w-[min(360px,42%)] lg:max-w-md lg:shrink-0">
                  <div
                    className="pointer-events-none absolute -right-8 -top-12 size-40 rounded-full bg-mm-sky/10 blur-2xl"
                    aria-hidden
                  />
                  <div className="relative">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mm-accent">
                      Uitgelicht
                    </p>
                    <h3 className="mt-3 text-lg font-extrabold leading-snug text-mm-text">
                      {activeColumn.featured.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-mm-muted">
                      {activeColumn.featured.description}
                    </p>
                  </div>
                  <Link
                    href={activeColumn.featured.href}
                    className="relative mt-6 inline-flex items-center gap-2 text-sm font-bold text-mm-sky-deep hover:text-mm-sky"
                  >
                    Cases &amp; resultaten
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </aside>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
