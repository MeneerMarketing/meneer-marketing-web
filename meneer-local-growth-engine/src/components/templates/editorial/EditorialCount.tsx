"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
}

/** Voorloop, getal met optionele decimaal, achtervoegsel. */
const NUMERIC = /^(\D*?)(\d+(?:[.,]\d+)?)(\D*)$/;

/**
 * Telt een cijfer op wanneer het in beeld komt. Waarden zonder getal, zoals een
 * plaatsnaam, blijven staan. De echte waarde staat altijd in de DOM voor
 * screenreaders, dus de animatie is puur visueel.
 */
export function EditorialCount({ value }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const parsed = NUMERIC.exec(value);
    if (!parsed) return;

    const [, prefix = "", raw = "", suffix = ""] = parsed;
    const separator = raw.includes(",") ? "," : ".";
    const target = Number(raw.replace(",", "."));
    if (!Number.isFinite(target)) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const decimals = raw.includes(separator)
      ? (raw.split(separator)[1]?.length ?? 0)
      : 0;
    const format = (input: number) =>
      `${prefix}${input.toFixed(decimals).replace(".", separator)}${suffix}`;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const duration = 1150;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(format(target * eased));
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      <span aria-hidden>{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
