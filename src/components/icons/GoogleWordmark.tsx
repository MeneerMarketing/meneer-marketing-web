export const GOOGLE_WORDMARK_LETTERS = [
  { char: "G", color: "#4285F4" },
  { char: "o", color: "#EA4335" },
  { char: "o", color: "#FBBC05" },
  { char: "g", color: "#4285F4" },
  { char: "l", color: "#34A853" },
  { char: "e", color: "#EA4335" },
] as const;

interface GoogleWordmarkProps {
  className?: string;
}

/** Google als woord, elke letter in merkkleur. */
export function GoogleWordmark({ className }: GoogleWordmarkProps) {
  return (
    <span className={`whitespace-nowrap ${className ?? ""}`} aria-label="Google">
      {GOOGLE_WORDMARK_LETTERS.map((letter, index) => (
        <span key={`${letter.char}-${index}`} style={{ color: letter.color }}>
          {letter.char}
        </span>
      ))}
    </span>
  );
}
