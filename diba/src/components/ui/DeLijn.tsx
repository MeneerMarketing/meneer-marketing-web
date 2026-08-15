export type DeLijnProps = {
  length?: "kort" | "lang" | "full";
  dot?: "start" | "end" | number;
  className?: string;
};

const widths = { kort: "w-16", lang: "w-40", full: "w-full" };

export default function DeLijn({
  length = "full",
  dot = "end",
  className = "",
}: DeLijnProps) {
  const pct =
    dot === "start" ? 0 : dot === "end" ? 100 : Math.max(0, Math.min(100, dot));

  return (
    <span
      aria-hidden="true"
      className={`relative block h-[1.5px] bg-[var(--g-100)] ${widths[length]} ${className}`}
    >
      <span
        className="absolute top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-[var(--g-700)]"
        style={{
          left: `${pct}%`,
          transform: `translate(-${pct}%, -50%)`,
        }}
      />
    </span>
  );
}
