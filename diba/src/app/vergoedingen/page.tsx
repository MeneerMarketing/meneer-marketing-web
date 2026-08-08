import type { Metadata } from "next";
import Link from "next/link";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs } from "@/components/figma/FigmaTemplateUi";
import { INSURERS } from "@/data/insurers";
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
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";

export const metadata: Metadata = {
  title: "Vergoedingen",
  description: "Wat je zorgverzekering vergoedt bij Diba Clinics.",
  ...NOG_IN_AANBOUW,
};

export default function VergoedingenPage() {
  return (
    <main className="pb-20">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: PAGE_DEFAULTS.siteUrl },
          {
            name: "Vergoedingen",
            url: `${PAGE_DEFAULTS.siteUrl}/vergoedingen`,
          },
        ])}
      />

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Vergoedingen" }]}
        />
        <p className={figmaLabel}>Vergoedingen</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text="Wat *jouw* verzekering vergoedt"
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-7 max-w-2xl ${figmaBody}`}>
          {publicCopy(
            "Sommige behandelingen vallen onder aanvullende verzekering. Elke verzekeraar hanteert eigen voorwaarden.",
          )}
        </p>
      </section>

      <section
        className={`${figmaInnerContainer} ${figmaSectionTight}`}
        data-reveal
      >
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {INSURERS.map((v) => (
            <li key={v.slug}>
              <Link
                href={`/vergoedingen/${v.slug}`}
                className={`${figmaCardWhite} flex min-h-[72px] items-center p-5 text-[15px] font-medium text-[#17372a] transition
                            hover:-translate-y-1 hover:border-[#95c592] hover:shadow-[0_14px_35px_rgba(35,100,62,.12)]
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                            focus-visible:outline-[#286943] motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
              >
                {v.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className={`mt-8 max-w-2xl ${figmaBody}`}>
          {publicCopy(
            "Controleer je polis of start de intake. Wij helpen je de juiste route te kiezen.",
          )}
        </p>
      </section>

      <section className={`${figmaInnerContainer} pb-24 pt-4`} data-reveal>
        <Link href="/intake" className={figmaBtnPrimary}>
          Check je vergoeding via intake ↗
        </Link>
      </section>
    </main>
  );
}
