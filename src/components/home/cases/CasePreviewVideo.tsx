"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface CasePreviewVideoProps {
  src: string;
  /** Kleinere H.264-variant voor mobiel of traag netwerk */
  mobileSrc?: string;
  poster?: string;
  objectPosition?: string;
  label: string;
  /** Bij carousels: alleen de actieve slide afspelen. */
  active?: boolean;
  className?: string;
}

const MOBILE_MQ = "(max-width: 768px)";
const SLOW_CONNECTION_TYPES = new Set(["slow-2g", "2g", "3g"]);

interface NetworkInformationLike extends EventTarget {
  readonly saveData?: boolean;
  readonly effectiveType?: string;
}

function getNetworkConnection(): NetworkInformationLike | undefined {
  const nav = navigator as Navigator & { connection?: NetworkInformationLike };
  return nav.connection;
}

function pickVideoSrc(desktop: string, mobile?: string): string {
  if (!mobile || typeof window === "undefined") return desktop;

  const narrow = window.matchMedia(MOBILE_MQ).matches;
  const connection = getNetworkConnection();
  const saveData = connection?.saveData === true;
  const slowType = connection?.effectiveType
    ? SLOW_CONNECTION_TYPES.has(connection.effectiveType)
    : false;

  return narrow || saveData || slowType ? mobile : desktop;
}

function applyIosInlineVideoAttrs(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
}

/**
 * Inline case-preview. iOS Safari vereist muted + playsinline én vaak een expliciete play().
 * Laadt op mobiel de lichtere variant zodat cellular sneller start.
 */
export function CasePreviewVideo({
  src,
  mobileSrc,
  poster,
  objectPosition = "center top",
  label,
  active = true,
  className = "absolute inset-0 size-full object-cover pointer-events-none",
}: CasePreviewVideoProps) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [usePosterOnly, setUsePosterOnly] = useState(false);

  useEffect(() => {
    const updateSrc = () => setResolvedSrc(pickVideoSrc(src, mobileSrc));
    updateSrc();

    const mq = window.matchMedia(MOBILE_MQ);
    mq.addEventListener("change", updateSrc);
    const connection = getNetworkConnection();
    connection?.addEventListener?.("change", updateSrc);

    return () => {
      mq.removeEventListener("change", updateSrc);
      connection?.removeEventListener?.("change", updateSrc);
    };
  }, [src, mobileSrc]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? false),
      { threshold: 0.15, rootMargin: "8px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const shouldPlay = active && visible && !reduce && Boolean(resolvedSrc);

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !shouldPlay) return;

    applyIosInlineVideoAttrs(video);

    const promise = video.play();
    if (promise !== undefined) {
      promise.catch(() => {
        if (poster) setUsePosterOnly(true);
      });
    }
  }, [shouldPlay, poster]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !resolvedSrc) return;

    applyIosInlineVideoAttrs(video);
    setUsePosterOnly(false);

    if (!shouldPlay) {
      video.pause();
      return;
    }

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, [shouldPlay, resolvedSrc, tryPlay]);

  if (usePosterOnly && poster) {
    return (
      <div ref={containerRef} className="absolute inset-0">
        <Image
          src={poster}
          alt={label}
          fill
          className={className}
          style={{ objectPosition }}
          sizes="(max-width: 768px) 100vw, 640px"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      {poster ? (
        <Image
          src={poster}
          alt=""
          fill
          aria-hidden
          className={`${className} -z-10`}
          style={{ objectPosition }}
          sizes="(max-width: 768px) 100vw, 640px"
        />
      ) : null}
      {/*
        Video pas in de DOM zodra de kaart in beeld is: een <video> met
        autoPlay downloadt anders direct bij paginalading (1,4 MB op mobiel),
        ook als de sectie ver onder de fold staat.
      */}
      {resolvedSrc && visible ? (
        <video
          key={resolvedSrc}
          ref={videoRef}
          src={resolvedSrc}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          controls={false}
          onError={() => poster && setUsePosterOnly(true)}
          className={className}
          style={{ objectPosition }}
          aria-label={label}
        />
      ) : null}
    </div>
  );
}
