import Image from "next/image";
import { CaseSceneIllustration } from "@/components/home/cases/CaseSceneIllustration";
import type { HomeCase } from "@/data/home-cases";

interface CaseSwitcherThumbProps {
  caseItem: HomeCase;
  isActive?: boolean;
}

/** Mini-preview voor case-kiezer: screenshot of scene-illustratie. */
export function CaseSwitcherThumb({ caseItem, isActive }: CaseSwitcherThumbProps) {
  const thumbSrc = caseItem.previewPoster ?? caseItem.previewImage;
  const ringClass = isActive ? "ring-2 ring-white/30" : "ring-1 ring-slate-200/90";

  if (thumbSrc) {
    return (
      <span
        className={`relative flex size-10 shrink-0 overflow-hidden rounded-xl bg-slate-100 ${ringClass}`}
      >
        <Image
          src={thumbSrc}
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: caseItem.previewObjectPosition ?? "center top" }}
          sizes="40px"
        />
      </span>
    );
  }

  return (
    <span
      className={`relative flex size-10 shrink-0 overflow-hidden rounded-xl ${ringClass}`}
      style={{ backgroundColor: caseItem.palette.deep }}
    >
      <CaseSceneIllustration
        scene={caseItem.scene}
        accent={caseItem.palette.accent}
        deep={caseItem.palette.deep}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[280%] w-[280%] max-w-none -translate-x-1/2 -translate-y-[40%]"
      />
    </span>
  );
}
