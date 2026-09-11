"use client";

import { useId, useState } from "react";

/**
 * Een lijst die op een telefoon ingeklapt begint en op desktop gewoon openstaat.
 *
 * Het zusje van LeesVerder, maar tweerichtings: een lijst van veertig tarieven wil je ook
 * weer dicht kunnen doen. De knop bestaat alleen onder lg; daarboven is er ruimte en staat
 * alles er zoals altijd.
 *
 * WAAROM HIJ ERUITZIET ALS EEN KNOP EN NIET ALS EEN REGEL.
 *
 * Hij was wit met een pijltje erachter. Op een witte kaart of een lichte sectie zag je
 * daardoor tekst met een teken ernaast, en niet iets om op te tikken. Yasin, 10 september
 * 2026: "je ziet niet echt dat het een uitklapbaar ding is." Nu heeft hij een rand, een
 * eigen vlak en een pijltje in een rondje: drie signalen die samen zeggen dat er iets onder
 * zit. Open kleurt het vlak mee, zodat je ziet welke lijst je hebt opengezet.
 *
 * TWEE VORMEN.
 *
 * `knop` is de gewone: een balk met een rand, die je aantikt om een lijst te openen.
 * `kop` is voor een kaart die zelf al een rand en een vlak heeft; daar is de titel van de
 * kaart de knop, met het pijltje ernaast. Yasin, 10 september 2026, over de kaarten met de
 * afzegregels: "maak die op mobiel uitklapbaar, je moet gewoon aantikken wat jouw geval is
 * en dan de rest lezen." Een tweede balk binnen zo een kaart zou daar een knop in een knop
 * van maken.
 */
export default function MobielInklap({
  children,
  label,
  labelOpen,
  vorm = "knop",
  className = "",
}: {
  children: React.ReactNode;
  /** Wat er op de knop staat zolang de lijst dicht is, bijvoorbeeld "Toon de 6 tarieven". */
  label: string;
  labelOpen?: string;
  /** `kop`: de titel van een kaart is de knop. Zie de toelichting hierboven. */
  vorm?: "knop" | "kop";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = `inklap-${useId().replace(/:/g, "")}`;
  const isKop = vorm === "kop";
  const opschrift = open ? (labelOpen ?? (isKop ? label : "Verberg")) : label;

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={
          isKop
            ? "diba-card-title flex w-full items-center justify-between gap-4 text-left text-[var(--t-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--g-700)] lg:hidden"
            : `diba-label flex min-h-13 w-full items-center justify-between gap-3 rounded-[var(--r-md)] border px-4 py-2.5 text-left transition-colors active:bg-[var(--g-075)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] lg:hidden ${
                open
                  ? "border-[var(--g-200)] bg-[var(--g-050)] text-[var(--g-800)]"
                  : "border-[var(--g-200)] bg-white text-[var(--t-strong)]"
              }`
        }
      >
        {opschrift}
        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--r-pill)] bg-[var(--g-050)] text-[var(--g-700)]"
        >
          <svg
            viewBox="0 0 12 12"
            className={`h-3 w-3 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 4.5 6 8l3.5-3.5" />
          </svg>
        </span>
      </button>
      <div id={id} className={open ? "max-lg:mt-3" : "max-lg:hidden"}>
        {children}
      </div>
    </div>
  );
}
