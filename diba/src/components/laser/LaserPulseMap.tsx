"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LASER_ZONE_AREAS, type LaserZoneArea } from "@/data/laser-zones";

const ZONE_CHIPS: Record<LaserZoneArea, readonly string[]> = {
  gelaat: ["Kin", "Bovenlip", "Wangen", "Volledig gelaat"],
  bovenlichaam: ["Oksel", "Armen", "Rug", "Borst", "Buik"],
  onderlichaam: ["Bikinilijn", "Benen", "Dijen", "Billen"],
  pakket: ["Gelaat compleet", "Bovenlichaam", "Full body"],
};

/** Silhouet + gebiedskiezer — visuele ingang naar de configurator. */
export default function LaserPulseMap() {
  const [active, setActive] = useState<LaserZoneArea>("gelaat");
  const chips = useMemo(() => ZONE_CHIPS[active], [active]);

  const glowY =
    active === "gelaat" ? "22%" : active === "bovenlichaam" ? "48%" : "72%";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
      <div className="relative mx-auto aspect-[3/4] w-full max-w-[300px]">
        <div
          aria-hidden="true"
          className="absolute left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[#5eae67]/25 blur-2xl transition-all duration-500 motion-reduce:transition-none"
          style={{ top: glowY }}
        />
        <svg
          viewBox="0 0 100 100"
          className="relative h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="laser-body" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#dce8d9" />
              <stop offset="100%" stopColor="#b5df9d" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="18" rx="12" ry="14" fill="url(#laser-body)" />
          <path
            d="M38 32 Q50 28 62 32 L66 78 Q50 88 34 78 Z"
            fill="url(#laser-body)"
            opacity="0.9"
          />
          <ellipse
            cx="50"
            cy={active === "gelaat" ? 18 : active === "bovenlichaam" ? 48 : 72}
            rx={active === "gelaat" ? 14 : 18}
            ry={active === "gelaat" ? 16 : 14}
            fill="none"
            stroke="#286943"
            strokeWidth="1.2"
            opacity="0.55"
          />
        </svg>
      </div>

      <div className="rounded-[2rem] bg-[#eff8ea] p-7 sm:p-9">
        <p className="text-[10px] font-medium uppercase tracking-[.14em] text-[#5d9564]">
          Zones
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {LASER_ZONE_AREAS.filter((a) => a.id !== "pakket").map((area) => (
            <button
              key={area.id}
              type="button"
              aria-pressed={active === area.id}
              onClick={() => setActive(area.id)}
              className={`rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[.12em] transition ${
                active === area.id
                  ? "bg-[#286943] text-white"
                  : "border border-[#cbe5bf] bg-white text-[#397249] hover:bg-white/80"
              }`}
            >
              {area.label}
            </button>
          ))}
        </div>
        <h3 className="mt-6 text-3xl tracking-[-.05em] text-[#17372a]">
          Stel je zones samen.
        </h3>
        <p className="mt-4 text-sm leading-6 text-[#5f7765]">
          In de configurator zie je direct je prijsopbouw. Pakketten vervangen
          overlappende losse zones automatisch.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {chips.map((zone) => (
            <li
              key={zone}
              className="rounded-full border border-[#cbe5bf] bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-[.1em] text-[#397249]"
            >
              {zone}
            </li>
          ))}
        </ul>
        <Link
          href="/laserontharing/configurator"
          className="mt-8 inline-flex rounded-full bg-[#286943] px-6 py-4 text-[11px] font-medium uppercase tracking-[.13em] text-white transition hover:bg-[#174e31]"
        >
          Open configurator ↗
        </Link>
      </div>
    </div>
  );
}
