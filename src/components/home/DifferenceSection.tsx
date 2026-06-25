import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { SpotlightCard } from "@/components/home/SpotlightCard";
import { siteCtas } from "@/lib/cta";

const pillars = [
  {
    title: "Meetbaar",
    body: "Geen rapportages zonder betekenis. KPI's, events en dashboards waar je écht beslissingen op neemt.",
    tag: "Data",
  },
  {
    title: "Snel",
    body: "Snelle laadtijden (Core Web Vitals). Sites en shops die snel openen — want trage sites kosten klanten.",
    tag: "Snelheid",
  },
  {
    title: "Schaalbaar",
    body: "Wat vandaag een landingspagina is, groeit morgen door naar koppelingen met CRM, ads en automatisering.",
    tag: "Stack",
  },
  {
    title: "Mens + machine",
    body: "AI en automatisering op de juiste plek. Jij houdt de regie. Je klant merkt alleen rust en tempo.",
    tag: "Proces",
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
              <span className="text-mm-sky-deep">Een bouwer van groei.</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed tracking-tight text-mm-muted">
              Geen menu vol losse diensten zonder context. Wel vier principes
              die je terugziet in snelheid, omzet en een hoofd dat rustig
              blijft.
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
