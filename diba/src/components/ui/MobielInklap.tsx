"use client";

import { useId, useState } from "react";

/**
 * Een lijst die op een telefoon ingeklapt begint en op desktop gewoon openstaat.
 *
 * Het zusje van LeesVerder, maar tweerichtings: een lijst van veertig tarieven wil je ook
 * weer dicht kunnen doen. De knop bestaat alleen onder lg; daarboven is er ruimte en staat
 * alles er zoals altijd.
 */
export default function MobielInklap({
  children,
  label,
  labelOpen = "Verberg",
  className = "",
}: {
  children: React.ReactNode;
  /** Wat er op de knop staat zolang de lijst dicht is, bijvoorbeeld "Toon de 6 tarieven". */
  label: string;
  labelOpen?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = `inklap-${useId().replace(/:/g, "")}`;

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="diba-label flex min-h-12 w-full items-center justify-between gap-3 rounded-[var(--r-md)] bg-white px-4 text-left text-[var(--t-strong)] active:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] lg:hidden"
      >
        {open ? labelOpen : label}
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 shrink-0 text-[var(--g-700)] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </button>
      <div id={id} className={open ? "max-lg:mt-3" : "max-lg:hidden"}>
        {children}
      </div>
    </div>
  );
}
