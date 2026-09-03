"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FIGMA_HOME_PORTRAIT_WIDE } from "@/data/figma-home-images";
import { DIBA_HERO_VIDEO_SRC } from "@/lib/site";

/**
 * Achtergrondvideo voor de hero-variant. Stil, geluidloos, decoratief.
 * Bij prefers-reduced-motion valt hij terug op de shootfoto.
 */
export default function HeroVariantVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setShowVideo(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!showVideo || !video) return;
    void video.play().catch(() => {});
  }, [showVideo]);

  return (
    <>
      <Image
        src={FIGMA_HOME_PORTRAIT_WIDE.src}
        alt={FIGMA_HOME_PORTRAIT_WIDE.alt}
        fill
        priority
        quality={92}
        sizes="100vw"
        className="object-cover object-center"
      />

      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src={DIBA_HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      ) : null}
    </>
  );
}
