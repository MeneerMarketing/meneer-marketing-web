import Image from "next/image";

interface GoogleShoppingIconProps {
  className?: string;
  size?: number;
}

/** Google Shopping-mark (transparante PNG, geen zwarte matte). */
export function GoogleShoppingIcon({
  className = "",
  size = 48,
}: GoogleShoppingIconProps) {
  return (
    <Image
      src="/icons/google-shopping-mark.png"
      alt=""
      width={size}
      height={size}
      className={`bg-transparent object-contain ${className}`}
      unoptimized
    />
  );
}
