import type { Metadata } from "next";
import Link from "next/link";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { figmaBtnMint, figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaInnerContainer,
  figmaSection,
} from "@/lib/figma-inner-layout";
import { DIBA_WHATSAPP_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pagina niet gevonden",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center pb-20">
      <div
        className={`${figmaInnerContainer} ${figmaSection} mx-auto max-w-xl text-center`}
      >
        <FigmaHeading
          as="h1"
          size="hero"
          text="Deze pagina *bestaat* niet (meer)"
          className="mx-auto"
        />
        <p className={`mx-auto mt-7 max-w-md ${figmaBody}`}>
          De link klopt niet of de pagina is verplaatst. Begin op de homepage of
          stel je vraag via WhatsApp.
        </p>
        <div className="mt-9 flex flex-col items-center gap-3">
          <Link href="/" className={figmaBtnPrimary}>
            Naar de homepage ↗
          </Link>
          <Link
            href={DIBA_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={figmaBtnMint}
          >
            Nog niet zeker? Stel je vraag ↗
          </Link>
        </div>
        <p className={`mx-auto mt-10 max-w-md ${figmaBody}`}>
          Of ga direct naar{" "}
          <Link
            href="/huidproblemen"
            className="text-[var(--g-700)] underline-offset-4 hover:underline"
          >
            huidproblemen
          </Link>{" "}
          of{" "}
          <Link
            href="/intake"
            className="text-[var(--g-700)] underline-offset-4 hover:underline"
          >
            intake
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
