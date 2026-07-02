import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Compass,
  GitBranch,
  Layers,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { ConversionAside } from "@/components/contact/ConversionAside";
import { ConversionForm } from "@/components/contact/ConversionForm";
import { ConversionHero } from "@/components/contact/ConversionHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Samenwerken",
  description:
    "Vraag een samenwerking aan bij MeneerMarketing. Retainer, project of embedded. Eén team, heldere afspraken, jouw tempo.",
  alternates: { canonical: absoluteUrl("/samenwerken") },
  openGraph: {
    title: "Samenwerken | MeneerMarketing",
    description:
      "Retainer, project, embedded of sparren. Kies de vorm die past bij jouw groeifase.",
    url: absoluteUrl("/samenwerken"),
    locale: "nl_NL",
    type: "website",
  },
};

export default function SamenwerkenPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <ConversionHero
          tone="sky"
          eyebrow="Samenwerken"
          title={
            <>
              Eén team. {" "}
              <span className="bg-gradient-to-r from-mm-sky-deep via-mm-sky to-mm-accent bg-clip-text text-transparent">
                heldere afspraken
              </span>
              , jouw tempo.
            </>
          }
          intro={
            <>
              Of je een langdurige partner zoekt of flexibele capaciteit: we
              stemmen samenwerkingsvorm, ritme en rollen af op waar jij{" "}
              <span className="font-semibold text-mm-text">nu</span> staat.
            </>
          }
          primaryCtaLabel="Start aanvraag"
          secondary={
            <Link
              href="/over"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-mm-text/10 bg-white px-6 py-3.5 text-sm font-bold text-mm-text transition hover:border-mm-sky/40"
            >
              Lees over ons
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          }
          badges={[
            { icon: <ShieldCheck className="size-3.5" />, label: "AVG-proof • geen CRM-spam" },
            { icon: <Users className="size-3.5" />, label: "Vast aanspreekpunt" },
            { icon: <Sparkles className="size-3.5" />, label: "Senior-only team" },
          ]}
          stats={[
            { value: "1-2d", label: "Reactietijd" },
            { value: "100%", label: "Senior uitvoering" },
            { value: "4 vormen", label: "Van retainer tot sparren" },
          ]}
        />

        <section
          className="relative border-t border-mm-border/60 bg-mm-bg py-16 sm:py-24"
          aria-label="Samenwerken formulier"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:px-8">
            <ConversionForm variant="samenwerken" />
            <ConversionAside
              quickMailSubject="Samenwerking bespreken"
              steps={[
                {
                  title: "We lezen mee. Persoonlijk",
                  body: "Geen ticket-systeem: een van de oprichters pakt je aanvraag op.",
                },
                {
                  title: "Kort terugkoppelingsgesprek",
                  body: "Meestal binnen een werkweek. Scope, fit en ritme bepalen we samen.",
                },
                {
                  title: "Voorstel op maat",
                  body: "Retainer, project of embedded. Afgestemd op jouw fase en stack.",
                },
              ]}
              links={[
                {
                  label: "Werkwijze in detail",
                  href: "/werkwijze",
                  description: "Hoe we intake, bouw en overdracht inrichten.",
                  icon: <Compass className="size-4" />,
                },
                {
                  label: "Onze blokken",
                  href: "/diensten",
                  description: "Strategie, bouwen, vindbaarheid, acquisitie, behoud.",
                  icon: <Layers className="size-4" />,
                },
                {
                  label: "Cases & referenties",
                  href: "/cases",
                  description: "Echte klanten, echte getallen.",
                  icon: <GitBranch className="size-4" />,
                },
              ]}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
