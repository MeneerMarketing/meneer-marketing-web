"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image, { type StaticImageData } from "next/image";
import heroPour from "@/public/photos/hero-pour.png";
import cupsStack from "@/public/photos/cups-stack.png";
import elaDrinksSip from "@/public/photos/ela-drinks-sip.png";
import cookiesShare from "@/public/photos/cookies-share.png";
import sprinklesDuo from "@/public/photos/sprinkles-duo.png";

interface HeroSlide {
  src: StaticImageData;
  alt: string;
  label: string;
  lean: number;
  stickerTilt: number;
}

const SLIDES: readonly HeroSlide[] = [
  {
    src: heroPour,
    alt: "Strawberry matcha van Lá Sweet wordt over aardbei en melk geschonken in Enschede",
    label: "Strawberry matcha",
    lean: -4,
    stickerTilt: 5,
  },
  {
    src: cupsStack,
    alt: "Twee gestapelde iced matcha's van Lá Sweet by Ela in Enschede",
    label: "Iced matcha",
    lean: 2,
    stickerTilt: -8,
  },
  {
    src: elaDrinksSip,
    alt: "Ela met twee iced matcha's in een cupholder",
    label: "Matcha vibes",
    lean: 4.2,
    stickerTilt: -4,
  },
  {
    src: cookiesShare,
    alt: "Vier handgemaakte crumble cookies van Lá Sweet op een bord",
    label: "Crumble cookies",
    lean: -3.2,
    stickerTilt: 7,
  },
  {
    src: sprinklesDuo,
    alt: "Twee crumble cookies met sprinkles op Lá Sweet-papier",
    label: "Fresh batch",
    lean: 3.5,
    stickerTilt: -6,
  },
];

const AUTO_MS = 3400;
/** Eerste slide sneller door, zodat je meteen ziet dat het slidet */
const FIRST_SLIDE_MS = 1600;
const SWIPE_THRESHOLD = 48;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [bump, setBump] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const activePointerId = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const len = SLIDES.length;
      setIndex(((next % len) + len) % len);
      if (!reduceMotion) {
        setBump(true);
        window.setTimeout(() => setBump(false), 420);
      }
    },
    [reduceMotion],
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || reduceMotion || isDragging) return;
    const delay = index === 0 ? FIRST_SLIDE_MS : AUTO_MS;
    const id = window.setTimeout(goNext, delay);
    return () => window.clearTimeout(id);
  }, [paused, reduceMotion, isDragging, goNext, index]);

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

  const slide = SLIDES[index];
  const dragLean = dragX * 0.04;
  const frameRotate = slide.lean + dragLean;
  const frameScale = bump ? 1.03 : isDragging ? 1.01 : 1;
  const frameY = bump ? -6 : 0;

  return (
    <div
      className="relative origin-center will-change-transform"
      style={{
        transform: `rotate(${frameRotate}deg) translateY(${frameY}px) scale(${frameScale})`,
        transition: isDragging
          ? "none"
          : reduceMotion
            ? "none"
            : "transform 0.65s cubic-bezier(0.34, 1.4, 0.64, 1)",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="region"
      aria-roledescription="carousel"
      aria-label="Lá Sweet foto's"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-parchment shadow-[0_40px_90px_-30px_rgba(68,57,43,0.45)]">
        {SLIDES.map((item, i) => {
          const offset = i - index;
          const isActive = i === index;
          const wrapNext =
            index === SLIDES.length - 1 && i === 0 && !isActive;
          const wrapPrev =
            index === 0 && i === SLIDES.length - 1 && !isActive;
          const isNeighbor =
            Math.abs(offset) === 1 || wrapNext || wrapPrev;
          const fromRight = wrapNext || (offset > 0 && !wrapPrev);
          const x = isActive ? `${dragX}px` : fromRight ? "105%" : "-105%";
          const rotate = isActive
            ? dragX * 0.02
            : fromRight
              ? 10
              : -10;
          const scale = isActive ? 1 : 0.92;

          return (
            <div
              key={item.label}
              className="absolute inset-0 will-change-transform"
              style={{
                transform: `translate3d(${x}, 0, 0) rotate(${rotate}deg) scale(${scale})`,
                transition: isDragging
                  ? "none"
                  : reduceMotion
                    ? "opacity 0.3s ease"
                    : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease",
                opacity: isActive || isNeighbor ? 1 : 0,
                pointerEvents: "none",
                zIndex: isActive ? 3 : isNeighbor ? 2 : 1,
              }}
              aria-hidden={!isActive}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                priority={i === 0}
                quality={95}
                sizes="(max-width: 640px) 340px, (max-width: 1024px) 440px, 540px"
                className="object-cover"
                draggable={false}
              />
            </div>
          );
        })}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-ink/45 to-transparent"
        />

        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between gap-3">
          <p className="rounded-full bg-cream/95 px-3.5 py-1.5 font-display text-sm font-bold text-ink shadow-sm">
            {slide.label}
          </p>
          <div className="flex items-center gap-1.5 pb-1">
            {SLIDES.map((item, i) => (
              <button
                key={item.label}
                type="button"
                aria-label={`Toon ${item.label}`}
                aria-current={i === index}
                onClick={(event) => {
                  event.stopPropagation();
                  setPaused(true);
                  goTo(i);
                  window.setTimeout(() => setPaused(false), AUTO_MS);
                }}
                onPointerDown={(event) => event.stopPropagation()}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-cream" : "w-2 bg-cream/55"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <a
        href="https://www.tiktok.com/@la.sweetbyela"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute -right-4 top-10 z-30 rounded-full bg-beige px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink shadow-lg transition-transform duration-500 hover:scale-105"
        style={{
          transform: `rotate(${slide.stickerTilt}deg)`,
        }}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        Viral op TikTok &rarr;
      </a>
    </div>
  );
}
