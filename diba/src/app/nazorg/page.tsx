import type { Metadata } from "next";
import Link from "next/link";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs } from "@/components/figma/FigmaTemplateUi";
import NazorgTijdlijn from "@/components/ui/NazorgTijdlijn";
import { NAZORG_TRAJECTEN } from "@/data/nazorg";
import { publicCopy } from "@/lib/copy-flags";
import { figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaCardSoft,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
  figmaSectionTight,
} from "@/lib/figma-inner-layout";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";
import { SchemaMarkup, breadcrumbSchema } from "@/lib/schema";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";

export const metadata: Metadata = {
  title: "Nazorg",
  description: "Wat je kunt verwachten na je behandeling bij Diba Clinics.",
  ...NOG_IN_AANBOUW,
};

export default function NazorgPage() {
  return (
    <main className="pb-20">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: PAGE_DEFAULTS.siteUrl },
          { name: "Nazorg", url: `${PAGE_DEFAULTS.siteUrl}/nazorg` },
        ])}
      />

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Nazorg" }]}
        />
        <p className={figmaLabel}>Nazorg</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text="Nazorg, *concreet*"
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-7 max-w-2xl ${figmaBody}`}>
          {publicCopy(
            "Wat je kunt verwachten na je behandeling. Per traject, zonder vaagheid.",
          )}
        </p>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSectionTight} pb-24`}>
        <div className="flex flex-col gap-8">
          {NAZORG_TRAJECTEN.map((t) => (
            <article
              key={t.slug}
              className={`${figmaCardSoft} p-7 sm:p-10`}
              data-reveal
            >
              <FigmaHeading as="h2" size="card" text={t.titel} />
              <p className={`mt-4 max-w-2xl ${figmaBody}`}>
                {publicCopy(t.intro)}
              </p>
              <div className="mt-8">
                <NazorgTijdlijn momenten={t.momenten} />
              </div>
              <p className="mt-6">
                <Link
                  href={t.pillarHref}
                  className="text-[14px] font-medium text-[#286943] underline-offset-4 hover:underline"
                >
                  Lees het volledige traject →
                </Link>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f2f7ef]" data-reveal>
        <div className={`${figmaInnerContainer} ${figmaSection} text-center`}>
          <Link href="/intake" className={figmaBtnPrimary}>
            Start je intake (4 min) ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
