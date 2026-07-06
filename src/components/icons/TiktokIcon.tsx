import Image from "next/image";

interface TiktokIconProps {
  className?: string;
  size?: number;
  /** Wit logo voor donkere achtergronden (video UI). */
  variant?: "default" | "light";
}

/** TikTok-mark (transparante PNG). */
export function TiktokIcon({
  className = "",
  size = 20,
  variant = "default",
}: TiktokIconProps) {
  return (
    <Image
      src={variant === "light" ? "/icons/tiktok-mark-light.png" : "/icons/tiktok-mark.png"}
      alt=""
      width={size}
      height={size}
      className={`bg-transparent object-contain ${className}`}
      unoptimized
    />
  );
}
