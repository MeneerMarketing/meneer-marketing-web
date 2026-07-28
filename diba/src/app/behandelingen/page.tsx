import type { Metadata } from "next";
import Link from "next/link";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs } from "@/components/figma/FigmaTemplateUi";
import TreatmentCard from "@/components/ui/TreatmentCard";
import { TREATMENT_CARDS } from "@/data/treatments";
import { publicCopy } from "@/lib/copy-flags";
import { figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
  figmaSectionTight,
} from "@/lib/figma-inner-layout";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";
import { SchemaMarkup, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Behandelingen",
  description: "Alle behandelingen van Diba Clinics, openbaar en eerlijk geprijsd.",
};

export default function BehandelingenPage() {
  return (
    <main className="pb-20">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: PAGE_DEFAULTS.siteUrl },
          { name: "Behandelingen", url: `${PAGE_DEFAULTS.siteUrl}/behandelingen` },
        ])}
      />

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Behandelingen" },
          ]}
        />
        <p className={figmaLabel}>Behandelingen</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text="Alle behandelingen, *openbaar*"
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-7 max-w-2xl ${figmaBody}`}>
          {publicCopy(
            "Elke behandeling start met De Nulmeting. Prijzen staan op de pagina, geen verrassingen achteraf.",
          )}
        </p>
        <div className="mt-9">
          <Link href="/intake" className={figmaBtnPrimary}>
            Start uw intake (4 min) ↗
          </Link>
        </div>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSectionTight} pb-24`}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
          {TREATMENT_CARDS.map((card) => (
            <li key={card.slug}>
              <TreatmentCard {...card} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
