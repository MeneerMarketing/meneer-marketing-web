"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { onthoudTaal } from "@/components/nav/TaalLink";
import { useSluitBuiten } from "@/lib/sluit-buiten";
import {
  anderePad,
  TAAL_AF,
  taalVanPad,
  type Taal as Taalcode,
} from "@/lib/taal";

/**
 * De taalkiezer in de topbalk.
 *
 * WAT HIER MIS WAS.
 *
 * Deze lijst stond hard in dit bestand, met "Soon" achter English. Dat klopte toen hij
 * geschreven werd: er was nog geen Engelse site. Sinds 13 september 2026 is er een
 * complete Engelse site onder /en, en stond die "Soon" er nog steeds. Wie op Engels
 * klikte kreeg niets, want er zat geen link onder. De hele vertaling was daarmee alleen
 * te vinden door /en in de adresbalk te typen.
 *
 * HIER STAAT ALLEEN WAT AF IS.
 *
 * Er stonden vier talen in: twee echte, en Spaans en Frans met "Pronto" en "Bientôt"
 * erachter. Dat leek eerlijk — laten zien welke kant het op gaat — maar het is het niet.
 * Een taal die je toont zonder hem te kunnen kiezen is een belofte in een menu, en het
 * Frans bestond bovendien nergens: geen woordenboek, geen route, geen regel tekst.
 *
 * Het Frans is daarom helemaal weg, en het Spaans staat er pas in zodra het af is. Yasin,
 * 15 september 2026: "franse taal moet er volledig uit en spaans moet uit de language
 * switcher ook tijdelijk eruit totdat we klaar daarmee zijn."
 *
 * De lijst leest daarom `TAAL_AF` uit `lib/taal.ts` en niet een eigen rijtje. Eén
 * schakelaar bepaalt of een taal in de kiezer staat, in de sitemap, in hreflang en of hij
 * geïndexeerd wordt; die vier kunnen zo niet uit elkaar lopen.
 *
 * Gebouwd op `details`/`summary` en niet op React-state. Dat werkt met toetsenbord en
 * muis, en zonder JavaScript blijft het openklappen en navigeren gewoon werken; alleen
 * het onthouden van de keuze in het koekje gaat dan niet.
 *
 * De vlagkleuren staan hier hard en niet in het tokenblok. Dat is bewust: het zijn geen
 * merkkleuren maar de kleuren van landsvlaggen, en die zijn niet aan onze huisstijl aan te
 * passen.
 */

type Taal = {
  readonly code: string;
  /** De taal in zijn eigen naam: English, niet Engels. */
  readonly naam: string;
  readonly taal: Taalcode;
};

/** Alle talen die de site kent, in deze volgorde. */
const ALLE_TALEN = [
  { code: "NL", naam: "Nederlands", taal: "nl" },
  { code: "EN", naam: "English", taal: "en" },
  { code: "ES", naam: "Español", taal: "es" },
] as const satisfies readonly Taal[];

/** Waar je heen kunt: alleen de talen die af zijn. Zie `TAAL_AF`. */
const TALEN: readonly Taal[] = ALLE_TALEN.filter((t) => TAAL_AF[t.taal]);

function Vlag({ code }: { code: string }) {
  const gedeeld = {
    width: 20,
    height: 14,
    className: "shrink-0 rounded-[2px]",
  } as const;

  if (code === "NL") {
    return (
      <svg viewBox="0 0 20 14" {...gedeeld} aria-hidden="true">
        <rect width="20" height="14" fill="#fff" />
        <rect width="20" height="4.67" fill="#ae1c28" />
        <rect y="9.33" width="20" height="4.67" fill="#21468b" />
      </svg>
    );
  }
  if (code === "ES") {
    return (
      <svg viewBox="0 0 20 14" {...gedeeld} aria-hidden="true">
        <rect width="20" height="14" fill="#c60b1e" />
        <rect y="3.5" width="20" height="7" fill="#ffc400" />
      </svg>
    );
  }
  // EN — vereenvoudigde Union Jack: de diagonalen zijn op 20 bij 14 toch niet leesbaar.
  return (
    <svg viewBox="0 0 20 14" {...gedeeld} aria-hidden="true">
      <rect width="20" height="14" fill="#012169" />
      <path d="M0 0l20 14M20 0L0 14" stroke="#fff" strokeWidth="2.6" />
      <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4.4" />
      <path d="M10 0v14M0 7h20" stroke="#c8102e" strokeWidth="2.4" />
    </svg>
  );
}

function Vinkje() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="ml-auto h-3.5 w-3.5 text-[var(--g-700)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  );
}

const REGEL = "flex items-center gap-3 px-4 py-2.5 text-[14px]";

export type TaalkiezerProps = {
  /** Doorschijnend over een beeld: witte letters in plaats van donkere. */
  opBeeld?: boolean;
};

export default function Taalkiezer({ opBeeld = false }: TaalkiezerProps) {
  const paneel = useRef<HTMLDetailsElement>(null);
  useSluitBuiten(paneel);

  const pad = usePathname() ?? "/";
  const nu = taalVanPad(pad);
  /* Wat er in de balk staat komt uit `ALLE_TALEN` en niet uit `TALEN`: wie een adres van
     een taal-in-wording intypt, hoort te zien in welke taal hij staat. Stond dit op de
     kieslijst, dan zei de balk "NL" boven een Spaanse pagina. Kiezen kan alleen uit de
     talen die af zijn, en dat is `TALEN` hieronder. */
  const huidig = ALLE_TALEN.find((t) => t.taal === nu) ?? ALLE_TALEN[0];

  return (
    <details ref={paneel} className="group relative">
      <summary
        className={`diba-label flex h-9 cursor-pointer list-none items-center gap-2 rounded-[var(--r-pill)] px-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden ${
          opBeeld
            ? "text-white hover:bg-white/15 focus-visible:outline-white"
            : "text-[var(--t-label)] hover:bg-[var(--g-100)] focus-visible:outline-[var(--g-700)]"
        }`}
      >
        <Vlag code={huidig.code} />
        {huidig.code}
        <svg
          viewBox="0 0 12 12"
          className="h-2.5 w-2.5 transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </summary>

      <ul className="absolute right-0 z-[45] mt-2 w-48 overflow-hidden rounded-[var(--r-sm)] border border-[var(--g-100)] bg-white py-1 shadow-[var(--shadow-float)]">
        {TALEN.map((t) => {
          /* De pagina waar je heen gaat is dezelfde pagina, niet de homepage. Twee
             pagina's staan bewust dicht en hebben geen Engelse versie; die leveren `null`
             op en dan is de taal hier niet te kiezen. Zie `lib/taal.ts`. */
          const doel = t.taal && t.taal !== nu ? anderePad(pad, t.taal) : null;

          if (t.taal === nu) {
            return (
              <li key={t.code}>
                <span
                  lang={t.code.toLowerCase()}
                  className={`${REGEL} font-medium text-[var(--t-strong)]`}
                >
                  <Vlag code={t.code} />
                  {t.naam}
                  <Vinkje />
                </span>
              </li>
            );
          }

          if (doel) {
            return (
              <li key={t.code}>
                <Link
                  href={doel}
                  lang={t.code.toLowerCase()}
                  hrefLang={t.taal}
                  onClick={() => t.taal && onthoudTaal(t.taal)}
                  /* `--g-100` en niet `--g-050`: dat laatste is dezelfde tint als het
                     vlak eronder, dus dan gebeurt er bij hover zichtbaar niets.
                     `npm run hover` meldde dat 213 keer. */
                  className={`${REGEL} text-[var(--t-body)] hover:bg-[var(--g-100)]`}
                >
                  <Vlag code={t.code} />
                  {t.naam}
                </Link>
              </li>
            );
          }

          /* Geen doel: deze pagina heeft geen tegenhanger in die taal. De regel blijft
             staan, grijs en zonder link, zodat de lijst niet van lengte verspringt
             tussen twee pagina's. Zie `GEEN_VERTALING` in lib/taal.ts. */
          return (
            <li key={t.code}>
              <span
                lang={t.code.toLowerCase()}
                className={`${REGEL} text-[var(--t-muted)]`}
              >
                <Vlag code={t.code} />
                {t.naam}
              </span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
