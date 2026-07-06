"use client";

import Image from "next/image";
import { Lock } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { CaseSceneIllustration } from "@/components/home/cases/CaseSceneIllustration";
import type { HomeCase } from "@/data/home-cases";

interface CaseLivePreviewProps {
  caseItem: HomeCase;
}

/** Live browser-preview met video, foto of fallback. */
export function CaseLivePreview({ caseItem }: CaseLivePreviewProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const {
    palette,
    website,
    scene,
    previewImage,
    previewVideo,
    previewPoster,
    previewObjectPosition = "center top",
  } = caseItem;
  const hostname = website?.hostname ?? caseItem.client.toLowerCase();
  const hasVideo = Boolean(previewVideo);
  const hasImage = Boolean(previewImage);
  const hasPoster = Boolean(previewPoster);
  const videoAutoplay = hasVideo && !reduce && isInView;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full min-w-0"
    >
      <div
        className="pointer-events-none absolute -inset-8 rounded-[2rem] opacity-40 blur-3xl"
        style={{ backgroundColor: `${palette.accent}55` }}
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-[1.35rem] border border-white/12 bg-[#14111a] shadow-[0_32px_80px_-36px_rgba(0,0,0,0.75)]">
        <div className="flex items-center gap-2 border-b border-white/[0.08] bg-white/[0.03] px-3 py-2.5">
          <span className="size-2 shrink-0 rounded-full bg-[#FF5F57]" aria-hidden />
          <span className="size-2 shrink-0 rounded-full bg-[#FEBC2E]" aria-hidden />
          <span className="size-2 shrink-0 rounded-full bg-[#28C840]" aria-hidden />
          <div className="ml-1 flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1">
            <Lock className="size-2.5 shrink-0 text-emerald-400/90" aria-hidden />
            <span className="truncate font-mono text-[10px] font-medium text-white/55">
              {hostname}
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-[#FF5722] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
            Live
          </span>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden bg-[#0f0d14]">
          {hasVideo ? (
            <video
              key={previewVideo}
              src={previewVideo}
              poster={previewPoster}
              autoPlay={videoAutoplay}
              muted
              loop={videoAutoplay}
              playsInline
              preload={isInView ? "auto" : "none"}
              className="absolute inset-0 size-full object-cover"
              style={{ objectPosition: previewObjectPosition }}
              aria-label={`${caseItem.client} preview`}
            />
          ) : null}

          {!hasVideo && hasImage ? (
            <Image
              src={previewImage!}
              alt={`${caseItem.client} preview`}
              fill
              unoptimized
              className="object-cover"
              style={{ objectPosition: previewObjectPosition }}
              sizes="(max-width: 1024px) 100vw, 640px"
              priority
            />
          ) : null}

          {!hasVideo && !hasImage && hasPoster ? (
            <Image
              src={previewPoster!}
              alt={`${caseItem.client} preview`}
              fill
              unoptimized
              className="object-cover"
              style={{ objectPosition: previewObjectPosition }}
              sizes="(max-width: 1024px) 100vw, 640px"
            />
          ) : null}

          {!hasVideo && !hasImage && !hasPoster ? (
            <div
              className="absolute inset-0 flex items-center justify-center p-6"
              style={{ backgroundColor: palette.surface }}
            >
              <CaseSceneIllustration
                scene={scene}
                accent={palette.accent}
                deep={palette.deep}
                className="size-full max-h-48 max-w-sm"
              />
            </div>
          ) : null}

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/85 to-transparent"
            aria-hidden
          />
        </div>

        <div className="border-t border-white/[0.08] bg-black/30 px-4 py-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-white/90">
            <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden />
            <span className="text-emerald-400/95">Nu live</span>
            <span className="text-white/30" aria-hidden>
              ·
            </span>
            <span>{caseItem.client}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
