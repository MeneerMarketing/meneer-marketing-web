import { TemplateFrame } from "@/components/templates/TemplateFrame";
import { LOOK } from "@/components/brand/MeneerHead";
import { BRAND_TOKENS } from "@/brand/brand-brain";
import type { CaseBuildData } from "@/services/types";

export interface CaseBuildProps {
  data: CaseBuildData;
  slideIndex?: number;
}

export function CaseBuild({ data }: CaseBuildProps) {
  return (
    <TemplateFrame label="Dit bouwt Meneer" variant="dark" look={LOOK.camera}>
      <div className="flex flex-1 flex-col justify-between py-4">
        <div>
          <p className="text-[26px] font-bold uppercase tracking-[0.22em] opacity-50">
            {data.eyebrow}
          </p>
          <p className="mt-6 text-[72px] font-extrabold leading-[1.06]">{data.title}</p>
          <p
            className="mt-6 text-[40px] font-bold"
            style={{ color: BRAND_TOKENS.accentBold }}
          >
            {data.clientName}
          </p>
        </div>

        <div
          className="rounded-[32px] px-12 py-10"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "2px solid rgba(255,255,255,0.1)",
          }}
        >
          <p className="text-[96px] font-black leading-none">{data.metric}</p>
          <p className="mt-3 text-[30px] opacity-70">{data.metricHint}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-6 py-3 text-[24px] font-semibold"
              style={{ border: "2px solid rgba(255,255,255,0.22)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </TemplateFrame>
  );
}
