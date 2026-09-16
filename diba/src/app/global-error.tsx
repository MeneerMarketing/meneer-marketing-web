"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { figmaBtnMint, figmaBtnPrimary } from "@/lib/figma-home-layout";
import { figmaBody } from "@/lib/figma-inner-layout";
import { TAALCODES, taalVanPad, type Taal } from "@/lib/taal";

/**
 * De pagina als de hele indeling omvalt.
 *
 * Deze staat buiten de taalgroepen en krijgt geen woordenboek mee: als de wortelindeling
 * zelf kapot is, is er geen provider meer om uit te lezen. Daarom staan de vier teksten
 * hier in drie talen en leest de pagina de taal uit het adres. Op de server is dat adres
 * er niet; dan is het Nederlands, en de browser schakelt om zodra hij het pad kent.
 */
const TEKST: Record<
  Taal,
  { kop: string; uitleg: string; opnieuw: string; home: string }
> = {
  nl: {
    kop: "Even *stil* gelegen",
    uitleg:
      "Er ging iets mis aan onze kant. Probeer de pagina opnieuw of ga terug naar de homepage.",
    opnieuw: "Probeer opnieuw ↗",
    home: "Naar de homepage ↗",
  },
  en: {
    kop: "A brief *pause*",
    uitleg:
      "Something went wrong on our side. Try the page again or go back to the homepage.",
    opnieuw: "Try again ↗",
    home: "To the homepage ↗",
  },
  es: {
    kop: "Una pequeña *pausa*",
    uitleg:
      "Algo ha fallado de nuestro lado. Vuelve a intentarlo o regresa a la página de inicio.",
    opnieuw: "Inténtalo de nuevo ↗",
    home: "A la página de inicio ↗",
  },
};

const geenAbonnement = () => () => {};

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pad = useSyncExternalStore(
    geenAbonnement,
    () => window.location.pathname,
    () => "/",
  );
  const taal = taalVanPad(pad);
  const tekst = TEKST[taal];

  return (
    <html lang={TAALCODES[taal].html}>
      <body className="figma-home flex min-h-screen flex-col items-center justify-center bg-[var(--g-010)] px-5 antialiased">
        <div className="max-w-md text-center">
          <FigmaHeading
            as="h1"
            size="hero"
            text={tekst.kop}
            className="mx-auto"
          />
          <p className={`mx-auto mt-7 ${figmaBody}`}>{tekst.uitleg}</p>
          <div className="mt-9 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className={figmaBtnPrimary}
            >
              {tekst.opnieuw}
            </button>
            <Link
              href={taal === "nl" ? "/" : `/${taal}`}
              className={figmaBtnMint}
            >
              {tekst.home}
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
