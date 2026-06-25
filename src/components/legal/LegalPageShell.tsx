import Link from "next/link";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

interface LegalPageShellProps {
  title: string;
  intro?: string;
  children: React.ReactNode;
}

export function LegalPageShell({ title, intro, children }: LegalPageShellProps) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <div className="border-b border-mm-border bg-mm-sky-subtle">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <nav className="text-sm font-semibold text-mm-muted" aria-label="Broodkruimel">
              <Link href="/" className="hover:text-mm-sky-deep">
                Home
              </Link>
              <span className="mx-1.5" aria-hidden>
                /
              </span>
              <span className="text-mm-text">{title}</span>
            </nav>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-mm-text">
              {title}
            </h1>
            {intro ? (
              <p className="mt-4 text-lg text-mm-muted">{intro}</p>
            ) : null}
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-mm-text prose-p:text-mm-muted prose-p:leading-relaxed prose-li:text-mm-muted prose-strong:text-mm-text">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
