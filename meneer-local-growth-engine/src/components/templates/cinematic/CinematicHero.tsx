"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CinematicChrome } from "@/components/templates/cinematic/CinematicChrome";
import type { CineModel } from "@/components/templates/cinematic/cinematicModel";

interface Props {
  model: CineModel;
}

const SHOT_MS = 7000;

/**
 * Filmische opening: een reeks shots die langzaam in elkaar overlopen, met een
 * scrolllaag eronder. Het beeld zakt trager weg dan de tekst, waardoor de
 * overgang naar de eerste sectie als een camerabeweging leest in plaats van een
 * sprong. Bij prefers-reduced-motion staat er één stil beeld.
 */
export function CinematicHero({ model }: Props) {
  const { heroImage, heroShots, headline, lead, city, primaryService, studioTypes } =
    model;
  const shots = heroShots.length > 0 ? heroShots : heroImage ? [heroImage] : [];
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const shotY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const shotScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.5]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0px", "-64px"]);
  const textFade = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  useEffect(() => {
    if (reduced || shots.length < 2) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % shots.length);
    }, SHOT_MS);

    return () => window.clearInterval(id);
  }, [reduced, shots.length]);

  const active = shots[index] ?? shots[0] ?? null;
  const layer = reduced ? undefined : { y: shotY, scale: shotScale };
  const copy = reduced ? undefined : { y: textY, opacity: textFade };

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-[var(--cn-dark)]"
    >
      <motion.div className="absolute inset-0" style={layer}>
        <AnimatePresence initial={false}>
          {active ? (
            <motion.div
              key={active.url}
              className="cine-media absolute inset-0 overflow-hidden"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: reduced ? 0 : 1.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <Image
                src={active.url}
                alt={active.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover object-center will-change-transform ${
                  reduced ? "" : "animate-ken-burns"
                }`}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <div aria-hidden className="cine-scrim absolute inset-0" />
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[var(--cn-dark-2)]"
        style={reduced ? { opacity: 0 } : { opacity: veil }}
      />
      <div aria-hidden className="cine-grain pointer-events-none absolute inset-0" />

      <CinematicChrome model={model} />

      <motion.div
        className="absolute inset-x-0 bottom-0 z-20 px-5 pb-32 sm:px-8 sm:pb-32 lg:px-10 lg:pb-32"
        style={copy}
      >
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="cine-label text-[var(--cn-on-dark-soft)]">{city}</span>
              <span aria-hidden className="h-px w-8 bg-white/35" />
              <span className="cine-label text-[var(--cn-on-dark-soft)]">
                {primaryService}
              </span>
            </div>
            <p className="mt-4 text-[13.5px] leading-6 text-[var(--cn-on-dark-soft)] sm:mt-5 sm:text-[15px] sm:leading-7">
              {lead}
            </p>

            {shots.length > 1 ? (
              <div className="mt-7 flex items-center gap-2.5">
                {shots.map((shot, shotIndex) => (
                  <button
                    key={shot.url}
                    type="button"
                    onClick={() => setIndex(shotIndex)}
                    aria-label={`Beeld ${shotIndex + 1} van ${shots.length}`}
                    aria-current={shotIndex === index}
                    className="group py-2"
                  >
                    <span
                      aria-hidden
                      className={`block h-[2px] transition-all duration-700 ease-[var(--cn-ease)] ${
                        shotIndex === index
                          ? "w-10 bg-[var(--cn-on-dark)]"
                          : "w-5 bg-white/35 group-hover:bg-white/70"
                      }`}
                    />
                  </button>
                ))}
              </div>
            ) : null}

            <span aria-hidden className="cine-cue mt-6 hidden text-white/45 lg:block" />
          </div>

          <div className="lg:max-w-[62%] lg:text-right">
            <h1 className="cine-display cine-display-hero cine-lower text-[var(--cn-on-dark)]">
              {headline.first}
              <br />
              <span className="cine-italic">{headline.second}</span>
            </h1>

            {studioTypes.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-7 lg:justify-end">
                {studioTypes.map((type) => (
                  <a key={type.id} href="#lessen" className="cine-pill">
                    {type.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
