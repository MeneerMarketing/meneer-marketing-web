type FigmaSoftAccentProps = {
  /** traject = linksboven sectie · clinic = kaart rechtsboven · cta = donkergroen blok */
  variant: "traject" | "clinic" | "cta";
  className?: string;
};

/**
 * Zachte decoratieve accenten in Diba-palet — vervangt het PNG-blad.
 * Alleen CSS: blur-orbs, ringen en DeLijn-puntjes.
 */
export default function FigmaSoftAccent({ variant, className = "" }: FigmaSoftAccentProps) {
  if (variant === "traject") {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -left-24 top-0 h-[280px] w-[280px] sm:-left-32 sm:h-[360px] sm:w-[360px] ${className}`}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_40%,rgba(181,223,157,.55),rgba(203,229,191,.18)_52%,transparent_72%)] blur-2xl" />
        <div className="absolute left-[18%] top-[22%] h-[58%] w-[58%] rounded-full border border-[#b5df9d]/45" />
        <div className="absolute bottom-[12%] right-[8%] h-3 w-3 rounded-full bg-[#5eae67]/70" />
        <span className="absolute left-[42%] top-[62%] block h-[1.5px] w-16 bg-[#dce8d9]/80">
          <span className="absolute right-0 top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-[#286943]/80" />
        </span>
      </div>
    );
  }

  if (variant === "clinic") {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-12 -top-14 h-44 w-44 sm:-right-16 sm:-top-20 sm:h-56 sm:w-56 ${className}`}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.42),transparent_68%)] blur-xl" />
        <div className="absolute inset-[12%] rounded-full border-2 border-white/35" />
        <div className="absolute bottom-[18%] left-[10%] h-2 w-2 rounded-full bg-white/70" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -right-10 -top-16 h-48 w-48 sm:-right-14 sm:-top-24 sm:h-64 sm:w-64 ${className}`}
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_60%_35%,rgba(191,231,172,.28),transparent_70%)] blur-2xl" />
      <div className="absolute inset-[18%] rounded-full border border-[#bfe7ac]/25" />
      <div className="absolute left-[28%] top-[46%] h-[1.5px] w-20 bg-[#bfe7ac]/30">
        <span className="absolute right-0 top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full bg-[#d5ead1]/90" />
      </div>
    </div>
  );
}
