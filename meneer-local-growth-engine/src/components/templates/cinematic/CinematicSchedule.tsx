"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { CineModel } from "@/components/templates/cinematic/cinematicModel";

interface Props {
  model: CineModel;
}

function availability(spots: number): string {
  if (spots === 0) return "wachtlijst";
  return `${spots} ${spots === 1 ? "plek" : "plekken"}`;
}

/**
 * Rooster als filmstrip: donker vlak, dagen als serif-rail bovenaan, lessen als
 * regels met de tijd in groot cijferwerk. De lijst wisselt met een korte fade,
 * zodat het schakelen tussen dagen als een cut voelt.
 */
export function CinematicSchedule({ model }: Props) {
  const { schedule, city, hours, booking } = model;
  const [activeId, setActiveId] = useState(schedule[0]?.id ?? "");
  const reduced = useReducedMotion();
  const active = schedule.find((day) => day.id === activeId) ?? schedule[0];

  if (!active) return null;

  return (
    <section
      id="rooster"
      className="relative overflow-hidden bg-[var(--cn-dark)] text-[var(--cn-on-dark)]"
    >
      <div aria-hidden className="cine-grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <ScrollReveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="cine-label text-[var(--cn-on-dark-soft)]">Rooster</p>
              <h2 className="cine-display cine-display-l cine-lower mt-5">
                deze week
                <br />
                <span className="cine-italic">
                  {city ? `in ${city.toLowerCase()}.` : "in de studio."}
                </span>
              </h2>
            </div>

            <div className="flex flex-col items-start gap-5 lg:items-end">
              {hours ? (
                <p className="max-w-[24ch] text-[13px] leading-6 text-[var(--cn-on-dark-soft)] lg:text-right">
                  {hours}
                </p>
              ) : null}
              <a
                href={booking.href}
                {...(booking.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="cine-pill cine-pill-solid"
              >
                {booking.label}
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={80}>
          <div className="mt-12 flex gap-7 overflow-x-auto border-b border-white/15 pb-4 [scrollbar-width:none] sm:gap-9 [&::-webkit-scrollbar]:hidden">
            {schedule.map((day) => {
              const selected = day.id === active.id;
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setActiveId(day.id)}
                  aria-pressed={selected}
                  className="group relative shrink-0 pb-1 text-left"
                >
                  <span
                    className={`cine-display cine-lower text-[1.5rem] transition-colors duration-500 ease-[var(--cn-ease)] sm:text-[1.75rem] ${
                      selected
                        ? "text-[var(--cn-on-dark)]"
                        : "text-[rgba(246,241,232,0.42)] group-hover:text-[rgba(246,241,232,0.75)]"
                    }`}
                  >
                    {day.label}
                  </span>
                  <span
                    className={`ml-1.5 align-super text-[10px] tabular-nums transition-colors duration-500 ease-[var(--cn-ease)] ${
                      selected
                        ? "text-[var(--cn-on-dark-soft)]"
                        : "text-[rgba(246,241,232,0.3)]"
                    }`}
                  >
                    {day.slots.length}
                  </span>
                  <span
                    aria-hidden
                    className={`absolute -bottom-4 left-0 h-[2px] bg-[var(--cn-on-dark)] transition-all duration-500 ease-[var(--cn-ease)] ${
                      selected ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={active.id}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.42, ease: [0.22, 0.9, 0.24, 1] }}
          >
            {active.slots.map((slot) => (
              <li key={slot.id} className="border-b border-white/12">
                <a
                  href={booking.href}
                  {...(booking.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex flex-wrap items-baseline gap-x-6 gap-y-2 py-6 transition-colors duration-500 ease-[var(--cn-ease)] hover:bg-white/[0.04] sm:flex-nowrap sm:px-2 sm:py-7"
                >
                  <span className="cine-display w-[4.5rem] shrink-0 text-[1.75rem] tabular-nums text-[rgba(246,241,232,0.6)] transition-colors duration-500 ease-[var(--cn-ease)] group-hover:text-[var(--cn-on-dark)] sm:text-[2rem]">
                    {slot.time}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="cine-display cine-lower block truncate text-[1.35rem] transition-transform duration-500 ease-[var(--cn-ease)] group-hover:translate-x-1 sm:text-[1.5rem]">
                      {slot.name}
                    </span>
                    <span className="cine-label mt-2 block text-[rgba(246,241,232,0.55)]">
                      {[slot.instructor, slot.duration].filter(Boolean).join(" · ")}
                    </span>
                  </span>

                  <span
                    className={`cine-label shrink-0 ${
                      slot.spots === 0
                        ? "text-[rgba(246,241,232,0.4)]"
                        : slot.spots <= 2
                          ? "text-[var(--cn-on-dark)]"
                          : "text-[rgba(246,241,232,0.65)]"
                    }`}
                  >
                    {availability(slot.spots)}
                  </span>

                  <span
                    aria-hidden
                    className="hidden w-6 shrink-0 text-right text-[var(--cn-on-dark-soft)] transition-transform duration-500 ease-[var(--cn-ease)] group-hover:translate-x-1.5 sm:block"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>

        <p className="mt-6 text-[12.5px] leading-6 text-[rgba(246,241,232,0.5)]">
          {active.full} in de studio. Plekken lopen per week op en af, boeken gaat
          via de agenda.
        </p>
      </div>
    </section>
  );
}
