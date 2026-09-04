"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { CineClass, CineModel } from "@/components/templates/cinematic/cinematicModel";
import type {
  SkinCineJourneyStep,
  SkinClinicCineBundle,
} from "@/components/templates/clinical-cinematic/skinClinicCinematicModel";
import type { StudioSkinConcern } from "@/types/studio";

export function SkinClinicCinematicTreatments({
  statement,
  classes,
  booking,
}: {
  statement: CineModel["statement"];
  classes: CineClass[];
  booking: CineModel["booking"];
}) {
  return (
    <section id="behandelingen" className="bg-[var(--cn-cream)]">
      <div className="mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <ScrollReveal>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16">
            <h2 className="cine-display cine-display-l cine-lower text-[var(--cn-oxblood)]">
              {statement.first}
              <br />
              <span className="cine-italic">{statement.second}</span>
            </h2>
            <p className="max-w-[52ch] text-[13.5px] leading-6 text-[var(--cn-body)] sm:text-[14px] lg:pt-3">
              {statement.body}
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {classes.slice(0, 3).map((item, index) => (
            <ScrollReveal key={item.id} delayMs={index * 90}>
              <a
                href={booking.href}
                {...(booking.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group relative block h-full overflow-hidden rounded-[1.75rem] bg-[var(--cn-dark)]"
              >
                <div className="relative aspect-[5/6] sm:aspect-[4/5]">
                  <div className="cine-media absolute inset-0">
                    <Image
                      src={item.image.url}
                      alt={item.image.alt}
                      fill
                      className="object-cover transition-transform duration-[900ms] ease-[var(--cn-ease)] group-hover:scale-[1.05]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[rgba(20,7,4,0.9)] via-[rgba(20,7,4,0.25)] to-[rgba(20,7,4,0.35)]"
                  />
                  <div aria-hidden className="cine-grain pointer-events-none absolute inset-0" />

                  <div className="absolute inset-x-6 top-6 flex items-start justify-between gap-4">
                    <span className="cine-label text-[var(--cn-on-dark-soft)]">
                      {item.highlight ? "Signatuur" : "Behandeling"}
                    </span>
                    <span className="cine-label text-right text-[var(--cn-on-dark-soft)]">
                      {item.room}
                    </span>
                  </div>

                  <div className="absolute inset-x-6 bottom-6">
                    <div className="flex items-end justify-between gap-4">
                      <h3 className="cine-display cine-lower text-[1.65rem] leading-none text-[var(--cn-on-dark)] sm:text-[1.85rem]">
                        {item.name}
                      </h3>
                      {item.duration ? (
                        <span className="cine-label shrink-0 pb-1 text-[var(--cn-on-dark-soft)]">
                          {item.duration}
                        </span>
                      ) : null}
                    </div>

                    <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-[600ms] ease-[var(--cn-ease)] motion-reduce:transition-none sm:grid-rows-[0fr] sm:group-hover:grid-rows-[1fr] sm:group-focus-visible:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <p className="max-w-[34ch] pt-3 text-[13px] leading-6 text-[var(--cn-on-dark-soft)]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/25 pt-4">
                      <span className="cine-label text-[var(--cn-on-dark)]">Plan intake</span>
                      <span
                        aria-hidden
                        className="text-[var(--cn-on-dark)] transition-transform duration-500 ease-[var(--cn-ease)] group-hover:translate-x-1.5"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        {classes.length > 3 ? (
          <ScrollReveal delayMs={120}>
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--cn-line)] pt-6">
              <span className="cine-label text-[var(--cn-muted)]">Ook in de kliniek</span>
              {classes.slice(3).map((item) => (
                <span key={item.id} className="cine-pill cine-pill-ink">
                  {item.name}
                  {item.duration ? (
                    <span className="text-[var(--cn-muted)]">{item.duration}</span>
                  ) : null}
                </span>
              ))}
            </div>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}

export function SkinClinicCinematicConcerns({
  concerns,
  studioName,
  city,
  booking,
}: {
  concerns: StudioSkinConcern[];
  studioName: string;
  city: string;
  booking: CineModel["booking"];
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (concerns.length === 0) return null;

  return (
    <section
      id="huidproblemen"
      className="relative overflow-hidden bg-[var(--cn-dark)] text-[var(--cn-on-dark)]"
    >
      <div aria-hidden className="cine-grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
        <ScrollReveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="cine-label text-[var(--cn-on-dark-soft)]">Huidproblemen</p>
              <h2 className="cine-display cine-display-l cine-lower mt-5">
                waar {studioName.toLowerCase()}
                <br />
                <span className="cine-italic">bij kan helpen.</span>
              </h2>
            </div>
            <p className="max-w-[42ch] text-[13.5px] leading-6 text-[var(--cn-on-dark-soft)] sm:text-[14px]">
              Per thema bouwen we een informatieve pagina voor Google en je klanten.
              {city ? ` Hier de belangrijkste thema's voor ${city.toLowerCase()}.` : ""}
            </p>
          </div>
        </ScrollReveal>

        <div
          ref={railRef}
          className="mt-12 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-14 [&::-webkit-scrollbar]:hidden"
        >
          {concerns.map((concern, index) => (
            <article
              key={concern.id}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              className={`min-w-[min(84vw,20rem)] shrink-0 snap-center rounded-[1.5rem] border p-6 transition-colors duration-500 sm:min-w-[18rem] sm:p-7 ${
                index === activeIndex
                  ? "border-white/35 bg-white/[0.06]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <p className="cine-label text-[var(--cn-on-dark-soft)]">Huidthema</p>
              <h3 className="cine-display cine-lower mt-4 text-[1.65rem] leading-none text-[var(--cn-on-dark)]">
                {concern.name}
              </h3>
              <p className="mt-4 text-[13px] leading-6 text-[var(--cn-on-dark-soft)]">
                {concern.description}
              </p>
              {concern.related_treatment ? (
                <p className="mt-5 cine-label text-[var(--cn-on-dark-soft)]">
                  vaak: {concern.related_treatment}
                </p>
              ) : null}
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div aria-hidden className="flex items-center gap-2">
            {concerns.map((concern, index) => (
              <span
                key={concern.id}
                className={`h-[2px] rounded-full transition-all duration-500 ${
                  index === activeIndex ? "w-8 bg-[var(--cn-on-dark)]" : "w-4 bg-white/25"
                }`}
              />
            ))}
          </div>
          <a
            href={booking.href}
            {...(booking.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="cine-pill"
          >
            Vraag intake aan
          </a>
        </div>
      </div>
    </section>
  );
}

function JourneyPanel({
  step,
  index,
  flip,
}: {
  step: SkinCineJourneyStep;
  index: number;
  flip: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <ScrollReveal delayMs={index * 80}>
      <article
        ref={frameRef}
        className="grid overflow-hidden rounded-[1.75rem] bg-[var(--cn-cream-2)] lg:grid-cols-12"
      >
        <div
          className={`relative min-h-[14rem] overflow-hidden bg-[var(--cn-dark)] lg:col-span-5 lg:min-h-[20rem] ${
            flip ? "lg:order-2" : ""
          }`}
        >
          <motion.div
            style={reduceMotion ? undefined : { y }}
            className="cine-media absolute inset-[-6%] will-change-transform"
          >
            <Image
              src={step.image.url}
              alt={step.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </motion.div>
          <div aria-hidden className="cine-grain pointer-events-none absolute inset-0" />
        </div>

        <div
          className={`flex flex-col justify-center px-7 py-9 sm:px-10 lg:col-span-7 lg:px-14 lg:py-12 ${
            flip ? "lg:order-1" : ""
          }`}
        >
          <p className="cine-label text-[var(--cn-muted)]">{step.phase}</p>
          <h3 className="cine-display cine-lower mt-4 text-[clamp(1.6rem,2.8vw,2.35rem)] leading-none text-[var(--cn-oxblood)]">
            {step.title}
          </h3>
          <p className="mt-4 max-w-[48ch] text-[13.5px] leading-6 text-[var(--cn-body)] sm:text-[14px] sm:leading-7">
            {step.body}
          </p>
        </div>
      </article>
    </ScrollReveal>
  );
}

export function SkinClinicCinematicJourney({
  steps,
  booking,
}: {
  steps: SkinClinicCineBundle["journey"];
  booking: CineModel["booking"];
}) {
  if (steps.length === 0) return null;

  return (
    <section id="traject" className="bg-[var(--cn-cream)]">
      <div className="mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
        <ScrollReveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="cine-label text-[var(--cn-muted)]">Jouw traject</p>
              <h2 className="cine-display cine-display-l cine-lower mt-5 text-[var(--cn-oxblood)]">
                van intake
                <br />
                <span className="cine-italic">tot nazorg.</span>
              </h2>
            </div>
            <p className="max-w-[40ch] text-[13.5px] leading-6 text-[var(--cn-body)]">
              Geen vaste behandeltijd in minuten op de site. Wel een helder pad:
              analyse, plan, behandeling en onderhoud.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 flex flex-col gap-4 lg:mt-14 lg:gap-5">
          {steps.slice(0, 4).map((step, index) => (
            <JourneyPanel key={step.id} step={step} index={index} flip={index % 2 === 1} />
          ))}
        </div>

        <div className="mt-10 flex justify-center lg:mt-12">
          <a
            href={booking.href}
            {...(booking.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="cine-pill cine-pill-ink"
          >
            {booking.label}
          </a>
        </div>
      </div>
    </section>
  );
}
