import Link from "next/link";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

interface LegalPageShellProps {
  title: string;
  /** Bijvoorbeeld "2 juli 2026" */
  updatedAt: string;
  intro?: string;
  children: React.ReactNode;
}

/**
 * Nette leesbare shell voor juridische pagina's. Styling van koppen,
 * paragrafen en lijsten gebeurt hier centraal, zodat de content-pagina's
 * gewone semantische HTML kunnen schrijven.
 */
export function LegalPageShell({
  title,
  updatedAt,
  intro,
  children,
}: LegalPageShellProps) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <div className="border-b border-mm-border bg-mm-sky-subtle/60">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <nav
              className="text-sm font-semibold text-mm-muted"
              aria-label="Broodkruimel"
            >
              <Link href="/" className="hover:text-mm-sky-deep">
                Home
              </Link>
              <span className="mx-1.5" aria-hidden>
                /
              </span>
              <span className="text-mm-text">{title}</span>
            </nav>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-mm-text sm:text-[2.75rem]">
              {title}
            </h1>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-mm-border bg-white px-3.5 py-1.5 text-xs font-bold text-mm-muted">
              <span
                className="size-1.5 rounded-full bg-mm-accent"
                aria-hidden
              />
              Laatst bijgewerkt: {updatedAt}
            </p>
            {intro ? (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mm-muted">
                {intro}
              </p>
            ) : null}
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div
            className={[
              "text-base leading-relaxed text-mm-muted",
              "[&_h2]:mt-12 [&_h2]:scroll-mt-28 [&_h2]:border-t [&_h2]:border-mm-border/70 [&_h2]:pt-10 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-mm-text",
              "[&_h2:first-child]:mt-0 [&_h2:first-child]:border-t-0 [&_h2:first-child]:pt-0",
              "[&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-mm-text",
              "[&_p]:mt-4",
              "[&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul>li]:relative [&_ul>li]:pl-2 [&_ul>li]:before:absolute [&_ul>li]:before:-left-3.5 [&_ul>li]:before:top-[0.62em] [&_ul>li]:before:size-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-mm-accent",
              "[&_strong]:font-bold [&_strong]:text-mm-text",
              "[&_a]:font-semibold [&_a]:text-mm-sky-deep [&_a]:underline-offset-2 [&_a:hover]:underline",
            ].join(" ")}
          >
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
