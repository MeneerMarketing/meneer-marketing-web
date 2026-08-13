"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { StudioTeamMember } from "@/types/studio";
import { plainText } from "@/lib/text";

interface Props {
  team: StudioTeamMember[];
}

/**
 * Instructors als uitklappende portretpanelen. De foto's zijn 4:5, dus panelen
 * blijven staand: het actieve paneel groeit, de rest blijft een smalle strip
 * met de naam verticaal. Zo wordt niemand door een landscape-crop onthoofd.
 */
export function ClinicTeam({ team }: Props) {
  const members = team.slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const reduceMotion = useReducedMotion();

  const setCardRef = useCallback((node: HTMLElement | null, index: number) => {
    cardRefs.current[index] = node;
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    const cards = cardRefs.current.filter((card): card is HTMLElement =>
      Boolean(card)
    );
    if (!rail || cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio < 0.6) continue;
          const index = cards.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActiveIndex(index);
        }
      },
      { root: rail, threshold: [0.6] }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [members.length]);

  const active = members[activeIndex] ?? members[0];
  if (members.length === 0 || !active) return null;

  return (
    <section id="team" className="fc-plane-010">
      <div className="mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-[5vw] lg:py-24">
        <ScrollReveal>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="figma-label text-[var(--fc-label)]">Team</p>
              <h2 className="figma-display-l mt-3">
                <span className="font-bold">Jouw</span>{" "}
                <span className="font-light">instructors</span>
              </h2>
              <p className="mt-3 max-w-[42ch] text-[14px] leading-6 text-[var(--fc-ink-soft)] sm:text-[15px]">
                Zij staan naast je reformer. Kies een portret en je leest wie je
                voor je hebt.
              </p>
            </div>
            <span aria-hidden className="hidden items-center gap-1.5 lg:flex">
              {members.map((member, index) => (
                <span
                  key={member.id}
                  className={`h-[2px] rounded-full transition-all duration-500 ease-[var(--fc-ease)] ${
                    index === activeIndex
                      ? "w-7 bg-[var(--fc-accent-deep)]"
                      : "w-3 bg-[var(--fc-line)]"
                  }`}
                />
              ))}
            </span>
          </div>
        </ScrollReveal>

        {/* Desktop: accordeon van staande portretten, bio ernaast */}
        <ScrollReveal delayMs={80} className="mt-10 hidden lg:block">
          <div className="grid grid-cols-[1.15fr_0.85fr] items-stretch gap-10 xl:gap-14">
            <div className="flex h-[30rem] gap-3 xl:h-[33rem]">
              {members.map((member, index) => {
                const isActive = index === activeIndex;
                const name = plainText(member.name);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    aria-expanded={isActive}
                    aria-label={name}
                    className="group relative min-w-0 overflow-hidden rounded-[var(--fc-radius-lg)] bg-[var(--fc-mist)] text-left transition-[flex-grow] duration-700 ease-[var(--fc-ease)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fc-accent-deep)] motion-reduce:transition-none"
                    style={{ flexGrow: isActive ? 1.9 : 1, flexBasis: 0 }}
                  >
                    {member.image_url ? (
                      <Image
                        src={member.image_url}
                        alt={name}
                        fill
                        className={`object-cover object-[center_18%] transition-all duration-700 ease-[var(--fc-ease)] ${
                          isActive
                            ? "scale-100 saturate-100"
                            : "scale-[1.04] saturate-[0.8]"
                        }`}
                        sizes="(max-width: 1280px) 30vw, 24vw"
                      />
                    ) : null}

                    <span
                      aria-hidden
                      className={`absolute inset-0 transition-colors duration-700 ${
                        isActive
                          ? "bg-[rgba(43,35,27,0.06)]"
                          : "bg-[rgba(43,35,27,0.4)] group-hover:bg-[rgba(43,35,27,0.28)]"
                      }`}
                    />

                    <span
                      aria-hidden
                      className={`absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[rgba(43,35,27,0.7)] to-transparent transition-opacity duration-700 ${
                        isActive ? "opacity-0" : "opacity-100"
                      }`}
                    />

                    <span
                      aria-hidden
                      style={{ writingMode: "vertical-rl" }}
                      className={`absolute bottom-5 left-1/2 -translate-x-1/2 text-[12px] font-medium tracking-[0.18em] uppercase text-[var(--fc-on-dark)] transition-opacity duration-500 ${
                        isActive ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      {name}
                    </span>

                    <span
                      aria-hidden
                      className={`absolute bottom-5 left-5 h-[2px] bg-[var(--fc-on-dark-btn)] transition-all duration-700 ease-[var(--fc-ease)] ${
                        isActive ? "w-12 opacity-100" : "w-0 opacity-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="relative flex flex-col justify-center">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={active.id}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.45,
                    ease: [0.25, 0.8, 0.25, 1],
                  }}
                >
                  <p className="figma-label text-[var(--fc-label)]">
                    {plainText(active.role)}
                  </p>
                  <h3 className="mt-3 text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--fc-ink)]">
                    {plainText(active.name)}
                  </h3>
                  <span
                    aria-hidden
                    className="mt-6 block h-[2px] w-14 bg-[var(--fc-accent-deep)]"
                  />
                  <p className="mt-6 max-w-[40ch] text-[15px] leading-7 text-[var(--fc-ink-soft)]">
                    {plainText(active.bio)}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-[var(--fc-line)] pt-6">
                <a
                  href="#rooster"
                  className="figma-label inline-flex items-center gap-2 text-[var(--fc-accent-deep)] transition-colors hover:text-[var(--fc-ink)]"
                >
                  Bekijk het rooster
                  <span aria-hidden>→</span>
                </a>
                <span className="text-[13px] text-[var(--fc-ink-mute)]">
                  Kies een portret om te wisselen
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Mobiel: snap-rail met staande portretten */}
        <div
          ref={railRef}
          className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {members.map((member, index) => (
            <article
              key={member.id}
              ref={(node) => setCardRef(node, index)}
              className="w-[68vw] max-w-[260px] shrink-0 snap-start"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--fc-radius-lg)] bg-[var(--fc-mist)]">
                {member.image_url ? (
                  <Image
                    src={member.image_url}
                    alt={plainText(member.name)}
                    fill
                    className="object-cover object-[center_18%]"
                    sizes="68vw"
                  />
                ) : null}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[rgba(43,35,27,0.78)] to-transparent"
                />
                <div className="absolute inset-x-4 bottom-4">
                  <p className="text-[1.05rem] font-semibold tracking-tight text-[var(--fc-on-dark)]">
                    {plainText(member.name)}
                  </p>
                  <p className="figma-label mt-1 text-[var(--fc-on-dark-label)]">
                    {plainText(member.role)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-6 text-[var(--fc-ink-soft)]">
                {plainText(member.bio)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
