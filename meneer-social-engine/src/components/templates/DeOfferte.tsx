import { TemplateFrame } from "@/components/templates/TemplateFrame";
import { LOOK } from "@/components/brand/MeneerHead";
import { BRAND_TOKENS } from "@/brand/brand-brain";
import type { DeOfferteData } from "@/services/types";

export interface DeOfferteProps {
  data: DeOfferteData;
  slideIndex?: number;
}

const SLIDES = ["hook", "regels", "oordeel"] as const;

const VERDICT_STYLE = {
  ok: { color: "#16a34a", label: "prima" },
  duur: { color: BRAND_TOKENS.accentBold, label: "prijzig" },
  onzin: { color: "#dc2626", label: "onzin" },
} as const;

export function DeOfferte({ data, slideIndex = 0 }: DeOfferteProps) {
  const slide = SLIDES[slideIndex] ?? SLIDES[0];

  return (
    <TemplateFrame
      label="De offerte"
      look={slide === "oordeel" ? LOOK.camera : LOOK.rechtsOnder}
      slideCount={SLIDES.length}
      slideIndex={slideIndex}
    >
      {slide === "hook" ? (
        <div className="flex flex-1 flex-col justify-center gap-8">
          <p className="text-[78px] font-extrabold leading-[1.08]">{data.hook}</p>
          <p className="text-[34px] font-medium opacity-55">
            Geanonimiseerd. Het gaat om het systeem, niet om het bureau.
          </p>
        </div>
      ) : null}

      {slide === "regels" ? (
        <div className="flex flex-1 flex-col justify-center">
          {data.lineItems.map((item) => {
            const style = VERDICT_STYLE[item.verdict];
            return (
              <div
                key={item.label}
                className="flex items-center justify-between gap-6 py-6"
                style={{ borderBottom: "2px solid rgba(15,23,42,0.1)" }}
              >
                <div className="flex flex-col">
                  <span className="text-[36px] font-semibold">{item.label}</span>
                  <span
                    className="text-[24px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: style.color }}
                  >
                    {style.label}
                  </span>
                </div>
                <span className="text-[44px] font-black">{item.price}</span>
              </div>
            );
          })}
          <div className="flex items-baseline justify-between pt-8">
            <span className="text-[40px] font-bold">Totaal</span>
            <span
              className="text-[68px] font-black"
              style={{ color: BRAND_TOKENS.accent }}
            >
              {data.total}
            </span>
          </div>
        </div>
      ) : null}

      {slide === "oordeel" ? (
        <div className="flex flex-1 flex-col justify-center gap-10">
          <p className="text-[56px] font-semibold italic leading-[1.2]">
            {data.meneerVerdict}
          </p>
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
