"use client";

import { useState } from "react";
import DeLijn from "@/components/ui/DeLijn";

const SESSIES = [
  { nr: 1, label: "Start", note: "Intake + huidtype + eerste sessie" },
  { nr: 3, label: "Opbouw", note: "Haarfollikels in rustfase bereiken" },
  { nr: 6, label: "Verschil", note: "Grover haar verdwijnt merkbaar" },
  { nr: 8, label: "Onderhoud", note: "Interval wordt ruimer [MEDISCHE-CHECK-ROJDA]" },
] as const;

/**
 * Boog met DeLijn — geen belofte, wel verwachtingskader.
 * Interactief: klik een punt, lees de toelichting.
 */
export default function LaserSessieBoog() {
  const [active, setActive] = useState(0);
  const pct = (active / (SESSIES.length - 1)) * 100;
  const current = SESSIES[active];

  return (
    <div className="rounded-[2rem] border border-[#dce8d9] bg-white p-7 sm:p-10">
      <p className="text-[10px] font-medium uppercase tracking-[.14em] text-[#5d9564]">
        Traject in beeld
      </p>
      <h3 className="mt-3 text-2xl tracking-[-.05em] sm:text-3xl">
        Laser is een reeks, geen enkel moment.
      </h3>

      <div className="relative mt-12">
        <svg
          viewBox="0 0 400 120"
          className="w-full max-h-[140px]"
          aria-hidden="true"
        >
          <path
            d="M 20 90 Q 200 10 380 90"
            fill="none"
            stroke="#dce8d9"
            strokeWidth="2"
          />
          {SESSIES.map((s, i) => {
            const t = i / (SESSIES.length - 1);
            const x = 20 + t * 360;
            const y = 90 - Math.sin(t * Math.PI) * 70;
            const on = i === active;
            return (
              <g key={s.nr}>
                <circle
                  cx={x}
                  cy={y}
                  r={on ? 10 : 7}
                  fill={on ? "#286943" : "#eff8ea"}
                  stroke={on ? "#286943" : "#95c592"}
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={y + 28}
                  textAnchor="middle"
                  className="fill-[#5f7765] text-[11px] font-medium uppercase tracking-wider"
                  style={{ fontSize: 10 }}
                >
                  {s.label}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="mt-6">
          <DeLijn length="full" dot={pct} />
        </div>
      </div>

      <div className="mt-8 rounded-[1.25rem] bg-[#f2f7ef] p-6">
        <p className="text-[10px] font-medium uppercase tracking-[.12em] text-[#5d9564]">
          Sessie {current.nr}
        </p>
        <p className="mt-2 text-lg text-[#17372a]">{current.note}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {SESSIES.map((s, i) => (
          <button
            key={s.nr}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={`rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[.12em] transition ${
              i === active
                ? "bg-[#286943] text-white"
                : "border border-[#dce8d9] bg-white text-[#286943] hover:bg-[#eff8ea]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
