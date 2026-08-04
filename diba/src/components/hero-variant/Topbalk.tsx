import Link from "next/link";
import Taalkiezer from "@/components/hero-variant/Taalkiezer";
import {
  DIBA_SALONIZED_RATING,
  DIBA_SALONIZED_REVIEW_COUNT,
  DIBA_SALONIZED_REVIEWS_URL,
} from "@/lib/site";

/**
 * De topbalk boven de header — variant, nog niet in gebruik op de live homepage.
 *
 * Links het cijfer met de bron erbij. Dat is de kern: een waardering zonder vindbare
 * bron is een bewering, en §11 verbiedt een cijfer zonder herkomst. Vandaar dat het hele
 * blok één link naar de reviewpagina van Salonized is, en niet alleen het woord.
 *
 * Rechts de praktische links en de taalkiezer. Op mobiel valt alles behalve het cijfer
 * weg: die balk mag niet de helft van het eerste scherm opeten.
 *
 * BEELD-NODIG: het echte Salonized-beeldmerk. Zolang dat er niet is staat de naam er als
 * woordmerk, want een verzonnen logo is erger dan geen logo.
 */

const LINKS = [
  { label: "Veelgestelde vragen", href: "/#kennis" },
  { label: "Prijzen", href: "/prijzen" },
  { label: "Contact", href: "/contact" },
];

export default function Topbalk() {
  const cijfer = DIBA_SALONIZED_RATING.toLocaleString("nl-NL", {
    minimumFractionDigits: 1,
  });
  const aantal = DIBA_SALONIZED_REVIEW_COUNT.toLocaleString("nl-NL");

  return (
    <div className="border-b border-[var(--g-100)] bg-white">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4 px-5 py-2 sm:px-9 lg:px-[7.5vw]">
        <a
          href={DIBA_SALONIZED_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-9 items-center gap-2.5 rounded-[var(--r-pill)] px-1 transition-colors hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 shrink-0 text-[var(--g-600)]"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 1.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.65l5.9-.85z" />
          </svg>

          <span className="text-[13px] leading-none font-semibold text-[var(--t-strong)] tabular-nums">
            {cijfer}
          </span>
          <span className="hidden text-[13px] leading-none text-[var(--t-muted)] sm:inline">
            gebaseerd op <span className="tabular-nums">{aantal}</span> reviews
          </span>
          <span className="text-[13px] leading-none text-[var(--t-muted)] sm:hidden">
            <span className="tabular-nums">{aantal}</span> reviews
          </span>

          <span className="diba-label hidden border-l border-[var(--g-100)] pl-2.5 text-[var(--t-label)] md:inline">
            Salonized
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-4">
          <nav aria-label="Snelle links" className="hidden lg:block">
            <ul className="flex items-center gap-5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] leading-none text-[var(--t-muted)] transition-colors hover:text-[var(--g-700)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Taalkiezer />
        </div>
      </div>
    </div>
  );
}
