import Image from "next/image";

interface MetaIconProps {
  className?: string;
  size?: number;
}

/** Officieel Meta-mark (transparante PNG). */
export function MetaIcon({ className = "", size = 20 }: MetaIconProps) {
  return (
    <Image
      src="/icons/meta-mark.png"
      alt=""
      width={size}
      height={size}
      className={className}
      unoptimized
    />
  );
}
