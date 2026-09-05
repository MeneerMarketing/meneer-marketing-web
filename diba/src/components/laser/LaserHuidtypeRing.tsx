"use client";

import { useState } from "react";
import { FITZPATRICK_TYPES, type FitzpatrickId } from "@/data/laser-zones";

/** Ring van huidtypes I–VI — GentleMax Pro context. */
export default function LaserHuidtypeRing() {
  const [selected, setSelected] = useState<FitzpatrickId>("III");
  const current = FITZPATRICK_TYPES.find((t) => t.id === selected)!;

  return (
    <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
      <div
        className="relative mx-auto grid h-52 w-52 place-items-center sm:h-60 sm:w-60"
        role="radiogroup"
        aria-label="Fitzpatrick huidtype"
      >
        <div
          aria-hidden="true"
          className="absolute inset-4 rounded-full bg-[var(--g-100)] [mask:radial-gradient(circle,transparent_calc(50%-1px),#000_calc(50%-1px))]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-10 rounded-full bg-[var(--on-dark-accent)]/50 [mask:radial-gradient(circle,transparent_calc(50%-1px),#000_calc(50%-1px))]"
        />
        {FITZPATRICK_TYPES.map((type, i) => {
          const angle =
            (i / FITZPATRICK_TYPES.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 42;
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;
          const on = type.id === selected;
          return (
            <button
              key={type.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setSelected(type.id)}
              className={`absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[11px] font-medium transition sm:h-11 sm:w-11 ${
                on
                  ? "bg-[var(--g-700)] text-white shadow-[0_8px_24px_rgba(40,105,67,.25)]"
                  : "bg-white text-[var(--g-700)] hover:bg-[var(--g-100)]"
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {type.id}
            </button>
          );
        })}
        <span className="text-center text-[10px] font-medium uppercase tracking-[.14em] text-[var(--t-label)]">
          Fitzpatrick
        </span>
      </div>

      <div>
        <p className="text-[10px] font-medium uppercase tracking-[.14em] text-[var(--t-label)]">
          Huidtype {current.label}
        </p>
        <h3 className="mt-3 text-2xl tracking-[-.05em] sm:text-3xl">
          {current.description}
        </h3>
        <p className="mt-4 text-sm leading-6 text-[var(--t-muted)]">
          {/* [MEDISCHE-CHECK-ROJDA]: de uitspraak over Fitzpatrick I tot VI. De vlag
              stond in de zin zelf en dus op het scherm. */}
          De GentleMax Pro werkt op Fitzpatrick I tot en met VI. In de
          configurator kies je je type; de energie en de koeling worden daarop
          afgestemd.
        </p>
      </div>
    </div>
  );
}
