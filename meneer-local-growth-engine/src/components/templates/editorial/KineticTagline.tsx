"use client";

import { useEffect, useState } from "react";

interface Props {
  words: string[];
  className?: string;
}

/** Cycles emphasis through tagline words — editorial kinetic moment. */
export function KineticTagline({ words, className = "" }: Props) {
  const [active, setActive] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(reduced);
    if (reduced || words.length < 2) return;

    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % words.length);
    }, 2200);

    return () => window.clearInterval(id);
  }, [words.length]);

  return (
    <h1 className={className}>
      {words.map((word, index) => {
        const isActive = reduce ? index === 0 : index === active;
        return (
          <span key={`${word}-${index}`} className="inline">
            <span
              className={`inline-block transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                isActive
                  ? "translate-y-0 italic text-[#8A7355] opacity-100"
                  : "translate-y-0 opacity-35"
              }`}
            >
              {word}
            </span>
            {index < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </h1>
  );
}
