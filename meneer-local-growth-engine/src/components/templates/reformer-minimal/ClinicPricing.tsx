"use client";

import { useMemo, useState } from "react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import {
  EditorialPose,
  posesForLabels,
} from "@/components/templates/editorial/EditorialPose";
import type { ClinicPlan } from "@/components/templates/reformer-minimal/clinicModel";

interface Props {
  plans: ClinicPlan[];
  booking: { href: string; external: boolean; label: string };
  note: string | null;
}

/**
 * Tarieven op g-025. Pose-icons bij pakketten (niet bij het traject).
 */
export function ClinicPricing({ plans, booking, note }: Props) {
  const featuredId = useMemo(
    () => plans.find((plan) => plan.featured)?.id ?? plans[0]?.id ?? "",
    [plans]
  );
  const [activeId, setActiveId] = useState(featuredId);
  const active = plans.find((plan) => plan.id === activeId) ?? plans[0] ?? null;
  const poses = useMemo(
    () => posesForLabels(plans.map((plan) => `${plan.name} ${plan.description}`)),
    [plans]
  );

  if (plans.length === 0) {
    return note ? (
      <section id="tarieven" className="fc-plane-025">
        <div className="mx-auto px-5 py-20 sm:px-8 lg:px-[5vw]">
          <h2 className="figma-display-l">Tarieven</h2>
          <p className="mt-4 text-[15px] text-[var(--fc-ink-soft)]">{note}</p>
        </div>
      </section>
    ) : null;
  }

  if (!active) return null;

  const activeIndex = Math.max(
    0,
    plans.findIndex((plan) => plan.id === active.id)
  );
  const activePose = poses[activeIndex] ?? "reformer";

  return (
    <section id="tarieven" className="fc-plane-025">
      <div className="mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
        <ScrollReveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="figma-label text-[var(--fc-label)]">Membership</p>
              <h2 className="figma-display-l mt-4">Kies jouw ritme</h2>
            </div>
            <p className="max-w-sm text-[14px] leading-6 text-[var(--fc-ink-soft)] md:text-right">
              Kies een pakket. Details en features verschijnen meteen naast.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-12 lg:gap-6">
          <ScrollReveal className="lg:col-span-5">
            <ul className="flex h-full flex-col gap-3">
              {plans.map((plan, index) => {
                const selected = plan.id === active.id;
                const pose = poses[index] ?? "boat";
                return (
                  <li key={plan.id} className="min-h-0 flex-1">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveId(plan.id)}
                      onFocus={() => setActiveId(plan.id)}
                      onClick={() => setActiveId(plan.id)}
                      aria-pressed={selected}
                      className={`group flex h-full w-full items-center justify-between gap-4 rounded-[var(--fc-radius)] border px-5 py-5 text-left transition-all duration-500 ease-[var(--fc-ease)] sm:px-6 sm:py-6 ${
                        selected
                          ? "border-[var(--fc-accent-deep)] bg-[var(--fc-wash)] text-[var(--fc-ink)]"
                          : "border-[var(--fc-line)] bg-[var(--fc-paper)] text-[var(--fc-ink)] hover:-translate-y-0.5 hover:border-[var(--fc-accent-deep)]/25"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-4">
                        <EditorialPose
                          name={pose}
                          className={`h-11 w-11 shrink-0 text-[var(--fc-accent-deep)] transition-opacity duration-500 ${
                            selected ? "opacity-100" : "opacity-55 group-hover:opacity-85"
                          }`}
                        />
                        <span className="min-w-0">
                          <span
                            className={`figma-label block ${
                              selected
                                ? "text-[var(--fc-label)]"
                                : "text-[var(--fc-ink-mute)]"
                            }`}
                          >
                            {plan.period}
                            {plan.featured ? " · Populair" : ""}
                          </span>
                          <span className="mt-2 block text-[1.2rem] font-semibold tracking-tight sm:text-[1.35rem]">
                            {plan.name}
                          </span>
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-[1.55rem] font-medium tracking-tight tabular-nums sm:text-[1.75rem]">
                          {plan.priceLabel}
                        </span>
                        <span
                          aria-hidden
                          className={`mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-transform duration-500 ${
                            selected
                              ? "border-[var(--fc-accent-deep)]/30 bg-[var(--fc-accent-soft)] text-[var(--fc-accent-deep)]"
                              : "border-[var(--fc-line)] text-[var(--fc-ink-mute)] group-hover:translate-x-0.5"
                          }`}
                        >
                          ›
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </ScrollReveal>

          <ScrollReveal delayMs={90} className="lg:col-span-7">
            <article
              key={active.id}
              className="relative flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[var(--fc-radius-lg)] border border-[var(--fc-line)] bg-[var(--fc-paper)] p-7 sm:p-9 lg:p-10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[var(--fc-line)]"
              />

              <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="figma-label text-[var(--fc-label)]">{active.period}</p>
                  {active.featured ? (
                    <span className="rounded-full bg-[var(--fc-accent-deep)] px-3 py-1 text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--fc-on-dark)]">
                      Meest gekozen
                    </span>
                  ) : null}
                </div>
                <EditorialPose
                  name={activePose}
                  className="h-20 w-20 text-[var(--fc-accent-deep)] sm:h-24 sm:w-24"
                />
              </div>

              <h3 className="relative mt-5 text-[clamp(1.8rem,3vw,2.6rem)] font-medium tracking-tight text-[var(--fc-ink)]">
                {active.name}
              </h3>
              <p className="relative mt-4 text-[clamp(2.8rem,5vw,4.2rem)] font-medium leading-none tracking-tight tabular-nums text-[var(--fc-accent-deep)]">
                {active.priceLabel}
              </p>
              <p className="relative mt-6 max-w-[42ch] text-[15px] leading-7 text-[var(--fc-ink-soft)]">
                {active.description}
              </p>

              <ul className="relative mt-8 flex flex-wrap gap-2.5">
                {active.features.map((feature) => (
                  <li
                    key={feature}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--fc-line)] bg-[var(--fc-mist)] px-3.5 py-2 text-[13px] text-[var(--fc-ink)]"
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-[var(--fc-accent-deep)]"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="relative mt-auto flex flex-wrap items-center gap-4 pt-10">
                <a
                  href={booking.href}
                  {...(booking.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--fc-accent-deep)] px-6 text-[12px] font-medium tracking-[0.12em] uppercase text-[var(--fc-on-dark)] transition-transform duration-500 ease-[var(--fc-ease)] hover:-translate-y-0.5"
                >
                  {booking.label}
                  <span aria-hidden>›</span>
                </a>
                <p className="text-[12px] text-[var(--fc-ink-mute)]">
                  Direct online te boeken
                </p>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
