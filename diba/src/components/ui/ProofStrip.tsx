"use client";

import { useEffect, useRef, useState } from "react";

/**
 * DIBA ProofStrip v3 — VERVANGT v2 (handtekening-batch 3.5, Addendum A3/A11)
 *
 * Wijzigingen t.o.v. v2 (alle v2-fixes blijven):
 *  1. Green Touch: cijfers standaard in INK (--ink-900), labels grijs.
 *     Nieuw `highlightLabel`: het ene cijfer dat er in déze context toe doet
 *     kleurt olijf (--diba-green-700). MAXIMAAL ÉÉN per strip — dat is de regel.
 *  2. Teller start net vóórdat de strip in beeld komt (rootMargin), zodat de
 *     0-staat in de praktijk vrijwel nooit zichtbaar is (footer-screenshot-punt).
 *  3. onDark (footer): cijfers crème, highlight salie (--diba-green-200).
 *
 * SSR/no-JS blijft de definitieve canonieke waarden tonen (§11).
 */

export type ProofItem = {
  value: number;
  suffix?: string;
  label: string;
};

const nf = new Intl.NumberFormat("nl-NL");
const fmt = (item: ProofItem, n: number) =>
  item.label === "Actief sinds" ? String(n) : nf.format(n);

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ProofStrip({
  items,
  onDark = false,
  highlightLabel,
}: {
  /** Koppel aan DIBA_PROOF_STRIP_ITEMS uit diba/src/lib/site.ts (§11) */
  items: ProofItem[];
  /** true in de footer: crème cijfers op diep den */
  onDark?: boolean;
  /** Label van het ENE cijfer dat in deze context olijf kleurt (Green Touch, A3) */
  highlightLabel?: string;
}) {
  const ref = useRef<HTMLDListElement>(null);
  const [progress, setProgress] = useState(1); // SSR: definitieve waarden
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    requestAnimationFrame(() => setProgress(0));

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();

        let start: number | null = null;
        const tick = (now: number) => {
          if (start === null) start = now;
          const t = Math.min(Math.max((now - start) / 800, 0), 1);
          setProgress(easeOut(t));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      // Start ~150px vóór zichtbaarheid: de gebruiker ziet nooit een statische 0.
      { threshold: 0.1, rootMargin: "0px 0px 150px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const line = onDark ? "border-[#387849]" : "border-[var(--g-100)]";
  const numBase = onDark ? "text-[var(--g-025)]" : "text-[var(--g-900)]";
  const numHi = onDark ? "text-[var(--on-dark-btn)]" : "text-[var(--g-700)]";
  const lab = onDark ? "text-[var(--on-dark-btn)] opacity-80" : "text-[var(--t-muted)]";

  return (
    <dl
      ref={ref}
      className={`grid grid-cols-2 gap-y-[var(--space-8)] border-y ${line}
                  py-[var(--space-8)] md:grid-cols-4 md:py-[var(--space-12)]`}
    >
      {items.map((item) => {
        const shown = Math.round(item.value * progress);
        const isHi = highlightLabel != null && item.label === highlightLabel;
        return (
          <div key={item.label} className="text-center">
            <dd
              className={`text-[40px] leading-none md:text-[64px] ${isHi ? numHi : numBase}
                          [font-family:var(--font-display)] font-semibold tracking-[0.02em]
                          [font-variant-numeric:tabular-nums]`}
            >
              {fmt(item, shown)}
              {item.suffix ?? ""}
            </dd>
            <dt
              className={`mt-[var(--space-2)] text-[13px] leading-[1.45] ${lab}`}
            >
              {item.label}
            </dt>
          </div>
        );
      })}
    </dl>
  );
}
