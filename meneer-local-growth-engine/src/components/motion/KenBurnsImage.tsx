"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface KenBurnsImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

/** Slow cinematic zoom on hero imagery. Respects reduced motion. */
export function KenBurnsImage({
  src,
  alt,
  priority = false,
  className = "",
}: KenBurnsImageProps) {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className={`object-cover object-center will-change-transform ${
          reduce ? "" : "animate-ken-burns"
        }`}
      />
    </div>
  );
}
