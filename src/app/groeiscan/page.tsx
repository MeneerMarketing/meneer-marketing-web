import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Compass,
  Rocket,
  Sparkles,
  Target,
  TreePine,
} from "lucide-react";
import { ConversionAside } from "@/components/contact/ConversionAside";
import { ConversionForm } from "@/components/contact/ConversionForm";
import { Reveal } from "@/components/effects/Reveal";
import { GroeiscanInteractive } from "@/components/home/GroeiscanInteractive";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/groeiscan";
const PAGE_TITLE = "Groeiscan. Ontdek jouw groeiroute in 2 minuten";
const PAGE_DESCRIPTION =
  "Interactieve Groeiscan: kies je doel, situatie en kanalen. Zie live je groeikracht, een lichtende groeitoren en een logische route. Gratis en zonder verplichting.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl(PAGE_PATH) },
  openGraph: {
    title: "Groeiscan | Meneer Marketing",
    description:
      "Speelse playground: voel hoe groei werkt en zie welke stap nu logisch is.",
    url: absoluteUrl(PAGE_PATH),
    locale: "nl_NL",
    type: "website",
  },
};

const HIGHLIGHTS = [
  {
    icon: TreePine,
    title: "Groeitoren die meebeweegt",
    body: "Elk antwoord licht een verdieping op. Je ziet groei, niet alleen een cijfer.",
  },
  {
    icon: Compass,
    title: "Route in gewoon Nederlands",
    body: "Geen jargon. Wel drie concrete vervolgstappen op basis van jouw situatie.",
  },
  {
    icon: Sparkles,
    title: "Gratis en vrijblijvend",
    body: "Speels beginnen, serieus eindigen. Wil je dieper? Plan daarna een echte sessie.",
  },
] as const;

export default function GroeiscanPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <header className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                Groeiscan playground
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Voel waar jouw groei zit.{" "}
                <span className="text-[#FF5722]">Letterlijk.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                Geen formulier met twintig velden. Vijf korte stappen, een toren die
                oplicht en een route die klopt. Gratis, logisch en zonder kleine lettertjes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#groeiscan-playground"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5722] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/25 transition hover:bg-orange-600"
                >
                  Start de playground
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
                <a
                  href="#groeiscan-aanvraag"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:border-slate-900"
                >
                  Direct vervolg plannen
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>
            </Reveal>
          </div>
        </header>

        <section className="border-b border-slate-200 bg-slate-50/80 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <ul className="grid gap-4 sm:grid-cols-3">
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-[#FF5722]/10 text-[#FF5722]">
                      <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                    </span>
                    <p className="mt-4 text-sm font-extrabold text-slate-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="relative border-b border-slate-200 bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div id="groeiscan-playground" className="scroll-mt-24">
              <Reveal>
                <GroeiscanInteractive />
              </Reveal>
              <p className="mt-8 text-center text-sm text-slate-500">
                Liever meteen contact?{" "}
                <Link href="/contact" className="font-bold text-[#FF5722] hover:underline">
                  Naar contact
                </Link>
                {" · "}
                <Link href="/werkwijze" className="font-bold text-[#FF5722] hover:underline">
                  Werkwijze
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section
          id="groeiscan-aanvraag"
          className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white py-14 scroll-mt-24 sm:py-20"
          aria-labelledby="groeiscan-form-heading"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
                Vervolg
              </p>
              <h2
                id="groeiscan-form-heading"
                className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
              >
                Klaar voor de echte Groeiscan?
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                De playground was je warming-up. Nu jouw situatie scherp tegen het licht:
                met data, context en een plan dat past bij je fase.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
              <ConversionForm variant="groeiscan" idPrefix="groeiscan-lead" />
              <ConversionAside
                processTitle="Na de aanvraag"
                quickMailSubject="Groeiscan follow-up"
                steps={[
                  {
                    title: "Korte terugkoppeling",
                    body: "Ik stel een paar voorbereidende vragen via mail.",
                  },
                  {
                    title: "Groeiscan-sessie",
                    body: "Online, 45 min. Samen prioriteit bepalen.",
                  },
                  {
                    title: "Memo en vervolgvoorstel",
                    body: "Kort document met de volgorde die voor jou klopt.",
                  },
                ]}
                links={[
                  {
                    label: "Over onze werkwijze",
                    href: "/werkwijze",
                    description: "Begrijpen, ontwerpen, bouwen, overdragen.",
                    icon: <Compass className="size-4" />,
                  },
                  {
                    label: "Start een intake",
                    href: "/intake",
                    description: "Liever meteen gesprek? Kan ook.",
                    icon: <Target className="size-4" />,
                  },
                  {
                    label: "Een project starten",
                    href: "/project-starten",
                    description: "Weet je al wat er moet gebeuren?",
                    icon: <Rocket className="size-4" />,
                  },
                ]}
                trustLabel="De Groeiscan is onze scope. Je krijgt bruikbare inzichten, geen generieke audit."
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
