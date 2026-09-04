"use client";

import { useEffect, useState } from "react";
import type { ClinicalAtelierModel } from "@/components/templates/clinical-atelier/clinicalAtelierModel";
import { ArrowRight } from "@/components/templates/clinical-atelier/AtelierIcons";

interface ChromeProps {
  model: ClinicalAtelierModel;
}

export function AtelierHeader({ model }: ChromeProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const transparent = !scrolled;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const bookingProps = model.bookingExternal
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <div className="fixed top-0 right-0 left-0 z-50">
      <div className="bg-warm-white">
        <div className="flex h-[30px] w-full items-center justify-between px-[32px] lg:px-[48px]">
          <span className="text-[11px] text-muted-text">
            <span style={{ color: "#F5A623" }}>★★★★★</span>
            {"  "}
            <span className="font-bold text-soft-black">{model.ratingDisplay.replace(".", ",")}</span>
            {"  "}
            <span>{model.reviewCountLabel}</span>
          </span>
          <div className="hidden items-center gap-5 text-[11px] text-muted-text md:flex">
            <a href="#informatie" className="transition-colors hover:text-charcoal">
              FAQ
            </a>
            <a href="#contact" className="transition-colors hover:text-charcoal">
              Contact
            </a>
            <span className="text-border-subtle">|</span>
            <a
              href={`tel:${model.phone.replace(/\s|–|-/g, "")}`}
              className="flex items-center gap-1.5 font-semibold tracking-tight text-soft-black"
            >
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M13 10.33v1.75a1.17 1.17 0 01-1.27 1.17A11.56 11.56 0 016.4 11.4a11.39 11.39 0 01-3.5-3.5A11.56 11.56 0 01.75 2.28 1.17 1.17 0 011.91 1h1.75a1.17 1.17 0 011.17 1 7.5 7.5 0 00.41 1.65 1.17 1.17 0 01-.26 1.23L4.09 5.77a9.33 9.33 0 003.5 3.5l.89-.89a1.17 1.17 0 011.23-.26 7.5 7.5 0 001.65.41A1.17 1.17 0 0113 9.58v.75z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {model.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`transition-all duration-300 ${
          transparent
            ? "bg-transparent"
            : "border-b border-border-subtle bg-warm-white/97 backdrop-blur-md"
        }`}
      >
        <div className="flex h-[60px] w-full items-center justify-between gap-8 px-[32px] lg:px-[48px]">
          <a href="#" className="flex shrink-0 items-center gap-2" onClick={() => setMobileOpen(false)}>
            <span
              className={`text-[16px] font-extrabold tracking-[-0.02em] transition-colors duration-300 ${
                transparent ? "text-white" : "text-soft-black"
              }`}
            >
              {model.shortName}
            </span>
            <span
              className={`h-[8px] w-[8px] rounded-full transition-colors duration-300 ${
                transparent ? "bg-white/80" : "bg-primary"
              }`}
            />
          </a>

          <nav className="hidden flex-1 items-center justify-end gap-6 lg:flex">
            {model.navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-[13.5px] font-medium tracking-[-0.01em] transition-colors duration-200 ${
                  transparent
                    ? "text-white/75 hover:text-white"
                    : "text-charcoal/75 hover:text-charcoal"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href={model.bookingHref}
              {...bookingProps}
              className={`hidden h-[40px] items-center gap-1.5 rounded-full px-5 text-[13px] font-semibold transition-all duration-200 md:flex ${
                transparent
                  ? "border border-white/60 bg-transparent text-white hover:bg-white/10"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              Afspraak maken
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <path
                  d="M1.5 5.5h8M6 2l3.5 3.5L6 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
              aria-label="Menu openen"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`block h-[1.5px] w-[18px] origin-center transition-all duration-200 ${
                    transparent ? "bg-white" : "bg-charcoal"
                  } ${
                    i === 0 && mobileOpen
                      ? "translate-y-[6.5px] rotate-45"
                      : i === 1 && mobileOpen
                        ? "opacity-0"
                        : i === 2 && mobileOpen
                          ? "-translate-y-[6.5px] -rotate-45"
                          : ""
                  }`}
                />
              ))}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="flex flex-col gap-5 border-t border-border-subtle bg-warm-white px-6 pt-6 pb-8 lg:hidden">
            {model.navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-left text-[15px] font-medium text-charcoal transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            ))}
            <div className="border-t border-border-subtle pt-2">
              <a
                href={model.bookingHref}
                {...bookingProps}
                className="block w-full rounded-full bg-primary py-3 text-center text-[14px] font-semibold text-white"
              >
                Afspraak maken
              </a>
            </div>
          </div>
        ) : null}
      </header>
    </div>
  );
}

export function AtelierFooter({ model }: ChromeProps) {
  const bookingProps = model.bookingExternal
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <footer id="contact" className="bg-warm-white">
      <div style={{ background: "#1A3A5C" }}>
        <div className="mx-auto grid max-w-[1540px] grid-cols-1 items-center gap-8 px-6 py-14 lg:grid-cols-[1fr_auto] lg:px-12 lg:py-16">
          <div className="relative z-10">
            <p
              className="mb-3 text-[10px] font-semibold tracking-[0.18em] uppercase"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Volgende stap
            </p>
            <h2
              className="leading-[1.1] font-extrabold text-white"
              style={{ fontSize: "clamp(24px, 2.8vw, 40px)" }}
            >
              Plan je huidbehandeling
              <br />
              <span className="font-light" style={{ color: "rgba(255,255,255,0.55)" }}>
                of een vrijblijvend huidconsult.
              </span>
            </h2>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-4">
            <a
              href={model.bookingHref}
              {...bookingProps}
              className="flex h-[44px] items-center gap-2 rounded-full px-6 text-[13.5px] font-semibold transition-all"
              style={{
                background: "rgba(255,255,255,0.13)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.22)",
              }}
            >
              Afspraak maken
              <ArrowRight size={12} />
            </a>
            <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.40)" }}>
              {model.hoursShort}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1540px] grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-16 lg:px-12">
        <div>
          <div className="mb-7 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
              <div className="h-3 w-3 rounded-full bg-warm-white" />
            </div>
            <span className="text-[15px] font-bold tracking-[-0.025em] text-soft-black">
              {model.studioName}
            </span>
          </div>
          <p className="mb-8 max-w-[260px] text-[14px] leading-[1.65] text-muted-text">
            {model.footerTagline}
          </p>
          <div className="space-y-1.5 text-[13px] text-muted-text">
            <p className="mb-3 text-[12px] font-semibold tracking-wider text-soft-black uppercase">
              Openingstijden
            </p>
            {model.openingHoursLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          {model.instagram.href ? (
            <div className="mt-7 flex gap-2">
              <a
                href={model.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border-subtle px-3 py-1.5 text-[11px] font-semibold text-muted-text transition-colors hover:border-primary hover:text-primary"
              >
                Instagram
              </a>
            </div>
          ) : null}
        </div>

        <div>
          <p className="mb-6 text-[11px] font-semibold tracking-widest text-soft-black uppercase">
            Behandelingen
          </p>
          <ul className="space-y-3.5">
            {model.footerTreatments.map((t) => (
              <li key={t}>
                <a
                  href="#behandelingen"
                  className="text-[13.5px] text-muted-text transition-colors hover:text-primary"
                >
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div id="over-ons">
          <p className="mb-6 text-[11px] font-semibold tracking-widest text-soft-black uppercase">
            Over de kliniek
          </p>
          <ul className="space-y-3.5">
            {[
              ["Ons verhaal", "#over-ons"],
              ["Huidproblemen", "#huidproblemen"],
              ["Tarieven", "#tarieven"],
              ["Informatie", "#informatie"],
              ["Ervaringen", "#ervaringen"],
            ].map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-[13.5px] text-muted-text transition-colors hover:text-primary"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-6 text-[11px] font-semibold tracking-widest text-soft-black uppercase">
            Contact
          </p>
          <div className="space-y-4 text-[13.5px] text-muted-text">
            <div>
              <p className="mb-0.5 font-semibold text-charcoal">{model.footerAddress.city}</p>
              {model.footerAddress.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="pt-1">
              <p>
                <a href={`tel:${model.phone.replace(/\s|–|-/g, "")}`} className="hover:text-primary">
                  {model.phoneDisplay}
                </a>
              </p>
              {model.email ? (
                <p>
                  <a href={`mailto:${model.email}`} className="hover:text-primary">
                    {model.email}
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="mx-auto flex h-11 max-w-[1540px] items-center justify-between px-6 lg:px-12">
          <p className="text-[11.5px] text-muted-text/70">
            © {new Date().getFullYear()} {model.studioName}. Alle rechten voorbehouden.
          </p>
          <div className="hidden gap-5 text-[11.5px] text-muted-text/70 sm:flex">
            {["Privacybeleid", "Algemene voorwaarden", "Cookiebeleid"].map((l) => (
              <button key={l} type="button" className="transition-colors hover:text-primary">
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Header + footer chrome for the Atelier template (render footer after `<main>`). */
export function AtelierChrome({ model }: ChromeProps) {
  return <AtelierHeader model={model} />;
}
