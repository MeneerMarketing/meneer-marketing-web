"use client";

import { useMemo, useState } from "react";
import Label from "@/components/ui/Label";
import PriceTable from "@/components/ui/PriceTable";
import {
  PRICE_CATEGORIES,
  VOORLOPIGE_PRIJZEN,
  sectionsForCategory,
  type PriceCategory,
} from "@/data/prices";

/**
 * De prijslijst met haar filter.
 *
 * Alleen dit stuk is client, de rest van de pagina niet. Het filter is het enige wat hier
 * beweegt en dat hoeft geen hele pagina mee te nemen.
 *
 * Bewust géén zoekveld en geen inklapbare secties. Een prijslijst waarin je moet zoeken
 * verbergt iets, en dat is precies wat deze site niet doet: alles staat er, altijd,
 * uitgeklapt.
 */
export default function Prijslijst() {
  const [categorie, setCategorie] = useState<PriceCategory>("alle");
  const secties = useMemo(() => sectionsForCategory(categorie), [categorie]);

  return (
    <div>
      <div role="tablist" aria-label="Prijscategorie" className="flex flex-wrap gap-2">
        {PRICE_CATEGORIES.map((c) => (
          <button
            key={c.id}
            role="tab"
            type="button"
            aria-selected={c.id === categorie}
            onClick={() => setCategorie(c.id)}
            className={`diba-label inline-flex min-h-12 items-center rounded-[var(--r-pill)] px-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
              c.id === categorie
                ? "diba-pill-active"
                : "bg-white text-[var(--t-label)] hover:bg-[var(--g-050)]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {VOORLOPIGE_PRIJZEN ? (
        <p className="mt-6 max-w-[62ch] rounded-[var(--r-sm)] bg-[var(--g-050)] p-5 text-[15px] leading-7 text-[var(--t-body)]">
          De bedragen hieronder zijn voorlopig en nog niet door de kliniek vastgesteld.
          Wat er wel al klopt is de indeling: welke behandelingen er zijn, welke zones er
          bestaan en wat een pakket vervangt.
        </p>
      ) : null}

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {secties.map((s) => (
          <section
            key={s.id}
            className="overflow-x-auto rounded-[var(--r-md)] bg-white p-6 sm:p-8"
          >
            {s.zin ? (
              <p className="mb-5 max-w-[52ch] text-[14px] leading-6 text-[var(--t-muted)]">
                {s.zin}
              </p>
            ) : null}
            <PriceTable caption={s.caption} rows={[...s.rows]} />
          </section>
        ))}
      </div>

      {secties.length === 0 ? (
        <p className="mt-10 text-[16px] leading-7 text-[var(--t-body)]">
          Er staat nog niets onder deze categorie.
        </p>
      ) : null}

      <p className="mt-8 max-w-[62ch] text-[14px] leading-6 text-[var(--t-muted)]">
        <Label>Geen sterretjes</Label>
        <span className="mt-2 block">
          Er staan hier geen voetnoten met voorwaarden en geen bedragen die pas aan de
          balie compleet worden. Wat je hier ziet is wat een sessie kost.
        </span>
      </p>
    </div>
  );
}
