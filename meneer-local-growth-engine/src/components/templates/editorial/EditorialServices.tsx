"use client";

import Image from "next/image";
import { useState } from "react";
import { EditorialIcon } from "@/components/templates/editorial/EditorialIcon";
import {
  EditorialPose,
  posesForLabels,
} from "@/components/templates/editorial/EditorialPose";
import type { EditorialImage } from "@/components/templates/editorial/editorialModel";
import { plainText } from "@/lib/text";
import type { StudioService } from "@/types/studio";

interface Props {
  services: StudioService[];
  images: EditorialImage[];
}

/**
 * Signature-interactie van template A: lijst links, beeld rechts wisselt mee.
 * Het icoon en de streepjes onder het beeld laten zien welke les actief is.
 * Op mobiel klapt het beeld onder de gekozen les open.
 * Op desktop vullen lijst en beeld dezelfde rijhoogte.
 */
export function EditorialServices({ services, images }: Props) {
  const [active, setActive] = useState(0);
  const poses = posesForLabels(services.map((service) => plainText(service.name)));

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-0">
      <ul className="flex flex-col lg:col-span-7 lg:h-full lg:pr-14">
        {services.map((service, index) => {
          const isActive = active === index;
          const name = plainText(service.name);
          const image = images.length > 0 ? images[index % images.length] : null;
          const duration = service.duration_minutes
            ? `${service.duration_minutes} min`
            : "Les";

          return (
            <li
              key={service.id}
              className="flex flex-col border-t border-[var(--ed-line)] last:border-b lg:min-h-0 lg:flex-1 lg:justify-center"
            >
              <button
                type="button"
                aria-expanded={isActive}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                className="flex w-full items-center justify-between gap-5 py-6 text-left md:py-7 lg:py-5"
              >
                <span className="flex min-w-0 items-center gap-4 md:gap-5">
                  <EditorialPose
                    name={poses[index] ?? "boat"}
                    className={`hidden h-16 w-16 shrink-0 transition-all duration-500 ease-[var(--ease-premium)] md:block ${
                      isActive
                        ? "scale-100 text-[var(--ed-accent)] opacity-100"
                        : "scale-90 text-[var(--ed-fg-52)] opacity-50"
                    }`}
                  />
                  <span
                    className={`ed-serif text-[1.7rem] leading-[1.08] tracking-tight transition-colors duration-500 md:text-[2.35rem] ${
                      isActive ? "text-[var(--ed-fg)]" : "text-[var(--ed-fg-52)]"
                    }`}
                  >
                    {name}
                  </span>
                </span>

                <span className="flex shrink-0 items-center gap-3.5">
                  <span className="ed-label text-[var(--ed-fg-52)]">{duration}</span>
                  <EditorialIcon
                    name="arrow"
                    className={`h-4 w-4 text-[var(--ed-accent)] transition-all duration-500 ease-[var(--ease-premium)] ${
                      isActive
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-2 opacity-0"
                    }`}
                  />
                </span>
              </button>

              <div
                className={`grid transition-all duration-500 ease-[var(--ease-premium)] ${
                  isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  {image ? (
                    <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden lg:hidden">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        sizes="92vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <p className="max-w-[54ch] pb-7 text-[0.96rem] leading-relaxed text-[var(--ed-fg-70)] md:pl-[5.25rem] lg:pb-5">
                    {plainText(service.description)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {images.length > 0 ? (
        <div className="relative hidden overflow-hidden lg:col-span-5 lg:block lg:aspect-[3/4] lg:h-full lg:min-h-0">
          {images.map((image, index) => {
            const isCurrent = index === active % images.length;
            return (
              <div
                key={image.url}
                className={`absolute inset-0 transition-opacity duration-700 ease-[var(--ease-premium)] ${
                  isCurrent ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="40vw"
                  className={`object-cover transition-transform duration-[1400ms] ease-[var(--ease-premium)] ${
                    isCurrent ? "scale-100" : "scale-105"
                  }`}
                />
              </div>
            );
          })}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 to-transparent"
          />
          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-5">
            <p className="ed-serif text-[1.4rem] leading-tight text-white">
              {plainText(services[active]?.name ?? "")}
            </p>
            <div aria-hidden className="flex shrink-0 items-center gap-1.5 pb-2">
              {services.map((service, index) => (
                <span
                  key={service.id}
                  className={`h-px transition-all duration-500 ease-[var(--ease-premium)] ${
                    index === active ? "w-7 bg-white" : "w-4 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
