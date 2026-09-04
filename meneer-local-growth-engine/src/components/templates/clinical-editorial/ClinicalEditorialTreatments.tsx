"use client";

import Image from "next/image";
import { useState } from "react";
import { EditorialIcon } from "@/components/templates/editorial/EditorialIcon";
import { formatDisplayLabel } from "@/lib/text";
import type { StudioService } from "@/types/studio";

interface Props {
  services: StudioService[];
  images: { url: string; alt: string }[];
}

function formatDuration(minutes: number | null | undefined): string {
  if (minutes && minutes > 0) return `${minutes} min`;
  return "45–60 min";
}

/**
 * Behandelingenlijst voor huidkliniek editorial: rijke rijen met merkaccent,
 * duur-badge, uitklapbare copy en Lees meer-CTA.
 */
export function ClinicalEditorialTreatments({ services, images }: Props) {
  const [active, setActive] = useState(0);
  const activeImage = images[active % images.length];
  const activeService = services[active];

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
      <div className="lg:col-span-6">
        <ul className="divide-y divide-[var(--ed-line)]">
          {services.map((service, index) => {
            const isActive = active === index;
            const label = formatDisplayLabel(service.name);

            return (
              <li key={service.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  aria-expanded={isActive}
                  className={`group relative w-full py-6 text-left transition-all duration-500 md:py-7 ${
                    isActive ? "opacity-100" : "opacity-45 hover:opacity-75"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute bottom-6 left-0 top-6 w-0.5 rounded-full bg-[var(--ed-accent)] transition-all duration-500 md:bottom-7 md:top-7 ${
                      isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                    }`}
                  />

                  <div className="min-w-0 flex-1 pl-3 md:pl-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                        <span className="ed-serif text-[clamp(1.55rem,3.2vw,2.35rem)] leading-[1.08] tracking-tight">
                          {label}
                        </span>
                        <span
                          className={`ed-label shrink-0 rounded-full border px-3 py-1 transition-colors duration-500 ${
                            isActive
                              ? "border-[var(--ed-accent-line)] bg-[var(--ed-accent-soft)] text-[var(--ed-accent)]"
                              : "border-[var(--ed-line)] text-[var(--ed-fg-52)]"
                          }`}
                        >
                          {formatDuration(service.duration_minutes)}
                        </span>
                      </div>

                      <div
                        className={`grid transition-all duration-500 ease-[var(--ease-premium)] ${
                          isActive
                            ? "mt-4 grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-[42ch] text-[15px] leading-relaxed text-[var(--ed-fg-70)]">
                            {service.description}
                          </p>
                          <a
                            href="#contact"
                            className="ed-label group/cta mt-5 inline-flex items-center gap-2.5 text-[var(--ed-accent)] transition-colors duration-300 hover:text-[var(--ed-paper)]"
                          >
                            <span className="border-b border-[var(--ed-accent-line)] pb-0.5 transition-colors duration-300 group-hover/cta:border-[var(--ed-paper)]">
                              Lees meer
                            </span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ed-accent-line)] bg-[var(--ed-accent-soft)] transition-all duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:border-[var(--ed-accent)] group-hover/cta:bg-[var(--ed-accent)] group-hover/cta:text-[var(--ed-deep)]">
                              <EditorialIcon
                                name="arrow"
                                className="h-3.5 w-3.5"
                                strokeWidth={1.5}
                              />
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                </button>

                {isActive && activeImage ? (
                  <div className="relative mb-2 mt-1 aspect-[4/3] overflow-hidden rounded-sm border border-[var(--ed-line)] lg:hidden">
                    <Image
                      src={activeImage.url}
                      alt={activeImage.alt}
                      fill
                      unoptimized={/^https?:\/\//i.test(activeImage.url)}
                      className="object-cover"
                      sizes="100vw"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-[var(--ed-deep)]/75 via-transparent to-transparent"
                    />
                    <p className="absolute bottom-4 left-4 right-4 ed-serif text-xl text-white">
                      {label}
                    </p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative hidden min-h-[580px] lg:col-span-6 lg:block">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-3 top-8 z-20 h-24 w-24 border border-[var(--ed-accent-line)] bg-[var(--ed-accent-soft)]"
        />
        <div className="relative h-full min-h-[580px] overflow-hidden border border-[var(--ed-line)]">
          {images.map((img, index) => (
            <div
              key={`${img.url}-${index}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                index === active % images.length ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                unoptimized={/^https?:\/\//i.test(img.url)}
                className={`object-cover transition-transform duration-[1.35s] ease-out ${
                  index === active % images.length ? "scale-100" : "scale-105"
                }`}
                sizes="50vw"
              />
            </div>
          ))}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[var(--ed-deep)]/82 via-[var(--ed-deep)]/18 to-transparent"
          />
          {activeService ? (
            <div className="absolute inset-x-0 bottom-0 z-10 p-7 xl:p-8">
              <p className="ed-label text-[var(--ed-accent)]">
                {formatDuration(activeService.duration_minutes)}
              </p>
              <p className="ed-serif mt-2 text-2xl text-white xl:text-[1.75rem]">
                {formatDisplayLabel(activeService.name)}
              </p>
              <p className="mt-3 max-w-[36ch] text-[14px] leading-relaxed text-white/78">
                {activeService.description}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
