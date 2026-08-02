import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MeneerPeek } from "@/components/home/MeneerPeek";
import { Logo } from "@/components/site/Logo";
import { PartnerCredentialsStrip } from "@/components/site/PartnerCredentialsStrip";
import { businessEmailDisplay, businessKvkDisplay, mailtoHref } from "@/lib/contact";
import { siteCtaList, siteCtas } from "@/lib/cta";
import { megaMenuColumns } from "@/lib/navigation";
import { BRAND_DISPLAY } from "@/lib/seo/e-e-a-t";
import { TOP_ZOEKEN_HUB_LINKS } from "@/lib/seo/internal-links";

const FOOTER_MAIN_CTAS = siteCtaList.filter((cta) => cta.href !== siteCtas.contact.href);

const FOOTER_CONTACT_LINE = "Contact? Mail me. Je praat met mij.";

const FOOTER_DIENSTEN = {
  href: "/diensten",
  label: "Aanbod",
} as const;

const FOOTER_NAV = [
  { href: "/cases", label: "Cases" },
  { href: "/over", label: "Over" },
  { href: "/kennisbank", label: "Kennisbank" },
  { href: "/zoeken", label: "Zoeken" },
  { href: "/werkwijze", label: "Werkwijze" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
] as const;

const FOOTER_LEGAL = [
  { href: "/privacybeleid", label: "Privacy" },
  { href: "/cookiebeleid", label: "Cookies" },
  { href: "/algemene-voorwaarden", label: "Voorwaarden" },
] as const;

export function SiteFooter() {
  return (
    <footer
      id="site-footer"
      aria-label="Footer"
      className="border-t border-slate-800 bg-mm-footer-bg text-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* CTA — mobiel */}
        <div className="rounded-2xl border border-slate-600/80 bg-slate-800/90 p-4 sm:p-8 lg:hidden">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-sky-300/90 sm:text-xs sm:tracking-[0.2em]">
            Klaar voor de volgende stap?
          </p>
          <p className="mx-auto mt-1.5 max-w-md text-center text-xs text-slate-300 sm:mt-2 sm:text-sm">
            Vragen, plannen of sparren? Start intake of neem contact op.
          </p>
          <div className="mt-4 space-y-2 sm:mt-5">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
              {FOOTER_MAIN_CTAS.map((cta) => (
                <Link
                  key={cta.label}
                  href={cta.href}
                  className="inline-flex items-center justify-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs font-bold text-white transition hover:border-sky-400/50 hover:bg-sky-500/15 sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  {cta.label}
                  <ArrowUpRight className="size-3 opacity-80 sm:size-3.5" aria-hidden />
                </Link>
              ))}
            </div>
            <Link
              href={siteCtas.contact.href}
              className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/[0.07] px-4 py-3.5 text-left transition hover:border-sky-400/45 hover:bg-sky-500/10 sm:px-5 sm:py-4"
            >
              <span className="text-pretty text-xs font-bold leading-snug text-white sm:text-sm">
                {FOOTER_CONTACT_LINE}
              </span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FF5722] text-white transition group-hover:scale-105">
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </Link>
          </div>
        </div>

        {/* CTA — desktop (origineel) */}
        <div className="hidden rounded-2xl border border-slate-600/80 bg-slate-800/90 p-6 sm:p-8 lg:block">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-sky-300/90">
            Klaar voor de volgende stap?
          </p>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-slate-300">
            Vragen, plannen of gewoon sparren? Start met intake of neem contact op.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {siteCtaList.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-sky-400/50 hover:bg-sky-500/15"
              >
                {cta.label}
                <ArrowUpRight className="size-3.5 opacity-80" aria-hidden />
              </Link>
            ))}
          </div>
        </div>

        {/* Hoofdgrid — mobiel */}
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-7 sm:gap-x-8 lg:hidden">
          <div className="col-span-2">
            <Logo variant="light" />
            <p className="mt-3 max-w-sm text-sm leading-relaxed tracking-tight text-mm-footer-muted">
              Web, marketing &amp; automatisering. Één lijn.
            </p>
            <MeneerPeek />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
              Blokken
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm font-medium text-slate-200">
              <li>
                <Link href={FOOTER_DIENSTEN.href} className="hover:text-sky-300" prefetch={false}>
                  {FOOTER_DIENSTEN.label}
                </Link>
              </li>
              {megaMenuColumns.map((col) => (
                <li key={col.category}>
                  <Link
                    href={`/${col.pillarSlug}`}
                    className="hover:text-sky-300"
                    prefetch={false}
                  >
                    {col.category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
              Navigatie
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm font-medium text-slate-200">
              {FOOTER_NAV.filter((item) => item.href !== "/contact").map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-sky-300" prefetch={false}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
              Veelgezocht
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm font-medium text-slate-200 sm:grid-cols-4">
              {TOP_ZOEKEN_HUB_LINKS.map((hub) => (
                <li key={hub.slug}>
                  <Link
                    href={`/zoeken/${hub.slug}`}
                    className="hover:text-sky-300"
                    prefetch={false}
                  >
                    {hub.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hoofdgrid — desktop (origineel) */}
        <div className="mt-12 hidden gap-10 lg:grid lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed tracking-tight text-mm-footer-muted">
              {BRAND_DISPLAY} helpt ondernemers groeien. Web, marketing en automatisering op één
              lijn. Technisch scherp, menselijk in de uitvoering.
            </p>
            <MeneerPeek />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Blokken</p>
            <ul className="mt-4 space-y-2 text-sm font-medium text-slate-200">
              {megaMenuColumns.map((col) => (
                <li key={col.category}>
                  <Link href={`/${col.pillarSlug}`} className="hover:text-sky-300" prefetch={false}>
                    {col.category}
                  </Link>
                  <span className="mt-0.5 block text-xs text-mm-footer-muted">{col.subtitle}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Veelgezocht
            </p>
            <ul className="mt-4 space-y-2 text-sm font-medium text-slate-200">
              {TOP_ZOEKEN_HUB_LINKS.map((hub) => (
                <li key={hub.slug}>
                  <Link
                    href={`/zoeken/${hub.slug}`}
                    className="hover:text-sky-300"
                    prefetch={false}
                  >
                    {hub.label}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link href="/zoeken" className="text-sky-300/90 hover:text-sky-300" prefetch={false}>
                  Alle zoekpagina&apos;s
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Navigatie &amp; juridisch
            </p>
            <ul className="mt-4 space-y-2 text-sm font-medium text-slate-200">
              <li>
                <Link href="/diensten" className="hover:text-sky-300" prefetch={false}>
                  Diensten
                </Link>
              </li>
              <li>
                <Link href="/cases" className="hover:text-sky-300">
                  Cases
                </Link>
              </li>
              <li>
                <Link href="/over" className="hover:text-sky-300">
                  Over
                </Link>
              </li>
              <li>
                <Link href="/kennisbank" className="hover:text-sky-300" prefetch={false}>
                  Kennisbank
                </Link>
              </li>
              <li>
                <Link href="/zoeken" className="hover:text-sky-300" prefetch={false}>
                  Zoeken
                </Link>
              </li>
              <li>
                <Link href="/weetjes" className="hover:text-sky-300">
                  Marketing weetjes
                </Link>
              </li>
              <li>
                <Link href="/werkwijze" className="hover:text-sky-300">
                  Werkwijze
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-sky-300">
                  FAQ
                </Link>
              </li>
              <li className="pt-2 text-xs text-mm-footer-muted">
                <Link href="/privacybeleid" className="hover:text-sky-300" prefetch={false}>
                  Privacybeleid
                </Link>
                {" · "}
                <Link href="/cookiebeleid" className="hover:text-sky-300" prefetch={false}>
                  Cookies
                </Link>
                {" · "}
                <Link href="/algemene-voorwaarden" className="hover:text-sky-300" prefetch={false}>
                  Voorwaarden
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Juridisch — mobiel */}
        <nav
          aria-label="Juridisch"
          className="mt-6 flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] font-normal text-slate-400 lg:hidden"
        >
          {FOOTER_LEGAL.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap transition hover:text-sky-300/90"
              prefetch={false}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <PartnerCredentialsStrip
          variant="on-dark"
          className="mt-8 border-t border-white/10 pt-8 sm:mt-10 lg:hidden"
        />

        {/* Copyright — mobiel */}
        <div className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-mm-footer-muted sm:mt-8 lg:hidden">
          <p className="text-slate-400">
            © {new Date().getFullYear()} {BRAND_DISPLAY}. Alle rechten voorbehouden.
          </p>
          <p>
            <a href={mailtoHref()} className="font-medium text-slate-300 hover:text-sky-300">
              {businessEmailDisplay}
            </a>
            <span className="mx-2 text-slate-600" aria-hidden>
              ·
            </span>
            {businessKvkDisplay}
          </p>
        </div>

        <PartnerCredentialsStrip
          variant="on-dark"
          className="mt-12 hidden border-t border-white/10 pt-10 lg:block"
        />

        {/* Copyright — desktop (origineel) */}
        <div className="mt-12 hidden flex-col gap-2 border-t border-white/10 pt-8 text-xs text-mm-footer-muted sm:flex-row sm:items-center sm:justify-between lg:flex">
          <p className="text-slate-400">
            © {new Date().getFullYear()} {BRAND_DISPLAY}. Alle rechten voorbehouden.
          </p>
          <p>
            <a href={mailtoHref()} className="font-medium text-slate-300 hover:text-sky-300">
              {businessEmailDisplay}
            </a>
            <span className="mx-2 text-slate-600" aria-hidden>
              ·
            </span>
            {businessKvkDisplay}
          </p>
        </div>
      </div>
    </footer>
  );
}
