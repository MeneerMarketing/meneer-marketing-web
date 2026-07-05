"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
}

function resolveActiveId(items: TocItem[]): string {
  const sections = items
    .map((item) => {
      const el = document.getElementById(item.id);
      return el ? { id: item.id, top: el.getBoundingClientRect().top + window.scrollY } : null;
    })
    .filter((entry): entry is { id: string; top: number } => entry !== null);

  if (sections.length === 0) return items[0]?.id ?? "";

  const anchor = window.scrollY + window.innerHeight * 0.22;
  let active = sections[0]!.id;

  for (const section of sections) {
    if (section.top <= anchor + 1) active = section.id;
  }

  return active;
}

/**
 * Inhoudsopgave die live meeloopt met je scrollpositie:
 * het oranje bolletje schuift naar de sectie waar je nu bent.
 */
export function PageTOC({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    let rafId = 0;

    function update() {
      setActiveId(resolveActiveId(itemsRef.current));
    }

    function onScroll() {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
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
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150 ${
                  isActive
                    ? "font-bold text-slate-900"
                    : "font-medium text-slate-400 hover:text-slate-700"
                }`}
              >
                <span className="relative flex size-2 shrink-0 items-center justify-center">
                  <span
                    className={`size-1.5 rounded-full transition-colors duration-150 ${
                      isActive ? "bg-transparent" : "bg-slate-300"
                    }`}
                    aria-hidden
                  />
                  {isActive ? (
                    <motion.span
                      layoutId="toc-dot"
                      transition={{ type: "spring", stiffness: 520, damping: 32 }}
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
