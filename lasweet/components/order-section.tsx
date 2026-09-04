"use client";

import { useRef, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import cookieBoxTop from "@/public/photos/cookie-box-top.png";

export function OrderSection() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 70, damping: 18 });
  const y = useSpring(rawY, { stiffness: 70, damping: 18 });
  const rotate = useTransform(x, [-40, 40], [-4, 4]);

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (reduceMotion) return;
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rawX.set(px * 28);
    rawY.set(py * 18);
  }

  function onPointerLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <section
      ref={stageRef}
      id="bestellen"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="stripe-bg relative overflow-hidden"
    >
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-5 py-20 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-28">
        {/* Copy + CTA */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft">
            Bestellen
          </p>
          <h2 className="mt-3 font-display text-5xl font-semibold leading-[0.9] tracking-[-0.06em] text-ink sm:text-6xl md:text-7xl">
            Jouw box
            <br />
            <span className="font-semibold text-matcha">wacht.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink-soft md:text-lg lg:mx-0">
            Verjaardag, bruiloft of gewoon omdat het kan. Kies smaken, stuur een
            DM, Ela bakt vers.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/bestellen"
              className="group inline-flex items-center gap-3 rounded-full bg-matcha px-9 py-5 text-[14px] font-bold uppercase tracking-[0.14em] text-cream shadow-[0_20px_50px_-20px_rgba(111,3,19,0.45)] transition-all duration-300 hover:scale-[1.03] hover:bg-matcha-deep active:scale-[0.98]"
            >
              Bestel jouw box
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          </div>

          {/* Compact trust chips, één rij i.p.v. losse labels */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {["Vanaf 4 cookies", "Afhalen in Enschede", "Walk-in zaterdag"].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-ink/10 bg-cream/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft"
                >
                  {label}
                </span>
              ),
            )}
          </div>
        </div>

        {/* Box-foto als eyecatcher */}
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <motion.div
            className="relative w-full max-w-[420px] will-change-transform"
            style={
              reduceMotion
                ? undefined
                : {
                    x,
                    y,
                    rotate,
                  }
            }
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -10, 0],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    y: {
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
            }
          >
            <div
              aria-hidden="true"
              className="absolute inset-4 translate-x-3 translate-y-4 rotate-6 rounded-[2rem] bg-parchment"
            />
            <div className="relative -rotate-3 overflow-hidden rounded-[2rem] border-[6px] border-cream shadow-[0_40px_90px_-30px_rgba(68,57,43,0.45)] transition-transform duration-500 hover:rotate-0">
              <div className="relative aspect-[4/5]">
                <Image
                  src={cookieBoxTop}
                  alt="Lá Sweet cookie box, klaar om te bestellen"
                  fill
                  quality={92}
                  sizes="(max-width: 1024px) 420px, 440px"
                  className="object-cover"
                />
              </div>
            </div>

            <span className="absolute -left-2 bottom-10 z-10 -rotate-6 rounded-full bg-beige px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink shadow-lg sm:-left-4">
              Fresh batch
            </span>
            <span className="absolute -right-2 top-8 z-10 rotate-6 rounded-full bg-matcha px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-cream shadow-lg sm:-right-4">
              Vanaf 4
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
