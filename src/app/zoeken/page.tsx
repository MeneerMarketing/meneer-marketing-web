import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getAllSeoLandingPages } from "@/data/seo-landings/registry";
import { absoluteUrl } from "@/lib/site";
import { seoLandingPath } from "@/lib/seo-landings";

export const metadata: Metadata = {
  title: "Zoeken · diensten & regio | Meneer Marketing",
  description:
    "Landingspagina's per zoekwoord: Google Ads, SEO, websites, webshops en meer. Meneer Marketing, online marketing from scratch.",
  alternates: { canonical: absoluteUrl("/zoeken") },
};

export default function ZoekenIndexPage() {
  const pages = getAllSeoLandingPages();
  const national = pages.filter((p) => !p.location);
  const local = pages.filter((p) => p.location);

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-slate-200 bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Vindbaarheid
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
              Waar mensen op zoeken. Waar jij gevonden wilt worden.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-600">
              Per zoekwoord een pagina die rankt én converteert. Geen dunne SEO-prutswerk,
              wel Meneer Marketing: scherp, eerlijk, soms een beetje droog grappig.
            </p>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <h2 className="text-xl font-extrabold text-slate-900">Diensten</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {national.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={seoLandingPath(page.slug)}
                    className="group flex h-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-[#FF5722]/35 hover:shadow-md"
                  >
                    <span className="font-bold text-slate-900 capitalize">
                      {page.primaryKeyword}
                    </span>
                    <ArrowUpRight className="size-4 text-slate-400 transition group-hover:text-[#FF5722]" />
                  </Link>
                </li>
              ))}
            </ul>

            {local.length > 0 ? (
              <>
                <h2 className="mt-14 text-xl font-extrabold text-slate-900">Regio</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {local.map((page) => (
                    <li key={page.slug}>
                      <Link
                        href={seoLandingPath(page.slug)}
                        className="group flex h-full items-center justify-between rounded-2xl border border-slate-200 bg-orange-50/40 px-4 py-4 transition hover:border-[#FF5722]/35"
                      >
                        <span className="font-bold text-slate-900 capitalize">
                          {page.primaryKeyword}
                        </span>
                        <ArrowUpRight className="size-4 text-slate-400 transition group-hover:text-[#FF5722]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
