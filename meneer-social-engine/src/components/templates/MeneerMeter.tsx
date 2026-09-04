import { TemplateFrame } from "@/components/templates/TemplateFrame";
import { LOOK } from "@/components/brand/MeneerHead";
import { BRAND_TOKENS } from "@/brand/brand-brain";
import type { MeneerMeterData } from "@/services/types";

export interface MeneerMeterProps {
  data: MeneerMeterData;
  /** De score komt pas op de laatste slide. Dat is de hele truc. */
  slideIndex?: number;
}

const SLIDES = ["raad", "scores", "oordeel"] as const;

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? "#16a34a" : value >= 50 ? BRAND_TOKENS.accentBold : "#dc2626";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-[34px] font-bold">{label}</span>
        <span className="text-[38px] font-black" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="h-6 overflow-hidden rounded-full bg-black/10">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export function MeneerMeter({ data, slideIndex = 0 }: MeneerMeterProps) {
  const slide = SLIDES[slideIndex] ?? SLIDES[0];

  return (
    <TemplateFrame
      label="Meneer Meter"
      look={slide === "oordeel" ? LOOK.camera : LOOK.rechtsOnder}
      slideCount={SLIDES.length}
      slideIndex={slideIndex}
    >
      {slide === "raad" ? (
        <div className="flex flex-1 flex-col justify-center gap-10">
          <p className="text-[30px] font-semibold opacity-55">{data.siteName}</p>
          <p className="text-[80px] font-extrabold leading-[1.06]">
            Raad de score voordat ik hem laat zien.
          </p>
          <p className="text-[36px] font-medium opacity-60">
            Design, vindbaarheid, conversie, snelheid.
          </p>
        </div>
      ) : null}

      {slide === "scores" ? (
        <div className="flex flex-1 flex-col justify-center gap-10">
          {data.scores.map((s) => (
            <ScoreBar key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      ) : null}

      {slide === "oordeel" ? (
        <div className="flex flex-1 flex-col justify-end pb-6">
          <p className="text-[34px] font-semibold uppercase tracking-[0.2em] opacity-45">
            Eindstand
          </p>
          <p
            className="mt-2 text-[300px] font-black leading-[0.8] tracking-[-0.03em]"
            style={{ color: BRAND_TOKENS.accent }}
          >
            {data.total}
            <span className="text-[96px] opacity-30">/100</span>
          </p>
          <p className="mt-6 text-[64px] font-black uppercase tracking-wide">
            {data.verdict}
          </p>
          <div
            className="mt-8 h-[6px] w-40 rounded-full"
            style={{ background: BRAND_TOKENS.accentBold }}
          />
          <p className="mt-8 text-[44px] font-medium italic leading-[1.24] opacity-80">
            {data.oneLiner}
          </p>
        </div>
      ) : null}
    </TemplateFrame>
  );
}
