import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Gauge,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ConversionAside } from "@/components/contact/ConversionAside";
import { ConversionForm } from "@/components/contact/ConversionForm";
import { ConversionHero } from "@/components/contact/ConversionHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { siteCtas } from "@/lib/cta";
import { BRAND_DISPLAY } from "@/lib/seo/e-e-a-t";
import { absoluteUrl } from "@/lib/site";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo/robots-policy";

export const metadata: Metadata = {
  title: "Schaal op",
  description:
    "Klaar om op te schalen? Meneer Marketing bepaalt met jou de grootste hefboom. Leads, conversie, SEO, ads of automatisering.",
  alternates: { canonical: absoluteUrl("/schaal-op") },
  robots: NOINDEX_FOLLOW_ROBOTS,
  openGraph: {
    title: `Schaal op | ${BRAND_DISPLAY}`,
    description:
      "Groei met richting en meetpunten. Eén hoofdfocus, schaalbare structuur.",
    url: absoluteUrl("/schaal-op"),
    locale: "nl_NL",
    type: "website",
  },
};

export default function SchaalOpPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <ConversionHero
          tone="accent"
          eyebrow="Schaal op"
          title={
            <>
              Groei met{" "}
              <span className="text-[#FF5722]">richting</span> en meetpunten.
            </>
          }
          intro={
            <>
              Meer volume lost niet alles op. Eerst bepalen we waar de{" "}
              <span className="font-semibold text-slate-900">grootste hefboom</span>{" "}
              zit. Dan bouwen we eromheen.
            </>
          }
          primaryCtaLabel="Start schaaltraject"
          secondary={
            <Link
              href="/cases"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-slate-900 bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              Bekijk cases
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          }
          badges={[
            { icon: <Gauge className="size-3.5" />, label: "KPI-gedreven" },
            { icon: <Radar className="size-3.5" />, label: "Meetbaar & schaalbaar" },
            { icon: <ShieldCheck className="size-3.5" />, label: "Eén hoofdfocus" },
          ]}
          stats={[
            { value: "6", label: "Schaalfocussen" },
            { value: "1", label: "Hoofd-KPI per kwartaal" },
            { value: "≤ 2d", label: "Terugkoppeling" },
          ]}
        />

        <section
          className="relative border-t border-mm-border/60 bg-mm-bg py-16 sm:py-24"
          aria-label="Schaal-op formulier"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:px-8">
            <ConversionForm variant="schaal-op" />
            <ConversionAside
              processTitle="Hoe we opschalen"
              quickMailSubject="Schaaltraject bespreken"
              steps={[
                {
                  title: "Meten",
                  body: "Data-audit: events, kanalen, funnel. Wat klopt en wat niet?",
                },
                {
                  title: "Hefboom kiezen",
                  body: "Eén hoofd-KPI per kwartaal. Geen twintig losse experimenten.",
                },
                {
                  title: "Bouwen & sturen",
                  body: "Campagnes, mail en content die meetbaar bijdragen.",
                },
              ]}
              links={[
                {
                  label: "Start intake",
                  href: siteCtas.startIntake.href,
                  description: "Twee minuten context, daarna plannen we het gesprek.",
                  icon: <Sparkles className="size-4" />,
                },
                {
                  label: "Behoud & automatisering",
                  href: "/behoud",
                  description: "E-mail, retentie en shop-automatisering. Rust voor je team.",
                  icon: <Rocket className="size-4" />,
                },
                {
                  label: "Campagnes",
                  href: "/campagnes",
                  description: "Ads, social en creators. Als systeem, niet losse flits.",
                  icon: <BarChart3 className="size-4" />,
                },
              ]}
              trustLabel="We delen wat werkt en wat níét werkte in eerdere trajecten."
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
