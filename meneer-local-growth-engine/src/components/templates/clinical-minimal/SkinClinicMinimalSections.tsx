"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { KenBurnsImage } from "@/components/motion/KenBurnsImage";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import {
  ClinicNav,
  type MegaMenu,
} from "@/components/templates/reformer-minimal/ClinicChrome";
import {
  journeyLabelForIndex,
  type SkinClinicMinimalModel,
  type SkinClinicTrustPillar,
} from "@/components/templates/clinical-minimal/skinClinicMinimalModel";
import { resolveNavBrandName } from "@/lib/clinicCopySanitizer";
import type { ClinicStep } from "@/components/templates/reformer-minimal/clinicModel";
import type { StudioSkinConcern } from "@/types/studio";

export function SkinClinicMinimalTopBar({
  model,
}: {
  model: Pick<
    SkinClinicMinimalModel,
    "ratingDisplay" | "reviewCount" | "contact" | "show"
  >;
}) {
  const { ratingDisplay, reviewCount, contact, show } = model;

  return (
    <div className="fc-plane-010 px-3 sm:px-4">
      <div className="flex h-10 items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <div className="min-w-0">
          {ratingDisplay ? (
            <a
              href="#ervaringen"
              className="inline-flex items-center gap-2 text-[12px] text-[var(--fc-ink)] transition-opacity hover:opacity-70"
            >
              <span
                className="inline-flex shrink-0 gap-0.5 text-[11px] leading-none text-[var(--fc-ink)]"
                aria-hidden
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </span>
              <span className="font-semibold tabular-nums">{ratingDisplay}</span>
              <span className="text-[var(--fc-ink-soft)]">
                uit{" "}
                {reviewCount > 0 ? (
                  <span className="underline underline-offset-[3px] decoration-[var(--fc-ink-soft)]">
                    {reviewCount} reviews
                  </span>
                ) : (
                  "waardering"
                )}
              </span>
            </a>
          ) : (
            <span className="text-[12px] text-[var(--fc-ink-soft)]">
              Clinical-grade huidzorg
            </span>
          )}
        </div>

        <div className="hidden items-center gap-5 text-[12px] md:flex lg:gap-6">
          {show.faq ? (
            <a
              href="#faq"
              className="text-[var(--fc-ink-faint)] transition-colors hover:text-[var(--fc-ink)]"
            >
              Veelgestelde vragen
            </a>
          ) : null}
          {show.plans ? (
            <a
              href="#tarieven"
              className="text-[var(--fc-ink-faint)] transition-colors hover:text-[var(--fc-ink)]"
            >
              Pakketten
            </a>
          ) : null}
          {contact.email ? (
            <a
              href={`mailto:${contact.email}`}
              className="font-medium text-[var(--fc-ink)] underline underline-offset-[3px] decoration-[var(--fc-ink)]/50 transition-opacity hover:opacity-70"
            >
              {contact.email}
            </a>
          ) : null}
          {contact.phone ? (
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="font-medium text-[var(--fc-ink)] underline underline-offset-[3px] decoration-[var(--fc-ink)]/50 transition-opacity hover:opacity-70"
            >
              {contact.phone}
            </a>
          ) : null}
        </div>

        {contact.phone ? (
          <a
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
            className="text-[12px] font-medium text-[var(--fc-ink)] underline underline-offset-[3px] md:hidden"
          >
            Bel
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function SkinClinicMinimalHero({
  model,
  menus,
}: {
  model: SkinClinicMinimalModel;
  menus: MegaMenu[];
}) {
  const { heroImage, headline, lead, booking, city, studioName, logoUrl, logoLight, logoOnLightBackground, navLinks, usps } =
    model;

  return (
    <section id="top" className="fc-plane-010 px-3 pb-3 pt-1 sm:px-4 sm:pb-4">
      <div className="relative h-[calc(100svh-5.5rem)] min-h-[560px] w-full">
        <div className="absolute inset-0 overflow-hidden rounded-[var(--fc-radius-lg)] sm:rounded-[var(--fc-radius-xl)]">
          {heroImage ? (
            <KenBurnsImage src={heroImage.url} alt={heroImage.alt} priority />
          ) : (
            <div className="absolute inset-0 bg-[var(--fc-dark)]" />
          )}
          <div aria-hidden className="absolute inset-0 bg-black/48" />
        </div>

        <ClinicNav
          studioName={studioName}
          brandName={resolveNavBrandName(studioName)}
          logoUrl={logoUrl}
          logoLight={logoLight}
          logoOnLightBackground={logoOnLightBackground}
          links={navLinks}
          booking={booking}
          menus={menus}
          onMedia
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-8 sm:px-8 sm:pb-10 lg:px-10 lg:pb-14">
          <div className="pointer-events-auto max-w-[56rem]">
            <p className="figma-label text-white/72">{city || model.eyebrow}</p>
            <h1 className="figma-hero-title mt-3 text-white">
              {headline.accent ? (
                <>
                  <span className="figma-hero-title-strong">{headline.primary}</span>{" "}
                  <span className="font-light">{headline.accent}</span>
                </>
              ) : (
                <span className="figma-hero-title-strong">{headline.primary}</span>
              )}
            </h1>
            <p className="mt-5 max-w-[50ch] text-[15px] leading-7 text-white/88 sm:text-[16px] sm:leading-8">
              {lead}
            </p>

            {usps.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {usps.slice(0, 4).map((usp) => (
                  <li
                    key={usp}
                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-white/90 backdrop-blur-sm"
                  >
                    {usp}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={booking.href}
                {...(booking.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex h-11 items-center gap-1.5 rounded-full bg-[var(--fc-on-dark-btn)] px-5 text-[12px] font-medium text-[var(--fc-on-dark-btn-text)] transition-transform hover:-translate-y-0.5"
              >
                {booking.label}
                <span aria-hidden>›</span>
              </a>
              <a
                href="#behandelingen"
                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/55 px-5 text-[12px] font-medium text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Bekijk behandelingen
                <span aria-hidden>›</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkinClinicMinimalAbout({
  studioName,
  city,
  about,
  image,
  primaryService,
  pillars,
  booking,
}: {
  studioName: string;
  city: string;
  about: SkinClinicMinimalModel["about"];
  image: SkinClinicMinimalModel["studioImage"];
  primaryService: string;
  pillars: SkinClinicTrustPillar[];
  booking: SkinClinicMinimalModel["booking"];
}) {
  const [activePillar, setActivePillar] = useState(0);
  const featuredPillars = pillars.slice(0, 3);
  const active =
    featuredPillars[activePillar] ?? featuredPillars[0] ?? null;
  const lead = about.body || about.paragraphs[0] || "";

  return (
    <section id="over" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 100% 0%, color-mix(in srgb, var(--fc-accent) 16%, transparent), transparent 68%), radial-gradient(ellipse 45% 40% at 0% 100%, color-mix(in srgb, var(--fc-ink) 5%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <ScrollReveal className="lg:col-span-6 xl:col-span-5">
            <p className="figma-label text-[var(--fc-label)]">Over de kliniek</p>
            <h2 className="figma-display-l mt-4 text-[clamp(2.25rem,4.8vw,3.75rem)] leading-[1.02] tracking-tight">
              {about.heading}
            </h2>
            {lead ? (
              <p className="mt-6 max-w-[44ch] text-[1.05rem] leading-8 text-[var(--fc-ink-soft)]">
                {lead}
              </p>
            ) : null}

            {featuredPillars.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {featuredPillars.map((pillar, index) => (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => setActivePillar(index)}
                    className={`rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-all duration-300 ${
                      activePillar === index
                        ? "border-[var(--fc-accent-deep)] bg-[var(--fc-accent-soft)] text-[var(--fc-accent-deep)]"
                        : "border-[var(--fc-line)] bg-[var(--fc-paper)] text-[var(--fc-ink-mute)] hover:border-[var(--fc-accent-deep)]/30 hover:text-[var(--fc-ink)]"
                    }`}
                  >
                    {pillar.title}
                  </button>
                ))}
              </div>
            ) : null}

            {active ? (
              <article className="mt-6 rounded-[var(--fc-radius)] border border-[var(--fc-line)] bg-[var(--fc-paper)]/90 p-5 backdrop-blur-sm transition-all duration-500 sm:p-6">
                <p className="text-[15px] leading-7 text-[var(--fc-ink-soft)]">{active.body}</p>
              </article>
            ) : null}

            {about.paragraphs.length > 1 ? (
              <div className="mt-6 space-y-3 border-l-2 border-[var(--fc-accent)]/45 pl-5 text-[15px] leading-7 text-[var(--fc-ink-soft)]">
                {about.paragraphs.slice(1).map((paragraph) => (
                  <p key={paragraph.slice(0, 28)}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={booking.href}
                {...(booking.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex h-11 items-center gap-1.5 rounded-full bg-[var(--fc-accent-deep)] px-5 text-[12px] font-medium text-white transition-transform hover:-translate-y-0.5"
              >
                {booking.label}
                <span aria-hidden>›</span>
              </a>
              <a
                href="#behandelingen"
                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-[var(--fc-line)] px-5 text-[12px] font-medium text-[var(--fc-ink)] transition-colors hover:border-[var(--fc-accent-deep)]/40"
              >
                Bekijk behandelingen
                <span aria-hidden>›</span>
              </a>
            </div>
          </ScrollReveal>

          <div className="relative lg:col-span-6 xl:col-span-7">
            <ScrollReveal delayMs={80}>
              <div className="relative">
                {image ? (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--fc-radius-lg)] shadow-[0_28px_90px_-32px_rgba(20,16,12,0.35)] sm:aspect-[5/6] lg:aspect-[4/5]">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 48vw"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
                    />
                  </div>
                ) : null}

                <div className="absolute -bottom-5 left-4 right-4 rounded-[var(--fc-radius)] border border-[var(--fc-line)] bg-[var(--fc-paper)]/95 p-5 backdrop-blur-md sm:left-8 sm:right-auto sm:max-w-[22rem]">
                  <p className="figma-label text-[var(--fc-ink-faint)]">Waarom {studioName}</p>
                  <p className="mt-2 text-lg font-semibold leading-snug tracking-tight text-[var(--fc-ink)]">
                    Huidanalyse eerst. Behandeling pas als het plan klopt.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--fc-ink-soft)]">
                    Focus op {primaryService.toLowerCase()}
                    {city ? ` in ${city}` : ""}.
                  </p>
                </div>

                {about.facts.length > 0 ? (
                  <dl className="absolute -right-1 top-6 hidden min-w-[11.5rem] rounded-[var(--fc-radius)] border border-[var(--fc-line)] bg-[var(--fc-dark)] p-4 text-white shadow-xl lg:block">
                    {about.facts.slice(0, 2).map((fact) => (
                      <div key={fact.label} className="not-last:mb-4">
                        <dt className="figma-label text-white/55">{fact.label}</dt>
                        <dd className="mt-1 text-2xl font-semibold tracking-tight">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {about.facts.length > 0 ? (
          <ScrollReveal delayMs={120}>
            <dl className="mt-14 grid grid-cols-2 gap-4 border-t border-[var(--fc-line)] pt-10 sm:grid-cols-3 lg:mt-16">
              {about.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-[var(--fc-radius)] border border-[var(--fc-line)] bg-[var(--fc-paper)]/80 p-5 transition-colors duration-300 hover:border-[var(--fc-accent-deep)]/35"
                >
                  <dt className="figma-label text-[var(--fc-ink-faint)]">{fact.label}</dt>
                  <dd className="mt-2 text-2xl font-semibold tracking-tight text-[var(--fc-ink)]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}

export function SkinClinicMinimalConcerns({
  concerns,
  studioName,
  city,
}: {
  concerns: StudioSkinConcern[];
  studioName: string;
  city: string;
}) {
  const reduceMotion = useReducedMotion();
  const visible = useMemo(() => concerns.slice(0, 7), [concerns]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (visible.length === 0) return null;

  const safeIndex = activeIndex % visible.length;
  const active = visible[safeIndex]!;
  const sideCards = [
    visible[(safeIndex + 1) % visible.length]!,
    visible[(safeIndex + 2) % visible.length]!,
  ];
  const bottomCards = visible.filter(
    (concern) =>
      concern.id !== active.id &&
      !sideCards.some((side) => side.id === concern.id),
  );

  return (
    <section id="huidproblemen" className="sc-concerns-surface relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
        <ScrollReveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="figma-label text-white/50">Huidproblemen</p>
              <h2 className="figma-display-l mt-4 max-w-[22ch] text-white lg:max-w-none lg:whitespace-nowrap">
                <span className="font-bold">Waar {studioName}</span>{" "}
                <span className="font-light text-white/88">bij kan helpen</span>
              </h2>
              <p className="mt-4 max-w-[52ch] text-[15px] leading-7 text-white/62">
                Per huidthema een eigen pagina voor Google en je klanten. Klik een
                thema om het verhaal te zien
                {city ? ` voor ${city}` : ""}.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:max-w-[28rem] lg:justify-end">
              {visible.map((concern, index) => {
                const isActive = index === safeIndex;
                return (
                  <button
                    key={concern.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`rounded-full border px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-all duration-300 ${
                      isActive
                        ? "border-white/35 bg-white/12 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/22 hover:bg-white/[0.07] hover:text-white/85"
                    }`}
                  >
                    {concern.name.split(/\s*&\s*/)[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-12 lg:gap-5">
          <ScrollReveal className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.article
                key={active.id}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }}
                className="group relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-[var(--fc-radius-lg)] border border-white/12 bg-white/[0.05] p-7 backdrop-blur-sm sm:p-9"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(ellipse 70% 55% at 0% 0%, color-mix(in srgb, var(--fc-accent-deep) 22%, transparent), transparent 68%)",
                  }}
                />
                <div className="relative">
                  <p className="figma-label text-white/48">Uitgelicht thema</p>
                  <h3 className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-tight text-white">
                    {active.name}
                  </h3>
                  <p className="mt-4 max-w-[48ch] text-[15px] leading-7 text-white/68">
                    {active.description}
                  </p>
                </div>
                <div className="relative mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                  {active.related_treatment ? (
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
                      Vaak: {active.related_treatment}
                    </p>
                  ) : (
                    <span />
                  )}
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:border-white/35 hover:bg-white/16"
                  >
                    Vraag intake aan
                    <span aria-hidden>›</span>
                  </a>
                </div>
              </motion.article>
            </AnimatePresence>
          </ScrollReveal>

          <div className="flex flex-col gap-4 lg:col-span-5">
            {sideCards.map((concern, index) => {
              const concernIndex = visible.findIndex((item) => item.id === concern.id);
              return (
                <ScrollReveal key={concern.id} delayMs={(index + 1) * 70}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(concernIndex)}
                    className="group flex w-full flex-1 flex-col rounded-[var(--fc-radius)] border border-white/10 bg-white/[0.035] p-6 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/22 hover:bg-white/[0.07] sm:p-7"
                  >
                    <p className="figma-label text-white/42">Huidthema</p>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-white">
                      {concern.name}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-white/62">
                      {concern.description}
                    </p>
                    {concern.related_treatment ? (
                      <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.14em] text-white/42">
                        {concern.related_treatment}
                      </p>
                    ) : null}
                  </button>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {bottomCards.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {bottomCards.map((concern, index) => {
              const concernIndex = visible.findIndex((item) => item.id === concern.id);
              return (
                <ScrollReveal key={concern.id} delayMs={index * 50}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(concernIndex)}
                    className="group flex h-full w-full flex-col rounded-[var(--fc-radius)] border border-white/10 bg-white/[0.03] p-5 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <h3 className="text-lg font-semibold tracking-tight text-white">
                      {concern.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-white/58">
                      {concern.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/72 transition-transform group-hover:translate-x-0.5">
                      Bekijk thema
                      <span aria-hidden>→</span>
                    </span>
                  </button>
                </ScrollReveal>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}

const JOURNEY_HIGHLIGHTS = [
  ["Digitale huidscan", "Vrijblijvend gesprek", "Tijd voor al je vragen"],
  ["Volgorde & tempo", "Kosten vooraf helder", "Thuisadvies inbegrepen"],
  ["Comfort & veiligheid", "Duidelijke uitleg", "Herstel verwachting"],
  ["Evaluatie resultaat", "Productadvies", "Onderhoudsplan"],
] as const;

export function SkinClinicMinimalJourney({
  steps,
  bookingHref,
}: {
  steps: ClinicStep[];
  bookingHref: string;
}) {
  if (steps.length === 0) return null;

  return (
    <section id="traject" className="relative overflow-hidden border-y border-[var(--fc-line)] bg-[var(--fc-paper)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 0% 0%, color-mix(in srgb, var(--fc-accent-deep) 6%, transparent), transparent 60%)",
        }}
      />

      <div className="relative mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
        <ScrollReveal>
          <p className="figma-label text-[var(--fc-label)]">Jouw traject</p>
          <h2 className="figma-display-l mt-4 max-w-[20ch] lg:max-w-none lg:whitespace-nowrap">
            <span className="font-bold">Van intake</span>{" "}
            <span className="font-light text-[var(--fc-ink-soft)]">tot nazorg</span>
          </h2>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-7 text-[var(--fc-ink-soft)]">
            Vier fases die elkaar logisch opvolgen. Van eerste gesprek tot onderhoud,
            altijd met uitleg die je begrijpt.
          </p>
        </ScrollReveal>

        <div className="mt-14 flex flex-col gap-5 lg:gap-6">
          {steps.slice(0, 4).map((step, index) => {
            const flip = index % 2 === 1;
            const highlights = JOURNEY_HIGHLIGHTS[index] ?? JOURNEY_HIGHLIGHTS[0]!;

            return (
              <ScrollReveal key={step.id} delayMs={index * 90}>
                <article className="group grid overflow-hidden rounded-[var(--fc-radius-lg)] border border-[var(--fc-line)] bg-[var(--fc-mist)]/55 transition-all duration-500 hover:border-[var(--fc-accent-deep)]/22 hover:shadow-[0_24px_70px_-40px_rgba(20,16,12,0.28)] lg:grid-cols-12">
                  {step.image ? (
                    <div
                      className={`relative min-h-[15rem] overflow-hidden lg:col-span-5 lg:min-h-[22rem] ${
                        flip ? "lg:order-2" : ""
                      }`}
                    >
                      <Image
                        src={step.image.url}
                        alt={step.image.alt}
                        fill
                        className="object-cover transition-transform duration-700 ease-[var(--fc-ease)] group-hover:scale-[1.04]"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"
                      />
                      <p className="figma-label absolute bottom-5 left-5 text-white/75 sm:bottom-6 sm:left-6">
                        {journeyLabelForIndex(index)}
                      </p>
                    </div>
                  ) : null}
                  <div
                    className={`flex flex-col justify-center px-6 py-8 sm:px-9 sm:py-10 lg:col-span-7 lg:px-12 lg:py-12 ${
                      flip ? "lg:order-1" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="h-px w-10 bg-[var(--fc-accent-deep)]/45 transition-all duration-500 group-hover:w-14"
                      />
                      <p className="figma-label text-[var(--fc-accent-deep)]">
                        {journeyLabelForIndex(index)}
                      </p>
                    </div>
                    <h3 className="mt-4 text-[clamp(1.45rem,2.4vw,2rem)] font-semibold tracking-tight text-[var(--fc-ink)]">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-[52ch] text-[15px] leading-7 text-[var(--fc-ink-soft)] sm:text-[16px] sm:leading-8">
                      {step.body}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="rounded-full border border-[var(--fc-line)] bg-[var(--fc-paper)]/80 px-3 py-1.5 text-[11px] font-medium text-[var(--fc-ink-soft)] transition-colors duration-300 group-hover:border-[var(--fc-accent-deep)]/25"
                        >
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
          <a
            href={bookingHref}
            className="figma-btn figma-btn-dark inline-flex px-8 py-4 text-[11px]"
          >
            Start met gratis intake
          </a>
          <a
            href="#behandelingen"
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-[var(--fc-line)] px-5 text-[12px] font-medium text-[var(--fc-ink)] transition-colors hover:border-[var(--fc-accent-deep)]/35"
          >
            Bekijk behandelingen
            <span aria-hidden>›</span>
          </a>
        </div>
      </div>
    </section>
  );
}
