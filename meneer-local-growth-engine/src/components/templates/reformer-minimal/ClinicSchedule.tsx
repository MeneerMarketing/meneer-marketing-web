"use client";

import Image from "next/image";
import { useState } from "react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type {
  ClinicImage,
  ClinicModel,
  ClinicScheduleDay,
} from "@/components/templates/reformer-minimal/clinicModel";

interface Props {
  days: ClinicScheduleDay[];
  city: string;
  intro: string;
  facts: ClinicModel["about"]["facts"];
  image: ClinicImage | null;
  booking: ClinicModel["booking"];
  hours: string | null;
  primaryService: string;
}

/**
 * Weekrooster als hoofdsectie van de studio: dagenrail links in het paneel,
 * lessen als rustige regels met tijd, instructeur en beschikbaarheid.
 */
export function ClinicSchedule({
  days,
  city,
  intro,
  facts,
  image,
  booking,
  hours,
  primaryService,
}: Props) {
  const [activeId, setActiveId] = useState(days[0]?.id ?? "");
  const active = days.find((day) => day.id === activeId) ?? days[0];

  if (!active) return null;

  return (
    <section id="studio" className="fc-plane-010">
      <div className="mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
        <ScrollReveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="figma-label text-[var(--fc-label)]">Rooster</p>
              <h2 className="figma-display-l mt-4">
                <span className="font-bold">Deze week</span>{" "}
                <span className="font-light">
                  {city ? `in ${city}` : "in de studio"}
                </span>
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-[var(--fc-ink-soft)]">
                {intro}
              </p>
            </div>

            {hours ? (
              <p className="text-[13px] leading-6 text-[var(--fc-ink-mute)] lg:max-w-[18rem] lg:text-right">
                {hours}
              </p>
            ) : null}
          </div>
        </ScrollReveal>

        <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-12">
          <ScrollReveal className="lg:col-span-4">
            <div className="flex h-full flex-col gap-4">
              <div className="relative min-h-[18rem] flex-1 overflow-hidden rounded-[var(--fc-radius-lg)] border border-[var(--fc-line)] bg-[var(--fc-mist)]">
                {image ? (
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 32vw"
                  />
                ) : null}

                {primaryService ? (
                  <>
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-black/40"
                    />
                    <p className="absolute inset-x-0 bottom-0 p-6 text-[1.1rem] font-medium tracking-tight text-white">
                      {primaryService}
                    </p>
                  </>
                ) : null}
              </div>

              {facts.length > 0 ? (
                <dl className="grid grid-cols-3 gap-3">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="rounded-[var(--fc-radius)] border border-[var(--fc-line)] bg-[var(--fc-mist)] px-4 py-5"
                    >
                      <dd className="text-[1.6rem] font-medium leading-none tracking-tight tabular-nums text-[var(--fc-ink)]">
                        {fact.value}
                      </dd>
                      <dt className="figma-label mt-2 text-[var(--fc-ink-mute)]">
                        {fact.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={90} className="lg:col-span-8">
            <div
              id="rooster"
              className="flex h-full flex-col overflow-hidden rounded-[var(--fc-radius-lg)] border border-[var(--fc-line)] bg-[var(--fc-mist)]"
            >
              <div className="flex gap-2 overflow-x-auto border-b border-[var(--fc-line)] px-4 py-4 sm:px-6">
                {days.map((day) => {
                  const selected = day.id === active.id;
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => setActiveId(day.id)}
                      aria-pressed={selected}
                      className={`flex shrink-0 flex-col items-center gap-1 rounded-[1rem] px-4 py-3 transition-colors duration-300 ease-[var(--fc-ease)] ${
                        selected
                          ? "bg-[var(--fc-ink)] text-[var(--fc-on-dark)]"
                          : "bg-[var(--fc-paper)] text-[var(--fc-ink)] hover:bg-[var(--fc-wash)]"
                      }`}
                    >
                      <span className="text-[14px] font-semibold tracking-tight">
                        {day.label}
                      </span>
                      <span
                        className={`text-[11px] tabular-nums ${
                          selected
                            ? "text-[var(--fc-on-dark-label)]"
                            : "text-[var(--fc-ink-mute)]"
                        }`}
                      >
                        {day.slots.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              <ul className="flex-1 bg-[var(--fc-paper)]">
                {active.slots.map((slot, index) => {
                  const full = slot.spots === 0;
                  const almost = slot.spots > 0 && slot.spots <= 2;

                  return (
                    <li
                      key={slot.id}
                      className={index > 0 ? "border-t border-[var(--fc-line)]" : ""}
                    >
                      <a
                        href={booking.href}
                        {...(booking.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-5 transition-colors duration-300 ease-[var(--fc-ease)] hover:bg-[var(--fc-mist)] sm:flex-nowrap sm:px-7 sm:py-6"
                      >
                        <span className="w-[4.5rem] shrink-0 text-[1.3rem] font-medium tracking-tight tabular-nums text-[var(--fc-ink)]">
                          {slot.time}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[1.05rem] font-semibold tracking-tight text-[var(--fc-ink)]">
                            {slot.name}
                          </span>
                          <span className="mt-1 block text-[13px] text-[var(--fc-ink-mute)]">
                            {[slot.instructor, slot.duration, slot.level]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </span>

                        <span
                          className={`figma-label shrink-0 rounded-full px-3 py-1.5 ${
                            full
                              ? "bg-[var(--fc-wash)] text-[var(--fc-ink-mute)]"
                              : almost
                                ? "bg-[var(--fc-accent-deep)] text-[var(--fc-on-dark)]"
                                : "bg-[var(--fc-paper)] text-[var(--fc-accent-deep)] ring-1 ring-[var(--fc-line)]"
                          }`}
                        >
                          {full
                            ? "Wachtlijst"
                            : `${slot.spots} ${slot.spots === 1 ? "plek" : "plekken"}`}
                        </span>

                        <span
                          aria-hidden
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--fc-line)] text-[var(--fc-ink-mute)] transition-all duration-300 ease-[var(--fc-ease)] group-hover:border-[var(--fc-accent-deep)] group-hover:bg-[var(--fc-accent-deep)] group-hover:text-[var(--fc-on-dark)]"
                        >
                          ›
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--fc-line)] bg-[var(--fc-mist)] px-5 py-5 sm:px-7">
                <p className="text-[13px] text-[var(--fc-ink-mute)]">
                  {active.full}. Plekken lopen per week op en af.
                </p>
                <a
                  href={booking.href}
                  {...(booking.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="figma-btn figma-btn-solid"
                >
                  {booking.label}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
