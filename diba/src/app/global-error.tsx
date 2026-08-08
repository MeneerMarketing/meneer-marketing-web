"use client";

import Link from "next/link";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { figmaBtnMint, figmaBtnPrimary } from "@/lib/figma-home-layout";
import { figmaBody } from "@/lib/figma-inner-layout";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="nl">
      <body className="figma-home flex min-h-screen flex-col items-center justify-center bg-[#fcfdfb] px-5 antialiased">
        <div className="max-w-md text-center">
          <FigmaHeading
            as="h1"
            size="hero"
            text="Even *stil* gelegen"
            className="mx-auto"
          />
          <p className={`mx-auto mt-7 ${figmaBody}`}>
            Er ging iets mis aan onze kant. Probeer de pagina opnieuw of ga
            terug naar de homepage.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className={figmaBtnPrimary}
            >
              Probeer opnieuw ↗
            </button>
            <Link href="/" className={figmaBtnMint}>
              Naar de homepage ↗
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
