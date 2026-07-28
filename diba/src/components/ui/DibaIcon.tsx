import Image from "next/image";
import { dibaIconSrc, type DibaLogoVariant } from "@/lib/diba-brand";

type DibaIconProps = {
  /** dark = lichte achtergrond, white = donkere achtergrond */
  variant?: DibaLogoVariant;
  className?: string;
  size?: number;
  priority?: boolean;
};

/** Officieel DC-rond merkicoon (928×928). */
export default function DibaIcon({
  variant = "dark",
  className = "",
  size = 56,
  priority = false,
}: DibaIconProps) {
  return (
    <Image
      src={dibaIconSrc(variant)}
      alt=""
      width={size}
      height={size}
      priority={priority}
      className={`aspect-square shrink-0 object-contain ${className}`}
    />
  );
}
