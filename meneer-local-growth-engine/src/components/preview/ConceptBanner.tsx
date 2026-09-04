import type { StudioData } from "@/types/studio";

interface ConceptBannerProps {
  studio: StudioData;
  tone?: "light" | "dark" | "warm";
}

export function ConceptBanner({ studio, tone = "light" }: ConceptBannerProps) {
  const tones = {
    light: "bg-[#F7F4EF]/90 text-[#3A3530] border-[#E5DFD4]/80",
    dark: "bg-black/70 text-white/80 border-white/10",
    warm: "bg-[#EDE4D8]/90 text-[#4A4038] border-[#D9CBB8]/70",
  };

  return (
    <div
      className={`pointer-events-none fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md ${tones[tone]}`}
      role="note"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2.5 sm:px-6">
        <div className="flex items-center justify-between gap-4 text-[11px] tracking-[0.12em] uppercase">
          <span className="font-medium opacity-90">
            Conceptpreview · {studio.studio_name}
          </span>
          <span className="hidden opacity-70 sm:inline">
            Concept samengesteld door Meneer Marketing
          </span>
          <span className="opacity-70 sm:hidden">Meneer Marketing</span>
        </div>
        <p className="text-[10px] normal-case tracking-normal opacity-65">
          Dit is een vrijblijvend ontwerpvoorstel en niet de huidige website van{" "}
          {studio.studio_name}.
        </p>
      </div>
    </div>
  );
}
