"use client";

import { useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { GoogleLogoMark } from "@/components/icons/GoogleLogoMark";

type TechKey = "shopify" | "n8n" | "google" | "nextjs";

interface Bubble {
  key: string;
  tech: TechKey;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

const TECHS: TechKey[] = ["shopify", "n8n", "google", "nextjs"];

function generateBubbles(count: number, seed = 1): Bubble[] {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, (_, i) => ({
    key: `b-${i}`,
    tech: TECHS[i % TECHS.length],
    left: 6 + rand() * 88,
    size: 40 + Math.round(rand() * 22),
    delay: rand() * 8,
    duration: 14 + rand() * 10,
    drift: -12 + rand() * 24,
  }));
}

export function FloatingTechBubbles({
  count = 14,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const bubbles = useMemo(() => generateBubbles(count), [count]);

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {bubbles.map((b) => (
        <FloatingBubble key={b.key} bubble={b} />
      ))}
    </div>
  );
}

function FloatingBubble({ bubble }: { bubble: Bubble }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="pointer-events-auto absolute bottom-[-15%]"
      style={{
        left: `${bubble.left}%`,
        width: bubble.size,
        height: bubble.size,
        animation: `mm-float-up ${bubble.duration}s linear ${bubble.delay}s infinite`,
        animationPlayState: hover ? "paused" : "running",
        ["--mm-drift" as string]: `${bubble.drift}px`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={`flex size-full items-center justify-center rounded-full border backdrop-blur-sm transition-[border-color,background-color,box-shadow,transform] duration-200 ${
          hover
            ? "scale-[1.08] border-white bg-white/90 text-slate-900 shadow-[0_0_32px_rgba(0,188,212,0.35)]"
            : "border-white/40 bg-white/35 text-slate-700"
        }`}
      >
        <TechGlyph tech={bubble.tech} />
      </div>
    </div>
  );
}

function TechGlyph({ tech }: { tech: TechKey }) {
  switch (tech) {
    case "shopify":
      return (
        <svg viewBox="0 0 24 24" className="size-[55%]" aria-label="Shopify">
          <path
            fill="#95BF47"
            d="M15.6 3.1c.1 0 .2.1.2.2l-1 3.1-2.2-.7c.1-.6.3-1.2.7-1.6.7-.8 1.8-1 2.3-1Zm3.4 2.5-1.5-.5c-.2-2.2-1.5-3-2.8-3-.6 0-2 .4-3 2.3l-3.4.8c-1 .3-1.1.3-1.2 1.3L6 20.5l12 1.5 1.8-14.8a.8.8 0 0 0-.8-.8Z"
          />
          <path
            fill="#5E8E3E"
            d="M19 5.6 17.5 20l-12-1.5L17 3.8c.9 0 1.3.6 1.6 1.8l.4 0Z"
          />
          <path
            fill="#fff"
            d="M13.5 9.9c-.7-.1-1.4.2-1.8.8-.4.7-.2 1.5.6 1.9.5.2 1 .4 1.2.6.2.2.3.4.2.6s-.3.3-.6.3c-.5 0-1-.2-1.4-.5l-.4 1.1c.5.4 1.2.6 1.9.6 1.2 0 2-.7 2-1.9 0-.8-.4-1.3-1.1-1.6-.6-.2-1-.4-1-.7 0-.3.2-.4.5-.4.5 0 1 .2 1.3.3l.4-1a3 3 0 0 0-1.8-.1Z"
          />
        </svg>
      );
    case "n8n":
      return (
        <svg viewBox="0 0 24 24" className="size-[55%]" aria-label="n8n">
          <circle cx="5" cy="12" r="2.4" fill="#EA4B71" />
          <circle cx="19" cy="12" r="2.4" fill="#EA4B71" />
          <circle cx="12" cy="6.5" r="2.4" fill="#EA4B71" />
          <circle cx="12" cy="17.5" r="2.4" fill="#EA4B71" />
          <circle cx="12" cy="12" r="1.6" fill="#EA4B71" />
          <path
            d="M7 12h4M13 12h4M12 8.5v3M12 12.5v3"
            stroke="#EA4B71"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "google":
      return <GoogleLogoMark className="size-[55%]" />;
    case "nextjs":
    default:
      return (
        <svg viewBox="0 0 24 24" className="size-[58%]" aria-label="Next.js">
          <circle cx="12" cy="12" r="10" fill="#000" />
          <path
            fill="#fff"
            d="M12 4.5v15M7.5 8.25 16.5 15.75"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
