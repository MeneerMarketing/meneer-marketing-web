"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import cookiesDuo from "@/public/photos/cookies-duo.png";
import cookieHalves from "@/public/photos/cookie-halves.png";
import redVelvet from "@/public/photos/cookie-red-velvet.png";
import appleCrumble from "@/public/photos/cookie-apple-crumble.png";

interface Flavour {
  id: string;
  name: string;
  tag: string;
  description: string;
  photo: StaticImageData;
  alt: string;
}

const FLAVOURS: readonly Flavour[] = [
  {
    id: "red-velvet-aardbei",
    name: "Red velvet aardbei",
    tag: "crumble cookie",
    description:
      "Fluweelrood met witte chocolade, slagroomswirl en verse aardbei.",
    photo: redVelvet,
    alt: "Red velvet aardbei crumble cookie van Lá Sweet",
  },
  {
    id: "brownie-kinder-bueno",
    name: "Brownie Kinder Bueno",
    tag: "crumble cookie",
    description:
      "Brownie-basis met Kinder Bueno erop. Dik, zoet, gevaarlijk makkelijk leeg.",
    photo: cookieHalves,
    alt: "Brownie Kinder Bueno cookie helften van Lá Sweet",
  },
  {
    id: "appel-crumble",
    name: "Appel crumble",
    tag: "crumble cookie",
    description:
      "Warme kaneelappel met krokante crumble. Appeltaart, maar dan koek.",
    photo: appleCrumble,
    alt: "Appel crumble cookie van Lá Sweet",
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    tag: "crumble cookie",
    description:
      "Mascarpone-vibes, cacao en een hint koffie. Dessert in cookie-vorm.",
    photo: cookiesDuo,
    alt: "Tiramisu crumble cookies van Lá Sweet",
  },
];

const AUTO_MS = 3200;
const SWIPE_THRESHOLD = 48;

export function FlavourShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const pointerStartX = useRef<number | null>(null);
  const activePointerId = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const active = FLAVOURS[activeIndex];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((next: number) => {
    const len = FLAVOURS.length;
    setActiveIndex(((next % len) + len) % len);
  }, []);

  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  useEffect(() => {
    if (!inView || paused || reduceMotion || isDragging) return;
    const id = window.setInterval(goNext, AUTO_MS);
    return () => window.clearInterval(id);
  }, [inView, paused, reduceMotion, isDragging, goNext]);

  const selectFlavour = (index: number) => {
    setActiveIndex(index);
    setPaused(true);
    window.setTimeout(() => setPaused(false), AUTO_MS * 2);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
    activePointerId.current = event.pointerId;
    setIsDragging(true);
    setPaused(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    if (activePointerId.current !== event.pointerId) return;
    setDragX(event.clientX - pointerStartX.current);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    if (activePointerId.current !== event.pointerId) return;

    const delta = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    activePointerId.current = null;
    setIsDragging(false);
    setDragX(0);

    if (delta <= -SWIPE_THRESHOLD) goNext();
    else if (delta >= SWIPE_THRESHOLD) goPrev();

    window.setTimeout(() => setPaused(false), AUTO_MS);
  };

  return (
    <section
      ref={sectionRef}
      id="cookies"
      className="grid grid-cols-1 lg:min-h-[92vh] lg:grid-cols-2"
    >
      <div
        className="relative order-1 h-[58vh] cursor-grab overflow-hidden active:cursor-grabbing lg:order-2 lg:h-auto"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="region"
        aria-roledescription="carousel"
        aria-label="Cookie smaken foto's"
        style={{ touchAction: "pan-y" }}
      >
        {FLAVOURS.map((flavour, i) => {
          const offset = i - activeIndex;
          const isActive = i === activeIndex;
          const wrapNext =
            activeIndex === FLAVOURS.length - 1 && i === 0 && !isActive;
          const wrapPrev =
            activeIndex === 0 && i === FLAVOURS.length - 1 && !isActive;
          const isNeighbor =
            Math.abs(offset) === 1 || wrapNext || wrapPrev;
          const fromRight = wrapNext || (offset > 0 && !wrapPrev);
          const x = isActive ? `${dragX}px` : fromRight ? "105%" : "-105%";

          return (
            <div
              key={flavour.id}
              className="absolute inset-0 will-change-transform"
              style={{
                transform: `translate3d(${x}, 0, 0)`,
                transition: isDragging
                  ? "none"
                  : reduceMotion
                    ? "opacity 0.3s ease"
                    : "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease",
                opacity: isActive || isNeighbor ? 1 : 0,
                pointerEvents: "none",
                zIndex: isActive ? 3 : isNeighbor ? 2 : 1,
              }}
              aria-hidden={!isActive}
            >
              <Image
                src={flavour.photo}
                alt={flavour.alt}
                fill
                quality={90}
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
                draggable={false}
              />
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-ink/40 to-transparent lg:hidden" />

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 lg:hidden">
          {FLAVOURS.map((flavour, i) => (
            <button
              key={flavour.id}
              type="button"
              aria-label={`Toon ${flavour.name}`}
              aria-current={i === activeIndex}
              onClick={() => selectFlavour(i)}
              className={`pointer-events-auto h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 bg-cream" : "w-2 bg-cream/55"
              }`}
            />
          ))}
        </div>

      </div>

      <div className="order-2 flex flex-col justify-center bg-cream px-5 py-16 md:px-10 lg:order-1 lg:px-12 lg:py-20 xl:pl-[calc((100vw-1400px)/2+2.5rem)] xl:pr-16">
        <div className="w-full max-w-2xl">
          <h2 className="font-display text-4xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-5xl xl:text-6xl">
            De smaken van nu
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
            Elke week een kleine kaart, alles in kleine batches. Swipe de
            foto&apos;s, of tik een smaak om te wisselen.
          </p>

          <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {FLAVOURS.map((flavour, i) => {
              const isActive = i === activeIndex;
              return (
                <li key={flavour.id}>
                  <button
                    type="button"
                    onMouseEnter={() => selectFlavour(i)}
                    onFocus={() => selectFlavour(i)}
                    onClick={() => selectFlavour(i)}
                    aria-current={isActive}
                    className="group flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span
                      className={`font-display text-4xl font-semibold tracking-[-0.05em] transition-all duration-300 md:text-5xl ${
                        isActive
                          ? "translate-x-2 font-semibold text-matcha-deep"
                          : "text-ink group-hover:text-matcha-deep"
                      }`}
                    >
                      {flavour.name}
                    </span>
                    <span
                      className={`shrink-0 rounded-full border px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] transition-all duration-300 ${
                        isActive
                          ? "border-matcha bg-matcha text-cream"
                          : "border-ink/15 text-ink-soft"
                      }`}
                    >
                      {flavour.tag}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 min-h-[80px] max-w-xl" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={active.id}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-base leading-relaxed text-ink-soft md:text-lg"
              >
                {active.description}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-8">
            <Link
              href="/bestellen"
              className="inline-block rounded-full bg-matcha px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-cream transition-all duration-300 hover:bg-matcha-deep active:scale-[0.98]"
            >
              Bestel jouw box
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
