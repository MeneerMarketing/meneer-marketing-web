"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ScrollCodeStreamProps {
  className?: string;
  height?: number;
}

export function ScrollCodeStream({
  className,
  height = 320,
}: ScrollCodeStreamProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path || reduce) return;
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 85%",
          end: "bottom 35%",
          scrub: 0.6,
        },
      });
    },
    { scope: rootRef, dependencies: [reduce] },
  );

  const pathD =
    "M 20 20 C 140 60, 220 20, 340 80 S 560 200, 720 140 S 940 60, 1080 140 S 1280 240, 1380 180";

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`pointer-events-none relative mx-auto w-full max-w-6xl ${className ?? ""}`}
      style={{ height }}
    >
      <svg
        viewBox="0 0 1400 300"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <path
          d={pathD}
          stroke="#E2E8F0"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          ref={pathRef}
          d={pathD}
          stroke="#0F172A"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />

        {!reduce ? (
          <>
            <circle r="5" fill="#00BCD4">
              <animateMotion dur="6s" repeatCount="indefinite" path={pathD} />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.9;1"
                dur="6s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="4" fill="#FF5722">
              <animateMotion
                dur="6s"
                begin="-2s"
                repeatCount="indefinite"
                path={pathD}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.9;1"
                dur="6s"
                begin="-2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="3.5" fill="#00BCD4">
              <animateMotion
                dur="6s"
                begin="-4s"
                repeatCount="indefinite"
                path={pathD}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.9;1"
                dur="6s"
                begin="-4s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        ) : null}
      </svg>
    </div>
  );
}
