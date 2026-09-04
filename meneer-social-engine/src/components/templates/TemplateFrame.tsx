import type { ReactNode } from "react";
import { BRAND_TOKENS } from "@/brand/brand-brain";
import { LOOK, MeneerHead, type EyeLook } from "@/components/brand/MeneerHead";

interface TemplateFrameProps {
  children: ReactNode;
  variant?: "light" | "dark";
  label?: string;
  /** Waar het koppie naar kijkt. Standaard recht in de camera. */
  look?: EyeLook;
  /** Toont voortgangsstreepjes bij carousels. */
  slideCount?: number;
  slideIndex?: number;
}

export function TemplateFrame({
  children,
  variant = "light",
  label,
  look = LOOK.camera,
  slideCount,
  slideIndex = 0,
}: TemplateFrameProps) {
  const isDark = variant === "dark";
  const line = isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)";

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: BRAND_TOKENS.canvasFeed.width,
        height: BRAND_TOKENS.canvasFeed.height,
        fontFamily: BRAND_TOKENS.fontFamily,
        background: isDark ? BRAND_TOKENS.footer : BRAND_TOKENS.bg,
        color: isDark ? "#f8fafc" : BRAND_TOKENS.text,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${line} 2px, transparent 2px),
            linear-gradient(90deg, ${line} 2px, transparent 2px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative z-[1] flex items-center justify-between px-14 pt-14">
        {label ? (
          <span
            className="rounded-full px-6 py-2.5 text-[22px] font-bold uppercase tracking-[0.18em]"
            style={{ background: BRAND_TOKENS.accentBold, color: "#fff" }}
          >
            {label}
          </span>
        ) : (
          <span />
        )}
        {slideCount && slideCount > 1 ? (
          <span className="flex gap-2">
            {Array.from({ length: slideCount }).map((_, i) => (
              <span
                key={i}
                className="h-2 rounded-full transition-none"
                style={{
                  width: i === slideIndex ? 40 : 16,
                  background:
                    i === slideIndex
                      ? BRAND_TOKENS.accentBold
                      : isDark
                        ? "rgba(255,255,255,0.22)"
                        : "rgba(15,23,42,0.16)",
                }}
              />
            ))}
          </span>
        ) : null}
      </div>

      <div className="relative z-[1] flex flex-1 flex-col px-14 py-10">{children}</div>

      <div
        className="relative z-[1] flex items-center gap-5 px-14 py-10"
        style={{
          borderTop: `2px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)"}`,
        }}
      >
        {isDark ? (
          <span
            className="flex items-center justify-center rounded-full"
            style={{
              width: 92,
              height: 92,
              background: BRAND_TOKENS.accentBold,
            }}
          >
            <MeneerHead look={look} size={72} bandColor={BRAND_TOKENS.footer} />
          </span>
        ) : (
          <MeneerHead look={look} size={76} />
        )}
        <div className="flex flex-col">
          <span
            className="text-[26px] font-extrabold leading-tight"
            style={{ color: isDark ? "#fff" : BRAND_TOKENS.text }}
          >
            Meneer Marketing
          </span>
          <span className="text-[20px] opacity-55">meneermarketing.nl</span>
        </div>
      </div>
    </div>
  );
}
