"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FIGMA_HOME_PORTRAIT_WIDE } from "@/data/figma-home-images";
import { DIBA_HERO_VIDEO_ID } from "@/lib/site";

function heroVideoEmbedUrl(videoId: string): string {
  const url = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  url.searchParams.set("autoplay", "1");
  url.searchParams.set("mute", "1");
  url.searchParams.set("loop", "1");
  url.searchParams.set("playlist", videoId);
  url.searchParams.set("controls", "0");
  url.searchParams.set("rel", "0");
  url.searchParams.set("modestbranding", "1");
  url.searchParams.set("playsinline", "1");
  url.searchParams.set("iv_load_policy", "3");
  return url.toString();
}

/**
 * Achtergrondvideo voor de hero-variant. Stil, geluidloos, decoratief.
 * Bij prefers-reduced-motion valt hij terug op de shootfoto.
 */
export default function HeroVariantVideo() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setShowVideo(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <>
      <Image
        src={FIGMA_HOME_PORTRAIT_WIDE.src}
        alt={FIGMA_HOME_PORTRAIT_WIDE.alt}
        fill
        priority
        quality={92}
        sizes="100vw"
        className="object-cover object-left-top"
      />

      {showVideo ? (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <iframe
            src={heroVideoEmbedUrl(DIBA_HERO_VIDEO_ID)}
            title=""
            tabIndex={-1}
            allow="autoplay; encrypted-media; picture-in-picture"
            className="pointer-events-none absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
          />
        </div>
      ) : null}
    </>
  );
}
