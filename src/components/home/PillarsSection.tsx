import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { siteCtas } from "@/lib/cta";
import { megaMenuColumns } from "@/lib/navigation";

export function PillarsSection() {
  return (
    <section
      className="border-b border-mm-border bg-mm-surface"
      aria-labelledby="pillars-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2
                id="pillars-heading"
                className="text-3xl font-extrabold tracking-tight text-mm-text sm:text-4xl"
              >
                Vier pijlers.{" "}
                <span className="text-mm-sky-deep">Één groeipad.</span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-mm-muted">
                Bouwen, groeien, automatiseren, vormgeven. Dezelfde structuur
                als je navigatie, hier als verhaal verteld.
              </p>
            </div>
            <Link
              href={siteCtas.projectStarten.href}
              className="inline-flex items-center gap-2 self-start rounded-full bg-mm-accent px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-mm-accent/20 transition hover:scale-[1.02] hover:bg-mm-accent-hover lg:self-auto"
            >
              {siteCtas.projectStarten.label}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <ol className="relative mt-14 grid gap-6 lg:grid-cols-2">
          <li
            className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-mm-border lg:left-[calc(50%-0.5px)] lg:block"
            aria-hidden
          />
          {megaMenuColumns.map((col, index) => (
            <Reveal key={col.category} delay={0.05 * index}>
              <li className="group relative rounded-2xl border border-mm-border bg-mm-surface-elevated p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md lg:p-8">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-mm-text text-xs font-black text-white transition group-hover:scale-110">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-xl font-bold text-mm-text">
                  {col.category}
                </h3>
                <p className="text-sm font-medium text-mm-sky-deep">
                  {col.subtitle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-mm-muted">
                  {col.featured.description}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-mm-text">
                  {col.items.slice(0, 3).map((item) => (
                    <li key={item.href} className="flex gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-mm-sky" />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/${col.pillarSlug}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-mm-accent transition hover:gap-2"
                  >
                    Pijler bekijken
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/diensten"
                    className="inline-flex items-center gap-1 text-sm font-bold text-mm-sky-deep transition hover:gap-2 hover:text-mm-sky"
                  >
                    Alle diensten
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
