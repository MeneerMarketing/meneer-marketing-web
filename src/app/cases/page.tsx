import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { CaseSceneIllustration } from "@/components/home/cases/CaseSceneIllustration";
import { Reveal } from "@/components/effects/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { CASE_STUDIES } from "@/data/home-cases";
import { siteCtas } from "@/lib/cta";
import { absoluteUrl } from "@/lib/site";

const PAGE_PATH = "/cases";
const PAGE_TITLE = "Cases. SkinComplete, BestRest en Hills Pilates";
const PAGE_DESCRIPTION =
  "Echte trajecten: SkinComplete met B2B-portaal, SEO, ads en UGC. BestRest met custom Shopify-webshop. Hills Pilates met website from scratch, e-mail en boekingsapp.";

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
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Bewijs
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Cases die laten zien{" "}
              <span className="text-[#FF5722]">hoe wij denken en bouwen.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Geen stockfoto&apos;s. Wel drie echte trajecten met verschillende
              uitdagingen: B2B en campagnes, een volledige Shopify-shop, en een
              platform met app en agenda.
            </p>
            <Link
              href={siteCtas.samenwerken.href}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/25 transition hover:bg-orange-600"
            >
              {siteCtas.samenwerken.label}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </header>

        <section className="bg-gradient-to-b from-slate-50/80 to-white">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <ul className="grid gap-12 lg:gap-16">
              {CASE_STUDIES.map((c, i) => (
                <Reveal key={c.id} delay={0.06 * i}>
                  <li id={c.id}>
                    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_56px_-32px_rgba(15,23,42,0.12)]">
                      <div className="grid lg:grid-cols-2 lg:items-stretch">
                        <div className="border-b border-slate-100 bg-slate-50/50 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                          <CaseSceneIllustration
                            scene={c.scene}
                            accent={c.accent}
                            className="mx-auto w-full max-w-md"
                          />
                        </div>

                        <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                          <span
                            className="inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                            style={{ backgroundColor: c.accent }}
                          >
                            {c.eyebrow}
                          </span>
                          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                            {c.client}: {c.title}
                          </h2>
                          <p className="mt-4 text-base leading-relaxed text-slate-600">
                            {c.body}
                          </p>

                          <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {[
                              { label: "Uitdaging", text: c.challenge },
                              { label: "Onze aanpak", text: c.move },
                              { label: "Resultaat", text: c.result },
                            ].map((block) => (
                              <div
                                key={block.label}
                                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                              >
                                <p
                                  className="text-[10px] font-bold uppercase tracking-[0.14em]"
                                  style={{ color: c.accent }}
                                >
                                  {block.label}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                  {block.text}
                                </p>
                              </div>
                            ))}
                          </div>

                          <ul className="mt-6 flex flex-wrap gap-2">
                            {c.tags.map((tag) => (
                              <li
                                key={tag}
                                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700"
                              >
                                {tag}
                              </li>
                            ))}
                          </ul>

                          <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-100 pt-6">
                            <div>
                              <p className="text-3xl font-black tracking-tight text-slate-900">
                                {c.metric}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">{c.metricHint}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-950">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Jouw case hier?
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                We documenteren trajecten samen met jouw team. Eerlijk, meetbaar en
                commercieel sterk.
              </p>
              <Link
                href={siteCtas.groeiscan.href}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/25 transition hover:bg-orange-600"
              >
                Start met Groeiscan
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
