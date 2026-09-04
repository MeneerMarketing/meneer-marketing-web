import { TemplateFrame } from "@/components/templates/TemplateFrame";
import { LOOK } from "@/components/brand/MeneerHead";
import { BRAND_TOKENS } from "@/brand/brand-brain";
import type { DeRekeningData } from "@/services/types";

export interface DeRekeningProps {
  data: DeRekeningData;
  slideIndex?: number;
}

const SLIDES = ["bedrag", "probleem", "waarom", "rekensom", "fix", "oordeel"] as const;

export function DeRekening({ data, slideIndex = 0 }: DeRekeningProps) {
  const slide = SLIDES[slideIndex] ?? SLIDES[0];

  const look =
    slide === "bedrag"
      ? LOOK.linksOnder
      : slide === "oordeel"
        ? LOOK.camera
        : slide === "waarom"
          ? LOOK.weg
          : LOOK.rechtsOnder;

  return (
    <TemplateFrame
      label="De rekening"
      look={look}
      slideCount={SLIDES.length}
      slideIndex={slideIndex}
    >
      {slide === "bedrag" ? (
        <div className="flex flex-1 flex-col justify-end pb-6">
          <p className="text-[44px] font-semibold leading-tight opacity-60">
            {data.hook}
          </p>
          <p
            className="mt-2 text-[280px] font-black leading-[0.82] tracking-[-0.03em]"
            style={{ color: BRAND_TOKENS.accent }}
          >
            {data.amount}
          </p>
          <p className="mt-6 text-[60px] font-extrabold">{data.period}</p>
          <div
            className="mt-10 h-[6px] w-40 rounded-full"
            style={{ background: BRAND_TOKENS.accentBold }}
          />
          <p className="mt-8 text-[30px] font-medium opacity-45">
            Swipe voor de rekensom
          </p>
        </div>
      ) : null}

      {slide === "probleem" ? (
        <div className="flex flex-1 flex-col justify-center gap-8">
          <Eyebrow>Wat er gebeurt</Eyebrow>
          <p className="text-[64px] font-extrabold leading-[1.1]">{data.problem}</p>
        </div>
      ) : null}

      {slide === "waarom" ? (
        <div className="flex flex-1 flex-col justify-center gap-8">
          <Eyebrow>Waarom dat geld kost</Eyebrow>
          <p className="text-[52px] font-semibold leading-[1.22]">{data.why}</p>
        </div>
      ) : null}

      {slide === "rekensom" ? (
        <div className="flex flex-1 flex-col justify-center gap-8">
          <Eyebrow>De rekensom</Eyebrow>
          <div className="flex flex-col">
            {data.calculation.map((row, i) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between py-6"
                style={{
                  borderBottom:
                    i === data.calculation.length - 1
                      ? "none"
                      : "2px solid rgba(15,23,42,0.1)",
                }}
              >
                <span className="text-[38px] font-medium opacity-70">{row.label}</span>
                <span className="text-[46px] font-extrabold">{row.value}</span>
              </div>
            ))}
          </div>
          <div
            className="mt-2 flex items-baseline justify-between rounded-3xl px-10 py-8"
            style={{ background: BRAND_TOKENS.accent, color: "#fff" }}
          >
            <span className="text-[38px] font-semibold">Kost je</span>
            <span className="text-[64px] font-black">{data.amount}</span>
          </div>
        </div>
      ) : null}

      {slide === "fix" ? (
        <div className="flex flex-1 flex-col justify-center gap-8">
          <Eyebrow accent>Wat ik zou doen</Eyebrow>
          <p className="text-[56px] font-bold leading-[1.16]">{data.fix}</p>
        </div>
      ) : null}

      {slide === "oordeel" ? (
        <div className="flex flex-1 flex-col justify-center gap-10">
          <p className="text-[54px] font-semibold italic leading-[1.2] opacity-85">
            {data.meneerNote}
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

function Eyebrow({
  children,
  accent = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <p
      className="text-[26px] font-bold uppercase tracking-[0.22em]"
      style={{ color: accent ? BRAND_TOKENS.accent : undefined, opacity: accent ? 1 : 0.45 }}
    >
      {children}
    </p>
  );
}
