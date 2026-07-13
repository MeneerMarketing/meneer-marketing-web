import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND_DISPLAY } from "@/lib/seo/e-e-a-t";

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
        <span className="sr-only">home</span>
      </span>
    </Link>
  );
}
