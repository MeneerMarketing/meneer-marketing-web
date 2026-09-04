"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { ClinicSocialLink } from "@/components/templates/reformer-minimal/ClinicSocials";
import type { CineImage } from "@/components/templates/cinematic/cinematicModel";

interface Props {
  studioName: string;
  socials: ClinicSocialLink[];
  images: CineImage[];
  variant?: "pilates" | "skin-clinic";
}

/**
 * Social band voor template C — zelfde opzet als ClinicSocials, cinematic typografie.
 */
export function CinematicSocials({
  studioName,
  socials,
  images,
  variant = "pilates",
}: Props) {
  if (socials.length === 0) return null;

  const tiles = images.slice(0, 3);
  while (tiles.length < 3 && images[0]) tiles.push(images[0]);

  const intro =
    variant === "skin-clinic"
      ? `Behandelingen, sfeer en resultaten van ${studioName}. Dagelijks op Instagram en TikTok.`
      : `Lessen, sfeer en kleine momenten uit ${studioName}. Dagelijks op Instagram en TikTok.`;

  return (
    <section id="socials" className="bg-[var(--cn-cream)]">
      <div className="mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <ScrollReveal>
            <p className="cine-label text-[var(--cn-muted)]">Socials</p>
            <h2 className="cine-display cine-display-l cine-lower mt-5 max-w-[16ch] text-[var(--cn-oxblood)]">
              Volg ons achter
              <br />
              <span className="cine-italic">de schermen</span>
            </h2>
            <p className="mt-5 max-w-md text-[13.5px] leading-6 text-[var(--cn-body)] sm:text-[14px] sm:leading-7">
              {intro}
            </p>
          </ScrollReveal>

          <ScrollReveal delayMs={80}>
            <div className="flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full border border-[var(--cn-line)] bg-[var(--cn-cream-2)] py-2.5 pl-2.5 pr-5 transition-all duration-500 ease-[var(--cn-ease)] hover:-translate-y-0.5 hover:border-[var(--cn-oxblood)]/25"
                >
                  <span className="relative h-10 w-10 overflow-hidden rounded-full bg-[var(--cn-cream)]">
                    <Image
                      src={social.iconSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </span>
                  <span className="text-left">
                    <span className="block text-[13px] font-semibold tracking-tight text-[var(--cn-ink)]">
                      {social.label}
                    </span>
                    <span className="block text-[12px] text-[var(--cn-muted)]">
                      {social.handle}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="ml-1 text-[var(--cn-muted)] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:text-[var(--cn-ink)]"
                  >
                    →
                  </span>
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {tiles.length > 0 ? (
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {tiles.map((img, index) => {
              const social = socials[index % socials.length]!;
              return (
                <ScrollReveal key={`${img.url}-${index}`} delayMs={index * 70}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-[16/10] overflow-hidden rounded-[1.75rem] border border-[var(--cn-line)] bg-[var(--cn-dark)] md:aspect-[4/5]"
                  >
                    <div className="cine-media absolute inset-0">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-cover transition-transform duration-[900ms] ease-[var(--cn-ease)] group-hover:scale-[1.05]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-[rgba(20,7,4,0.88)] via-[rgba(20,7,4,0.2)] to-[rgba(20,7,4,0.35)]"
                    />
                    <div aria-hidden className="cine-grain pointer-events-none absolute inset-0" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5">
                      <div className="flex items-center gap-3">
                        <span className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/70">
                          <Image
                            src={social.iconSrc}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="36px"
                          />
                        </span>
                        <span className="text-[13px] font-medium text-[var(--cn-on-dark)]">
                          {social.handle}
                        </span>
                      </div>
                      <span className="cine-pill cine-pill-ink text-[10px]">Volg</span>
                    </div>
                  </a>
                </ScrollReveal>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
