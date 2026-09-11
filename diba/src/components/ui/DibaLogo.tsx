import Image from "next/image";
import Link from "next/link";
import { dibaLogoSrc, type DibaLogoVariant } from "@/lib/diba-brand";

type DibaLogoProps = {
  /** dark = lichte achtergrond, white = donkere achtergrond */
  variant?: DibaLogoVariant;
  href?: string;
  className?: string;
  priority?: boolean;
  /**
   * De maat. In de balk bovenaan staat hij naast een menu en een knop, dus daar is klein
   * goed; in de voettekst staat hij alleen in het midden en dan is dezelfde maat te
   * bescheiden (Yasin, 11 september 2026: "het logo mag iets groter in de footer").
   */
  maat?: "normaal" | "groot";
};

const MATEN = {
  normaal: "h-6 max-w-[min(100%,148px)] sm:h-7 sm:max-w-[168px]",
  groot: "h-8 max-w-[min(100%,208px)] sm:h-10 sm:max-w-[248px]",
} as const;

const logoImageClass = "w-auto object-contain object-left";

/** Officieel DiBA CLINICS wordmark (1024×152). */
export default function DibaLogo({
  variant = "dark",
  href,
  className = "",
  priority = false,
  maat = "normaal",
}: DibaLogoProps) {
  const image = (
    <Image
      src={dibaLogoSrc(variant)}
      alt="Diba Clinics"
      width={1024}
      height={152}
      priority={priority}
      className={`${logoImageClass} ${MATEN[maat]} ${className}`}
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
