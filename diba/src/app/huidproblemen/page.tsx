import type { Metadata } from "next";
import Link from "next/link";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs } from "@/components/figma/FigmaTemplateUi";
import { PILLAR_GROUPS } from "@/data/doelgroep";
import { PILLARS } from "@/data/pillars";
import { publicCopy } from "@/lib/copy-flags";
import { figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaCardWhite,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
  figmaSectionTight,
} from "@/lib/figma-inner-layout";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";
import { SchemaMarkup, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Huidproblemen",
  description: "Alle huidproblemen die Diba Clinics behandelt, eerlijk uitgelegd.",
};

function pillarBySlug(slug: string) {
  return PILLARS.find((p) => p.slug === slug);
}

export default function HuidproblemenPage() {
  return (
    <main className="pb-20">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: PAGE_DEFAULTS.siteUrl },
          { name: "Huidproblemen", url: `${PAGE_DEFAULTS.siteUrl}/huidproblemen` },
        ])}
      />

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Huidproblemen" },
          ]}
        />
        <p className={figmaLabel}>Huidproblemen</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text="Uw huid, *eerlijk* bekeken"
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-7 max-w-2xl ${figmaBody}`}>
          {publicCopy(
            "Elke pagina start met De Nulmeting. Soms is het advies om niet te behandelen. Dat hoort erbij.",
          )}
        </p>
        <div className="mt-9 flex flex-col items-start gap-4">
          <Link href="/intake" className={figmaBtnPrimary}>
            Start uw intake (4 min) ↗
          </Link>
          <Link
            href="/doelgroep"
            className="text-[13px] font-medium text-[#286943] underline-offset-4 transition hover:underline"
          >
            Bekijk doelgroepen →
          </Link>
        </div>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSectionTight} pb-24`}>
        <div className="flex flex-col gap-16">
          {PILLAR_GROUPS.map((group) => (
            <div key={group.label} data-reveal>
              <FigmaHeading as="h2" size="section" text={group.label} />
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.slugs.map((slug) => {
                  const p = pillarBySlug(slug);
                  if (!p) return null;
                  return (
                    <li key={slug}>
                      <Link
                        href={`/huidproblemen/${slug}`}
                        className={`${figmaCardWhite} group flex min-h-[132px] flex-col justify-between p-6 transition
                                    hover:-translate-y-1 hover:border-[#95c592] hover:shadow-[0_14px_35px_rgba(35,100,62,.12)]
                                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                                    focus-visible:outline-[#286943] motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
                      >
                        <span className="text-lg font-medium tracking-[-.03em] text-[#17372a]">
                          {p.titel.replace(/\*/g, "")}
                        </span>
                        <span className="mt-5 text-[11px] font-semibold uppercase tracking-[.1em] text-[#286943]">
                          Bekijk het traject →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
