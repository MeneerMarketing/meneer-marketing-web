"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { GoogleLogoMark } from "@/components/icons/GoogleLogoMark";
import { MetaIcon } from "@/components/icons/MetaIcon";
import { ShopifyMark } from "@/components/icons/ShopifyMark";

type TechKey = "google" | "shopify" | "chatgpt" | "meta";

const TECHS: TechKey[] = ["google", "shopify", "chatgpt", "meta"];

interface Bubble {
  key: string;
  tech: TechKey;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

function bubbleSize(tech: TechKey, rand: () => number): number {
  const base = 44 + Math.round(rand() * 16);
  return tech === "shopify" ? base + 10 : base;
}

/** Gelijk aantal per merk, round-robin zodat hetzelfde logo niet achter elkaar komt. */
function buildBalancedTechSequence(count: number): TechKey[] {
  const remaining = new Map<TechKey, number>();
  const base = Math.floor(count / TECHS.length);
  const extra = count % TECHS.length;

  TECHS.forEach((tech, index) => {
    remaining.set(tech, base + (index < extra ? 1 : 0));
  });

  const sequence: TechKey[] = [];
  while (sequence.length < count) {
    for (const tech of TECHS) {
      const left = remaining.get(tech) ?? 0;
      if (left > 0) {
        sequence.push(tech);
        remaining.set(tech, left - 1);
      }
    }
  }

  return sequence;
}

/** Horizontale slots gelijk verdeeld; zelfde tech krijgt ver uit elkaar liggende slots. */
function slotLeft(index: number, count: number, jitter: number): number {
  if (count <= 1) return 50 + jitter;
  const spread = 6 + (index / (count - 1)) * 88;
  return Math.min(94, Math.max(6, spread + jitter));
}

function generateBubbles(count: number, seed = 1): Bubble[] {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const techSequence = buildBalancedTechSequence(count);
  const techPhase: Record<TechKey, number> = {
    google: 0,
    shopify: 0,
    chatgpt: 0,
    meta: 0,
  };

  return techSequence.map((tech, i) => {
    const duration = 10 + rand() * 6;
    const phaseIndex = techPhase[tech];
    techPhase[tech] += 1;

    const jitter = (rand() - 0.5) * 3;
    const stagger = (i / count) * 4.2;
    const techOffset = phaseIndex * (duration / Math.max(1, count / TECHS.length));
    const preseed = -(rand() * duration * 0.65);

    return {
      key: `b-${i}-${tech}`,
      tech,
      left: slotLeft(i, count, jitter),
      size: bubbleSize(tech, rand),
      delay: stagger + techOffset * 0.35 + preseed,
      duration,
      drift: -14 + rand() * 28,
    };
  });
}

export function FloatingTechBubbles({
  count = 14,
  className,
  bareLogos = false,
}: {
  count?: number;
  className?: string;
  /** Alleen het logo, zonder ronde bubble-achtergrond */
  bareLogos?: boolean;
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
        <FloatingBubble key={b.key} bubble={b} bareLogos={bareLogos} />
      ))}
    </div>
  );
}

function FloatingBubble({ bubble, bareLogos }: { bubble: Bubble; bareLogos: boolean }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="pointer-events-auto absolute bottom-[-6%]"
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
      {bareLogos ? (
        <div
          className={`flex size-full items-center justify-center transition-transform duration-200 ${
            hover ? "scale-110 opacity-90" : "opacity-50"
          }`}
          style={{
            filter: hover
              ? "drop-shadow(0 0 12px rgba(255,87,34,0.35))"
              : "drop-shadow(0 2px 8px rgba(0,0,0,0.25))",
          }}
        >
          <TechGlyph tech={bubble.tech} />
        </div>
      ) : (
        <div
          className={`flex size-full items-center justify-center rounded-full border backdrop-blur-sm transition-[border-color,background-color,box-shadow,transform] duration-200 ${
            hover
              ? "scale-[1.08] border-white bg-white/95 text-slate-900 shadow-[0_0_28px_rgba(255,87,34,0.22)]"
              : "border-white/40 bg-white/35 text-slate-700"
          }`}
        >
          <TechGlyph tech={bubble.tech} />
        </div>
      )}
    </div>
  );
}

function TechGlyph({ tech }: { tech: TechKey }) {
  switch (tech) {
    case "google":
      return <GoogleLogoMark className="size-[55%]" />;
    case "shopify":
      return <ShopifyMark className="size-[62%]" title="Shopify" />;
    case "chatgpt":
      return (
        <Image
          src="/icons/chatgpt-hero-mark.png"
          alt=""
          width={24}
          height={24}
          className="size-[55%] bg-transparent object-contain"
          unoptimized
        />
      );
    case "meta":
      return <MetaIcon className="size-[58%] object-contain" size={24} />;
    default:
      return null;
  }
}
