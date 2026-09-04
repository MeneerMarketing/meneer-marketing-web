"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { ClinicModel } from "@/components/templates/reformer-minimal/clinicModel";

interface Props {
  about: ClinicModel["about"];
  image: ClinicModel["studioImage"];
  primaryService: string;
}

/**
 * Studio-intro met solide tintvlakken en count-up cijfers.
 */
export function ClinicAbout({ about, image, primaryService }: Props) {
  const headingParts = about.heading.includes(" ")
    ? {
        lead: about.heading.split(" ").slice(0, -1).join(" "),
        accent: about.heading.split(" ").slice(-1).join(" "),
      }
    : { lead: about.heading, accent: null };

  return (
    <section id="studio" className="fc-plane-010">
      <div className="mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
        <div className="grid items-stretch gap-12 lg:grid-cols-12 lg:gap-14">
          <ScrollReveal className="flex h-full flex-col justify-center lg:col-span-6">
            <p className="figma-label text-[var(--fc-label)]">De studio</p>

            <h2 className="figma-display-l mt-5 max-w-[14ch]">
              {headingParts.accent ? (
                <>
                  {headingParts.lead}{" "}
                  <span className="font-light text-[var(--fc-ink-soft)]">
                    {headingParts.accent}
                  </span>
                </>
              ) : (
                headingParts.lead
              )}
            </h2>

            <p className="mt-7 max-w-[44ch] text-[16px] leading-7 text-[var(--fc-ink-soft)]">
              {about.body}
            </p>

            {about.facts.length > 0 ? (
              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                {about.facts.map((fact, index) => (
                  <FactCard
                    key={fact.label}
                    value={fact.value}
                    label={fact.label}
                    delayMs={index * 90}
                  />
                ))}
              </div>
            ) : null}
          </ScrollReveal>

          <ScrollReveal delayMs={100} className="lg:col-span-6">
            <div className="group relative h-full min-h-[28rem]">
              <div
                aria-hidden
                className="absolute inset-4 translate-x-3 translate-y-3 rounded-[var(--fc-radius-lg)] bg-[var(--fc-wash)] transition-transform duration-700 ease-[var(--fc-ease)] group-hover:translate-x-4 group-hover:translate-y-4"
              />

              <div className="relative h-full overflow-hidden rounded-[var(--fc-radius-lg)] border border-[var(--fc-line)] bg-[var(--fc-mist)]">
                {image ? (
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-[1200ms] ease-[var(--fc-ease)] group-hover:scale-[1.04]"
                      sizes="(max-width: 1024px) 100vw, 48vw"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-[var(--fc-accent-soft)]" />
                )}

                {/* Volle overlay als er caption-tekst op de foto staat */}
                {primaryService ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-black/40"
                  />
                ) : null}

                {primaryService ? (
                  <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 p-6 sm:p-7">
                    <p className="text-[1.1rem] font-medium tracking-tight text-white sm:text-[1.2rem]">
                      {primaryService}
                    </p>
                    <span className="figma-label shrink-0 rounded-full bg-[var(--fc-on-dark-btn)] px-3 py-1.5 text-[var(--fc-on-dark-btn-text)]">
                      Live in studio
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function FactCard({
  value,
  label,
  delayMs,
}: {
  value: string;
  label: string;
  delayMs: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(value);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          window.setTimeout(() => setActive(true), delayMs);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  useEffect(() => {
    if (!active) return;

    const numeric = Number(String(value).replace(",", "."));
    if (!Number.isFinite(numeric)) {
      setShown(value);
      return;
    }

    const isFloat = String(value).includes(",");
    const duration = 900;
    const start = performance.now();

    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = numeric * eased;
      setShown(
        isFloat
          ? current.toLocaleString("nl-NL", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })
          : String(Math.round(current))
      );
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value]);

  return (
    <div
      ref={ref}
      className="rounded-[var(--fc-radius)] border border-[var(--fc-line)] bg-[var(--fc-mist)] px-4 py-5 transition-transform duration-500 ease-[var(--fc-ease)] hover:-translate-y-1"
    >
      <p className="text-[1.85rem] font-medium tracking-tight tabular-nums text-[var(--fc-ink)]">
        {shown}
      </p>
      <p className="figma-label mt-2 text-[var(--fc-ink-mute)]">{label}</p>
    </div>
  );
}
