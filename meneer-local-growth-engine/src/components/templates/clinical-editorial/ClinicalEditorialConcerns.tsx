"use client";

import Image from "next/image";
import { useState } from "react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EditorialIcon } from "@/components/templates/editorial/EditorialIcon";
import { SKIN_CLINIC_LIFESTYLE_FALLBACKS } from "@/lib/previewImagePolicy";
import { formatDisplayLabel } from "@/lib/text";
import type { StudioSkinConcern } from "@/types/studio";

interface ConcernImage {
  url: string;
  alt: string;
}

interface Props {
  concerns: StudioSkinConcern[];
  images?: ConcernImage[];
  brandName: string;
  city: string;
}

const CONCERN_IMAGE_BY_SLUG: Record<string, ConcernImage> = {
  "donkere-kringen": SKIN_CLINIC_LIFESTYLE_FALLBACKS.consultation,
  acne: SKIN_CLINIC_LIFESTYLE_FALLBACKS.treatment,
  pigmentvlekken: SKIN_CLINIC_LIFESTYLE_FALLBACKS.detail,
  rimpels: SKIN_CLINIC_LIFESTYLE_FALLBACKS.atmosphere,
  "droge-huid": SKIN_CLINIC_LIFESTYLE_FALLBACKS.reception,
  couperose: SKIN_CLINIC_LIFESTYLE_FALLBACKS.treatment,
  striae: SKIN_CLINIC_LIFESTYLE_FALLBACKS.detail,
  "doffe-huid": SKIN_CLINIC_LIFESTYLE_FALLBACKS.atmosphere,
};

const FALLBACK_IMAGE_POOL: ConcernImage[] = [
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.consultation,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.treatment,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.atmosphere,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.reception,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.detail,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.hero,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.gallery1,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.gallery2,
];

function imageForConcern(
  concern: StudioSkinConcern,
  index: number,
  pool: ConcernImage[],
): ConcernImage {
  const bySlug = CONCERN_IMAGE_BY_SLUG[concern.slug];
  if (bySlug) return bySlug;
  if (pool[index]) return pool[index]!;
  return FALLBACK_IMAGE_POOL[index % FALLBACK_IMAGE_POOL.length]!;
}

export function ClinicalEditorialConcerns({
  concerns,
  images = [],
  brandName,
  city,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const items = concerns.slice(0, 8);

  if (items.length === 0) return null;

  return (
    <section id="huidproblemen" className="ed-deep relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 12% 0%, color-mix(in srgb, var(--ed-accent-base) 22%, transparent), transparent 68%), radial-gradient(ellipse 50% 40% at 100% 100%, color-mix(in srgb, var(--ed-accent-base) 12%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
        <ScrollReveal>
          <p className="ed-label text-[var(--ed-accent)]">Huidproblemen</p>
          <h2 className="ed-serif ed-h2 mt-4 max-w-[24ch]">
            Waar {brandName} je bij kan helpen
          </h2>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[var(--ed-fg-70)]">
            Per huidprobleem bouwen we een informatieve pagina voor Google en je
            klanten. In dit concept zie je de belangrijkste thema&apos;s voor{" "}
            {city || "jouw regio"}.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((concern, index) => {
            const image = imageForConcern(concern, index, images);
            const isActive = activeIndex === index;
            const dimmed = activeIndex !== null && !isActive;

            return (
              <ScrollReveal key={concern.id} delayMs={index * 55}>
                <article
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setActiveIndex(null);
                    }
                  }}
                  className={`group flex h-full flex-col overflow-hidden border bg-[var(--ed-bg-raised)] transition-all duration-500 ease-[var(--ease-premium)] ${
                    isActive
                      ? "border-[var(--ed-accent-line)] shadow-[0_24px_60px_-28px_color-mix(in_srgb,var(--ed-accent)_55%,transparent)]"
                      : "border-[var(--ed-line)]"
                  } ${dimmed ? "opacity-55" : "opacity-100"}`}
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <Image
                      src={image.url}
                      alt={`${concern.name} · ${image.alt}`}
                      fill
                      unoptimized={/^https?:\/\//i.test(image.url)}
                      className={`object-cover transition-transform duration-[900ms] ease-out ${
                        isActive ? "scale-105" : "scale-100"
                      }`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-[var(--ed-deep)] via-[var(--ed-deep)]/45 to-[var(--ed-deep)]/10"
                    />
                    <div
                      aria-hidden
                      className={`absolute inset-0 bg-[var(--ed-accent)] transition-opacity duration-500 ${
                        isActive ? "opacity-[0.12]" : "opacity-0"
                      }`}
                    />
                    <span className="ed-label absolute left-4 top-4 rounded-full border border-[var(--ed-accent-line)] bg-[var(--ed-deep)]/55 px-3 py-1 text-[var(--ed-accent)] backdrop-blur-sm">
                      Huidthema
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <h3 className="ed-serif text-[clamp(1.35rem,2.2vw,1.65rem)] leading-tight tracking-tight text-[var(--ed-fg)]">
                      {formatDisplayLabel(concern.name)}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--ed-fg-70)] line-clamp-3">
                      {concern.description}
                    </p>

                    {concern.related_treatment ? (
                      <p className="mt-4 inline-flex self-start rounded-full border border-[var(--ed-accent-line)] bg-[var(--ed-accent-soft)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--ed-accent)]">
                        Vaak: {formatDisplayLabel(concern.related_treatment)}
                      </p>
                    ) : null}

                    <a
                      href="#contact"
                      className="ed-label group/cta mt-5 inline-flex items-center gap-2.5 text-[var(--ed-accent)] transition-colors duration-300 hover:text-[var(--ed-paper)]"
                    >
                      <span className="border-b border-[var(--ed-accent-line)] pb-0.5 transition-colors duration-300 group-hover/cta:border-[var(--ed-paper)]">
                        Lees meer
                      </span>
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ed-accent-line)] bg-[var(--ed-accent-soft)] transition-all duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:border-[var(--ed-accent)] group-hover/cta:bg-[var(--ed-accent)] group-hover/cta:text-[var(--ed-deep)] ${
                          isActive ? "translate-x-0.5 border-[var(--ed-accent)] bg-[var(--ed-accent)] text-[var(--ed-deep)]" : ""
                        }`}
                      >
                        <EditorialIcon
                          name="arrow"
                          className="h-3.5 w-3.5"
                          strokeWidth={1.5}
                        />
                      </span>
                    </a>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
