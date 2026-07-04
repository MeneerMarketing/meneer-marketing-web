"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { CaseSceneIllustration } from "@/components/home/cases/CaseSceneIllustration";
import type { HomeCase } from "@/data/home-cases";

interface CaseBrowserFrameProps {
  caseItem: HomeCase;
  className?: string;
}

export function CaseBrowserFrame({ caseItem, className }: CaseBrowserFrameProps) {
  const reduce = useReducedMotion();
  const {
    palette,
    website,
    scene,
    previewImage,
    previewVideo,
    previewPoster,
    previewObjectPosition = "top",
  } = caseItem;
  const hostname = website?.hostname ?? caseItem.client.toLowerCase();
  const showVideo = Boolean(previewVideo);
  const showImage = Boolean(previewImage) && !previewVideo;
  const videoAutoplay = showVideo && !reduce;

  return (
    <motion.div
      className={className}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_22px_48px_-28px_rgba(15,23,42,0.2)]">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/90 px-3 py-2">
          <span className="size-2 rounded-full bg-[#FF5F57]" aria-hidden />
          <span className="size-2 rounded-full bg-[#FEBC2E]" aria-hidden />
          <span className="size-2 rounded-full bg-[#28C840]" aria-hidden />
          <span className="ml-1 min-w-0 flex-1 truncate rounded-md border border-slate-200/80 bg-white px-2.5 py-1 font-mono text-[10px] font-medium text-slate-500">
            {hostname}
          </span>
        </div>

        <div className="relative aspect-video overflow-hidden bg-slate-950">
          {showVideo ? (
            <video
              src={previewVideo}
              poster={previewPoster ?? previewImage}
              autoPlay={videoAutoplay}
              muted
              loop={videoAutoplay}
              playsInline
              preload="auto"
              className="absolute inset-0 size-full object-cover"
              style={{ objectPosition: previewObjectPosition }}
              aria-label={`Preview ${caseItem.client}`}
            />
          ) : null}

          {showImage ? (
            <Image
              src={previewImage!}
              alt={`Preview ${caseItem.client}`}
              fill
              unoptimized
              quality={100}
              className="object-cover"
              style={{ objectPosition: previewObjectPosition }}
              sizes="(max-width: 768px) 100vw, 640px"
              priority
            />
          ) : null}

          {!showVideo && !showImage ? (
            <CaseSceneIllustration
              scene={scene}
              accent={palette.accent}
              deep={palette.deep}
              className="absolute inset-0 size-full"
            />
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
