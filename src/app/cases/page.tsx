import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { CasesBuiltBoard } from "@/components/cases/CasesBuiltBoard";
import { CasesHonestCompare } from "@/components/cases/CasesHonestCompare";
import { CasesImpactStrip } from "@/components/cases/CasesImpactStrip";
import { CasesShowcase } from "@/components/cases/CasesShowcase";
import { CasesWerkwijzeTeaser } from "@/components/cases/CasesWerkwijzeTeaser";
import { Reveal } from "@/components/effects/Reveal";
import { MarketingFunFactsRow } from "@/components/shared/MarketingFunFactCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  CASES_PAGE_CTA,
  CASES_PAGE_FUN_FACTS_TITLE,
  CASES_PAGE_HERO,
} from "@/data/cases-page";
import { getFunFactsForPage } from "@/data/marketing-fun-facts";
import { siteCtas } from "@/lib/cta";
import { absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/cases";
const PAGE_TITLE = "Cases · SkinComplete, BestRest & Hills Pilates";
const PAGE_DESCRIPTION =
  "Echte succesverhalen met video en foto's. Shopify, B2B-portaal, SEO, ads en apps. Gebouwd by Meneer Marketing.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl(PAGE_PATH) },
  openGraph: {
    title: "Cases | Meneer Marketing",
    description: PAGE_DESCRIPTION,
    url: absoluteUrl(PAGE_PATH),
    locale: "nl_NL",
    type: "website",
  },
};

export default function CasesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <header className="relative overflow-x-clip border-b border-slate-800 bg-slate-950">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div
            className="pointer-events-none absolute -right-20 top-0 size-72 rounded-full bg-[#FF5722]/15 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                {CASES_PAGE_HERO.eyebrow}
              </p>
              <h1 className="mt-4 max-w-3xl text-pretty text-[clamp(2rem,8vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-white">
                {CASES_PAGE_HERO.title}{" "}
                <span className="text-[#FF5722]">{CASES_PAGE_HERO.titleAccent}</span>
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-slate-400">
                {CASES_PAGE_HERO.lead}
              </p>
              <Link
                href={siteCtas.groeiscan.href}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/25 transition hover:bg-orange-600"
              >
                {siteCtas.groeiscan.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </header>

        <section className="bg-gradient-to-b from-slate-50 to-white">
          <CasesShowcase />
        </section>

        <CasesImpactStrip />
        <CasesBuiltBoard />
        <CasesWerkwijzeTeaser />
        <CasesHonestCompare />

        <MarketingFunFactsRow
          facts={getFunFactsForPage("/cases")}
          title={CASES_PAGE_FUN_FACTS_TITLE}
        />

        <section className="border-t border-slate-800 bg-slate-950">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:py-20">
            <Reveal>
              <h2 className="text-pretty text-2xl font-extrabold text-white sm:text-3xl">
                {CASES_PAGE_CTA.title}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-pretty text-lg leading-relaxed text-slate-400">
                {CASES_PAGE_CTA.lead}
              </p>
              <Link
                href={siteCtas.groeiscan.href}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/25 transition hover:bg-orange-600"
              >
                {CASES_PAGE_CTA.button}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
