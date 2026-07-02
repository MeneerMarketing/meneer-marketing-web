"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

/** Hoogte (px) van het mascotte-hoofd op de rail */
const HEAD_SIZE_MOBILE = 30;
const HEAD_SIZE_DESKTOP = 38;

/**
 * De speelse scrollbar van Meneer Marketing: het hoofd rijdt langs de
 * rechterrand mee met je scrollpositie en laat een oranje spoor achter.
 * Kantelt licht mee met de scrollsnelheid. De native scrollbar is
 * verborgen (globals.css), dus dit is dé scroll-indicator van de site.
 */
export function ScrollMeneer() {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const [trackHeight, setTrackHeight] = useState(0);
  const [headSize, setHeadSize] = useState(HEAD_SIZE_DESKTOP);
  const [scrollable, setScrollable] = useState(false);

  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.6,
  });

  // Bij reduced motion volgt het hoofd de scroll direct, zonder veer of kanteling
  const progress = reduce ? scrollYProgress : smooth;
  const headY = useTransform(progress, (v) => v * Math.max(trackHeight, 0));
  const trailScale = useTransform(progress, (v) => Math.max(v, 0.001));

  const velocity = useVelocity(smooth);
  const tiltTarget = useTransform(velocity, [-1.6, 0, 1.6], [-16, 0, 16]);
  const tilt = useSpring(tiltTarget, { stiffness: 220, damping: 16 });

  useEffect(() => {
    function measure() {
      const doc = document.documentElement;
      setScrollable(doc.scrollHeight > window.innerHeight + 48);
      const size =
        window.innerWidth < 640 ? HEAD_SIZE_MOBILE : HEAD_SIZE_DESKTOP;
      setHeadSize(size);
      const rail = railRef.current;
      if (rail) setTrackHeight(rail.clientHeight - size);
    }

    measure();
    window.addEventListener("resize", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={railRef}
      className={`pointer-events-none fixed bottom-6 right-1 top-24 z-40 w-[38px] transition-opacity duration-500 sm:right-1.5 ${
        scrollable ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden
    >
      {/* Stippellijn-route over de volle hoogte */}
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 border-l-2 border-dotted border-mm-border/90" />

      {/* Oranje spoor dat Meneer achterlaat */}
      <motion.div
        className="absolute left-1/2 top-0 w-[3px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-orange-300 to-mm-accent"
        style={{
          height: trackHeight + headSize / 2,
          scaleY: trailScale,
        }}
      />

      {/* Vlaggetje bij de finish */}
      <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border-2 border-mm-accent bg-white" />

      {/* Het rijdende hoofd */}
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2 drop-shadow-[0_2px_6px_rgba(15,23,42,0.18)]"
        style={{
          y: headY,
          rotate: reduce ? undefined : tilt,
          width: headSize,
          height: headSize,
        }}
      >
        <InteractiveLogo className="h-full w-full" />
      </motion.div>
    </div>
  );
}
