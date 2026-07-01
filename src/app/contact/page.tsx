import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Mail, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/effects/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  businessEmailDisplay,
  mailtoHref,
} from "@/lib/contact";
import { siteCtas } from "@/lib/cta";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Neem contact op met MeneerMarketing: strategie, web, marketing en automatisering. We reageren persoonlijk en snel.",
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: {
    title: "Contact | MeneerMarketing",
    description:
      "Plan een gesprek of stuur je vraag. Elk traject is maatwerk.",
    url: absoluteUrl("/contact"),
    locale: "nl_NL",
    type: "website",
  },
};

export default function ContactPage() {
  const mailQuick = mailtoHref({
    subject: "Vraag aan MeneerMarketing",
    body: "Hoi,\n\nIk wil graag even sparren over:\n\n",
  });

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <header className="border-b border-mm-border bg-mm-sky-subtle/60">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-mm-sky-deep">
                Contact
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-mm-text sm:text-5xl">
                Laten we kijken wat{" "}
                <span className="text-mm-sky-deep">jouw</span> situatie nodig
                heeft.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mm-muted">
                Geen standaard offerte uit een automaat: elk bedrijf is anders.
                Vertel kort waar je tegenaan loopt. Dan bepalen we samen of
                web, groei, design of automatisering (of de mix) de slimste
                eerste stap is.
              </p>
            </Reveal>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            <Reveal>
              <div className="rounded-3xl border border-mm-border bg-white p-6 shadow-mm-card sm:p-8">
                <h2 className="text-xl font-bold text-mm-text">
                  Stuur een bericht
                </h2>
                <p className="mt-2 text-sm text-mm-muted">
                  Vul het formulier in. Je bericht komt direct bij ons team op{" "}
                  <span className="font-semibold text-mm-text">
                    {businessEmailDisplay}
                  </span>
                  .
                </p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>
            </Reveal>

            <aside className="space-y-6">
              <Reveal delay={0.06}>
                <a
                  href={mailQuick}
                  className="flex items-start gap-4 rounded-3xl border border-mm-border bg-mm-accent-subtle/50 p-6 transition hover:border-mm-accent/40 hover:shadow-sm"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-mm-accent text-white">
                    <Mail className="size-5" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-mm-text">Direct mailen</p>
                    <p className="mt-1 text-sm text-mm-muted break-all">
                      {businessEmailDisplay}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="size-5 shrink-0 text-mm-muted"
                    aria-hidden
                  />
                </a>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="rounded-3xl border border-mm-border bg-mm-surface-elevated p-6">
                  <div className="flex items-center gap-2 text-mm-sky-deep">
                    <MessageSquare className="size-5" aria-hidden />
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Liever structuur eerst?
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-mm-muted">
                    Met de Groeiscan zetten we doelen, kanalen en quick wins op
                    een rij. Nog vóór we groot bouwen.
                  </p>
                  <Link
                    href={siteCtas.groeiscan.href}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-mm-sky-deep hover:text-mm-sky"
                  >
                    {siteCtas.groeiscan.label}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="rounded-3xl border border-dashed border-mm-border/80 bg-mm-bg p-6 text-sm text-mm-muted">
                  <p className="font-semibold text-mm-text">Reactietijd</p>
                  <p className="mt-2 leading-relaxed">
                    We lezen alles zelf. Reken op reactie binnen één à twee
                    werkdagen. Sneller kan als het urgent is (vermeld dat in je
                    onderwerp).
                  </p>
                  <Link
                    href="/werkwijze"
                    className="mt-4 inline-flex items-center gap-1 font-bold text-mm-sky-deep hover:text-mm-sky"
                  >
                    Zo werken we samen
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
