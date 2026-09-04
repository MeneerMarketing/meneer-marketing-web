"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { ClinicImage } from "@/components/templates/reformer-minimal/clinicModel";

export interface ClinicSocialLink {
  id: string;
  label: string;
  href: string;
  handle: string;
  iconSrc: string;
}

interface Props {
  studioName: string;
  socials: ClinicSocialLink[];
  images: ClinicImage[];
  intro?: string;
}

/**
 * Social band op g-050: chips zonder schaduw, tiles met zachte radius.
 */
export function ClinicSocials({ studioName, socials, images, intro }: Props) {
  if (socials.length === 0) return null;

  const tiles = images.slice(0, 3);
  while (tiles.length < 3 && images[0]) tiles.push(images[0]);

  return (
    <section id="socials" className="fc-plane-050">
      <div className="mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <ScrollReveal>
            <p className="figma-label text-[var(--fc-label)]">Socials</p>
            <h2 className="figma-display-l mt-4 max-w-[16ch]">
              Volg ons achter de schermen
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-[var(--fc-ink-soft)]">
              {intro ??
                `Lessen, sfeer en kleine momenten uit ${studioName}. Dagelijks op Instagram en TikTok.`}
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
                  className="group inline-flex items-center gap-3 rounded-full border border-[var(--fc-line)] bg-[var(--fc-paper)] py-2.5 pl-2.5 pr-5 transition-all duration-500 ease-[var(--fc-ease)] hover:-translate-y-1 hover:border-[var(--fc-accent-deep)]/30"
                >
                  <span className="relative h-10 w-10 overflow-hidden rounded-full bg-[var(--fc-mist)]">
                    <Image
                      src={social.iconSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </span>
                  <span className="text-left">
                    <span className="block text-[13px] font-semibold tracking-tight text-[var(--fc-ink)]">
                      {social.label}
                    </span>
                    <span className="block text-[12px] text-[var(--fc-ink-mute)]">
                      {social.handle}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="ml-1 text-[var(--fc-ink-mute)] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:text-[var(--fc-ink)]"
                  >
                    ›
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
                    className="group relative block aspect-[16/10] overflow-hidden rounded-[var(--fc-radius-lg)] border border-[var(--fc-line)] bg-[var(--fc-paper)] md:aspect-[4/5]"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-700 ease-[var(--fc-ease)] group-hover:scale-[1.05]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:bg-black/50"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5">
                      <div className="flex items-center gap-3">
                        <span className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/80">
                          <Image
                            src={social.iconSrc}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="36px"
                          />
                        </span>
                        <span className="text-[13px] font-medium text-white">
                          {social.handle}
                        </span>
                      </div>
                      <span className="figma-label rounded-full bg-[var(--fc-on-dark-btn)] px-3 py-1.5 text-[var(--fc-on-dark-btn-text)]">
                        Volg
                      </span>
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
