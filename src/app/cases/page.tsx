import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CasesProofReceipts } from "@/components/cases/CasesProofReceipts";
import { CasesHonestCompare } from "@/components/cases/CasesHonestCompare";
import { CasesImpactStrip } from "@/components/cases/CasesImpactStrip";
import { CasesPageHero } from "@/components/cases/CasesPageHero";
import { CasesShowcase } from "@/components/cases/CasesShowcase";
import { CasesWerkwijzeTeaser } from "@/components/cases/CasesWerkwijzeTeaser";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  casesItemListJsonLd,
} from "@/components/seo/JsonLd";
import { getAllCaseSlugs, getCaseBySlug } from "@/data/cases-detail";
import { Reveal } from "@/components/effects/Reveal";
import { MarketingFunFactsRow } from "@/components/shared/MarketingFunFactCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  CASES_PAGE_CTA,
  CASES_PAGE_FUN_FACTS_TITLE,
} from "@/data/cases-page";
import { getFunFactsForPage } from "@/data/marketing-fun-facts";
import { siteCtas } from "@/lib/cta";
import { buildPageMetadata } from "@/lib/seo/site-metadata";
import { HUB_PAGE_SEO } from "@/lib/seo/hub-pages";
import { absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/cases";
const seo = HUB_PAGE_SEO.cases;

export const metadata = buildPageMetadata({
  title: seo.title,
  titleAbsolute: true,
  description: seo.description,
  path: PAGE_PATH,
  ogAccent: seo.ogAccent,
});

export default function CasesPage() {
  const casesLd = casesItemListJsonLd(
    getAllCaseSlugs().map((slug) => {
      const c = getCaseBySlug(slug)!;
      return {
        name: c.client,
        description: c.story.punch,
        url: absoluteUrl(`/cases/${slug}`),
      };
    }),
  );

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Cases", path: PAGE_PATH },
          ]),
          casesLd,
        ]}
      />
      <SiteHeader />
      <main id="main" className="flex-1 overflow-x-clip">
        <CasesPageHero />

        <section className="bg-gradient-to-b from-slate-50 to-white">
          <CasesShowcase />
        </section>

        <CasesImpactStrip />
        <CasesProofReceipts />
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
