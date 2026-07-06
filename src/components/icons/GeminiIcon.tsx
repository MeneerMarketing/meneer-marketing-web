import Image from "next/image";

interface GeminiIconProps {
  className?: string;
  size?: number;
}

/** Officieel Gemini-mark (transparante PNG). */
export function GeminiIcon({ className = "", size = 28 }: GeminiIconProps) {
  return (
    <Image
      src="/icons/gemini-mark.png"
      alt=""
      width={size}
      height={size}
      className={className}
      unoptimized
    />
  );
}
