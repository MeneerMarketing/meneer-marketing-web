/** Subtiele MM-gridachtergrond. Alleen oranje grid, geen kleurblobs. */
export type BackdropTone = "sky" | "accent" | "dual" | "violet";

interface ConversionBackdropProps {
  readonly tone?: BackdropTone;
  readonly className?: string;
}

export function ConversionBackdrop({
  className = "",
}: ConversionBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,87,34,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
