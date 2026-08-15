"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { publicCopy } from "@/lib/copy-flags";

export type BeforeAfterSliderProps = {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  sessions: string;
  timeline: string;
  skinType: string;
  aspect?: `${number}/${number}`;
  sizes?: string;
};

export default function BeforeAfterSlider({
  before,
  after,
  sessions,
  timeline,
  skinType,
  aspect = "4/5",
  sizes = "(min-width: 768px) 720px, 100vw",
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const id = useId();

  return (
    <figure className="w-full max-w-[720px]">
      <div
        className="group relative overflow-hidden rounded-[1.5rem] border border-[var(--g-100)] bg-[var(--g-025)]"
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={after.src}
          alt={publicCopy(after.alt, "Foto volgt")}
          fill
          sizes={sizes}
          className="object-cover"
        />

        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden="true"
        >
          <Image
            src={before.src}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.1em] text-[var(--t-muted)]">
          Voor
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.1em] text-[var(--t-muted)]">
          Na
        </span>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-white"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-[var(--g-700)] text-white shadow-[0_8px_24px_rgba(15,45,28,.18)] group-has-[input:focus-visible]:outline group-has-[input:focus-visible]:outline-2 group-has-[input:focus-visible]:outline-offset-2 group-has-[input:focus-visible]:outline-[var(--g-700)]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 4L1.5 9 6 14M12 4l4.5 5-4.5 5" />
            </svg>
          </span>
        </div>

        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Vergelijk voor en na: ${publicCopy(before.alt, "beeld volgt")}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
        />
      </div>

      <figcaption className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] leading-relaxed text-[var(--t-muted)]">
        <span>{sessions}</span>
        <span
          aria-hidden="true"
          className="h-1 w-1 rounded-full bg-[var(--g-100)]"
        />
        <span>{timeline}</span>
        <span
          aria-hidden="true"
          className="h-1 w-1 rounded-full bg-[var(--g-100)]"
        />
        <span>{skinType}</span>
      </figcaption>
    </figure>
  );
}
