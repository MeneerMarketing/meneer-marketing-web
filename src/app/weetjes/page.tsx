import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import {
  JsonLdScript,
  breadcrumbJsonLd,
} from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { WeetjesGrid } from "@/components/weetjes/WeetjesGrid";
import { ALL_MARKETING_FUN_FACTS } from "@/data/marketing-fun-facts";
import { buildPageMetadata } from "@/lib/seo/site-metadata";
import { HUB_PAGE_SEO } from "@/lib/seo/hub-pages";
import { siteCtas } from "@/lib/cta";
import { absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/weetjes";
const seo = HUB_PAGE_SEO.weetjes;

export const metadata: Metadata = buildPageMetadata({
  title: seo.title,
  titleAbsolute: true,
  description: seo.description,
  path: PAGE_PATH,
  ogAccent: seo.ogAccent,
});

export default function WeetjesPage() {
  return (
    <>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Marketing weetjes", path: PAGE_PATH },
        ])}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <header className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:44px_44px]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                Feitjes &amp; weetjes
              </p>
              <h1 className="mt-3 max-w-3xl text-balance text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl">
                Marketingfeiten voor op verjaardagen. En in je strategie.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                Allemaal echt, allemaal met een punt. Draai een kaart om voor het
                hele verhaal. Stiekem verklaren ze ook waarom wij marketing
                aanpakken zoals we het aanpakken.
              </p>
            </Reveal>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <WeetjesGrid facts={ALL_MARKETING_FUN_FACTS} />
        </div>

        <section className="border-t border-slate-200 bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Feitjes zijn leuk. Uitvoering telt.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              Herken je ergens je situatie? Dan is een gesprek slimmer dan nog
              een lijstje bookmarken.
            </p>
            <Link
              href={siteCtas.startIntake.href}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/30 transition hover:shadow-[#FF5722]/50"
            >
              {siteCtas.startIntake.label}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
