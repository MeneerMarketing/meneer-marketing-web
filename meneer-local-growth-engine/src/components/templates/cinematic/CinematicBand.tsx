"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { CineModel } from "@/components/templates/cinematic/cinematicModel";

interface Props {
  model: CineModel;
}

/**
 * Breed rustpunt in zwart-wit. Het beeld schuift trager dan de pagina, dus de
 * band voelt als een shot en niet als een plaatje.
 */
export function CinematicBand({ model }: Props) {
  const { band, booking } = model;
  const frameRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  if (!band.image) return null;

  return (
    <section className="bg-[var(--cn-cream)] pb-16 sm:pb-20 lg:pb-24">
      <div
        ref={frameRef}
        className="relative mx-5 overflow-hidden rounded-[1.75rem] bg-[var(--cn-dark)] sm:mx-8 lg:mx-10"
      >
        <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]">
          <motion.div
            style={reduceMotion ? undefined : { y }}
            className="cine-media-bw absolute inset-[-8%] will-change-transform"
          >
            <Image
              src={band.image.url}
              alt={band.image.alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>

          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-[rgba(12,10,9,0.5)] via-[rgba(12,10,9,0.2)] to-[rgba(12,10,9,0.55)]"
          />
          <div
            aria-hidden
            className="cine-grain pointer-events-none absolute inset-0"
          />

          <div className="absolute inset-x-7 top-8 sm:inset-x-10 sm:top-10 lg:inset-x-14 lg:top-12">
            <h2 className="cine-display cine-display-l cine-lower text-[var(--cn-on-dark)] sm:text-right">
              {band.first}
              <br />
              <span className="cine-italic">{band.second}</span>
            </h2>
          </div>

          <div className="absolute inset-x-7 bottom-8 flex sm:inset-x-10 sm:bottom-10 sm:justify-end lg:inset-x-14 lg:bottom-12">
            <a
              href={booking.href}
              {...(booking.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="cine-pill"
            >
              {booking.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
