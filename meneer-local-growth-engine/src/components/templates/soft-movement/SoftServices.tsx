"use client";

import { useRef } from "react";
import type { StudioService } from "@/types/studio";

interface Props {
  services: StudioService[];
}

/** Horizontal snap carousel with soft cards — unique to Soft Movement. */
export function SoftServices({ services }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.75, 360), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C4A484]/50 text-[#3D342C] transition-colors hover:bg-[#EDE4D8]"
          aria-label="Vorige les"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C4A484]/50 text-[#3D342C] transition-colors hover:bg-[#EDE4D8]"
          aria-label="Volgende les"
        >
          →
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {services.map((service, index) => (
          <article
            key={service.id}
            className={`soft-service-card relative w-[min(85vw,340px)] shrink-0 snap-center overflow-hidden rounded-[2rem] p-7 md:w-[360px] md:rounded-[2.25rem] md:p-8 ${
              service.highlight
                ? "bg-[#2C241C] text-[#F6F1EA]"
                : index % 2 === 0
                  ? "bg-[#EDE4D8]"
                  : "bg-white/80"
            }`}
          >
            <div
              className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40 blur-2xl ${
                service.highlight ? "bg-[#C4A484]" : "bg-[#C4A484]/50"
              }`}
              aria-hidden
            />
            <p
              className={`text-[11px] tracking-[0.2em] uppercase ${
                service.highlight ? "text-[#C4A484]" : "text-[#9A8470]"
              }`}
            >
              {service.duration_minutes ? `${service.duration_minutes} minuten` : "Les"}
            </p>
            <h3 className="relative mt-5 font-[family-name:var(--font-soft-display)] text-[1.85rem] leading-tight tracking-tight md:text-[2.1rem]">
              {service.name}
            </h3>
            <p
              className={`relative mt-5 text-[14px] leading-relaxed ${
                service.highlight ? "text-[#F6F1EA]/75" : "text-[#3D342C]/70"
              }`}
            >
              {service.description}
            </p>
            <div
              className={`relative mt-10 h-1.5 w-full overflow-hidden rounded-full ${
                service.highlight ? "bg-white/15" : "bg-[#C4A484]/25"
              }`}
            >
              <div
                className={`h-full rounded-full ${service.highlight ? "bg-[#C4A484]" : "bg-[#C4A484]"}`}
                style={{ width: `${35 + index * 18}%` }}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
