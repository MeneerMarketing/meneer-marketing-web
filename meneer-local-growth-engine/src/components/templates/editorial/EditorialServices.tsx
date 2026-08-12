"use client";

import Image from "next/image";
import { useState } from "react";
import type { StudioService } from "@/types/studio";

interface Props {
  services: StudioService[];
  images: { url: string; alt: string }[];
}

/** Magazine-style: list left, full portrait swaps on hover. */
export function EditorialServices({ services, images }: Props) {
  const [active, setActive] = useState(0);
  const activeImage = images[active % images.length];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-0">
      <ul className="lg:col-span-6 lg:pr-10">
        {services.map((service, index) => {
          const isActive = active === index;
          return (
            <li key={service.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                className={`group flex w-full items-baseline justify-between gap-6 border-t border-current/15 py-7 text-left transition-all duration-500 last:border-b ${
                  isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                <span className="font-[family-name:var(--font-editorial-serif)] text-3xl tracking-tight md:text-[2.75rem]">
                  {service.name}
                </span>
                <span className="shrink-0 text-[10px] uppercase tracking-[0.28em] opacity-60">
                  {service.duration_minutes ? `${service.duration_minutes} min` : "Les"}
                </span>
              </button>
              <div
                className={`grid transition-all duration-500 ${
                  isActive ? "grid-rows-[1fr] pb-8 opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-md text-[15px] leading-relaxed text-current/65">
                    {service.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="relative hidden min-h-[560px] overflow-hidden lg:col-span-6 lg:block">
        {images.map((img, index) => (
          <div
            key={img.url}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              index === active % images.length ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              className={`object-cover transition-transform duration-[1.2s] ease-out ${
                index === active % images.length ? "scale-100" : "scale-105"
              }`}
              sizes="50vw"
            />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {activeImage && (
          <p className="absolute bottom-6 left-6 right-6 font-[family-name:var(--font-editorial-serif)] text-2xl text-white">
            {services[active]?.name}
          </p>
        )}
      </div>
    </div>
  );
}
