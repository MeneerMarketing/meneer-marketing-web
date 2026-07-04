import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CookiePreferencesButton } from "@/components/consent/CookiePreferencesButton";
import { MeneerPeek } from "@/components/home/MeneerPeek";
import { Logo } from "@/components/site/Logo";
import { businessEmailDisplay, businessKvkDisplay, mailtoHref } from "@/lib/contact";
import { siteCtaList } from "@/lib/cta";
import { megaMenuColumns } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-mm-footer-bg text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="rounded-2xl border border-slate-600/80 bg-slate-800/90 p-6 sm:p-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-sky-300/90">
            Klaar voor de volgende stap?
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

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed tracking-tight text-mm-footer-muted">
              MeneerMarketing helpt ondernemers groeien. Web, marketing en
              automatisering op één lijn. Technisch scherp, menselijk in de
              uitvoering.
            </p>
            <MeneerPeek />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Blokken
            </p>
            <ul className="mt-4 space-y-2 text-sm font-medium text-slate-200">
              {megaMenuColumns.map((col) => (
                <li key={col.category}>
                  <Link
                    href={`/${col.pillarSlug}`}
                    className="hover:text-sky-300"
                    prefetch={false}
                  >
                    {col.category}
                  </Link>
                  <span className="mt-0.5 block text-xs text-mm-footer-muted">
                    {col.subtitle}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Navigatie &amp; juridisch
            </p>
            <ul className="mt-4 space-y-2 text-sm font-medium text-slate-200">
              <li>
                <Link
                  href="/diensten"
                  className="hover:text-sky-300"
                  prefetch={false}
                >
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
                  Over ons
                </Link>
              </li>
              <li>
                <Link
                  href="/kennisbank"
                  className="hover:text-sky-300"
                  prefetch={false}
                >
                  Kennisbank
                </Link>
              </li>
              <li>
                <Link
                  href="/groeiscan"
                  className="hover:text-sky-300"
                  prefetch={false}
                >
                  Groeiscan
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
                <Link
                  href="/privacybeleid"
                  className="hover:text-sky-300"
                  prefetch={false}
                >
                  Privacybeleid
                </Link>
                {" · "}
                <Link
                  href="/cookiebeleid"
                  className="hover:text-sky-300"
                  prefetch={false}
                >
                  Cookies
                </Link>
                {" · "}
                <Link
                  href="/algemene-voorwaarden"
                  className="hover:text-sky-300"
                  prefetch={false}
                >
                  Voorwaarden
                </Link>
              </li>
              <li className="pt-1">
                <CookiePreferencesButton className="text-left text-xs text-mm-footer-muted underline-offset-2 hover:text-sky-300 hover:underline" />
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-8 text-xs text-mm-footer-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-400">
            © {new Date().getFullYear()} MeneerMarketing. Alle rechten
            voorbehouden.
          </p>
          <p>
            <a
              href={mailtoHref()}
              className="font-medium text-slate-300 hover:text-sky-300"
            >
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
