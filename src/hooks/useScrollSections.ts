"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export interface ScrollSection {
  id: string;
  label: string;
  element: HTMLElement;
}

/** Waar in het viewport we de actieve sectie bepalen (iets onder de top). */
const VIEWPORT_ANCHOR_RATIO = 0.22;

function getSectionLabel(el: HTMLElement): string {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel?.trim()) return ariaLabel.trim();

  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    const text = labelEl?.textContent?.trim();
    if (text) return text.replace(/\s+/g, " ").slice(0, 72);
  }

  const heading = el.querySelector("h1, h2");
  const headingText = heading?.textContent?.trim();
  if (headingText) return headingText.replace(/\s+/g, " ").slice(0, 72);

  return "";
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

  return landmarks
    .map((el, index) => ({
      id: el.id || `scroll-section-${index}`,
      label: getSectionLabel(el),
      element: el,
    }))
    .filter((section) => section.label.length > 0);
}

function resolveActiveIndex(sections: ScrollSection[]): number {
  if (sections.length === 0) return 0;

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
