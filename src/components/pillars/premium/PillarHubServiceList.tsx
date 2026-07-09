"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export interface PillarHubServiceListItem {
  readonly href: string;
  readonly name: string;
  readonly description: string;
  readonly tag?: string;
}

interface PillarHubServiceListProps {
  readonly heading: string;
  readonly hint: string;
  readonly items: readonly PillarHubServiceListItem[];
  readonly activeHref: string | null;
  readonly onActiveChange: (href: string | null) => void;
}

/**
 * Minimalistische dienstenkolom voor pillar-hubs: geen iconen, accent-lijn links.
 */
export function PillarHubServiceList({
  heading,
  hint,
  items,
  activeHref,
  onActiveChange,
}: PillarHubServiceListProps) {
  const reduce = useReducedMotion();

  return (
    <div>
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
        {heading}
      </p>
      <ul className="divide-y divide-slate-100">
        {items.map((item, index) => {
          const isActive = activeHref === item.href;

          return (
            <motion.li
              key={item.href}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.03 * index, duration: 0.35 }}
            >
              <Link
                href={item.href}
                onMouseEnter={() => onActiveChange(item.href)}
                onMouseLeave={() => onActiveChange(null)}
                onFocus={() => onActiveChange(item.href)}
                onBlur={() => onActiveChange(null)}
                className={[
                  "group relative flex items-start justify-between gap-4 rounded-xl py-4 pl-5 pr-2 transition-colors duration-300",
                  isActive ? "bg-[#FF5722]/5" : "hover:bg-slate-50/80",
                ].join(" ")}
              >
                <span
                  aria-hidden
                  className={[
                    "absolute left-0 top-1/2 w-0.5 -translate-y-1/2 rounded-full bg-[#FF5722] transition-all duration-300",
                    isActive ? "h-10 opacity-100" : "h-0 opacity-0 group-hover:h-6 group-hover:opacity-60",
                  ].join(" ")}
                />

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span
                      className={[
                        "text-sm font-extrabold tracking-tight transition-colors duration-300",
                        isActive ? "text-[#FF5722]" : "text-slate-900 group-hover:text-slate-800",
                      ].join(" ")}
                    >
                      {item.name}
                    </span>
                    {item.tag ? (
                      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
                        {item.tag}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                    {item.description}
                  </span>
                </span>

                <ArrowUpRight
                  aria-hidden
                  className={[
                    "mt-0.5 size-3.5 shrink-0 transition-all duration-300",
                    isActive
                      ? "translate-x-0.5 -translate-y-0.5 text-[#FF5722] opacity-100"
                      : "text-slate-300 opacity-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-400 group-hover:opacity-100",
                  ].join(" ")}
                />
              </Link>
            </motion.li>
          );
        })}
      </ul>

      <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 lg:text-left">
        {hint}
      </p>
    </div>
  );
}
