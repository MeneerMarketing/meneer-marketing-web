"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
}

/**
 * Inhoudsopgave die live meeloopt met je scrollpositie:
 * het oranje bolletje schuift naar de sectie waar je nu bent.
 */
export function PageTOC({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav aria-label="Op deze pagina">
      <ul className="space-y-0.5">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className="relative">
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-200 ${
                  isActive
                    ? "font-bold text-slate-900"
                    : "font-medium text-slate-400 hover:text-slate-700"
                }`}
              >
                <span className="relative flex size-2 shrink-0 items-center justify-center">
                  <span
                    className={`size-1.5 rounded-full transition-colors duration-200 ${
                      isActive ? "bg-transparent" : "bg-slate-300"
                    }`}
                    aria-hidden
                  />
                  {isActive ? (
                    <motion.span
                      layoutId="toc-dot"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      className="absolute size-2 rounded-full bg-[#FF5722]"
                      aria-hidden
                    />
                  ) : null}
                </span>
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
