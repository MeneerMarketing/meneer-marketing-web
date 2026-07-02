import Link from "next/link";
import type { ReactNode } from "react";

interface LogoProps {
  className?: string;
  /** `light` = footer / donkere achtergronden */
  variant?: "dark" | "light";
  /** Optioneel beeldmerk vóór de wordmark (bijv. InteractiveLogo) */
  icon?: ReactNode;
}

export function Logo({ className, variant = "dark", icon }: LogoProps) {
  const light = variant === "light";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 rounded-lg outline-offset-4 ${className ?? ""}`}
      aria-label="MeneerMarketing. Home"
    >
      {icon}
      <span className="flex flex-wrap items-baseline gap-x-1 font-sans text-[1.05rem] leading-none tracking-tight sm:text-lg">
        <span
          className={`font-semibold ${light ? "text-white" : "text-mm-text"}`}
        >
          Meneer
        </span>
        <span
          className={`font-extrabold ${light ? "text-white" : "text-mm-text"}`}
        >
          Marketing
        </span>
      </span>
    </Link>
  );
}
