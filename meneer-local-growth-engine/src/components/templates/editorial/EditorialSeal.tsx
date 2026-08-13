interface Props {
  ring: string;
  value: string;
  caption?: string | null;
  className?: string;
}

/**
 * Rond zegel met meelopende tekst op de rand. De cirkelomtrek is vast, dus de
 * tekst wordt via textLength precies rondgezet: een korte of lange studionaam
 * vult altijd de hele ring. Alleen echte data (score of oprichtingsjaar).
 */
export function EditorialSeal({ ring, value, caption, className = "" }: Props) {
  const pathId = `ed-seal-${ring.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  const label = `${ring.toUpperCase()}  \u00B7  ${ring.toUpperCase()}  \u00B7`;

  return (
    <div className={`relative aspect-square ${className}`}>
      <div
        aria-hidden
        className="absolute inset-0 rounded-full border border-[var(--ed-line)] bg-[var(--ed-bg-veil)] backdrop-blur-[3px]"
      />
      <svg
        viewBox="0 0 200 200"
        aria-hidden
        focusable="false"
        className="ed-seal-rotate absolute inset-0 h-full w-full text-[var(--ed-accent)]"
      >
        <defs>
          <path
            id={pathId}
            fill="none"
            d="M100 26a74 74 0 1 1 0 148 74 74 0 1 1 0-148"
          />
        </defs>
        <text className="ed-seal-text" fill="currentColor">
          <textPath href={`#${pathId}`} textLength="465" lengthAdjust="spacing">
            {label}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <span className="ed-serif text-[1.85rem] leading-none tracking-tight">
          {value}
        </span>
        {caption ? (
          <span className="ed-label-xs mt-2 text-[var(--ed-fg-52)]">
            {caption}
          </span>
        ) : null}
      </div>
    </div>
  );
}
