"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export interface ScrollSection {
  id: string;
  label: string;
  element: HTMLElement;
}

function getSectionLabel(section: HTMLElement): string {
  const ariaLabel = section.getAttribute("aria-label");
  if (ariaLabel?.trim()) return ariaLabel.trim();

  const labelledBy = section.getAttribute("aria-labelledby");
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    const text = labelEl?.textContent?.trim();
    if (text) return text.replace(/\s+/g, " ").slice(0, 72);
  }

  const heading = section.querySelector("h1, h2");
  const headingText = heading?.textContent?.trim();
  if (headingText) return headingText.replace(/\s+/g, " ").slice(0, 72);

  return "";
}

function scanSections(): ScrollSection[] {
  const elements = Array.from(
    document.querySelectorAll("main section"),
  ) as HTMLElement[];

  return elements
    .filter((el) => el.offsetHeight > 24)
    .map((el, index) => ({
      id: el.id || `scroll-section-${index}`,
      label: getSectionLabel(el),
      element: el,
    }))
    .filter((section) => section.label.length > 0);
}

function resolveActiveIndex(sections: ScrollSection[]): number {
  if (sections.length === 0) return 0;

  const anchor = window.scrollY + window.innerHeight * 0.32;
  let active = 0;

  for (let i = 0; i < sections.length; i++) {
    const top =
      sections[i].element.getBoundingClientRect().top + window.scrollY;
    if (top <= anchor + 1) active = i;
  }

  return active;
}

/** Detecteert zichtbare secties in `<main>` en welke actief is tijdens scrollen */
export function useScrollSections(enabled: boolean) {
  const pathname = usePathname();
  const [sections, setSections] = useState<ScrollSection[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setSections([]);
      setActiveIndex(0);
      return;
    }

    function refresh() {
      const next = scanSections();
      setSections(next);
      setActiveIndex(resolveActiveIndex(next));
    }

    refresh();
    const delayed = window.setTimeout(refresh, 450);

    const main = document.querySelector("main");
    const observer = main
      ? new MutationObserver(() => refresh())
      : null;
    observer?.observe(main!, { childList: true, subtree: true });

    window.addEventListener("resize", refresh, { passive: true });
    return () => {
      window.clearTimeout(delayed);
      observer?.disconnect();
      window.removeEventListener("resize", refresh);
    };
  }, [pathname, enabled]);

  useEffect(() => {
    if (!enabled || sections.length === 0) return;

    function onScroll() {
      setActiveIndex(resolveActiveIndex(sections));
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled, sections]);

  return {
    sections,
    activeIndex,
    activeSection: sections[activeIndex] ?? null,
  };
}
