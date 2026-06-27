import Link from "next/link";

interface LogoProps {
  className?: string;
  /** `light` = footer / donkere achtergronden */
  variant?: "dark" | "light";
}

export function Logo({ className, variant = "dark" }: LogoProps) {
  const light = variant === "light";

  return (
    <Link
      href="/"
      className={`inline-flex items-center rounded-lg outline-offset-4 ${className ?? ""}`}
      aria-label="MeneerMarketing. Home"
    >
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
