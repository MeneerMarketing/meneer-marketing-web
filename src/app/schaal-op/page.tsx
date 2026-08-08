import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Rocket,
  Sparkles,
} from "lucide-react";
import { ConversionAside } from "@/components/contact/ConversionAside";
import { ConversionForm } from "@/components/contact/ConversionForm";
import { ConversionHero } from "@/components/contact/ConversionHero";
import { HeroScaleWindow } from "@/components/contact/HeroScaleWindow";
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

const SCHAAL_STICKERS = [
  "Eén hoofdfocus",
  "KPI per kwartaal",
  "Leads of conversie",
  "Paid scherp",
  "Autopilot",
  "Meetbaar sturen",
  "Cases eerst",
] as const;

export default function SchaalOpPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <ConversionHero
          tone="accent"
          eyebrow="Schaal op · groei met meetpunten"
          title={
            <>
              Groei met{" "}
              <span className="relative inline-block text-[#FF5722]">
                richting
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[#FF5722]/25"
                />
              </span>{" "}
              en meetpunten.
            </>
          }
          intro={
            <>
              Meer volume lost niet alles op. Eerst bepaal ik waar de{" "}
              <span className="font-semibold text-slate-900">grootste hefboom</span>{" "}
              zit. Dan bouw ik eromheen.
            </>
          }
          primaryCtaLabel="Start schaaltraject"
          secondary={
            <Link
              href="/cases"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/80 bg-white/70 px-6 py-3.5 text-sm font-bold text-slate-900 backdrop-blur transition hover:border-slate-900"
            >
              Bekijk cases
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          }
          stats={[
            { value: "6 focussen", label: "Aanpak" },
            { value: "1 KPI", label: "Per kwartaal" },
            { value: "≤ 2d", label: "Terugkoppeling" },
          ]}
          visual={<HeroScaleWindow />}
          stickers={SCHAAL_STICKERS}
        />

        <section
          className="relative border-t border-mm-border/60 bg-mm-bg py-16 sm:py-24"
          aria-label="Schaal-op formulier"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:px-8">
            <ConversionForm variant="schaal-op" />
            <ConversionAside
              processTitle="Hoe ik opschaal"
              quickMailSubject="Schaaltraject bespreken"
              steps={[
                {
                  title: "Meten",
                  body: "Data-audit: events, kanalen, funnel. Wat klopt en wat niet?",
                },
                {
                  title: "Hefboom kiezen",
                  body: "Eén hoofd-KPI per kwartaal. Experimenten die daar hard aan meewerken.",
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
                  description: "Twee minuten context, daarna plan ik het gesprek.",
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
              trustLabel="Ik deel wat werkt en wat níét werkte in eerdere trajecten."
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
