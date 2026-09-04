import { TemplateFrame } from "@/components/templates/TemplateFrame";
import { LOOK } from "@/components/brand/MeneerHead";
import { BRAND_TOKENS } from "@/brand/brand-brain";
import type { MeneerZegtData } from "@/services/types";

export interface MeneerZegtProps {
  data: MeneerZegtData;
  slideIndex?: number;
}

const SLIDES = ["iedereen", "meneer", "waarom", "oordeel"] as const;

export function MeneerZegt({ data, slideIndex = 0 }: MeneerZegtProps) {
  const slide = SLIDES[slideIndex] ?? SLIDES[0];

  return (
    <TemplateFrame
      label="Meneer zegt"
      look={slide === "iedereen" ? LOOK.weg : LOOK.camera}
      slideCount={SLIDES.length}
      slideIndex={slideIndex}
    >
      {slide === "iedereen" ? (
        <div className="flex flex-1 flex-col justify-center gap-8">
          <p className="text-[28px] font-bold uppercase tracking-[0.22em] opacity-45">
            Iedereen zegt
          </p>
          <p className="text-[76px] font-bold leading-[1.1] opacity-55">
            {data.everyoneSays}
          </p>
        </div>
      ) : null}

      {slide === "meneer" ? (
        <div className="flex flex-1 flex-col justify-center gap-8">
          <p
            className="text-[28px] font-bold uppercase tracking-[0.22em]"
            style={{ color: BRAND_TOKENS.accent }}
          >
            Meneer zegt
          </p>
          <p className="text-[86px] font-extrabold leading-[1.05]">
            <span
              style={{
                background:
                  "linear-gradient(transparent 62%, rgba(255,87,34,0.38) 62%)",
              }}
            >
              {data.meneerSays}
            </span>
          </p>
        </div>
      ) : null}

      {slide === "waarom" ? (
        <div className="flex flex-1 flex-col justify-center gap-8">
          <p className="text-[26px] font-bold uppercase tracking-[0.22em] opacity-45">
            Waarom
          </p>
          <p className="text-[52px] font-semibold leading-[1.24]">{data.explanation}</p>
        </div>
      ) : null}

      {slide === "oordeel" ? (
        <div className="flex flex-1 flex-col justify-center gap-10">
          <p className="text-[60px] font-bold leading-[1.16]">{data.verdict}</p>
          <span
            className="w-fit -rotate-2 rounded-2xl px-10 py-5 text-[40px] font-black uppercase tracking-wider"
            style={{ background: BRAND_TOKENS.accentBold, color: "#fff" }}
          >
            Meneer heeft gesproken
          </span>
        </div>
      ) : null}
    </TemplateFrame>
  );
}
