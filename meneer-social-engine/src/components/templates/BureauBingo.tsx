import { TemplateFrame } from "@/components/templates/TemplateFrame";
import { LOOK } from "@/components/brand/MeneerHead";
import { BRAND_TOKENS } from "@/brand/brand-brain";
import type { BureauBingoData } from "@/services/types";

export interface BureauBingoProps {
  data: BureauBingoData;
  slideIndex?: number;
}

const SLIDES = ["kaart", "punchline"] as const;

const FALLBACK_CELLS = [
  "Groei",
  "Datagedreven",
  "Full service",
  "Synergie",
  "Gratis strategiecall",
  "Maatwerk",
  "360° aanpak",
  "Passie",
  "Resultaatgericht",
];

export function BureauBingo({ data, slideIndex = 0 }: BureauBingoProps) {
  const slide = SLIDES[slideIndex] ?? SLIDES[0];
  const cells = data.cells.length >= 9 ? data.cells.slice(0, 9) : FALLBACK_CELLS;

  return (
    <TemplateFrame
      label="Bureau bingo"
      look={slide === "punchline" ? LOOK.camera : LOOK.linksBoven}
      slideCount={SLIDES.length}
      slideIndex={slideIndex}
    >
      {slide === "kaart" ? (
        <div className="flex flex-1 flex-col justify-center gap-10">
          <p className="text-[64px] font-extrabold leading-[1.08]">
            Marketingbureau Bingo
          </p>
          <div className="grid grid-cols-3 gap-4">
            {cells.map((cell) => (
              <div
                key={cell}
                className="flex aspect-square items-center justify-center rounded-2xl bg-white p-4 text-center text-[28px] font-bold leading-tight"
                style={{ border: "3px solid rgba(15,23,42,0.12)" }}
              >
                {cell}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {slide === "punchline" ? (
        <div className="flex flex-1 flex-col justify-center gap-10">
          <p
            className="text-[68px] font-extrabold leading-[1.1]"
            style={{ color: BRAND_TOKENS.accent }}
          >
            {data.punchline}
          </p>
          <p className="text-[42px] font-medium leading-[1.25] opacity-75">
            {data.selfAware}
          </p>
        </div>
      ) : null}
    </TemplateFrame>
  );
}
