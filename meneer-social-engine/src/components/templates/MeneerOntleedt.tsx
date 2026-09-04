import { TemplateFrame } from "@/components/templates/TemplateFrame";
import { LOOK } from "@/components/brand/MeneerHead";
import { BRAND_TOKENS } from "@/brand/brand-brain";
import type { MeneerOntleedtData } from "@/services/types";

export interface MeneerOntleedtProps {
  data: MeneerOntleedtData;
  slideIndex?: number;
}

const SLIDES = ["hook", "observatie", "waarom", "jatten"] as const;

export function MeneerOntleedt({ data, slideIndex = 0 }: MeneerOntleedtProps) {
  const slide = SLIDES[slideIndex] ?? SLIDES[0];

  return (
    <TemplateFrame
      label="Meneer ontleedt"
      variant="dark"
      look={slide === "jatten" ? LOOK.camera : LOOK.linksOnder}
      slideCount={SLIDES.length}
      slideIndex={slideIndex}
    >
      {slide === "hook" ? (
        <div className="flex flex-1 flex-col justify-center gap-8">
          <span
            className="w-fit rounded-full px-7 py-3 text-[28px] font-bold uppercase tracking-[0.16em]"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            {data.brand}
          </span>
          <p className="text-[82px] font-extrabold leading-[1.06]">{data.hook}</p>
        </div>
      ) : null}

      {slide === "observatie" ? (
        <div className="flex flex-1 flex-col justify-center gap-8">
          <p className="text-[26px] font-bold uppercase tracking-[0.22em] opacity-45">
            Wat ze doen
          </p>
          <p className="text-[58px] font-semibold leading-[1.2]">{data.observation}</p>
        </div>
      ) : null}

      {slide === "waarom" ? (
        <div className="flex flex-1 flex-col justify-center gap-8">
          <p className="text-[26px] font-bold uppercase tracking-[0.22em] opacity-45">
            Waarom het werkt
          </p>
          <p className="text-[52px] font-semibold leading-[1.24]">{data.whyItWorks}</p>
        </div>
      ) : null}

      {slide === "jatten" ? (
        <div className="flex flex-1 flex-col justify-center gap-10">
          <p
            className="text-[28px] font-bold uppercase tracking-[0.22em]"
            style={{ color: BRAND_TOKENS.accentBold }}
          >
            Dit mag je jatten
          </p>
          <p className="text-[58px] font-bold leading-[1.18]">{data.stealThis}</p>
        </div>
      ) : null}
    </TemplateFrame>
  );
}
