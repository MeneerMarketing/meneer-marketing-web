import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { NOINDEX_NOFOLLOW_ROBOTS } from "@/lib/seo/robots-policy";
import { buildPageMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Pagina niet gevonden | MeneerMarketing",
  description: "Deze pagina bestaat niet (meer). Ga terug naar home of neem contact op.",
  path: "/404",
  titleAbsolute: true,
  robots: NOINDEX_NOFOLLOW_ROBOTS,
});

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        id="main"
        className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center"
      >
        <p className="text-sm font-bold uppercase tracking-wider text-mm-sky-deep">
          404
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-mm-text sm:text-4xl">
          Deze pagina is even offline voor onderhoud
        </h1>
        <p className="mt-4 max-w-md text-mm-muted">
          Zelfs de beste stack heeft soms een kapotte link. Ga terug naar home
          of neem contact op. Dan komen we samen uit.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-mm-text px-6 py-3 text-sm font-bold text-white hover:bg-mm-sky-deep"
          >
            Naar home
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-mm-border px-6 py-3 text-sm font-bold text-mm-text hover:bg-mm-surface"
          >
            Contact
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
