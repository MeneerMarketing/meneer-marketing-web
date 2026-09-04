"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { CineModel } from "@/components/templates/cinematic/cinematicModel";

interface Props {
  model: CineModel;
  variant?: "pilates" | "skin-clinic";
}

/**
 * Instructors als castlijst: de namen staan groot in serif, het portret links
 * wisselt mee zodra je een naam aanwijst. Zwart-wit tot de naam actief is, dan
 * krijgt het beeld kleur. Op touch werkt dezelfde lijst als tikken.
 */
export function CinematicInstructors({ model, variant = "pilates" }: Props) {
  const { instructors, studioName, city, booking } = model;
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();

  const active = instructors[activeIndex] ?? instructors[0]!;

  return (
    <section id={variant === "skin-clinic" ? "team" : "instructors"} className="bg-[var(--cn-cream)]">
      <div className="mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <ScrollReveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="cine-label text-[var(--cn-muted)]">
                {variant === "skin-clinic" ? "Team" : "Instructors"}
              </p>
              <h2 className="cine-display cine-display-l cine-lower mt-5 text-[var(--cn-oxblood)]">
                {variant === "skin-clinic" ? (
                  <>
                    de mensen
                    <br />
                    <span className="cine-italic">achter je huid.</span>
                  </>
                ) : (
                  <>
                    de mensen
                    <br />
                    <span className="cine-italic">achter de vorm.</span>
                  </>
                )}
              </h2>
            </div>
            <p className="max-w-[34ch] text-[13.5px] leading-6 text-[var(--cn-body)] sm:text-[14px]">
              {variant === "skin-clinic"
                ? "Artsen en huidtherapeuten die intake, veiligheid en resultaat combineren. Kies een naam en lees wie je begeleidt."
                : "Iedere les wordt gegeven door een instructor die je bij naam kent. Kies een naam en je ziet wie er voor je staat."}
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch lg:gap-14">
          <ScrollReveal className="lg:sticky lg:top-24 lg:self-start">
            <figure className="relative overflow-hidden rounded-[1.75rem] bg-[var(--cn-dark)]">
              <div className="relative aspect-[4/5]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active.id}
                    className="cine-media absolute inset-0"
                    initial={reduced ? false : { opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 0.9, 0.24, 1] }}
                  >
                    <Image
                      src={active.image}
                      alt={`${active.name}, ${active.role} bij ${studioName}`}
                      fill
                      className="object-cover object-[center_22%]"
                      sizes="(max-width: 1024px) 100vw, 38vw"
                    />
                  </motion.div>
                </AnimatePresence>

                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[rgba(20,7,4,0.85)] via-transparent to-[rgba(20,7,4,0.2)]"
                />
                <div
                  aria-hidden
                  className="cine-grain pointer-events-none absolute inset-0"
                />

                <figcaption className="absolute inset-x-6 bottom-6">
                  <p className="cine-display cine-lower text-[1.75rem] leading-none text-[var(--cn-on-dark)]">
                    {active.first}
                  </p>
                  <p className="cine-label mt-2 text-[var(--cn-on-dark-soft)]">
                    {active.role}
                  </p>
                </figcaption>
              </div>
            </figure>
          </ScrollReveal>

          <ScrollReveal delayMs={90}>
            <ul className="border-t border-[var(--cn-line)]">
              {instructors.map((member, index) => {
                const selected = index === activeIndex;
                return (
                  <li key={member.id} className="border-b border-[var(--cn-line)]">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onClick={() => setActiveIndex(index)}
                      aria-pressed={selected}
                      className="group block w-full py-6 text-left sm:py-8"
                    >
                      <span className="flex items-baseline gap-4">
                        <span
                          aria-hidden
                          className={`h-[2px] shrink-0 bg-[var(--cn-clay)] transition-all duration-500 ease-[var(--cn-ease)] ${
                            selected ? "w-10 opacity-100" : "w-0 opacity-0"
                          }`}
                        />
                        <span
                          className={`cine-display cine-lower text-[1.9rem] leading-none transition-colors duration-500 ease-[var(--cn-ease)] sm:text-[2.4rem] ${
                            selected
                              ? "cine-italic text-[var(--cn-oxblood)]"
                              : "text-[rgba(42,20,16,0.45)] group-hover:text-[var(--cn-ink)]"
                          }`}
                        >
                          {member.name}
                        </span>
                        <span className="cine-label ml-auto hidden shrink-0 text-[var(--cn-muted)] sm:block">
                          {member.role}
                        </span>
                      </span>

                      <span
                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--cn-ease)] motion-reduce:transition-none ${
                          selected
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <span className="overflow-hidden">
                          <span className="block max-w-[52ch] pt-4 text-[13.5px] leading-6 text-[var(--cn-body)] sm:pl-14">
                            {member.bio}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="cine-label text-[var(--cn-muted)]">
                {instructors.length} {instructors.length === 1 ? "instructor" : "instructors"}
                {city ? ` · ${city.toLowerCase()}` : ""}
              </p>
              <a
                href={booking.href}
                {...(booking.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="cine-pill cine-pill-ink"
              >
                Les bij {active.first}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
