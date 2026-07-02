import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { AnimatedMetric } from "@/components/home/AnimatedMetric";
import { siteCtas } from "@/lib/cta";

const teasers = [
  {
    eyebrow: "Shopify · B2B",
    title: "Een B2B-portal waar salons zelf bestellen",
    metric: "24/7 open",
    body: "Voor SkinComplete bouwden we een compleet B2B-portal binnen Shopify: eigen prijzen, eigen accounts, nul mailtjes heen en weer.",
    href: "/cases",
  },
  {
    eyebrow: "SEO · E-mail",
    title: "Eerst organisch scoren, dan pas adverteren",
    metric: "€0 advertentie-start",
    body: "SkinComplete haalde eerst verkeer en omzet uit SEO en e-mailflows. Advertentiebudget kwam pas toen het fundament al verkocht.",
    href: "/cases",
  },
  {
    eyebrow: "Strategie · E-commerce",
    title: "Matrassen verkopen in een moordende markt",
    metric: "Eigen koers",
    body: "Voor BestRest kozen we bewust een andere strategie dan de grote jongens: scherp positioneren op toppers en matrassen, in plaats van schreeuwen tegen miljoenenbudgetten.",
    href: "/cases",
  },
] as const;

export function CasesPreviewSection() {
  return (
    <section
      className="border-b border-mm-border bg-mm-bg"
      aria-labelledby="cases-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <h2
                id="cases-heading"
                className="text-3xl font-extrabold tracking-tight text-mm-text sm:text-4xl"
              >
                Bewijs, geen praatjes.{" "}
                <span className="text-mm-sky-deep">Cases die kloppen.</span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-mm-muted">
                Geen stockfoto&apos;s van handenschuddende mensen. Wel echte
                trajecten, echte keuzes en de logica erachter.
              </p>
            </div>
            <div className="flex flex-col gap-2 self-start sm:flex-row sm:items-center lg:self-auto">
              <Link
                href={siteCtas.samenwerken.href}
                className="inline-flex items-center justify-center gap-1 rounded-full bg-mm-text px-5 py-2.5 text-sm font-bold text-white transition hover:bg-mm-sky-deep"
              >
                {siteCtas.samenwerken.label}
                <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href="/cases"
                className="inline-flex items-center justify-center gap-1 rounded-full border border-mm-border bg-white px-5 py-2.5 text-sm font-bold text-mm-sky-deep transition hover:border-mm-sky/40"
              >
                Alle cases
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>
        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {teasers.map((c, i) => (
            <Reveal key={c.title} delay={0.07 * i}>
              <li>
                <article className="group flex h-full flex-col rounded-2xl border border-mm-border bg-white/90 p-6 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-mm-sky/35 hover:shadow-xl">
                  <p className="text-xs font-bold uppercase tracking-wider text-mm-muted">
                    {c.eyebrow}
                  </p>
                  <h3 className="mt-3 text-lg font-bold text-mm-text">
                    {c.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-mm-muted">
                    {c.body}
                  </p>
                <AnimatedMetric className="mt-6 text-2xl font-black tracking-tight text-mm-accent">
                  {c.metric}
                </AnimatedMetric>
                  <Link
                    href={c.href}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-mm-text group-hover:text-mm-sky-deep"
                  >
                    Lees verhaal
                    <ArrowUpRight className="size-4" />
                  </Link>
                </article>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
