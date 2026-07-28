"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs, FigmaFilterPills } from "@/components/figma/FigmaTemplateUi";
import PriceTable from "@/components/ui/PriceTable";
import {
  PRICE_CATEGORIES,
  sectionsForCategory,
  type PriceCategory,
} from "@/data/prices";
import { figmaBtnMint, figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaCardWhite,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
  figmaSectionTight,
} from "@/lib/figma-inner-layout";

export default function PrijzenTemplate() {
  const [category, setCategory] = useState<PriceCategory>("alle");
  const sections = useMemo(() => sectionsForCategory(category), [category]);

  return (
    <main className="pb-20">
      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Prijzen" },
          ]}
        />
        <p className={figmaLabel}>Prijzen</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text="Prijzen, *openbaar*"
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-7 max-w-2xl ${figmaBody}`}>
          Trajectprijs naast losse prijs. Termijnbedrag klein eronder. Filter op categorie.
        </p>
        <FigmaFilterPills
          className="mt-9"
          items={PRICE_CATEGORIES}
          value={category}
          onChange={setCategory}
          ariaLabel="Prijscategorie"
        />
      </section>

      <section className={`${figmaInnerContainer} ${figmaSectionTight}`}>
        <div className="flex flex-col gap-10">
          {sections.map((s) => (
            <div
              key={s.id}
              className={`${figmaCardWhite} max-w-3xl overflow-x-auto p-6 sm:p-8`}
              data-reveal
            >
              <PriceTable caption={s.caption} rows={[...s.rows]} />
            </div>
          ))}
        </div>
      </section>

      <section className={`${figmaInnerContainer} pb-24 pt-8`} data-reveal>
        <div className="flex flex-col items-start gap-4">
          <Link href="/laserontharing/configurator" className={figmaBtnPrimary}>
            Bereken uw laserprijs ↗
          </Link>
          <Link href="/intake" className={figmaBtnMint}>
            Start uw intake (4 min) ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
