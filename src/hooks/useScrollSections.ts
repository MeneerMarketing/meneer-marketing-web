"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { resolveScrollSectionHint } from "@/data/scroll-section-hints";

export interface ScrollSection {
  id: string;
  label: string;
  element: HTMLElement;
}

/** Waar in het viewport we de actieve sectie bepalen (iets onder de top). */
const VIEWPORT_ANCHOR_RATIO = 0.22;
/** Onderkant van de pagina: footer actief houden. */
const NEAR_PAGE_END_PX = 64;
/** Footer telt als actief zodra hij dit deel van het scherm vult. */
const FOOTER_DOMINANCE_RATIO = 0.35;

function getSectionLabel(el: HTMLElement): string {
  return resolveScrollSectionHint(el);
}

function elementTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY;
}

function isTopLevelSection(el: HTMLElement, main: HTMLElement): boolean {
  let parent = el.parentElement;
  while (parent && parent !== main) {
    if (parent.tagName === "SECTION") return false;
    parent = parent.parentElement;
  }
  return true;
}

function scanSections(): ScrollSection[] {
  const main = document.querySelector("main");
  if (!main) return [];

  const landmarks: HTMLElement[] = [];

  const pageHeader = main.querySelector(":scope > header, :scope > article > header");
  if (pageHeader instanceof HTMLElement && pageHeader.offsetHeight > 24) {
    landmarks.push(pageHeader);
  }

  const sections = Array.from(main.querySelectorAll("section")).filter(
    (el): el is HTMLElement =>
      el instanceof HTMLElement &&
      el.offsetHeight > 24 &&
      isTopLevelSection(el, main),
  );

  for (const section of sections) {
    if (!landmarks.includes(section)) landmarks.push(section);
  }

  const footer = document.querySelector("footer");
  if (
    footer instanceof HTMLElement &&
    footer.offsetHeight > 24 &&
    !landmarks.includes(footer)
  ) {
    landmarks.push(footer);
  }

  return landmarks
    .map((el, index) => ({
      id: el.id || `scroll-section-${index}`,
      label: getSectionLabel(el),
      element: el,
    }))
    .filter((section) => section.label.length > 0);
}

function isNearPageEnd(): boolean {
  const doc = document.documentElement;
  return window.scrollY + window.innerHeight >= doc.scrollHeight - NEAR_PAGE_END_PX;
}

function isFooterDominant(footer: HTMLElement): boolean {
  const rect = footer.getBoundingClientRect();
  const vh = window.innerHeight;
  if (rect.bottom <= 0 || rect.top >= vh) return false;
  const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  return visible >= vh * FOOTER_DOMINANCE_RATIO;
}

function resolveActiveIndex(sections: ScrollSection[]): number {
  if (sections.length === 0) return 0;

  const footerIndex = sections.findIndex(
    (section) => section.element.tagName === "FOOTER",
  );
  if (footerIndex >= 0) {
    const footer = sections[footerIndex]!.element;
    if (isNearPageEnd() || isFooterDominant(footer)) {
      return footerIndex;
    }
  }

  const anchor = window.scrollY + window.innerHeight * VIEWPORT_ANCHOR_RATIO;
  let active = 0;

  for (let i = 0; i < sections.length; i++) {
    const top = elementTop(sections[i].element);
    if (top <= anchor + 1) active = i;
  }

  return active;
}

/** Detecteert zichtbare secties in `<main>` en welke actief is tijdens scrollen */
export function useScrollSections(enabled: boolean) {
  const pathname = usePathname();
  const [sections, setSections] = useState<ScrollSection[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionsRef = useRef<ScrollSection[]>([]);

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  useEffect(() => {
    if (!enabled) {
      setSections([]);
      setActiveIndex(0);
      return;
    }

    let debounceId: number | undefined;

    function refresh() {
      const next = scanSections();
      sectionsRef.current = next;
      setSections(next);
      setActiveIndex(resolveActiveIndex(next));
    }

    refresh();
    const delayed = window.setTimeout(refresh, 200);

    const main = document.querySelector("main");
    const observer = main
      ? new MutationObserver(() => {
          if (debounceId) window.clearTimeout(debounceId);
          debounceId = window.setTimeout(refresh, 120);
        })
      : null;
    observer?.observe(main!, { childList: true, subtree: true });

    window.addEventListener("resize", refresh, { passive: true });
    return () => {
      window.clearTimeout(delayed);
      if (debounceId) window.clearTimeout(debounceId);
      observer?.disconnect();
      window.removeEventListener("resize", refresh);
    };
  }, [pathname, enabled]);

  useEffect(() => {
    if (!enabled) return;

    let rafId = 0;

    function updateActive() {
      setActiveIndex(resolveActiveIndex(sectionsRef.current));
    }

    function onScroll() {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateActive();
      });
    }

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled, pathname]);

  return {
    sections,
    activeIndex,
    activeSection: sections[activeIndex] ?? null,
  };
}
