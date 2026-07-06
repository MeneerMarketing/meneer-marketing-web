import Image from "next/image";

interface ChatGptIconProps {
  className?: string;
  size?: number;
  /** Op lichte achtergrond: zwarte app-cirkel zoals het echte icoon. */
  variant?: "default" | "app";
}

/** Officieel ChatGPT-mark (transparante PNG). */
export function ChatGptIcon({
  className = "",
  size = 28,
  variant = "default",
}: ChatGptIconProps) {
  const markSize = variant === "app" ? Math.round(size * 0.58) : size;

  const mark = (
    <Image
      src="/icons/chatgpt-mark.png"
      alt=""
      width={markSize}
      height={markSize}
      className={variant === "app" ? "size-full object-contain" : className}
      unoptimized
    />
  );

  if (variant === "app") {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#0D0D0D] ${className}`}
        style={{ width: size, height: size, padding: Math.round(size * 0.18) }}
        aria-hidden
      >
        {mark}
      </span>
    );
  }

  return mark;
}
