"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * WebGL-deel in een aparte chunk: three.js en @react-three/fiber blijven zo
 * buiten de kritieke laadfase van de homepage (LCP/INP). De chunk wordt pas
 * gedownload zodra we het canvas daadwerkelijk renderen (na idle).
 */
const LivingCloudGridCanvas = dynamic(
  () => import("@/components/effects/LivingCloudGridCanvas"),
  { ssr: false },
);

const subscribeReducedMotion = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", cb);
  return () => media.removeEventListener("change", cb);
};
const getReducedMotionSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServerSnapshot = () => false;

interface LivingCloudGridProps {
  className?: string;
}

function StaticGrid({ className }: LivingCloudGridProps) {
  return (
    <div aria-hidden className={`absolute inset-0 bg-white ${className ?? ""}`}>
      <svg className="size-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="lcg-static"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lcg-static)" />
      </svg>
    </div>
  );
}

export function LivingCloudGrid({ className }: LivingCloudGridProps) {
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setWebglReady(true), {
        timeout: 2000,
      });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setWebglReady(true), 300);
    return () => window.clearTimeout(id);
  }, [reduceMotion]);

  if (reduceMotion || !webglReady) {
    return <StaticGrid className={className} />;
  }

  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden bg-white ${className ?? ""}`}
    >
      <LivingCloudGridCanvas />
    </div>
  );
}
