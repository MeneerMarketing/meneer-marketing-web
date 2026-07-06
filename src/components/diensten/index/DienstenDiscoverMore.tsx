import Link from "next/link";
import { ArrowUpRight, BookOpen, MapPin, Route } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { DIENSTEN_DISCOVER } from "@/data/diensten-index";

const ICONS = {
  Kennisbank: BookOpen,
  "Zoeken per regio": MapPin,
  Werkwijze: Route,
} as const;

export function DienstenDiscoverMore() {
  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="diensten-discover-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <h2
            id="diensten-discover-heading"
            className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            {DIENSTEN_DISCOVER.title}
          </h2>
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {DIENSTEN_DISCOVER.items.map((item) => {
            const Icon = ICONS[item.label as keyof typeof ICONS] ?? BookOpen;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-slate-300 hover:bg-white hover:shadow-md"
                  style={{ borderTopWidth: 3, borderTopColor: item.accent }}
                >
                  <span
                    className="flex size-11 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: item.accent }}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold text-slate-900 group-hover:text-[#FF5722]">
                    {item.label}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-slate-900">
                    Bekijk
                    <ArrowUpRight className="size-4 text-[#FF5722]" aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
