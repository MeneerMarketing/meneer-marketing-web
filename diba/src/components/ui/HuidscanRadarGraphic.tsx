/** Figma radar-grafiek — Eve-M huidscan visual rechts in de sectie. */
export default function HuidscanRadarGraphic() {
  const cx = 160;
  const cy = 160;
  const dot = (hour: number, radius: number) => {
    const rad = (hour * 30 * Math.PI) / 180;
    return {
      x: cx + radius * Math.sin(rad),
      y: cy - radius * Math.cos(rad),
    };
  };

  const dot7 = dot(7, 108);
  const dot2 = dot(2, 138);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[300px] md:max-w-[340px] lg:max-w-[360px]"
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={cx}
          cy={cy}
          r="148"
          stroke="var(--diba-mint-bar)"
          strokeWidth="1"
          opacity="0.45"
        />
        <circle
          cx={cx}
          cy={cy}
          r="118"
          stroke="var(--diba-mint-bar)"
          strokeWidth="1"
          opacity="0.6"
        />
        <circle
          cx={cx}
          cy={cy}
          r="88"
          stroke="var(--diba-mint-bar)"
          strokeWidth="1"
          opacity="0.75"
        />
        <circle cx={dot7.x} cy={dot7.y} r="5" fill="var(--diba-mint-bar)" />
        <circle cx={dot2.x} cy={dot2.y} r="5" fill="var(--diba-mint-bar)" />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-[116px] w-[116px] flex-col items-center justify-center rounded-full bg-[var(--diba-mint-bar)] text-center shadow-[0_8px_32px_rgba(0,0,0,0.18)] md:h-[128px] md:w-[128px]">
          <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-[var(--diba-green-900)] md:text-[9px]">
            Eve-M
          </span>
          <span className="mt-[2px] text-[18px] font-semibold leading-none text-[var(--diba-green-900)] [font-family:var(--font-body)] md:text-[20px]">
            Huidscan
          </span>
          <span className="mt-[6px] max-w-[100px] text-[7px] font-semibold uppercase leading-[1.35] tracking-[0.08em] text-[var(--diba-green-700)] md:text-[8px]">
            Objectief · Persoonlijk
          </span>
        </div>
      </div>
    </div>
  );
}
