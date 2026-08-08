import Image from "next/image";
import Link from "next/link";
import { dibaLogoSrc, type DibaLogoVariant } from "@/lib/diba-brand";

type DibaLogoProps = {
  /** dark = lichte achtergrond, white = donkere achtergrond */
  variant?: DibaLogoVariant;
  href?: string;
  className?: string;
  priority?: boolean;
};

const logoImageClass =
  "h-6 w-auto max-w-[min(100%,148px)] object-contain object-left sm:h-7 sm:max-w-[168px]";

/** Officieel DiBA CLINICS wordmark (1024×152). */
export default function DibaLogo({
  variant = "dark",
  href,
  className = "",
  priority = false,
}: DibaLogoProps) {
  const image = (
    <Image
      src={dibaLogoSrc(variant)}
      alt="Diba Clinics"
      width={1024}
      height={152}
      priority={priority}
      className={`${logoImageClass} ${className}`}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex shrink-0 items-center"
        aria-label="Diba Clinics home"
      >
        {image}
      </Link>
    );
  }

  return image;
}
