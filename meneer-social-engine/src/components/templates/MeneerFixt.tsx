import { TemplateFrame } from "@/components/templates/TemplateFrame";
import { LOOK } from "@/components/brand/MeneerHead";
import { BRAND_TOKENS } from "@/brand/brand-brain";
import type { MeneerFixtData } from "@/services/types";

export interface MeneerFixtProps {
  data: MeneerFixtData;
  slideIndex?: number;
}

export function MeneerFixt({ data }: MeneerFixtProps) {
  return (
    <TemplateFrame label="Meneer fixt" look={LOOK.rechtsOnder}>
      <div className="flex flex-1 flex-col justify-center gap-10">
        <p className="text-[68px] font-extrabold leading-[1.08]">{data.hook}</p>

        <div className="grid grid-cols-2 gap-6">
          <Panel
            tone="before"
            label="Before"
            text={data.problemLabel}
          />
          <Panel tone="after" label="After" text={data.resultLabel} />
        </div>

        <p
          className="text-center text-[38px] font-bold"
          style={{ color: BRAND_TOKENS.accent }}
        >
          {data.timeLabel}
          {data.clientName ? ` · ${data.clientName}` : ""}
        </p>
      </div>
    </TemplateFrame>
  );
}

function Panel({
  tone,
  label,
  text,
}: {
  tone: "before" | "after";
  label: string;
  text: string;
}) {
  const isBefore = tone === "before";

  return (
    <div
      className="flex h-[420px] flex-col items-center justify-center gap-5 rounded-[28px] p-10 text-center"
      style={{
        background: isBefore ? "#fef2f2" : "#f0fdf4",
        border: `3px ${isBefore ? "dashed #fca5a5" : "solid #86efac"}`,
        color: isBefore ? "#991b1b" : "#166534",
      }}
    >
      <span className="text-[26px] font-black uppercase tracking-[0.2em]">{label}</span>
      <span className="text-[36px] font-semibold leading-[1.2]">{text}</span>
    </div>
  );
}
