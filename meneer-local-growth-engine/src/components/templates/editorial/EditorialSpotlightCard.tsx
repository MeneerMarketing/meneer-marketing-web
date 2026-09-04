"use client";

import {
  useCallback,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Kaart met licht dat de cursor volgt. De positie gaat als custom property naar
 * CSS, dus er is geen state en geen re-render per beweging. Eén rAF per frame
 * houdt het op de compositor.
 */
export function EditorialSpotlightCard({ children, className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  const handleMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--ed-spot-x", `${x}%`);
      el.style.setProperty("--ed-spot-y", `${y}%`);
    });
  }, []);

  return (
    <article ref={ref} onPointerMove={handleMove} className={`ed-spot ${className}`}>
      <span aria-hidden className="ed-spot-layer" />
      {children}
    </article>
  );
}
