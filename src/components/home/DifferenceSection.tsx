import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { SpotlightCard } from "@/components/home/SpotlightCard";
import { siteCtas } from "@/lib/cta";

const pillars = [
  {
    title: "Groeistrategie",
    body: "Geen losse acties. Een helder plan: welke kanalen, welke boodschap en wat je eerst aanpakt om maximaal te groeien.",
    tag: "Marketing",
  },
  {
    title: "High-end websites",
    body: "Maatwerk sites from scratch: snel, veilig en ingericht volgens Google's richtlijnen. Core Web Vitals en SEO-structuur inbegrepen.",
    tag: "Websites",
  },
  {
    title: "Shopify-expert",
    body: "Webshops die verkopen en meegroeien. Thema's, flows en koppelingen met je marketing, gebouwd door iemand die Shopify echt kent.",
    tag: "E-commerce",
  },
  {
    title: "Meetbaar groeien",
    body: "SEO, ads, social en e-mail met duidelijke KPI's. Je ziet wat werkt. Dan schalen we op waar de omzet zit.",
    tag: "Resultaat",
  },
] as const;

export function DifferenceSection() {
  return (
    <section
      className="border-b border-mm-border bg-mm-surface-elevated"
      aria-labelledby="difference-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <div className="max-w-2xl">
            <h2
              id="difference-heading"
              className="text-3xl font-extrabold tracking-tight text-mm-text sm:text-4xl"
            >
              Niet nóg een bureau.{" "}
              <span className="text-mm-sky-deep">Een partner in groei.</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed tracking-tight text-mm-muted">
              Marketing die resultaat oplevert. Websites en shops op topniveau.
              Vier principes die je terugziet in meer klanten, meer omzet en
              meer zichtbaarheid.
            </p>
            <Link
              href={siteCtas.samenwerken.href}
              className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-mm-sky/30 bg-white px-5 py-2.5 text-sm font-bold text-mm-sky-deep shadow-sm transition hover:border-mm-sky hover:bg-mm-sky-subtle/40"
            >
              {siteCtas.samenwerken.label}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
        <ul className="mt-12 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <SpotlightCard key={p.title} revealDelay={0.05 * i}>
              <span className="inline-flex rounded-full bg-mm-sky-subtle px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mm-sky-deep">
                {p.tag}
              </span>
              <h3 className="mt-4 text-lg font-bold text-mm-text">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mm-muted">
                {p.body}
              </p>
            </SpotlightCard>
          ))}
        </ul>
      </div>
    </section>
  );
}
