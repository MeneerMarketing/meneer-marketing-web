import Link from "next/link";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-mm-sky-deep">
          404
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-mm-text sm:text-4xl">
          Deze pagina is even offline voor onderhoud
        </h1>
        <p className="mt-4 max-w-md text-mm-muted">
          Zelfs de beste stack heeft soms een kapotte link. Ga terug naar home
          of start de intake. Daar komen we samen uit.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-mm-text px-6 py-3 text-sm font-bold text-white hover:bg-mm-sky-deep"
          >
            Naar home
          </Link>
          <Link
            href="/intake"
            className="rounded-full border border-mm-border px-6 py-3 text-sm font-bold text-mm-text hover:bg-mm-surface"
          >
            Start intake
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
